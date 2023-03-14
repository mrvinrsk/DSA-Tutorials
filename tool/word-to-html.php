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

        <title>Word 2 HTML | by Marvin Roßkothen</title>

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
                    <h1>Word 2 HTML</h1>
                    <p class='short'>
                        Hier kannst du simpel SEO-Texte in HTML umwandeln um deine SUMOs schnell wieder loszuwerden.
                    </p>
                </div>
            </div>

            <div class='content'>
                <div class='dsgvo-media' data-alt='E-Mail App'
                     data-src='https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=1920&dpr=1'
                     data-src-mobile='https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=900&dpr=1'
                     data-custom-attribution="https://www.pexels.com/de-de/foto/person-die-auf-laptop-schreibt-1174775/"
                     data-custom-attribution-link="https://www.pexels.com/de-de/foto/person-die-auf-laptop-schreibt-1174775/">
                </div>

                <div>
                    <div id="word" contenteditable="true"></div>
                    <textarea id="output" readonly></textarea>
                    <div class="buttons">
                        <a class="button" id="copy-html" disabled>HTML kopieren</a>
                    </div>
                </div>
            </div>

            <script>
                function convertToHTML(text) {
                    if (!text.trim()) {
                      return "";
                    }
                
                    var div = document.createElement("div");
                    div.innerHTML = text.trim();
                
                    // Remove any style tags and their content
                    var styleTags = div.getElementsByTagName("style");
                    for (var i = styleTags.length - 1; i >= 0; i--) {
                      styleTags[i].parentNode.removeChild(styleTags[i]);
                    }
                
                    // Remove any classes from the input
                    var elements = div.getElementsByTagName("*");
                    for (var i = 0; i < elements.length; i++) {
                      elements[i].removeAttribute("class");
                    }
                
                    // Remove line-breaks if there are more than two at once
                    var html = div.innerHTML.replace(/[\r\n]{3,}/g, "\n\n");
                
                    // Replace unsupported tags with HTML equivalents
                    html = html.replace(/<b>(.*?)<\/b>/gi, "<strong>$1</strong>");
                    html = html.replace(/<i>(.*?)<\/i>/gi, "<em>$1</em>");
                    html = html.replace(/<u>(.*?)<\/u>/gi, "<u>$1</u>");
                
                    // Remove leading and trailing spaces and line-breaks at the end
                    html = html.replace(/^[\s\n]+|[\s\n]+$/g, "");
                
                    return html;
                }


                document.querySelector('#word').addEventListener('keyup', () => {
                    let input = document.querySelector('#word');
                    let output = document.querySelector('#output');
                    let copyBtn = document.querySelector('#copy-html');

                    let result = convertToHTML(input.innerHTML);

                    output.value = result;

                    if(result.length >= 1) {
                        copyBtn.disabled = false;
                    }else {
                        copyBtn.disabled = true;
                    }
                });

                document.querySelector('#copy-html').addEventListener('click', () => {
                    let input = document.querySelector('#word');
                    let copyBtn = document.querySelector('#copy-html');
                    let output = document.querySelector('#output');
                    let result = convertToHTML(input.innerHTML);

                    copyTextToClipboard(result);
                    copyBtn.classList.add('copied');

                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                    }, 1500);
                });
            </script>
        </main>
    </body>
</html>