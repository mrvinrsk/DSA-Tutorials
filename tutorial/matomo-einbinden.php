<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8" />
        <meta
                content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
                name="viewport"
        />
        <meta content="ie=edge" http-equiv="X-UA-Compatible" />

        <title>Matomo einbinden | by Marvin Roßkothen</title>

        <link href="../css/global.min.css" rel="stylesheet" />
        <link href="../css/tutorial.min.css" rel="stylesheet" />
        <link href="../css/media.min.css" rel="stylesheet" />

        <script src="../js/jquery-3.6.0.min.js"></script>
        <script src="../js/anime.min.js"></script>
        <script src="../js/jquery.waypoints.min.js"></script>
        <script src="../js/main.js"></script>
        <script src="../js/media.js"></script>
        <script src="../js/popups.js"></script>
        <!-- <script src='../js/slide.js' async></script> -->
    </head>
    <body class="tutorial">
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>
        <div class='popups'>
            <div class='popup' id='login'>
                <h3>Zugangsdaten für <a href='https://dsa-analytics.de/'>dsa-analytics.de</a></h3>
                <p><strong>Nutzername:</strong> dsa-admin</p>
                <p><strong>Passwort:</strong> M4t-CC!_iODp.w2tV</p>
            </div>
        </div>

        <main class="slide">
            <div class="heading">
                <div class='heading-content'>
                    <h1>Matomo einbinden</h1>
                    <p class="short">
                        Matomo wird verwendet um Seitenbesuche bzw. die Statistiken einer
                        Seite aufzuzeichnen. In diesem kurzen Beitrag erkläre ich, wie du
                        einen Matomo Schnipsel für deine Website erhälst.
                    </p>
                </div>
            </div>

            <div class="content">
                <div
                        class="dsgvo-media"
                        data-alt="Statistiken"
                        data-src="https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?cs=srgb&dl=pexels-lukas-669619.jpg&fm=jpg"
                ></div>

                <div>
                    <h2>Den Schnipsel erhalten</h2>
                    <p>
                        Es ist sehr simpel den Schnipsel zu erhalten. Besuche dafür einfach
                        <a href="//dsa-analytics.de/" target="_blank">DSA Analytics</a> und
                        melde dich dort mit den <span data-toggle-popup='login'>Zugangsdaten</span> an. Scrolle dann an's Ende
                        der Liste und klicke auf "Hinzufügen". Dort schreibst du die
                        folgenden Dinge:
                    </p>

                    <div class="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Einstellung</th>
                                    <th>Wert</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td>"dsa_" + Kunden-URL</td>
                                </tr>

                                <tr>
                                    <td>URLs</td>
                                    <td>Kunden-URL mit http und https</td>
                                </tr>

                                <tr>
                                    <td>Ignorierte IPs</td>
                                    <td>87.140.116.131</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p>
                        Klicke danach auf "Fertig" und klicke in der Übersicht im neuen
                        Eintrag auf "Tracking-Code anzeigen". Den dort kopierten
                        Tracking-Code fügst du einfach auf jeder Seite im Head-Bereich ein.
                    </p>
                </div>
            </div>
        </main>

        <script>
            $(function () {
                $("#loadwrap").load("../element/image-toggle.html");
            });
        </script>
    </body>
</html>
