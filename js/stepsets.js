if (document.querySelector(".step-set")) {
    document.querySelectorAll(".step-set").forEach(function (step_set) {
        if (step_set.querySelector(".next") && !step_set.querySelector(".previous")) {
            step_set.querySelector(".navigation").style.justifyContent = "flex-end";
        }

        step_set.querySelectorAll(".step").forEach(function (step, index) {
            if (!step.id) {
                step.id = "step-" + ++index;
            }
        });

        if (!step_set.querySelector(".step.active")) {
            step_set.querySelector(".step").classList.add("active");
        }
    });

    let thres = 3;
    setInterval(function () {
        document.querySelectorAll(".step-set").forEach(function (step_set) {
            let minHeight = document.querySelector(".step.active").offsetHeight;
            step_set.style.minHeight = `${minHeight}px`;

            // check if first step is active, without checking ids or classes
            if (
                step_set.querySelector(".step") !==
                step_set.querySelector(".step.active")
            ) {
                if (
                    !isElementVisible(
                        step_set.parentElement !== null ? step_set.parentElement : step_set
                    )
                ) {
                    if (thres > 0) {
                        thres--;
                        return;
                    }

                    step_set.querySelectorAll(".step").forEach(function (step) {
                        step.classList.remove("active", "finished");
                    });

                    step_set.querySelector(".step").classList.add("active");
                    thres = 3;
                } else {
                    thres = 3;
                }
            } else {
                thres = 3;
            }
        });
    }, 100);
}

document.querySelectorAll("[data-previous-step]").forEach((previousBtn) => {
    let step_set =
        document.querySelector(
            ".step-set." + previousBtn.getAttribute("data-step-set")
        ) || previousBtn.closest(".step-set");

    if (
        step_set.querySelector(".step") === step_set.querySelector(".step.active")
    ) {
        previousBtn.classList.add("inactive");
    } else {
        previousBtn.classList.remove("inactive");
    }

    previousBtn.addEventListener("click", function () {
        let active = step_set.querySelector(".step.active");
        let previousAttr = previousBtn.dataset.previousStep;
        let previous =
            previousAttr == null || previousAttr === ""
                ? active.previousElementSibling
                : step_set.querySelector(".step." + previousAttr);

        stepset_set_active(step_set, previous);
    });
});

document.querySelectorAll("[data-next-step]").forEach((nextBtn) => {
    let step_set =
        document.querySelector(
            ".step-set." + nextBtn.getAttribute("data-step-set")
        ) || nextBtn.closest(".step-set");
    if (
        step_set.querySelector(".step:last-child") ===
        step_set.querySelector(".step.active")
    ) {
        nextBtn.classList.add("inactive");
    } else {
        nextBtn.classList.remove("inactive");
    }

    nextBtn.addEventListener("click", function () {
        let active = step_set.querySelector(".step.active");
        let nextAttr = nextBtn.dataset.nextStep;
        let next =
            nextAttr == null || nextAttr === ""
                ? active.nextElementSibling
                : step_set.querySelector(".step." + nextAttr);

        stepset_set_active(step_set, next);
    });
});

document.querySelectorAll("[data-step]").forEach((nextBtn) => {
    let step_set =
        document.querySelector(
            ".step-set." + nextBtn.getAttribute("data-step-set")
        ) || nextBtn.closest(".step-set");

    if (
        step_set.querySelector(".step") === step_set.querySelector(".step.active")
    ) {
        nextBtn.classList.add("inactive");
    } else {
        nextBtn.classList.remove("inactive");
    }

    if (
        step_set.querySelector(".step:last-child") ===
        step_set.querySelector(".step.active")
    ) {
        nextBtn.classList.add("inactive");
    } else {
        nextBtn.classList.remove("inactive");
    }

    nextBtn.addEventListener("click", function () {
        let active = step_set.querySelector(".step.active");
        let nextAttr = nextBtn.dataset.step;
        let next = step_set.querySelector(".step." + nextAttr);

        if (next) {
            stepset_set_active(step_set, next);
        }
    });
});

function isElementVisible(element) {
    // Get the computed style of the element
    const computedStyle = window.getComputedStyle(element);

    // Check the element's opacity and display value
    if (computedStyle.opacity === "0" || computedStyle.display === "none") {
        return false;
    }

    // If the element is the root element, return true
    if (element.parentElement === null) {
        return true;
    }

    // Recursively check the visibility of the element's parent
    return isElementVisible(element.parentElement);
}

function stepset_set_active(stepset, step) {
    if (step == null) return;
    if (step.classList.contains("active")) return;

    let active = stepset.querySelector(".step.active");
    let before =
        step.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_FOLLOWING;

    if (before) {
        // remove class finished from step before "step"
        step.classList.remove("finished");
    } else {
        if (step.classList.contains("finished")) {
            step.classList.remove("finished");
        }
    }

    active.classList.add("finished");

    active.classList.remove("active");
    step.classList.add("active");

    // remove class "finished" from all steps after the active one
    let active_step = step;
    while (active_step.nextElementSibling) {
        active_step = active_step.nextElementSibling;
        if (active_step.classList.contains("finished")) {
            active_step.classList.remove("finished");
        }
    }
}
