function Floaty(options) {
    return new FloatyC(options);
}

class FloatyC {
    constructor(options) {
        this.selector = options.selector;
        this.content = options.content || {
            heading: '',
            description: '',
            buttons: []
        };
        this.eventType = options.on || 'click';
        this.validEventTypes = ['click', 'hover', 'keyup'];
        this.position = options.position || {
            atMouse: {enabled: true, delay: 0},
            X: (trigger, cursor) => null,
            Y: (trigger, cursor) => null
        };

        if (!this.selector) {
            throw new FloatyMissingParameterException('You have to define a selector');
        }

        if (!this.validEventTypes.includes(this.eventType)) {
            throw new FloatyExecutorException('Invalid event type provided, please choose: click, hover or keyup');
        }

        this.init();
    }

    init() {
        const elements = document.querySelectorAll(this.selector);
        elements.forEach((element) => {
            if (this.position.atMouse && this.position.atMouse.enabled) {
                document.addEventListener("mousemove", (event) => this.updateFloatyPosition(event, element));
            }

            if (this.eventType === "hover") {
                element.addEventListener("mouseenter", (event) => this.showFloaty(event, element));
                element.addEventListener("mouseleave", () => this.hideFloaty());
            } else {
                element.addEventListener(this.eventType, (event) => {
                    if (this.eventType === 'keyup') {
                        if (!this.floatyContainer) {
                            this.showFloaty(event, element)
                        }
                    } else {
                        if (!this.floatyContainer) {
                            this.showFloaty(event, element)
                            // Added event listener on document for hiding the floaty on clicking outside the element
                            document.addEventListener('click', (e) => {
                                if (!element.contains(e.target) && !this.floatyContainer.contains(e.target)) {
                                    this.hideFloaty();
                                }
                            }, { once: true });
                        } else {
                            this.hideFloaty();
                        }
                    }
                });
            }
        });
    }

    showFloaty(event, element) {
        const floatyContainer = document.createElement("div");
        floatyContainer.classList.add("floaty-container");
        floatyContainer.classList.add("floaty-hidden"); // Added for animation

        const floatyHeading = document.createElement("h3");
        floatyHeading.textContent = this.content.heading;
        floatyContainer.appendChild(floatyHeading);

        const floatyDescription = document.createElement("p");
        floatyDescription.textContent = this.content.description;
        floatyContainer.appendChild(floatyDescription);

        if (this.content.buttons) {
            this.content.buttons.forEach((buttonOptions) => {
                const floatyButton = document.createElement("button");
                floatyButton.textContent = buttonOptions.text;
                floatyButton.addEventListener("click", () => buttonOptions.callback(this, floatyButton));
                floatyContainer.appendChild(floatyButton);
            });
        }

        document.body.appendChild(floatyContainer);
        this.positionFloaty(event, element, floatyContainer);

        // Added for animation
        setTimeout(() => {
            floatyContainer.classList.remove("floaty-hidden");
        }, 0);

        this.floatyContainer = floatyContainer;
    }

    positionFloaty(event, element, floatyContainer) {
        let x = this.position.X(element, event) || 0;
        let y = this.position.Y(element, event) || 0;

        if (this.position.atMouse && this.position.atMouse.enabled) {
            x += event.clientX;
            y += event.clientY;
        } else {
            const rect = element.getBoundingClientRect();
            x += rect.left;
            y += rect.top;
        }

        // Adjust floaty position to prevent overflow
        const containerRect = floatyContainer.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;

        if (x + containerRect.width > viewportWidth) {
            x = x - containerRect.width - (this.position.atMouse && this.position.atMouse.enabled ? 0 : element.clientWidth);
        }

        if (y + containerRect.height > viewportHeight) {
            y = y - containerRect.height - (this.position.atMouse && this.position.atMouse.enabled ? 0 : element.clientHeight);
        }

        floatyContainer.style.left = `${x}px`;
        floatyContainer.style.top = `${y}px`;
    }

    updateFloatyPosition(event, element) {
        if (!this.floatyContainer) return;

        const initialLeft = parseFloat(this.floatyContainer.style.left) || 0;
        const initialTop = parseFloat(this.floatyContainer.style.top) || 0;

        this.positionFloaty(event, element, this.floatyContainer);

        const targetLeft = parseFloat(this.floatyContainer.style.left) || 0;
        const targetTop = parseFloat(this.floatyContainer.style.top) || 0;

        this.floatyContainer.animate([
            {left: `${initialLeft}px`, top: `${initialTop}px`},
            {left: `${targetLeft}px`, top: `${targetTop}px`}
        ], {
            duration: this.position.atMouse.delay || 0,
            fill: 'forwards'
        });
    }

    hideFloaty() {
        if (this.floatyContainer) {
            this.floatyContainer.classList.add("floaty-hidden"); // Added for animation
            this.floatyContainer.addEventListener("transitionend", () => {
                this.floatyContainer.remove();
                this.floatyContainer = null;
            });
        }
    }
}

class FloatyExecutorException extends Error {
    constructor(message) {
        super(message);
        this.name = "FloatyExecutorException";
    }
}

class FloatyMissingParameterException extends Error {
    constructor(message) {
        super(message);
        this.name = "FloatyMissingParameterException";
    }
}

