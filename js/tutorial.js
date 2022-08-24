$(function () {
    let images = document.querySelectorAll('.dsgvo-image');
    images.forEach(image => {
        image.innerHTML = `<div class='need-permission' onclick="toggleMediaInformation();"><span>Bitte aktiviere das Anzeigen von Bildern, um diesen Inhalt zu laden.</span></div>`;
    });
});

function loadMedia() {
    let images = document.querySelectorAll('.dsgvo-image');
    images.forEach(imageContainer => {
        imageContainer.innerHTML = "";

        let src = "../images/no-src.png";
        let alt = "No alt given";

        if (imageContainer.dataset.src != null) {
            src = imageContainer.dataset.src;
        }

        if (imageContainer.dataset.alt != null) {
            alt = imageContainer.dataset.alt;
        }


        if (src.startsWith('http') || src.startsWith('www.') || /[a-zA-Z]{1,}.(de|com|net|eu|co|tv|fr|nrw)/.test(src)) {
            let displaySrc = src;
            if(displaySrc.length >= 65) {
                displaySrc = displaySrc.substring(0, 65) + "...";
            }
            imageContainer.innerHTML += `<span class='image-source'>Quelle: <a title="${src}" href="${src}">${displaySrc}</a></span>`;
        }
        imageContainer.innerHTML += `<img src='${src}' alt='${alt}'>`;
    });
}