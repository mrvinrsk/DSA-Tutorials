$(function () {
    if (!document.querySelector('.popups')) {
        let pw = document.createElement('div');
        pw.classList.add('popups');

        document.body.appendChild(pw);
    }
    popup_wrapper = document.querySelector('.popups');

    if (document.querySelector('code:not(.no-copy)')) {
        const code_copy_pop = document.createElement('div');
        code_copy_pop.classList.add('popup');
        code_copy_pop.id = "code_copied";
        code_copy_pop.innerHTML = "<h3>Code kopiert</h3><p>Du hast den Code erfolgreich in deine Zwischenablage kopiert.</p>" +
            "<div style='margin-top: 1rem;' class='click-show' data-closed='Code anzeigen' data-opened='Code" +
            " verstecken'><span></span><div><code" +
            " id='copied-code' class='no-copy' style='margin:0;'>404</code></div></div>";

        popup_wrapper.appendChild(code_copy_pop);
        reloadClickShows();
    }

    document.querySelectorAll('code:not(.no-copy)').forEach(code => {
        code.setAttribute('data-toggle-popup', 'code_copied');

        code.addEventListener('click', () => {
            document.querySelector("#copied-code").textContent = code.textContent;
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
        if (!document.querySelector(".mediatogglecontainer")) {
            let c = document.createElement('div');
            c.classList.add('mediatogglecontainer');
            document.body.appendChild(c);
        }

        $('.mediatogglecontainer').load("../element/media-toggle.html");
    }
});