$(function () {
    document.querySelectorAll('code:not(.no-copy)').forEach(code => {
        code.addEventListener('click', () => {
            copyTextToClipboard(code.textContent);
            alert("Du hast den Code kopiert.");
        });
    });

    let i = 1;
    document.querySelectorAll('.breadcrumb').forEach(breadcrumb => {
        if (breadcrumb.hasAttribute("data-copy")) {
            let path = "";

            if (!breadcrumb.hasAttribute("data-custom-copy")) {
                breadcrumb.querySelectorAll('span').forEach(crumb => {
                    path += "/" + crumb.textContent;

                    if (!breadcrumb.hasAttribute("data-leading-slash")) {
                        path = path.replace(/^\/+/, '');
                    }
                });
            } else {
                path = breadcrumb.dataset.customCopy;
            }

            console.log(breadcrumb);

            let cB = document.createElement('a');
            cB.textContent = "Kopieren";
            cB.classList.add('breadcrumb-copy');

            breadcrumb.appendChild(cB);

            cB.addEventListener('click', () => {
                copyTextToClipboard(path);
                alert('Pfad kopiert: ' + path);
            });
        }

        i++;
    });

    if (localStorage.getItem("media") == null || localStorage.getItem("media") !== "yes") {
        let c = document.createElement('div');
        c.classList.add('mediatogglecontainer');
        document.body.appendChild(c);

        $('.mediatogglecontainer').load("../element/media-toggle.html");
    }
});