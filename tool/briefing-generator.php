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

        <title>Briefing-Generator | by Marvin Roßkothen</title>

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
        <script async src='../js/add_elements.js'></script>
        <script async src='../js/conditional-checkbox.js'></script>
        <!-- <script src='../js/slide.js' async></script> -->
    </head>
    <body class="tutorial">
        <?php if (!isset($_GET['genonly'])) { ?>
            <a class='overlay-button' href='?genonly=1'>Nur den Generatoren anzeigen</a>
        <?php } ?>

        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>
        <main class="slide">
            <?php if (!isset($_GET['genonly'])) { ?>
                <div class='heading'>
                    <div class='heading-content'>
                        <h1>Briefing-Generator</h1>
                        <p class='short'>
                            Hier kannst du Briefings für das Design erstellen, die alle benötigten Informationen enthalten, sodass Rückfragen hoffentlich bald der Vergangenheit angehören.
                        </p>
                    </div>
                </div>
            <?php } ?>

            <div class='content'<?php echo(isset($_GET['genonly']) ? "style='padding-top: max(10vw, 5rem);'" : ""); ?>>
                <?php if (!isset($_GET['genonly'])) { ?>
                    <div class='dsgvo-media' data-alt='E-Mail App'
                         data-src='https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=1920&dpr=1'
                         data-src-mobile='https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=900&dpr=1'
                         data-custom-attribution="https://www.pexels.com/de-de/foto/person-die-auf-laptop-schreibt-1174775/"
                         data-custom-attribution-link="https://www.pexels.com/de-de/foto/person-die-auf-laptop-schreibt-1174775/">
                    </div>

                    <div>
                        <h2>Das Servicegespräch</h2>
                        <p>
                            Im Servicegespräch werden Informationen über die Wünsche vom Kunden eingeholt.
                        </p>

                        <ul>
                            <li>Wie soll das Produkt aussehen?</li>
                            <li>Was soll es können?</li>
                            <li>Gibt es bestehende Farben, Schriftarten, Logo?</li>
                            <li>etc.</li>
                        </ul>

                        <p>
                            Um es den Beratern einfacher zu machen (und unnötiges Hin-und-Her zu vermeiden), habe ich diese Seite programmiert – in der Hoffnung, dass wir Designer zukünftig direkt, nach dem
                            ersten Servicegespräch, alle benötigten Informationen, sowie Materialien zur Verfügung haben.
                        </p>
                    </div>
                <?php } ?>

                <div>
                    <?php if (!isset($_GET['genonly'])) { ?>
                        <h2>Generator</h2>
                    <?php } ?>

                    <div class='step-set'>
                        <div class='step product-type active'>
                            <h3>Um welchen Kunden geht es?</h3>
                            <input type='text' pattern='[0-9]' placeholder='Kundennummer' id='kdnr'>

                            <h3>Um was für eine Art Produkt handelt es sich?</h3>

                            <div class='button-set'>
                                <span class='button' data-step='specify-digital'>Digital</span>
                                <span class='button' data-step='unavailable'>Print</span>
                            </div>
                        </div>

                        <div class='step specify-digital'>
                            <h3>Um welches Digital-Produkt geht es?</h3>

                            <div class='button-set'>
                                <span class='button' data-step='fill-website-1'>Onepage / Website</span>
                                <span class='button' data-step='unavailable'>SEO / SUMO</span>
                                <span class='button' data-step='unavailable'>Imagepaket</span>
                                <span class='button' data-step='unavailable'>CMS</span>
                                <span class='button' data-step='unavailable'>Logo</span>
                                <span class='button' data-step='unavailable'>SpeedUp</span>
                                <span class='button' data-step='unavailable'>Jobs</span>
                            </div>

                            <div class='navigation'>
                                <span class='previous' data-step='product-type'>Zurück</span>
                            </div>
                        </div>

                        <div class='step website fill-website-1'>
                            <h3 class='mb-4'>Geht es um eine ganze Website, oder Onepage?</h3>

                            <div class='simpleflex radio_wrapper horizontal mb-2'>
                                <div class='radio' data-what='onepage'>
                                    Onepage
                                </div>

                                <div class='radio' data-what='website'>
                                    Website
                                </div>
                            </div>

                            <div class='navigation'>
                                <span class='previous' data-step='specify-digital'>Zurück</span>
                                <span class='next' data-step='fill-website-2'>Weiter</span>
                            </div>
                        </div>

                        <div class='step website fill-website-2'>
                            <h3>Funktionalität</h3>

                            <div class='accordion-flex'>
                                <div class='accordion-grid functionality mb-3'>
                                    <div class="cbw">
                                        <input type='checkbox' id='contact' data-what='contact-form' data-text='Kontaktformular'>
                                        <label for='contact'>Kontaktformular</label>
                                    </div>

                                    <div class="cbw">
                                        <input type='checkbox' id='call' data-what='call' data-text='Direktanruf'>
                                        <label for='call'>Direktanruf</label>
                                    </div>

                                    <div class="cbw">
                                        <input type='checkbox' id='editable' data-what='editable' data-text='Editierbare Seite'>
                                        <label for='editable'>Editierbare Seite</label>
                                    </div>

                                    <div class="cbw">
                                        <input type='checkbox' id='cms' data-what='cms' data-text='CMS'>
                                        <label for='cms'>CMS</label>
                                    </div>

                                    <div class="cbw">
                                        <input type='checkbox' id='shop' data-what='shop' data-text='Shop'>
                                        <label for='shop'>Shop-System</label>
                                    </div>

                                    <div class="cbw">
                                        <input type='checkbox' id='gallery' data-what='gallery' data-text='Bildergalerie'>
                                        <label for='gallery'>Bildergalerie</label>
                                    </div>

                                    <div class="cbw">
                                        <input type='checkbox' id='slider' data-what='slider' data-text='Slider'>
                                        <label for='slider'>Slider</label>
                                    </div>

                                    <div class="cbw">
                                        <input type='checkbox' id='maps' data-what='maps' data-text='Google Maps'>
                                        <label for='maps'>Google Maps</label>
                                    </div>

                                    <div class="cbw">
                                        <input type='checkbox' id='video' data-what='video' data-text='Video'>
                                        <label for='video'>Video</label>
                                    </div>
                                </div>

                                <div>
                                    <h4>Sonstiges</h4>
                                    <textarea placeholder='Sonstige Dinge, die beachtet werden sollen (bestimmte Felder im Kontaktformular, weitere Funktionen, etc.)...'></textarea>
                                </div>

                                <div class='navigation'>
                                    <span class='previous' data-step='fill-website-1'>Zurück</span>
                                    <span class='next' data-step='fill-website-3'>Weiter</span>
                                </div>
                            </div>
                        </div>

                        <div class='step website fill-website-3'>
                            <h3>Navigation</h3>
                            <p>
                                Welche Navigationspunkte wünscht sich der Kunde?
                            </p>

                            <ul class='add-elements'>
                                <li><input type='text' placeholder='Tippe etwas...'></li>
                            </ul>

                            <h3 class='mt-4'>Optik</h3>
                            <textarea placeholder='Hat der Kunde eigene Ideen?'></textarea>

                            <div class='navigation'>
                                <span class='previous' data-step='fill-website-2'>Zurück</span>
                                <span class='next' data-step='fill-website-4'>Weiter</span>
                            </div>
                        </div>

                        <div class='step website fill-website-4'>
                            <h3>Material</h3>

                            <div class='accordion-flex'>
                                <div class='conditional-cb'>
                                    <div class="cbw">
                                        <input type='checkbox' id='shop' data-what='contact-form' data-text='Kontaktformular'>
                                        <label for='shop'>Logo vorhanden?</label>
                                    </div>

                                    <div class='conditional-content' data-checked>
                                        <p>
                                            Bitte nehme uns ein wenig Arbeit ab und verlinke uns das Logo des Kunden bei WeTransfer, oder gib uns einen Direktlink zur Logo-Datei auf dem Server des Kunden. Ist
                                            natürlich keine Pflicht, aber du kannst dir ein lächelndes Klebesticker-Gesicht damit verdienen<span class='col-gray'>, denke ich...</span>
                                        </p>
                                        <input type='url' class='full mt-1' placeholder='URL zum Logo (WeTransfer, Website d. Kunden)'>
                                    </div>
                                </div>

                                <div class='conditional-cb'>
                                    <div class="cbw">
                                        <input type='checkbox' id='shop' data-what='contact-form' data-text='Kontaktformular'>
                                        <label for='shop'>Vorhandene Schriften?</label>
                                    </div>

                                    <div class='conditional-content' data-checked>
                                        <p>
                                            Bitte teile uns mit, welche Schriften auf der Seite verwendet werden sollen (nur die Schriftenfamilie, Schriftschnitte, wie "Thin", "Regular", etc. erkennen wir schon selbst).
                                            <span class='col-gray'>Mehrfach-Nennung durch drücken von "Enter" möglich.</span>
                                        </p>
                                        <ul class='add-elements'>
                                            <li><input type='text' placeholder='PT Sans'></li>
                                        </ul>
                                    </div>
                                </div>

                                <div class='conditional-cb'>
                                    <div class="cbw">
                                        <input type='checkbox' id='shop' data-what='contact-form' data-text='Kontaktformular'>
                                        <label for='shop'>Vorhandene Farben?</label>
                                    </div>

                                    <div class='conditional-content' data-checked>
                                        <p>
                                            Bitte nenne die Farben, die der Kunde sich wünscht.
                                            <span class='col-gray'>Weiß o.ä. kannst du hier weglassen.</span>
                                        </p>
                                        <ul class='add-elements'>
                                            <li><input type='text' placeholder='#CC0000'></li>
                                        </ul>

                                        <div class='conditional-cb'>
                                            <div class="cbw">
                                                <input type='checkbox' id='shop' data-what='contact-form' data-text='Kontaktformular'>
                                                <label for='shop'>Anpassung möglich?</label>
                                            </div>

                                            <div class='conditional-content' data-unchecked>
                                                <p>
                                                    Wähle diese Checkbox, wenn der Kunde seine Freigabe gibt, dass wir die Farben leicht von den genannten Variieren.
                                                    <span class='col-gray'>Beispielsweise andere Sättigung oder Helligkeit.</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class='navigation'>
                                <span class='previous' data-step='fill-website-2'>Zurück</span>
                                <span class='next' id='pdf-website'>Test PDF</span>
                            </div>
                        </div>

                        <div class='step deadline'>
                            <span class='small-headline'>Das wichtigste zuerst:</span>
                            <h3>Gibt es eine Deadline?</h3>

                            <div class='conditional-cb'>
                                <div class="cbw">
                                    <input type='checkbox' id='shop' data-what='contact-form' data-text='Kontaktformular'>
                                    <label for='shop'>Ja, für den...</label>
                                </div>

                                <div class='conditional-content' data-checked>
                                    <input type='text' placeholder='Deadline'>
                                </div>
                            </div>

                            <div class='navigation'>
                                <span class='next' data-step='product-type'>Weiter</span>
                            </div>
                        </div>

                        <!-- UNAVAILABLE -->
                        <div class='step unavailable'>
                            <h3>Nicht verfügbar</h3>
                            <p>Diese Funktionalität ist leider noch nicht programmiert worden, bitte nutze hierfür vorübergehend das alte SG-System in der Internen.</p>

                            <span class='previous' data-step='start'>Zurück</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <script async src='../js/stepsets.js'></script>
        <script>
            document.querySelector("#pdf-website").addEventListener("click", () => {
                let kdnr = document.querySelector('#kdnr').value;
                let func = "";

                each(".functionality", (el) => {
                    func = func.join("- " + el.dataset.text + "<br>");
                });


                let data = {
                    kd: kdnr,
                    website_type: document.querySelector('.website .radio_wrapper .radio.checked').dataset.what,
                    functionality: func
                };

                downloadPDF("../php/fw/briefing-website.php", `briefing-${kdnr}-website`, data);
            });
        </script>
    </body>
</html>