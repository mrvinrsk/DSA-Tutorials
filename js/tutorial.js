let popup_wrapper = null;

$(function () {
    if (!document.querySelector('.popups')) {
        let pw = document.createElement('div');
        pw.classList.add('popups');

        document.body.appendChild(pw);

        console.log("Added popup wrapper");
    }
    popup_wrapper = document.querySelector('.popups');

    if (document.querySelector('code:not(.no-copy)')) {
        const code_copy_pop = document.createElement('div');
        code_copy_pop.classList.add('popup');
        code_copy_pop.id = "code_copied";
        code_copy_pop.innerHTML = "<h3>Code kopiert</h3><p>Du hast den Code erfolgreich in deine Zwischenablage kopiert.</p>";

        popup_wrapper.appendChild(code_copy_pop);
    }

    document.querySelectorAll('code:not(.no-copy)').forEach(code => {
        code.setAttribute('data-toggle-popup', 'code_copied');
        console.log('Set attribute');

        code.addEventListener('click', () => {
            copyTextToClipboard(code.textContent);
        });
    });

    let i = 1;
    let bdc = 0;
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
            breadcrumb.setAttribute("data-toggle-popup", "copied_path-" + (++bdc));

            const pop = document.createElement('div');
            pop.classList.add('popup');
            pop.id = "copied_path-" + bdc;
            pop.innerHTML = "<h3>Kopiert</h3><p>Du hast den Pfad <code class='no-copy'>" + path + "</code> kopiert.</p>";
            popup_wrapper.appendChild(pop);

            cB.addEventListener('click', () => {
                copyTextToClipboard(path);
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