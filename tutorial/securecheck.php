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

        <title>Securecheck durchführen | by Marvin Roßkothen</title>

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
        <!-- <script src='../js/slide.js' async></script> -->

        <!-- <script src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script> -->
        <script src="../js/checklist.js"></script>
    </head>
    <body class="tutorial">
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>

        <div class='popups'>
            <div class='popup' id='reliability'>
                <h3>Zuverlässigkeit des internen Validators</h3>
                <p>Aufgrund seiner Schlichtheit ist der Validator nicht zu 100% verlässlich, so wurden bereits folgende Probleme
                   entdeckt:</p>

                <h4>Code wird als valide angezeigt, obwohl...</h4>
                <ul style='display: flex; flex-direction: column; gap: .35em;'>
                    <li>es keinen <code class='no-copy inline'>&lt;title&gt;</code> Tag gibt.</li>
                    <li>bspw. ein <code class='no-copy inline'>&lt;h1&gt;</code> Tag einen schließenden <code class='no-copy'>&lt;/h2&gt;</code>
                        Tag hat.
                    </li>
                </ul>

                <p>Daher sollte der interne Validator nur im Notfall oder für einen oberflächlichen Check verwendet werden,
                   alternativ steht der W3Schools Validator <a href='https://validator.w3.org/#validate_by_input' target='_blank'>hier</a>
                   zur Verfügung.</p>
            </div>
        </div>

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
                        data-src="https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        data-src-mobile="https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg?auto=compress&cs=tinysrgb&w=900&dpr=1"
                ></div>

                <div>
                    <h2>Die nötigen Schritte</h2>
                    <p>Einfach abhaken was schon erledigt ist, have fun mate.</p>
                    <input id='kdnr' pattern='\d' placeholder='Kundennummer' type='text'>

                    <div class="checklist ignore-animation" data-name='securecheck'>

                        <div class='checks'>
                            <div class='checklist-section'>
                                <h3>Funktionalität</h3>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='HTML validieren' id='html-validation-check'>
                                            <input type='checkbox'></div>
                                        <div>HTML validieren
                                            <div class='explanation'>
                                                <h3>Validierung durchführen</h3>
                                                <p>
                                                    Die Validierung kannst du entweder mit dem <a
                                                            href='https://validator.w3.org/#validate_by_input' target='_blank'>Validator
                                                                                                                               von
                                                                                                                               W3Schools</a>,
                                                    oder direkt hier durchführen.
                                                    Bitte beachte, dass dieser Check keine Warnings (z.B. fehlende Überschriften
                                                    in <code class='no-copy inline'>&lt;section&gt;</code>) berücksichtigt. Dieser
                                                    Check ist <span class='tooltip' data-toggle-popup='reliability'
                                                                    data-tooltip='Mehr Informationen'>nicht zu 100% zuverlässig</span>.
                                                </p>

                                                <textarea id='html-validate' oninput='updateHTMLValidate();'
                                                          placeholder='Code einfügen...' style='margin-bottom: 0;'></textarea>
                                                <p>Status: <span class='waiting' id='html-status'></span></p>
                                                <br>
                                                <p>Errors <strong>müssen</strong> behoben werden, Warnings sind nicht zwingend
                                                   notwendig.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Externe Links prüfen'><input type='checkbox'>
                                        </div>
                                        <div>Funktionieren alle <a href='https://www.deadlinkchecker.com/' target='_blank'>externen
                                                                                                                           Links</a>?
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"
                                             data-missing='Parallaxe müssen mobile background-position: scroll sein'><input
                                                    type='checkbox'></div>
                                        <div>Parallaxe auf mobile prüfen
                                            <div class='explanation'>
                                                <p>Parallaxe (<code class='no-copy inline'>background-position: fixed;</code>)
                                                   funktionieren am Handy nicht, daher muss für mobile Geräte die <code
                                                            class='no-copy inline'>background-position</code> auf <code
                                                            class='no-copy inline'>scroll</code> gesetzt werden.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"
                                             data-missing='JavaScript-Elemente (Popups, Accordions, Buttons, etc.) prüfen'><input
                                                    type='checkbox'></div>
                                        <div>Funktionieren alle JavaScript-Elemente (Popups, Accordions, Buttons, etc.)?</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Fehler in der Konsole'><input type='checkbox'>
                                        </div>
                                        <div>Prüfen, ob es Fehler in der Konsole gibt.</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"
                                             data-missing='Plugins (Maps, Cookies, YouTube, etc.) richtig einbauen'><input
                                                    type='checkbox'></div>
                                        <div>Alle Plugins korrekt eingebunden (Maps, Cookies, YouTube, etc.)?</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Matomo auf jeder Unterseite einbinden'><input
                                                    type='checkbox'></div>
                                        <div>Matomo eingebunden</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Externe Links mit target="_blank" öffnen'>
                                            <input type='checkbox'></div>
                                        <div>Werden alle externen Links in neuem Tab geöffnet?</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Favicon & Apple-Touch-Icon einbinden'><input
                                                    type='checkbox'></div>
                                        <div>Favicon & Apple-Touch-Icon eingebunden?</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"
                                             data-missing='.htaccess, 404-Seite und robots.txt einbinden'><input type='checkbox'>
                                        </div>
                                        <div>.htaccess, 404-Seite und robots.txt eingebunden?</div>
                                    </div>
                                </div>
                            </div>

                            <div class='checklist-section'>
                                <h3>Bilder</h3>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Alle Stock-Bilder lizensieren'><input
                                                    type='checkbox'></div>
                                        <div>Bilder gekauft?</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"
                                             data-missing='Bilder als .jpg oder bestenfalls als .webp einbinden'><input
                                                    type='checkbox'></div>
                                        <div>Angemessenes Format?</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Bildquellen im Impressum eintragen'><input
                                                    type='checkbox'></div>
                                        <div>Bildquellen im Impressum</div>
                                    </div>
                                </div>
                            </div>

                            <div class='checklist-section'>
                                <h3>Rechtliches</h3>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Datenschutz und/oder Impressum fehlt'><input
                                                    type='checkbox'></div>
                                        <div>Datenschutz & Impressum eingebunden?</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Impressum unvollständig'><input
                                                    type='checkbox'></div>
                                        <div>Impressum vollständig</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Datenschutz und/oder Impressum fehlt'><input
                                                    type='checkbox'></div>
                                        <div>Datenschutz & Impressum immer sichtbar?
                                            <div class='explanation'>
                                                <p><strong>Abklären:</strong> Laut einigen Quellen scheint dies nicht nötig zu
                                                                              sein, solange beides mit max. 2 Klicks erreichbar,
                                                                              an geläufigen Positionen eingebunden und nicht
                                                                              versteckt ist.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"
                                             data-missing='Fonts lokal einbinden (https://gwfh.mranftl.com/fonts)'><input
                                                    type='checkbox'></div>
                                        <div>Alle Fonts lokal eingebunden?
                                            <div class='explanation'>
                                                <p>Fonts dürfen dank der DSGVO nicht mehr, ohne Einwilligung vom Nutzer, von
                                                   externen Servern geladen werden. Daher müssen wir auf die Nutzung von Adobe
                                                   Fonts verzichten und Google Fonts <a href='https://gwfh.mranftl.com/fonts'
                                                                                        target='_blank'>lokal</a> einbinden.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class='checklist-section'>
                                <h3>Sonstiges</h3>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper" data-missing='Lektorat veranlassen'><input type='checkbox'>
                                        </div>
                                        <div>Lektorat erledigt?</div>
                                    </div>
                                </div>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"
                                             data-missing='Mailto, Datenschutzerklärung und Kontaktformular stylen'><input
                                                    type='checkbox'></div>
                                        <div>Mailto, Datenschutzerklärung und Kontaktformular gestyled?</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2>Einfach runterladen</h2>
                    <p>
                        Machst du einen Securecheck <strong>für</strong> jemanden und hast keine Lust den Securecheck noch separat
                        zu verschriftlichen?
                        Dann kannst du dir hier einfach einen aus deinen Angaben in der Checkliste generieren lassen.
                    </p>

                    <div class='buttons left small'>
                        <button class='button' id='generate-check-file' onclick='generateCheck();'>Generieren</button>
                    </div>
                </div>
            </div>
        </main>

        <script defer>
            function generateCheck() {
                let missing = document.querySelectorAll("[data-name='securecheck'] [data-missing]:not(.checked)");
                let kdnr = (document.querySelector("#kdnr").value.length > 0 ? document.querySelector("#kdnr").value : 0);
                let allMissings = [];

                missing.forEach(missing => {
                    let missingText = missing.dataset.missing;

                    allMissings.push(missingText);
                });

                let list = "";
                if (missing.length >= 1) {
                    list = allMissings.map(item => `- ${item}\n`).join("");
                } else {
                    list = "- Nichts, herzlichen Glückwunsch!"
                }
                let text = [
                    "Securecheck",
                    "Beim Securecheck zum Kunden " + kdnr + " sind folgende Dinge aufgefallen, die noch erledigt werden müssen bevor du das Projekt umstellen kannst:",
                    "",
                    list,
                    "",
                    "Bitte beachte allgemein, dass Dinge wie SEO-Texte von alten HPs übernommen werden und vor dem Upload von der alten Seite ein Backup gemacht werden muss.",
                    "",
                    "",
                    "Generiert durch: " + window.location,
                    "(Entwickelt von Marvin Roßkothen)"
                ];

                text = text.join("\n");
                download("securecheck-" + kdnr + ".txt", text);
            }

            updateHTMLValidate();
        </script>
    </body>
</html>