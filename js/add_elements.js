function updateListeners(ae) {
    each('li', (listElement) => {
        if (!listElement.dataset.listenersAttached) {
            listElement.querySelector("input").addEventListener("keyup", (keyboard) => {
                if (keyboard.key === "Enter") {
                    keyboard.preventDefault();

                    if (!listElement.nextElementSibling) {
                        if (!listElement.parentElement.dataset.canAdd || listElement.parentElement.dataset.canAdd <= 0) {
                            const addedLI = document.createElement("li");

                            const addedInput = document.createElement("input");
                            addedInput.type = listElement.querySelector("input").type;
                            addedInput.placeholder = listElement.querySelector("input").placeholder;

                            addedLI.appendChild(addedInput);
                            listElement.parentElement.appendChild(addedLI);

                            updateListeners(listElement.parentElement);

                            setTimeout(() => {
                                listElement.nextElementSibling.querySelector("input").focus();
                            }, 350);

                            listElement.parentElement.dataset.canAdd = "350";
                            let interval = setInterval(() => {
                                let left = parseInt(listElement.parentElement.dataset.canAdd);

                                if (left > 0) {
                                    left--;
                                    listElement.parentElement.dataset.canAdd = left.toString();
                                } else {
                                    clearInterval(interval);
                                }
                            }, 1);
                        }
                    } else {
                        listElement.nextElementSibling.querySelector("input").focus();
                    }
                } else if (keyboard.key === "Backspace" || keyboard.key === "ArrowUp") {
                    if (listElement.previousElementSibling) {
                        if ((listElement.querySelector("input").selectionStart === 0) || keyboard.key === "ArrowUp") {
                            listElement.previousElementSibling.querySelector("input").focus();
                        }
                    }
                } else if (keyboard.key === "ArrowDown") {
                    if (listElement.nextElementSibling) {
                        listElement.nextElementSibling.querySelector("input").focus();
                    }
                } else if (keyboard.key === "ArrowLeft") {
                    if (listElement.previousElementSibling) {
                        if ((listElement.querySelector("input").selectionStart === 0)) {
                            listElement.previousElementSibling.querySelector("input").focus();
                        }
                    }
                } else if (keyboard.key === "ArrowRight") {
                    if ((listElement.querySelector("input").selectionStart === listElement.querySelector("input").value.length)) {
                        if (listElement.nextElementSibling) {
                            listElement.nextElementSibling.querySelector("input").focus();
                        }
                    }
                }
            });

            listElement.setAttribute("data-listeners-attached", "true");
        }
    }, ae);
}

window.addEventListener('load', () => {
    each('.add-elements', (element) => {
        updateListeners(element);
    });
});
