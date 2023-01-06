<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">

        <link rel="stylesheet" href="css/global.min.css">
        <link rel="stylesheet" href="css/index.min.css">

        <title>DSA Tutorials | by Marvin Roßkothen</title>

        <script src='js/jquery-3.6.0.min.js'></script>
        <script src='js/anime.min.js'></script>
        <script src='js/jquery.waypoints.min.js'></script>
        <script src='js/main.js'></script>
    </head>
    <body>
        <div class='popups'>
            <div class='popup' id='unavailable'>
                <h3>Deaktiviert</h3>
                <p>Der angeforderte Artikel ist aktuell leider nicht verfügbar, versuche es bald erneut.</p>
            </div>
        </div>

        <main>
            <div class='heading'>
                <h1>DSA-Tutorials</h1>
                <p>DSA-Tutorials ist eine, von Marvin Roßkothen erstellte, Sammlung an Tutorials und Ressourcen welche den Mitarbeitern der <a href='https://dsa-marketing.ag/' target='_blank'>dsa&nbsp;Marketing&nbsp;AG</a> zugute kommen soll. Sämtliches Feedback bitte per Mail an <a href='mailto:m.rosskothen@dsa-marketing.ag'>m.rosskothen@dsa-marketing.ag</a>.</p>
            </div>

            <div class='search-information'>

            </div>

            <div class='tutorials grid'>
                <!-- JS -->
            </div>
        </main>

        <div class='changelog center'>
            <h3>Changelog</h3>

            <h4>Hinzugefügt</h4>
            <ul>
                <li>Checklist-Erklärung wird bei fertigstellung versteckt</li>
                <li>Securecheck-Generator hinzugefügt</li>
            </ul>

            <h4>Geändert</h4>
            <ul>
                <li>Checklist-Boxen Design geändert</li>
                <li>Neutralere Farben (UX)</li>
                <li>Bessere Popups (z.B. beim Kopieren von Code & Zugangsdaten)</li>
                <li>Table-Styling</li>
                <li>Tutorial-Tags werden alphabetisch sortiert</li>
                <li>Mehr Platz für Tutorials auf der Startseite</li>
            </ul>

            <h4>Entfernt</h4>
            <ul>
                <li>-</li>
            </ul>
        </div>

        <script src='js/loadtutorials.mjs'>
            $(function () {
                addLoading(true);
            });
        </script>
        <script type='module'>
            loadTutorials(false);
        </script>
        <script src='js/popups.js' defer async></script>
    </body>
</html>