let index = 0;

let congratulations = [
    'Schon fertig!',
    'Das war\'s!',
    'Weiter geht\'s!'
];

function finished(checklist) {
    let checked = checklist.querySelectorAll('input[type=checkbox]:checked').length;
    let total = checklist.querySelectorAll('input[type=checkbox]').length;

    return checked === total;
}

function getProgress(checklist) {
    let checked = checklist.querySelectorAll('input[type=checkbox]:checked').length;
    let total = checklist.querySelectorAll('input[type=checkbox]').length;
    let completion = (checked * 100) / total;

    let string = `Fortschritt: ${checked}/${total} (${completion.toFixed(0)}%)`;
    if (checked === total) {
        string += ` – ${congratulations[Math.floor(Math.random() * congratulations.length)]}`;
    }

    return string;
}

function readText(filePath) {
    let output = ""; //placeholder for text output
    if (filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            output = e.target.result;
            return output;
        };//end onload()
        reader.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else if (ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            reader = new ActiveXObject("Scripting.FileSystemObject");
            let file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
            return output;
        } catch (e) {
            if (e.number === -2146827859) {
                alert('Unable to access local files due to browser security settings. ' +
                    'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' +
                    'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
            }
        }
    } else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }
}


async function getFileContent(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var myFile = evt.target.files[0];
    var reader = new FileReader();
    reader.readAsText(myFile);
    reader.onload = function () {
        let result = reader.result;
    }
}

function importProgress(checklist) {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.clp,.txt';
    input.click();

    input.onchange = e => {
        let file = e.target.files[0];

        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            let result = reader.result;
            let ids = result.split(';');

            checklist.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
                if (ids.includes(checkbox.id)) {
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
            });

            updateList(checklist);
        }
    }
}

function exportProgress(checklist) {
    let checked = checklist.querySelectorAll('input[type=checkbox]:checked');
    let ids = [];

    checked.forEach(check => {
        ids.push(check.id);
    });

    let str = ids.join(';');
    let fname = (checklist.hasAttribute('data-name') ? checklist.dataset.name : checklist.id);
    let date = new Date();
    let ts = [date.getDate(), (date.getMonth() + 1), date.getFullYear()].join('_');

    download(`${fname}-${ts}.txt`, str);
}

function updateList(checklist) {
    if (checklist.hasAttribute('data-show-completion')) {
        const progress = (checklist.querySelector('.progress') ? checklist.querySelector('.progress') : document.createElement('span'));
        progress.classList.add('progress');
        progress.innerHTML = `${getProgress(checklist)}`;

        if (finished(checklist)) {
            progress.classList.add('finished');
        } else {
            progress.classList.remove('finished');
        }

        const firstCheck = checklist.firstChild;
        checklist.insertBefore(progress, firstCheck);
    }

    if (finished(checklist)) {
        checklist.querySelector('.checks').classList.add('finished');
    } else {
        checklist.querySelector('.checks').classList.remove('finished');
    }
}

$(function () {
    document.querySelectorAll('.checklist').forEach(checklist => {
        let cb_i = 0;
        checklist.id = 'checklist-' + (++index);
        checklist.innerHTML += "<div class='dl-list'></div>";

        checklist.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
            checkbox.id = `check-${(++cb_i)}`;
        });

        const imp = document.createElement('a');
        imp.textContent = "Laden";
        imp.classList.add('button', 'small');
        imp.addEventListener('click', () => {
            importProgress(checklist);
        });

        const exp = document.createElement('a');
        exp.textContent = "Speichern";
        exp.classList.add('button', 'small', 'speichern');
        exp.addEventListener('click', () => {
            exportProgress(checklist);
        });

        checklist.querySelector('.dl-list').append(imp, exp);

        if (checklist.hasAttribute('data-show-completion')) {
            updateList(checklist);

            checklist.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    updateList(checklist);

                    if (checkbox.checked) {
                        if(!finished(checklist)) {
                            if (typeof party !== 'undefined') {
                                let sw = window.innerWidth;
                                let particleCount = [5, 10];

                                party.confetti(checkbox, {
                                    count: party.variation.range(particleCount[0], particleCount[1]),
                                    size: party.variation.range(0.5, .75),
                                    spread: party.variation.range(5, 10),
                                    speed: party.variation.range(300, 400),
                                    shapes: ["square", "rectangle"],
                                    color: () =>
                                        party.random.pick([
                                            party.Color.fromHex("#cc0000"),
                                            party.Color.fromHex("#e60000"),
                                            party.Color.fromHex("#b30000"),
                                            party.Color.fromHex("#b31212"),
                                            party.Color.fromHex("#cc3d3d"),
                                        ])
                                });
                            }
                        }
                    }

                    if (finished(checklist)) {
                        if (!isInView(checklist.querySelector('.progress'))) {
                            $('html,body').animate({
                                scrollTop: $(checklist.querySelector('.progress')).offset().top - 200
                            }, checklist.querySelectorAll('input[type=checkbox]').length * 25);
                        }

                        if (typeof party !== 'undefined') {
                            let sw = window.innerWidth;
                            let particleCount = [150, 200];

                            if (sw <= 768) {
                                particleCount = [75, 95];
                            }

                            party.confetti(checklist, {
                                count: party.variation.range(particleCount[0], particleCount[1]),
                                size: party.variation.range(0.35, 1.75),
                                spread: party.variation.range(6, 20),
                                speed: party.variation.range(500, 800),
                                shapes: ["square", "rectangle"],
                                color: () =>
                                    party.random.pick([
                                        party.Color.fromHex("#cc0000"),
                                        party.Color.fromHex("#e60000"),
                                        party.Color.fromHex("#b30000"),
                                        party.Color.fromHex("#b31212"),
                                        party.Color.fromHex("#cc3d3d"),
                                    ])
                            });
                        }
                    }
                });
            });
        }
    });
});