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

function removeLoading() {
    var animation = {opacity: 0};
    $('.loading-wrapper').animate(animation, 'slow', 'swing', function () {
        setTimeout(() => {
            this.remove();
        }, 500);
    });
}

function filterTag(tag) {
    console.log("Du möchtest suchen nach: " + tag);
    loadTutorials(true, tag);
}

function initSlideIn(selector) {
    $(function () {
        $(selector).css("translateY", "25px");
        $(selector).css("opacity", "0");

        $(selector).waypoint(function () {
            var CSStransforms = anime({
                targets: this.element,
                translateY: 0,
                opacity: 1
            });
        }, {
            offset: '100%'
        });
    });
}

function toggleMediaInformation() {
    if(document.querySelector('.dsgvo-image-toggle') != null) {
        document.querySelector('.dsgvo-image-toggle').classList.toggle("show");
    }
}