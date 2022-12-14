function filterTag(tag) {
    console.log("Du möchtest suchen nach: " + tag);
    loadTutorials(true, tag);
}

async function loadTutorials(clear, search = null) {
    let loaded = 0;
    let unavailable = 0;
    addLoading(true);

    const container = document.querySelector('.tutorials');

    if (clear) {
        container.innerHTML = "";
        if (document.querySelector('.end') && document.querySelector('.end') != null) {
            document.querySelector('.end').remove();
        }

        document.querySelector('.search-information').innerHTML = "";
    }

    let allTags = [];

    if (document.querySelector(".search-buttons-container")) {
        document.querySelector(".search-buttons-container").remove();
    }

    const searchButtonsContainer = document.createElement('div');
    searchButtonsContainer.classList.add("search-buttons-container");

    const searchButtonsInfo = document.createElement('span');
    searchButtonsInfo.textContent = "Nach Tag Filtern:";

    searchButtonsContainer.appendChild(searchButtonsInfo);

    const searchButtons = document.createElement('div');
    searchButtons.classList.add("search-buttons");
    searchButtonsContainer.appendChild(searchButtons);

    await fetch("tutorials.json")
        .then(response => {
            return response.json();
        })
        .then(json => {
            for (let i = 0; i < json.length; i++) {
                if ((json[i].show !== null && json[i].show !== 'undefined' && json[i].show === true) || json[i].show == null || json[i].show === 'undefined') {
                    const card = document.createElement('div');
                    card.classList.add("tutorial-card", "card");

                    const titleContainer = document.createElement('div');
                    titleContainer.classList.add("title-container");

                    const title = document.createElement('h2');
                    title.classList.add("title");
                    title.textContent = json[i].title;

                    titleContainer.appendChild(title);

                    if (json[i].beta !== null && json[i].beta !== 'undefined' && json[i].beta === true ||
                        json[i].deprecated !== null && json[i].deprecated !== 'undefined' && json[i].deprecated === true ||
                        json[i].needsUpdate !== null && json[i].needsUpdate !== 'undefined' && json[i].needsUpdate === true) {

                        card.classList.add("has-special-tags");

                        const titleTagContainer = document.createElement('div');
                        titleTagContainer.classList.add("title-tags");

                        if (json[i].beta !== null && json[i].beta !== 'undefined' && json[i].beta === true) {
                            const beta = document.createElement('span');
                            beta.classList.add("tooltip", "title-tag", "beta");
                            beta.setAttribute("data-tooltip", "Dieser Artikel ist noch in der Beta-Version und könnte noch Fehler" +
                                " beinhalten.");
                            beta.textContent = "Beta";

                            titleTagContainer.appendChild(beta);
                        }

                        if (json[i].deprecated !== null && json[i].deprecated !== 'undefined' && json[i].deprecated === true) {
                            const beta = document.createElement('span');
                            beta.classList.add("tooltip", "title-tag", "deprecated");
                            beta.setAttribute("data-tooltip", "Dieser Artikel ist veraltet und wird ggf. in naher Zukunft entfernt.");
                            beta.textContent = "Veraltet";

                            titleTagContainer.appendChild(beta);
                        }

                        if (json[i].needsUpdate !== null && json[i].needsUpdate !== 'undefined' && json[i].needsUpdate === true) {
                            const beta = document.createElement('span');
                            beta.classList.add("tooltip", "title-tag", "needsUpdate");
                            beta.setAttribute("data-tooltip", "Dieser Artikel benötigt ein Update, da er veraltet ist.");
                            beta.textContent = "Inaktuell";

                            titleTagContainer.appendChild(beta);
                        }

                        titleContainer.appendChild(titleTagContainer);
                    }


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

                        if (!allTags.includes(tag)) {
                            allTags.push(tag);
                        }
                    });

                    const button = document.createElement('a');
                    button.classList.add("button");
                    button.setAttribute("data-hover-text", "Lesen");

                    if (json[i].unavailable !== null && json[i].unavailable !== 'undefined' && json[i].unavailable === true) {
                        button.href = "#";
                    } else {
                        button.href = json[i].file;
                    }
                    button.textContent = "Tutorial anzeigen";

                    card.appendChild(titleContainer);
                    card.appendChild(description);
                    card.appendChild(tagsCont);
                    card.appendChild(button);

                    if (search === null || search === "" || json[i].tags.includes(search)) {
                        container.appendChild(card);
                        loaded++;

                        if (json[i].unavailable !== null && json[i].unavailable !== 'undefined' && json[i].unavailable === true) {
                            card.classList.add("unavailable");
                            card.setAttribute('data-toggle-popup', 'unavailable');
                            unavailable++;
                        }
                    }
                }
            }

            let footer = `Ende der Liste. Ergebnisse: ${loaded}`;
            if (unavailable >= 1) {
                footer += `, davon deaktiviert: ${unavailable}`;
            }

            document.querySelector('main').innerHTML += `<span class='end'>${footer}</span>`;
        });

    if (search != null) {
        document.querySelector('.search-information').innerHTML = `<span class="search-info-text"><span>Die Suche nach '<span class="col-primary">${search}</span>' ergab ${loaded} Ergebnis${loaded !== 1 ? "se" : ""}.</span><a onclick="loadTutorials(true);" class="button inline icon-text" data-hover-text='Zurücksetzen'><span class="icon">close</span><span>Filter zurücksetzen</span></a></span>`;
    }

    allTags.sort().forEach(tag => {
        const searchTag = document.createElement('span');
        searchTag.classList.add("tag");
        searchTag.onclick = () => filterTag(tag);
        searchTag.textContent = tag;

        if (search !== null) {
            if (search.toLowerCase() === tag.toLowerCase()) {
                searchTag.classList.add("active");
                searchTag.onclick = () => loadTutorials(true);
            }
        }

        searchButtons.appendChild(searchTag);
    });

    if(search == null) {
        document.querySelector('main').insertBefore(searchButtonsContainer, document.querySelector('.tutorials'));
    }

    reload();
    removeLoading();
}