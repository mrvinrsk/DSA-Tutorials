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

async function getClipboardText() {
    try {
        const text = await navigator.clipboard.readText();
        console.log('Clipboard text:', text);
        return text;
    } catch (err) {
        console.error('Failed to read clipboard text:', err);
        return '';
    }
}

let area_codes = [
    {
        "code": "Country",
        "ort": "Code:"
    },
    {
        "code": "International",
        "ort": "Call"
    },
    {
        "code": "Trunk",
        "ort": "Prefix:"
    },
    {
        "code": "10",
        "ort": "call-by-call"
    },
    {
        "code": "11",
        "ort": "formerly"
    },
    {
        "code": "12",
        "ort": "innovative"
    },
    {
        "code": "12-12",
        "ort": "Web.de,"
    },
    {
        "code": "12-230",
        "ort": "tesion,"
    },
    {
        "code": "12-3000",
        "ort": "3U"
    },
    {
        "code": "12-3131",
        "ort": "BBA"
    },
    {
        "code": "12-3333",
        "ort": "BBA"
    },
    {
        "code": "12-3456",
        "ort": "CommAssist,"
    },
    {
        "code": "12-12",
        "ort": "Web.de,"
    },
    {
        "code": "12-230",
        "ort": "tesion,"
    },
    {
        "code": "12-3000",
        "ort": "3U"
    },
    {
        "code": "12-3131",
        "ort": "BBA"
    },
    {
        "code": "12-3333",
        "ort": "BBA"
    },
    {
        "code": "12-3456",
        "ort": "CommAssist,"
    },
    {
        "code": "13",
        "ort": "voting"
    },
    {
        "code": "130",
        "ort": "formerly"
    },
    {
        "code": "137",
        "ort": "Massenverkehr"
    },
    {
        "code": "1371",
        "ort": "€0.14"
    },
    {
        "code": "1372",
        "ort": "€0.14"
    },
    {
        "code": "1373",
        "ort": "€0.14"
    },
    {
        "code": "1374",
        "ort": "€0.14"
    },
    {
        "code": "1375",
        "ort": "€0.14"
    },
    {
        "code": "1376",
        "ort": "€0.25"
    },
    {
        "code": "1377",
        "ort": "€1.00"
    },
    {
        "code": "1378",
        "ort": "€0.50"
    },
    {
        "code": "1379",
        "ort": "€0.50"
    },
    {
        "code": "138",
        "ort": "T-VoteCall"
    },
    {
        "code": "130",
        "ort": "formerly"
    },
    {
        "code": "137",
        "ort": "Massenverkehr"
    },
    {
        "code": "1371",
        "ort": "€0.14"
    },
    {
        "code": "1372",
        "ort": "€0.14"
    },
    {
        "code": "1373",
        "ort": "€0.14"
    },
    {
        "code": "1374",
        "ort": "€0.14"
    },
    {
        "code": "1375",
        "ort": "€0.14"
    },
    {
        "code": "1376",
        "ort": "€0.25"
    },
    {
        "code": "1377",
        "ort": "€1.00"
    },
    {
        "code": "1378",
        "ort": "€0.50"
    },
    {
        "code": "1379",
        "ort": "€0.50"
    },
    {
        "code": "138",
        "ort": "T-VoteCall"
    },
    {
        "code": "1371",
        "ort": "€0.14"
    },
    {
        "code": "1372",
        "ort": "€0.14"
    },
    {
        "code": "1373",
        "ort": "€0.14"
    },
    {
        "code": "1374",
        "ort": "€0.14"
    },
    {
        "code": "1375",
        "ort": "€0.14"
    },
    {
        "code": "1376",
        "ort": "€0.25"
    },
    {
        "code": "1377",
        "ort": "€1.00"
    },
    {
        "code": "1378",
        "ort": "€0.50"
    },
    {
        "code": "1379",
        "ort": "€0.50"
    },
    {
        "code": "14",
        "ort": "unassigned"
    },
    {
        "code": "15",
        "ort": "mobile"
    },
    {
        "code": "150",
        "ort": "reserved"
    },
    {
        "code": "151",
        "ort": "T-Mobile"
    },
    {
        "code": "152",
        "ort": "reserved"
    },
    {
        "code": "1520",
        "ort": "Vodafone"
    },
    {
        "code": "1521",
        "ort": "Lycamobile"
    },
    {
        "code": "1522",
        "ort": "Vodafone"
    },
    {
        "code": "1523",
        "ort": "Vodafone"
    },
    {
        "code": "155",
        "ort": "reserved"
    },
    {
        "code": "156",
        "ort": "reserved"
    },
    {
        "code": "157",
        "ort": "reserved"
    },
    {
        "code": "1570",
        "ort": "vistream"
    },
    {
        "code": "1573",
        "ort": "ALDITalk"
    },
    {
        "code": "1577",
        "ort": "E-Plus"
    },
    {
        "code": "1579",
        "ort": "sipgate"
    },
    {
        "code": "159",
        "ort": "reserved"
    },
    {
        "code": "150",
        "ort": "reserved"
    },
    {
        "code": "151",
        "ort": "T-Mobile"
    },
    {
        "code": "152",
        "ort": "reserved"
    },
    {
        "code": "1520",
        "ort": "Vodafone"
    },
    {
        "code": "1521",
        "ort": "Lycamobile"
    },
    {
        "code": "1522",
        "ort": "Vodafone"
    },
    {
        "code": "1523",
        "ort": "Vodafone"
    },
    {
        "code": "155",
        "ort": "reserved"
    },
    {
        "code": "156",
        "ort": "reserved"
    },
    {
        "code": "157",
        "ort": "reserved"
    },
    {
        "code": "1570",
        "ort": "vistream"
    },
    {
        "code": "1573",
        "ort": "ALDITalk"
    },
    {
        "code": "1577",
        "ort": "E-Plus"
    },
    {
        "code": "1579",
        "ort": "sipgate"
    },
    {
        "code": "159",
        "ort": "reserved"
    },
    {
        "code": "1520",
        "ort": "Vodafone"
    },
    {
        "code": "1521",
        "ort": "Lycamobile"
    },
    {
        "code": "1522",
        "ort": "Vodafone"
    },
    {
        "code": "1523",
        "ort": "Vodafone"
    },
    {
        "code": "1570",
        "ort": "vistream"
    },
    {
        "code": "1573",
        "ort": "ALDITalk"
    },
    {
        "code": "1577",
        "ort": "E-Plus"
    },
    {
        "code": "1579",
        "ort": "sipgate"
    },
    {
        "code": "16",
        "ort": "mobile"
    },
    {
        "code": "160",
        "ort": "T-Mobile"
    },
    {
        "code": "161",
        "ort": "formerly"
    },
    {
        "code": "162",
        "ort": "Vodafone"
    },
    {
        "code": "163",
        "ort": "E-Plus"
    },
    {
        "code": "164",
        "ort": "Cityruf"
    },
    {
        "code": "165",
        "ort": "formerly"
    },
    {
        "code": "166",
        "ort": "Telmi"
    },
    {
        "code": "167",
        "ort": "Trunked"
    },
    {
        "code": "1672",
        "ort": "Dolphin"
    },
    {
        "code": "168",
        "ort": "Scall"
    },
    {
        "code": "169",
        "ort": "Cityruf,"
    },
    {
        "code": "160",
        "ort": "T-Mobile"
    },
    {
        "code": "161",
        "ort": "formerly"
    },
    {
        "code": "162",
        "ort": "Vodafone"
    },
    {
        "code": "163",
        "ort": "E-Plus"
    },
    {
        "code": "164",
        "ort": "Cityruf"
    },
    {
        "code": "165",
        "ort": "formerly"
    },
    {
        "code": "166",
        "ort": "Telmi"
    },
    {
        "code": "167",
        "ort": "Trunked"
    },
    {
        "code": "1672",
        "ort": "Dolphin"
    },
    {
        "code": "168",
        "ort": "Scall"
    },
    {
        "code": "169",
        "ort": "Cityruf,"
    },
    {
        "code": "1672",
        "ort": "Dolphin"
    },
    {
        "code": "17",
        "ort": "mobile"
    },
    {
        "code": "170",
        "ort": "T-Mobile"
    },
    {
        "code": "171",
        "ort": "T-Mobile"
    },
    {
        "code": "172",
        "ort": "Vodafone"
    },
    {
        "code": "173",
        "ort": "Vodafone"
    },
    {
        "code": "174",
        "ort": "Vodafone"
    },
    {
        "code": "175",
        "ort": "T-Mobile"
    },
    {
        "code": "176",
        "ort": "O2"
    },
    {
        "code": "177",
        "ort": "E-Plus"
    },
    {
        "code": "178",
        "ort": "E-Plus"
    },
    {
        "code": "179",
        "ort": "O2"
    },
    {
        "code": "170",
        "ort": "T-Mobile"
    },
    {
        "code": "171",
        "ort": "T-Mobile"
    },
    {
        "code": "172",
        "ort": "Vodafone"
    },
    {
        "code": "173",
        "ort": "Vodafone"
    },
    {
        "code": "174",
        "ort": "Vodafone"
    },
    {
        "code": "175",
        "ort": "T-Mobile"
    },
    {
        "code": "176",
        "ort": "O2"
    },
    {
        "code": "177",
        "ort": "E-Plus"
    },
    {
        "code": "178",
        "ort": "E-Plus"
    },
    {
        "code": "179",
        "ort": "O2"
    },
    {
        "code": "18",
        "ort": "international"
    },
    {
        "code": "180",
        "ort": "shared-cost"
    },
    {
        "code": "1801",
        "ort": "€0.039"
    },
    {
        "code": "1802",
        "ort": "€0.06"
    },
    {
        "code": "1803",
        "ort": "€0.09"
    },
    {
        "code": "1804",
        "ort": "€0.20"
    },
    {
        "code": "1805",
        "ort": "€0.14"
    },
    {
        "code": "181",
        "ort": "international"
    },
    {
        "code": "182",
        "ort": "closed"
    },
    {
        "code": "183",
        "ort": "closed"
    },
    {
        "code": "184",
        "ort": "closed"
    },
    {
        "code": "185",
        "ort": "closed"
    },
    {
        "code": "186",
        "ort": "closed"
    },
    {
        "code": "187",
        "ort": "closed"
    },
    {
        "code": "188",
        "ort": "closed"
    },
    {
        "code": "1888",
        "ort": "IVBB"
    },
    {
        "code": "189",
        "ort": "closed"
    },
    {
        "code": "180",
        "ort": "shared-cost"
    },
    {
        "code": "1801",
        "ort": "€0.039"
    },
    {
        "code": "1802",
        "ort": "€0.06"
    },
    {
        "code": "1803",
        "ort": "€0.09"
    },
    {
        "code": "1804",
        "ort": "€0.20"
    },
    {
        "code": "1805",
        "ort": "€0.14"
    },
    {
        "code": "181",
        "ort": "international"
    },
    {
        "code": "182",
        "ort": "closed"
    },
    {
        "code": "183",
        "ort": "closed"
    },
    {
        "code": "184",
        "ort": "closed"
    },
    {
        "code": "185",
        "ort": "closed"
    },
    {
        "code": "186",
        "ort": "closed"
    },
    {
        "code": "187",
        "ort": "closed"
    },
    {
        "code": "188",
        "ort": "closed"
    },
    {
        "code": "1888",
        "ort": "IVBB"
    },
    {
        "code": "189",
        "ort": "closed"
    },
    {
        "code": "1801",
        "ort": "€0.039"
    },
    {
        "code": "1802",
        "ort": "€0.06"
    },
    {
        "code": "1803",
        "ort": "€0.09"
    },
    {
        "code": "1804",
        "ort": "€0.20"
    },
    {
        "code": "1805",
        "ort": "€0.14"
    },
    {
        "code": "190",
        "ort": "formerly"
    },
    {
        "code": "191",
        "ort": "online"
    },
    {
        "code": "192",
        "ort": "online"
    },
    {
        "code": "193",
        "ort": "online"
    },
    {
        "code": "194",
        "ort": "online"
    },
    {
        "code": "1987",
        "ort": "Routing"
    },
    {
        "code": "1988",
        "ort": "target"
    },
    {
        "code": "1989",
        "ort": "routing"
    },
    {
        "code": "199",
        "ort": "network-internal"
    },
    {
        "code": "201",
        "ort": "Essen"
    },
    {
        "code": "202",
        "ort": "Wuppertal"
    },
    {
        "code": "203",
        "ort": "Duisburg"
    },
    {
        "code": "204\n2041",
        "ort": "Bottrop\n2043"
    },
    {
        "code": "2041",
        "ort": "Bottrop"
    },
    {
        "code": "2043",
        "ort": "Gladbeck"
    },
    {
        "code": "2045",
        "ort": "Bottrop-Kirchhellen"
    },
    {
        "code": "205\n2051",
        "ort": "Velbert\n2052"
    },
    {
        "code": "2051",
        "ort": "Velbert"
    },
    {
        "code": "2052",
        "ort": "Velbert-Langenberg"
    },
    {
        "code": "2053",
        "ort": "Velbert-Neviges"
    },
    {
        "code": "2054",
        "ort": "Essen-Kettwig,"
    },
    {
        "code": "2056",
        "ort": "Heiligenhaus"
    },
    {
        "code": "2058",
        "ort": "Wülfrath"
    },
    {
        "code": "206\n2064",
        "ort": "Dinslaken\n2065"
    },
    {
        "code": "2064",
        "ort": "Dinslaken"
    },
    {
        "code": "2065",
        "ort": "Duisburg-Rheinhausen"
    },
    {
        "code": "2066",
        "ort": "Duisburg-Homberg"
    },
    {
        "code": "208",
        "ort": "Mülheim"
    },
    {
        "code": "209",
        "ort": "Gelsenkirchen"
    },
    {
        "code": "2041",
        "ort": "Bottrop"
    },
    {
        "code": "2043",
        "ort": "Gladbeck"
    },
    {
        "code": "2045",
        "ort": "Bottrop-Kirchhellen"
    },
    {
        "code": "2051",
        "ort": "Velbert"
    },
    {
        "code": "2052",
        "ort": "Velbert-Langenberg"
    },
    {
        "code": "2053",
        "ort": "Velbert-Neviges"
    },
    {
        "code": "2054",
        "ort": "Essen-Kettwig,"
    },
    {
        "code": "2056",
        "ort": "Heiligenhaus"
    },
    {
        "code": "2058",
        "ort": "Wülfrath"
    },
    {
        "code": "2064",
        "ort": "Dinslaken"
    },
    {
        "code": "2065",
        "ort": "Duisburg-Rheinhausen"
    },
    {
        "code": "2066",
        "ort": "Duisburg-Homberg"
    },
    {
        "code": "210\n2101",
        "ort": "formerly"
    },
    {
        "code": "2101",
        "ort": "formerly"
    },
    {
        "code": "2102",
        "ort": "Ratingen"
    },
    {
        "code": "2104",
        "ort": "Mettmann"
    },
    {
        "code": "211",
        "ort": "Düsseldorf"
    },
    {
        "code": "212",
        "ort": "Solingen\n2129"
    },
    {
        "code": "2129",
        "ort": "Haan"
    },
    {
        "code": "213\n2131",
        "ort": "Neuss,"
    },
    {
        "code": "2131",
        "ort": "Neuss,"
    },
    {
        "code": "2132",
        "ort": "Meerbusch-Büderich"
    },
    {
        "code": "2133",
        "ort": "Dormagen"
    },
    {
        "code": "2137",
        "ort": "Neuss-Norf"
    },
    {
        "code": "214",
        "ort": "Leverkusen"
    },
    {
        "code": "215\n2150",
        "ort": "Meerbusch-Lank-Latum\n2151"
    },
    {
        "code": "2150",
        "ort": "Meerbusch-Lank-Latum"
    },
    {
        "code": "2151",
        "ort": "Krefeld"
    },
    {
        "code": "2152",
        "ort": "Kempen"
    },
    {
        "code": "2153",
        "ort": "Nettetal-Lobberich"
    },
    {
        "code": "2154",
        "ort": "Willich"
    },
    {
        "code": "2156",
        "ort": "Willich-Anrath"
    },
    {
        "code": "2157",
        "ort": "Nettetal-Kaldenkirchen/Brüggen"
    },
    {
        "code": "2158",
        "ort": "Grefrath/Nettetal"
    },
    {
        "code": "2159",
        "ort": "Meerbusch-Osterath"
    },
    {
        "code": "216\n2161",
        "ort": "Mönchengladbach\n2162"
    },
    {
        "code": "2161",
        "ort": "Mönchengladbach"
    },
    {
        "code": "2162",
        "ort": "Viersen"
    },
    {
        "code": "2163",
        "ort": "Schwalmtal"
    },
    {
        "code": "2164",
        "ort": "Jüchen-Otzenrath"
    },
    {
        "code": "2165",
        "ort": "Jüchen"
    },
    {
        "code": "2166",
        "ort": "Rheydt"
    },
    {
        "code": "217\n2171",
        "ort": "Leverkusen-Opladen\n2173"
    },
    {
        "code": "2171",
        "ort": "Leverkusen-Opladen"
    },
    {
        "code": "2173",
        "ort": "Langenfeld"
    },
    {
        "code": "2174",
        "ort": "Burscheid"
    },
    {
        "code": "2175",
        "ort": "Leichlingen"
    },
    {
        "code": "218\n2181",
        "ort": "Grevenbroich\n2182"
    },
    {
        "code": "2181",
        "ort": "Grevenbroich"
    },
    {
        "code": "2182",
        "ort": "Grevenbroich-Kapellen"
    },
    {
        "code": "2183",
        "ort": "Rommerskirchen"
    },
    {
        "code": "219\n2191",
        "ort": "Remscheid\n2192"
    },
    {
        "code": "2191",
        "ort": "Remscheid"
    },
    {
        "code": "2192",
        "ort": "Hückeswagen"
    },
    {
        "code": "2193",
        "ort": "Wermelskirchen-Dabringhausen"
    },
    {
        "code": "2195",
        "ort": "Radevormwald"
    },
    {
        "code": "2196",
        "ort": "Wermelskirchen"
    },
    {
        "code": "2101",
        "ort": "formerly"
    },
    {
        "code": "2102",
        "ort": "Ratingen"
    },
    {
        "code": "2104",
        "ort": "Mettmann"
    },
    {
        "code": "2129",
        "ort": "Haan"
    },
    {
        "code": "2131",
        "ort": "Neuss,"
    },
    {
        "code": "2132",
        "ort": "Meerbusch-Büderich"
    },
    {
        "code": "2133",
        "ort": "Dormagen"
    },
    {
        "code": "2137",
        "ort": "Neuss-Norf"
    },
    {
        "code": "2150",
        "ort": "Meerbusch-Lank-Latum"
    },
    {
        "code": "2151",
        "ort": "Krefeld"
    },
    {
        "code": "2152",
        "ort": "Kempen"
    },
    {
        "code": "2153",
        "ort": "Nettetal-Lobberich"
    },
    {
        "code": "2154",
        "ort": "Willich"
    },
    {
        "code": "2156",
        "ort": "Willich-Anrath"
    },
    {
        "code": "2157",
        "ort": "Nettetal-Kaldenkirchen/Brüggen"
    },
    {
        "code": "2158",
        "ort": "Grefrath/Nettetal"
    },
    {
        "code": "2159",
        "ort": "Meerbusch-Osterath"
    },
    {
        "code": "2161",
        "ort": "Mönchengladbach"
    },
    {
        "code": "2162",
        "ort": "Viersen"
    },
    {
        "code": "2163",
        "ort": "Schwalmtal"
    },
    {
        "code": "2164",
        "ort": "Jüchen-Otzenrath"
    },
    {
        "code": "2165",
        "ort": "Jüchen"
    },
    {
        "code": "2166",
        "ort": "Rheydt"
    },
    {
        "code": "2171",
        "ort": "Leverkusen-Opladen"
    },
    {
        "code": "2173",
        "ort": "Langenfeld"
    },
    {
        "code": "2174",
        "ort": "Burscheid"
    },
    {
        "code": "2175",
        "ort": "Leichlingen"
    },
    {
        "code": "2181",
        "ort": "Grevenbroich"
    },
    {
        "code": "2182",
        "ort": "Grevenbroich-Kapellen"
    },
    {
        "code": "2183",
        "ort": "Rommerskirchen"
    },
    {
        "code": "2191",
        "ort": "Remscheid"
    },
    {
        "code": "2192",
        "ort": "Hückeswagen"
    },
    {
        "code": "2193",
        "ort": "Wermelskirchen-Dabringhausen"
    },
    {
        "code": "2195",
        "ort": "Radevormwald"
    },
    {
        "code": "2196",
        "ort": "Wermelskirchen"
    },
    {
        "code": "220\n2202",
        "ort": "Bergisch"
    },
    {
        "code": "2202",
        "ort": "Bergisch"
    },
    {
        "code": "2203",
        "ort": "Köln-Porz"
    },
    {
        "code": "2204",
        "ort": "Bergisch"
    },
    {
        "code": "2205",
        "ort": "Rösrath"
    },
    {
        "code": "2206",
        "ort": "Overath;"
    },
    {
        "code": "2207",
        "ort": "Dürscheid;"
    },
    {
        "code": "2208",
        "ort": "Niederkassel"
    },
    {
        "code": "221",
        "ort": "Köln"
    },
    {
        "code": "222\n2222",
        "ort": "Bornheim,"
    },
    {
        "code": "2222",
        "ort": "Bornheim,"
    },
    {
        "code": "2223",
        "ort": "Königswinter"
    },
    {
        "code": "2224",
        "ort": "Bad"
    },
    {
        "code": "2225",
        "ort": "Meckenheim"
    },
    {
        "code": "2226",
        "ort": "Rheinbach"
    },
    {
        "code": "2227",
        "ort": "Merten,"
    },
    {
        "code": "2228",
        "ort": "Rolandseck"
    },
    {
        "code": "223\n2232",
        "ort": "Brühl"
    },
    {
        "code": "2232",
        "ort": "Brühl"
    },
    {
        "code": "2233",
        "ort": "Hürth"
    },
    {
        "code": "2234",
        "ort": "Frechen;"
    },
    {
        "code": "2235",
        "ort": "Erftstadt"
    },
    {
        "code": "2236",
        "ort": "Wesseling"
    },
    {
        "code": "2237",
        "ort": "Kerpen"
    },
    {
        "code": "2238",
        "ort": "Pulheim"
    },
    {
        "code": "224\n2241",
        "ort": "Siegburg/Sankt"
    },
    {
        "code": "2241",
        "ort": "Siegburg/Sankt"
    },
    {
        "code": "2242",
        "ort": "Hennef"
    },
    {
        "code": "2243",
        "ort": "Eitorf"
    },
    {
        "code": "2244",
        "ort": "Oberpleis"
    },
    {
        "code": "2245",
        "ort": "Much"
    },
    {
        "code": "2246",
        "ort": "Lohmar"
    },
    {
        "code": "2247",
        "ort": "Neunkirchen-Seelscheid"
    },
    {
        "code": "2248",
        "ort": "Uckerath"
    },
    {
        "code": "225\n2251",
        "ort": "Euskirchen\n2252"
    },
    {
        "code": "2251",
        "ort": "Euskirchen"
    },
    {
        "code": "2252",
        "ort": "Zülpich"
    },
    {
        "code": "2253",
        "ort": "Bad"
    },
    {
        "code": "2254",
        "ort": "Weilerswist"
    },
    {
        "code": "2255",
        "ort": "Euskirchen-Flamersheim"
    },
    {
        "code": "2256",
        "ort": "Mechernich-Satzvey"
    },
    {
        "code": "2257",
        "ort": "Reckerscheid"
    },
    {
        "code": "226\n2261",
        "ort": "Gummersbach\n2262"
    },
    {
        "code": "2261",
        "ort": "Gummersbach"
    },
    {
        "code": "2262",
        "ort": "Wiehl"
    },
    {
        "code": "2263",
        "ort": "Engelskirchen"
    },
    {
        "code": "2264",
        "ort": "Marienheide"
    },
    {
        "code": "2265",
        "ort": "Eckenhagen"
    },
    {
        "code": "2266",
        "ort": "Lindlar"
    },
    {
        "code": "2267",
        "ort": "Wipperfürth"
    },
    {
        "code": "2268",
        "ort": "Kürten"
    },
    {
        "code": "2269",
        "ort": "Rönsahl"
    },
    {
        "code": "227\n2271",
        "ort": "Bergheim\n2272"
    },
    {
        "code": "2271",
        "ort": "Bergheim"
    },
    {
        "code": "2272",
        "ort": "Bedburg"
    },
    {
        "code": "2273",
        "ort": "Kerpen-Horrem"
    },
    {
        "code": "2274",
        "ort": "Elsdorf"
    },
    {
        "code": "2275",
        "ort": "Kerpen-Buir"
    },
    {
        "code": "228",
        "ort": "Bonn;"
    },
    {
        "code": "229\n2291",
        "ort": "Waldbröl\n2292"
    },
    {
        "code": "2291",
        "ort": "Waldbröl"
    },
    {
        "code": "2292",
        "ort": "Windeck"
    },
    {
        "code": "2293",
        "ort": "Nümbrecht"
    },
    {
        "code": "2294",
        "ort": "Morsbach"
    },
    {
        "code": "2295",
        "ort": "Ruppichteroth"
    },
    {
        "code": "2296",
        "ort": "Brüchermühle"
    },
    {
        "code": "2297",
        "ort": "Wildbergerhütte"
    },
    {
        "code": "2202",
        "ort": "Bergisch"
    },
    {
        "code": "2203",
        "ort": "Köln-Porz"
    },
    {
        "code": "2204",
        "ort": "Bergisch"
    },
    {
        "code": "2205",
        "ort": "Rösrath"
    },
    {
        "code": "2206",
        "ort": "Overath;"
    },
    {
        "code": "2207",
        "ort": "Dürscheid;"
    },
    {
        "code": "2208",
        "ort": "Niederkassel"
    },
    {
        "code": "2222",
        "ort": "Bornheim,"
    },
    {
        "code": "2223",
        "ort": "Königswinter"
    },
    {
        "code": "2224",
        "ort": "Bad"
    },
    {
        "code": "2225",
        "ort": "Meckenheim"
    },
    {
        "code": "2226",
        "ort": "Rheinbach"
    },
    {
        "code": "2227",
        "ort": "Merten,"
    },
    {
        "code": "2228",
        "ort": "Rolandseck"
    },
    {
        "code": "2232",
        "ort": "Brühl"
    },
    {
        "code": "2233",
        "ort": "Hürth"
    },
    {
        "code": "2234",
        "ort": "Frechen;"
    },
    {
        "code": "2235",
        "ort": "Erftstadt"
    },
    {
        "code": "2236",
        "ort": "Wesseling"
    },
    {
        "code": "2237",
        "ort": "Kerpen"
    },
    {
        "code": "2238",
        "ort": "Pulheim"
    },
    {
        "code": "2241",
        "ort": "Siegburg/Sankt"
    },
    {
        "code": "2242",
        "ort": "Hennef"
    },
    {
        "code": "2243",
        "ort": "Eitorf"
    },
    {
        "code": "2244",
        "ort": "Oberpleis"
    },
    {
        "code": "2245",
        "ort": "Much"
    },
    {
        "code": "2246",
        "ort": "Lohmar"
    },
    {
        "code": "2247",
        "ort": "Neunkirchen-Seelscheid"
    },
    {
        "code": "2248",
        "ort": "Uckerath"
    },
    {
        "code": "2251",
        "ort": "Euskirchen"
    },
    {
        "code": "2252",
        "ort": "Zülpich"
    },
    {
        "code": "2253",
        "ort": "Bad"
    },
    {
        "code": "2254",
        "ort": "Weilerswist"
    },
    {
        "code": "2255",
        "ort": "Euskirchen-Flamersheim"
    },
    {
        "code": "2256",
        "ort": "Mechernich-Satzvey"
    },
    {
        "code": "2257",
        "ort": "Reckerscheid"
    },
    {
        "code": "2261",
        "ort": "Gummersbach"
    },
    {
        "code": "2262",
        "ort": "Wiehl"
    },
    {
        "code": "2263",
        "ort": "Engelskirchen"
    },
    {
        "code": "2264",
        "ort": "Marienheide"
    },
    {
        "code": "2265",
        "ort": "Eckenhagen"
    },
    {
        "code": "2266",
        "ort": "Lindlar"
    },
    {
        "code": "2267",
        "ort": "Wipperfürth"
    },
    {
        "code": "2268",
        "ort": "Kürten"
    },
    {
        "code": "2269",
        "ort": "Rönsahl"
    },
    {
        "code": "2271",
        "ort": "Bergheim"
    },
    {
        "code": "2272",
        "ort": "Bedburg"
    },
    {
        "code": "2273",
        "ort": "Kerpen-Horrem"
    },
    {
        "code": "2274",
        "ort": "Elsdorf"
    },
    {
        "code": "2275",
        "ort": "Kerpen-Buir"
    },
    {
        "code": "2291",
        "ort": "Waldbröl"
    },
    {
        "code": "2292",
        "ort": "Windeck"
    },
    {
        "code": "2293",
        "ort": "Nümbrecht"
    },
    {
        "code": "2294",
        "ort": "Morsbach"
    },
    {
        "code": "2295",
        "ort": "Ruppichteroth"
    },
    {
        "code": "2296",
        "ort": "Brüchermühle"
    },
    {
        "code": "2297",
        "ort": "Wildbergerhütte"
    },
    {
        "code": "230\n2301",
        "ort": "Holzwickede\n2302"
    },
    {
        "code": "2301",
        "ort": "Holzwickede"
    },
    {
        "code": "2302",
        "ort": "Witten"
    },
    {
        "code": "2303",
        "ort": "Unna"
    },
    {
        "code": "2304",
        "ort": "Schwerte"
    },
    {
        "code": "2305",
        "ort": "Castrop-Rauxel"
    },
    {
        "code": "2306",
        "ort": "Lünen"
    },
    {
        "code": "2307",
        "ort": "Kamen/Bergkamen"
    },
    {
        "code": "2308",
        "ort": "Unna-Hemmerde"
    },
    {
        "code": "2309",
        "ort": "Waltrop"
    },
    {
        "code": "231",
        "ort": "Dortmund/Lünen-Brambauer"
    },
    {
        "code": "232\n2323",
        "ort": "Herne\n2324"
    },
    {
        "code": "2323",
        "ort": "Herne"
    },
    {
        "code": "2324",
        "ort": "Hattingen"
    },
    {
        "code": "2325",
        "ort": "Herne-Wanne-Eickel"
    },
    {
        "code": "2327",
        "ort": "Bochum-Wattenscheid"
    },
    {
        "code": "233\n2330",
        "ort": "Herdecke\n2331"
    },
    {
        "code": "2330",
        "ort": "Herdecke"
    },
    {
        "code": "2331",
        "ort": "Hagen"
    },
    {
        "code": "2332",
        "ort": "Gevelsberg"
    },
    {
        "code": "2333",
        "ort": "Ennepetal"
    },
    {
        "code": "2334",
        "ort": "Hagen-Hohenlimburg"
    },
    {
        "code": "2335",
        "ort": "Wetter"
    },
    {
        "code": "2336",
        "ort": "Schwelm"
    },
    {
        "code": "2337",
        "ort": "Hagen-Dahl"
    },
    {
        "code": "2338",
        "ort": "Breckerfeld"
    },
    {
        "code": "2339",
        "ort": "Sprockhövel"
    },
    {
        "code": "234",
        "ort": "Bochum"
    },
    {
        "code": "235\n2350",
        "ort": "(no"
    },
    {
        "code": "2350",
        "ort": "(no"
    },
    {
        "code": "2351",
        "ort": "Lüdenscheid"
    },
    {
        "code": "2352",
        "ort": "Altena"
    },
    {
        "code": "2353",
        "ort": "Halver"
    },
    {
        "code": "2354",
        "ort": "Meinerzhagen"
    },
    {
        "code": "2355",
        "ort": "Schalksmühle"
    },
    {
        "code": "2357",
        "ort": "Herscheid"
    },
    {
        "code": "2358",
        "ort": "Valbert"
    },
    {
        "code": "2359",
        "ort": "Kierspe"
    },
    {
        "code": "236\n2360",
        "ort": "Lippramsdorf\n2361"
    },
    {
        "code": "2360",
        "ort": "Lippramsdorf"
    },
    {
        "code": "2361",
        "ort": "Recklinghausen"
    },
    {
        "code": "2362",
        "ort": "Dorsten"
    },
    {
        "code": "2363",
        "ort": "Datteln"
    },
    {
        "code": "2364",
        "ort": "Haltern"
    },
    {
        "code": "2365",
        "ort": "Marl"
    },
    {
        "code": "2366",
        "ort": "Herten/Rhade"
    },
    {
        "code": "2367",
        "ort": "Castrop-Rauxel-Henrichenburg"
    },
    {
        "code": "2368",
        "ort": "Oer-Erkenschwick"
    },
    {
        "code": "2369",
        "ort": "Dorsten-Wulfen/Dorsten-Lembeck"
    },
    {
        "code": "237\n2371",
        "ort": "Iserlohn\n2372"
    },
    {
        "code": "2371",
        "ort": "Iserlohn"
    },
    {
        "code": "2372",
        "ort": "Hemer"
    },
    {
        "code": "2373",
        "ort": "Menden/Fröndenberg"
    },
    {
        "code": "2374",
        "ort": "Iserlohn-Letmathe"
    },
    {
        "code": "2375",
        "ort": "Balve"
    },
    {
        "code": "2377",
        "ort": "Wickede"
    },
    {
        "code": "2378",
        "ort": "Fröndenberg-Langschede"
    },
    {
        "code": "2379",
        "ort": "Menden-Asbeck"
    },
    {
        "code": "238\n2381",
        "ort": "Hamm\n2382"
    },
    {
        "code": "2381",
        "ort": "Hamm"
    },
    {
        "code": "2382",
        "ort": "Ahlen"
    },
    {
        "code": "2383",
        "ort": "Bönen"
    },
    {
        "code": "2384",
        "ort": "Welver"
    },
    {
        "code": "2385",
        "ort": "Hamm-Rhynern"
    },
    {
        "code": "2387",
        "ort": "Walstedde"
    },
    {
        "code": "2388",
        "ort": "Hamm-Uentrop"
    },
    {
        "code": "2389",
        "ort": "Werne"
    },
    {
        "code": "239\n2391",
        "ort": "Plettenberg\n2392"
    },
    {
        "code": "2391",
        "ort": "Plettenberg"
    },
    {
        "code": "2392",
        "ort": "Werdohl/Neuenrade"
    },
    {
        "code": "2393",
        "ort": "Allendorf"
    },
    {
        "code": "2394",
        "ort": "Neuenrade-Affeln"
    },
    {
        "code": "2395",
        "ort": "Rönkhausen"
    },
    {
        "code": "2301",
        "ort": "Holzwickede"
    },
    {
        "code": "2302",
        "ort": "Witten"
    },
    {
        "code": "2303",
        "ort": "Unna"
    },
    {
        "code": "2304",
        "ort": "Schwerte"
    },
    {
        "code": "2305",
        "ort": "Castrop-Rauxel"
    },
    {
        "code": "2306",
        "ort": "Lünen"
    },
    {
        "code": "2307",
        "ort": "Kamen/Bergkamen"
    },
    {
        "code": "2308",
        "ort": "Unna-Hemmerde"
    },
    {
        "code": "2309",
        "ort": "Waltrop"
    },
    {
        "code": "2323",
        "ort": "Herne"
    },
    {
        "code": "2324",
        "ort": "Hattingen"
    },
    {
        "code": "2325",
        "ort": "Herne-Wanne-Eickel"
    },
    {
        "code": "2327",
        "ort": "Bochum-Wattenscheid"
    },
    {
        "code": "2330",
        "ort": "Herdecke"
    },
    {
        "code": "2331",
        "ort": "Hagen"
    },
    {
        "code": "2332",
        "ort": "Gevelsberg"
    },
    {
        "code": "2333",
        "ort": "Ennepetal"
    },
    {
        "code": "2334",
        "ort": "Hagen-Hohenlimburg"
    },
    {
        "code": "2335",
        "ort": "Wetter"
    },
    {
        "code": "2336",
        "ort": "Schwelm"
    },
    {
        "code": "2337",
        "ort": "Hagen-Dahl"
    },
    {
        "code": "2338",
        "ort": "Breckerfeld"
    },
    {
        "code": "2339",
        "ort": "Sprockhövel"
    },
    {
        "code": "2350",
        "ort": "(no"
    },
    {
        "code": "2351",
        "ort": "Lüdenscheid"
    },
    {
        "code": "2352",
        "ort": "Altena"
    },
    {
        "code": "2353",
        "ort": "Halver"
    },
    {
        "code": "2354",
        "ort": "Meinerzhagen"
    },
    {
        "code": "2355",
        "ort": "Schalksmühle"
    },
    {
        "code": "2357",
        "ort": "Herscheid"
    },
    {
        "code": "2358",
        "ort": "Valbert"
    },
    {
        "code": "2359",
        "ort": "Kierspe"
    },
    {
        "code": "2360",
        "ort": "Lippramsdorf"
    },
    {
        "code": "2361",
        "ort": "Recklinghausen"
    },
    {
        "code": "2362",
        "ort": "Dorsten"
    },
    {
        "code": "2363",
        "ort": "Datteln"
    },
    {
        "code": "2364",
        "ort": "Haltern"
    },
    {
        "code": "2365",
        "ort": "Marl"
    },
    {
        "code": "2366",
        "ort": "Herten/Rhade"
    },
    {
        "code": "2367",
        "ort": "Castrop-Rauxel-Henrichenburg"
    },
    {
        "code": "2368",
        "ort": "Oer-Erkenschwick"
    },
    {
        "code": "2369",
        "ort": "Dorsten-Wulfen/Dorsten-Lembeck"
    },
    {
        "code": "2371",
        "ort": "Iserlohn"
    },
    {
        "code": "2372",
        "ort": "Hemer"
    },
    {
        "code": "2373",
        "ort": "Menden/Fröndenberg"
    },
    {
        "code": "2374",
        "ort": "Iserlohn-Letmathe"
    },
    {
        "code": "2375",
        "ort": "Balve"
    },
    {
        "code": "2377",
        "ort": "Wickede"
    },
    {
        "code": "2378",
        "ort": "Fröndenberg-Langschede"
    },
    {
        "code": "2379",
        "ort": "Menden-Asbeck"
    },
    {
        "code": "2381",
        "ort": "Hamm"
    },
    {
        "code": "2382",
        "ort": "Ahlen"
    },
    {
        "code": "2383",
        "ort": "Bönen"
    },
    {
        "code": "2384",
        "ort": "Welver"
    },
    {
        "code": "2385",
        "ort": "Hamm-Rhynern"
    },
    {
        "code": "2387",
        "ort": "Walstedde"
    },
    {
        "code": "2388",
        "ort": "Hamm-Uentrop"
    },
    {
        "code": "2389",
        "ort": "Werne"
    },
    {
        "code": "2391",
        "ort": "Plettenberg"
    },
    {
        "code": "2392",
        "ort": "Werdohl/Neuenrade"
    },
    {
        "code": "2393",
        "ort": "Allendorf"
    },
    {
        "code": "2394",
        "ort": "Neuenrade-Affeln"
    },
    {
        "code": "2395",
        "ort": "Rönkhausen"
    },
    {
        "code": "240\n2401",
        "ort": "Baesweiler\n2402"
    },
    {
        "code": "2401",
        "ort": "Baesweiler"
    },
    {
        "code": "2402",
        "ort": "Stolberg"
    },
    {
        "code": "2403",
        "ort": "Eschweiler"
    },
    {
        "code": "2404",
        "ort": "Alsdorf"
    },
    {
        "code": "2405",
        "ort": "Würselen"
    },
    {
        "code": "2406",
        "ort": "Herzogenrath"
    },
    {
        "code": "2407",
        "ort": "Herzogenrath-Kohlscheid"
    },
    {
        "code": "2408",
        "ort": "Aachen-Kornelimünster"
    },
    {
        "code": "2409",
        "ort": "Gressenich"
    },
    {
        "code": "241",
        "ort": "Aachen"
    },
    {
        "code": "242\n2421",
        "ort": "Düren\n2422"
    },
    {
        "code": "2421",
        "ort": "Düren"
    },
    {
        "code": "2422",
        "ort": "Kreuzau"
    },
    {
        "code": "2423",
        "ort": "Langerwehe"
    },
    {
        "code": "2424",
        "ort": "Vettweiß"
    },
    {
        "code": "2425",
        "ort": "Embken"
    },
    {
        "code": "2426",
        "ort": "Nörvenich"
    },
    {
        "code": "2427",
        "ort": "Nideggen"
    },
    {
        "code": "2428",
        "ort": "Niederzier"
    },
    {
        "code": "2429",
        "ort": "Hürtgenwald"
    },
    {
        "code": "243\n2431",
        "ort": "Erkelenz\n2432"
    },
    {
        "code": "2431",
        "ort": "Erkelenz"
    },
    {
        "code": "2432",
        "ort": "Wassenberg"
    },
    {
        "code": "2433",
        "ort": "Hückelhoven"
    },
    {
        "code": "2434",
        "ort": "Wegberg"
    },
    {
        "code": "2435",
        "ort": "Lövenich"
    },
    {
        "code": "2436",
        "ort": "Roedgen"
    },
    {
        "code": "244\n2440",
        "ort": "Nettersheim-Tondorf\n2441"
    },
    {
        "code": "2440",
        "ort": "Nettersheim-Tondorf"
    },
    {
        "code": "2441",
        "ort": "Kall"
    },
    {
        "code": "2443",
        "ort": "Mechernich"
    },
    {
        "code": "2444",
        "ort": "Gemünd"
    },
    {
        "code": "2445",
        "ort": "Schleiden"
    },
    {
        "code": "2446",
        "ort": "Heimbach"
    },
    {
        "code": "2447",
        "ort": "Dahlem"
    },
    {
        "code": "2448",
        "ort": "Rescheid"
    },
    {
        "code": "2449",
        "ort": "Blankenheim"
    },
    {
        "code": "245\n2451",
        "ort": "Geilenkirchen/Übach-Palenberg\n2452"
    },
    {
        "code": "2451",
        "ort": "Geilenkirchen/Übach-Palenberg"
    },
    {
        "code": "2452",
        "ort": "Heinsberg"
    },
    {
        "code": "2453",
        "ort": "Randerath"
    },
    {
        "code": "2454",
        "ort": "Gangelt"
    },
    {
        "code": "2455",
        "ort": "Waldfeucht"
    },
    {
        "code": "2456",
        "ort": "Selfkant"
    },
    {
        "code": "246\n2461",
        "ort": "Jülich\n2462"
    },
    {
        "code": "2461",
        "ort": "Jülich"
    },
    {
        "code": "2462",
        "ort": "Linnich"
    },
    {
        "code": "2463",
        "ort": "Titz"
    },
    {
        "code": "2464",
        "ort": "Aldenhoven"
    },
    {
        "code": "2465",
        "ort": "Inden"
    },
    {
        "code": "247\n2471",
        "ort": "Roetgen\n2472"
    },
    {
        "code": "2471",
        "ort": "Roetgen"
    },
    {
        "code": "2472",
        "ort": "Monschau"
    },
    {
        "code": "2473",
        "ort": "Simmerath"
    },
    {
        "code": "2474",
        "ort": "Schmidt"
    },
    {
        "code": "248\n2482",
        "ort": "Hellenthal\n2484"
    },
    {
        "code": "2482",
        "ort": "Hellenthal"
    },
    {
        "code": "2484",
        "ort": "Eiserfey"
    },
    {
        "code": "2485",
        "ort": "Dreiborn"
    },
    {
        "code": "2486",
        "ort": "Nettersheim"
    },
    {
        "code": "249"
    },
    {
        "code": "2401",
        "ort": "Baesweiler"
    },
    {
        "code": "2402",
        "ort": "Stolberg"
    },
    {
        "code": "2403",
        "ort": "Eschweiler"
    },
    {
        "code": "2404",
        "ort": "Alsdorf"
    },
    {
        "code": "2405",
        "ort": "Würselen"
    },
    {
        "code": "2406",
        "ort": "Herzogenrath"
    },
    {
        "code": "2407",
        "ort": "Herzogenrath-Kohlscheid"
    },
    {
        "code": "2408",
        "ort": "Aachen-Kornelimünster"
    },
    {
        "code": "2409",
        "ort": "Gressenich"
    },
    {
        "code": "2421",
        "ort": "Düren"
    },
    {
        "code": "2422",
        "ort": "Kreuzau"
    },
    {
        "code": "2423",
        "ort": "Langerwehe"
    },
    {
        "code": "2424",
        "ort": "Vettweiß"
    },
    {
        "code": "2425",
        "ort": "Embken"
    },
    {
        "code": "2426",
        "ort": "Nörvenich"
    },
    {
        "code": "2427",
        "ort": "Nideggen"
    },
    {
        "code": "2428",
        "ort": "Niederzier"
    },
    {
        "code": "2429",
        "ort": "Hürtgenwald"
    },
    {
        "code": "2431",
        "ort": "Erkelenz"
    },
    {
        "code": "2432",
        "ort": "Wassenberg"
    },
    {
        "code": "2433",
        "ort": "Hückelhoven"
    },
    {
        "code": "2434",
        "ort": "Wegberg"
    },
    {
        "code": "2435",
        "ort": "Lövenich"
    },
    {
        "code": "2436",
        "ort": "Roedgen"
    },
    {
        "code": "2440",
        "ort": "Nettersheim-Tondorf"
    },
    {
        "code": "2441",
        "ort": "Kall"
    },
    {
        "code": "2443",
        "ort": "Mechernich"
    },
    {
        "code": "2444",
        "ort": "Gemünd"
    },
    {
        "code": "2445",
        "ort": "Schleiden"
    },
    {
        "code": "2446",
        "ort": "Heimbach"
    },
    {
        "code": "2447",
        "ort": "Dahlem"
    },
    {
        "code": "2448",
        "ort": "Rescheid"
    },
    {
        "code": "2449",
        "ort": "Blankenheim"
    },
    {
        "code": "2451",
        "ort": "Geilenkirchen/Übach-Palenberg"
    },
    {
        "code": "2452",
        "ort": "Heinsberg"
    },
    {
        "code": "2453",
        "ort": "Randerath"
    },
    {
        "code": "2454",
        "ort": "Gangelt"
    },
    {
        "code": "2455",
        "ort": "Waldfeucht"
    },
    {
        "code": "2456",
        "ort": "Selfkant"
    },
    {
        "code": "2461",
        "ort": "Jülich"
    },
    {
        "code": "2462",
        "ort": "Linnich"
    },
    {
        "code": "2463",
        "ort": "Titz"
    },
    {
        "code": "2464",
        "ort": "Aldenhoven"
    },
    {
        "code": "2465",
        "ort": "Inden"
    },
    {
        "code": "2471",
        "ort": "Roetgen"
    },
    {
        "code": "2472",
        "ort": "Monschau"
    },
    {
        "code": "2473",
        "ort": "Simmerath"
    },
    {
        "code": "2474",
        "ort": "Schmidt"
    },
    {
        "code": "2482",
        "ort": "Hellenthal"
    },
    {
        "code": "2484",
        "ort": "Eiserfey"
    },
    {
        "code": "2485",
        "ort": "Dreiborn"
    },
    {
        "code": "2486",
        "ort": "Nettersheim"
    },
    {
        "code": "250\n2501",
        "ort": "Münster-Hiltrup,"
    },
    {
        "code": "2501",
        "ort": "Münster-Hiltrup,"
    },
    {
        "code": "2502",
        "ort": "Nottuln"
    },
    {
        "code": "2504",
        "ort": "Telgte"
    },
    {
        "code": "2505",
        "ort": "Altenberge"
    },
    {
        "code": "2506",
        "ort": "Münster-Wolbeck"
    },
    {
        "code": "2507",
        "ort": "Havixbeck"
    },
    {
        "code": "2508",
        "ort": "Drensteinfurt"
    },
    {
        "code": "2509",
        "ort": "Nottuln-Appelhülsen"
    },
    {
        "code": "251",
        "ort": "Münster"
    },
    {
        "code": "252\n2520",
        "ort": "Wadersloh-Diestedde\n2521"
    },
    {
        "code": "2520",
        "ort": "Wadersloh-Diestedde"
    },
    {
        "code": "2521",
        "ort": "Beckum"
    },
    {
        "code": "2522",
        "ort": "Oelde"
    },
    {
        "code": "2523",
        "ort": "Wadersloh"
    },
    {
        "code": "2524",
        "ort": "Ennigerloh"
    },
    {
        "code": "2525",
        "ort": "Neubeckum"
    },
    {
        "code": "2526",
        "ort": "Sendenhorst"
    },
    {
        "code": "2527",
        "ort": "Lippetal"
    },
    {
        "code": "2528",
        "ort": "Enniger"
    },
    {
        "code": "2529",
        "ort": "Stromberg,"
    },
    {
        "code": "253\n2532",
        "ort": "Ostbevern\n2533"
    },
    {
        "code": "2532",
        "ort": "Ostbevern"
    },
    {
        "code": "2533",
        "ort": "Münster-Nienberge"
    },
    {
        "code": "2534",
        "ort": "Münster-Roxel"
    },
    {
        "code": "2535",
        "ort": "Albersloh"
    },
    {
        "code": "2536",
        "ort": "Münster-Albachten"
    },
    {
        "code": "2538",
        "ort": "Drensteinfurt-Rinkerode"
    },
    {
        "code": "254\n2541",
        "ort": "Coesfeld\n2542"
    },
    {
        "code": "2541",
        "ort": "Coesfeld"
    },
    {
        "code": "2542",
        "ort": "Gescher"
    },
    {
        "code": "2543",
        "ort": "Billerbeck"
    },
    {
        "code": "2545",
        "ort": "Rosendahl"
    },
    {
        "code": "2546",
        "ort": "Lette,"
    },
    {
        "code": "2547",
        "ort": "Osterwick"
    },
    {
        "code": "2548",
        "ort": "Rorup"
    },
    {
        "code": "255\n2551",
        "ort": "Steinfurt-Burgsteinfurt\n2552"
    },
    {
        "code": "2551",
        "ort": "Steinfurt-Burgsteinfurt"
    },
    {
        "code": "2552",
        "ort": "Steinfurt-Borghorst"
    },
    {
        "code": "2553",
        "ort": "Ochtrup"
    },
    {
        "code": "2554",
        "ort": "Laer"
    },
    {
        "code": "2555",
        "ort": "Schöppingen"
    },
    {
        "code": "2556",
        "ort": "Metelen"
    },
    {
        "code": "2557",
        "ort": "Wettringen"
    },
    {
        "code": "2558",
        "ort": "Horstmar"
    },
    {
        "code": "256\n2561",
        "ort": "Ahaus\n2562"
    },
    {
        "code": "2561",
        "ort": "Ahaus"
    },
    {
        "code": "2562",
        "ort": "Gronau"
    },
    {
        "code": "2563",
        "ort": "Stadtlohn"
    },
    {
        "code": "2564",
        "ort": "Vreden"
    },
    {
        "code": "2565",
        "ort": "Epe"
    },
    {
        "code": "2566",
        "ort": "Legden"
    },
    {
        "code": "2567",
        "ort": "Ahaus-Alstätte"
    },
    {
        "code": "2568",
        "ort": "Heek"
    },
    {
        "code": "257\n2571",
        "ort": "Greven\n2572"
    },
    {
        "code": "2571",
        "ort": "Greven"
    },
    {
        "code": "2572",
        "ort": "Emsdetten"
    },
    {
        "code": "2573",
        "ort": "Nordwalde"
    },
    {
        "code": "2574",
        "ort": "Saerbeck"
    },
    {
        "code": "2575",
        "ort": "Reckenfeld"
    },
    {
        "code": "258\n2581",
        "ort": "Warendorf\n2582"
    },
    {
        "code": "2581",
        "ort": "Warendorf"
    },
    {
        "code": "2582",
        "ort": "Everswinkel"
    },
    {
        "code": "2583",
        "ort": "Sassenberg"
    },
    {
        "code": "2584",
        "ort": "Milte"
    },
    {
        "code": "2585",
        "ort": "Hoetmar"
    },
    {
        "code": "2586",
        "ort": "Beelen"
    },
    {
        "code": "2587",
        "ort": "Westkirchen"
    },
    {
        "code": "2588",
        "ort": "Greffen"
    },
    {
        "code": "259\n2590",
        "ort": "Dülmen-Buldern\n2591"
    },
    {
        "code": "2590",
        "ort": "Dülmen-Buldern"
    },
    {
        "code": "2591",
        "ort": "Lüdinghausen"
    },
    {
        "code": "2592",
        "ort": "Selm"
    },
    {
        "code": "2593",
        "ort": "Ascheberg"
    },
    {
        "code": "2594",
        "ort": "Dülmen"
    },
    {
        "code": "2595",
        "ort": "Olfen"
    },
    {
        "code": "2596",
        "ort": "Nordkirchen"
    },
    {
        "code": "2597",
        "ort": "Senden"
    },
    {
        "code": "2598",
        "ort": "Ottmarsbocholt"
    },
    {
        "code": "2599",
        "ort": "Herbern"
    },
    {
        "code": "2501",
        "ort": "Münster-Hiltrup,"
    },
    {
        "code": "2502",
        "ort": "Nottuln"
    },
    {
        "code": "2504",
        "ort": "Telgte"
    },
    {
        "code": "2505",
        "ort": "Altenberge"
    },
    {
        "code": "2506",
        "ort": "Münster-Wolbeck"
    },
    {
        "code": "2507",
        "ort": "Havixbeck"
    },
    {
        "code": "2508",
        "ort": "Drensteinfurt"
    },
    {
        "code": "2509",
        "ort": "Nottuln-Appelhülsen"
    },
    {
        "code": "2520",
        "ort": "Wadersloh-Diestedde"
    },
    {
        "code": "2521",
        "ort": "Beckum"
    },
    {
        "code": "2522",
        "ort": "Oelde"
    },
    {
        "code": "2523",
        "ort": "Wadersloh"
    },
    {
        "code": "2524",
        "ort": "Ennigerloh"
    },
    {
        "code": "2525",
        "ort": "Neubeckum"
    },
    {
        "code": "2526",
        "ort": "Sendenhorst"
    },
    {
        "code": "2527",
        "ort": "Lippetal"
    },
    {
        "code": "2528",
        "ort": "Enniger"
    },
    {
        "code": "2529",
        "ort": "Stromberg,"
    },
    {
        "code": "2532",
        "ort": "Ostbevern"
    },
    {
        "code": "2533",
        "ort": "Münster-Nienberge"
    },
    {
        "code": "2534",
        "ort": "Münster-Roxel"
    },
    {
        "code": "2535",
        "ort": "Albersloh"
    },
    {
        "code": "2536",
        "ort": "Münster-Albachten"
    },
    {
        "code": "2538",
        "ort": "Drensteinfurt-Rinkerode"
    },
    {
        "code": "2541",
        "ort": "Coesfeld"
    },
    {
        "code": "2542",
        "ort": "Gescher"
    },
    {
        "code": "2543",
        "ort": "Billerbeck"
    },
    {
        "code": "2545",
        "ort": "Rosendahl"
    },
    {
        "code": "2546",
        "ort": "Lette,"
    },
    {
        "code": "2547",
        "ort": "Osterwick"
    },
    {
        "code": "2548",
        "ort": "Rorup"
    },
    {
        "code": "2551",
        "ort": "Steinfurt-Burgsteinfurt"
    },
    {
        "code": "2552",
        "ort": "Steinfurt-Borghorst"
    },
    {
        "code": "2553",
        "ort": "Ochtrup"
    },
    {
        "code": "2554",
        "ort": "Laer"
    },
    {
        "code": "2555",
        "ort": "Schöppingen"
    },
    {
        "code": "2556",
        "ort": "Metelen"
    },
    {
        "code": "2557",
        "ort": "Wettringen"
    },
    {
        "code": "2558",
        "ort": "Horstmar"
    },
    {
        "code": "2561",
        "ort": "Ahaus"
    },
    {
        "code": "2562",
        "ort": "Gronau"
    },
    {
        "code": "2563",
        "ort": "Stadtlohn"
    },
    {
        "code": "2564",
        "ort": "Vreden"
    },
    {
        "code": "2565",
        "ort": "Epe"
    },
    {
        "code": "2566",
        "ort": "Legden"
    },
    {
        "code": "2567",
        "ort": "Ahaus-Alstätte"
    },
    {
        "code": "2568",
        "ort": "Heek"
    },
    {
        "code": "2571",
        "ort": "Greven"
    },
    {
        "code": "2572",
        "ort": "Emsdetten"
    },
    {
        "code": "2573",
        "ort": "Nordwalde"
    },
    {
        "code": "2574",
        "ort": "Saerbeck"
    },
    {
        "code": "2575",
        "ort": "Reckenfeld"
    },
    {
        "code": "2581",
        "ort": "Warendorf"
    },
    {
        "code": "2582",
        "ort": "Everswinkel"
    },
    {
        "code": "2583",
        "ort": "Sassenberg"
    },
    {
        "code": "2584",
        "ort": "Milte"
    },
    {
        "code": "2585",
        "ort": "Hoetmar"
    },
    {
        "code": "2586",
        "ort": "Beelen"
    },
    {
        "code": "2587",
        "ort": "Westkirchen"
    },
    {
        "code": "2588",
        "ort": "Greffen"
    },
    {
        "code": "2590",
        "ort": "Dülmen-Buldern"
    },
    {
        "code": "2591",
        "ort": "Lüdinghausen"
    },
    {
        "code": "2592",
        "ort": "Selm"
    },
    {
        "code": "2593",
        "ort": "Ascheberg"
    },
    {
        "code": "2594",
        "ort": "Dülmen"
    },
    {
        "code": "2595",
        "ort": "Olfen"
    },
    {
        "code": "2596",
        "ort": "Nordkirchen"
    },
    {
        "code": "2597",
        "ort": "Senden"
    },
    {
        "code": "2598",
        "ort": "Ottmarsbocholt"
    },
    {
        "code": "2599",
        "ort": "Herbern"
    },
    {
        "code": "260\n2601",
        "ort": "Nauort\n2602"
    },
    {
        "code": "2601",
        "ort": "Nauort"
    },
    {
        "code": "2602",
        "ort": "Montabaur"
    },
    {
        "code": "2603",
        "ort": "Bad"
    },
    {
        "code": "2604",
        "ort": "Nassau"
    },
    {
        "code": "2605",
        "ort": "Löf"
    },
    {
        "code": "2606",
        "ort": "Winningen"
    },
    {
        "code": "2607",
        "ort": "Kobern-Gondorf"
    },
    {
        "code": "2608",
        "ort": "Welschneudorf"
    },
    {
        "code": "261",
        "ort": "Koblenz"
    },
    {
        "code": "262\n2620",
        "ort": "Neuhäusel"
    },
    {
        "code": "2620",
        "ort": "Neuhäusel"
    },
    {
        "code": "2621",
        "ort": "Lahnstein"
    },
    {
        "code": "2622",
        "ort": "Bendorf"
    },
    {
        "code": "2623",
        "ort": "Ransbach-Baumbach"
    },
    {
        "code": "2624",
        "ort": "Höhr-Grenzhausen"
    },
    {
        "code": "2625",
        "ort": "Ochtendung"
    },
    {
        "code": "2626",
        "ort": "Selters"
    },
    {
        "code": "2627",
        "ort": "Braubach"
    },
    {
        "code": "2628",
        "ort": "Rhens"
    },
    {
        "code": "263\n2630",
        "ort": "Mülheim-Kärlich\n2631"
    },
    {
        "code": "2630",
        "ort": "Mülheim-Kärlich"
    },
    {
        "code": "2631",
        "ort": "Neuwied"
    },
    {
        "code": "2632",
        "ort": "Andernach"
    },
    {
        "code": "2633",
        "ort": "Brohl-Lützing"
    },
    {
        "code": "2634",
        "ort": "Rengsdorf"
    },
    {
        "code": "2635",
        "ort": "Rheinbrohl"
    },
    {
        "code": "2636",
        "ort": "Burgbrohl"
    },
    {
        "code": "2637",
        "ort": "Weissenthurm"
    },
    {
        "code": "2638",
        "ort": "Waldbreitbach"
    },
    {
        "code": "2639",
        "ort": "Anhausen"
    },
    {
        "code": "264\n2641",
        "ort": "Bad"
    },
    {
        "code": "2641",
        "ort": "Bad"
    },
    {
        "code": "2642",
        "ort": "Remagen"
    },
    {
        "code": "2643",
        "ort": "Altenahr"
    },
    {
        "code": "2644",
        "ort": "Linz"
    },
    {
        "code": "2645",
        "ort": "Vettelschoss"
    },
    {
        "code": "2646",
        "ort": "Königsfeld"
    },
    {
        "code": "2647",
        "ort": "Kesseling"
    },
    {
        "code": "265\n2651",
        "ort": "Mayen\n2652"
    },
    {
        "code": "2651",
        "ort": "Mayen"
    },
    {
        "code": "2652",
        "ort": "Mendig"
    },
    {
        "code": "2653",
        "ort": "Kaisersesch"
    },
    {
        "code": "2654",
        "ort": "Polch"
    },
    {
        "code": "2655",
        "ort": "Weibern"
    },
    {
        "code": "2656",
        "ort": "Virneburg"
    },
    {
        "code": "2657",
        "ort": "Uersfeld"
    },
    {
        "code": "266\n2661",
        "ort": "Bad"
    },
    {
        "code": "2661",
        "ort": "Bad"
    },
    {
        "code": "2662",
        "ort": "Hachenburg"
    },
    {
        "code": "2663",
        "ort": "Westerburg"
    },
    {
        "code": "2664",
        "ort": "Rennerod"
    },
    {
        "code": "2666",
        "ort": "Freilingen"
    },
    {
        "code": "2667",
        "ort": "Stein-Neukirch"
    },
    {
        "code": "267\n2671",
        "ort": "Cochem\n2672"
    },
    {
        "code": "2671",
        "ort": "Cochem"
    },
    {
        "code": "2672",
        "ort": "Treis-Karden"
    },
    {
        "code": "2673",
        "ort": "Ellenz-Poltersdorf"
    },
    {
        "code": "2674",
        "ort": "Bad"
    },
    {
        "code": "2675",
        "ort": "Ediger-Eller"
    },
    {
        "code": "2676",
        "ort": "Ulmen"
    },
    {
        "code": "2677",
        "ort": "Lutzerath"
    },
    {
        "code": "2678",
        "ort": "Büchel"
    },
    {
        "code": "268\n2680",
        "ort": "Mündersbach\n2681"
    },
    {
        "code": "2680",
        "ort": "Mündersbach"
    },
    {
        "code": "2681",
        "ort": "Altenkirchen"
    },
    {
        "code": "2682",
        "ort": "Hamm"
    },
    {
        "code": "2683",
        "ort": "Asbach"
    },
    {
        "code": "2684",
        "ort": "Puderbach"
    },
    {
        "code": "2685",
        "ort": "Flammersfeld"
    },
    {
        "code": "2686",
        "ort": "Weyerbusch"
    },
    {
        "code": "2687",
        "ort": "Horhausen"
    },
    {
        "code": "2688",
        "ort": "Kroppach"
    },
    {
        "code": "2689",
        "ort": "Dierdorf"
    },
    {
        "code": "269\n2691",
        "ort": "Adenau\n2692"
    },
    {
        "code": "2691",
        "ort": "Adenau"
    },
    {
        "code": "2692",
        "ort": "Kelberg"
    },
    {
        "code": "2693",
        "ort": "Antweiler"
    },
    {
        "code": "2694",
        "ort": "Wershofen"
    },
    {
        "code": "2695",
        "ort": "Insul"
    },
    {
        "code": "2696",
        "ort": "Nohn"
    },
    {
        "code": "2697",
        "ort": "Ahrhütte"
    },
    {
        "code": "2601",
        "ort": "Nauort"
    },
    {
        "code": "2602",
        "ort": "Montabaur"
    },
    {
        "code": "2603",
        "ort": "Bad"
    },
    {
        "code": "2604",
        "ort": "Nassau"
    },
    {
        "code": "2605",
        "ort": "Löf"
    },
    {
        "code": "2606",
        "ort": "Winningen"
    },
    {
        "code": "2607",
        "ort": "Kobern-Gondorf"
    },
    {
        "code": "2608",
        "ort": "Welschneudorf"
    },
    {
        "code": "2620",
        "ort": "Neuhäusel"
    },
    {
        "code": "2621",
        "ort": "Lahnstein"
    },
    {
        "code": "2622",
        "ort": "Bendorf"
    },
    {
        "code": "2623",
        "ort": "Ransbach-Baumbach"
    },
    {
        "code": "2624",
        "ort": "Höhr-Grenzhausen"
    },
    {
        "code": "2625",
        "ort": "Ochtendung"
    },
    {
        "code": "2626",
        "ort": "Selters"
    },
    {
        "code": "2627",
        "ort": "Braubach"
    },
    {
        "code": "2628",
        "ort": "Rhens"
    },
    {
        "code": "2630",
        "ort": "Mülheim-Kärlich"
    },
    {
        "code": "2631",
        "ort": "Neuwied"
    },
    {
        "code": "2632",
        "ort": "Andernach"
    },
    {
        "code": "2633",
        "ort": "Brohl-Lützing"
    },
    {
        "code": "2634",
        "ort": "Rengsdorf"
    },
    {
        "code": "2635",
        "ort": "Rheinbrohl"
    },
    {
        "code": "2636",
        "ort": "Burgbrohl"
    },
    {
        "code": "2637",
        "ort": "Weissenthurm"
    },
    {
        "code": "2638",
        "ort": "Waldbreitbach"
    },
    {
        "code": "2639",
        "ort": "Anhausen"
    },
    {
        "code": "2641",
        "ort": "Bad"
    },
    {
        "code": "2642",
        "ort": "Remagen"
    },
    {
        "code": "2643",
        "ort": "Altenahr"
    },
    {
        "code": "2644",
        "ort": "Linz"
    },
    {
        "code": "2645",
        "ort": "Vettelschoss"
    },
    {
        "code": "2646",
        "ort": "Königsfeld"
    },
    {
        "code": "2647",
        "ort": "Kesseling"
    },
    {
        "code": "2651",
        "ort": "Mayen"
    },
    {
        "code": "2652",
        "ort": "Mendig"
    },
    {
        "code": "2653",
        "ort": "Kaisersesch"
    },
    {
        "code": "2654",
        "ort": "Polch"
    },
    {
        "code": "2655",
        "ort": "Weibern"
    },
    {
        "code": "2656",
        "ort": "Virneburg"
    },
    {
        "code": "2657",
        "ort": "Uersfeld"
    },
    {
        "code": "2661",
        "ort": "Bad"
    },
    {
        "code": "2662",
        "ort": "Hachenburg"
    },
    {
        "code": "2663",
        "ort": "Westerburg"
    },
    {
        "code": "2664",
        "ort": "Rennerod"
    },
    {
        "code": "2666",
        "ort": "Freilingen"
    },
    {
        "code": "2667",
        "ort": "Stein-Neukirch"
    },
    {
        "code": "2671",
        "ort": "Cochem"
    },
    {
        "code": "2672",
        "ort": "Treis-Karden"
    },
    {
        "code": "2673",
        "ort": "Ellenz-Poltersdorf"
    },
    {
        "code": "2674",
        "ort": "Bad"
    },
    {
        "code": "2675",
        "ort": "Ediger-Eller"
    },
    {
        "code": "2676",
        "ort": "Ulmen"
    },
    {
        "code": "2677",
        "ort": "Lutzerath"
    },
    {
        "code": "2678",
        "ort": "Büchel"
    },
    {
        "code": "2680",
        "ort": "Mündersbach"
    },
    {
        "code": "2681",
        "ort": "Altenkirchen"
    },
    {
        "code": "2682",
        "ort": "Hamm"
    },
    {
        "code": "2683",
        "ort": "Asbach"
    },
    {
        "code": "2684",
        "ort": "Puderbach"
    },
    {
        "code": "2685",
        "ort": "Flammersfeld"
    },
    {
        "code": "2686",
        "ort": "Weyerbusch"
    },
    {
        "code": "2687",
        "ort": "Horhausen"
    },
    {
        "code": "2688",
        "ort": "Kroppach"
    },
    {
        "code": "2689",
        "ort": "Dierdorf"
    },
    {
        "code": "2691",
        "ort": "Adenau"
    },
    {
        "code": "2692",
        "ort": "Kelberg"
    },
    {
        "code": "2693",
        "ort": "Antweiler"
    },
    {
        "code": "2694",
        "ort": "Wershofen"
    },
    {
        "code": "2695",
        "ort": "Insul"
    },
    {
        "code": "2696",
        "ort": "Nohn"
    },
    {
        "code": "2697",
        "ort": "Ahrhütte"
    },
    {
        "code": "271",
        "ort": "Siegen"
    },
    {
        "code": "272\n2721",
        "ort": "Lennestadt\n2722"
    },
    {
        "code": "2721",
        "ort": "Lennestadt"
    },
    {
        "code": "2722",
        "ort": "Attendorn"
    },
    {
        "code": "2723",
        "ort": "Kirchhundem"
    },
    {
        "code": "2724",
        "ort": "Serkenrode"
    },
    {
        "code": "2725",
        "ort": "Oedingen"
    },
    {
        "code": "273\n2732",
        "ort": "Kreuztal\n2733"
    },
    {
        "code": "2732",
        "ort": "Kreuztal"
    },
    {
        "code": "2733",
        "ort": "Hilchenbach"
    },
    {
        "code": "2734",
        "ort": "Freudenberg"
    },
    {
        "code": "2735",
        "ort": "Neunkirchen"
    },
    {
        "code": "2736",
        "ort": "Burbach"
    },
    {
        "code": "2737",
        "ort": "Netphen-Deuz"
    },
    {
        "code": "2738",
        "ort": "Netphen"
    },
    {
        "code": "2739",
        "ort": "Wilnsdorf"
    },
    {
        "code": "274\n2741",
        "ort": "Betzdorf\n2742"
    },
    {
        "code": "2741",
        "ort": "Betzdorf"
    },
    {
        "code": "2742",
        "ort": "Wissen"
    },
    {
        "code": "2743",
        "ort": "Daaden"
    },
    {
        "code": "2744",
        "ort": "Herdorf"
    },
    {
        "code": "2745",
        "ort": "Brachbach"
    },
    {
        "code": "2747",
        "ort": "Molzhain"
    },
    {
        "code": "275\n2750",
        "ort": "Diedenshausen\n2751"
    },
    {
        "code": "2750",
        "ort": "Diedenshausen"
    },
    {
        "code": "2751",
        "ort": "Bad"
    },
    {
        "code": "2752",
        "ort": "Bad"
    },
    {
        "code": "2753",
        "ort": "Erndtebrück"
    },
    {
        "code": "2754",
        "ort": "Feudingen"
    },
    {
        "code": "2755",
        "ort": "Schwarzenau"
    },
    {
        "code": "2758",
        "ort": "Girkhausen"
    },
    {
        "code": "2759",
        "ort": "Aue"
    },
    {
        "code": "276\n2761",
        "ort": "Olpe\n2762"
    },
    {
        "code": "2761",
        "ort": "Olpe"
    },
    {
        "code": "2762",
        "ort": "Wenden"
    },
    {
        "code": "2763",
        "ort": "Bleche"
    },
    {
        "code": "2764",
        "ort": "Welschen"
    },
    {
        "code": "277\n2770",
        "ort": "Eschenburg\n2771"
    },
    {
        "code": "2770",
        "ort": "Eschenburg"
    },
    {
        "code": "2771",
        "ort": "Dillenburg"
    },
    {
        "code": "2772",
        "ort": "Herborn"
    },
    {
        "code": "2773",
        "ort": "Haiger"
    },
    {
        "code": "2774",
        "ort": "Dietzhölztal"
    },
    {
        "code": "2775",
        "ort": "Driedorf"
    },
    {
        "code": "2776",
        "ort": "Bad"
    },
    {
        "code": "2777",
        "ort": "Breitscheid"
    },
    {
        "code": "2778",
        "ort": "Siegbach"
    },
    {
        "code": "2779",
        "ort": "Greifenstein-Beilstein"
    },
    {
        "code": "2721",
        "ort": "Lennestadt"
    },
    {
        "code": "2722",
        "ort": "Attendorn"
    },
    {
        "code": "2723",
        "ort": "Kirchhundem"
    },
    {
        "code": "2724",
        "ort": "Serkenrode"
    },
    {
        "code": "2725",
        "ort": "Oedingen"
    },
    {
        "code": "2732",
        "ort": "Kreuztal"
    },
    {
        "code": "2733",
        "ort": "Hilchenbach"
    },
    {
        "code": "2734",
        "ort": "Freudenberg"
    },
    {
        "code": "2735",
        "ort": "Neunkirchen"
    },
    {
        "code": "2736",
        "ort": "Burbach"
    },
    {
        "code": "2737",
        "ort": "Netphen-Deuz"
    },
    {
        "code": "2738",
        "ort": "Netphen"
    },
    {
        "code": "2739",
        "ort": "Wilnsdorf"
    },
    {
        "code": "2741",
        "ort": "Betzdorf"
    },
    {
        "code": "2742",
        "ort": "Wissen"
    },
    {
        "code": "2743",
        "ort": "Daaden"
    },
    {
        "code": "2744",
        "ort": "Herdorf"
    },
    {
        "code": "2745",
        "ort": "Brachbach"
    },
    {
        "code": "2747",
        "ort": "Molzhain"
    },
    {
        "code": "2750",
        "ort": "Diedenshausen"
    },
    {
        "code": "2751",
        "ort": "Bad"
    },
    {
        "code": "2752",
        "ort": "Bad"
    },
    {
        "code": "2753",
        "ort": "Erndtebrück"
    },
    {
        "code": "2754",
        "ort": "Feudingen"
    },
    {
        "code": "2755",
        "ort": "Schwarzenau"
    },
    {
        "code": "2758",
        "ort": "Girkhausen"
    },
    {
        "code": "2759",
        "ort": "Aue"
    },
    {
        "code": "2761",
        "ort": "Olpe"
    },
    {
        "code": "2762",
        "ort": "Wenden"
    },
    {
        "code": "2763",
        "ort": "Bleche"
    },
    {
        "code": "2764",
        "ort": "Welschen"
    },
    {
        "code": "2770",
        "ort": "Eschenburg"
    },
    {
        "code": "2771",
        "ort": "Dillenburg"
    },
    {
        "code": "2772",
        "ort": "Herborn"
    },
    {
        "code": "2773",
        "ort": "Haiger"
    },
    {
        "code": "2774",
        "ort": "Dietzhölztal"
    },
    {
        "code": "2775",
        "ort": "Driedorf"
    },
    {
        "code": "2776",
        "ort": "Bad"
    },
    {
        "code": "2777",
        "ort": "Breitscheid"
    },
    {
        "code": "2778",
        "ort": "Siegbach"
    },
    {
        "code": "2779",
        "ort": "Greifenstein-Beilstein"
    },
    {
        "code": "280\n2801",
        "ort": "Xanten\n2802"
    },
    {
        "code": "2801",
        "ort": "Xanten"
    },
    {
        "code": "2802",
        "ort": "Alpen"
    },
    {
        "code": "2803",
        "ort": "Büderich"
    },
    {
        "code": "2804",
        "ort": "Marienbaum"
    },
    {
        "code": "281",
        "ort": "Wesel"
    },
    {
        "code": "282\n2821",
        "ort": "Kleve\n2822"
    },
    {
        "code": "2821",
        "ort": "Kleve"
    },
    {
        "code": "2822",
        "ort": "Emmerich"
    },
    {
        "code": "2823",
        "ort": "Goch"
    },
    {
        "code": "2824",
        "ort": "Kalkar"
    },
    {
        "code": "2825",
        "ort": "Uedem"
    },
    {
        "code": "2826",
        "ort": "Kranenburg"
    },
    {
        "code": "2827",
        "ort": "Goch-Hassum"
    },
    {
        "code": "2828",
        "ort": "Elten"
    },
    {
        "code": "283\n2831",
        "ort": "Geldern\n2832"
    },
    {
        "code": "2831",
        "ort": "Geldern"
    },
    {
        "code": "2832",
        "ort": "Kevelaer"
    },
    {
        "code": "2833",
        "ort": "Kerken"
    },
    {
        "code": "2834",
        "ort": "Straelen"
    },
    {
        "code": "2835",
        "ort": "Issum"
    },
    {
        "code": "2836",
        "ort": "Wachtendonk"
    },
    {
        "code": "2837",
        "ort": "Weeze"
    },
    {
        "code": "2838",
        "ort": "Sonsbeck"
    },
    {
        "code": "2839",
        "ort": "Straelen-Herongen"
    },
    {
        "code": "284\n2841",
        "ort": "Moers\n2842"
    },
    {
        "code": "2841",
        "ort": "Moers"
    },
    {
        "code": "2842",
        "ort": "Kamp-Lintfort"
    },
    {
        "code": "2843",
        "ort": "Rheinberg"
    },
    {
        "code": "2844",
        "ort": "Orsoy"
    },
    {
        "code": "2845",
        "ort": "Neukirchen-Vluyn"
    },
    {
        "code": "285\n2850",
        "ort": "Haldern\n2851"
    },
    {
        "code": "2850",
        "ort": "Haldern"
    },
    {
        "code": "2851",
        "ort": "Rees"
    },
    {
        "code": "2852",
        "ort": "Hamminkeln"
    },
    {
        "code": "2853",
        "ort": "Schermbeck"
    },
    {
        "code": "2855",
        "ort": "Voerde"
    },
    {
        "code": "2856",
        "ort": "Brünen"
    },
    {
        "code": "2857",
        "ort": "Rees-Mehr"
    },
    {
        "code": "2858",
        "ort": "Hünxe"
    },
    {
        "code": "2859",
        "ort": "Bislich"
    },
    {
        "code": "286\n2861",
        "ort": "Borken\n2862"
    },
    {
        "code": "2861",
        "ort": "Borken"
    },
    {
        "code": "2862",
        "ort": "Südlohn"
    },
    {
        "code": "2863",
        "ort": "Velen"
    },
    {
        "code": "2864",
        "ort": "Reken"
    },
    {
        "code": "2865",
        "ort": "Raesfeld"
    },
    {
        "code": "2866",
        "ort": "Dorsten"
    },
    {
        "code": "2867",
        "ort": "Heiden"
    },
    {
        "code": "287\n2871",
        "ort": "Bocholt\n2872"
    },
    {
        "code": "2871",
        "ort": "Bocholt"
    },
    {
        "code": "2872",
        "ort": "Rhede"
    },
    {
        "code": "2873",
        "ort": "Werth"
    },
    {
        "code": "2874",
        "ort": "Isselburg/Bocholt –"
    },
    {
        "code": "2801",
        "ort": "Xanten"
    },
    {
        "code": "2802",
        "ort": "Alpen"
    },
    {
        "code": "2803",
        "ort": "Büderich"
    },
    {
        "code": "2804",
        "ort": "Marienbaum"
    },
    {
        "code": "2821",
        "ort": "Kleve"
    },
    {
        "code": "2822",
        "ort": "Emmerich"
    },
    {
        "code": "2823",
        "ort": "Goch"
    },
    {
        "code": "2824",
        "ort": "Kalkar"
    },
    {
        "code": "2825",
        "ort": "Uedem"
    },
    {
        "code": "2826",
        "ort": "Kranenburg"
    },
    {
        "code": "2827",
        "ort": "Goch-Hassum"
    },
    {
        "code": "2828",
        "ort": "Elten"
    },
    {
        "code": "2831",
        "ort": "Geldern"
    },
    {
        "code": "2832",
        "ort": "Kevelaer"
    },
    {
        "code": "2833",
        "ort": "Kerken"
    },
    {
        "code": "2834",
        "ort": "Straelen"
    },
    {
        "code": "2835",
        "ort": "Issum"
    },
    {
        "code": "2836",
        "ort": "Wachtendonk"
    },
    {
        "code": "2837",
        "ort": "Weeze"
    },
    {
        "code": "2838",
        "ort": "Sonsbeck"
    },
    {
        "code": "2839",
        "ort": "Straelen-Herongen"
    },
    {
        "code": "2841",
        "ort": "Moers"
    },
    {
        "code": "2842",
        "ort": "Kamp-Lintfort"
    },
    {
        "code": "2843",
        "ort": "Rheinberg"
    },
    {
        "code": "2844",
        "ort": "Orsoy"
    },
    {
        "code": "2845",
        "ort": "Neukirchen-Vluyn"
    },
    {
        "code": "2850",
        "ort": "Haldern"
    },
    {
        "code": "2851",
        "ort": "Rees"
    },
    {
        "code": "2852",
        "ort": "Hamminkeln"
    },
    {
        "code": "2853",
        "ort": "Schermbeck"
    },
    {
        "code": "2855",
        "ort": "Voerde"
    },
    {
        "code": "2856",
        "ort": "Brünen"
    },
    {
        "code": "2857",
        "ort": "Rees-Mehr"
    },
    {
        "code": "2858",
        "ort": "Hünxe"
    },
    {
        "code": "2859",
        "ort": "Bislich"
    },
    {
        "code": "2861",
        "ort": "Borken"
    },
    {
        "code": "2862",
        "ort": "Südlohn"
    },
    {
        "code": "2863",
        "ort": "Velen"
    },
    {
        "code": "2864",
        "ort": "Reken"
    },
    {
        "code": "2865",
        "ort": "Raesfeld"
    },
    {
        "code": "2866",
        "ort": "Dorsten"
    },
    {
        "code": "2867",
        "ort": "Heiden"
    },
    {
        "code": "2871",
        "ort": "Bocholt"
    },
    {
        "code": "2872",
        "ort": "Rhede"
    },
    {
        "code": "2873",
        "ort": "Werth"
    },
    {
        "code": "2874",
        "ort": "Isselburg/Bocholt –"
    },
    {
        "code": "290\n2902",
        "ort": "Warstein\n2903"
    },
    {
        "code": "2902",
        "ort": "Warstein"
    },
    {
        "code": "2903",
        "ort": "Freienohl"
    },
    {
        "code": "2904",
        "ort": "Bestwig"
    },
    {
        "code": "2905",
        "ort": "Ramsbeck"
    },
    {
        "code": "291",
        "ort": "Meschede"
    },
    {
        "code": "292\n2921",
        "ort": "Soest\n2922"
    },
    {
        "code": "2921",
        "ort": "Soest"
    },
    {
        "code": "2922",
        "ort": "Werl"
    },
    {
        "code": "2923",
        "ort": "Herzfeld"
    },
    {
        "code": "2924",
        "ort": "Möhnesee"
    },
    {
        "code": "2925",
        "ort": "Allagen"
    },
    {
        "code": "2927",
        "ort": "Bad"
    },
    {
        "code": "2928",
        "ort": "Ostönnen"
    },
    {
        "code": "293\n2931",
        "ort": "Arnsberg\n2932"
    },
    {
        "code": "2931",
        "ort": "Arnsberg"
    },
    {
        "code": "2932",
        "ort": "Neheim-Hüsten"
    },
    {
        "code": "2933",
        "ort": "Sundern"
    },
    {
        "code": "2934",
        "ort": "Sundern-Altenhellefeld"
    },
    {
        "code": "2935",
        "ort": "Sundern-Hachen"
    },
    {
        "code": "2937",
        "ort": "Arnsberg-Oeventrop"
    },
    {
        "code": "2938",
        "ort": "Ense"
    },
    {
        "code": "294\n2941",
        "ort": "Lippstadt\n2942"
    },
    {
        "code": "2941",
        "ort": "Lippstadt"
    },
    {
        "code": "2942",
        "ort": "Geseke"
    },
    {
        "code": "2943",
        "ort": "Erwitte"
    },
    {
        "code": "2944",
        "ort": "Rietberg-Mastholte"
    },
    {
        "code": "2945",
        "ort": "Lippstadt-Benninghausen"
    },
    {
        "code": "2947",
        "ort": "Anröchte"
    },
    {
        "code": "2948",
        "ort": "Lippstadt-Rebbeke"
    },
    {
        "code": "295\n2951",
        "ort": "Büren\n2952"
    },
    {
        "code": "2951",
        "ort": "Büren"
    },
    {
        "code": "2952",
        "ort": "Rüthen"
    },
    {
        "code": "2953",
        "ort": "Bad"
    },
    {
        "code": "2954",
        "ort": "Rüthen-Oestereiden"
    },
    {
        "code": "2955",
        "ort": "Wewelsburg"
    },
    {
        "code": "2957",
        "ort": "Bad"
    },
    {
        "code": "2958",
        "ort": "Büren-Harth"
    },
    {
        "code": "296\n2961",
        "ort": "Brilon\n2962"
    },
    {
        "code": "2961",
        "ort": "Brilon"
    },
    {
        "code": "2962",
        "ort": "Olsberg"
    },
    {
        "code": "2963",
        "ort": "Messinghausen"
    },
    {
        "code": "2964",
        "ort": "Alme"
    },
    {
        "code": "297\n2970",
        "ort": "disused\n2971"
    },
    {
        "code": "2970",
        "ort": "disused"
    },
    {
        "code": "2971",
        "ort": "Schmallenberg-Dorlar"
    },
    {
        "code": "2972",
        "ort": "Schmallenberg"
    },
    {
        "code": "2973",
        "ort": "Eslohe"
    },
    {
        "code": "2974",
        "ort": "Schmallenberg-Bad"
    },
    {
        "code": "2975",
        "ort": "Schmallenberg-Oberkirchen"
    },
    {
        "code": "2977",
        "ort": "Schmallenberg-Bödefeld"
    },
    {
        "code": "2978",
        "ort": "disused"
    },
    {
        "code": "2979",
        "ort": "disused"
    },
    {
        "code": "298\n2981",
        "ort": "Winterberg"
    },
    {
        "code": "2981",
        "ort": "Winterberg"
    },
    {
        "code": "2982",
        "ort": "Medebach"
    },
    {
        "code": "2983",
        "ort": "Winterberg-Siedlinghausen"
    },
    {
        "code": "2984",
        "ort": "Hallenberg"
    },
    {
        "code": "2985",
        "ort": "Winterberg-Niedersfeld"
    },
    {
        "code": "299\n2991",
        "ort": "Marsberg-Bredelar\n2992"
    },
    {
        "code": "2991",
        "ort": "Marsberg-Bredelar"
    },
    {
        "code": "2992",
        "ort": "Marsberg"
    },
    {
        "code": "2993",
        "ort": "Marsberg-Canstein"
    },
    {
        "code": "2994",
        "ort": "Marsberg-Westheim"
    },
    {
        "code": "2902",
        "ort": "Warstein"
    },
    {
        "code": "2903",
        "ort": "Freienohl"
    },
    {
        "code": "2904",
        "ort": "Bestwig"
    },
    {
        "code": "2905",
        "ort": "Ramsbeck"
    },
    {
        "code": "2921",
        "ort": "Soest"
    },
    {
        "code": "2922",
        "ort": "Werl"
    },
    {
        "code": "2923",
        "ort": "Herzfeld"
    },
    {
        "code": "2924",
        "ort": "Möhnesee"
    },
    {
        "code": "2925",
        "ort": "Allagen"
    },
    {
        "code": "2927",
        "ort": "Bad"
    },
    {
        "code": "2928",
        "ort": "Ostönnen"
    },
    {
        "code": "2931",
        "ort": "Arnsberg"
    },
    {
        "code": "2932",
        "ort": "Neheim-Hüsten"
    },
    {
        "code": "2933",
        "ort": "Sundern"
    },
    {
        "code": "2934",
        "ort": "Sundern-Altenhellefeld"
    },
    {
        "code": "2935",
        "ort": "Sundern-Hachen"
    },
    {
        "code": "2937",
        "ort": "Arnsberg-Oeventrop"
    },
    {
        "code": "2938",
        "ort": "Ense"
    },
    {
        "code": "2941",
        "ort": "Lippstadt"
    },
    {
        "code": "2942",
        "ort": "Geseke"
    },
    {
        "code": "2943",
        "ort": "Erwitte"
    },
    {
        "code": "2944",
        "ort": "Rietberg-Mastholte"
    },
    {
        "code": "2945",
        "ort": "Lippstadt-Benninghausen"
    },
    {
        "code": "2947",
        "ort": "Anröchte"
    },
    {
        "code": "2948",
        "ort": "Lippstadt-Rebbeke"
    },
    {
        "code": "2951",
        "ort": "Büren"
    },
    {
        "code": "2952",
        "ort": "Rüthen"
    },
    {
        "code": "2953",
        "ort": "Bad"
    },
    {
        "code": "2954",
        "ort": "Rüthen-Oestereiden"
    },
    {
        "code": "2955",
        "ort": "Wewelsburg"
    },
    {
        "code": "2957",
        "ort": "Bad"
    },
    {
        "code": "2958",
        "ort": "Büren-Harth"
    },
    {
        "code": "2961",
        "ort": "Brilon"
    },
    {
        "code": "2962",
        "ort": "Olsberg"
    },
    {
        "code": "2963",
        "ort": "Messinghausen"
    },
    {
        "code": "2964",
        "ort": "Alme"
    },
    {
        "code": "2970",
        "ort": "disused"
    },
    {
        "code": "2971",
        "ort": "Schmallenberg-Dorlar"
    },
    {
        "code": "2972",
        "ort": "Schmallenberg"
    },
    {
        "code": "2973",
        "ort": "Eslohe"
    },
    {
        "code": "2974",
        "ort": "Schmallenberg-Bad"
    },
    {
        "code": "2975",
        "ort": "Schmallenberg-Oberkirchen"
    },
    {
        "code": "2977",
        "ort": "Schmallenberg-Bödefeld"
    },
    {
        "code": "2978",
        "ort": "disused"
    },
    {
        "code": "2979",
        "ort": "disused"
    },
    {
        "code": "2981",
        "ort": "Winterberg"
    },
    {
        "code": "2982",
        "ort": "Medebach"
    },
    {
        "code": "2983",
        "ort": "Winterberg-Siedlinghausen"
    },
    {
        "code": "2984",
        "ort": "Hallenberg"
    },
    {
        "code": "2985",
        "ort": "Winterberg-Niedersfeld"
    },
    {
        "code": "2991",
        "ort": "Marsberg-Bredelar"
    },
    {
        "code": "2992",
        "ort": "Marsberg"
    },
    {
        "code": "2993",
        "ort": "Marsberg-Canstein"
    },
    {
        "code": "2994",
        "ort": "Marsberg-Westheim"
    },
    {
        "code": "30",
        "ort": "Berlin"
    },
    {
        "code": "310",
        "ort": "test"
    },
    {
        "code": "311",
        "ort": "test"
    },
    {
        "code": "32",
        "ort": "non-geographic"
    },
    {
        "code": "3301",
        "ort": "Oranienburg\n3302"
    },
    {
        "code": "3301",
        "ort": "Oranienburg"
    },
    {
        "code": "3302",
        "ort": "Hennigsdorf"
    },
    {
        "code": "3303",
        "ort": "Birkenwerder"
    },
    {
        "code": "3304",
        "ort": "Velten"
    },
    {
        "code": "3305\n33051",
        "ort": "Nassenheide\n33053"
    },
    {
        "code": "33051",
        "ort": "Nassenheide"
    },
    {
        "code": "33053",
        "ort": "Zehlendorf"
    },
    {
        "code": "33054",
        "ort": "Liebenwalde"
    },
    {
        "code": "33055",
        "ort": "Kremmen"
    },
    {
        "code": "33056",
        "ort": "Mühlenbeck"
    },
    {
        "code": "3306",
        "ort": "Gransee"
    },
    {
        "code": "3307",
        "ort": "Zehdenick"
    },
    {
        "code": "3308\n33080",
        "ort": "Marienthal\n33082"
    },
    {
        "code": "33080",
        "ort": "Marienthal"
    },
    {
        "code": "33082",
        "ort": "Menz"
    },
    {
        "code": "33083",
        "ort": "Schulzendorf"
    },
    {
        "code": "33084",
        "ort": "Gutengermendorf"
    },
    {
        "code": "33085",
        "ort": "Seilershof"
    },
    {
        "code": "33086",
        "ort": "Grieben"
    },
    {
        "code": "33087",
        "ort": "Bredereiche"
    },
    {
        "code": "33088",
        "ort": "Falkenthal"
    },
    {
        "code": "33089",
        "ort": "Himmelpfort"
    },
    {
        "code": "3309\n33093",
        "ort": "Fürstenberg/Havel\n33094"
    },
    {
        "code": "33093",
        "ort": "Fürstenberg/Havel"
    },
    {
        "code": "33094",
        "ort": "Löwenberger"
    },
    {
        "code": "3301",
        "ort": "Oranienburg"
    },
    {
        "code": "3302",
        "ort": "Hennigsdorf"
    },
    {
        "code": "3303",
        "ort": "Birkenwerder"
    },
    {
        "code": "3304",
        "ort": "Velten"
    },
    {
        "code": "3305\n33051",
        "ort": "Nassenheide\n33053"
    },
    {
        "code": "33051",
        "ort": "Nassenheide"
    },
    {
        "code": "33053",
        "ort": "Zehlendorf"
    },
    {
        "code": "33054",
        "ort": "Liebenwalde"
    },
    {
        "code": "33055",
        "ort": "Kremmen"
    },
    {
        "code": "33056",
        "ort": "Mühlenbeck"
    },
    {
        "code": "3306",
        "ort": "Gransee"
    },
    {
        "code": "3307",
        "ort": "Zehdenick"
    },
    {
        "code": "3308\n33080",
        "ort": "Marienthal\n33082"
    },
    {
        "code": "33080",
        "ort": "Marienthal"
    },
    {
        "code": "33082",
        "ort": "Menz"
    },
    {
        "code": "33083",
        "ort": "Schulzendorf"
    },
    {
        "code": "33084",
        "ort": "Gutengermendorf"
    },
    {
        "code": "33085",
        "ort": "Seilershof"
    },
    {
        "code": "33086",
        "ort": "Grieben"
    },
    {
        "code": "33087",
        "ort": "Bredereiche"
    },
    {
        "code": "33088",
        "ort": "Falkenthal"
    },
    {
        "code": "33089",
        "ort": "Himmelpfort"
    },
    {
        "code": "3309\n33093",
        "ort": "Fürstenberg/Havel\n33094"
    },
    {
        "code": "33093",
        "ort": "Fürstenberg/Havel"
    },
    {
        "code": "33094",
        "ort": "Löwenberger"
    },
    {
        "code": "33051",
        "ort": "Nassenheide"
    },
    {
        "code": "33053",
        "ort": "Zehlendorf"
    },
    {
        "code": "33054",
        "ort": "Liebenwalde"
    },
    {
        "code": "33055",
        "ort": "Kremmen"
    },
    {
        "code": "33056",
        "ort": "Mühlenbeck"
    },
    {
        "code": "33080",
        "ort": "Marienthal"
    },
    {
        "code": "33082",
        "ort": "Menz"
    },
    {
        "code": "33083",
        "ort": "Schulzendorf"
    },
    {
        "code": "33084",
        "ort": "Gutengermendorf"
    },
    {
        "code": "33085",
        "ort": "Seilershof"
    },
    {
        "code": "33086",
        "ort": "Grieben"
    },
    {
        "code": "33087",
        "ort": "Bredereiche"
    },
    {
        "code": "33088",
        "ort": "Falkenthal"
    },
    {
        "code": "33089",
        "ort": "Himmelpfort"
    },
    {
        "code": "33093",
        "ort": "Fürstenberg/Havel"
    },
    {
        "code": "33094",
        "ort": "Löwenberger"
    },
    {
        "code": "331",
        "ort": "Potsdam"
    },
    {
        "code": "332\n3320\n33200",
        "ort": "Bergholz-Rehbrücke\n33201"
    },
    {
        "code": "3320\n33200",
        "ort": "Bergholz-Rehbrücke\n33201"
    },
    {
        "code": "33200",
        "ort": "Bergholz-Rehbrücke"
    },
    {
        "code": "33201",
        "ort": "Groß"
    },
    {
        "code": "33202",
        "ort": "Töplitz"
    },
    {
        "code": "33203",
        "ort": "Kleinmachnow"
    },
    {
        "code": "33204",
        "ort": "Beelitz"
    },
    {
        "code": "33205",
        "ort": "Michendorf"
    },
    {
        "code": "33206",
        "ort": "Fichtenwalde"
    },
    {
        "code": "33207",
        "ort": "Groß"
    },
    {
        "code": "33208",
        "ort": "Fahrland"
    },
    {
        "code": "33209",
        "ort": "Caputh"
    },
    {
        "code": "3321",
        "ort": "Nauen"
    },
    {
        "code": "3322",
        "ort": "Falkensee"
    },
    {
        "code": "3323\n33230",
        "ort": "Börnicke\n33231"
    },
    {
        "code": "33230",
        "ort": "Börnicke"
    },
    {
        "code": "33231",
        "ort": "Pausin"
    },
    {
        "code": "33232",
        "ort": "Brieselang"
    },
    {
        "code": "33233",
        "ort": "Ketzin"
    },
    {
        "code": "33234",
        "ort": "Wustermark"
    },
    {
        "code": "33235",
        "ort": "Friesack"
    },
    {
        "code": "33237",
        "ort": "Paulinenaue"
    },
    {
        "code": "33238",
        "ort": "Senzke"
    },
    {
        "code": "33239",
        "ort": "Groß"
    },
    {
        "code": "3327",
        "ort": "Werder"
    },
    {
        "code": "3328",
        "ort": "Teltow"
    },
    {
        "code": "3329",
        "ort": "Stahnsdorf"
    },
    {
        "code": "3320\n33200",
        "ort": "Bergholz-Rehbrücke\n33201"
    },
    {
        "code": "33200",
        "ort": "Bergholz-Rehbrücke"
    },
    {
        "code": "33201",
        "ort": "Groß"
    },
    {
        "code": "33202",
        "ort": "Töplitz"
    },
    {
        "code": "33203",
        "ort": "Kleinmachnow"
    },
    {
        "code": "33204",
        "ort": "Beelitz"
    },
    {
        "code": "33205",
        "ort": "Michendorf"
    },
    {
        "code": "33206",
        "ort": "Fichtenwalde"
    },
    {
        "code": "33207",
        "ort": "Groß"
    },
    {
        "code": "33208",
        "ort": "Fahrland"
    },
    {
        "code": "33209",
        "ort": "Caputh"
    },
    {
        "code": "3321",
        "ort": "Nauen"
    },
    {
        "code": "3322",
        "ort": "Falkensee"
    },
    {
        "code": "3323\n33230",
        "ort": "Börnicke\n33231"
    },
    {
        "code": "33230",
        "ort": "Börnicke"
    },
    {
        "code": "33231",
        "ort": "Pausin"
    },
    {
        "code": "33232",
        "ort": "Brieselang"
    },
    {
        "code": "33233",
        "ort": "Ketzin"
    },
    {
        "code": "33234",
        "ort": "Wustermark"
    },
    {
        "code": "33235",
        "ort": "Friesack"
    },
    {
        "code": "33237",
        "ort": "Paulinenaue"
    },
    {
        "code": "33238",
        "ort": "Senzke"
    },
    {
        "code": "33239",
        "ort": "Groß"
    },
    {
        "code": "3327",
        "ort": "Werder"
    },
    {
        "code": "3328",
        "ort": "Teltow"
    },
    {
        "code": "3329",
        "ort": "Stahnsdorf"
    },
    {
        "code": "33200",
        "ort": "Bergholz-Rehbrücke"
    },
    {
        "code": "33201",
        "ort": "Groß"
    },
    {
        "code": "33202",
        "ort": "Töplitz"
    },
    {
        "code": "33203",
        "ort": "Kleinmachnow"
    },
    {
        "code": "33204",
        "ort": "Beelitz"
    },
    {
        "code": "33205",
        "ort": "Michendorf"
    },
    {
        "code": "33206",
        "ort": "Fichtenwalde"
    },
    {
        "code": "33207",
        "ort": "Groß"
    },
    {
        "code": "33208",
        "ort": "Fahrland"
    },
    {
        "code": "33209",
        "ort": "Caputh"
    },
    {
        "code": "33230",
        "ort": "Börnicke"
    },
    {
        "code": "33231",
        "ort": "Pausin"
    },
    {
        "code": "33232",
        "ort": "Brieselang"
    },
    {
        "code": "33233",
        "ort": "Ketzin"
    },
    {
        "code": "33234",
        "ort": "Wustermark"
    },
    {
        "code": "33235",
        "ort": "Friesack"
    },
    {
        "code": "33237",
        "ort": "Paulinenaue"
    },
    {
        "code": "33238",
        "ort": "Senzke"
    },
    {
        "code": "33239",
        "ort": "Groß"
    },
    {
        "code": "3331",
        "ort": "Angermünde\n3332"
    },
    {
        "code": "3331",
        "ort": "Angermünde"
    },
    {
        "code": "3332",
        "ort": "Schwedt"
    },
    {
        "code": "3333\n33331",
        "ort": "Casekow\n33332"
    },
    {
        "code": "33331",
        "ort": "Casekow"
    },
    {
        "code": "33332",
        "ort": "Gartz"
    },
    {
        "code": "33333",
        "ort": "Tantow"
    },
    {
        "code": "33334",
        "ort": "Greiffenberg"
    },
    {
        "code": "33335",
        "ort": "Pinnow"
    },
    {
        "code": "33336",
        "ort": "Passow"
    },
    {
        "code": "33337",
        "ort": "Altkünkendorf"
    },
    {
        "code": "33338",
        "ort": "Stolpe/Oder"
    },
    {
        "code": "3334",
        "ort": "Eberswalde"
    },
    {
        "code": "3335",
        "ort": "Finowfurt"
    },
    {
        "code": "3336\n33361",
        "ort": "Joachimsthal\n33362"
    },
    {
        "code": "33361",
        "ort": "Joachimsthal"
    },
    {
        "code": "33362",
        "ort": "Liepe"
    },
    {
        "code": "33363",
        "ort": "Altenhof"
    },
    {
        "code": "33364",
        "ort": "Groß"
    },
    {
        "code": "33365",
        "ort": "Lüdersdorf"
    },
    {
        "code": "33366",
        "ort": "Chorin"
    },
    {
        "code": "33367",
        "ort": "Friedrichswalde"
    },
    {
        "code": "33368",
        "ort": "Hohensaaten"
    },
    {
        "code": "33369",
        "ort": "Oderberg"
    },
    {
        "code": "3337",
        "ort": "Biesenthal"
    },
    {
        "code": "3338",
        "ort": "Bernau"
    },
    {
        "code": "3339\n33393",
        "ort": "Groß"
    },
    {
        "code": "33393",
        "ort": "Groß"
    },
    {
        "code": "33394",
        "ort": "Blumberg"
    },
    {
        "code": "33395",
        "ort": "Zerpenschleuse"
    },
    {
        "code": "33396",
        "ort": "Klosterfelde"
    },
    {
        "code": "33397",
        "ort": "Wandlitz"
    },
    {
        "code": "33398",
        "ort": "Werneuchen"
    },
    {
        "code": "3331",
        "ort": "Angermünde"
    },
    {
        "code": "3332",
        "ort": "Schwedt"
    },
    {
        "code": "3333\n33331",
        "ort": "Casekow\n33332"
    },
    {
        "code": "33331",
        "ort": "Casekow"
    },
    {
        "code": "33332",
        "ort": "Gartz"
    },
    {
        "code": "33333",
        "ort": "Tantow"
    },
    {
        "code": "33334",
        "ort": "Greiffenberg"
    },
    {
        "code": "33335",
        "ort": "Pinnow"
    },
    {
        "code": "33336",
        "ort": "Passow"
    },
    {
        "code": "33337",
        "ort": "Altkünkendorf"
    },
    {
        "code": "33338",
        "ort": "Stolpe/Oder"
    },
    {
        "code": "3334",
        "ort": "Eberswalde"
    },
    {
        "code": "3335",
        "ort": "Finowfurt"
    },
    {
        "code": "3336\n33361",
        "ort": "Joachimsthal\n33362"
    },
    {
        "code": "33361",
        "ort": "Joachimsthal"
    },
    {
        "code": "33362",
        "ort": "Liepe"
    },
    {
        "code": "33363",
        "ort": "Altenhof"
    },
    {
        "code": "33364",
        "ort": "Groß"
    },
    {
        "code": "33365",
        "ort": "Lüdersdorf"
    },
    {
        "code": "33366",
        "ort": "Chorin"
    },
    {
        "code": "33367",
        "ort": "Friedrichswalde"
    },
    {
        "code": "33368",
        "ort": "Hohensaaten"
    },
    {
        "code": "33369",
        "ort": "Oderberg"
    },
    {
        "code": "3337",
        "ort": "Biesenthal"
    },
    {
        "code": "3338",
        "ort": "Bernau"
    },
    {
        "code": "3339\n33393",
        "ort": "Groß"
    },
    {
        "code": "33393",
        "ort": "Groß"
    },
    {
        "code": "33394",
        "ort": "Blumberg"
    },
    {
        "code": "33395",
        "ort": "Zerpenschleuse"
    },
    {
        "code": "33396",
        "ort": "Klosterfelde"
    },
    {
        "code": "33397",
        "ort": "Wandlitz"
    },
    {
        "code": "33398",
        "ort": "Werneuchen"
    },
    {
        "code": "33331",
        "ort": "Casekow"
    },
    {
        "code": "33332",
        "ort": "Gartz"
    },
    {
        "code": "33333",
        "ort": "Tantow"
    },
    {
        "code": "33334",
        "ort": "Greiffenberg"
    },
    {
        "code": "33335",
        "ort": "Pinnow"
    },
    {
        "code": "33336",
        "ort": "Passow"
    },
    {
        "code": "33337",
        "ort": "Altkünkendorf"
    },
    {
        "code": "33338",
        "ort": "Stolpe/Oder"
    },
    {
        "code": "33361",
        "ort": "Joachimsthal"
    },
    {
        "code": "33362",
        "ort": "Liepe"
    },
    {
        "code": "33363",
        "ort": "Altenhof"
    },
    {
        "code": "33364",
        "ort": "Groß"
    },
    {
        "code": "33365",
        "ort": "Lüdersdorf"
    },
    {
        "code": "33366",
        "ort": "Chorin"
    },
    {
        "code": "33367",
        "ort": "Friedrichswalde"
    },
    {
        "code": "33368",
        "ort": "Hohensaaten"
    },
    {
        "code": "33369",
        "ort": "Oderberg"
    },
    {
        "code": "33393",
        "ort": "Groß"
    },
    {
        "code": "33394",
        "ort": "Blumberg"
    },
    {
        "code": "33395",
        "ort": "Zerpenschleuse"
    },
    {
        "code": "33396",
        "ort": "Klosterfelde"
    },
    {
        "code": "33397",
        "ort": "Wandlitz"
    },
    {
        "code": "33398",
        "ort": "Werneuchen"
    },
    {
        "code": "3341",
        "ort": "Strausberg\n3342"
    },
    {
        "code": "3341",
        "ort": "Strausberg"
    },
    {
        "code": "3342",
        "ort": "Neuenhagen"
    },
    {
        "code": "3343\n33432",
        "ort": "Müncheberg\n33433"
    },
    {
        "code": "33432",
        "ort": "Müncheberg"
    },
    {
        "code": "33433",
        "ort": "Buckow"
    },
    {
        "code": "33434",
        "ort": "Herzfelde"
    },
    {
        "code": "33435",
        "ort": "Rehfelde"
    },
    {
        "code": "33436",
        "ort": "Prötzel"
    },
    {
        "code": "33437",
        "ort": "Reichenberg"
    },
    {
        "code": "33438",
        "ort": "Altlandsberg"
    },
    {
        "code": "33439",
        "ort": "Fredersdorf-Vogelsdorf"
    },
    {
        "code": "3344",
        "ort": "Bad"
    },
    {
        "code": "3345\n33451",
        "ort": "Heckelberg\n33452"
    },
    {
        "code": "33451",
        "ort": "Heckelberg"
    },
    {
        "code": "33452",
        "ort": "Neulewin"
    },
    {
        "code": "33454",
        "ort": "Wölsickendorf/Wollenber"
    },
    {
        "code": "33456",
        "ort": "Wriezen"
    },
    {
        "code": "33457",
        "ort": "Altreetz"
    },
    {
        "code": "33458",
        "ort": "Falkenberg"
    },
    {
        "code": "3346",
        "ort": "Seelow"
    },
    {
        "code": "3347",
        "ort": "--\n33470"
    },
    {
        "code": "33470",
        "ort": "Lietzen"
    },
    {
        "code": "33472",
        "ort": "Golzow"
    },
    {
        "code": "33473",
        "ort": "Zechin"
    },
    {
        "code": "33474",
        "ort": "Neutrebbin"
    },
    {
        "code": "33475",
        "ort": "Letschin"
    },
    {
        "code": "33476",
        "ort": "Neuhardenberg"
    },
    {
        "code": "33477",
        "ort": "Trebnitz"
    },
    {
        "code": "33478",
        "ort": "Groß"
    },
    {
        "code": "33479",
        "ort": "Küstrin-Kietz"
    },
    {
        "code": "3341",
        "ort": "Strausberg"
    },
    {
        "code": "3342",
        "ort": "Neuenhagen"
    },
    {
        "code": "3343\n33432",
        "ort": "Müncheberg\n33433"
    },
    {
        "code": "33432",
        "ort": "Müncheberg"
    },
    {
        "code": "33433",
        "ort": "Buckow"
    },
    {
        "code": "33434",
        "ort": "Herzfelde"
    },
    {
        "code": "33435",
        "ort": "Rehfelde"
    },
    {
        "code": "33436",
        "ort": "Prötzel"
    },
    {
        "code": "33437",
        "ort": "Reichenberg"
    },
    {
        "code": "33438",
        "ort": "Altlandsberg"
    },
    {
        "code": "33439",
        "ort": "Fredersdorf-Vogelsdorf"
    },
    {
        "code": "3344",
        "ort": "Bad"
    },
    {
        "code": "3345\n33451",
        "ort": "Heckelberg\n33452"
    },
    {
        "code": "33451",
        "ort": "Heckelberg"
    },
    {
        "code": "33452",
        "ort": "Neulewin"
    },
    {
        "code": "33454",
        "ort": "Wölsickendorf/Wollenber"
    },
    {
        "code": "33456",
        "ort": "Wriezen"
    },
    {
        "code": "33457",
        "ort": "Altreetz"
    },
    {
        "code": "33458",
        "ort": "Falkenberg"
    },
    {
        "code": "3346",
        "ort": "Seelow"
    },
    {
        "code": "3347",
        "ort": "--\n33470"
    },
    {
        "code": "33470",
        "ort": "Lietzen"
    },
    {
        "code": "33472",
        "ort": "Golzow"
    },
    {
        "code": "33473",
        "ort": "Zechin"
    },
    {
        "code": "33474",
        "ort": "Neutrebbin"
    },
    {
        "code": "33475",
        "ort": "Letschin"
    },
    {
        "code": "33476",
        "ort": "Neuhardenberg"
    },
    {
        "code": "33477",
        "ort": "Trebnitz"
    },
    {
        "code": "33478",
        "ort": "Groß"
    },
    {
        "code": "33479",
        "ort": "Küstrin-Kietz"
    },
    {
        "code": "33432",
        "ort": "Müncheberg"
    },
    {
        "code": "33433",
        "ort": "Buckow"
    },
    {
        "code": "33434",
        "ort": "Herzfelde"
    },
    {
        "code": "33435",
        "ort": "Rehfelde"
    },
    {
        "code": "33436",
        "ort": "Prötzel"
    },
    {
        "code": "33437",
        "ort": "Reichenberg"
    },
    {
        "code": "33438",
        "ort": "Altlandsberg"
    },
    {
        "code": "33439",
        "ort": "Fredersdorf-Vogelsdorf"
    },
    {
        "code": "33451",
        "ort": "Heckelberg"
    },
    {
        "code": "33452",
        "ort": "Neulewin"
    },
    {
        "code": "33454",
        "ort": "Wölsickendorf/Wollenber"
    },
    {
        "code": "33456",
        "ort": "Wriezen"
    },
    {
        "code": "33457",
        "ort": "Altreetz"
    },
    {
        "code": "33458",
        "ort": "Falkenberg"
    },
    {
        "code": "33470",
        "ort": "Lietzen"
    },
    {
        "code": "33472",
        "ort": "Golzow"
    },
    {
        "code": "33473",
        "ort": "Zechin"
    },
    {
        "code": "33474",
        "ort": "Neutrebbin"
    },
    {
        "code": "33475",
        "ort": "Letschin"
    },
    {
        "code": "33476",
        "ort": "Neuhardenberg"
    },
    {
        "code": "33477",
        "ort": "Trebnitz"
    },
    {
        "code": "33478",
        "ort": "Groß"
    },
    {
        "code": "33479",
        "ort": "Küstrin-Kietz"
    },
    {
        "code": "335",
        "ort": "Frankfurt"
    },
    {
        "code": "336\n3360\n33601",
        "ort": "Podelzig\n33602"
    },
    {
        "code": "3360\n33601",
        "ort": "Podelzig\n33602"
    },
    {
        "code": "33601",
        "ort": "Podelzig"
    },
    {
        "code": "33602",
        "ort": "Alt"
    },
    {
        "code": "33603",
        "ort": "Falkenhagen"
    },
    {
        "code": "33604",
        "ort": "Lebus"
    },
    {
        "code": "33605",
        "ort": "Boossen"
    },
    {
        "code": "33606",
        "ort": "Müllrose"
    },
    {
        "code": "33607",
        "ort": "Briesen"
    },
    {
        "code": "33608",
        "ort": "Jacobsdorf"
    },
    {
        "code": "33609",
        "ort": "Brieskow-Finkenheerd"
    },
    {
        "code": "3361",
        "ort": "Fürstenwalde/Spree"
    },
    {
        "code": "3362",
        "ort": "Erkner"
    },
    {
        "code": "3363\n33631",
        "ort": "Bad"
    },
    {
        "code": "33631",
        "ort": "Bad"
    },
    {
        "code": "33632",
        "ort": "Hangelsberg"
    },
    {
        "code": "33633",
        "ort": "Spreenhagen"
    },
    {
        "code": "33634",
        "ort": "Berkenbrück"
    },
    {
        "code": "33635",
        "ort": "Arensdorf"
    },
    {
        "code": "33636",
        "ort": "Steinhöfel"
    },
    {
        "code": "33637",
        "ort": "Beerfelde"
    },
    {
        "code": "33638",
        "ort": "Rüdersdorf"
    },
    {
        "code": "3364",
        "ort": "Eisenhüttenstadt"
    },
    {
        "code": "3365\n33652",
        "ort": "Neuzelle\n33653"
    },
    {
        "code": "33652",
        "ort": "Neuzelle"
    },
    {
        "code": "33653",
        "ort": "Ziltendorf"
    },
    {
        "code": "33654",
        "ort": "Fünfeichen"
    },
    {
        "code": "33655",
        "ort": "Grunow"
    },
    {
        "code": "33656",
        "ort": "Bahro"
    },
    {
        "code": "33657",
        "ort": "Steinsdorf"
    },
    {
        "code": "3366",
        "ort": "Beeskow"
    },
    {
        "code": "3367\n33671",
        "ort": "Lieberose\n33672"
    },
    {
        "code": "33671",
        "ort": "Lieberose"
    },
    {
        "code": "33672",
        "ort": "Pfaffendorf"
    },
    {
        "code": "33673",
        "ort": "Weichensdorf"
    },
    {
        "code": "33674",
        "ort": "Trebatsch"
    },
    {
        "code": "33675",
        "ort": "Tauche"
    },
    {
        "code": "33676",
        "ort": "Friedland"
    },
    {
        "code": "33677",
        "ort": "Glienicke"
    },
    {
        "code": "33678",
        "ort": "Storkow"
    },
    {
        "code": "33679",
        "ort": "Wendisch"
    },
    {
        "code": "3360\n33601",
        "ort": "Podelzig\n33602"
    },
    {
        "code": "33601",
        "ort": "Podelzig"
    },
    {
        "code": "33602",
        "ort": "Alt"
    },
    {
        "code": "33603",
        "ort": "Falkenhagen"
    },
    {
        "code": "33604",
        "ort": "Lebus"
    },
    {
        "code": "33605",
        "ort": "Boossen"
    },
    {
        "code": "33606",
        "ort": "Müllrose"
    },
    {
        "code": "33607",
        "ort": "Briesen"
    },
    {
        "code": "33608",
        "ort": "Jacobsdorf"
    },
    {
        "code": "33609",
        "ort": "Brieskow-Finkenheerd"
    },
    {
        "code": "3361",
        "ort": "Fürstenwalde/Spree"
    },
    {
        "code": "3362",
        "ort": "Erkner"
    },
    {
        "code": "3363\n33631",
        "ort": "Bad"
    },
    {
        "code": "33631",
        "ort": "Bad"
    },
    {
        "code": "33632",
        "ort": "Hangelsberg"
    },
    {
        "code": "33633",
        "ort": "Spreenhagen"
    },
    {
        "code": "33634",
        "ort": "Berkenbrück"
    },
    {
        "code": "33635",
        "ort": "Arensdorf"
    },
    {
        "code": "33636",
        "ort": "Steinhöfel"
    },
    {
        "code": "33637",
        "ort": "Beerfelde"
    },
    {
        "code": "33638",
        "ort": "Rüdersdorf"
    },
    {
        "code": "3364",
        "ort": "Eisenhüttenstadt"
    },
    {
        "code": "3365\n33652",
        "ort": "Neuzelle\n33653"
    },
    {
        "code": "33652",
        "ort": "Neuzelle"
    },
    {
        "code": "33653",
        "ort": "Ziltendorf"
    },
    {
        "code": "33654",
        "ort": "Fünfeichen"
    },
    {
        "code": "33655",
        "ort": "Grunow"
    },
    {
        "code": "33656",
        "ort": "Bahro"
    },
    {
        "code": "33657",
        "ort": "Steinsdorf"
    },
    {
        "code": "3366",
        "ort": "Beeskow"
    },
    {
        "code": "3367\n33671",
        "ort": "Lieberose\n33672"
    },
    {
        "code": "33671",
        "ort": "Lieberose"
    },
    {
        "code": "33672",
        "ort": "Pfaffendorf"
    },
    {
        "code": "33673",
        "ort": "Weichensdorf"
    },
    {
        "code": "33674",
        "ort": "Trebatsch"
    },
    {
        "code": "33675",
        "ort": "Tauche"
    },
    {
        "code": "33676",
        "ort": "Friedland"
    },
    {
        "code": "33677",
        "ort": "Glienicke"
    },
    {
        "code": "33678",
        "ort": "Storkow"
    },
    {
        "code": "33679",
        "ort": "Wendisch"
    },
    {
        "code": "33601",
        "ort": "Podelzig"
    },
    {
        "code": "33602",
        "ort": "Alt"
    },
    {
        "code": "33603",
        "ort": "Falkenhagen"
    },
    {
        "code": "33604",
        "ort": "Lebus"
    },
    {
        "code": "33605",
        "ort": "Boossen"
    },
    {
        "code": "33606",
        "ort": "Müllrose"
    },
    {
        "code": "33607",
        "ort": "Briesen"
    },
    {
        "code": "33608",
        "ort": "Jacobsdorf"
    },
    {
        "code": "33609",
        "ort": "Brieskow-Finkenheerd"
    },
    {
        "code": "33631",
        "ort": "Bad"
    },
    {
        "code": "33632",
        "ort": "Hangelsberg"
    },
    {
        "code": "33633",
        "ort": "Spreenhagen"
    },
    {
        "code": "33634",
        "ort": "Berkenbrück"
    },
    {
        "code": "33635",
        "ort": "Arensdorf"
    },
    {
        "code": "33636",
        "ort": "Steinhöfel"
    },
    {
        "code": "33637",
        "ort": "Beerfelde"
    },
    {
        "code": "33638",
        "ort": "Rüdersdorf"
    },
    {
        "code": "33652",
        "ort": "Neuzelle"
    },
    {
        "code": "33653",
        "ort": "Ziltendorf"
    },
    {
        "code": "33654",
        "ort": "Fünfeichen"
    },
    {
        "code": "33655",
        "ort": "Grunow"
    },
    {
        "code": "33656",
        "ort": "Bahro"
    },
    {
        "code": "33657",
        "ort": "Steinsdorf"
    },
    {
        "code": "33671",
        "ort": "Lieberose"
    },
    {
        "code": "33672",
        "ort": "Pfaffendorf"
    },
    {
        "code": "33673",
        "ort": "Weichensdorf"
    },
    {
        "code": "33674",
        "ort": "Trebatsch"
    },
    {
        "code": "33675",
        "ort": "Tauche"
    },
    {
        "code": "33676",
        "ort": "Friedland"
    },
    {
        "code": "33677",
        "ort": "Glienicke"
    },
    {
        "code": "33678",
        "ort": "Storkow"
    },
    {
        "code": "33679",
        "ort": "Wendisch"
    },
    {
        "code": "3370\n33701",
        "ort": "Großbeeren\n33702"
    },
    {
        "code": "3370\n33701",
        "ort": "Großbeeren\n33702"
    },
    {
        "code": "33701",
        "ort": "Großbeeren"
    },
    {
        "code": "33702",
        "ort": "Wünsdorf"
    },
    {
        "code": "33703",
        "ort": "Am"
    },
    {
        "code": "33704",
        "ort": "Baruth/Mark"
    },
    {
        "code": "33708",
        "ort": "Rangsdorf"
    },
    {
        "code": "3371",
        "ort": "Luckenwalde"
    },
    {
        "code": "3372",
        "ort": "Jüterbog"
    },
    {
        "code": "3373\n33731",
        "ort": "Trebbin\n33732"
    },
    {
        "code": "33731",
        "ort": "Trebbin"
    },
    {
        "code": "33732",
        "ort": "Hennickendorf"
    },
    {
        "code": "33733",
        "ort": "Stülpe"
    },
    {
        "code": "33734",
        "ort": "Felgentreu"
    },
    {
        "code": "3374\n33741",
        "ort": "Niedergörsdorf\n33742"
    },
    {
        "code": "33741",
        "ort": "Niedergörsdorf"
    },
    {
        "code": "33742",
        "ort": "Oehna"
    },
    {
        "code": "33743",
        "ort": "Blönsdorf"
    },
    {
        "code": "33744",
        "ort": "Hohenseefeld"
    },
    {
        "code": "33745",
        "ort": "Petkus"
    },
    {
        "code": "33746",
        "ort": "Werbig"
    },
    {
        "code": "33747",
        "ort": "Marzahna"
    },
    {
        "code": "33748",
        "ort": "Treuenbrietzen"
    },
    {
        "code": "3375",
        "ort": "Königs"
    },
    {
        "code": "3376\n33760",
        "ort": "Münchehofe\n33762"
    },
    {
        "code": "33760",
        "ort": "Münchehofe"
    },
    {
        "code": "33762",
        "ort": "Zeuthen"
    },
    {
        "code": "33763",
        "ort": "Bestensee"
    },
    {
        "code": "33764",
        "ort": "Mittenwalde"
    },
    {
        "code": "33765",
        "ort": "Märkisch"
    },
    {
        "code": "33766",
        "ort": "Teupitz"
    },
    {
        "code": "33767",
        "ort": "Friedersdorf"
    },
    {
        "code": "33768",
        "ort": "Prieros"
    },
    {
        "code": "33769",
        "ort": "Töpchin"
    },
    {
        "code": "3377",
        "ort": "Zossen"
    },
    {
        "code": "3378",
        "ort": "Ludwigsfelde"
    },
    {
        "code": "3379",
        "ort": "Mahlow"
    },
    {
        "code": "3370\n33701",
        "ort": "Großbeeren\n33702"
    },
    {
        "code": "33701",
        "ort": "Großbeeren"
    },
    {
        "code": "33702",
        "ort": "Wünsdorf"
    },
    {
        "code": "33703",
        "ort": "Am"
    },
    {
        "code": "33704",
        "ort": "Baruth/Mark"
    },
    {
        "code": "33708",
        "ort": "Rangsdorf"
    },
    {
        "code": "3371",
        "ort": "Luckenwalde"
    },
    {
        "code": "3372",
        "ort": "Jüterbog"
    },
    {
        "code": "3373\n33731",
        "ort": "Trebbin\n33732"
    },
    {
        "code": "33731",
        "ort": "Trebbin"
    },
    {
        "code": "33732",
        "ort": "Hennickendorf"
    },
    {
        "code": "33733",
        "ort": "Stülpe"
    },
    {
        "code": "33734",
        "ort": "Felgentreu"
    },
    {
        "code": "3374\n33741",
        "ort": "Niedergörsdorf\n33742"
    },
    {
        "code": "33741",
        "ort": "Niedergörsdorf"
    },
    {
        "code": "33742",
        "ort": "Oehna"
    },
    {
        "code": "33743",
        "ort": "Blönsdorf"
    },
    {
        "code": "33744",
        "ort": "Hohenseefeld"
    },
    {
        "code": "33745",
        "ort": "Petkus"
    },
    {
        "code": "33746",
        "ort": "Werbig"
    },
    {
        "code": "33747",
        "ort": "Marzahna"
    },
    {
        "code": "33748",
        "ort": "Treuenbrietzen"
    },
    {
        "code": "3375",
        "ort": "Königs"
    },
    {
        "code": "3376\n33760",
        "ort": "Münchehofe\n33762"
    },
    {
        "code": "33760",
        "ort": "Münchehofe"
    },
    {
        "code": "33762",
        "ort": "Zeuthen"
    },
    {
        "code": "33763",
        "ort": "Bestensee"
    },
    {
        "code": "33764",
        "ort": "Mittenwalde"
    },
    {
        "code": "33765",
        "ort": "Märkisch"
    },
    {
        "code": "33766",
        "ort": "Teupitz"
    },
    {
        "code": "33767",
        "ort": "Friedersdorf"
    },
    {
        "code": "33768",
        "ort": "Prieros"
    },
    {
        "code": "33769",
        "ort": "Töpchin"
    },
    {
        "code": "3377",
        "ort": "Zossen"
    },
    {
        "code": "3378",
        "ort": "Ludwigsfelde"
    },
    {
        "code": "3379",
        "ort": "Mahlow"
    },
    {
        "code": "33701",
        "ort": "Großbeeren"
    },
    {
        "code": "33702",
        "ort": "Wünsdorf"
    },
    {
        "code": "33703",
        "ort": "Am"
    },
    {
        "code": "33704",
        "ort": "Baruth/Mark"
    },
    {
        "code": "33708",
        "ort": "Rangsdorf"
    },
    {
        "code": "33731",
        "ort": "Trebbin"
    },
    {
        "code": "33732",
        "ort": "Hennickendorf"
    },
    {
        "code": "33733",
        "ort": "Stülpe"
    },
    {
        "code": "33734",
        "ort": "Felgentreu"
    },
    {
        "code": "33741",
        "ort": "Niedergörsdorf"
    },
    {
        "code": "33742",
        "ort": "Oehna"
    },
    {
        "code": "33743",
        "ort": "Blönsdorf"
    },
    {
        "code": "33744",
        "ort": "Hohenseefeld"
    },
    {
        "code": "33745",
        "ort": "Petkus"
    },
    {
        "code": "33746",
        "ort": "Werbig"
    },
    {
        "code": "33747",
        "ort": "Marzahna"
    },
    {
        "code": "33748",
        "ort": "Treuenbrietzen"
    },
    {
        "code": "33760",
        "ort": "Münchehofe"
    },
    {
        "code": "33762",
        "ort": "Zeuthen"
    },
    {
        "code": "33763",
        "ort": "Bestensee"
    },
    {
        "code": "33764",
        "ort": "Mittenwalde"
    },
    {
        "code": "33765",
        "ort": "Märkisch"
    },
    {
        "code": "33766",
        "ort": "Teupitz"
    },
    {
        "code": "33767",
        "ort": "Friedersdorf"
    },
    {
        "code": "33768",
        "ort": "Prieros"
    },
    {
        "code": "33769",
        "ort": "Töpchin"
    },
    {
        "code": "3381",
        "ort": "Brandenburg"
    },
    {
        "code": "3381",
        "ort": "Brandenburg"
    },
    {
        "code": "3382",
        "ort": "Lehnin"
    },
    {
        "code": "3383\n33830",
        "ort": "Ziesar\n33831"
    },
    {
        "code": "33830",
        "ort": "Ziesar"
    },
    {
        "code": "33831",
        "ort": "Weseram"
    },
    {
        "code": "33832",
        "ort": "Rogäsen"
    },
    {
        "code": "33833",
        "ort": "Wollin"
    },
    {
        "code": "33834",
        "ort": "Pritzerbe"
    },
    {
        "code": "33835",
        "ort": "Golzow"
    },
    {
        "code": "33836",
        "ort": "Butzow"
    },
    {
        "code": "33837",
        "ort": "Brielow"
    },
    {
        "code": "33838",
        "ort": "Päwesin"
    },
    {
        "code": "33839",
        "ort": "Wusterwitz"
    },
    {
        "code": "3384\n33841",
        "ort": "Belzig\n33843"
    },
    {
        "code": "33841",
        "ort": "Belzig"
    },
    {
        "code": "33843",
        "ort": "Niemegk"
    },
    {
        "code": "33844",
        "ort": "Brück"
    },
    {
        "code": "33845",
        "ort": "Borkheide"
    },
    {
        "code": "33846",
        "ort": "Dippmannsdorf"
    },
    {
        "code": "33847",
        "ort": "Görzke"
    },
    {
        "code": "33848",
        "ort": "Raben"
    },
    {
        "code": "33849",
        "ort": "Wiesenburg/Mark"
    },
    {
        "code": "3385",
        "ort": "Rathenow"
    },
    {
        "code": "3386",
        "ort": "Premnitz"
    },
    {
        "code": "3387\n33870",
        "ort": "Zollchow"
    },
    {
        "code": "33870",
        "ort": "Zollchow"
    },
    {
        "code": "33872",
        "ort": "Hohennauen"
    },
    {
        "code": "33873",
        "ort": "Großwudicke"
    },
    {
        "code": "33874",
        "ort": "Stechow"
    },
    {
        "code": "33875",
        "ort": "Rhinow"
    },
    {
        "code": "33876",
        "ort": "Buschow"
    },
    {
        "code": "33877",
        "ort": "Nitzahn"
    },
    {
        "code": "33878",
        "ort": "Nennhausen"
    },
    {
        "code": "3381",
        "ort": "Brandenburg"
    },
    {
        "code": "3382",
        "ort": "Lehnin"
    },
    {
        "code": "3383\n33830",
        "ort": "Ziesar\n33831"
    },
    {
        "code": "33830",
        "ort": "Ziesar"
    },
    {
        "code": "33831",
        "ort": "Weseram"
    },
    {
        "code": "33832",
        "ort": "Rogäsen"
    },
    {
        "code": "33833",
        "ort": "Wollin"
    },
    {
        "code": "33834",
        "ort": "Pritzerbe"
    },
    {
        "code": "33835",
        "ort": "Golzow"
    },
    {
        "code": "33836",
        "ort": "Butzow"
    },
    {
        "code": "33837",
        "ort": "Brielow"
    },
    {
        "code": "33838",
        "ort": "Päwesin"
    },
    {
        "code": "33839",
        "ort": "Wusterwitz"
    },
    {
        "code": "3384\n33841",
        "ort": "Belzig\n33843"
    },
    {
        "code": "33841",
        "ort": "Belzig"
    },
    {
        "code": "33843",
        "ort": "Niemegk"
    },
    {
        "code": "33844",
        "ort": "Brück"
    },
    {
        "code": "33845",
        "ort": "Borkheide"
    },
    {
        "code": "33846",
        "ort": "Dippmannsdorf"
    },
    {
        "code": "33847",
        "ort": "Görzke"
    },
    {
        "code": "33848",
        "ort": "Raben"
    },
    {
        "code": "33849",
        "ort": "Wiesenburg/Mark"
    },
    {
        "code": "3385",
        "ort": "Rathenow"
    },
    {
        "code": "3386",
        "ort": "Premnitz"
    },
    {
        "code": "3387\n33870",
        "ort": "Zollchow"
    },
    {
        "code": "33870",
        "ort": "Zollchow"
    },
    {
        "code": "33872",
        "ort": "Hohennauen"
    },
    {
        "code": "33873",
        "ort": "Großwudicke"
    },
    {
        "code": "33874",
        "ort": "Stechow"
    },
    {
        "code": "33875",
        "ort": "Rhinow"
    },
    {
        "code": "33876",
        "ort": "Buschow"
    },
    {
        "code": "33877",
        "ort": "Nitzahn"
    },
    {
        "code": "33878",
        "ort": "Nennhausen"
    },
    {
        "code": "33830",
        "ort": "Ziesar"
    },
    {
        "code": "33831",
        "ort": "Weseram"
    },
    {
        "code": "33832",
        "ort": "Rogäsen"
    },
    {
        "code": "33833",
        "ort": "Wollin"
    },
    {
        "code": "33834",
        "ort": "Pritzerbe"
    },
    {
        "code": "33835",
        "ort": "Golzow"
    },
    {
        "code": "33836",
        "ort": "Butzow"
    },
    {
        "code": "33837",
        "ort": "Brielow"
    },
    {
        "code": "33838",
        "ort": "Päwesin"
    },
    {
        "code": "33839",
        "ort": "Wusterwitz"
    },
    {
        "code": "33841",
        "ort": "Belzig"
    },
    {
        "code": "33843",
        "ort": "Niemegk"
    },
    {
        "code": "33844",
        "ort": "Brück"
    },
    {
        "code": "33845",
        "ort": "Borkheide"
    },
    {
        "code": "33846",
        "ort": "Dippmannsdorf"
    },
    {
        "code": "33847",
        "ort": "Görzke"
    },
    {
        "code": "33848",
        "ort": "Raben"
    },
    {
        "code": "33849",
        "ort": "Wiesenburg/Mark"
    },
    {
        "code": "33870",
        "ort": "Zollchow"
    },
    {
        "code": "33872",
        "ort": "Hohennauen"
    },
    {
        "code": "33873",
        "ort": "Großwudicke"
    },
    {
        "code": "33874",
        "ort": "Stechow"
    },
    {
        "code": "33875",
        "ort": "Rhinow"
    },
    {
        "code": "33876",
        "ort": "Buschow"
    },
    {
        "code": "33877",
        "ort": "Nitzahn"
    },
    {
        "code": "33878",
        "ort": "Nennhausen"
    },
    {
        "code": "3391",
        "ort": "Neuruppin\n3392\n33920"
    },
    {
        "code": "3391",
        "ort": "Neuruppin"
    },
    {
        "code": "3392\n33920",
        "ort": "Walsleben"
    },
    {
        "code": "33920",
        "ort": "Walsleben"
    },
    {
        "code": "33921",
        "ort": "Zechlinerhütte"
    },
    {
        "code": "33922",
        "ort": "Karwesee"
    },
    {
        "code": "33923",
        "ort": "Flecken"
    },
    {
        "code": "33924",
        "ort": "Rägelin"
    },
    {
        "code": "33925",
        "ort": "Wustrau-Altfriesack"
    },
    {
        "code": "33926",
        "ort": "Herzberg"
    },
    {
        "code": "33928",
        "ort": "Wildberg"
    },
    {
        "code": "33929",
        "ort": "Gühlen-Glienicke"
    },
    {
        "code": "3393\n33931",
        "ort": "Rheinsberg\n33932"
    },
    {
        "code": "33931",
        "ort": "Rheinsberg"
    },
    {
        "code": "33932",
        "ort": "Fehrbellin"
    },
    {
        "code": "33933",
        "ort": "Lindow"
    },
    {
        "code": "3394",
        "ort": "Wittstock/Dosse"
    },
    {
        "code": "3395",
        "ort": "Pritzwalk"
    },
    {
        "code": "3396\n33962",
        "ort": "Heiligengrabe\n33963"
    },
    {
        "code": "33962",
        "ort": "Heiligengrabe"
    },
    {
        "code": "33963",
        "ort": "Wulfersdorf"
    },
    {
        "code": "33964",
        "ort": "Fretzdorf"
    },
    {
        "code": "33965",
        "ort": "Herzsprung"
    },
    {
        "code": "33966",
        "ort": "Dranse"
    },
    {
        "code": "33967",
        "ort": "Freyenstein"
    },
    {
        "code": "33968",
        "ort": "Meyenburg"
    },
    {
        "code": "33969",
        "ort": "Stepenitz"
    },
    {
        "code": "3397\n33970",
        "ort": "Neustadt"
    },
    {
        "code": "33970",
        "ort": "Neustadt"
    },
    {
        "code": "33971",
        "ort": "Kyritz"
    },
    {
        "code": "33972",
        "ort": "Breddin"
    },
    {
        "code": "33973",
        "ort": "Zernitz"
    },
    {
        "code": "33974",
        "ort": "Dessow"
    },
    {
        "code": "33975",
        "ort": "Dannenwalde"
    },
    {
        "code": "33976",
        "ort": "Wutike"
    },
    {
        "code": "33977",
        "ort": "Gumtow"
    },
    {
        "code": "33978",
        "ort": "Segeletz"
    },
    {
        "code": "33979",
        "ort": "Wusterhausen/Dosse"
    },
    {
        "code": "3398\n33981",
        "ort": "Putlitz\n33982"
    },
    {
        "code": "33981",
        "ort": "Putlitz"
    },
    {
        "code": "33982",
        "ort": "Hoppenrade"
    },
    {
        "code": "33983",
        "ort": "Groß"
    },
    {
        "code": "33984",
        "ort": "Blumenthal"
    },
    {
        "code": "33986",
        "ort": "Falkenhagen"
    },
    {
        "code": "33989",
        "ort": "Sadenbeck"
    },
    {
        "code": "3391",
        "ort": "Neuruppin"
    },
    {
        "code": "3392\n33920",
        "ort": "Walsleben"
    },
    {
        "code": "33920",
        "ort": "Walsleben"
    },
    {
        "code": "33921",
        "ort": "Zechlinerhütte"
    },
    {
        "code": "33922",
        "ort": "Karwesee"
    },
    {
        "code": "33923",
        "ort": "Flecken"
    },
    {
        "code": "33924",
        "ort": "Rägelin"
    },
    {
        "code": "33925",
        "ort": "Wustrau-Altfriesack"
    },
    {
        "code": "33926",
        "ort": "Herzberg"
    },
    {
        "code": "33928",
        "ort": "Wildberg"
    },
    {
        "code": "33929",
        "ort": "Gühlen-Glienicke"
    },
    {
        "code": "3393\n33931",
        "ort": "Rheinsberg\n33932"
    },
    {
        "code": "33931",
        "ort": "Rheinsberg"
    },
    {
        "code": "33932",
        "ort": "Fehrbellin"
    },
    {
        "code": "33933",
        "ort": "Lindow"
    },
    {
        "code": "3394",
        "ort": "Wittstock/Dosse"
    },
    {
        "code": "3395",
        "ort": "Pritzwalk"
    },
    {
        "code": "3396\n33962",
        "ort": "Heiligengrabe\n33963"
    },
    {
        "code": "33962",
        "ort": "Heiligengrabe"
    },
    {
        "code": "33963",
        "ort": "Wulfersdorf"
    },
    {
        "code": "33964",
        "ort": "Fretzdorf"
    },
    {
        "code": "33965",
        "ort": "Herzsprung"
    },
    {
        "code": "33966",
        "ort": "Dranse"
    },
    {
        "code": "33967",
        "ort": "Freyenstein"
    },
    {
        "code": "33968",
        "ort": "Meyenburg"
    },
    {
        "code": "33969",
        "ort": "Stepenitz"
    },
    {
        "code": "3397\n33970",
        "ort": "Neustadt"
    },
    {
        "code": "33970",
        "ort": "Neustadt"
    },
    {
        "code": "33971",
        "ort": "Kyritz"
    },
    {
        "code": "33972",
        "ort": "Breddin"
    },
    {
        "code": "33973",
        "ort": "Zernitz"
    },
    {
        "code": "33974",
        "ort": "Dessow"
    },
    {
        "code": "33975",
        "ort": "Dannenwalde"
    },
    {
        "code": "33976",
        "ort": "Wutike"
    },
    {
        "code": "33977",
        "ort": "Gumtow"
    },
    {
        "code": "33978",
        "ort": "Segeletz"
    },
    {
        "code": "33979",
        "ort": "Wusterhausen/Dosse"
    },
    {
        "code": "3398\n33981",
        "ort": "Putlitz\n33982"
    },
    {
        "code": "33981",
        "ort": "Putlitz"
    },
    {
        "code": "33982",
        "ort": "Hoppenrade"
    },
    {
        "code": "33983",
        "ort": "Groß"
    },
    {
        "code": "33984",
        "ort": "Blumenthal"
    },
    {
        "code": "33986",
        "ort": "Falkenhagen"
    },
    {
        "code": "33989",
        "ort": "Sadenbeck"
    },
    {
        "code": "33920",
        "ort": "Walsleben"
    },
    {
        "code": "33921",
        "ort": "Zechlinerhütte"
    },
    {
        "code": "33922",
        "ort": "Karwesee"
    },
    {
        "code": "33923",
        "ort": "Flecken"
    },
    {
        "code": "33924",
        "ort": "Rägelin"
    },
    {
        "code": "33925",
        "ort": "Wustrau-Altfriesack"
    },
    {
        "code": "33926",
        "ort": "Herzberg"
    },
    {
        "code": "33928",
        "ort": "Wildberg"
    },
    {
        "code": "33929",
        "ort": "Gühlen-Glienicke"
    },
    {
        "code": "33931",
        "ort": "Rheinsberg"
    },
    {
        "code": "33932",
        "ort": "Fehrbellin"
    },
    {
        "code": "33933",
        "ort": "Lindow"
    },
    {
        "code": "33962",
        "ort": "Heiligengrabe"
    },
    {
        "code": "33963",
        "ort": "Wulfersdorf"
    },
    {
        "code": "33964",
        "ort": "Fretzdorf"
    },
    {
        "code": "33965",
        "ort": "Herzsprung"
    },
    {
        "code": "33966",
        "ort": "Dranse"
    },
    {
        "code": "33967",
        "ort": "Freyenstein"
    },
    {
        "code": "33968",
        "ort": "Meyenburg"
    },
    {
        "code": "33969",
        "ort": "Stepenitz"
    },
    {
        "code": "33970",
        "ort": "Neustadt"
    },
    {
        "code": "33971",
        "ort": "Kyritz"
    },
    {
        "code": "33972",
        "ort": "Breddin"
    },
    {
        "code": "33973",
        "ort": "Zernitz"
    },
    {
        "code": "33974",
        "ort": "Dessow"
    },
    {
        "code": "33975",
        "ort": "Dannenwalde"
    },
    {
        "code": "33976",
        "ort": "Wutike"
    },
    {
        "code": "33977",
        "ort": "Gumtow"
    },
    {
        "code": "33978",
        "ort": "Segeletz"
    },
    {
        "code": "33979",
        "ort": "Wusterhausen/Dosse"
    },
    {
        "code": "33981",
        "ort": "Putlitz"
    },
    {
        "code": "33982",
        "ort": "Hoppenrade"
    },
    {
        "code": "33983",
        "ort": "Groß"
    },
    {
        "code": "33984",
        "ort": "Blumenthal"
    },
    {
        "code": "33986",
        "ort": "Falkenhagen"
    },
    {
        "code": "33989",
        "ort": "Sadenbeck"
    },
    {
        "code": "340",
        "ort": "Dessau"
    },
    {
        "code": "341",
        "ort": "Leipzig"
    },
    {
        "code": "342\n3420\n34202",
        "ort": "Delitzsch\n34203"
    },
    {
        "code": "3420\n34202",
        "ort": "Delitzsch\n34203"
    },
    {
        "code": "34202",
        "ort": "Delitzsch"
    },
    {
        "code": "34203",
        "ort": "Zwenkau"
    },
    {
        "code": "34204",
        "ort": "Schkeuditz"
    },
    {
        "code": "34205",
        "ort": "Markranstädt"
    },
    {
        "code": "34206",
        "ort": "Rötha"
    },
    {
        "code": "34207",
        "ort": "Zwochau"
    },
    {
        "code": "34208",
        "ort": "Löbnitz"
    },
    {
        "code": "3421",
        "ort": "Torgau"
    },
    {
        "code": "3422\n34221",
        "ort": "Schildau\n34222"
    },
    {
        "code": "34221",
        "ort": "Schildau"
    },
    {
        "code": "34222",
        "ort": "Arzberg"
    },
    {
        "code": "34223",
        "ort": "Dommitzsch"
    },
    {
        "code": "34224",
        "ort": "Belgern"
    },
    {
        "code": "3423",
        "ort": "Eilenburg"
    },
    {
        "code": "3424\n34241",
        "ort": "Jesewitz\n34242"
    },
    {
        "code": "34241",
        "ort": "Jesewitz"
    },
    {
        "code": "34242",
        "ort": "Hohenprießnitz"
    },
    {
        "code": "34243",
        "ort": "Bad"
    },
    {
        "code": "34244",
        "ort": "Mockrehna"
    },
    {
        "code": "3425",
        "ort": "Wurzen"
    },
    {
        "code": "3426\n34261",
        "ort": "Kühren"
    },
    {
        "code": "34261",
        "ort": "Kühren"
    },
    {
        "code": "34262",
        "ort": "Falkenhain"
    },
    {
        "code": "34263",
        "ort": "Großzschepa"
    },
    {
        "code": "3429\n34291",
        "ort": "Borsdorf\n34292"
    },
    {
        "code": "34291",
        "ort": "Borsdorf"
    },
    {
        "code": "34292",
        "ort": "Brandis"
    },
    {
        "code": "34293",
        "ort": "Naunhof"
    },
    {
        "code": "34294",
        "ort": "Rackwitz"
    },
    {
        "code": "34295",
        "ort": "Krensitz"
    },
    {
        "code": "34296",
        "ort": "Groitzsch"
    },
    {
        "code": "34297",
        "ort": "Liebertwolkwitz"
    },
    {
        "code": "34298",
        "ort": "Taucha"
    },
    {
        "code": "34299",
        "ort": "Gaschwitz"
    },
    {
        "code": "343\n3431",
        "ort": "Döbeln\n3432\n34321"
    },
    {
        "code": "3431",
        "ort": "Döbeln"
    },
    {
        "code": "3432\n34321",
        "ort": "Leisnig\n34322"
    },
    {
        "code": "34321",
        "ort": "Leisnig"
    },
    {
        "code": "34322",
        "ort": "Roßwein"
    },
    {
        "code": "34324",
        "ort": "Ostrau,"
    },
    {
        "code": "34325",
        "ort": "Lüttewitz"
    },
    {
        "code": "34327",
        "ort": "Waldheim"
    },
    {
        "code": "34328",
        "ort": "Hartha"
    },
    {
        "code": "3433",
        "ort": "Borna"
    },
    {
        "code": "3434\n34341",
        "ort": "Geithain\n34342"
    },
    {
        "code": "34341",
        "ort": "Geithain"
    },
    {
        "code": "34342",
        "ort": "Neukieritzsch"
    },
    {
        "code": "34343",
        "ort": "Regis-Breitingen"
    },
    {
        "code": "34344",
        "ort": "Kohren-Sahlis"
    },
    {
        "code": "34345",
        "ort": "Bad"
    },
    {
        "code": "34346",
        "ort": "Narsdorf"
    },
    {
        "code": "34347",
        "ort": "Oelzschau"
    },
    {
        "code": "34348",
        "ort": "Frohburg"
    },
    {
        "code": "3435",
        "ort": "Oschatz"
    },
    {
        "code": "3436\n34361",
        "ort": "Dahlen"
    },
    {
        "code": "34361",
        "ort": "Dahlen"
    },
    {
        "code": "34362",
        "ort": "Mügeln"
    },
    {
        "code": "34363",
        "ort": "Cavertitz"
    },
    {
        "code": "34364",
        "ort": "Wermsdorf"
    },
    {
        "code": "3437",
        "ort": "Grimma"
    },
    {
        "code": "3438\n34381",
        "ort": "Colditz\n34382"
    },
    {
        "code": "34381",
        "ort": "Colditz"
    },
    {
        "code": "34382",
        "ort": "Nerchau"
    },
    {
        "code": "34383",
        "ort": "Trebsen"
    },
    {
        "code": "34384",
        "ort": "Großbothen"
    },
    {
        "code": "34385",
        "ort": "Mutzschen"
    },
    {
        "code": "34386",
        "ort": "Dürrweitzschen"
    },
    {
        "code": "344\n3441",
        "ort": "Zeitz\n3443"
    },
    {
        "code": "3441",
        "ort": "Zeitz"
    },
    {
        "code": "3443",
        "ort": "Weißenfels"
    },
    {
        "code": "3445",
        "ort": "Naumburg"
    },
    {
        "code": "34463",
        "ort": "Prießnitz"
    },
    {
        "code": "3447",
        "ort": "Altenburg"
    },
    {
        "code": "3448",
        "ort": "Meuselwitz"
    },
    {
        "code": "3449\n34491",
        "ort": "Schmölln\n34492"
    },
    {
        "code": "34491",
        "ort": "Schmölln"
    },
    {
        "code": "34492",
        "ort": "Lucka"
    },
    {
        "code": "34493",
        "ort": "Gößnitz"
    },
    {
        "code": "34494",
        "ort": "Ehrenhain"
    },
    {
        "code": "34495",
        "ort": "Dobitschen"
    },
    {
        "code": "34496",
        "ort": "Nöbdenitz"
    },
    {
        "code": "34497",
        "ort": "Langenleuba-Niederhain"
    },
    {
        "code": "34498",
        "ort": "Rositz"
    },
    {
        "code": "345",
        "ort": "Halle"
    },
    {
        "code": "346\n3460\n34600",
        "ort": "Ostrau"
    },
    {
        "code": "3460\n34600",
        "ort": "Ostrau"
    },
    {
        "code": "34600",
        "ort": "Ostrau"
    },
    {
        "code": "34601",
        "ort": "Teutschenthal"
    },
    {
        "code": "34602",
        "ort": "Landsberg"
    },
    {
        "code": "34603",
        "ort": "Nauendorf"
    },
    {
        "code": "34604",
        "ort": "Niemberg"
    },
    {
        "code": "34605",
        "ort": "Kabelsketal-Gröbers"
    },
    {
        "code": "34606",
        "ort": "Teicha"
    },
    {
        "code": "34607",
        "ort": "Wettin"
    },
    {
        "code": "34609",
        "ort": "Salzmünde"
    },
    {
        "code": "3461",
        "ort": "Merseburg"
    },
    {
        "code": "3462",
        "ort": "Bad"
    },
    {
        "code": "3463\n34632",
        "ort": "Mücheln"
    },
    {
        "code": "34632",
        "ort": "Mücheln"
    },
    {
        "code": "34633",
        "ort": "Braunsbedra"
    },
    {
        "code": "34635",
        "ort": "Bad"
    },
    {
        "code": "34636",
        "ort": "Schafstädt"
    },
    {
        "code": "34637",
        "ort": "Frankleben"
    },
    {
        "code": "34638",
        "ort": "Zöschen"
    },
    {
        "code": "34639",
        "ort": "Wallendorf"
    },
    {
        "code": "3464",
        "ort": "Sangerhausen"
    },
    {
        "code": "3465\n34651",
        "ort": "Rossla\n34652"
    },
    {
        "code": "34651",
        "ort": "Rossla"
    },
    {
        "code": "34652",
        "ort": "Allstedt"
    },
    {
        "code": "34653",
        "ort": "Rottleberode"
    },
    {
        "code": "34654",
        "ort": "Stolberg"
    },
    {
        "code": "34656",
        "ort": "Wallhausen,"
    },
    {
        "code": "34658",
        "ort": "Hayn"
    },
    {
        "code": "34659",
        "ort": "Blankenheim"
    },
    {
        "code": "3466",
        "ort": "Artern"
    },
    {
        "code": "3467\n34671",
        "ort": "Bad"
    },
    {
        "code": "34671",
        "ort": "Bad"
    },
    {
        "code": "34672",
        "ort": "Roßleben"
    },
    {
        "code": "34673",
        "ort": "Heldrungen"
    },
    {
        "code": "3469\n34691",
        "ort": "Könnern\n34692"
    },
    {
        "code": "34691",
        "ort": "Könnern"
    },
    {
        "code": "34692",
        "ort": "Alsleben"
    },
    {
        "code": "347\n3471",
        "ort": "Bernburg\n3472\n34721"
    },
    {
        "code": "3471",
        "ort": "Bernburg"
    },
    {
        "code": "3472\n34721",
        "ort": "Nienburg\n34722"
    },
    {
        "code": "34721",
        "ort": "Nienburg"
    },
    {
        "code": "34722",
        "ort": "Preußlitz"
    },
    {
        "code": "3473",
        "ort": "Aschersleben"
    },
    {
        "code": "3474\n34741",
        "ort": "Frose\n34742"
    },
    {
        "code": "34741",
        "ort": "Frose"
    },
    {
        "code": "34742",
        "ort": "Sylda"
    },
    {
        "code": "34743",
        "ort": "Ermsleben"
    },
    {
        "code": "34745",
        "ort": "Winningen"
    },
    {
        "code": "34746",
        "ort": "Giersleben"
    },
    {
        "code": "3475",
        "ort": "Lutherstadt"
    },
    {
        "code": "3476",
        "ort": "Hettstedt"
    },
    {
        "code": "3477\n34771",
        "ort": "Querfurt\n34772"
    },
    {
        "code": "34771",
        "ort": "Querfurt"
    },
    {
        "code": "34772",
        "ort": "Helbra"
    },
    {
        "code": "34773",
        "ort": "Schwittersdorf"
    },
    {
        "code": "34774",
        "ort": "Röblingen"
    },
    {
        "code": "34775",
        "ort": "Wippra"
    },
    {
        "code": "34776",
        "ort": "Rothenschirmbach"
    },
    {
        "code": "34779",
        "ort": "Abberode"
    },
    {
        "code": "3478\n34781",
        "ort": "Greifenhagen\n34782"
    },
    {
        "code": "34781",
        "ort": "Greifenhagen"
    },
    {
        "code": "34782",
        "ort": "Mansfeld-Südharz"
    },
    {
        "code": "34783",
        "ort": "Gerbstedt"
    },
    {
        "code": "34785",
        "ort": "Sandersleben"
    },
    {
        "code": "349\n3490\n34901",
        "ort": "Rosslau\n34903"
    },
    {
        "code": "3490\n34901",
        "ort": "Rosslau\n34903"
    },
    {
        "code": "34901",
        "ort": "Rosslau"
    },
    {
        "code": "34903",
        "ort": "Coswig"
    },
    {
        "code": "34904",
        "ort": "Oranienbaum"
    },
    {
        "code": "34905",
        "ort": "Wörlitz"
    },
    {
        "code": "34906",
        "ort": "Raguhn"
    },
    {
        "code": "34907",
        "ort": "Jeber-Bergfrieden"
    },
    {
        "code": "34909",
        "ort": "Aken"
    },
    {
        "code": "3491",
        "ort": "Lutherstadt"
    },
    {
        "code": "3492\n34920",
        "ort": "Kropstädt\n34921"
    },
    {
        "code": "34920",
        "ort": "Kropstädt"
    },
    {
        "code": "34921",
        "ort": "Kemberg"
    },
    {
        "code": "34922",
        "ort": "Mühlanger"
    },
    {
        "code": "34923",
        "ort": "Cobbelsdorf"
    },
    {
        "code": "34924",
        "ort": "Zahna"
    },
    {
        "code": "34925",
        "ort": "Bad"
    },
    {
        "code": "34926",
        "ort": "Pretzsch"
    },
    {
        "code": "34927",
        "ort": "Globig"
    },
    {
        "code": "34928",
        "ort": "Seegrehna"
    },
    {
        "code": "34929",
        "ort": "Straach"
    },
    {
        "code": "3493",
        "ort": "Bitterfeld"
    },
    {
        "code": "3494",
        "ort": "Wolfen"
    },
    {
        "code": "3495\n34953",
        "ort": "Gräfenhainichen\n34954"
    },
    {
        "code": "34953",
        "ort": "Gräfenhainichen"
    },
    {
        "code": "34954",
        "ort": "Roitzsch"
    },
    {
        "code": "34955",
        "ort": "Gossa"
    },
    {
        "code": "34956",
        "ort": "Zörbig"
    },
    {
        "code": "3496",
        "ort": "Köthen"
    },
    {
        "code": "3497\n34973",
        "ort": "Osternienburg\n34975"
    },
    {
        "code": "34973",
        "ort": "Osternienburg"
    },
    {
        "code": "34975",
        "ort": "Görzig"
    },
    {
        "code": "34976",
        "ort": "Gröbzig"
    },
    {
        "code": "34977",
        "ort": "Quellendorf"
    },
    {
        "code": "34978",
        "ort": "Radegast"
    },
    {
        "code": "34979",
        "ort": "Wulfen"
    },
    {
        "code": "3420\n34202",
        "ort": "Delitzsch\n34203"
    },
    {
        "code": "34202",
        "ort": "Delitzsch"
    },
    {
        "code": "34203",
        "ort": "Zwenkau"
    },
    {
        "code": "34204",
        "ort": "Schkeuditz"
    },
    {
        "code": "34205",
        "ort": "Markranstädt"
    },
    {
        "code": "34206",
        "ort": "Rötha"
    },
    {
        "code": "34207",
        "ort": "Zwochau"
    },
    {
        "code": "34208",
        "ort": "Löbnitz"
    },
    {
        "code": "3421",
        "ort": "Torgau"
    },
    {
        "code": "3422\n34221",
        "ort": "Schildau\n34222"
    },
    {
        "code": "34221",
        "ort": "Schildau"
    },
    {
        "code": "34222",
        "ort": "Arzberg"
    },
    {
        "code": "34223",
        "ort": "Dommitzsch"
    },
    {
        "code": "34224",
        "ort": "Belgern"
    },
    {
        "code": "3423",
        "ort": "Eilenburg"
    },
    {
        "code": "3424\n34241",
        "ort": "Jesewitz\n34242"
    },
    {
        "code": "34241",
        "ort": "Jesewitz"
    },
    {
        "code": "34242",
        "ort": "Hohenprießnitz"
    },
    {
        "code": "34243",
        "ort": "Bad"
    },
    {
        "code": "34244",
        "ort": "Mockrehna"
    },
    {
        "code": "3425",
        "ort": "Wurzen"
    },
    {
        "code": "3426\n34261",
        "ort": "Kühren"
    },
    {
        "code": "34261",
        "ort": "Kühren"
    },
    {
        "code": "34262",
        "ort": "Falkenhain"
    },
    {
        "code": "34263",
        "ort": "Großzschepa"
    },
    {
        "code": "3429\n34291",
        "ort": "Borsdorf\n34292"
    },
    {
        "code": "34291",
        "ort": "Borsdorf"
    },
    {
        "code": "34292",
        "ort": "Brandis"
    },
    {
        "code": "34293",
        "ort": "Naunhof"
    },
    {
        "code": "34294",
        "ort": "Rackwitz"
    },
    {
        "code": "34295",
        "ort": "Krensitz"
    },
    {
        "code": "34296",
        "ort": "Groitzsch"
    },
    {
        "code": "34297",
        "ort": "Liebertwolkwitz"
    },
    {
        "code": "34298",
        "ort": "Taucha"
    },
    {
        "code": "34299",
        "ort": "Gaschwitz"
    },
    {
        "code": "34202",
        "ort": "Delitzsch"
    },
    {
        "code": "34203",
        "ort": "Zwenkau"
    },
    {
        "code": "34204",
        "ort": "Schkeuditz"
    },
    {
        "code": "34205",
        "ort": "Markranstädt"
    },
    {
        "code": "34206",
        "ort": "Rötha"
    },
    {
        "code": "34207",
        "ort": "Zwochau"
    },
    {
        "code": "34208",
        "ort": "Löbnitz"
    },
    {
        "code": "34221",
        "ort": "Schildau"
    },
    {
        "code": "34222",
        "ort": "Arzberg"
    },
    {
        "code": "34223",
        "ort": "Dommitzsch"
    },
    {
        "code": "34224",
        "ort": "Belgern"
    },
    {
        "code": "34241",
        "ort": "Jesewitz"
    },
    {
        "code": "34242",
        "ort": "Hohenprießnitz"
    },
    {
        "code": "34243",
        "ort": "Bad"
    },
    {
        "code": "34244",
        "ort": "Mockrehna"
    },
    {
        "code": "34261",
        "ort": "Kühren"
    },
    {
        "code": "34262",
        "ort": "Falkenhain"
    },
    {
        "code": "34263",
        "ort": "Großzschepa"
    },
    {
        "code": "34291",
        "ort": "Borsdorf"
    },
    {
        "code": "34292",
        "ort": "Brandis"
    },
    {
        "code": "34293",
        "ort": "Naunhof"
    },
    {
        "code": "34294",
        "ort": "Rackwitz"
    },
    {
        "code": "34295",
        "ort": "Krensitz"
    },
    {
        "code": "34296",
        "ort": "Groitzsch"
    },
    {
        "code": "34297",
        "ort": "Liebertwolkwitz"
    },
    {
        "code": "34298",
        "ort": "Taucha"
    },
    {
        "code": "34299",
        "ort": "Gaschwitz"
    },
    {
        "code": "3431",
        "ort": "Döbeln"
    },
    {
        "code": "3432\n34321",
        "ort": "Leisnig\n34322"
    },
    {
        "code": "34321",
        "ort": "Leisnig"
    },
    {
        "code": "34322",
        "ort": "Roßwein"
    },
    {
        "code": "34324",
        "ort": "Ostrau,"
    },
    {
        "code": "34325",
        "ort": "Lüttewitz"
    },
    {
        "code": "34327",
        "ort": "Waldheim"
    },
    {
        "code": "34328",
        "ort": "Hartha"
    },
    {
        "code": "3433",
        "ort": "Borna"
    },
    {
        "code": "3434\n34341",
        "ort": "Geithain\n34342"
    },
    {
        "code": "34341",
        "ort": "Geithain"
    },
    {
        "code": "34342",
        "ort": "Neukieritzsch"
    },
    {
        "code": "34343",
        "ort": "Regis-Breitingen"
    },
    {
        "code": "34344",
        "ort": "Kohren-Sahlis"
    },
    {
        "code": "34345",
        "ort": "Bad"
    },
    {
        "code": "34346",
        "ort": "Narsdorf"
    },
    {
        "code": "34347",
        "ort": "Oelzschau"
    },
    {
        "code": "34348",
        "ort": "Frohburg"
    },
    {
        "code": "3435",
        "ort": "Oschatz"
    },
    {
        "code": "3436\n34361",
        "ort": "Dahlen"
    },
    {
        "code": "34361",
        "ort": "Dahlen"
    },
    {
        "code": "34362",
        "ort": "Mügeln"
    },
    {
        "code": "34363",
        "ort": "Cavertitz"
    },
    {
        "code": "34364",
        "ort": "Wermsdorf"
    },
    {
        "code": "3437",
        "ort": "Grimma"
    },
    {
        "code": "3438\n34381",
        "ort": "Colditz\n34382"
    },
    {
        "code": "34381",
        "ort": "Colditz"
    },
    {
        "code": "34382",
        "ort": "Nerchau"
    },
    {
        "code": "34383",
        "ort": "Trebsen"
    },
    {
        "code": "34384",
        "ort": "Großbothen"
    },
    {
        "code": "34385",
        "ort": "Mutzschen"
    },
    {
        "code": "34386",
        "ort": "Dürrweitzschen"
    },
    {
        "code": "34321",
        "ort": "Leisnig"
    },
    {
        "code": "34322",
        "ort": "Roßwein"
    },
    {
        "code": "34324",
        "ort": "Ostrau,"
    },
    {
        "code": "34325",
        "ort": "Lüttewitz"
    },
    {
        "code": "34327",
        "ort": "Waldheim"
    },
    {
        "code": "34328",
        "ort": "Hartha"
    },
    {
        "code": "34341",
        "ort": "Geithain"
    },
    {
        "code": "34342",
        "ort": "Neukieritzsch"
    },
    {
        "code": "34343",
        "ort": "Regis-Breitingen"
    },
    {
        "code": "34344",
        "ort": "Kohren-Sahlis"
    },
    {
        "code": "34345",
        "ort": "Bad"
    },
    {
        "code": "34346",
        "ort": "Narsdorf"
    },
    {
        "code": "34347",
        "ort": "Oelzschau"
    },
    {
        "code": "34348",
        "ort": "Frohburg"
    },
    {
        "code": "34361",
        "ort": "Dahlen"
    },
    {
        "code": "34362",
        "ort": "Mügeln"
    },
    {
        "code": "34363",
        "ort": "Cavertitz"
    },
    {
        "code": "34364",
        "ort": "Wermsdorf"
    },
    {
        "code": "34381",
        "ort": "Colditz"
    },
    {
        "code": "34382",
        "ort": "Nerchau"
    },
    {
        "code": "34383",
        "ort": "Trebsen"
    },
    {
        "code": "34384",
        "ort": "Großbothen"
    },
    {
        "code": "34385",
        "ort": "Mutzschen"
    },
    {
        "code": "34386",
        "ort": "Dürrweitzschen"
    },
    {
        "code": "3441",
        "ort": "Zeitz"
    },
    {
        "code": "3443",
        "ort": "Weißenfels"
    },
    {
        "code": "3445",
        "ort": "Naumburg"
    },
    {
        "code": "34463",
        "ort": "Prießnitz"
    },
    {
        "code": "3447",
        "ort": "Altenburg"
    },
    {
        "code": "3448",
        "ort": "Meuselwitz"
    },
    {
        "code": "3449\n34491",
        "ort": "Schmölln\n34492"
    },
    {
        "code": "34491",
        "ort": "Schmölln"
    },
    {
        "code": "34492",
        "ort": "Lucka"
    },
    {
        "code": "34493",
        "ort": "Gößnitz"
    },
    {
        "code": "34494",
        "ort": "Ehrenhain"
    },
    {
        "code": "34495",
        "ort": "Dobitschen"
    },
    {
        "code": "34496",
        "ort": "Nöbdenitz"
    },
    {
        "code": "34497",
        "ort": "Langenleuba-Niederhain"
    },
    {
        "code": "34498",
        "ort": "Rositz"
    },
    {
        "code": "34491",
        "ort": "Schmölln"
    },
    {
        "code": "34492",
        "ort": "Lucka"
    },
    {
        "code": "34493",
        "ort": "Gößnitz"
    },
    {
        "code": "34494",
        "ort": "Ehrenhain"
    },
    {
        "code": "34495",
        "ort": "Dobitschen"
    },
    {
        "code": "34496",
        "ort": "Nöbdenitz"
    },
    {
        "code": "34497",
        "ort": "Langenleuba-Niederhain"
    },
    {
        "code": "34498",
        "ort": "Rositz"
    },
    {
        "code": "3460\n34600",
        "ort": "Ostrau"
    },
    {
        "code": "34600",
        "ort": "Ostrau"
    },
    {
        "code": "34601",
        "ort": "Teutschenthal"
    },
    {
        "code": "34602",
        "ort": "Landsberg"
    },
    {
        "code": "34603",
        "ort": "Nauendorf"
    },
    {
        "code": "34604",
        "ort": "Niemberg"
    },
    {
        "code": "34605",
        "ort": "Kabelsketal-Gröbers"
    },
    {
        "code": "34606",
        "ort": "Teicha"
    },
    {
        "code": "34607",
        "ort": "Wettin"
    },
    {
        "code": "34609",
        "ort": "Salzmünde"
    },
    {
        "code": "3461",
        "ort": "Merseburg"
    },
    {
        "code": "3462",
        "ort": "Bad"
    },
    {
        "code": "3463\n34632",
        "ort": "Mücheln"
    },
    {
        "code": "34632",
        "ort": "Mücheln"
    },
    {
        "code": "34633",
        "ort": "Braunsbedra"
    },
    {
        "code": "34635",
        "ort": "Bad"
    },
    {
        "code": "34636",
        "ort": "Schafstädt"
    },
    {
        "code": "34637",
        "ort": "Frankleben"
    },
    {
        "code": "34638",
        "ort": "Zöschen"
    },
    {
        "code": "34639",
        "ort": "Wallendorf"
    },
    {
        "code": "3464",
        "ort": "Sangerhausen"
    },
    {
        "code": "3465\n34651",
        "ort": "Rossla\n34652"
    },
    {
        "code": "34651",
        "ort": "Rossla"
    },
    {
        "code": "34652",
        "ort": "Allstedt"
    },
    {
        "code": "34653",
        "ort": "Rottleberode"
    },
    {
        "code": "34654",
        "ort": "Stolberg"
    },
    {
        "code": "34656",
        "ort": "Wallhausen,"
    },
    {
        "code": "34658",
        "ort": "Hayn"
    },
    {
        "code": "34659",
        "ort": "Blankenheim"
    },
    {
        "code": "3466",
        "ort": "Artern"
    },
    {
        "code": "3467\n34671",
        "ort": "Bad"
    },
    {
        "code": "34671",
        "ort": "Bad"
    },
    {
        "code": "34672",
        "ort": "Roßleben"
    },
    {
        "code": "34673",
        "ort": "Heldrungen"
    },
    {
        "code": "3469\n34691",
        "ort": "Könnern\n34692"
    },
    {
        "code": "34691",
        "ort": "Könnern"
    },
    {
        "code": "34692",
        "ort": "Alsleben"
    },
    {
        "code": "34600",
        "ort": "Ostrau"
    },
    {
        "code": "34601",
        "ort": "Teutschenthal"
    },
    {
        "code": "34602",
        "ort": "Landsberg"
    },
    {
        "code": "34603",
        "ort": "Nauendorf"
    },
    {
        "code": "34604",
        "ort": "Niemberg"
    },
    {
        "code": "34605",
        "ort": "Kabelsketal-Gröbers"
    },
    {
        "code": "34606",
        "ort": "Teicha"
    },
    {
        "code": "34607",
        "ort": "Wettin"
    },
    {
        "code": "34609",
        "ort": "Salzmünde"
    },
    {
        "code": "34632",
        "ort": "Mücheln"
    },
    {
        "code": "34633",
        "ort": "Braunsbedra"
    },
    {
        "code": "34635",
        "ort": "Bad"
    },
    {
        "code": "34636",
        "ort": "Schafstädt"
    },
    {
        "code": "34637",
        "ort": "Frankleben"
    },
    {
        "code": "34638",
        "ort": "Zöschen"
    },
    {
        "code": "34639",
        "ort": "Wallendorf"
    },
    {
        "code": "34651",
        "ort": "Rossla"
    },
    {
        "code": "34652",
        "ort": "Allstedt"
    },
    {
        "code": "34653",
        "ort": "Rottleberode"
    },
    {
        "code": "34654",
        "ort": "Stolberg"
    },
    {
        "code": "34656",
        "ort": "Wallhausen,"
    },
    {
        "code": "34658",
        "ort": "Hayn"
    },
    {
        "code": "34659",
        "ort": "Blankenheim"
    },
    {
        "code": "34671",
        "ort": "Bad"
    },
    {
        "code": "34672",
        "ort": "Roßleben"
    },
    {
        "code": "34673",
        "ort": "Heldrungen"
    },
    {
        "code": "34691",
        "ort": "Könnern"
    },
    {
        "code": "34692",
        "ort": "Alsleben"
    },
    {
        "code": "3471",
        "ort": "Bernburg"
    },
    {
        "code": "3472\n34721",
        "ort": "Nienburg\n34722"
    },
    {
        "code": "34721",
        "ort": "Nienburg"
    },
    {
        "code": "34722",
        "ort": "Preußlitz"
    },
    {
        "code": "3473",
        "ort": "Aschersleben"
    },
    {
        "code": "3474\n34741",
        "ort": "Frose\n34742"
    },
    {
        "code": "34741",
        "ort": "Frose"
    },
    {
        "code": "34742",
        "ort": "Sylda"
    },
    {
        "code": "34743",
        "ort": "Ermsleben"
    },
    {
        "code": "34745",
        "ort": "Winningen"
    },
    {
        "code": "34746",
        "ort": "Giersleben"
    },
    {
        "code": "3475",
        "ort": "Lutherstadt"
    },
    {
        "code": "3476",
        "ort": "Hettstedt"
    },
    {
        "code": "3477\n34771",
        "ort": "Querfurt\n34772"
    },
    {
        "code": "34771",
        "ort": "Querfurt"
    },
    {
        "code": "34772",
        "ort": "Helbra"
    },
    {
        "code": "34773",
        "ort": "Schwittersdorf"
    },
    {
        "code": "34774",
        "ort": "Röblingen"
    },
    {
        "code": "34775",
        "ort": "Wippra"
    },
    {
        "code": "34776",
        "ort": "Rothenschirmbach"
    },
    {
        "code": "34779",
        "ort": "Abberode"
    },
    {
        "code": "3478\n34781",
        "ort": "Greifenhagen\n34782"
    },
    {
        "code": "34781",
        "ort": "Greifenhagen"
    },
    {
        "code": "34782",
        "ort": "Mansfeld-Südharz"
    },
    {
        "code": "34783",
        "ort": "Gerbstedt"
    },
    {
        "code": "34785",
        "ort": "Sandersleben"
    },
    {
        "code": "34721",
        "ort": "Nienburg"
    },
    {
        "code": "34722",
        "ort": "Preußlitz"
    },
    {
        "code": "34741",
        "ort": "Frose"
    },
    {
        "code": "34742",
        "ort": "Sylda"
    },
    {
        "code": "34743",
        "ort": "Ermsleben"
    },
    {
        "code": "34745",
        "ort": "Winningen"
    },
    {
        "code": "34746",
        "ort": "Giersleben"
    },
    {
        "code": "34771",
        "ort": "Querfurt"
    },
    {
        "code": "34772",
        "ort": "Helbra"
    },
    {
        "code": "34773",
        "ort": "Schwittersdorf"
    },
    {
        "code": "34774",
        "ort": "Röblingen"
    },
    {
        "code": "34775",
        "ort": "Wippra"
    },
    {
        "code": "34776",
        "ort": "Rothenschirmbach"
    },
    {
        "code": "34779",
        "ort": "Abberode"
    },
    {
        "code": "34781",
        "ort": "Greifenhagen"
    },
    {
        "code": "34782",
        "ort": "Mansfeld-Südharz"
    },
    {
        "code": "34783",
        "ort": "Gerbstedt"
    },
    {
        "code": "34785",
        "ort": "Sandersleben"
    },
    {
        "code": "3490\n34901",
        "ort": "Rosslau\n34903"
    },
    {
        "code": "34901",
        "ort": "Rosslau"
    },
    {
        "code": "34903",
        "ort": "Coswig"
    },
    {
        "code": "34904",
        "ort": "Oranienbaum"
    },
    {
        "code": "34905",
        "ort": "Wörlitz"
    },
    {
        "code": "34906",
        "ort": "Raguhn"
    },
    {
        "code": "34907",
        "ort": "Jeber-Bergfrieden"
    },
    {
        "code": "34909",
        "ort": "Aken"
    },
    {
        "code": "3491",
        "ort": "Lutherstadt"
    },
    {
        "code": "3492\n34920",
        "ort": "Kropstädt\n34921"
    },
    {
        "code": "34920",
        "ort": "Kropstädt"
    },
    {
        "code": "34921",
        "ort": "Kemberg"
    },
    {
        "code": "34922",
        "ort": "Mühlanger"
    },
    {
        "code": "34923",
        "ort": "Cobbelsdorf"
    },
    {
        "code": "34924",
        "ort": "Zahna"
    },
    {
        "code": "34925",
        "ort": "Bad"
    },
    {
        "code": "34926",
        "ort": "Pretzsch"
    },
    {
        "code": "34927",
        "ort": "Globig"
    },
    {
        "code": "34928",
        "ort": "Seegrehna"
    },
    {
        "code": "34929",
        "ort": "Straach"
    },
    {
        "code": "3493",
        "ort": "Bitterfeld"
    },
    {
        "code": "3494",
        "ort": "Wolfen"
    },
    {
        "code": "3495\n34953",
        "ort": "Gräfenhainichen\n34954"
    },
    {
        "code": "34953",
        "ort": "Gräfenhainichen"
    },
    {
        "code": "34954",
        "ort": "Roitzsch"
    },
    {
        "code": "34955",
        "ort": "Gossa"
    },
    {
        "code": "34956",
        "ort": "Zörbig"
    },
    {
        "code": "3496",
        "ort": "Köthen"
    },
    {
        "code": "3497\n34973",
        "ort": "Osternienburg\n34975"
    },
    {
        "code": "34973",
        "ort": "Osternienburg"
    },
    {
        "code": "34975",
        "ort": "Görzig"
    },
    {
        "code": "34976",
        "ort": "Gröbzig"
    },
    {
        "code": "34977",
        "ort": "Quellendorf"
    },
    {
        "code": "34978",
        "ort": "Radegast"
    },
    {
        "code": "34979",
        "ort": "Wulfen"
    },
    {
        "code": "34901",
        "ort": "Rosslau"
    },
    {
        "code": "34903",
        "ort": "Coswig"
    },
    {
        "code": "34904",
        "ort": "Oranienbaum"
    },
    {
        "code": "34905",
        "ort": "Wörlitz"
    },
    {
        "code": "34906",
        "ort": "Raguhn"
    },
    {
        "code": "34907",
        "ort": "Jeber-Bergfrieden"
    },
    {
        "code": "34909",
        "ort": "Aken"
    },
    {
        "code": "34920",
        "ort": "Kropstädt"
    },
    {
        "code": "34921",
        "ort": "Kemberg"
    },
    {
        "code": "34922",
        "ort": "Mühlanger"
    },
    {
        "code": "34923",
        "ort": "Cobbelsdorf"
    },
    {
        "code": "34924",
        "ort": "Zahna"
    },
    {
        "code": "34925",
        "ort": "Bad"
    },
    {
        "code": "34926",
        "ort": "Pretzsch"
    },
    {
        "code": "34927",
        "ort": "Globig"
    },
    {
        "code": "34928",
        "ort": "Seegrehna"
    },
    {
        "code": "34929",
        "ort": "Straach"
    },
    {
        "code": "34953",
        "ort": "Gräfenhainichen"
    },
    {
        "code": "34954",
        "ort": "Roitzsch"
    },
    {
        "code": "34955",
        "ort": "Gossa"
    },
    {
        "code": "34956",
        "ort": "Zörbig"
    },
    {
        "code": "34973",
        "ort": "Osternienburg"
    },
    {
        "code": "34975",
        "ort": "Görzig"
    },
    {
        "code": "34976",
        "ort": "Gröbzig"
    },
    {
        "code": "34977",
        "ort": "Quellendorf"
    },
    {
        "code": "34978",
        "ort": "Radegast"
    },
    {
        "code": "34979",
        "ort": "Wulfen"
    },
    {
        "code": "3501",
        "ort": "Pirna\n3502\n35020"
    },
    {
        "code": "3501",
        "ort": "Pirna"
    },
    {
        "code": "3502\n35020",
        "ort": "Struppen\n35021"
    },
    {
        "code": "35020",
        "ort": "Struppen"
    },
    {
        "code": "35021",
        "ort": "Königstein"
    },
    {
        "code": "35022",
        "ort": "Bad"
    },
    {
        "code": "35023",
        "ort": "Bad"
    },
    {
        "code": "35024",
        "ort": "Stadt"
    },
    {
        "code": "35025",
        "ort": "Liebstadt"
    },
    {
        "code": "35026",
        "ort": "Dürrröhrsdorf"
    },
    {
        "code": "35027",
        "ort": "Weesenstein"
    },
    {
        "code": "35028",
        "ort": "Krippen"
    },
    {
        "code": "3503\n35032",
        "ort": "Langenhennersdorf\n35033"
    },
    {
        "code": "35032",
        "ort": "Langenhennersdorf"
    },
    {
        "code": "35033",
        "ort": "Rosenthal"
    },
    {
        "code": "3504",
        "ort": "Dippoldiswalde"
    },
    {
        "code": "3505\n35052",
        "ort": "Kipsdorf\n35053"
    },
    {
        "code": "35052",
        "ort": "Kipsdorf"
    },
    {
        "code": "35053",
        "ort": "Glashütte"
    },
    {
        "code": "35054",
        "ort": "Lauenstein"
    },
    {
        "code": "35055",
        "ort": "Höckendorf"
    },
    {
        "code": "35056",
        "ort": "Altenberg"
    },
    {
        "code": "35057",
        "ort": "Hermsdorf"
    },
    {
        "code": "35058",
        "ort": "Pretzschendorf"
    },
    {
        "code": "3501",
        "ort": "Pirna"
    },
    {
        "code": "3502\n35020",
        "ort": "Struppen\n35021"
    },
    {
        "code": "35020",
        "ort": "Struppen"
    },
    {
        "code": "35021",
        "ort": "Königstein"
    },
    {
        "code": "35022",
        "ort": "Bad"
    },
    {
        "code": "35023",
        "ort": "Bad"
    },
    {
        "code": "35024",
        "ort": "Stadt"
    },
    {
        "code": "35025",
        "ort": "Liebstadt"
    },
    {
        "code": "35026",
        "ort": "Dürrröhrsdorf"
    },
    {
        "code": "35027",
        "ort": "Weesenstein"
    },
    {
        "code": "35028",
        "ort": "Krippen"
    },
    {
        "code": "3503\n35032",
        "ort": "Langenhennersdorf\n35033"
    },
    {
        "code": "35032",
        "ort": "Langenhennersdorf"
    },
    {
        "code": "35033",
        "ort": "Rosenthal"
    },
    {
        "code": "3504",
        "ort": "Dippoldiswalde"
    },
    {
        "code": "3505\n35052",
        "ort": "Kipsdorf\n35053"
    },
    {
        "code": "35052",
        "ort": "Kipsdorf"
    },
    {
        "code": "35053",
        "ort": "Glashütte"
    },
    {
        "code": "35054",
        "ort": "Lauenstein"
    },
    {
        "code": "35055",
        "ort": "Höckendorf"
    },
    {
        "code": "35056",
        "ort": "Altenberg"
    },
    {
        "code": "35057",
        "ort": "Hermsdorf"
    },
    {
        "code": "35058",
        "ort": "Pretzschendorf"
    },
    {
        "code": "35020",
        "ort": "Struppen"
    },
    {
        "code": "35021",
        "ort": "Königstein"
    },
    {
        "code": "35022",
        "ort": "Bad"
    },
    {
        "code": "35023",
        "ort": "Bad"
    },
    {
        "code": "35024",
        "ort": "Stadt"
    },
    {
        "code": "35025",
        "ort": "Liebstadt"
    },
    {
        "code": "35026",
        "ort": "Dürrröhrsdorf"
    },
    {
        "code": "35027",
        "ort": "Weesenstein"
    },
    {
        "code": "35028",
        "ort": "Krippen"
    },
    {
        "code": "35032",
        "ort": "Langenhennersdorf"
    },
    {
        "code": "35033",
        "ort": "Rosenthal"
    },
    {
        "code": "35052",
        "ort": "Kipsdorf"
    },
    {
        "code": "35053",
        "ort": "Glashütte"
    },
    {
        "code": "35054",
        "ort": "Lauenstein"
    },
    {
        "code": "35055",
        "ort": "Höckendorf"
    },
    {
        "code": "35056",
        "ort": "Altenberg"
    },
    {
        "code": "35057",
        "ort": "Hermsdorf"
    },
    {
        "code": "35058",
        "ort": "Pretzschendorf"
    },
    {
        "code": "351",
        "ort": "Dresden"
    },
    {
        "code": "351",
        "ort": "Dresden"
    },
    {
        "code": "351",
        "ort": "Dresden"
    },
    {
        "code": "3520\n35200",
        "ort": "Arnsdorf\n35201"
    },
    {
        "code": "3520\n35200",
        "ort": "Arnsdorf\n35201"
    },
    {
        "code": "35200",
        "ort": "Arnsdorf"
    },
    {
        "code": "35201",
        "ort": "Langebrück"
    },
    {
        "code": "35202",
        "ort": "Klingenberg"
    },
    {
        "code": "35203",
        "ort": "Tharandt"
    },
    {
        "code": "35204",
        "ort": "Wilsdruff"
    },
    {
        "code": "35205",
        "ort": "Ottendorf-Okrilla"
    },
    {
        "code": "35206",
        "ort": "Kreischa"
    },
    {
        "code": "35207",
        "ort": "Moritzburg"
    },
    {
        "code": "35208",
        "ort": "Radeburg"
    },
    {
        "code": "35209",
        "ort": "Mohorn"
    },
    {
        "code": "3521",
        "ort": "Meißen"
    },
    {
        "code": "3522",
        "ort": "Großenhain"
    },
    {
        "code": "3523",
        "ort": "Coswig"
    },
    {
        "code": "3524\n35240",
        "ort": "Tauscha\n35241"
    },
    {
        "code": "35240",
        "ort": "Tauscha"
    },
    {
        "code": "35241",
        "ort": "Lommatzsch"
    },
    {
        "code": "35242",
        "ort": "Nossen"
    },
    {
        "code": "35243",
        "ort": "Weinböhla"
    },
    {
        "code": "35244",
        "ort": "Krögis"
    },
    {
        "code": "35245",
        "ort": "Burkhardswalde"
    },
    {
        "code": "35246",
        "ort": "Ziegenhain"
    },
    {
        "code": "35247",
        "ort": "Zehren"
    },
    {
        "code": "35248",
        "ort": "Schönfeld"
    },
    {
        "code": "35249",
        "ort": "Basslitz"
    },
    {
        "code": "3525",
        "ort": "Riesa"
    },
    {
        "code": "3526\n35263",
        "ort": "Gröditz\n35264"
    },
    {
        "code": "35263",
        "ort": "Gröditz"
    },
    {
        "code": "35264",
        "ort": "Strehla"
    },
    {
        "code": "35265",
        "ort": "Glaubitz"
    },
    {
        "code": "35266",
        "ort": "Heyda"
    },
    {
        "code": "35267",
        "ort": "Diesbar-Seußlitz"
    },
    {
        "code": "35268",
        "ort": "Stauchitz"
    },
    {
        "code": "3528",
        "ort": "Radeberg"
    },
    {
        "code": "3529",
        "ort": "Heidenau"
    },
    {
        "code": "3520\n35200",
        "ort": "Arnsdorf\n35201"
    },
    {
        "code": "35200",
        "ort": "Arnsdorf"
    },
    {
        "code": "35201",
        "ort": "Langebrück"
    },
    {
        "code": "35202",
        "ort": "Klingenberg"
    },
    {
        "code": "35203",
        "ort": "Tharandt"
    },
    {
        "code": "35204",
        "ort": "Wilsdruff"
    },
    {
        "code": "35205",
        "ort": "Ottendorf-Okrilla"
    },
    {
        "code": "35206",
        "ort": "Kreischa"
    },
    {
        "code": "35207",
        "ort": "Moritzburg"
    },
    {
        "code": "35208",
        "ort": "Radeburg"
    },
    {
        "code": "35209",
        "ort": "Mohorn"
    },
    {
        "code": "3521",
        "ort": "Meißen"
    },
    {
        "code": "3522",
        "ort": "Großenhain"
    },
    {
        "code": "3523",
        "ort": "Coswig"
    },
    {
        "code": "3524\n35240",
        "ort": "Tauscha\n35241"
    },
    {
        "code": "35240",
        "ort": "Tauscha"
    },
    {
        "code": "35241",
        "ort": "Lommatzsch"
    },
    {
        "code": "35242",
        "ort": "Nossen"
    },
    {
        "code": "35243",
        "ort": "Weinböhla"
    },
    {
        "code": "35244",
        "ort": "Krögis"
    },
    {
        "code": "35245",
        "ort": "Burkhardswalde"
    },
    {
        "code": "35246",
        "ort": "Ziegenhain"
    },
    {
        "code": "35247",
        "ort": "Zehren"
    },
    {
        "code": "35248",
        "ort": "Schönfeld"
    },
    {
        "code": "35249",
        "ort": "Basslitz"
    },
    {
        "code": "3525",
        "ort": "Riesa"
    },
    {
        "code": "3526\n35263",
        "ort": "Gröditz\n35264"
    },
    {
        "code": "35263",
        "ort": "Gröditz"
    },
    {
        "code": "35264",
        "ort": "Strehla"
    },
    {
        "code": "35265",
        "ort": "Glaubitz"
    },
    {
        "code": "35266",
        "ort": "Heyda"
    },
    {
        "code": "35267",
        "ort": "Diesbar-Seußlitz"
    },
    {
        "code": "35268",
        "ort": "Stauchitz"
    },
    {
        "code": "3528",
        "ort": "Radeberg"
    },
    {
        "code": "3529",
        "ort": "Heidenau"
    },
    {
        "code": "35200",
        "ort": "Arnsdorf"
    },
    {
        "code": "35201",
        "ort": "Langebrück"
    },
    {
        "code": "35202",
        "ort": "Klingenberg"
    },
    {
        "code": "35203",
        "ort": "Tharandt"
    },
    {
        "code": "35204",
        "ort": "Wilsdruff"
    },
    {
        "code": "35205",
        "ort": "Ottendorf-Okrilla"
    },
    {
        "code": "35206",
        "ort": "Kreischa"
    },
    {
        "code": "35207",
        "ort": "Moritzburg"
    },
    {
        "code": "35208",
        "ort": "Radeburg"
    },
    {
        "code": "35209",
        "ort": "Mohorn"
    },
    {
        "code": "35240",
        "ort": "Tauscha"
    },
    {
        "code": "35241",
        "ort": "Lommatzsch"
    },
    {
        "code": "35242",
        "ort": "Nossen"
    },
    {
        "code": "35243",
        "ort": "Weinböhla"
    },
    {
        "code": "35244",
        "ort": "Krögis"
    },
    {
        "code": "35245",
        "ort": "Burkhardswalde"
    },
    {
        "code": "35246",
        "ort": "Ziegenhain"
    },
    {
        "code": "35247",
        "ort": "Zehren"
    },
    {
        "code": "35248",
        "ort": "Schönfeld"
    },
    {
        "code": "35249",
        "ort": "Basslitz"
    },
    {
        "code": "35263",
        "ort": "Gröditz"
    },
    {
        "code": "35264",
        "ort": "Strehla"
    },
    {
        "code": "35265",
        "ort": "Glaubitz"
    },
    {
        "code": "35266",
        "ort": "Heyda"
    },
    {
        "code": "35267",
        "ort": "Diesbar-Seußlitz"
    },
    {
        "code": "35268",
        "ort": "Stauchitz"
    },
    {
        "code": "3531",
        "ort": "Finsterwalde\n3532\n35322"
    },
    {
        "code": "3531",
        "ort": "Finsterwalde"
    },
    {
        "code": "3532\n35322",
        "ort": "Doberlug-Kirchhain\n35323"
    },
    {
        "code": "35322",
        "ort": "Doberlug-Kirchhain"
    },
    {
        "code": "35323",
        "ort": "Sonnewalde"
    },
    {
        "code": "35324",
        "ort": "Crinitz"
    },
    {
        "code": "35325",
        "ort": "Rückersdorf"
    },
    {
        "code": "35326",
        "ort": "Schönborn"
    },
    {
        "code": "35327",
        "ort": "Prießen"
    },
    {
        "code": "35329",
        "ort": "Dollenchen"
    },
    {
        "code": "3533",
        "ort": "Elsterwerda"
    },
    {
        "code": "3534\n35341",
        "ort": "Bad"
    },
    {
        "code": "35341",
        "ort": "Bad"
    },
    {
        "code": "35342",
        "ort": "Mühlberg"
    },
    {
        "code": "35343",
        "ort": "Hirschfeld"
    },
    {
        "code": "3535",
        "ort": "Herzberg"
    },
    {
        "code": "3536\n35361",
        "ort": "Schlieben\n35362"
    },
    {
        "code": "35361",
        "ort": "Schlieben"
    },
    {
        "code": "35362",
        "ort": "Schönewalde"
    },
    {
        "code": "35363",
        "ort": "Fermerswalde"
    },
    {
        "code": "35364",
        "ort": "Lebusa"
    },
    {
        "code": "35365",
        "ort": "Falkenberg"
    },
    {
        "code": "3537",
        "ort": "Jessen"
    },
    {
        "code": "3538\n35383",
        "ort": "Elster"
    },
    {
        "code": "35383",
        "ort": "Elster"
    },
    {
        "code": "35384",
        "ort": "Steinsdorf"
    },
    {
        "code": "35385",
        "ort": "Annaburg"
    },
    {
        "code": "35386",
        "ort": "Prettin"
    },
    {
        "code": "35387",
        "ort": "Seyda"
    },
    {
        "code": "35388",
        "ort": "Klöden"
    },
    {
        "code": "35389",
        "ort": "Holzdorf"
    },
    {
        "code": "3531",
        "ort": "Finsterwalde"
    },
    {
        "code": "3532\n35322",
        "ort": "Doberlug-Kirchhain\n35323"
    },
    {
        "code": "35322",
        "ort": "Doberlug-Kirchhain"
    },
    {
        "code": "35323",
        "ort": "Sonnewalde"
    },
    {
        "code": "35324",
        "ort": "Crinitz"
    },
    {
        "code": "35325",
        "ort": "Rückersdorf"
    },
    {
        "code": "35326",
        "ort": "Schönborn"
    },
    {
        "code": "35327",
        "ort": "Prießen"
    },
    {
        "code": "35329",
        "ort": "Dollenchen"
    },
    {
        "code": "3533",
        "ort": "Elsterwerda"
    },
    {
        "code": "3534\n35341",
        "ort": "Bad"
    },
    {
        "code": "35341",
        "ort": "Bad"
    },
    {
        "code": "35342",
        "ort": "Mühlberg"
    },
    {
        "code": "35343",
        "ort": "Hirschfeld"
    },
    {
        "code": "3535",
        "ort": "Herzberg"
    },
    {
        "code": "3536\n35361",
        "ort": "Schlieben\n35362"
    },
    {
        "code": "35361",
        "ort": "Schlieben"
    },
    {
        "code": "35362",
        "ort": "Schönewalde"
    },
    {
        "code": "35363",
        "ort": "Fermerswalde"
    },
    {
        "code": "35364",
        "ort": "Lebusa"
    },
    {
        "code": "35365",
        "ort": "Falkenberg"
    },
    {
        "code": "3537",
        "ort": "Jessen"
    },
    {
        "code": "3538\n35383",
        "ort": "Elster"
    },
    {
        "code": "35383",
        "ort": "Elster"
    },
    {
        "code": "35384",
        "ort": "Steinsdorf"
    },
    {
        "code": "35385",
        "ort": "Annaburg"
    },
    {
        "code": "35386",
        "ort": "Prettin"
    },
    {
        "code": "35387",
        "ort": "Seyda"
    },
    {
        "code": "35388",
        "ort": "Klöden"
    },
    {
        "code": "35389",
        "ort": "Holzdorf"
    },
    {
        "code": "35322",
        "ort": "Doberlug-Kirchhain"
    },
    {
        "code": "35323",
        "ort": "Sonnewalde"
    },
    {
        "code": "35324",
        "ort": "Crinitz"
    },
    {
        "code": "35325",
        "ort": "Rückersdorf"
    },
    {
        "code": "35326",
        "ort": "Schönborn"
    },
    {
        "code": "35327",
        "ort": "Prießen"
    },
    {
        "code": "35329",
        "ort": "Dollenchen"
    },
    {
        "code": "35341",
        "ort": "Bad"
    },
    {
        "code": "35342",
        "ort": "Mühlberg"
    },
    {
        "code": "35343",
        "ort": "Hirschfeld"
    },
    {
        "code": "35361",
        "ort": "Schlieben"
    },
    {
        "code": "35362",
        "ort": "Schönewalde"
    },
    {
        "code": "35363",
        "ort": "Fermerswalde"
    },
    {
        "code": "35364",
        "ort": "Lebusa"
    },
    {
        "code": "35365",
        "ort": "Falkenberg"
    },
    {
        "code": "35383",
        "ort": "Elster"
    },
    {
        "code": "35384",
        "ort": "Steinsdorf"
    },
    {
        "code": "35385",
        "ort": "Annaburg"
    },
    {
        "code": "35386",
        "ort": "Prettin"
    },
    {
        "code": "35387",
        "ort": "Seyda"
    },
    {
        "code": "35388",
        "ort": "Klöden"
    },
    {
        "code": "35389",
        "ort": "Holzdorf"
    },
    {
        "code": "3541",
        "ort": "Calau\n3542"
    },
    {
        "code": "3541",
        "ort": "Calau"
    },
    {
        "code": "3542",
        "ort": "Lübbenau"
    },
    {
        "code": "3543\n35433",
        "ort": "Vetschau/Spreewald\n35434"
    },
    {
        "code": "35433",
        "ort": "Vetschau/Spreewald"
    },
    {
        "code": "35434",
        "ort": "Altdöbern"
    },
    {
        "code": "35435",
        "ort": "Gollmitz"
    },
    {
        "code": "35436",
        "ort": "Laasow"
    },
    {
        "code": "35439",
        "ort": "Zinnitz"
    },
    {
        "code": "3544",
        "ort": "Luckau"
    },
    {
        "code": "3545\n35451",
        "ort": "Dahme\n35452"
    },
    {
        "code": "35451",
        "ort": "Dahme"
    },
    {
        "code": "35452",
        "ort": "Golßen"
    },
    {
        "code": "35453",
        "ort": "Drahnsdorf"
    },
    {
        "code": "35454",
        "ort": "Uckro"
    },
    {
        "code": "35455",
        "ort": "Walddrehna"
    },
    {
        "code": "35456",
        "ort": "Terpt"
    },
    {
        "code": "3546",
        "ort": "Lübben"
    },
    {
        "code": "3547\n35471",
        "ort": "Birkenhainchen\n35472"
    },
    {
        "code": "35471",
        "ort": "Birkenhainchen"
    },
    {
        "code": "35472",
        "ort": "Schlepzig"
    },
    {
        "code": "35473",
        "ort": "Neu"
    },
    {
        "code": "35474",
        "ort": "Schönwald"
    },
    {
        "code": "35475",
        "ort": "Straupitz"
    },
    {
        "code": "35476",
        "ort": "Wittmannsdorf"
    },
    {
        "code": "35477",
        "ort": "Rietz"
    },
    {
        "code": "35478",
        "ort": "Goyatz"
    },
    {
        "code": "3541",
        "ort": "Calau"
    },
    {
        "code": "3542",
        "ort": "Lübbenau"
    },
    {
        "code": "3543\n35433",
        "ort": "Vetschau/Spreewald\n35434"
    },
    {
        "code": "35433",
        "ort": "Vetschau/Spreewald"
    },
    {
        "code": "35434",
        "ort": "Altdöbern"
    },
    {
        "code": "35435",
        "ort": "Gollmitz"
    },
    {
        "code": "35436",
        "ort": "Laasow"
    },
    {
        "code": "35439",
        "ort": "Zinnitz"
    },
    {
        "code": "3544",
        "ort": "Luckau"
    },
    {
        "code": "3545\n35451",
        "ort": "Dahme\n35452"
    },
    {
        "code": "35451",
        "ort": "Dahme"
    },
    {
        "code": "35452",
        "ort": "Golßen"
    },
    {
        "code": "35453",
        "ort": "Drahnsdorf"
    },
    {
        "code": "35454",
        "ort": "Uckro"
    },
    {
        "code": "35455",
        "ort": "Walddrehna"
    },
    {
        "code": "35456",
        "ort": "Terpt"
    },
    {
        "code": "3546",
        "ort": "Lübben"
    },
    {
        "code": "3547\n35471",
        "ort": "Birkenhainchen\n35472"
    },
    {
        "code": "35471",
        "ort": "Birkenhainchen"
    },
    {
        "code": "35472",
        "ort": "Schlepzig"
    },
    {
        "code": "35473",
        "ort": "Neu"
    },
    {
        "code": "35474",
        "ort": "Schönwald"
    },
    {
        "code": "35475",
        "ort": "Straupitz"
    },
    {
        "code": "35476",
        "ort": "Wittmannsdorf"
    },
    {
        "code": "35477",
        "ort": "Rietz"
    },
    {
        "code": "35478",
        "ort": "Goyatz"
    },
    {
        "code": "35433",
        "ort": "Vetschau/Spreewald"
    },
    {
        "code": "35434",
        "ort": "Altdöbern"
    },
    {
        "code": "35435",
        "ort": "Gollmitz"
    },
    {
        "code": "35436",
        "ort": "Laasow"
    },
    {
        "code": "35439",
        "ort": "Zinnitz"
    },
    {
        "code": "35451",
        "ort": "Dahme"
    },
    {
        "code": "35452",
        "ort": "Golßen"
    },
    {
        "code": "35453",
        "ort": "Drahnsdorf"
    },
    {
        "code": "35454",
        "ort": "Uckro"
    },
    {
        "code": "35455",
        "ort": "Walddrehna"
    },
    {
        "code": "35456",
        "ort": "Terpt"
    },
    {
        "code": "35471",
        "ort": "Birkenhainchen"
    },
    {
        "code": "35472",
        "ort": "Schlepzig"
    },
    {
        "code": "35473",
        "ort": "Neu"
    },
    {
        "code": "35474",
        "ort": "Schönwald"
    },
    {
        "code": "35475",
        "ort": "Straupitz"
    },
    {
        "code": "35476",
        "ort": "Wittmannsdorf"
    },
    {
        "code": "35477",
        "ort": "Rietz"
    },
    {
        "code": "35478",
        "ort": "Goyatz"
    },
    {
        "code": "355",
        "ort": "Cottbus\n3560\n35600"
    },
    {
        "code": "3560\n35600",
        "ort": "Döbern\n35601"
    },
    {
        "code": "35600",
        "ort": "Döbern"
    },
    {
        "code": "35601",
        "ort": "Peitz"
    },
    {
        "code": "35602",
        "ort": "Drebkau"
    },
    {
        "code": "35603",
        "ort": "Burg"
    },
    {
        "code": "35604",
        "ort": "Krieschow"
    },
    {
        "code": "35605",
        "ort": "Komptendorf"
    },
    {
        "code": "35606",
        "ort": "Briesen"
    },
    {
        "code": "35607",
        "ort": "Jänschwalde"
    },
    {
        "code": "35608",
        "ort": "Groß"
    },
    {
        "code": "35609",
        "ort": "Drachhausen"
    },
    {
        "code": "3561",
        "ort": "Guben"
    },
    {
        "code": "3562",
        "ort": "Forst"
    },
    {
        "code": "3563",
        "ort": "Spremberg"
    },
    {
        "code": "3564",
        "ort": "Schwarze"
    },
    {
        "code": "3569\n35691",
        "ort": "Bärenklau\n35692"
    },
    {
        "code": "35691",
        "ort": "Bärenklau"
    },
    {
        "code": "35692",
        "ort": "Kerkwitz"
    },
    {
        "code": "35693",
        "ort": "Lauschütz"
    },
    {
        "code": "35694",
        "ort": "Gosda"
    },
    {
        "code": "35695",
        "ort": "Simmersdorf"
    },
    {
        "code": "35696",
        "ort": "Briesnig"
    },
    {
        "code": "35697",
        "ort": "Bagenz"
    },
    {
        "code": "35698",
        "ort": "Hornow"
    },
    {
        "code": "3560\n35600",
        "ort": "Döbern\n35601"
    },
    {
        "code": "35600",
        "ort": "Döbern"
    },
    {
        "code": "35601",
        "ort": "Peitz"
    },
    {
        "code": "35602",
        "ort": "Drebkau"
    },
    {
        "code": "35603",
        "ort": "Burg"
    },
    {
        "code": "35604",
        "ort": "Krieschow"
    },
    {
        "code": "35605",
        "ort": "Komptendorf"
    },
    {
        "code": "35606",
        "ort": "Briesen"
    },
    {
        "code": "35607",
        "ort": "Jänschwalde"
    },
    {
        "code": "35608",
        "ort": "Groß"
    },
    {
        "code": "35609",
        "ort": "Drachhausen"
    },
    {
        "code": "3561",
        "ort": "Guben"
    },
    {
        "code": "3562",
        "ort": "Forst"
    },
    {
        "code": "3563",
        "ort": "Spremberg"
    },
    {
        "code": "3564",
        "ort": "Schwarze"
    },
    {
        "code": "3569\n35691",
        "ort": "Bärenklau\n35692"
    },
    {
        "code": "35691",
        "ort": "Bärenklau"
    },
    {
        "code": "35692",
        "ort": "Kerkwitz"
    },
    {
        "code": "35693",
        "ort": "Lauschütz"
    },
    {
        "code": "35694",
        "ort": "Gosda"
    },
    {
        "code": "35695",
        "ort": "Simmersdorf"
    },
    {
        "code": "35696",
        "ort": "Briesnig"
    },
    {
        "code": "35697",
        "ort": "Bagenz"
    },
    {
        "code": "35698",
        "ort": "Hornow"
    },
    {
        "code": "35600",
        "ort": "Döbern"
    },
    {
        "code": "35601",
        "ort": "Peitz"
    },
    {
        "code": "35602",
        "ort": "Drebkau"
    },
    {
        "code": "35603",
        "ort": "Burg"
    },
    {
        "code": "35604",
        "ort": "Krieschow"
    },
    {
        "code": "35605",
        "ort": "Komptendorf"
    },
    {
        "code": "35606",
        "ort": "Briesen"
    },
    {
        "code": "35607",
        "ort": "Jänschwalde"
    },
    {
        "code": "35608",
        "ort": "Groß"
    },
    {
        "code": "35609",
        "ort": "Drachhausen"
    },
    {
        "code": "35691",
        "ort": "Bärenklau"
    },
    {
        "code": "35692",
        "ort": "Kerkwitz"
    },
    {
        "code": "35693",
        "ort": "Lauschütz"
    },
    {
        "code": "35694",
        "ort": "Gosda"
    },
    {
        "code": "35695",
        "ort": "Simmersdorf"
    },
    {
        "code": "35696",
        "ort": "Briesnig"
    },
    {
        "code": "35697",
        "ort": "Bagenz"
    },
    {
        "code": "35698",
        "ort": "Hornow"
    },
    {
        "code": "3571",
        "ort": "Hoyerswerda\n3572\n35722"
    },
    {
        "code": "3571",
        "ort": "Hoyerswerda"
    },
    {
        "code": "3572\n35722",
        "ort": "Lauta\n35723"
    },
    {
        "code": "35722",
        "ort": "Lauta"
    },
    {
        "code": "35723",
        "ort": "Bernsdorf"
    },
    {
        "code": "35724",
        "ort": "Lohsa"
    },
    {
        "code": "35725",
        "ort": "Wittichenau"
    },
    {
        "code": "35726",
        "ort": "Groß"
    },
    {
        "code": "35727",
        "ort": "Burghammer"
    },
    {
        "code": "35728",
        "ort": "Uhyst"
    },
    {
        "code": "3573",
        "ort": "Senftenberg"
    },
    {
        "code": "3574",
        "ort": "Lauchhammer"
    },
    {
        "code": "3575\n35751",
        "ort": "Welzow\n35752"
    },
    {
        "code": "35751",
        "ort": "Welzow"
    },
    {
        "code": "35752",
        "ort": "Ruhland"
    },
    {
        "code": "35753",
        "ort": "Großräschen"
    },
    {
        "code": "35754",
        "ort": "Klettwitz"
    },
    {
        "code": "35755",
        "ort": "Ortrand"
    },
    {
        "code": "35756",
        "ort": "Hosena"
    },
    {
        "code": "3576",
        "ort": "Weißwasser"
    },
    {
        "code": "3577\n35771",
        "ort": "Bad"
    },
    {
        "code": "35771",
        "ort": "Bad"
    },
    {
        "code": "35772",
        "ort": "Rietschen"
    },
    {
        "code": "35773",
        "ort": "Schleife"
    },
    {
        "code": "35774",
        "ort": "Boxberg"
    },
    {
        "code": "35775",
        "ort": "Pechern"
    },
    {
        "code": "3578",
        "ort": "Kamenz"
    },
    {
        "code": "3579\n35792",
        "ort": "Oßling\n35793"
    },
    {
        "code": "35792",
        "ort": "Oßling"
    },
    {
        "code": "35793",
        "ort": "Elstra"
    },
    {
        "code": "35795",
        "ort": "Königsbrück"
    },
    {
        "code": "35796",
        "ort": "Panschwitz-Kuckau"
    },
    {
        "code": "35797",
        "ort": "Schwepnitz"
    },
    {
        "code": "3571",
        "ort": "Hoyerswerda"
    },
    {
        "code": "3572\n35722",
        "ort": "Lauta\n35723"
    },
    {
        "code": "35722",
        "ort": "Lauta"
    },
    {
        "code": "35723",
        "ort": "Bernsdorf"
    },
    {
        "code": "35724",
        "ort": "Lohsa"
    },
    {
        "code": "35725",
        "ort": "Wittichenau"
    },
    {
        "code": "35726",
        "ort": "Groß"
    },
    {
        "code": "35727",
        "ort": "Burghammer"
    },
    {
        "code": "35728",
        "ort": "Uhyst"
    },
    {
        "code": "3573",
        "ort": "Senftenberg"
    },
    {
        "code": "3574",
        "ort": "Lauchhammer"
    },
    {
        "code": "3575\n35751",
        "ort": "Welzow\n35752"
    },
    {
        "code": "35751",
        "ort": "Welzow"
    },
    {
        "code": "35752",
        "ort": "Ruhland"
    },
    {
        "code": "35753",
        "ort": "Großräschen"
    },
    {
        "code": "35754",
        "ort": "Klettwitz"
    },
    {
        "code": "35755",
        "ort": "Ortrand"
    },
    {
        "code": "35756",
        "ort": "Hosena"
    },
    {
        "code": "3576",
        "ort": "Weißwasser"
    },
    {
        "code": "3577\n35771",
        "ort": "Bad"
    },
    {
        "code": "35771",
        "ort": "Bad"
    },
    {
        "code": "35772",
        "ort": "Rietschen"
    },
    {
        "code": "35773",
        "ort": "Schleife"
    },
    {
        "code": "35774",
        "ort": "Boxberg"
    },
    {
        "code": "35775",
        "ort": "Pechern"
    },
    {
        "code": "3578",
        "ort": "Kamenz"
    },
    {
        "code": "3579\n35792",
        "ort": "Oßling\n35793"
    },
    {
        "code": "35792",
        "ort": "Oßling"
    },
    {
        "code": "35793",
        "ort": "Elstra"
    },
    {
        "code": "35795",
        "ort": "Königsbrück"
    },
    {
        "code": "35796",
        "ort": "Panschwitz-Kuckau"
    },
    {
        "code": "35797",
        "ort": "Schwepnitz"
    },
    {
        "code": "35722",
        "ort": "Lauta"
    },
    {
        "code": "35723",
        "ort": "Bernsdorf"
    },
    {
        "code": "35724",
        "ort": "Lohsa"
    },
    {
        "code": "35725",
        "ort": "Wittichenau"
    },
    {
        "code": "35726",
        "ort": "Groß"
    },
    {
        "code": "35727",
        "ort": "Burghammer"
    },
    {
        "code": "35728",
        "ort": "Uhyst"
    },
    {
        "code": "35751",
        "ort": "Welzow"
    },
    {
        "code": "35752",
        "ort": "Ruhland"
    },
    {
        "code": "35753",
        "ort": "Großräschen"
    },
    {
        "code": "35754",
        "ort": "Klettwitz"
    },
    {
        "code": "35755",
        "ort": "Ortrand"
    },
    {
        "code": "35756",
        "ort": "Hosena"
    },
    {
        "code": "35771",
        "ort": "Bad"
    },
    {
        "code": "35772",
        "ort": "Rietschen"
    },
    {
        "code": "35773",
        "ort": "Schleife"
    },
    {
        "code": "35774",
        "ort": "Boxberg"
    },
    {
        "code": "35775",
        "ort": "Pechern"
    },
    {
        "code": "35792",
        "ort": "Oßling"
    },
    {
        "code": "35793",
        "ort": "Elstra"
    },
    {
        "code": "35795",
        "ort": "Königsbrück"
    },
    {
        "code": "35796",
        "ort": "Panschwitz-Kuckau"
    },
    {
        "code": "35797",
        "ort": "Schwepnitz"
    },
    {
        "code": "3581",
        "ort": "Görlitz\n3582\n35820"
    },
    {
        "code": "3581",
        "ort": "Görlitz"
    },
    {
        "code": "3582\n35820",
        "ort": "Zodel\n35822"
    },
    {
        "code": "35820",
        "ort": "Zodel"
    },
    {
        "code": "35822",
        "ort": "Hagenwerder"
    },
    {
        "code": "35823",
        "ort": "Ostritz"
    },
    {
        "code": "35825",
        "ort": "Kodersdorf"
    },
    {
        "code": "35826",
        "ort": "Königshain"
    },
    {
        "code": "35827",
        "ort": "Nieder"
    },
    {
        "code": "35828",
        "ort": "Reichenbach"
    },
    {
        "code": "35829",
        "ort": "Gersdorf,"
    },
    {
        "code": "3583",
        "ort": "Zittau"
    },
    {
        "code": "3584\n35841",
        "ort": "Großschönau\n35842"
    },
    {
        "code": "35841",
        "ort": "Großschönau"
    },
    {
        "code": "35842",
        "ort": "Niederoderwitz"
    },
    {
        "code": "35843",
        "ort": "Hirschfelde"
    },
    {
        "code": "35844",
        "ort": "Oybin"
    },
    {
        "code": "3585",
        "ort": "Löbau"
    },
    {
        "code": "3586",
        "ort": "Ebersbach/Sa.,"
    },
    {
        "code": "3587\n35872",
        "ort": "Neusalza-Spremberg\n35873"
    },
    {
        "code": "35872",
        "ort": "Neusalza-Spremberg"
    },
    {
        "code": "35873",
        "ort": "Herrnhut"
    },
    {
        "code": "35874",
        "ort": "Bernstadt"
    },
    {
        "code": "35875",
        "ort": "Obercunnersdorf"
    },
    {
        "code": "35876",
        "ort": "Weißenberg"
    },
    {
        "code": "35877",
        "ort": "Cunewalde"
    },
    {
        "code": "3588",
        "ort": "Niesky"
    },
    {
        "code": "3589\n35891",
        "ort": "Rothenburg"
    },
    {
        "code": "35891",
        "ort": "Rothenburg"
    },
    {
        "code": "35892",
        "ort": "Horka"
    },
    {
        "code": "35893",
        "ort": "Mücka"
    },
    {
        "code": "35894",
        "ort": "Hähnichen"
    },
    {
        "code": "35895",
        "ort": "Klitten"
    },
    {
        "code": "3581",
        "ort": "Görlitz"
    },
    {
        "code": "3582\n35820",
        "ort": "Zodel\n35822"
    },
    {
        "code": "35820",
        "ort": "Zodel"
    },
    {
        "code": "35822",
        "ort": "Hagenwerder"
    },
    {
        "code": "35823",
        "ort": "Ostritz"
    },
    {
        "code": "35825",
        "ort": "Kodersdorf"
    },
    {
        "code": "35826",
        "ort": "Königshain"
    },
    {
        "code": "35827",
        "ort": "Nieder"
    },
    {
        "code": "35828",
        "ort": "Reichenbach"
    },
    {
        "code": "35829",
        "ort": "Gersdorf,"
    },
    {
        "code": "3583",
        "ort": "Zittau"
    },
    {
        "code": "3584\n35841",
        "ort": "Großschönau\n35842"
    },
    {
        "code": "35841",
        "ort": "Großschönau"
    },
    {
        "code": "35842",
        "ort": "Niederoderwitz"
    },
    {
        "code": "35843",
        "ort": "Hirschfelde"
    },
    {
        "code": "35844",
        "ort": "Oybin"
    },
    {
        "code": "3585",
        "ort": "Löbau"
    },
    {
        "code": "3586",
        "ort": "Ebersbach/Sa.,"
    },
    {
        "code": "3587\n35872",
        "ort": "Neusalza-Spremberg\n35873"
    },
    {
        "code": "35872",
        "ort": "Neusalza-Spremberg"
    },
    {
        "code": "35873",
        "ort": "Herrnhut"
    },
    {
        "code": "35874",
        "ort": "Bernstadt"
    },
    {
        "code": "35875",
        "ort": "Obercunnersdorf"
    },
    {
        "code": "35876",
        "ort": "Weißenberg"
    },
    {
        "code": "35877",
        "ort": "Cunewalde"
    },
    {
        "code": "3588",
        "ort": "Niesky"
    },
    {
        "code": "3589\n35891",
        "ort": "Rothenburg"
    },
    {
        "code": "35891",
        "ort": "Rothenburg"
    },
    {
        "code": "35892",
        "ort": "Horka"
    },
    {
        "code": "35893",
        "ort": "Mücka"
    },
    {
        "code": "35894",
        "ort": "Hähnichen"
    },
    {
        "code": "35895",
        "ort": "Klitten"
    },
    {
        "code": "35820",
        "ort": "Zodel"
    },
    {
        "code": "35822",
        "ort": "Hagenwerder"
    },
    {
        "code": "35823",
        "ort": "Ostritz"
    },
    {
        "code": "35825",
        "ort": "Kodersdorf"
    },
    {
        "code": "35826",
        "ort": "Königshain"
    },
    {
        "code": "35827",
        "ort": "Nieder"
    },
    {
        "code": "35828",
        "ort": "Reichenbach"
    },
    {
        "code": "35829",
        "ort": "Gersdorf,"
    },
    {
        "code": "35841",
        "ort": "Großschönau"
    },
    {
        "code": "35842",
        "ort": "Niederoderwitz"
    },
    {
        "code": "35843",
        "ort": "Hirschfelde"
    },
    {
        "code": "35844",
        "ort": "Oybin"
    },
    {
        "code": "35872",
        "ort": "Neusalza-Spremberg"
    },
    {
        "code": "35873",
        "ort": "Herrnhut"
    },
    {
        "code": "35874",
        "ort": "Bernstadt"
    },
    {
        "code": "35875",
        "ort": "Obercunnersdorf"
    },
    {
        "code": "35876",
        "ort": "Weißenberg"
    },
    {
        "code": "35877",
        "ort": "Cunewalde"
    },
    {
        "code": "35891",
        "ort": "Rothenburg"
    },
    {
        "code": "35892",
        "ort": "Horka"
    },
    {
        "code": "35893",
        "ort": "Mücka"
    },
    {
        "code": "35894",
        "ort": "Hähnichen"
    },
    {
        "code": "35895",
        "ort": "Klitten"
    },
    {
        "code": "3591",
        "ort": "Bautzen\n3592"
    },
    {
        "code": "3591",
        "ort": "Bautzen"
    },
    {
        "code": "3592",
        "ort": "Kirschau"
    },
    {
        "code": "3593\n35930",
        "ort": "Seitschen\n35931"
    },
    {
        "code": "35930",
        "ort": "Seitschen"
    },
    {
        "code": "35931",
        "ort": "Königswartha"
    },
    {
        "code": "35932",
        "ort": "Guttau"
    },
    {
        "code": "35933",
        "ort": "Neschwitz"
    },
    {
        "code": "35934",
        "ort": "Großdubrau"
    },
    {
        "code": "35935",
        "ort": "Kleinwelka"
    },
    {
        "code": "35936",
        "ort": "Sohland"
    },
    {
        "code": "35937",
        "ort": "Prischwitz"
    },
    {
        "code": "35938",
        "ort": "Großpostwitz"
    },
    {
        "code": "35939",
        "ort": "Hochkirch"
    },
    {
        "code": "3594",
        "ort": "Bischofswerda"
    },
    {
        "code": "3595\n35951",
        "ort": "Neukirch/Lausitz\n35952"
    },
    {
        "code": "35951",
        "ort": "Neukirch/Lausitz"
    },
    {
        "code": "35952",
        "ort": "Großröhrsdorf"
    },
    {
        "code": "35953",
        "ort": "Burkau"
    },
    {
        "code": "35954",
        "ort": "Grossharthau"
    },
    {
        "code": "35955",
        "ort": "Pulsnitz"
    },
    {
        "code": "3596",
        "ort": "Neustadt"
    },
    {
        "code": "3597\n35971",
        "ort": "Sebnitz\n35973"
    },
    {
        "code": "35971",
        "ort": "Sebnitz"
    },
    {
        "code": "35973",
        "ort": "Stolpen"
    },
    {
        "code": "35974",
        "ort": "Hinterhermsdorf"
    },
    {
        "code": "35975",
        "ort": "Hohnstein"
    },
    {
        "code": "3591",
        "ort": "Bautzen"
    },
    {
        "code": "3592",
        "ort": "Kirschau"
    },
    {
        "code": "3593\n35930",
        "ort": "Seitschen\n35931"
    },
    {
        "code": "35930",
        "ort": "Seitschen"
    },
    {
        "code": "35931",
        "ort": "Königswartha"
    },
    {
        "code": "35932",
        "ort": "Guttau"
    },
    {
        "code": "35933",
        "ort": "Neschwitz"
    },
    {
        "code": "35934",
        "ort": "Großdubrau"
    },
    {
        "code": "35935",
        "ort": "Kleinwelka"
    },
    {
        "code": "35936",
        "ort": "Sohland"
    },
    {
        "code": "35937",
        "ort": "Prischwitz"
    },
    {
        "code": "35938",
        "ort": "Großpostwitz"
    },
    {
        "code": "35939",
        "ort": "Hochkirch"
    },
    {
        "code": "3594",
        "ort": "Bischofswerda"
    },
    {
        "code": "3595\n35951",
        "ort": "Neukirch/Lausitz\n35952"
    },
    {
        "code": "35951",
        "ort": "Neukirch/Lausitz"
    },
    {
        "code": "35952",
        "ort": "Großröhrsdorf"
    },
    {
        "code": "35953",
        "ort": "Burkau"
    },
    {
        "code": "35954",
        "ort": "Grossharthau"
    },
    {
        "code": "35955",
        "ort": "Pulsnitz"
    },
    {
        "code": "3596",
        "ort": "Neustadt"
    },
    {
        "code": "3597\n35971",
        "ort": "Sebnitz\n35973"
    },
    {
        "code": "35971",
        "ort": "Sebnitz"
    },
    {
        "code": "35973",
        "ort": "Stolpen"
    },
    {
        "code": "35974",
        "ort": "Hinterhermsdorf"
    },
    {
        "code": "35975",
        "ort": "Hohnstein"
    },
    {
        "code": "35930",
        "ort": "Seitschen"
    },
    {
        "code": "35931",
        "ort": "Königswartha"
    },
    {
        "code": "35932",
        "ort": "Guttau"
    },
    {
        "code": "35933",
        "ort": "Neschwitz"
    },
    {
        "code": "35934",
        "ort": "Großdubrau"
    },
    {
        "code": "35935",
        "ort": "Kleinwelka"
    },
    {
        "code": "35936",
        "ort": "Sohland"
    },
    {
        "code": "35937",
        "ort": "Prischwitz"
    },
    {
        "code": "35938",
        "ort": "Großpostwitz"
    },
    {
        "code": "35939",
        "ort": "Hochkirch"
    },
    {
        "code": "35951",
        "ort": "Neukirch/Lausitz"
    },
    {
        "code": "35952",
        "ort": "Großröhrsdorf"
    },
    {
        "code": "35953",
        "ort": "Burkau"
    },
    {
        "code": "35954",
        "ort": "Grossharthau"
    },
    {
        "code": "35955",
        "ort": "Pulsnitz"
    },
    {
        "code": "35971",
        "ort": "Sebnitz"
    },
    {
        "code": "35973",
        "ort": "Stolpen"
    },
    {
        "code": "35974",
        "ort": "Hinterhermsdorf"
    },
    {
        "code": "35975",
        "ort": "Hohnstein"
    },
    {
        "code": "3601",
        "ort": "Mühlhausen/Thür.\n3602\n36020"
    },
    {
        "code": "3601",
        "ort": "Mühlhausen/Thür."
    },
    {
        "code": "3602\n36020",
        "ort": "Ebeleben\n36021"
    },
    {
        "code": "36020",
        "ort": "Ebeleben"
    },
    {
        "code": "36021",
        "ort": "Schlotheim"
    },
    {
        "code": "36022",
        "ort": "Großengottern"
    },
    {
        "code": "36023",
        "ort": "Horsmar"
    },
    {
        "code": "36024",
        "ort": "Diedorf"
    },
    {
        "code": "36025",
        "ort": "Körner"
    },
    {
        "code": "36026",
        "ort": "Rodeberg"
    },
    {
        "code": "36027",
        "ort": "Lengenfeld"
    },
    {
        "code": "36028",
        "ort": "Kammerforst"
    },
    {
        "code": "36029",
        "ort": "Menteroda"
    },
    {
        "code": "3603",
        "ort": "Bad"
    },
    {
        "code": "3604\n36041",
        "ort": "Bad"
    },
    {
        "code": "36041",
        "ort": "Bad"
    },
    {
        "code": "36042",
        "ort": "Gräfentonna"
    },
    {
        "code": "36043",
        "ort": "Kirchheilingen"
    },
    {
        "code": "3605",
        "ort": "Leinefelde"
    },
    {
        "code": "3606",
        "ort": "Heilbad"
    },
    {
        "code": "3607\n36071",
        "ort": "Teistungen\n36072"
    },
    {
        "code": "36071",
        "ort": "Teistungen"
    },
    {
        "code": "36072",
        "ort": "Weißenborn-Lüderode"
    },
    {
        "code": "36074",
        "ort": "Worbis"
    },
    {
        "code": "36075",
        "ort": "Dingelstädt"
    },
    {
        "code": "36076",
        "ort": "Niederorschel"
    },
    {
        "code": "36077",
        "ort": "Großbodungen"
    },
    {
        "code": "3608\n36081",
        "ort": "Arenshausen\n36082"
    },
    {
        "code": "36081",
        "ort": "Arenshausen"
    },
    {
        "code": "36082",
        "ort": "Ershausen"
    },
    {
        "code": "36083",
        "ort": "Uder"
    },
    {
        "code": "36084",
        "ort": "Heuthen"
    },
    {
        "code": "36085",
        "ort": "Reinholterode"
    },
    {
        "code": "36087",
        "ort": "Wüstheuterode"
    },
    {
        "code": "3601",
        "ort": "Mühlhausen/Thür."
    },
    {
        "code": "3602\n36020",
        "ort": "Ebeleben\n36021"
    },
    {
        "code": "36020",
        "ort": "Ebeleben"
    },
    {
        "code": "36021",
        "ort": "Schlotheim"
    },
    {
        "code": "36022",
        "ort": "Großengottern"
    },
    {
        "code": "36023",
        "ort": "Horsmar"
    },
    {
        "code": "36024",
        "ort": "Diedorf"
    },
    {
        "code": "36025",
        "ort": "Körner"
    },
    {
        "code": "36026",
        "ort": "Rodeberg"
    },
    {
        "code": "36027",
        "ort": "Lengenfeld"
    },
    {
        "code": "36028",
        "ort": "Kammerforst"
    },
    {
        "code": "36029",
        "ort": "Menteroda"
    },
    {
        "code": "3603",
        "ort": "Bad"
    },
    {
        "code": "3604\n36041",
        "ort": "Bad"
    },
    {
        "code": "36041",
        "ort": "Bad"
    },
    {
        "code": "36042",
        "ort": "Gräfentonna"
    },
    {
        "code": "36043",
        "ort": "Kirchheilingen"
    },
    {
        "code": "3605",
        "ort": "Leinefelde"
    },
    {
        "code": "3606",
        "ort": "Heilbad"
    },
    {
        "code": "3607\n36071",
        "ort": "Teistungen\n36072"
    },
    {
        "code": "36071",
        "ort": "Teistungen"
    },
    {
        "code": "36072",
        "ort": "Weißenborn-Lüderode"
    },
    {
        "code": "36074",
        "ort": "Worbis"
    },
    {
        "code": "36075",
        "ort": "Dingelstädt"
    },
    {
        "code": "36076",
        "ort": "Niederorschel"
    },
    {
        "code": "36077",
        "ort": "Großbodungen"
    },
    {
        "code": "3608\n36081",
        "ort": "Arenshausen\n36082"
    },
    {
        "code": "36081",
        "ort": "Arenshausen"
    },
    {
        "code": "36082",
        "ort": "Ershausen"
    },
    {
        "code": "36083",
        "ort": "Uder"
    },
    {
        "code": "36084",
        "ort": "Heuthen"
    },
    {
        "code": "36085",
        "ort": "Reinholterode"
    },
    {
        "code": "36087",
        "ort": "Wüstheuterode"
    },
    {
        "code": "36020",
        "ort": "Ebeleben"
    },
    {
        "code": "36021",
        "ort": "Schlotheim"
    },
    {
        "code": "36022",
        "ort": "Großengottern"
    },
    {
        "code": "36023",
        "ort": "Horsmar"
    },
    {
        "code": "36024",
        "ort": "Diedorf"
    },
    {
        "code": "36025",
        "ort": "Körner"
    },
    {
        "code": "36026",
        "ort": "Rodeberg"
    },
    {
        "code": "36027",
        "ort": "Lengenfeld"
    },
    {
        "code": "36028",
        "ort": "Kammerforst"
    },
    {
        "code": "36029",
        "ort": "Menteroda"
    },
    {
        "code": "36041",
        "ort": "Bad"
    },
    {
        "code": "36042",
        "ort": "Gräfentonna"
    },
    {
        "code": "36043",
        "ort": "Kirchheilingen"
    },
    {
        "code": "36071",
        "ort": "Teistungen"
    },
    {
        "code": "36072",
        "ort": "Weißenborn-Lüderode"
    },
    {
        "code": "36074",
        "ort": "Worbis"
    },
    {
        "code": "36075",
        "ort": "Dingelstädt"
    },
    {
        "code": "36076",
        "ort": "Niederorschel"
    },
    {
        "code": "36077",
        "ort": "Großbodungen"
    },
    {
        "code": "36081",
        "ort": "Arenshausen"
    },
    {
        "code": "36082",
        "ort": "Ershausen"
    },
    {
        "code": "36083",
        "ort": "Uder"
    },
    {
        "code": "36084",
        "ort": "Heuthen"
    },
    {
        "code": "36085",
        "ort": "Reinholterode"
    },
    {
        "code": "36087",
        "ort": "Wüstheuterode"
    },
    {
        "code": "361",
        "ort": "Erfurt"
    },
    {
        "code": "361",
        "ort": "Erfurt"
    },
    {
        "code": "361",
        "ort": "Erfurt"
    },
    {
        "code": "3620\n36200",
        "ort": "Elxleben\n36201"
    },
    {
        "code": "3620\n36200",
        "ort": "Elxleben\n36201"
    },
    {
        "code": "36200",
        "ort": "Elxleben"
    },
    {
        "code": "36201",
        "ort": "Walschleben"
    },
    {
        "code": "36202",
        "ort": "Neudietendorf"
    },
    {
        "code": "36203",
        "ort": "Vieselbach"
    },
    {
        "code": "36204",
        "ort": "Stotternheim"
    },
    {
        "code": "36205",
        "ort": "Gräfenroda"
    },
    {
        "code": "36206",
        "ort": "Großfahner"
    },
    {
        "code": "36207",
        "ort": "Plaue"
    },
    {
        "code": "36208",
        "ort": "Ermstedt"
    },
    {
        "code": "36209",
        "ort": "Klettbach"
    },
    {
        "code": "3621",
        "ort": "Gotha"
    },
    {
        "code": "3622",
        "ort": "Waltershausen"
    },
    {
        "code": "3623",
        "ort": "Friedrichroda"
    },
    {
        "code": "3624",
        "ort": "Ohrdruf"
    },
    {
        "code": "3625\n36252",
        "ort": "Tambach-Dietharz/Thür."
    },
    {
        "code": "36252",
        "ort": "Tambach-Dietharz/Thür."
    },
    {
        "code": "36253",
        "ort": "Georgenthal"
    },
    {
        "code": "36254",
        "ort": "Friedrichswerth"
    },
    {
        "code": "36255",
        "ort": "Goldbach"
    },
    {
        "code": "36256",
        "ort": "Wechmar"
    },
    {
        "code": "36257",
        "ort": "Luisenthal"
    },
    {
        "code": "36258",
        "ort": "Friemar"
    },
    {
        "code": "36259",
        "ort": "Bad"
    },
    {
        "code": "3628",
        "ort": "Arnstadt"
    },
    {
        "code": "3629",
        "ort": "Stadtilm"
    },
    {
        "code": "3620\n36200",
        "ort": "Elxleben\n36201"
    },
    {
        "code": "36200",
        "ort": "Elxleben"
    },
    {
        "code": "36201",
        "ort": "Walschleben"
    },
    {
        "code": "36202",
        "ort": "Neudietendorf"
    },
    {
        "code": "36203",
        "ort": "Vieselbach"
    },
    {
        "code": "36204",
        "ort": "Stotternheim"
    },
    {
        "code": "36205",
        "ort": "Gräfenroda"
    },
    {
        "code": "36206",
        "ort": "Großfahner"
    },
    {
        "code": "36207",
        "ort": "Plaue"
    },
    {
        "code": "36208",
        "ort": "Ermstedt"
    },
    {
        "code": "36209",
        "ort": "Klettbach"
    },
    {
        "code": "3621",
        "ort": "Gotha"
    },
    {
        "code": "3622",
        "ort": "Waltershausen"
    },
    {
        "code": "3623",
        "ort": "Friedrichroda"
    },
    {
        "code": "3624",
        "ort": "Ohrdruf"
    },
    {
        "code": "3625\n36252",
        "ort": "Tambach-Dietharz/Thür."
    },
    {
        "code": "36252",
        "ort": "Tambach-Dietharz/Thür."
    },
    {
        "code": "36253",
        "ort": "Georgenthal"
    },
    {
        "code": "36254",
        "ort": "Friedrichswerth"
    },
    {
        "code": "36255",
        "ort": "Goldbach"
    },
    {
        "code": "36256",
        "ort": "Wechmar"
    },
    {
        "code": "36257",
        "ort": "Luisenthal"
    },
    {
        "code": "36258",
        "ort": "Friemar"
    },
    {
        "code": "36259",
        "ort": "Bad"
    },
    {
        "code": "3628",
        "ort": "Arnstadt"
    },
    {
        "code": "3629",
        "ort": "Stadtilm"
    },
    {
        "code": "36200",
        "ort": "Elxleben"
    },
    {
        "code": "36201",
        "ort": "Walschleben"
    },
    {
        "code": "36202",
        "ort": "Neudietendorf"
    },
    {
        "code": "36203",
        "ort": "Vieselbach"
    },
    {
        "code": "36204",
        "ort": "Stotternheim"
    },
    {
        "code": "36205",
        "ort": "Gräfenroda"
    },
    {
        "code": "36206",
        "ort": "Großfahner"
    },
    {
        "code": "36207",
        "ort": "Plaue"
    },
    {
        "code": "36208",
        "ort": "Ermstedt"
    },
    {
        "code": "36209",
        "ort": "Klettbach"
    },
    {
        "code": "36252",
        "ort": "Tambach-Dietharz/Thür."
    },
    {
        "code": "36253",
        "ort": "Georgenthal"
    },
    {
        "code": "36254",
        "ort": "Friedrichswerth"
    },
    {
        "code": "36255",
        "ort": "Goldbach"
    },
    {
        "code": "36256",
        "ort": "Wechmar"
    },
    {
        "code": "36257",
        "ort": "Luisenthal"
    },
    {
        "code": "36258",
        "ort": "Friemar"
    },
    {
        "code": "36259",
        "ort": "Bad"
    },
    {
        "code": "3631",
        "ort": "Nordhausen\n3632"
    },
    {
        "code": "3631",
        "ort": "Nordhausen"
    },
    {
        "code": "3632",
        "ort": "Sondershausen"
    },
    {
        "code": "3633\n36330",
        "ort": "Großberndten\n36331"
    },
    {
        "code": "36330",
        "ort": "Großberndten"
    },
    {
        "code": "36331",
        "ort": "Ilfeld"
    },
    {
        "code": "36332",
        "ort": "Ellrich"
    },
    {
        "code": "36333",
        "ort": "Heringen/Helme"
    },
    {
        "code": "36334",
        "ort": "Wolkramshausen"
    },
    {
        "code": "36335",
        "ort": "Großwechsungen"
    },
    {
        "code": "36336",
        "ort": "Klettenberg"
    },
    {
        "code": "36337",
        "ort": "Schiedungen"
    },
    {
        "code": "36338",
        "ort": "Bleicherode"
    },
    {
        "code": "3634",
        "ort": "Sömmerda"
    },
    {
        "code": "3635",
        "ort": "Kölleda"
    },
    {
        "code": "3636",
        "ort": "Greußen"
    },
    {
        "code": "3637\n36370",
        "ort": "Großenehrich\n36371"
    },
    {
        "code": "36370",
        "ort": "Großenehrich"
    },
    {
        "code": "36371",
        "ort": "Schloßvippach"
    },
    {
        "code": "36372",
        "ort": "Kleinneuhausen"
    },
    {
        "code": "36373",
        "ort": "Buttstädt"
    },
    {
        "code": "36374",
        "ort": "Weißensee"
    },
    {
        "code": "36375",
        "ort": "Kindelbrück"
    },
    {
        "code": "36376",
        "ort": "Straußfurt"
    },
    {
        "code": "36377",
        "ort": "Rastenberg"
    },
    {
        "code": "36378",
        "ort": "Ostramondra"
    },
    {
        "code": "36379",
        "ort": "Holzengel"
    },
    {
        "code": "3631",
        "ort": "Nordhausen"
    },
    {
        "code": "3632",
        "ort": "Sondershausen"
    },
    {
        "code": "3633\n36330",
        "ort": "Großberndten\n36331"
    },
    {
        "code": "36330",
        "ort": "Großberndten"
    },
    {
        "code": "36331",
        "ort": "Ilfeld"
    },
    {
        "code": "36332",
        "ort": "Ellrich"
    },
    {
        "code": "36333",
        "ort": "Heringen/Helme"
    },
    {
        "code": "36334",
        "ort": "Wolkramshausen"
    },
    {
        "code": "36335",
        "ort": "Großwechsungen"
    },
    {
        "code": "36336",
        "ort": "Klettenberg"
    },
    {
        "code": "36337",
        "ort": "Schiedungen"
    },
    {
        "code": "36338",
        "ort": "Bleicherode"
    },
    {
        "code": "3634",
        "ort": "Sömmerda"
    },
    {
        "code": "3635",
        "ort": "Kölleda"
    },
    {
        "code": "3636",
        "ort": "Greußen"
    },
    {
        "code": "3637\n36370",
        "ort": "Großenehrich\n36371"
    },
    {
        "code": "36370",
        "ort": "Großenehrich"
    },
    {
        "code": "36371",
        "ort": "Schloßvippach"
    },
    {
        "code": "36372",
        "ort": "Kleinneuhausen"
    },
    {
        "code": "36373",
        "ort": "Buttstädt"
    },
    {
        "code": "36374",
        "ort": "Weißensee"
    },
    {
        "code": "36375",
        "ort": "Kindelbrück"
    },
    {
        "code": "36376",
        "ort": "Straußfurt"
    },
    {
        "code": "36377",
        "ort": "Rastenberg"
    },
    {
        "code": "36378",
        "ort": "Ostramondra"
    },
    {
        "code": "36379",
        "ort": "Holzengel"
    },
    {
        "code": "36330",
        "ort": "Großberndten"
    },
    {
        "code": "36331",
        "ort": "Ilfeld"
    },
    {
        "code": "36332",
        "ort": "Ellrich"
    },
    {
        "code": "36333",
        "ort": "Heringen/Helme"
    },
    {
        "code": "36334",
        "ort": "Wolkramshausen"
    },
    {
        "code": "36335",
        "ort": "Großwechsungen"
    },
    {
        "code": "36336",
        "ort": "Klettenberg"
    },
    {
        "code": "36337",
        "ort": "Schiedungen"
    },
    {
        "code": "36338",
        "ort": "Bleicherode"
    },
    {
        "code": "36370",
        "ort": "Großenehrich"
    },
    {
        "code": "36371",
        "ort": "Schloßvippach"
    },
    {
        "code": "36372",
        "ort": "Kleinneuhausen"
    },
    {
        "code": "36373",
        "ort": "Buttstädt"
    },
    {
        "code": "36374",
        "ort": "Weißensee"
    },
    {
        "code": "36375",
        "ort": "Kindelbrück"
    },
    {
        "code": "36376",
        "ort": "Straußfurt"
    },
    {
        "code": "36377",
        "ort": "Rastenberg"
    },
    {
        "code": "36378",
        "ort": "Ostramondra"
    },
    {
        "code": "36379",
        "ort": "Holzengel"
    },
    {
        "code": "3641",
        "ort": "Jena\n3642\n36421"
    },
    {
        "code": "3641",
        "ort": "Jena"
    },
    {
        "code": "3642\n36421",
        "ort": "Camburg\n36422"
    },
    {
        "code": "36421",
        "ort": "Camburg"
    },
    {
        "code": "36422",
        "ort": "Reinstädt"
    },
    {
        "code": "36423",
        "ort": "Orlamünde"
    },
    {
        "code": "36424",
        "ort": "Kahla"
    },
    {
        "code": "36425",
        "ort": "Isserstedt"
    },
    {
        "code": "36426",
        "ort": "Ottendorf"
    },
    {
        "code": "36427",
        "ort": "Dornburg"
    },
    {
        "code": "36428",
        "ort": "Stadtroda"
    },
    {
        "code": "3643",
        "ort": "Weimar"
    },
    {
        "code": "3644",
        "ort": "Apolda"
    },
    {
        "code": "3645\n36450",
        "ort": "Kranichfeld\n36451"
    },
    {
        "code": "36450",
        "ort": "Kranichfeld"
    },
    {
        "code": "36451",
        "ort": "Buttelstedt"
    },
    {
        "code": "36452",
        "ort": "Berlstedt"
    },
    {
        "code": "36453",
        "ort": "Mellingen"
    },
    {
        "code": "36454",
        "ort": "Magdala"
    },
    {
        "code": "36458",
        "ort": "Bad"
    },
    {
        "code": "36459",
        "ort": "Blankenhain"
    },
    {
        "code": "3646\n36461",
        "ort": "Bad"
    },
    {
        "code": "36461",
        "ort": "Bad"
    },
    {
        "code": "36462",
        "ort": "Oßmannstedt"
    },
    {
        "code": "36463",
        "ort": "Gebstedt"
    },
    {
        "code": "36464",
        "ort": "Wormstedt"
    },
    {
        "code": "36465",
        "ort": "Oberndorf"
    },
    {
        "code": "3647",
        "ort": "Pößneck"
    },
    {
        "code": "3648\n36481",
        "ort": "Neustadt"
    },
    {
        "code": "36481",
        "ort": "Neustadt"
    },
    {
        "code": "36482",
        "ort": "Triptis"
    },
    {
        "code": "36483",
        "ort": "Ziegenrück"
    },
    {
        "code": "36484",
        "ort": "Knau"
    },
    {
        "code": "3641",
        "ort": "Jena"
    },
    {
        "code": "3642\n36421",
        "ort": "Camburg\n36422"
    },
    {
        "code": "36421",
        "ort": "Camburg"
    },
    {
        "code": "36422",
        "ort": "Reinstädt"
    },
    {
        "code": "36423",
        "ort": "Orlamünde"
    },
    {
        "code": "36424",
        "ort": "Kahla"
    },
    {
        "code": "36425",
        "ort": "Isserstedt"
    },
    {
        "code": "36426",
        "ort": "Ottendorf"
    },
    {
        "code": "36427",
        "ort": "Dornburg"
    },
    {
        "code": "36428",
        "ort": "Stadtroda"
    },
    {
        "code": "3643",
        "ort": "Weimar"
    },
    {
        "code": "3644",
        "ort": "Apolda"
    },
    {
        "code": "3645\n36450",
        "ort": "Kranichfeld\n36451"
    },
    {
        "code": "36450",
        "ort": "Kranichfeld"
    },
    {
        "code": "36451",
        "ort": "Buttelstedt"
    },
    {
        "code": "36452",
        "ort": "Berlstedt"
    },
    {
        "code": "36453",
        "ort": "Mellingen"
    },
    {
        "code": "36454",
        "ort": "Magdala"
    },
    {
        "code": "36458",
        "ort": "Bad"
    },
    {
        "code": "36459",
        "ort": "Blankenhain"
    },
    {
        "code": "3646\n36461",
        "ort": "Bad"
    },
    {
        "code": "36461",
        "ort": "Bad"
    },
    {
        "code": "36462",
        "ort": "Oßmannstedt"
    },
    {
        "code": "36463",
        "ort": "Gebstedt"
    },
    {
        "code": "36464",
        "ort": "Wormstedt"
    },
    {
        "code": "36465",
        "ort": "Oberndorf"
    },
    {
        "code": "3647",
        "ort": "Pößneck"
    },
    {
        "code": "3648\n36481",
        "ort": "Neustadt"
    },
    {
        "code": "36481",
        "ort": "Neustadt"
    },
    {
        "code": "36482",
        "ort": "Triptis"
    },
    {
        "code": "36483",
        "ort": "Ziegenrück"
    },
    {
        "code": "36484",
        "ort": "Knau"
    },
    {
        "code": "36421",
        "ort": "Camburg"
    },
    {
        "code": "36422",
        "ort": "Reinstädt"
    },
    {
        "code": "36423",
        "ort": "Orlamünde"
    },
    {
        "code": "36424",
        "ort": "Kahla"
    },
    {
        "code": "36425",
        "ort": "Isserstedt"
    },
    {
        "code": "36426",
        "ort": "Ottendorf"
    },
    {
        "code": "36427",
        "ort": "Dornburg"
    },
    {
        "code": "36428",
        "ort": "Stadtroda"
    },
    {
        "code": "36450",
        "ort": "Kranichfeld"
    },
    {
        "code": "36451",
        "ort": "Buttelstedt"
    },
    {
        "code": "36452",
        "ort": "Berlstedt"
    },
    {
        "code": "36453",
        "ort": "Mellingen"
    },
    {
        "code": "36454",
        "ort": "Magdala"
    },
    {
        "code": "36458",
        "ort": "Bad"
    },
    {
        "code": "36459",
        "ort": "Blankenhain"
    },
    {
        "code": "36461",
        "ort": "Bad"
    },
    {
        "code": "36462",
        "ort": "Oßmannstedt"
    },
    {
        "code": "36463",
        "ort": "Gebstedt"
    },
    {
        "code": "36464",
        "ort": "Wormstedt"
    },
    {
        "code": "36465",
        "ort": "Oberndorf"
    },
    {
        "code": "36481",
        "ort": "Neustadt"
    },
    {
        "code": "36482",
        "ort": "Triptis"
    },
    {
        "code": "36483",
        "ort": "Ziegenrück"
    },
    {
        "code": "36484",
        "ort": "Knau"
    },
    {
        "code": "365",
        "ort": "Gera\n3660\n36601"
    },
    {
        "code": "3660\n36601",
        "ort": "Hermsdorf\n36602"
    },
    {
        "code": "36601",
        "ort": "Hermsdorf"
    },
    {
        "code": "36602",
        "ort": "Ronneburg"
    },
    {
        "code": "36603",
        "ort": "Weida"
    },
    {
        "code": "36604",
        "ort": "Münchenbernsdorf"
    },
    {
        "code": "36605",
        "ort": "Bad"
    },
    {
        "code": "36606",
        "ort": "Kraftsdorf"
    },
    {
        "code": "36607",
        "ort": "Niederpöllnitz"
    },
    {
        "code": "36608",
        "ort": "Seelingstädt"
    },
    {
        "code": "3661",
        "ort": "Greiz"
    },
    {
        "code": "3662\n36621",
        "ort": "Elsterberg\n36622"
    },
    {
        "code": "36621",
        "ort": "Elsterberg"
    },
    {
        "code": "36622",
        "ort": "Triebes"
    },
    {
        "code": "36623",
        "ort": "Berga/Elster"
    },
    {
        "code": "36624",
        "ort": "Teichwolframsdorf"
    },
    {
        "code": "36625",
        "ort": "Langenwetzendorf"
    },
    {
        "code": "36626",
        "ort": "Auma"
    },
    {
        "code": "36628",
        "ort": "Zeulenroda"
    },
    {
        "code": "3663",
        "ort": "Schleiz"
    },
    {
        "code": "3664\n36640",
        "ort": "Remptendorf\n36642"
    },
    {
        "code": "36640",
        "ort": "Remptendorf"
    },
    {
        "code": "36642",
        "ort": "Harra"
    },
    {
        "code": "36643",
        "ort": "Thimmendorf"
    },
    {
        "code": "36644",
        "ort": "Hirschberg"
    },
    {
        "code": "36645",
        "ort": "Mühltroff"
    },
    {
        "code": "36646",
        "ort": "Tanna"
    },
    {
        "code": "36647",
        "ort": "Saalburg"
    },
    {
        "code": "36648",
        "ort": "Dittersdorf"
    },
    {
        "code": "36649",
        "ort": "Gefell"
    },
    {
        "code": "3665\n36651",
        "ort": "Bad"
    },
    {
        "code": "36651",
        "ort": "Bad"
    },
    {
        "code": "36652",
        "ort": "Wurzbach"
    },
    {
        "code": "36653",
        "ort": "Lehesten"
    },
    {
        "code": "3669\n36691",
        "ort": "Eisenberg"
    },
    {
        "code": "36691",
        "ort": "Eisenberg"
    },
    {
        "code": "36692",
        "ort": "Bürgel"
    },
    {
        "code": "36693",
        "ort": "Crossen"
    },
    {
        "code": "36694",
        "ort": "Schkölen"
    },
    {
        "code": "3660\n36601",
        "ort": "Hermsdorf\n36602"
    },
    {
        "code": "36601",
        "ort": "Hermsdorf"
    },
    {
        "code": "36602",
        "ort": "Ronneburg"
    },
    {
        "code": "36603",
        "ort": "Weida"
    },
    {
        "code": "36604",
        "ort": "Münchenbernsdorf"
    },
    {
        "code": "36605",
        "ort": "Bad"
    },
    {
        "code": "36606",
        "ort": "Kraftsdorf"
    },
    {
        "code": "36607",
        "ort": "Niederpöllnitz"
    },
    {
        "code": "36608",
        "ort": "Seelingstädt"
    },
    {
        "code": "3661",
        "ort": "Greiz"
    },
    {
        "code": "3662\n36621",
        "ort": "Elsterberg\n36622"
    },
    {
        "code": "36621",
        "ort": "Elsterberg"
    },
    {
        "code": "36622",
        "ort": "Triebes"
    },
    {
        "code": "36623",
        "ort": "Berga/Elster"
    },
    {
        "code": "36624",
        "ort": "Teichwolframsdorf"
    },
    {
        "code": "36625",
        "ort": "Langenwetzendorf"
    },
    {
        "code": "36626",
        "ort": "Auma"
    },
    {
        "code": "36628",
        "ort": "Zeulenroda"
    },
    {
        "code": "3663",
        "ort": "Schleiz"
    },
    {
        "code": "3664\n36640",
        "ort": "Remptendorf\n36642"
    },
    {
        "code": "36640",
        "ort": "Remptendorf"
    },
    {
        "code": "36642",
        "ort": "Harra"
    },
    {
        "code": "36643",
        "ort": "Thimmendorf"
    },
    {
        "code": "36644",
        "ort": "Hirschberg"
    },
    {
        "code": "36645",
        "ort": "Mühltroff"
    },
    {
        "code": "36646",
        "ort": "Tanna"
    },
    {
        "code": "36647",
        "ort": "Saalburg"
    },
    {
        "code": "36648",
        "ort": "Dittersdorf"
    },
    {
        "code": "36649",
        "ort": "Gefell"
    },
    {
        "code": "3665\n36651",
        "ort": "Bad"
    },
    {
        "code": "36651",
        "ort": "Bad"
    },
    {
        "code": "36652",
        "ort": "Wurzbach"
    },
    {
        "code": "36653",
        "ort": "Lehesten"
    },
    {
        "code": "3669\n36691",
        "ort": "Eisenberg"
    },
    {
        "code": "36691",
        "ort": "Eisenberg"
    },
    {
        "code": "36692",
        "ort": "Bürgel"
    },
    {
        "code": "36693",
        "ort": "Crossen"
    },
    {
        "code": "36694",
        "ort": "Schkölen"
    },
    {
        "code": "36601",
        "ort": "Hermsdorf"
    },
    {
        "code": "36602",
        "ort": "Ronneburg"
    },
    {
        "code": "36603",
        "ort": "Weida"
    },
    {
        "code": "36604",
        "ort": "Münchenbernsdorf"
    },
    {
        "code": "36605",
        "ort": "Bad"
    },
    {
        "code": "36606",
        "ort": "Kraftsdorf"
    },
    {
        "code": "36607",
        "ort": "Niederpöllnitz"
    },
    {
        "code": "36608",
        "ort": "Seelingstädt"
    },
    {
        "code": "36621",
        "ort": "Elsterberg"
    },
    {
        "code": "36622",
        "ort": "Triebes"
    },
    {
        "code": "36623",
        "ort": "Berga/Elster"
    },
    {
        "code": "36624",
        "ort": "Teichwolframsdorf"
    },
    {
        "code": "36625",
        "ort": "Langenwetzendorf"
    },
    {
        "code": "36626",
        "ort": "Auma"
    },
    {
        "code": "36628",
        "ort": "Zeulenroda"
    },
    {
        "code": "36640",
        "ort": "Remptendorf"
    },
    {
        "code": "36642",
        "ort": "Harra"
    },
    {
        "code": "36643",
        "ort": "Thimmendorf"
    },
    {
        "code": "36644",
        "ort": "Hirschberg"
    },
    {
        "code": "36645",
        "ort": "Mühltroff"
    },
    {
        "code": "36646",
        "ort": "Tanna"
    },
    {
        "code": "36647",
        "ort": "Saalburg"
    },
    {
        "code": "36648",
        "ort": "Dittersdorf"
    },
    {
        "code": "36649",
        "ort": "Gefell"
    },
    {
        "code": "36651",
        "ort": "Bad"
    },
    {
        "code": "36652",
        "ort": "Wurzbach"
    },
    {
        "code": "36653",
        "ort": "Lehesten"
    },
    {
        "code": "36691",
        "ort": "Eisenberg"
    },
    {
        "code": "36692",
        "ort": "Bürgel"
    },
    {
        "code": "36693",
        "ort": "Crossen"
    },
    {
        "code": "36694",
        "ort": "Schkölen"
    },
    {
        "code": "3670\n36701",
        "ort": "Lichte\n36702"
    },
    {
        "code": "3670\n36701",
        "ort": "Lichte\n36702"
    },
    {
        "code": "36701",
        "ort": "Lichte"
    },
    {
        "code": "36702",
        "ort": "Lauscha"
    },
    {
        "code": "36703",
        "ort": "Gräfenthal"
    },
    {
        "code": "36704",
        "ort": "Steinheid"
    },
    {
        "code": "36705",
        "ort": "Oberweißbach"
    },
    {
        "code": "3671",
        "ort": "Saalfeld/Saale"
    },
    {
        "code": "3672",
        "ort": "Rudolstadt"
    },
    {
        "code": "3673\n36730",
        "ort": "Sitzendorf\n36731"
    },
    {
        "code": "36730",
        "ort": "Sitzendorf"
    },
    {
        "code": "36731",
        "ort": "Unterloquitz"
    },
    {
        "code": "36732",
        "ort": "Könitz"
    },
    {
        "code": "36733",
        "ort": "Kaulsdorf"
    },
    {
        "code": "36734",
        "ort": "Leutenberg"
    },
    {
        "code": "36735",
        "ort": "Probstzella"
    },
    {
        "code": "36736",
        "ort": "Arnsgereuth"
    },
    {
        "code": "36737",
        "ort": "Drognitz"
    },
    {
        "code": "36738",
        "ort": "Königsee"
    },
    {
        "code": "36739",
        "ort": "Rottenbach"
    },
    {
        "code": "3674\n36741",
        "ort": "Bad"
    },
    {
        "code": "36741",
        "ort": "Bad"
    },
    {
        "code": "36742",
        "ort": "Uhlstädt"
    },
    {
        "code": "36743",
        "ort": "Teichel"
    },
    {
        "code": "36744",
        "ort": "Remda"
    },
    {
        "code": "3675",
        "ort": "Sonneberg"
    },
    {
        "code": "3676\n36761",
        "ort": "Heubisch\n36762"
    },
    {
        "code": "36761",
        "ort": "Heubisch"
    },
    {
        "code": "36762",
        "ort": "Steinach"
    },
    {
        "code": "36764",
        "ort": "Neuhaus-Schierschnitz"
    },
    {
        "code": "36766",
        "ort": "Schalkau"
    },
    {
        "code": "3677",
        "ort": "Ilmenau"
    },
    {
        "code": "3678\n36781",
        "ort": "Großbreitenbach,"
    },
    {
        "code": "36781",
        "ort": "Großbreitenbach,"
    },
    {
        "code": "36782",
        "ort": "Schmiedefeld"
    },
    {
        "code": "36783",
        "ort": "Gehren"
    },
    {
        "code": "36784",
        "ort": "Stützerbach"
    },
    {
        "code": "36785",
        "ort": "Gräfinau-Angstedt"
    },
    {
        "code": "3679",
        "ort": "Neuhaus"
    },
    {
        "code": "3670\n36701",
        "ort": "Lichte\n36702"
    },
    {
        "code": "36701",
        "ort": "Lichte"
    },
    {
        "code": "36702",
        "ort": "Lauscha"
    },
    {
        "code": "36703",
        "ort": "Gräfenthal"
    },
    {
        "code": "36704",
        "ort": "Steinheid"
    },
    {
        "code": "36705",
        "ort": "Oberweißbach"
    },
    {
        "code": "3671",
        "ort": "Saalfeld/Saale"
    },
    {
        "code": "3672",
        "ort": "Rudolstadt"
    },
    {
        "code": "3673\n36730",
        "ort": "Sitzendorf\n36731"
    },
    {
        "code": "36730",
        "ort": "Sitzendorf"
    },
    {
        "code": "36731",
        "ort": "Unterloquitz"
    },
    {
        "code": "36732",
        "ort": "Könitz"
    },
    {
        "code": "36733",
        "ort": "Kaulsdorf"
    },
    {
        "code": "36734",
        "ort": "Leutenberg"
    },
    {
        "code": "36735",
        "ort": "Probstzella"
    },
    {
        "code": "36736",
        "ort": "Arnsgereuth"
    },
    {
        "code": "36737",
        "ort": "Drognitz"
    },
    {
        "code": "36738",
        "ort": "Königsee"
    },
    {
        "code": "36739",
        "ort": "Rottenbach"
    },
    {
        "code": "3674\n36741",
        "ort": "Bad"
    },
    {
        "code": "36741",
        "ort": "Bad"
    },
    {
        "code": "36742",
        "ort": "Uhlstädt"
    },
    {
        "code": "36743",
        "ort": "Teichel"
    },
    {
        "code": "36744",
        "ort": "Remda"
    },
    {
        "code": "3675",
        "ort": "Sonneberg"
    },
    {
        "code": "3676\n36761",
        "ort": "Heubisch\n36762"
    },
    {
        "code": "36761",
        "ort": "Heubisch"
    },
    {
        "code": "36762",
        "ort": "Steinach"
    },
    {
        "code": "36764",
        "ort": "Neuhaus-Schierschnitz"
    },
    {
        "code": "36766",
        "ort": "Schalkau"
    },
    {
        "code": "3677",
        "ort": "Ilmenau"
    },
    {
        "code": "3678\n36781",
        "ort": "Großbreitenbach,"
    },
    {
        "code": "36781",
        "ort": "Großbreitenbach,"
    },
    {
        "code": "36782",
        "ort": "Schmiedefeld"
    },
    {
        "code": "36783",
        "ort": "Gehren"
    },
    {
        "code": "36784",
        "ort": "Stützerbach"
    },
    {
        "code": "36785",
        "ort": "Gräfinau-Angstedt"
    },
    {
        "code": "3679",
        "ort": "Neuhaus"
    },
    {
        "code": "36701",
        "ort": "Lichte"
    },
    {
        "code": "36702",
        "ort": "Lauscha"
    },
    {
        "code": "36703",
        "ort": "Gräfenthal"
    },
    {
        "code": "36704",
        "ort": "Steinheid"
    },
    {
        "code": "36705",
        "ort": "Oberweißbach"
    },
    {
        "code": "36730",
        "ort": "Sitzendorf"
    },
    {
        "code": "36731",
        "ort": "Unterloquitz"
    },
    {
        "code": "36732",
        "ort": "Könitz"
    },
    {
        "code": "36733",
        "ort": "Kaulsdorf"
    },
    {
        "code": "36734",
        "ort": "Leutenberg"
    },
    {
        "code": "36735",
        "ort": "Probstzella"
    },
    {
        "code": "36736",
        "ort": "Arnsgereuth"
    },
    {
        "code": "36737",
        "ort": "Drognitz"
    },
    {
        "code": "36738",
        "ort": "Königsee"
    },
    {
        "code": "36739",
        "ort": "Rottenbach"
    },
    {
        "code": "36741",
        "ort": "Bad"
    },
    {
        "code": "36742",
        "ort": "Uhlstädt"
    },
    {
        "code": "36743",
        "ort": "Teichel"
    },
    {
        "code": "36744",
        "ort": "Remda"
    },
    {
        "code": "36761",
        "ort": "Heubisch"
    },
    {
        "code": "36762",
        "ort": "Steinach"
    },
    {
        "code": "36764",
        "ort": "Neuhaus-Schierschnitz"
    },
    {
        "code": "36766",
        "ort": "Schalkau"
    },
    {
        "code": "36781",
        "ort": "Großbreitenbach,"
    },
    {
        "code": "36782",
        "ort": "Schmiedefeld"
    },
    {
        "code": "36783",
        "ort": "Gehren"
    },
    {
        "code": "36784",
        "ort": "Stützerbach"
    },
    {
        "code": "36785",
        "ort": "Gräfinau-Angstedt"
    },
    {
        "code": "3681",
        "ort": "Suhl\n3682"
    },
    {
        "code": "3681",
        "ort": "Suhl"
    },
    {
        "code": "3682",
        "ort": "Zella-Mehlis"
    },
    {
        "code": "3683",
        "ort": "Schmalkalden"
    },
    {
        "code": "3684\n36840",
        "ort": "Trusetal\n36841"
    },
    {
        "code": "36840",
        "ort": "Trusetal"
    },
    {
        "code": "36841",
        "ort": "Schleusingen"
    },
    {
        "code": "36842",
        "ort": "Oberhof"
    },
    {
        "code": "36843",
        "ort": "Benshausen"
    },
    {
        "code": "36844",
        "ort": "Rohr"
    },
    {
        "code": "36845",
        "ort": "Gehlberg"
    },
    {
        "code": "36846",
        "ort": "Dietzhausen"
    },
    {
        "code": "36847",
        "ort": "Steinbach-Hallenberg"
    },
    {
        "code": "36848",
        "ort": "Wernshausen"
    },
    {
        "code": "36849",
        "ort": "Kleinschmalkalden"
    },
    {
        "code": "3685",
        "ort": "Hildburghausen"
    },
    {
        "code": "3686",
        "ort": "Eisfeld"
    },
    {
        "code": "3687\n36870",
        "ort": "Masserberg\n36871"
    },
    {
        "code": "36870",
        "ort": "Masserberg"
    },
    {
        "code": "36871",
        "ort": "Bad"
    },
    {
        "code": "36873",
        "ort": "Themar"
    },
    {
        "code": "36874",
        "ort": "Schönbrunn"
    },
    {
        "code": "36875",
        "ort": "Streufdorf"
    },
    {
        "code": "36878",
        "ort": "Brattendorf"
    },
    {
        "code": "3681",
        "ort": "Suhl"
    },
    {
        "code": "3682",
        "ort": "Zella-Mehlis"
    },
    {
        "code": "3683",
        "ort": "Schmalkalden"
    },
    {
        "code": "3684\n36840",
        "ort": "Trusetal\n36841"
    },
    {
        "code": "36840",
        "ort": "Trusetal"
    },
    {
        "code": "36841",
        "ort": "Schleusingen"
    },
    {
        "code": "36842",
        "ort": "Oberhof"
    },
    {
        "code": "36843",
        "ort": "Benshausen"
    },
    {
        "code": "36844",
        "ort": "Rohr"
    },
    {
        "code": "36845",
        "ort": "Gehlberg"
    },
    {
        "code": "36846",
        "ort": "Dietzhausen"
    },
    {
        "code": "36847",
        "ort": "Steinbach-Hallenberg"
    },
    {
        "code": "36848",
        "ort": "Wernshausen"
    },
    {
        "code": "36849",
        "ort": "Kleinschmalkalden"
    },
    {
        "code": "3685",
        "ort": "Hildburghausen"
    },
    {
        "code": "3686",
        "ort": "Eisfeld"
    },
    {
        "code": "3687\n36870",
        "ort": "Masserberg\n36871"
    },
    {
        "code": "36870",
        "ort": "Masserberg"
    },
    {
        "code": "36871",
        "ort": "Bad"
    },
    {
        "code": "36873",
        "ort": "Themar"
    },
    {
        "code": "36874",
        "ort": "Schönbrunn"
    },
    {
        "code": "36875",
        "ort": "Streufdorf"
    },
    {
        "code": "36878",
        "ort": "Brattendorf"
    },
    {
        "code": "36840",
        "ort": "Trusetal"
    },
    {
        "code": "36841",
        "ort": "Schleusingen"
    },
    {
        "code": "36842",
        "ort": "Oberhof"
    },
    {
        "code": "36843",
        "ort": "Benshausen"
    },
    {
        "code": "36844",
        "ort": "Rohr"
    },
    {
        "code": "36845",
        "ort": "Gehlberg"
    },
    {
        "code": "36846",
        "ort": "Dietzhausen"
    },
    {
        "code": "36847",
        "ort": "Steinbach-Hallenberg"
    },
    {
        "code": "36848",
        "ort": "Wernshausen"
    },
    {
        "code": "36849",
        "ort": "Kleinschmalkalden"
    },
    {
        "code": "36870",
        "ort": "Masserberg"
    },
    {
        "code": "36871",
        "ort": "Bad"
    },
    {
        "code": "36873",
        "ort": "Themar"
    },
    {
        "code": "36874",
        "ort": "Schönbrunn"
    },
    {
        "code": "36875",
        "ort": "Streufdorf"
    },
    {
        "code": "36878",
        "ort": "Brattendorf"
    },
    {
        "code": "3691",
        "ort": "Eisenach\n3692\n36920"
    },
    {
        "code": "3691",
        "ort": "Eisenach"
    },
    {
        "code": "3692\n36920",
        "ort": "Großenlupnitz\n36921"
    },
    {
        "code": "36920",
        "ort": "Großenlupnitz"
    },
    {
        "code": "36921",
        "ort": "Wutha-Farnroda"
    },
    {
        "code": "36922",
        "ort": "Gerstungen"
    },
    {
        "code": "36923",
        "ort": "Treffurt"
    },
    {
        "code": "36924",
        "ort": "Mihla"
    },
    {
        "code": "36925",
        "ort": "Marksuhl"
    },
    {
        "code": "36926",
        "ort": "Creuzburg"
    },
    {
        "code": "36927",
        "ort": "Unterellen"
    },
    {
        "code": "36928",
        "ort": "Neuenhof"
    },
    {
        "code": "36929",
        "ort": "Ruhla"
    },
    {
        "code": "3693",
        "ort": "Meiningen"
    },
    {
        "code": "3694\n36940",
        "ort": "Oepfershausen\n36941"
    },
    {
        "code": "36940",
        "ort": "Oepfershausen"
    },
    {
        "code": "36941",
        "ort": "Wasungen"
    },
    {
        "code": "36943",
        "ort": "Bettenhausen"
    },
    {
        "code": "36944",
        "ort": "Rentwertshausen"
    },
    {
        "code": "36945",
        "ort": "Henneberg"
    },
    {
        "code": "36946",
        "ort": "Reichenhausen"
    },
    {
        "code": "36947",
        "ort": "Jüchsen"
    },
    {
        "code": "36948",
        "ort": "Römhild"
    },
    {
        "code": "36949",
        "ort": "Obermaßfeld"
    },
    {
        "code": "3695",
        "ort": "Bad"
    },
    {
        "code": "3696\n36961",
        "ort": "Bad"
    },
    {
        "code": "36961",
        "ort": "Bad"
    },
    {
        "code": "36962",
        "ort": "Vacha"
    },
    {
        "code": "36963",
        "ort": "Dorndorf"
    },
    {
        "code": "36964",
        "ort": "Dermbach"
    },
    {
        "code": "36965",
        "ort": "Stadtlengsfeld"
    },
    {
        "code": "36966",
        "ort": "Kaltennordheim"
    },
    {
        "code": "36967",
        "ort": "Geisa"
    },
    {
        "code": "36968",
        "ort": "Roßdorf"
    },
    {
        "code": "36969",
        "ort": "Merkers"
    },
    {
        "code": "3691",
        "ort": "Eisenach"
    },
    {
        "code": "3692\n36920",
        "ort": "Großenlupnitz\n36921"
    },
    {
        "code": "36920",
        "ort": "Großenlupnitz"
    },
    {
        "code": "36921",
        "ort": "Wutha-Farnroda"
    },
    {
        "code": "36922",
        "ort": "Gerstungen"
    },
    {
        "code": "36923",
        "ort": "Treffurt"
    },
    {
        "code": "36924",
        "ort": "Mihla"
    },
    {
        "code": "36925",
        "ort": "Marksuhl"
    },
    {
        "code": "36926",
        "ort": "Creuzburg"
    },
    {
        "code": "36927",
        "ort": "Unterellen"
    },
    {
        "code": "36928",
        "ort": "Neuenhof"
    },
    {
        "code": "36929",
        "ort": "Ruhla"
    },
    {
        "code": "3693",
        "ort": "Meiningen"
    },
    {
        "code": "3694\n36940",
        "ort": "Oepfershausen\n36941"
    },
    {
        "code": "36940",
        "ort": "Oepfershausen"
    },
    {
        "code": "36941",
        "ort": "Wasungen"
    },
    {
        "code": "36943",
        "ort": "Bettenhausen"
    },
    {
        "code": "36944",
        "ort": "Rentwertshausen"
    },
    {
        "code": "36945",
        "ort": "Henneberg"
    },
    {
        "code": "36946",
        "ort": "Reichenhausen"
    },
    {
        "code": "36947",
        "ort": "Jüchsen"
    },
    {
        "code": "36948",
        "ort": "Römhild"
    },
    {
        "code": "36949",
        "ort": "Obermaßfeld"
    },
    {
        "code": "3695",
        "ort": "Bad"
    },
    {
        "code": "3696\n36961",
        "ort": "Bad"
    },
    {
        "code": "36961",
        "ort": "Bad"
    },
    {
        "code": "36962",
        "ort": "Vacha"
    },
    {
        "code": "36963",
        "ort": "Dorndorf"
    },
    {
        "code": "36964",
        "ort": "Dermbach"
    },
    {
        "code": "36965",
        "ort": "Stadtlengsfeld"
    },
    {
        "code": "36966",
        "ort": "Kaltennordheim"
    },
    {
        "code": "36967",
        "ort": "Geisa"
    },
    {
        "code": "36968",
        "ort": "Roßdorf"
    },
    {
        "code": "36969",
        "ort": "Merkers"
    },
    {
        "code": "36920",
        "ort": "Großenlupnitz"
    },
    {
        "code": "36921",
        "ort": "Wutha-Farnroda"
    },
    {
        "code": "36922",
        "ort": "Gerstungen"
    },
    {
        "code": "36923",
        "ort": "Treffurt"
    },
    {
        "code": "36924",
        "ort": "Mihla"
    },
    {
        "code": "36925",
        "ort": "Marksuhl"
    },
    {
        "code": "36926",
        "ort": "Creuzburg"
    },
    {
        "code": "36927",
        "ort": "Unterellen"
    },
    {
        "code": "36928",
        "ort": "Neuenhof"
    },
    {
        "code": "36929",
        "ort": "Ruhla"
    },
    {
        "code": "36940",
        "ort": "Oepfershausen"
    },
    {
        "code": "36941",
        "ort": "Wasungen"
    },
    {
        "code": "36943",
        "ort": "Bettenhausen"
    },
    {
        "code": "36944",
        "ort": "Rentwertshausen"
    },
    {
        "code": "36945",
        "ort": "Henneberg"
    },
    {
        "code": "36946",
        "ort": "Reichenhausen"
    },
    {
        "code": "36947",
        "ort": "Jüchsen"
    },
    {
        "code": "36948",
        "ort": "Römhild"
    },
    {
        "code": "36949",
        "ort": "Obermaßfeld"
    },
    {
        "code": "36961",
        "ort": "Bad"
    },
    {
        "code": "36962",
        "ort": "Vacha"
    },
    {
        "code": "36963",
        "ort": "Dorndorf"
    },
    {
        "code": "36964",
        "ort": "Dermbach"
    },
    {
        "code": "36965",
        "ort": "Stadtlengsfeld"
    },
    {
        "code": "36966",
        "ort": "Kaltennordheim"
    },
    {
        "code": "36967",
        "ort": "Geisa"
    },
    {
        "code": "36968",
        "ort": "Roßdorf"
    },
    {
        "code": "36969",
        "ort": "Merkers"
    },
    {
        "code": "371",
        "ort": "Chemnitz"
    },
    {
        "code": "372\n3720\n37200",
        "ort": "Wittgensdorf\n37202"
    },
    {
        "code": "3720\n37200",
        "ort": "Wittgensdorf\n37202"
    },
    {
        "code": "37200",
        "ort": "Wittgensdorf"
    },
    {
        "code": "37202",
        "ort": "Claußnitz"
    },
    {
        "code": "37203",
        "ort": "Gersdorf"
    },
    {
        "code": "37204",
        "ort": "Lichtenstein"
    },
    {
        "code": "37206",
        "ort": "Frankenberg"
    },
    {
        "code": "37207",
        "ort": "Hainichen"
    },
    {
        "code": "37208",
        "ort": "Oberlichtenau"
    },
    {
        "code": "37209",
        "ort": "Einsiedel"
    },
    {
        "code": "3721",
        "ort": "Meinersdorf"
    },
    {
        "code": "3722",
        "ort": "Limbach-Oberfrohna"
    },
    {
        "code": "3723",
        "ort": "Hohenstein-Ernstthal"
    },
    {
        "code": "3724",
        "ort": "Burgstädt"
    },
    {
        "code": "3725",
        "ort": "Zschopau"
    },
    {
        "code": "3726",
        "ort": "Flöha"
    },
    {
        "code": "3727",
        "ort": "Mittweida"
    },
    {
        "code": "3729\n37291",
        "ort": "Augustusburg\n37292"
    },
    {
        "code": "37291",
        "ort": "Augustusburg"
    },
    {
        "code": "37292",
        "ort": "Oederan"
    },
    {
        "code": "37293",
        "ort": "Eppendorf"
    },
    {
        "code": "37294",
        "ort": "Grünhainichen"
    },
    {
        "code": "37295",
        "ort": "Lugau/Erzgeb."
    },
    {
        "code": "37296",
        "ort": "Stollberg/Erzgeb."
    },
    {
        "code": "37297",
        "ort": "Thum"
    },
    {
        "code": "37298",
        "ort": "Oelsnitz"
    },
    {
        "code": "3720\n37200",
        "ort": "Wittgensdorf\n37202"
    },
    {
        "code": "37200",
        "ort": "Wittgensdorf"
    },
    {
        "code": "37202",
        "ort": "Claußnitz"
    },
    {
        "code": "37203",
        "ort": "Gersdorf"
    },
    {
        "code": "37204",
        "ort": "Lichtenstein"
    },
    {
        "code": "37206",
        "ort": "Frankenberg"
    },
    {
        "code": "37207",
        "ort": "Hainichen"
    },
    {
        "code": "37208",
        "ort": "Oberlichtenau"
    },
    {
        "code": "37209",
        "ort": "Einsiedel"
    },
    {
        "code": "3721",
        "ort": "Meinersdorf"
    },
    {
        "code": "3722",
        "ort": "Limbach-Oberfrohna"
    },
    {
        "code": "3723",
        "ort": "Hohenstein-Ernstthal"
    },
    {
        "code": "3724",
        "ort": "Burgstädt"
    },
    {
        "code": "3725",
        "ort": "Zschopau"
    },
    {
        "code": "3726",
        "ort": "Flöha"
    },
    {
        "code": "3727",
        "ort": "Mittweida"
    },
    {
        "code": "3729\n37291",
        "ort": "Augustusburg\n37292"
    },
    {
        "code": "37291",
        "ort": "Augustusburg"
    },
    {
        "code": "37292",
        "ort": "Oederan"
    },
    {
        "code": "37293",
        "ort": "Eppendorf"
    },
    {
        "code": "37294",
        "ort": "Grünhainichen"
    },
    {
        "code": "37295",
        "ort": "Lugau/Erzgeb."
    },
    {
        "code": "37296",
        "ort": "Stollberg/Erzgeb."
    },
    {
        "code": "37297",
        "ort": "Thum"
    },
    {
        "code": "37298",
        "ort": "Oelsnitz"
    },
    {
        "code": "37200",
        "ort": "Wittgensdorf"
    },
    {
        "code": "37202",
        "ort": "Claußnitz"
    },
    {
        "code": "37203",
        "ort": "Gersdorf"
    },
    {
        "code": "37204",
        "ort": "Lichtenstein"
    },
    {
        "code": "37206",
        "ort": "Frankenberg"
    },
    {
        "code": "37207",
        "ort": "Hainichen"
    },
    {
        "code": "37208",
        "ort": "Oberlichtenau"
    },
    {
        "code": "37209",
        "ort": "Einsiedel"
    },
    {
        "code": "37291",
        "ort": "Augustusburg"
    },
    {
        "code": "37292",
        "ort": "Oederan"
    },
    {
        "code": "37293",
        "ort": "Eppendorf"
    },
    {
        "code": "37294",
        "ort": "Grünhainichen"
    },
    {
        "code": "37295",
        "ort": "Lugau/Erzgeb."
    },
    {
        "code": "37296",
        "ort": "Stollberg/Erzgeb."
    },
    {
        "code": "37297",
        "ort": "Thum"
    },
    {
        "code": "37298",
        "ort": "Oelsnitz"
    },
    {
        "code": "3731",
        "ort": "Freiberg"
    },
    {
        "code": "3731",
        "ort": "Freiberg"
    },
    {
        "code": "3732\n37320",
        "ort": "Mulda/Sa.\n37321"
    },
    {
        "code": "37320",
        "ort": "Mulda/Sa."
    },
    {
        "code": "37321",
        "ort": "Frankenstein"
    },
    {
        "code": "37322",
        "ort": "Brand-Erbisdorf"
    },
    {
        "code": "37323",
        "ort": "Lichtenberg"
    },
    {
        "code": "37324",
        "ort": "Reinsberg"
    },
    {
        "code": "37325",
        "ort": "Niederbobritzsch"
    },
    {
        "code": "37326",
        "ort": "Frauenstein"
    },
    {
        "code": "37327",
        "ort": "Rechenberg-Bienenmühle"
    },
    {
        "code": "37328",
        "ort": "Großschirma"
    },
    {
        "code": "37329",
        "ort": "Großhartmannsdorf"
    },
    {
        "code": "3733",
        "ort": "Annaberg-Buchholz"
    },
    {
        "code": "3734\n37341",
        "ort": "Ehrenfriedersdorf\n37342"
    },
    {
        "code": "37341",
        "ort": "Ehrenfriedersdorf"
    },
    {
        "code": "37342",
        "ort": "Cranzahl"
    },
    {
        "code": "37343",
        "ort": "Jöhstadt"
    },
    {
        "code": "37344",
        "ort": "Crottendorf"
    },
    {
        "code": "37346",
        "ort": "Geyer"
    },
    {
        "code": "37347",
        "ort": "Bärenstein"
    },
    {
        "code": "37348",
        "ort": "Oberwiesenthal"
    },
    {
        "code": "37349",
        "ort": "Scheibenberg"
    },
    {
        "code": "3735",
        "ort": "Marienberg"
    },
    {
        "code": "3736\n37360",
        "ort": "Olbernhau\n37361"
    },
    {
        "code": "37360",
        "ort": "Olbernhau"
    },
    {
        "code": "37361",
        "ort": "Neuhausen/Erzgeb."
    },
    {
        "code": "37362",
        "ort": "Seiffen/Erzgeb."
    },
    {
        "code": "37363",
        "ort": "Zöblitz"
    },
    {
        "code": "37364",
        "ort": "Reitzenhain"
    },
    {
        "code": "37365",
        "ort": "Sayda"
    },
    {
        "code": "37366",
        "ort": "Rübenau"
    },
    {
        "code": "37367",
        "ort": "Lengefeld"
    },
    {
        "code": "37368",
        "ort": "Deutschneudorf"
    },
    {
        "code": "37369",
        "ort": "Wolkenstein"
    },
    {
        "code": "3737",
        "ort": "Rochlitz"
    },
    {
        "code": "3738\n37381",
        "ort": "Penig\n37382"
    },
    {
        "code": "37381",
        "ort": "Penig"
    },
    {
        "code": "37382",
        "ort": "Geringswalde"
    },
    {
        "code": "37383",
        "ort": "Lunzenau"
    },
    {
        "code": "37384",
        "ort": "Wechselburg"
    },
    {
        "code": "3731",
        "ort": "Freiberg"
    },
    {
        "code": "3732\n37320",
        "ort": "Mulda/Sa.\n37321"
    },
    {
        "code": "37320",
        "ort": "Mulda/Sa."
    },
    {
        "code": "37321",
        "ort": "Frankenstein"
    },
    {
        "code": "37322",
        "ort": "Brand-Erbisdorf"
    },
    {
        "code": "37323",
        "ort": "Lichtenberg"
    },
    {
        "code": "37324",
        "ort": "Reinsberg"
    },
    {
        "code": "37325",
        "ort": "Niederbobritzsch"
    },
    {
        "code": "37326",
        "ort": "Frauenstein"
    },
    {
        "code": "37327",
        "ort": "Rechenberg-Bienenmühle"
    },
    {
        "code": "37328",
        "ort": "Großschirma"
    },
    {
        "code": "37329",
        "ort": "Großhartmannsdorf"
    },
    {
        "code": "3733",
        "ort": "Annaberg-Buchholz"
    },
    {
        "code": "3734\n37341",
        "ort": "Ehrenfriedersdorf\n37342"
    },
    {
        "code": "37341",
        "ort": "Ehrenfriedersdorf"
    },
    {
        "code": "37342",
        "ort": "Cranzahl"
    },
    {
        "code": "37343",
        "ort": "Jöhstadt"
    },
    {
        "code": "37344",
        "ort": "Crottendorf"
    },
    {
        "code": "37346",
        "ort": "Geyer"
    },
    {
        "code": "37347",
        "ort": "Bärenstein"
    },
    {
        "code": "37348",
        "ort": "Oberwiesenthal"
    },
    {
        "code": "37349",
        "ort": "Scheibenberg"
    },
    {
        "code": "3735",
        "ort": "Marienberg"
    },
    {
        "code": "3736\n37360",
        "ort": "Olbernhau\n37361"
    },
    {
        "code": "37360",
        "ort": "Olbernhau"
    },
    {
        "code": "37361",
        "ort": "Neuhausen/Erzgeb."
    },
    {
        "code": "37362",
        "ort": "Seiffen/Erzgeb."
    },
    {
        "code": "37363",
        "ort": "Zöblitz"
    },
    {
        "code": "37364",
        "ort": "Reitzenhain"
    },
    {
        "code": "37365",
        "ort": "Sayda"
    },
    {
        "code": "37366",
        "ort": "Rübenau"
    },
    {
        "code": "37367",
        "ort": "Lengefeld"
    },
    {
        "code": "37368",
        "ort": "Deutschneudorf"
    },
    {
        "code": "37369",
        "ort": "Wolkenstein"
    },
    {
        "code": "3737",
        "ort": "Rochlitz"
    },
    {
        "code": "3738\n37381",
        "ort": "Penig\n37382"
    },
    {
        "code": "37381",
        "ort": "Penig"
    },
    {
        "code": "37382",
        "ort": "Geringswalde"
    },
    {
        "code": "37383",
        "ort": "Lunzenau"
    },
    {
        "code": "37384",
        "ort": "Wechselburg"
    },
    {
        "code": "37320",
        "ort": "Mulda/Sa."
    },
    {
        "code": "37321",
        "ort": "Frankenstein"
    },
    {
        "code": "37322",
        "ort": "Brand-Erbisdorf"
    },
    {
        "code": "37323",
        "ort": "Lichtenberg"
    },
    {
        "code": "37324",
        "ort": "Reinsberg"
    },
    {
        "code": "37325",
        "ort": "Niederbobritzsch"
    },
    {
        "code": "37326",
        "ort": "Frauenstein"
    },
    {
        "code": "37327",
        "ort": "Rechenberg-Bienenmühle"
    },
    {
        "code": "37328",
        "ort": "Großschirma"
    },
    {
        "code": "37329",
        "ort": "Großhartmannsdorf"
    },
    {
        "code": "37341",
        "ort": "Ehrenfriedersdorf"
    },
    {
        "code": "37342",
        "ort": "Cranzahl"
    },
    {
        "code": "37343",
        "ort": "Jöhstadt"
    },
    {
        "code": "37344",
        "ort": "Crottendorf"
    },
    {
        "code": "37346",
        "ort": "Geyer"
    },
    {
        "code": "37347",
        "ort": "Bärenstein"
    },
    {
        "code": "37348",
        "ort": "Oberwiesenthal"
    },
    {
        "code": "37349",
        "ort": "Scheibenberg"
    },
    {
        "code": "37360",
        "ort": "Olbernhau"
    },
    {
        "code": "37361",
        "ort": "Neuhausen/Erzgeb."
    },
    {
        "code": "37362",
        "ort": "Seiffen/Erzgeb."
    },
    {
        "code": "37363",
        "ort": "Zöblitz"
    },
    {
        "code": "37364",
        "ort": "Reitzenhain"
    },
    {
        "code": "37365",
        "ort": "Sayda"
    },
    {
        "code": "37366",
        "ort": "Rübenau"
    },
    {
        "code": "37367",
        "ort": "Lengefeld"
    },
    {
        "code": "37368",
        "ort": "Deutschneudorf"
    },
    {
        "code": "37369",
        "ort": "Wolkenstein"
    },
    {
        "code": "37381",
        "ort": "Penig"
    },
    {
        "code": "37382",
        "ort": "Geringswalde"
    },
    {
        "code": "37383",
        "ort": "Lunzenau"
    },
    {
        "code": "37384",
        "ort": "Wechselburg"
    },
    {
        "code": "3741",
        "ort": "Plauen\n3742\n37421"
    },
    {
        "code": "3741",
        "ort": "Plauen"
    },
    {
        "code": "3742\n37421",
        "ort": "Oelsnitz"
    },
    {
        "code": "37421",
        "ort": "Oelsnitz"
    },
    {
        "code": "37422",
        "ort": "Markneukirchen"
    },
    {
        "code": "37423",
        "ort": "Adorf"
    },
    {
        "code": "3743\n37430",
        "ort": "Eichigt\n37431"
    },
    {
        "code": "37430",
        "ort": "Eichigt"
    },
    {
        "code": "37431",
        "ort": "Mehltheuer"
    },
    {
        "code": "37432",
        "ort": "Pausa/Vogtl."
    },
    {
        "code": "37433",
        "ort": "Gutenfürst"
    },
    {
        "code": "37434",
        "ort": "Bobenneukirchen"
    },
    {
        "code": "37435",
        "ort": "Reuth"
    },
    {
        "code": "37436",
        "ort": "Weischlitz"
    },
    {
        "code": "37437",
        "ort": "Bad"
    },
    {
        "code": "37438",
        "ort": "Bad"
    },
    {
        "code": "37439",
        "ort": "Jocketa"
    },
    {
        "code": "3744",
        "ort": "Auerbach/Vogtl."
    },
    {
        "code": "3745",
        "ort": "Falkenstein"
    },
    {
        "code": "3746\n37462",
        "ort": "Rothenkirchen"
    },
    {
        "code": "37462",
        "ort": "Rothenkirchen"
    },
    {
        "code": "37463",
        "ort": "Bergen,"
    },
    {
        "code": "37464",
        "ort": "Schöneck/Vogtl."
    },
    {
        "code": "37465",
        "ort": "Tannenbergsthal"
    },
    {
        "code": "37467",
        "ort": "Klingenthal"
    },
    {
        "code": "37468",
        "ort": "Treuen"
    },
    {
        "code": "3741",
        "ort": "Plauen"
    },
    {
        "code": "3742\n37421",
        "ort": "Oelsnitz"
    },
    {
        "code": "37421",
        "ort": "Oelsnitz"
    },
    {
        "code": "37422",
        "ort": "Markneukirchen"
    },
    {
        "code": "37423",
        "ort": "Adorf"
    },
    {
        "code": "3743\n37430",
        "ort": "Eichigt\n37431"
    },
    {
        "code": "37430",
        "ort": "Eichigt"
    },
    {
        "code": "37431",
        "ort": "Mehltheuer"
    },
    {
        "code": "37432",
        "ort": "Pausa/Vogtl."
    },
    {
        "code": "37433",
        "ort": "Gutenfürst"
    },
    {
        "code": "37434",
        "ort": "Bobenneukirchen"
    },
    {
        "code": "37435",
        "ort": "Reuth"
    },
    {
        "code": "37436",
        "ort": "Weischlitz"
    },
    {
        "code": "37437",
        "ort": "Bad"
    },
    {
        "code": "37438",
        "ort": "Bad"
    },
    {
        "code": "37439",
        "ort": "Jocketa"
    },
    {
        "code": "3744",
        "ort": "Auerbach/Vogtl."
    },
    {
        "code": "3745",
        "ort": "Falkenstein"
    },
    {
        "code": "3746\n37462",
        "ort": "Rothenkirchen"
    },
    {
        "code": "37462",
        "ort": "Rothenkirchen"
    },
    {
        "code": "37463",
        "ort": "Bergen,"
    },
    {
        "code": "37464",
        "ort": "Schöneck/Vogtl."
    },
    {
        "code": "37465",
        "ort": "Tannenbergsthal"
    },
    {
        "code": "37467",
        "ort": "Klingenthal"
    },
    {
        "code": "37468",
        "ort": "Treuen"
    },
    {
        "code": "37421",
        "ort": "Oelsnitz"
    },
    {
        "code": "37422",
        "ort": "Markneukirchen"
    },
    {
        "code": "37423",
        "ort": "Adorf"
    },
    {
        "code": "37430",
        "ort": "Eichigt"
    },
    {
        "code": "37431",
        "ort": "Mehltheuer"
    },
    {
        "code": "37432",
        "ort": "Pausa/Vogtl."
    },
    {
        "code": "37433",
        "ort": "Gutenfürst"
    },
    {
        "code": "37434",
        "ort": "Bobenneukirchen"
    },
    {
        "code": "37435",
        "ort": "Reuth"
    },
    {
        "code": "37436",
        "ort": "Weischlitz"
    },
    {
        "code": "37437",
        "ort": "Bad"
    },
    {
        "code": "37438",
        "ort": "Bad"
    },
    {
        "code": "37439",
        "ort": "Jocketa"
    },
    {
        "code": "37462",
        "ort": "Rothenkirchen"
    },
    {
        "code": "37463",
        "ort": "Bergen,"
    },
    {
        "code": "37464",
        "ort": "Schöneck/Vogtl."
    },
    {
        "code": "37465",
        "ort": "Tannenbergsthal"
    },
    {
        "code": "37467",
        "ort": "Klingenthal"
    },
    {
        "code": "37468",
        "ort": "Treuen"
    },
    {
        "code": "375",
        "ort": "Zwickau"
    },
    {
        "code": "376\n3760\n37600",
        "ort": "Neumark"
    },
    {
        "code": "3760\n37600",
        "ort": "Neumark"
    },
    {
        "code": "37600",
        "ort": "Neumark"
    },
    {
        "code": "37601",
        "ort": "Mülsen"
    },
    {
        "code": "37602",
        "ort": "Kirchberg"
    },
    {
        "code": "37603",
        "ort": "Wildenfels"
    },
    {
        "code": "37604",
        "ort": "Mosel"
    },
    {
        "code": "37605",
        "ort": "Hartenstein"
    },
    {
        "code": "37606",
        "ort": "Lengenfeld"
    },
    {
        "code": "37607",
        "ort": "Ebersbrunn"
    },
    {
        "code": "37608",
        "ort": "Waldenburg"
    },
    {
        "code": "37609",
        "ort": "Wolkenburg"
    },
    {
        "code": "3761",
        "ort": "Werdau"
    },
    {
        "code": "3762",
        "ort": "Crimmitschau"
    },
    {
        "code": "3763",
        "ort": "Glauchau"
    },
    {
        "code": "3764",
        "ort": "Meerane"
    },
    {
        "code": "3765",
        "ort": "Reichenbach"
    },
    {
        "code": "3760\n37600",
        "ort": "Neumark"
    },
    {
        "code": "37600",
        "ort": "Neumark"
    },
    {
        "code": "37601",
        "ort": "Mülsen"
    },
    {
        "code": "37602",
        "ort": "Kirchberg"
    },
    {
        "code": "37603",
        "ort": "Wildenfels"
    },
    {
        "code": "37604",
        "ort": "Mosel"
    },
    {
        "code": "37605",
        "ort": "Hartenstein"
    },
    {
        "code": "37606",
        "ort": "Lengenfeld"
    },
    {
        "code": "37607",
        "ort": "Ebersbrunn"
    },
    {
        "code": "37608",
        "ort": "Waldenburg"
    },
    {
        "code": "37609",
        "ort": "Wolkenburg"
    },
    {
        "code": "3761",
        "ort": "Werdau"
    },
    {
        "code": "3762",
        "ort": "Crimmitschau"
    },
    {
        "code": "3763",
        "ort": "Glauchau"
    },
    {
        "code": "3764",
        "ort": "Meerane"
    },
    {
        "code": "3765",
        "ort": "Reichenbach"
    },
    {
        "code": "37600",
        "ort": "Neumark"
    },
    {
        "code": "37601",
        "ort": "Mülsen"
    },
    {
        "code": "37602",
        "ort": "Kirchberg"
    },
    {
        "code": "37603",
        "ort": "Wildenfels"
    },
    {
        "code": "37604",
        "ort": "Mosel"
    },
    {
        "code": "37605",
        "ort": "Hartenstein"
    },
    {
        "code": "37606",
        "ort": "Lengenfeld"
    },
    {
        "code": "37607",
        "ort": "Ebersbrunn"
    },
    {
        "code": "37608",
        "ort": "Waldenburg"
    },
    {
        "code": "37609",
        "ort": "Wolkenburg"
    },
    {
        "code": "3771",
        "ort": "Aue"
    },
    {
        "code": "3771",
        "ort": "Aue"
    },
    {
        "code": "3772",
        "ort": "Schneeberg"
    },
    {
        "code": "3773",
        "ort": "Johanngeorgenstadt"
    },
    {
        "code": "3774",
        "ort": "Schwarzenberg/Erzgeb."
    },
    {
        "code": "3775\n37752",
        "ort": "Eibenstock\n37754"
    },
    {
        "code": "37752",
        "ort": "Eibenstock"
    },
    {
        "code": "37754",
        "ort": "Zwönitz"
    },
    {
        "code": "37755",
        "ort": "Schönheide"
    },
    {
        "code": "37756",
        "ort": "Breitenbrunn"
    },
    {
        "code": "37757",
        "ort": "Rittersgrün"
    },
    {
        "code": "3771",
        "ort": "Aue"
    },
    {
        "code": "3772",
        "ort": "Schneeberg"
    },
    {
        "code": "3773",
        "ort": "Johanngeorgenstadt"
    },
    {
        "code": "3774",
        "ort": "Schwarzenberg/Erzgeb."
    },
    {
        "code": "3775\n37752",
        "ort": "Eibenstock\n37754"
    },
    {
        "code": "37752",
        "ort": "Eibenstock"
    },
    {
        "code": "37754",
        "ort": "Zwönitz"
    },
    {
        "code": "37755",
        "ort": "Schönheide"
    },
    {
        "code": "37756",
        "ort": "Breitenbrunn"
    },
    {
        "code": "37757",
        "ort": "Rittersgrün"
    },
    {
        "code": "37752",
        "ort": "Eibenstock"
    },
    {
        "code": "37754",
        "ort": "Zwönitz"
    },
    {
        "code": "37755",
        "ort": "Schönheide"
    },
    {
        "code": "37756",
        "ort": "Breitenbrunn"
    },
    {
        "code": "37757",
        "ort": "Rittersgrün"
    },
    {
        "code": "381",
        "ort": "Rostock\n3820\n38201"
    },
    {
        "code": "3820\n38201",
        "ort": "Gelbensande\n38203"
    },
    {
        "code": "38201",
        "ort": "Gelbensande"
    },
    {
        "code": "38203",
        "ort": "Bad"
    },
    {
        "code": "38204",
        "ort": "Broderstorf"
    },
    {
        "code": "38205",
        "ort": "Tessin"
    },
    {
        "code": "38206",
        "ort": "Graal-Müritz"
    },
    {
        "code": "38207",
        "ort": "Kritzmow"
    },
    {
        "code": "38208",
        "ort": "Dummerstorf"
    },
    {
        "code": "38209",
        "ort": "Sanitz"
    },
    {
        "code": "3821",
        "ort": "Ribnitz-Damgarten,"
    },
    {
        "code": "3822\n38220",
        "ort": "Ahrenshoop,"
    },
    {
        "code": "38220",
        "ort": "Ahrenshoop,"
    },
    {
        "code": "38221",
        "ort": "Marlow"
    },
    {
        "code": "38222",
        "ort": "Ahrenshagen-Daskow-Gruel,"
    },
    {
        "code": "38223",
        "ort": "Ribnitz-Damgarten-Beiershagen,"
    },
    {
        "code": "38224",
        "ort": "Marlow-div."
    },
    {
        "code": "38225",
        "ort": "Ahrenshagen-Daskow-Prusdorf,"
    },
    {
        "code": "38226",
        "ort": "Dierhagen"
    },
    {
        "code": "38227",
        "ort": "Bartelshagen"
    },
    {
        "code": "3823\n38231",
        "ort": "Barth,"
    },
    {
        "code": "38231",
        "ort": "Barth,"
    },
    {
        "code": "38232",
        "ort": "Seeheilbad"
    },
    {
        "code": "38233",
        "ort": "Prerow,"
    },
    {
        "code": "38234",
        "ort": "Born"
    },
    {
        "code": "3829\n38292",
        "ort": "Kröpelin\n38293"
    },
    {
        "code": "38292",
        "ort": "Kröpelin"
    },
    {
        "code": "38293",
        "ort": "Kühlungsborn"
    },
    {
        "code": "38294",
        "ort": "Neubukow"
    },
    {
        "code": "38295",
        "ort": "Satow"
    },
    {
        "code": "3820\n38201",
        "ort": "Gelbensande\n38203"
    },
    {
        "code": "38201",
        "ort": "Gelbensande"
    },
    {
        "code": "38203",
        "ort": "Bad"
    },
    {
        "code": "38204",
        "ort": "Broderstorf"
    },
    {
        "code": "38205",
        "ort": "Tessin"
    },
    {
        "code": "38206",
        "ort": "Graal-Müritz"
    },
    {
        "code": "38207",
        "ort": "Kritzmow"
    },
    {
        "code": "38208",
        "ort": "Dummerstorf"
    },
    {
        "code": "38209",
        "ort": "Sanitz"
    },
    {
        "code": "3821",
        "ort": "Ribnitz-Damgarten,"
    },
    {
        "code": "3822\n38220",
        "ort": "Ahrenshoop,"
    },
    {
        "code": "38220",
        "ort": "Ahrenshoop,"
    },
    {
        "code": "38221",
        "ort": "Marlow"
    },
    {
        "code": "38222",
        "ort": "Ahrenshagen-Daskow-Gruel,"
    },
    {
        "code": "38223",
        "ort": "Ribnitz-Damgarten-Beiershagen,"
    },
    {
        "code": "38224",
        "ort": "Marlow-div."
    },
    {
        "code": "38225",
        "ort": "Ahrenshagen-Daskow-Prusdorf,"
    },
    {
        "code": "38226",
        "ort": "Dierhagen"
    },
    {
        "code": "38227",
        "ort": "Bartelshagen"
    },
    {
        "code": "3823\n38231",
        "ort": "Barth,"
    },
    {
        "code": "38231",
        "ort": "Barth,"
    },
    {
        "code": "38232",
        "ort": "Seeheilbad"
    },
    {
        "code": "38233",
        "ort": "Prerow,"
    },
    {
        "code": "38234",
        "ort": "Born"
    },
    {
        "code": "3829\n38292",
        "ort": "Kröpelin\n38293"
    },
    {
        "code": "38292",
        "ort": "Kröpelin"
    },
    {
        "code": "38293",
        "ort": "Kühlungsborn"
    },
    {
        "code": "38294",
        "ort": "Neubukow"
    },
    {
        "code": "38295",
        "ort": "Satow"
    },
    {
        "code": "38201",
        "ort": "Gelbensande"
    },
    {
        "code": "38203",
        "ort": "Bad"
    },
    {
        "code": "38204",
        "ort": "Broderstorf"
    },
    {
        "code": "38205",
        "ort": "Tessin"
    },
    {
        "code": "38206",
        "ort": "Graal-Müritz"
    },
    {
        "code": "38207",
        "ort": "Kritzmow"
    },
    {
        "code": "38208",
        "ort": "Dummerstorf"
    },
    {
        "code": "38209",
        "ort": "Sanitz"
    },
    {
        "code": "38220",
        "ort": "Ahrenshoop,"
    },
    {
        "code": "38221",
        "ort": "Marlow"
    },
    {
        "code": "38222",
        "ort": "Ahrenshagen-Daskow-Gruel,"
    },
    {
        "code": "38223",
        "ort": "Ribnitz-Damgarten-Beiershagen,"
    },
    {
        "code": "38224",
        "ort": "Marlow-div."
    },
    {
        "code": "38225",
        "ort": "Ahrenshagen-Daskow-Prusdorf,"
    },
    {
        "code": "38226",
        "ort": "Dierhagen"
    },
    {
        "code": "38227",
        "ort": "Bartelshagen"
    },
    {
        "code": "38231",
        "ort": "Barth,"
    },
    {
        "code": "38232",
        "ort": "Seeheilbad"
    },
    {
        "code": "38233",
        "ort": "Prerow,"
    },
    {
        "code": "38234",
        "ort": "Born"
    },
    {
        "code": "38292",
        "ort": "Kröpelin"
    },
    {
        "code": "38293",
        "ort": "Kühlungsborn"
    },
    {
        "code": "38294",
        "ort": "Neubukow"
    },
    {
        "code": "38295",
        "ort": "Satow"
    },
    {
        "code": "3830\n38300",
        "ort": "Hiddensee\n38301"
    },
    {
        "code": "3830\n38300",
        "ort": "Hiddensee\n38301"
    },
    {
        "code": "38300",
        "ort": "Hiddensee"
    },
    {
        "code": "38301",
        "ort": "Putbus"
    },
    {
        "code": "38302",
        "ort": "Sagard,"
    },
    {
        "code": "38303",
        "ort": "Baabe,"
    },
    {
        "code": "38304",
        "ort": "Garz/Rügen,"
    },
    {
        "code": "38305",
        "ort": "Gingst"
    },
    {
        "code": "38306",
        "ort": "Samtens,"
    },
    {
        "code": "38307",
        "ort": "Poseritz,"
    },
    {
        "code": "38308",
        "ort": "Ostseebad"
    },
    {
        "code": "38309",
        "ort": "Trent,"
    },
    {
        "code": "3831",
        "ort": "Stralsund,"
    },
    {
        "code": "3832\n38320",
        "ort": "Gremersdorf-Buchholz,"
    },
    {
        "code": "38320",
        "ort": "Gremersdorf-Buchholz,"
    },
    {
        "code": "38321",
        "ort": "Kummerow,"
    },
    {
        "code": "38322",
        "ort": "Franzburg,"
    },
    {
        "code": "38323",
        "ort": "Altenpleen,"
    },
    {
        "code": "38324",
        "ort": "Karnin,"
    },
    {
        "code": "38325",
        "ort": "Gremersdorf-Buchholz-Buchholz,"
    },
    {
        "code": "38326",
        "ort": "Grimmen,"
    },
    {
        "code": "38327",
        "ort": "Elmenhorst,"
    },
    {
        "code": "38328",
        "ort": "Behnkendorf,"
    },
    {
        "code": "3833\n38331",
        "ort": "Süderholz-Bretwisch,"
    },
    {
        "code": "38331",
        "ort": "Süderholz-Bretwisch,"
    },
    {
        "code": "38332",
        "ort": "Süderholz-Griebenow,"
    },
    {
        "code": "38333",
        "ort": "Horst,"
    },
    {
        "code": "38334",
        "ort": "Glewitz"
    },
    {
        "code": "3834",
        "ort": "Greifswald"
    },
    {
        "code": "3835\n38351",
        "ort": "Kirchdorf"
    },
    {
        "code": "38351",
        "ort": "Kirchdorf"
    },
    {
        "code": "3836",
        "ort": "Wolgast"
    },
    {
        "code": "3837\n38370",
        "ort": "Kröslin,"
    },
    {
        "code": "38370",
        "ort": "Kröslin,"
    },
    {
        "code": "38371",
        "ort": "Trassenheide,"
    },
    {
        "code": "38372",
        "ort": "Usedom"
    },
    {
        "code": "38375",
        "ort": "Ückeritz"
    },
    {
        "code": "38376",
        "ort": "Zirchow"
    },
    {
        "code": "38377",
        "ort": "Zinnowitz"
    },
    {
        "code": "38378",
        "ort": "Heringsdorf,"
    },
    {
        "code": "3838",
        "ort": "Bergen"
    },
    {
        "code": "3839\n38391",
        "ort": "Altenkirchen\n38392"
    },
    {
        "code": "38391",
        "ort": "Altenkirchen"
    },
    {
        "code": "38392",
        "ort": "Sassnitz"
    },
    {
        "code": "38393",
        "ort": "Binz,"
    },
    {
        "code": "3830\n38300",
        "ort": "Hiddensee\n38301"
    },
    {
        "code": "38300",
        "ort": "Hiddensee"
    },
    {
        "code": "38301",
        "ort": "Putbus"
    },
    {
        "code": "38302",
        "ort": "Sagard,"
    },
    {
        "code": "38303",
        "ort": "Baabe,"
    },
    {
        "code": "38304",
        "ort": "Garz/Rügen,"
    },
    {
        "code": "38305",
        "ort": "Gingst"
    },
    {
        "code": "38306",
        "ort": "Samtens,"
    },
    {
        "code": "38307",
        "ort": "Poseritz,"
    },
    {
        "code": "38308",
        "ort": "Ostseebad"
    },
    {
        "code": "38309",
        "ort": "Trent,"
    },
    {
        "code": "3831",
        "ort": "Stralsund,"
    },
    {
        "code": "3832\n38320",
        "ort": "Gremersdorf-Buchholz,"
    },
    {
        "code": "38320",
        "ort": "Gremersdorf-Buchholz,"
    },
    {
        "code": "38321",
        "ort": "Kummerow,"
    },
    {
        "code": "38322",
        "ort": "Franzburg,"
    },
    {
        "code": "38323",
        "ort": "Altenpleen,"
    },
    {
        "code": "38324",
        "ort": "Karnin,"
    },
    {
        "code": "38325",
        "ort": "Gremersdorf-Buchholz-Buchholz,"
    },
    {
        "code": "38326",
        "ort": "Grimmen,"
    },
    {
        "code": "38327",
        "ort": "Elmenhorst,"
    },
    {
        "code": "38328",
        "ort": "Behnkendorf,"
    },
    {
        "code": "3833\n38331",
        "ort": "Süderholz-Bretwisch,"
    },
    {
        "code": "38331",
        "ort": "Süderholz-Bretwisch,"
    },
    {
        "code": "38332",
        "ort": "Süderholz-Griebenow,"
    },
    {
        "code": "38333",
        "ort": "Horst,"
    },
    {
        "code": "38334",
        "ort": "Glewitz"
    },
    {
        "code": "3834",
        "ort": "Greifswald"
    },
    {
        "code": "3835\n38351",
        "ort": "Kirchdorf"
    },
    {
        "code": "38351",
        "ort": "Kirchdorf"
    },
    {
        "code": "3836",
        "ort": "Wolgast"
    },
    {
        "code": "3837\n38370",
        "ort": "Kröslin,"
    },
    {
        "code": "38370",
        "ort": "Kröslin,"
    },
    {
        "code": "38371",
        "ort": "Trassenheide,"
    },
    {
        "code": "38372",
        "ort": "Usedom"
    },
    {
        "code": "38375",
        "ort": "Ückeritz"
    },
    {
        "code": "38376",
        "ort": "Zirchow"
    },
    {
        "code": "38377",
        "ort": "Zinnowitz"
    },
    {
        "code": "38378",
        "ort": "Heringsdorf,"
    },
    {
        "code": "3838",
        "ort": "Bergen"
    },
    {
        "code": "3839\n38391",
        "ort": "Altenkirchen\n38392"
    },
    {
        "code": "38391",
        "ort": "Altenkirchen"
    },
    {
        "code": "38392",
        "ort": "Sassnitz"
    },
    {
        "code": "38393",
        "ort": "Binz,"
    },
    {
        "code": "38300",
        "ort": "Hiddensee"
    },
    {
        "code": "38301",
        "ort": "Putbus"
    },
    {
        "code": "38302",
        "ort": "Sagard,"
    },
    {
        "code": "38303",
        "ort": "Baabe,"
    },
    {
        "code": "38304",
        "ort": "Garz/Rügen,"
    },
    {
        "code": "38305",
        "ort": "Gingst"
    },
    {
        "code": "38306",
        "ort": "Samtens,"
    },
    {
        "code": "38307",
        "ort": "Poseritz,"
    },
    {
        "code": "38308",
        "ort": "Ostseebad"
    },
    {
        "code": "38309",
        "ort": "Trent,"
    },
    {
        "code": "38320",
        "ort": "Gremersdorf-Buchholz,"
    },
    {
        "code": "38321",
        "ort": "Kummerow,"
    },
    {
        "code": "38322",
        "ort": "Franzburg,"
    },
    {
        "code": "38323",
        "ort": "Altenpleen,"
    },
    {
        "code": "38324",
        "ort": "Karnin,"
    },
    {
        "code": "38325",
        "ort": "Gremersdorf-Buchholz-Buchholz,"
    },
    {
        "code": "38326",
        "ort": "Grimmen,"
    },
    {
        "code": "38327",
        "ort": "Elmenhorst,"
    },
    {
        "code": "38328",
        "ort": "Behnkendorf,"
    },
    {
        "code": "38331",
        "ort": "Süderholz-Bretwisch,"
    },
    {
        "code": "38332",
        "ort": "Süderholz-Griebenow,"
    },
    {
        "code": "38333",
        "ort": "Horst,"
    },
    {
        "code": "38334",
        "ort": "Glewitz"
    },
    {
        "code": "38351",
        "ort": "Kirchdorf"
    },
    {
        "code": "38370",
        "ort": "Kröslin,"
    },
    {
        "code": "38371",
        "ort": "Trassenheide,"
    },
    {
        "code": "38372",
        "ort": "Usedom"
    },
    {
        "code": "38375",
        "ort": "Ückeritz"
    },
    {
        "code": "38376",
        "ort": "Zirchow"
    },
    {
        "code": "38377",
        "ort": "Zinnowitz"
    },
    {
        "code": "38378",
        "ort": "Heringsdorf,"
    },
    {
        "code": "38391",
        "ort": "Altenkirchen"
    },
    {
        "code": "38392",
        "ort": "Sassnitz"
    },
    {
        "code": "38393",
        "ort": "Binz,"
    },
    {
        "code": "3841",
        "ort": "Wismar\n3842\n38422"
    },
    {
        "code": "3841",
        "ort": "Wismar"
    },
    {
        "code": "3842\n38422",
        "ort": "Neukloster\n38423"
    },
    {
        "code": "38422",
        "ort": "Neukloster"
    },
    {
        "code": "38423",
        "ort": "Bad"
    },
    {
        "code": "38424",
        "ort": "Bobitz"
    },
    {
        "code": "38425",
        "ort": "Kirchdorf"
    },
    {
        "code": "38426",
        "ort": "Neuburg"
    },
    {
        "code": "38427",
        "ort": "Blowatz"
    },
    {
        "code": "38428",
        "ort": "Hohenkirchen"
    },
    {
        "code": "38429",
        "ort": "Glasin"
    },
    {
        "code": "3843",
        "ort": "Güstrow"
    },
    {
        "code": "3844",
        "ort": "Schwaan"
    },
    {
        "code": "3845\n38450",
        "ort": "Tarnow\n38451"
    },
    {
        "code": "38450",
        "ort": "Tarnow"
    },
    {
        "code": "38451",
        "ort": "Hoppenrade"
    },
    {
        "code": "38452",
        "ort": "Lalendorf"
    },
    {
        "code": "38453",
        "ort": "Mistorf"
    },
    {
        "code": "38454",
        "ort": "Kritzkow"
    },
    {
        "code": "38455",
        "ort": "Plaaz"
    },
    {
        "code": "38456",
        "ort": "Langhagen"
    },
    {
        "code": "38457",
        "ort": "Krakow"
    },
    {
        "code": "38458",
        "ort": "Zehna"
    },
    {
        "code": "38459",
        "ort": "Laage"
    },
    {
        "code": "3846\n38461",
        "ort": "Bützow\n38462"
    },
    {
        "code": "38461",
        "ort": "Bützow"
    },
    {
        "code": "38462",
        "ort": "Baumgarten"
    },
    {
        "code": "38464",
        "ort": "Bernitt"
    },
    {
        "code": "38466",
        "ort": "Jürgenshagen"
    },
    {
        "code": "3847",
        "ort": "Sternberg"
    },
    {
        "code": "3848\n38481",
        "ort": "Witzin\n38482"
    },
    {
        "code": "38481",
        "ort": "Witzin"
    },
    {
        "code": "38482",
        "ort": "Warin"
    },
    {
        "code": "38483",
        "ort": "Brüel"
    },
    {
        "code": "38484",
        "ort": "Ventschow"
    },
    {
        "code": "38485",
        "ort": "Dabel"
    },
    {
        "code": "38486",
        "ort": "Gustävel"
    },
    {
        "code": "38488",
        "ort": "Demen"
    },
    {
        "code": "3841",
        "ort": "Wismar"
    },
    {
        "code": "3842\n38422",
        "ort": "Neukloster\n38423"
    },
    {
        "code": "38422",
        "ort": "Neukloster"
    },
    {
        "code": "38423",
        "ort": "Bad"
    },
    {
        "code": "38424",
        "ort": "Bobitz"
    },
    {
        "code": "38425",
        "ort": "Kirchdorf"
    },
    {
        "code": "38426",
        "ort": "Neuburg"
    },
    {
        "code": "38427",
        "ort": "Blowatz"
    },
    {
        "code": "38428",
        "ort": "Hohenkirchen"
    },
    {
        "code": "38429",
        "ort": "Glasin"
    },
    {
        "code": "3843",
        "ort": "Güstrow"
    },
    {
        "code": "3844",
        "ort": "Schwaan"
    },
    {
        "code": "3845\n38450",
        "ort": "Tarnow\n38451"
    },
    {
        "code": "38450",
        "ort": "Tarnow"
    },
    {
        "code": "38451",
        "ort": "Hoppenrade"
    },
    {
        "code": "38452",
        "ort": "Lalendorf"
    },
    {
        "code": "38453",
        "ort": "Mistorf"
    },
    {
        "code": "38454",
        "ort": "Kritzkow"
    },
    {
        "code": "38455",
        "ort": "Plaaz"
    },
    {
        "code": "38456",
        "ort": "Langhagen"
    },
    {
        "code": "38457",
        "ort": "Krakow"
    },
    {
        "code": "38458",
        "ort": "Zehna"
    },
    {
        "code": "38459",
        "ort": "Laage"
    },
    {
        "code": "3846\n38461",
        "ort": "Bützow\n38462"
    },
    {
        "code": "38461",
        "ort": "Bützow"
    },
    {
        "code": "38462",
        "ort": "Baumgarten"
    },
    {
        "code": "38464",
        "ort": "Bernitt"
    },
    {
        "code": "38466",
        "ort": "Jürgenshagen"
    },
    {
        "code": "3847",
        "ort": "Sternberg"
    },
    {
        "code": "3848\n38481",
        "ort": "Witzin\n38482"
    },
    {
        "code": "38481",
        "ort": "Witzin"
    },
    {
        "code": "38482",
        "ort": "Warin"
    },
    {
        "code": "38483",
        "ort": "Brüel"
    },
    {
        "code": "38484",
        "ort": "Ventschow"
    },
    {
        "code": "38485",
        "ort": "Dabel"
    },
    {
        "code": "38486",
        "ort": "Gustävel"
    },
    {
        "code": "38488",
        "ort": "Demen"
    },
    {
        "code": "38422",
        "ort": "Neukloster"
    },
    {
        "code": "38423",
        "ort": "Bad"
    },
    {
        "code": "38424",
        "ort": "Bobitz"
    },
    {
        "code": "38425",
        "ort": "Kirchdorf"
    },
    {
        "code": "38426",
        "ort": "Neuburg"
    },
    {
        "code": "38427",
        "ort": "Blowatz"
    },
    {
        "code": "38428",
        "ort": "Hohenkirchen"
    },
    {
        "code": "38429",
        "ort": "Glasin"
    },
    {
        "code": "38450",
        "ort": "Tarnow"
    },
    {
        "code": "38451",
        "ort": "Hoppenrade"
    },
    {
        "code": "38452",
        "ort": "Lalendorf"
    },
    {
        "code": "38453",
        "ort": "Mistorf"
    },
    {
        "code": "38454",
        "ort": "Kritzkow"
    },
    {
        "code": "38455",
        "ort": "Plaaz"
    },
    {
        "code": "38456",
        "ort": "Langhagen"
    },
    {
        "code": "38457",
        "ort": "Krakow"
    },
    {
        "code": "38458",
        "ort": "Zehna"
    },
    {
        "code": "38459",
        "ort": "Laage"
    },
    {
        "code": "38461",
        "ort": "Bützow"
    },
    {
        "code": "38462",
        "ort": "Baumgarten"
    },
    {
        "code": "38464",
        "ort": "Bernitt"
    },
    {
        "code": "38466",
        "ort": "Jürgenshagen"
    },
    {
        "code": "38481",
        "ort": "Witzin"
    },
    {
        "code": "38482",
        "ort": "Warin"
    },
    {
        "code": "38483",
        "ort": "Brüel"
    },
    {
        "code": "38484",
        "ort": "Ventschow"
    },
    {
        "code": "38485",
        "ort": "Dabel"
    },
    {
        "code": "38486",
        "ort": "Gustävel"
    },
    {
        "code": "38488",
        "ort": "Demen"
    },
    {
        "code": "385",
        "ort": "Schwerin"
    },
    {
        "code": "386\n3860",
        "ort": "Raben"
    },
    {
        "code": "3860",
        "ort": "Raben"
    },
    {
        "code": "3861",
        "ort": "Plate"
    },
    {
        "code": "3863",
        "ort": "Crivitz"
    },
    {
        "code": "3865",
        "ort": "Holthusen"
    },
    {
        "code": "3866",
        "ort": "Cambs"
    },
    {
        "code": "3867",
        "ort": "Lübstorf"
    },
    {
        "code": "3868",
        "ort": "Rastow"
    },
    {
        "code": "3869",
        "ort": "Dümmer"
    },
    {
        "code": "3860",
        "ort": "Raben"
    },
    {
        "code": "3861",
        "ort": "Plate"
    },
    {
        "code": "3863",
        "ort": "Crivitz"
    },
    {
        "code": "3865",
        "ort": "Holthusen"
    },
    {
        "code": "3866",
        "ort": "Cambs"
    },
    {
        "code": "3867",
        "ort": "Lübstorf"
    },
    {
        "code": "3868",
        "ort": "Rastow"
    },
    {
        "code": "3869",
        "ort": "Dümmer"
    },
    {
        "code": "3871",
        "ort": "Parchim\n3872\n38720"
    },
    {
        "code": "3871",
        "ort": "Parchim"
    },
    {
        "code": "3872\n38720",
        "ort": "Grebbin\n38721"
    },
    {
        "code": "38720",
        "ort": "Grebbin"
    },
    {
        "code": "38721",
        "ort": "Ziegendorf"
    },
    {
        "code": "38722",
        "ort": "Raduhn"
    },
    {
        "code": "38723",
        "ort": "Kladrum"
    },
    {
        "code": "38724",
        "ort": "Siggelkow"
    },
    {
        "code": "38725",
        "ort": "Groß"
    },
    {
        "code": "38726",
        "ort": "Spornitz"
    },
    {
        "code": "38727",
        "ort": "Mestlin"
    },
    {
        "code": "38728",
        "ort": "Domsühl"
    },
    {
        "code": "38729",
        "ort": "Marnitz"
    },
    {
        "code": "3873\n38731",
        "ort": "Lübz\n38732"
    },
    {
        "code": "38731",
        "ort": "Lübz"
    },
    {
        "code": "38732",
        "ort": "Gallin"
    },
    {
        "code": "38733",
        "ort": "Karbow"
    },
    {
        "code": "38735",
        "ort": "Plau"
    },
    {
        "code": "38736",
        "ort": "Goldberg"
    },
    {
        "code": "38737",
        "ort": "Ganzlin"
    },
    {
        "code": "38738",
        "ort": "Karow"
    },
    {
        "code": "3874",
        "ort": "Ludwigslust"
    },
    {
        "code": "3875\n38750",
        "ort": "Malliss\n38751"
    },
    {
        "code": "38750",
        "ort": "Malliss"
    },
    {
        "code": "38751",
        "ort": "Picher"
    },
    {
        "code": "38752",
        "ort": "Zierzow"
    },
    {
        "code": "38753",
        "ort": "Wöbbelin"
    },
    {
        "code": "38754",
        "ort": "Leussow"
    },
    {
        "code": "38755",
        "ort": "Eldena"
    },
    {
        "code": "38756",
        "ort": "Grabow"
    },
    {
        "code": "38757",
        "ort": "Neustadt-Glewe"
    },
    {
        "code": "38758",
        "ort": "Dömitz"
    },
    {
        "code": "38759",
        "ort": "Tewswoos"
    },
    {
        "code": "3876",
        "ort": "Perleberg"
    },
    {
        "code": "3877",
        "ort": "Wittenberge"
    },
    {
        "code": "3878\n38780",
        "ort": "Lanz\n38781"
    },
    {
        "code": "38780",
        "ort": "Lanz"
    },
    {
        "code": "38781",
        "ort": "Mellen"
    },
    {
        "code": "38782",
        "ort": "Reetz"
    },
    {
        "code": "38783",
        "ort": "Dallmin"
    },
    {
        "code": "38784",
        "ort": "Kleinow"
    },
    {
        "code": "38785",
        "ort": "Berge"
    },
    {
        "code": "38787",
        "ort": "Glöwen"
    },
    {
        "code": "38788",
        "ort": "Groß"
    },
    {
        "code": "38789",
        "ort": "Wolfshagen"
    },
    {
        "code": "3879\n38791",
        "ort": "Bad"
    },
    {
        "code": "38791",
        "ort": "Bad"
    },
    {
        "code": "38792",
        "ort": "Lenzen"
    },
    {
        "code": "38793",
        "ort": "Dergenthin"
    },
    {
        "code": "38794",
        "ort": "Cumlosen"
    },
    {
        "code": "38796",
        "ort": "Viesecke"
    },
    {
        "code": "38797",
        "ort": "Karstädt"
    },
    {
        "code": "3871",
        "ort": "Parchim"
    },
    {
        "code": "3872\n38720",
        "ort": "Grebbin\n38721"
    },
    {
        "code": "38720",
        "ort": "Grebbin"
    },
    {
        "code": "38721",
        "ort": "Ziegendorf"
    },
    {
        "code": "38722",
        "ort": "Raduhn"
    },
    {
        "code": "38723",
        "ort": "Kladrum"
    },
    {
        "code": "38724",
        "ort": "Siggelkow"
    },
    {
        "code": "38725",
        "ort": "Groß"
    },
    {
        "code": "38726",
        "ort": "Spornitz"
    },
    {
        "code": "38727",
        "ort": "Mestlin"
    },
    {
        "code": "38728",
        "ort": "Domsühl"
    },
    {
        "code": "38729",
        "ort": "Marnitz"
    },
    {
        "code": "3873\n38731",
        "ort": "Lübz\n38732"
    },
    {
        "code": "38731",
        "ort": "Lübz"
    },
    {
        "code": "38732",
        "ort": "Gallin"
    },
    {
        "code": "38733",
        "ort": "Karbow"
    },
    {
        "code": "38735",
        "ort": "Plau"
    },
    {
        "code": "38736",
        "ort": "Goldberg"
    },
    {
        "code": "38737",
        "ort": "Ganzlin"
    },
    {
        "code": "38738",
        "ort": "Karow"
    },
    {
        "code": "3874",
        "ort": "Ludwigslust"
    },
    {
        "code": "3875\n38750",
        "ort": "Malliss\n38751"
    },
    {
        "code": "38750",
        "ort": "Malliss"
    },
    {
        "code": "38751",
        "ort": "Picher"
    },
    {
        "code": "38752",
        "ort": "Zierzow"
    },
    {
        "code": "38753",
        "ort": "Wöbbelin"
    },
    {
        "code": "38754",
        "ort": "Leussow"
    },
    {
        "code": "38755",
        "ort": "Eldena"
    },
    {
        "code": "38756",
        "ort": "Grabow"
    },
    {
        "code": "38757",
        "ort": "Neustadt-Glewe"
    },
    {
        "code": "38758",
        "ort": "Dömitz"
    },
    {
        "code": "38759",
        "ort": "Tewswoos"
    },
    {
        "code": "3876",
        "ort": "Perleberg"
    },
    {
        "code": "3877",
        "ort": "Wittenberge"
    },
    {
        "code": "3878\n38780",
        "ort": "Lanz\n38781"
    },
    {
        "code": "38780",
        "ort": "Lanz"
    },
    {
        "code": "38781",
        "ort": "Mellen"
    },
    {
        "code": "38782",
        "ort": "Reetz"
    },
    {
        "code": "38783",
        "ort": "Dallmin"
    },
    {
        "code": "38784",
        "ort": "Kleinow"
    },
    {
        "code": "38785",
        "ort": "Berge"
    },
    {
        "code": "38787",
        "ort": "Glöwen"
    },
    {
        "code": "38788",
        "ort": "Groß"
    },
    {
        "code": "38789",
        "ort": "Wolfshagen"
    },
    {
        "code": "3879\n38791",
        "ort": "Bad"
    },
    {
        "code": "38791",
        "ort": "Bad"
    },
    {
        "code": "38792",
        "ort": "Lenzen"
    },
    {
        "code": "38793",
        "ort": "Dergenthin"
    },
    {
        "code": "38794",
        "ort": "Cumlosen"
    },
    {
        "code": "38796",
        "ort": "Viesecke"
    },
    {
        "code": "38797",
        "ort": "Karstädt"
    },
    {
        "code": "38720",
        "ort": "Grebbin"
    },
    {
        "code": "38721",
        "ort": "Ziegendorf"
    },
    {
        "code": "38722",
        "ort": "Raduhn"
    },
    {
        "code": "38723",
        "ort": "Kladrum"
    },
    {
        "code": "38724",
        "ort": "Siggelkow"
    },
    {
        "code": "38725",
        "ort": "Groß"
    },
    {
        "code": "38726",
        "ort": "Spornitz"
    },
    {
        "code": "38727",
        "ort": "Mestlin"
    },
    {
        "code": "38728",
        "ort": "Domsühl"
    },
    {
        "code": "38729",
        "ort": "Marnitz"
    },
    {
        "code": "38731",
        "ort": "Lübz"
    },
    {
        "code": "38732",
        "ort": "Gallin"
    },
    {
        "code": "38733",
        "ort": "Karbow"
    },
    {
        "code": "38735",
        "ort": "Plau"
    },
    {
        "code": "38736",
        "ort": "Goldberg"
    },
    {
        "code": "38737",
        "ort": "Ganzlin"
    },
    {
        "code": "38738",
        "ort": "Karow"
    },
    {
        "code": "38750",
        "ort": "Malliss"
    },
    {
        "code": "38751",
        "ort": "Picher"
    },
    {
        "code": "38752",
        "ort": "Zierzow"
    },
    {
        "code": "38753",
        "ort": "Wöbbelin"
    },
    {
        "code": "38754",
        "ort": "Leussow"
    },
    {
        "code": "38755",
        "ort": "Eldena"
    },
    {
        "code": "38756",
        "ort": "Grabow"
    },
    {
        "code": "38757",
        "ort": "Neustadt-Glewe"
    },
    {
        "code": "38758",
        "ort": "Dömitz"
    },
    {
        "code": "38759",
        "ort": "Tewswoos"
    },
    {
        "code": "38780",
        "ort": "Lanz"
    },
    {
        "code": "38781",
        "ort": "Mellen"
    },
    {
        "code": "38782",
        "ort": "Reetz"
    },
    {
        "code": "38783",
        "ort": "Dallmin"
    },
    {
        "code": "38784",
        "ort": "Kleinow"
    },
    {
        "code": "38785",
        "ort": "Berge"
    },
    {
        "code": "38787",
        "ort": "Glöwen"
    },
    {
        "code": "38788",
        "ort": "Groß"
    },
    {
        "code": "38789",
        "ort": "Wolfshagen"
    },
    {
        "code": "38791",
        "ort": "Bad"
    },
    {
        "code": "38792",
        "ort": "Lenzen"
    },
    {
        "code": "38793",
        "ort": "Dergenthin"
    },
    {
        "code": "38794",
        "ort": "Cumlosen"
    },
    {
        "code": "38796",
        "ort": "Viesecke"
    },
    {
        "code": "38797",
        "ort": "Karstädt"
    },
    {
        "code": "3881",
        "ort": "Grevesmühlen\n3882\n38821"
    },
    {
        "code": "3881",
        "ort": "Grevesmühlen"
    },
    {
        "code": "3882\n38821",
        "ort": "Lüdersdorf\n38822"
    },
    {
        "code": "38821",
        "ort": "Lüdersdorf"
    },
    {
        "code": "38822",
        "ort": "Rüting"
    },
    {
        "code": "38823",
        "ort": "Selmsdorf"
    },
    {
        "code": "38824",
        "ort": "Mallentin"
    },
    {
        "code": "38825",
        "ort": "Klütz"
    },
    {
        "code": "38826",
        "ort": "Dassow"
    },
    {
        "code": "38827",
        "ort": "Kalkhorst"
    },
    {
        "code": "38828",
        "ort": "Schönberg"
    },
    {
        "code": "3883",
        "ort": "Hagenow"
    },
    {
        "code": "3884\n38841",
        "ort": "Amt"
    },
    {
        "code": "38841",
        "ort": "Amt"
    },
    {
        "code": "38842",
        "ort": "Greven"
    },
    {
        "code": "38843",
        "ort": "Vellahn"
    },
    {
        "code": "38844",
        "ort": "Neu"
    },
    {
        "code": "38845",
        "ort": "Amt"
    },
    {
        "code": "38847",
        "ort": "Boizenburg/Elbe"
    },
    {
        "code": "38848",
        "ort": "Vellahn"
    },
    {
        "code": "3885\n38850",
        "ort": "Gammelin\n38851"
    },
    {
        "code": "38850",
        "ort": "Gammelin"
    },
    {
        "code": "38851",
        "ort": "Zarrentin"
    },
    {
        "code": "38852",
        "ort": "Wittenburg"
    },
    {
        "code": "38853",
        "ort": "Wittendörp"
    },
    {
        "code": "38854",
        "ort": "Redefin"
    },
    {
        "code": "38855",
        "ort": "Lübtheen"
    },
    {
        "code": "38856",
        "ort": "Pritzier"
    },
    {
        "code": "38858",
        "ort": "Zarrentin"
    },
    {
        "code": "38859",
        "ort": "Alt"
    },
    {
        "code": "3886",
        "ort": "Gadebusch"
    },
    {
        "code": "3887\n38871",
        "ort": "Mühlen"
    },
    {
        "code": "38871",
        "ort": "Mühlen"
    },
    {
        "code": "38872",
        "ort": "Rehna"
    },
    {
        "code": "38873",
        "ort": "Carlow"
    },
    {
        "code": "38874",
        "ort": "Lützow"
    },
    {
        "code": "38875",
        "ort": "Schlagsdorf"
    },
    {
        "code": "38876",
        "ort": "Roggendorf"
    },
    {
        "code": "3881",
        "ort": "Grevesmühlen"
    },
    {
        "code": "3882\n38821",
        "ort": "Lüdersdorf\n38822"
    },
    {
        "code": "38821",
        "ort": "Lüdersdorf"
    },
    {
        "code": "38822",
        "ort": "Rüting"
    },
    {
        "code": "38823",
        "ort": "Selmsdorf"
    },
    {
        "code": "38824",
        "ort": "Mallentin"
    },
    {
        "code": "38825",
        "ort": "Klütz"
    },
    {
        "code": "38826",
        "ort": "Dassow"
    },
    {
        "code": "38827",
        "ort": "Kalkhorst"
    },
    {
        "code": "38828",
        "ort": "Schönberg"
    },
    {
        "code": "3883",
        "ort": "Hagenow"
    },
    {
        "code": "3884\n38841",
        "ort": "Amt"
    },
    {
        "code": "38841",
        "ort": "Amt"
    },
    {
        "code": "38842",
        "ort": "Greven"
    },
    {
        "code": "38843",
        "ort": "Vellahn"
    },
    {
        "code": "38844",
        "ort": "Neu"
    },
    {
        "code": "38845",
        "ort": "Amt"
    },
    {
        "code": "38847",
        "ort": "Boizenburg/Elbe"
    },
    {
        "code": "38848",
        "ort": "Vellahn"
    },
    {
        "code": "3885\n38850",
        "ort": "Gammelin\n38851"
    },
    {
        "code": "38850",
        "ort": "Gammelin"
    },
    {
        "code": "38851",
        "ort": "Zarrentin"
    },
    {
        "code": "38852",
        "ort": "Wittenburg"
    },
    {
        "code": "38853",
        "ort": "Wittendörp"
    },
    {
        "code": "38854",
        "ort": "Redefin"
    },
    {
        "code": "38855",
        "ort": "Lübtheen"
    },
    {
        "code": "38856",
        "ort": "Pritzier"
    },
    {
        "code": "38858",
        "ort": "Zarrentin"
    },
    {
        "code": "38859",
        "ort": "Alt"
    },
    {
        "code": "3886",
        "ort": "Gadebusch"
    },
    {
        "code": "3887\n38871",
        "ort": "Mühlen"
    },
    {
        "code": "38871",
        "ort": "Mühlen"
    },
    {
        "code": "38872",
        "ort": "Rehna"
    },
    {
        "code": "38873",
        "ort": "Carlow"
    },
    {
        "code": "38874",
        "ort": "Lützow"
    },
    {
        "code": "38875",
        "ort": "Schlagsdorf"
    },
    {
        "code": "38876",
        "ort": "Roggendorf"
    },
    {
        "code": "38821",
        "ort": "Lüdersdorf"
    },
    {
        "code": "38822",
        "ort": "Rüting"
    },
    {
        "code": "38823",
        "ort": "Selmsdorf"
    },
    {
        "code": "38824",
        "ort": "Mallentin"
    },
    {
        "code": "38825",
        "ort": "Klütz"
    },
    {
        "code": "38826",
        "ort": "Dassow"
    },
    {
        "code": "38827",
        "ort": "Kalkhorst"
    },
    {
        "code": "38828",
        "ort": "Schönberg"
    },
    {
        "code": "38841",
        "ort": "Amt"
    },
    {
        "code": "38842",
        "ort": "Greven"
    },
    {
        "code": "38843",
        "ort": "Vellahn"
    },
    {
        "code": "38844",
        "ort": "Neu"
    },
    {
        "code": "38845",
        "ort": "Amt"
    },
    {
        "code": "38847",
        "ort": "Boizenburg/Elbe"
    },
    {
        "code": "38848",
        "ort": "Vellahn"
    },
    {
        "code": "38850",
        "ort": "Gammelin"
    },
    {
        "code": "38851",
        "ort": "Zarrentin"
    },
    {
        "code": "38852",
        "ort": "Wittenburg"
    },
    {
        "code": "38853",
        "ort": "Wittendörp"
    },
    {
        "code": "38854",
        "ort": "Redefin"
    },
    {
        "code": "38855",
        "ort": "Lübtheen"
    },
    {
        "code": "38856",
        "ort": "Pritzier"
    },
    {
        "code": "38858",
        "ort": "Zarrentin"
    },
    {
        "code": "38859",
        "ort": "Alt"
    },
    {
        "code": "38871",
        "ort": "Mühlen"
    },
    {
        "code": "38872",
        "ort": "Rehna"
    },
    {
        "code": "38873",
        "ort": "Carlow"
    },
    {
        "code": "38874",
        "ort": "Lützow"
    },
    {
        "code": "38875",
        "ort": "Schlagsdorf"
    },
    {
        "code": "38876",
        "ort": "Roggendorf"
    },
    {
        "code": "390\n3900\n39000",
        "ort": "Beetzendorf\n39001"
    },
    {
        "code": "3900\n39000",
        "ort": "Beetzendorf\n39001"
    },
    {
        "code": "39000",
        "ort": "Beetzendorf"
    },
    {
        "code": "39001",
        "ort": "Apenburg"
    },
    {
        "code": "39002",
        "ort": "Oebisfelde"
    },
    {
        "code": "39003",
        "ort": "Jübar"
    },
    {
        "code": "39004",
        "ort": "Köckte"
    },
    {
        "code": "39005",
        "ort": "Kusey"
    },
    {
        "code": "39006",
        "ort": "Miesterhorst"
    },
    {
        "code": "39007",
        "ort": "Tangeln"
    },
    {
        "code": "39008",
        "ort": "Kunrau"
    },
    {
        "code": "39009",
        "ort": "Badel"
    },
    {
        "code": "3901",
        "ort": "Salzwedel"
    },
    {
        "code": "3902",
        "ort": "Diesdorf"
    },
    {
        "code": "3903\n39030",
        "ort": "Brunau\n39031"
    },
    {
        "code": "39030",
        "ort": "Brunau"
    },
    {
        "code": "39031",
        "ort": "Dähre"
    },
    {
        "code": "39032",
        "ort": "Mahlsdorf"
    },
    {
        "code": "39033",
        "ort": "Wallstawe"
    },
    {
        "code": "39034",
        "ort": "Fleetmark"
    },
    {
        "code": "39035",
        "ort": "Kuhfelde"
    },
    {
        "code": "39036",
        "ort": "Binde"
    },
    {
        "code": "39037",
        "ort": "Pretzier"
    },
    {
        "code": "39038",
        "ort": "Henningen"
    },
    {
        "code": "39039",
        "ort": "Bonese"
    },
    {
        "code": "3904",
        "ort": "Haldensleben"
    },
    {
        "code": "3905\n39050",
        "ort": "Bartensleben\n39051"
    },
    {
        "code": "39050",
        "ort": "Bartensleben"
    },
    {
        "code": "39051",
        "ort": "Calvörde"
    },
    {
        "code": "39052",
        "ort": "Erxleben"
    },
    {
        "code": "39053",
        "ort": "Süplingen"
    },
    {
        "code": "39054",
        "ort": "Flechtingen"
    },
    {
        "code": "39055",
        "ort": "Hörsingen"
    },
    {
        "code": "39056",
        "ort": "Klüden"
    },
    {
        "code": "39057",
        "ort": "Rätzlingen,"
    },
    {
        "code": "39058",
        "ort": "Uthmöden"
    },
    {
        "code": "39059",
        "ort": "Wegenstedt"
    },
    {
        "code": "3906\n39061",
        "ort": "Weferlingen\n39062"
    },
    {
        "code": "39061",
        "ort": "Weferlingen"
    },
    {
        "code": "39062",
        "ort": "Bebertal"
    },
    {
        "code": "3907",
        "ort": "Gardelegen"
    },
    {
        "code": "3908\n39080",
        "ort": "Kalbe"
    },
    {
        "code": "39080",
        "ort": "Kalbe"
    },
    {
        "code": "39081",
        "ort": "Kakerbeck"
    },
    {
        "code": "39082",
        "ort": "Mieste"
    },
    {
        "code": "39083",
        "ort": "Messdorf"
    },
    {
        "code": "39084",
        "ort": "Lindstedt"
    },
    {
        "code": "39085",
        "ort": "Zichtau"
    },
    {
        "code": "39086",
        "ort": "Jävenitz"
    },
    {
        "code": "39087",
        "ort": "Jerchel"
    },
    {
        "code": "39088",
        "ort": "Letzlingen"
    },
    {
        "code": "39089",
        "ort": "Bismark"
    },
    {
        "code": "3909",
        "ort": "Klötze"
    },
    {
        "code": "3900\n39000",
        "ort": "Beetzendorf\n39001"
    },
    {
        "code": "39000",
        "ort": "Beetzendorf"
    },
    {
        "code": "39001",
        "ort": "Apenburg"
    },
    {
        "code": "39002",
        "ort": "Oebisfelde"
    },
    {
        "code": "39003",
        "ort": "Jübar"
    },
    {
        "code": "39004",
        "ort": "Köckte"
    },
    {
        "code": "39005",
        "ort": "Kusey"
    },
    {
        "code": "39006",
        "ort": "Miesterhorst"
    },
    {
        "code": "39007",
        "ort": "Tangeln"
    },
    {
        "code": "39008",
        "ort": "Kunrau"
    },
    {
        "code": "39009",
        "ort": "Badel"
    },
    {
        "code": "3901",
        "ort": "Salzwedel"
    },
    {
        "code": "3902",
        "ort": "Diesdorf"
    },
    {
        "code": "3903\n39030",
        "ort": "Brunau\n39031"
    },
    {
        "code": "39030",
        "ort": "Brunau"
    },
    {
        "code": "39031",
        "ort": "Dähre"
    },
    {
        "code": "39032",
        "ort": "Mahlsdorf"
    },
    {
        "code": "39033",
        "ort": "Wallstawe"
    },
    {
        "code": "39034",
        "ort": "Fleetmark"
    },
    {
        "code": "39035",
        "ort": "Kuhfelde"
    },
    {
        "code": "39036",
        "ort": "Binde"
    },
    {
        "code": "39037",
        "ort": "Pretzier"
    },
    {
        "code": "39038",
        "ort": "Henningen"
    },
    {
        "code": "39039",
        "ort": "Bonese"
    },
    {
        "code": "3904",
        "ort": "Haldensleben"
    },
    {
        "code": "3905\n39050",
        "ort": "Bartensleben\n39051"
    },
    {
        "code": "39050",
        "ort": "Bartensleben"
    },
    {
        "code": "39051",
        "ort": "Calvörde"
    },
    {
        "code": "39052",
        "ort": "Erxleben"
    },
    {
        "code": "39053",
        "ort": "Süplingen"
    },
    {
        "code": "39054",
        "ort": "Flechtingen"
    },
    {
        "code": "39055",
        "ort": "Hörsingen"
    },
    {
        "code": "39056",
        "ort": "Klüden"
    },
    {
        "code": "39057",
        "ort": "Rätzlingen,"
    },
    {
        "code": "39058",
        "ort": "Uthmöden"
    },
    {
        "code": "39059",
        "ort": "Wegenstedt"
    },
    {
        "code": "3906\n39061",
        "ort": "Weferlingen\n39062"
    },
    {
        "code": "39061",
        "ort": "Weferlingen"
    },
    {
        "code": "39062",
        "ort": "Bebertal"
    },
    {
        "code": "3907",
        "ort": "Gardelegen"
    },
    {
        "code": "3908\n39080",
        "ort": "Kalbe"
    },
    {
        "code": "39080",
        "ort": "Kalbe"
    },
    {
        "code": "39081",
        "ort": "Kakerbeck"
    },
    {
        "code": "39082",
        "ort": "Mieste"
    },
    {
        "code": "39083",
        "ort": "Messdorf"
    },
    {
        "code": "39084",
        "ort": "Lindstedt"
    },
    {
        "code": "39085",
        "ort": "Zichtau"
    },
    {
        "code": "39086",
        "ort": "Jävenitz"
    },
    {
        "code": "39087",
        "ort": "Jerchel"
    },
    {
        "code": "39088",
        "ort": "Letzlingen"
    },
    {
        "code": "39089",
        "ort": "Bismark"
    },
    {
        "code": "3909",
        "ort": "Klötze"
    },
    {
        "code": "39000",
        "ort": "Beetzendorf"
    },
    {
        "code": "39001",
        "ort": "Apenburg"
    },
    {
        "code": "39002",
        "ort": "Oebisfelde"
    },
    {
        "code": "39003",
        "ort": "Jübar"
    },
    {
        "code": "39004",
        "ort": "Köckte"
    },
    {
        "code": "39005",
        "ort": "Kusey"
    },
    {
        "code": "39006",
        "ort": "Miesterhorst"
    },
    {
        "code": "39007",
        "ort": "Tangeln"
    },
    {
        "code": "39008",
        "ort": "Kunrau"
    },
    {
        "code": "39009",
        "ort": "Badel"
    },
    {
        "code": "39030",
        "ort": "Brunau"
    },
    {
        "code": "39031",
        "ort": "Dähre"
    },
    {
        "code": "39032",
        "ort": "Mahlsdorf"
    },
    {
        "code": "39033",
        "ort": "Wallstawe"
    },
    {
        "code": "39034",
        "ort": "Fleetmark"
    },
    {
        "code": "39035",
        "ort": "Kuhfelde"
    },
    {
        "code": "39036",
        "ort": "Binde"
    },
    {
        "code": "39037",
        "ort": "Pretzier"
    },
    {
        "code": "39038",
        "ort": "Henningen"
    },
    {
        "code": "39039",
        "ort": "Bonese"
    },
    {
        "code": "39050",
        "ort": "Bartensleben"
    },
    {
        "code": "39051",
        "ort": "Calvörde"
    },
    {
        "code": "39052",
        "ort": "Erxleben"
    },
    {
        "code": "39053",
        "ort": "Süplingen"
    },
    {
        "code": "39054",
        "ort": "Flechtingen"
    },
    {
        "code": "39055",
        "ort": "Hörsingen"
    },
    {
        "code": "39056",
        "ort": "Klüden"
    },
    {
        "code": "39057",
        "ort": "Rätzlingen,"
    },
    {
        "code": "39058",
        "ort": "Uthmöden"
    },
    {
        "code": "39059",
        "ort": "Wegenstedt"
    },
    {
        "code": "39061",
        "ort": "Weferlingen"
    },
    {
        "code": "39062",
        "ort": "Bebertal"
    },
    {
        "code": "39080",
        "ort": "Kalbe"
    },
    {
        "code": "39081",
        "ort": "Kakerbeck"
    },
    {
        "code": "39082",
        "ort": "Mieste"
    },
    {
        "code": "39083",
        "ort": "Messdorf"
    },
    {
        "code": "39084",
        "ort": "Lindstedt"
    },
    {
        "code": "39085",
        "ort": "Zichtau"
    },
    {
        "code": "39086",
        "ort": "Jävenitz"
    },
    {
        "code": "39087",
        "ort": "Jerchel"
    },
    {
        "code": "39088",
        "ort": "Letzlingen"
    },
    {
        "code": "39089",
        "ort": "Bismark"
    },
    {
        "code": "391",
        "ort": "Magdeburg"
    },
    {
        "code": "392\n3920\n39200",
        "ort": "Gommern\n39201"
    },
    {
        "code": "3920\n39200",
        "ort": "Gommern\n39201"
    },
    {
        "code": "39200",
        "ort": "Gommern"
    },
    {
        "code": "39201",
        "ort": "Wolmirstedt"
    },
    {
        "code": "39202",
        "ort": "Groß"
    },
    {
        "code": "39203",
        "ort": "Barleben"
    },
    {
        "code": "39204",
        "ort": "Niederndodeleben"
    },
    {
        "code": "39205",
        "ort": "Langenweddingen"
    },
    {
        "code": "39206",
        "ort": "Eichenbarleben"
    },
    {
        "code": "39207",
        "ort": "Colbitz"
    },
    {
        "code": "39208",
        "ort": "Loitsche"
    },
    {
        "code": "39209",
        "ort": "Wanzleben"
    },
    {
        "code": "3921",
        "ort": "Burg"
    },
    {
        "code": "3922\n39221",
        "ort": "Möckern\n39222"
    },
    {
        "code": "39221",
        "ort": "Möckern"
    },
    {
        "code": "39222",
        "ort": "Möser"
    },
    {
        "code": "39223",
        "ort": "Theessen"
    },
    {
        "code": "39224",
        "ort": "Büden"
    },
    {
        "code": "39225",
        "ort": "Altengrabow"
    },
    {
        "code": "39226",
        "ort": "Hohenziatz"
    },
    {
        "code": "3923",
        "ort": "Zerbst/Anhalt"
    },
    {
        "code": "3924\n39241",
        "ort": "Leitzkau\n39242"
    },
    {
        "code": "39241",
        "ort": "Leitzkau"
    },
    {
        "code": "39242",
        "ort": "Prödel"
    },
    {
        "code": "39243",
        "ort": "Nedlitz"
    },
    {
        "code": "39244",
        "ort": "Steutz"
    },
    {
        "code": "39245",
        "ort": "Loburg"
    },
    {
        "code": "39246",
        "ort": "Lindau"
    },
    {
        "code": "39247",
        "ort": "Güterglück"
    },
    {
        "code": "39248",
        "ort": "Dobritz"
    },
    {
        "code": "3925",
        "ort": "Staßfurt"
    },
    {
        "code": "3926\n39262",
        "ort": "Güsten\n39263"
    },
    {
        "code": "39262",
        "ort": "Güsten"
    },
    {
        "code": "39263",
        "ort": "Unseburg"
    },
    {
        "code": "39264",
        "ort": "Kroppenstedt"
    },
    {
        "code": "39265",
        "ort": "Löderburg"
    },
    {
        "code": "39266",
        "ort": "Förderstedt"
    },
    {
        "code": "39267",
        "ort": "Schneidlingen"
    },
    {
        "code": "39268",
        "ort": "Egeln"
    },
    {
        "code": "3928",
        "ort": "Schönebeck"
    },
    {
        "code": "3929\n39291",
        "ort": "Calbe"
    },
    {
        "code": "39291",
        "ort": "Calbe"
    },
    {
        "code": "39292",
        "ort": "Biederitz"
    },
    {
        "code": "39293",
        "ort": "Dreileben"
    },
    {
        "code": "39294",
        "ort": "Groß"
    },
    {
        "code": "39295",
        "ort": "Zuchau"
    },
    {
        "code": "39296",
        "ort": "Welsleben"
    },
    {
        "code": "39297",
        "ort": "Eickendorf"
    },
    {
        "code": "39298",
        "ort": "Barby"
    },
    {
        "code": "3920\n39200",
        "ort": "Gommern\n39201"
    },
    {
        "code": "39200",
        "ort": "Gommern"
    },
    {
        "code": "39201",
        "ort": "Wolmirstedt"
    },
    {
        "code": "39202",
        "ort": "Groß"
    },
    {
        "code": "39203",
        "ort": "Barleben"
    },
    {
        "code": "39204",
        "ort": "Niederndodeleben"
    },
    {
        "code": "39205",
        "ort": "Langenweddingen"
    },
    {
        "code": "39206",
        "ort": "Eichenbarleben"
    },
    {
        "code": "39207",
        "ort": "Colbitz"
    },
    {
        "code": "39208",
        "ort": "Loitsche"
    },
    {
        "code": "39209",
        "ort": "Wanzleben"
    },
    {
        "code": "3921",
        "ort": "Burg"
    },
    {
        "code": "3922\n39221",
        "ort": "Möckern\n39222"
    },
    {
        "code": "39221",
        "ort": "Möckern"
    },
    {
        "code": "39222",
        "ort": "Möser"
    },
    {
        "code": "39223",
        "ort": "Theessen"
    },
    {
        "code": "39224",
        "ort": "Büden"
    },
    {
        "code": "39225",
        "ort": "Altengrabow"
    },
    {
        "code": "39226",
        "ort": "Hohenziatz"
    },
    {
        "code": "3923",
        "ort": "Zerbst/Anhalt"
    },
    {
        "code": "3924\n39241",
        "ort": "Leitzkau\n39242"
    },
    {
        "code": "39241",
        "ort": "Leitzkau"
    },
    {
        "code": "39242",
        "ort": "Prödel"
    },
    {
        "code": "39243",
        "ort": "Nedlitz"
    },
    {
        "code": "39244",
        "ort": "Steutz"
    },
    {
        "code": "39245",
        "ort": "Loburg"
    },
    {
        "code": "39246",
        "ort": "Lindau"
    },
    {
        "code": "39247",
        "ort": "Güterglück"
    },
    {
        "code": "39248",
        "ort": "Dobritz"
    },
    {
        "code": "3925",
        "ort": "Staßfurt"
    },
    {
        "code": "3926\n39262",
        "ort": "Güsten\n39263"
    },
    {
        "code": "39262",
        "ort": "Güsten"
    },
    {
        "code": "39263",
        "ort": "Unseburg"
    },
    {
        "code": "39264",
        "ort": "Kroppenstedt"
    },
    {
        "code": "39265",
        "ort": "Löderburg"
    },
    {
        "code": "39266",
        "ort": "Förderstedt"
    },
    {
        "code": "39267",
        "ort": "Schneidlingen"
    },
    {
        "code": "39268",
        "ort": "Egeln"
    },
    {
        "code": "3928",
        "ort": "Schönebeck"
    },
    {
        "code": "3929\n39291",
        "ort": "Calbe"
    },
    {
        "code": "39291",
        "ort": "Calbe"
    },
    {
        "code": "39292",
        "ort": "Biederitz"
    },
    {
        "code": "39293",
        "ort": "Dreileben"
    },
    {
        "code": "39294",
        "ort": "Groß"
    },
    {
        "code": "39295",
        "ort": "Zuchau"
    },
    {
        "code": "39296",
        "ort": "Welsleben"
    },
    {
        "code": "39297",
        "ort": "Eickendorf"
    },
    {
        "code": "39298",
        "ort": "Barby"
    },
    {
        "code": "39200",
        "ort": "Gommern"
    },
    {
        "code": "39201",
        "ort": "Wolmirstedt"
    },
    {
        "code": "39202",
        "ort": "Groß"
    },
    {
        "code": "39203",
        "ort": "Barleben"
    },
    {
        "code": "39204",
        "ort": "Niederndodeleben"
    },
    {
        "code": "39205",
        "ort": "Langenweddingen"
    },
    {
        "code": "39206",
        "ort": "Eichenbarleben"
    },
    {
        "code": "39207",
        "ort": "Colbitz"
    },
    {
        "code": "39208",
        "ort": "Loitsche"
    },
    {
        "code": "39209",
        "ort": "Wanzleben"
    },
    {
        "code": "39221",
        "ort": "Möckern"
    },
    {
        "code": "39222",
        "ort": "Möser"
    },
    {
        "code": "39223",
        "ort": "Theessen"
    },
    {
        "code": "39224",
        "ort": "Büden"
    },
    {
        "code": "39225",
        "ort": "Altengrabow"
    },
    {
        "code": "39226",
        "ort": "Hohenziatz"
    },
    {
        "code": "39241",
        "ort": "Leitzkau"
    },
    {
        "code": "39242",
        "ort": "Prödel"
    },
    {
        "code": "39243",
        "ort": "Nedlitz"
    },
    {
        "code": "39244",
        "ort": "Steutz"
    },
    {
        "code": "39245",
        "ort": "Loburg"
    },
    {
        "code": "39246",
        "ort": "Lindau"
    },
    {
        "code": "39247",
        "ort": "Güterglück"
    },
    {
        "code": "39248",
        "ort": "Dobritz"
    },
    {
        "code": "39262",
        "ort": "Güsten"
    },
    {
        "code": "39263",
        "ort": "Unseburg"
    },
    {
        "code": "39264",
        "ort": "Kroppenstedt"
    },
    {
        "code": "39265",
        "ort": "Löderburg"
    },
    {
        "code": "39266",
        "ort": "Förderstedt"
    },
    {
        "code": "39267",
        "ort": "Schneidlingen"
    },
    {
        "code": "39268",
        "ort": "Egeln"
    },
    {
        "code": "39291",
        "ort": "Calbe"
    },
    {
        "code": "39292",
        "ort": "Biederitz"
    },
    {
        "code": "39293",
        "ort": "Dreileben"
    },
    {
        "code": "39294",
        "ort": "Groß"
    },
    {
        "code": "39295",
        "ort": "Zuchau"
    },
    {
        "code": "39296",
        "ort": "Welsleben"
    },
    {
        "code": "39297",
        "ort": "Eickendorf"
    },
    {
        "code": "39298",
        "ort": "Barby"
    },
    {
        "code": "3931",
        "ort": "Stendal\n3932\n39320"
    },
    {
        "code": "3931",
        "ort": "Stendal"
    },
    {
        "code": "3932\n39320",
        "ort": "Schinne\n39321"
    },
    {
        "code": "39320",
        "ort": "Schinne"
    },
    {
        "code": "39321",
        "ort": "Arneburg"
    },
    {
        "code": "39322",
        "ort": "Tangermünde"
    },
    {
        "code": "39323",
        "ort": "Schönhausen"
    },
    {
        "code": "39324",
        "ort": "Kläden"
    },
    {
        "code": "39325",
        "ort": "Vinzelberg"
    },
    {
        "code": "39327",
        "ort": "Klietz"
    },
    {
        "code": "39328",
        "ort": "Rochau"
    },
    {
        "code": "39329",
        "ort": "Möringen"
    },
    {
        "code": "3933",
        "ort": "Genthin"
    },
    {
        "code": "3934\n39341",
        "ort": "Redekin\n39342"
    },
    {
        "code": "39341",
        "ort": "Redekin"
    },
    {
        "code": "39342",
        "ort": "Gladau"
    },
    {
        "code": "39343",
        "ort": "Jerichow"
    },
    {
        "code": "39344",
        "ort": "Güsen"
    },
    {
        "code": "39345",
        "ort": "Parchen"
    },
    {
        "code": "39346",
        "ort": "Tucheim"
    },
    {
        "code": "39347",
        "ort": "Kade"
    },
    {
        "code": "39348",
        "ort": "Klitsche"
    },
    {
        "code": "39349",
        "ort": "Parey"
    },
    {
        "code": "3935",
        "ort": "Tangerhütte"
    },
    {
        "code": "3936\n39361",
        "ort": "Lüderitz"
    },
    {
        "code": "39361",
        "ort": "Lüderitz"
    },
    {
        "code": "39362",
        "ort": "Grieben"
    },
    {
        "code": "39363",
        "ort": "Angern"
    },
    {
        "code": "39364",
        "ort": "Dolle"
    },
    {
        "code": "39365",
        "ort": "Bellingen"
    },
    {
        "code": "39366",
        "ort": "Kehnert"
    },
    {
        "code": "3937",
        "ort": "Osterburg"
    },
    {
        "code": "3938\n39382",
        "ort": "Kamern\n39383"
    },
    {
        "code": "39382",
        "ort": "Kamern"
    },
    {
        "code": "39383",
        "ort": "Sandau"
    },
    {
        "code": "39384",
        "ort": "Arendsee"
    },
    {
        "code": "39386",
        "ort": "Seehausen"
    },
    {
        "code": "39387",
        "ort": "Havelberg"
    },
    {
        "code": "39388",
        "ort": "Goldbeck"
    },
    {
        "code": "3939\n39390",
        "ort": "Iden\n39391"
    },
    {
        "code": "39390",
        "ort": "Iden"
    },
    {
        "code": "39391",
        "ort": "Lückstedt"
    },
    {
        "code": "39392",
        "ort": "Rönnebeck"
    },
    {
        "code": "39393",
        "ort": "Werben"
    },
    {
        "code": "39394",
        "ort": "Hohenberg-Krusemark"
    },
    {
        "code": "39395",
        "ort": "Wanzer"
    },
    {
        "code": "39396",
        "ort": "Neukirchen"
    },
    {
        "code": "39397",
        "ort": "Geestgottberg"
    },
    {
        "code": "39398",
        "ort": "Groß"
    },
    {
        "code": "39399",
        "ort": "Kleinau"
    },
    {
        "code": "3931",
        "ort": "Stendal"
    },
    {
        "code": "3932\n39320",
        "ort": "Schinne\n39321"
    },
    {
        "code": "39320",
        "ort": "Schinne"
    },
    {
        "code": "39321",
        "ort": "Arneburg"
    },
    {
        "code": "39322",
        "ort": "Tangermünde"
    },
    {
        "code": "39323",
        "ort": "Schönhausen"
    },
    {
        "code": "39324",
        "ort": "Kläden"
    },
    {
        "code": "39325",
        "ort": "Vinzelberg"
    },
    {
        "code": "39327",
        "ort": "Klietz"
    },
    {
        "code": "39328",
        "ort": "Rochau"
    },
    {
        "code": "39329",
        "ort": "Möringen"
    },
    {
        "code": "3933",
        "ort": "Genthin"
    },
    {
        "code": "3934\n39341",
        "ort": "Redekin\n39342"
    },
    {
        "code": "39341",
        "ort": "Redekin"
    },
    {
        "code": "39342",
        "ort": "Gladau"
    },
    {
        "code": "39343",
        "ort": "Jerichow"
    },
    {
        "code": "39344",
        "ort": "Güsen"
    },
    {
        "code": "39345",
        "ort": "Parchen"
    },
    {
        "code": "39346",
        "ort": "Tucheim"
    },
    {
        "code": "39347",
        "ort": "Kade"
    },
    {
        "code": "39348",
        "ort": "Klitsche"
    },
    {
        "code": "39349",
        "ort": "Parey"
    },
    {
        "code": "3935",
        "ort": "Tangerhütte"
    },
    {
        "code": "3936\n39361",
        "ort": "Lüderitz"
    },
    {
        "code": "39361",
        "ort": "Lüderitz"
    },
    {
        "code": "39362",
        "ort": "Grieben"
    },
    {
        "code": "39363",
        "ort": "Angern"
    },
    {
        "code": "39364",
        "ort": "Dolle"
    },
    {
        "code": "39365",
        "ort": "Bellingen"
    },
    {
        "code": "39366",
        "ort": "Kehnert"
    },
    {
        "code": "3937",
        "ort": "Osterburg"
    },
    {
        "code": "3938\n39382",
        "ort": "Kamern\n39383"
    },
    {
        "code": "39382",
        "ort": "Kamern"
    },
    {
        "code": "39383",
        "ort": "Sandau"
    },
    {
        "code": "39384",
        "ort": "Arendsee"
    },
    {
        "code": "39386",
        "ort": "Seehausen"
    },
    {
        "code": "39387",
        "ort": "Havelberg"
    },
    {
        "code": "39388",
        "ort": "Goldbeck"
    },
    {
        "code": "3939\n39390",
        "ort": "Iden\n39391"
    },
    {
        "code": "39390",
        "ort": "Iden"
    },
    {
        "code": "39391",
        "ort": "Lückstedt"
    },
    {
        "code": "39392",
        "ort": "Rönnebeck"
    },
    {
        "code": "39393",
        "ort": "Werben"
    },
    {
        "code": "39394",
        "ort": "Hohenberg-Krusemark"
    },
    {
        "code": "39395",
        "ort": "Wanzer"
    },
    {
        "code": "39396",
        "ort": "Neukirchen"
    },
    {
        "code": "39397",
        "ort": "Geestgottberg"
    },
    {
        "code": "39398",
        "ort": "Groß"
    },
    {
        "code": "39399",
        "ort": "Kleinau"
    },
    {
        "code": "39320",
        "ort": "Schinne"
    },
    {
        "code": "39321",
        "ort": "Arneburg"
    },
    {
        "code": "39322",
        "ort": "Tangermünde"
    },
    {
        "code": "39323",
        "ort": "Schönhausen"
    },
    {
        "code": "39324",
        "ort": "Kläden"
    },
    {
        "code": "39325",
        "ort": "Vinzelberg"
    },
    {
        "code": "39327",
        "ort": "Klietz"
    },
    {
        "code": "39328",
        "ort": "Rochau"
    },
    {
        "code": "39329",
        "ort": "Möringen"
    },
    {
        "code": "39341",
        "ort": "Redekin"
    },
    {
        "code": "39342",
        "ort": "Gladau"
    },
    {
        "code": "39343",
        "ort": "Jerichow"
    },
    {
        "code": "39344",
        "ort": "Güsen"
    },
    {
        "code": "39345",
        "ort": "Parchen"
    },
    {
        "code": "39346",
        "ort": "Tucheim"
    },
    {
        "code": "39347",
        "ort": "Kade"
    },
    {
        "code": "39348",
        "ort": "Klitsche"
    },
    {
        "code": "39349",
        "ort": "Parey"
    },
    {
        "code": "39361",
        "ort": "Lüderitz"
    },
    {
        "code": "39362",
        "ort": "Grieben"
    },
    {
        "code": "39363",
        "ort": "Angern"
    },
    {
        "code": "39364",
        "ort": "Dolle"
    },
    {
        "code": "39365",
        "ort": "Bellingen"
    },
    {
        "code": "39366",
        "ort": "Kehnert"
    },
    {
        "code": "39382",
        "ort": "Kamern"
    },
    {
        "code": "39383",
        "ort": "Sandau"
    },
    {
        "code": "39384",
        "ort": "Arendsee"
    },
    {
        "code": "39386",
        "ort": "Seehausen"
    },
    {
        "code": "39387",
        "ort": "Havelberg"
    },
    {
        "code": "39388",
        "ort": "Goldbeck"
    },
    {
        "code": "39390",
        "ort": "Iden"
    },
    {
        "code": "39391",
        "ort": "Lückstedt"
    },
    {
        "code": "39392",
        "ort": "Rönnebeck"
    },
    {
        "code": "39393",
        "ort": "Werben"
    },
    {
        "code": "39394",
        "ort": "Hohenberg-Krusemark"
    },
    {
        "code": "39395",
        "ort": "Wanzer"
    },
    {
        "code": "39396",
        "ort": "Neukirchen"
    },
    {
        "code": "39397",
        "ort": "Geestgottberg"
    },
    {
        "code": "39398",
        "ort": "Groß"
    },
    {
        "code": "39399",
        "ort": "Kleinau"
    },
    {
        "code": "3940\n39400",
        "ort": "Wefensleben\n39401"
    },
    {
        "code": "3940\n39400",
        "ort": "Wefensleben\n39401"
    },
    {
        "code": "39400",
        "ort": "Wefensleben"
    },
    {
        "code": "39401",
        "ort": "Neuwegersleben"
    },
    {
        "code": "39402",
        "ort": "Völpke"
    },
    {
        "code": "39403",
        "ort": "Gröningen"
    },
    {
        "code": "39404",
        "ort": "Ausleben"
    },
    {
        "code": "39405",
        "ort": "Hötensleben"
    },
    {
        "code": "39406",
        "ort": "Harbke"
    },
    {
        "code": "39407",
        "ort": "Seehausen"
    },
    {
        "code": "39408",
        "ort": "Hadmersleben"
    },
    {
        "code": "39409",
        "ort": "Eilsleben"
    },
    {
        "code": "3941",
        "ort": "Halberstadt"
    },
    {
        "code": "3942\n39421",
        "ort": "Osterwieck\n39422"
    },
    {
        "code": "39421",
        "ort": "Osterwieck"
    },
    {
        "code": "39422",
        "ort": "Badersleben"
    },
    {
        "code": "39423",
        "ort": "Wegeleben"
    },
    {
        "code": "39424",
        "ort": "Schwanebeck"
    },
    {
        "code": "39425",
        "ort": "Dingelstedt"
    },
    {
        "code": "39426",
        "ort": "Hessen"
    },
    {
        "code": "39427",
        "ort": "Schachdorf"
    },
    {
        "code": "39428",
        "ort": "Pabstorf"
    },
    {
        "code": "3943",
        "ort": "Wernigerode"
    },
    {
        "code": "3944",
        "ort": "Blankenburg"
    },
    {
        "code": "3945\n39451",
        "ort": "Wasserleben\n39452"
    },
    {
        "code": "39451",
        "ort": "Wasserleben"
    },
    {
        "code": "39452",
        "ort": "Ilsenburg"
    },
    {
        "code": "39453",
        "ort": "Derenburg"
    },
    {
        "code": "39454",
        "ort": "Elbingerode"
    },
    {
        "code": "39455",
        "ort": "Schierke"
    },
    {
        "code": "39456",
        "ort": "Altenbrak"
    },
    {
        "code": "39457",
        "ort": "Benneckenstein"
    },
    {
        "code": "39458",
        "ort": "Heudeber"
    },
    {
        "code": "39459",
        "ort": "Hasselfelde"
    },
    {
        "code": "3946",
        "ort": "Quedlinburg"
    },
    {
        "code": "3947",
        "ort": "Thale"
    },
    {
        "code": "3948\n39481",
        "ort": "Hedersleben\n39482"
    },
    {
        "code": "39481",
        "ort": "Hedersleben"
    },
    {
        "code": "39482",
        "ort": "Gatersleben"
    },
    {
        "code": "39483",
        "ort": "Ballenstedt"
    },
    {
        "code": "39484",
        "ort": "Harzgerode"
    },
    {
        "code": "39485",
        "ort": "Gernrode"
    },
    {
        "code": "39487",
        "ort": "Friedrichsbrunn"
    },
    {
        "code": "39488",
        "ort": "Güntersberge"
    },
    {
        "code": "39489",
        "ort": "Straßberg"
    },
    {
        "code": "3949",
        "ort": "Oschersleben"
    },
    {
        "code": "3940\n39400",
        "ort": "Wefensleben\n39401"
    },
    {
        "code": "39400",
        "ort": "Wefensleben"
    },
    {
        "code": "39401",
        "ort": "Neuwegersleben"
    },
    {
        "code": "39402",
        "ort": "Völpke"
    },
    {
        "code": "39403",
        "ort": "Gröningen"
    },
    {
        "code": "39404",
        "ort": "Ausleben"
    },
    {
        "code": "39405",
        "ort": "Hötensleben"
    },
    {
        "code": "39406",
        "ort": "Harbke"
    },
    {
        "code": "39407",
        "ort": "Seehausen"
    },
    {
        "code": "39408",
        "ort": "Hadmersleben"
    },
    {
        "code": "39409",
        "ort": "Eilsleben"
    },
    {
        "code": "3941",
        "ort": "Halberstadt"
    },
    {
        "code": "3942\n39421",
        "ort": "Osterwieck\n39422"
    },
    {
        "code": "39421",
        "ort": "Osterwieck"
    },
    {
        "code": "39422",
        "ort": "Badersleben"
    },
    {
        "code": "39423",
        "ort": "Wegeleben"
    },
    {
        "code": "39424",
        "ort": "Schwanebeck"
    },
    {
        "code": "39425",
        "ort": "Dingelstedt"
    },
    {
        "code": "39426",
        "ort": "Hessen"
    },
    {
        "code": "39427",
        "ort": "Schachdorf"
    },
    {
        "code": "39428",
        "ort": "Pabstorf"
    },
    {
        "code": "3943",
        "ort": "Wernigerode"
    },
    {
        "code": "3944",
        "ort": "Blankenburg"
    },
    {
        "code": "3945\n39451",
        "ort": "Wasserleben\n39452"
    },
    {
        "code": "39451",
        "ort": "Wasserleben"
    },
    {
        "code": "39452",
        "ort": "Ilsenburg"
    },
    {
        "code": "39453",
        "ort": "Derenburg"
    },
    {
        "code": "39454",
        "ort": "Elbingerode"
    },
    {
        "code": "39455",
        "ort": "Schierke"
    },
    {
        "code": "39456",
        "ort": "Altenbrak"
    },
    {
        "code": "39457",
        "ort": "Benneckenstein"
    },
    {
        "code": "39458",
        "ort": "Heudeber"
    },
    {
        "code": "39459",
        "ort": "Hasselfelde"
    },
    {
        "code": "3946",
        "ort": "Quedlinburg"
    },
    {
        "code": "3947",
        "ort": "Thale"
    },
    {
        "code": "3948\n39481",
        "ort": "Hedersleben\n39482"
    },
    {
        "code": "39481",
        "ort": "Hedersleben"
    },
    {
        "code": "39482",
        "ort": "Gatersleben"
    },
    {
        "code": "39483",
        "ort": "Ballenstedt"
    },
    {
        "code": "39484",
        "ort": "Harzgerode"
    },
    {
        "code": "39485",
        "ort": "Gernrode"
    },
    {
        "code": "39487",
        "ort": "Friedrichsbrunn"
    },
    {
        "code": "39488",
        "ort": "Güntersberge"
    },
    {
        "code": "39489",
        "ort": "Straßberg"
    },
    {
        "code": "3949",
        "ort": "Oschersleben"
    },
    {
        "code": "39400",
        "ort": "Wefensleben"
    },
    {
        "code": "39401",
        "ort": "Neuwegersleben"
    },
    {
        "code": "39402",
        "ort": "Völpke"
    },
    {
        "code": "39403",
        "ort": "Gröningen"
    },
    {
        "code": "39404",
        "ort": "Ausleben"
    },
    {
        "code": "39405",
        "ort": "Hötensleben"
    },
    {
        "code": "39406",
        "ort": "Harbke"
    },
    {
        "code": "39407",
        "ort": "Seehausen"
    },
    {
        "code": "39408",
        "ort": "Hadmersleben"
    },
    {
        "code": "39409",
        "ort": "Eilsleben"
    },
    {
        "code": "39421",
        "ort": "Osterwieck"
    },
    {
        "code": "39422",
        "ort": "Badersleben"
    },
    {
        "code": "39423",
        "ort": "Wegeleben"
    },
    {
        "code": "39424",
        "ort": "Schwanebeck"
    },
    {
        "code": "39425",
        "ort": "Dingelstedt"
    },
    {
        "code": "39426",
        "ort": "Hessen"
    },
    {
        "code": "39427",
        "ort": "Schachdorf"
    },
    {
        "code": "39428",
        "ort": "Pabstorf"
    },
    {
        "code": "39451",
        "ort": "Wasserleben"
    },
    {
        "code": "39452",
        "ort": "Ilsenburg"
    },
    {
        "code": "39453",
        "ort": "Derenburg"
    },
    {
        "code": "39454",
        "ort": "Elbingerode"
    },
    {
        "code": "39455",
        "ort": "Schierke"
    },
    {
        "code": "39456",
        "ort": "Altenbrak"
    },
    {
        "code": "39457",
        "ort": "Benneckenstein"
    },
    {
        "code": "39458",
        "ort": "Heudeber"
    },
    {
        "code": "39459",
        "ort": "Hasselfelde"
    },
    {
        "code": "39481",
        "ort": "Hedersleben"
    },
    {
        "code": "39482",
        "ort": "Gatersleben"
    },
    {
        "code": "39483",
        "ort": "Ballenstedt"
    },
    {
        "code": "39484",
        "ort": "Harzgerode"
    },
    {
        "code": "39485",
        "ort": "Gernrode"
    },
    {
        "code": "39487",
        "ort": "Friedrichsbrunn"
    },
    {
        "code": "39488",
        "ort": "Güntersberge"
    },
    {
        "code": "39489",
        "ort": "Straßberg"
    },
    {
        "code": "395",
        "ort": "Neubrandenburg"
    },
    {
        "code": "396\n3960\n39600",
        "ort": "Zwiedorf\n39601"
    },
    {
        "code": "3960\n39600",
        "ort": "Zwiedorf\n39601"
    },
    {
        "code": "39600",
        "ort": "Zwiedorf"
    },
    {
        "code": "39601",
        "ort": "Friedland,"
    },
    {
        "code": "39602",
        "ort": "Kleeth"
    },
    {
        "code": "39603",
        "ort": "Burg"
    },
    {
        "code": "39604",
        "ort": "Wildberg"
    },
    {
        "code": "39605",
        "ort": "Groß"
    },
    {
        "code": "39606",
        "ort": "Glienke"
    },
    {
        "code": "39607",
        "ort": "Kotelow"
    },
    {
        "code": "39608",
        "ort": "Staven"
    },
    {
        "code": "3961",
        "ort": "Altentreptow"
    },
    {
        "code": "3962",
        "ort": "Penzlin"
    },
    {
        "code": "3963",
        "ort": "Woldegk"
    },
    {
        "code": "3964",
        "ort": "Bredenfelde"
    },
    {
        "code": "3965",
        "ort": "Burow"
    },
    {
        "code": "3966",
        "ort": "Cölpin"
    },
    {
        "code": "3967",
        "ort": "Oertzenhof"
    },
    {
        "code": "3968",
        "ort": "Schönbeck"
    },
    {
        "code": "3969",
        "ort": "Siedenbollentin"
    },
    {
        "code": "3960\n39600",
        "ort": "Zwiedorf\n39601"
    },
    {
        "code": "39600",
        "ort": "Zwiedorf"
    },
    {
        "code": "39601",
        "ort": "Friedland,"
    },
    {
        "code": "39602",
        "ort": "Kleeth"
    },
    {
        "code": "39603",
        "ort": "Burg"
    },
    {
        "code": "39604",
        "ort": "Wildberg"
    },
    {
        "code": "39605",
        "ort": "Groß"
    },
    {
        "code": "39606",
        "ort": "Glienke"
    },
    {
        "code": "39607",
        "ort": "Kotelow"
    },
    {
        "code": "39608",
        "ort": "Staven"
    },
    {
        "code": "3961",
        "ort": "Altentreptow"
    },
    {
        "code": "3962",
        "ort": "Penzlin"
    },
    {
        "code": "3963",
        "ort": "Woldegk"
    },
    {
        "code": "3964",
        "ort": "Bredenfelde"
    },
    {
        "code": "3965",
        "ort": "Burow"
    },
    {
        "code": "3966",
        "ort": "Cölpin"
    },
    {
        "code": "3967",
        "ort": "Oertzenhof"
    },
    {
        "code": "3968",
        "ort": "Schönbeck"
    },
    {
        "code": "3969",
        "ort": "Siedenbollentin"
    },
    {
        "code": "39600",
        "ort": "Zwiedorf"
    },
    {
        "code": "39601",
        "ort": "Friedland,"
    },
    {
        "code": "39602",
        "ort": "Kleeth"
    },
    {
        "code": "39603",
        "ort": "Burg"
    },
    {
        "code": "39604",
        "ort": "Wildberg"
    },
    {
        "code": "39605",
        "ort": "Groß"
    },
    {
        "code": "39606",
        "ort": "Glienke"
    },
    {
        "code": "39607",
        "ort": "Kotelow"
    },
    {
        "code": "39608",
        "ort": "Staven"
    },
    {
        "code": "3971",
        "ort": "Anklam\n3972\n39721"
    },
    {
        "code": "3971",
        "ort": "Anklam"
    },
    {
        "code": "3972\n39721",
        "ort": "Liepen\n39722"
    },
    {
        "code": "39721",
        "ort": "Liepen"
    },
    {
        "code": "39722",
        "ort": "Sarnow"
    },
    {
        "code": "39723",
        "ort": "Krien"
    },
    {
        "code": "39724",
        "ort": "Klein"
    },
    {
        "code": "39726",
        "ort": "Ducherow"
    },
    {
        "code": "39727",
        "ort": "Spantekow"
    },
    {
        "code": "39728",
        "ort": "Medow"
    },
    {
        "code": "3973",
        "ort": "Pasewalk"
    },
    {
        "code": "3974\n39740",
        "ort": "Nechlin\n39741"
    },
    {
        "code": "39740",
        "ort": "Nechlin"
    },
    {
        "code": "39741",
        "ort": "Jatznick"
    },
    {
        "code": "39742",
        "ort": "Brüssow"
    },
    {
        "code": "39743",
        "ort": "Zerrenthin"
    },
    {
        "code": "39744",
        "ort": "Rothenklempenow"
    },
    {
        "code": "39745",
        "ort": "Hetzdorf"
    },
    {
        "code": "39746",
        "ort": "Krackow"
    },
    {
        "code": "39747",
        "ort": "Züsedom"
    },
    {
        "code": "39748",
        "ort": "Viereck"
    },
    {
        "code": "39749",
        "ort": "Grambow"
    },
    {
        "code": "3975\n39751",
        "ort": "Penkun\n39752"
    },
    {
        "code": "39751",
        "ort": "Penkun"
    },
    {
        "code": "39752",
        "ort": "Blumenhagen"
    },
    {
        "code": "39753",
        "ort": "Strasburg"
    },
    {
        "code": "39754",
        "ort": "Löcknitz"
    },
    {
        "code": "3976",
        "ort": "Torgelow"
    },
    {
        "code": "3977\n39771",
        "ort": "Ueckermünde\n39772"
    },
    {
        "code": "39771",
        "ort": "Ueckermünde"
    },
    {
        "code": "39772",
        "ort": "Rothemühl"
    },
    {
        "code": "39773",
        "ort": "Altwarp"
    },
    {
        "code": "39774",
        "ort": "Mönkebude"
    },
    {
        "code": "39775",
        "ort": "Ahlbeck"
    },
    {
        "code": "39776",
        "ort": "Hintersee"
    },
    {
        "code": "39777",
        "ort": "Borkenfriede"
    },
    {
        "code": "39778",
        "ort": "Ferdinandshof"
    },
    {
        "code": "39779",
        "ort": "Eggesin"
    },
    {
        "code": "3971",
        "ort": "Anklam"
    },
    {
        "code": "3972\n39721",
        "ort": "Liepen\n39722"
    },
    {
        "code": "39721",
        "ort": "Liepen"
    },
    {
        "code": "39722",
        "ort": "Sarnow"
    },
    {
        "code": "39723",
        "ort": "Krien"
    },
    {
        "code": "39724",
        "ort": "Klein"
    },
    {
        "code": "39726",
        "ort": "Ducherow"
    },
    {
        "code": "39727",
        "ort": "Spantekow"
    },
    {
        "code": "39728",
        "ort": "Medow"
    },
    {
        "code": "3973",
        "ort": "Pasewalk"
    },
    {
        "code": "3974\n39740",
        "ort": "Nechlin\n39741"
    },
    {
        "code": "39740",
        "ort": "Nechlin"
    },
    {
        "code": "39741",
        "ort": "Jatznick"
    },
    {
        "code": "39742",
        "ort": "Brüssow"
    },
    {
        "code": "39743",
        "ort": "Zerrenthin"
    },
    {
        "code": "39744",
        "ort": "Rothenklempenow"
    },
    {
        "code": "39745",
        "ort": "Hetzdorf"
    },
    {
        "code": "39746",
        "ort": "Krackow"
    },
    {
        "code": "39747",
        "ort": "Züsedom"
    },
    {
        "code": "39748",
        "ort": "Viereck"
    },
    {
        "code": "39749",
        "ort": "Grambow"
    },
    {
        "code": "3975\n39751",
        "ort": "Penkun\n39752"
    },
    {
        "code": "39751",
        "ort": "Penkun"
    },
    {
        "code": "39752",
        "ort": "Blumenhagen"
    },
    {
        "code": "39753",
        "ort": "Strasburg"
    },
    {
        "code": "39754",
        "ort": "Löcknitz"
    },
    {
        "code": "3976",
        "ort": "Torgelow"
    },
    {
        "code": "3977\n39771",
        "ort": "Ueckermünde\n39772"
    },
    {
        "code": "39771",
        "ort": "Ueckermünde"
    },
    {
        "code": "39772",
        "ort": "Rothemühl"
    },
    {
        "code": "39773",
        "ort": "Altwarp"
    },
    {
        "code": "39774",
        "ort": "Mönkebude"
    },
    {
        "code": "39775",
        "ort": "Ahlbeck"
    },
    {
        "code": "39776",
        "ort": "Hintersee"
    },
    {
        "code": "39777",
        "ort": "Borkenfriede"
    },
    {
        "code": "39778",
        "ort": "Ferdinandshof"
    },
    {
        "code": "39779",
        "ort": "Eggesin"
    },
    {
        "code": "39721",
        "ort": "Liepen"
    },
    {
        "code": "39722",
        "ort": "Sarnow"
    },
    {
        "code": "39723",
        "ort": "Krien"
    },
    {
        "code": "39724",
        "ort": "Klein"
    },
    {
        "code": "39726",
        "ort": "Ducherow"
    },
    {
        "code": "39727",
        "ort": "Spantekow"
    },
    {
        "code": "39728",
        "ort": "Medow"
    },
    {
        "code": "39740",
        "ort": "Nechlin"
    },
    {
        "code": "39741",
        "ort": "Jatznick"
    },
    {
        "code": "39742",
        "ort": "Brüssow"
    },
    {
        "code": "39743",
        "ort": "Zerrenthin"
    },
    {
        "code": "39744",
        "ort": "Rothenklempenow"
    },
    {
        "code": "39745",
        "ort": "Hetzdorf"
    },
    {
        "code": "39746",
        "ort": "Krackow"
    },
    {
        "code": "39747",
        "ort": "Züsedom"
    },
    {
        "code": "39748",
        "ort": "Viereck"
    },
    {
        "code": "39749",
        "ort": "Grambow"
    },
    {
        "code": "39751",
        "ort": "Penkun"
    },
    {
        "code": "39752",
        "ort": "Blumenhagen"
    },
    {
        "code": "39753",
        "ort": "Strasburg"
    },
    {
        "code": "39754",
        "ort": "Löcknitz"
    },
    {
        "code": "39771",
        "ort": "Ueckermünde"
    },
    {
        "code": "39772",
        "ort": "Rothemühl"
    },
    {
        "code": "39773",
        "ort": "Altwarp"
    },
    {
        "code": "39774",
        "ort": "Mönkebude"
    },
    {
        "code": "39775",
        "ort": "Ahlbeck"
    },
    {
        "code": "39776",
        "ort": "Hintersee"
    },
    {
        "code": "39777",
        "ort": "Borkenfriede"
    },
    {
        "code": "39778",
        "ort": "Ferdinandshof"
    },
    {
        "code": "39779",
        "ort": "Eggesin"
    },
    {
        "code": "3981",
        "ort": "Neustrelitz\n3982\n39820"
    },
    {
        "code": "3981",
        "ort": "Neustrelitz"
    },
    {
        "code": "3982\n39820",
        "ort": "Triepkendorf\n39821"
    },
    {
        "code": "39820",
        "ort": "Triepkendorf"
    },
    {
        "code": "39821",
        "ort": "Carpin"
    },
    {
        "code": "39822",
        "ort": "Kratzeburg"
    },
    {
        "code": "39823",
        "ort": "Rechlin"
    },
    {
        "code": "39824",
        "ort": "Hohenzieritz"
    },
    {
        "code": "39825",
        "ort": "Wokuhl-Dabelow"
    },
    {
        "code": "39826",
        "ort": "Blankensee"
    },
    {
        "code": "39827",
        "ort": "Schwarz"
    },
    {
        "code": "39828",
        "ort": "Wustrow"
    },
    {
        "code": "39829",
        "ort": "Blankenförde"
    },
    {
        "code": "3983\n39831",
        "ort": "Feldberg\n39832"
    },
    {
        "code": "39831",
        "ort": "Feldberg"
    },
    {
        "code": "39832",
        "ort": "Wesenberg"
    },
    {
        "code": "39833",
        "ort": "Mirow"
    },
    {
        "code": "3984",
        "ort": "Prenzlau"
    },
    {
        "code": "3985\n39851",
        "ort": "Göritz\n39852"
    },
    {
        "code": "39851",
        "ort": "Göritz"
    },
    {
        "code": "39852",
        "ort": "Schönermark"
    },
    {
        "code": "39853",
        "ort": "Holzendorf"
    },
    {
        "code": "39854",
        "ort": "Kleptow"
    },
    {
        "code": "39855",
        "ort": "Weggun"
    },
    {
        "code": "39856",
        "ort": "Beenz"
    },
    {
        "code": "39857",
        "ort": "Drense"
    },
    {
        "code": "39858",
        "ort": "Bietikow"
    },
    {
        "code": "39859",
        "ort": "Fürstenwerder"
    },
    {
        "code": "3986\n39861",
        "ort": "Gramzow\n39862"
    },
    {
        "code": "39861",
        "ort": "Gramzow"
    },
    {
        "code": "39862",
        "ort": "Schmölln"
    },
    {
        "code": "39863",
        "ort": "Seehausen"
    },
    {
        "code": "3987",
        "ort": "Templin"
    },
    {
        "code": "3988\n39881",
        "ort": "Ringenwalde\n39882"
    },
    {
        "code": "39881",
        "ort": "Ringenwalde"
    },
    {
        "code": "39882",
        "ort": "Gollin"
    },
    {
        "code": "39883",
        "ort": "Groß"
    },
    {
        "code": "39884",
        "ort": "Haßleben"
    },
    {
        "code": "39885",
        "ort": "Jakobshagen"
    },
    {
        "code": "39886",
        "ort": "Milmersdorf"
    },
    {
        "code": "39887",
        "ort": "Gerswalde"
    },
    {
        "code": "39888",
        "ort": "Lychen"
    },
    {
        "code": "39889",
        "ort": "Boitzenburg"
    },
    {
        "code": "3981",
        "ort": "Neustrelitz"
    },
    {
        "code": "3982\n39820",
        "ort": "Triepkendorf\n39821"
    },
    {
        "code": "39820",
        "ort": "Triepkendorf"
    },
    {
        "code": "39821",
        "ort": "Carpin"
    },
    {
        "code": "39822",
        "ort": "Kratzeburg"
    },
    {
        "code": "39823",
        "ort": "Rechlin"
    },
    {
        "code": "39824",
        "ort": "Hohenzieritz"
    },
    {
        "code": "39825",
        "ort": "Wokuhl-Dabelow"
    },
    {
        "code": "39826",
        "ort": "Blankensee"
    },
    {
        "code": "39827",
        "ort": "Schwarz"
    },
    {
        "code": "39828",
        "ort": "Wustrow"
    },
    {
        "code": "39829",
        "ort": "Blankenförde"
    },
    {
        "code": "3983\n39831",
        "ort": "Feldberg\n39832"
    },
    {
        "code": "39831",
        "ort": "Feldberg"
    },
    {
        "code": "39832",
        "ort": "Wesenberg"
    },
    {
        "code": "39833",
        "ort": "Mirow"
    },
    {
        "code": "3984",
        "ort": "Prenzlau"
    },
    {
        "code": "3985\n39851",
        "ort": "Göritz\n39852"
    },
    {
        "code": "39851",
        "ort": "Göritz"
    },
    {
        "code": "39852",
        "ort": "Schönermark"
    },
    {
        "code": "39853",
        "ort": "Holzendorf"
    },
    {
        "code": "39854",
        "ort": "Kleptow"
    },
    {
        "code": "39855",
        "ort": "Weggun"
    },
    {
        "code": "39856",
        "ort": "Beenz"
    },
    {
        "code": "39857",
        "ort": "Drense"
    },
    {
        "code": "39858",
        "ort": "Bietikow"
    },
    {
        "code": "39859",
        "ort": "Fürstenwerder"
    },
    {
        "code": "3986\n39861",
        "ort": "Gramzow\n39862"
    },
    {
        "code": "39861",
        "ort": "Gramzow"
    },
    {
        "code": "39862",
        "ort": "Schmölln"
    },
    {
        "code": "39863",
        "ort": "Seehausen"
    },
    {
        "code": "3987",
        "ort": "Templin"
    },
    {
        "code": "3988\n39881",
        "ort": "Ringenwalde\n39882"
    },
    {
        "code": "39881",
        "ort": "Ringenwalde"
    },
    {
        "code": "39882",
        "ort": "Gollin"
    },
    {
        "code": "39883",
        "ort": "Groß"
    },
    {
        "code": "39884",
        "ort": "Haßleben"
    },
    {
        "code": "39885",
        "ort": "Jakobshagen"
    },
    {
        "code": "39886",
        "ort": "Milmersdorf"
    },
    {
        "code": "39887",
        "ort": "Gerswalde"
    },
    {
        "code": "39888",
        "ort": "Lychen"
    },
    {
        "code": "39889",
        "ort": "Boitzenburg"
    },
    {
        "code": "39820",
        "ort": "Triepkendorf"
    },
    {
        "code": "39821",
        "ort": "Carpin"
    },
    {
        "code": "39822",
        "ort": "Kratzeburg"
    },
    {
        "code": "39823",
        "ort": "Rechlin"
    },
    {
        "code": "39824",
        "ort": "Hohenzieritz"
    },
    {
        "code": "39825",
        "ort": "Wokuhl-Dabelow"
    },
    {
        "code": "39826",
        "ort": "Blankensee"
    },
    {
        "code": "39827",
        "ort": "Schwarz"
    },
    {
        "code": "39828",
        "ort": "Wustrow"
    },
    {
        "code": "39829",
        "ort": "Blankenförde"
    },
    {
        "code": "39831",
        "ort": "Feldberg"
    },
    {
        "code": "39832",
        "ort": "Wesenberg"
    },
    {
        "code": "39833",
        "ort": "Mirow"
    },
    {
        "code": "39851",
        "ort": "Göritz"
    },
    {
        "code": "39852",
        "ort": "Schönermark"
    },
    {
        "code": "39853",
        "ort": "Holzendorf"
    },
    {
        "code": "39854",
        "ort": "Kleptow"
    },
    {
        "code": "39855",
        "ort": "Weggun"
    },
    {
        "code": "39856",
        "ort": "Beenz"
    },
    {
        "code": "39857",
        "ort": "Drense"
    },
    {
        "code": "39858",
        "ort": "Bietikow"
    },
    {
        "code": "39859",
        "ort": "Fürstenwerder"
    },
    {
        "code": "39861",
        "ort": "Gramzow"
    },
    {
        "code": "39862",
        "ort": "Schmölln"
    },
    {
        "code": "39863",
        "ort": "Seehausen"
    },
    {
        "code": "39881",
        "ort": "Ringenwalde"
    },
    {
        "code": "39882",
        "ort": "Gollin"
    },
    {
        "code": "39883",
        "ort": "Groß"
    },
    {
        "code": "39884",
        "ort": "Haßleben"
    },
    {
        "code": "39885",
        "ort": "Jakobshagen"
    },
    {
        "code": "39886",
        "ort": "Milmersdorf"
    },
    {
        "code": "39887",
        "ort": "Gerswalde"
    },
    {
        "code": "39888",
        "ort": "Lychen"
    },
    {
        "code": "39889",
        "ort": "Boitzenburg"
    },
    {
        "code": "3991",
        "ort": "Waren"
    },
    {
        "code": "3991",
        "ort": "Waren"
    },
    {
        "code": "3992\n39921",
        "ort": "Ankershagen\n39922"
    },
    {
        "code": "39921",
        "ort": "Ankershagen"
    },
    {
        "code": "39922",
        "ort": "Dambeck"
    },
    {
        "code": "39923",
        "ort": "Priborn"
    },
    {
        "code": "39924",
        "ort": "Stuer"
    },
    {
        "code": "39925",
        "ort": "Wredenhagen"
    },
    {
        "code": "39926",
        "ort": "Grabowhöfe"
    },
    {
        "code": "39927",
        "ort": "Nossentiner"
    },
    {
        "code": "39928",
        "ort": "Möllenhagen"
    },
    {
        "code": "39929",
        "ort": "Jabel"
    },
    {
        "code": "3993\n39931",
        "ort": "Röbel/Müritz\n39932"
    },
    {
        "code": "39931",
        "ort": "Röbel/Müritz"
    },
    {
        "code": "39932",
        "ort": "Malchow"
    },
    {
        "code": "39933",
        "ort": "Vollrathsruhe"
    },
    {
        "code": "39934",
        "ort": "Klein"
    },
    {
        "code": "3994",
        "ort": "Malchin"
    },
    {
        "code": "3995\n39951",
        "ort": "Faulenrost\n39952"
    },
    {
        "code": "39951",
        "ort": "Faulenrost"
    },
    {
        "code": "39952",
        "ort": "Grammentin"
    },
    {
        "code": "39953",
        "ort": "Schwinkendorf"
    },
    {
        "code": "39954",
        "ort": "Stavenhagen"
    },
    {
        "code": "39955",
        "ort": "Jürgenstorf"
    },
    {
        "code": "39956",
        "ort": "Neukalen"
    },
    {
        "code": "39957",
        "ort": "Gielow"
    },
    {
        "code": "39959",
        "ort": "Dargun"
    },
    {
        "code": "3996",
        "ort": "Teterow"
    },
    {
        "code": "3997\n39971",
        "ort": "Gnoien\n39972"
    },
    {
        "code": "39971",
        "ort": "Gnoien"
    },
    {
        "code": "39972",
        "ort": "Walkendorf"
    },
    {
        "code": "39973",
        "ort": "Altkalen"
    },
    {
        "code": "39975",
        "ort": "Thürkow"
    },
    {
        "code": "39976",
        "ort": "Groß"
    },
    {
        "code": "39977",
        "ort": "Jördenstorf"
    },
    {
        "code": "39978",
        "ort": "Groß"
    },
    {
        "code": "3998",
        "ort": "Demmin"
    },
    {
        "code": "3999\n39991",
        "ort": "Daberkow\n39992"
    },
    {
        "code": "39991",
        "ort": "Daberkow"
    },
    {
        "code": "39992",
        "ort": "Görmin"
    },
    {
        "code": "39993",
        "ort": "Hohenmocker"
    },
    {
        "code": "39994",
        "ort": "Metschow"
    },
    {
        "code": "39995",
        "ort": "Nossendorf"
    },
    {
        "code": "39996",
        "ort": "Törpin"
    },
    {
        "code": "39997",
        "ort": "Jarmen"
    },
    {
        "code": "39998",
        "ort": "Loitz"
    },
    {
        "code": "39999",
        "ort": "Tutow"
    },
    {
        "code": "3991",
        "ort": "Waren"
    },
    {
        "code": "3992\n39921",
        "ort": "Ankershagen\n39922"
    },
    {
        "code": "39921",
        "ort": "Ankershagen"
    },
    {
        "code": "39922",
        "ort": "Dambeck"
    },
    {
        "code": "39923",
        "ort": "Priborn"
    },
    {
        "code": "39924",
        "ort": "Stuer"
    },
    {
        "code": "39925",
        "ort": "Wredenhagen"
    },
    {
        "code": "39926",
        "ort": "Grabowhöfe"
    },
    {
        "code": "39927",
        "ort": "Nossentiner"
    },
    {
        "code": "39928",
        "ort": "Möllenhagen"
    },
    {
        "code": "39929",
        "ort": "Jabel"
    },
    {
        "code": "3993\n39931",
        "ort": "Röbel/Müritz\n39932"
    },
    {
        "code": "39931",
        "ort": "Röbel/Müritz"
    },
    {
        "code": "39932",
        "ort": "Malchow"
    },
    {
        "code": "39933",
        "ort": "Vollrathsruhe"
    },
    {
        "code": "39934",
        "ort": "Klein"
    },
    {
        "code": "3994",
        "ort": "Malchin"
    },
    {
        "code": "3995\n39951",
        "ort": "Faulenrost\n39952"
    },
    {
        "code": "39951",
        "ort": "Faulenrost"
    },
    {
        "code": "39952",
        "ort": "Grammentin"
    },
    {
        "code": "39953",
        "ort": "Schwinkendorf"
    },
    {
        "code": "39954",
        "ort": "Stavenhagen"
    },
    {
        "code": "39955",
        "ort": "Jürgenstorf"
    },
    {
        "code": "39956",
        "ort": "Neukalen"
    },
    {
        "code": "39957",
        "ort": "Gielow"
    },
    {
        "code": "39959",
        "ort": "Dargun"
    },
    {
        "code": "3996",
        "ort": "Teterow"
    },
    {
        "code": "3997\n39971",
        "ort": "Gnoien\n39972"
    },
    {
        "code": "39971",
        "ort": "Gnoien"
    },
    {
        "code": "39972",
        "ort": "Walkendorf"
    },
    {
        "code": "39973",
        "ort": "Altkalen"
    },
    {
        "code": "39975",
        "ort": "Thürkow"
    },
    {
        "code": "39976",
        "ort": "Groß"
    },
    {
        "code": "39977",
        "ort": "Jördenstorf"
    },
    {
        "code": "39978",
        "ort": "Groß"
    },
    {
        "code": "3998",
        "ort": "Demmin"
    },
    {
        "code": "3999\n39991",
        "ort": "Daberkow\n39992"
    },
    {
        "code": "39991",
        "ort": "Daberkow"
    },
    {
        "code": "39992",
        "ort": "Görmin"
    },
    {
        "code": "39993",
        "ort": "Hohenmocker"
    },
    {
        "code": "39994",
        "ort": "Metschow"
    },
    {
        "code": "39995",
        "ort": "Nossendorf"
    },
    {
        "code": "39996",
        "ort": "Törpin"
    },
    {
        "code": "39997",
        "ort": "Jarmen"
    },
    {
        "code": "39998",
        "ort": "Loitz"
    },
    {
        "code": "39999",
        "ort": "Tutow"
    },
    {
        "code": "39921",
        "ort": "Ankershagen"
    },
    {
        "code": "39922",
        "ort": "Dambeck"
    },
    {
        "code": "39923",
        "ort": "Priborn"
    },
    {
        "code": "39924",
        "ort": "Stuer"
    },
    {
        "code": "39925",
        "ort": "Wredenhagen"
    },
    {
        "code": "39926",
        "ort": "Grabowhöfe"
    },
    {
        "code": "39927",
        "ort": "Nossentiner"
    },
    {
        "code": "39928",
        "ort": "Möllenhagen"
    },
    {
        "code": "39929",
        "ort": "Jabel"
    },
    {
        "code": "39931",
        "ort": "Röbel/Müritz"
    },
    {
        "code": "39932",
        "ort": "Malchow"
    },
    {
        "code": "39933",
        "ort": "Vollrathsruhe"
    },
    {
        "code": "39934",
        "ort": "Klein"
    },
    {
        "code": "39951",
        "ort": "Faulenrost"
    },
    {
        "code": "39952",
        "ort": "Grammentin"
    },
    {
        "code": "39953",
        "ort": "Schwinkendorf"
    },
    {
        "code": "39954",
        "ort": "Stavenhagen"
    },
    {
        "code": "39955",
        "ort": "Jürgenstorf"
    },
    {
        "code": "39956",
        "ort": "Neukalen"
    },
    {
        "code": "39957",
        "ort": "Gielow"
    },
    {
        "code": "39959",
        "ort": "Dargun"
    },
    {
        "code": "39971",
        "ort": "Gnoien"
    },
    {
        "code": "39972",
        "ort": "Walkendorf"
    },
    {
        "code": "39973",
        "ort": "Altkalen"
    },
    {
        "code": "39975",
        "ort": "Thürkow"
    },
    {
        "code": "39976",
        "ort": "Groß"
    },
    {
        "code": "39977",
        "ort": "Jördenstorf"
    },
    {
        "code": "39978",
        "ort": "Groß"
    },
    {
        "code": "39991",
        "ort": "Daberkow"
    },
    {
        "code": "39992",
        "ort": "Görmin"
    },
    {
        "code": "39993",
        "ort": "Hohenmocker"
    },
    {
        "code": "39994",
        "ort": "Metschow"
    },
    {
        "code": "39995",
        "ort": "Nossendorf"
    },
    {
        "code": "39996",
        "ort": "Törpin"
    },
    {
        "code": "39997",
        "ort": "Jarmen"
    },
    {
        "code": "39998",
        "ort": "Loitz"
    },
    {
        "code": "39999",
        "ort": "Tutow"
    },
    {
        "code": "40",
        "ort": "Hamburg,"
    },
    {
        "code": "4101",
        "ort": "Pinneberg\n4102"
    },
    {
        "code": "4101",
        "ort": "Pinneberg"
    },
    {
        "code": "4102",
        "ort": "Ahrensburg"
    },
    {
        "code": "4103",
        "ort": "Wedel"
    },
    {
        "code": "4104",
        "ort": "Aumühle"
    },
    {
        "code": "4105",
        "ort": "Seevetal"
    },
    {
        "code": "4106",
        "ort": "Quickborn"
    },
    {
        "code": "4107",
        "ort": "Siek"
    },
    {
        "code": "4108",
        "ort": "Rosengarten,"
    },
    {
        "code": "4109",
        "ort": "Tangstedt"
    },
    {
        "code": "4101",
        "ort": "Pinneberg"
    },
    {
        "code": "4102",
        "ort": "Ahrensburg"
    },
    {
        "code": "4103",
        "ort": "Wedel"
    },
    {
        "code": "4104",
        "ort": "Aumühle"
    },
    {
        "code": "4105",
        "ort": "Seevetal"
    },
    {
        "code": "4106",
        "ort": "Quickborn"
    },
    {
        "code": "4107",
        "ort": "Siek"
    },
    {
        "code": "4108",
        "ort": "Rosengarten,"
    },
    {
        "code": "4109",
        "ort": "Tangstedt"
    },
    {
        "code": "4120",
        "ort": "Ellerhoop\n4121"
    },
    {
        "code": "4120",
        "ort": "Ellerhoop"
    },
    {
        "code": "4121",
        "ort": "Elmshorn"
    },
    {
        "code": "4122",
        "ort": "Tornesch,"
    },
    {
        "code": "4123",
        "ort": "Barmstedt"
    },
    {
        "code": "4124",
        "ort": "Glückstadt"
    },
    {
        "code": "4125",
        "ort": "Seestermühe"
    },
    {
        "code": "4126",
        "ort": "Horst"
    },
    {
        "code": "4127",
        "ort": "Brande-Hörnerkirchen,"
    },
    {
        "code": "4128",
        "ort": "Kollmar"
    },
    {
        "code": "4129",
        "ort": "Haseldorf"
    },
    {
        "code": "4120",
        "ort": "Ellerhoop"
    },
    {
        "code": "4121",
        "ort": "Elmshorn"
    },
    {
        "code": "4122",
        "ort": "Tornesch,"
    },
    {
        "code": "4123",
        "ort": "Barmstedt"
    },
    {
        "code": "4124",
        "ort": "Glückstadt"
    },
    {
        "code": "4125",
        "ort": "Seestermühe"
    },
    {
        "code": "4126",
        "ort": "Horst"
    },
    {
        "code": "4127",
        "ort": "Brande-Hörnerkirchen,"
    },
    {
        "code": "4128",
        "ort": "Kollmar"
    },
    {
        "code": "4129",
        "ort": "Haseldorf"
    },
    {
        "code": "4131",
        "ort": "Lüneburg\n4132"
    },
    {
        "code": "4131",
        "ort": "Lüneburg"
    },
    {
        "code": "4132",
        "ort": "Amelinghausen"
    },
    {
        "code": "4133",
        "ort": "Wittorf,"
    },
    {
        "code": "4134",
        "ort": "Embsen"
    },
    {
        "code": "4135",
        "ort": "Kirchgellersen"
    },
    {
        "code": "4136",
        "ort": "Scharnebeck"
    },
    {
        "code": "4137",
        "ort": "Barendorf"
    },
    {
        "code": "4138",
        "ort": "Betzendorf"
    },
    {
        "code": "4139",
        "ort": "Hohnstorf"
    },
    {
        "code": "4131",
        "ort": "Lüneburg"
    },
    {
        "code": "4132",
        "ort": "Amelinghausen"
    },
    {
        "code": "4133",
        "ort": "Wittorf,"
    },
    {
        "code": "4134",
        "ort": "Embsen"
    },
    {
        "code": "4135",
        "ort": "Kirchgellersen"
    },
    {
        "code": "4136",
        "ort": "Scharnebeck"
    },
    {
        "code": "4137",
        "ort": "Barendorf"
    },
    {
        "code": "4138",
        "ort": "Betzendorf"
    },
    {
        "code": "4139",
        "ort": "Hohnstorf"
    },
    {
        "code": "4140",
        "ort": "Estorf\n4141"
    },
    {
        "code": "4140",
        "ort": "Estorf"
    },
    {
        "code": "4141",
        "ort": "Stade"
    },
    {
        "code": "4142",
        "ort": "Steinkirchen"
    },
    {
        "code": "4143",
        "ort": "Drochtersen"
    },
    {
        "code": "4144",
        "ort": "Himmelpforten"
    },
    {
        "code": "4146",
        "ort": "Stade-Bützfleth"
    },
    {
        "code": "4148",
        "ort": "Drochtersen-Assel"
    },
    {
        "code": "4149",
        "ort": "Fredenbeck"
    },
    {
        "code": "4140",
        "ort": "Estorf"
    },
    {
        "code": "4141",
        "ort": "Stade"
    },
    {
        "code": "4142",
        "ort": "Steinkirchen"
    },
    {
        "code": "4143",
        "ort": "Drochtersen"
    },
    {
        "code": "4144",
        "ort": "Himmelpforten"
    },
    {
        "code": "4146",
        "ort": "Stade-Bützfleth"
    },
    {
        "code": "4148",
        "ort": "Drochtersen-Assel"
    },
    {
        "code": "4149",
        "ort": "Fredenbeck"
    },
    {
        "code": "4151",
        "ort": "Schwarzenbek\n4152"
    },
    {
        "code": "4151",
        "ort": "Schwarzenbek"
    },
    {
        "code": "4152",
        "ort": "Geesthacht"
    },
    {
        "code": "4153",
        "ort": "Lauenburg"
    },
    {
        "code": "4154",
        "ort": "Trittau"
    },
    {
        "code": "4155",
        "ort": "Büchen"
    },
    {
        "code": "4156",
        "ort": "Talkau"
    },
    {
        "code": "4158",
        "ort": "Roseburg"
    },
    {
        "code": "4159",
        "ort": "Basthorst"
    },
    {
        "code": "4151",
        "ort": "Schwarzenbek"
    },
    {
        "code": "4152",
        "ort": "Geesthacht"
    },
    {
        "code": "4153",
        "ort": "Lauenburg"
    },
    {
        "code": "4154",
        "ort": "Trittau"
    },
    {
        "code": "4155",
        "ort": "Büchen"
    },
    {
        "code": "4156",
        "ort": "Talkau"
    },
    {
        "code": "4158",
        "ort": "Roseburg"
    },
    {
        "code": "4159",
        "ort": "Basthorst"
    },
    {
        "code": "4161",
        "ort": "Buxtehude\n4162"
    },
    {
        "code": "4161",
        "ort": "Buxtehude"
    },
    {
        "code": "4162",
        "ort": "Jork"
    },
    {
        "code": "4163",
        "ort": "Horneburg"
    },
    {
        "code": "4164",
        "ort": "Harsefeld"
    },
    {
        "code": "4165",
        "ort": "Hollenstedt"
    },
    {
        "code": "4166",
        "ort": "Ahlerstedt"
    },
    {
        "code": "4167",
        "ort": "Apensen"
    },
    {
        "code": "4168",
        "ort": "Neu"
    },
    {
        "code": "4169",
        "ort": "Sauensiek"
    },
    {
        "code": "4161",
        "ort": "Buxtehude"
    },
    {
        "code": "4162",
        "ort": "Jork"
    },
    {
        "code": "4163",
        "ort": "Horneburg"
    },
    {
        "code": "4164",
        "ort": "Harsefeld"
    },
    {
        "code": "4165",
        "ort": "Hollenstedt"
    },
    {
        "code": "4166",
        "ort": "Ahlerstedt"
    },
    {
        "code": "4167",
        "ort": "Apensen"
    },
    {
        "code": "4168",
        "ort": "Neu"
    },
    {
        "code": "4169",
        "ort": "Sauensiek"
    },
    {
        "code": "4171",
        "ort": "Winsen"
    },
    {
        "code": "4171",
        "ort": "Winsen"
    },
    {
        "code": "4172",
        "ort": "Salzhausen"
    },
    {
        "code": "4173",
        "ort": "Wulfsen"
    },
    {
        "code": "4174",
        "ort": "Stelle"
    },
    {
        "code": "4175",
        "ort": "Egestorf"
    },
    {
        "code": "4176",
        "ort": "Marschacht"
    },
    {
        "code": "4177",
        "ort": "Drage"
    },
    {
        "code": "4178",
        "ort": "Radbruch"
    },
    {
        "code": "4179",
        "ort": "Winsen-Tönnhausen"
    },
    {
        "code": "4171",
        "ort": "Winsen"
    },
    {
        "code": "4172",
        "ort": "Salzhausen"
    },
    {
        "code": "4173",
        "ort": "Wulfsen"
    },
    {
        "code": "4174",
        "ort": "Stelle"
    },
    {
        "code": "4175",
        "ort": "Egestorf"
    },
    {
        "code": "4176",
        "ort": "Marschacht"
    },
    {
        "code": "4177",
        "ort": "Drage"
    },
    {
        "code": "4178",
        "ort": "Radbruch"
    },
    {
        "code": "4179",
        "ort": "Winsen-Tönnhausen"
    },
    {
        "code": "4180",
        "ort": "Königsmoor\n4181"
    },
    {
        "code": "4180",
        "ort": "Königsmoor"
    },
    {
        "code": "4181",
        "ort": "Buchholz"
    },
    {
        "code": "4182",
        "ort": "Tostedt"
    },
    {
        "code": "4183",
        "ort": "Jesteburg"
    },
    {
        "code": "4184",
        "ort": "Hanstedt"
    },
    {
        "code": "4185",
        "ort": "Marxen"
    },
    {
        "code": "4186",
        "ort": "Buchholz-Trelde,"
    },
    {
        "code": "4187",
        "ort": "Holm-Seppensen"
    },
    {
        "code": "4188",
        "ort": "Welle"
    },
    {
        "code": "4189",
        "ort": "Undeloh"
    },
    {
        "code": "4180",
        "ort": "Königsmoor"
    },
    {
        "code": "4181",
        "ort": "Buchholz"
    },
    {
        "code": "4182",
        "ort": "Tostedt"
    },
    {
        "code": "4183",
        "ort": "Jesteburg"
    },
    {
        "code": "4184",
        "ort": "Hanstedt"
    },
    {
        "code": "4185",
        "ort": "Marxen"
    },
    {
        "code": "4186",
        "ort": "Buchholz-Trelde,"
    },
    {
        "code": "4187",
        "ort": "Holm-Seppensen"
    },
    {
        "code": "4188",
        "ort": "Welle"
    },
    {
        "code": "4189",
        "ort": "Undeloh"
    },
    {
        "code": "4191",
        "ort": "Kaltenkirchen\n4192"
    },
    {
        "code": "4191",
        "ort": "Kaltenkirchen"
    },
    {
        "code": "4192",
        "ort": "Bad"
    },
    {
        "code": "4193",
        "ort": "Henstedt-Ulzburg"
    },
    {
        "code": "4194",
        "ort": "Sievershütten"
    },
    {
        "code": "4195",
        "ort": "Hartenholm"
    },
    {
        "code": "4191",
        "ort": "Kaltenkirchen"
    },
    {
        "code": "4192",
        "ort": "Bad"
    },
    {
        "code": "4193",
        "ort": "Henstedt-Ulzburg"
    },
    {
        "code": "4194",
        "ort": "Sievershütten"
    },
    {
        "code": "4195",
        "ort": "Hartenholm"
    },
    {
        "code": "4202",
        "ort": "Achim\n4203"
    },
    {
        "code": "4202",
        "ort": "Achim"
    },
    {
        "code": "4203",
        "ort": "Weyhe"
    },
    {
        "code": "4204",
        "ort": "Thedinghausen"
    },
    {
        "code": "4205",
        "ort": "Ottersberg"
    },
    {
        "code": "4206",
        "ort": "Stuhr-Heiligenrode"
    },
    {
        "code": "4207",
        "ort": "Oyten"
    },
    {
        "code": "4208",
        "ort": "Grasberg"
    },
    {
        "code": "4209",
        "ort": "Schwanewede"
    },
    {
        "code": "4202",
        "ort": "Achim"
    },
    {
        "code": "4203",
        "ort": "Weyhe"
    },
    {
        "code": "4204",
        "ort": "Thedinghausen"
    },
    {
        "code": "4205",
        "ort": "Ottersberg"
    },
    {
        "code": "4206",
        "ort": "Stuhr-Heiligenrode"
    },
    {
        "code": "4207",
        "ort": "Oyten"
    },
    {
        "code": "4208",
        "ort": "Grasberg"
    },
    {
        "code": "4209",
        "ort": "Schwanewede"
    },
    {
        "code": "421",
        "ort": "Bremen"
    },
    {
        "code": "4221",
        "ort": "Delmenhorst\n4222"
    },
    {
        "code": "4221",
        "ort": "Delmenhorst"
    },
    {
        "code": "4222",
        "ort": "Ganderkesee"
    },
    {
        "code": "4223",
        "ort": "Ganderkesee-Bookholzberg"
    },
    {
        "code": "4224",
        "ort": "Groß"
    },
    {
        "code": "4221",
        "ort": "Delmenhorst"
    },
    {
        "code": "4222",
        "ort": "Ganderkesee"
    },
    {
        "code": "4223",
        "ort": "Ganderkesee-Bookholzberg"
    },
    {
        "code": "4224",
        "ort": "Groß"
    },
    {
        "code": "4230",
        "ort": "Verden"
    },
    {
        "code": "4230",
        "ort": "Verden"
    },
    {
        "code": "4231",
        "ort": "Verden"
    },
    {
        "code": "4232",
        "ort": "Langwedel"
    },
    {
        "code": "4233",
        "ort": "Blender"
    },
    {
        "code": "4234",
        "ort": "Dörverden"
    },
    {
        "code": "4235",
        "ort": "Langwedel"
    },
    {
        "code": "4236",
        "ort": "Kirchlinteln"
    },
    {
        "code": "4237",
        "ort": "Kirchlinteln-Bendingbostel"
    },
    {
        "code": "4238",
        "ort": "Kirchlinteln-Neddenaverbergen"
    },
    {
        "code": "4239",
        "ort": "Dörverden-Westen"
    },
    {
        "code": "4230",
        "ort": "Verden"
    },
    {
        "code": "4231",
        "ort": "Verden"
    },
    {
        "code": "4232",
        "ort": "Langwedel"
    },
    {
        "code": "4233",
        "ort": "Blender"
    },
    {
        "code": "4234",
        "ort": "Dörverden"
    },
    {
        "code": "4235",
        "ort": "Langwedel"
    },
    {
        "code": "4236",
        "ort": "Kirchlinteln"
    },
    {
        "code": "4237",
        "ort": "Kirchlinteln-Bendingbostel"
    },
    {
        "code": "4238",
        "ort": "Kirchlinteln-Neddenaverbergen"
    },
    {
        "code": "4239",
        "ort": "Dörverden-Westen"
    },
    {
        "code": "4241",
        "ort": "Bassum\n4242"
    },
    {
        "code": "4241",
        "ort": "Bassum"
    },
    {
        "code": "4242",
        "ort": "Syke"
    },
    {
        "code": "4243",
        "ort": "Twistringen"
    },
    {
        "code": "4244",
        "ort": "Harpstedt"
    },
    {
        "code": "4245",
        "ort": "Scholen"
    },
    {
        "code": "4246",
        "ort": "Drentwede"
    },
    {
        "code": "4247",
        "ort": "Sudwalde/Affinghausen"
    },
    {
        "code": "4249",
        "ort": "Nordwohlde"
    },
    {
        "code": "4241",
        "ort": "Bassum"
    },
    {
        "code": "4242",
        "ort": "Syke"
    },
    {
        "code": "4243",
        "ort": "Twistringen"
    },
    {
        "code": "4244",
        "ort": "Harpstedt"
    },
    {
        "code": "4245",
        "ort": "Scholen"
    },
    {
        "code": "4246",
        "ort": "Drentwede"
    },
    {
        "code": "4247",
        "ort": "Sudwalde/Affinghausen"
    },
    {
        "code": "4249",
        "ort": "Nordwohlde"
    },
    {
        "code": "4251",
        "ort": "Hoya\n4252"
    },
    {
        "code": "4251",
        "ort": "Hoya"
    },
    {
        "code": "4252",
        "ort": "Bruchhausen-Vilsen"
    },
    {
        "code": "4253",
        "ort": "Asendorf"
    },
    {
        "code": "4254",
        "ort": "Eystrup"
    },
    {
        "code": "4255",
        "ort": "Martfeld"
    },
    {
        "code": "4256",
        "ort": "Hilgermissen"
    },
    {
        "code": "4257",
        "ort": "Schweringen"
    },
    {
        "code": "4258",
        "ort": "Schwarme"
    },
    {
        "code": "4251",
        "ort": "Hoya"
    },
    {
        "code": "4252",
        "ort": "Bruchhausen-Vilsen"
    },
    {
        "code": "4253",
        "ort": "Asendorf"
    },
    {
        "code": "4254",
        "ort": "Eystrup"
    },
    {
        "code": "4255",
        "ort": "Martfeld"
    },
    {
        "code": "4256",
        "ort": "Hilgermissen"
    },
    {
        "code": "4257",
        "ort": "Schweringen"
    },
    {
        "code": "4258",
        "ort": "Schwarme"
    },
    {
        "code": "4260",
        "ort": "Visselhövede-Wittorf\n4261"
    },
    {
        "code": "4260",
        "ort": "Visselhövede-Wittorf"
    },
    {
        "code": "4261",
        "ort": "Rotenburg"
    },
    {
        "code": "4262",
        "ort": "Visselhövede"
    },
    {
        "code": "4263",
        "ort": "Scheeßel"
    },
    {
        "code": "4264",
        "ort": "Sottrum"
    },
    {
        "code": "4265",
        "ort": "Fintel"
    },
    {
        "code": "4266",
        "ort": "Brockel"
    },
    {
        "code": "4267",
        "ort": "Lauenbrück"
    },
    {
        "code": "4268",
        "ort": "Bötersen"
    },
    {
        "code": "4269",
        "ort": "Ahausen-Kirchwalsede"
    },
    {
        "code": "4260",
        "ort": "Visselhövede-Wittorf"
    },
    {
        "code": "4261",
        "ort": "Rotenburg"
    },
    {
        "code": "4262",
        "ort": "Visselhövede"
    },
    {
        "code": "4263",
        "ort": "Scheeßel"
    },
    {
        "code": "4264",
        "ort": "Sottrum"
    },
    {
        "code": "4265",
        "ort": "Fintel"
    },
    {
        "code": "4266",
        "ort": "Brockel"
    },
    {
        "code": "4267",
        "ort": "Lauenbrück"
    },
    {
        "code": "4268",
        "ort": "Bötersen"
    },
    {
        "code": "4269",
        "ort": "Ahausen-Kirchwalsede"
    },
    {
        "code": "4271",
        "ort": "Sulingen\n4272"
    },
    {
        "code": "4271",
        "ort": "Sulingen"
    },
    {
        "code": "4272",
        "ort": "Siedenburg"
    },
    {
        "code": "4273",
        "ort": "Kirchdorf"
    },
    {
        "code": "4274",
        "ort": "Varrel"
    },
    {
        "code": "4275",
        "ort": "Ehrenburg"
    },
    {
        "code": "4276",
        "ort": "Borstel"
    },
    {
        "code": "4277",
        "ort": "Schwaförden"
    },
    {
        "code": "4271",
        "ort": "Sulingen"
    },
    {
        "code": "4272",
        "ort": "Siedenburg"
    },
    {
        "code": "4273",
        "ort": "Kirchdorf"
    },
    {
        "code": "4274",
        "ort": "Varrel"
    },
    {
        "code": "4275",
        "ort": "Ehrenburg"
    },
    {
        "code": "4276",
        "ort": "Borstel"
    },
    {
        "code": "4277",
        "ort": "Schwaförden"
    },
    {
        "code": "4281",
        "ort": "Zeven\n4282"
    },
    {
        "code": "4281",
        "ort": "Zeven"
    },
    {
        "code": "4282",
        "ort": "Sittensen"
    },
    {
        "code": "4283",
        "ort": "Tarmstedt"
    },
    {
        "code": "4284",
        "ort": "Selsingen"
    },
    {
        "code": "4285",
        "ort": "Rhade"
    },
    {
        "code": "4286",
        "ort": "Gyhum"
    },
    {
        "code": "4287",
        "ort": "Heeslingen-Boitzen"
    },
    {
        "code": "4288",
        "ort": "Horstedt"
    },
    {
        "code": "4289",
        "ort": "Kirchtimke"
    },
    {
        "code": "4281",
        "ort": "Zeven"
    },
    {
        "code": "4282",
        "ort": "Sittensen"
    },
    {
        "code": "4283",
        "ort": "Tarmstedt"
    },
    {
        "code": "4284",
        "ort": "Selsingen"
    },
    {
        "code": "4285",
        "ort": "Rhade"
    },
    {
        "code": "4286",
        "ort": "Gyhum"
    },
    {
        "code": "4287",
        "ort": "Heeslingen-Boitzen"
    },
    {
        "code": "4288",
        "ort": "Horstedt"
    },
    {
        "code": "4289",
        "ort": "Kirchtimke"
    },
    {
        "code": "4292",
        "ort": "Ritterhude\n4293"
    },
    {
        "code": "4292",
        "ort": "Ritterhude"
    },
    {
        "code": "4293",
        "ort": "Ottersberg-Fischerhude"
    },
    {
        "code": "4294",
        "ort": "Riede"
    },
    {
        "code": "4295",
        "ort": "Emtinghausen"
    },
    {
        "code": "4296",
        "ort": "Schwanewede-Aschwarden"
    },
    {
        "code": "4297",
        "ort": "Ottersberg-Posthausen"
    },
    {
        "code": "4298",
        "ort": "Lilienthal"
    },
    {
        "code": "4292",
        "ort": "Ritterhude"
    },
    {
        "code": "4293",
        "ort": "Ottersberg-Fischerhude"
    },
    {
        "code": "4294",
        "ort": "Riede"
    },
    {
        "code": "4295",
        "ort": "Emtinghausen"
    },
    {
        "code": "4296",
        "ort": "Schwanewede-Aschwarden"
    },
    {
        "code": "4297",
        "ort": "Ottersberg-Posthausen"
    },
    {
        "code": "4298",
        "ort": "Lilienthal"
    },
    {
        "code": "4301",
        "ort": "(not"
    },
    {
        "code": "4301",
        "ort": "(not"
    },
    {
        "code": "4302",
        "ort": "Kirchbarkau"
    },
    {
        "code": "4303",
        "ort": "Schlesen"
    },
    {
        "code": "4304",
        "ort": "(not"
    },
    {
        "code": "4305",
        "ort": "Westensee"
    },
    {
        "code": "4306",
        "ort": "(not"
    },
    {
        "code": "4307",
        "ort": "Raisdorf"
    },
    {
        "code": "4308",
        "ort": "Schwedeneck"
    },
    {
        "code": "4309",
        "ort": "(not"
    },
    {
        "code": "4301",
        "ort": "(not"
    },
    {
        "code": "4302",
        "ort": "Kirchbarkau"
    },
    {
        "code": "4303",
        "ort": "Schlesen"
    },
    {
        "code": "4304",
        "ort": "(not"
    },
    {
        "code": "4305",
        "ort": "Westensee"
    },
    {
        "code": "4306",
        "ort": "(not"
    },
    {
        "code": "4307",
        "ort": "Raisdorf"
    },
    {
        "code": "4308",
        "ort": "Schwedeneck"
    },
    {
        "code": "4309",
        "ort": "(not"
    },
    {
        "code": "431",
        "ort": "Kiel"
    },
    {
        "code": "4320",
        "ort": "Heidmühlen\n4321"
    },
    {
        "code": "4320",
        "ort": "Heidmühlen"
    },
    {
        "code": "4321",
        "ort": "Neumünster"
    },
    {
        "code": "4322",
        "ort": "Bordesholm"
    },
    {
        "code": "4323",
        "ort": "Bornhöved"
    },
    {
        "code": "4324",
        "ort": "Brokstedt"
    },
    {
        "code": "4325",
        "ort": "(not"
    },
    {
        "code": "4326",
        "ort": "Wankendorf"
    },
    {
        "code": "4327",
        "ort": "Großenaspe"
    },
    {
        "code": "4328",
        "ort": "Rickling"
    },
    {
        "code": "4329",
        "ort": "Langwedel"
    },
    {
        "code": "4320",
        "ort": "Heidmühlen"
    },
    {
        "code": "4321",
        "ort": "Neumünster"
    },
    {
        "code": "4322",
        "ort": "Bordesholm"
    },
    {
        "code": "4323",
        "ort": "Bornhöved"
    },
    {
        "code": "4324",
        "ort": "Brokstedt"
    },
    {
        "code": "4325",
        "ort": "(not"
    },
    {
        "code": "4326",
        "ort": "Wankendorf"
    },
    {
        "code": "4327",
        "ort": "Großenaspe"
    },
    {
        "code": "4328",
        "ort": "Rickling"
    },
    {
        "code": "4329",
        "ort": "Langwedel"
    },
    {
        "code": "4330",
        "ort": "Emkendorf\n4331"
    },
    {
        "code": "4330",
        "ort": "Emkendorf"
    },
    {
        "code": "4331",
        "ort": "Rendsburg"
    },
    {
        "code": "4332",
        "ort": "Hamdorf"
    },
    {
        "code": "4333",
        "ort": "Erfde"
    },
    {
        "code": "4334",
        "ort": "Bredenbek"
    },
    {
        "code": "4335",
        "ort": "Hohn"
    },
    {
        "code": "4336",
        "ort": "Owschlag"
    },
    {
        "code": "4337",
        "ort": "Jevenstedt"
    },
    {
        "code": "4338",
        "ort": "Alt"
    },
    {
        "code": "4339",
        "ort": "Christiansholm"
    },
    {
        "code": "4330",
        "ort": "Emkendorf"
    },
    {
        "code": "4331",
        "ort": "Rendsburg"
    },
    {
        "code": "4332",
        "ort": "Hamdorf"
    },
    {
        "code": "4333",
        "ort": "Erfde"
    },
    {
        "code": "4334",
        "ort": "Bredenbek"
    },
    {
        "code": "4335",
        "ort": "Hohn"
    },
    {
        "code": "4336",
        "ort": "Owschlag"
    },
    {
        "code": "4337",
        "ort": "Jevenstedt"
    },
    {
        "code": "4338",
        "ort": "Alt"
    },
    {
        "code": "4339",
        "ort": "Christiansholm"
    },
    {
        "code": "4340",
        "ort": "Achterwehr\n4341"
    },
    {
        "code": "4340",
        "ort": "Achterwehr"
    },
    {
        "code": "4341",
        "ort": "(not"
    },
    {
        "code": "4342",
        "ort": "Kühren,"
    },
    {
        "code": "4343",
        "ort": "Laboe"
    },
    {
        "code": "4344",
        "ort": "Schönberg"
    },
    {
        "code": "4345",
        "ort": "(not"
    },
    {
        "code": "4346",
        "ort": "Gettorf"
    },
    {
        "code": "4347",
        "ort": "Flintbek"
    },
    {
        "code": "4348",
        "ort": "Schönkirchen"
    },
    {
        "code": "4349",
        "ort": "Dänischenhagen"
    },
    {
        "code": "4340",
        "ort": "Achterwehr"
    },
    {
        "code": "4341",
        "ort": "(not"
    },
    {
        "code": "4342",
        "ort": "Kühren,"
    },
    {
        "code": "4343",
        "ort": "Laboe"
    },
    {
        "code": "4344",
        "ort": "Schönberg"
    },
    {
        "code": "4345",
        "ort": "(not"
    },
    {
        "code": "4346",
        "ort": "Gettorf"
    },
    {
        "code": "4347",
        "ort": "Flintbek"
    },
    {
        "code": "4348",
        "ort": "Schönkirchen"
    },
    {
        "code": "4349",
        "ort": "Dänischenhagen"
    },
    {
        "code": "4350",
        "ort": "(not"
    },
    {
        "code": "4350",
        "ort": "(not"
    },
    {
        "code": "4351",
        "ort": "Eckernförde"
    },
    {
        "code": "4352",
        "ort": "Damp"
    },
    {
        "code": "4353",
        "ort": "Ascheffel"
    },
    {
        "code": "4354",
        "ort": "Fleckeby"
    },
    {
        "code": "4355",
        "ort": "Rieseby"
    },
    {
        "code": "4356",
        "ort": "Groß"
    },
    {
        "code": "4357",
        "ort": "Sehestedt"
    },
    {
        "code": "4358",
        "ort": "Loose"
    },
    {
        "code": "4359",
        "ort": "(not"
    },
    {
        "code": "4350",
        "ort": "(not"
    },
    {
        "code": "4351",
        "ort": "Eckernförde"
    },
    {
        "code": "4352",
        "ort": "Damp"
    },
    {
        "code": "4353",
        "ort": "Ascheffel"
    },
    {
        "code": "4354",
        "ort": "Fleckeby"
    },
    {
        "code": "4355",
        "ort": "Rieseby"
    },
    {
        "code": "4356",
        "ort": "Groß"
    },
    {
        "code": "4357",
        "ort": "Sehestedt"
    },
    {
        "code": "4358",
        "ort": "Loose"
    },
    {
        "code": "4359",
        "ort": "(not"
    },
    {
        "code": "4360",
        "ort": "(not"
    },
    {
        "code": "4360",
        "ort": "(not"
    },
    {
        "code": "4361",
        "ort": "Oldenburg"
    },
    {
        "code": "4362",
        "ort": "Heiligenhafen"
    },
    {
        "code": "4363",
        "ort": "Lensahn"
    },
    {
        "code": "4364",
        "ort": "Dahme"
    },
    {
        "code": "4365",
        "ort": "Heringsdorf"
    },
    {
        "code": "4366",
        "ort": "Grömitz-Cismar"
    },
    {
        "code": "4367",
        "ort": "Großenbrode"
    },
    {
        "code": "4368",
        "ort": "(not"
    },
    {
        "code": "4368",
        "ort": "(not"
    },
    {
        "code": "4360",
        "ort": "(not"
    },
    {
        "code": "4361",
        "ort": "Oldenburg"
    },
    {
        "code": "4362",
        "ort": "Heiligenhafen"
    },
    {
        "code": "4363",
        "ort": "Lensahn"
    },
    {
        "code": "4364",
        "ort": "Dahme"
    },
    {
        "code": "4365",
        "ort": "Heringsdorf"
    },
    {
        "code": "4366",
        "ort": "Grömitz-Cismar"
    },
    {
        "code": "4367",
        "ort": "Großenbrode"
    },
    {
        "code": "4368",
        "ort": "(not"
    },
    {
        "code": "4368",
        "ort": "(not"
    },
    {
        "code": "4370",
        "ort": "(not"
    },
    {
        "code": "4370",
        "ort": "(not"
    },
    {
        "code": "4371",
        "ort": "Burg"
    },
    {
        "code": "4372",
        "ort": "Fehmarn"
    },
    {
        "code": "4373",
        "ort": "(not"
    },
    {
        "code": "4374",
        "ort": "(not"
    },
    {
        "code": "4375",
        "ort": "(not"
    },
    {
        "code": "4376",
        "ort": "(not"
    },
    {
        "code": "4377",
        "ort": "(not"
    },
    {
        "code": "4378",
        "ort": "(not"
    },
    {
        "code": "4379",
        "ort": "(not"
    },
    {
        "code": "4370",
        "ort": "(not"
    },
    {
        "code": "4371",
        "ort": "Burg"
    },
    {
        "code": "4372",
        "ort": "Fehmarn"
    },
    {
        "code": "4373",
        "ort": "(not"
    },
    {
        "code": "4374",
        "ort": "(not"
    },
    {
        "code": "4375",
        "ort": "(not"
    },
    {
        "code": "4376",
        "ort": "(not"
    },
    {
        "code": "4377",
        "ort": "(not"
    },
    {
        "code": "4378",
        "ort": "(not"
    },
    {
        "code": "4379",
        "ort": "(not"
    },
    {
        "code": "4380",
        "ort": "(not"
    },
    {
        "code": "4380",
        "ort": "(not"
    },
    {
        "code": "4381",
        "ort": "Lütjenburg"
    },
    {
        "code": "4382",
        "ort": "Wangels"
    },
    {
        "code": "4383",
        "ort": "Grebin"
    },
    {
        "code": "4384",
        "ort": "Selent"
    },
    {
        "code": "4385",
        "ort": "Hohenfelde"
    },
    {
        "code": "4386",
        "ort": "(not"
    },
    {
        "code": "4387",
        "ort": "(not"
    },
    {
        "code": "4388",
        "ort": "(not"
    },
    {
        "code": "4389",
        "ort": "(not"
    },
    {
        "code": "4380",
        "ort": "(not"
    },
    {
        "code": "4381",
        "ort": "Lütjenburg"
    },
    {
        "code": "4382",
        "ort": "Wangels"
    },
    {
        "code": "4383",
        "ort": "Grebin"
    },
    {
        "code": "4384",
        "ort": "Selent"
    },
    {
        "code": "4385",
        "ort": "Hohenfelde"
    },
    {
        "code": "4386",
        "ort": "(not"
    },
    {
        "code": "4387",
        "ort": "(not"
    },
    {
        "code": "4388",
        "ort": "(not"
    },
    {
        "code": "4389",
        "ort": "(not"
    },
    {
        "code": "4390",
        "ort": "(not"
    },
    {
        "code": "4390",
        "ort": "(not"
    },
    {
        "code": "4391",
        "ort": "(not"
    },
    {
        "code": "4392",
        "ort": "Nortorf"
    },
    {
        "code": "4393",
        "ort": "Boostedt"
    },
    {
        "code": "4394",
        "ort": "Bokhorst"
    },
    {
        "code": "4395",
        "ort": "(not"
    },
    {
        "code": "4396",
        "ort": "(not"
    },
    {
        "code": "4397",
        "ort": "(not"
    },
    {
        "code": "4398",
        "ort": "(not"
    },
    {
        "code": "4399",
        "ort": "(not"
    },
    {
        "code": "4390",
        "ort": "(not"
    },
    {
        "code": "4391",
        "ort": "(not"
    },
    {
        "code": "4392",
        "ort": "Nortorf"
    },
    {
        "code": "4393",
        "ort": "Boostedt"
    },
    {
        "code": "4394",
        "ort": "Bokhorst"
    },
    {
        "code": "4395",
        "ort": "(not"
    },
    {
        "code": "4396",
        "ort": "(not"
    },
    {
        "code": "4397",
        "ort": "(not"
    },
    {
        "code": "4398",
        "ort": "(not"
    },
    {
        "code": "4399",
        "ort": "(not"
    },
    {
        "code": "4401",
        "ort": "Brake/Unterweser\n4402"
    },
    {
        "code": "4401",
        "ort": "Brake/Unterweser"
    },
    {
        "code": "4402",
        "ort": "Rastede/Wiefelstede"
    },
    {
        "code": "4404",
        "ort": "Elsfleth"
    },
    {
        "code": "4405",
        "ort": "Edewecht"
    },
    {
        "code": "4406",
        "ort": "Berne"
    },
    {
        "code": "4407",
        "ort": "Wardenburg"
    },
    {
        "code": "4408",
        "ort": "Hude"
    },
    {
        "code": "4401",
        "ort": "Brake/Unterweser"
    },
    {
        "code": "4402",
        "ort": "Rastede/Wiefelstede"
    },
    {
        "code": "4404",
        "ort": "Elsfleth"
    },
    {
        "code": "4405",
        "ort": "Edewecht"
    },
    {
        "code": "4406",
        "ort": "Berne"
    },
    {
        "code": "4407",
        "ort": "Wardenburg"
    },
    {
        "code": "4408",
        "ort": "Hude"
    },
    {
        "code": "441",
        "ort": "Oldenburg"
    },
    {
        "code": "4421",
        "ort": "Wilhelmshaven\n4422"
    },
    {
        "code": "4421",
        "ort": "Wilhelmshaven"
    },
    {
        "code": "4422",
        "ort": "Sande"
    },
    {
        "code": "4423",
        "ort": "Fedderwarden"
    },
    {
        "code": "4425",
        "ort": "Wangerland-Hooksiel"
    },
    {
        "code": "4426",
        "ort": "Wangerland-Horumersiel"
    },
    {
        "code": "4421",
        "ort": "Wilhelmshaven"
    },
    {
        "code": "4422",
        "ort": "Sande"
    },
    {
        "code": "4423",
        "ort": "Fedderwarden"
    },
    {
        "code": "4425",
        "ort": "Wangerland-Hooksiel"
    },
    {
        "code": "4426",
        "ort": "Wangerland-Horumersiel"
    },
    {
        "code": "4431",
        "ort": "Wildeshausen\n4432"
    },
    {
        "code": "4431",
        "ort": "Wildeshausen"
    },
    {
        "code": "4432",
        "ort": "Doetlingen-Brettorf"
    },
    {
        "code": "4433",
        "ort": "Doetlingen"
    },
    {
        "code": "4434",
        "ort": "Colnrade"
    },
    {
        "code": "4435",
        "ort": "Großenkneten"
    },
    {
        "code": "4431",
        "ort": "Wildeshausen"
    },
    {
        "code": "4432",
        "ort": "Doetlingen-Brettorf"
    },
    {
        "code": "4433",
        "ort": "Doetlingen"
    },
    {
        "code": "4434",
        "ort": "Colnrade"
    },
    {
        "code": "4435",
        "ort": "Großenkneten"
    },
    {
        "code": "4441",
        "ort": "Vechta\n4442"
    },
    {
        "code": "4441",
        "ort": "Vechta"
    },
    {
        "code": "4442",
        "ort": "Lohne"
    },
    {
        "code": "4443",
        "ort": "Dinklage"
    },
    {
        "code": "4444",
        "ort": "Goldenstedt"
    },
    {
        "code": "4445",
        "ort": "Visbek"
    },
    {
        "code": "4446",
        "ort": "Bakum"
    },
    {
        "code": "4447",
        "ort": "Vechta-Langförden"
    },
    {
        "code": "4441",
        "ort": "Vechta"
    },
    {
        "code": "4442",
        "ort": "Lohne"
    },
    {
        "code": "4443",
        "ort": "Dinklage"
    },
    {
        "code": "4444",
        "ort": "Goldenstedt"
    },
    {
        "code": "4445",
        "ort": "Visbek"
    },
    {
        "code": "4446",
        "ort": "Bakum"
    },
    {
        "code": "4447",
        "ort": "Vechta-Langförden"
    },
    {
        "code": "4451",
        "ort": "Varel"
    },
    {
        "code": "4451",
        "ort": "Varel"
    },
    {
        "code": "4452",
        "ort": "Zetel-Neuenburg"
    },
    {
        "code": "4453",
        "ort": "Zetel"
    },
    {
        "code": "4454",
        "ort": "Jade"
    },
    {
        "code": "4455",
        "ort": "Jade-Schweiburg"
    },
    {
        "code": "4456",
        "ort": "Varel-Altjührden"
    },
    {
        "code": "4458",
        "ort": "Wiefelstede-Spohle"
    },
    {
        "code": "4451",
        "ort": "Varel"
    },
    {
        "code": "4452",
        "ort": "Zetel-Neuenburg"
    },
    {
        "code": "4453",
        "ort": "Zetel"
    },
    {
        "code": "4454",
        "ort": "Jade"
    },
    {
        "code": "4455",
        "ort": "Jade-Schweiburg"
    },
    {
        "code": "4456",
        "ort": "Varel-Altjührden"
    },
    {
        "code": "4458",
        "ort": "Wiefelstede-Spohle"
    },
    {
        "code": "4461",
        "ort": "Jever\n4462"
    },
    {
        "code": "4461",
        "ort": "Jever"
    },
    {
        "code": "4462",
        "ort": "Wittmund"
    },
    {
        "code": "4463",
        "ort": "Wangerland"
    },
    {
        "code": "4464",
        "ort": "Wittmund-Carolinensiel"
    },
    {
        "code": "4465",
        "ort": "Friedeburg"
    },
    {
        "code": "4466",
        "ort": "Wittmund-Ardorf"
    },
    {
        "code": "4467",
        "ort": "Wittmund-Funnix"
    },
    {
        "code": "4468",
        "ort": "Friedeburg-Reepsholt"
    },
    {
        "code": "4469",
        "ort": "Wangerooge"
    },
    {
        "code": "4461",
        "ort": "Jever"
    },
    {
        "code": "4462",
        "ort": "Wittmund"
    },
    {
        "code": "4463",
        "ort": "Wangerland"
    },
    {
        "code": "4464",
        "ort": "Wittmund-Carolinensiel"
    },
    {
        "code": "4465",
        "ort": "Friedeburg"
    },
    {
        "code": "4466",
        "ort": "Wittmund-Ardorf"
    },
    {
        "code": "4467",
        "ort": "Wittmund-Funnix"
    },
    {
        "code": "4468",
        "ort": "Friedeburg-Reepsholt"
    },
    {
        "code": "4469",
        "ort": "Wangerooge"
    },
    {
        "code": "4471",
        "ort": "Cloppenburg\n4472"
    },
    {
        "code": "4471",
        "ort": "Cloppenburg"
    },
    {
        "code": "4472",
        "ort": "Lastrup"
    },
    {
        "code": "4473",
        "ort": "Emstek"
    },
    {
        "code": "4474",
        "ort": "Garrel"
    },
    {
        "code": "4475",
        "ort": "Molbergen"
    },
    {
        "code": "4477",
        "ort": "Lastrup-Hemmelte"
    },
    {
        "code": "4478",
        "ort": "Cappeln"
    },
    {
        "code": "4479",
        "ort": "Molbergen-Peheim"
    },
    {
        "code": "4480",
        "ort": "Ovelgoenne-Strückhausen"
    },
    {
        "code": "4471",
        "ort": "Cloppenburg"
    },
    {
        "code": "4472",
        "ort": "Lastrup"
    },
    {
        "code": "4473",
        "ort": "Emstek"
    },
    {
        "code": "4474",
        "ort": "Garrel"
    },
    {
        "code": "4475",
        "ort": "Molbergen"
    },
    {
        "code": "4477",
        "ort": "Lastrup-Hemmelte"
    },
    {
        "code": "4478",
        "ort": "Cappeln"
    },
    {
        "code": "4479",
        "ort": "Molbergen-Peheim"
    },
    {
        "code": "4480",
        "ort": "Ovelgoenne-Strückhausen"
    },
    {
        "code": "4481",
        "ort": "Hatten-Sandkrug\n4482"
    },
    {
        "code": "4481",
        "ort": "Hatten-Sandkrug"
    },
    {
        "code": "4482",
        "ort": "Hatten"
    },
    {
        "code": "4483",
        "ort": "Ovelgoenne-Grossenmeer"
    },
    {
        "code": "4484",
        "ort": "Hude-Wüsting"
    },
    {
        "code": "4485",
        "ort": "Elsfleth-Huntorf"
    },
    {
        "code": "4486",
        "ort": "Edewecht-Friedrichsfehn"
    },
    {
        "code": "4487",
        "ort": "Grossenkneten-Huntlosen"
    },
    {
        "code": "4488",
        "ort": "Westerstede"
    },
    {
        "code": "4489",
        "ort": "Apen"
    },
    {
        "code": "4481",
        "ort": "Hatten-Sandkrug"
    },
    {
        "code": "4482",
        "ort": "Hatten"
    },
    {
        "code": "4483",
        "ort": "Ovelgoenne-Grossenmeer"
    },
    {
        "code": "4484",
        "ort": "Hude-Wüsting"
    },
    {
        "code": "4485",
        "ort": "Elsfleth-Huntorf"
    },
    {
        "code": "4486",
        "ort": "Edewecht-Friedrichsfehn"
    },
    {
        "code": "4487",
        "ort": "Grossenkneten-Huntlosen"
    },
    {
        "code": "4488",
        "ort": "Westerstede"
    },
    {
        "code": "4489",
        "ort": "Apen"
    },
    {
        "code": "4491",
        "ort": "Friesoythe\n4492"
    },
    {
        "code": "4491",
        "ort": "Friesoythe"
    },
    {
        "code": "4492",
        "ort": "Saterland"
    },
    {
        "code": "4493",
        "ort": "Friesoythe-Gehlenberg"
    },
    {
        "code": "4494",
        "ort": "Bösel"
    },
    {
        "code": "4495",
        "ort": "Friesoythe-Thuele"
    },
    {
        "code": "4496",
        "ort": "Friesoythe-Markhausen"
    },
    {
        "code": "4497",
        "ort": "Barßel-Harkebrügge"
    },
    {
        "code": "4498",
        "ort": "Saterland-Ramsloh"
    },
    {
        "code": "4499",
        "ort": "Barßel"
    },
    {
        "code": "4491",
        "ort": "Friesoythe"
    },
    {
        "code": "4492",
        "ort": "Saterland"
    },
    {
        "code": "4493",
        "ort": "Friesoythe-Gehlenberg"
    },
    {
        "code": "4494",
        "ort": "Bösel"
    },
    {
        "code": "4495",
        "ort": "Friesoythe-Thuele"
    },
    {
        "code": "4496",
        "ort": "Friesoythe-Markhausen"
    },
    {
        "code": "4497",
        "ort": "Barßel-Harkebrügge"
    },
    {
        "code": "4498",
        "ort": "Saterland-Ramsloh"
    },
    {
        "code": "4499",
        "ort": "Barßel"
    },
    {
        "code": "4501",
        "ort": "Kastorf\n4502"
    },
    {
        "code": "4501",
        "ort": "Kastorf"
    },
    {
        "code": "4502",
        "ort": "Lübeck-Travemünde"
    },
    {
        "code": "4503",
        "ort": "Timmendorfer"
    },
    {
        "code": "4504",
        "ort": "Ratekau"
    },
    {
        "code": "4505",
        "ort": "Stockelsdorf-Curau"
    },
    {
        "code": "4506",
        "ort": "Heilshoop"
    },
    {
        "code": "4507",
        "ort": "not"
    },
    {
        "code": "4508",
        "ort": "Krummesse"
    },
    {
        "code": "4509",
        "ort": "Groß"
    },
    {
        "code": "4501",
        "ort": "Kastorf"
    },
    {
        "code": "4502",
        "ort": "Lübeck-Travemünde"
    },
    {
        "code": "4503",
        "ort": "Timmendorfer"
    },
    {
        "code": "4504",
        "ort": "Ratekau"
    },
    {
        "code": "4505",
        "ort": "Stockelsdorf-Curau"
    },
    {
        "code": "4506",
        "ort": "Heilshoop"
    },
    {
        "code": "4507",
        "ort": "not"
    },
    {
        "code": "4508",
        "ort": "Krummesse"
    },
    {
        "code": "4509",
        "ort": "Groß"
    },
    {
        "code": "451",
        "ort": "1 –"
    },
    {
        "code": "451",
        "ort": "1 –"
    },
    {
        "code": "451",
        "ort": "2 –"
    },
    {
        "code": "451",
        "ort": "3 –"
    },
    {
        "code": "451",
        "ort": "4 –"
    },
    {
        "code": "451",
        "ort": "5 –"
    },
    {
        "code": "451",
        "ort": "6 –"
    },
    {
        "code": "451",
        "ort": "7 –"
    },
    {
        "code": "451",
        "ort": "8 –"
    },
    {
        "code": "451",
        "ort": "1 –"
    },
    {
        "code": "451",
        "ort": "2 –"
    },
    {
        "code": "451",
        "ort": "3 –"
    },
    {
        "code": "451",
        "ort": "4 –"
    },
    {
        "code": "451",
        "ort": "5 –"
    },
    {
        "code": "451",
        "ort": "6 –"
    },
    {
        "code": "451",
        "ort": "7 –"
    },
    {
        "code": "451",
        "ort": "8 –"
    },
    {
        "code": "4521",
        "ort": "Eutin\n4522"
    },
    {
        "code": "4521",
        "ort": "Eutin"
    },
    {
        "code": "4522",
        "ort": "Plön"
    },
    {
        "code": "4523",
        "ort": "Bad"
    },
    {
        "code": "4524",
        "ort": "Süsel"
    },
    {
        "code": "4525",
        "ort": "Ahrensbök"
    },
    {
        "code": "4526",
        "ort": "Ascheberg"
    },
    {
        "code": "4527",
        "ort": "Bosau"
    },
    {
        "code": "4528",
        "ort": "Schönwalde"
    },
    {
        "code": "4529",
        "ort": "not"
    },
    {
        "code": "4521",
        "ort": "Eutin"
    },
    {
        "code": "4522",
        "ort": "Plön"
    },
    {
        "code": "4523",
        "ort": "Bad"
    },
    {
        "code": "4524",
        "ort": "Süsel"
    },
    {
        "code": "4525",
        "ort": "Ahrensbök"
    },
    {
        "code": "4526",
        "ort": "Ascheberg"
    },
    {
        "code": "4527",
        "ort": "Bosau"
    },
    {
        "code": "4528",
        "ort": "Schönwalde"
    },
    {
        "code": "4529",
        "ort": "not"
    },
    {
        "code": "4531",
        "ort": "Bad"
    },
    {
        "code": "4531",
        "ort": "Bad"
    },
    {
        "code": "4532",
        "ort": "Bargteheide"
    },
    {
        "code": "4533",
        "ort": "Reinfeld"
    },
    {
        "code": "4534",
        "ort": "Schönberg,"
    },
    {
        "code": "4535",
        "ort": "Kayhude"
    },
    {
        "code": "4536",
        "ort": "Sandesneben"
    },
    {
        "code": "4537",
        "ort": "Grabau"
    },
    {
        "code": "4538",
        "ort": "not"
    },
    {
        "code": "4539",
        "ort": "Rethwisch"
    },
    {
        "code": "4531",
        "ort": "Bad"
    },
    {
        "code": "4532",
        "ort": "Bargteheide"
    },
    {
        "code": "4533",
        "ort": "Reinfeld"
    },
    {
        "code": "4534",
        "ort": "Schönberg,"
    },
    {
        "code": "4535",
        "ort": "Kayhude"
    },
    {
        "code": "4536",
        "ort": "Sandesneben"
    },
    {
        "code": "4537",
        "ort": "Grabau"
    },
    {
        "code": "4538",
        "ort": "not"
    },
    {
        "code": "4539",
        "ort": "Rethwisch"
    },
    {
        "code": "4541",
        "ort": "Ratzeburg\n4542"
    },
    {
        "code": "4541",
        "ort": "Ratzeburg"
    },
    {
        "code": "4542",
        "ort": "Mölln"
    },
    {
        "code": "4543",
        "ort": "Nusse"
    },
    {
        "code": "4544",
        "ort": "Berkenthin"
    },
    {
        "code": "4545",
        "ort": "Salem"
    },
    {
        "code": "4546",
        "ort": "Mustin"
    },
    {
        "code": "4547",
        "ort": "Gudow"
    },
    {
        "code": "4548",
        "ort": "not"
    },
    {
        "code": "4549",
        "ort": "not"
    },
    {
        "code": "4541",
        "ort": "Ratzeburg"
    },
    {
        "code": "4542",
        "ort": "Mölln"
    },
    {
        "code": "4543",
        "ort": "Nusse"
    },
    {
        "code": "4544",
        "ort": "Berkenthin"
    },
    {
        "code": "4545",
        "ort": "Salem"
    },
    {
        "code": "4546",
        "ort": "Mustin"
    },
    {
        "code": "4547",
        "ort": "Gudow"
    },
    {
        "code": "4548",
        "ort": "not"
    },
    {
        "code": "4549",
        "ort": "not"
    },
    {
        "code": "4551",
        "ort": "Bad"
    },
    {
        "code": "4551",
        "ort": "Bad"
    },
    {
        "code": "4552",
        "ort": "Bebensee"
    },
    {
        "code": "4553",
        "ort": "Geschendorf"
    },
    {
        "code": "4554",
        "ort": "Wahlstedt"
    },
    {
        "code": "4555",
        "ort": "Seedorf"
    },
    {
        "code": "4556",
        "ort": "Travenhorst"
    },
    {
        "code": "4557",
        "ort": "Tensfeld"
    },
    {
        "code": "4558",
        "ort": "Fredesdorf"
    },
    {
        "code": "4559",
        "ort": "Wensin"
    },
    {
        "code": "4551",
        "ort": "Bad"
    },
    {
        "code": "4552",
        "ort": "Bebensee"
    },
    {
        "code": "4553",
        "ort": "Geschendorf"
    },
    {
        "code": "4554",
        "ort": "Wahlstedt"
    },
    {
        "code": "4555",
        "ort": "Seedorf"
    },
    {
        "code": "4556",
        "ort": "Travenhorst"
    },
    {
        "code": "4557",
        "ort": "Tensfeld"
    },
    {
        "code": "4558",
        "ort": "Fredesdorf"
    },
    {
        "code": "4559",
        "ort": "Wensin"
    },
    {
        "code": "4561",
        "ort": "Neustadt"
    },
    {
        "code": "4561",
        "ort": "Neustadt"
    },
    {
        "code": "4562",
        "ort": "Grömitz"
    },
    {
        "code": "4563",
        "ort": "Sierksdorf"
    },
    {
        "code": "4564",
        "ort": "Schashagen"
    },
    {
        "code": "4565",
        "ort": "not"
    },
    {
        "code": "4566",
        "ort": "not"
    },
    {
        "code": "4567",
        "ort": "not"
    },
    {
        "code": "4568",
        "ort": "not"
    },
    {
        "code": "4569",
        "ort": "not"
    },
    {
        "code": "457"
    },
    {
        "code": "4561",
        "ort": "Neustadt"
    },
    {
        "code": "4562",
        "ort": "Grömitz"
    },
    {
        "code": "4563",
        "ort": "Sierksdorf"
    },
    {
        "code": "4564",
        "ort": "Schashagen"
    },
    {
        "code": "4565",
        "ort": "not"
    },
    {
        "code": "4566",
        "ort": "not"
    },
    {
        "code": "4567",
        "ort": "not"
    },
    {
        "code": "4568",
        "ort": "not"
    },
    {
        "code": "4569",
        "ort": "not"
    },
    {
        "code": "458"
    },
    {
        "code": "459"
    },
    {
        "code": "460\n4602",
        "ort": "Freienwill\n4603"
    },
    {
        "code": "4602",
        "ort": "Freienwill"
    },
    {
        "code": "4603",
        "ort": "Havetoft"
    },
    {
        "code": "4604",
        "ort": "Grossenwiehe"
    },
    {
        "code": "4605",
        "ort": "Medelby"
    },
    {
        "code": "4606",
        "ort": "Wanderup"
    },
    {
        "code": "4607",
        "ort": "Janneby"
    },
    {
        "code": "4608",
        "ort": "Handewitt"
    },
    {
        "code": "4609",
        "ort": "Eggebek"
    },
    {
        "code": "461",
        "ort": "Flensburg"
    },
    {
        "code": "4602",
        "ort": "Freienwill"
    },
    {
        "code": "4603",
        "ort": "Havetoft"
    },
    {
        "code": "4604",
        "ort": "Grossenwiehe"
    },
    {
        "code": "4605",
        "ort": "Medelby"
    },
    {
        "code": "4606",
        "ort": "Wanderup"
    },
    {
        "code": "4607",
        "ort": "Janneby"
    },
    {
        "code": "4608",
        "ort": "Handewitt"
    },
    {
        "code": "4609",
        "ort": "Eggebek"
    },
    {
        "code": "4621",
        "ort": "Schleswig\n4622"
    },
    {
        "code": "4621",
        "ort": "Schleswig"
    },
    {
        "code": "4622",
        "ort": "Taarstedt"
    },
    {
        "code": "4623",
        "ort": "Böklund"
    },
    {
        "code": "4624",
        "ort": "Kropp"
    },
    {
        "code": "4625",
        "ort": "Jübek"
    },
    {
        "code": "4626",
        "ort": "Treia"
    },
    {
        "code": "4627",
        "ort": "Dörpstedt"
    },
    {
        "code": "4621",
        "ort": "Schleswig"
    },
    {
        "code": "4622",
        "ort": "Taarstedt"
    },
    {
        "code": "4623",
        "ort": "Böklund"
    },
    {
        "code": "4624",
        "ort": "Kropp"
    },
    {
        "code": "4625",
        "ort": "Jübek"
    },
    {
        "code": "4626",
        "ort": "Treia"
    },
    {
        "code": "4627",
        "ort": "Dörpstedt"
    },
    {
        "code": "4630",
        "ort": "Barderup\n4631"
    },
    {
        "code": "4630",
        "ort": "Barderup"
    },
    {
        "code": "4631",
        "ort": "Glücksburg"
    },
    {
        "code": "4632",
        "ort": "Steinbergkirche"
    },
    {
        "code": "4633",
        "ort": "Satrup"
    },
    {
        "code": "4634",
        "ort": "Husby"
    },
    {
        "code": "4635",
        "ort": "Sörup"
    },
    {
        "code": "4636",
        "ort": "Langballig"
    },
    {
        "code": "4637",
        "ort": "Sterup"
    },
    {
        "code": "4638",
        "ort": "Tarp"
    },
    {
        "code": "4639",
        "ort": "Schafflund"
    },
    {
        "code": "4630",
        "ort": "Barderup"
    },
    {
        "code": "4631",
        "ort": "Glücksburg"
    },
    {
        "code": "4632",
        "ort": "Steinbergkirche"
    },
    {
        "code": "4633",
        "ort": "Satrup"
    },
    {
        "code": "4634",
        "ort": "Husby"
    },
    {
        "code": "4635",
        "ort": "Sörup"
    },
    {
        "code": "4636",
        "ort": "Langballig"
    },
    {
        "code": "4637",
        "ort": "Sterup"
    },
    {
        "code": "4638",
        "ort": "Tarp"
    },
    {
        "code": "4639",
        "ort": "Schafflund"
    },
    {
        "code": "4641",
        "ort": "Süderbrarup\n4642"
    },
    {
        "code": "4641",
        "ort": "Süderbrarup"
    },
    {
        "code": "4642",
        "ort": "Kappeln"
    },
    {
        "code": "4643",
        "ort": "Gelting"
    },
    {
        "code": "4644",
        "ort": "Karby"
    },
    {
        "code": "4646",
        "ort": "Mohrkirch"
    },
    {
        "code": "4641",
        "ort": "Süderbrarup"
    },
    {
        "code": "4642",
        "ort": "Kappeln"
    },
    {
        "code": "4643",
        "ort": "Gelting"
    },
    {
        "code": "4644",
        "ort": "Karby"
    },
    {
        "code": "4646",
        "ort": "Mohrkirch"
    },
    {
        "code": "4651",
        "ort": "Sylt"
    },
    {
        "code": "4651",
        "ort": "Sylt"
    },
    {
        "code": "4651",
        "ort": "Sylt"
    },
    {
        "code": "4661",
        "ort": "Niebüll\n4662"
    },
    {
        "code": "4661",
        "ort": "Niebüll"
    },
    {
        "code": "4662",
        "ort": "Leck"
    },
    {
        "code": "4663",
        "ort": "Süderlügum"
    },
    {
        "code": "4664",
        "ort": "Neukirchen"
    },
    {
        "code": "4665",
        "ort": "Emmelsbüll-Horsbüll"
    },
    {
        "code": "4666",
        "ort": "Ladelund"
    },
    {
        "code": "4667",
        "ort": "Dagebüll"
    },
    {
        "code": "4668",
        "ort": "Klanxbüll"
    },
    {
        "code": "4661",
        "ort": "Niebüll"
    },
    {
        "code": "4662",
        "ort": "Leck"
    },
    {
        "code": "4663",
        "ort": "Süderlügum"
    },
    {
        "code": "4664",
        "ort": "Neukirchen"
    },
    {
        "code": "4665",
        "ort": "Emmelsbüll-Horsbüll"
    },
    {
        "code": "4666",
        "ort": "Ladelund"
    },
    {
        "code": "4667",
        "ort": "Dagebüll"
    },
    {
        "code": "4668",
        "ort": "Klanxbüll"
    },
    {
        "code": "4671",
        "ort": "Bredstedt\n4672"
    },
    {
        "code": "4671",
        "ort": "Bredstedt"
    },
    {
        "code": "4672",
        "ort": "Langenhorn"
    },
    {
        "code": "4673",
        "ort": "Joldelund"
    },
    {
        "code": "4674",
        "ort": "Ockholm"
    },
    {
        "code": "4671",
        "ort": "Bredstedt"
    },
    {
        "code": "4672",
        "ort": "Langenhorn"
    },
    {
        "code": "4673",
        "ort": "Joldelund"
    },
    {
        "code": "4674",
        "ort": "Ockholm"
    },
    {
        "code": "4681",
        "ort": "Wyk"
    },
    {
        "code": "4681",
        "ort": "Wyk"
    },
    {
        "code": "4682",
        "ort": "Amrum"
    },
    {
        "code": "4683",
        "ort": "Oldsum"
    },
    {
        "code": "4684",
        "ort": "Langeneß"
    },
    {
        "code": "4681",
        "ort": "Wyk"
    },
    {
        "code": "4682",
        "ort": "Amrum"
    },
    {
        "code": "4683",
        "ort": "Oldsum"
    },
    {
        "code": "4684",
        "ort": "Langeneß"
    },
    {
        "code": "4702",
        "ort": "Sandstedt\n4703"
    },
    {
        "code": "4702",
        "ort": "Sandstedt"
    },
    {
        "code": "4703",
        "ort": "Loxstedt-Donnern"
    },
    {
        "code": "4704",
        "ort": "Drangstedt"
    },
    {
        "code": "4705",
        "ort": "Wremen"
    },
    {
        "code": "4706",
        "ort": "Schiffdorf"
    },
    {
        "code": "4707",
        "ort": "Langen-Neuenwalde"
    },
    {
        "code": "4708",
        "ort": "Ringstedt"
    },
    {
        "code": "4702",
        "ort": "Sandstedt"
    },
    {
        "code": "4703",
        "ort": "Loxstedt-Donnern"
    },
    {
        "code": "4704",
        "ort": "Drangstedt"
    },
    {
        "code": "4705",
        "ort": "Wremen"
    },
    {
        "code": "4706",
        "ort": "Schiffdorf"
    },
    {
        "code": "4707",
        "ort": "Langen-Neuenwalde"
    },
    {
        "code": "4708",
        "ort": "Ringstedt"
    },
    {
        "code": "471",
        "ort": "Bremerhaven"
    },
    {
        "code": "4721",
        "ort": "Cuxhaven\n4722"
    },
    {
        "code": "4721",
        "ort": "Cuxhaven"
    },
    {
        "code": "4722",
        "ort": "Cuxhaven-Altenbruch"
    },
    {
        "code": "4723",
        "ort": "Cuxhaven-Altenwalde"
    },
    {
        "code": "4724",
        "ort": "Cuxhaven-Lüdingworth"
    },
    {
        "code": "4725",
        "ort": "Helgoland"
    },
    {
        "code": "4721",
        "ort": "Cuxhaven"
    },
    {
        "code": "4722",
        "ort": "Cuxhaven-Altenbruch"
    },
    {
        "code": "4723",
        "ort": "Cuxhaven-Altenwalde"
    },
    {
        "code": "4724",
        "ort": "Cuxhaven-Lüdingworth"
    },
    {
        "code": "4725",
        "ort": "Helgoland"
    },
    {
        "code": "4731",
        "ort": "Nordenham\n4732"
    },
    {
        "code": "4731",
        "ort": "Nordenham"
    },
    {
        "code": "4732",
        "ort": "Stadland-Rodenkirchen"
    },
    {
        "code": "4733",
        "ort": "Butjadingen-Burhave"
    },
    {
        "code": "4734",
        "ort": "Stadland-Seefeld"
    },
    {
        "code": "4735",
        "ort": "Butjadingen-Stollhamm"
    },
    {
        "code": "4736",
        "ort": "Butjadingen-Tossens"
    },
    {
        "code": "4737",
        "ort": "Stadland-Schwei"
    },
    {
        "code": "4731",
        "ort": "Nordenham"
    },
    {
        "code": "4732",
        "ort": "Stadland-Rodenkirchen"
    },
    {
        "code": "4733",
        "ort": "Butjadingen-Burhave"
    },
    {
        "code": "4734",
        "ort": "Stadland-Seefeld"
    },
    {
        "code": "4735",
        "ort": "Butjadingen-Stollhamm"
    },
    {
        "code": "4736",
        "ort": "Butjadingen-Tossens"
    },
    {
        "code": "4737",
        "ort": "Stadland-Schwei"
    },
    {
        "code": "4740",
        "ort": "Loxstedt-Dedesdorf\n4741"
    },
    {
        "code": "4740",
        "ort": "Loxstedt-Dedesdorf"
    },
    {
        "code": "4741",
        "ort": "Nordholz"
    },
    {
        "code": "4742",
        "ort": "Dorum"
    },
    {
        "code": "4743",
        "ort": "Langen"
    },
    {
        "code": "4744",
        "ort": "Loxstedt"
    },
    {
        "code": "4745",
        "ort": "Bad"
    },
    {
        "code": "4746",
        "ort": "Hagen"
    },
    {
        "code": "4747",
        "ort": "Beverstedt"
    },
    {
        "code": "4748",
        "ort": "Stubben"
    },
    {
        "code": "4749",
        "ort": "Schiffdorf-Geestenseth"
    },
    {
        "code": "4740",
        "ort": "Loxstedt-Dedesdorf"
    },
    {
        "code": "4741",
        "ort": "Nordholz"
    },
    {
        "code": "4742",
        "ort": "Dorum"
    },
    {
        "code": "4743",
        "ort": "Langen"
    },
    {
        "code": "4744",
        "ort": "Loxstedt"
    },
    {
        "code": "4745",
        "ort": "Bad"
    },
    {
        "code": "4746",
        "ort": "Hagen"
    },
    {
        "code": "4747",
        "ort": "Beverstedt"
    },
    {
        "code": "4748",
        "ort": "Stubben"
    },
    {
        "code": "4749",
        "ort": "Schiffdorf-Geestenseth"
    },
    {
        "code": "4751",
        "ort": "Otterndorf\n4752"
    },
    {
        "code": "4751",
        "ort": "Otterndorf"
    },
    {
        "code": "4752",
        "ort": "Neuhaus"
    },
    {
        "code": "4753",
        "ort": "Balje"
    },
    {
        "code": "4754",
        "ort": "Bülkau"
    },
    {
        "code": "4755",
        "ort": "Ihlienworth"
    },
    {
        "code": "4756",
        "ort": "Odisheim"
    },
    {
        "code": "4757",
        "ort": "Wanna"
    },
    {
        "code": "4758",
        "ort": "Nordleda"
    },
    {
        "code": "4751",
        "ort": "Otterndorf"
    },
    {
        "code": "4752",
        "ort": "Neuhaus"
    },
    {
        "code": "4753",
        "ort": "Balje"
    },
    {
        "code": "4754",
        "ort": "Bülkau"
    },
    {
        "code": "4755",
        "ort": "Ihlienworth"
    },
    {
        "code": "4756",
        "ort": "Odisheim"
    },
    {
        "code": "4757",
        "ort": "Wanna"
    },
    {
        "code": "4758",
        "ort": "Nordleda"
    },
    {
        "code": "4761",
        "ort": "Bremervörde\n4762"
    },
    {
        "code": "4761",
        "ort": "Bremervörde"
    },
    {
        "code": "4762",
        "ort": "Kutenholz"
    },
    {
        "code": "4763",
        "ort": "Gnarrenburg"
    },
    {
        "code": "4764",
        "ort": "Gnarrenburg-Klenkendorf"
    },
    {
        "code": "4765",
        "ort": "Ebersdorf"
    },
    {
        "code": "4766",
        "ort": "Basdahl"
    },
    {
        "code": "4767",
        "ort": "Bremervörde-Bevern"
    },
    {
        "code": "4768",
        "ort": "Hipstedt"
    },
    {
        "code": "4769",
        "ort": "Bremervörde-Iselersheim"
    },
    {
        "code": "4761",
        "ort": "Bremervörde"
    },
    {
        "code": "4762",
        "ort": "Kutenholz"
    },
    {
        "code": "4763",
        "ort": "Gnarrenburg"
    },
    {
        "code": "4764",
        "ort": "Gnarrenburg-Klenkendorf"
    },
    {
        "code": "4765",
        "ort": "Ebersdorf"
    },
    {
        "code": "4766",
        "ort": "Basdahl"
    },
    {
        "code": "4767",
        "ort": "Bremervörde-Bevern"
    },
    {
        "code": "4768",
        "ort": "Hipstedt"
    },
    {
        "code": "4769",
        "ort": "Bremervörde-Iselersheim"
    },
    {
        "code": "4770",
        "ort": "Wischhafen\n4771"
    },
    {
        "code": "4770",
        "ort": "Wischhafen"
    },
    {
        "code": "4771",
        "ort": "Hemmoor"
    },
    {
        "code": "4772",
        "ort": "Oberndorf"
    },
    {
        "code": "4773",
        "ort": "Lamstedt"
    },
    {
        "code": "4774",
        "ort": "Hechthausen"
    },
    {
        "code": "4775",
        "ort": "Grossenwörden"
    },
    {
        "code": "4776",
        "ort": "Osten-Altendorf"
    },
    {
        "code": "4777",
        "ort": "Cadenberge"
    },
    {
        "code": "4778",
        "ort": "Wingst"
    },
    {
        "code": "4779",
        "ort": "Freiburg"
    },
    {
        "code": "4770",
        "ort": "Wischhafen"
    },
    {
        "code": "4771",
        "ort": "Hemmoor"
    },
    {
        "code": "4772",
        "ort": "Oberndorf"
    },
    {
        "code": "4773",
        "ort": "Lamstedt"
    },
    {
        "code": "4774",
        "ort": "Hechthausen"
    },
    {
        "code": "4775",
        "ort": "Grossenwörden"
    },
    {
        "code": "4776",
        "ort": "Osten-Altendorf"
    },
    {
        "code": "4777",
        "ort": "Cadenberge"
    },
    {
        "code": "4778",
        "ort": "Wingst"
    },
    {
        "code": "4779",
        "ort": "Freiburg"
    },
    {
        "code": "4791",
        "ort": "Osterholz-Scharmbeck\n4792"
    },
    {
        "code": "4791",
        "ort": "Osterholz-Scharmbeck"
    },
    {
        "code": "4792",
        "ort": "Worpswede"
    },
    {
        "code": "4793",
        "ort": "Hambergen"
    },
    {
        "code": "4794",
        "ort": "Worpswede-Ostersode"
    },
    {
        "code": "4795",
        "ort": "Garlstedt"
    },
    {
        "code": "4796",
        "ort": "Teufelsmoor"
    },
    {
        "code": "4791",
        "ort": "Osterholz-Scharmbeck"
    },
    {
        "code": "4792",
        "ort": "Worpswede"
    },
    {
        "code": "4793",
        "ort": "Hambergen"
    },
    {
        "code": "4794",
        "ort": "Worpswede-Ostersode"
    },
    {
        "code": "4795",
        "ort": "Garlstedt"
    },
    {
        "code": "4796",
        "ort": "Teufelsmoor"
    },
    {
        "code": "4802",
        "ort": "Dellstedt,"
    },
    {
        "code": "4802",
        "ort": "Dellstedt,"
    },
    {
        "code": "4803",
        "ort": "Delve,"
    },
    {
        "code": "4804",
        "ort": "Nordhastedt"
    },
    {
        "code": "4805",
        "ort": "Schafstedt"
    },
    {
        "code": "4806",
        "ort": "Bargenstedt,"
    },
    {
        "code": "4802",
        "ort": "Dellstedt,"
    },
    {
        "code": "4803",
        "ort": "Delve,"
    },
    {
        "code": "4804",
        "ort": "Nordhastedt"
    },
    {
        "code": "4805",
        "ort": "Schafstedt"
    },
    {
        "code": "4806",
        "ort": "Bargenstedt,"
    },
    {
        "code": "481",
        "ort": "Heide"
    },
    {
        "code": "4821",
        "ort": "Itzehoe\n4822"
    },
    {
        "code": "4821",
        "ort": "Itzehoe"
    },
    {
        "code": "4822",
        "ort": "Kellinghusen"
    },
    {
        "code": "4823",
        "ort": "Wilster"
    },
    {
        "code": "4824",
        "ort": "Krempe"
    },
    {
        "code": "4825",
        "ort": "Burg"
    },
    {
        "code": "4826",
        "ort": "Hohenlockstedt"
    },
    {
        "code": "4827",
        "ort": "Wacken"
    },
    {
        "code": "4828",
        "ort": "Lägerdorf"
    },
    {
        "code": "4829",
        "ort": "Wewelsfleth,"
    },
    {
        "code": "4821",
        "ort": "Itzehoe"
    },
    {
        "code": "4822",
        "ort": "Kellinghusen"
    },
    {
        "code": "4823",
        "ort": "Wilster"
    },
    {
        "code": "4824",
        "ort": "Krempe"
    },
    {
        "code": "4825",
        "ort": "Burg"
    },
    {
        "code": "4826",
        "ort": "Hohenlockstedt"
    },
    {
        "code": "4827",
        "ort": "Wacken"
    },
    {
        "code": "4828",
        "ort": "Lägerdorf"
    },
    {
        "code": "4829",
        "ort": "Wewelsfleth,"
    },
    {
        "code": "4830",
        "ort": "Süderhastedt\n4832"
    },
    {
        "code": "4830",
        "ort": "Süderhastedt"
    },
    {
        "code": "4832",
        "ort": "Meldorf"
    },
    {
        "code": "4833",
        "ort": "Wesselburen"
    },
    {
        "code": "4834",
        "ort": "Büsum"
    },
    {
        "code": "4835",
        "ort": "Albersdorf"
    },
    {
        "code": "4836",
        "ort": "Hennstedt,"
    },
    {
        "code": "4837",
        "ort": "Neuenkirchen"
    },
    {
        "code": "4838",
        "ort": "Tellingstedt"
    },
    {
        "code": "4839",
        "ort": "Wöhrden,"
    },
    {
        "code": "4830",
        "ort": "Süderhastedt"
    },
    {
        "code": "4832",
        "ort": "Meldorf"
    },
    {
        "code": "4833",
        "ort": "Wesselburen"
    },
    {
        "code": "4834",
        "ort": "Büsum"
    },
    {
        "code": "4835",
        "ort": "Albersdorf"
    },
    {
        "code": "4836",
        "ort": "Hennstedt,"
    },
    {
        "code": "4837",
        "ort": "Neuenkirchen"
    },
    {
        "code": "4838",
        "ort": "Tellingstedt"
    },
    {
        "code": "4839",
        "ort": "Wöhrden,"
    },
    {
        "code": "4841",
        "ort": "Husum\n4842"
    },
    {
        "code": "4841",
        "ort": "Husum"
    },
    {
        "code": "4842",
        "ort": "Nordstrand"
    },
    {
        "code": "4843",
        "ort": "Viöl"
    },
    {
        "code": "4844",
        "ort": "Pellworm"
    },
    {
        "code": "4845",
        "ort": "Ostenfeld"
    },
    {
        "code": "4846",
        "ort": "Hattstedt"
    },
    {
        "code": "4847",
        "ort": "Oster-Ohrstedt"
    },
    {
        "code": "4848",
        "ort": "Rantrum"
    },
    {
        "code": "4849",
        "ort": "Hooge"
    },
    {
        "code": "4841",
        "ort": "Husum"
    },
    {
        "code": "4842",
        "ort": "Nordstrand"
    },
    {
        "code": "4843",
        "ort": "Viöl"
    },
    {
        "code": "4844",
        "ort": "Pellworm"
    },
    {
        "code": "4845",
        "ort": "Ostenfeld"
    },
    {
        "code": "4846",
        "ort": "Hattstedt"
    },
    {
        "code": "4847",
        "ort": "Oster-Ohrstedt"
    },
    {
        "code": "4848",
        "ort": "Rantrum"
    },
    {
        "code": "4849",
        "ort": "Hooge"
    },
    {
        "code": "4851",
        "ort": "Marne\n4852"
    },
    {
        "code": "4851",
        "ort": "Marne"
    },
    {
        "code": "4852",
        "ort": "Brunsbüttel"
    },
    {
        "code": "4853",
        "ort": "Sankt"
    },
    {
        "code": "4854",
        "ort": "Friedrichskoog"
    },
    {
        "code": "4855",
        "ort": "Eddelak"
    },
    {
        "code": "4856",
        "ort": "Kronprinzenkoog"
    },
    {
        "code": "4857",
        "ort": "Barlt"
    },
    {
        "code": "4858",
        "ort": "Sankt"
    },
    {
        "code": "4859",
        "ort": "Windbergen"
    },
    {
        "code": "4851",
        "ort": "Marne"
    },
    {
        "code": "4852",
        "ort": "Brunsbüttel"
    },
    {
        "code": "4853",
        "ort": "Sankt"
    },
    {
        "code": "4854",
        "ort": "Friedrichskoog"
    },
    {
        "code": "4855",
        "ort": "Eddelak"
    },
    {
        "code": "4856",
        "ort": "Kronprinzenkoog"
    },
    {
        "code": "4857",
        "ort": "Barlt"
    },
    {
        "code": "4858",
        "ort": "Sankt"
    },
    {
        "code": "4859",
        "ort": "Windbergen"
    },
    {
        "code": "4861",
        "ort": "Tönning\n4862"
    },
    {
        "code": "4861",
        "ort": "Tönning"
    },
    {
        "code": "4862",
        "ort": "Garding"
    },
    {
        "code": "4863",
        "ort": "Sankt"
    },
    {
        "code": "4864",
        "ort": "Oldenswort"
    },
    {
        "code": "4865",
        "ort": "Osterhever"
    },
    {
        "code": "4861",
        "ort": "Tönning"
    },
    {
        "code": "4862",
        "ort": "Garding"
    },
    {
        "code": "4863",
        "ort": "Sankt"
    },
    {
        "code": "4864",
        "ort": "Oldenswort"
    },
    {
        "code": "4865",
        "ort": "Osterhever"
    },
    {
        "code": "4871",
        "ort": "Hohenwestedt\n4872"
    },
    {
        "code": "4871",
        "ort": "Hohenwestedt"
    },
    {
        "code": "4872",
        "ort": "Hanerau-Hademarschen"
    },
    {
        "code": "4873",
        "ort": "Aukrug"
    },
    {
        "code": "4874",
        "ort": "Todenbüttel"
    },
    {
        "code": "4875",
        "ort": "Stafstedt"
    },
    {
        "code": "4876",
        "ort": "Reher"
    },
    {
        "code": "4877",
        "ort": "Hennstedt"
    },
    {
        "code": "4871",
        "ort": "Hohenwestedt"
    },
    {
        "code": "4872",
        "ort": "Hanerau-Hademarschen"
    },
    {
        "code": "4873",
        "ort": "Aukrug"
    },
    {
        "code": "4874",
        "ort": "Todenbüttel"
    },
    {
        "code": "4875",
        "ort": "Stafstedt"
    },
    {
        "code": "4876",
        "ort": "Reher"
    },
    {
        "code": "4877",
        "ort": "Hennstedt"
    },
    {
        "code": "4881",
        "ort": "Friedrichstadt\n4882"
    },
    {
        "code": "4881",
        "ort": "Friedrichstadt"
    },
    {
        "code": "4882",
        "ort": "Lunden"
    },
    {
        "code": "4883",
        "ort": "Süderstapel"
    },
    {
        "code": "4884",
        "ort": "Schwabstedt"
    },
    {
        "code": "4885",
        "ort": "Bergenhusen"
    },
    {
        "code": "4881",
        "ort": "Friedrichstadt"
    },
    {
        "code": "4882",
        "ort": "Lunden"
    },
    {
        "code": "4883",
        "ort": "Süderstapel"
    },
    {
        "code": "4884",
        "ort": "Schwabstedt"
    },
    {
        "code": "4885",
        "ort": "Bergenhusen"
    },
    {
        "code": "4892",
        "ort": "Schenefeld"
    },
    {
        "code": "4892",
        "ort": "Schenefeld"
    },
    {
        "code": "4893",
        "ort": "Hohenaspe"
    },
    {
        "code": "4892",
        "ort": "Schenefeld"
    },
    {
        "code": "4893",
        "ort": "Hohenaspe"
    },
    {
        "code": "4902",
        "ort": "Jemgum-Ditzum\n4903"
    },
    {
        "code": "4902",
        "ort": "Jemgum-Ditzum"
    },
    {
        "code": "4903",
        "ort": "Wymeer"
    },
    {
        "code": "4902",
        "ort": "Jemgum-Ditzum"
    },
    {
        "code": "4903",
        "ort": "Wymeer"
    },
    {
        "code": "491",
        "ort": "Leer"
    },
    {
        "code": "4920",
        "ort": "Wirdum\n4921"
    },
    {
        "code": "4920",
        "ort": "Wirdum"
    },
    {
        "code": "4921",
        "ort": "Emden"
    },
    {
        "code": "4922",
        "ort": "Borkum"
    },
    {
        "code": "4923",
        "ort": "Krummhörn-Pewsum"
    },
    {
        "code": "4924",
        "ort": "Moormerland-Oldersum"
    },
    {
        "code": "4925",
        "ort": "Hinte"
    },
    {
        "code": "4926",
        "ort": "Krummhörn-Greetsiel"
    },
    {
        "code": "4927",
        "ort": "Krummhörn-Loquard"
    },
    {
        "code": "4928",
        "ort": "Ihlow-Riepe"
    },
    {
        "code": "4929",
        "ort": "Ihlow"
    },
    {
        "code": "4920",
        "ort": "Wirdum"
    },
    {
        "code": "4921",
        "ort": "Emden"
    },
    {
        "code": "4922",
        "ort": "Borkum"
    },
    {
        "code": "4923",
        "ort": "Krummhörn-Pewsum"
    },
    {
        "code": "4924",
        "ort": "Moormerland-Oldersum"
    },
    {
        "code": "4925",
        "ort": "Hinte"
    },
    {
        "code": "4926",
        "ort": "Krummhörn-Greetsiel"
    },
    {
        "code": "4927",
        "ort": "Krummhörn-Loquard"
    },
    {
        "code": "4928",
        "ort": "Ihlow-Riepe"
    },
    {
        "code": "4929",
        "ort": "Ihlow"
    },
    {
        "code": "4931",
        "ort": "Norden\n4932"
    },
    {
        "code": "4931",
        "ort": "Norden"
    },
    {
        "code": "4932",
        "ort": "Norderney"
    },
    {
        "code": "4933",
        "ort": "Dornum"
    },
    {
        "code": "4934",
        "ort": "Marienhafe"
    },
    {
        "code": "4935",
        "ort": "Juist"
    },
    {
        "code": "4936",
        "ort": "Grossheide"
    },
    {
        "code": "4938",
        "ort": "Hagermarsch"
    },
    {
        "code": "4939",
        "ort": "Baltrum"
    },
    {
        "code": "4931",
        "ort": "Norden"
    },
    {
        "code": "4932",
        "ort": "Norderney"
    },
    {
        "code": "4933",
        "ort": "Dornum"
    },
    {
        "code": "4934",
        "ort": "Marienhafe"
    },
    {
        "code": "4935",
        "ort": "Juist"
    },
    {
        "code": "4936",
        "ort": "Grossheide"
    },
    {
        "code": "4938",
        "ort": "Hagermarsch"
    },
    {
        "code": "4939",
        "ort": "Baltrum"
    },
    {
        "code": "4941",
        "ort": "Aurich\n4942"
    },
    {
        "code": "4941",
        "ort": "Aurich"
    },
    {
        "code": "4942",
        "ort": "Südbrookmerland"
    },
    {
        "code": "4943",
        "ort": "Großefehn"
    },
    {
        "code": "4944",
        "ort": "Wiesmoor"
    },
    {
        "code": "4945",
        "ort": "Großefehn-Timmel"
    },
    {
        "code": "4946",
        "ort": "Großefehn-Bagband"
    },
    {
        "code": "4947",
        "ort": "Aurich-Ogenbargen"
    },
    {
        "code": "4948",
        "ort": "Wiesmoor-Marcardsmoor"
    },
    {
        "code": "4941",
        "ort": "Aurich"
    },
    {
        "code": "4942",
        "ort": "Südbrookmerland"
    },
    {
        "code": "4943",
        "ort": "Großefehn"
    },
    {
        "code": "4944",
        "ort": "Wiesmoor"
    },
    {
        "code": "4945",
        "ort": "Großefehn-Timmel"
    },
    {
        "code": "4946",
        "ort": "Großefehn-Bagband"
    },
    {
        "code": "4947",
        "ort": "Aurich-Ogenbargen"
    },
    {
        "code": "4948",
        "ort": "Wiesmoor-Marcardsmoor"
    },
    {
        "code": "4950",
        "ort": "Holtland\n4951"
    },
    {
        "code": "4950",
        "ort": "Holtland"
    },
    {
        "code": "4951",
        "ort": "Weener"
    },
    {
        "code": "4952",
        "ort": "Rhauderfehn"
    },
    {
        "code": "4953",
        "ort": "Bunde"
    },
    {
        "code": "4954",
        "ort": "Moormerland"
    },
    {
        "code": "4955",
        "ort": "Westoverledingen"
    },
    {
        "code": "4956",
        "ort": "Uplengen"
    },
    {
        "code": "4957",
        "ort": "Detern"
    },
    {
        "code": "4958",
        "ort": "Jemgum"
    },
    {
        "code": "4959",
        "ort": "Dollart"
    },
    {
        "code": "4950",
        "ort": "Holtland"
    },
    {
        "code": "4951",
        "ort": "Weener"
    },
    {
        "code": "4952",
        "ort": "Rhauderfehn"
    },
    {
        "code": "4953",
        "ort": "Bunde"
    },
    {
        "code": "4954",
        "ort": "Moormerland"
    },
    {
        "code": "4955",
        "ort": "Westoverledingen"
    },
    {
        "code": "4956",
        "ort": "Uplengen"
    },
    {
        "code": "4957",
        "ort": "Detern"
    },
    {
        "code": "4958",
        "ort": "Jemgum"
    },
    {
        "code": "4959",
        "ort": "Dollart"
    },
    {
        "code": "4961",
        "ort": "Papenburg\n4962"
    },
    {
        "code": "4961",
        "ort": "Papenburg"
    },
    {
        "code": "4962",
        "ort": "Aschendorf"
    },
    {
        "code": "4963",
        "ort": "Dörpen"
    },
    {
        "code": "4964",
        "ort": "Rhede"
    },
    {
        "code": "4965",
        "ort": "Surwold"
    },
    {
        "code": "4966",
        "ort": "Neubörger"
    },
    {
        "code": "4967",
        "ort": "Rhauderfehn-Burlage"
    },
    {
        "code": "4968",
        "ort": "Neulehe"
    },
    {
        "code": "4961",
        "ort": "Papenburg"
    },
    {
        "code": "4962",
        "ort": "Aschendorf"
    },
    {
        "code": "4963",
        "ort": "Dörpen"
    },
    {
        "code": "4964",
        "ort": "Rhede"
    },
    {
        "code": "4965",
        "ort": "Surwold"
    },
    {
        "code": "4966",
        "ort": "Neubörger"
    },
    {
        "code": "4967",
        "ort": "Rhauderfehn-Burlage"
    },
    {
        "code": "4968",
        "ort": "Neulehe"
    },
    {
        "code": "4971",
        "ort": "Esens\n4972"
    },
    {
        "code": "4971",
        "ort": "Esens"
    },
    {
        "code": "4972",
        "ort": "Langeoog"
    },
    {
        "code": "4973",
        "ort": "Wittmund-Burhafe"
    },
    {
        "code": "4974",
        "ort": "Neuharlingersiel"
    },
    {
        "code": "4975",
        "ort": "Westerholt"
    },
    {
        "code": "4976",
        "ort": "Spiekeroog"
    },
    {
        "code": "4977",
        "ort": "Blomberg"
    },
    {
        "code": "4971",
        "ort": "Esens"
    },
    {
        "code": "4972",
        "ort": "Langeoog"
    },
    {
        "code": "4973",
        "ort": "Wittmund-Burhafe"
    },
    {
        "code": "4974",
        "ort": "Neuharlingersiel"
    },
    {
        "code": "4975",
        "ort": "Westerholt"
    },
    {
        "code": "4976",
        "ort": "Spiekeroog"
    },
    {
        "code": "4977",
        "ort": "Blomberg"
    },
    {
        "code": "502\n5021",
        "ort": "Nienburg"
    },
    {
        "code": "5021",
        "ort": "Nienburg"
    },
    {
        "code": "5022",
        "ort": "Wietzen"
    },
    {
        "code": "5023",
        "ort": "Liebenau"
    },
    {
        "code": "5024",
        "ort": "Rohrsen"
    },
    {
        "code": "5025",
        "ort": "Estorf"
    },
    {
        "code": "5026",
        "ort": "Steimbke"
    },
    {
        "code": "5027",
        "ort": "Linsburg"
    },
    {
        "code": "5028",
        "ort": "Pennigsehl"
    },
    {
        "code": "503\n5031",
        "ort": "Wunstorf\n5032"
    },
    {
        "code": "5031",
        "ort": "Wunstorf"
    },
    {
        "code": "5032",
        "ort": "Neustadt"
    },
    {
        "code": "5033",
        "ort": "Großenheidorn,"
    },
    {
        "code": "5034",
        "ort": "Hagen"
    },
    {
        "code": "5036",
        "ort": "Schneeren"
    },
    {
        "code": "5037",
        "ort": "Bad"
    },
    {
        "code": "504\n5041",
        "ort": "Springe"
    },
    {
        "code": "5041",
        "ort": "Springe"
    },
    {
        "code": "5042",
        "ort": "Bad"
    },
    {
        "code": "5043",
        "ort": "Lauenau"
    },
    {
        "code": "5044",
        "ort": "Eldagsen"
    },
    {
        "code": "5045",
        "ort": "Bennigsen"
    },
    {
        "code": "505\n5051",
        "ort": "Bergen,"
    },
    {
        "code": "5051",
        "ort": "Bergen,"
    },
    {
        "code": "5052",
        "ort": "Hermannsburg"
    },
    {
        "code": "5053",
        "ort": "Müden"
    },
    {
        "code": "5054",
        "ort": "Sülze"
    },
    {
        "code": "5055",
        "ort": "Fassberg"
    },
    {
        "code": "5056",
        "ort": "Meissendorf"
    },
    {
        "code": "506\n5060",
        "ort": "Bodenburg\n5062"
    },
    {
        "code": "5060",
        "ort": "Bodenburg"
    },
    {
        "code": "5062",
        "ort": "Holle"
    },
    {
        "code": "5063",
        "ort": "Bad"
    },
    {
        "code": "5064",
        "ort": "Groß"
    },
    {
        "code": "5065",
        "ort": "Sibbesse"
    },
    {
        "code": "5066",
        "ort": "Sarstedt"
    },
    {
        "code": "5067",
        "ort": "Bockenem"
    },
    {
        "code": "5068",
        "ort": "Elze"
    },
    {
        "code": "5069",
        "ort": "Nordstemmen"
    },
    {
        "code": "507\n5071",
        "ort": "Schwarmstedt\n5072"
    },
    {
        "code": "5071",
        "ort": "Schwarmstedt"
    },
    {
        "code": "5072",
        "ort": "Mandelsloh"
    },
    {
        "code": "5073",
        "ort": "Esperke"
    },
    {
        "code": "5074",
        "ort": "Rodewald"
    },
    {
        "code": "508\n5082",
        "ort": "Langlingen\n5083"
    },
    {
        "code": "5082",
        "ort": "Langlingen"
    },
    {
        "code": "5083",
        "ort": "Hohne"
    },
    {
        "code": "5084",
        "ort": "Hambühren"
    },
    {
        "code": "5085",
        "ort": "Ehlershausen"
    },
    {
        "code": "5086",
        "ort": "Scheuen"
    },
    {
        "code": "5021",
        "ort": "Nienburg"
    },
    {
        "code": "5022",
        "ort": "Wietzen"
    },
    {
        "code": "5023",
        "ort": "Liebenau"
    },
    {
        "code": "5024",
        "ort": "Rohrsen"
    },
    {
        "code": "5025",
        "ort": "Estorf"
    },
    {
        "code": "5026",
        "ort": "Steimbke"
    },
    {
        "code": "5027",
        "ort": "Linsburg"
    },
    {
        "code": "5028",
        "ort": "Pennigsehl"
    },
    {
        "code": "5031",
        "ort": "Wunstorf"
    },
    {
        "code": "5032",
        "ort": "Neustadt"
    },
    {
        "code": "5033",
        "ort": "Großenheidorn,"
    },
    {
        "code": "5034",
        "ort": "Hagen"
    },
    {
        "code": "5036",
        "ort": "Schneeren"
    },
    {
        "code": "5037",
        "ort": "Bad"
    },
    {
        "code": "5041",
        "ort": "Springe"
    },
    {
        "code": "5042",
        "ort": "Bad"
    },
    {
        "code": "5043",
        "ort": "Lauenau"
    },
    {
        "code": "5044",
        "ort": "Eldagsen"
    },
    {
        "code": "5045",
        "ort": "Bennigsen"
    },
    {
        "code": "5051",
        "ort": "Bergen,"
    },
    {
        "code": "5052",
        "ort": "Hermannsburg"
    },
    {
        "code": "5053",
        "ort": "Müden"
    },
    {
        "code": "5054",
        "ort": "Sülze"
    },
    {
        "code": "5055",
        "ort": "Fassberg"
    },
    {
        "code": "5056",
        "ort": "Meissendorf"
    },
    {
        "code": "5060",
        "ort": "Bodenburg"
    },
    {
        "code": "5062",
        "ort": "Holle"
    },
    {
        "code": "5063",
        "ort": "Bad"
    },
    {
        "code": "5064",
        "ort": "Groß"
    },
    {
        "code": "5065",
        "ort": "Sibbesse"
    },
    {
        "code": "5066",
        "ort": "Sarstedt"
    },
    {
        "code": "5067",
        "ort": "Bockenem"
    },
    {
        "code": "5068",
        "ort": "Elze"
    },
    {
        "code": "5069",
        "ort": "Nordstemmen"
    },
    {
        "code": "5071",
        "ort": "Schwarmstedt"
    },
    {
        "code": "5072",
        "ort": "Mandelsloh"
    },
    {
        "code": "5073",
        "ort": "Esperke"
    },
    {
        "code": "5074",
        "ort": "Rodewald"
    },
    {
        "code": "5082",
        "ort": "Langlingen"
    },
    {
        "code": "5083",
        "ort": "Hohne"
    },
    {
        "code": "5084",
        "ort": "Hambühren"
    },
    {
        "code": "5085",
        "ort": "Ehlershausen"
    },
    {
        "code": "5086",
        "ort": "Scheuen"
    },
    {
        "code": "510\n5101",
        "ort": "Pattensen\n5102"
    },
    {
        "code": "5101",
        "ort": "Pattensen"
    },
    {
        "code": "5102",
        "ort": "Laatzen"
    },
    {
        "code": "5103",
        "ort": "Wennigsen"
    },
    {
        "code": "5105",
        "ort": "Barsinghausen"
    },
    {
        "code": "5108",
        "ort": "Gehrden"
    },
    {
        "code": "5109",
        "ort": "Ronnenberg"
    },
    {
        "code": "511",
        "ort": "Hannover"
    },
    {
        "code": "512\n5121",
        "ort": "Hildesheim\n5123"
    },
    {
        "code": "5121",
        "ort": "Hildesheim"
    },
    {
        "code": "5123",
        "ort": "Schellerten"
    },
    {
        "code": "5126",
        "ort": "Algermissen"
    },
    {
        "code": "5127",
        "ort": "Harsum"
    },
    {
        "code": "5128",
        "ort": "Hohenhameln"
    },
    {
        "code": "5129",
        "ort": "Söhlde"
    },
    {
        "code": "513\n5130",
        "ort": "Wedemark\n5131"
    },
    {
        "code": "5130",
        "ort": "Wedemark"
    },
    {
        "code": "5131",
        "ort": "Garbsen"
    },
    {
        "code": "5132",
        "ort": "Lehrte"
    },
    {
        "code": "5135",
        "ort": "Fuhrberg"
    },
    {
        "code": "5136",
        "ort": "Burgdorf"
    },
    {
        "code": "5137",
        "ort": "Seelze"
    },
    {
        "code": "5138",
        "ort": "Sehnde"
    },
    {
        "code": "5139",
        "ort": "Burgwedel"
    },
    {
        "code": "514\n5141",
        "ort": "Celle\n5142"
    },
    {
        "code": "5141",
        "ort": "Celle"
    },
    {
        "code": "5142",
        "ort": "Eschede"
    },
    {
        "code": "5143",
        "ort": "Winsen"
    },
    {
        "code": "5144",
        "ort": "Wathlingen"
    },
    {
        "code": "5145",
        "ort": "Beedenbostel"
    },
    {
        "code": "5147",
        "ort": "Häningsen"
    },
    {
        "code": "5146",
        "ort": "Weitze"
    },
    {
        "code": "5148",
        "ort": "Steinhorst"
    },
    {
        "code": "5149",
        "ort": "Wienhausen"
    },
    {
        "code": "515\n5151",
        "ort": "Hameln\n5152"
    },
    {
        "code": "5151",
        "ort": "Hameln"
    },
    {
        "code": "5152",
        "ort": "Hessisch"
    },
    {
        "code": "5153",
        "ort": "Salzhemmendorf"
    },
    {
        "code": "5154",
        "ort": "Aerzen"
    },
    {
        "code": "5155",
        "ort": "Emmerthal"
    },
    {
        "code": "5156",
        "ort": "Coppenbrügge"
    },
    {
        "code": "5157",
        "ort": "Börry"
    },
    {
        "code": "5158",
        "ort": "Hemeringen"
    },
    {
        "code": "5159",
        "ort": "Bisperode"
    },
    {
        "code": "516\n5161",
        "ort": "Walsrode\n5162"
    },
    {
        "code": "5161",
        "ort": "Walsrode"
    },
    {
        "code": "5162",
        "ort": "Bad"
    },
    {
        "code": "5163",
        "ort": "Dorfmark"
    },
    {
        "code": "5164",
        "ort": "Hodenhagen"
    },
    {
        "code": "5165",
        "ort": "Rethem"
    },
    {
        "code": "5166",
        "ort": "Kirchboitzen"
    },
    {
        "code": "5167",
        "ort": "Westenholz"
    },
    {
        "code": "5168",
        "ort": "Stellichte"
    },
    {
        "code": "517\n5171",
        "ort": "Peine\n5172"
    },
    {
        "code": "5171",
        "ort": "Peine"
    },
    {
        "code": "5172",
        "ort": "Ilsede"
    },
    {
        "code": "5173",
        "ort": "Uetze"
    },
    {
        "code": "5174",
        "ort": "Lahstedt"
    },
    {
        "code": "5175",
        "ort": "Arpke"
    },
    {
        "code": "5176",
        "ort": "Edemissen"
    },
    {
        "code": "5177",
        "ort": "Abbensen"
    },
    {
        "code": "518\n5181",
        "ort": "Alfeld"
    },
    {
        "code": "5181",
        "ort": "Alfeld"
    },
    {
        "code": "5182",
        "ort": "Gronau"
    },
    {
        "code": "5183",
        "ort": "Lamspringe"
    },
    {
        "code": "5184",
        "ort": "Freden"
    },
    {
        "code": "5185",
        "ort": "Duingen"
    },
    {
        "code": "5186",
        "ort": "Wallensen"
    },
    {
        "code": "5187",
        "ort": "Delligsen"
    },
    {
        "code": "519\n5190",
        "ort": "Emmingen\n5191"
    },
    {
        "code": "5190",
        "ort": "Emmingen"
    },
    {
        "code": "5191",
        "ort": "Soltau"
    },
    {
        "code": "5192",
        "ort": "Munster"
    },
    {
        "code": "5193",
        "ort": "Schneverdingen"
    },
    {
        "code": "5194",
        "ort": "Bispingen"
    },
    {
        "code": "5196",
        "ort": "Wietzendorf"
    },
    {
        "code": "5197",
        "ort": "Frielingen"
    },
    {
        "code": "5198",
        "ort": "Wintermoor"
    },
    {
        "code": "5199",
        "ort": "Heber"
    },
    {
        "code": "5101",
        "ort": "Pattensen"
    },
    {
        "code": "5102",
        "ort": "Laatzen"
    },
    {
        "code": "5103",
        "ort": "Wennigsen"
    },
    {
        "code": "5105",
        "ort": "Barsinghausen"
    },
    {
        "code": "5108",
        "ort": "Gehrden"
    },
    {
        "code": "5109",
        "ort": "Ronnenberg"
    },
    {
        "code": "5121",
        "ort": "Hildesheim"
    },
    {
        "code": "5123",
        "ort": "Schellerten"
    },
    {
        "code": "5126",
        "ort": "Algermissen"
    },
    {
        "code": "5127",
        "ort": "Harsum"
    },
    {
        "code": "5128",
        "ort": "Hohenhameln"
    },
    {
        "code": "5129",
        "ort": "Söhlde"
    },
    {
        "code": "5130",
        "ort": "Wedemark"
    },
    {
        "code": "5131",
        "ort": "Garbsen"
    },
    {
        "code": "5132",
        "ort": "Lehrte"
    },
    {
        "code": "5135",
        "ort": "Fuhrberg"
    },
    {
        "code": "5136",
        "ort": "Burgdorf"
    },
    {
        "code": "5137",
        "ort": "Seelze"
    },
    {
        "code": "5138",
        "ort": "Sehnde"
    },
    {
        "code": "5139",
        "ort": "Burgwedel"
    },
    {
        "code": "5141",
        "ort": "Celle"
    },
    {
        "code": "5142",
        "ort": "Eschede"
    },
    {
        "code": "5143",
        "ort": "Winsen"
    },
    {
        "code": "5144",
        "ort": "Wathlingen"
    },
    {
        "code": "5145",
        "ort": "Beedenbostel"
    },
    {
        "code": "5147",
        "ort": "Häningsen"
    },
    {
        "code": "5146",
        "ort": "Weitze"
    },
    {
        "code": "5148",
        "ort": "Steinhorst"
    },
    {
        "code": "5149",
        "ort": "Wienhausen"
    },
    {
        "code": "5151",
        "ort": "Hameln"
    },
    {
        "code": "5152",
        "ort": "Hessisch"
    },
    {
        "code": "5153",
        "ort": "Salzhemmendorf"
    },
    {
        "code": "5154",
        "ort": "Aerzen"
    },
    {
        "code": "5155",
        "ort": "Emmerthal"
    },
    {
        "code": "5156",
        "ort": "Coppenbrügge"
    },
    {
        "code": "5157",
        "ort": "Börry"
    },
    {
        "code": "5158",
        "ort": "Hemeringen"
    },
    {
        "code": "5159",
        "ort": "Bisperode"
    },
    {
        "code": "5161",
        "ort": "Walsrode"
    },
    {
        "code": "5162",
        "ort": "Bad"
    },
    {
        "code": "5163",
        "ort": "Dorfmark"
    },
    {
        "code": "5164",
        "ort": "Hodenhagen"
    },
    {
        "code": "5165",
        "ort": "Rethem"
    },
    {
        "code": "5166",
        "ort": "Kirchboitzen"
    },
    {
        "code": "5167",
        "ort": "Westenholz"
    },
    {
        "code": "5168",
        "ort": "Stellichte"
    },
    {
        "code": "5171",
        "ort": "Peine"
    },
    {
        "code": "5172",
        "ort": "Ilsede"
    },
    {
        "code": "5173",
        "ort": "Uetze"
    },
    {
        "code": "5174",
        "ort": "Lahstedt"
    },
    {
        "code": "5175",
        "ort": "Arpke"
    },
    {
        "code": "5176",
        "ort": "Edemissen"
    },
    {
        "code": "5177",
        "ort": "Abbensen"
    },
    {
        "code": "5181",
        "ort": "Alfeld"
    },
    {
        "code": "5182",
        "ort": "Gronau"
    },
    {
        "code": "5183",
        "ort": "Lamspringe"
    },
    {
        "code": "5184",
        "ort": "Freden"
    },
    {
        "code": "5185",
        "ort": "Duingen"
    },
    {
        "code": "5186",
        "ort": "Wallensen"
    },
    {
        "code": "5187",
        "ort": "Delligsen"
    },
    {
        "code": "5190",
        "ort": "Emmingen"
    },
    {
        "code": "5191",
        "ort": "Soltau"
    },
    {
        "code": "5192",
        "ort": "Munster"
    },
    {
        "code": "5193",
        "ort": "Schneverdingen"
    },
    {
        "code": "5194",
        "ort": "Bispingen"
    },
    {
        "code": "5196",
        "ort": "Wietzendorf"
    },
    {
        "code": "5197",
        "ort": "Frielingen"
    },
    {
        "code": "5198",
        "ort": "Wintermoor"
    },
    {
        "code": "5199",
        "ort": "Heber"
    },
    {
        "code": "520\n5200",
        "ort": "(not"
    },
    {
        "code": "5200",
        "ort": "(not"
    },
    {
        "code": "5201",
        "ort": "Halle"
    },
    {
        "code": "5202",
        "ort": "Oerlinghausen"
    },
    {
        "code": "5203",
        "ort": "Werther"
    },
    {
        "code": "5204",
        "ort": "Steinhagen"
    },
    {
        "code": "5205",
        "ort": "Sennestadt"
    },
    {
        "code": "5206",
        "ort": "Jöllenbeck,"
    },
    {
        "code": "5207",
        "ort": "Schloß"
    },
    {
        "code": "5208",
        "ort": "Leopoldshöhe"
    },
    {
        "code": "5209",
        "ort": "Friedrichsdorf"
    },
    {
        "code": "521",
        "ort": "Bielefeld"
    },
    {
        "code": "522\n5220",
        "ort": "(not"
    },
    {
        "code": "5220",
        "ort": "(not"
    },
    {
        "code": "5221",
        "ort": "Herford"
    },
    {
        "code": "5222",
        "ort": "Bad"
    },
    {
        "code": "5223",
        "ort": "Bünde"
    },
    {
        "code": "5224",
        "ort": "Enger"
    },
    {
        "code": "5225",
        "ort": "Spenge"
    },
    {
        "code": "5226",
        "ort": "Bruchmühlen"
    },
    {
        "code": "5227",
        "ort": "(not"
    },
    {
        "code": "5228",
        "ort": "Vlotho/Exter"
    },
    {
        "code": "5229",
        "ort": "(not"
    },
    {
        "code": "523\n5230",
        "ort": "(not"
    },
    {
        "code": "5230",
        "ort": "(not"
    },
    {
        "code": "5231",
        "ort": "Detmold"
    },
    {
        "code": "5232",
        "ort": "Lage"
    },
    {
        "code": "5233",
        "ort": "Steinheim"
    },
    {
        "code": "5234",
        "ort": "Horn-Bad"
    },
    {
        "code": "5235",
        "ort": "Blomberg"
    },
    {
        "code": "5236",
        "ort": "Großenmarpe"
    },
    {
        "code": "5237",
        "ort": "Augustdorf"
    },
    {
        "code": "5238",
        "ort": "Himmighausen"
    },
    {
        "code": "5239",
        "ort": "(not"
    },
    {
        "code": "524\n5240",
        "ort": "(not"
    },
    {
        "code": "5240",
        "ort": "(not"
    },
    {
        "code": "5241",
        "ort": "Gütersloh"
    },
    {
        "code": "5242",
        "ort": "Rheda-Wiedenbrück"
    },
    {
        "code": "5243",
        "ort": "(not"
    },
    {
        "code": "5244",
        "ort": "Rietberg"
    },
    {
        "code": "5245",
        "ort": "Herzebrock-Clarholz"
    },
    {
        "code": "5246",
        "ort": "Verl"
    },
    {
        "code": "5247",
        "ort": "Harsewinkel"
    },
    {
        "code": "5248",
        "ort": "Langenberg"
    },
    {
        "code": "5249",
        "ort": "(not"
    },
    {
        "code": "525\n5250",
        "ort": "Delbrück"
    },
    {
        "code": "5250",
        "ort": "Delbrück"
    },
    {
        "code": "5251",
        "ort": "Paderborn"
    },
    {
        "code": "5252",
        "ort": "Bad"
    },
    {
        "code": "5253",
        "ort": "Bad"
    },
    {
        "code": "5254",
        "ort": "Schloß"
    },
    {
        "code": "5255",
        "ort": "Altenbeken"
    },
    {
        "code": "5257",
        "ort": "Hövelhof"
    },
    {
        "code": "5258",
        "ort": "Salzkotten"
    },
    {
        "code": "5259",
        "ort": "Neuenheerse"
    },
    {
        "code": "526\n5260",
        "ort": "(not"
    },
    {
        "code": "5260",
        "ort": "(not"
    },
    {
        "code": "5261",
        "ort": "Lemgo"
    },
    {
        "code": "5262",
        "ort": "Extertal"
    },
    {
        "code": "5263",
        "ort": "Barntrup"
    },
    {
        "code": "5264",
        "ort": "Kalletal"
    },
    {
        "code": "5265",
        "ort": "Dörentrup"
    },
    {
        "code": "5266",
        "ort": "Kirchheide"
    },
    {
        "code": "5267",
        "ort": "(not"
    },
    {
        "code": "5268",
        "ort": "(not"
    },
    {
        "code": "5269",
        "ort": "(not"
    },
    {
        "code": "527\n5270",
        "ort": "(not"
    },
    {
        "code": "5270",
        "ort": "(not"
    },
    {
        "code": "5271",
        "ort": "Höxter,"
    },
    {
        "code": "5272",
        "ort": "Brakel"
    },
    {
        "code": "5273",
        "ort": "Beverungen,"
    },
    {
        "code": "5274",
        "ort": "Nieheim"
    },
    {
        "code": "5275",
        "ort": "Ottbergen"
    },
    {
        "code": "5276",
        "ort": "Marienmünster"
    },
    {
        "code": "5277",
        "ort": "Fürstenau"
    },
    {
        "code": "5278",
        "ort": "Ovenhausen"
    },
    {
        "code": "5279",
        "ort": "(not"
    },
    {
        "code": "528\n5281",
        "ort": "Bad"
    },
    {
        "code": "5281",
        "ort": "Bad"
    },
    {
        "code": "5282",
        "ort": "Schieder-Schwalenberg"
    },
    {
        "code": "5283",
        "ort": "Lügde"
    },
    {
        "code": "5284",
        "ort": "Schwalenberg"
    },
    {
        "code": "5285",
        "ort": "Kleinenberg"
    },
    {
        "code": "5286",
        "ort": "Ottenstein"
    },
    {
        "code": "5287",
        "ort": "(not"
    },
    {
        "code": "5288",
        "ort": "(not"
    },
    {
        "code": "5289",
        "ort": "(not"
    },
    {
        "code": "529\n5291",
        "ort": "(not"
    },
    {
        "code": "5291",
        "ort": "(not"
    },
    {
        "code": "5292",
        "ort": "Atteln"
    },
    {
        "code": "5293",
        "ort": "Dahl"
    },
    {
        "code": "5294",
        "ort": "Espeln"
    },
    {
        "code": "5295",
        "ort": "Lichtenau"
    },
    {
        "code": "5296",
        "ort": "(not"
    },
    {
        "code": "5297",
        "ort": "(not"
    },
    {
        "code": "5298",
        "ort": "(not"
    },
    {
        "code": "5299",
        "ort": "(not"
    },
    {
        "code": "5200",
        "ort": "(not"
    },
    {
        "code": "5201",
        "ort": "Halle"
    },
    {
        "code": "5202",
        "ort": "Oerlinghausen"
    },
    {
        "code": "5203",
        "ort": "Werther"
    },
    {
        "code": "5204",
        "ort": "Steinhagen"
    },
    {
        "code": "5205",
        "ort": "Sennestadt"
    },
    {
        "code": "5206",
        "ort": "Jöllenbeck,"
    },
    {
        "code": "5207",
        "ort": "Schloß"
    },
    {
        "code": "5208",
        "ort": "Leopoldshöhe"
    },
    {
        "code": "5209",
        "ort": "Friedrichsdorf"
    },
    {
        "code": "5220",
        "ort": "(not"
    },
    {
        "code": "5221",
        "ort": "Herford"
    },
    {
        "code": "5222",
        "ort": "Bad"
    },
    {
        "code": "5223",
        "ort": "Bünde"
    },
    {
        "code": "5224",
        "ort": "Enger"
    },
    {
        "code": "5225",
        "ort": "Spenge"
    },
    {
        "code": "5226",
        "ort": "Bruchmühlen"
    },
    {
        "code": "5227",
        "ort": "(not"
    },
    {
        "code": "5228",
        "ort": "Vlotho/Exter"
    },
    {
        "code": "5229",
        "ort": "(not"
    },
    {
        "code": "5230",
        "ort": "(not"
    },
    {
        "code": "5231",
        "ort": "Detmold"
    },
    {
        "code": "5232",
        "ort": "Lage"
    },
    {
        "code": "5233",
        "ort": "Steinheim"
    },
    {
        "code": "5234",
        "ort": "Horn-Bad"
    },
    {
        "code": "5235",
        "ort": "Blomberg"
    },
    {
        "code": "5236",
        "ort": "Großenmarpe"
    },
    {
        "code": "5237",
        "ort": "Augustdorf"
    },
    {
        "code": "5238",
        "ort": "Himmighausen"
    },
    {
        "code": "5239",
        "ort": "(not"
    },
    {
        "code": "5240",
        "ort": "(not"
    },
    {
        "code": "5241",
        "ort": "Gütersloh"
    },
    {
        "code": "5242",
        "ort": "Rheda-Wiedenbrück"
    },
    {
        "code": "5243",
        "ort": "(not"
    },
    {
        "code": "5244",
        "ort": "Rietberg"
    },
    {
        "code": "5245",
        "ort": "Herzebrock-Clarholz"
    },
    {
        "code": "5246",
        "ort": "Verl"
    },
    {
        "code": "5247",
        "ort": "Harsewinkel"
    },
    {
        "code": "5248",
        "ort": "Langenberg"
    },
    {
        "code": "5249",
        "ort": "(not"
    },
    {
        "code": "5250",
        "ort": "Delbrück"
    },
    {
        "code": "5251",
        "ort": "Paderborn"
    },
    {
        "code": "5252",
        "ort": "Bad"
    },
    {
        "code": "5253",
        "ort": "Bad"
    },
    {
        "code": "5254",
        "ort": "Schloß"
    },
    {
        "code": "5255",
        "ort": "Altenbeken"
    },
    {
        "code": "5257",
        "ort": "Hövelhof"
    },
    {
        "code": "5258",
        "ort": "Salzkotten"
    },
    {
        "code": "5259",
        "ort": "Neuenheerse"
    },
    {
        "code": "5260",
        "ort": "(not"
    },
    {
        "code": "5261",
        "ort": "Lemgo"
    },
    {
        "code": "5262",
        "ort": "Extertal"
    },
    {
        "code": "5263",
        "ort": "Barntrup"
    },
    {
        "code": "5264",
        "ort": "Kalletal"
    },
    {
        "code": "5265",
        "ort": "Dörentrup"
    },
    {
        "code": "5266",
        "ort": "Kirchheide"
    },
    {
        "code": "5267",
        "ort": "(not"
    },
    {
        "code": "5268",
        "ort": "(not"
    },
    {
        "code": "5269",
        "ort": "(not"
    },
    {
        "code": "5270",
        "ort": "(not"
    },
    {
        "code": "5271",
        "ort": "Höxter,"
    },
    {
        "code": "5272",
        "ort": "Brakel"
    },
    {
        "code": "5273",
        "ort": "Beverungen,"
    },
    {
        "code": "5274",
        "ort": "Nieheim"
    },
    {
        "code": "5275",
        "ort": "Ottbergen"
    },
    {
        "code": "5276",
        "ort": "Marienmünster"
    },
    {
        "code": "5277",
        "ort": "Fürstenau"
    },
    {
        "code": "5278",
        "ort": "Ovenhausen"
    },
    {
        "code": "5279",
        "ort": "(not"
    },
    {
        "code": "5281",
        "ort": "Bad"
    },
    {
        "code": "5282",
        "ort": "Schieder-Schwalenberg"
    },
    {
        "code": "5283",
        "ort": "Lügde"
    },
    {
        "code": "5284",
        "ort": "Schwalenberg"
    },
    {
        "code": "5285",
        "ort": "Kleinenberg"
    },
    {
        "code": "5286",
        "ort": "Ottenstein"
    },
    {
        "code": "5287",
        "ort": "(not"
    },
    {
        "code": "5288",
        "ort": "(not"
    },
    {
        "code": "5289",
        "ort": "(not"
    },
    {
        "code": "5291",
        "ort": "(not"
    },
    {
        "code": "5292",
        "ort": "Atteln"
    },
    {
        "code": "5293",
        "ort": "Dahl"
    },
    {
        "code": "5294",
        "ort": "Espeln"
    },
    {
        "code": "5295",
        "ort": "Lichtenau"
    },
    {
        "code": "5296",
        "ort": "(not"
    },
    {
        "code": "5297",
        "ort": "(not"
    },
    {
        "code": "5298",
        "ort": "(not"
    },
    {
        "code": "5299",
        "ort": "(not"
    },
    {
        "code": "530\n5300",
        "ort": "Üfingen\n5301"
    },
    {
        "code": "5300",
        "ort": "Üfingen"
    },
    {
        "code": "5301",
        "ort": "Lehre-Essenrode"
    },
    {
        "code": "5302",
        "ort": "Vechelde"
    },
    {
        "code": "5303",
        "ort": "Wendeburg"
    },
    {
        "code": "5304",
        "ort": "Meine"
    },
    {
        "code": "5305",
        "ort": "Sickte"
    },
    {
        "code": "5306",
        "ort": "Cremlingen"
    },
    {
        "code": "5307",
        "ort": "Braunschweig-Wenden"
    },
    {
        "code": "5308",
        "ort": "Lehre"
    },
    {
        "code": "5309",
        "ort": "Lehre-Wendhausen"
    },
    {
        "code": "531",
        "ort": "Braunschweig"
    },
    {
        "code": "532\n5320",
        "ort": "Torfhaus\n5321"
    },
    {
        "code": "5320",
        "ort": "Torfhaus"
    },
    {
        "code": "5321",
        "ort": "Goslar"
    },
    {
        "code": "5322",
        "ort": "Bad"
    },
    {
        "code": "5323",
        "ort": "Clausthal-Zellerfeld"
    },
    {
        "code": "5324",
        "ort": "Vienenburg"
    },
    {
        "code": "5325",
        "ort": "Hahnenklee"
    },
    {
        "code": "5326",
        "ort": "Langelsheim"
    },
    {
        "code": "5327",
        "ort": "Bad"
    },
    {
        "code": "5328",
        "ort": "Altenau"
    },
    {
        "code": "5329",
        "ort": "Schulenberg"
    },
    {
        "code": "533\n5331",
        "ort": "Wolfenbüttel\n5332"
    },
    {
        "code": "5331",
        "ort": "Wolfenbüttel"
    },
    {
        "code": "5332",
        "ort": "Schöppenstedt"
    },
    {
        "code": "5333",
        "ort": "Dettum"
    },
    {
        "code": "5334",
        "ort": "Hornburg"
    },
    {
        "code": "5335",
        "ort": "Schladen"
    },
    {
        "code": "5336",
        "ort": "Semmenstedt"
    },
    {
        "code": "5337",
        "ort": "Kissenbrück"
    },
    {
        "code": "5339",
        "ort": "Gielde"
    },
    {
        "code": "534\n5341",
        "ort": "Salzgitter\n5344"
    },
    {
        "code": "5341",
        "ort": "Salzgitter"
    },
    {
        "code": "5344",
        "ort": "Lengede"
    },
    {
        "code": "5345",
        "ort": "Baddeckenstedt"
    },
    {
        "code": "5346",
        "ort": "Liebenburg"
    },
    {
        "code": "5347",
        "ort": "Burgdorf"
    },
    {
        "code": "535\n5351",
        "ort": "Helmstedt\n5352"
    },
    {
        "code": "5351",
        "ort": "Helmstedt"
    },
    {
        "code": "5352",
        "ort": "Schöningen"
    },
    {
        "code": "5353",
        "ort": "Königslutter"
    },
    {
        "code": "5354",
        "ort": "Jerxheim"
    },
    {
        "code": "5355",
        "ort": "Frellstedt"
    },
    {
        "code": "5356",
        "ort": "Helmstedt-Barmke"
    },
    {
        "code": "5357",
        "ort": "Grasleben"
    },
    {
        "code": "5358",
        "ort": "Bahrdorf-Mackendorf"
    },
    {
        "code": "536\n5361",
        "ort": "Wolfsburg\n5362"
    },
    {
        "code": "5361",
        "ort": "Wolfsburg"
    },
    {
        "code": "5362",
        "ort": "Wolfsburg-Fallersleben"
    },
    {
        "code": "5363",
        "ort": "Wolfsburg-Vorsfelde"
    },
    {
        "code": "5364",
        "ort": "Velpke"
    },
    {
        "code": "5365",
        "ort": "Wolfsburg-Neindorf"
    },
    {
        "code": "5366",
        "ort": "Jembke"
    },
    {
        "code": "5367",
        "ort": "Rühen"
    },
    {
        "code": "537\n5371",
        "ort": "Gifhorn\n5372"
    },
    {
        "code": "5371",
        "ort": "Gifhorn"
    },
    {
        "code": "5372",
        "ort": "Meinersen"
    },
    {
        "code": "5373",
        "ort": "Hillerse"
    },
    {
        "code": "5374",
        "ort": "Isenbüttel"
    },
    {
        "code": "5375",
        "ort": "Müden"
    },
    {
        "code": "5376",
        "ort": "Wesendorf"
    },
    {
        "code": "5378",
        "ort": "Sassenburg-Platendorf"
    },
    {
        "code": "5379",
        "ort": "Sassenburg-Grussendorf"
    },
    {
        "code": "538\n5381",
        "ort": "Seesen\n5382"
    },
    {
        "code": "5381",
        "ort": "Seesen"
    },
    {
        "code": "5382",
        "ort": "Bad"
    },
    {
        "code": "5383",
        "ort": "Lutter"
    },
    {
        "code": "5384",
        "ort": "Groß"
    },
    {
        "code": "5300",
        "ort": "Üfingen"
    },
    {
        "code": "5301",
        "ort": "Lehre-Essenrode"
    },
    {
        "code": "5302",
        "ort": "Vechelde"
    },
    {
        "code": "5303",
        "ort": "Wendeburg"
    },
    {
        "code": "5304",
        "ort": "Meine"
    },
    {
        "code": "5305",
        "ort": "Sickte"
    },
    {
        "code": "5306",
        "ort": "Cremlingen"
    },
    {
        "code": "5307",
        "ort": "Braunschweig-Wenden"
    },
    {
        "code": "5308",
        "ort": "Lehre"
    },
    {
        "code": "5309",
        "ort": "Lehre-Wendhausen"
    },
    {
        "code": "5320",
        "ort": "Torfhaus"
    },
    {
        "code": "5321",
        "ort": "Goslar"
    },
    {
        "code": "5322",
        "ort": "Bad"
    },
    {
        "code": "5323",
        "ort": "Clausthal-Zellerfeld"
    },
    {
        "code": "5324",
        "ort": "Vienenburg"
    },
    {
        "code": "5325",
        "ort": "Hahnenklee"
    },
    {
        "code": "5326",
        "ort": "Langelsheim"
    },
    {
        "code": "5327",
        "ort": "Bad"
    },
    {
        "code": "5328",
        "ort": "Altenau"
    },
    {
        "code": "5329",
        "ort": "Schulenberg"
    },
    {
        "code": "5331",
        "ort": "Wolfenbüttel"
    },
    {
        "code": "5332",
        "ort": "Schöppenstedt"
    },
    {
        "code": "5333",
        "ort": "Dettum"
    },
    {
        "code": "5334",
        "ort": "Hornburg"
    },
    {
        "code": "5335",
        "ort": "Schladen"
    },
    {
        "code": "5336",
        "ort": "Semmenstedt"
    },
    {
        "code": "5337",
        "ort": "Kissenbrück"
    },
    {
        "code": "5339",
        "ort": "Gielde"
    },
    {
        "code": "5341",
        "ort": "Salzgitter"
    },
    {
        "code": "5344",
        "ort": "Lengede"
    },
    {
        "code": "5345",
        "ort": "Baddeckenstedt"
    },
    {
        "code": "5346",
        "ort": "Liebenburg"
    },
    {
        "code": "5347",
        "ort": "Burgdorf"
    },
    {
        "code": "5351",
        "ort": "Helmstedt"
    },
    {
        "code": "5352",
        "ort": "Schöningen"
    },
    {
        "code": "5353",
        "ort": "Königslutter"
    },
    {
        "code": "5354",
        "ort": "Jerxheim"
    },
    {
        "code": "5355",
        "ort": "Frellstedt"
    },
    {
        "code": "5356",
        "ort": "Helmstedt-Barmke"
    },
    {
        "code": "5357",
        "ort": "Grasleben"
    },
    {
        "code": "5358",
        "ort": "Bahrdorf-Mackendorf"
    },
    {
        "code": "5361",
        "ort": "Wolfsburg"
    },
    {
        "code": "5362",
        "ort": "Wolfsburg-Fallersleben"
    },
    {
        "code": "5363",
        "ort": "Wolfsburg-Vorsfelde"
    },
    {
        "code": "5364",
        "ort": "Velpke"
    },
    {
        "code": "5365",
        "ort": "Wolfsburg-Neindorf"
    },
    {
        "code": "5366",
        "ort": "Jembke"
    },
    {
        "code": "5367",
        "ort": "Rühen"
    },
    {
        "code": "5371",
        "ort": "Gifhorn"
    },
    {
        "code": "5372",
        "ort": "Meinersen"
    },
    {
        "code": "5373",
        "ort": "Hillerse"
    },
    {
        "code": "5374",
        "ort": "Isenbüttel"
    },
    {
        "code": "5375",
        "ort": "Müden"
    },
    {
        "code": "5376",
        "ort": "Wesendorf"
    },
    {
        "code": "5378",
        "ort": "Sassenburg-Platendorf"
    },
    {
        "code": "5379",
        "ort": "Sassenburg-Grussendorf"
    },
    {
        "code": "5381",
        "ort": "Seesen"
    },
    {
        "code": "5382",
        "ort": "Bad"
    },
    {
        "code": "5383",
        "ort": "Lutter"
    },
    {
        "code": "5384",
        "ort": "Groß"
    },
    {
        "code": "540\n5401",
        "ort": "Georgsmarienhütte\n5402"
    },
    {
        "code": "5401",
        "ort": "Georgsmarienhütte"
    },
    {
        "code": "5402",
        "ort": "Bissendorf"
    },
    {
        "code": "5403",
        "ort": "Bad"
    },
    {
        "code": "5404",
        "ort": "Westerkappeln"
    },
    {
        "code": "5405",
        "ort": "Hasbergen"
    },
    {
        "code": "5406",
        "ort": "Belm"
    },
    {
        "code": "5407",
        "ort": "Wallenhorst"
    },
    {
        "code": "5409",
        "ort": "Hilter"
    },
    {
        "code": "541",
        "ort": "Osnabrück"
    },
    {
        "code": "542\n5421",
        "ort": "Dissen"
    },
    {
        "code": "5421",
        "ort": "Dissen"
    },
    {
        "code": "5422",
        "ort": "Melle"
    },
    {
        "code": "5423",
        "ort": "Versmold"
    },
    {
        "code": "5424",
        "ort": "Bad"
    },
    {
        "code": "5425",
        "ort": "Borgholzhausen"
    },
    {
        "code": "5426",
        "ort": "Glandorf"
    },
    {
        "code": "5427",
        "ort": "Buer"
    },
    {
        "code": "5428",
        "ort": "Neuenkirchen"
    },
    {
        "code": "5429",
        "ort": "Wellingholzhausen"
    },
    {
        "code": "543\n5432",
        "ort": "Löningen\n5433"
    },
    {
        "code": "5432",
        "ort": "Löningen"
    },
    {
        "code": "5433",
        "ort": "Badbergen"
    },
    {
        "code": "5434",
        "ort": "Essen"
    },
    {
        "code": "5435",
        "ort": "Berge"
    },
    {
        "code": "5436",
        "ort": "Nortrup"
    },
    {
        "code": "5437",
        "ort": "Menslage"
    },
    {
        "code": "5438",
        "ort": "Addrup,"
    },
    {
        "code": "5439",
        "ort": "Bersenbrück"
    },
    {
        "code": "544\n5441",
        "ort": "Diepholz\n5442"
    },
    {
        "code": "5441",
        "ort": "Diepholz"
    },
    {
        "code": "5442",
        "ort": "Barnstorf"
    },
    {
        "code": "5443",
        "ort": "Lemförde"
    },
    {
        "code": "5444",
        "ort": "Wagenfeld"
    },
    {
        "code": "5445",
        "ort": "Drebber"
    },
    {
        "code": "5446",
        "ort": "Rehden"
    },
    {
        "code": "5447",
        "ort": "Lembruch"
    },
    {
        "code": "5448",
        "ort": "Barver"
    },
    {
        "code": "545\n5451",
        "ort": "Ibbenbüren\n5452"
    },
    {
        "code": "5451",
        "ort": "Ibbenbüren"
    },
    {
        "code": "5452",
        "ort": "Mettingen"
    },
    {
        "code": "5453",
        "ort": "Recke"
    },
    {
        "code": "5454",
        "ort": "Riesenbeck"
    },
    {
        "code": "5455",
        "ort": "Brochterbeck"
    },
    {
        "code": "5456",
        "ort": "Velpe"
    },
    {
        "code": "5457",
        "ort": "Schale"
    },
    {
        "code": "5458",
        "ort": "Hopsten"
    },
    {
        "code": "5459",
        "ort": "Hörstel"
    },
    {
        "code": "546\n5461",
        "ort": "Bramsche\n5462"
    },
    {
        "code": "5461",
        "ort": "Bramsche"
    },
    {
        "code": "5462",
        "ort": "Ankum"
    },
    {
        "code": "5464",
        "ort": "Alfhausen"
    },
    {
        "code": "5465",
        "ort": "Neuenkirchen"
    },
    {
        "code": "5466",
        "ort": "Merzen"
    },
    {
        "code": "5468",
        "ort": "Engter"
    },
    {
        "code": "547\n5471",
        "ort": "Bohmte\n5472"
    },
    {
        "code": "5471",
        "ort": "Bohmte"
    },
    {
        "code": "5472",
        "ort": "Bad"
    },
    {
        "code": "5473",
        "ort": "Ostercappeln"
    },
    {
        "code": "5474",
        "ort": "Stemwede-Dielingen"
    },
    {
        "code": "5475",
        "ort": "Hunteburg"
    },
    {
        "code": "5476",
        "ort": "Venne"
    },
    {
        "code": "548\n5481",
        "ort": "Lengerich"
    },
    {
        "code": "5481",
        "ort": "Lengerich"
    },
    {
        "code": "5482",
        "ort": "Tecklenburg"
    },
    {
        "code": "5483",
        "ort": "Lienen"
    },
    {
        "code": "5484",
        "ort": "Kattenvenne"
    },
    {
        "code": "5485",
        "ort": "Ladbergen"
    },
    {
        "code": "549\n5491",
        "ort": "Damme"
    },
    {
        "code": "5491",
        "ort": "Damme"
    },
    {
        "code": "5492",
        "ort": "Steinfeld"
    },
    {
        "code": "5493",
        "ort": "Neuenkirchen"
    },
    {
        "code": "5494",
        "ort": "Holdorf"
    },
    {
        "code": "5495",
        "ort": "Vörden"
    },
    {
        "code": "5401",
        "ort": "Georgsmarienhütte"
    },
    {
        "code": "5402",
        "ort": "Bissendorf"
    },
    {
        "code": "5403",
        "ort": "Bad"
    },
    {
        "code": "5404",
        "ort": "Westerkappeln"
    },
    {
        "code": "5405",
        "ort": "Hasbergen"
    },
    {
        "code": "5406",
        "ort": "Belm"
    },
    {
        "code": "5407",
        "ort": "Wallenhorst"
    },
    {
        "code": "5409",
        "ort": "Hilter"
    },
    {
        "code": "5421",
        "ort": "Dissen"
    },
    {
        "code": "5422",
        "ort": "Melle"
    },
    {
        "code": "5423",
        "ort": "Versmold"
    },
    {
        "code": "5424",
        "ort": "Bad"
    },
    {
        "code": "5425",
        "ort": "Borgholzhausen"
    },
    {
        "code": "5426",
        "ort": "Glandorf"
    },
    {
        "code": "5427",
        "ort": "Buer"
    },
    {
        "code": "5428",
        "ort": "Neuenkirchen"
    },
    {
        "code": "5429",
        "ort": "Wellingholzhausen"
    },
    {
        "code": "5432",
        "ort": "Löningen"
    },
    {
        "code": "5433",
        "ort": "Badbergen"
    },
    {
        "code": "5434",
        "ort": "Essen"
    },
    {
        "code": "5435",
        "ort": "Berge"
    },
    {
        "code": "5436",
        "ort": "Nortrup"
    },
    {
        "code": "5437",
        "ort": "Menslage"
    },
    {
        "code": "5438",
        "ort": "Addrup,"
    },
    {
        "code": "5439",
        "ort": "Bersenbrück"
    },
    {
        "code": "5441",
        "ort": "Diepholz"
    },
    {
        "code": "5442",
        "ort": "Barnstorf"
    },
    {
        "code": "5443",
        "ort": "Lemförde"
    },
    {
        "code": "5444",
        "ort": "Wagenfeld"
    },
    {
        "code": "5445",
        "ort": "Drebber"
    },
    {
        "code": "5446",
        "ort": "Rehden"
    },
    {
        "code": "5447",
        "ort": "Lembruch"
    },
    {
        "code": "5448",
        "ort": "Barver"
    },
    {
        "code": "5451",
        "ort": "Ibbenbüren"
    },
    {
        "code": "5452",
        "ort": "Mettingen"
    },
    {
        "code": "5453",
        "ort": "Recke"
    },
    {
        "code": "5454",
        "ort": "Riesenbeck"
    },
    {
        "code": "5455",
        "ort": "Brochterbeck"
    },
    {
        "code": "5456",
        "ort": "Velpe"
    },
    {
        "code": "5457",
        "ort": "Schale"
    },
    {
        "code": "5458",
        "ort": "Hopsten"
    },
    {
        "code": "5459",
        "ort": "Hörstel"
    },
    {
        "code": "5461",
        "ort": "Bramsche"
    },
    {
        "code": "5462",
        "ort": "Ankum"
    },
    {
        "code": "5464",
        "ort": "Alfhausen"
    },
    {
        "code": "5465",
        "ort": "Neuenkirchen"
    },
    {
        "code": "5466",
        "ort": "Merzen"
    },
    {
        "code": "5468",
        "ort": "Engter"
    },
    {
        "code": "5471",
        "ort": "Bohmte"
    },
    {
        "code": "5472",
        "ort": "Bad"
    },
    {
        "code": "5473",
        "ort": "Ostercappeln"
    },
    {
        "code": "5474",
        "ort": "Stemwede-Dielingen"
    },
    {
        "code": "5475",
        "ort": "Hunteburg"
    },
    {
        "code": "5476",
        "ort": "Venne"
    },
    {
        "code": "5481",
        "ort": "Lengerich"
    },
    {
        "code": "5482",
        "ort": "Tecklenburg"
    },
    {
        "code": "5483",
        "ort": "Lienen"
    },
    {
        "code": "5484",
        "ort": "Kattenvenne"
    },
    {
        "code": "5485",
        "ort": "Ladbergen"
    },
    {
        "code": "5491",
        "ort": "Damme"
    },
    {
        "code": "5492",
        "ort": "Steinfeld"
    },
    {
        "code": "5493",
        "ort": "Neuenkirchen"
    },
    {
        "code": "5494",
        "ort": "Holdorf"
    },
    {
        "code": "5495",
        "ort": "Vörden"
    },
    {
        "code": "550\n5502",
        "ort": "Dransfeld\n5503"
    },
    {
        "code": "5502",
        "ort": "Dransfeld"
    },
    {
        "code": "5503",
        "ort": "Nörten-Hardenberg"
    },
    {
        "code": "5504",
        "ort": "Friedland"
    },
    {
        "code": "5505",
        "ort": "Hardegsen"
    },
    {
        "code": "5506",
        "ort": "Adelebsen"
    },
    {
        "code": "5507",
        "ort": "Ebergötzen"
    },
    {
        "code": "5508",
        "ort": "Rittmarshausen"
    },
    {
        "code": "5509",
        "ort": "Rosdorf"
    },
    {
        "code": "551",
        "ort": "Göttingen"
    },
    {
        "code": "552\n5520",
        "ort": "Braunlage\n5521"
    },
    {
        "code": "5520",
        "ort": "Braunlage"
    },
    {
        "code": "5521",
        "ort": "Herzberg"
    },
    {
        "code": "5522",
        "ort": "Osterode"
    },
    {
        "code": "5523",
        "ort": "Bad"
    },
    {
        "code": "5524",
        "ort": "Bad"
    },
    {
        "code": "5525",
        "ort": "Walkenried"
    },
    {
        "code": "5527",
        "ort": "Duderstadt"
    },
    {
        "code": "5528",
        "ort": "Gieboldehausen"
    },
    {
        "code": "5529",
        "ort": "Rhumspringe"
    },
    {
        "code": "553\n5531",
        "ort": "Holzminden\n5532"
    },
    {
        "code": "5531",
        "ort": "Holzminden"
    },
    {
        "code": "5532",
        "ort": "Stadtoldendorf"
    },
    {
        "code": "5533",
        "ort": "Bodenwerder"
    },
    {
        "code": "5534",
        "ort": "Eschershausen"
    },
    {
        "code": "5535",
        "ort": "Polle"
    },
    {
        "code": "5536",
        "ort": "Neuhaus"
    },
    {
        "code": "554\n5541",
        "ort": "Hann."
    },
    {
        "code": "5541",
        "ort": "Hann."
    },
    {
        "code": "5542",
        "ort": "Witzenhausen"
    },
    {
        "code": "5543",
        "ort": "Staufenberg"
    },
    {
        "code": "5544",
        "ort": "Reinhardshagen"
    },
    {
        "code": "5545",
        "ort": "Hedemünden"
    },
    {
        "code": "5546",
        "ort": "Scheden"
    },
    {
        "code": "555\n5551",
        "ort": "Northeim\n5552"
    },
    {
        "code": "5551",
        "ort": "Northeim"
    },
    {
        "code": "5552",
        "ort": "Katlenburg"
    },
    {
        "code": "5553",
        "ort": "Kalefeld"
    },
    {
        "code": "5554",
        "ort": "Moringen"
    },
    {
        "code": "5555",
        "ort": "Fredelsloh"
    },
    {
        "code": "5556",
        "ort": "Lindau"
    },
    {
        "code": "556\n5561",
        "ort": "Einbeck\n5562"
    },
    {
        "code": "5561",
        "ort": "Einbeck"
    },
    {
        "code": "5562",
        "ort": "Markoldendorf"
    },
    {
        "code": "5563",
        "ort": "Kreiensen"
    },
    {
        "code": "5564",
        "ort": "Dassel"
    },
    {
        "code": "5565",
        "ort": "Wenzen"
    },
    {
        "code": "557\n5571",
        "ort": "Uslar\n5572"
    },
    {
        "code": "5571",
        "ort": "Uslar"
    },
    {
        "code": "5572",
        "ort": "Bodenfelde"
    },
    {
        "code": "5573",
        "ort": "Volpriehausen"
    },
    {
        "code": "5574",
        "ort": "Oberweser"
    },
    {
        "code": "558\n5582",
        "ort": "Sankt"
    },
    {
        "code": "5582",
        "ort": "Sankt"
    },
    {
        "code": "5583",
        "ort": "Hohegeiß"
    },
    {
        "code": "5584",
        "ort": "Hattorf"
    },
    {
        "code": "5585",
        "ort": "Sieber"
    },
    {
        "code": "559\n5592",
        "ort": "Gleichen-Bremke\n5593"
    },
    {
        "code": "5592",
        "ort": "Gleichen-Bremke"
    },
    {
        "code": "5593",
        "ort": "Lenglern"
    },
    {
        "code": "5594",
        "ort": "Reyershausen"
    },
    {
        "code": "5502",
        "ort": "Dransfeld"
    },
    {
        "code": "5503",
        "ort": "Nörten-Hardenberg"
    },
    {
        "code": "5504",
        "ort": "Friedland"
    },
    {
        "code": "5505",
        "ort": "Hardegsen"
    },
    {
        "code": "5506",
        "ort": "Adelebsen"
    },
    {
        "code": "5507",
        "ort": "Ebergötzen"
    },
    {
        "code": "5508",
        "ort": "Rittmarshausen"
    },
    {
        "code": "5509",
        "ort": "Rosdorf"
    },
    {
        "code": "5520",
        "ort": "Braunlage"
    },
    {
        "code": "5521",
        "ort": "Herzberg"
    },
    {
        "code": "5522",
        "ort": "Osterode"
    },
    {
        "code": "5523",
        "ort": "Bad"
    },
    {
        "code": "5524",
        "ort": "Bad"
    },
    {
        "code": "5525",
        "ort": "Walkenried"
    },
    {
        "code": "5527",
        "ort": "Duderstadt"
    },
    {
        "code": "5528",
        "ort": "Gieboldehausen"
    },
    {
        "code": "5529",
        "ort": "Rhumspringe"
    },
    {
        "code": "5531",
        "ort": "Holzminden"
    },
    {
        "code": "5532",
        "ort": "Stadtoldendorf"
    },
    {
        "code": "5533",
        "ort": "Bodenwerder"
    },
    {
        "code": "5534",
        "ort": "Eschershausen"
    },
    {
        "code": "5535",
        "ort": "Polle"
    },
    {
        "code": "5536",
        "ort": "Neuhaus"
    },
    {
        "code": "5541",
        "ort": "Hann."
    },
    {
        "code": "5542",
        "ort": "Witzenhausen"
    },
    {
        "code": "5543",
        "ort": "Staufenberg"
    },
    {
        "code": "5544",
        "ort": "Reinhardshagen"
    },
    {
        "code": "5545",
        "ort": "Hedemünden"
    },
    {
        "code": "5546",
        "ort": "Scheden"
    },
    {
        "code": "5551",
        "ort": "Northeim"
    },
    {
        "code": "5552",
        "ort": "Katlenburg"
    },
    {
        "code": "5553",
        "ort": "Kalefeld"
    },
    {
        "code": "5554",
        "ort": "Moringen"
    },
    {
        "code": "5555",
        "ort": "Fredelsloh"
    },
    {
        "code": "5556",
        "ort": "Lindau"
    },
    {
        "code": "5561",
        "ort": "Einbeck"
    },
    {
        "code": "5562",
        "ort": "Markoldendorf"
    },
    {
        "code": "5563",
        "ort": "Kreiensen"
    },
    {
        "code": "5564",
        "ort": "Dassel"
    },
    {
        "code": "5565",
        "ort": "Wenzen"
    },
    {
        "code": "5571",
        "ort": "Uslar"
    },
    {
        "code": "5572",
        "ort": "Bodenfelde"
    },
    {
        "code": "5573",
        "ort": "Volpriehausen"
    },
    {
        "code": "5574",
        "ort": "Oberweser"
    },
    {
        "code": "5582",
        "ort": "Sankt"
    },
    {
        "code": "5583",
        "ort": "Hohegeiß"
    },
    {
        "code": "5584",
        "ort": "Hattorf"
    },
    {
        "code": "5585",
        "ort": "Sieber"
    },
    {
        "code": "5592",
        "ort": "Gleichen-Bremke"
    },
    {
        "code": "5593",
        "ort": "Lenglern"
    },
    {
        "code": "5594",
        "ort": "Reyershausen"
    },
    {
        "code": "560\n5601",
        "ort": "Schauenburg\n5602"
    },
    {
        "code": "5601",
        "ort": "Schauenburg"
    },
    {
        "code": "5602",
        "ort": "Hessisch"
    },
    {
        "code": "5603",
        "ort": "Gudensberg"
    },
    {
        "code": "5604",
        "ort": "Großalmerode"
    },
    {
        "code": "5605",
        "ort": "Kaufungen"
    },
    {
        "code": "5606",
        "ort": "Zierenberg"
    },
    {
        "code": "5607",
        "ort": "Fuldatal"
    },
    {
        "code": "5608",
        "ort": "Söhrewald"
    },
    {
        "code": "5609",
        "ort": "Ahnatal"
    },
    {
        "code": "561",
        "ort": "Kassel"
    },
    {
        "code": "562\n5621",
        "ort": "Bad"
    },
    {
        "code": "5621",
        "ort": "Bad"
    },
    {
        "code": "5622",
        "ort": "Fritzlar"
    },
    {
        "code": "5623",
        "ort": "Edertal"
    },
    {
        "code": "5624",
        "ort": "Emstal"
    },
    {
        "code": "5625",
        "ort": "Naumburg"
    },
    {
        "code": "5626",
        "ort": "Zwesten"
    },
    {
        "code": "563\n5631",
        "ort": "Korbach\n5632"
    },
    {
        "code": "5631",
        "ort": "Korbach"
    },
    {
        "code": "5632",
        "ort": "Willingen"
    },
    {
        "code": "5633",
        "ort": "Diemelsee"
    },
    {
        "code": "5634",
        "ort": "Waldeck"
    },
    {
        "code": "5635",
        "ort": "Voehl"
    },
    {
        "code": "5636",
        "ort": "Lichtenfels-Goddelsheim"
    },
    {
        "code": "564\n5641",
        "ort": "Warburg\n5642"
    },
    {
        "code": "5641",
        "ort": "Warburg"
    },
    {
        "code": "5642",
        "ort": "Scherfede"
    },
    {
        "code": "5643",
        "ort": "Borgentreich"
    },
    {
        "code": "5644",
        "ort": "Peckelsheim"
    },
    {
        "code": "5645",
        "ort": "Borgholz"
    },
    {
        "code": "5646",
        "ort": "Willebadessen"
    },
    {
        "code": "5647",
        "ort": "Kleinenberg"
    },
    {
        "code": "5648",
        "ort": "Gehrden"
    },
    {
        "code": "565\n5650",
        "ort": "Cornberg\n5651"
    },
    {
        "code": "5650",
        "ort": "Cornberg"
    },
    {
        "code": "5651",
        "ort": "Eschwege"
    },
    {
        "code": "5652",
        "ort": "Bad"
    },
    {
        "code": "5653",
        "ort": "Sontra"
    },
    {
        "code": "5654",
        "ort": "Herleshausen"
    },
    {
        "code": "5655",
        "ort": "Wanfried"
    },
    {
        "code": "5656",
        "ort": "Waldkappel"
    },
    {
        "code": "5657",
        "ort": "Meißner"
    },
    {
        "code": "5658",
        "ort": "Wehretal"
    },
    {
        "code": "5659",
        "ort": "Ringgau"
    },
    {
        "code": "566\n5661",
        "ort": "Melsungen\n5662"
    },
    {
        "code": "5661",
        "ort": "Melsungen"
    },
    {
        "code": "5662",
        "ort": "Felsberg"
    },
    {
        "code": "5663",
        "ort": "Spangenberg"
    },
    {
        "code": "5664",
        "ort": "Morschen"
    },
    {
        "code": "5665",
        "ort": "Guxhagen"
    },
    {
        "code": "567\n5671",
        "ort": "Hofgeismar\n5672"
    },
    {
        "code": "5671",
        "ort": "Hofgeismar"
    },
    {
        "code": "5672",
        "ort": "Bad"
    },
    {
        "code": "5673",
        "ort": "Immenhausen"
    },
    {
        "code": "5674",
        "ort": "Grebenstein"
    },
    {
        "code": "5675",
        "ort": "Trendelburg"
    },
    {
        "code": "5676",
        "ort": "Liebenau"
    },
    {
        "code": "5677",
        "ort": "Calden-Westuffeln"
    },
    {
        "code": "568\n5681",
        "ort": "Homberg"
    },
    {
        "code": "5681",
        "ort": "Homberg"
    },
    {
        "code": "5682",
        "ort": "Borken"
    },
    {
        "code": "5683",
        "ort": "Wabern"
    },
    {
        "code": "5684",
        "ort": "Frielendorf"
    },
    {
        "code": "5685",
        "ort": "Knüllwald"
    },
    {
        "code": "5686",
        "ort": "Schwarzenborn"
    },
    {
        "code": "569\n5691",
        "ort": "Bad"
    },
    {
        "code": "5691",
        "ort": "Bad"
    },
    {
        "code": "5692",
        "ort": "Wolfhagen"
    },
    {
        "code": "5693",
        "ort": "Volkmarsen"
    },
    {
        "code": "5694",
        "ort": "Diemelstadt"
    },
    {
        "code": "5695",
        "ort": "Twistetal"
    },
    {
        "code": "5696",
        "ort": "Landau"
    },
    {
        "code": "5601",
        "ort": "Schauenburg"
    },
    {
        "code": "5602",
        "ort": "Hessisch"
    },
    {
        "code": "5603",
        "ort": "Gudensberg"
    },
    {
        "code": "5604",
        "ort": "Großalmerode"
    },
    {
        "code": "5605",
        "ort": "Kaufungen"
    },
    {
        "code": "5606",
        "ort": "Zierenberg"
    },
    {
        "code": "5607",
        "ort": "Fuldatal"
    },
    {
        "code": "5608",
        "ort": "Söhrewald"
    },
    {
        "code": "5609",
        "ort": "Ahnatal"
    },
    {
        "code": "5621",
        "ort": "Bad"
    },
    {
        "code": "5622",
        "ort": "Fritzlar"
    },
    {
        "code": "5623",
        "ort": "Edertal"
    },
    {
        "code": "5624",
        "ort": "Emstal"
    },
    {
        "code": "5625",
        "ort": "Naumburg"
    },
    {
        "code": "5626",
        "ort": "Zwesten"
    },
    {
        "code": "5631",
        "ort": "Korbach"
    },
    {
        "code": "5632",
        "ort": "Willingen"
    },
    {
        "code": "5633",
        "ort": "Diemelsee"
    },
    {
        "code": "5634",
        "ort": "Waldeck"
    },
    {
        "code": "5635",
        "ort": "Voehl"
    },
    {
        "code": "5636",
        "ort": "Lichtenfels-Goddelsheim"
    },
    {
        "code": "5641",
        "ort": "Warburg"
    },
    {
        "code": "5642",
        "ort": "Scherfede"
    },
    {
        "code": "5643",
        "ort": "Borgentreich"
    },
    {
        "code": "5644",
        "ort": "Peckelsheim"
    },
    {
        "code": "5645",
        "ort": "Borgholz"
    },
    {
        "code": "5646",
        "ort": "Willebadessen"
    },
    {
        "code": "5647",
        "ort": "Kleinenberg"
    },
    {
        "code": "5648",
        "ort": "Gehrden"
    },
    {
        "code": "5650",
        "ort": "Cornberg"
    },
    {
        "code": "5651",
        "ort": "Eschwege"
    },
    {
        "code": "5652",
        "ort": "Bad"
    },
    {
        "code": "5653",
        "ort": "Sontra"
    },
    {
        "code": "5654",
        "ort": "Herleshausen"
    },
    {
        "code": "5655",
        "ort": "Wanfried"
    },
    {
        "code": "5656",
        "ort": "Waldkappel"
    },
    {
        "code": "5657",
        "ort": "Meißner"
    },
    {
        "code": "5658",
        "ort": "Wehretal"
    },
    {
        "code": "5659",
        "ort": "Ringgau"
    },
    {
        "code": "5661",
        "ort": "Melsungen"
    },
    {
        "code": "5662",
        "ort": "Felsberg"
    },
    {
        "code": "5663",
        "ort": "Spangenberg"
    },
    {
        "code": "5664",
        "ort": "Morschen"
    },
    {
        "code": "5665",
        "ort": "Guxhagen"
    },
    {
        "code": "5671",
        "ort": "Hofgeismar"
    },
    {
        "code": "5672",
        "ort": "Bad"
    },
    {
        "code": "5673",
        "ort": "Immenhausen"
    },
    {
        "code": "5674",
        "ort": "Grebenstein"
    },
    {
        "code": "5675",
        "ort": "Trendelburg"
    },
    {
        "code": "5676",
        "ort": "Liebenau"
    },
    {
        "code": "5677",
        "ort": "Calden-Westuffeln"
    },
    {
        "code": "5681",
        "ort": "Homberg"
    },
    {
        "code": "5682",
        "ort": "Borken"
    },
    {
        "code": "5683",
        "ort": "Wabern"
    },
    {
        "code": "5684",
        "ort": "Frielendorf"
    },
    {
        "code": "5685",
        "ort": "Knüllwald"
    },
    {
        "code": "5686",
        "ort": "Schwarzenborn"
    },
    {
        "code": "5691",
        "ort": "Bad"
    },
    {
        "code": "5692",
        "ort": "Wolfhagen"
    },
    {
        "code": "5693",
        "ort": "Volkmarsen"
    },
    {
        "code": "5694",
        "ort": "Diemelstadt"
    },
    {
        "code": "5695",
        "ort": "Twistetal"
    },
    {
        "code": "5696",
        "ort": "Landau"
    },
    {
        "code": "570\n5702",
        "ort": "Lahde"
    },
    {
        "code": "5702",
        "ort": "Lahde"
    },
    {
        "code": "5703",
        "ort": "Hille"
    },
    {
        "code": "5704",
        "ort": "Friedewalde"
    },
    {
        "code": "5705",
        "ort": "Windheim"
    },
    {
        "code": "5706",
        "ort": "Porta"
    },
    {
        "code": "5707",
        "ort": "Petershagen"
    },
    {
        "code": "571",
        "ort": "Minden"
    },
    {
        "code": "572\n5721",
        "ort": "Stadthagen\n5722"
    },
    {
        "code": "5721",
        "ort": "Stadthagen"
    },
    {
        "code": "5722",
        "ort": "Bückeburg"
    },
    {
        "code": "5723",
        "ort": "Bad"
    },
    {
        "code": "5724",
        "ort": "Obernkirchen"
    },
    {
        "code": "5725",
        "ort": "Lindhorst"
    },
    {
        "code": "5726",
        "ort": "Wiedensahl"
    },
    {
        "code": "573\n5731",
        "ort": "Bad"
    },
    {
        "code": "5731",
        "ort": "Bad"
    },
    {
        "code": "5732",
        "ort": "Löhne"
    },
    {
        "code": "5733",
        "ort": "Vlotho"
    },
    {
        "code": "5734",
        "ort": "Bergkirchen"
    },
    {
        "code": "574\n5741",
        "ort": "Lübbecke\n5742"
    },
    {
        "code": "5741",
        "ort": "Lübbecke"
    },
    {
        "code": "5742",
        "ort": "Preußisch"
    },
    {
        "code": "5743",
        "ort": "Gestringen"
    },
    {
        "code": "5744",
        "ort": "Hüllhorst"
    },
    {
        "code": "5745",
        "ort": "Levern"
    },
    {
        "code": "5746",
        "ort": "Rödinghausen"
    },
    {
        "code": "575\n5751",
        "ort": "Rinteln\n5752"
    },
    {
        "code": "5751",
        "ort": "Rinteln"
    },
    {
        "code": "5752",
        "ort": "Hattendorf"
    },
    {
        "code": "5753",
        "ort": "Bernsen"
    },
    {
        "code": "5754",
        "ort": "Bremke"
    },
    {
        "code": "5755",
        "ort": "Varenholz"
    },
    {
        "code": "576\n5761",
        "ort": "Stolzenau\n5764"
    },
    {
        "code": "5761",
        "ort": "Stolzenau"
    },
    {
        "code": "5764",
        "ort": "Steyerberg"
    },
    {
        "code": "5765",
        "ort": "Raddestorf"
    },
    {
        "code": "5766",
        "ort": "Loccum"
    },
    {
        "code": "5767",
        "ort": "Warmsen"
    },
    {
        "code": "5768",
        "ort": "Heimsen"
    },
    {
        "code": "5769",
        "ort": "Voigtei"
    },
    {
        "code": "577\n5771",
        "ort": "Rahden"
    },
    {
        "code": "5771",
        "ort": "Rahden"
    },
    {
        "code": "5772",
        "ort": "Espelkamp"
    },
    {
        "code": "5773",
        "ort": "Wehdem"
    },
    {
        "code": "5774",
        "ort": "Ströhen"
    },
    {
        "code": "5775",
        "ort": "Diepenau"
    },
    {
        "code": "5776",
        "ort": "Preußisch"
    },
    {
        "code": "5777",
        "ort": "Essern"
    },
    {
        "code": "5702",
        "ort": "Lahde"
    },
    {
        "code": "5703",
        "ort": "Hille"
    },
    {
        "code": "5704",
        "ort": "Friedewalde"
    },
    {
        "code": "5705",
        "ort": "Windheim"
    },
    {
        "code": "5706",
        "ort": "Porta"
    },
    {
        "code": "5707",
        "ort": "Petershagen"
    },
    {
        "code": "5721",
        "ort": "Stadthagen"
    },
    {
        "code": "5722",
        "ort": "Bückeburg"
    },
    {
        "code": "5723",
        "ort": "Bad"
    },
    {
        "code": "5724",
        "ort": "Obernkirchen"
    },
    {
        "code": "5725",
        "ort": "Lindhorst"
    },
    {
        "code": "5726",
        "ort": "Wiedensahl"
    },
    {
        "code": "5731",
        "ort": "Bad"
    },
    {
        "code": "5732",
        "ort": "Löhne"
    },
    {
        "code": "5733",
        "ort": "Vlotho"
    },
    {
        "code": "5734",
        "ort": "Bergkirchen"
    },
    {
        "code": "5741",
        "ort": "Lübbecke"
    },
    {
        "code": "5742",
        "ort": "Preußisch"
    },
    {
        "code": "5743",
        "ort": "Gestringen"
    },
    {
        "code": "5744",
        "ort": "Hüllhorst"
    },
    {
        "code": "5745",
        "ort": "Levern"
    },
    {
        "code": "5746",
        "ort": "Rödinghausen"
    },
    {
        "code": "5751",
        "ort": "Rinteln"
    },
    {
        "code": "5752",
        "ort": "Hattendorf"
    },
    {
        "code": "5753",
        "ort": "Bernsen"
    },
    {
        "code": "5754",
        "ort": "Bremke"
    },
    {
        "code": "5755",
        "ort": "Varenholz"
    },
    {
        "code": "5761",
        "ort": "Stolzenau"
    },
    {
        "code": "5764",
        "ort": "Steyerberg"
    },
    {
        "code": "5765",
        "ort": "Raddestorf"
    },
    {
        "code": "5766",
        "ort": "Loccum"
    },
    {
        "code": "5767",
        "ort": "Warmsen"
    },
    {
        "code": "5768",
        "ort": "Heimsen"
    },
    {
        "code": "5769",
        "ort": "Voigtei"
    },
    {
        "code": "5771",
        "ort": "Rahden"
    },
    {
        "code": "5772",
        "ort": "Espelkamp"
    },
    {
        "code": "5773",
        "ort": "Wehdem"
    },
    {
        "code": "5774",
        "ort": "Ströhen"
    },
    {
        "code": "5775",
        "ort": "Diepenau"
    },
    {
        "code": "5776",
        "ort": "Preußisch"
    },
    {
        "code": "5777",
        "ort": "Essern"
    },
    {
        "code": "580\n5802",
        "ort": "Wrestedt\n5803"
    },
    {
        "code": "5802",
        "ort": "Wrestedt"
    },
    {
        "code": "5803",
        "ort": "Rosche"
    },
    {
        "code": "5804",
        "ort": "Rätzlingen"
    },
    {
        "code": "5805",
        "ort": "Oetzen"
    },
    {
        "code": "5806",
        "ort": "Barum"
    },
    {
        "code": "5807",
        "ort": "Altenmedingen"
    },
    {
        "code": "581",
        "ort": "Uelzen"
    },
    {
        "code": "582\n5820",
        "ort": "Suhlendorf\n5821"
    },
    {
        "code": "5820",
        "ort": "Suhlendorf"
    },
    {
        "code": "5821",
        "ort": "Bad"
    },
    {
        "code": "5822",
        "ort": "Ebstorf"
    },
    {
        "code": "5823",
        "ort": "Bienenbüttel"
    },
    {
        "code": "5824",
        "ort": "Bad"
    },
    {
        "code": "5825",
        "ort": "Wieren"
    },
    {
        "code": "5826",
        "ort": "Suderburg"
    },
    {
        "code": "5827",
        "ort": "Unterlüß"
    },
    {
        "code": "5828",
        "ort": "Himbergen"
    },
    {
        "code": "5829",
        "ort": "Wriedel"
    },
    {
        "code": "583\n5831",
        "ort": "Wittingen\n5832"
    },
    {
        "code": "5831",
        "ort": "Wittingen"
    },
    {
        "code": "5832",
        "ort": "Hankensbüttel"
    },
    {
        "code": "5833",
        "ort": "Brome"
    },
    {
        "code": "5834",
        "ort": "Knesebeck"
    },
    {
        "code": "5835",
        "ort": "Wahrenholz"
    },
    {
        "code": "5836",
        "ort": "Radenbeck"
    },
    {
        "code": "5837",
        "ort": "Sprakensehl"
    },
    {
        "code": "5838",
        "ort": "Groß"
    },
    {
        "code": "5839",
        "ort": "Ohrdorf"
    },
    {
        "code": "584\n5840",
        "ort": "Schnackenburg\n5841"
    },
    {
        "code": "5840",
        "ort": "Schnackenburg"
    },
    {
        "code": "5841",
        "ort": "Lüchow"
    },
    {
        "code": "5842",
        "ort": "Schnega"
    },
    {
        "code": "5843",
        "ort": "Wustrow"
    },
    {
        "code": "5844",
        "ort": "Clenze"
    },
    {
        "code": "5845",
        "ort": "Bergen"
    },
    {
        "code": "5846",
        "ort": "Gartow"
    },
    {
        "code": "5848",
        "ort": "Trebel"
    },
    {
        "code": "5849",
        "ort": "Waddeweitz"
    },
    {
        "code": "585\n5850",
        "ort": "Neetze\n5851"
    },
    {
        "code": "5850",
        "ort": "Neetze"
    },
    {
        "code": "5851",
        "ort": "Dahlenburg"
    },
    {
        "code": "5852",
        "ort": "Bleckede"
    },
    {
        "code": "5853",
        "ort": "Neu"
    },
    {
        "code": "5854",
        "ort": "Barskamp"
    },
    {
        "code": "5855",
        "ort": "Nahrendorf"
    },
    {
        "code": "5857",
        "ort": "Brackede"
    },
    {
        "code": "5858",
        "ort": "Wietzetze"
    },
    {
        "code": "5859",
        "ort": "Thomasburg"
    },
    {
        "code": "586\n5861",
        "ort": "Dannenberg"
    },
    {
        "code": "5861",
        "ort": "Dannenberg"
    },
    {
        "code": "5862",
        "ort": "Hitzacker"
    },
    {
        "code": "5863",
        "ort": "Zernien"
    },
    {
        "code": "5864",
        "ort": "Jameln"
    },
    {
        "code": "5865",
        "ort": "Gusborn"
    },
    {
        "code": "587\n5872",
        "ort": "Stötze\n5874"
    },
    {
        "code": "5872",
        "ort": "Stötze"
    },
    {
        "code": "5874",
        "ort": "Soltendieck"
    },
    {
        "code": "5875",
        "ort": "Emmendorf"
    },
    {
        "code": "588\n5882",
        "ort": "Gorleben\n5883"
    },
    {
        "code": "5882",
        "ort": "Gorleben"
    },
    {
        "code": "5883",
        "ort": "Lemgow"
    },
    {
        "code": "5802",
        "ort": "Wrestedt"
    },
    {
        "code": "5803",
        "ort": "Rosche"
    },
    {
        "code": "5804",
        "ort": "Rätzlingen"
    },
    {
        "code": "5805",
        "ort": "Oetzen"
    },
    {
        "code": "5806",
        "ort": "Barum"
    },
    {
        "code": "5807",
        "ort": "Altenmedingen"
    },
    {
        "code": "5820",
        "ort": "Suhlendorf"
    },
    {
        "code": "5821",
        "ort": "Bad"
    },
    {
        "code": "5822",
        "ort": "Ebstorf"
    },
    {
        "code": "5823",
        "ort": "Bienenbüttel"
    },
    {
        "code": "5824",
        "ort": "Bad"
    },
    {
        "code": "5825",
        "ort": "Wieren"
    },
    {
        "code": "5826",
        "ort": "Suderburg"
    },
    {
        "code": "5827",
        "ort": "Unterlüß"
    },
    {
        "code": "5828",
        "ort": "Himbergen"
    },
    {
        "code": "5829",
        "ort": "Wriedel"
    },
    {
        "code": "5831",
        "ort": "Wittingen"
    },
    {
        "code": "5832",
        "ort": "Hankensbüttel"
    },
    {
        "code": "5833",
        "ort": "Brome"
    },
    {
        "code": "5834",
        "ort": "Knesebeck"
    },
    {
        "code": "5835",
        "ort": "Wahrenholz"
    },
    {
        "code": "5836",
        "ort": "Radenbeck"
    },
    {
        "code": "5837",
        "ort": "Sprakensehl"
    },
    {
        "code": "5838",
        "ort": "Groß"
    },
    {
        "code": "5839",
        "ort": "Ohrdorf"
    },
    {
        "code": "5840",
        "ort": "Schnackenburg"
    },
    {
        "code": "5841",
        "ort": "Lüchow"
    },
    {
        "code": "5842",
        "ort": "Schnega"
    },
    {
        "code": "5843",
        "ort": "Wustrow"
    },
    {
        "code": "5844",
        "ort": "Clenze"
    },
    {
        "code": "5845",
        "ort": "Bergen"
    },
    {
        "code": "5846",
        "ort": "Gartow"
    },
    {
        "code": "5848",
        "ort": "Trebel"
    },
    {
        "code": "5849",
        "ort": "Waddeweitz"
    },
    {
        "code": "5850",
        "ort": "Neetze"
    },
    {
        "code": "5851",
        "ort": "Dahlenburg"
    },
    {
        "code": "5852",
        "ort": "Bleckede"
    },
    {
        "code": "5853",
        "ort": "Neu"
    },
    {
        "code": "5854",
        "ort": "Barskamp"
    },
    {
        "code": "5855",
        "ort": "Nahrendorf"
    },
    {
        "code": "5857",
        "ort": "Brackede"
    },
    {
        "code": "5858",
        "ort": "Wietzetze"
    },
    {
        "code": "5859",
        "ort": "Thomasburg"
    },
    {
        "code": "5861",
        "ort": "Dannenberg"
    },
    {
        "code": "5862",
        "ort": "Hitzacker"
    },
    {
        "code": "5863",
        "ort": "Zernien"
    },
    {
        "code": "5864",
        "ort": "Jameln"
    },
    {
        "code": "5865",
        "ort": "Gusborn"
    },
    {
        "code": "5872",
        "ort": "Stötze"
    },
    {
        "code": "5874",
        "ort": "Soltendieck"
    },
    {
        "code": "5875",
        "ort": "Emmendorf"
    },
    {
        "code": "5882",
        "ort": "Gorleben"
    },
    {
        "code": "5883",
        "ort": "Lemgow"
    },
    {
        "code": "590\n5901",
        "ort": "Fürstenau\n5902"
    },
    {
        "code": "5901",
        "ort": "Fürstenau"
    },
    {
        "code": "5902",
        "ort": "Freren"
    },
    {
        "code": "5903",
        "ort": "Emsbüren"
    },
    {
        "code": "5904",
        "ort": "Lengerich"
    },
    {
        "code": "5905",
        "ort": "Beesten"
    },
    {
        "code": "5906",
        "ort": "Lünne"
    },
    {
        "code": "5907",
        "ort": "Geeste"
    },
    {
        "code": "5908",
        "ort": "Lohne"
    },
    {
        "code": "5909",
        "ort": "Wettrup"
    },
    {
        "code": "591",
        "ort": "Lingen"
    },
    {
        "code": "592\n5921",
        "ort": "Nordhorn\n5922"
    },
    {
        "code": "5921",
        "ort": "Nordhorn"
    },
    {
        "code": "5922",
        "ort": "Bad"
    },
    {
        "code": "5923",
        "ort": "Schüttorf"
    },
    {
        "code": "5924",
        "ort": "Gildehaus"
    },
    {
        "code": "5925",
        "ort": "Wietmarschen"
    },
    {
        "code": "5926",
        "ort": "Engden"
    },
    {
        "code": "593\n5931",
        "ort": "Meppen\n5932"
    },
    {
        "code": "5931",
        "ort": "Meppen"
    },
    {
        "code": "5932",
        "ort": "Haren"
    },
    {
        "code": "5933",
        "ort": "Lathen"
    },
    {
        "code": "5934",
        "ort": "Rütenbrock"
    },
    {
        "code": "5935",
        "ort": "Schöninghsdorf"
    },
    {
        "code": "5936",
        "ort": "Twist"
    },
    {
        "code": "5937",
        "ort": "Groß"
    },
    {
        "code": "5939",
        "ort": "Sustrum"
    },
    {
        "code": "594\n5941",
        "ort": "Neuenhaus"
    },
    {
        "code": "5941",
        "ort": "Neuenhaus"
    },
    {
        "code": "5942",
        "ort": "Uelsen"
    },
    {
        "code": "5943",
        "ort": "Emlichheim"
    },
    {
        "code": "5944",
        "ort": "Hoogstede"
    },
    {
        "code": "5946",
        "ort": "Georgsdorf"
    },
    {
        "code": "5947",
        "ort": "Laar"
    },
    {
        "code": "5948",
        "ort": "Itterbeck"
    },
    {
        "code": "595\n5951",
        "ort": "Werlte\n5952"
    },
    {
        "code": "5951",
        "ort": "Werlte"
    },
    {
        "code": "5952",
        "ort": "Sögel"
    },
    {
        "code": "5954",
        "ort": "Lorup"
    },
    {
        "code": "5955",
        "ort": "Esterwegen"
    },
    {
        "code": "5956",
        "ort": "Rastdorf"
    },
    {
        "code": "5957",
        "ort": "Lindern"
    },
    {
        "code": "596\n5961",
        "ort": "Haselünne\n5962"
    },
    {
        "code": "5961",
        "ort": "Haselünne"
    },
    {
        "code": "5962",
        "ort": "Herzlake"
    },
    {
        "code": "5963",
        "ort": "Bawinkel"
    },
    {
        "code": "5964",
        "ort": "Lähden"
    },
    {
        "code": "5965",
        "ort": "Klein"
    },
    {
        "code": "5966",
        "ort": "Apeldorn"
    },
    {
        "code": "597\n5971",
        "ort": "Rheine\n5973"
    },
    {
        "code": "5971",
        "ort": "Rheine"
    },
    {
        "code": "5973",
        "ort": "Neuenkirchen"
    },
    {
        "code": "5975",
        "ort": "Mesum"
    },
    {
        "code": "5976",
        "ort": "Salzbergen"
    },
    {
        "code": "5977",
        "ort": "Spelle"
    },
    {
        "code": "5978",
        "ort": "Dreierwalde"
    },
    {
        "code": "5901",
        "ort": "Fürstenau"
    },
    {
        "code": "5902",
        "ort": "Freren"
    },
    {
        "code": "5903",
        "ort": "Emsbüren"
    },
    {
        "code": "5904",
        "ort": "Lengerich"
    },
    {
        "code": "5905",
        "ort": "Beesten"
    },
    {
        "code": "5906",
        "ort": "Lünne"
    },
    {
        "code": "5907",
        "ort": "Geeste"
    },
    {
        "code": "5908",
        "ort": "Lohne"
    },
    {
        "code": "5909",
        "ort": "Wettrup"
    },
    {
        "code": "5921",
        "ort": "Nordhorn"
    },
    {
        "code": "5922",
        "ort": "Bad"
    },
    {
        "code": "5923",
        "ort": "Schüttorf"
    },
    {
        "code": "5924",
        "ort": "Gildehaus"
    },
    {
        "code": "5925",
        "ort": "Wietmarschen"
    },
    {
        "code": "5926",
        "ort": "Engden"
    },
    {
        "code": "5931",
        "ort": "Meppen"
    },
    {
        "code": "5932",
        "ort": "Haren"
    },
    {
        "code": "5933",
        "ort": "Lathen"
    },
    {
        "code": "5934",
        "ort": "Rütenbrock"
    },
    {
        "code": "5935",
        "ort": "Schöninghsdorf"
    },
    {
        "code": "5936",
        "ort": "Twist"
    },
    {
        "code": "5937",
        "ort": "Groß"
    },
    {
        "code": "5939",
        "ort": "Sustrum"
    },
    {
        "code": "5941",
        "ort": "Neuenhaus"
    },
    {
        "code": "5942",
        "ort": "Uelsen"
    },
    {
        "code": "5943",
        "ort": "Emlichheim"
    },
    {
        "code": "5944",
        "ort": "Hoogstede"
    },
    {
        "code": "5946",
        "ort": "Georgsdorf"
    },
    {
        "code": "5947",
        "ort": "Laar"
    },
    {
        "code": "5948",
        "ort": "Itterbeck"
    },
    {
        "code": "5951",
        "ort": "Werlte"
    },
    {
        "code": "5952",
        "ort": "Sögel"
    },
    {
        "code": "5954",
        "ort": "Lorup"
    },
    {
        "code": "5955",
        "ort": "Esterwegen"
    },
    {
        "code": "5956",
        "ort": "Rastdorf"
    },
    {
        "code": "5957",
        "ort": "Lindern"
    },
    {
        "code": "5961",
        "ort": "Haselünne"
    },
    {
        "code": "5962",
        "ort": "Herzlake"
    },
    {
        "code": "5963",
        "ort": "Bawinkel"
    },
    {
        "code": "5964",
        "ort": "Lähden"
    },
    {
        "code": "5965",
        "ort": "Klein"
    },
    {
        "code": "5966",
        "ort": "Apeldorn"
    },
    {
        "code": "5971",
        "ort": "Rheine"
    },
    {
        "code": "5973",
        "ort": "Neuenkirchen"
    },
    {
        "code": "5975",
        "ort": "Mesum"
    },
    {
        "code": "5976",
        "ort": "Salzbergen"
    },
    {
        "code": "5977",
        "ort": "Spelle"
    },
    {
        "code": "5978",
        "ort": "Dreierwalde"
    },
    {
        "code": "600\n6002",
        "ort": "Ober-Mörlen\n6003"
    },
    {
        "code": "6002",
        "ort": "Ober-Mörlen"
    },
    {
        "code": "6003",
        "ort": "Rosbach"
    },
    {
        "code": "6004",
        "ort": "Lich-Eberstadt"
    },
    {
        "code": "6007",
        "ort": "Rosbach-Rodheim,"
    },
    {
        "code": "6008",
        "ort": "Echzell"
    },
    {
        "code": "602\n6020",
        "ort": "Heigenbrücken\n6021"
    },
    {
        "code": "6020",
        "ort": "Heigenbrücken"
    },
    {
        "code": "6021",
        "ort": "Aschaffenburg"
    },
    {
        "code": "6022",
        "ort": "Obernburg"
    },
    {
        "code": "6023",
        "ort": "Alzenau"
    },
    {
        "code": "6024",
        "ort": "Schöllkrippen,"
    },
    {
        "code": "6026",
        "ort": "Großostheim"
    },
    {
        "code": "6027",
        "ort": "Stockstadt,"
    },
    {
        "code": "6028",
        "ort": "Niedernberg,"
    },
    {
        "code": "6029",
        "ort": "Mömbris,"
    },
    {
        "code": "603\n6031",
        "ort": "Friedberg"
    },
    {
        "code": "6031",
        "ort": "Friedberg"
    },
    {
        "code": "6032",
        "ort": "Bad"
    },
    {
        "code": "6033",
        "ort": "Butzbach"
    },
    {
        "code": "6034",
        "ort": "Wöllstadt,"
    },
    {
        "code": "6035",
        "ort": "Florstadt,"
    },
    {
        "code": "6036",
        "ort": "Wölfersheim"
    },
    {
        "code": "6039",
        "ort": "Karben"
    },
    {
        "code": "604\n6041",
        "ort": "Glauburg\n6042"
    },
    {
        "code": "6041",
        "ort": "Glauburg"
    },
    {
        "code": "6042",
        "ort": "Büdingen"
    },
    {
        "code": "6043",
        "ort": "Nidda"
    },
    {
        "code": "6044",
        "ort": "Schotten"
    },
    {
        "code": "6045",
        "ort": "Gedern"
    },
    {
        "code": "6046",
        "ort": "Ortenberg"
    },
    {
        "code": "6047",
        "ort": "Altenstadt"
    },
    {
        "code": "6048",
        "ort": "Büdingen-Eckartshausen"
    },
    {
        "code": "6049",
        "ort": "Kefenrod"
    },
    {
        "code": "605\n6050",
        "ort": "Biebergemünd\n6051"
    },
    {
        "code": "6050",
        "ort": "Biebergemünd"
    },
    {
        "code": "6051",
        "ort": "Gelnhausen,"
    },
    {
        "code": "6052",
        "ort": "Bad"
    },
    {
        "code": "6053",
        "ort": "Wächtersbach"
    },
    {
        "code": "6054",
        "ort": "Birstein,"
    },
    {
        "code": "6055",
        "ort": "Freigericht,"
    },
    {
        "code": "6056",
        "ort": "Bad"
    },
    {
        "code": "6057",
        "ort": "Flörsbachtal"
    },
    {
        "code": "6058",
        "ort": "Gründau"
    },
    {
        "code": "6059",
        "ort": "Jossgrund"
    },
    {
        "code": "606\n6061",
        "ort": "Michelstadt\n6062"
    },
    {
        "code": "6061",
        "ort": "Michelstadt"
    },
    {
        "code": "6062",
        "ort": "Erbach"
    },
    {
        "code": "6063",
        "ort": "Bad"
    },
    {
        "code": "6066",
        "ort": "Michelstadt-Vielbrunn"
    },
    {
        "code": "6068",
        "ort": "Beerfelden"
    },
    {
        "code": "607\n6071",
        "ort": "Dieburg\n6073"
    },
    {
        "code": "6071",
        "ort": "Dieburg"
    },
    {
        "code": "6073",
        "ort": "Babenhausen"
    },
    {
        "code": "6074",
        "ort": "Rödermark,"
    },
    {
        "code": "6078",
        "ort": "Groß-Umstadt"
    },
    {
        "code": "608\n6081",
        "ort": "Usingen,"
    },
    {
        "code": "6081",
        "ort": "Usingen,"
    },
    {
        "code": "6082",
        "ort": "Niederreifenberg"
    },
    {
        "code": "6083",
        "ort": "Weilrod"
    },
    {
        "code": "6084",
        "ort": "Schmitten"
    },
    {
        "code": "6085",
        "ort": "Waldsolms"
    },
    {
        "code": "6086",
        "ort": "Grävenwiesbach"
    },
    {
        "code": "6087",
        "ort": "Waldems"
    },
    {
        "code": "609\n6092",
        "ort": "Heimbuchenthal\n6093"
    },
    {
        "code": "6092",
        "ort": "Heimbuchenthal"
    },
    {
        "code": "6093",
        "ort": "Laufach"
    },
    {
        "code": "6094",
        "ort": "Weibersbrunn"
    },
    {
        "code": "6095",
        "ort": "Bessenbach"
    },
    {
        "code": "6096",
        "ort": "Wiesen"
    },
    {
        "code": "6002",
        "ort": "Ober-Mörlen"
    },
    {
        "code": "6003",
        "ort": "Rosbach"
    },
    {
        "code": "6004",
        "ort": "Lich-Eberstadt"
    },
    {
        "code": "6007",
        "ort": "Rosbach-Rodheim,"
    },
    {
        "code": "6008",
        "ort": "Echzell"
    },
    {
        "code": "6020",
        "ort": "Heigenbrücken"
    },
    {
        "code": "6021",
        "ort": "Aschaffenburg"
    },
    {
        "code": "6022",
        "ort": "Obernburg"
    },
    {
        "code": "6023",
        "ort": "Alzenau"
    },
    {
        "code": "6024",
        "ort": "Schöllkrippen,"
    },
    {
        "code": "6026",
        "ort": "Großostheim"
    },
    {
        "code": "6027",
        "ort": "Stockstadt,"
    },
    {
        "code": "6028",
        "ort": "Niedernberg,"
    },
    {
        "code": "6029",
        "ort": "Mömbris,"
    },
    {
        "code": "6031",
        "ort": "Friedberg"
    },
    {
        "code": "6032",
        "ort": "Bad"
    },
    {
        "code": "6033",
        "ort": "Butzbach"
    },
    {
        "code": "6034",
        "ort": "Wöllstadt,"
    },
    {
        "code": "6035",
        "ort": "Florstadt,"
    },
    {
        "code": "6036",
        "ort": "Wölfersheim"
    },
    {
        "code": "6039",
        "ort": "Karben"
    },
    {
        "code": "6041",
        "ort": "Glauburg"
    },
    {
        "code": "6042",
        "ort": "Büdingen"
    },
    {
        "code": "6043",
        "ort": "Nidda"
    },
    {
        "code": "6044",
        "ort": "Schotten"
    },
    {
        "code": "6045",
        "ort": "Gedern"
    },
    {
        "code": "6046",
        "ort": "Ortenberg"
    },
    {
        "code": "6047",
        "ort": "Altenstadt"
    },
    {
        "code": "6048",
        "ort": "Büdingen-Eckartshausen"
    },
    {
        "code": "6049",
        "ort": "Kefenrod"
    },
    {
        "code": "6050",
        "ort": "Biebergemünd"
    },
    {
        "code": "6051",
        "ort": "Gelnhausen,"
    },
    {
        "code": "6052",
        "ort": "Bad"
    },
    {
        "code": "6053",
        "ort": "Wächtersbach"
    },
    {
        "code": "6054",
        "ort": "Birstein,"
    },
    {
        "code": "6055",
        "ort": "Freigericht,"
    },
    {
        "code": "6056",
        "ort": "Bad"
    },
    {
        "code": "6057",
        "ort": "Flörsbachtal"
    },
    {
        "code": "6058",
        "ort": "Gründau"
    },
    {
        "code": "6059",
        "ort": "Jossgrund"
    },
    {
        "code": "6061",
        "ort": "Michelstadt"
    },
    {
        "code": "6062",
        "ort": "Erbach"
    },
    {
        "code": "6063",
        "ort": "Bad"
    },
    {
        "code": "6066",
        "ort": "Michelstadt-Vielbrunn"
    },
    {
        "code": "6068",
        "ort": "Beerfelden"
    },
    {
        "code": "6071",
        "ort": "Dieburg"
    },
    {
        "code": "6073",
        "ort": "Babenhausen"
    },
    {
        "code": "6074",
        "ort": "Rödermark,"
    },
    {
        "code": "6078",
        "ort": "Groß-Umstadt"
    },
    {
        "code": "6081",
        "ort": "Usingen,"
    },
    {
        "code": "6082",
        "ort": "Niederreifenberg"
    },
    {
        "code": "6083",
        "ort": "Weilrod"
    },
    {
        "code": "6084",
        "ort": "Schmitten"
    },
    {
        "code": "6085",
        "ort": "Waldsolms"
    },
    {
        "code": "6086",
        "ort": "Grävenwiesbach"
    },
    {
        "code": "6087",
        "ort": "Waldems"
    },
    {
        "code": "6092",
        "ort": "Heimbuchenthal"
    },
    {
        "code": "6093",
        "ort": "Laufach"
    },
    {
        "code": "6094",
        "ort": "Weibersbrunn"
    },
    {
        "code": "6095",
        "ort": "Bessenbach"
    },
    {
        "code": "6096",
        "ort": "Wiesen"
    },
    {
        "code": "610\n6101",
        "ort": "Bad"
    },
    {
        "code": "6101",
        "ort": "Bad"
    },
    {
        "code": "6102",
        "ort": "Neu-Isenburg"
    },
    {
        "code": "6103",
        "ort": "Langen,"
    },
    {
        "code": "6104",
        "ort": "Heusenstamm,"
    },
    {
        "code": "6105",
        "ort": "Mörfelden-Walldorf"
    },
    {
        "code": "6106",
        "ort": "Rodgau,"
    },
    {
        "code": "6107",
        "ort": "Kelsterbach"
    },
    {
        "code": "6108",
        "ort": "Mühlheim"
    },
    {
        "code": "6109",
        "ort": "Frankfurt-Bergen-Enkheim"
    },
    {
        "code": "611",
        "ort": "Wiesbaden"
    },
    {
        "code": "612\n6120",
        "ort": "Aarbergen,"
    },
    {
        "code": "6120",
        "ort": "Aarbergen,"
    },
    {
        "code": "6122",
        "ort": "Hofheim-Wallau"
    },
    {
        "code": "6123",
        "ort": "Eltville,"
    },
    {
        "code": "6124",
        "ort": "Bad"
    },
    {
        "code": "6126",
        "ort": "Idstein"
    },
    {
        "code": "6127",
        "ort": "Niedernhausen"
    },
    {
        "code": "6128",
        "ort": "Taunusstein"
    },
    {
        "code": "6129",
        "ort": "Schlangenbad"
    },
    {
        "code": "613\n6130",
        "ort": "Schwabenheim"
    },
    {
        "code": "6130",
        "ort": "Schwabenheim"
    },
    {
        "code": "6131",
        "ort": "Mainz"
    },
    {
        "code": "6132",
        "ort": "Ingelheim"
    },
    {
        "code": "6133",
        "ort": "Nierstein,"
    },
    {
        "code": "6134",
        "ort": "Mainz-Kastel"
    },
    {
        "code": "6135",
        "ort": "Bodenheim"
    },
    {
        "code": "6136",
        "ort": "Nieder-Olm"
    },
    {
        "code": "6138",
        "ort": "Mommenheim"
    },
    {
        "code": "6139",
        "ort": "Budenheim"
    },
    {
        "code": "614\n6142",
        "ort": "Rüsselsheim,"
    },
    {
        "code": "6142",
        "ort": "Rüsselsheim,"
    },
    {
        "code": "6144",
        "ort": "Bischofsheim"
    },
    {
        "code": "6145",
        "ort": "Flörsheim"
    },
    {
        "code": "6146",
        "ort": "Hochheim"
    },
    {
        "code": "6147",
        "ort": "Trebur"
    },
    {
        "code": "615\n6150",
        "ort": "Weiterstadt,"
    },
    {
        "code": "6150",
        "ort": "Weiterstadt,"
    },
    {
        "code": "6151",
        "ort": "Darmstadt"
    },
    {
        "code": "6152",
        "ort": "Groß-Gerau,"
    },
    {
        "code": "6154",
        "ort": "Ober-Ramstadt"
    },
    {
        "code": "6155",
        "ort": "Griesheim"
    },
    {
        "code": "6157",
        "ort": "Pfungstadt"
    },
    {
        "code": "6158",
        "ort": "Riedstadt"
    },
    {
        "code": "6159",
        "ort": "Messel"
    },
    {
        "code": "616\n6161",
        "ort": "Brensbach\n6162"
    },
    {
        "code": "6161",
        "ort": "Brensbach"
    },
    {
        "code": "6162",
        "ort": "Groß-Bieberau,"
    },
    {
        "code": "6163",
        "ort": "Höchst"
    },
    {
        "code": "6164",
        "ort": "Reichelsheim"
    },
    {
        "code": "6165",
        "ort": "Breuberg"
    },
    {
        "code": "6166",
        "ort": "Fischbachtal"
    },
    {
        "code": "6167",
        "ort": "Modautal"
    },
    {
        "code": "617\n6171",
        "ort": "Oberursel\n6172"
    },
    {
        "code": "6171",
        "ort": "Oberursel"
    },
    {
        "code": "6172",
        "ort": "Bad"
    },
    {
        "code": "6173",
        "ort": "Kronberg"
    },
    {
        "code": "6174",
        "ort": "Königstein"
    },
    {
        "code": "6175",
        "ort": "Friedrichsdorf"
    },
    {
        "code": "618\n6181",
        "ort": "Hanau\n6182"
    },
    {
        "code": "6181",
        "ort": "Hanau"
    },
    {
        "code": "6182",
        "ort": "Seligenstadt"
    },
    {
        "code": "6183",
        "ort": "Erlensee"
    },
    {
        "code": "6184",
        "ort": "Langenselbold,"
    },
    {
        "code": "6185",
        "ort": "Hammersbach"
    },
    {
        "code": "6186",
        "ort": "Großkrotzenburg"
    },
    {
        "code": "6187",
        "ort": "Nidderau,"
    },
    {
        "code": "6188",
        "ort": "Kahl"
    },
    {
        "code": "619\n6190",
        "ort": "Hattersheim"
    },
    {
        "code": "6190",
        "ort": "Hattersheim"
    },
    {
        "code": "6192",
        "ort": "Hofheim"
    },
    {
        "code": "6195",
        "ort": "Kelkheim"
    },
    {
        "code": "6196",
        "ort": "Bad"
    },
    {
        "code": "6198",
        "ort": "Eppstein"
    },
    {
        "code": "6101",
        "ort": "Bad"
    },
    {
        "code": "6102",
        "ort": "Neu-Isenburg"
    },
    {
        "code": "6103",
        "ort": "Langen,"
    },
    {
        "code": "6104",
        "ort": "Heusenstamm,"
    },
    {
        "code": "6105",
        "ort": "Mörfelden-Walldorf"
    },
    {
        "code": "6106",
        "ort": "Rodgau,"
    },
    {
        "code": "6107",
        "ort": "Kelsterbach"
    },
    {
        "code": "6108",
        "ort": "Mühlheim"
    },
    {
        "code": "6109",
        "ort": "Frankfurt-Bergen-Enkheim"
    },
    {
        "code": "6120",
        "ort": "Aarbergen,"
    },
    {
        "code": "6122",
        "ort": "Hofheim-Wallau"
    },
    {
        "code": "6123",
        "ort": "Eltville,"
    },
    {
        "code": "6124",
        "ort": "Bad"
    },
    {
        "code": "6126",
        "ort": "Idstein"
    },
    {
        "code": "6127",
        "ort": "Niedernhausen"
    },
    {
        "code": "6128",
        "ort": "Taunusstein"
    },
    {
        "code": "6129",
        "ort": "Schlangenbad"
    },
    {
        "code": "6130",
        "ort": "Schwabenheim"
    },
    {
        "code": "6131",
        "ort": "Mainz"
    },
    {
        "code": "6132",
        "ort": "Ingelheim"
    },
    {
        "code": "6133",
        "ort": "Nierstein,"
    },
    {
        "code": "6134",
        "ort": "Mainz-Kastel"
    },
    {
        "code": "6135",
        "ort": "Bodenheim"
    },
    {
        "code": "6136",
        "ort": "Nieder-Olm"
    },
    {
        "code": "6138",
        "ort": "Mommenheim"
    },
    {
        "code": "6139",
        "ort": "Budenheim"
    },
    {
        "code": "6142",
        "ort": "Rüsselsheim,"
    },
    {
        "code": "6144",
        "ort": "Bischofsheim"
    },
    {
        "code": "6145",
        "ort": "Flörsheim"
    },
    {
        "code": "6146",
        "ort": "Hochheim"
    },
    {
        "code": "6147",
        "ort": "Trebur"
    },
    {
        "code": "6150",
        "ort": "Weiterstadt,"
    },
    {
        "code": "6151",
        "ort": "Darmstadt"
    },
    {
        "code": "6152",
        "ort": "Groß-Gerau,"
    },
    {
        "code": "6154",
        "ort": "Ober-Ramstadt"
    },
    {
        "code": "6155",
        "ort": "Griesheim"
    },
    {
        "code": "6157",
        "ort": "Pfungstadt"
    },
    {
        "code": "6158",
        "ort": "Riedstadt"
    },
    {
        "code": "6159",
        "ort": "Messel"
    },
    {
        "code": "6161",
        "ort": "Brensbach"
    },
    {
        "code": "6162",
        "ort": "Groß-Bieberau,"
    },
    {
        "code": "6163",
        "ort": "Höchst"
    },
    {
        "code": "6164",
        "ort": "Reichelsheim"
    },
    {
        "code": "6165",
        "ort": "Breuberg"
    },
    {
        "code": "6166",
        "ort": "Fischbachtal"
    },
    {
        "code": "6167",
        "ort": "Modautal"
    },
    {
        "code": "6171",
        "ort": "Oberursel"
    },
    {
        "code": "6172",
        "ort": "Bad"
    },
    {
        "code": "6173",
        "ort": "Kronberg"
    },
    {
        "code": "6174",
        "ort": "Königstein"
    },
    {
        "code": "6175",
        "ort": "Friedrichsdorf"
    },
    {
        "code": "6181",
        "ort": "Hanau"
    },
    {
        "code": "6182",
        "ort": "Seligenstadt"
    },
    {
        "code": "6183",
        "ort": "Erlensee"
    },
    {
        "code": "6184",
        "ort": "Langenselbold,"
    },
    {
        "code": "6185",
        "ort": "Hammersbach"
    },
    {
        "code": "6186",
        "ort": "Großkrotzenburg"
    },
    {
        "code": "6187",
        "ort": "Nidderau,"
    },
    {
        "code": "6188",
        "ort": "Kahl"
    },
    {
        "code": "6190",
        "ort": "Hattersheim"
    },
    {
        "code": "6192",
        "ort": "Hofheim"
    },
    {
        "code": "6195",
        "ort": "Kelkheim"
    },
    {
        "code": "6196",
        "ort": "Bad"
    },
    {
        "code": "6198",
        "ort": "Eppstein"
    },
    {
        "code": "620\n6201",
        "ort": "Birkenau,"
    },
    {
        "code": "6201",
        "ort": "Birkenau,"
    },
    {
        "code": "6202",
        "ort": "Brühl,"
    },
    {
        "code": "6203",
        "ort": "Edingen-Neckarhausen,"
    },
    {
        "code": "6204",
        "ort": "Viernheim"
    },
    {
        "code": "6205",
        "ort": "Altlußheim,"
    },
    {
        "code": "6206",
        "ort": "Bürstadt,"
    },
    {
        "code": "6207",
        "ort": "Wald-Michelbach"
    },
    {
        "code": "6209",
        "ort": "Mörlenbach"
    },
    {
        "code": "621",
        "ort": "Mannheim,"
    },
    {
        "code": "621",
        "ort": "Ludwigshafen"
    },
    {
        "code": "622\n6220",
        "ort": "Heiligkreuzsteinach,"
    },
    {
        "code": "6220",
        "ort": "Heiligkreuzsteinach,"
    },
    {
        "code": "6221",
        "ort": "Heidelberg,"
    },
    {
        "code": "6222",
        "ort": "Dielheim,"
    },
    {
        "code": "6223",
        "ort": "Bammental,"
    },
    {
        "code": "6224",
        "ort": "Leimen,"
    },
    {
        "code": "6226",
        "ort": "Eschelbronn,"
    },
    {
        "code": "6227",
        "ort": "St."
    },
    {
        "code": "6228",
        "ort": "Schönau"
    },
    {
        "code": "6229",
        "ort": "Neckarsteinach"
    },
    {
        "code": "623\n6231",
        "ort": "Hochdorf-Assenheim\n6232"
    },
    {
        "code": "6231",
        "ort": "Hochdorf-Assenheim"
    },
    {
        "code": "6232",
        "ort": "Speyer"
    },
    {
        "code": "6233",
        "ort": "Frankenthal"
    },
    {
        "code": "6234",
        "ort": "Mutterstadt"
    },
    {
        "code": "6235",
        "ort": "Schifferstadt"
    },
    {
        "code": "6236",
        "ort": "Limburgerhof,"
    },
    {
        "code": "6237",
        "ort": "Ludwigshafen-Ruchheim,"
    },
    {
        "code": "6238",
        "ort": "Gerolsheim"
    },
    {
        "code": "6239",
        "ort": "Bobenheim-Roxheim"
    },
    {
        "code": "624\n6241",
        "ort": "Worms\n6242"
    },
    {
        "code": "6241",
        "ort": "Worms"
    },
    {
        "code": "6242",
        "ort": "Worms-Abenheim"
    },
    {
        "code": "6243",
        "ort": "Monsheim"
    },
    {
        "code": "6244",
        "ort": "Gundersheim"
    },
    {
        "code": "6245",
        "ort": "Biblis"
    },
    {
        "code": "6246",
        "ort": "Eich"
    },
    {
        "code": "6247",
        "ort": "Worms-Pfeddersheim"
    },
    {
        "code": "625\n6251",
        "ort": "Bensheim\n6252"
    },
    {
        "code": "6251",
        "ort": "Bensheim"
    },
    {
        "code": "6252",
        "ort": "Heppenheim"
    },
    {
        "code": "6253",
        "ort": "Fürth"
    },
    {
        "code": "6254",
        "ort": "Lautertal"
    },
    {
        "code": "6255",
        "ort": "Lindenfels"
    },
    {
        "code": "6256",
        "ort": "Lampertheim-Hüttenfeld"
    },
    {
        "code": "6257",
        "ort": "Seeheim-Jugenheim"
    },
    {
        "code": "6258",
        "ort": "Gernsheim"
    },
    {
        "code": "626\n6261",
        "ort": "Elztal,"
    },
    {
        "code": "6261",
        "ort": "Elztal,"
    },
    {
        "code": "6262",
        "ort": "Aglasterhausen,"
    },
    {
        "code": "6263",
        "ort": "Neckargerach,"
    },
    {
        "code": "6264",
        "ort": "Neudenau"
    },
    {
        "code": "6265",
        "ort": "Billigheim"
    },
    {
        "code": "6266",
        "ort": "Haßmersheim"
    },
    {
        "code": "6267",
        "ort": "Fahrenbach"
    },
    {
        "code": "6268",
        "ort": "Hüffenhardt"
    },
    {
        "code": "627\n6271",
        "ort": "Eberbach\n6272"
    },
    {
        "code": "6271",
        "ort": "Eberbach"
    },
    {
        "code": "6272",
        "ort": "Hirschhorn"
    },
    {
        "code": "6274",
        "ort": "Waldbrunn"
    },
    {
        "code": "6275",
        "ort": "Rothenberg"
    },
    {
        "code": "6276",
        "ort": "Hesseneck"
    },
    {
        "code": "628\n6281",
        "ort": "Buchen"
    },
    {
        "code": "6281",
        "ort": "Buchen"
    },
    {
        "code": "6282",
        "ort": "Walldürn"
    },
    {
        "code": "6283",
        "ort": "Hardheim,"
    },
    {
        "code": "6284",
        "ort": "Mudau"
    },
    {
        "code": "6285",
        "ort": "Walldürn-Altheim"
    },
    {
        "code": "6286",
        "ort": "Walldürn-Rippberg"
    },
    {
        "code": "6287",
        "ort": "Limbach"
    },
    {
        "code": "629\n6291",
        "ort": "Adelsheim,"
    },
    {
        "code": "6291",
        "ort": "Adelsheim,"
    },
    {
        "code": "6292",
        "ort": "Seckach"
    },
    {
        "code": "6293",
        "ort": "Schefflenz"
    },
    {
        "code": "6295",
        "ort": "Rosenberg"
    },
    {
        "code": "6297",
        "ort": "Ravenstein"
    },
    {
        "code": "6298",
        "ort": "Möckmühl"
    },
    {
        "code": "6201",
        "ort": "Birkenau,"
    },
    {
        "code": "6202",
        "ort": "Brühl,"
    },
    {
        "code": "6203",
        "ort": "Edingen-Neckarhausen,"
    },
    {
        "code": "6204",
        "ort": "Viernheim"
    },
    {
        "code": "6205",
        "ort": "Altlußheim,"
    },
    {
        "code": "6206",
        "ort": "Bürstadt,"
    },
    {
        "code": "6207",
        "ort": "Wald-Michelbach"
    },
    {
        "code": "6209",
        "ort": "Mörlenbach"
    },
    {
        "code": "6220",
        "ort": "Heiligkreuzsteinach,"
    },
    {
        "code": "6221",
        "ort": "Heidelberg,"
    },
    {
        "code": "6222",
        "ort": "Dielheim,"
    },
    {
        "code": "6223",
        "ort": "Bammental,"
    },
    {
        "code": "6224",
        "ort": "Leimen,"
    },
    {
        "code": "6226",
        "ort": "Eschelbronn,"
    },
    {
        "code": "6227",
        "ort": "St."
    },
    {
        "code": "6228",
        "ort": "Schönau"
    },
    {
        "code": "6229",
        "ort": "Neckarsteinach"
    },
    {
        "code": "6231",
        "ort": "Hochdorf-Assenheim"
    },
    {
        "code": "6232",
        "ort": "Speyer"
    },
    {
        "code": "6233",
        "ort": "Frankenthal"
    },
    {
        "code": "6234",
        "ort": "Mutterstadt"
    },
    {
        "code": "6235",
        "ort": "Schifferstadt"
    },
    {
        "code": "6236",
        "ort": "Limburgerhof,"
    },
    {
        "code": "6237",
        "ort": "Ludwigshafen-Ruchheim,"
    },
    {
        "code": "6238",
        "ort": "Gerolsheim"
    },
    {
        "code": "6239",
        "ort": "Bobenheim-Roxheim"
    },
    {
        "code": "6241",
        "ort": "Worms"
    },
    {
        "code": "6242",
        "ort": "Worms-Abenheim"
    },
    {
        "code": "6243",
        "ort": "Monsheim"
    },
    {
        "code": "6244",
        "ort": "Gundersheim"
    },
    {
        "code": "6245",
        "ort": "Biblis"
    },
    {
        "code": "6246",
        "ort": "Eich"
    },
    {
        "code": "6247",
        "ort": "Worms-Pfeddersheim"
    },
    {
        "code": "6251",
        "ort": "Bensheim"
    },
    {
        "code": "6252",
        "ort": "Heppenheim"
    },
    {
        "code": "6253",
        "ort": "Fürth"
    },
    {
        "code": "6254",
        "ort": "Lautertal"
    },
    {
        "code": "6255",
        "ort": "Lindenfels"
    },
    {
        "code": "6256",
        "ort": "Lampertheim-Hüttenfeld"
    },
    {
        "code": "6257",
        "ort": "Seeheim-Jugenheim"
    },
    {
        "code": "6258",
        "ort": "Gernsheim"
    },
    {
        "code": "6261",
        "ort": "Elztal,"
    },
    {
        "code": "6262",
        "ort": "Aglasterhausen,"
    },
    {
        "code": "6263",
        "ort": "Neckargerach,"
    },
    {
        "code": "6264",
        "ort": "Neudenau"
    },
    {
        "code": "6265",
        "ort": "Billigheim"
    },
    {
        "code": "6266",
        "ort": "Haßmersheim"
    },
    {
        "code": "6267",
        "ort": "Fahrenbach"
    },
    {
        "code": "6268",
        "ort": "Hüffenhardt"
    },
    {
        "code": "6271",
        "ort": "Eberbach"
    },
    {
        "code": "6272",
        "ort": "Hirschhorn"
    },
    {
        "code": "6274",
        "ort": "Waldbrunn"
    },
    {
        "code": "6275",
        "ort": "Rothenberg"
    },
    {
        "code": "6276",
        "ort": "Hesseneck"
    },
    {
        "code": "6281",
        "ort": "Buchen"
    },
    {
        "code": "6282",
        "ort": "Walldürn"
    },
    {
        "code": "6283",
        "ort": "Hardheim,"
    },
    {
        "code": "6284",
        "ort": "Mudau"
    },
    {
        "code": "6285",
        "ort": "Walldürn-Altheim"
    },
    {
        "code": "6286",
        "ort": "Walldürn-Rippberg"
    },
    {
        "code": "6287",
        "ort": "Limbach"
    },
    {
        "code": "6291",
        "ort": "Adelsheim,"
    },
    {
        "code": "6292",
        "ort": "Seckach"
    },
    {
        "code": "6293",
        "ort": "Schefflenz"
    },
    {
        "code": "6295",
        "ort": "Rosenberg"
    },
    {
        "code": "6297",
        "ort": "Ravenstein"
    },
    {
        "code": "6298",
        "ort": "Möckmühl"
    },
    {
        "code": "630\n6301",
        "ort": "Otterbach\n6302"
    },
    {
        "code": "6301",
        "ort": "Otterbach"
    },
    {
        "code": "6302",
        "ort": "Winnweiler"
    },
    {
        "code": "6303",
        "ort": "Enkenbach-Alsenborn,"
    },
    {
        "code": "6307",
        "ort": "Geiselberg,"
    },
    {
        "code": "631",
        "ort": "Kaiserslautern"
    },
    {
        "code": "632\n6321",
        "ort": "Neustadt"
    },
    {
        "code": "6321",
        "ort": "Neustadt"
    },
    {
        "code": "6322",
        "ort": "Bad"
    },
    {
        "code": "6323",
        "ort": "Edenkoben,"
    },
    {
        "code": "6327",
        "ort": "Lachen-Speyerdorf"
    },
    {
        "code": "6331",
        "ort": "Höheischweiler,"
    },
    {
        "code": "6333",
        "ort": "Clausen,"
    },
    {
        "code": "6334",
        "ort": "Höhfröschen,"
    },
    {
        "code": "6336",
        "ort": "Nünschweiler,"
    },
    {
        "code": "634\n6340",
        "ort": "Dierbach,"
    },
    {
        "code": "6340",
        "ort": "Dierbach,"
    },
    {
        "code": "6341",
        "ort": "Landau"
    },
    {
        "code": "6342",
        "ort": "Schweigen-Rechtenbach"
    },
    {
        "code": "6343",
        "ort": "Bad"
    },
    {
        "code": "6344",
        "ort": "Schwegenheim"
    },
    {
        "code": "6345",
        "ort": "Albersweiler"
    },
    {
        "code": "6346",
        "ort": "Annweiler"
    },
    {
        "code": "6347",
        "ort": "Hochstadt"
    },
    {
        "code": "6348",
        "ort": "Offenbach"
    },
    {
        "code": "6349",
        "ort": "Billigheim-Ingenheim"
    },
    {
        "code": "635\n6351",
        "ort": "Eisenberg,"
    },
    {
        "code": "6351",
        "ort": "Eisenberg,"
    },
    {
        "code": "6352",
        "ort": "Kirchheimbolanden"
    },
    {
        "code": "6353",
        "ort": "Freinsheim,"
    },
    {
        "code": "6359",
        "ort": "Grünstadt"
    },
    {
        "code": "637\n6371",
        "ort": "Landstuhl,"
    },
    {
        "code": "6371",
        "ort": "Landstuhl,"
    },
    {
        "code": "6372",
        "ort": "Bruchmühlbach-Miesau"
    },
    {
        "code": "6373",
        "ort": "Waldmohr,"
    },
    {
        "code": "6374",
        "ort": "Weilerbach"
    },
    {
        "code": "6375",
        "ort": "Biedershausen,"
    },
    {
        "code": "6385",
        "ort": "Reichenbach-Steegen,"
    },
    {
        "code": "6301",
        "ort": "Otterbach"
    },
    {
        "code": "6302",
        "ort": "Winnweiler"
    },
    {
        "code": "6303",
        "ort": "Enkenbach-Alsenborn,"
    },
    {
        "code": "6307",
        "ort": "Geiselberg,"
    },
    {
        "code": "6321",
        "ort": "Neustadt"
    },
    {
        "code": "6322",
        "ort": "Bad"
    },
    {
        "code": "6323",
        "ort": "Edenkoben,"
    },
    {
        "code": "6327",
        "ort": "Lachen-Speyerdorf"
    },
    {
        "code": "6331",
        "ort": "Höheischweiler,"
    },
    {
        "code": "6333",
        "ort": "Clausen,"
    },
    {
        "code": "6334",
        "ort": "Höhfröschen,"
    },
    {
        "code": "6336",
        "ort": "Nünschweiler,"
    },
    {
        "code": "6340",
        "ort": "Dierbach,"
    },
    {
        "code": "6341",
        "ort": "Landau"
    },
    {
        "code": "6342",
        "ort": "Schweigen-Rechtenbach"
    },
    {
        "code": "6343",
        "ort": "Bad"
    },
    {
        "code": "6344",
        "ort": "Schwegenheim"
    },
    {
        "code": "6345",
        "ort": "Albersweiler"
    },
    {
        "code": "6346",
        "ort": "Annweiler"
    },
    {
        "code": "6347",
        "ort": "Hochstadt"
    },
    {
        "code": "6348",
        "ort": "Offenbach"
    },
    {
        "code": "6349",
        "ort": "Billigheim-Ingenheim"
    },
    {
        "code": "6351",
        "ort": "Eisenberg,"
    },
    {
        "code": "6352",
        "ort": "Kirchheimbolanden"
    },
    {
        "code": "6353",
        "ort": "Freinsheim,"
    },
    {
        "code": "6359",
        "ort": "Grünstadt"
    },
    {
        "code": "6371",
        "ort": "Landstuhl,"
    },
    {
        "code": "6372",
        "ort": "Bruchmühlbach-Miesau"
    },
    {
        "code": "6373",
        "ort": "Waldmohr,"
    },
    {
        "code": "6374",
        "ort": "Weilerbach"
    },
    {
        "code": "6375",
        "ort": "Biedershausen,"
    },
    {
        "code": "6385",
        "ort": "Reichenbach-Steegen,"
    },
    {
        "code": "640\n6400",
        "ort": "Mücke\n6401"
    },
    {
        "code": "6400",
        "ort": "Mücke"
    },
    {
        "code": "6401",
        "ort": "Grünberg"
    },
    {
        "code": "6403",
        "ort": "Langgöns,"
    },
    {
        "code": "6404",
        "ort": "Fernwald,"
    },
    {
        "code": "6405",
        "ort": "Laubach"
    },
    {
        "code": "6406",
        "ort": "Lollar,"
    },
    {
        "code": "6407",
        "ort": "Rabenau"
    },
    {
        "code": "6408",
        "ort": "Buseck,"
    },
    {
        "code": "6409",
        "ort": "Biebertal"
    },
    {
        "code": "641",
        "ort": "Gießen,"
    },
    {
        "code": "642\n6420",
        "ort": "Lahntal"
    },
    {
        "code": "6420",
        "ort": "Lahntal"
    },
    {
        "code": "6421",
        "ort": "Marburg,"
    },
    {
        "code": "6422",
        "ort": "Kirchhain,"
    },
    {
        "code": "6423",
        "ort": "Wetter,"
    },
    {
        "code": "6424",
        "ort": "Ebsdorfergrund"
    },
    {
        "code": "6425",
        "ort": "Rauschenberg"
    },
    {
        "code": "6426",
        "ort": "Weimar"
    },
    {
        "code": "6427",
        "ort": "Cölbe"
    },
    {
        "code": "6428",
        "ort": "Stadtallendorf"
    },
    {
        "code": "6429",
        "ort": "Stadtallendorf"
    },
    {
        "code": "643\n6431",
        "ort": "Limburg"
    },
    {
        "code": "6431",
        "ort": "Limburg"
    },
    {
        "code": "6432",
        "ort": "Diez"
    },
    {
        "code": "6433",
        "ort": "Hadamar"
    },
    {
        "code": "6434",
        "ort": "Bad"
    },
    {
        "code": "6435",
        "ort": "Wallmerod"
    },
    {
        "code": "6436",
        "ort": "Dornburg"
    },
    {
        "code": "6438",
        "ort": "Hünfelden"
    },
    {
        "code": "6439",
        "ort": "Holzappel"
    },
    {
        "code": "644\n6441",
        "ort": "Wetzlar\n6442"
    },
    {
        "code": "6441",
        "ort": "Wetzlar"
    },
    {
        "code": "6442",
        "ort": "Braunfels"
    },
    {
        "code": "6443",
        "ort": "Ehringshausen"
    },
    {
        "code": "6444",
        "ort": "Bischoffen"
    },
    {
        "code": "6445",
        "ort": "Schöffengrund"
    },
    {
        "code": "6446",
        "ort": "Hohenahr"
    },
    {
        "code": "6447",
        "ort": "Langgöns-Niederkleen"
    },
    {
        "code": "6449",
        "ort": "Ehringshausen-Katzenfurt"
    },
    {
        "code": "645\n6451",
        "ort": "Frankenberg"
    },
    {
        "code": "6451",
        "ort": "Frankenberg"
    },
    {
        "code": "6452",
        "ort": "Battenberg"
    },
    {
        "code": "6454",
        "ort": "Wohratal"
    },
    {
        "code": "6457",
        "ort": "Burgwald,"
    },
    {
        "code": "646\n6461",
        "ort": "Biedenkopf\n6462"
    },
    {
        "code": "6461",
        "ort": "Biedenkopf"
    },
    {
        "code": "6462",
        "ort": "Gladenbach,"
    },
    {
        "code": "6464",
        "ort": "Angelburg,"
    },
    {
        "code": "6465",
        "ort": "Breidenbach"
    },
    {
        "code": "6466",
        "ort": "Dautphetal"
    },
    {
        "code": "6467",
        "ort": "Hatzfeld"
    },
    {
        "code": "6468",
        "ort": "Dautphetal"
    },
    {
        "code": "647\n6471",
        "ort": "Weilburg"
    },
    {
        "code": "6471",
        "ort": "Weilburg"
    },
    {
        "code": "6472",
        "ort": "Weilmünster"
    },
    {
        "code": "6473",
        "ort": "Leun"
    },
    {
        "code": "6474",
        "ort": "Villmar"
    },
    {
        "code": "6476",
        "ort": "Mengerskirchen"
    },
    {
        "code": "6477",
        "ort": "Greifenstein-Nenderoth"
    },
    {
        "code": "6478",
        "ort": "Greifenstein-Ulm"
    },
    {
        "code": "6479",
        "ort": "Waldbrunn"
    },
    {
        "code": "648\n6482",
        "ort": "Runkel\n6483"
    },
    {
        "code": "6482",
        "ort": "Runkel"
    },
    {
        "code": "6483",
        "ort": "Selters"
    },
    {
        "code": "6484",
        "ort": "Beselich"
    },
    {
        "code": "6485",
        "ort": "Nentershausen"
    },
    {
        "code": "6486",
        "ort": "Katzenelnbogen"
    },
    {
        "code": "6400",
        "ort": "Mücke"
    },
    {
        "code": "6401",
        "ort": "Grünberg"
    },
    {
        "code": "6403",
        "ort": "Langgöns,"
    },
    {
        "code": "6404",
        "ort": "Fernwald,"
    },
    {
        "code": "6405",
        "ort": "Laubach"
    },
    {
        "code": "6406",
        "ort": "Lollar,"
    },
    {
        "code": "6407",
        "ort": "Rabenau"
    },
    {
        "code": "6408",
        "ort": "Buseck,"
    },
    {
        "code": "6409",
        "ort": "Biebertal"
    },
    {
        "code": "6420",
        "ort": "Lahntal"
    },
    {
        "code": "6421",
        "ort": "Marburg,"
    },
    {
        "code": "6422",
        "ort": "Kirchhain,"
    },
    {
        "code": "6423",
        "ort": "Wetter,"
    },
    {
        "code": "6424",
        "ort": "Ebsdorfergrund"
    },
    {
        "code": "6425",
        "ort": "Rauschenberg"
    },
    {
        "code": "6426",
        "ort": "Weimar"
    },
    {
        "code": "6427",
        "ort": "Cölbe"
    },
    {
        "code": "6428",
        "ort": "Stadtallendorf"
    },
    {
        "code": "6429",
        "ort": "Stadtallendorf"
    },
    {
        "code": "6431",
        "ort": "Limburg"
    },
    {
        "code": "6432",
        "ort": "Diez"
    },
    {
        "code": "6433",
        "ort": "Hadamar"
    },
    {
        "code": "6434",
        "ort": "Bad"
    },
    {
        "code": "6435",
        "ort": "Wallmerod"
    },
    {
        "code": "6436",
        "ort": "Dornburg"
    },
    {
        "code": "6438",
        "ort": "Hünfelden"
    },
    {
        "code": "6439",
        "ort": "Holzappel"
    },
    {
        "code": "6441",
        "ort": "Wetzlar"
    },
    {
        "code": "6442",
        "ort": "Braunfels"
    },
    {
        "code": "6443",
        "ort": "Ehringshausen"
    },
    {
        "code": "6444",
        "ort": "Bischoffen"
    },
    {
        "code": "6445",
        "ort": "Schöffengrund"
    },
    {
        "code": "6446",
        "ort": "Hohenahr"
    },
    {
        "code": "6447",
        "ort": "Langgöns-Niederkleen"
    },
    {
        "code": "6449",
        "ort": "Ehringshausen-Katzenfurt"
    },
    {
        "code": "6451",
        "ort": "Frankenberg"
    },
    {
        "code": "6452",
        "ort": "Battenberg"
    },
    {
        "code": "6454",
        "ort": "Wohratal"
    },
    {
        "code": "6457",
        "ort": "Burgwald,"
    },
    {
        "code": "6461",
        "ort": "Biedenkopf"
    },
    {
        "code": "6462",
        "ort": "Gladenbach,"
    },
    {
        "code": "6464",
        "ort": "Angelburg,"
    },
    {
        "code": "6465",
        "ort": "Breidenbach"
    },
    {
        "code": "6466",
        "ort": "Dautphetal"
    },
    {
        "code": "6467",
        "ort": "Hatzfeld"
    },
    {
        "code": "6468",
        "ort": "Dautphetal"
    },
    {
        "code": "6471",
        "ort": "Weilburg"
    },
    {
        "code": "6472",
        "ort": "Weilmünster"
    },
    {
        "code": "6473",
        "ort": "Leun"
    },
    {
        "code": "6474",
        "ort": "Villmar"
    },
    {
        "code": "6476",
        "ort": "Mengerskirchen"
    },
    {
        "code": "6477",
        "ort": "Greifenstein-Nenderoth"
    },
    {
        "code": "6478",
        "ort": "Greifenstein-Ulm"
    },
    {
        "code": "6479",
        "ort": "Waldbrunn"
    },
    {
        "code": "6482",
        "ort": "Runkel"
    },
    {
        "code": "6483",
        "ort": "Selters"
    },
    {
        "code": "6484",
        "ort": "Beselich"
    },
    {
        "code": "6485",
        "ort": "Nentershausen"
    },
    {
        "code": "6486",
        "ort": "Katzenelnbogen"
    },
    {
        "code": "650\n6501",
        "ort": "Konz\n6502"
    },
    {
        "code": "6501",
        "ort": "Konz"
    },
    {
        "code": "6502",
        "ort": "Schweich"
    },
    {
        "code": "651",
        "ort": "Trier"
    },
    {
        "code": "653\n6531",
        "ort": "Bernkastel-Kues\n6533"
    },
    {
        "code": "6531",
        "ort": "Bernkastel-Kues"
    },
    {
        "code": "6533",
        "ort": "Morbach"
    },
    {
        "code": "6535",
        "ort": "Maring-Noviand,"
    },
    {
        "code": "654\n6541",
        "ort": "Traben-Trarbach\n6544"
    },
    {
        "code": "6541",
        "ort": "Traben-Trarbach"
    },
    {
        "code": "6544",
        "ort": "Rhaunen"
    },
    {
        "code": "655\n6551",
        "ort": "Prüm"
    },
    {
        "code": "6551",
        "ort": "Prüm"
    },
    {
        "code": "656\n6561",
        "ort": "Bitburg"
    },
    {
        "code": "6561",
        "ort": "Bitburg"
    },
    {
        "code": "657\n6571",
        "ort": "Wittlich"
    },
    {
        "code": "6571",
        "ort": "Wittlich"
    },
    {
        "code": "658\n6581",
        "ort": "Saarburg\n6588"
    },
    {
        "code": "6581",
        "ort": "Saarburg"
    },
    {
        "code": "6588",
        "ort": "Pluwig"
    },
    {
        "code": "659\n6591",
        "ort": "Gerolstein\n6592"
    },
    {
        "code": "6591",
        "ort": "Gerolstein"
    },
    {
        "code": "6592",
        "ort": "Daun"
    },
    {
        "code": "6501",
        "ort": "Konz"
    },
    {
        "code": "6502",
        "ort": "Schweich"
    },
    {
        "code": "6531",
        "ort": "Bernkastel-Kues"
    },
    {
        "code": "6533",
        "ort": "Morbach"
    },
    {
        "code": "6535",
        "ort": "Maring-Noviand,"
    },
    {
        "code": "6541",
        "ort": "Traben-Trarbach"
    },
    {
        "code": "6544",
        "ort": "Rhaunen"
    },
    {
        "code": "6551",
        "ort": "Prüm"
    },
    {
        "code": "6561",
        "ort": "Bitburg"
    },
    {
        "code": "6571",
        "ort": "Wittlich"
    },
    {
        "code": "6581",
        "ort": "Saarburg"
    },
    {
        "code": "6588",
        "ort": "Pluwig"
    },
    {
        "code": "6591",
        "ort": "Gerolstein"
    },
    {
        "code": "6592",
        "ort": "Daun"
    },
    {
        "code": "661",
        "ort": "Fulda,"
    },
    {
        "code": "662\n6622",
        "ort": "Bebra\n6627"
    },
    {
        "code": "6622",
        "ort": "Bebra"
    },
    {
        "code": "6627",
        "ort": "Nentershausen"
    },
    {
        "code": "664\n6641",
        "ort": "Lauterbach"
    },
    {
        "code": "6641",
        "ort": "Lauterbach"
    },
    {
        "code": "6642",
        "ort": "Schlitz"
    },
    {
        "code": "6643",
        "ort": "Herbstein,"
    },
    {
        "code": "6644",
        "ort": "Grebenhain"
    },
    {
        "code": "6645",
        "ort": "Ulrichstein"
    },
    {
        "code": "6647",
        "ort": "Herbstein-Stockhausen"
    },
    {
        "code": "6648",
        "ort": "Bad"
    },
    {
        "code": "665\n6656",
        "ort": "Ebersburg\n6657"
    },
    {
        "code": "6656",
        "ort": "Ebersburg"
    },
    {
        "code": "6657",
        "ort": "Hofbieber"
    },
    {
        "code": "6658",
        "ort": "Poppenhausen"
    },
    {
        "code": "666\n6661",
        "ort": "Schlüchtern"
    },
    {
        "code": "6661",
        "ort": "Schlüchtern"
    },
    {
        "code": "669\n6691",
        "ort": "Schwalmstadt\n6692"
    },
    {
        "code": "6691",
        "ort": "Schwalmstadt"
    },
    {
        "code": "6692",
        "ort": "Neustadt"
    },
    {
        "code": "6693",
        "ort": "Neuental"
    },
    {
        "code": "6694",
        "ort": "Neukirchen"
    },
    {
        "code": "6695",
        "ort": "Jesberg"
    },
    {
        "code": "6696",
        "ort": "Gilserberg"
    },
    {
        "code": "6697",
        "ort": "Willingshausen"
    },
    {
        "code": "6698",
        "ort": "Alsfeld"
    },
    {
        "code": "6622",
        "ort": "Bebra"
    },
    {
        "code": "6627",
        "ort": "Nentershausen"
    },
    {
        "code": "6641",
        "ort": "Lauterbach"
    },
    {
        "code": "6642",
        "ort": "Schlitz"
    },
    {
        "code": "6643",
        "ort": "Herbstein,"
    },
    {
        "code": "6644",
        "ort": "Grebenhain"
    },
    {
        "code": "6645",
        "ort": "Ulrichstein"
    },
    {
        "code": "6647",
        "ort": "Herbstein-Stockhausen"
    },
    {
        "code": "6648",
        "ort": "Bad"
    },
    {
        "code": "6656",
        "ort": "Ebersburg"
    },
    {
        "code": "6657",
        "ort": "Hofbieber"
    },
    {
        "code": "6658",
        "ort": "Poppenhausen"
    },
    {
        "code": "6661",
        "ort": "Schlüchtern"
    },
    {
        "code": "6691",
        "ort": "Schwalmstadt"
    },
    {
        "code": "6692",
        "ort": "Neustadt"
    },
    {
        "code": "6693",
        "ort": "Neuental"
    },
    {
        "code": "6694",
        "ort": "Neukirchen"
    },
    {
        "code": "6695",
        "ort": "Jesberg"
    },
    {
        "code": "6696",
        "ort": "Gilserberg"
    },
    {
        "code": "6697",
        "ort": "Willingshausen"
    },
    {
        "code": "6698",
        "ort": "Alsfeld"
    },
    {
        "code": "671",
        "ort": "Bad"
    },
    {
        "code": "672\n6721",
        "ort": "Bingen\n6722"
    },
    {
        "code": "6721",
        "ort": "Bingen"
    },
    {
        "code": "6722",
        "ort": "Rüdesheim,"
    },
    {
        "code": "6723",
        "ort": "Oestrich-Winkel,"
    },
    {
        "code": "6724",
        "ort": "Stromberg"
    },
    {
        "code": "6725",
        "ort": "Gau-Algesheim"
    },
    {
        "code": "6726",
        "ort": "Lorch"
    },
    {
        "code": "6727",
        "ort": "Gensingen"
    },
    {
        "code": "6728",
        "ort": "Ober-Hilbersheim"
    },
    {
        "code": "673\n6731",
        "ort": "Alzey\n6732"
    },
    {
        "code": "6731",
        "ort": "Alzey"
    },
    {
        "code": "6732",
        "ort": "Udenheim"
    },
    {
        "code": "6733",
        "ort": "Gau-Odernheim"
    },
    {
        "code": "674\n6741",
        "ort": "Sankt"
    },
    {
        "code": "6741",
        "ort": "Sankt"
    },
    {
        "code": "6744",
        "ort": "Oberwesel"
    },
    {
        "code": "6746",
        "ort": "Pfalzfeld"
    },
    {
        "code": "6747",
        "ort": "Emmelshausen"
    },
    {
        "code": "675\n6751",
        "ort": "Bad"
    },
    {
        "code": "6751",
        "ort": "Bad"
    },
    {
        "code": "6752",
        "ort": "Kirn"
    },
    {
        "code": "6753",
        "ort": "Odenbach,"
    },
    {
        "code": "6754",
        "ort": "Martinstein"
    },
    {
        "code": "6755",
        "ort": "Odernheim"
    },
    {
        "code": "6756",
        "ort": "Winterbach"
    },
    {
        "code": "6757",
        "ort": "Becherbach"
    },
    {
        "code": "6758",
        "ort": "Waldböckelheim"
    },
    {
        "code": "676\n6761",
        "ort": "Simmern"
    },
    {
        "code": "6761",
        "ort": "Simmern"
    },
    {
        "code": "677\n6771",
        "ort": "Sankt"
    },
    {
        "code": "6771",
        "ort": "Sankt"
    },
    {
        "code": "678\n6781",
        "ort": "Idar-Oberstein\n6783"
    },
    {
        "code": "6781",
        "ort": "Idar-Oberstein"
    },
    {
        "code": "6783",
        "ort": "Baumholder"
    },
    {
        "code": "6784",
        "ort": "Idar-Oberstein"
    },
    {
        "code": "6721",
        "ort": "Bingen"
    },
    {
        "code": "6722",
        "ort": "Rüdesheim,"
    },
    {
        "code": "6723",
        "ort": "Oestrich-Winkel,"
    },
    {
        "code": "6724",
        "ort": "Stromberg"
    },
    {
        "code": "6725",
        "ort": "Gau-Algesheim"
    },
    {
        "code": "6726",
        "ort": "Lorch"
    },
    {
        "code": "6727",
        "ort": "Gensingen"
    },
    {
        "code": "6728",
        "ort": "Ober-Hilbersheim"
    },
    {
        "code": "6731",
        "ort": "Alzey"
    },
    {
        "code": "6732",
        "ort": "Udenheim"
    },
    {
        "code": "6733",
        "ort": "Gau-Odernheim"
    },
    {
        "code": "6741",
        "ort": "Sankt"
    },
    {
        "code": "6744",
        "ort": "Oberwesel"
    },
    {
        "code": "6746",
        "ort": "Pfalzfeld"
    },
    {
        "code": "6747",
        "ort": "Emmelshausen"
    },
    {
        "code": "6751",
        "ort": "Bad"
    },
    {
        "code": "6752",
        "ort": "Kirn"
    },
    {
        "code": "6753",
        "ort": "Odenbach,"
    },
    {
        "code": "6754",
        "ort": "Martinstein"
    },
    {
        "code": "6755",
        "ort": "Odernheim"
    },
    {
        "code": "6756",
        "ort": "Winterbach"
    },
    {
        "code": "6757",
        "ort": "Becherbach"
    },
    {
        "code": "6758",
        "ort": "Waldböckelheim"
    },
    {
        "code": "6761",
        "ort": "Simmern"
    },
    {
        "code": "6771",
        "ort": "Sankt"
    },
    {
        "code": "6781",
        "ort": "Idar-Oberstein"
    },
    {
        "code": "6783",
        "ort": "Baumholder"
    },
    {
        "code": "6784",
        "ort": "Idar-Oberstein"
    },
    {
        "code": "681",
        "ort": "Saarbrücken"
    },
    {
        "code": "682\n6821",
        "ort": "Neunkirchen"
    },
    {
        "code": "6821",
        "ort": "Neunkirchen"
    },
    {
        "code": "6824",
        "ort": "Ottweiler"
    },
    {
        "code": "6825",
        "ort": "Illingen"
    },
    {
        "code": "6826",
        "ort": "Bexbach"
    },
    {
        "code": "683\n6831",
        "ort": "Saarlouis,"
    },
    {
        "code": "6831",
        "ort": "Saarlouis,"
    },
    {
        "code": "6832",
        "ort": "Beckingen-Reimsbach"
    },
    {
        "code": "6833",
        "ort": "Rehlingen-Siersburg"
    },
    {
        "code": "6834",
        "ort": "Wadgassen"
    },
    {
        "code": "6835",
        "ort": "Beckingen"
    },
    {
        "code": "6836",
        "ort": "Überherrn"
    },
    {
        "code": "6837",
        "ort": "Wallerfangen"
    },
    {
        "code": "6838",
        "ort": "Saarwellingen"
    },
    {
        "code": "684\n6841",
        "ort": "Homburg"
    },
    {
        "code": "6841",
        "ort": "Homburg"
    },
    {
        "code": "6842",
        "ort": "Blieskastel"
    },
    {
        "code": "6849",
        "ort": "Kirkel"
    },
    {
        "code": "685\n6851",
        "ort": "St."
    },
    {
        "code": "6851",
        "ort": "St."
    },
    {
        "code": "6853",
        "ort": "Marpingen"
    },
    {
        "code": "6855",
        "ort": "Freisen"
    },
    {
        "code": "6857",
        "ort": "Namborn"
    },
    {
        "code": "686\n6861",
        "ort": "Merzig\n6864"
    },
    {
        "code": "6861",
        "ort": "Merzig"
    },
    {
        "code": "6864",
        "ort": "Mettlach"
    },
    {
        "code": "687\n6871",
        "ort": "Wadern\n6872"
    },
    {
        "code": "6871",
        "ort": "Wadern"
    },
    {
        "code": "6872",
        "ort": "Losheim"
    },
    {
        "code": "6876",
        "ort": "Weiskirchen"
    },
    {
        "code": "688\n6881",
        "ort": "Lebach,"
    },
    {
        "code": "6881",
        "ort": "Lebach,"
    },
    {
        "code": "6887",
        "ort": "Schmelz"
    },
    {
        "code": "689\n6894",
        "ort": "St."
    },
    {
        "code": "6894",
        "ort": "St."
    },
    {
        "code": "6897",
        "ort": "Dudweiler,"
    },
    {
        "code": "6898",
        "ort": "Völklingen"
    },
    {
        "code": "6821",
        "ort": "Neunkirchen"
    },
    {
        "code": "6824",
        "ort": "Ottweiler"
    },
    {
        "code": "6825",
        "ort": "Illingen"
    },
    {
        "code": "6826",
        "ort": "Bexbach"
    },
    {
        "code": "6831",
        "ort": "Saarlouis,"
    },
    {
        "code": "6832",
        "ort": "Beckingen-Reimsbach"
    },
    {
        "code": "6833",
        "ort": "Rehlingen-Siersburg"
    },
    {
        "code": "6834",
        "ort": "Wadgassen"
    },
    {
        "code": "6835",
        "ort": "Beckingen"
    },
    {
        "code": "6836",
        "ort": "Überherrn"
    },
    {
        "code": "6837",
        "ort": "Wallerfangen"
    },
    {
        "code": "6838",
        "ort": "Saarwellingen"
    },
    {
        "code": "6841",
        "ort": "Homburg"
    },
    {
        "code": "6842",
        "ort": "Blieskastel"
    },
    {
        "code": "6849",
        "ort": "Kirkel"
    },
    {
        "code": "6851",
        "ort": "St."
    },
    {
        "code": "6853",
        "ort": "Marpingen"
    },
    {
        "code": "6855",
        "ort": "Freisen"
    },
    {
        "code": "6857",
        "ort": "Namborn"
    },
    {
        "code": "6861",
        "ort": "Merzig"
    },
    {
        "code": "6864",
        "ort": "Mettlach"
    },
    {
        "code": "6871",
        "ort": "Wadern"
    },
    {
        "code": "6872",
        "ort": "Losheim"
    },
    {
        "code": "6876",
        "ort": "Weiskirchen"
    },
    {
        "code": "6881",
        "ort": "Lebach,"
    },
    {
        "code": "6887",
        "ort": "Schmelz"
    },
    {
        "code": "6894",
        "ort": "St."
    },
    {
        "code": "6897",
        "ort": "Dudweiler,"
    },
    {
        "code": "6898",
        "ort": "Völklingen"
    },
    {
        "code": "69",
        "ort": "Frankfurt"
    },
    {
        "code": "700",
        "ort": "personal"
    },
    {
        "code": "701",
        "ort": "personal"
    },
    {
        "code": "702\n7021",
        "ort": "Kirchheim"
    },
    {
        "code": "7021",
        "ort": "Kirchheim"
    },
    {
        "code": "7022",
        "ort": "Nürtingen,"
    },
    {
        "code": "7023",
        "ort": "Weilheim"
    },
    {
        "code": "7024",
        "ort": "Wendlingen"
    },
    {
        "code": "7025",
        "ort": "Neuffen,"
    },
    {
        "code": "7026",
        "ort": "Lenningen,"
    },
    {
        "code": "703\n7031",
        "ort": "Böblingen,"
    },
    {
        "code": "7031",
        "ort": "Böblingen,"
    },
    {
        "code": "7032",
        "ort": "Herrenberg,"
    },
    {
        "code": "7033",
        "ort": "Weil"
    },
    {
        "code": "7034",
        "ort": "Ehningen,"
    },
    {
        "code": "704\n7041",
        "ort": "Mühlacker,"
    },
    {
        "code": "7041",
        "ort": "Mühlacker,"
    },
    {
        "code": "7042",
        "ort": "Vaihingen"
    },
    {
        "code": "7043",
        "ort": "Maulbronn,"
    },
    {
        "code": "7044",
        "ort": "Mönsheim,"
    },
    {
        "code": "7045",
        "ort": "Oberderdingen,"
    },
    {
        "code": "7046",
        "ort": "Zaberfeld,"
    },
    {
        "code": "705\n7051",
        "ort": "Calw,"
    },
    {
        "code": "7051",
        "ort": "Calw,"
    },
    {
        "code": "7052",
        "ort": "Bad"
    },
    {
        "code": "7053",
        "ort": "Bad"
    },
    {
        "code": "7054",
        "ort": "Wildberg,"
    },
    {
        "code": "7055",
        "ort": "Neuweiler,"
    },
    {
        "code": "7056",
        "ort": "Gechingen,"
    },
    {
        "code": "706\n7062",
        "ort": "Beilstein,"
    },
    {
        "code": "7062",
        "ort": "Beilstein,"
    },
    {
        "code": "7063",
        "ort": "Bad"
    },
    {
        "code": "7066",
        "ort": "Bad"
    },
    {
        "code": "707\n7071",
        "ort": "Tübingen,"
    },
    {
        "code": "7071",
        "ort": "Tübingen,"
    },
    {
        "code": "7072",
        "ort": "Gomaringen,"
    },
    {
        "code": "7073",
        "ort": "Ammerbuch,"
    },
    {
        "code": "708\n7081",
        "ort": "Bad"
    },
    {
        "code": "7081",
        "ort": "Bad"
    },
    {
        "code": "7082",
        "ort": "Neuenbürg,"
    },
    {
        "code": "7083",
        "ort": "Bad"
    },
    {
        "code": "7084",
        "ort": "Schömberg"
    },
    {
        "code": "7085",
        "ort": "Enzklösterle,"
    },
    {
        "code": "709",
        "ort": "(not"
    },
    {
        "code": "710",
        "ort": "(not"
    },
    {
        "code": "711",
        "ort": "Stuttgart,"
    },
    {
        "code": "712\n7121",
        "ort": "Reutlingen,"
    },
    {
        "code": "7121",
        "ort": "Reutlingen,"
    },
    {
        "code": "7122",
        "ort": "St."
    },
    {
        "code": "7123",
        "ort": "Metzingen,"
    },
    {
        "code": "7124",
        "ort": "Trochtelfingen,"
    },
    {
        "code": "7125",
        "ort": "Bad"
    },
    {
        "code": "7126",
        "ort": "Burladingen-Melchingen,"
    },
    {
        "code": "7127",
        "ort": "Neckartenzlingen,"
    },
    {
        "code": "7128",
        "ort": "Sonnenbühl"
    },
    {
        "code": "7129",
        "ort": "Lichtenstein,"
    },
    {
        "code": "713\n7130",
        "ort": "Löwenstein,"
    },
    {
        "code": "7130",
        "ort": "Löwenstein,"
    },
    {
        "code": "7131",
        "ort": "Heilbronn,"
    },
    {
        "code": "7132",
        "ort": "Neckarsulm,"
    },
    {
        "code": "7133",
        "ort": "Lauffen"
    },
    {
        "code": "7134",
        "ort": "Weinsberg,"
    },
    {
        "code": "7135",
        "ort": "Brackenheim,"
    },
    {
        "code": "7136",
        "ort": "Bad"
    },
    {
        "code": "7138",
        "ort": "Schwaigern,"
    },
    {
        "code": "7139",
        "ort": "Hardthausen"
    },
    {
        "code": "714\n7141",
        "ort": "Ludwigsburg,"
    },
    {
        "code": "7141",
        "ort": "Ludwigsburg,"
    },
    {
        "code": "7142",
        "ort": "Bietigheim-Bissingen,"
    },
    {
        "code": "7143",
        "ort": "Besigheim,"
    },
    {
        "code": "7144",
        "ort": "Marbach"
    },
    {
        "code": "7145",
        "ort": "Markgröningen"
    },
    {
        "code": "7146",
        "ort": "Remseck"
    },
    {
        "code": "7147",
        "ort": "Sachsenheim,"
    },
    {
        "code": "7148",
        "ort": "Großbottwar,"
    },
    {
        "code": "715\n7150",
        "ort": "Münchingen,"
    },
    {
        "code": "7150",
        "ort": "Münchingen,"
    },
    {
        "code": "7151",
        "ort": "Waiblingen,"
    },
    {
        "code": "7152",
        "ort": "Leonberg,"
    },
    {
        "code": "7153",
        "ort": "Plochingen,"
    },
    {
        "code": "7154",
        "ort": "Kornwestheim"
    },
    {
        "code": "7156",
        "ort": "Ditzingen,"
    },
    {
        "code": "7157",
        "ort": "Waldenbuch,"
    },
    {
        "code": "7158",
        "ort": "Neuhausen"
    },
    {
        "code": "7159",
        "ort": "Renningen,"
    },
    {
        "code": "716\n7161",
        "ort": "Göppingen,"
    },
    {
        "code": "7161",
        "ort": "Göppingen,"
    },
    {
        "code": "7162",
        "ort": "Süßen,"
    },
    {
        "code": "7163",
        "ort": "Ebersbach"
    },
    {
        "code": "7164",
        "ort": "Boll,"
    },
    {
        "code": "7165",
        "ort": "Göppingen-Hohenstaufen,"
    },
    {
        "code": "7166",
        "ort": "Adelberg"
    },
    {
        "code": "717\n7171",
        "ort": "Schwäbisch"
    },
    {
        "code": "7171",
        "ort": "Schwäbisch"
    },
    {
        "code": "7172",
        "ort": "Lorch,"
    },
    {
        "code": "7173",
        "ort": "Heubach,"
    },
    {
        "code": "7174",
        "ort": "Mögglingen,"
    },
    {
        "code": "7175",
        "ort": "Leinzell,"
    },
    {
        "code": "7176",
        "ort": "Spraitbach,"
    },
    {
        "code": "718\n7181",
        "ort": "Schorndorf,"
    },
    {
        "code": "7181",
        "ort": "Schorndorf,"
    },
    {
        "code": "7182",
        "ort": "Welzheim,"
    },
    {
        "code": "7183",
        "ort": "Rudersberg,"
    },
    {
        "code": "7184",
        "ort": "Kaisersbach,"
    },
    {
        "code": "719\n7191",
        "ort": "Backnang,"
    },
    {
        "code": "7191",
        "ort": "Backnang,"
    },
    {
        "code": "7192",
        "ort": "Murrhardt,"
    },
    {
        "code": "7193",
        "ort": "Sulzbach"
    },
    {
        "code": "7194",
        "ort": "Spiegelberg,"
    },
    {
        "code": "7195",
        "ort": "Winnenden,"
    },
    {
        "code": "7021",
        "ort": "Kirchheim"
    },
    {
        "code": "7022",
        "ort": "Nürtingen,"
    },
    {
        "code": "7023",
        "ort": "Weilheim"
    },
    {
        "code": "7024",
        "ort": "Wendlingen"
    },
    {
        "code": "7025",
        "ort": "Neuffen,"
    },
    {
        "code": "7026",
        "ort": "Lenningen,"
    },
    {
        "code": "7031",
        "ort": "Böblingen,"
    },
    {
        "code": "7032",
        "ort": "Herrenberg,"
    },
    {
        "code": "7033",
        "ort": "Weil"
    },
    {
        "code": "7034",
        "ort": "Ehningen,"
    },
    {
        "code": "7041",
        "ort": "Mühlacker,"
    },
    {
        "code": "7042",
        "ort": "Vaihingen"
    },
    {
        "code": "7043",
        "ort": "Maulbronn,"
    },
    {
        "code": "7044",
        "ort": "Mönsheim,"
    },
    {
        "code": "7045",
        "ort": "Oberderdingen,"
    },
    {
        "code": "7046",
        "ort": "Zaberfeld,"
    },
    {
        "code": "7051",
        "ort": "Calw,"
    },
    {
        "code": "7052",
        "ort": "Bad"
    },
    {
        "code": "7053",
        "ort": "Bad"
    },
    {
        "code": "7054",
        "ort": "Wildberg,"
    },
    {
        "code": "7055",
        "ort": "Neuweiler,"
    },
    {
        "code": "7056",
        "ort": "Gechingen,"
    },
    {
        "code": "7062",
        "ort": "Beilstein,"
    },
    {
        "code": "7063",
        "ort": "Bad"
    },
    {
        "code": "7066",
        "ort": "Bad"
    },
    {
        "code": "7071",
        "ort": "Tübingen,"
    },
    {
        "code": "7072",
        "ort": "Gomaringen,"
    },
    {
        "code": "7073",
        "ort": "Ammerbuch,"
    },
    {
        "code": "7081",
        "ort": "Bad"
    },
    {
        "code": "7082",
        "ort": "Neuenbürg,"
    },
    {
        "code": "7083",
        "ort": "Bad"
    },
    {
        "code": "7084",
        "ort": "Schömberg"
    },
    {
        "code": "7085",
        "ort": "Enzklösterle,"
    },
    {
        "code": "7121",
        "ort": "Reutlingen,"
    },
    {
        "code": "7122",
        "ort": "St."
    },
    {
        "code": "7123",
        "ort": "Metzingen,"
    },
    {
        "code": "7124",
        "ort": "Trochtelfingen,"
    },
    {
        "code": "7125",
        "ort": "Bad"
    },
    {
        "code": "7126",
        "ort": "Burladingen-Melchingen,"
    },
    {
        "code": "7127",
        "ort": "Neckartenzlingen,"
    },
    {
        "code": "7128",
        "ort": "Sonnenbühl"
    },
    {
        "code": "7129",
        "ort": "Lichtenstein,"
    },
    {
        "code": "7130",
        "ort": "Löwenstein,"
    },
    {
        "code": "7131",
        "ort": "Heilbronn,"
    },
    {
        "code": "7132",
        "ort": "Neckarsulm,"
    },
    {
        "code": "7133",
        "ort": "Lauffen"
    },
    {
        "code": "7134",
        "ort": "Weinsberg,"
    },
    {
        "code": "7135",
        "ort": "Brackenheim,"
    },
    {
        "code": "7136",
        "ort": "Bad"
    },
    {
        "code": "7138",
        "ort": "Schwaigern,"
    },
    {
        "code": "7139",
        "ort": "Hardthausen"
    },
    {
        "code": "7141",
        "ort": "Ludwigsburg,"
    },
    {
        "code": "7142",
        "ort": "Bietigheim-Bissingen,"
    },
    {
        "code": "7143",
        "ort": "Besigheim,"
    },
    {
        "code": "7144",
        "ort": "Marbach"
    },
    {
        "code": "7145",
        "ort": "Markgröningen"
    },
    {
        "code": "7146",
        "ort": "Remseck"
    },
    {
        "code": "7147",
        "ort": "Sachsenheim,"
    },
    {
        "code": "7148",
        "ort": "Großbottwar,"
    },
    {
        "code": "7150",
        "ort": "Münchingen,"
    },
    {
        "code": "7151",
        "ort": "Waiblingen,"
    },
    {
        "code": "7152",
        "ort": "Leonberg,"
    },
    {
        "code": "7153",
        "ort": "Plochingen,"
    },
    {
        "code": "7154",
        "ort": "Kornwestheim"
    },
    {
        "code": "7156",
        "ort": "Ditzingen,"
    },
    {
        "code": "7157",
        "ort": "Waldenbuch,"
    },
    {
        "code": "7158",
        "ort": "Neuhausen"
    },
    {
        "code": "7159",
        "ort": "Renningen,"
    },
    {
        "code": "7161",
        "ort": "Göppingen,"
    },
    {
        "code": "7162",
        "ort": "Süßen,"
    },
    {
        "code": "7163",
        "ort": "Ebersbach"
    },
    {
        "code": "7164",
        "ort": "Boll,"
    },
    {
        "code": "7165",
        "ort": "Göppingen-Hohenstaufen,"
    },
    {
        "code": "7166",
        "ort": "Adelberg"
    },
    {
        "code": "7171",
        "ort": "Schwäbisch"
    },
    {
        "code": "7172",
        "ort": "Lorch,"
    },
    {
        "code": "7173",
        "ort": "Heubach,"
    },
    {
        "code": "7174",
        "ort": "Mögglingen,"
    },
    {
        "code": "7175",
        "ort": "Leinzell,"
    },
    {
        "code": "7176",
        "ort": "Spraitbach,"
    },
    {
        "code": "7181",
        "ort": "Schorndorf,"
    },
    {
        "code": "7182",
        "ort": "Welzheim,"
    },
    {
        "code": "7183",
        "ort": "Rudersberg,"
    },
    {
        "code": "7184",
        "ort": "Kaisersbach,"
    },
    {
        "code": "7191",
        "ort": "Backnang,"
    },
    {
        "code": "7192",
        "ort": "Murrhardt,"
    },
    {
        "code": "7193",
        "ort": "Sulzbach"
    },
    {
        "code": "7194",
        "ort": "Spiegelberg,"
    },
    {
        "code": "7195",
        "ort": "Winnenden,"
    },
    {
        "code": "720\n7202",
        "ort": "Karlsbad\n7203"
    },
    {
        "code": "7202",
        "ort": "Karlsbad"
    },
    {
        "code": "7203",
        "ort": "Walzbachtal"
    },
    {
        "code": "7204",
        "ort": "Malsch-Völkersbach,"
    },
    {
        "code": "721",
        "ort": "Karlsruhe,"
    },
    {
        "code": "722\n7220",
        "ort": "Forbach,"
    },
    {
        "code": "7220",
        "ort": "Forbach,"
    },
    {
        "code": "7221",
        "ort": "Baden-Baden,"
    },
    {
        "code": "7222",
        "ort": "Rastatt,"
    },
    {
        "code": "7223",
        "ort": "Bühl,"
    },
    {
        "code": "7224",
        "ort": "Gernsbach,"
    },
    {
        "code": "7225",
        "ort": "Gaggenau,"
    },
    {
        "code": "7226",
        "ort": "Bühl,"
    },
    {
        "code": "7227",
        "ort": "Lichtenau"
    },
    {
        "code": "7228",
        "ort": "Forbach"
    },
    {
        "code": "7229",
        "ort": "Iffezheim,"
    },
    {
        "code": "723\n7231",
        "ort": "Pforzheim,"
    },
    {
        "code": "7231",
        "ort": "Pforzheim,"
    },
    {
        "code": "7232",
        "ort": "Königsbach-Stein,"
    },
    {
        "code": "7233",
        "ort": "Niefern-Öschelbronn"
    },
    {
        "code": "7234",
        "ort": "Tiefenbronn,"
    },
    {
        "code": "7235",
        "ort": "Unterreichenbach,"
    },
    {
        "code": "7236",
        "ort": "Keltern"
    },
    {
        "code": "7237",
        "ort": "Neulingen,"
    },
    {
        "code": "724\n7240",
        "ort": "Pfinztal"
    },
    {
        "code": "7240",
        "ort": "Pfinztal"
    },
    {
        "code": "7242",
        "ort": "Rheinstetten"
    },
    {
        "code": "7243",
        "ort": "Ettlingen,"
    },
    {
        "code": "7244",
        "ort": "Weingarten"
    },
    {
        "code": "7245",
        "ort": "Durmersheim,"
    },
    {
        "code": "7246",
        "ort": "Malsch"
    },
    {
        "code": "7247",
        "ort": "Linkenheim-Hochstetten,"
    },
    {
        "code": "7248",
        "ort": "Marxzell,"
    },
    {
        "code": "7249",
        "ort": "Stutensee"
    },
    {
        "code": "725\n7250",
        "ort": "Kraichtal\n7251"
    },
    {
        "code": "7250",
        "ort": "Kraichtal"
    },
    {
        "code": "7251",
        "ort": "Bruchsal,"
    },
    {
        "code": "7252",
        "ort": "Bretten,"
    },
    {
        "code": "7253",
        "ort": "Bad"
    },
    {
        "code": "7254",
        "ort": "Waghäusel,"
    },
    {
        "code": "7255",
        "ort": "Graben-Neudorf,"
    },
    {
        "code": "7256",
        "ort": "Philippsburg"
    },
    {
        "code": "7257",
        "ort": "Bruchsal-Untergrombach,"
    },
    {
        "code": "7258",
        "ort": "Oberderdingen-Flehingen,"
    },
    {
        "code": "7259",
        "ort": "Östringen-Odenheim,"
    },
    {
        "code": "726\n7260",
        "ort": "Eppingen,"
    },
    {
        "code": "7260",
        "ort": "Eppingen,"
    },
    {
        "code": "7261",
        "ort": "Sinsheim,"
    },
    {
        "code": "7262",
        "ort": "Eppingen"
    },
    {
        "code": "7263",
        "ort": "Waibstadt,"
    },
    {
        "code": "7264",
        "ort": "Bad"
    },
    {
        "code": "7265",
        "ort": "Angelbachtal,"
    },
    {
        "code": "7266",
        "ort": "Kirchardt,"
    },
    {
        "code": "7267",
        "ort": "Gemmingen"
    },
    {
        "code": "7268",
        "ort": "Bad"
    },
    {
        "code": "7269",
        "ort": "Sulzfeld"
    },
    {
        "code": "727\n7271",
        "ort": "Wörth"
    },
    {
        "code": "7271",
        "ort": "Wörth"
    },
    {
        "code": "7272",
        "ort": "Rülzheim,"
    },
    {
        "code": "7273",
        "ort": "Hagenbach,"
    },
    {
        "code": "7274",
        "ort": "Germersheim"
    },
    {
        "code": "7275",
        "ort": "Kandel,"
    },
    {
        "code": "7276",
        "ort": "Herxheim"
    },
    {
        "code": "7277",
        "ort": "Wörth-Büchelberg,"
    },
    {
        "code": "728",
        "ort": "(not"
    },
    {
        "code": "729",
        "ort": "(not"
    },
    {
        "code": "7202",
        "ort": "Karlsbad"
    },
    {
        "code": "7203",
        "ort": "Walzbachtal"
    },
    {
        "code": "7204",
        "ort": "Malsch-Völkersbach,"
    },
    {
        "code": "7220",
        "ort": "Forbach,"
    },
    {
        "code": "7221",
        "ort": "Baden-Baden,"
    },
    {
        "code": "7222",
        "ort": "Rastatt,"
    },
    {
        "code": "7223",
        "ort": "Bühl,"
    },
    {
        "code": "7224",
        "ort": "Gernsbach,"
    },
    {
        "code": "7225",
        "ort": "Gaggenau,"
    },
    {
        "code": "7226",
        "ort": "Bühl,"
    },
    {
        "code": "7227",
        "ort": "Lichtenau"
    },
    {
        "code": "7228",
        "ort": "Forbach"
    },
    {
        "code": "7229",
        "ort": "Iffezheim,"
    },
    {
        "code": "7231",
        "ort": "Pforzheim,"
    },
    {
        "code": "7232",
        "ort": "Königsbach-Stein,"
    },
    {
        "code": "7233",
        "ort": "Niefern-Öschelbronn"
    },
    {
        "code": "7234",
        "ort": "Tiefenbronn,"
    },
    {
        "code": "7235",
        "ort": "Unterreichenbach,"
    },
    {
        "code": "7236",
        "ort": "Keltern"
    },
    {
        "code": "7237",
        "ort": "Neulingen,"
    },
    {
        "code": "7240",
        "ort": "Pfinztal"
    },
    {
        "code": "7242",
        "ort": "Rheinstetten"
    },
    {
        "code": "7243",
        "ort": "Ettlingen,"
    },
    {
        "code": "7244",
        "ort": "Weingarten"
    },
    {
        "code": "7245",
        "ort": "Durmersheim,"
    },
    {
        "code": "7246",
        "ort": "Malsch"
    },
    {
        "code": "7247",
        "ort": "Linkenheim-Hochstetten,"
    },
    {
        "code": "7248",
        "ort": "Marxzell,"
    },
    {
        "code": "7249",
        "ort": "Stutensee"
    },
    {
        "code": "7250",
        "ort": "Kraichtal"
    },
    {
        "code": "7251",
        "ort": "Bruchsal,"
    },
    {
        "code": "7252",
        "ort": "Bretten,"
    },
    {
        "code": "7253",
        "ort": "Bad"
    },
    {
        "code": "7254",
        "ort": "Waghäusel,"
    },
    {
        "code": "7255",
        "ort": "Graben-Neudorf,"
    },
    {
        "code": "7256",
        "ort": "Philippsburg"
    },
    {
        "code": "7257",
        "ort": "Bruchsal-Untergrombach,"
    },
    {
        "code": "7258",
        "ort": "Oberderdingen-Flehingen,"
    },
    {
        "code": "7259",
        "ort": "Östringen-Odenheim,"
    },
    {
        "code": "7260",
        "ort": "Eppingen,"
    },
    {
        "code": "7261",
        "ort": "Sinsheim,"
    },
    {
        "code": "7262",
        "ort": "Eppingen"
    },
    {
        "code": "7263",
        "ort": "Waibstadt,"
    },
    {
        "code": "7264",
        "ort": "Bad"
    },
    {
        "code": "7265",
        "ort": "Angelbachtal,"
    },
    {
        "code": "7266",
        "ort": "Kirchardt,"
    },
    {
        "code": "7267",
        "ort": "Gemmingen"
    },
    {
        "code": "7268",
        "ort": "Bad"
    },
    {
        "code": "7269",
        "ort": "Sulzfeld"
    },
    {
        "code": "7271",
        "ort": "Wörth"
    },
    {
        "code": "7272",
        "ort": "Rülzheim,"
    },
    {
        "code": "7273",
        "ort": "Hagenbach,"
    },
    {
        "code": "7274",
        "ort": "Germersheim"
    },
    {
        "code": "7275",
        "ort": "Kandel,"
    },
    {
        "code": "7276",
        "ort": "Herxheim"
    },
    {
        "code": "7277",
        "ort": "Wörth-Büchelberg,"
    },
    {
        "code": "730\n7300",
        "ort": "Roggenburg"
    },
    {
        "code": "7300",
        "ort": "Roggenburg"
    },
    {
        "code": "7302",
        "ort": "Pfaffenhofen"
    },
    {
        "code": "7303",
        "ort": "Illertissen"
    },
    {
        "code": "7304",
        "ort": "Blaustein,"
    },
    {
        "code": "7305",
        "ort": "Erbach,"
    },
    {
        "code": "7306",
        "ort": "Vöhringen,"
    },
    {
        "code": "7307",
        "ort": "Senden,"
    },
    {
        "code": "7308",
        "ort": "Nersingen,"
    },
    {
        "code": "7309",
        "ort": "Weißenhorn,"
    },
    {
        "code": "731",
        "ort": "Ulm,"
    },
    {
        "code": "732\n7321",
        "ort": "Heidenheim"
    },
    {
        "code": "7321",
        "ort": "Heidenheim"
    },
    {
        "code": "7322",
        "ort": "Giengen"
    },
    {
        "code": "7323",
        "ort": "Gerstetten,"
    },
    {
        "code": "7324",
        "ort": "Herbrechtingen,"
    },
    {
        "code": "7325",
        "ort": "Sontheim"
    },
    {
        "code": "7326",
        "ort": "Neresheim,"
    },
    {
        "code": "7327",
        "ort": "Dischingen,"
    },
    {
        "code": "7328",
        "ort": "Königsbronn"
    },
    {
        "code": "7329",
        "ort": "Steinheim"
    },
    {
        "code": "733\n7331",
        "ort": "Geislingen"
    },
    {
        "code": "7331",
        "ort": "Geislingen"
    },
    {
        "code": "7332",
        "ort": "Lauterstein,"
    },
    {
        "code": "7333",
        "ort": "Laichingen,"
    },
    {
        "code": "7334",
        "ort": "Deggingen,"
    },
    {
        "code": "7335",
        "ort": "Wiesensteig,"
    },
    {
        "code": "7336",
        "ort": "Lonsee,"
    },
    {
        "code": "7337",
        "ort": "Nellingen,"
    },
    {
        "code": "734\n7340",
        "ort": "Neenstetten,"
    },
    {
        "code": "7340",
        "ort": "Neenstetten,"
    },
    {
        "code": "7343",
        "ort": "Buch,"
    },
    {
        "code": "7344",
        "ort": "Blaubeuren,"
    },
    {
        "code": "7345",
        "ort": "Langenau,"
    },
    {
        "code": "7346",
        "ort": "Illerkirchberg,"
    },
    {
        "code": "7347",
        "ort": "Dietenheim,"
    },
    {
        "code": "7348",
        "ort": "Beimerstetten,"
    },
    {
        "code": "735\n7351",
        "ort": "Biberach"
    },
    {
        "code": "7351",
        "ort": "Biberach"
    },
    {
        "code": "7352",
        "ort": "Ochsenhausen,"
    },
    {
        "code": "7353",
        "ort": "Schwendi,"
    },
    {
        "code": "7354",
        "ort": "Erolzheim,"
    },
    {
        "code": "7355",
        "ort": "Hochdorf,"
    },
    {
        "code": "7356",
        "ort": "Schemmerhofen,"
    },
    {
        "code": "7357",
        "ort": "Attenweiler,"
    },
    {
        "code": "7358",
        "ort": "Eberhardzell,"
    },
    {
        "code": "736\n7361",
        "ort": "Aalen,"
    },
    {
        "code": "7361",
        "ort": "Aalen,"
    },
    {
        "code": "7362",
        "ort": "Bopfingen,"
    },
    {
        "code": "7363",
        "ort": "Lauchheim,"
    },
    {
        "code": "7364",
        "ort": "Oberkochen"
    },
    {
        "code": "7365",
        "ort": "Essingen"
    },
    {
        "code": "7366",
        "ort": "Abtsgmünd,"
    },
    {
        "code": "7367",
        "ort": "Aalen-Ebnat,"
    },
    {
        "code": "737\n7371",
        "ort": "Riedlingen,"
    },
    {
        "code": "7371",
        "ort": "Riedlingen,"
    },
    {
        "code": "7373",
        "ort": "Zwiefalten,"
    },
    {
        "code": "7374",
        "ort": "Uttenweiler,"
    },
    {
        "code": "7375",
        "ort": "Obermarchtal,"
    },
    {
        "code": "7376",
        "ort": "Langenenslingen"
    },
    {
        "code": "738\n7381",
        "ort": "Münsingen,"
    },
    {
        "code": "7381",
        "ort": "Münsingen,"
    },
    {
        "code": "7382",
        "ort": "Römerstein,"
    },
    {
        "code": "7383",
        "ort": "Münsingen-Buttenhausen,"
    },
    {
        "code": "7384",
        "ort": "Allmendingen,"
    },
    {
        "code": "7385",
        "ort": "Gomadingen,"
    },
    {
        "code": "7386",
        "ort": "Hayingen,"
    },
    {
        "code": "7387",
        "ort": "Hohenstein"
    },
    {
        "code": "7388",
        "ort": "Pfronstetten,"
    },
    {
        "code": "7389",
        "ort": "Heroldstatt,"
    },
    {
        "code": "739\n7391",
        "ort": "Ehingen"
    },
    {
        "code": "7391",
        "ort": "Ehingen"
    },
    {
        "code": "7392",
        "ort": "Laupheim,"
    },
    {
        "code": "7393",
        "ort": "Munderkingen,"
    },
    {
        "code": "7394",
        "ort": "Schelklingen,"
    },
    {
        "code": "7395",
        "ort": "Ehingen-Dächingen,"
    },
    {
        "code": "7300",
        "ort": "Roggenburg"
    },
    {
        "code": "7302",
        "ort": "Pfaffenhofen"
    },
    {
        "code": "7303",
        "ort": "Illertissen"
    },
    {
        "code": "7304",
        "ort": "Blaustein,"
    },
    {
        "code": "7305",
        "ort": "Erbach,"
    },
    {
        "code": "7306",
        "ort": "Vöhringen,"
    },
    {
        "code": "7307",
        "ort": "Senden,"
    },
    {
        "code": "7308",
        "ort": "Nersingen,"
    },
    {
        "code": "7309",
        "ort": "Weißenhorn,"
    },
    {
        "code": "7321",
        "ort": "Heidenheim"
    },
    {
        "code": "7322",
        "ort": "Giengen"
    },
    {
        "code": "7323",
        "ort": "Gerstetten,"
    },
    {
        "code": "7324",
        "ort": "Herbrechtingen,"
    },
    {
        "code": "7325",
        "ort": "Sontheim"
    },
    {
        "code": "7326",
        "ort": "Neresheim,"
    },
    {
        "code": "7327",
        "ort": "Dischingen,"
    },
    {
        "code": "7328",
        "ort": "Königsbronn"
    },
    {
        "code": "7329",
        "ort": "Steinheim"
    },
    {
        "code": "7331",
        "ort": "Geislingen"
    },
    {
        "code": "7332",
        "ort": "Lauterstein,"
    },
    {
        "code": "7333",
        "ort": "Laichingen,"
    },
    {
        "code": "7334",
        "ort": "Deggingen,"
    },
    {
        "code": "7335",
        "ort": "Wiesensteig,"
    },
    {
        "code": "7336",
        "ort": "Lonsee,"
    },
    {
        "code": "7337",
        "ort": "Nellingen,"
    },
    {
        "code": "7340",
        "ort": "Neenstetten,"
    },
    {
        "code": "7343",
        "ort": "Buch,"
    },
    {
        "code": "7344",
        "ort": "Blaubeuren,"
    },
    {
        "code": "7345",
        "ort": "Langenau,"
    },
    {
        "code": "7346",
        "ort": "Illerkirchberg,"
    },
    {
        "code": "7347",
        "ort": "Dietenheim,"
    },
    {
        "code": "7348",
        "ort": "Beimerstetten,"
    },
    {
        "code": "7351",
        "ort": "Biberach"
    },
    {
        "code": "7352",
        "ort": "Ochsenhausen,"
    },
    {
        "code": "7353",
        "ort": "Schwendi,"
    },
    {
        "code": "7354",
        "ort": "Erolzheim,"
    },
    {
        "code": "7355",
        "ort": "Hochdorf,"
    },
    {
        "code": "7356",
        "ort": "Schemmerhofen,"
    },
    {
        "code": "7357",
        "ort": "Attenweiler,"
    },
    {
        "code": "7358",
        "ort": "Eberhardzell,"
    },
    {
        "code": "7361",
        "ort": "Aalen,"
    },
    {
        "code": "7362",
        "ort": "Bopfingen,"
    },
    {
        "code": "7363",
        "ort": "Lauchheim,"
    },
    {
        "code": "7364",
        "ort": "Oberkochen"
    },
    {
        "code": "7365",
        "ort": "Essingen"
    },
    {
        "code": "7366",
        "ort": "Abtsgmünd,"
    },
    {
        "code": "7367",
        "ort": "Aalen-Ebnat,"
    },
    {
        "code": "7371",
        "ort": "Riedlingen,"
    },
    {
        "code": "7373",
        "ort": "Zwiefalten,"
    },
    {
        "code": "7374",
        "ort": "Uttenweiler,"
    },
    {
        "code": "7375",
        "ort": "Obermarchtal,"
    },
    {
        "code": "7376",
        "ort": "Langenenslingen"
    },
    {
        "code": "7381",
        "ort": "Münsingen,"
    },
    {
        "code": "7382",
        "ort": "Römerstein,"
    },
    {
        "code": "7383",
        "ort": "Münsingen-Buttenhausen,"
    },
    {
        "code": "7384",
        "ort": "Allmendingen,"
    },
    {
        "code": "7385",
        "ort": "Gomadingen,"
    },
    {
        "code": "7386",
        "ort": "Hayingen,"
    },
    {
        "code": "7387",
        "ort": "Hohenstein"
    },
    {
        "code": "7388",
        "ort": "Pfronstetten,"
    },
    {
        "code": "7389",
        "ort": "Heroldstatt,"
    },
    {
        "code": "7391",
        "ort": "Ehingen"
    },
    {
        "code": "7392",
        "ort": "Laupheim,"
    },
    {
        "code": "7393",
        "ort": "Munderkingen,"
    },
    {
        "code": "7394",
        "ort": "Schelklingen,"
    },
    {
        "code": "7395",
        "ort": "Ehingen-Dächingen,"
    },
    {
        "code": "740\n7402",
        "ort": "Fluorn-Winzeln,"
    },
    {
        "code": "7402",
        "ort": "Fluorn-Winzeln,"
    },
    {
        "code": "7403",
        "ort": "Dunningen,"
    },
    {
        "code": "7404",
        "ort": "Epfendorf,"
    },
    {
        "code": "741",
        "ort": "Rottweil,"
    },
    {
        "code": "742\n7420",
        "ort": "Deißlingen\n7422"
    },
    {
        "code": "7420",
        "ort": "Deißlingen"
    },
    {
        "code": "7422",
        "ort": "Schramberg,"
    },
    {
        "code": "7423",
        "ort": "Oberndorf"
    },
    {
        "code": "7424",
        "ort": "Spaichingen,"
    },
    {
        "code": "7425",
        "ort": "Trossingen,"
    },
    {
        "code": "7426",
        "ort": "Gosheim,"
    },
    {
        "code": "7427",
        "ort": "Schömberg"
    },
    {
        "code": "7428",
        "ort": "Rosenfeld,"
    },
    {
        "code": "7429",
        "ort": "Egesheim,"
    },
    {
        "code": "743\n7431",
        "ort": "Albstadt,"
    },
    {
        "code": "7431",
        "ort": "Albstadt,"
    },
    {
        "code": "7432",
        "ort": "Albstadt"
    },
    {
        "code": "7433",
        "ort": "Balingen,"
    },
    {
        "code": "7434",
        "ort": "Winterlingen,"
    },
    {
        "code": "7435",
        "ort": "Albstadt,"
    },
    {
        "code": "7436",
        "ort": "Hausen"
    },
    {
        "code": "744\n7440",
        "ort": "Bad"
    },
    {
        "code": "7440",
        "ort": "Bad"
    },
    {
        "code": "7441",
        "ort": "Freudenstadt"
    },
    {
        "code": "7442",
        "ort": "Baiersbronn,"
    },
    {
        "code": "7443",
        "ort": "Dornstetten,"
    },
    {
        "code": "7444",
        "ort": "Alpirsbach,"
    },
    {
        "code": "7445",
        "ort": "Pfalzgrafenweiler,"
    },
    {
        "code": "7446",
        "ort": "Loßburg"
    },
    {
        "code": "7447",
        "ort": "Baiersbronn-Schwarzenberg,"
    },
    {
        "code": "7448",
        "ort": "Seewald"
    },
    {
        "code": "7449",
        "ort": "Baiersbronn-Obertal,"
    },
    {
        "code": "745\n7451",
        "ort": "Horb"
    },
    {
        "code": "7451",
        "ort": "Horb"
    },
    {
        "code": "7452",
        "ort": "Nagold,"
    },
    {
        "code": "7453",
        "ort": "Altensteig,"
    },
    {
        "code": "7454",
        "ort": "Sulz"
    },
    {
        "code": "7455",
        "ort": "Dornhan,"
    },
    {
        "code": "7456",
        "ort": "Haiterbach"
    },
    {
        "code": "7457",
        "ort": "Rottenburg-Ergenzingen,"
    },
    {
        "code": "7458",
        "ort": "Ebhausen,"
    },
    {
        "code": "7459",
        "ort": "Nagold-Hochdorf,"
    },
    {
        "code": "746\n7461",
        "ort": "Tuttlingen,"
    },
    {
        "code": "7461",
        "ort": "Tuttlingen,"
    },
    {
        "code": "7462",
        "ort": "Immendingen,"
    },
    {
        "code": "7463",
        "ort": "Mühlheim"
    },
    {
        "code": "7464",
        "ort": "Talheim,"
    },
    {
        "code": "7465",
        "ort": "Emmingen-Liptingen,"
    },
    {
        "code": "7466",
        "ort": "Beuron,"
    },
    {
        "code": "7467",
        "ort": "Neuhausen"
    },
    {
        "code": "747\n7471",
        "ort": "Hechingen,"
    },
    {
        "code": "7471",
        "ort": "Hechingen,"
    },
    {
        "code": "7472",
        "ort": "Rottenburg"
    },
    {
        "code": "7473",
        "ort": "Mössingen,"
    },
    {
        "code": "7474",
        "ort": "Haigerloch"
    },
    {
        "code": "7475",
        "ort": "Burladingen"
    },
    {
        "code": "7476",
        "ort": "Bisingen,"
    },
    {
        "code": "7477",
        "ort": "Jungingen,"
    },
    {
        "code": "7478",
        "ort": "Hirrlingen,"
    },
    {
        "code": "748\n7482",
        "ort": "Horb-Dettingen,"
    },
    {
        "code": "7482",
        "ort": "Horb-Dettingen,"
    },
    {
        "code": "7483",
        "ort": "Empfingen,"
    },
    {
        "code": "7484",
        "ort": "Simmersfeld"
    },
    {
        "code": "7485",
        "ort": "Empfingen"
    },
    {
        "code": "7486",
        "ort": "Horb"
    },
    {
        "code": "749",
        "ort": "(not"
    },
    {
        "code": "7402",
        "ort": "Fluorn-Winzeln,"
    },
    {
        "code": "7403",
        "ort": "Dunningen,"
    },
    {
        "code": "7404",
        "ort": "Epfendorf,"
    },
    {
        "code": "7420",
        "ort": "Deißlingen"
    },
    {
        "code": "7422",
        "ort": "Schramberg,"
    },
    {
        "code": "7423",
        "ort": "Oberndorf"
    },
    {
        "code": "7424",
        "ort": "Spaichingen,"
    },
    {
        "code": "7425",
        "ort": "Trossingen,"
    },
    {
        "code": "7426",
        "ort": "Gosheim,"
    },
    {
        "code": "7427",
        "ort": "Schömberg"
    },
    {
        "code": "7428",
        "ort": "Rosenfeld,"
    },
    {
        "code": "7429",
        "ort": "Egesheim,"
    },
    {
        "code": "7431",
        "ort": "Albstadt,"
    },
    {
        "code": "7432",
        "ort": "Albstadt"
    },
    {
        "code": "7433",
        "ort": "Balingen,"
    },
    {
        "code": "7434",
        "ort": "Winterlingen,"
    },
    {
        "code": "7435",
        "ort": "Albstadt,"
    },
    {
        "code": "7436",
        "ort": "Hausen"
    },
    {
        "code": "7440",
        "ort": "Bad"
    },
    {
        "code": "7441",
        "ort": "Freudenstadt"
    },
    {
        "code": "7442",
        "ort": "Baiersbronn,"
    },
    {
        "code": "7443",
        "ort": "Dornstetten,"
    },
    {
        "code": "7444",
        "ort": "Alpirsbach,"
    },
    {
        "code": "7445",
        "ort": "Pfalzgrafenweiler,"
    },
    {
        "code": "7446",
        "ort": "Loßburg"
    },
    {
        "code": "7447",
        "ort": "Baiersbronn-Schwarzenberg,"
    },
    {
        "code": "7448",
        "ort": "Seewald"
    },
    {
        "code": "7449",
        "ort": "Baiersbronn-Obertal,"
    },
    {
        "code": "7451",
        "ort": "Horb"
    },
    {
        "code": "7452",
        "ort": "Nagold,"
    },
    {
        "code": "7453",
        "ort": "Altensteig,"
    },
    {
        "code": "7454",
        "ort": "Sulz"
    },
    {
        "code": "7455",
        "ort": "Dornhan,"
    },
    {
        "code": "7456",
        "ort": "Haiterbach"
    },
    {
        "code": "7457",
        "ort": "Rottenburg-Ergenzingen,"
    },
    {
        "code": "7458",
        "ort": "Ebhausen,"
    },
    {
        "code": "7459",
        "ort": "Nagold-Hochdorf,"
    },
    {
        "code": "7461",
        "ort": "Tuttlingen,"
    },
    {
        "code": "7462",
        "ort": "Immendingen,"
    },
    {
        "code": "7463",
        "ort": "Mühlheim"
    },
    {
        "code": "7464",
        "ort": "Talheim,"
    },
    {
        "code": "7465",
        "ort": "Emmingen-Liptingen,"
    },
    {
        "code": "7466",
        "ort": "Beuron,"
    },
    {
        "code": "7467",
        "ort": "Neuhausen"
    },
    {
        "code": "7471",
        "ort": "Hechingen,"
    },
    {
        "code": "7472",
        "ort": "Rottenburg"
    },
    {
        "code": "7473",
        "ort": "Mössingen,"
    },
    {
        "code": "7474",
        "ort": "Haigerloch"
    },
    {
        "code": "7475",
        "ort": "Burladingen"
    },
    {
        "code": "7476",
        "ort": "Bisingen,"
    },
    {
        "code": "7477",
        "ort": "Jungingen,"
    },
    {
        "code": "7478",
        "ort": "Hirrlingen,"
    },
    {
        "code": "7482",
        "ort": "Horb-Dettingen,"
    },
    {
        "code": "7483",
        "ort": "Empfingen,"
    },
    {
        "code": "7484",
        "ort": "Simmersfeld"
    },
    {
        "code": "7485",
        "ort": "Empfingen"
    },
    {
        "code": "7486",
        "ort": "Horb"
    },
    {
        "code": "750\n7502",
        "ort": "Wolpertswende,"
    },
    {
        "code": "7502",
        "ort": "Wolpertswende,"
    },
    {
        "code": "7503",
        "ort": "Wilhelmsdorf,"
    },
    {
        "code": "7504",
        "ort": "Horgenzell,"
    },
    {
        "code": "7505",
        "ort": "Fronreute,"
    },
    {
        "code": "7506",
        "ort": "Wangen,"
    },
    {
        "code": "751",
        "ort": "Ravensburg,"
    },
    {
        "code": "752\n7520",
        "ort": "Bodnegg,"
    },
    {
        "code": "7520",
        "ort": "Bodnegg,"
    },
    {
        "code": "7522",
        "ort": "Wangen"
    },
    {
        "code": "7524",
        "ort": "Bad"
    },
    {
        "code": "7525",
        "ort": "Aulendorf,"
    },
    {
        "code": "7527",
        "ort": "Wolfegg,"
    },
    {
        "code": "7528",
        "ort": "Neukirch,"
    },
    {
        "code": "7529",
        "ort": "Waldburg,"
    },
    {
        "code": "753\n7531",
        "ort": "Konstanz,"
    },
    {
        "code": "7531",
        "ort": "Konstanz,"
    },
    {
        "code": "7532",
        "ort": "Meersburg,"
    },
    {
        "code": "7533",
        "ort": "Allensbach,"
    },
    {
        "code": "7534",
        "ort": "Reichenau"
    },
    {
        "code": "754\n7541",
        "ort": "Friedrichshafen,"
    },
    {
        "code": "7541",
        "ort": "Friedrichshafen,"
    },
    {
        "code": "7542",
        "ort": "Tettnang,"
    },
    {
        "code": "7543",
        "ort": "Kressbronn,"
    },
    {
        "code": "7544",
        "ort": "Markdorf,"
    },
    {
        "code": "7545",
        "ort": "Immenstaad"
    },
    {
        "code": "7546",
        "ort": "Oberteuringen"
    },
    {
        "code": "755\n7551",
        "ort": "Überlingen,"
    },
    {
        "code": "7551",
        "ort": "Überlingen,"
    },
    {
        "code": "7552",
        "ort": "Pfullendorf,"
    },
    {
        "code": "7553",
        "ort": "Salem,"
    },
    {
        "code": "7554",
        "ort": "Heiligenberg,"
    },
    {
        "code": "7555",
        "ort": "Deggenhausertal,"
    },
    {
        "code": "7556",
        "ort": "Uhldingen-Mühlhofen,"
    },
    {
        "code": "7557",
        "ort": "Herdwangen-Schönach,"
    },
    {
        "code": "7558",
        "ort": "Illmensee,"
    },
    {
        "code": "756\n7561",
        "ort": "Leutkirch"
    },
    {
        "code": "7561",
        "ort": "Leutkirch"
    },
    {
        "code": "7562",
        "ort": "Isny"
    },
    {
        "code": "7563",
        "ort": "Kißlegg,"
    },
    {
        "code": "7564",
        "ort": "Bad"
    },
    {
        "code": "7565",
        "ort": "Aichstetten,"
    },
    {
        "code": "7566",
        "ort": "Argenbühl,"
    },
    {
        "code": "7567",
        "ort": "Leutkirch,"
    },
    {
        "code": "7568",
        "ort": "Bad"
    },
    {
        "code": "7569",
        "ort": "Isny"
    },
    {
        "code": "757\n7570",
        "ort": "Sigmaringen-Gutenstein,"
    },
    {
        "code": "7570",
        "ort": "Sigmaringen-Gutenstein,"
    },
    {
        "code": "7571",
        "ort": "Sigmaringen,"
    },
    {
        "code": "7572",
        "ort": "Mengen,"
    },
    {
        "code": "7573",
        "ort": "Stetten"
    },
    {
        "code": "7574",
        "ort": "Gammertingen,"
    },
    {
        "code": "7575",
        "ort": "Meßkirch,"
    },
    {
        "code": "7576",
        "ort": "Krauchenwies,"
    },
    {
        "code": "7577",
        "ort": "Veringenstadt,"
    },
    {
        "code": "7578",
        "ort": "Wald,"
    },
    {
        "code": "7579",
        "ort": "Schwenningen,"
    },
    {
        "code": "758\n7581",
        "ort": "Bad"
    },
    {
        "code": "7581",
        "ort": "Bad"
    },
    {
        "code": "7582",
        "ort": "Bad"
    },
    {
        "code": "7583",
        "ort": "Bad"
    },
    {
        "code": "7584",
        "ort": "Altshausen,"
    },
    {
        "code": "7585",
        "ort": "Ostrach,"
    },
    {
        "code": "7586",
        "ort": "Herbertingen,"
    },
    {
        "code": "7587",
        "ort": "Hoßkirch,"
    },
    {
        "code": "759",
        "ort": "(not"
    },
    {
        "code": "7502",
        "ort": "Wolpertswende,"
    },
    {
        "code": "7503",
        "ort": "Wilhelmsdorf,"
    },
    {
        "code": "7504",
        "ort": "Horgenzell,"
    },
    {
        "code": "7505",
        "ort": "Fronreute,"
    },
    {
        "code": "7506",
        "ort": "Wangen,"
    },
    {
        "code": "7520",
        "ort": "Bodnegg,"
    },
    {
        "code": "7522",
        "ort": "Wangen"
    },
    {
        "code": "7524",
        "ort": "Bad"
    },
    {
        "code": "7525",
        "ort": "Aulendorf,"
    },
    {
        "code": "7527",
        "ort": "Wolfegg,"
    },
    {
        "code": "7528",
        "ort": "Neukirch,"
    },
    {
        "code": "7529",
        "ort": "Waldburg,"
    },
    {
        "code": "7531",
        "ort": "Konstanz,"
    },
    {
        "code": "7532",
        "ort": "Meersburg,"
    },
    {
        "code": "7533",
        "ort": "Allensbach,"
    },
    {
        "code": "7534",
        "ort": "Reichenau"
    },
    {
        "code": "7541",
        "ort": "Friedrichshafen,"
    },
    {
        "code": "7542",
        "ort": "Tettnang,"
    },
    {
        "code": "7543",
        "ort": "Kressbronn,"
    },
    {
        "code": "7544",
        "ort": "Markdorf,"
    },
    {
        "code": "7545",
        "ort": "Immenstaad"
    },
    {
        "code": "7546",
        "ort": "Oberteuringen"
    },
    {
        "code": "7551",
        "ort": "Überlingen,"
    },
    {
        "code": "7552",
        "ort": "Pfullendorf,"
    },
    {
        "code": "7553",
        "ort": "Salem,"
    },
    {
        "code": "7554",
        "ort": "Heiligenberg,"
    },
    {
        "code": "7555",
        "ort": "Deggenhausertal,"
    },
    {
        "code": "7556",
        "ort": "Uhldingen-Mühlhofen,"
    },
    {
        "code": "7557",
        "ort": "Herdwangen-Schönach,"
    },
    {
        "code": "7558",
        "ort": "Illmensee,"
    },
    {
        "code": "7561",
        "ort": "Leutkirch"
    },
    {
        "code": "7562",
        "ort": "Isny"
    },
    {
        "code": "7563",
        "ort": "Kißlegg,"
    },
    {
        "code": "7564",
        "ort": "Bad"
    },
    {
        "code": "7565",
        "ort": "Aichstetten,"
    },
    {
        "code": "7566",
        "ort": "Argenbühl,"
    },
    {
        "code": "7567",
        "ort": "Leutkirch,"
    },
    {
        "code": "7568",
        "ort": "Bad"
    },
    {
        "code": "7569",
        "ort": "Isny"
    },
    {
        "code": "7570",
        "ort": "Sigmaringen-Gutenstein,"
    },
    {
        "code": "7571",
        "ort": "Sigmaringen,"
    },
    {
        "code": "7572",
        "ort": "Mengen,"
    },
    {
        "code": "7573",
        "ort": "Stetten"
    },
    {
        "code": "7574",
        "ort": "Gammertingen,"
    },
    {
        "code": "7575",
        "ort": "Meßkirch,"
    },
    {
        "code": "7576",
        "ort": "Krauchenwies,"
    },
    {
        "code": "7577",
        "ort": "Veringenstadt,"
    },
    {
        "code": "7578",
        "ort": "Wald,"
    },
    {
        "code": "7579",
        "ort": "Schwenningen,"
    },
    {
        "code": "7581",
        "ort": "Bad"
    },
    {
        "code": "7582",
        "ort": "Bad"
    },
    {
        "code": "7583",
        "ort": "Bad"
    },
    {
        "code": "7584",
        "ort": "Altshausen,"
    },
    {
        "code": "7585",
        "ort": "Ostrach,"
    },
    {
        "code": "7586",
        "ort": "Herbertingen,"
    },
    {
        "code": "7587",
        "ort": "Hoßkirch,"
    },
    {
        "code": "760\n7602",
        "ort": "Oberried,"
    },
    {
        "code": "7602",
        "ort": "Oberried,"
    },
    {
        "code": "761",
        "ort": "Freiburg"
    },
    {
        "code": "762\n7620",
        "ort": "Schopfheim\n7621"
    },
    {
        "code": "7620",
        "ort": "Schopfheim"
    },
    {
        "code": "7621",
        "ort": "Lörrach,"
    },
    {
        "code": "7622",
        "ort": "Schopfheim,"
    },
    {
        "code": "7623",
        "ort": "Rheinfelden"
    },
    {
        "code": "7624",
        "ort": "Grenzach-Wyhlen"
    },
    {
        "code": "7625",
        "ort": "Zell"
    },
    {
        "code": "7626",
        "ort": "Kandern,"
    },
    {
        "code": "7627",
        "ort": "Steinen,"
    },
    {
        "code": "7628",
        "ort": "Efringen-Kirchen,"
    },
    {
        "code": "7629",
        "ort": "Tegernau,"
    },
    {
        "code": "763\n7631",
        "ort": "Müllheim,"
    },
    {
        "code": "7631",
        "ort": "Müllheim,"
    },
    {
        "code": "7632",
        "ort": "Badenweiler"
    },
    {
        "code": "7633",
        "ort": "Staufen"
    },
    {
        "code": "7634",
        "ort": "Sulzburg,"
    },
    {
        "code": "7635",
        "ort": "Schliengen,"
    },
    {
        "code": "7636",
        "ort": "Münstertal/Schwarzwald,"
    },
    {
        "code": "764\n7641",
        "ort": "Emmendingen,"
    },
    {
        "code": "7641",
        "ort": "Emmendingen,"
    },
    {
        "code": "7642",
        "ort": "Endingen"
    },
    {
        "code": "7643",
        "ort": "Herbolzheim,"
    },
    {
        "code": "7644",
        "ort": "Kenzingen,"
    },
    {
        "code": "7645",
        "ort": "Freiamt,"
    },
    {
        "code": "7646",
        "ort": "Weisweil"
    },
    {
        "code": "765\n7651",
        "ort": "Titisee-Neustadt,"
    },
    {
        "code": "7651",
        "ort": "Titisee-Neustadt,"
    },
    {
        "code": "7652",
        "ort": "Breitnau,"
    },
    {
        "code": "7653",
        "ort": "Lenzkirch,"
    },
    {
        "code": "7654",
        "ort": "Löffingen,"
    },
    {
        "code": "7655",
        "ort": "Feldberg,"
    },
    {
        "code": "7656",
        "ort": "Schluchsee"
    },
    {
        "code": "7657",
        "ort": "Eisenbach"
    },
    {
        "code": "766\n7660",
        "ort": "St."
    },
    {
        "code": "7660",
        "ort": "St."
    },
    {
        "code": "7661",
        "ort": "Kirchzarten,"
    },
    {
        "code": "7662",
        "ort": "Vogtsburg"
    },
    {
        "code": "7663",
        "ort": "Eichstetten"
    },
    {
        "code": "7664",
        "ort": "Freiburg-Tiengen,"
    },
    {
        "code": "7665",
        "ort": "March,"
    },
    {
        "code": "7666",
        "ort": "Denzlingen,"
    },
    {
        "code": "7667",
        "ort": "Breisach"
    },
    {
        "code": "7668",
        "ort": "Ihringen,"
    },
    {
        "code": "7669",
        "ort": "St."
    },
    {
        "code": "767\n7671",
        "ort": "Todtnau\n7672"
    },
    {
        "code": "7671",
        "ort": "Todtnau"
    },
    {
        "code": "7672",
        "ort": "St."
    },
    {
        "code": "7673",
        "ort": "Schönau"
    },
    {
        "code": "7674",
        "ort": "Todtmoos,"
    },
    {
        "code": "7675",
        "ort": "Bernau,"
    },
    {
        "code": "7676",
        "ort": "Feldberg,"
    },
    {
        "code": "768\n7681",
        "ort": "Waldkirch,"
    },
    {
        "code": "7681",
        "ort": "Waldkirch,"
    },
    {
        "code": "7682",
        "ort": "Elzach,"
    },
    {
        "code": "7683",
        "ort": "Simonswald"
    },
    {
        "code": "7684",
        "ort": "Glottertal"
    },
    {
        "code": "7685",
        "ort": "Gutach"
    },
    {
        "code": "769",
        "ort": "(not"
    },
    {
        "code": "7602",
        "ort": "Oberried,"
    },
    {
        "code": "7620",
        "ort": "Schopfheim"
    },
    {
        "code": "7621",
        "ort": "Lörrach,"
    },
    {
        "code": "7622",
        "ort": "Schopfheim,"
    },
    {
        "code": "7623",
        "ort": "Rheinfelden"
    },
    {
        "code": "7624",
        "ort": "Grenzach-Wyhlen"
    },
    {
        "code": "7625",
        "ort": "Zell"
    },
    {
        "code": "7626",
        "ort": "Kandern,"
    },
    {
        "code": "7627",
        "ort": "Steinen,"
    },
    {
        "code": "7628",
        "ort": "Efringen-Kirchen,"
    },
    {
        "code": "7629",
        "ort": "Tegernau,"
    },
    {
        "code": "7631",
        "ort": "Müllheim,"
    },
    {
        "code": "7632",
        "ort": "Badenweiler"
    },
    {
        "code": "7633",
        "ort": "Staufen"
    },
    {
        "code": "7634",
        "ort": "Sulzburg,"
    },
    {
        "code": "7635",
        "ort": "Schliengen,"
    },
    {
        "code": "7636",
        "ort": "Münstertal/Schwarzwald,"
    },
    {
        "code": "7641",
        "ort": "Emmendingen,"
    },
    {
        "code": "7642",
        "ort": "Endingen"
    },
    {
        "code": "7643",
        "ort": "Herbolzheim,"
    },
    {
        "code": "7644",
        "ort": "Kenzingen,"
    },
    {
        "code": "7645",
        "ort": "Freiamt,"
    },
    {
        "code": "7646",
        "ort": "Weisweil"
    },
    {
        "code": "7651",
        "ort": "Titisee-Neustadt,"
    },
    {
        "code": "7652",
        "ort": "Breitnau,"
    },
    {
        "code": "7653",
        "ort": "Lenzkirch,"
    },
    {
        "code": "7654",
        "ort": "Löffingen,"
    },
    {
        "code": "7655",
        "ort": "Feldberg,"
    },
    {
        "code": "7656",
        "ort": "Schluchsee"
    },
    {
        "code": "7657",
        "ort": "Eisenbach"
    },
    {
        "code": "7660",
        "ort": "St."
    },
    {
        "code": "7661",
        "ort": "Kirchzarten,"
    },
    {
        "code": "7662",
        "ort": "Vogtsburg"
    },
    {
        "code": "7663",
        "ort": "Eichstetten"
    },
    {
        "code": "7664",
        "ort": "Freiburg-Tiengen,"
    },
    {
        "code": "7665",
        "ort": "March,"
    },
    {
        "code": "7666",
        "ort": "Denzlingen,"
    },
    {
        "code": "7667",
        "ort": "Breisach"
    },
    {
        "code": "7668",
        "ort": "Ihringen,"
    },
    {
        "code": "7669",
        "ort": "St."
    },
    {
        "code": "7671",
        "ort": "Todtnau"
    },
    {
        "code": "7672",
        "ort": "St."
    },
    {
        "code": "7673",
        "ort": "Schönau"
    },
    {
        "code": "7674",
        "ort": "Todtmoos,"
    },
    {
        "code": "7675",
        "ort": "Bernau,"
    },
    {
        "code": "7676",
        "ort": "Feldberg,"
    },
    {
        "code": "7681",
        "ort": "Waldkirch,"
    },
    {
        "code": "7682",
        "ort": "Elzach,"
    },
    {
        "code": "7683",
        "ort": "Simonswald"
    },
    {
        "code": "7684",
        "ort": "Glottertal"
    },
    {
        "code": "7685",
        "ort": "Gutach"
    },
    {
        "code": "770\n7702",
        "ort": "Blumberg\n7703"
    },
    {
        "code": "7702",
        "ort": "Blumberg"
    },
    {
        "code": "7703",
        "ort": "Bonndorf"
    },
    {
        "code": "7704",
        "ort": "Geisingen"
    },
    {
        "code": "7705",
        "ort": "Bräunlingen-Mistelbrunn,"
    },
    {
        "code": "7706",
        "ort": "Bad"
    },
    {
        "code": "7707",
        "ort": "Bräunlingen-Döggingen,"
    },
    {
        "code": "7708",
        "ort": "Geisingen"
    },
    {
        "code": "7709",
        "ort": "Wutach,"
    },
    {
        "code": "771",
        "ort": "Donaueschingen,"
    },
    {
        "code": "772\n7720",
        "ort": "Villingen-Schwenningen-OT:"
    },
    {
        "code": "7720",
        "ort": "Villingen-Schwenningen-OT:"
    },
    {
        "code": "7721",
        "ort": "Villingen-Schwenningen-OT:"
    },
    {
        "code": "7722",
        "ort": "Triberg"
    },
    {
        "code": "7723",
        "ort": "Furtwangen,"
    },
    {
        "code": "7724",
        "ort": "St."
    },
    {
        "code": "7725",
        "ort": "Königsfeld"
    },
    {
        "code": "7726",
        "ort": "Bad"
    },
    {
        "code": "7727",
        "ort": "Vöhrenbach,"
    },
    {
        "code": "7728",
        "ort": "Niedereschach,"
    },
    {
        "code": "7729",
        "ort": "Schramberg:"
    },
    {
        "code": "773\n7731",
        "ort": "Singen,"
    },
    {
        "code": "7731",
        "ort": "Singen,"
    },
    {
        "code": "7732",
        "ort": "Radolfzell"
    },
    {
        "code": "7733",
        "ort": "Engen,"
    },
    {
        "code": "7734",
        "ort": "Gailingen"
    },
    {
        "code": "7735",
        "ort": "Öhningen,"
    },
    {
        "code": "7736",
        "ort": "Tengen,"
    },
    {
        "code": "7738",
        "ort": "Steißlingen,"
    },
    {
        "code": "7739",
        "ort": "Hilzingen,"
    },
    {
        "code": "774\n7741",
        "ort": "Waldshut-Tiengen-OT:"
    },
    {
        "code": "7741",
        "ort": "Waldshut-Tiengen-OT:"
    },
    {
        "code": "7742",
        "ort": "Klettgau,"
    },
    {
        "code": "7743",
        "ort": "Ühlingen-Birkendorf,"
    },
    {
        "code": "7744",
        "ort": "Stühlingen"
    },
    {
        "code": "7745",
        "ort": "Jestetten,"
    },
    {
        "code": "7746",
        "ort": "Eggingen,"
    },
    {
        "code": "7747",
        "ort": "Grafenhausen,"
    },
    {
        "code": "7748",
        "ort": "Grafenhausen"
    },
    {
        "code": "775\n7751",
        "ort": "Waldshut-Tiengen,"
    },
    {
        "code": "7751",
        "ort": "Waldshut-Tiengen,"
    },
    {
        "code": "7753",
        "ort": "Albbruck,"
    },
    {
        "code": "7754",
        "ort": "Görwihl,"
    },
    {
        "code": "7755",
        "ort": "Weilheim"
    },
    {
        "code": "776\n7761",
        "ort": "Bad"
    },
    {
        "code": "7761",
        "ort": "Bad"
    },
    {
        "code": "7762",
        "ort": "Wehr"
    },
    {
        "code": "7763",
        "ort": "Murg,"
    },
    {
        "code": "7764",
        "ort": "Herrischried,"
    },
    {
        "code": "7765",
        "ort": "Rickenbach"
    },
    {
        "code": "777\n7771",
        "ort": "Stockach,"
    },
    {
        "code": "7771",
        "ort": "Stockach,"
    },
    {
        "code": "7773",
        "ort": "Bodman-Ludwigshafen,"
    },
    {
        "code": "7774",
        "ort": "Eigeltingen,"
    },
    {
        "code": "7775",
        "ort": "Mühlingen,"
    },
    {
        "code": "7777",
        "ort": "Sauldorf,"
    },
    {
        "code": "778",
        "ort": "(not"
    },
    {
        "code": "779",
        "ort": "(not"
    },
    {
        "code": "7702",
        "ort": "Blumberg"
    },
    {
        "code": "7703",
        "ort": "Bonndorf"
    },
    {
        "code": "7704",
        "ort": "Geisingen"
    },
    {
        "code": "7705",
        "ort": "Bräunlingen-Mistelbrunn,"
    },
    {
        "code": "7706",
        "ort": "Bad"
    },
    {
        "code": "7707",
        "ort": "Bräunlingen-Döggingen,"
    },
    {
        "code": "7708",
        "ort": "Geisingen"
    },
    {
        "code": "7709",
        "ort": "Wutach,"
    },
    {
        "code": "7720",
        "ort": "Villingen-Schwenningen-OT:"
    },
    {
        "code": "7721",
        "ort": "Villingen-Schwenningen-OT:"
    },
    {
        "code": "7722",
        "ort": "Triberg"
    },
    {
        "code": "7723",
        "ort": "Furtwangen,"
    },
    {
        "code": "7724",
        "ort": "St."
    },
    {
        "code": "7725",
        "ort": "Königsfeld"
    },
    {
        "code": "7726",
        "ort": "Bad"
    },
    {
        "code": "7727",
        "ort": "Vöhrenbach,"
    },
    {
        "code": "7728",
        "ort": "Niedereschach,"
    },
    {
        "code": "7729",
        "ort": "Schramberg:"
    },
    {
        "code": "7731",
        "ort": "Singen,"
    },
    {
        "code": "7732",
        "ort": "Radolfzell"
    },
    {
        "code": "7733",
        "ort": "Engen,"
    },
    {
        "code": "7734",
        "ort": "Gailingen"
    },
    {
        "code": "7735",
        "ort": "Öhningen,"
    },
    {
        "code": "7736",
        "ort": "Tengen,"
    },
    {
        "code": "7738",
        "ort": "Steißlingen,"
    },
    {
        "code": "7739",
        "ort": "Hilzingen,"
    },
    {
        "code": "7741",
        "ort": "Waldshut-Tiengen-OT:"
    },
    {
        "code": "7742",
        "ort": "Klettgau,"
    },
    {
        "code": "7743",
        "ort": "Ühlingen-Birkendorf,"
    },
    {
        "code": "7744",
        "ort": "Stühlingen"
    },
    {
        "code": "7745",
        "ort": "Jestetten,"
    },
    {
        "code": "7746",
        "ort": "Eggingen,"
    },
    {
        "code": "7747",
        "ort": "Grafenhausen,"
    },
    {
        "code": "7748",
        "ort": "Grafenhausen"
    },
    {
        "code": "7751",
        "ort": "Waldshut-Tiengen,"
    },
    {
        "code": "7753",
        "ort": "Albbruck,"
    },
    {
        "code": "7754",
        "ort": "Görwihl,"
    },
    {
        "code": "7755",
        "ort": "Weilheim"
    },
    {
        "code": "7761",
        "ort": "Bad"
    },
    {
        "code": "7762",
        "ort": "Wehr"
    },
    {
        "code": "7763",
        "ort": "Murg,"
    },
    {
        "code": "7764",
        "ort": "Herrischried,"
    },
    {
        "code": "7765",
        "ort": "Rickenbach"
    },
    {
        "code": "7771",
        "ort": "Stockach,"
    },
    {
        "code": "7773",
        "ort": "Bodman-Ludwigshafen,"
    },
    {
        "code": "7774",
        "ort": "Eigeltingen,"
    },
    {
        "code": "7775",
        "ort": "Mühlingen,"
    },
    {
        "code": "7777",
        "ort": "Sauldorf,"
    },
    {
        "code": "780\n7802",
        "ort": "Oberkirch,"
    },
    {
        "code": "7802",
        "ort": "Oberkirch,"
    },
    {
        "code": "7803",
        "ort": "Gengenbach,"
    },
    {
        "code": "7804",
        "ort": "Oppenau"
    },
    {
        "code": "7805",
        "ort": "Appenweier,"
    },
    {
        "code": "7806",
        "ort": "Bad"
    },
    {
        "code": "7807",
        "ort": "Neuried"
    },
    {
        "code": "7808",
        "ort": "Hohberg,"
    },
    {
        "code": "781",
        "ort": "Offenburg,"
    },
    {
        "code": "782\n7821",
        "ort": "Lahr/Schwarzwald,"
    },
    {
        "code": "7821",
        "ort": "Lahr/Schwarzwald,"
    },
    {
        "code": "7822",
        "ort": "Ettenheim,"
    },
    {
        "code": "7823",
        "ort": "Seelbach,"
    },
    {
        "code": "7824",
        "ort": "Schwanau,"
    },
    {
        "code": "7825",
        "ort": "Kippenheim,"
    },
    {
        "code": "7826",
        "ort": "Schuttertal,"
    },
    {
        "code": "783\n7831",
        "ort": "Hausach,"
    },
    {
        "code": "7831",
        "ort": "Hausach,"
    },
    {
        "code": "7832",
        "ort": "Haslach"
    },
    {
        "code": "7833",
        "ort": "Hornberg,"
    },
    {
        "code": "7834",
        "ort": "Wolfach,"
    },
    {
        "code": "7835",
        "ort": "Zell"
    },
    {
        "code": "7836",
        "ort": "Schiltach,"
    },
    {
        "code": "7837",
        "ort": "Oberharmersbach,"
    },
    {
        "code": "7838",
        "ort": "Nordrach"
    },
    {
        "code": "7839",
        "ort": "Schapbach,"
    },
    {
        "code": "784\n7841",
        "ort": "Achern,"
    },
    {
        "code": "7841",
        "ort": "Achern,"
    },
    {
        "code": "7842",
        "ort": "Kappelrodeck,"
    },
    {
        "code": "7843",
        "ort": "Renchen,"
    },
    {
        "code": "7844",
        "ort": "Rheinau,"
    },
    {
        "code": "785\n7851",
        "ort": "Kehl\n7852"
    },
    {
        "code": "7851",
        "ort": "Kehl"
    },
    {
        "code": "7852",
        "ort": "Willstätt,"
    },
    {
        "code": "7853",
        "ort": "Kehl-Bodersweier,"
    },
    {
        "code": "7854",
        "ort": "Kehl-Goldscheuer,"
    },
    {
        "code": "786",
        "ort": "(not"
    },
    {
        "code": "787",
        "ort": "(not"
    },
    {
        "code": "788",
        "ort": "(not"
    },
    {
        "code": "789",
        "ort": "(not"
    },
    {
        "code": "7802",
        "ort": "Oberkirch,"
    },
    {
        "code": "7803",
        "ort": "Gengenbach,"
    },
    {
        "code": "7804",
        "ort": "Oppenau"
    },
    {
        "code": "7805",
        "ort": "Appenweier,"
    },
    {
        "code": "7806",
        "ort": "Bad"
    },
    {
        "code": "7807",
        "ort": "Neuried"
    },
    {
        "code": "7808",
        "ort": "Hohberg,"
    },
    {
        "code": "7821",
        "ort": "Lahr/Schwarzwald,"
    },
    {
        "code": "7822",
        "ort": "Ettenheim,"
    },
    {
        "code": "7823",
        "ort": "Seelbach,"
    },
    {
        "code": "7824",
        "ort": "Schwanau,"
    },
    {
        "code": "7825",
        "ort": "Kippenheim,"
    },
    {
        "code": "7826",
        "ort": "Schuttertal,"
    },
    {
        "code": "7831",
        "ort": "Hausach,"
    },
    {
        "code": "7832",
        "ort": "Haslach"
    },
    {
        "code": "7833",
        "ort": "Hornberg,"
    },
    {
        "code": "7834",
        "ort": "Wolfach,"
    },
    {
        "code": "7835",
        "ort": "Zell"
    },
    {
        "code": "7836",
        "ort": "Schiltach,"
    },
    {
        "code": "7837",
        "ort": "Oberharmersbach,"
    },
    {
        "code": "7838",
        "ort": "Nordrach"
    },
    {
        "code": "7839",
        "ort": "Schapbach,"
    },
    {
        "code": "7841",
        "ort": "Achern,"
    },
    {
        "code": "7842",
        "ort": "Kappelrodeck,"
    },
    {
        "code": "7843",
        "ort": "Renchen,"
    },
    {
        "code": "7844",
        "ort": "Rheinau,"
    },
    {
        "code": "7851",
        "ort": "Kehl"
    },
    {
        "code": "7852",
        "ort": "Willstätt,"
    },
    {
        "code": "7853",
        "ort": "Kehl-Bodersweier,"
    },
    {
        "code": "7854",
        "ort": "Kehl-Goldscheuer,"
    },
    {
        "code": "790\n7903",
        "ort": "Mainhardt,"
    },
    {
        "code": "7903",
        "ort": "Mainhardt,"
    },
    {
        "code": "7904",
        "ort": "Ilshofen,"
    },
    {
        "code": "7905",
        "ort": "Langenburg,"
    },
    {
        "code": "7906",
        "ort": "Braunsbach,"
    },
    {
        "code": "7907",
        "ort": "Schwäbisch"
    },
    {
        "code": "791",
        "ort": "Schwäbisch"
    },
    {
        "code": "792",
        "ort": "(not"
    },
    {
        "code": "793\n7930",
        "ort": "Boxberg,"
    },
    {
        "code": "7930",
        "ort": "Boxberg,"
    },
    {
        "code": "7931",
        "ort": "Bad"
    },
    {
        "code": "7932",
        "ort": "Niederstetten,"
    },
    {
        "code": "7933",
        "ort": "Creglingen,"
    },
    {
        "code": "7934",
        "ort": "Weikersheim,"
    },
    {
        "code": "7935",
        "ort": "Schrozberg,"
    },
    {
        "code": "7936",
        "ort": "Schrozberg-Bartenstein,"
    },
    {
        "code": "7937",
        "ort": "Dörzbach,"
    },
    {
        "code": "7938",
        "ort": "Mulfingen,"
    },
    {
        "code": "7939",
        "ort": "Schrozberg-Spielbach,"
    },
    {
        "code": "794\n7940",
        "ort": "Künzelsau,"
    },
    {
        "code": "7940",
        "ort": "Künzelsau,"
    },
    {
        "code": "7941",
        "ort": "Öhringen,"
    },
    {
        "code": "7942",
        "ort": "Neuenstein,"
    },
    {
        "code": "7943",
        "ort": "Forchtenberg,"
    },
    {
        "code": "7944",
        "ort": "Kupferzell,"
    },
    {
        "code": "7945",
        "ort": "Wüstenrot,"
    },
    {
        "code": "7946",
        "ort": "Bretzfeld,"
    },
    {
        "code": "7947",
        "ort": "Forchtenberg,"
    },
    {
        "code": "7948",
        "ort": "Öhringen-Ohrnberg,"
    },
    {
        "code": "7949",
        "ort": "Pfedelbach-Untersteinbach,"
    },
    {
        "code": "795\n7950",
        "ort": "Schnelldorf,"
    },
    {
        "code": "7950",
        "ort": "Schnelldorf,"
    },
    {
        "code": "7951",
        "ort": "Crailsheim,"
    },
    {
        "code": "7952",
        "ort": "Gerabronn,"
    },
    {
        "code": "7953",
        "ort": "Blaufelden,"
    },
    {
        "code": "7954",
        "ort": "Kirchberg"
    },
    {
        "code": "7955",
        "ort": "Wallhausen,"
    },
    {
        "code": "7957",
        "ort": "Kreßberg,"
    },
    {
        "code": "7958",
        "ort": "Rot"
    },
    {
        "code": "7959",
        "ort": "Frankenhardt,"
    },
    {
        "code": "796\n7961",
        "ort": "Ellwangen"
    },
    {
        "code": "7961",
        "ort": "Ellwangen"
    },
    {
        "code": "7962",
        "ort": "Fichtenau,"
    },
    {
        "code": "7963",
        "ort": "Adelmannsfelden,"
    },
    {
        "code": "7964",
        "ort": "Stödtlen,"
    },
    {
        "code": "7965",
        "ort": "Ellwangen-Röhlingen,"
    },
    {
        "code": "7966",
        "ort": "Unterschneidheim,"
    },
    {
        "code": "7967",
        "ort": "Jagstzell,"
    },
    {
        "code": "797\n7971",
        "ort": "Gaildorf,"
    },
    {
        "code": "7971",
        "ort": "Gaildorf,"
    },
    {
        "code": "7972",
        "ort": "Gschwend,"
    },
    {
        "code": "7973",
        "ort": "Obersontheim,"
    },
    {
        "code": "7974",
        "ort": "Bühlerzell,"
    },
    {
        "code": "7975",
        "ort": "Abtsgmünd-Untergröningen,"
    },
    {
        "code": "7976",
        "ort": "Sulzbach-Laufen,"
    },
    {
        "code": "7977",
        "ort": "Oberrot,"
    },
    {
        "code": "798",
        "ort": "(not"
    },
    {
        "code": "799",
        "ort": "(not"
    },
    {
        "code": "7903",
        "ort": "Mainhardt,"
    },
    {
        "code": "7904",
        "ort": "Ilshofen,"
    },
    {
        "code": "7905",
        "ort": "Langenburg,"
    },
    {
        "code": "7906",
        "ort": "Braunsbach,"
    },
    {
        "code": "7907",
        "ort": "Schwäbisch"
    },
    {
        "code": "7930",
        "ort": "Boxberg,"
    },
    {
        "code": "7931",
        "ort": "Bad"
    },
    {
        "code": "7932",
        "ort": "Niederstetten,"
    },
    {
        "code": "7933",
        "ort": "Creglingen,"
    },
    {
        "code": "7934",
        "ort": "Weikersheim,"
    },
    {
        "code": "7935",
        "ort": "Schrozberg,"
    },
    {
        "code": "7936",
        "ort": "Schrozberg-Bartenstein,"
    },
    {
        "code": "7937",
        "ort": "Dörzbach,"
    },
    {
        "code": "7938",
        "ort": "Mulfingen,"
    },
    {
        "code": "7939",
        "ort": "Schrozberg-Spielbach,"
    },
    {
        "code": "7940",
        "ort": "Künzelsau,"
    },
    {
        "code": "7941",
        "ort": "Öhringen,"
    },
    {
        "code": "7942",
        "ort": "Neuenstein,"
    },
    {
        "code": "7943",
        "ort": "Forchtenberg,"
    },
    {
        "code": "7944",
        "ort": "Kupferzell,"
    },
    {
        "code": "7945",
        "ort": "Wüstenrot,"
    },
    {
        "code": "7946",
        "ort": "Bretzfeld,"
    },
    {
        "code": "7947",
        "ort": "Forchtenberg,"
    },
    {
        "code": "7948",
        "ort": "Öhringen-Ohrnberg,"
    },
    {
        "code": "7949",
        "ort": "Pfedelbach-Untersteinbach,"
    },
    {
        "code": "7950",
        "ort": "Schnelldorf,"
    },
    {
        "code": "7951",
        "ort": "Crailsheim,"
    },
    {
        "code": "7952",
        "ort": "Gerabronn,"
    },
    {
        "code": "7953",
        "ort": "Blaufelden,"
    },
    {
        "code": "7954",
        "ort": "Kirchberg"
    },
    {
        "code": "7955",
        "ort": "Wallhausen,"
    },
    {
        "code": "7957",
        "ort": "Kreßberg,"
    },
    {
        "code": "7958",
        "ort": "Rot"
    },
    {
        "code": "7959",
        "ort": "Frankenhardt,"
    },
    {
        "code": "7961",
        "ort": "Ellwangen"
    },
    {
        "code": "7962",
        "ort": "Fichtenau,"
    },
    {
        "code": "7963",
        "ort": "Adelmannsfelden,"
    },
    {
        "code": "7964",
        "ort": "Stödtlen,"
    },
    {
        "code": "7965",
        "ort": "Ellwangen-Röhlingen,"
    },
    {
        "code": "7966",
        "ort": "Unterschneidheim,"
    },
    {
        "code": "7967",
        "ort": "Jagstzell,"
    },
    {
        "code": "7971",
        "ort": "Gaildorf,"
    },
    {
        "code": "7972",
        "ort": "Gschwend,"
    },
    {
        "code": "7973",
        "ort": "Obersontheim,"
    },
    {
        "code": "7974",
        "ort": "Bühlerzell,"
    },
    {
        "code": "7975",
        "ort": "Abtsgmünd-Untergröningen,"
    },
    {
        "code": "7976",
        "ort": "Sulzbach-Laufen,"
    },
    {
        "code": "7977",
        "ort": "Oberrot,"
    },
    {
        "code": "800",
        "ort": "toll-free"
    },
    {
        "code": "801",
        "ort": "toll-free"
    },
    {
        "code": "802\n8021",
        "ort": "Waakirchen\n8022"
    },
    {
        "code": "8021",
        "ort": "Waakirchen"
    },
    {
        "code": "8022",
        "ort": "Tegernsee"
    },
    {
        "code": "8023",
        "ort": "Bayrischzell"
    },
    {
        "code": "8024",
        "ort": "Holzkirchen"
    },
    {
        "code": "8025",
        "ort": "Miesbach"
    },
    {
        "code": "8026",
        "ort": "Hausham"
    },
    {
        "code": "8027",
        "ort": "Dietramszell"
    },
    {
        "code": "8028",
        "ort": "Fischbachau"
    },
    {
        "code": "8029",
        "ort": "Kreuth"
    },
    {
        "code": "803\n8031",
        "ort": "Rosenheim\n8032"
    },
    {
        "code": "8031",
        "ort": "Rosenheim"
    },
    {
        "code": "8032",
        "ort": "Rohrdorf"
    },
    {
        "code": "8033",
        "ort": "Oberaudorf"
    },
    {
        "code": "8034",
        "ort": "Brannenburg"
    },
    {
        "code": "8035",
        "ort": "Raubling"
    },
    {
        "code": "8036",
        "ort": "Stephanskirchen"
    },
    {
        "code": "8038",
        "ort": "Vogtareuth"
    },
    {
        "code": "8039",
        "ort": "Rott"
    },
    {
        "code": "804\n8041",
        "ort": "Bad"
    },
    {
        "code": "8041",
        "ort": "Bad"
    },
    {
        "code": "8042",
        "ort": "Lenggries"
    },
    {
        "code": "8043",
        "ort": "Jachenau"
    },
    {
        "code": "8045",
        "ort": "Lenggries-Fall"
    },
    {
        "code": "8046",
        "ort": "Bad"
    },
    {
        "code": "805\n8051",
        "ort": "Prien"
    },
    {
        "code": "8051",
        "ort": "Prien"
    },
    {
        "code": "8052",
        "ort": "Aschau"
    },
    {
        "code": "8053",
        "ort": "Bad"
    },
    {
        "code": "8054",
        "ort": "Breitbrunn"
    },
    {
        "code": "8055",
        "ort": "Halfing"
    },
    {
        "code": "8056",
        "ort": "Eggstätt"
    },
    {
        "code": "8057",
        "ort": "Aschau-Sachrang"
    },
    {
        "code": "806\n8061",
        "ort": "Bad"
    },
    {
        "code": "8061",
        "ort": "Bad"
    },
    {
        "code": "8062",
        "ort": "Bruckmühl"
    },
    {
        "code": "8063",
        "ort": "Feldkirchen-Westerham"
    },
    {
        "code": "8064",
        "ort": "Au"
    },
    {
        "code": "8065",
        "ort": "Tuntenhausen-Schönau"
    },
    {
        "code": "8066",
        "ort": "Bad"
    },
    {
        "code": "8067",
        "ort": "Tuntenhausen"
    },
    {
        "code": "807\n8071",
        "ort": "Wasserburg"
    },
    {
        "code": "8071",
        "ort": "Wasserburg"
    },
    {
        "code": "8072",
        "ort": "Haag"
    },
    {
        "code": "8073",
        "ort": "Gars"
    },
    {
        "code": "8074",
        "ort": "Schnaitsee"
    },
    {
        "code": "8075",
        "ort": "Amerang"
    },
    {
        "code": "8076",
        "ort": "Pfaffing"
    },
    {
        "code": "808\n8081",
        "ort": "Dorfen\n8082"
    },
    {
        "code": "8081",
        "ort": "Dorfen"
    },
    {
        "code": "8082",
        "ort": "Schwindegg"
    },
    {
        "code": "8083",
        "ort": "Isen"
    },
    {
        "code": "8084",
        "ort": "Taufkirchen"
    },
    {
        "code": "8085",
        "ort": "Sankt"
    },
    {
        "code": "8086",
        "ort": "Buchbach"
    },
    {
        "code": "809\n8091",
        "ort": "Kirchseon\n8092"
    },
    {
        "code": "8091",
        "ort": "Kirchseon"
    },
    {
        "code": "8092",
        "ort": "Grafing"
    },
    {
        "code": "8093",
        "ort": "Glonn"
    },
    {
        "code": "8094",
        "ort": "Steinhöring"
    },
    {
        "code": "8095",
        "ort": "Aying"
    },
    {
        "code": "8021",
        "ort": "Waakirchen"
    },
    {
        "code": "8022",
        "ort": "Tegernsee"
    },
    {
        "code": "8023",
        "ort": "Bayrischzell"
    },
    {
        "code": "8024",
        "ort": "Holzkirchen"
    },
    {
        "code": "8025",
        "ort": "Miesbach"
    },
    {
        "code": "8026",
        "ort": "Hausham"
    },
    {
        "code": "8027",
        "ort": "Dietramszell"
    },
    {
        "code": "8028",
        "ort": "Fischbachau"
    },
    {
        "code": "8029",
        "ort": "Kreuth"
    },
    {
        "code": "8031",
        "ort": "Rosenheim"
    },
    {
        "code": "8032",
        "ort": "Rohrdorf"
    },
    {
        "code": "8033",
        "ort": "Oberaudorf"
    },
    {
        "code": "8034",
        "ort": "Brannenburg"
    },
    {
        "code": "8035",
        "ort": "Raubling"
    },
    {
        "code": "8036",
        "ort": "Stephanskirchen"
    },
    {
        "code": "8038",
        "ort": "Vogtareuth"
    },
    {
        "code": "8039",
        "ort": "Rott"
    },
    {
        "code": "8041",
        "ort": "Bad"
    },
    {
        "code": "8042",
        "ort": "Lenggries"
    },
    {
        "code": "8043",
        "ort": "Jachenau"
    },
    {
        "code": "8045",
        "ort": "Lenggries-Fall"
    },
    {
        "code": "8046",
        "ort": "Bad"
    },
    {
        "code": "8051",
        "ort": "Prien"
    },
    {
        "code": "8052",
        "ort": "Aschau"
    },
    {
        "code": "8053",
        "ort": "Bad"
    },
    {
        "code": "8054",
        "ort": "Breitbrunn"
    },
    {
        "code": "8055",
        "ort": "Halfing"
    },
    {
        "code": "8056",
        "ort": "Eggstätt"
    },
    {
        "code": "8057",
        "ort": "Aschau-Sachrang"
    },
    {
        "code": "8061",
        "ort": "Bad"
    },
    {
        "code": "8062",
        "ort": "Bruckmühl"
    },
    {
        "code": "8063",
        "ort": "Feldkirchen-Westerham"
    },
    {
        "code": "8064",
        "ort": "Au"
    },
    {
        "code": "8065",
        "ort": "Tuntenhausen-Schönau"
    },
    {
        "code": "8066",
        "ort": "Bad"
    },
    {
        "code": "8067",
        "ort": "Tuntenhausen"
    },
    {
        "code": "8071",
        "ort": "Wasserburg"
    },
    {
        "code": "8072",
        "ort": "Haag"
    },
    {
        "code": "8073",
        "ort": "Gars"
    },
    {
        "code": "8074",
        "ort": "Schnaitsee"
    },
    {
        "code": "8075",
        "ort": "Amerang"
    },
    {
        "code": "8076",
        "ort": "Pfaffing"
    },
    {
        "code": "8081",
        "ort": "Dorfen"
    },
    {
        "code": "8082",
        "ort": "Schwindegg"
    },
    {
        "code": "8083",
        "ort": "Isen"
    },
    {
        "code": "8084",
        "ort": "Taufkirchen"
    },
    {
        "code": "8085",
        "ort": "Sankt"
    },
    {
        "code": "8086",
        "ort": "Buchbach"
    },
    {
        "code": "8091",
        "ort": "Kirchseon"
    },
    {
        "code": "8092",
        "ort": "Grafing"
    },
    {
        "code": "8093",
        "ort": "Glonn"
    },
    {
        "code": "8094",
        "ort": "Steinhöring"
    },
    {
        "code": "8095",
        "ort": "Aying"
    },
    {
        "code": "810\n8102",
        "ort": "Höhenkirchen-Siegertsbrunn\n8104"
    },
    {
        "code": "8102",
        "ort": "Höhenkirchen-Siegertsbrunn"
    },
    {
        "code": "8104",
        "ort": "Sauerlach"
    },
    {
        "code": "8105",
        "ort": "Gilching"
    },
    {
        "code": "8106",
        "ort": "Vaterstetten"
    },
    {
        "code": "811",
        "ort": "Hallbergmoos"
    },
    {
        "code": "812\n8121",
        "ort": "Markt"
    },
    {
        "code": "8121",
        "ort": "Markt"
    },
    {
        "code": "8122",
        "ort": "Erding"
    },
    {
        "code": "8123",
        "ort": "Moosinning"
    },
    {
        "code": "8124",
        "ort": "Forstern"
    },
    {
        "code": "813\n8131",
        "ort": "Dachau\n8133"
    },
    {
        "code": "8131",
        "ort": "Dachau"
    },
    {
        "code": "8133",
        "ort": "Haimhausen"
    },
    {
        "code": "8134",
        "ort": "Odelzhausen"
    },
    {
        "code": "8135",
        "ort": "Sulzemoos"
    },
    {
        "code": "8136",
        "ort": "Markt"
    },
    {
        "code": "8137",
        "ort": "Petershausen"
    },
    {
        "code": "8138",
        "ort": "Schwabhausen"
    },
    {
        "code": "814\n8141",
        "ort": "Fürstenfeldbruck\n8142"
    },
    {
        "code": "8141",
        "ort": "Fürstenfeldbruck"
    },
    {
        "code": "8142",
        "ort": "Olching"
    },
    {
        "code": "8143",
        "ort": "Inning"
    },
    {
        "code": "8144",
        "ort": "Grafrath"
    },
    {
        "code": "8145",
        "ort": "Mammendorf"
    },
    {
        "code": "8146",
        "ort": "Moorenweis"
    },
    {
        "code": "815\n8151",
        "ort": "Starnberg,"
    },
    {
        "code": "8151",
        "ort": "Starnberg,"
    },
    {
        "code": "8152",
        "ort": "Herrsching"
    },
    {
        "code": "8153",
        "ort": "Weßling"
    },
    {
        "code": "8157",
        "ort": "Feldafing"
    },
    {
        "code": "8158",
        "ort": "Tutzing"
    },
    {
        "code": "816\n8161",
        "ort": "Freising\n8165"
    },
    {
        "code": "8161",
        "ort": "Freising"
    },
    {
        "code": "8165",
        "ort": "Neufahrn"
    },
    {
        "code": "8166",
        "ort": "Allershausen"
    },
    {
        "code": "8167",
        "ort": "Zolling"
    },
    {
        "code": "8168",
        "ort": "Attenkirchen"
    },
    {
        "code": "8169",
        "ort": "former"
    },
    {
        "code": "817\n8170",
        "ort": "Straßlach-Dingharting\n8171"
    },
    {
        "code": "8170",
        "ort": "Straßlach-Dingharting"
    },
    {
        "code": "8171",
        "ort": "Wolfratshausen"
    },
    {
        "code": "8176",
        "ort": "Egling"
    },
    {
        "code": "8177",
        "ort": "Münsing"
    },
    {
        "code": "8178",
        "ort": "Icking"
    },
    {
        "code": "8179",
        "ort": "Eurasburg"
    },
    {
        "code": "8102",
        "ort": "Höhenkirchen-Siegertsbrunn"
    },
    {
        "code": "8104",
        "ort": "Sauerlach"
    },
    {
        "code": "8105",
        "ort": "Gilching"
    },
    {
        "code": "8106",
        "ort": "Vaterstetten"
    },
    {
        "code": "8121",
        "ort": "Markt"
    },
    {
        "code": "8122",
        "ort": "Erding"
    },
    {
        "code": "8123",
        "ort": "Moosinning"
    },
    {
        "code": "8124",
        "ort": "Forstern"
    },
    {
        "code": "8131",
        "ort": "Dachau"
    },
    {
        "code": "8133",
        "ort": "Haimhausen"
    },
    {
        "code": "8134",
        "ort": "Odelzhausen"
    },
    {
        "code": "8135",
        "ort": "Sulzemoos"
    },
    {
        "code": "8136",
        "ort": "Markt"
    },
    {
        "code": "8137",
        "ort": "Petershausen"
    },
    {
        "code": "8138",
        "ort": "Schwabhausen"
    },
    {
        "code": "8141",
        "ort": "Fürstenfeldbruck"
    },
    {
        "code": "8142",
        "ort": "Olching"
    },
    {
        "code": "8143",
        "ort": "Inning"
    },
    {
        "code": "8144",
        "ort": "Grafrath"
    },
    {
        "code": "8145",
        "ort": "Mammendorf"
    },
    {
        "code": "8146",
        "ort": "Moorenweis"
    },
    {
        "code": "8151",
        "ort": "Starnberg,"
    },
    {
        "code": "8152",
        "ort": "Herrsching"
    },
    {
        "code": "8153",
        "ort": "Weßling"
    },
    {
        "code": "8157",
        "ort": "Feldafing"
    },
    {
        "code": "8158",
        "ort": "Tutzing"
    },
    {
        "code": "8161",
        "ort": "Freising"
    },
    {
        "code": "8165",
        "ort": "Neufahrn"
    },
    {
        "code": "8166",
        "ort": "Allershausen"
    },
    {
        "code": "8167",
        "ort": "Zolling"
    },
    {
        "code": "8168",
        "ort": "Attenkirchen"
    },
    {
        "code": "8169",
        "ort": "former"
    },
    {
        "code": "8170",
        "ort": "Straßlach-Dingharting"
    },
    {
        "code": "8171",
        "ort": "Wolfratshausen"
    },
    {
        "code": "8176",
        "ort": "Egling"
    },
    {
        "code": "8177",
        "ort": "Münsing"
    },
    {
        "code": "8178",
        "ort": "Icking"
    },
    {
        "code": "8179",
        "ort": "Eurasburg"
    },
    {
        "code": "820\n8206",
        "ort": "Prittriching"
    },
    {
        "code": "8206",
        "ort": "Prittriching"
    },
    {
        "code": "821",
        "ort": "Augsburg"
    },
    {
        "code": "822\n8221",
        "ort": "Günzburg\n8222"
    },
    {
        "code": "8221",
        "ort": "Günzburg"
    },
    {
        "code": "8222",
        "ort": "Burgau"
    },
    {
        "code": "8223",
        "ort": "Ichenhausen"
    },
    {
        "code": "8224",
        "ort": "Offingen"
    },
    {
        "code": "8225",
        "ort": "Jettingen-Scheppach"
    },
    {
        "code": "8226",
        "ort": "Bibertal"
    },
    {
        "code": "8230",
        "ort": "Gablingen"
    },
    {
        "code": "823\n8231",
        "ort": "Königsbrunn\n8232"
    },
    {
        "code": "8231",
        "ort": "Königsbrunn"
    },
    {
        "code": "8232",
        "ort": "Schwabmünchen"
    },
    {
        "code": "8233",
        "ort": "Kissing"
    },
    {
        "code": "8234",
        "ort": "Bobingen"
    },
    {
        "code": "8236",
        "ort": "Fischach"
    },
    {
        "code": "8237",
        "ort": "Aindling"
    },
    {
        "code": "8238",
        "ort": "Gessertshausen"
    },
    {
        "code": "8239",
        "ort": "Langenneufnach"
    },
    {
        "code": "824\n8241",
        "ort": "Buchloe\n8243"
    },
    {
        "code": "8241",
        "ort": "Buchloe"
    },
    {
        "code": "8243",
        "ort": "Fuchstal"
    },
    {
        "code": "8245",
        "ort": "Türkheim"
    },
    {
        "code": "8246",
        "ort": "Waal"
    },
    {
        "code": "8247",
        "ort": "Bad"
    },
    {
        "code": "8248",
        "ort": "Lamerdingen"
    },
    {
        "code": "8249",
        "ort": "Ettringen"
    },
    {
        "code": "825\n8250",
        "ort": "Hilgertshausen-Tandern\n8251"
    },
    {
        "code": "8250",
        "ort": "Hilgertshausen-Tandern"
    },
    {
        "code": "8251",
        "ort": "Aichach"
    },
    {
        "code": "8252",
        "ort": "Schrobenhausen"
    },
    {
        "code": "8253",
        "ort": "Pöttmes"
    },
    {
        "code": "8254",
        "ort": "Altomünster"
    },
    {
        "code": "8257",
        "ort": "Inchenhofen"
    },
    {
        "code": "8258",
        "ort": "Sielenbach"
    },
    {
        "code": "8259",
        "ort": "Schiltberg"
    },
    {
        "code": "826\n8261",
        "ort": "Mindelheim\n8262"
    },
    {
        "code": "8261",
        "ort": "Mindelheim"
    },
    {
        "code": "8262",
        "ort": "Mittelneufnach"
    },
    {
        "code": "8263",
        "ort": "Breitenbrunn"
    },
    {
        "code": "8265",
        "ort": "Pfaffenhausen"
    },
    {
        "code": "8266",
        "ort": "Kirchheim"
    },
    {
        "code": "8267",
        "ort": "Dirlewang"
    },
    {
        "code": "8268",
        "ort": "Tussenhausen"
    },
    {
        "code": "8269",
        "ort": "Unteregg"
    },
    {
        "code": "827\n8271",
        "ort": "Meitingen,"
    },
    {
        "code": "8271",
        "ort": "Meitingen,"
    },
    {
        "code": "8272",
        "ort": "Wertingen"
    },
    {
        "code": "8273",
        "ort": "Nordendorf"
    },
    {
        "code": "8274",
        "ort": "Buttenwiesen"
    },
    {
        "code": "8276",
        "ort": "Baar,"
    },
    {
        "code": "828\n8281",
        "ort": "Thannhausen\n8282"
    },
    {
        "code": "8281",
        "ort": "Thannhausen"
    },
    {
        "code": "8282",
        "ort": "Krumbach"
    },
    {
        "code": "8283",
        "ort": "Neuburg"
    },
    {
        "code": "8284",
        "ort": "Ziemetshausen"
    },
    {
        "code": "8285",
        "ort": "Burtenbach"
    },
    {
        "code": "829\n8291",
        "ort": "Zusmarshausen\n8292"
    },
    {
        "code": "8291",
        "ort": "Zusmarshausen"
    },
    {
        "code": "8292",
        "ort": "Dinkelscherben"
    },
    {
        "code": "8293",
        "ort": "Welden"
    },
    {
        "code": "8294",
        "ort": "Horgau"
    },
    {
        "code": "8295",
        "ort": "Altenmünster"
    },
    {
        "code": "8296",
        "ort": "Villenbach"
    },
    {
        "code": "8206",
        "ort": "Prittriching"
    },
    {
        "code": "8221",
        "ort": "Günzburg"
    },
    {
        "code": "8222",
        "ort": "Burgau"
    },
    {
        "code": "8223",
        "ort": "Ichenhausen"
    },
    {
        "code": "8224",
        "ort": "Offingen"
    },
    {
        "code": "8225",
        "ort": "Jettingen-Scheppach"
    },
    {
        "code": "8226",
        "ort": "Bibertal"
    },
    {
        "code": "8230",
        "ort": "Gablingen"
    },
    {
        "code": "8231",
        "ort": "Königsbrunn"
    },
    {
        "code": "8232",
        "ort": "Schwabmünchen"
    },
    {
        "code": "8233",
        "ort": "Kissing"
    },
    {
        "code": "8234",
        "ort": "Bobingen"
    },
    {
        "code": "8236",
        "ort": "Fischach"
    },
    {
        "code": "8237",
        "ort": "Aindling"
    },
    {
        "code": "8238",
        "ort": "Gessertshausen"
    },
    {
        "code": "8239",
        "ort": "Langenneufnach"
    },
    {
        "code": "8241",
        "ort": "Buchloe"
    },
    {
        "code": "8243",
        "ort": "Fuchstal"
    },
    {
        "code": "8245",
        "ort": "Türkheim"
    },
    {
        "code": "8246",
        "ort": "Waal"
    },
    {
        "code": "8247",
        "ort": "Bad"
    },
    {
        "code": "8248",
        "ort": "Lamerdingen"
    },
    {
        "code": "8249",
        "ort": "Ettringen"
    },
    {
        "code": "8250",
        "ort": "Hilgertshausen-Tandern"
    },
    {
        "code": "8251",
        "ort": "Aichach"
    },
    {
        "code": "8252",
        "ort": "Schrobenhausen"
    },
    {
        "code": "8253",
        "ort": "Pöttmes"
    },
    {
        "code": "8254",
        "ort": "Altomünster"
    },
    {
        "code": "8257",
        "ort": "Inchenhofen"
    },
    {
        "code": "8258",
        "ort": "Sielenbach"
    },
    {
        "code": "8259",
        "ort": "Schiltberg"
    },
    {
        "code": "8261",
        "ort": "Mindelheim"
    },
    {
        "code": "8262",
        "ort": "Mittelneufnach"
    },
    {
        "code": "8263",
        "ort": "Breitenbrunn"
    },
    {
        "code": "8265",
        "ort": "Pfaffenhausen"
    },
    {
        "code": "8266",
        "ort": "Kirchheim"
    },
    {
        "code": "8267",
        "ort": "Dirlewang"
    },
    {
        "code": "8268",
        "ort": "Tussenhausen"
    },
    {
        "code": "8269",
        "ort": "Unteregg"
    },
    {
        "code": "8271",
        "ort": "Meitingen,"
    },
    {
        "code": "8272",
        "ort": "Wertingen"
    },
    {
        "code": "8273",
        "ort": "Nordendorf"
    },
    {
        "code": "8274",
        "ort": "Buttenwiesen"
    },
    {
        "code": "8276",
        "ort": "Baar,"
    },
    {
        "code": "8281",
        "ort": "Thannhausen"
    },
    {
        "code": "8282",
        "ort": "Krumbach"
    },
    {
        "code": "8283",
        "ort": "Neuburg"
    },
    {
        "code": "8284",
        "ort": "Ziemetshausen"
    },
    {
        "code": "8285",
        "ort": "Burtenbach"
    },
    {
        "code": "8291",
        "ort": "Zusmarshausen"
    },
    {
        "code": "8292",
        "ort": "Dinkelscherben"
    },
    {
        "code": "8293",
        "ort": "Welden"
    },
    {
        "code": "8294",
        "ort": "Horgau"
    },
    {
        "code": "8295",
        "ort": "Altenmünster"
    },
    {
        "code": "8296",
        "ort": "Villenbach"
    },
    {
        "code": "830",
        "ort": "--\n8302"
    },
    {
        "code": "8302",
        "ort": "Görisried"
    },
    {
        "code": "8303",
        "ort": "Waltenhofen"
    },
    {
        "code": "8304",
        "ort": "Wildpoldsried"
    },
    {
        "code": "8306",
        "ort": "Ronsberg"
    },
    {
        "code": "831",
        "ort": "Kempten"
    },
    {
        "code": "832",
        "ort": "--\n8320"
    },
    {
        "code": "8320",
        "ort": "Missen-Wilhams"
    },
    {
        "code": "8321",
        "ort": "Sonthofen"
    },
    {
        "code": "8322",
        "ort": "Oberstdorf"
    },
    {
        "code": "8323",
        "ort": "Immenstadt"
    },
    {
        "code": "8324",
        "ort": "Bad"
    },
    {
        "code": "8325",
        "ort": "Oberstaufen-Thalkirchdorf"
    },
    {
        "code": "8326",
        "ort": "Fischen"
    },
    {
        "code": "8327",
        "ort": "Rettenberg"
    },
    {
        "code": "8328",
        "ort": "Balderschwang"
    },
    {
        "code": "8329",
        "ort": "former"
    },
    {
        "code": "833",
        "ort": "--\n8330"
    },
    {
        "code": "8330",
        "ort": "Legau"
    },
    {
        "code": "8331",
        "ort": "Memmingen"
    },
    {
        "code": "8332",
        "ort": "Ottobeuren"
    },
    {
        "code": "8333",
        "ort": "Babenhausen"
    },
    {
        "code": "8334",
        "ort": "Bad"
    },
    {
        "code": "8335",
        "ort": "Fellheim"
    },
    {
        "code": "8336",
        "ort": "Erkheim"
    },
    {
        "code": "8337",
        "ort": "Altenstadt"
    },
    {
        "code": "8338",
        "ort": "Böhen"
    },
    {
        "code": "834",
        "ort": "--\n8340"
    },
    {
        "code": "8340",
        "ort": "Baisweil"
    },
    {
        "code": "8341",
        "ort": "Kaufbeuren"
    },
    {
        "code": "8342",
        "ort": "Marktoberdorf"
    },
    {
        "code": "8343",
        "ort": "Aitrang"
    },
    {
        "code": "8344",
        "ort": "Westendorf"
    },
    {
        "code": "8345",
        "ort": "Stöttwang"
    },
    {
        "code": "8346",
        "ort": "Pforzen"
    },
    {
        "code": "8347",
        "ort": "Friesenried"
    },
    {
        "code": "8348",
        "ort": "Bidingen"
    },
    {
        "code": "8349",
        "ort": "Stötten"
    },
    {
        "code": "836",
        "ort": "--\n8361"
    },
    {
        "code": "8361",
        "ort": "Nesselwang"
    },
    {
        "code": "8362",
        "ort": "Füssen"
    },
    {
        "code": "8363",
        "ort": "Pfronten"
    },
    {
        "code": "8364",
        "ort": "Seeg"
    },
    {
        "code": "8365",
        "ort": "Wertach\n8365"
    },
    {
        "code": "8365",
        "ort": "8"
    },
    {
        "code": "8366",
        "ort": "Oy-Mittelberg"
    },
    {
        "code": "8367",
        "ort": "Roßhaupten"
    },
    {
        "code": "8368",
        "ort": "Halblech"
    },
    {
        "code": "8369",
        "ort": "Rückholz"
    },
    {
        "code": "837—Area",
        "ort": "of"
    },
    {
        "code": "8370",
        "ort": "Wiggensbach"
    },
    {
        "code": "8372",
        "ort": "Günzach"
    },
    {
        "code": "8373",
        "ort": "Altusried"
    },
    {
        "code": "8374",
        "ort": "Dietmannsried"
    },
    {
        "code": "8375",
        "ort": "Weitnau"
    },
    {
        "code": "8376",
        "ort": "Sulzberg"
    },
    {
        "code": "8377",
        "ort": "Unterthingau"
    },
    {
        "code": "8378",
        "ort": "Buchenberg"
    },
    {
        "code": "8379",
        "ort": "Waltenhofen-Martinszell-Oberdorf"
    },
    {
        "code": "838",
        "ort": "--\n8380"
    },
    {
        "code": "8380",
        "ort": "Lindau-Achberg"
    },
    {
        "code": "8381",
        "ort": "Lindenberg"
    },
    {
        "code": "8382",
        "ort": "Lindau"
    },
    {
        "code": "8383",
        "ort": "Grünenbach"
    },
    {
        "code": "8384",
        "ort": "Röthenbach"
    },
    {
        "code": "8385",
        "ort": "Hergatz"
    },
    {
        "code": "8386",
        "ort": "Oberstaufen"
    },
    {
        "code": "8387",
        "ort": "Weiler-Simmerberg"
    },
    {
        "code": "8388",
        "ort": "Hergesnweiler"
    },
    {
        "code": "8389",
        "ort": "Weißensberg"
    },
    {
        "code": "839",
        "ort": "--\n8392"
    },
    {
        "code": "8392",
        "ort": "Markt"
    },
    {
        "code": "8393",
        "ort": "Holzgünz"
    },
    {
        "code": "8394",
        "ort": "Lautrach"
    },
    {
        "code": "8395",
        "ort": "Tannheim"
    },
    {
        "code": "8302",
        "ort": "Görisried"
    },
    {
        "code": "8303",
        "ort": "Waltenhofen"
    },
    {
        "code": "8304",
        "ort": "Wildpoldsried"
    },
    {
        "code": "8306",
        "ort": "Ronsberg"
    },
    {
        "code": "8320",
        "ort": "Missen-Wilhams"
    },
    {
        "code": "8321",
        "ort": "Sonthofen"
    },
    {
        "code": "8322",
        "ort": "Oberstdorf"
    },
    {
        "code": "8323",
        "ort": "Immenstadt"
    },
    {
        "code": "8324",
        "ort": "Bad"
    },
    {
        "code": "8325",
        "ort": "Oberstaufen-Thalkirchdorf"
    },
    {
        "code": "8326",
        "ort": "Fischen"
    },
    {
        "code": "8327",
        "ort": "Rettenberg"
    },
    {
        "code": "8328",
        "ort": "Balderschwang"
    },
    {
        "code": "8329",
        "ort": "former"
    },
    {
        "code": "8330",
        "ort": "Legau"
    },
    {
        "code": "8331",
        "ort": "Memmingen"
    },
    {
        "code": "8332",
        "ort": "Ottobeuren"
    },
    {
        "code": "8333",
        "ort": "Babenhausen"
    },
    {
        "code": "8334",
        "ort": "Bad"
    },
    {
        "code": "8335",
        "ort": "Fellheim"
    },
    {
        "code": "8336",
        "ort": "Erkheim"
    },
    {
        "code": "8337",
        "ort": "Altenstadt"
    },
    {
        "code": "8338",
        "ort": "Böhen"
    },
    {
        "code": "8340",
        "ort": "Baisweil"
    },
    {
        "code": "8341",
        "ort": "Kaufbeuren"
    },
    {
        "code": "8342",
        "ort": "Marktoberdorf"
    },
    {
        "code": "8343",
        "ort": "Aitrang"
    },
    {
        "code": "8344",
        "ort": "Westendorf"
    },
    {
        "code": "8345",
        "ort": "Stöttwang"
    },
    {
        "code": "8346",
        "ort": "Pforzen"
    },
    {
        "code": "8347",
        "ort": "Friesenried"
    },
    {
        "code": "8348",
        "ort": "Bidingen"
    },
    {
        "code": "8349",
        "ort": "Stötten"
    },
    {
        "code": "8361",
        "ort": "Nesselwang"
    },
    {
        "code": "8362",
        "ort": "Füssen"
    },
    {
        "code": "8363",
        "ort": "Pfronten"
    },
    {
        "code": "8364",
        "ort": "Seeg"
    },
    {
        "code": "8365",
        "ort": "Wertach\n8365"
    },
    {
        "code": "8365",
        "ort": "8"
    },
    {
        "code": "8366",
        "ort": "Oy-Mittelberg"
    },
    {
        "code": "8367",
        "ort": "Roßhaupten"
    },
    {
        "code": "8368",
        "ort": "Halblech"
    },
    {
        "code": "8369",
        "ort": "Rückholz"
    },
    {
        "code": "8365",
        "ort": "8"
    },
    {
        "code": "8370",
        "ort": "Wiggensbach"
    },
    {
        "code": "8372",
        "ort": "Günzach"
    },
    {
        "code": "8373",
        "ort": "Altusried"
    },
    {
        "code": "8374",
        "ort": "Dietmannsried"
    },
    {
        "code": "8375",
        "ort": "Weitnau"
    },
    {
        "code": "8376",
        "ort": "Sulzberg"
    },
    {
        "code": "8377",
        "ort": "Unterthingau"
    },
    {
        "code": "8378",
        "ort": "Buchenberg"
    },
    {
        "code": "8379",
        "ort": "Waltenhofen-Martinszell-Oberdorf"
    },
    {
        "code": "8380",
        "ort": "Lindau-Achberg"
    },
    {
        "code": "8381",
        "ort": "Lindenberg"
    },
    {
        "code": "8382",
        "ort": "Lindau"
    },
    {
        "code": "8383",
        "ort": "Grünenbach"
    },
    {
        "code": "8384",
        "ort": "Röthenbach"
    },
    {
        "code": "8385",
        "ort": "Hergatz"
    },
    {
        "code": "8386",
        "ort": "Oberstaufen"
    },
    {
        "code": "8387",
        "ort": "Weiler-Simmerberg"
    },
    {
        "code": "8388",
        "ort": "Hergesnweiler"
    },
    {
        "code": "8389",
        "ort": "Weißensberg"
    },
    {
        "code": "8392",
        "ort": "Markt"
    },
    {
        "code": "8393",
        "ort": "Holzgünz"
    },
    {
        "code": "8394",
        "ort": "Lautrach"
    },
    {
        "code": "8395",
        "ort": "Tannheim"
    },
    {
        "code": "840\n8402",
        "ort": "Münchsmünster\n8403"
    },
    {
        "code": "8402",
        "ort": "Münchsmünster"
    },
    {
        "code": "8403",
        "ort": "Pförring"
    },
    {
        "code": "8404",
        "ort": "Oberdolling"
    },
    {
        "code": "8405",
        "ort": "Stammham"
    },
    {
        "code": "8406",
        "ort": "Böhmfeld"
    },
    {
        "code": "8407",
        "ort": "Grossmehring"
    },
    {
        "code": "841",
        "ort": "Ingolstadt"
    },
    {
        "code": "842\n8421",
        "ort": "Eichstätt\n8422"
    },
    {
        "code": "8421",
        "ort": "Eichstätt"
    },
    {
        "code": "8422",
        "ort": "Dollnstein"
    },
    {
        "code": "8423",
        "ort": "Titting"
    },
    {
        "code": "8424",
        "ort": "Nassenfels"
    },
    {
        "code": "8426",
        "ort": "Walting"
    },
    {
        "code": "8427",
        "ort": "Wellheim"
    },
    {
        "code": "843\n8431",
        "ort": "Neuburg"
    },
    {
        "code": "8431",
        "ort": "Neuburg"
    },
    {
        "code": "8432",
        "ort": "Burgheim"
    },
    {
        "code": "8433",
        "ort": "Königsmoos"
    },
    {
        "code": "8434",
        "ort": "Rennertshofen"
    },
    {
        "code": "844\n8441",
        "ort": "Pfaffenhofen"
    },
    {
        "code": "8441",
        "ort": "Pfaffenhofen"
    },
    {
        "code": "8442",
        "ort": "Wolnzach"
    },
    {
        "code": "8443",
        "ort": "Hohenwart"
    },
    {
        "code": "8444",
        "ort": "Schweitenkirchen"
    },
    {
        "code": "8445",
        "ort": "Gerolsbach"
    },
    {
        "code": "8446",
        "ort": "Pörnbach"
    },
    {
        "code": "845\n8450",
        "ort": "Ingolstadt-Zuchering\n8452"
    },
    {
        "code": "8450",
        "ort": "Ingolstadt-Zuchering"
    },
    {
        "code": "8452",
        "ort": "Geisenfeld"
    },
    {
        "code": "8453",
        "ort": "Reichertshofen"
    },
    {
        "code": "8454",
        "ort": "Karlshuld"
    },
    {
        "code": "8456",
        "ort": "Lenting"
    },
    {
        "code": "8457",
        "ort": "Vohburg"
    },
    {
        "code": "8458",
        "ort": "Gaimersheim"
    },
    {
        "code": "8459",
        "ort": "Manching"
    },
    {
        "code": "846\n8460",
        "ort": "Berching-Holnstein\n8461"
    },
    {
        "code": "8460",
        "ort": "Berching-Holnstein"
    },
    {
        "code": "8461",
        "ort": "Beilngries"
    },
    {
        "code": "8462",
        "ort": "Berching"
    },
    {
        "code": "8463",
        "ort": "Greding"
    },
    {
        "code": "8464",
        "ort": "Dietfurt"
    },
    {
        "code": "8465",
        "ort": "Kipfenberg"
    },
    {
        "code": "8466",
        "ort": "Denkendorf"
    },
    {
        "code": "8467",
        "ort": "Kinding"
    },
    {
        "code": "8468",
        "ort": "Altmannstein-Pondorf"
    },
    {
        "code": "8469",
        "ort": "Freystadt-Burggriesbach"
    },
    {
        "code": "8402",
        "ort": "Münchsmünster"
    },
    {
        "code": "8403",
        "ort": "Pförring"
    },
    {
        "code": "8404",
        "ort": "Oberdolling"
    },
    {
        "code": "8405",
        "ort": "Stammham"
    },
    {
        "code": "8406",
        "ort": "Böhmfeld"
    },
    {
        "code": "8407",
        "ort": "Grossmehring"
    },
    {
        "code": "8421",
        "ort": "Eichstätt"
    },
    {
        "code": "8422",
        "ort": "Dollnstein"
    },
    {
        "code": "8423",
        "ort": "Titting"
    },
    {
        "code": "8424",
        "ort": "Nassenfels"
    },
    {
        "code": "8426",
        "ort": "Walting"
    },
    {
        "code": "8427",
        "ort": "Wellheim"
    },
    {
        "code": "8431",
        "ort": "Neuburg"
    },
    {
        "code": "8432",
        "ort": "Burgheim"
    },
    {
        "code": "8433",
        "ort": "Königsmoos"
    },
    {
        "code": "8434",
        "ort": "Rennertshofen"
    },
    {
        "code": "8441",
        "ort": "Pfaffenhofen"
    },
    {
        "code": "8442",
        "ort": "Wolnzach"
    },
    {
        "code": "8443",
        "ort": "Hohenwart"
    },
    {
        "code": "8444",
        "ort": "Schweitenkirchen"
    },
    {
        "code": "8445",
        "ort": "Gerolsbach"
    },
    {
        "code": "8446",
        "ort": "Pörnbach"
    },
    {
        "code": "8450",
        "ort": "Ingolstadt-Zuchering"
    },
    {
        "code": "8452",
        "ort": "Geisenfeld"
    },
    {
        "code": "8453",
        "ort": "Reichertshofen"
    },
    {
        "code": "8454",
        "ort": "Karlshuld"
    },
    {
        "code": "8456",
        "ort": "Lenting"
    },
    {
        "code": "8457",
        "ort": "Vohburg"
    },
    {
        "code": "8458",
        "ort": "Gaimersheim"
    },
    {
        "code": "8459",
        "ort": "Manching"
    },
    {
        "code": "8460",
        "ort": "Berching-Holnstein"
    },
    {
        "code": "8461",
        "ort": "Beilngries"
    },
    {
        "code": "8462",
        "ort": "Berching"
    },
    {
        "code": "8463",
        "ort": "Greding"
    },
    {
        "code": "8464",
        "ort": "Dietfurt"
    },
    {
        "code": "8465",
        "ort": "Kipfenberg"
    },
    {
        "code": "8466",
        "ort": "Denkendorf"
    },
    {
        "code": "8467",
        "ort": "Kinding"
    },
    {
        "code": "8468",
        "ort": "Altmannstein-Pondorf"
    },
    {
        "code": "8469",
        "ort": "Freystadt-Burggriesbach"
    },
    {
        "code": "850\n8501",
        "ort": "Thyrnau\n8502"
    },
    {
        "code": "8501",
        "ort": "Thyrnau"
    },
    {
        "code": "8502",
        "ort": "Fürstenzell"
    },
    {
        "code": "8503",
        "ort": "Neuhaus"
    },
    {
        "code": "8504",
        "ort": "Tittling"
    },
    {
        "code": "8505",
        "ort": "Hutthurm"
    },
    {
        "code": "8506",
        "ort": "Bad"
    },
    {
        "code": "8507",
        "ort": "Neuburg"
    },
    {
        "code": "8509",
        "ort": "Ruderting"
    },
    {
        "code": "851",
        "ort": "Passau"
    },
    {
        "code": "853\n8531",
        "ort": "Pocking\n8532"
    },
    {
        "code": "8531",
        "ort": "Pocking"
    },
    {
        "code": "8532",
        "ort": "Bad"
    },
    {
        "code": "8533",
        "ort": "Rotthalmünster"
    },
    {
        "code": "8534",
        "ort": "Tettenweis"
    },
    {
        "code": "8535",
        "ort": "Haarbach"
    },
    {
        "code": "8536",
        "ort": "Kößlarn"
    },
    {
        "code": "8537",
        "ort": "Bad"
    },
    {
        "code": "8538",
        "ort": "Pocking-Hartkirchen"
    },
    {
        "code": "854\n8541",
        "ort": "Vilshofen"
    },
    {
        "code": "8541",
        "ort": "Vilshofen"
    },
    {
        "code": "8542",
        "ort": "Ortenburg"
    },
    {
        "code": "8543",
        "ort": "Aidenbach"
    },
    {
        "code": "8544",
        "ort": "Eging"
    },
    {
        "code": "8545",
        "ort": "Hofkirchen"
    },
    {
        "code": "8546",
        "ort": "Windorf-Otterskirchen"
    },
    {
        "code": "8547",
        "ort": "Osterhofen-Gergweis"
    },
    {
        "code": "8548",
        "ort": "Vilshofen-Sandbach"
    },
    {
        "code": "8549",
        "ort": "Vilshofen-Pleinting"
    },
    {
        "code": "855\n8550",
        "ort": "Philippsreut\n8551"
    },
    {
        "code": "8550",
        "ort": "Philippsreut"
    },
    {
        "code": "8551",
        "ort": "Freyung"
    },
    {
        "code": "8552",
        "ort": "Grafenau"
    },
    {
        "code": "8553",
        "ort": "Spiegelau"
    },
    {
        "code": "8554",
        "ort": "Schönberg"
    },
    {
        "code": "8555",
        "ort": "Perlesreut"
    },
    {
        "code": "8556",
        "ort": "Haidmühle"
    },
    {
        "code": "8557",
        "ort": "Mauth"
    },
    {
        "code": "8558",
        "ort": "Hohenau"
    },
    {
        "code": "856\n8561",
        "ort": "Pfarrkirchen"
    },
    {
        "code": "8561",
        "ort": "Pfarrkirchen"
    },
    {
        "code": "8562",
        "ort": "Triftern"
    },
    {
        "code": "8563",
        "ort": "Bad"
    },
    {
        "code": "8564",
        "ort": "Johanniskirchen"
    },
    {
        "code": "8565",
        "ort": "Dietersburg-Baumgarten"
    },
    {
        "code": "857\n8571",
        "ort": "Simbach"
    },
    {
        "code": "8571",
        "ort": "Simbach"
    },
    {
        "code": "8572",
        "ort": "Tann"
    },
    {
        "code": "8573",
        "ort": "Ering"
    },
    {
        "code": "8574",
        "ort": "Wittibreut"
    },
    {
        "code": "858\n8581",
        "ort": "Waldkirchen"
    },
    {
        "code": "8581",
        "ort": "Waldkirchen"
    },
    {
        "code": "8582",
        "ort": "Röhrnbach"
    },
    {
        "code": "8583",
        "ort": "Neureichenau"
    },
    {
        "code": "8584",
        "ort": "Breitenberg"
    },
    {
        "code": "8585",
        "ort": "Grainet"
    },
    {
        "code": "8586",
        "ort": "Hauzenberg"
    },
    {
        "code": "859\n8591",
        "ort": "Obernzell\n8592"
    },
    {
        "code": "8591",
        "ort": "Obernzell"
    },
    {
        "code": "8592",
        "ort": "Wegscheid"
    },
    {
        "code": "8593",
        "ort": "Untergriesbach"
    },
    {
        "code": "8501",
        "ort": "Thyrnau"
    },
    {
        "code": "8502",
        "ort": "Fürstenzell"
    },
    {
        "code": "8503",
        "ort": "Neuhaus"
    },
    {
        "code": "8504",
        "ort": "Tittling"
    },
    {
        "code": "8505",
        "ort": "Hutthurm"
    },
    {
        "code": "8506",
        "ort": "Bad"
    },
    {
        "code": "8507",
        "ort": "Neuburg"
    },
    {
        "code": "8509",
        "ort": "Ruderting"
    },
    {
        "code": "8531",
        "ort": "Pocking"
    },
    {
        "code": "8532",
        "ort": "Bad"
    },
    {
        "code": "8533",
        "ort": "Rotthalmünster"
    },
    {
        "code": "8534",
        "ort": "Tettenweis"
    },
    {
        "code": "8535",
        "ort": "Haarbach"
    },
    {
        "code": "8536",
        "ort": "Kößlarn"
    },
    {
        "code": "8537",
        "ort": "Bad"
    },
    {
        "code": "8538",
        "ort": "Pocking-Hartkirchen"
    },
    {
        "code": "8541",
        "ort": "Vilshofen"
    },
    {
        "code": "8542",
        "ort": "Ortenburg"
    },
    {
        "code": "8543",
        "ort": "Aidenbach"
    },
    {
        "code": "8544",
        "ort": "Eging"
    },
    {
        "code": "8545",
        "ort": "Hofkirchen"
    },
    {
        "code": "8546",
        "ort": "Windorf-Otterskirchen"
    },
    {
        "code": "8547",
        "ort": "Osterhofen-Gergweis"
    },
    {
        "code": "8548",
        "ort": "Vilshofen-Sandbach"
    },
    {
        "code": "8549",
        "ort": "Vilshofen-Pleinting"
    },
    {
        "code": "8550",
        "ort": "Philippsreut"
    },
    {
        "code": "8551",
        "ort": "Freyung"
    },
    {
        "code": "8552",
        "ort": "Grafenau"
    },
    {
        "code": "8553",
        "ort": "Spiegelau"
    },
    {
        "code": "8554",
        "ort": "Schönberg"
    },
    {
        "code": "8555",
        "ort": "Perlesreut"
    },
    {
        "code": "8556",
        "ort": "Haidmühle"
    },
    {
        "code": "8557",
        "ort": "Mauth"
    },
    {
        "code": "8558",
        "ort": "Hohenau"
    },
    {
        "code": "8561",
        "ort": "Pfarrkirchen"
    },
    {
        "code": "8562",
        "ort": "Triftern"
    },
    {
        "code": "8563",
        "ort": "Bad"
    },
    {
        "code": "8564",
        "ort": "Johanniskirchen"
    },
    {
        "code": "8565",
        "ort": "Dietersburg-Baumgarten"
    },
    {
        "code": "8571",
        "ort": "Simbach"
    },
    {
        "code": "8572",
        "ort": "Tann"
    },
    {
        "code": "8573",
        "ort": "Ering"
    },
    {
        "code": "8574",
        "ort": "Wittibreut"
    },
    {
        "code": "8581",
        "ort": "Waldkirchen"
    },
    {
        "code": "8582",
        "ort": "Röhrnbach"
    },
    {
        "code": "8583",
        "ort": "Neureichenau"
    },
    {
        "code": "8584",
        "ort": "Breitenberg"
    },
    {
        "code": "8585",
        "ort": "Grainet"
    },
    {
        "code": "8586",
        "ort": "Hauzenberg"
    },
    {
        "code": "8591",
        "ort": "Obernzell"
    },
    {
        "code": "8592",
        "ort": "Wegscheid"
    },
    {
        "code": "8593",
        "ort": "Untergriesbach"
    },
    {
        "code": "861",
        "ort": "Traunstein"
    },
    {
        "code": "862\n8621",
        "ort": "Trostberg\n8622"
    },
    {
        "code": "8621",
        "ort": "Trostberg"
    },
    {
        "code": "8622",
        "ort": "Tacherting"
    },
    {
        "code": "8623",
        "ort": "Kirchweidach"
    },
    {
        "code": "8624",
        "ort": "Obing"
    },
    {
        "code": "8628",
        "ort": "Kienberg"
    },
    {
        "code": "8629",
        "ort": "Palling"
    },
    {
        "code": "863\n8630",
        "ort": "Kraiburg\n8631"
    },
    {
        "code": "8630",
        "ort": "Kraiburg"
    },
    {
        "code": "8631",
        "ort": "Mühldorf"
    },
    {
        "code": "8633",
        "ort": "Tüßling/Polling"
    },
    {
        "code": "8634",
        "ort": "Garching"
    },
    {
        "code": "8636",
        "ort": "Ampfing"
    },
    {
        "code": "8638",
        "ort": "Waldkraiburg"
    },
    {
        "code": "864\n8640\tReit",
        "ort": "im"
    },
    {
        "code": "8640\tReit",
        "ort": "im"
    },
    {
        "code": "8641\tGrassau"
    },
    {
        "code": "8642\tÜbersee"
    },
    {
        "code": "8649\tSchleching"
    },
    {
        "code": "865\n8650",
        "ort": "Marktschellenberg\n8651"
    },
    {
        "code": "8650",
        "ort": "Marktschellenberg"
    },
    {
        "code": "8651",
        "ort": "Bad"
    },
    {
        "code": "8652",
        "ort": "Berchtesgaden"
    },
    {
        "code": "8654",
        "ort": "Freilassing"
    },
    {
        "code": "8656",
        "ort": "Anger"
    },
    {
        "code": "8657",
        "ort": "Ramsau"
    },
    {
        "code": "866\n8661",
        "ort": "Grabenstätt\n8662"
    },
    {
        "code": "8661",
        "ort": "Grabenstätt"
    },
    {
        "code": "8662",
        "ort": "Siegsdorf"
    },
    {
        "code": "8663",
        "ort": "Ruhpolding"
    },
    {
        "code": "8664",
        "ort": "Chieming"
    },
    {
        "code": "8665",
        "ort": "Inzell"
    },
    {
        "code": "8666",
        "ort": "Teisendorf"
    },
    {
        "code": "8667",
        "ort": "Seebruck"
    },
    {
        "code": "8669",
        "ort": "Traunreut"
    },
    {
        "code": "867\n8670",
        "ort": "Reischach\n8677"
    },
    {
        "code": "8670",
        "ort": "Reischach"
    },
    {
        "code": "8677",
        "ort": "Burghausen"
    },
    {
        "code": "8679",
        "ort": "Burgkirchen"
    },
    {
        "code": "868\n8682",
        "ort": "Laufen"
    },
    {
        "code": "8682",
        "ort": "Laufen"
    },
    {
        "code": "8621",
        "ort": "Trostberg"
    },
    {
        "code": "8622",
        "ort": "Tacherting"
    },
    {
        "code": "8623",
        "ort": "Kirchweidach"
    },
    {
        "code": "8624",
        "ort": "Obing"
    },
    {
        "code": "8628",
        "ort": "Kienberg"
    },
    {
        "code": "8629",
        "ort": "Palling"
    },
    {
        "code": "8630",
        "ort": "Kraiburg"
    },
    {
        "code": "8631",
        "ort": "Mühldorf"
    },
    {
        "code": "8633",
        "ort": "Tüßling/Polling"
    },
    {
        "code": "8634",
        "ort": "Garching"
    },
    {
        "code": "8636",
        "ort": "Ampfing"
    },
    {
        "code": "8638",
        "ort": "Waldkraiburg"
    },
    {
        "code": "8640\tReit",
        "ort": "im"
    },
    {
        "code": "8641\tGrassau"
    },
    {
        "code": "8642\tÜbersee"
    },
    {
        "code": "8649\tSchleching"
    },
    {
        "code": "8650",
        "ort": "Marktschellenberg"
    },
    {
        "code": "8651",
        "ort": "Bad"
    },
    {
        "code": "8652",
        "ort": "Berchtesgaden"
    },
    {
        "code": "8654",
        "ort": "Freilassing"
    },
    {
        "code": "8656",
        "ort": "Anger"
    },
    {
        "code": "8657",
        "ort": "Ramsau"
    },
    {
        "code": "8661",
        "ort": "Grabenstätt"
    },
    {
        "code": "8662",
        "ort": "Siegsdorf"
    },
    {
        "code": "8663",
        "ort": "Ruhpolding"
    },
    {
        "code": "8664",
        "ort": "Chieming"
    },
    {
        "code": "8665",
        "ort": "Inzell"
    },
    {
        "code": "8666",
        "ort": "Teisendorf"
    },
    {
        "code": "8667",
        "ort": "Seebruck"
    },
    {
        "code": "8669",
        "ort": "Traunreut"
    },
    {
        "code": "8670",
        "ort": "Reischach"
    },
    {
        "code": "8677",
        "ort": "Burghausen"
    },
    {
        "code": "8679",
        "ort": "Burgkirchen"
    },
    {
        "code": "8682",
        "ort": "Laufen"
    },
    {
        "code": "870\n8705",
        "ort": "Altfraunhofen"
    },
    {
        "code": "8705",
        "ort": "Altfraunhofen"
    },
    {
        "code": "871",
        "ort": "Landshut"
    },
    {
        "code": "872\n8722",
        "ort": "Gangkofen"
    },
    {
        "code": "8722",
        "ort": "Gangkofen"
    },
    {
        "code": "873\n8731",
        "ort": "Dingolfing\n8732"
    },
    {
        "code": "8731",
        "ort": "Dingolfing"
    },
    {
        "code": "8732",
        "ort": "Frontenhausen"
    },
    {
        "code": "874\n8741",
        "ort": "Vilsbiburg\n8743"
    },
    {
        "code": "8741",
        "ort": "Vilsbiburg"
    },
    {
        "code": "8743",
        "ort": "Geisenhausen"
    },
    {
        "code": "8745",
        "ort": "Bodenkirchen"
    },
    {
        "code": "875"
    },
    {
        "code": "876\n8761",
        "ort": "Moosburg"
    },
    {
        "code": "8761",
        "ort": "Moosburg"
    },
    {
        "code": "8765",
        "ort": "Tondorf"
    },
    {
        "code": "878\n8781",
        "ort": "Rottenburg"
    },
    {
        "code": "8781",
        "ort": "Rottenburg"
    },
    {
        "code": "879"
    },
    {
        "code": "8705",
        "ort": "Altfraunhofen"
    },
    {
        "code": "8722",
        "ort": "Gangkofen"
    },
    {
        "code": "8731",
        "ort": "Dingolfing"
    },
    {
        "code": "8732",
        "ort": "Frontenhausen"
    },
    {
        "code": "8741",
        "ort": "Vilsbiburg"
    },
    {
        "code": "8743",
        "ort": "Geisenhausen"
    },
    {
        "code": "8745",
        "ort": "Bodenkirchen"
    },
    {
        "code": "8761",
        "ort": "Moosburg"
    },
    {
        "code": "8765",
        "ort": "Tondorf"
    },
    {
        "code": "8781",
        "ort": "Rottenburg"
    },
    {
        "code": "880\n8801",
        "ort": "Seeshaupt\n8802"
    },
    {
        "code": "8801",
        "ort": "Seeshaupt"
    },
    {
        "code": "8802",
        "ort": "Huglfing"
    },
    {
        "code": "8803",
        "ort": "Peißenberg"
    },
    {
        "code": "8805",
        "ort": "Hohenpeißenberg"
    },
    {
        "code": "8806",
        "ort": "Utting"
    },
    {
        "code": "8807",
        "ort": "Dießen"
    },
    {
        "code": "8808",
        "ort": "Pähl"
    },
    {
        "code": "8809",
        "ort": "Wessobrunn"
    },
    {
        "code": "881",
        "ort": "Weilheim"
    },
    {
        "code": "882\n8821",
        "ort": "Garmisch-Partenkirchen\n8822"
    },
    {
        "code": "8821",
        "ort": "Garmisch-Partenkirchen"
    },
    {
        "code": "8822",
        "ort": "Oberammergau"
    },
    {
        "code": "8823",
        "ort": "Mittenwald"
    },
    {
        "code": "8824",
        "ort": "Oberau"
    },
    {
        "code": "8825",
        "ort": "Krün"
    },
    {
        "code": "884\n8841",
        "ort": "Murnau"
    },
    {
        "code": "8841",
        "ort": "Murnau"
    },
    {
        "code": "885\n8851",
        "ort": "Kochel"
    },
    {
        "code": "8851",
        "ort": "Kochel"
    },
    {
        "code": "8856",
        "ort": "Penzberg"
    },
    {
        "code": "8857",
        "ort": "Benediktbeuern"
    },
    {
        "code": "8858",
        "ort": "Walchensee"
    },
    {
        "code": "886\n8860",
        "ort": "Bernbeuren\n8861"
    },
    {
        "code": "8860",
        "ort": "Bernbeuren"
    },
    {
        "code": "8861",
        "ort": "Schongau"
    },
    {
        "code": "8862",
        "ort": "Steingaden"
    },
    {
        "code": "8867",
        "ort": "Rottenbuch"
    },
    {
        "code": "8868",
        "ort": "Schwabsoien"
    },
    {
        "code": "8869",
        "ort": "Kinsau"
    },
    {
        "code": "8801",
        "ort": "Seeshaupt"
    },
    {
        "code": "8802",
        "ort": "Huglfing"
    },
    {
        "code": "8803",
        "ort": "Peißenberg"
    },
    {
        "code": "8805",
        "ort": "Hohenpeißenberg"
    },
    {
        "code": "8806",
        "ort": "Utting"
    },
    {
        "code": "8807",
        "ort": "Dießen"
    },
    {
        "code": "8808",
        "ort": "Pähl"
    },
    {
        "code": "8809",
        "ort": "Wessobrunn"
    },
    {
        "code": "8821",
        "ort": "Garmisch-Partenkirchen"
    },
    {
        "code": "8822",
        "ort": "Oberammergau"
    },
    {
        "code": "8823",
        "ort": "Mittenwald"
    },
    {
        "code": "8824",
        "ort": "Oberau"
    },
    {
        "code": "8825",
        "ort": "Krün"
    },
    {
        "code": "8841",
        "ort": "Murnau"
    },
    {
        "code": "8851",
        "ort": "Kochel"
    },
    {
        "code": "8856",
        "ort": "Penzberg"
    },
    {
        "code": "8857",
        "ort": "Benediktbeuern"
    },
    {
        "code": "8858",
        "ort": "Walchensee"
    },
    {
        "code": "8860",
        "ort": "Bernbeuren"
    },
    {
        "code": "8861",
        "ort": "Schongau"
    },
    {
        "code": "8862",
        "ort": "Steingaden"
    },
    {
        "code": "8867",
        "ort": "Rottenbuch"
    },
    {
        "code": "8868",
        "ort": "Schwabsoien"
    },
    {
        "code": "8869",
        "ort": "Kinsau"
    },
    {
        "code": "89",
        "ort": "München"
    },
    {
        "code": "9002",
        "ort": "→"
    },
    {
        "code": "9003",
        "ort": "→"
    },
    {
        "code": "9004",
        "ort": "→"
    },
    {
        "code": "9005",
        "ort": "→"
    },
    {
        "code": "9006",
        "ort": "→"
    },
    {
        "code": "9007",
        "ort": "→"
    },
    {
        "code": "9008",
        "ort": "→"
    },
    {
        "code": "9009",
        "ort": "→"
    },
    {
        "code": "900\n900-1",
        "ort": "premium-rate"
    },
    {
        "code": "900-1",
        "ort": "premium-rate"
    },
    {
        "code": "900-3",
        "ort": "premium-rate"
    },
    {
        "code": "900-5",
        "ort": "premium-rate"
    },
    {
        "code": "900-9",
        "ort": "premium-rate"
    },
    {
        "code": "901",
        "ort": "premium-rate"
    },
    {
        "code": "902",
        "ort": "replacement"
    },
    {
        "code": "906",
        "ort": "Donauwörth"
    },
    {
        "code": "907\n9070",
        "ort": "Tapfheim\n9071"
    },
    {
        "code": "9070",
        "ort": "Tapfheim"
    },
    {
        "code": "9071",
        "ort": "Dillingen"
    },
    {
        "code": "9072",
        "ort": "Lauingen"
    },
    {
        "code": "9073",
        "ort": "Gundelfingen"
    },
    {
        "code": "9074",
        "ort": "Höchstädt"
    },
    {
        "code": "9075",
        "ort": "Glött"
    },
    {
        "code": "9076",
        "ort": "Wittislingen"
    },
    {
        "code": "9077",
        "ort": "Bachhagel"
    },
    {
        "code": "9078",
        "ort": "Mertingen"
    },
    {
        "code": "908\n9080",
        "ort": "Harburg\n9081"
    },
    {
        "code": "9080",
        "ort": "Harburg"
    },
    {
        "code": "9081",
        "ort": "Nördlingen"
    },
    {
        "code": "9082",
        "ort": "Oettingen"
    },
    {
        "code": "9083",
        "ort": "Möttingen"
    },
    {
        "code": "9084",
        "ort": "Bissingen"
    },
    {
        "code": "9085",
        "ort": "Alerheim"
    },
    {
        "code": "9086",
        "ort": "Fremdingen"
    },
    {
        "code": "9087",
        "ort": "Marktoffingen"
    },
    {
        "code": "9088",
        "ort": "Mönchsdeggingen"
    },
    {
        "code": "9089",
        "ort": "Bissingen-Unterringingen"
    },
    {
        "code": "909\n9090",
        "ort": "Rain\n9091"
    },
    {
        "code": "9090",
        "ort": "Rain"
    },
    {
        "code": "9091",
        "ort": "Monheim"
    },
    {
        "code": "9092",
        "ort": "Wemding"
    },
    {
        "code": "9093",
        "ort": "Polsingen"
    },
    {
        "code": "9094",
        "ort": "Tagmersheim"
    },
    {
        "code": "9097",
        "ort": "Marxheim"
    },
    {
        "code": "9099",
        "ort": "Kaisheim"
    },
    {
        "code": "900-1",
        "ort": "premium-rate"
    },
    {
        "code": "900-3",
        "ort": "premium-rate"
    },
    {
        "code": "900-5",
        "ort": "premium-rate"
    },
    {
        "code": "900-9",
        "ort": "premium-rate"
    },
    {
        "code": "9070",
        "ort": "Tapfheim"
    },
    {
        "code": "9071",
        "ort": "Dillingen"
    },
    {
        "code": "9072",
        "ort": "Lauingen"
    },
    {
        "code": "9073",
        "ort": "Gundelfingen"
    },
    {
        "code": "9074",
        "ort": "Höchstädt"
    },
    {
        "code": "9075",
        "ort": "Glött"
    },
    {
        "code": "9076",
        "ort": "Wittislingen"
    },
    {
        "code": "9077",
        "ort": "Bachhagel"
    },
    {
        "code": "9078",
        "ort": "Mertingen"
    },
    {
        "code": "9080",
        "ort": "Harburg"
    },
    {
        "code": "9081",
        "ort": "Nördlingen"
    },
    {
        "code": "9082",
        "ort": "Oettingen"
    },
    {
        "code": "9083",
        "ort": "Möttingen"
    },
    {
        "code": "9084",
        "ort": "Bissingen"
    },
    {
        "code": "9085",
        "ort": "Alerheim"
    },
    {
        "code": "9086",
        "ort": "Fremdingen"
    },
    {
        "code": "9087",
        "ort": "Marktoffingen"
    },
    {
        "code": "9088",
        "ort": "Mönchsdeggingen"
    },
    {
        "code": "9089",
        "ort": "Bissingen-Unterringingen"
    },
    {
        "code": "9090",
        "ort": "Rain"
    },
    {
        "code": "9091",
        "ort": "Monheim"
    },
    {
        "code": "9092",
        "ort": "Wemding"
    },
    {
        "code": "9093",
        "ort": "Polsingen"
    },
    {
        "code": "9094",
        "ort": "Tagmersheim"
    },
    {
        "code": "9097",
        "ort": "Marxheim"
    },
    {
        "code": "9099",
        "ort": "Kaisheim"
    },
    {
        "code": "910\n9101",
        "ort": "Langenzenn\n9102"
    },
    {
        "code": "9101",
        "ort": "Langenzenn"
    },
    {
        "code": "9102",
        "ort": "Wilhermsdorf"
    },
    {
        "code": "9103",
        "ort": "Cadolzburg"
    },
    {
        "code": "9104",
        "ort": "Emskirchen"
    },
    {
        "code": "9105",
        "ort": "Großhabersdorf"
    },
    {
        "code": "9106",
        "ort": "Markt"
    },
    {
        "code": "9107",
        "ort": "Trautskirchen"
    },
    {
        "code": "911",
        "ort": "Nürnberg/Fürth"
    },
    {
        "code": "912\n9122",
        "ort": "Schwabach\n9123"
    },
    {
        "code": "9122",
        "ort": "Schwabach"
    },
    {
        "code": "9123",
        "ort": "Lauf"
    },
    {
        "code": "9126",
        "ort": "Eckental"
    },
    {
        "code": "9127",
        "ort": "Roßtal"
    },
    {
        "code": "9128",
        "ort": "Feucht"
    },
    {
        "code": "9129",
        "ort": "Wendelstein"
    },
    {
        "code": "913\n9131",
        "ort": "Erlangen\n9132"
    },
    {
        "code": "9131",
        "ort": "Erlangen"
    },
    {
        "code": "9132",
        "ort": "Herzogenaurach"
    },
    {
        "code": "9133",
        "ort": "Baiersdorf"
    },
    {
        "code": "9134",
        "ort": "Neunkirchen"
    },
    {
        "code": "9135",
        "ort": "Heßdorf"
    },
    {
        "code": "914\n9141",
        "ort": "Weißenburg"
    },
    {
        "code": "9141",
        "ort": "Weißenburg"
    },
    {
        "code": "9142",
        "ort": "Treuchtlingen"
    },
    {
        "code": "9143",
        "ort": "Pappenheim"
    },
    {
        "code": "9144",
        "ort": "Pleinfeld"
    },
    {
        "code": "9145",
        "ort": "Solnhofen"
    },
    {
        "code": "9146",
        "ort": "Markt"
    },
    {
        "code": "9147",
        "ort": "Nennslingen"
    },
    {
        "code": "9148",
        "ort": "Ettenstatt"
    },
    {
        "code": "9149",
        "ort": "Weißenburg-Suffersheim"
    },
    {
        "code": "915\n9151",
        "ort": "Hersbruck\n9152"
    },
    {
        "code": "9151",
        "ort": "Hersbruck"
    },
    {
        "code": "9152",
        "ort": "Hartenstein"
    },
    {
        "code": "9153",
        "ort": "Schnaittach"
    },
    {
        "code": "9154",
        "ort": "Pommelsbrunn"
    },
    {
        "code": "9155",
        "ort": "Simmelsdorf"
    },
    {
        "code": "9156",
        "ort": "Neuhaus"
    },
    {
        "code": "9157",
        "ort": "Alfeld"
    },
    {
        "code": "9158",
        "ort": "Offenhausen"
    },
    {
        "code": "916\n9161",
        "ort": "Neustadt"
    },
    {
        "code": "9161",
        "ort": "Neustadt"
    },
    {
        "code": "9162",
        "ort": "Scheinfeld"
    },
    {
        "code": "9163",
        "ort": "Dachsbach"
    },
    {
        "code": "9164",
        "ort": "Langenfeld"
    },
    {
        "code": "9165",
        "ort": "Sugenheim"
    },
    {
        "code": "9166",
        "ort": "Münchsteinach"
    },
    {
        "code": "9167",
        "ort": "Oberscheinfeld"
    },
    {
        "code": "917\n9170",
        "ort": "Schwanstetten\n9171"
    },
    {
        "code": "9170",
        "ort": "Schwanstetten"
    },
    {
        "code": "9171",
        "ort": "Roth"
    },
    {
        "code": "9172",
        "ort": "Georgensgmünd"
    },
    {
        "code": "9173",
        "ort": "Thalmässing"
    },
    {
        "code": "9174",
        "ort": "Hilpoltstein"
    },
    {
        "code": "9175",
        "ort": "Spalt"
    },
    {
        "code": "9176",
        "ort": "Allersberg"
    },
    {
        "code": "9177",
        "ort": "Heideck"
    },
    {
        "code": "9178",
        "ort": "Abenberg"
    },
    {
        "code": "9179",
        "ort": "Freystadt"
    },
    {
        "code": "918\n9180",
        "ort": "Seligenporten"
    },
    {
        "code": "9180",
        "ort": "Seligenporten"
    },
    {
        "code": "9181",
        "ort": "Neumarkt"
    },
    {
        "code": "9182",
        "ort": "Velburg"
    },
    {
        "code": "9183",
        "ort": "Burgthann"
    },
    {
        "code": "9184",
        "ort": "Deining"
    },
    {
        "code": "9185",
        "ort": "Mühlhausen"
    },
    {
        "code": "9186",
        "ort": "Lauterhofen"
    },
    {
        "code": "9187",
        "ort": "Altdorf"
    },
    {
        "code": "9188",
        "ort": "Postbauer-Heng"
    },
    {
        "code": "9189",
        "ort": "Berg"
    },
    {
        "code": "919\n9191",
        "ort": "Forchheim\n9192"
    },
    {
        "code": "9191",
        "ort": "Forchheim"
    },
    {
        "code": "9192",
        "ort": "Gräfenberg"
    },
    {
        "code": "9193",
        "ort": "Höchstadt"
    },
    {
        "code": "9194",
        "ort": "Ebermannstadt"
    },
    {
        "code": "9195",
        "ort": "Adelsdorf"
    },
    {
        "code": "9196",
        "ort": "Wiesenttal"
    },
    {
        "code": "9198",
        "ort": "Heiligenstadt"
    },
    {
        "code": "9101",
        "ort": "Langenzenn"
    },
    {
        "code": "9102",
        "ort": "Wilhermsdorf"
    },
    {
        "code": "9103",
        "ort": "Cadolzburg"
    },
    {
        "code": "9104",
        "ort": "Emskirchen"
    },
    {
        "code": "9105",
        "ort": "Großhabersdorf"
    },
    {
        "code": "9106",
        "ort": "Markt"
    },
    {
        "code": "9107",
        "ort": "Trautskirchen"
    },
    {
        "code": "9122",
        "ort": "Schwabach"
    },
    {
        "code": "9123",
        "ort": "Lauf"
    },
    {
        "code": "9126",
        "ort": "Eckental"
    },
    {
        "code": "9127",
        "ort": "Roßtal"
    },
    {
        "code": "9128",
        "ort": "Feucht"
    },
    {
        "code": "9129",
        "ort": "Wendelstein"
    },
    {
        "code": "9131",
        "ort": "Erlangen"
    },
    {
        "code": "9132",
        "ort": "Herzogenaurach"
    },
    {
        "code": "9133",
        "ort": "Baiersdorf"
    },
    {
        "code": "9134",
        "ort": "Neunkirchen"
    },
    {
        "code": "9135",
        "ort": "Heßdorf"
    },
    {
        "code": "9141",
        "ort": "Weißenburg"
    },
    {
        "code": "9142",
        "ort": "Treuchtlingen"
    },
    {
        "code": "9143",
        "ort": "Pappenheim"
    },
    {
        "code": "9144",
        "ort": "Pleinfeld"
    },
    {
        "code": "9145",
        "ort": "Solnhofen"
    },
    {
        "code": "9146",
        "ort": "Markt"
    },
    {
        "code": "9147",
        "ort": "Nennslingen"
    },
    {
        "code": "9148",
        "ort": "Ettenstatt"
    },
    {
        "code": "9149",
        "ort": "Weißenburg-Suffersheim"
    },
    {
        "code": "9151",
        "ort": "Hersbruck"
    },
    {
        "code": "9152",
        "ort": "Hartenstein"
    },
    {
        "code": "9153",
        "ort": "Schnaittach"
    },
    {
        "code": "9154",
        "ort": "Pommelsbrunn"
    },
    {
        "code": "9155",
        "ort": "Simmelsdorf"
    },
    {
        "code": "9156",
        "ort": "Neuhaus"
    },
    {
        "code": "9157",
        "ort": "Alfeld"
    },
    {
        "code": "9158",
        "ort": "Offenhausen"
    },
    {
        "code": "9161",
        "ort": "Neustadt"
    },
    {
        "code": "9162",
        "ort": "Scheinfeld"
    },
    {
        "code": "9163",
        "ort": "Dachsbach"
    },
    {
        "code": "9164",
        "ort": "Langenfeld"
    },
    {
        "code": "9165",
        "ort": "Sugenheim"
    },
    {
        "code": "9166",
        "ort": "Münchsteinach"
    },
    {
        "code": "9167",
        "ort": "Oberscheinfeld"
    },
    {
        "code": "9170",
        "ort": "Schwanstetten"
    },
    {
        "code": "9171",
        "ort": "Roth"
    },
    {
        "code": "9172",
        "ort": "Georgensgmünd"
    },
    {
        "code": "9173",
        "ort": "Thalmässing"
    },
    {
        "code": "9174",
        "ort": "Hilpoltstein"
    },
    {
        "code": "9175",
        "ort": "Spalt"
    },
    {
        "code": "9176",
        "ort": "Allersberg"
    },
    {
        "code": "9177",
        "ort": "Heideck"
    },
    {
        "code": "9178",
        "ort": "Abenberg"
    },
    {
        "code": "9179",
        "ort": "Freystadt"
    },
    {
        "code": "9180",
        "ort": "Seligenporten"
    },
    {
        "code": "9181",
        "ort": "Neumarkt"
    },
    {
        "code": "9182",
        "ort": "Velburg"
    },
    {
        "code": "9183",
        "ort": "Burgthann"
    },
    {
        "code": "9184",
        "ort": "Deining"
    },
    {
        "code": "9185",
        "ort": "Mühlhausen"
    },
    {
        "code": "9186",
        "ort": "Lauterhofen"
    },
    {
        "code": "9187",
        "ort": "Altdorf"
    },
    {
        "code": "9188",
        "ort": "Postbauer-Heng"
    },
    {
        "code": "9189",
        "ort": "Berg"
    },
    {
        "code": "9191",
        "ort": "Forchheim"
    },
    {
        "code": "9192",
        "ort": "Gräfenberg"
    },
    {
        "code": "9193",
        "ort": "Höchstadt"
    },
    {
        "code": "9194",
        "ort": "Ebermannstadt"
    },
    {
        "code": "9195",
        "ort": "Adelsdorf"
    },
    {
        "code": "9196",
        "ort": "Wiesenttal"
    },
    {
        "code": "9198",
        "ort": "Heiligenstadt"
    },
    {
        "code": "920\n9201",
        "ort": "Gesees\n9202"
    },
    {
        "code": "9201",
        "ort": "Gesees"
    },
    {
        "code": "9202",
        "ort": "Waischenfeld"
    },
    {
        "code": "9203",
        "ort": "Neudrossenfeld"
    },
    {
        "code": "9204",
        "ort": "Plankenfels"
    },
    {
        "code": "9205",
        "ort": "Vorbach"
    },
    {
        "code": "9206",
        "ort": "Obernsees"
    },
    {
        "code": "9207",
        "ort": "Königsfeld"
    },
    {
        "code": "9208",
        "ort": "Bindlach"
    },
    {
        "code": "921",
        "ort": "Bayreuth"
    },
    {
        "code": "922\n9220",
        "ort": "Azendorf\n9221"
    },
    {
        "code": "9220",
        "ort": "Azendorf"
    },
    {
        "code": "9221",
        "ort": "Kulmbach"
    },
    {
        "code": "9222",
        "ort": "Presseck"
    },
    {
        "code": "9223",
        "ort": "Rugendorf"
    },
    {
        "code": "9224",
        "ort": "(not"
    },
    {
        "code": "9225",
        "ort": "Stadtsteinach"
    },
    {
        "code": "9226",
        "ort": "(not"
    },
    {
        "code": "9227",
        "ort": "Neuenmarkt"
    },
    {
        "code": "9228",
        "ort": "Thurnau"
    },
    {
        "code": "9229",
        "ort": "Mainleus"
    },
    {
        "code": "923\n9230",
        "ort": "(not"
    },
    {
        "code": "9230",
        "ort": "(not"
    },
    {
        "code": "9231",
        "ort": "Marktredwitz"
    },
    {
        "code": "9232",
        "ort": "Wunsiedel"
    },
    {
        "code": "9233",
        "ort": "Arzberg"
    },
    {
        "code": "9234",
        "ort": "Neusorg"
    },
    {
        "code": "9235",
        "ort": "Thierstein"
    },
    {
        "code": "9236",
        "ort": "Nagel"
    },
    {
        "code": "9237",
        "ort": "(not"
    },
    {
        "code": "9238",
        "ort": "Röslau"
    },
    {
        "code": "9239",
        "ort": "(not"
    },
    {
        "code": "924\n9240",
        "ort": "(not"
    },
    {
        "code": "9240",
        "ort": "(not"
    },
    {
        "code": "9241",
        "ort": "Pegnitz"
    },
    {
        "code": "9242",
        "ort": "Gößweinstein"
    },
    {
        "code": "9243",
        "ort": "Pottenstein"
    },
    {
        "code": "9244",
        "ort": "Betzenstein"
    },
    {
        "code": "9245",
        "ort": "Obertrubach"
    },
    {
        "code": "9246",
        "ort": "Trockau"
    },
    {
        "code": "9247",
        "ort": "(not"
    },
    {
        "code": "9248",
        "ort": "(not"
    },
    {
        "code": "9249",
        "ort": "(not"
    },
    {
        "code": "925\n9250",
        "ort": "(not"
    },
    {
        "code": "9250",
        "ort": "(not"
    },
    {
        "code": "9251",
        "ort": "Münchberg"
    },
    {
        "code": "9252",
        "ort": "Helmbrechts"
    },
    {
        "code": "9253",
        "ort": "Weißenstadt"
    },
    {
        "code": "9254",
        "ort": "Gefrees"
    },
    {
        "code": "9255",
        "ort": "Marktleugast"
    },
    {
        "code": "9256",
        "ort": "Stammbach"
    },
    {
        "code": "9257",
        "ort": "Zell"
    },
    {
        "code": "9258",
        "ort": "(not"
    },
    {
        "code": "9259",
        "ort": "(not"
    },
    {
        "code": "926\n9260",
        "ort": "Wilhelmsthal"
    },
    {
        "code": "9260",
        "ort": "Wilhelmsthal"
    },
    {
        "code": "9261",
        "ort": "Kronach"
    },
    {
        "code": "9262",
        "ort": "Wallenfels"
    },
    {
        "code": "9263",
        "ort": "Ludwigsstadt"
    },
    {
        "code": "9264",
        "ort": "Küps"
    },
    {
        "code": "9265",
        "ort": "Pressig"
    },
    {
        "code": "9266",
        "ort": "Mitwitz"
    },
    {
        "code": "9267",
        "ort": "Nordhalben"
    },
    {
        "code": "9268",
        "ort": "Teuschnitz"
    },
    {
        "code": "9269",
        "ort": "Tettau"
    },
    {
        "code": "927\n9270",
        "ort": "Creußen\n9271"
    },
    {
        "code": "9270",
        "ort": "Creußen"
    },
    {
        "code": "9271",
        "ort": "Alladorf"
    },
    {
        "code": "9272",
        "ort": "Fichtelberg"
    },
    {
        "code": "9273",
        "ort": "Bad"
    },
    {
        "code": "9274",
        "ort": "Hollfeld"
    },
    {
        "code": "9275",
        "ort": "Speichersdorf"
    },
    {
        "code": "9276",
        "ort": "Bischofsgrün"
    },
    {
        "code": "9277",
        "ort": "Warmensteinach"
    },
    {
        "code": "9278",
        "ort": "Weidenberg"
    },
    {
        "code": "9279",
        "ort": "Mistelgau"
    },
    {
        "code": "928\n9280",
        "ort": "Selbitz"
    },
    {
        "code": "9280",
        "ort": "Selbitz"
    },
    {
        "code": "9281",
        "ort": "Hof"
    },
    {
        "code": "9282",
        "ort": "Naila"
    },
    {
        "code": "9283",
        "ort": "Rehau"
    },
    {
        "code": "9284",
        "ort": "Schwarzenbach"
    },
    {
        "code": "9285",
        "ort": "Kirchenlamitz"
    },
    {
        "code": "9286",
        "ort": "Oberkotzau"
    },
    {
        "code": "9287",
        "ort": "Selb"
    },
    {
        "code": "9288",
        "ort": "Bad"
    },
    {
        "code": "9289",
        "ort": "Schwarzenbach"
    },
    {
        "code": "929\n9290",
        "ort": "(not"
    },
    {
        "code": "9290",
        "ort": "(not"
    },
    {
        "code": "9291",
        "ort": "(not"
    },
    {
        "code": "9292",
        "ort": "Konradsreuth"
    },
    {
        "code": "9293",
        "ort": "Berg"
    },
    {
        "code": "9294",
        "ort": "Regnitzlosau"
    },
    {
        "code": "9295",
        "ort": "Töpen"
    },
    {
        "code": "9296",
        "ort": "(not"
    },
    {
        "code": "9297",
        "ort": "(not"
    },
    {
        "code": "9298",
        "ort": "(not"
    },
    {
        "code": "9299",
        "ort": "(not"
    },
    {
        "code": "9201",
        "ort": "Gesees"
    },
    {
        "code": "9202",
        "ort": "Waischenfeld"
    },
    {
        "code": "9203",
        "ort": "Neudrossenfeld"
    },
    {
        "code": "9204",
        "ort": "Plankenfels"
    },
    {
        "code": "9205",
        "ort": "Vorbach"
    },
    {
        "code": "9206",
        "ort": "Obernsees"
    },
    {
        "code": "9207",
        "ort": "Königsfeld"
    },
    {
        "code": "9208",
        "ort": "Bindlach"
    },
    {
        "code": "9220",
        "ort": "Azendorf"
    },
    {
        "code": "9221",
        "ort": "Kulmbach"
    },
    {
        "code": "9222",
        "ort": "Presseck"
    },
    {
        "code": "9223",
        "ort": "Rugendorf"
    },
    {
        "code": "9224",
        "ort": "(not"
    },
    {
        "code": "9225",
        "ort": "Stadtsteinach"
    },
    {
        "code": "9226",
        "ort": "(not"
    },
    {
        "code": "9227",
        "ort": "Neuenmarkt"
    },
    {
        "code": "9228",
        "ort": "Thurnau"
    },
    {
        "code": "9229",
        "ort": "Mainleus"
    },
    {
        "code": "9230",
        "ort": "(not"
    },
    {
        "code": "9231",
        "ort": "Marktredwitz"
    },
    {
        "code": "9232",
        "ort": "Wunsiedel"
    },
    {
        "code": "9233",
        "ort": "Arzberg"
    },
    {
        "code": "9234",
        "ort": "Neusorg"
    },
    {
        "code": "9235",
        "ort": "Thierstein"
    },
    {
        "code": "9236",
        "ort": "Nagel"
    },
    {
        "code": "9237",
        "ort": "(not"
    },
    {
        "code": "9238",
        "ort": "Röslau"
    },
    {
        "code": "9239",
        "ort": "(not"
    },
    {
        "code": "9240",
        "ort": "(not"
    },
    {
        "code": "9241",
        "ort": "Pegnitz"
    },
    {
        "code": "9242",
        "ort": "Gößweinstein"
    },
    {
        "code": "9243",
        "ort": "Pottenstein"
    },
    {
        "code": "9244",
        "ort": "Betzenstein"
    },
    {
        "code": "9245",
        "ort": "Obertrubach"
    },
    {
        "code": "9246",
        "ort": "Trockau"
    },
    {
        "code": "9247",
        "ort": "(not"
    },
    {
        "code": "9248",
        "ort": "(not"
    },
    {
        "code": "9249",
        "ort": "(not"
    },
    {
        "code": "9250",
        "ort": "(not"
    },
    {
        "code": "9251",
        "ort": "Münchberg"
    },
    {
        "code": "9252",
        "ort": "Helmbrechts"
    },
    {
        "code": "9253",
        "ort": "Weißenstadt"
    },
    {
        "code": "9254",
        "ort": "Gefrees"
    },
    {
        "code": "9255",
        "ort": "Marktleugast"
    },
    {
        "code": "9256",
        "ort": "Stammbach"
    },
    {
        "code": "9257",
        "ort": "Zell"
    },
    {
        "code": "9258",
        "ort": "(not"
    },
    {
        "code": "9259",
        "ort": "(not"
    },
    {
        "code": "9260",
        "ort": "Wilhelmsthal"
    },
    {
        "code": "9261",
        "ort": "Kronach"
    },
    {
        "code": "9262",
        "ort": "Wallenfels"
    },
    {
        "code": "9263",
        "ort": "Ludwigsstadt"
    },
    {
        "code": "9264",
        "ort": "Küps"
    },
    {
        "code": "9265",
        "ort": "Pressig"
    },
    {
        "code": "9266",
        "ort": "Mitwitz"
    },
    {
        "code": "9267",
        "ort": "Nordhalben"
    },
    {
        "code": "9268",
        "ort": "Teuschnitz"
    },
    {
        "code": "9269",
        "ort": "Tettau"
    },
    {
        "code": "9270",
        "ort": "Creußen"
    },
    {
        "code": "9271",
        "ort": "Alladorf"
    },
    {
        "code": "9272",
        "ort": "Fichtelberg"
    },
    {
        "code": "9273",
        "ort": "Bad"
    },
    {
        "code": "9274",
        "ort": "Hollfeld"
    },
    {
        "code": "9275",
        "ort": "Speichersdorf"
    },
    {
        "code": "9276",
        "ort": "Bischofsgrün"
    },
    {
        "code": "9277",
        "ort": "Warmensteinach"
    },
    {
        "code": "9278",
        "ort": "Weidenberg"
    },
    {
        "code": "9279",
        "ort": "Mistelgau"
    },
    {
        "code": "9280",
        "ort": "Selbitz"
    },
    {
        "code": "9281",
        "ort": "Hof"
    },
    {
        "code": "9282",
        "ort": "Naila"
    },
    {
        "code": "9283",
        "ort": "Rehau"
    },
    {
        "code": "9284",
        "ort": "Schwarzenbach"
    },
    {
        "code": "9285",
        "ort": "Kirchenlamitz"
    },
    {
        "code": "9286",
        "ort": "Oberkotzau"
    },
    {
        "code": "9287",
        "ort": "Selb"
    },
    {
        "code": "9288",
        "ort": "Bad"
    },
    {
        "code": "9289",
        "ort": "Schwarzenbach"
    },
    {
        "code": "9290",
        "ort": "(not"
    },
    {
        "code": "9291",
        "ort": "(not"
    },
    {
        "code": "9292",
        "ort": "Konradsreuth"
    },
    {
        "code": "9293",
        "ort": "Berg"
    },
    {
        "code": "9294",
        "ort": "Regnitzlosau"
    },
    {
        "code": "9295",
        "ort": "Töpen"
    },
    {
        "code": "9296",
        "ort": "(not"
    },
    {
        "code": "9297",
        "ort": "(not"
    },
    {
        "code": "9298",
        "ort": "(not"
    },
    {
        "code": "9299",
        "ort": "(not"
    },
    {
        "code": "930\n9301",
        "ort": "(not"
    },
    {
        "code": "9301",
        "ort": "(not"
    },
    {
        "code": "9302",
        "ort": "Rottendorf"
    },
    {
        "code": "9303",
        "ort": "Eibelstadt"
    },
    {
        "code": "9304",
        "ort": "(not"
    },
    {
        "code": "9305",
        "ort": "Estenfeld"
    },
    {
        "code": "9306",
        "ort": "Kist"
    },
    {
        "code": "9307",
        "ort": "Altertheim"
    },
    {
        "code": "9308",
        "ort": "(not"
    },
    {
        "code": "9309",
        "ort": "(not"
    },
    {
        "code": "931",
        "ort": "Würzburg"
    },
    {
        "code": "932\n9321",
        "ort": "Kitzingen\n9322"
    },
    {
        "code": "9321",
        "ort": "Kitzingen"
    },
    {
        "code": "9322",
        "ort": "(not"
    },
    {
        "code": "9323",
        "ort": "Iphofen"
    },
    {
        "code": "9324",
        "ort": "Dettelbach"
    },
    {
        "code": "9325",
        "ort": "Kleinlangheim"
    },
    {
        "code": "9326",
        "ort": "Markt"
    },
    {
        "code": "9327",
        "ort": "(not"
    },
    {
        "code": "9328",
        "ort": "(not"
    },
    {
        "code": "9329",
        "ort": "(not"
    },
    {
        "code": "933\n9330",
        "ort": "(not"
    },
    {
        "code": "9330",
        "ort": "(not"
    },
    {
        "code": "9331",
        "ort": "Ochsenfurt"
    },
    {
        "code": "9332",
        "ort": "Marktbreit"
    },
    {
        "code": "9333",
        "ort": "Sommerhausen"
    },
    {
        "code": "9334",
        "ort": "Giebelstadt"
    },
    {
        "code": "9335",
        "ort": "Aub"
    },
    {
        "code": "9336",
        "ort": "Bütthard"
    },
    {
        "code": "9337",
        "ort": "Gaukönigshofen"
    },
    {
        "code": "9338",
        "ort": "Röttingen"
    },
    {
        "code": "9339",
        "ort": "Ippesheim"
    },
    {
        "code": "934\n9340",
        "ort": "Königheim-Brehmen\n9341"
    },
    {
        "code": "9340",
        "ort": "Königheim-Brehmen"
    },
    {
        "code": "9341",
        "ort": "Tauberbischofsheim"
    },
    {
        "code": "9342",
        "ort": "Wertheim"
    },
    {
        "code": "9343",
        "ort": "Lauda-Königshofen"
    },
    {
        "code": "9344",
        "ort": "Großrinderfeld-Gerchsheim"
    },
    {
        "code": "9345",
        "ort": "Külsheim"
    },
    {
        "code": "9346",
        "ort": "Grünsfeld"
    },
    {
        "code": "9347",
        "ort": "Wittighausen"
    },
    {
        "code": "9348",
        "ort": "Werbach-Gamburg"
    },
    {
        "code": "9349",
        "ort": "Werbach-Wenkheim"
    },
    {
        "code": "935\n9350",
        "ort": "Hundsbach"
    },
    {
        "code": "9350",
        "ort": "Hundsbach"
    },
    {
        "code": "9351",
        "ort": "Gemünden"
    },
    {
        "code": "9352",
        "ort": "Lohr"
    },
    {
        "code": "9353",
        "ort": "Karlstadt"
    },
    {
        "code": "9354",
        "ort": "Rieneck"
    },
    {
        "code": "9355",
        "ort": "Frammersbach"
    },
    {
        "code": "9356",
        "ort": "Burgsinn"
    },
    {
        "code": "9357",
        "ort": "Gräfendorf"
    },
    {
        "code": "9358",
        "ort": "Gössenheim"
    },
    {
        "code": "9359",
        "ort": "Wiesenfeld"
    },
    {
        "code": "936\n9360",
        "ort": "Thüngen"
    },
    {
        "code": "9360",
        "ort": "Thüngen"
    },
    {
        "code": "9361",
        "ort": "(not"
    },
    {
        "code": "9362",
        "ort": "(not"
    },
    {
        "code": "9363",
        "ort": "Arnstein"
    },
    {
        "code": "9364",
        "ort": "Zellingen"
    },
    {
        "code": "9365",
        "ort": "Rimpar"
    },
    {
        "code": "9366",
        "ort": "Geroldshausen"
    },
    {
        "code": "9367",
        "ort": "Unterpleichfeld"
    },
    {
        "code": "9368",
        "ort": "(not"
    },
    {
        "code": "9369",
        "ort": "Uettingen"
    },
    {
        "code": "937\n9370",
        "ort": "(not"
    },
    {
        "code": "9370",
        "ort": "(not"
    },
    {
        "code": "9371",
        "ort": "Miltenberg"
    },
    {
        "code": "9372",
        "ort": "Klingenberg"
    },
    {
        "code": "9373",
        "ort": "Amorbach"
    },
    {
        "code": "9374",
        "ort": "Eschau"
    },
    {
        "code": "9375",
        "ort": "Freudenberg"
    },
    {
        "code": "9376",
        "ort": "Collenberg"
    },
    {
        "code": "9377",
        "ort": "Freudenberg-Boxtal"
    },
    {
        "code": "9378",
        "ort": "Riedern"
    },
    {
        "code": "9379",
        "ort": "(not"
    },
    {
        "code": "938\n9380",
        "ort": "(not"
    },
    {
        "code": "9380",
        "ort": "(not"
    },
    {
        "code": "9381",
        "ort": "Volkach"
    },
    {
        "code": "9382",
        "ort": "Gerolzhofen"
    },
    {
        "code": "9383",
        "ort": "Wiesentheid"
    },
    {
        "code": "9384",
        "ort": "Schwanfeld"
    },
    {
        "code": "9385",
        "ort": "Kolitzheim"
    },
    {
        "code": "9386",
        "ort": "Prosselsheim"
    },
    {
        "code": "9387",
        "ort": "(not"
    },
    {
        "code": "9388",
        "ort": "(not"
    },
    {
        "code": "9389",
        "ort": "(not"
    },
    {
        "code": "939\n9390",
        "ort": "(not"
    },
    {
        "code": "9390",
        "ort": "(not"
    },
    {
        "code": "9391",
        "ort": "Marktheidenfeld"
    },
    {
        "code": "9392",
        "ort": "Faulbach"
    },
    {
        "code": "9393",
        "ort": "Rothenfels"
    },
    {
        "code": "9394",
        "ort": "Oberndorf"
    },
    {
        "code": "9395",
        "ort": "Homburg"
    },
    {
        "code": "9396",
        "ort": "Urspringen"
    },
    {
        "code": "9397",
        "ort": "Wertheim-Dertingen"
    },
    {
        "code": "9398",
        "ort": "Birkenfeld"
    },
    {
        "code": "9399",
        "ort": "(not"
    },
    {
        "code": "9301",
        "ort": "(not"
    },
    {
        "code": "9302",
        "ort": "Rottendorf"
    },
    {
        "code": "9303",
        "ort": "Eibelstadt"
    },
    {
        "code": "9304",
        "ort": "(not"
    },
    {
        "code": "9305",
        "ort": "Estenfeld"
    },
    {
        "code": "9306",
        "ort": "Kist"
    },
    {
        "code": "9307",
        "ort": "Altertheim"
    },
    {
        "code": "9308",
        "ort": "(not"
    },
    {
        "code": "9309",
        "ort": "(not"
    },
    {
        "code": "9321",
        "ort": "Kitzingen"
    },
    {
        "code": "9322",
        "ort": "(not"
    },
    {
        "code": "9323",
        "ort": "Iphofen"
    },
    {
        "code": "9324",
        "ort": "Dettelbach"
    },
    {
        "code": "9325",
        "ort": "Kleinlangheim"
    },
    {
        "code": "9326",
        "ort": "Markt"
    },
    {
        "code": "9327",
        "ort": "(not"
    },
    {
        "code": "9328",
        "ort": "(not"
    },
    {
        "code": "9329",
        "ort": "(not"
    },
    {
        "code": "9330",
        "ort": "(not"
    },
    {
        "code": "9331",
        "ort": "Ochsenfurt"
    },
    {
        "code": "9332",
        "ort": "Marktbreit"
    },
    {
        "code": "9333",
        "ort": "Sommerhausen"
    },
    {
        "code": "9334",
        "ort": "Giebelstadt"
    },
    {
        "code": "9335",
        "ort": "Aub"
    },
    {
        "code": "9336",
        "ort": "Bütthard"
    },
    {
        "code": "9337",
        "ort": "Gaukönigshofen"
    },
    {
        "code": "9338",
        "ort": "Röttingen"
    },
    {
        "code": "9339",
        "ort": "Ippesheim"
    },
    {
        "code": "9340",
        "ort": "Königheim-Brehmen"
    },
    {
        "code": "9341",
        "ort": "Tauberbischofsheim"
    },
    {
        "code": "9342",
        "ort": "Wertheim"
    },
    {
        "code": "9343",
        "ort": "Lauda-Königshofen"
    },
    {
        "code": "9344",
        "ort": "Großrinderfeld-Gerchsheim"
    },
    {
        "code": "9345",
        "ort": "Külsheim"
    },
    {
        "code": "9346",
        "ort": "Grünsfeld"
    },
    {
        "code": "9347",
        "ort": "Wittighausen"
    },
    {
        "code": "9348",
        "ort": "Werbach-Gamburg"
    },
    {
        "code": "9349",
        "ort": "Werbach-Wenkheim"
    },
    {
        "code": "9350",
        "ort": "Hundsbach"
    },
    {
        "code": "9351",
        "ort": "Gemünden"
    },
    {
        "code": "9352",
        "ort": "Lohr"
    },
    {
        "code": "9353",
        "ort": "Karlstadt"
    },
    {
        "code": "9354",
        "ort": "Rieneck"
    },
    {
        "code": "9355",
        "ort": "Frammersbach"
    },
    {
        "code": "9356",
        "ort": "Burgsinn"
    },
    {
        "code": "9357",
        "ort": "Gräfendorf"
    },
    {
        "code": "9358",
        "ort": "Gössenheim"
    },
    {
        "code": "9359",
        "ort": "Wiesenfeld"
    },
    {
        "code": "9360",
        "ort": "Thüngen"
    },
    {
        "code": "9361",
        "ort": "(not"
    },
    {
        "code": "9362",
        "ort": "(not"
    },
    {
        "code": "9363",
        "ort": "Arnstein"
    },
    {
        "code": "9364",
        "ort": "Zellingen"
    },
    {
        "code": "9365",
        "ort": "Rimpar"
    },
    {
        "code": "9366",
        "ort": "Geroldshausen"
    },
    {
        "code": "9367",
        "ort": "Unterpleichfeld"
    },
    {
        "code": "9368",
        "ort": "(not"
    },
    {
        "code": "9369",
        "ort": "Uettingen"
    },
    {
        "code": "9370",
        "ort": "(not"
    },
    {
        "code": "9371",
        "ort": "Miltenberg"
    },
    {
        "code": "9372",
        "ort": "Klingenberg"
    },
    {
        "code": "9373",
        "ort": "Amorbach"
    },
    {
        "code": "9374",
        "ort": "Eschau"
    },
    {
        "code": "9375",
        "ort": "Freudenberg"
    },
    {
        "code": "9376",
        "ort": "Collenberg"
    },
    {
        "code": "9377",
        "ort": "Freudenberg-Boxtal"
    },
    {
        "code": "9378",
        "ort": "Riedern"
    },
    {
        "code": "9379",
        "ort": "(not"
    },
    {
        "code": "9380",
        "ort": "(not"
    },
    {
        "code": "9381",
        "ort": "Volkach"
    },
    {
        "code": "9382",
        "ort": "Gerolzhofen"
    },
    {
        "code": "9383",
        "ort": "Wiesentheid"
    },
    {
        "code": "9384",
        "ort": "Schwanfeld"
    },
    {
        "code": "9385",
        "ort": "Kolitzheim"
    },
    {
        "code": "9386",
        "ort": "Prosselsheim"
    },
    {
        "code": "9387",
        "ort": "(not"
    },
    {
        "code": "9388",
        "ort": "(not"
    },
    {
        "code": "9389",
        "ort": "(not"
    },
    {
        "code": "9390",
        "ort": "(not"
    },
    {
        "code": "9391",
        "ort": "Marktheidenfeld"
    },
    {
        "code": "9392",
        "ort": "Faulbach"
    },
    {
        "code": "9393",
        "ort": "Rothenfels"
    },
    {
        "code": "9394",
        "ort": "Oberndorf"
    },
    {
        "code": "9395",
        "ort": "Homburg"
    },
    {
        "code": "9396",
        "ort": "Urspringen"
    },
    {
        "code": "9397",
        "ort": "Wertheim-Dertingen"
    },
    {
        "code": "9398",
        "ort": "Birkenfeld"
    },
    {
        "code": "9399",
        "ort": "(not"
    },
    {
        "code": "940\n9400",
        "ort": "(not"
    },
    {
        "code": "9400",
        "ort": "(not"
    },
    {
        "code": "9401",
        "ort": "Neutraubling"
    },
    {
        "code": "9402",
        "ort": "Regenstauf"
    },
    {
        "code": "9403",
        "ort": "Donaustauf"
    },
    {
        "code": "9404",
        "ort": "Nittendorf"
    },
    {
        "code": "9405",
        "ort": "Bad"
    },
    {
        "code": "9406",
        "ort": "Mintraching"
    },
    {
        "code": "9407",
        "ort": "Wenzenbach"
    },
    {
        "code": "9408",
        "ort": "Altenthann"
    },
    {
        "code": "9409",
        "ort": "Pielenhofen"
    },
    {
        "code": "941",
        "ort": "Regensburg"
    },
    {
        "code": "942\n9420",
        "ort": "Gundhöring\n9421"
    },
    {
        "code": "9420",
        "ort": "Gundhöring"
    },
    {
        "code": "9421",
        "ort": "Straubing"
    },
    {
        "code": "9422",
        "ort": "Bogen"
    },
    {
        "code": "9423",
        "ort": "Geiselhöring"
    },
    {
        "code": "9424",
        "ort": "Straßkirchen"
    },
    {
        "code": "9425",
        "ort": "(not"
    },
    {
        "code": "9426",
        "ort": "Oberschneiding"
    },
    {
        "code": "9427",
        "ort": "Leiblfing"
    },
    {
        "code": "9428",
        "ort": "Kirchroth"
    },
    {
        "code": "9429",
        "ort": "Rain"
    },
    {
        "code": "943\n9430",
        "ort": "(not"
    },
    {
        "code": "9430",
        "ort": "(not"
    },
    {
        "code": "9431",
        "ort": "Schwandorf"
    },
    {
        "code": "9432",
        "ort": "(not"
    },
    {
        "code": "9433",
        "ort": "Nabburg"
    },
    {
        "code": "9434",
        "ort": "Bodenwöhr"
    },
    {
        "code": "9435",
        "ort": "Schwarzenfeld"
    },
    {
        "code": "9436",
        "ort": "Nittenau"
    },
    {
        "code": "9437",
        "ort": "(not"
    },
    {
        "code": "9438",
        "ort": "Freihöls"
    },
    {
        "code": "9439",
        "ort": "Kemnath"
    },
    {
        "code": "944\n9440",
        "ort": "(not"
    },
    {
        "code": "9440",
        "ort": "(not"
    },
    {
        "code": "9441",
        "ort": "Kelheim"
    },
    {
        "code": "9442",
        "ort": "Riedenburg"
    },
    {
        "code": "9443",
        "ort": "Abensberg"
    },
    {
        "code": "9444",
        "ort": "Siegenburg"
    },
    {
        "code": "9445",
        "ort": "Neustadt"
    },
    {
        "code": "9446",
        "ort": "Altmannstein"
    },
    {
        "code": "9447",
        "ort": "Essing"
    },
    {
        "code": "9448",
        "ort": "Herrnwahlthann"
    },
    {
        "code": "9449",
        "ort": "(not"
    },
    {
        "code": "945\n9450",
        "ort": "(not"
    },
    {
        "code": "9450",
        "ort": "(not"
    },
    {
        "code": "9451",
        "ort": "Eggmühl"
    },
    {
        "code": "9452",
        "ort": "Langquaid"
    },
    {
        "code": "9453",
        "ort": "Thalmassing"
    },
    {
        "code": "9454",
        "ort": "Aufhausen"
    },
    {
        "code": "9455",
        "ort": "(not"
    },
    {
        "code": "9456",
        "ort": "(not"
    },
    {
        "code": "9457",
        "ort": "(not"
    },
    {
        "code": "9458",
        "ort": "(not"
    },
    {
        "code": "9459",
        "ort": "(not"
    },
    {
        "code": "946\n9460",
        "ort": "(not"
    },
    {
        "code": "9460",
        "ort": "(not"
    },
    {
        "code": "9461",
        "ort": "Roding"
    },
    {
        "code": "9462",
        "ort": "Falkenstein"
    },
    {
        "code": "9463",
        "ort": "Wald"
    },
    {
        "code": "9464",
        "ort": "Walderbach,"
    },
    {
        "code": "9465",
        "ort": "Neukirchen-Balbini"
    },
    {
        "code": "9466",
        "ort": "Stamsried"
    },
    {
        "code": "9467",
        "ort": "Michelsneukirchen"
    },
    {
        "code": "9468",
        "ort": "Zell"
    },
    {
        "code": "9469",
        "ort": "Neubäu"
    },
    {
        "code": "947\n9470",
        "ort": "(not"
    },
    {
        "code": "9470",
        "ort": "(not"
    },
    {
        "code": "9471",
        "ort": "Burglengenfeld"
    },
    {
        "code": "9472",
        "ort": "Hohenfels"
    },
    {
        "code": "9473",
        "ort": "Kallmünz"
    },
    {
        "code": "9474",
        "ort": "Schmidmühlen"
    },
    {
        "code": "9475",
        "ort": "(not"
    },
    {
        "code": "9476",
        "ort": "(not"
    },
    {
        "code": "9477",
        "ort": "(not"
    },
    {
        "code": "9478",
        "ort": "(not"
    },
    {
        "code": "9479",
        "ort": "(not"
    },
    {
        "code": "948\n9480",
        "ort": "Sünching\n9481"
    },
    {
        "code": "9480",
        "ort": "Sünching"
    },
    {
        "code": "9481",
        "ort": "Pfatter"
    },
    {
        "code": "9482",
        "ort": "Wörth"
    },
    {
        "code": "9483",
        "ort": "(not"
    },
    {
        "code": "9484",
        "ort": "Brennberg"
    },
    {
        "code": "9485",
        "ort": "(not"
    },
    {
        "code": "9486",
        "ort": "(not"
    },
    {
        "code": "9487",
        "ort": "(not"
    },
    {
        "code": "9488",
        "ort": "(not"
    },
    {
        "code": "9489",
        "ort": "(not"
    },
    {
        "code": "949\n9490",
        "ort": "(not"
    },
    {
        "code": "9490",
        "ort": "(not"
    },
    {
        "code": "9491",
        "ort": "Hemau"
    },
    {
        "code": "9492",
        "ort": "Parsberg"
    },
    {
        "code": "9493",
        "ort": "Beratzhausen"
    },
    {
        "code": "9494",
        "ort": "(not"
    },
    {
        "code": "9495",
        "ort": "Breitenbrunn"
    },
    {
        "code": "9496",
        "ort": "(not"
    },
    {
        "code": "9497",
        "ort": "Seubersdorf"
    },
    {
        "code": "9498",
        "ort": "Laaber"
    },
    {
        "code": "9499",
        "ort": "Painten"
    },
    {
        "code": "9400",
        "ort": "(not"
    },
    {
        "code": "9401",
        "ort": "Neutraubling"
    },
    {
        "code": "9402",
        "ort": "Regenstauf"
    },
    {
        "code": "9403",
        "ort": "Donaustauf"
    },
    {
        "code": "9404",
        "ort": "Nittendorf"
    },
    {
        "code": "9405",
        "ort": "Bad"
    },
    {
        "code": "9406",
        "ort": "Mintraching"
    },
    {
        "code": "9407",
        "ort": "Wenzenbach"
    },
    {
        "code": "9408",
        "ort": "Altenthann"
    },
    {
        "code": "9409",
        "ort": "Pielenhofen"
    },
    {
        "code": "9420",
        "ort": "Gundhöring"
    },
    {
        "code": "9421",
        "ort": "Straubing"
    },
    {
        "code": "9422",
        "ort": "Bogen"
    },
    {
        "code": "9423",
        "ort": "Geiselhöring"
    },
    {
        "code": "9424",
        "ort": "Straßkirchen"
    },
    {
        "code": "9425",
        "ort": "(not"
    },
    {
        "code": "9426",
        "ort": "Oberschneiding"
    },
    {
        "code": "9427",
        "ort": "Leiblfing"
    },
    {
        "code": "9428",
        "ort": "Kirchroth"
    },
    {
        "code": "9429",
        "ort": "Rain"
    },
    {
        "code": "9430",
        "ort": "(not"
    },
    {
        "code": "9431",
        "ort": "Schwandorf"
    },
    {
        "code": "9432",
        "ort": "(not"
    },
    {
        "code": "9433",
        "ort": "Nabburg"
    },
    {
        "code": "9434",
        "ort": "Bodenwöhr"
    },
    {
        "code": "9435",
        "ort": "Schwarzenfeld"
    },
    {
        "code": "9436",
        "ort": "Nittenau"
    },
    {
        "code": "9437",
        "ort": "(not"
    },
    {
        "code": "9438",
        "ort": "Freihöls"
    },
    {
        "code": "9439",
        "ort": "Kemnath"
    },
    {
        "code": "9440",
        "ort": "(not"
    },
    {
        "code": "9441",
        "ort": "Kelheim"
    },
    {
        "code": "9442",
        "ort": "Riedenburg"
    },
    {
        "code": "9443",
        "ort": "Abensberg"
    },
    {
        "code": "9444",
        "ort": "Siegenburg"
    },
    {
        "code": "9445",
        "ort": "Neustadt"
    },
    {
        "code": "9446",
        "ort": "Altmannstein"
    },
    {
        "code": "9447",
        "ort": "Essing"
    },
    {
        "code": "9448",
        "ort": "Herrnwahlthann"
    },
    {
        "code": "9449",
        "ort": "(not"
    },
    {
        "code": "9450",
        "ort": "(not"
    },
    {
        "code": "9451",
        "ort": "Eggmühl"
    },
    {
        "code": "9452",
        "ort": "Langquaid"
    },
    {
        "code": "9453",
        "ort": "Thalmassing"
    },
    {
        "code": "9454",
        "ort": "Aufhausen"
    },
    {
        "code": "9455",
        "ort": "(not"
    },
    {
        "code": "9456",
        "ort": "(not"
    },
    {
        "code": "9457",
        "ort": "(not"
    },
    {
        "code": "9458",
        "ort": "(not"
    },
    {
        "code": "9459",
        "ort": "(not"
    },
    {
        "code": "9460",
        "ort": "(not"
    },
    {
        "code": "9461",
        "ort": "Roding"
    },
    {
        "code": "9462",
        "ort": "Falkenstein"
    },
    {
        "code": "9463",
        "ort": "Wald"
    },
    {
        "code": "9464",
        "ort": "Walderbach,"
    },
    {
        "code": "9465",
        "ort": "Neukirchen-Balbini"
    },
    {
        "code": "9466",
        "ort": "Stamsried"
    },
    {
        "code": "9467",
        "ort": "Michelsneukirchen"
    },
    {
        "code": "9468",
        "ort": "Zell"
    },
    {
        "code": "9469",
        "ort": "Neubäu"
    },
    {
        "code": "9470",
        "ort": "(not"
    },
    {
        "code": "9471",
        "ort": "Burglengenfeld"
    },
    {
        "code": "9472",
        "ort": "Hohenfels"
    },
    {
        "code": "9473",
        "ort": "Kallmünz"
    },
    {
        "code": "9474",
        "ort": "Schmidmühlen"
    },
    {
        "code": "9475",
        "ort": "(not"
    },
    {
        "code": "9476",
        "ort": "(not"
    },
    {
        "code": "9477",
        "ort": "(not"
    },
    {
        "code": "9478",
        "ort": "(not"
    },
    {
        "code": "9479",
        "ort": "(not"
    },
    {
        "code": "9480",
        "ort": "Sünching"
    },
    {
        "code": "9481",
        "ort": "Pfatter"
    },
    {
        "code": "9482",
        "ort": "Wörth"
    },
    {
        "code": "9483",
        "ort": "(not"
    },
    {
        "code": "9484",
        "ort": "Brennberg"
    },
    {
        "code": "9485",
        "ort": "(not"
    },
    {
        "code": "9486",
        "ort": "(not"
    },
    {
        "code": "9487",
        "ort": "(not"
    },
    {
        "code": "9488",
        "ort": "(not"
    },
    {
        "code": "9489",
        "ort": "(not"
    },
    {
        "code": "9490",
        "ort": "(not"
    },
    {
        "code": "9491",
        "ort": "Hemau"
    },
    {
        "code": "9492",
        "ort": "Parsberg"
    },
    {
        "code": "9493",
        "ort": "Beratzhausen"
    },
    {
        "code": "9494",
        "ort": "(not"
    },
    {
        "code": "9495",
        "ort": "Breitenbrunn"
    },
    {
        "code": "9496",
        "ort": "(not"
    },
    {
        "code": "9497",
        "ort": "Seubersdorf"
    },
    {
        "code": "9498",
        "ort": "Laaber"
    },
    {
        "code": "9499",
        "ort": "Painten"
    },
    {
        "code": "950\n9500",
        "ort": "(not"
    },
    {
        "code": "9500",
        "ort": "(not"
    },
    {
        "code": "9501",
        "ort": "(not"
    },
    {
        "code": "9502",
        "ort": "Frensdorf"
    },
    {
        "code": "9503",
        "ort": "Oberhaid"
    },
    {
        "code": "9504",
        "ort": "Stadelhofen"
    },
    {
        "code": "9505",
        "ort": "Litzendorf"
    },
    {
        "code": "9506",
        "ort": "(not"
    },
    {
        "code": "9507",
        "ort": "(not"
    },
    {
        "code": "9508",
        "ort": "(not"
    },
    {
        "code": "9509",
        "ort": "(not"
    },
    {
        "code": "951",
        "ort": "Bamberg"
    },
    {
        "code": "952\n9521",
        "ort": "Haßfurt\n9523"
    },
    {
        "code": "9521",
        "ort": "Haßfurt"
    },
    {
        "code": "9523",
        "ort": "Hofheim"
    },
    {
        "code": "9524",
        "ort": "Zeil"
    },
    {
        "code": "9525",
        "ort": "Königsberg"
    },
    {
        "code": "9527",
        "ort": "Knetzgau"
    },
    {
        "code": "9528",
        "ort": "Donnersdorf"
    },
    {
        "code": "9529",
        "ort": "Oberaurach"
    },
    {
        "code": "953\n9531",
        "ort": "Ebern\n9532"
    },
    {
        "code": "9531",
        "ort": "Ebern"
    },
    {
        "code": "9532",
        "ort": "Maroldsweisach"
    },
    {
        "code": "9533",
        "ort": "Untermerzbach"
    },
    {
        "code": "9534",
        "ort": "Burgpreppach"
    },
    {
        "code": "9535",
        "ort": "Pfarrweisach"
    },
    {
        "code": "9536",
        "ort": "Kirchlauter"
    },
    {
        "code": "954\n9542",
        "ort": "Schesslitz\n9543"
    },
    {
        "code": "9542",
        "ort": "Schesslitz"
    },
    {
        "code": "9543",
        "ort": "Hirschaid"
    },
    {
        "code": "9544",
        "ort": "Baunach"
    },
    {
        "code": "9545",
        "ort": "Buttenheim"
    },
    {
        "code": "9546",
        "ort": "Burgebrach"
    },
    {
        "code": "9547",
        "ort": "Zapfendorf"
    },
    {
        "code": "9548",
        "ort": "Mühlhausen"
    },
    {
        "code": "9549",
        "ort": "Lisberg"
    },
    {
        "code": "955\n9551",
        "ort": "Burgwindheim\n9552"
    },
    {
        "code": "9551",
        "ort": "Burgwindheim"
    },
    {
        "code": "9552",
        "ort": "Burghaslach"
    },
    {
        "code": "9553",
        "ort": "Ebrach"
    },
    {
        "code": "9554",
        "ort": "Untersteinbach"
    },
    {
        "code": "9555",
        "ort": "Schlüsselfeld-Aschbach"
    },
    {
        "code": "9556",
        "ort": "Geiselwind"
    },
    {
        "code": "956\n9560",
        "ort": "Grub"
    },
    {
        "code": "9560",
        "ort": "Grub"
    },
    {
        "code": "9561",
        "ort": "Coburg"
    },
    {
        "code": "9562",
        "ort": "Sonnefeld"
    },
    {
        "code": "9563",
        "ort": "Rödental"
    },
    {
        "code": "9564",
        "ort": "Rodach"
    },
    {
        "code": "9565",
        "ort": "Untersiemau"
    },
    {
        "code": "9566",
        "ort": "Meeder"
    },
    {
        "code": "9567",
        "ort": "Sesslach-Gemünda"
    },
    {
        "code": "9568",
        "ort": "Neustadt"
    },
    {
        "code": "9569",
        "ort": "Sesslach"
    },
    {
        "code": "957\n9571",
        "ort": "Lichtenfels"
    },
    {
        "code": "9571",
        "ort": "Lichtenfels"
    },
    {
        "code": "9572",
        "ort": "Burgkunstadt"
    },
    {
        "code": "9573",
        "ort": "Staffelstein"
    },
    {
        "code": "9574",
        "ort": "Marktzeuln"
    },
    {
        "code": "9575",
        "ort": "Weismain"
    },
    {
        "code": "9576",
        "ort": "Lichtenfels-Isling"
    },
    {
        "code": "9500",
        "ort": "(not"
    },
    {
        "code": "9501",
        "ort": "(not"
    },
    {
        "code": "9502",
        "ort": "Frensdorf"
    },
    {
        "code": "9503",
        "ort": "Oberhaid"
    },
    {
        "code": "9504",
        "ort": "Stadelhofen"
    },
    {
        "code": "9505",
        "ort": "Litzendorf"
    },
    {
        "code": "9506",
        "ort": "(not"
    },
    {
        "code": "9507",
        "ort": "(not"
    },
    {
        "code": "9508",
        "ort": "(not"
    },
    {
        "code": "9509",
        "ort": "(not"
    },
    {
        "code": "9521",
        "ort": "Haßfurt"
    },
    {
        "code": "9523",
        "ort": "Hofheim"
    },
    {
        "code": "9524",
        "ort": "Zeil"
    },
    {
        "code": "9525",
        "ort": "Königsberg"
    },
    {
        "code": "9527",
        "ort": "Knetzgau"
    },
    {
        "code": "9528",
        "ort": "Donnersdorf"
    },
    {
        "code": "9529",
        "ort": "Oberaurach"
    },
    {
        "code": "9531",
        "ort": "Ebern"
    },
    {
        "code": "9532",
        "ort": "Maroldsweisach"
    },
    {
        "code": "9533",
        "ort": "Untermerzbach"
    },
    {
        "code": "9534",
        "ort": "Burgpreppach"
    },
    {
        "code": "9535",
        "ort": "Pfarrweisach"
    },
    {
        "code": "9536",
        "ort": "Kirchlauter"
    },
    {
        "code": "9542",
        "ort": "Schesslitz"
    },
    {
        "code": "9543",
        "ort": "Hirschaid"
    },
    {
        "code": "9544",
        "ort": "Baunach"
    },
    {
        "code": "9545",
        "ort": "Buttenheim"
    },
    {
        "code": "9546",
        "ort": "Burgebrach"
    },
    {
        "code": "9547",
        "ort": "Zapfendorf"
    },
    {
        "code": "9548",
        "ort": "Mühlhausen"
    },
    {
        "code": "9549",
        "ort": "Lisberg"
    },
    {
        "code": "9551",
        "ort": "Burgwindheim"
    },
    {
        "code": "9552",
        "ort": "Burghaslach"
    },
    {
        "code": "9553",
        "ort": "Ebrach"
    },
    {
        "code": "9554",
        "ort": "Untersteinbach"
    },
    {
        "code": "9555",
        "ort": "Schlüsselfeld-Aschbach"
    },
    {
        "code": "9556",
        "ort": "Geiselwind"
    },
    {
        "code": "9560",
        "ort": "Grub"
    },
    {
        "code": "9561",
        "ort": "Coburg"
    },
    {
        "code": "9562",
        "ort": "Sonnefeld"
    },
    {
        "code": "9563",
        "ort": "Rödental"
    },
    {
        "code": "9564",
        "ort": "Rodach"
    },
    {
        "code": "9565",
        "ort": "Untersiemau"
    },
    {
        "code": "9566",
        "ort": "Meeder"
    },
    {
        "code": "9567",
        "ort": "Sesslach-Gemünda"
    },
    {
        "code": "9568",
        "ort": "Neustadt"
    },
    {
        "code": "9569",
        "ort": "Sesslach"
    },
    {
        "code": "9571",
        "ort": "Lichtenfels"
    },
    {
        "code": "9572",
        "ort": "Burgkunstadt"
    },
    {
        "code": "9573",
        "ort": "Staffelstein"
    },
    {
        "code": "9574",
        "ort": "Marktzeuln"
    },
    {
        "code": "9575",
        "ort": "Weismain"
    },
    {
        "code": "9576",
        "ort": "Lichtenfels-Isling"
    },
    {
        "code": "960\n9602",
        "ort": "Neustadt"
    },
    {
        "code": "9602",
        "ort": "Neustadt"
    },
    {
        "code": "9603",
        "ort": "Floß"
    },
    {
        "code": "9604",
        "ort": "Wernberg-Köblitz"
    },
    {
        "code": "9605",
        "ort": "Weiherhammer"
    },
    {
        "code": "9606",
        "ort": "Pfreimd"
    },
    {
        "code": "9607",
        "ort": "Luhe-Wildenau"
    },
    {
        "code": "9608",
        "ort": "Kohlberg"
    },
    {
        "code": "961",
        "ort": "Weiden"
    },
    {
        "code": "962\n9621",
        "ort": "Amberg"
    },
    {
        "code": "9621",
        "ort": "Amberg"
    },
    {
        "code": "9622",
        "ort": "Hirschau"
    },
    {
        "code": "9624",
        "ort": "Ensdorf"
    },
    {
        "code": "9625",
        "ort": "Kastl"
    },
    {
        "code": "9626",
        "ort": "Hohenburg"
    },
    {
        "code": "9627",
        "ort": "Freudenberg"
    },
    {
        "code": "9628",
        "ort": "Ursensollen"
    },
    {
        "code": "963\n9631",
        "ort": "Tirschenreuth\n9632"
    },
    {
        "code": "9631",
        "ort": "Tirschenreuth"
    },
    {
        "code": "9632",
        "ort": "Waldsassen"
    },
    {
        "code": "9633",
        "ort": "Mitterteich"
    },
    {
        "code": "9634",
        "ort": "Wiesau"
    },
    {
        "code": "9635",
        "ort": "Bärnau"
    },
    {
        "code": "9636",
        "ort": "Plößberg"
    },
    {
        "code": "9637",
        "ort": "Falkenberg"
    },
    {
        "code": "9638",
        "ort": "Bad"
    },
    {
        "code": "9639",
        "ort": "Mähring"
    },
    {
        "code": "964\n9641",
        "ort": "Grafenwöhr\n9642"
    },
    {
        "code": "9641",
        "ort": "Grafenwöhr"
    },
    {
        "code": "9642",
        "ort": "Kemnath-Stadt"
    },
    {
        "code": "9643",
        "ort": "Auerbach"
    },
    {
        "code": "9644",
        "ort": "Pressath"
    },
    {
        "code": "9645",
        "ort": "Eschenbach"
    },
    {
        "code": "9646",
        "ort": "Freihung"
    },
    {
        "code": "9647",
        "ort": "Kirchenthumbach"
    },
    {
        "code": "9648",
        "ort": "Neustadt"
    },
    {
        "code": "965\n9651",
        "ort": "Vohenstrauß\n9652"
    },
    {
        "code": "9651",
        "ort": "Vohenstrauß"
    },
    {
        "code": "9652",
        "ort": "Waidhaus"
    },
    {
        "code": "9653",
        "ort": "Eslarn"
    },
    {
        "code": "9654",
        "ort": "Pleystein"
    },
    {
        "code": "9655",
        "ort": "Tännesberg"
    },
    {
        "code": "9656",
        "ort": "Moosbach"
    },
    {
        "code": "9657",
        "ort": "Waldthurn"
    },
    {
        "code": "9658",
        "ort": "Georgenberg"
    },
    {
        "code": "9659",
        "ort": "Leuchtenberg"
    },
    {
        "code": "966\n9661",
        "ort": "Sulzbach-Rosenberg\n9662"
    },
    {
        "code": "9661",
        "ort": "Sulzbach-Rosenberg"
    },
    {
        "code": "9662",
        "ort": "Vilseck"
    },
    {
        "code": "9663",
        "ort": "Neukirchen"
    },
    {
        "code": "9664",
        "ort": "Hahnbach"
    },
    {
        "code": "9665",
        "ort": "Königstein"
    },
    {
        "code": "9666",
        "ort": "Illschwang"
    },
    {
        "code": "967\n9671",
        "ort": "Oberviechtach\n9672"
    },
    {
        "code": "9671",
        "ort": "Oberviechtach"
    },
    {
        "code": "9672",
        "ort": "Neunburg"
    },
    {
        "code": "9673",
        "ort": "Tiefenbach"
    },
    {
        "code": "9674",
        "ort": "Schönsee"
    },
    {
        "code": "9675",
        "ort": "Altendorf"
    },
    {
        "code": "9676",
        "ort": "Winklarn"
    },
    {
        "code": "9677",
        "ort": "Oberviechtach-Pullenried"
    },
    {
        "code": "968\n9681",
        "ort": "Windischeschenbach\n9682"
    },
    {
        "code": "9681",
        "ort": "Windischeschenbach"
    },
    {
        "code": "9682",
        "ort": "Erbendorf"
    },
    {
        "code": "9683",
        "ort": "Friedenfels"
    },
    {
        "code": "9602",
        "ort": "Neustadt"
    },
    {
        "code": "9603",
        "ort": "Floß"
    },
    {
        "code": "9604",
        "ort": "Wernberg-Köblitz"
    },
    {
        "code": "9605",
        "ort": "Weiherhammer"
    },
    {
        "code": "9606",
        "ort": "Pfreimd"
    },
    {
        "code": "9607",
        "ort": "Luhe-Wildenau"
    },
    {
        "code": "9608",
        "ort": "Kohlberg"
    },
    {
        "code": "9621",
        "ort": "Amberg"
    },
    {
        "code": "9622",
        "ort": "Hirschau"
    },
    {
        "code": "9624",
        "ort": "Ensdorf"
    },
    {
        "code": "9625",
        "ort": "Kastl"
    },
    {
        "code": "9626",
        "ort": "Hohenburg"
    },
    {
        "code": "9627",
        "ort": "Freudenberg"
    },
    {
        "code": "9628",
        "ort": "Ursensollen"
    },
    {
        "code": "9631",
        "ort": "Tirschenreuth"
    },
    {
        "code": "9632",
        "ort": "Waldsassen"
    },
    {
        "code": "9633",
        "ort": "Mitterteich"
    },
    {
        "code": "9634",
        "ort": "Wiesau"
    },
    {
        "code": "9635",
        "ort": "Bärnau"
    },
    {
        "code": "9636",
        "ort": "Plößberg"
    },
    {
        "code": "9637",
        "ort": "Falkenberg"
    },
    {
        "code": "9638",
        "ort": "Bad"
    },
    {
        "code": "9639",
        "ort": "Mähring"
    },
    {
        "code": "9641",
        "ort": "Grafenwöhr"
    },
    {
        "code": "9642",
        "ort": "Kemnath-Stadt"
    },
    {
        "code": "9643",
        "ort": "Auerbach"
    },
    {
        "code": "9644",
        "ort": "Pressath"
    },
    {
        "code": "9645",
        "ort": "Eschenbach"
    },
    {
        "code": "9646",
        "ort": "Freihung"
    },
    {
        "code": "9647",
        "ort": "Kirchenthumbach"
    },
    {
        "code": "9648",
        "ort": "Neustadt"
    },
    {
        "code": "9651",
        "ort": "Vohenstrauß"
    },
    {
        "code": "9652",
        "ort": "Waidhaus"
    },
    {
        "code": "9653",
        "ort": "Eslarn"
    },
    {
        "code": "9654",
        "ort": "Pleystein"
    },
    {
        "code": "9655",
        "ort": "Tännesberg"
    },
    {
        "code": "9656",
        "ort": "Moosbach"
    },
    {
        "code": "9657",
        "ort": "Waldthurn"
    },
    {
        "code": "9658",
        "ort": "Georgenberg"
    },
    {
        "code": "9659",
        "ort": "Leuchtenberg"
    },
    {
        "code": "9661",
        "ort": "Sulzbach-Rosenberg"
    },
    {
        "code": "9662",
        "ort": "Vilseck"
    },
    {
        "code": "9663",
        "ort": "Neukirchen"
    },
    {
        "code": "9664",
        "ort": "Hahnbach"
    },
    {
        "code": "9665",
        "ort": "Königstein"
    },
    {
        "code": "9666",
        "ort": "Illschwang"
    },
    {
        "code": "9671",
        "ort": "Oberviechtach"
    },
    {
        "code": "9672",
        "ort": "Neunburg"
    },
    {
        "code": "9673",
        "ort": "Tiefenbach"
    },
    {
        "code": "9674",
        "ort": "Schönsee"
    },
    {
        "code": "9675",
        "ort": "Altendorf"
    },
    {
        "code": "9676",
        "ort": "Winklarn"
    },
    {
        "code": "9677",
        "ort": "Oberviechtach-Pullenried"
    },
    {
        "code": "9681",
        "ort": "Windischeschenbach"
    },
    {
        "code": "9682",
        "ort": "Erbendorf"
    },
    {
        "code": "9683",
        "ort": "Friedenfels"
    },
    {
        "code": "970\n9701",
        "ort": "Sandberg"
    },
    {
        "code": "9701",
        "ort": "Sandberg"
    },
    {
        "code": "9704",
        "ort": "Euerdorf"
    },
    {
        "code": "9708",
        "ort": "Bad"
    },
    {
        "code": "971",
        "ort": "Bad"
    },
    {
        "code": "972\n9720",
        "ort": "Üchtelhausen\n9721"
    },
    {
        "code": "9720",
        "ort": "Üchtelhausen"
    },
    {
        "code": "9721",
        "ort": "Schweinfurt"
    },
    {
        "code": "9722",
        "ort": "Werneck"
    },
    {
        "code": "9723",
        "ort": "Röthlein"
    },
    {
        "code": "9724",
        "ort": "Stadtlauringen"
    },
    {
        "code": "9725",
        "ort": "Poppenhausen"
    },
    {
        "code": "9726",
        "ort": "Euerbach"
    },
    {
        "code": "9727",
        "ort": "Schonungen-Marktsteinach"
    },
    {
        "code": "9728",
        "ort": "Wülfershausen"
    },
    {
        "code": "9729",
        "ort": "Grettstadt"
    },
    {
        "code": "973\n9732",
        "ort": "Hammelburg\n9733"
    },
    {
        "code": "9732",
        "ort": "Hammelburg"
    },
    {
        "code": "9733",
        "ort": "Münnerstadt"
    },
    {
        "code": "9734",
        "ort": "Burkardroth"
    },
    {
        "code": "9735",
        "ort": "Massbach"
    },
    {
        "code": "9736",
        "ort": "Oberthulba"
    },
    {
        "code": "9737",
        "ort": "Wartmannsroth"
    },
    {
        "code": "9738",
        "ort": "Rottershausen"
    },
    {
        "code": "974\n9741",
        "ort": "Bad"
    },
    {
        "code": "9741",
        "ort": "Bad"
    },
    {
        "code": "9742",
        "ort": "Kalbach"
    },
    {
        "code": "9744",
        "ort": "Zeitlofs-Detter"
    },
    {
        "code": "9745",
        "ort": "Wildflecken"
    },
    {
        "code": "9746",
        "ort": "Zeitlofs"
    },
    {
        "code": "9747",
        "ort": "Geroda"
    },
    {
        "code": "9748",
        "ort": "Motten"
    },
    {
        "code": "9749",
        "ort": "Oberbach"
    },
    {
        "code": "976\n9761",
        "ort": "Bad"
    },
    {
        "code": "9761",
        "ort": "Bad"
    },
    {
        "code": "9762",
        "ort": "Saal"
    },
    {
        "code": "9763",
        "ort": "Sulzdorf"
    },
    {
        "code": "9764",
        "ort": "Höchheim"
    },
    {
        "code": "9765",
        "ort": "Trappstadt"
    },
    {
        "code": "9766",
        "ort": "Grosswenkheim"
    },
    {
        "code": "977\n9771",
        "ort": "Bad"
    },
    {
        "code": "9771",
        "ort": "Bad"
    },
    {
        "code": "9772",
        "ort": "Bischofsheim"
    },
    {
        "code": "9773",
        "ort": "Unsleben"
    },
    {
        "code": "9774",
        "ort": "Oberelsbach"
    },
    {
        "code": "9775",
        "ort": "Schönau"
    },
    {
        "code": "9776",
        "ort": "Mellrichstadt"
    },
    {
        "code": "9777",
        "ort": "Ostheim"
    },
    {
        "code": "9778",
        "ort": "Fladungen"
    },
    {
        "code": "9779",
        "ort": "Nordheim"
    },
    {
        "code": "9701",
        "ort": "Sandberg"
    },
    {
        "code": "9704",
        "ort": "Euerdorf"
    },
    {
        "code": "9708",
        "ort": "Bad"
    },
    {
        "code": "9720",
        "ort": "Üchtelhausen"
    },
    {
        "code": "9721",
        "ort": "Schweinfurt"
    },
    {
        "code": "9722",
        "ort": "Werneck"
    },
    {
        "code": "9723",
        "ort": "Röthlein"
    },
    {
        "code": "9724",
        "ort": "Stadtlauringen"
    },
    {
        "code": "9725",
        "ort": "Poppenhausen"
    },
    {
        "code": "9726",
        "ort": "Euerbach"
    },
    {
        "code": "9727",
        "ort": "Schonungen-Marktsteinach"
    },
    {
        "code": "9728",
        "ort": "Wülfershausen"
    },
    {
        "code": "9729",
        "ort": "Grettstadt"
    },
    {
        "code": "9732",
        "ort": "Hammelburg"
    },
    {
        "code": "9733",
        "ort": "Münnerstadt"
    },
    {
        "code": "9734",
        "ort": "Burkardroth"
    },
    {
        "code": "9735",
        "ort": "Massbach"
    },
    {
        "code": "9736",
        "ort": "Oberthulba"
    },
    {
        "code": "9737",
        "ort": "Wartmannsroth"
    },
    {
        "code": "9738",
        "ort": "Rottershausen"
    },
    {
        "code": "9741",
        "ort": "Bad"
    },
    {
        "code": "9742",
        "ort": "Kalbach"
    },
    {
        "code": "9744",
        "ort": "Zeitlofs-Detter"
    },
    {
        "code": "9745",
        "ort": "Wildflecken"
    },
    {
        "code": "9746",
        "ort": "Zeitlofs"
    },
    {
        "code": "9747",
        "ort": "Geroda"
    },
    {
        "code": "9748",
        "ort": "Motten"
    },
    {
        "code": "9749",
        "ort": "Oberbach"
    },
    {
        "code": "9761",
        "ort": "Bad"
    },
    {
        "code": "9762",
        "ort": "Saal"
    },
    {
        "code": "9763",
        "ort": "Sulzdorf"
    },
    {
        "code": "9764",
        "ort": "Höchheim"
    },
    {
        "code": "9765",
        "ort": "Trappstadt"
    },
    {
        "code": "9766",
        "ort": "Grosswenkheim"
    },
    {
        "code": "9771",
        "ort": "Bad"
    },
    {
        "code": "9772",
        "ort": "Bischofsheim"
    },
    {
        "code": "9773",
        "ort": "Unsleben"
    },
    {
        "code": "9774",
        "ort": "Oberelsbach"
    },
    {
        "code": "9775",
        "ort": "Schönau"
    },
    {
        "code": "9776",
        "ort": "Mellrichstadt"
    },
    {
        "code": "9777",
        "ort": "Ostheim"
    },
    {
        "code": "9778",
        "ort": "Fladungen"
    },
    {
        "code": "9779",
        "ort": "Nordheim"
    },
    {
        "code": "980\n9802",
        "ort": "Ansbach-Katterbach\n9803"
    },
    {
        "code": "9802",
        "ort": "Ansbach-Katterbach"
    },
    {
        "code": "9803",
        "ort": "Colmberg"
    },
    {
        "code": "9804",
        "ort": "Aurach"
    },
    {
        "code": "9805",
        "ort": "Burgoberbach"
    },
    {
        "code": "981",
        "ort": "Ansbach"
    },
    {
        "code": "982\n9820",
        "ort": "Lehrberg\n9822"
    },
    {
        "code": "9820",
        "ort": "Lehrberg"
    },
    {
        "code": "9822",
        "ort": "Bechhofen"
    },
    {
        "code": "9823",
        "ort": "Leutershausen"
    },
    {
        "code": "9824",
        "ort": "Dietenhofen"
    },
    {
        "code": "9825",
        "ort": "Herrieden"
    },
    {
        "code": "9826",
        "ort": "Weidenbach"
    },
    {
        "code": "9827",
        "ort": "Lichtenau"
    },
    {
        "code": "9828",
        "ort": "Rügland"
    },
    {
        "code": "9829",
        "ort": "Flachslanden"
    },
    {
        "code": "983\n9831",
        "ort": "Gunzenhausen\n9832"
    },
    {
        "code": "9831",
        "ort": "Gunzenhausen"
    },
    {
        "code": "9832",
        "ort": "Wassertrüdingen"
    },
    {
        "code": "9833",
        "ort": "Heidenheim"
    },
    {
        "code": "9834",
        "ort": "Theilenhofen"
    },
    {
        "code": "9836",
        "ort": "Gunzenhausen-Cronheim"
    },
    {
        "code": "9837",
        "ort": "Haundorf"
    },
    {
        "code": "984\n9841",
        "ort": "Bad"
    },
    {
        "code": "9841",
        "ort": "Bad"
    },
    {
        "code": "9842",
        "ort": "Uffenheim"
    },
    {
        "code": "9843",
        "ort": "Burgbernheim"
    },
    {
        "code": "9844",
        "ort": "Obernzenn"
    },
    {
        "code": "9845",
        "ort": "Oberdachstetten"
    },
    {
        "code": "9846",
        "ort": "Ipsheim"
    },
    {
        "code": "9847",
        "ort": "Ergersheim"
    },
    {
        "code": "9848",
        "ort": "Simmershofen"
    },
    {
        "code": "985\n9851",
        "ort": "Dinkelsbühl\n9852"
    },
    {
        "code": "9851",
        "ort": "Dinkelsbühl"
    },
    {
        "code": "9852",
        "ort": "Feuchtwangen"
    },
    {
        "code": "9853",
        "ort": "Wilburgstetten"
    },
    {
        "code": "9854",
        "ort": "Wittelshofen"
    },
    {
        "code": "9855",
        "ort": "Dentlein"
    },
    {
        "code": "9856",
        "ort": "Dürrwangen"
    },
    {
        "code": "9857",
        "ort": "Schopfloch"
    },
    {
        "code": "986\n9861",
        "ort": "Rothenburg"
    },
    {
        "code": "9861",
        "ort": "Rothenburg"
    },
    {
        "code": "9865",
        "ort": "Adelshofen"
    },
    {
        "code": "9867",
        "ort": "Geslau"
    },
    {
        "code": "9868",
        "ort": "Schillingsfürst"
    },
    {
        "code": "9869",
        "ort": "Wettringen"
    },
    {
        "code": "987\n9871",
        "ort": "Windsbach\n9872"
    },
    {
        "code": "9871",
        "ort": "Windsbach"
    },
    {
        "code": "9872",
        "ort": "Heilsbronn"
    },
    {
        "code": "9873",
        "ort": "Abenberg-Wassermungenau"
    },
    {
        "code": "9874",
        "ort": "Neuendettelsau"
    },
    {
        "code": "9875",
        "ort": "Wolframs-Eschenbach"
    },
    {
        "code": "9876",
        "ort": "Rohr"
    },
    {
        "code": "9802",
        "ort": "Ansbach-Katterbach"
    },
    {
        "code": "9803",
        "ort": "Colmberg"
    },
    {
        "code": "9804",
        "ort": "Aurach"
    },
    {
        "code": "9805",
        "ort": "Burgoberbach"
    },
    {
        "code": "9820",
        "ort": "Lehrberg"
    },
    {
        "code": "9822",
        "ort": "Bechhofen"
    },
    {
        "code": "9823",
        "ort": "Leutershausen"
    },
    {
        "code": "9824",
        "ort": "Dietenhofen"
    },
    {
        "code": "9825",
        "ort": "Herrieden"
    },
    {
        "code": "9826",
        "ort": "Weidenbach"
    },
    {
        "code": "9827",
        "ort": "Lichtenau"
    },
    {
        "code": "9828",
        "ort": "Rügland"
    },
    {
        "code": "9829",
        "ort": "Flachslanden"
    },
    {
        "code": "9831",
        "ort": "Gunzenhausen"
    },
    {
        "code": "9832",
        "ort": "Wassertrüdingen"
    },
    {
        "code": "9833",
        "ort": "Heidenheim"
    },
    {
        "code": "9834",
        "ort": "Theilenhofen"
    },
    {
        "code": "9836",
        "ort": "Gunzenhausen-Cronheim"
    },
    {
        "code": "9837",
        "ort": "Haundorf"
    },
    {
        "code": "9841",
        "ort": "Bad"
    },
    {
        "code": "9842",
        "ort": "Uffenheim"
    },
    {
        "code": "9843",
        "ort": "Burgbernheim"
    },
    {
        "code": "9844",
        "ort": "Obernzenn"
    },
    {
        "code": "9845",
        "ort": "Oberdachstetten"
    },
    {
        "code": "9846",
        "ort": "Ipsheim"
    },
    {
        "code": "9847",
        "ort": "Ergersheim"
    },
    {
        "code": "9848",
        "ort": "Simmershofen"
    },
    {
        "code": "9851",
        "ort": "Dinkelsbühl"
    },
    {
        "code": "9852",
        "ort": "Feuchtwangen"
    },
    {
        "code": "9853",
        "ort": "Wilburgstetten"
    },
    {
        "code": "9854",
        "ort": "Wittelshofen"
    },
    {
        "code": "9855",
        "ort": "Dentlein"
    },
    {
        "code": "9856",
        "ort": "Dürrwangen"
    },
    {
        "code": "9857",
        "ort": "Schopfloch"
    },
    {
        "code": "9861",
        "ort": "Rothenburg"
    },
    {
        "code": "9865",
        "ort": "Adelshofen"
    },
    {
        "code": "9867",
        "ort": "Geslau"
    },
    {
        "code": "9868",
        "ort": "Schillingsfürst"
    },
    {
        "code": "9869",
        "ort": "Wettringen"
    },
    {
        "code": "9871",
        "ort": "Windsbach"
    },
    {
        "code": "9872",
        "ort": "Heilsbronn"
    },
    {
        "code": "9873",
        "ort": "Abenberg-Wassermungenau"
    },
    {
        "code": "9874",
        "ort": "Neuendettelsau"
    },
    {
        "code": "9875",
        "ort": "Wolframs-Eschenbach"
    },
    {
        "code": "9876",
        "ort": "Rohr"
    },
    {
        "code": "990\n9901",
        "ort": "Hengersberg\n9903"
    },
    {
        "code": "9901",
        "ort": "Hengersberg"
    },
    {
        "code": "9903",
        "ort": "Schöllnach"
    },
    {
        "code": "9904",
        "ort": "Lalling"
    },
    {
        "code": "9905",
        "ort": "Bernried"
    },
    {
        "code": "9906",
        "ort": "Mariaposching"
    },
    {
        "code": "9907",
        "ort": "Zenting"
    },
    {
        "code": "9908",
        "ort": "Schöfweg"
    },
    {
        "code": "991",
        "ort": "Deggendorf"
    },
    {
        "code": "992\n9920",
        "ort": "Bischofsmais\n9921"
    },
    {
        "code": "9920",
        "ort": "Bischofsmais"
    },
    {
        "code": "9921",
        "ort": "Regen"
    },
    {
        "code": "9922",
        "ort": "Zwiesel"
    },
    {
        "code": "9923",
        "ort": "Teisnach"
    },
    {
        "code": "9924",
        "ort": "Bodenmais"
    },
    {
        "code": "9925",
        "ort": "Bayerisch"
    },
    {
        "code": "9926",
        "ort": "Frauenau"
    },
    {
        "code": "9927",
        "ort": "Kirchberg"
    },
    {
        "code": "9928",
        "ort": "Kirchdorf"
    },
    {
        "code": "9929",
        "ort": "Ruhmannsfelden"
    },
    {
        "code": "993\n9931",
        "ort": "Plattling\n9932"
    },
    {
        "code": "9931",
        "ort": "Plattling"
    },
    {
        "code": "9932",
        "ort": "Osterhofen"
    },
    {
        "code": "9933",
        "ort": "Wallersdorf"
    },
    {
        "code": "9935",
        "ort": "Stephansposching"
    },
    {
        "code": "9936",
        "ort": "Wallerfing"
    },
    {
        "code": "9937",
        "ort": "Oberpöring"
    },
    {
        "code": "9938",
        "ort": "Moos"
    },
    {
        "code": "994\n9941",
        "ort": "Bad"
    },
    {
        "code": "9941",
        "ort": "Bad"
    },
    {
        "code": "9942",
        "ort": "Viechtach"
    },
    {
        "code": "9943",
        "ort": "Lam"
    },
    {
        "code": "9944",
        "ort": "Miltach"
    },
    {
        "code": "9945",
        "ort": "Arnbruck"
    },
    {
        "code": "9946",
        "ort": "Hohenwarth"
    },
    {
        "code": "9947",
        "ort": "Neukirchen"
    },
    {
        "code": "9948",
        "ort": "Eschlkam"
    },
    {
        "code": "995\n9951",
        "ort": "Landau"
    },
    {
        "code": "9951",
        "ort": "Landau"
    },
    {
        "code": "9952",
        "ort": "Eichendorf"
    },
    {
        "code": "9953",
        "ort": "Pilsting"
    },
    {
        "code": "9954",
        "ort": "Simbach"
    },
    {
        "code": "9955",
        "ort": "Mamming"
    },
    {
        "code": "996\n9961",
        "ort": "Mitterfels\n9962"
    },
    {
        "code": "9961",
        "ort": "Mitterfels"
    },
    {
        "code": "9962",
        "ort": "Schwarzach"
    },
    {
        "code": "9963",
        "ort": "Konzell"
    },
    {
        "code": "9964",
        "ort": "Stallwang"
    },
    {
        "code": "9965",
        "ort": "Sankt"
    },
    {
        "code": "9966",
        "ort": "Wiesenfelden"
    },
    {
        "code": "997\n9971",
        "ort": "Cham\n9972"
    },
    {
        "code": "9971",
        "ort": "Cham"
    },
    {
        "code": "9972",
        "ort": "Waldmünchen"
    },
    {
        "code": "9973",
        "ort": "Furth"
    },
    {
        "code": "9974",
        "ort": "Traitsching"
    },
    {
        "code": "9975",
        "ort": "Waldmünchen-Geigant"
    },
    {
        "code": "9976",
        "ort": "Rötz"
    },
    {
        "code": "9977",
        "ort": "Arnschwang"
    },
    {
        "code": "9978",
        "ort": "Schönthal"
    },
    {
        "code": "9901",
        "ort": "Hengersberg"
    },
    {
        "code": "9903",
        "ort": "Schöllnach"
    },
    {
        "code": "9904",
        "ort": "Lalling"
    },
    {
        "code": "9905",
        "ort": "Bernried"
    },
    {
        "code": "9906",
        "ort": "Mariaposching"
    },
    {
        "code": "9907",
        "ort": "Zenting"
    },
    {
        "code": "9908",
        "ort": "Schöfweg"
    },
    {
        "code": "9920",
        "ort": "Bischofsmais"
    },
    {
        "code": "9921",
        "ort": "Regen"
    },
    {
        "code": "9922",
        "ort": "Zwiesel"
    },
    {
        "code": "9923",
        "ort": "Teisnach"
    },
    {
        "code": "9924",
        "ort": "Bodenmais"
    },
    {
        "code": "9925",
        "ort": "Bayerisch"
    },
    {
        "code": "9926",
        "ort": "Frauenau"
    },
    {
        "code": "9927",
        "ort": "Kirchberg"
    },
    {
        "code": "9928",
        "ort": "Kirchdorf"
    },
    {
        "code": "9929",
        "ort": "Ruhmannsfelden"
    },
    {
        "code": "9931",
        "ort": "Plattling"
    },
    {
        "code": "9932",
        "ort": "Osterhofen"
    },
    {
        "code": "9933",
        "ort": "Wallersdorf"
    },
    {
        "code": "9935",
        "ort": "Stephansposching"
    },
    {
        "code": "9936",
        "ort": "Wallerfing"
    },
    {
        "code": "9937",
        "ort": "Oberpöring"
    },
    {
        "code": "9938",
        "ort": "Moos"
    },
    {
        "code": "9941",
        "ort": "Bad"
    },
    {
        "code": "9942",
        "ort": "Viechtach"
    },
    {
        "code": "9943",
        "ort": "Lam"
    },
    {
        "code": "9944",
        "ort": "Miltach"
    },
    {
        "code": "9945",
        "ort": "Arnbruck"
    },
    {
        "code": "9946",
        "ort": "Hohenwarth"
    },
    {
        "code": "9947",
        "ort": "Neukirchen"
    },
    {
        "code": "9948",
        "ort": "Eschlkam"
    },
    {
        "code": "9951",
        "ort": "Landau"
    },
    {
        "code": "9952",
        "ort": "Eichendorf"
    },
    {
        "code": "9953",
        "ort": "Pilsting"
    },
    {
        "code": "9954",
        "ort": "Simbach"
    },
    {
        "code": "9955",
        "ort": "Mamming"
    },
    {
        "code": "9961",
        "ort": "Mitterfels"
    },
    {
        "code": "9962",
        "ort": "Schwarzach"
    },
    {
        "code": "9963",
        "ort": "Konzell"
    },
    {
        "code": "9964",
        "ort": "Stallwang"
    },
    {
        "code": "9965",
        "ort": "Sankt"
    },
    {
        "code": "9966",
        "ort": "Wiesenfelden"
    },
    {
        "code": "9971",
        "ort": "Cham"
    },
    {
        "code": "9972",
        "ort": "Waldmünchen"
    },
    {
        "code": "9973",
        "ort": "Furth"
    },
    {
        "code": "9974",
        "ort": "Traitsching"
    },
    {
        "code": "9975",
        "ort": "Waldmünchen-Geigant"
    },
    {
        "code": "9976",
        "ort": "Rötz"
    },
    {
        "code": "9977",
        "ort": "Arnschwang"
    },
    {
        "code": "9978",
        "ort": "Schönthal"
    },
    {
        "code": "Telephone",
        "ort": "numbers"
    },
    {
        "code": "ITU",
        "ort": "allocations"
    },
    {
        "code": "Map",
        "ort": "with"
    },
    {
        "code": "v"
    },
    {
        "code": "t"
    },
    {
        "code": "e"
    },
    {
        "code": "Albania"
    },
    {
        "code": "Andorra"
    },
    {
        "code": "Armenia"
    },
    {
        "code": "Austria"
    },
    {
        "code": "Azerbaijan"
    },
    {
        "code": "Belarus"
    },
    {
        "code": "Belgium"
    },
    {
        "code": "Bosnia",
        "ort": "and"
    },
    {
        "code": "Bulgaria"
    },
    {
        "code": "Croatia"
    },
    {
        "code": "Cyprus"
    },
    {
        "code": "Czech",
        "ort": "Republic"
    },
    {
        "code": "Denmark"
    },
    {
        "code": "Estonia"
    },
    {
        "code": "Finland"
    },
    {
        "code": "France"
    },
    {
        "code": "Georgia"
    },
    {
        "code": "Germany"
    },
    {
        "code": "Greece"
    },
    {
        "code": "Hungary"
    },
    {
        "code": "Iceland"
    },
    {
        "code": "Ireland"
    },
    {
        "code": ""
    },
    {
        "code": "Italy"
    },
    {
        "code": "Kazakhstan"
    },
    {
        "code": "Latvia"
    },
    {
        "code": "Liechtenstein"
    },
    {
        "code": "Lithuania"
    },
    {
        "code": "Luxembourg"
    },
    {
        "code": "Malta"
    },
    {
        "code": "Moldova"
    },
    {
        "code": "Monaco"
    },
    {
        "code": "Montenegro"
    },
    {
        "code": "Netherlands"
    },
    {
        "code": "North",
        "ort": "Macedonia"
    },
    {
        "code": "Norway"
    },
    {
        "code": "Poland"
    },
    {
        "code": "Portugal"
    },
    {
        "code": "Romania"
    },
    {
        "code": "Russia"
    },
    {
        "code": "San",
        "ort": "Marino"
    },
    {
        "code": "Serbia"
    },
    {
        "code": "Slovakia"
    },
    {
        "code": "Slovenia"
    },
    {
        "code": "Spain"
    },
    {
        "code": "Sweden"
    },
    {
        "code": "Switzerland"
    },
    {
        "code": "Turkey"
    },
    {
        "code": "Ukraine"
    },
    {
        "code": "United",
        "ort": "Kingdom"
    },
    {
        "code": "Vatican",
        "ort": "City"
    },
    {
        "code": "Abkhazia"
    },
    {
        "code": "Artsakh"
    },
    {
        "code": "Kosovo"
    },
    {
        "code": "Northern",
        "ort": "Cyprus"
    },
    {
        "code": "South",
        "ort": "Ossetia"
    },
    {
        "code": "Transnistria"
    },
    {
        "code": "Åland"
    },
    {
        "code": "Faroe",
        "ort": "Islands"
    },
    {
        "code": "Gibraltar"
    },
    {
        "code": "Guernsey"
    },
    {
        "code": "Isle",
        "ort": "of"
    },
    {
        "code": "Jersey"
    },
    {
        "code": "Svalbard"
    }
];