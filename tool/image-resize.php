<?php
ini_set('upload_max_filesize', '70M');
ini_set('post_max_size', '2G');
ini_set('max_file_uploads', '50');
ini_set('memory_limit', '256M');
set_time_limit(180);
?>

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

        <title>ResizeIMG | by Marvin Roßkothen</title>

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
        <div class='back icon-text'><span class='icon'>arrow_back</span><span>Zurück</span></div>
        <main class="slide">
            <div class='heading'>
                <div class='heading-content'>
                    <h1>ResizeIMG</h1>
                    <p class='short'>
                        Hier kannst du mehrere Bilder gleichzeitig in Ihrer Größe anpassen.
                    </p>
                </div>
            </div>

            <div class='content'>
                <div>
                    <h2>Bilder auswählen</h2>
                    <form id="uploadForm" enctype="multipart/form-data">
                        <div id="dropZone">Drag & Drop</div>
                        <span class='disabled-text'>Maximale Dateigröße <?php echo ini_get("upload_max_filesize"); ?>, Maximale Gesamtgröße <?php echo ini_get("post_max_size"); ?></span>
                        <input type="file" name="images[]" id="images" multiple hidden>
                        <br>
                        <input name='width' id='wanted_width' type='number' min='1' placeholder='Breite'>
                        <button class='button' type="submit">Verarbeiten</button>

                        <ul id='uploadList'></ul>
                        <div id="downloadLinks"></div>
                    </form>

                    <?php echo "Memory Limit: " . ini_get("memory_limit"); ?>
                    <?php echo "Max Uploads: " . ini_get("max_file_uploads"); ?>
                </div>
            </div>
        </main>

        <script>
            const dropZone = document.getElementById('dropZone');
            const uploadForm = document.getElementById('uploadForm');
            const imagesInput = document.getElementById('images');
            const uploadList = document.getElementById('uploadList');

            dropZone.addEventListener('dragover', (event) => {
                event.preventDefault();
                dropZone.classList.add("dragging");
            });

            dropZone.addEventListener('dragleave', (event) => {
                event.preventDefault();
                dropZone.classList.remove("dragging");
            });

            dropZone.addEventListener('drop', (event) => {
                event.preventDefault();
                dropZone.classList.remove("dragging");

                const newFiles = event.dataTransfer.files;

                if (imagesInput.files.length === 0) {
                    imagesInput.files = newFiles;
                } else {
                    imagesInput.files = mergeFileLists(imagesInput.files, newFiles);
                }

                displayUploadList();
            });

            uploadForm.addEventListener('submit', (event) => {
                event.preventDefault();

                let formData = new FormData(event.target);
                let request = new XMLHttpRequest();

                formData.append('width', document.querySelector('#wanted_width').value);

                request.open('POST', '../php/resizeIMG.php', true);

                request.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const fileList = imagesInput.files;
                        for (let i = 0; i < fileList.length; i++) {
                            const progressElement = document.getElementById('progress_' + i).querySelector(".actual_progress");
                            const percentComplete = Math.round((event.loaded / event.total) * 100);

                            progressElement.style.width = `${percentComplete}%`;

                            if (percentComplete === 100) {
                                progressElement.classList.add("finished");
                            }
                        }
                    }
                });

                request.onload = function () {
                    console.log('Response:', request.responseText);

                    if (request.status >= 200 && request.status < 400) {
                        let response = JSON.parse(request.responseText);
                        response.forEach(file => {
                            let link = document.createElement('a');
                            link.href = file.url;
                            link.download = file.name;
                            link.textContent = `Download ${file.name}`;
                            document.getElementById('downloadLinks').appendChild(link);

                            link.click();

                            document.getElementById('downloadLinks').removeChild(link);
                        });
                    } else {
                        console.error('Error processing images – [' + request.status + "]: " + request.statusText);
                    }
                };

                request.onerror = function () {
                    console.error('Request failed.');
                };

                request.send(formData);
            });

            function mergeFileLists(fileList1, fileList2) {
                let result = new DataTransfer();

                for (let i = 0; i < fileList1.length; i++) {
                    result.items.add(fileList1[i]);
                }

                for (let i = 0; i < fileList2.length; i++) {
                    result.items.add(fileList2[i]);
                }

                return result.files;
            }

            function displayUploadList() {
                uploadList.innerHTML = '';
                const fileList = imagesInput.files;
                for (let i = 0; i < fileList.length; i++) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<span>${fileList[i].name}</span>`;
                    const progressElement = document.createElement('div');
                    progressElement.innerHTML = `<div class="actual_progress"></div>`;
                    progressElement.id = 'progress_' + i;
                    progressElement.classList.add('progress_bar_wrapper');
                    listItem.appendChild(progressElement);
                    uploadList.appendChild(listItem);
                }
            }
        </script>
    </body>
</html>