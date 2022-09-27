$(function () {
    document.querySelectorAll('code').forEach(code => {
        code.addEventListener('click', () => {
            copyTextToClipboard(code.textContent);
            alert("Du hast den Code kopiert.");
        });
    });
});