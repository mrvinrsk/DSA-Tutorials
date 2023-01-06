<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
              name="viewport">
        <meta content="ie=edge" http-equiv="X-UA-Compatible">

        <title>E-Mail Einrichtung | by Marvin Roßkothen</title>

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
        <!-- <script src='../js/slide.js' async></script> -->
    </head>
    <body class="tutorial">
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>
        <main class="slide">
            <div class='heading'>
                <div class='heading-content'>
                    <h1>E-Mail Einrichtung</h1>
                    <p class='short'>
                        In diesem Tutorial beschreibe ich in simplen Schritten wie eine E-Mail-Einrichtung vorgenommen wird, dabei
                        versuche ich alle üblichen Fälle und Probleme zu berücksichtigen.
                    </p>
                </div>
            </div>

            <div class='content'>
                <div class='dsgvo-media' data-alt='E-Mail App'
                     data-src='https://images.pexels.com/photos/193003/pexels-photo-193003.jpeg?cs=srgb&dl=pexels-torsten-dettlaff-193003.jpg&fm=jpg'></div>

                <div>
                    <h2>Aller Anfang ist schwer</h2>
                    <p>
                        Vor deinem ersten Kundenanruf solltest du dir über folgendes im Klaren sein: <b>Niemand ist perfekt und du
                                                                                                        wirst Fehler machen.</b>
                        Es liegt jedoch einzig und allein in deiner Hand das beste daraus zu machen und trotzdem einen kühlen Kopf
                        zu bewaren! Niemand wird deinen Kopf abhacken,
                        wenn dein erster Anruf nicht rekordverdächtig ist.
                    </p>
                </div>

                <div>
                    <h2>Vorbereitung</h2>
                    <p>
                        Vor dem Anruf solltest du darauf achten, dass du die wichtigsten Informationen und Fenster, welche du
                        benötigst, offen und griffbereit hast, damit es weder für dich,
                        noch für den Kunden zu Verzögerungen kommt. Zu diesen Dingen zählen:
                    </p>

                    <ul>
                        <li>Zugangsdaten für die E-Mail Adresse</li>
                        <li>Eine Fernwartungssoftware</li>
                        <ul>
                            <li><a href='https://anydesk.com/' target='_blank'>Anydesk</a></li>
                            <li><a href='https://teamviewer.com/' target='_blank'>TeamViewer</a></li>
                        </ul>
                        <li><a href='https://www.zoiper.com/'>Zoiper</a></li>
                        <li>ggf. unser Webmailer (<a href="https://post.deutsche-stadtauskunft.de/" target="_blank">post</a> / <a
                                    href="https://mail.deutsche-stadtauskunft.de/" target="_blank">mail</a>)
                        </li>
                    </ul>
                </div>

                <div>
                    <h2>Die Einrichtung</h2>
                    <p>
                        Die Einrichtung an sich kannst du ganz einfach mithilfe eines Tutorials, für die jeweilige
                        E-Mail-Software, abfrühstücken. Wenn's keine Komplikationen
                        gibt, solltest du in maximal 15 Minuten mit der Geschichte durch sein.
                    </p>

                    <div class='table'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Programm</th>
                                    <th>Tutorial</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <th>Outlook</th>
                                    <td>
                                        <a href='https://support.microsoft.com/de-de/office/hinzuf%C3%BCgen-eines-e-mail-kontos-zu-outlook-6e27792a-9267-4aa4-8bb6-c84ef146101b#bkmk_advanced'
                                           target='_blank'>Allgemein</a> | <span class='strike disabled-text'>Windows</span> |
                                        <span class='strike disabled-text'>Mac</span></td>
                                </tr>

                                <tr>
                                    <th>Thunderbird</th>
                                    <td><a href='https://support.mozilla.org/de/kb/manuell-ein-konto-konfigurieren'
                                           target='_blank'>Allgemein</a> | <span class='strike disabled-text'>Windows</span> |
                                        <span class='strike disabled-text'>Mac</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h2>Einstellungen</h2>
                    <p>
                        Die folgenden Daten benötigst du für eine E-Mail-Einrichtung.
                    </p>

                    <div class='table'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Daten</th>
                                    <th>Wert</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <th>Nutzername & Passwort</th>
                                    <td colspan='2'>Beides im <a href='http://172.17.0.12:3000/'
                                                                 target='_blank'>Zugangsdatentool</a> unter dem Tab "E-Mail" zu
                                                    finden
                                    </td>
                                </tr>

                                <tr>
                                    <th>Ein- und Ausgangsserver</th>
                                    <td colspan='2'>Ebenfalls im <a href='http://172.17.0.12:3000/' target='_blank'>Zugangsdatentool</a>
                                                    zu finden, je nach Mail entweder <a
                                                onclick='copyTextToClipboard("mail.deutsche-stadtauskunft.de")'>mail.deutsche-stadtauskunft.de</a>
                                                    oder <a onclick='copyTextToClipboard("post.deutsche-stadtauskunft.de")'>post.deutsche-stadtauskunft.de</a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>Ports</td>
                                    <td colspan='1'>Eingang: 143 (STARTTLS) oder 993 (SSL)</td>
                                    <td colspan='1'>Ausgang: 587 (STARTTLS) oder 465 (SSL)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </body>
</html>