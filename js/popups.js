/* Popups, load after all */
function reload() {
    if (document.querySelector('.popups')) {
        let popupShown = false;

        document.querySelectorAll(".popup").forEach((popup) => {
            if (!popup.querySelector('.close')) {
                const close = document.createElement("div");
                close.classList.add("close");
                close.addEventListener("click", () => {
                    popup.classList.remove("show");
                    popupShown = document.querySelector(".popup.show");

                    if (!popupShown) {
                        document.querySelector(".popups").classList.remove("show");
                        document.body.classList.remove('popup-shown');
                    }
                });

                popup.appendChild(close);
            }
        });

        let added = [];
        console.log("Found popup togglers:", document.querySelectorAll("[data-toggle-popup]"));
        document.querySelectorAll("[data-toggle-popup]:not(.popup-toggle)").forEach((toggle) => {

            function clickListener() {
                let selector = ".popup#" + toggle.getAttribute("data-toggle-popup");
                console.log("Searching:", selector);

                let popup = document.querySelector(selector);

                if (popup) {
                    console.log("Popup found");
                    popup.classList.toggle("show");

                    if (popup.classList.contains("show")) {
                        popupShown = true;
                        document.body.classList.add('popup-shown');
                        document.querySelector('.popups').classList.add('show');
                    }
                } else {
                    console.log("Can't find popup");
                }
            }

            toggle.addEventListener("click", clickListener);
            toggle.classList.add('popup-toggle');
        });

        document.querySelector('.popups').addEventListener('click', () => {
            document.querySelectorAll('.popup').forEach(popup => {
                popup.classList.remove('show');
            });

            document.querySelector('.popups').classList.remove('show');
            document.body.classList.remove('popup-shown');
            popupShown = false;
        });

        document.querySelectorAll('.popup').forEach(popup => {
            popup.addEventListener('click', e => {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
            });
        });
    }
}

$(function () {
    setTimeout(() => {
        reload();
    }, 100);
});