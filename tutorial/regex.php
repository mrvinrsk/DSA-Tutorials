<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
              name="viewport">
        <meta content="ie=edge" http-equiv="X-UA-Compatible">

        <title>Regular Expressions | by Marvin Roßkothen</title>

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
        <!-- <script src='../js/slide.js' async></script> -->
    </head>
    <body class="tutorial">
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>
        <main class="slide">
            <div class='heading'>
                <div class='heading-content'>
                    <h1>Regular Expressions</h1>
                    <p class='short'>
                        Eine kleine Einführung in die Welt der Regular Expressions
                    </p>
                </div>
            </div>

            <div class='content'>
                <div class='dsgvo-media' data-alt='E-Mail App'
                     data-src='https://images.pexels.com/photos/193003/pexels-photo-193003.jpeg?cs=srgb&dl=pexels-torsten-dettlaff-193003.jpg&fm=jpg'></div>

                <div id='playground'>
                    <h2>Playground</h2>
                    <div class='simpleflex column'>
                        <div class='simpleflex row'>
                            <span>/</span>
                            <input type='text' id='regex' oninput='update();' value='[a-z]' placeholder='Regular Expression'>
                            <div class='simpleflex row'>
                                <span>/</span>
                                <div class='simpleflex row'>
                                    <div>
                                        <input type='checkbox' id='mod_g' checked onchange='update();'>
                                        <label for='mod_g'><strong>G</strong>lobal</label>
                                    </div>

                                    <div>
                                        <input type='checkbox' id='mod_i' onchange='update();'>
                                        <label for='mod_i'>Case <strong>i</strong>nsensitive</label>
                                    </div>

                                    <div>
                                        <input type='checkbox' id='mod_m' onchange='update();'>
                                        <label for='mod_m'><strong>M</strong>ultiline</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <input type='text' id='replace' oninput='update();' value='!$1' placeholder='Replacement'>
                    </div>
                    <div contenteditable='true' id='regex_matches' onchange='update();'></div>
                    <div id='regex_replaced'></div>
                    <button class='button' onclick='update();'>Matches aktualisieren</button>
                </div>

                <div>
                    <h2>Was sind Regular Expressions?</h2>
                    <p>
                        Mit Regular Expressions kannst du anstatt nach einem spezifischen Text, wie zum Beispiel "Hallo", nach
                        einem Textformat suchen. So zum Beispiel nach allen Wörtern, die fünf Zeichen lang sind. Die dafür
                        benötigte Regex wäre in diesem Fall <code>[a-z]</code>
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
                        E-Mail-Software, abfrühstücken. Wenn's keine <a href='#faq'>Komplikationen</a>
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

                <div>
                    <h2>Häufige Probleme</h2>

                    <div class="accordions" id='faq' data-close-others>
                        <div class="accordion">
                            <span>E-Mails werden nicht gesendet/empfangen</span>
                            <div>
                                <p>
                                    Wenn keine E-Mails gesendet und/oder empfangen werden können, kannst du nur prüfen, ob die
                                    E-Mail richtig eingerichtet wurde (<strong>Postein- und Ausgangsserver</strong> &
                                    <strong>Ports</strong>). Sollte dem so sein und das Problem bleibt weiterhin bestehen, lass
                                    das Problem von den Entwicklern abchecken.
                                </p>
                            </div>
                        </div>

                        <div class="accordion">
                            <span>Auf ein Problem gestoßen?</span>
                            <div>
                                <p>
                                    Wenn du auf ein weiteres, hier noch nicht aufgelistetes Problem gestoßen bist und eine
                                    Lösung für dieses hast, schreibe mir gerne eine E-Mail an
                                    <a href='mailto:m.rosskothen@dsa-marketing.ag'>m.rosskothen@dsa-marketing.ag</a>, damit
                                    ich die Problemlösung hier hinzufügen kann.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <script>
            function isValidRegex(pattern) {
                try {
                    new RegExp(pattern);
                    return true;
                } catch (e) {
                    return false;
                }
            }

            function wrapMatches(regex, string) {
                return string.replace(regex, "<span class='match'>$&</span>");
            }

            function getRandomItem(arr) {
                let randomIndex = Math.floor(Math.random() * arr.length);
                return arr[randomIndex];
            }

            function loadText() {
                let texts = [
                    "Dies ist ein Test.\nDu kannst Ihn nach belieben ändern, er dient dem Zweck, dass du deine eingegebene " +
                    "Regular Expression testen kannst."
                ];

                let matches = document.querySelector("#regex_matches");
                matches.textContent = getRandomItem(texts);

                update();
            }

            $(function () {
                loadText();
            });

            function removeMatches(string) {
                return string.replace(/<span class="match">(.*?)<\/span>/g, "$1");
            }


            function update() {
                let matches = document.querySelector("#regex_matches");
                let regexText = document.querySelector("#regex").value;
                let regexReplaceText = document.querySelector("#replace").value;
                let regexReplacedField = document.querySelector("#regex_replaced");

                let mod_g = document.querySelector("#mod_g").checked;
                let mod_i = document.querySelector("#mod_i").checked;
                let mod_m = document.querySelector("#mod_m").checked;

                console.log("update");

                if (isValidRegex(regexText)) {
                    if (regexText.length > 0) {
                        let regex = new RegExp(regexText, (mod_g ? "g" : "") + (mod_i ? "i" : "") + (mod_m ? "m" : ""));
                        console.log("Regex:", regex);

                        matches.innerHTML = wrapMatches(regex, matches.textContent);

                        if (regexReplaceText.length > 0) {
                            regexReplacedField.style.display = "block";

                            // Replace the text
                            regexReplacedField.textContent = matches.textContent.replace(regex, function (match, ...captureGroups) {
                                let replacement = regexReplaceText;
                                captureGroups.forEach((captureGroup, index) => {
                                    replacement = replacement.replace(`$${index + 1}`, match);
                                });
                                return replacement;
                            });
                        } else {
                            regexReplacedField.style.display = "none";
                        }
                    } else {
                        matches.innerHTML = removeMatches(matches.innerHTML);
                    }
                }
            }
        </script>
    </body>
</html>