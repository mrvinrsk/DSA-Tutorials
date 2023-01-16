// Needs jQuery
function updateAccordions() {
    document.querySelectorAll(".accordion").forEach((accordion) => {
        updateAccordion(accordion);
    });
}

function updateAccordion(accordion) {
    let span = accordion.querySelector("span");

    if (accordion.hasAttribute("data-opened") && accordion.hasAttribute("data-closed")) {
        if (accordion.classList.contains("active")) {
            span.innerHTML = accordion.dataset.opened || "Schließen";
        } else {
            span.innerHTML = accordion.dataset.closed || "Öffnen";
        }
    }
}

$(function () {
    document.querySelectorAll(".accordion").forEach((accordion) => {
        accordion.addEventListener("click", () => {
            let parent = accordion.parentElement;

            if (parent.classList.contains("accordions")) {
                if (parent.hasAttribute("data-close-others")) {
                    parent.querySelectorAll(".accordion").forEach((el) => {
                        if (el !== accordion) el.classList.remove("active");
                        updateAccordion(el);
                    });
                }
            }

            accordion.classList.toggle("active");
            updateAccordion(accordion);

            if (accordion.classList.contains("active")) {
                setTimeout(() => {
                    if (!isVisibleByPercentage(accordion.querySelector("div"), 100)) {
                        scrollToElement(accordion.querySelector("div"));
                    } else {
                        console.log("Already visible");
                    }
                }, 50);
            }
        });

        let content = accordion.querySelector("div");
        if (content) {
            content.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
            });

            if (accordion.querySelector("span")) {
                accordion.classList.add("complete");
            }
        }
    });

    updateAccordions();
});