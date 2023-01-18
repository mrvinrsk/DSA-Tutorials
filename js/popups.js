$(function () {
    document.querySelectorAll(".popup").forEach((popup) => {
        const close = document.createElement("div");
        close.classList.add("close");
        close.addEventListener("click", () => {
            togglePopup(popup.id);
        });

        popup.appendChild(close);
    });

    document.querySelectorAll("[data-toggle-popup]").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            togglePopup(toggle.getAttribute("data-toggle-popup"));
        });
    });

    if (document.querySelector('.popups')) {
        document.querySelector('.popups').addEventListener('click', () => {
            document.querySelectorAll('.popup').forEach(popup => {
                popup.classList.remove('show');
            });

            document.querySelector('.popups').classList.remove('show');
            document.body.classList.remove('popup-shown');
        });
    }

    if (document.querySelector('.popup')) {
        document.querySelectorAll('.popup').forEach(popup => {
            popup.addEventListener('click', e => {
                e.stopImmediatePropagation();
                e.stopPropagation();
            });
        });
    }
});

// function for toggling the popup
function togglePopup(id) {
    document.getElementById(id).classList.toggle("show");

    if (document.getElementById(id).classList.contains("show")) {
        document.body.classList.add('popup-shown');
        document.querySelector('.popups').classList.add('show');
    } else {
        document.body.classList.remove('popup-shown');
        document.querySelector('.popups').classList.remove('show');
    }
}

function popupShown(id = null) {
    if (id) {
        return document.getElementById(id).classList.contains("show");
    } else {
        return document.querySelector('.popup.show') !== null;
    }
}