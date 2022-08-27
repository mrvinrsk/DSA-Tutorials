function filterTag(tag) {
    console.log("Du möchtest suchen nach: " + tag);
    loadTutorials(true, tag);
}

async function loadTutorials(clear, search = null) {
    let loaded = 0;
    addLoading(true);

    const container = document.querySelector('.tutorials');

    if (clear) {
        container.innerHTML = "";
        if (document.querySelector('.end') && document.querySelector('.end') != null) {
            document.querySelector('.end').remove();
        }

        document.querySelector('.search-information').innerHTML = "";
    }

    await fetch("tutorials.json")
        .then(response => {
            return response.json();
        })
        .then(json => {
            for (let i = 0; i < json.length; i++) {
                const card = document.createElement('div');
                card.classList.add("tutorial-card");

                const title = document.createElement('h2');
                title.classList.add("title");
                title.textContent = json[i].title;

                const description = document.createElement('p');
                description.classList.add("description");
                let dscTxt = json[i].description;
                if (dscTxt.length > 90) {
                    description.title = dscTxt;
                    dscTxt = dscTxt.substring(0, 90) + "...";
                }
                description.textContent = dscTxt;

                const tagsCont = document.createElement('div');
                tagsCont.classList.add("tags");
                json[i].tags.forEach(tag => {
                    tagsCont.innerHTML += `<span class='tag' onclick='filterTag("${tag}");'>${tag}</span>`;
                });

                const button = document.createElement('a');
                button.classList.add("button");
                button.href = json[i].file;
                button.textContent = "Tutorial anzeigen";

                card.appendChild(title);
                card.appendChild(description);
                card.appendChild(tagsCont);
                card.appendChild(button);

                if (search === null || search === "" || json[i].tags.includes(search)) {
                    container.appendChild(card);
                    loaded++;
                }
            }

            document.querySelector('main').innerHTML += `<span class='end'>Ende der Liste. Ergebnisse: ${loaded}</span>`;
        });

    if (search != null) {
        document.querySelector('.search-information').innerHTML = `<span class="center-v search-info-text"><span>Die Suche nach '<span class="col-primary">${search}</span>' ergab ${loaded} Ergebnis${loaded !== 1 ? "se" : ""}.</span><a onclick="loadTutorials(true);" class="button inline icon-text"><span class="icon">close</span><span>Filter zurücksetzen</span></a></span>`;
    }

    removeLoading();
}