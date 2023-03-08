function minify(code) {
    return code.replace(/((?<=^|[^\w])(?!(var|let|const))\s+|\s+(?!(var|let|const))(?=$|[^\w]))/g, '');
}

$(function () {
    let input = document.querySelector("#minify-input");
    let output = document.querySelector("#minify-output");

    input.addEventListener('resize', () => {
        output.style.height = input.clientHeight + "px";
    });

    input.addEventListener('keyup', () => {
        output.querySelector("textarea").value = minify(input.value);
    });

    output.addEventListener('click', () => {
        copyTextToClipboard(output.querySelector("textarea").value);
        output.classList.add("copied");

        setTimeout(() => {
            output.classList.remove("copied");
        }, 1500);
    });
});