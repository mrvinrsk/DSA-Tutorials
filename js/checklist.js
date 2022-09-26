let index = 10;

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

                    if (typeof party !== 'undefined') {
                        if (finished(checklist)) {
                            let sw = window.innerWidth;
                            let particleCount = [100, 150];

                            if (sw <= 768) {
                                particleCount = [50, 75];
                            }

                            party.confetti(checklist, {
                                count: party.variation.range(particleCount[0], particleCount[1]),
                                size: party.variation.range(0.75, 1.25),
                                spread: party.variation.range(20, 40),
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