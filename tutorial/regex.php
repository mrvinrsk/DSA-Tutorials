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

                    <div class='buttons let'>
                        <button class='button' onclick='update();'>Aktualisieren</button>
                        <button class='button' onclick='explainRegex(document.querySelector("#regex").value);'>
                            Erklären
                        </button>
                        <button class='button' onclick='copyRegex();'>Kopieren</button>
                    </div>
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
                                    <button class='button no-underline' data-toggle-popup='explanation-moved'>Erklärung</button>
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
                                    <button class='button no-underline' data-toggle-popup='explanation-moved'>Erklärung</button>
                                    <button class='button no-underline apply'>
                                        Im Playground übernehmen
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="accordion">
                            <span>Passwörter</span>
                            <div>
                                <p>
                                    Diese Regular Expression dient nur als Beispiel und sollte je nach individuellen Anforderungen angepasst werden.
                                </p>

                                <code>(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}</code>

                                <div class='buttons'>
                                    <button class='button no-underline' data-toggle-popup='explanation-moved'>Erklärung</button>
                                    <button class='button no-underline apply'>
                                        Im Playground übernehmen
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="accordion">
                            <span>URLs</span>
                            <div>
                                <p>URLs treten in vielen verschiedenen Formaten auf, daher ist es schwierig alle abzudecken. Diese Regex sollte dennoch den größten Teil abdecken.</p>

                                <code>(((s*)(ftp)(s*)|(http)(s*)|mailto|news|file|webcal):(\S*))|((www.)(\S*))</code>

                                <div class='buttons'>
                                    <button class='button no-underline' data-toggle-popup='explanation-moved'>Erklärung</button>
                                    <button class='button no-underline apply'>
                                        Im Playground übernehmen
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="accordion">
                            <span>Hexcode</span>
                            <div>
                                <code>#?([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?</code>

                                <div class='buttons'>
                                    <button class='button no-underline' data-toggle-popup='explanation-moved'>Erklärung</button>
                                    <button class='button no-underline apply'>
                                        Im Playground übernehmen
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="accordion">
                            <span>HTML Tags</span>
                            <div>
                                <code><.([^>]*[^/])></code>

                                <div class='buttons'>
                                    <button class='button no-underline' data-toggle-popup='explanation-moved'>Erklärung</button>
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
            <div class='popup explanation' id='regexplain-userinput'>
                <h3>Regex: Deine Eingabe – erklärt</h3>
                <p class='disabled-text'>
                    <strong>Achtung:</strong>
                    Diese Funktion ist aktuell noch in der Beta und kann Fehler aufweisen.
                </p>

                <div class='code-display' id='regex-userinput'></div>

                <p>Diese Regular Expression setzt sich aus den folgenden Elementen zusammen:</p>
                <div id='regex-userinput-explanation'></div>

                <p class='disabled-text'>Fahre mit der Maus über ein Element, um es in der Expression hervorzuheben.</p>
            </div>

            <div class='popup explanation' id='explanation-moved'>
                <h3>Regex: Deine Eingabe – erklärt</h3>
                <p>
                    Die Erklärung der Regular Expressions wurde verschoben. Übernehme die gewünschte Expression in den Playground, indem du den
                    dafür vorgesehenen Button drückst, und klicke dann im Playground auf "Erklären"
                </p>
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

            function copyRegex() {
                copyTextToClipboard(document.querySelector("#regex").value);
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

                        matches.innerHTML = wrapMatches(regex, matches.textContent.replace("<", "&lt;").replace(">", "&gt;"));

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

            function joinWithOr(arr) {
                const allButLast = arr.slice(0, -1).join(", ");
                const last = arr.slice(-1);
                return allButLast.length > 0 ? allButLast + ", oder " + last : last;
            }

            function getRange(str) {
                const range = str.split("-");
                const start = range[0];
                const end = range[1];
                const characters = [];
                for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
                    characters.push(String.fromCharCode(i));
                }
                return characters;
            }

            function getCharRanges(str) {
                const ranges = [];
                const regex = /\[([^\]]+)\]/g;
                let match;
                while ((match = regex.exec(str)) !== null) {
                    const range = match[1];
                    const rangeArr = range.split('');
                    let currentRange = rangeArr[0];
                    for (let i = 1; i < rangeArr.length; i++) {
                        const char = rangeArr[i];
                        if (char === "-") {
                            if (i + 1 < rangeArr.length) {
                                currentRange += char + rangeArr[i + 1];
                                i++;
                            } else {
                                ranges.push(currentRange);
                                ranges.push(char);
                                currentRange = "";
                            }
                        } else {
                            if (currentRange.length > 0) {
                                ranges.push(currentRange);
                                currentRange = char;
                            } else {
                                currentRange = char;
                            }
                        }
                    }
                    if (currentRange.length > 0) {
                        ranges.push(currentRange);
                    }
                }
                return ranges;
            }

            function wrapInSpan(str, start, end, classString) {
                let wrappedString = str.slice(0, start) +
                    `<span class="${classString}">` +
                    str.slice(start, end) +
                    '</span>' +
                    str.slice(end);
                return wrappedString;
            }

            function explainRegex() {
                let mod_g = document.querySelector("#mod_g").checked;
                let mod_i = document.querySelector("#mod_i").checked;
                let mod_m = document.querySelector("#mod_m").checked;

                let explanation = [];

                let regex = new RegExp(document.querySelector("#regex").value, (mod_g ? "g" : "") + (mod_i ? "i" : "") + (mod_m ? "m" : ""));
                console.log("Regular expression: " + regex);
                console.log("");

                let pattern = regex.source;
                let flags = regex.flags;
                let groups = 0;

                let captureGroup = /\(([^?])/g;
                let captureGroupMatch = pattern.match(captureGroup);
                if (captureGroupMatch) {
                    for (let i = 0; i < captureGroupMatch.length; i++) {
                        let group = captureGroupMatch[i];

                        groups++;
                        explanation.push({
                            type: 'group',
                            index: pattern.indexOf(group),
                            description: `Gruppe $${groups}`
                        });
                    }
                }

                let nonCaptureGroup = /\((\?[^:])/g;
                let nonCaptureGroupMatch = pattern.match(nonCaptureGroup);
                if (nonCaptureGroupMatch) {
                    for (let i = 0; i < nonCaptureGroupMatch.length; i++) {
                        let group = nonCaptureGroupMatch[i];

                        explanation.push({
                            type: 'non-capturing group',
                            index: pattern.indexOf(group),
                            description: `Ungewertete Gruppe`
                        });
                    }
                }

                let charClass = /\[[^\]]*]/g;
                let charClassMatch = pattern.match(charClass);
                if (charClassMatch) {
                    for (i = 0; i < charClassMatch.length; i++) {
                        let charClassPart = charClassMatch[i];
                        if (charClassPart.includes("-")) {
                            let rangesLi = getCharRanges(charClassPart);
                            let ranges = [];
                            rangesLi.forEach(range => {
                                if (range.includes("-")) {
                                    ranges.push("<span class='code-display inline' title='" + getRange(range).join(", ") + "'>" + range + "</span>");
                                } else {
                                    ranges.push("<span class='code-display inline'>" + range + "</span>");
                                }
                            });
                            ranges = joinWithOr(ranges);

                            explanation.push({
                                type: 'charrange',
                                index: pattern.indexOf(charClassPart),
                                description: `<strong>${charClassPart}</strong> Beliebiges Zeichen von ` + ranges
                            });
                        } else {
                            explanation.push({
                                type: 'charset',
                                index: pattern.indexOf(charClassPart),
                                description: `<strong>${charClassPart}</strong> Beliebiges Zeichen aus Liste: ` + charClassPart.replace("[", "").replace("]", "").split("").join(", ")
                            });
                        }
                    }
                }

                let quantifiers = /{[0-9]+,?[0-9]*}/g;
                let quantifiersMatch = pattern.match(quantifiers);
                if (quantifiersMatch) {
                    for (i = 0; i < quantifiersMatch.length; i++) {
                        let quantifier = quantifiersMatch[i];
                        if (quantifier.includes(",")) {
                            let range = quantifier.slice(1, -1).split(",");
                            if (range[1] === "") {
                                explanation.push({
                                    type: 'quantifier',
                                    index: pattern.indexOf(quantifier),
                                    description: `<strong>${quantifier}</strong> Mindestens ` + range[0] + ` Wiederholungen des vorangegangenen Elements`
                                });
                            } else {
                                explanation.push({
                                    type: 'quantifier',
                                    index: pattern.indexOf(quantifier),
                                    description: `<strong>${quantifier}</strong> Zwischen ` + range[0] + ` und ` + range[1] + ` Wiederholungen des vorangegangenen Elements`
                                });
                            }
                        } else {
                            explanation.push({
                                type: 'quantifier',
                                index: pattern.indexOf(quantifier),
                                description: "Genau " + quantifier.slice(1, -1) + " Wiederholungen des vorangegangenen Elements"
                            });
                        }
                    }
                }

                let or = /[|]/g;
                let orMatch = pattern.match(or);
                if (orMatch) {
                    for (i = 0; i < orMatch.length; i++) {
                        let currentOr = orMatch[i];
                        explanation.push({
                            type: 'or',
                            index: pattern.indexOf(currentOr),
                            description: `<strong>${orMatch}</strong> Oder`
                        });
                    }
                }

                let plus = /[^\\]\+/g;
                let plusMatch = pattern.match(plus);
                if (plusMatch) {
                    for (i = 0; i < plusMatch.length; i++) {
                        let currentPlus = plusMatch[i];

                        explanation.push({
                            type: 'plus',
                            index: pattern.indexOf(currentPlus),
                            description: `<strong>${currentPlus}</strong> Ein- oder mehrmals das vorangegangene Element`
                        });
                    }
                }

                let star = /[^\\]\*/g;
                let starMatch = pattern.match(star);
                if (starMatch) {
                    for (i = 0; i < starMatch.length; i++) {
                        let currentStar = starMatch[i];

                        explanation.push({
                            type: 'star',
                            index: pattern.indexOf(currentStar),
                            description: `<strong>${currentStar}</strong>Keine oder mehr Wiederholungen des vorangegangenen Elements`
                        });
                    }
                }

                let wordBoundary = /\\b.*?\\b/g;
                let wordBoundaryMatch = pattern.match(wordBoundary);
                if (wordBoundaryMatch) {
                    for (i = 0; i < wordBoundaryMatch.length; i++) {
                        let currentWordBoundary = wordBoundaryMatch[i];
                        let w = currentWordBoundary.replace(/\\b/g, "");

                        explanation.push({
                            type: 'wordboundary',
                            index: pattern.indexOf(currentWordBoundary),
                            description: `<strong>${currentWordBoundary}</strong>Wort: ${w}`
                        });
                    }
                }

                let ws = /\\s/g;
                let wsMatch = pattern.match(ws);
                if (wsMatch) {
                    for (i = 0; i < wsMatch.length; i++) {
                        let currentWS = wsMatch[i];

                        explanation.push({
                            type: 'non whitespace',
                            index: pattern.indexOf(currentWS),
                            description: `<strong>${currentWS}</strong>Whitespace`
                        });
                    }
                }

                let plain = /(?<!\\)(?<!\/)([^\[\]\{\}\(\)\*\+\?\|\.\^\$\\\/]+)(?=\||$)/g;
                let plainMatch = pattern.match(plain);
                if (plainMatch) {
                    for (i = 0; i < plainMatch.length; i++) {
                        let currentPlain = plainMatch[i];

                        explanation.push({
                            type: 'plain text',
                            index: pattern.indexOf(currentPlain),
                            description: `<strong>${currentPlain}</strong>Exakt: ${currentPlain}`
                        });
                    }
                }

                let nonWS = /\\S/g;
                let nonWSMatch = pattern.match(nonWS);
                if (nonWSMatch) {
                    for (i = 0; i < nonWSMatch.length; i++) {
                        let currentNonWS = nonWSMatch[i];

                        explanation.push({
                            type: 'non whitespace',
                            index: pattern.indexOf(currentNonWS),
                            description: `<strong>${currentNonWS}</strong>Beliebiges Zeichen, das kein Whitespace ist`
                        });
                    }
                }

                let word = /\\w/g;
                let wordMatch = pattern.match(word);
                if (wordMatch) {
                    for (i = 0; i < wordMatch.length; i++) {
                        let currentWord = wordMatch[i];

                        explanation.push({
                            type: 'word',
                            index: pattern.indexOf(currentWord),
                            description: `<strong>${currentWord}</strong>Beliebiges alphabetisches oder numerisches Zeichen`
                        });
                    }
                }


                let userinputregex = document.querySelector("#regex-userinput");
                let expl = document.querySelector("#regex-userinput-explanation");

                userinputregex.innerHTML = document.querySelector("#regex").value;
                expl.innerHTML = "";

                let ul = document.createElement("ul");

                explanation = explanation.sort((a, b) => {
                    return a.index - b.index;
                });

                explanation.forEach((el) => {
                    let li = document.createElement("li");
                    li.innerHTML = el.description;
                    li.addEventListener('mouseenter', () => {
                        let completeRegex = pattern;
                        let index = el.index;
                        let part = li.querySelector("strong").textContent;

                        let marked = wrapInSpan(completeRegex, index, (index + part.length), 'highlight');
                        userinputregex.innerHTML = marked;
                    });

                    li.addEventListener('mouseleave', () => {
                        userinputregex.innerHTML = pattern;
                    });

                    ul.appendChild(li);
                });

                expl.appendChild(ul);
                togglePopup("regexplain-userinput");
            }
        </script>
    </body>
</html>