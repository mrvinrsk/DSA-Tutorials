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

        <title>Terminal Commands | by Marvin Roßkothen</title>

        <link href="../css/global.min.css" rel="stylesheet" />
        <link href="../css/tutorial.min.css" rel="stylesheet" />
        <link href="../css/media.min.css" rel="stylesheet" />

        <script src="../js/jquery-3.6.0.min.js"></script>
        <script src="../js/anime.min.js"></script>
        <script src="../js/jquery.waypoints.min.js"></script>
        <script src="../js/main.js"></script>
        <script src="../js/tutorial.js"></script>
        <script src="../js/media.js"></script>
        <script src="../js/popups.js"></script>
        <script src="../js/accordions.js"></script>
        <!-- <script src='../js/slide.js' async></script> -->

        <!-- <script src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script> -->
        <script src="../js/checklist.js"></script>
    </head>
    <body class="tutorial">
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>

        <main class="slide">
            <div class="heading">
                <div class='heading-content'>
                    <h1>Securecheck durchführen</h1>
                    <p class="short">
                        Eine Checkliste, um zu prüfen, ob deine Website bereit für den Upload ist. Endcheck aber nicht vergessen!
                    </p>
                </div>
            </div>

            <div class="content">
                <div
                        class="dsgvo-media"
                        data-alt="SEO Bild"
                        data-custom-attribution="https://www.pexels.com/de-de/foto/stift-kalender-tun-kontroll-liste-3243/"
                        data-custom-attribution-link="https://www.pexels.com/de-de/foto/stift-kalender-tun-kontroll-liste-3243/"
                        data-position='center 85%'
                        data-src="https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=1920&dpr=1"
                        data-src-mobile="https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=900&dpr=1"
                ></div>

                <div>
                    <h2>Commands</h2>

                    <div class="accordions" id='faq' data-close-others>
                        <div class="accordion">
                            <span>Ordner, mit bestimmtem Unterordner, auflisten</span>
                            <div>
                                <code>find . -maxdepth 2 -type d -name "ORDNER"</code>
                                <ul>
                                    <li><strong>find</strong> Startet den find-Befehl</li>
                                    <li><strong>.</strong> Sucht im aktuellen Verzeichnis</li>
                                    <li><strong>-maxdepth 2</strong> Sucht nur nach Ordnern, die max. zwei Ebenen tief sind (d. h. direkte Kinder, der Ordner, des aktuellen Verzeichnisses)</li>
                                    <li><strong>-type d</strong> Bezieht nur Verzeichnisse in die Suchergebnisse ein</li>
                                    <li><strong>-name "ORDNER"</strong> Sucht nach Verzeichnissen mit dem Namen "ORDNER"
                                        <ul>
                                            <li>Alternativ kannst du auch <code class='inline no-copy'>-name "*ORDNER*"</code> nutzen, dann wird nach Ordnern gesucht, deren Namen "ORDNER" <span
                                                        class='underline'>enthält</span>
                                                .</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="accordion">
                            <span>Dateien eines bestimmten Typs auflisten</span>
                            <div>
                                <code>ls -l *.TYP</code>
                                <ul>
                                    <li><strong>ls</strong> Startet den ls-Befehl</li>
                                    <li><strong>-l</strong> Zeigt die Dateien übersichtlicher an</li>
                                    <li><strong>*.TYP</strong> Sucht nach Dateien, die die Endung <code class='inline no-copy'>.TYP</code> haben</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </body>
</html>