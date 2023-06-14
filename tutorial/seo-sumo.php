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

        <title>SEO / SUMO | by Marvin Roßkothen</title>

        <link href="../css/global.min.css" rel="stylesheet" />
        <link href="../css/tutorial.min.css" rel="stylesheet" />
        <link href="../css/media.min.css" rel="stylesheet" />

        <script src="../js/jquery-3.6.0.min.js"></script>
        <script src="../js/tutorial.js"></script>
        <script src="../js/anime.min.js"></script>
        <script src="../js/jquery.waypoints.min.js"></script>
        <script src="../js/main.js"></script>
        <script src="../js/popups.js"></script>
        <script src="../js/media.js"></script>
        <script src="../js/seo.js"></script>
        <!-- <script src='../js/slide.js' async></script> -->

        <script src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script>
        <script src="../js/checklist.js"></script>
    </head>
    <body class='tutorial'>
        <div class='popups'>
            <div class='popup' id='minify'>
                <h3>Minifizieren</h3>
                <p>Füge den zu minifizierenden Code in das Textfeld ein, der Output wird on the fly aktualisiert. </p>

                <textarea id='minify-input'></textarea>
                <div id='minify-output'>
                    <textarea readonly></textarea>
                </div>
            </div>

            <div class='popup' id='html-validator'>
                <h3>HTML Validator</h3>

                <textarea id='html-validate' oninput='updateHTMLValidate();'
                          placeholder='Code einfügen...' style='margin-bottom: 0;'></textarea>
                <p>Status: <span class='waiting' id='html-status'></span></p>

                <span><strong>Achtung:</strong> Der Validator ist noch nicht zu 100% zuverlässig, alternativ kannst du den <a href='https://validator.w3.org' target='_blank'>W3 Validator</a> nutzen.</span>
            </div>
        </div>

        <main class="slide">
            <div class="heading">
                <div class='heading-content'>
                    <h1>SEO / SUMO</h1>
                    <p class="short">
                        Eine SEO wird durchgeführt, um den Pagespeed zu verbessern und somit in den Suchergebnissen bei Google und
                        Co. höher platziert zu werden.
                        Hier erfährst du, wie du Sie durchführst.
                    </p>
                </div>
            </div>

            <div class="content">
                <div
                    class="dsgvo-media"
                    data-alt="SEO Bild"
                    data-src="https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=1920&dpr=1"
                    data-src-mobile="https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=768&dpr=1"
                ></div>

                <div>
                    <h2>Die ultimative Checklist</h2>
                    <p>
                        Hier findest du alle erforderlichen Schritte zur Bearbeitung deines Projektes. Kannst alles abhaken, so
                        kannst'e nix vergessen, praktisch 'wa?
                        <strong>Achtung:</strong> Wenn du die Seite neulädst werden alle Checkboxen zurückgesetzt, daher solltest
                        du deinen Fortschritt ab und zu, über den untenstehenden Button, speichern.
                    </p>

                    <div class="checklist ignore-animation" data-name='seocheck' data-show-completion>

                        <div class='checks'>
                            <div class='checklist-section'>
                                <h3>Head</h3>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Seitentitel: individuell pro Seite, max. 55 Zeichen (<a
                                                href='https://app.sistrix.com/de/serp-snippet-generator' target='_blank'>SISTRIX</a>)</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Description: individuell pro Seite, max. 155 Zeichen (<a
                                                href='https://app.sistrix.com/de/serp-snippet-generator' target='_blank'>SISTRIX</a>)</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Meta-Robots: Auf jeder Seite (<a
                                                href='https://seo-gold.com/meta-robots-seo-tutorial/meta-name-robots-content-index-follow/'
                                                target='_blank'>index, follow</a>)</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Meta-Angaben: Unnötige Meta-Tags (author, Revisit-After, etc.) entfernen, "OG" bestehen lassen</span>
                                    </div>
                                </div>
                            </div>

                            <div class='checklist-section'>
                                <h3>Body</h3>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>CSS auslagern (<a href='https://validator.w3.org/' target='_blank'>validieren</a> u. <a
                                                href='https://10015.io/tools/css-minifier'
                                                target='_blank'>komprimieren</a>)</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>JavaScript auslagern (<a href='https://10015.io/tools/javascript-minifier'
                                                                       target='_blank'>komprimieren</a>)</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Linktitel anpassen (max. 55 Zeichen), kurz u. prägnant – auf Mac einfach Ordner im Terminal öffnen und <code>find -E . -type f -regex '.*/[^/]{55,}'</code> einfügen und ggf. alle angezeigten Dateien umbenennen.</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>HTML <a href='https://validator.w3.org/' target='_blank'>validieren</a></span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Jede Seite muss eine individuelle H1-Überschrift haben</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Keine IDs o. Klassen mit den Namen "SEO", "Sumo", oder Keywords</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Alt-Attribut für Bilder, umbenennen (keine Unterstriche / Leerzeichen), Title-Attribut setzen; wenn deine IDE Regular Expression Search unterstützt einfach nach <code>(&lt;img(?!.*?alt=(['"]).*?\2)[^>]*)(>)</code> suchen.</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Überschriften-Hierarchie prüfen (H1–H6)</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Auflistungen als Liste (ul / ol) einsetzen</span>
                                    </div>
                                </div>
                            </div>

                            <div class='checklist-section'>
                                <h3>Landingpages</h3>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Namen nach Syntax: "werbeagentur-oberhausen.html"</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Landingpage auf allen Seiten verlinken</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Text einfügen und gestalten
                                            <div class='explanation'>
                                                Beim einfügen der Texte darauf achten, dass die fetten Wörter 1:1 übernommen werden. Dazu kannst du ganz einfach den Text aus der Word-Datei kopieren, <a
                                                    href="../tool/word-to-html" target="_blank">hier</a> einfügen und dir das fertige HTML dafür kopieren.
                                            </div>
                                        </div>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Bilder verwenden</span>
                                    </div>
                                </div>
                            </div>

                            <div class='checklist-section'>
                                <h3>Sonstiges</h3>

                                <div>
                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Flache Ordnerstrukturen schaffen</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Eindeutige URLs (leistungen.html, kontakt.html, etc.)</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Robots.txt prüfen / hinzufügen</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>htaccess hinzufügen u. Wirkung testen (weiterleitung von Domain ohne 'www.' zu Domain mit 'www.'</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Seite bei den <a href='https://search.google.com/search-console/' target='_blank'>Google-Webmastertools</a> eintragen u. verifizieren</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <div>Sitemap.xml <a href='https://www.xml-sitemaps.com' target='_blank'>erzeugen</a> u. über <a
                                                href='https://search.google.com/search-console/' target='_blank'>Webmastertools</a> einreichen
                                            <div class='explanation'>
                                                <p>
                                                    Lege eine neue Property an, nutze dafür die Variante "URL-Präfix" und füge die URL deiner Seite ein.
                                                    Anschließend kannst du die Sitemap einreichen.
                                                </p>

                                                <img src='../images/google-property.jpg' alt='Google Property erstellen'>
                                            </div>
                                        </div>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Wenn HTML-Dateinamen geändert wurden: Alten Namen per Robots.txt aussperren, 301 Weiterleitung per .htaccess</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Für gelöschte Seiten bei <a href='https://search.google.com/search-console/'
                                                                          target='_blank'>Webmastertools</a> einen Antrag auf Entfernung einreichen</span>
                                    </div>

                                    <div class='check'>
                                        <div class="checkbox-wrapper"><input type='checkbox'></div>
                                        <span>Seiten <a href='https://www.deadlinkchecker.com' target='_blank'>auf defekte Links prüfen</a> und ggf. beheben</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div>
                    <h2>Zum Download</h2>
                    <p>
                        Hier findest du Materialien, welche du ggf. zur Bearbeitung benötigst.
                    </p>

                    <div class='dl-list'>
                        <a class='button small' data-hover-text='Download' download href='../dl/_.htaccess'
                           target='_blank'>.htaccess</a>
                        <a class='button small' data-hover-text='Download' download href='../dl/_robots.txt' target='_blank'>robots.txt</a>
                    </div>
                    <span class='notice'><strong>Achtung:</strong> Bei den Dateinamen der heruntergeladenen Dateien muss jeweils der Unterstrich ("_") entfernt werden.</span>
                </div>

                <div id='tools'>
                    <h2>Tools</h2>

                    <div class='dl-list'>
                        <a class='button small' data-toggle-popup='minify'>Minify</a>
                        <a class='button small' data-toggle-popup='html-validator'>HTML Validator</a>
                    </div>
                </div>

                <div>
                    <h2>Danach...</h2>
                    <p>
                        Wenn du die Checkliste abgearbeitet hast, kannst du <a href='https://www.seobility.net/de/seocheck/'
                                                                               target='_blank'>hier</a> zur Sicherheit nochmal
                        einen oberflächlichen SEO-Check ausführen um zu schauen, ob du nichts vergessen hast.
                    </p>
                </div>
            </div>
        </main>

        <script src='../js/tutorial.js'></script>

    </body>
</html>
