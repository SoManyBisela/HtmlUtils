const paging = function () {
    let container = html.create("div", { class: "_container_" });
    let header = html.create("div", { class: "_paging_" });
    let pages = [];
    let activePage;

    function _createPage(pageTitle, removable = false) {
        let page = {
            pageTitle,
            headerButton: undefined,
            pseudoContainer: html.create("div", { class: "_pseudocontainer_" }),
            onload: undefined //function called when the page is opened
        };
        page.headerButton = html.create("div", {
            class: "_page_" + (removable == true ? " removable": ""),
            events: {
                onclick: () => swapTo(page),
                contextmenu: (self, evt) => {
                    if(!removable) return;
                    evt.preventDefault();
                    contextmenu.createOn(evt, [{text: "Close", callback: () => _removePage(page)}])
                }
            },
            textContent: pageTitle
        });
        return page;
    }

    function _removePage(page){
        pages = pages.filter(a => a !== page);
        page.headerButton.remove();
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

    function addPage(name, callback, removable = false) {
        let page = _createPage(name, removable);
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