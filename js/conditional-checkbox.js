function updateCondCheckbox(cb) {
    console.log(cb, "clicked");
    const conditionalContent = cb.closest(".conditional-cb").querySelector(".conditional-content");
    const isChecked = cb.checked;
    const hasDataChecked = conditionalContent.hasAttribute("data-checked");
    const hasDataUnchecked = conditionalContent.hasAttribute("data-unchecked");

    console.log("Checkbox is checked: ", isChecked);
    console.log("Data-checked attribute exists: ", hasDataChecked);
    console.log("Data-unchecked attribute exists: ", hasDataUnchecked);

    if (isChecked && hasDataChecked) {
        conditionalContent.classList.add("visible");
    } else if (!isChecked && hasDataUnchecked) {
        conditionalContent.classList.add("visible");
    } else {
        conditionalContent.classList.remove("visible");
    }
}


window.addEventListener('load', () => {
    each('.conditional-cb', (el) => {
        let checkbox = el.querySelector("input[type=checkbox]");

        updateCondCheckbox(checkbox);

        checkbox.addEventListener('click', () => {
            updateCondCheckbox(checkbox);
        })
    });
});