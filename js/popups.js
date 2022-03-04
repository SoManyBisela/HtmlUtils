const popups = function () {
    class PopupContainer {
        constructor(onCloseClick) {
            this.titleContainer = html.create("div", {
                class: "_popup_container_title_"
            })
            this.element = html.create("div", {
                class: "_popup_container_",
                elementContentList: [
                    this.titleContainer,
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
                        evt._popup_clicked_ = true;
                    }
                }
            })
        }
    
        show(popup, titleElement) {
            this.clear();
            this.content = popup;
            this.element.appendChild(popup);
            this.titleContainer.innerHTML = "";
            this.titleContainer.appendChild(titleElement);
        }
    
        clear() {
            if (this.content) {
                this.content.remove();
            }
        }
    }
    
    class PopupList {
        constructor(container) {
            this.container = container;
            this.arr = [];
        }
    
        clear() {
            this.container.clear();
            this.arr = [];
        }
    
        push(el, title) {
            this.arr.push({ el, title });
            this._showLast();
        }
    
        pop() {
            this.arr.pop();
            this._showLast();
            return this.arr.length <= 0;
        }
    
        _showLast() {
            let arlen = this.arr.length;
            if (arlen > 0) {
                let el = this.arr[this.arr.length - 1];
                this.container.show(el.el, this._buildTitle());
            } else {
                this.container.clear();
            }
        }
    
        _buildTitle() {
            let titles = this.arr
                .map(a => a.title)
                .flatMap((title, index) =>
                    [
                        html.create("span", {
                            textContent: ">"
                        }),
                        html.create("span", {
                            class: "_popup_clickable-link_",
                            textContent: title,
                            events: {
                                click: () => this.backTo(index)
                            }
                        })
                    ]
                ).splice(1);
    
            return html.create("div",
                {
                    class: "_popup_title_",
                    elementContentList: titles
                }
            )
        }
    
        backTo(index) {
            this.arr.splice(index + 1);
            this._showLast();
        }
    }
    let popup_container = new PopupContainer(_closePopup);
    let popups = new PopupList(popup_container);
    let popup_bg = html.create("div", {
        class: "_popup_background_",
        elementContent: popup_container.element,
        events: {
            click: (_, evt) => {
                if(evt._popup_clicked_) return;
                popups.clear();
                _hidePopupBg();
            }
        }
    });

    function _hidePopupBg() {
        popup_bg.hidden = true;
    }

    function _showPopupBg() {
        popup_bg.hidden = false;
    }

    function _closePopup() {
        if (popups.pop()) _hidePopupBg();
    }

    _hidePopupBg();
    utils.onWindowLoad(() => {
        document.body.appendChild(popup_bg);
    }, 15);

    function create(callback, title) {
        _createPopupMain(callback, title);
        _showPopupBg();
    }

    function _createPopupMain(callback, title) {
        let pm = html.create("div", {
            class: "_popup_main_"
        });
        callback(pm);
        popups.push(pm, title);
    }

    return { create };
}();