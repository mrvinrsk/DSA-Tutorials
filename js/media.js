$(function () {
    let images = document.querySelectorAll('.dsgvo-media');
    images.forEach(image => {
        image.innerHTML = `<div class='need-permission ignore-animation' onclick="showMediaInformation();"><span>Bitte aktiviere das Anzeigen von Bildern, um diesen Inhalt zu laden.</span></div>`;

        let height = '200';

        if(image.dataset.height) {
            height = image.dataset.height;
        }

        if (height.replace(/\d+/g, '') === '') {
            height += 'px';
        }
        image.style.height = height;
    });
});

function loadMedia(reload = false) {
    if (!reload || document.querySelector('body.media-loaded')) {
        let images = document.querySelectorAll('.dsgvo-media');
        images.forEach(imageContainer => {
            imageContainer.innerHTML = "";

            let src = "../images/no-src.png";
            let alt = "No alt given";

            if (imageContainer.dataset.src != null) {
                src = imageContainer.dataset.src;
            }

            let mobileMax = (imageContainer.dataset.mobileMax != null ? imageContainer.dataset.mobileMax : 768);

            if (imageContainer.dataset.srcMobile) {
                if (window.innerWidth <= mobileMax) {
                    src = imageContainer.dataset.srcMobile;
                }
            }

            if (imageContainer.dataset.alt != null) {
                alt = imageContainer.dataset.alt;
            }


            if (src.startsWith('http') || src.startsWith('www.') || /[a-zA-Z]{1,}.(de|com|net|eu|co|tv|fr|nrw)/.test(src)) {
                let displaySrc = src;
                if (displaySrc.length >= 65) {
                    displaySrc = displaySrc.substring(0, 65) + " <i>[...]</i>";
                }

                if (imageContainer.dataset.customAttribution) {
                    displaySrc = imageContainer.dataset.customAttribution;
                }

                let cSrc = src;
                if (imageContainer.dataset.customAttributionLink) {
                    cSrc = imageContainer.dataset.customAttributionLink;
                }

                imageContainer.innerHTML += `<span class='image-source'>Quelle: <a title="${cSrc}" href="${cSrc}" target="_blank">${displaySrc}</a></span>`;
            } else {
                imageContainer.innerHTML += `<span class='image-source'>Quelle: Internes Bild</span>`;
            }
            imageContainer.innerHTML += `<img src='${src}' alt='${alt}' loading='lazy'>`;
            imageContainer.querySelector('img').style.objectFit = imageContainer.dataset.fitting;
        });

        document.body.classList.add('media-loaded');
    }
}

$(function () {
    window.addEventListener('resize', () => {
        if (document.querySelector('body.media-loaded')) {
            loadMedia(true);
        }
    });
});

function toggleMediaInformation() {
    if (document.querySelector('.dsgvo-media-toggle') != null) {
        document.querySelector('.dsgvo-media-toggle').classList.toggle("show");
    }
}

function hideMediaInformation() {
    if (document.querySelector('.dsgvo-media-toggle') != null) {
        document.querySelector('.dsgvo-media-toggle').classList.remove("show");
    }
}

function showMediaInformation() {
    if (document.querySelector('.dsgvo-media-toggle') != null) {
        if (!document.querySelector('.dsgvo-media-toggle').classList.contains("show")) {
            document.querySelector('.dsgvo-media-toggle').classList.add("show");
        } else {
            pulse('.dsgvo-media-toggle', '#cc0000');
        }
    }
}