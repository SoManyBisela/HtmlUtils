const writer = function(){
    let buffer = [];
    let targetElement = undefined;
    function createWriteSpace(content, title){
        let id = html.generateId("write");
        let textContent = title == undefined ? id : title;
        let el = html.create("div", {
            class: "write",
            elementContentList: [
                html.create("div", {
                    textContent,
                    class: "write-name",
                    attributes: {
                        contenteditable: true
                    }
                }),
                html.create("textarea",{
                    id,
                    class: "write-content",
                    value: content
                }),
                html.create("button", {
                    textContent: "remove",
                    class: "write-removal",
                    events: {
                        onclick: function (self, evt) {
                            self.parentElement.remove();
                        }
                    }
                }),
                html.create("button", {
                    textContent: "download",
                    class: "write-downloader",
                    events: {
                        onclick: function (self, evt) {
                            let title = self.parentElement.querySelector(".write-name").innerText;
                            let content = self.parentElement.querySelector(".write-content").value;
                            utils.downloadBlob(new Blob([content], {type: "text/plain"}), title);
                        }
                    }
                })
            ]
        });
        return el;
    }

    function write(content, title){
        if (typeof content == "object") {
            content = JSON.stringify(content);
        }
        let el = createWriteSpace(content, title);
        buffer.push(el)
        if(targetElement != undefined){
            targetElement.appendChild(el);
        }
        return el;
    }

    function setTargetElement(target, addBuffered = false){
        targetElement = target;
        if(addBuffered === true && targetElement != undefined){
            buffer.forEach(el => targetElement.appendChild(el));
        }
    }

    return {
        write,
        setTargetElement
    }
}();
