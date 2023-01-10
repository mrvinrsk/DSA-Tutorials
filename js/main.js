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
});
