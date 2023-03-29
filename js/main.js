function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function addLoading(active = false) {
    if (document.querySelector('.loading-wrapper') == null) {
        const loadingWrapper = document.createElement('div');
        loadingWrapper.classList.add('loading-wrapper');
        if (active) {
            loadingWrapper.classList.add('show');
        }
        loadingWrapper.innerHTML = "<div class='loading-animation-wrapper'><div></div><div></div><div></div></div>";
        document.body.appendChild(loadingWrapper);
    }
}

function isInView(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function isVisibleByPercentage(el, percentage) {
    const rect = el.getBoundingClientRect();
    const visibleWidth = Math.min(rect.width, rect.right);
    const visibleHeight = Math.min(rect.height, rect.bottom);
    const visibleArea = visibleWidth * visibleHeight;
    const totalArea = rect.width * rect.height;
    const visiblePercentage = (visibleArea / totalArea) * 100;

    console.log(el, "is visible by", visiblePercentage, "%");

    return visiblePercentage >= percentage;
}

function hasOverflow(selector) {
    const element = document.querySelector(selector);
    return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
}

const OverflowDirection = Object.freeze({
    LEFT: -2,
    RIGHT: 2,
    TOP: -1,
    BOTTOM: 1,
});

function getOverflowDirections(id) {
    const element = document.getElementById(id);
    const results = [];

    if (element.scrollWidth > element.clientWidth && element.scrollLeft > 0) {
        results.push(OverflowDirection.LEFT);
    }

    if (element.scrollWidth > element.clientWidth && element.scrollLeft + element.clientWidth < element.scrollWidth) {
        results.push(OverflowDirection.RIGHT);
    }

    if (element.scrollHeight > element.clientHeight && element.scrollTop > 0) {
        results.push(OverflowDirection.TOP);
    }

    if (element.scrollHeight > element.clientHeight && element.scrollTop + element.clientHeight < element.scrollHeight) {
        results.push(OverflowDirection.BOTTOM);
    }

    return results;
}

function updateHTMLValidate() {
    let html_status = document.querySelector("#html-status");
    let html_validate = document.querySelector("#html-validate");
    let html_validation_check = document.querySelector("#html-validation-check");
    let validation_content = html_validate.value;

    if (validation_content.length >= 1) {
        html_status.classList = "processing";
        html_status.textContent = "Eingabe erkannt, verarbeite...";

        let valid = checkHTML(validation_content);

        if (valid) {
            html_status.classList = "ok";
            html_status.textContent = "Valide";

            // html_validation_check.classList.add("checked");
            // html_validation_check.querySelector("input").checked = true;
        } else {
            html_status.classList = "not-ok";
            html_status.textContent = "Nicht valide";

            // html_validation_check.classList.remove("checked");
            // html_validation_check.querySelector("input").checked = false;
        }
    } else {
        html_status.classList = "waiting";
        html_status.textContent = "Warte auf Eingabe...";
    }
}

function scrollToElement(el) {
    const rect = el.getBoundingClientRect();
    window.scrollTo({
        left: rect.left,
        top: rect.top,
        behavior: 'smooth'
    });
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function removeLoading() {
    var animation = {opacity: 0};
    $('.loading-wrapper').animate(animation, 'slow', 'swing', function () {
        setTimeout(() => {
            this.remove();
        }, 500);
    });
}

function initSlideIn(selector) {
    $(function () {
        $(selector).css("translateY", "25px");
        $(selector).css("opacity", "0");

        $(selector).waypoint(function () {
            var CSStransforms = anime({
                targets: this.element, translateY: 0, opacity: 1
            });
        }, {
            offset: '100%'
        });
    });
}

function pulse(selector, hex) {
    const element = document.querySelector(selector);
    element.classList.add("pulse-short");

    setTimeout(() => {
        element.classList.remove("pulse-short");
    }, 600);
}

function copyFileText(filePath) {
    $.ajax({
        url: filePath,
        success: (result) => {
            copyTextToClipboard(result);
        }
    });
}

function copyButtonFile(copyButton, filePath) {
    copyFileText(filePath);

    copyButton.classList.add("copied");
    setTimeout(() => {
        copyButton.classList.remove("copied");
    }, 2000);
}

function checkHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.children.length > 0;
}

function reloadClickShows() {
    document.querySelectorAll(".click-show").forEach(clickShow => {
        if (!clickShow.classList.contains("initialized")) {
            if (clickShow.classList.contains("show")) {
                clickShow.querySelector("span").innerHTML = clickShow.dataset.opened || "Schließen";
            } else {
                clickShow.querySelector("span").innerHTML = clickShow.dataset.closed || "Öffnen";
            }

            clickShow.addEventListener("click", () => {
                clickShow.classList.toggle("show");

                if (clickShow.classList.contains("show")) {
                    clickShow.querySelector("span").innerHTML = clickShow.dataset.opened || "Schließen";
                } else {
                    clickShow.querySelector("span").innerHTML = clickShow.dataset.closed || "Öffnen";
                }
            });

            clickShow.classList.add("initialized");
        }
    });
}

$(function () {
    /* Highlight anchor */
    let hash = window.location.hash;

    if (hash) {
        let targetEl = document.querySelector(hash);

        if (targetEl) {
            let height = targetEl.clientHeight * 3.75;
            window.scrollTo(0, (targetEl.offsetTop + (window.innerHeight >= height ? height : (height * 1.1))));
            targetEl.classList.add('is-target');
        }
    }

    document.querySelectorAll('.table table').forEach(table => {
        if (!table.querySelector('tfoot')) {
            const foot = document.createElement('tfoot');
            foot.classList.add('auto-generated');
            let tds = table.querySelector('tr').querySelectorAll('td, th').length;
            foot.innerHTML = "<tr><td colspan='" + tds + "'></td></tr>";
            table.appendChild(foot);
        }
    });

    document.querySelectorAll("input[pattern]").forEach(input => {
        input.addEventListener("keypress", (event) => {
            let txt = String.fromCharCode(event.which);
            let ok = new RegExp(input.pattern).test(txt);

            if (!ok) event.preventDefault();
        });
    });

    if (document.querySelector(".back")) {
        document.querySelector(".back").addEventListener('click', () => {
            history.back();
        });
    }

    reloadClickShows();

    if (document.querySelector(".drag-move")) {
        console.log("drag-move found");

        let velocityTreshold = 10;
        document.querySelectorAll(".drag-move").forEach(dm => {
            ['mousedown', 'touchstart'].forEach(listener => {
                dm.addEventListener(listener, (e) => {
                    dm.setAttribute("data-dragging", "true");
                    dm.setAttribute("data-start-drag-x", e.clientX);
                    dm.setAttribute("data-start-drag-y", e.clientY);
                    dm.setAttribute("data-velocity", "1");
                    dm.setAttribute("data-velocity-treshold", velocityTreshold.toString());
                });
            });
        });

        ['mousemove', 'touchmove'].forEach(listener => {
            if (window.innerWidth >= 768) {
                document.addEventListener(listener, (e) => {
                    if (document.querySelector(".drag-move[data-dragging]")) {
                        let drag = document.querySelector(".drag-move[data-dragging]");
                        let differenceX = e.clientX - drag.dataset.startDragX;
                        let differenceY = e.clientY - drag.dataset.startDragY;

                        drag.scrollLeft -= (differenceX * parseFloat(drag.dataset.velocity));
                        drag.scrollTop -= (differenceY * parseFloat(drag.dataset.velocity));

                        if (drag.dataset.velocityTreshold > 1) {
                            drag.dataset.velocityTreshold = (parseInt(drag.dataset.velocityTreshold) - 1).toString();
                        } else {
                            if (drag.dataset.velocity > .5) {
                                drag.dataset.velocity = (parseFloat(drag.dataset.velocity) - .25).toString();
                            }
                            drag.setAttribute("data-velocity-treshold", velocityTreshold.toString());
                        }
                    }
                });
            }
        });

        ['mouseup', 'touchend'].forEach(listener => {
            document.addEventListener(listener, (e) => {
                let drag = document.querySelector(".drag-move[data-dragging]");
                delete drag.dataset.dragging;
                delete drag.dataset.startDragX;
                delete drag.dataset.startDragY;
                delete drag.dataset.velocity;
            });
        });
    }

    if (document.querySelector(".radio")) {
        document.querySelectorAll(".radio_wrapper").forEach(radio_wrapper => {
            radio_wrapper.querySelectorAll(".radio").forEach(radio => {
                radio.addEventListener('click', () => {
                    radio_wrapper.querySelectorAll(".radio").forEach(r => {
                        r.classList.remove("checked");
                    });

                    radio.classList.add("checked");
                });
            });
        });
    }
});

function downloadPDF(path, filename, data) {
    if (!data) {
        data = {};
    }
    data['url'] = encodeURIComponent(window.location);

    $.ajax({
        url: path,
        method: 'POST',
        data: data,
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var url = window.URL.createObjectURL(new Blob([data]));
            var a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
}

function each(selector, callback = () => {
    console.error(`#each() for '${selector}' is missing a callback function.`);
}, searchFrom = document) {
    const elements = searchFrom.querySelectorAll(selector);
    elements.forEach((el) => {
        callback(el);
    });
}

function join_list(arr, last = 'und') {
    if (!Array.isArray(arr) || arr.length === 0) {
        return '';
    }

    if (arr.length === 1) {
        return arr[0];
    }

    const lastElement = arr.pop();
    return arr.join(', ') + ` ${last} ` + lastElement;
}