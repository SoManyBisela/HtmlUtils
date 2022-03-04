const contextmenu = function(){

    let contextMenuContainer = html.create("div", {
        class: "_contextmenu_container_",
        events: {
            click: (_, evt) => {
                evt._context_menu_clicked_ = true;
            }
        }
    });

    function _hideBackground(){
        contextMenuContainer.hidden = true;
    }
    function _showBackground(){
        contextMenuContainer.hidden = false;
        contextMenuContainer.focus();
    }

    function _createMenuOptionElement(text, callback){
        return html.create("div", {
            class: "_contextmenu_option_",
            textContent: text,
            events: {
                click: () => {
                    _hideBackground();
                    callback();
                },
            }
        })
    }

    function create(x, y, menuOptions){
        contextMenuContainer.style.left =  x + "px";
        contextMenuContainer.style.top =  y + "px";
        contextMenuContainer.innerHTML = "";
        menuOptions
            .map(menuOption => _createMenuOptionElement(menuOption.text, menuOption.callback))
            .forEach(element => {
                contextMenuContainer.appendChild(element)
            });
        setTimeout(() => _showBackground(), 0);
    }

    function createOn(evt, menuOptions){
        let {clientX, clientY} = evt;
        create(clientX, clientY, menuOptions);
    }

    utils.onWindowLoad(() => {
        document.body.appendChild(contextMenuContainer);
        document.body.addEventListener("click", (evt) => {
            if(evt._context_menu_clicked_) return;
            _hideBackground();
        });
    }, 20);  
    _hideBackground();

    
    return {create, createOn};
}();