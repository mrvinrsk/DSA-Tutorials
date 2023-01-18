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

        <title>Detaileintrag löschen | by Marvin Roßkothen</title>

        <link href="../css/global.min.css" rel="stylesheet">
        <link href="../css/tutorial.min.css" rel="stylesheet">
        <link href="../css/media.min.css" rel="stylesheet">

        <script src='../js/jquery-3.6.0.min.js'></script>
        <script src='../js/main.js'></script>
        <script src='../js/tutorial.js'></script>
        <script async src='../js/anime.min.js'></script>
        <script async src='../js/jquery.waypoints.min.js'></script>
        <script async src='../js/media.js'></script>
    </head>
    <body class="tutorial">
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>

        <div class='popups'>
            <div class='popup' id='login'>
                <h3>Einloggdaten für <a href='https://www.deutsche-stadtauskunft.com'
                                        target='_blank'>deutsche-stadtauskunft.de</a></h3>
                <p><strong>Nutzername:</strong> sabrina</p>
                <p><strong>Passwort:</strong> sabrina2015</p>
            </div>
        </div>

        <main class="slide">
            <div class='heading'>
                <div class='heading-content'>
                    <h1>Detaileintrag löschen</h1>
                    <p class='short'>
                        In diesem Tutorial beschreibe ich in simplen Schritten wie eine E-Mail-Einrichtung vorgenommen wird, dabei
                        versuche ich alle üblichen Fälle und Probleme zu berücksichtigen.
                    </p>
                </div>
            </div>

            <div class='content'>
                <div class='dsgvo-media' data-alt='deutsche-stadtauskunft.com' data-fitting='cover'
                     data-src='../images/deutsche-stadtauskunft.svg'></div>

                <div>
                    <p>
                        Das Löschen eines Detaileintrages ist ganz einfach.
                        <br>
                        <br>
                        Rufe dazu einfach <a href='https://www.deutsche-stadtauskunft.com/admin_panel/index.php' target='_blank'>deutsche-stadtauskunft.com/admin_panel</a>
                        auf, melde dich mit den <span data-toggle-popup='login'>Einloggdaten</span> an.
                        Dort klickst du dann unter "Einträge" auf "editieren" (siehe Bild)
                    </p>

                    <div
                            class="dsgvo-media margin"
                            data-alt="Einträge Menü"
                            data-fitting='contain'
                            data-max-height='200'
                            data-src="../images/deutsche-stadtauskunft-eintraege-editieren.jpg"
                    ></div>

                    <p>
                        Dort suchst du einfach nach dem Kunden – per Kundennummer oder Name. Dort kannst du dann einfach den
                        Eintrag löschen.
                    </p>

                    <div class='dsgvo-media margin' data-alt='Eintrag Verwaltung' data-fitting='contain' data-max-height='200'
                         data-src='../images/deutsche-stadtauskunft-eintrag-loeschen.jpg'></div>

                    <p>
                        Dann nur noch bestätigen.
                    </p>

                    <div class='dsgvo-media margin' data-alt='Löschen bestätigen' data-fitting='contain' data-max-height='200'
                         data-src='../images/deutsche-stadtauskunft-eintrag-loeschen-bestaetigen.jpg'></div>
                </div>

                <div>
                    <h2>Verbleibende Dateien löschen</h2>
                    <p>
                        Zu guter letzt musst du noch die Dateien, die nicht gelöscht werden konnten manuell löschen. Suche dazu im
                        <a href='http://172.17.0.12:3000/' target='_blank'>Zugangsdatentool</a> nach <code>deutsche-stadtauskunft.com</code>
                        und nutze die aktuellen Zugangsdaten, um dich per FTP zu verbinden.
                    </p>
                </div>
            </div>
        </main>

        <script async defer src='../js/popups.js'></script>
    </body>
</html>