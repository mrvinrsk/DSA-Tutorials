<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
              name="viewport">
        <meta content="ie=edge" http-equiv="X-UA-Compatible">

        <title>Secure Einbettungscode erstellen | by Marvin Roßkothen</title>

        <link href="../css/global.min.css" rel="stylesheet">
        <link href="../css/tutorial.min.css" rel="stylesheet">
        <link href="../css/media.min.css" rel="stylesheet">

        <script src='../js/jquery-3.6.0.min.js'></script>
        <script src='../js/main.js'></script>
        <script src='../js/popups.js'></script>
        <script src='../js/tutorial.js'></script>
        <script async src='../js/anime.min.js'></script>
        <script async src='../js/jquery.waypoints.min.js'></script>
        <script async src='../js/media.js'></script>
    </head>
    <body class="tutorial">
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>
        <div class='popups'>
            <div class='popup' id='copied_embed'>
                <h3>Kopiert</h3>
                <p>Du hast den Einbettungscode erfolgreich kopiert.</p>
            </div>
        </div>

        <main class="slide">
            <div class='heading'>
                <div class='heading-content'>
                    <h1>Secure Einbettungscode erstellen</h1>
                    <p class='short'>
                        Sollten wir vom Kunden keine FTP-Zugangsdaten haben, muss Secure vom Kunden selbst eingebunden werden.
                        Dazu schicken wir die einzelnen benötigten Code-Schnipsel an den Kunden – in diesem Tutorial erkläre ich,
                        wie genau du das tust.
                    </p>
                </div>
            </div>

            <div class='content'>
                <div class='dsgvo-media' data-alt='Datenschutz'
                     data-src='https://images.pexels.com/photos/4160125/pexels-photo-4160125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                     data-src-mobile='https://images.pexels.com/photos/4160125/pexels-photo-4160125.jpeg?auto=compress&cs=tinysrgb&w=750&dpr=1'></div>

                <div>
                    <h2>Secure anlegen</h2>
                    <p>
                        Zuerst musst du überprüfen, ob bereits ein Secure für den Kunden angelegt wurde, wenn dem nicht so ist,
                        musst du diesen Schritt leider selbst übernehmen.
                        Wie du das tust, erfährst du <a href='secure-anlegen.html' target='_blank'>hier</a>.
                    </p>
                </div>

                <div>
                    <h2>Code-Schnipsel kopieren</h2>
                    <p>
                        Nun kannst du die Code-Schnipsel kopieren, indem du auf das zugehörige Icon im Dashboard klickst (siehe
                        Bild)
                    </p>

                    <div
                            class="dsgvo-media margin"
                            data-alt="Secure Dashboard"
                            data-fitting='contain'
                            data-height='150'
                            data-src="../images/secure-quelltext-anzeigen.jpg"
                            data-width='200'
                    ></div>
                </div>

                <div>
                    <h2>Einbettungscode erstellen</h2>
                    <p>
                        Der "Einbettungscode" ist im Prinzip einfach nur eine E-Mail an den Kunden, welche die Schnipsel und eine
                        Erklärung über deren Einbindung enthält.
                        Diese Erklärung kannst du kopieren, indem du <span data-toggle-popup='copied_embed'
                                                                           onclick='copyButtonFile(this, "../text/secure-einbettungscode.txt");'>hier</span>
                        klickst.
                        <br>
                        <br>
                        Diesen Einbettungscode sendest du an den Bearbeiter des Projektes, damit dieser ihn an den Kunden
                        weiterleiten kann.
                        Achte dabei darauf, dass du an alle Änderungen denkst; alle Dinge, die geändert werden müssen sind
                        folgenderweise markiert: <code class='no-copy'>|| [BEISPIEL] ||</code>
                    </p>
                </div>
            </div>
        </main>
    </body>
</html>