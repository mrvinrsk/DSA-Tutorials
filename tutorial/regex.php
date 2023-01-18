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
                            <input type='text' id='regex' oninput='update();' value='Test|[A-Z]' placeholder='Regular Expression'>
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

                        <input type='text' id='replace' oninput='update();' placeholder='Replacement'>
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
                        benötigte Regex wäre in diesem Fall <code class='inline'>[a-z]</code>
                    </p>
                </div>

                <div>
                    <h2>Häufig genutzte Regular Expressions</h2>

                    <div class="accordions" id='faq' data-close-others>
                        <div class="accordion">
                            <span>Username</span>
                            <div>
                                <p>
                                    Usernames sind sehr variabel, basierend auf Ihren Anforderungen, daher hier nur ein Beispiel:
                                </p>

                                <code>[a-zA-Z0-9]{3,15}</code>

                                <div class='buttons'>
                                    <button class='button no-underline' data-toggle-popup='regexplain-username'>Erklärung</button>
                                    <button class='button no-underline apply'>
                                        Im Playground übernehmen
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="accordion">
                            <span>E-Mails</span>
                            <div>
                                <p>
                                    E-Mails können teilweise sehr komplex sein und verschiedene Formate aufweisen, daher ist es
                                    schwierig eine perfekte Regular Expression dafür zu kreieren. Diese hier sollte allerdings
                                    die gängisten Formate abdecken:
                                </p>

                                <code>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}</code>

                                <div class='buttons'>
                                    <button class='button no-underline' data-toggle-popup='regexplain-mail'>Erklärung</button>
                                    <button class='button no-underline apply'>
                                        Im Playground übernehmen
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="accordion">
                            <span>Noch eine nützliche Regex auf Lager?</span>
                            <div>
                                <p>
                                    Hast du noch eine Regex gefunden/geschrieben, die hier fehlt? Maile sie mir an:
                                    <a href='mailto:m.rosskothen@dsa-marketing.ag'>m.rosskothen@dsa-marketing.ag</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <div class='popups'>
            <div class='popup explanation' id='regexplain-username'>
                <h3>Regex: Username – erklärt</h3>

                <code>[a-zA-Z0-9]{3,15}</code>

                <p>
                    <strong>[a-zA-Z0-9]</strong>
                    Alle Zeichen von a–z, A–Z und 0–9
                </p>
                <p><strong>{3,15}</strong> 3–15 Zeichen</p>
            </div>

            <div class='popup explanation' id='regexplain-mail'>
                <h3>Regex: Mail – erklärt</h3>

                <code>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}</code>

                <p>
                    <strong>[a-zA-Z0-9._%+-]+</strong>
                    Ein, oder mehrere Zeichen von A–Z, 0–9, oder Punkt, Unterstrich, Prozent, Plus, Minus
                </p>
                <p><strong>@</strong> Ein @ Zeichen</p>
                <p><strong>\.[a-zA-Z]{2,}</strong> Ein Punkt (.), gefolgt von mindestens zwei Zeichen von A–Z</p>
            </div>
        </div>

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

                document.querySelectorAll(".apply").forEach(apply => {
                    apply.addEventListener('click', () => {
                        document.querySelector("#regex").value = apply.parentElement.parentElement.querySelector("code").textContent;
                        update();
                    });
                });
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