$(function() {
    let els = ['div', 'ul', 'ol', 'li', 'article', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    els.forEach(tag => {
        $('main ' + tag + ':not(.ignore-animation)').waypoint(function () {
            let animation = anime({
                targets: this.element,
                keyframes: [
                    {translateY: 35, opacity: 0},
                    {translateY: 0, opacity: 1}
                ],
                duration: 925,
                easing: 'easeOutElastic(2, .8)',
            });

            // animate only on first enter of viewport
            this.destroy();
        }, {
            offset: '115%'
        });
    });
});
