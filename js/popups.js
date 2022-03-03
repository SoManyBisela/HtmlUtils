class PopupContainer{
    constructor(onCloseClick){
        this.titleElement = html.create("div", {
            class: "_popup_container_title_"
        })
        this.element = html.create("div", {
            class: "_popup_container_",
            elementContentList: [
                this.titleElement,
                html.create("button", {
                    textContent: "X",
                    events: {
                        click: onCloseClick
                    },
                    class: "_close_popup_button_"
                })
            ],
            events: {
                click: (self, evt) => {
                    evt.stopPropagation();
                }
            }
        })
    }

    show(popup, title){
        this.clear();
        this.content = popup;
        this.element.appendChild(popup);
        this.titleElement.innerText = title;
    }

    clear(){
        if(this.content){
            this.content.remove();
        }
    }
}

class PopupList{
    constructor(container) {
        this.container = container;
        this.arr = [];
    }

    clear(){
        this.container.clear();
        this.arr = [];
    }

    _removeShown(){
        if(this.shown)
            this.shown.element.remove();
    }

    push(el, title){
        this.arr.push({el, title});
        this.container.show(el, title);
    }

    pop(){
        this.arr.pop();
        let arlen = this.arr.length;
        if(arlen > 0){
            let el = this.arr[this.arr.length - 1];
            this.container.show(el.el, el.title);
            return false;
        }else{
            this.container.clear();
            return true;
        }
    }
}
const popups = function(){
    let popup_container = new PopupContainer(_closePopup);
    let popups = new PopupList(popup_container);
    let popup_bg = html.create("div", {
        class: "_popup_background_",
        elementContent: popup_container.element,
        events: {
            click: () => {
                popups.clear();
                _hidePopupBg();
            }
        }
    });

    function _hidePopupBg(){
        popup_bg.hidden = true;
    }

    function _showPopupBg(){
        popup_bg.hidden = false;
    }

    function _closePopup(){
        if(popups.pop()) _hidePopupBg();
    }
    
    _hidePopupBg();
    utils.onWindowLoad(() => {
        document.body.appendChild(popup_bg);
    });

    function create(callback, title){
        _createPopupMain(callback, title);
        _showPopupBg();
    }

    function _createPopupMain(callback, title){
        let pm = html.create("div", {
            class: "_popup_main_"
        });
        callback(pm);
        popups.push(pm, title);
    }

    return {create};    
}();