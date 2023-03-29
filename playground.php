<!doctype html>
<html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Playground | DSA-Tutorials</title>

        <link rel="stylesheet" href="css/global.min.css">

        <script src='js/floaty.js'></script>
    </head>
    <body>

        <main class="slide">
            <div class='heading'>
                <div class='heading-content'>
                    <h1>Playground</h1>
                    <p class='short'>
                        Teste zukünftige Funktionen.
                    </p>
                </div>
            </div>

            <div class='content'>
                <span id='floatyDemo' class='button'>Floaty</span>
            </div>
        </main>

        <script>
            Floaty({
                selector: '#floatyDemo',
                content: {
                    heading: 'Floaty',
                    description: 'Floaty is a new opportunity to show hints, like this.'
                }
            });
        </script>

    </body>
</html>