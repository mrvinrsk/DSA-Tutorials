<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8" />
        <meta
                content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
                name="viewport"
        />
        <meta content="ie=edge" http-equiv="X-UA-Compatible" />

        <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
        <link rel="manifest" href="../site.webmanifest">
        <link rel="mask-icon" href="../safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">

        <title>Reinzeichnung | by Marvin Roßkothen</title>

        <link href="../css/global.min.css" rel="stylesheet" />
        <link href="../css/tutorial.min.css" rel="stylesheet" />
        <link href="../css/media.min.css" rel="stylesheet" />

        <script src="../js/jquery-3.6.0.min.js"></script>
        <script src="../js/tutorial.js"></script>
        <script src="../js/anime.min.js"></script>
        <script src="../js/jquery.waypoints.min.js"></script>
        <script src="../js/main.js"></script>
        <script src="../js/media.js"></script>
        <!-- <script src='../js/slide.js' async></script> -->

        <script src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script>
        <script src="../js/checklist.js"></script>
    </head>
    <body class="tutorial">
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>


        <main class="slide">
            <div class="heading">
                <div class='heading-content'>
                    <h1>Reinzeichnung</h1>
                    <p class="short">
                        Im Laufe der Reinzeichnung bereitest du eine InDesign-Datei auf den Druck vor und exportierst sie als
                        druckfertige PDF.
                        Dieses Tutorial deckt den gesamten Vorgang von Vorbereitung bis Nacharbeit nach dem Druckauftrag.
                    </p>
                </div>
            </div>

            <div class="content">
                <div
                        class="dsgvo-media"
                        data-alt="SEO Bild"
                        data-custom-attribution="https://pixabay.com/photos/printer-ink-toner-technology-print-933098/"
                        data-custom-attribution-link="https://pixabay.com/photos/printer-ink-toner-technology-print-933098/"
                        data-src="https://cdn.pixabay.com/photo/2015/09/09/20/23/printer-933098_960_720.jpg"
                ></div>

                <div>
                    <h2>Alles nach Plan</h2>
                    <p>
                        Hier findest du alle erforderlichen Schritte zur Bearbeitung deines Projektes. Kannst alles abhaken, so
                        kannst'e nix vergessen, praktisch 'wa?
                    </p>

                    <div class="checklist ignore-animation" data-name='reinzeichnung' data-show-completion>

                        <div class='checks'>
                            <div class='checklist-section'>
                                <h3>Vorbereitung (InDesign)</h3>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Textfelder und Rahmen anpassen (Anklicken und
                                            <kbd>Alt</kbd>+<kbd>cmd</kbd>+<kbd>C</kbd> drücken)
                                        </div>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Durchschuss des Textes anpassen
                                            <div class='explanation'>
                                                Kein überlaufender / fehlender Text
                                                <div
                                                        class="dsgvo-media"
                                                        data-alt="Beispiel-Bild: Durchschuss Text"
                                                        data-fitting="contain"
                                                        data-height="unset"
                                                        data-src="../images/durchschuss-text.webp"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Nicht verwendete Farben löschen
                                            <div class='explanation'>
                                                Im Fenster "Farbfelder" unter Optionen "alle nicht verwendeten anzeigen" und dann
                                                löschen
                                            </div>
                                        </div>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Rahmen und Beschnitt müssen korrekt angelegt und ausgefüllt sein
                                            <div class='explanation'>
                                                Keine überlappenden bzw. zu klein geratenen Flächen
                                            </div>
                                        </div>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Verwendete Bilder in CMYK umwandeln und als .TIFF speichern
                                        </div>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Alle Bilder einbetten
                                            <div class='explanation'>
                                                Im Fenster "Verknüpfungen" das Bild auswählen und <em>Rechtsklick > Verknüpfung
                                                                                                      einbetten</em>
                                            </div>
                                        </div>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Schriften in Pfade umwandeln
                                            <div class='explanation'>
                                                <p><strong>Tipp:</strong> Vorher am besten die Seite duplizieren, falls zukünftig
                                                                          Änderungen vorgenommen werden sollen.</p>
                                                <p>Textfeld markieren und <em>Schrift > in Pfade umwandeln</em> auswählen.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class='check' id='pdf-preset'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Als PDF exportieren
                                            <div class='explanation'>
                                                <p>PDF-Vorgabe: PDF/x-3:2002</p>
                                                <p>Marken und Anschnitt: "<em>Anschnittseinstellungen des Dokuments verwenden</em>"
                                                </p>
                                                <p>Ausgabe-Farbe-Ziel: ISO coated v2 300% und "<em>in Zielprofil konvertieren</em>"
                                                   auswählen</p>
                                                <p>Erweiterungen: Schriftart auf 1% stellen</p>
                                                <p><strong>Tipp:</strong> Vorlage mit diesen Einstellungen erstellen</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Bei Saxoprint in den Druck schicken
                                            <div class='explanation'>
                                                <ul>
                                                    <li>Flyer (DIN A6)
                                                        <ul>
                                                            <li>Auflage: meistens 1.000 Stk. – die genaue Anzahl steht je in der
                                                                Internen
                                                            </li>
                                                            <li>Ausführung: Flyer</li>
                                                            <li>Endformat: DIN A6 quer</li>
                                                            <li>Seitenzahl: 2 Seiten</li>
                                                            <li>Farbigkeit: 4/4-farbig Euroskala</li>
                                                            <li>Material: 250g/m² Bilderdruckpapier matt FSC</li>
                                                        </ul>
                                                    </li>

                                                    <li>Weiterverarbeitung
                                                        <ul>
                                                            <li>Schneiden: Schneiden</li>
                                                            <li>Perforation: Keine</li>
                                                            <li>Veredelung: Keine</li>
                                                        </ul>
                                                    </li>

                                                    <li>Lieferung
                                                        <ul>
                                                            <li>Standard</li>
                                                        </ul>
                                                    </li>

                                                    <li>Serviceoptionen
                                                        <ul>
                                                            <li>Absenderadresse: Reseller-Versand</li>
                                                            <li><strong>Ansonsten alles übernehmen</strong></li>
                                                        </ul>
                                                    </li>

                                                    <li>in den Warenkorb</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>

        <script src='../js/tutorial.js'></script>

    </body>
</html>
</title>
</head>
<body>

</body>
</html>