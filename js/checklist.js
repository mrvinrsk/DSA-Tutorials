let index = 10;

let congratulations = [
    'Schon fertig!',
    'Das war\'s!',
    'Weiter geht\'s!'
];

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

function updateList(checklist) {
    if (checklist.querySelector('.progress')) {
        checklist.querySelector('.progress').remove();
    }

    const progress = document.createElement('span');
    progress.classList.add('progress');
    progress.innerHTML = `${getProgress(checklist)}`;

    const firstCheck = checklist.firstChild;
    checklist.insertBefore(progress, firstCheck);
}

$(function () {
    document.querySelectorAll('.checklist').forEach(checklist => {
        checklist.id = 'checklist-' + (++index);

        if (checklist.hasAttribute('data-show-completion')) {
            updateList(checklist);

            checklist.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    updateList(checklist);
                });
            });
        }
    });
});