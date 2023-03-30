<?php
ini_set('upload_max_filesize', '70M');
ini_set('post_max_size', '2G');
ini_set('max_file_uploads', '50');
ini_set('memory_limit', '256M');
set_time_limit(180);
?>

<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
              name="viewport">
        <meta content="ie=edge" http-equiv="X-UA-Compatible">

        <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
        <link rel="manifest" href="../site.webmanifest">
        <link rel="mask-icon" href="../safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">

        <title>ResizeIMG | by Marvin Roßkothen</title>

        <link href="../css/global.min.css" rel="stylesheet">
        <link href="../css/tutorial.min.css" rel="stylesheet">
        <link href="../css/media.min.css" rel="stylesheet">

        <script src='../js/jquery-3.6.0.min.js'></script>
        <script src='../js/main.js'></script>
        <script src='../js/popups.js'></script>
        <script src='../js/tutorial.js'></script>
        <script async src='../js/jquery.waypoints.min.js'></script>
        <script async src='../js/media.js'></script>
        <!-- <script src='../js/slide.js' async></script> -->

        <style>
            .number-infos {
                display: none;
                margin-top: 2rem;
            }

            .number-infos.show {
                display: block;
            }
        </style>
    </head>
    <body class="tutorial">
        <div class='popups'>
            <div class='popup' id='couldntPaste'>
                <h3>Fehler</h3>
                <p>Deine Zwischenablage konnte nicht ausgelesen, oder deren Inhalt nicht eingefügt werden.</p>

                <p style='margin-top: 1rem;' id='paste-error'></p>
            </div>
        </div>

        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>
        <main class="slide">
            <div class='heading'>
                <div class='heading-content'>
                    <h1>Telefon-Tag</h1>
                    <p class='short'>
                        Wandle eine Telefonnummer direkt in einen fertigen Tag um, perfekt für faule Socken, wie mich.
                    </p>
                </div>
            </div>

            <div class='content'>
                <div class='simpleflex column'>
                    <div class='simpleflex'>
                        <div class="input-group">
                            <div class="input-group-area"><input type="text" id='phone' placeholder="Telefonnummer"></div>
                            <div class="input-group-icon" id='phone-button' onclick='document.querySelector("#phone").value = '>Einfügen</div>
                        </div>

                        <div class="input-group">
                            <div class="input-group-area"><input type="text" id='tag' placeholder="Tag" readonly></div>
                            <div class="input-group-icon" id='tag-button' onclick='copyTextToClipboard(document.querySelector("#tag").value);'>Kopieren</div>
                        </div>
                    </div>

                    <div class='number-infos'>
                        <h3>Informationen</h3>

                        <p><strong>Formatiert:</strong> <span id='formatted'></span></p>
                        <p><strong>Ort:</strong> <span id='ort'></span></p>
                    </div>
                </div>
            </div>
        </main>

        <script>
            function formatPhoneNumber(number) {
                let check_nr = number.replace(/^0/, '');
                let prefix = '';
                let ort = '';
                let remaining = number;

                // Find the matching area code
                for (const areaCode of area_codes) {
                    if (check_nr.startsWith(areaCode.code)) {
                        prefix = areaCode.code;
                        ort = areaCode.ort;
                        remaining = check_nr.slice(areaCode.code.length);
                        break;
                    }
                }

                if (!prefix) {
                    throw new Error('Invalid or unknown area code');
                }

                let formatted = '';
                for (let i = remaining.length - 1; i >= 0; i -= 2) {
                    const chunk = remaining.slice(Math.max(0, i - 1), i + 1);
                    formatted = chunk + ' ' + formatted;
                }
                formatted = formatted.trim();

                if (!number.startsWith(prefix)) {
                    prefix = "0" + prefix;
                }

                return [`${prefix} / ${formatted.trim()}`, ort];
            }

            document.querySelector("#phone-button").addEventListener("click", () => {
                try {
                    getClipboardText().then(cb => {
                        document.querySelector("#phone").value = cb;
                        updateTag();
                    }).catch(err => {
                        document.querySelector('#paste-error').innerHTML = `<strong>Fehler:</strong> ${err}`;
                        togglePopup('couldntPaste');
                    });
                } catch (err) {
                    document.querySelector('#paste-error').innerHTML = `<strong>Fehler:</strong> ${err}`;
                    togglePopup('couldntPaste');
                }
            });

            function updateTag() {
                let trimmed = document.querySelector("#phone").value.replace(/\D/g, "");

                if (trimmed.length >= 10) {
                    let result = formatPhoneNumber(trimmed);

                    document.querySelector("#formatted").textContent = result[0];
                    document.querySelector("#ort").textContent = result[1];

                    document.querySelector(".number-infos").classList.add("show");

                    let tag = `<a title="Direkt anrufen" href="tel:${trimmed}">${result[0]}</a>`;

                    document.querySelector("#tag").value = tag;
                } else {
                    document.querySelector(".number-infos").classList.remove("show");
                    document.querySelector("#tag").value = "";
                }
            }

            document.querySelector("#phone").addEventListener('input', () => {
                updateTag();
            });
        </script>
    </body>
</html>