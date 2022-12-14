$(async function () {
    document.addEventListener('dsgvomediarendered', (event) => {
        // console.log("Media rendered: ", event.detail.mediaList);

        document.addEventListener('resize', () => {
            updateMediaSizes();
        });
    });

    let images = document.querySelectorAll('.dsgvo-media');

    await images.forEach(image => {
        image.innerHTML = `<div class='need-permission ignore-animation' onclick="showMediaInformation();"><span>Bitte aktiviere das Anzeigen von Bildern, um diesen Inhalt zu laden.</span></div>`;

        let height = 'unset';
        let maxHeight = 'unset';
        let width = '100%';

        if (image.dataset.height) {
            height = image.dataset.height;
        }
        let h = height;
        if (h.replace(/\d+/g, '') === '') {
            height += 'px';
        }

        if (image.dataset.maxHeight) {
            maxHeight = image.dataset.maxHeight;
        }
        let mh = maxHeight;
        if (mh.replace(/\d+/g, '') === '') {
            maxHeight += 'px';
        }


        if (image.dataset.width) {
            width = image.dataset.width;
        }
        let w = width;
        if (w.replace(/\d+/g, '') === '') {
            width += 'px';
        }


        image.style.height = height;
        image.style.maxHeight = height;
        image.style.width = width;

        if (!(image.dataset.src.startsWith('http') || image.dataset.src.startsWith('www.') || /[a-zA-Z]{1,}\.(de|com|net|eu|co|tv|fr|nrw)/.test(image.dataset.src))) {
            // Local image, else external
            loadSingleMedia(image, true);
        }

        image.classList.add('rendered');
    });

    let rendered = document.querySelectorAll('.dsgvo-media.rendered');
    document.documentElement.dispatchEvent(new CustomEvent("dsgvomediarendered", {
            detail: {
                mediaList: rendered,
                media: rendered.length
            },
            bubbles: true,
            cancelable: false,
            composed: false
        })
    );

    try {
        if (localStorage.getItem("media") !== null && localStorage.getItem("media") === "yes") {
            setTimeout(() => {
                loadMedia(false);
            }, 250);
        }
    } catch (f) {
        console.log(f);
    }
});

function updateMediaSizes() {
    document.querySelectorAll('.dsgvo-media').forEach(media => {
        media.style.removeProperty("height");

        if (media.clientHeight >= media.dataset.maxHeight) {
            media.style.height = `${media.dataset.maxHeight}px`;
        } else {
            media.style.removeProperty("height");
        }
    });
}

function loadSingleMedia(imageContainer, mediaSizes = false) {
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


    if (src.startsWith('http') || src.startsWith('www.') || /[a-zA-Z]{1,}\.(de|com|net|eu|co|tv|fr|nrw)/.test(src)) {
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

    imageContainer.classList.add('loaded');

    if (mediaSizes) {
        updateMediaSizes();
    }
}

function loadMedia(reload = false) {
    if (!reload || (document.querySelector('body.media-loaded') && reload)) {
        let images = document.querySelectorAll('.dsgvo-media');
        images.forEach(imageContainer => {
            loadSingleMedia(imageContainer);
        });

        document.body.classList.add('media-loaded');
    }

    localStorage.setItem("media", "yes");
    updateMediaSizes();
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

    if (document.querySelector('.need-permission')) {
        document.querySelectorAll('.need-permission').forEach(media => {
            media.classList.add('tooltip');
            media.setAttribute("data-tooltip", "Klicke, um das Popup zum Akzeptieren von externen Inhalten wieder anzuzeigen.");
        });
    } else {
        document.querySelectorAll('.need-permission').forEach(media => {
            media.classList.remove('tooltip');
            media.setAttribute("data-tooltip", "Klicke, um das Popup zum Akzeptieren von externen Inhalten wieder anzuzeigen.");
        });
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