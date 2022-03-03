const paging = function () {
    let container = html.create("div", { class: "_container_" });
    let header = html.create("div", { class: "_paging_" });
    let pages = [];
    let activePage;

    function createPage(pageTitle) {
        let page = {
            pageTitle,
            headerButton: undefined,
            pseudoContainer: html.create("div", { class: "_pseudocontainer_" }),
            onload: undefined
        };
        page.headerButton = html.create("div", {
            class: "_page_",
            events: {
                onclick: () => swapTo(page)
            },
            textContent: pageTitle
        });
        return page;
    }

    function swapTo(page) {
        if (!pages.includes(page) || activePage === page) return;
        container.innerHTML = "";
        container.appendChild(page.pseudoContainer);
        activePage = page;
        if(activePage.onload){
            activePage.onload();
        }
        
    }

    function addPage(name, callback) {
        let page = createPage(name, onload);
        page.onload = callback(page.pseudoContainer);
        pages.push(page);
        header.appendChild(page.headerButton);
        if(pages.length == 1) swapTo(page);
    }

    utils.onWindowLoad(() => {
        document.body.appendChild(header);
        document.body.appendChild(container);
    });
    
    return {
        addPage,
        swapTo
    };
}();