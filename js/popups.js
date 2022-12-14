/* Popups, load after all */
$(function () {
    setTimeout(() => {
        if (document.querySelector('.popups')) {
            let popupShown = false;

            document.querySelectorAll(".popup").forEach((popup) => {
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
            });

            console.log("Found popup togglers:", document.querySelectorAll("[data-toggle-popup]"));
            document.querySelectorAll("[data-toggle-popup]").forEach((toggle) => {
                console.log('Popups get initialized');
                console.log("toggle " + toggle.getAttribute("data-toggle-popup") + " being initialized");

                toggle.addEventListener("click", () => {
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
                });
            });

            document.querySelector('.popups').addEventListener('click', () => {
                document.querySelectorAll('.popup').forEach(popup => {
                    popup.classList.remove('show');
                });

                document.querySelector('.popups').classList.remove('show');
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
    }, 100);
});