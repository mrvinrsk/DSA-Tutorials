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

        <title>Simple Secure | by Marvin Roßkothen</title>

        <link href="../css/global.min.css" rel="stylesheet">
        <link href="../css/tutorial.min.css" rel="stylesheet">
        <link href="../css/media.min.css" rel="stylesheet">

        <script src='../js/jquery-3.6.0.min.js'></script>
        <script src='../js/main.js'></script>
        <script src='../js/accordions.js'></script>
        <script src='../js/popups.js'></script>
        <script src='../js/tutorial.js'></script>
        <script async src='../js/anime.min.js'></script>
        <script async src='../js/jquery.waypoints.min.js'></script>
        <script async src='../js/media.js'></script>
        <script async src='../js/add_elements.js'></script>
        <script async src='../js/conditional-checkbox.js'></script>
        <!-- <script src='../js/slide.js' async></script> -->
    </head>
    <body class="tutorial">
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>
        <main class="slide">
            <div class='heading'>
                <div class='heading-content'>
                    <h1>Simple Secure</h1>
                    <p class='short'>
                        Hier geht es um alle Secure-Tools und deren schnellerer Aquirierung.
                    </p>
                </div>
            </div>

            <div class='content'>
                <div>
                    <h2>Download</h2>
                    <p>
                        Erhalte hier alle benötigten Dateien für die Secure-Tools.
                    </p>

                    <div class='dl-list'>
                        <a class='button small' data-hover-text='Download' download href='../dl/secure/secure.zip' target='_blank'>Bundle</a>
                        <a class='button small' data-hover-text='Download' download href='../dl/secure/secure-js.zip' target='_blank'>JavaScript</a>
                        <a class='button small' data-hover-text='Download' download href='../dl/secure/secure-images.zip' target='_blank'>Bilder</a>
                        <a class='button small' data-hover-text='Download' download href='../dl/secure/dsa-secure.css' target='_blank'>CSS</a>
                    </div>
                </div>

                <div>
                    <h3>Faster Maps</h3>

                    <input oninput='updateMaps();' type='text' id='maps-frame' placeholder='Maps <iframe> Code'>
                    <textarea class='select-all' id='maps-output' readonly></textarea>
                </div>
            </div>
        </main>

        <script>
            function updateMaps() {
                const input = document.querySelector('#maps-frame');
                const output = document.querySelector('#maps-output');

                const srcRegex = /<iframe.*?src="([^"]*)"/;
                const srcMatch = input.value.match(srcRegex);

                if (srcMatch) {
                    output.value = `<div class="dsa-secure-plugin" data-dsa-secure-plugin-url="${srcMatch[1]}" data-dsa-secure-police="DATENSCHUTZ_URL" data-dsa-secure-image="images/maps.svg"
                    data-dsa-secure-name="NAME" data-dsa-secure-width="100%" data-dsa-secure-height="400px"></div>`;
                }
            }
        </script>
    </body>
</html>
