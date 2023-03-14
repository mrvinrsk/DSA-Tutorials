<?php
$json = file_get_contents('tutorials.json');
$data = json_decode($json, true);
$filter = "";
if (isset($_GET["tag"])) {
    $filter = $_GET["tag"];
    $results = 0;
    foreach ($data as $entry) {
        if (in_array($filter, $entry["tags"])) {
            $results++;
        }
    }
}

$tags = array();
foreach ($data as $entry) {
    foreach ($entry["tags"] as $tag) {
        if (!in_array($tag, $tags)) {
            $tags[] = $tag;
        }
    }
}
sort($tags);

?>
<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">

        <link rel="stylesheet" href="css/global.min.css">
        <link rel="stylesheet" href="css/index.min.css">

        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
        <link rel="manifest" href="site.webmanifest">
        <link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">

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
                <p>DSA-Tutorials ist eine, von Marvin Roßkothen erstellte, Sammlung an Tutorials und Ressourcen welche den
                   Mitarbeitern der <a href='https://dsa-marketing.ag/' target='_blank'>dsa&nbsp;Marketing&nbsp;AG</a> zugute
                   kommen soll. Sämtliches Feedback bitte per Mail an <a href='mailto:m.rosskothen@dsa-marketing.ag'>m.rosskothen@dsa-marketing.ag</a>.
                </p>
            </div>

            <div class='search-buttons-container'>
                <span>Nach Tag filtern:
                    <?php
                    if ($filter) {
                        echo "<span class='active-filter'>$filter <span class='results'>($results " . ($results == 1 ? "Ergebnis" : "Ergebnisse") . ")</span></span>";
                    }
                    ?>
                </span>

                <div class='search-buttons drag-move'>
                    <?php foreach ($tags as $tag) {
                        if (!$filter) {
                            ?>

                            <a href='?tag=<?php echo $tag; ?>' class='tag icon-text'><span><?php echo
                                    $tag;
                                    ?></span></a>

                            <?php
                        } else { ?>

                            <a href='<?php

                            if (!($filter && strcmp($filter, $tag))) {
                                echo "./";
                            } else {
                                echo "?tag=$tag";
                            }

                            ?>' class='tag icon-text'>
                                <?php if (!($filter && strcmp($filter, $tag))) { ?>
                                    <span class='icon'>close</span>
                                <?php } ?>
                                <span><?php echo $tag; ?></span>
                            </a>

                        <?php }
                    } ?>
                </div>
            </div>

            <div class='tutorials grid'>
                <!-- JS -->
                <?php
                foreach ($data

                         as $entry) {
                    $hasSpecialTags = false;
                    if ($entry['beta'] !== null && $entry['beta'] ||
                        $entry['deprecated'] !== null && $entry['deprecated'] ||
                        $entry['needsUpdate'] !== null && $entry['needsUpdate']) {
                        $hasSpecialTags = true;
                    }

                    if (strlen($filter) == 0 || in_array($filter, $entry["tags"])) {
                        ?>
                        <div class="tutorial-card<?php echo($hasSpecialTags ? ' has-special-tags' : '') ?> card<?php echo($entry['unavailable'] !== null
                        && $entry['unavailable'] ?
                            ' unavailable' : '') ?>"<?php echo($entry['unavailable'] !== null && $entry['unavailable'] ? 'data-toggle-popup="unavailable"' : ''); ?>>


                            <?php if ($hasSpecialTags) { ?>
                                <div class='title-tags'>
                                    <?php if ($entry['beta'] !== null && $entry['beta']) { ?>
                                        <span class='tooltip title-tag beta' data-tooltip='Dieser Artikel ist noch in der Beta-Version
                                und könnte noch Fehler beinhalten.'>Beta</span>
                                    <?php } ?>

                                    <?php if ($entry['deprecated'] !== null && $entry['deprecated']) { ?>
                                        <span class='tooltip title-tag deprecated' data-tooltip='Dieser Artikel ist veraltet
                                        und wird ggf. in naher Zukunft entfernt.'>Veraltet</span>
                                    <?php } ?>

                                    <?php if ($entry['needsUpdate'] !== null && $entry['needsUpdate']) { ?>
                                        <span class='tooltip title-tag needsUpdate'
                                              data-tooltip='Dieser Artikel benötigt ein Update, da er veraltet ist.'>Inaktuell</span>
                                    <?php } ?>
                                </div>
                            <?php } ?>

                            <div class="title-container"><h2 class="title"><?php echo $entry["title"] ?></h2></div>
                            <p class="description"><?php echo $entry["description"] ?></p>
                            <div class="tags">
                                <?php
                                $entryTags = $entry["tags"];
                                sort($entryTags);
                                foreach ($entryTags as $tag) { ?>
                                    <a href='?tag=<?php echo $tag; ?>' class="tag"><?php echo $tag; ?></a>
                                <?php } ?>
                            </div>

                            <?php 
                            $what = "Artikel anzeigen";

                            switch (strtolower($entry["type"])) {
                                case 'tutorial':
                                    $what = "Tutorial anzeigen";
                                    break;
                                    
                                case 'tool':
                                    $what = "Tool öffnen";
                                    break;

                                case 'checklist':
                                    $what = "Checkliste aufrufen";
                                    break;
                            }
                            ?>

                            <a class="button" data-hover-text="Lesen" href="<?php echo $entry['permaLink']; ?>"><?php echo $what; ?></a>
                        </div>
                    <?php }
                } ?>
            </div>
        </main>

        <div class='changelog center'>
            <h3>Changelog</h3>

            <h4>Hinzugefügt</h4>
            <ul>
                <li>Minifizierer (CSS, JS) und HTML Validator auf <a href="tutorial/seo#tools" target="_blank">SEO/SUMO-Seite</a> hinzugefügt</li>
                <li>Tool zum <a href="tool/word-to-html" target="_blank">Konvertieren von formatierten Word-Texten in HTML</a> hinzugefügt.</li>
            </ul>

            <h4>Geändert</h4>
            <ul>
                <li>Bug behoben, wodurch die Seiten "Empfohlene Tools" und "Empfohlene Frameworks" nicht erreichbar waren.</li>
                <li><a href='tutorial/securecheck.php'>Securechecks</a> werden jetzt als PDF runtergeladen.</li>
            </ul>

            <h4>Entfernt</h4>
            <ul>
                <li>-</li>
            </ul>
        </div>

        <script src='js/popups.js' defer async></script>
    </body>
</html>