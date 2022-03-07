// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function loopObject(object, callback) {
    Object.keys(object).forEach((key)=>{
        callback(key, object[key]);
    });
}
const blowDownloaderLink = document.createElement("a");
blowDownloaderLink.style.display = "none";
function downloadBlob(blob, fileName) {
    document.body.appendChild(blowDownloaderLink);
    let url = window.URL.createObjectURL(blob);
    blowDownloaderLink.href = url;
    blowDownloaderLink.download = fileName;
    blowDownloaderLink.click();
    window.URL.revokeObjectURL(url);
    blowDownloaderLink.remove();
}
const windowLoadCallbacks = [];
function onWindowLoad(callback, priority = 10) {
    if (!windowLoadCallbacks[priority]) windowLoadCallbacks[priority] = [];
    windowLoadCallbacks[priority].push(callback);
}
const domParser = new DOMParser();
function parseXml(xml) {
    return domParser.parseFromString(xml, "text/xml");
}
window.addEventListener("load", ()=>windowLoadCallbacks.flat().forEach((f)=>f()
    )
);
async function loadFile(file) {
    return new Promise((resolve, reject)=>{
        let fr = new FileReader();
        fr.onload = ()=>resolve(fr.result)
        ;
        fr.onerror = reject;
        fr.readAsText(file);
    });
}
const mod = {
    loopObject: loopObject,
    downloadBlob: downloadBlob,
    onWindowLoad: onWindowLoad,
    parseXml: parseXml,
    loadFile: loadFile
};
const findOne = document.querySelector;
function findAll(query) {
    return Array.from(document.querySelectorAll(query));
}
function create(tagname, options) {
    let el = document.createElement(tagname);
    if (!options) return el;
    if (options.attributes != undefined) {
        loopObject(options.attributes, (k, v)=>{
            el.setAttribute(k, v);
        });
    }
    if (options.className != undefined) {
        el.setAttribute("class", options.className);
    } else if (options.classList != undefined) {
        el.classList.add(...options.classList);
    }
    if (options.value != undefined) {
        el.value = options.value;
    }
    if (options.id != undefined) {
        el.id = options.id;
    }
    if (options.elementContent != undefined) {
        el.appendChild(options.elementContent);
    } else if (options.elementContentList != undefined) {
        options.elementContentList.forEach((element)=>{
            el.appendChild(element);
        });
    } else if (options.htmlContent != undefined) {
        el.innerHTML = options.htmlContent;
    } else if (options.textContent != undefined) {
        el.innerText = options.textContent;
    }
    if (options.events != undefined) {
        loopObject(options.events, (name, callbacks)=>{
            if (callbacks === undefined) callbacks = [];
            if (!Array.isArray(callbacks)) {
                callbacks = [
                    callbacks
                ];
            }
            for (let callback of callbacks){
                el.addEventListener(name, (evt)=>{
                    callback(el, evt);
                });
            }
        });
    }
    return el;
}
let generatedIds = {};
function generateId(name) {
    if (name == undefined) {
        name = "";
    } else {
        name = String(name);
    }
    if (generatedIds[name] == undefined) {
        generatedIds[name] = 0;
    } else {
        generatedIds[name]++;
    }
    return name + generatedIds[name];
}
function createOption(text, value) {
    return create("option", {
        textContent: text,
        attributes: {
            value
        }
    });
}
function objectTable(ob, options = {}) {
    let vertical = options.vertical ?? false;
    let thTemplate = options.thTemplate ?? ((value)=>{
        return create("th", {
            textContent: value
        });
    });
    let tdTemplate = options.tdTemplate ?? ((value)=>{
        return create("td", {
            textContent: value
        });
    });
    let trTemplate = options.trTemplate ?? ((cells)=>{
        return create("tr", {
            elementContentList: cells
        });
    });
    let tableTemplate = options.tableTemplate ?? ((rows)=>{
        return create("table", {
            elementContentList: rows
        });
    });
    let tdLeftClick = options.tdLeftClick ?? ((self, evt, key, value)=>{});
    let thLeftClick = options.thLeftClick ?? ((self, evt, key, value)=>{});
    let tdRightClick = options.tdRightClick ?? ((self, evt, key, value)=>{});
    let thRightClick = options.thRightClick ?? ((self, evt, key, value)=>{});
    let verticalRows = Object.keys(ob).map((k)=>{
        let v = ob[k];
        let td = tdTemplate(v);
        let th = thTemplate(k);
        td.addEventListener("click", (evt)=>tdLeftClick(td, evt, k, v)
        );
        th.addEventListener("click", (evt)=>thLeftClick(th, evt, k, v)
        );
        td.addEventListener("contextmenu", (evt)=>tdRightClick(td, evt, k, v)
        );
        th.addEventListener("contextmenu", (evt)=>thRightClick(th, evt, k, v)
        );
        return [
            th,
            td
        ];
    });
    let rows1;
    if (vertical) {
        rows1 = verticalRows.map(trTemplate);
    } else {
        let ths = [];
        let tds = [];
        verticalRows.forEach((a)=>{
            ths.push(a[0]);
            tds.push(a[1]);
        });
        rows1 = [
            trTemplate(ths),
            trTemplate(tds)
        ];
    }
    return tableTemplate(rows1);
}
const mod1 = {
    findOne: findOne,
    findAll: findAll,
    create: create,
    generateId: generateId,
    createOption: createOption,
    objectTable: objectTable
};
function parseFile(filecontent) {
    let keySet = new Set();
    let lines = filecontent.split("\n").map((a1)=>{
        let parsed;
        try {
            parsed = JSON.parse(a1);
            parsed._jsonParsed = true;
        } catch (e) {
            parsed = {
                message: a1,
                _jsonParsed: false
            };
        }
        Object.keys(parsed).forEach((a)=>keySet.add(a)
        );
        return parsed;
    });
    return {
        keySet: Array.from(keySet),
        lines
    };
}
function groupBy(logs, field) {
    let obj = {};
    function add(val, log) {
        if (!obj[val]) obj[val] = [];
        obj[val].push(log);
    }
    logs.forEach((log)=>{
        add(log[field], log);
    });
    return obj;
}
const mod2 = {
    parseFile: parseFile,
    groupBy: groupBy
};
const __default = objectcompare = function() {
    let compareObject = function() {
        function addArrToSet(set, arr) {
            for(let i = 0; i < arr.length; i++){
                set.add(arr[i]);
            }
        }
        function distinctSortedArrayFromArrays(...arrays) {
            let set = new Set();
            for(let i = 0; i < arrays.length; i++){
                addArrToSet(set, arrays[i]);
            }
            return Array.from(set).sort((a, b)=>{
                let a1 = String(a).toLowerCase();
                let b1 = String(b).toLowerCase();
                return a1.localeCompare(b1);
            });
        }
        function getType(a) {
            if (a instanceof Array) return "Array";
            if (a instanceof Object) return "Object";
            if (typeof a === "string") return "String";
            if (typeof a === "number") return "Number";
            if (typeof a === "boolean") return "Boolean";
            if (typeof a === "undefined") return "Missing";
            return "Other";
        }
        return function(o1, o2) {
            let allKeysSet = distinctSortedArrayFromArrays(Object.keys(o1), Object.keys(o2));
            let result = {
                equal: true,
                fieldAnalysis: {}
            };
            for (const key of allKeysSet){
                value1 = o1[key];
                value2 = o2[key];
                type1 = getType(value1);
                type2 = getType(value2);
                result.fieldAnalysis[key] = {
                    o1: type1,
                    o2: type2
                };
                if (type1 === type2) {
                    if (type1 === "Object" || type1 === "Array") {
                        let comparison = compareObject(value1, value2);
                        result.fieldAnalysis[key].equal = comparison.equal;
                        result.equal = result.equal && comparison.equal;
                        result.fieldAnalysis[key].fieldAnalysis = comparison.fieldAnalysis;
                    } else {
                        result.fieldAnalysis[key].equal = true;
                    }
                } else {
                    result.fieldAnalysis[key].equal = false;
                    result.equal = false;
                }
            }
            return result;
        };
    }();
    let formatAsTable = function() {
        function fieldLine1(fieldParts, o1, o2) {
            return {
                fieldParts,
                o1,
                o2
            };
        }
        function fieldPart1(name, isArrIndex) {
            return {
                name,
                isArrIndex
            };
        }
        function getFullFieldName(fieldParts) {
            let fieldName = "";
            let isArr = false;
            for (let fieldPart of fieldParts){
                if (isArr) {
                    fieldName += `[${fieldPart.name}]`;
                    isArr = fieldPart.isArrIndex;
                    continue;
                }
                if (fieldName.length > 0) fieldName += ".";
                fieldName += fieldPart.name;
                isArr = fieldPart.isArrIndex;
            }
            return fieldName;
        }
        function formatFieldLines(fieldLines) {
            let fieldRows = fieldLines.map((fieldLine)=>{
                let fullFieldName = getFullFieldName(fieldLine.fieldParts);
                let o1 = fieldLine.o1;
                let o2 = fieldLine.o2;
                return `<tr>
                            <td>${fullFieldName}</td>
                            <td>${o1}</td>
                            <td>${o2}</td>
                        </tr>`;
            }).join("\n");
            let table = `<thead>
                            <tr>
                                <th>Field</th>
                                <th>Object1</th>
                                <th>Object2</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${fieldRows}
                        </tbody>`;
            return table;
        }
        function getFieldLines(fieldAnalysis) {
            let fields = Array.from(Object.keys(fieldAnalysis));
            let diffs = [];
            for (let field of fields){
                if (!fieldAnalysis[field].equal) {
                    let newdiffs = parseField(fieldAnalysis[field]);
                    for (diff of newdiffs){
                        diff.fieldParts.unshift(fieldPart1(field, fieldAnalysis[field].o1 === "Array"));
                        diffs.push(diff);
                    }
                }
            }
            return diffs;
        }
        function parseField(field) {
            if (field.o1 === field.o2) {
                return getFieldLines(field.fieldAnalysis);
            } else {
                return [
                    fieldLine1([], field.o1, field.o2)
                ];
            }
        }
        return function(diffObject) {
            if (diffObject.equal) return create("div", {
                textContent: "Nessuna differenza trovata"
            });
            let fieldLines = getFieldLines(diffObject.fieldAnalysis);
            return create("table", {
                htmlContent: formatFieldLines(fieldLines)
            });
        };
    }();
    function renderToElement1(root) {
        let resultsDiv = create("div", {
            class: "results"
        });
        let object1 = create("textarea", {
            class: "object_textarea"
        });
        let object2 = create("textarea", {
            class: "object_textarea"
        });
        let compareButton = create("button", {
            events: {
                onclick: function() {
                    let o1 = object1.value;
                    let o2 = object2.value;
                    o1 = JSON.parse(o1);
                    o2 = JSON.parse(o2);
                    let compareResult = compareObject(o1, o2);
                    resultsDiv.innerHTML = "";
                    resultsDiv.appendChild(formatAsTable(compareResult));
                }
            },
            textContent: "compare"
        });
        root.appendChild(create("table", {
            elementContentList: [
                create("tr", {
                    elementContentList: [
                        create("td", {
                            textContent: "Object1:"
                        }),
                        create("td", {
                            textContent: "Object2:"
                        })
                    ]
                }),
                create("tr", {
                    elementContentList: [
                        create("td", {
                            elementContent: object1
                        }),
                        create("td", {
                            elementContent: object2
                        })
                    ]
                }), 
            ]
        }));
        root.appendChild(compareButton);
        root.appendChild(create("hr"));
        root.appendChild(resultsDiv);
        root.classList.add("_objectcompare_");
    }
    return {
        compareObject,
        formatAsTable,
        renderToElement: renderToElement1
    };
}();
class PopupContainer {
    titleContainer;
    element;
    content;
    constructor(onCloseClick){
        this.titleContainer = create("div", {
            className: "_popup_container_title_"
        });
        this.element = create("div", {
            className: "_popup_container_",
            elementContentList: [
                this.titleContainer,
                create("button", {
                    textContent: "X",
                    events: {
                        click: onCloseClick
                    },
                    className: "_close_popup_button_"
                }), 
            ],
            events: {
                click: (self, evt)=>{
                    evt._popup_clicked_ = true;
                }
            }
        });
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
    container;
    arr;
    constructor(container1){
        this.container = container1;
        this.arr = [];
    }
    clear() {
        this.container.clear();
        this.arr = [];
    }
    push(element, title) {
        this.arr.push({
            element,
            title
        });
        this.showLast();
    }
    pop() {
        this.arr.pop();
        this.showLast();
        return this.arr.length <= 0;
    }
    showLast() {
        let arlen = this.arr.length;
        if (arlen > 0) {
            let el = this.arr[this.arr.length - 1];
            this.container.show(el.element, this.buildTitle());
        } else {
            this.container.clear();
        }
    }
    buildTitle() {
        let titles = this.arr.map((a)=>a.title
        ).flatMap((title, index)=>[
                create("span", {
                    textContent: ">"
                }),
                create("span", {
                    className: "_popup_clickable-link_",
                    textContent: title,
                    events: {
                        click: ()=>this.backTo(index)
                    }
                }), 
            ]
        ).splice(1);
        return create("div", {
            className: "_popup_title_",
            elementContentList: titles
        });
    }
    backTo(index) {
        this.arr.splice(index + 1);
        this.showLast();
    }
}
let popup_container = new PopupContainer(closePopup);
let popups = new PopupList(popup_container);
let popup_bg = create("div", {
    className: "_popup_background_",
    elementContent: popup_container.element,
    events: {
        click: (_, evt)=>{
            if (evt._popup_clicked_) return;
            popups.clear();
            hidePopupBg();
        }
    }
});
function hidePopupBg() {
    popup_bg.hidden = true;
}
function showPopupBg() {
    popup_bg.hidden = false;
}
function closePopup() {
    if (popups.pop()) hidePopupBg();
}
hidePopupBg();
onWindowLoad(()=>{
    document.body.appendChild(popup_bg);
}, 15);
function create1(callback, title) {
    createPopupMain(callback, title);
    showPopupBg();
}
function createPopupMain(callback, title) {
    let pm = create("div", {
        className: "_popup_main_"
    });
    callback(pm);
    popups.push(pm, title);
}
const mod3 = {
    create: create1
};
let contextMenuContainer = create("div", {
    className: "_contextmenu_container_",
    events: {
        click: (_, evt)=>{
            evt._context_menu_clicked_ = true;
        }
    }
});
function hideBackground() {
    contextMenuContainer.hidden = true;
}
function showBackground() {
    contextMenuContainer.hidden = false;
    contextMenuContainer.focus();
}
function createMenuOptionElement(text, callback) {
    return create("div", {
        className: "_contextmenu_option_",
        textContent: text,
        events: {
            click: ()=>{
                hideBackground();
                callback();
            }
        }
    });
}
function create2(x, y, menuOptions) {
    contextMenuContainer.style.left = x + "px";
    contextMenuContainer.style.top = y + "px";
    contextMenuContainer.innerHTML = "";
    menuOptions.map((menuOption)=>createMenuOptionElement(menuOption.text, menuOption.callback)
    ).forEach((element)=>{
        contextMenuContainer.appendChild(element);
    });
    setTimeout(()=>showBackground()
    , 0);
}
function createOn(evt, menuOptions) {
    let { clientX , clientY  } = evt;
    create2(clientX, clientY, menuOptions);
}
onWindowLoad(()=>{
    document.body.appendChild(contextMenuContainer);
    document.body.addEventListener("click", (evt)=>{
        if (evt._context_menu_clicked_) return;
        hideBackground();
    });
}, 20);
hideBackground();
const mod4 = {
    create: create2,
    createOn: createOn
};
let container = create("div", {
    className: "_container_"
});
let header = create("div", {
    className: "_paging_"
});
let pages = [];
let activePage;
function createPage(pageTitle, removable = false) {
    let page = {};
    page.pseudoContainer = create("div", {
        className: "_pseudocontainer_"
    });
    page.headerButton = create("div", {
        className: "_page_" + (removable == true ? " removable" : ""),
        events: {
            click: ()=>swapTo(page)
            ,
            contextmenu: (self, evt)=>{
                if (!removable) return;
                evt.preventDefault();
                createOn(evt, [
                    {
                        text: "Close",
                        callback: ()=>removePage(page)
                    }, 
                ]);
            }
        },
        textContent: pageTitle
    });
    page.pageTitle = pageTitle;
    page.onload = ()=>{};
    return page;
}
function removePage(page) {
    pages = pages.filter((a)=>a !== page
    );
    page.headerButton.remove();
    if (activePage == page) {
        swapTo(pages[0]);
    }
}
function swapTo(page) {
    if (!pages.includes(page) || activePage === page) return;
    container.innerHTML = "";
    container.appendChild(page.pseudoContainer);
    activePage = page;
    if (activePage.onload) {
        activePage.onload();
    }
}
function addPage(name, callback, removable = false) {
    let page = createPage(name, removable);
    page.onload = callback(page.pseudoContainer);
    pages.push(page);
    header.appendChild(page.headerButton);
    if (pages.length == 1) swapTo(page);
}
onWindowLoad(()=>{
    document.body.appendChild(header);
    document.body.appendChild(container);
});
const mod5 = {
    swapTo: swapTo,
    addPage: addPage
};
let buffer = [];
let targetElement;
function createWriteSpace(content1, title1) {
    let id = generateId("write");
    let textContent = title1 == undefined ? id : title1;
    let el = create("div", {
        className: "write",
        elementContentList: [
            create("div", {
                textContent,
                className: "write-name",
                attributes: {
                    contenteditable: "true"
                }
            }),
            create("textarea", {
                id,
                className: "write-content",
                value: content1 ?? ""
            }),
            create("button", {
                textContent: "remove",
                className: "write-removal",
                events: {
                    click: (self, evt)=>{
                        self.parentElement?.remove();
                    }
                }
            }),
            create("button", {
                textContent: "download",
                className: "write-downloader",
                events: {
                    click: (self, evt)=>{
                        let title = self.parentElement?.querySelector(".write-name")?.innerText;
                        let content = self.parentElement?.querySelector(".write-content")?.value;
                        if (title != undefined && content != undefined) downloadBlob(new Blob([
                            content
                        ], {
                            type: "text/plain"
                        }), title);
                    }
                }
            }), 
        ]
    });
    return el;
}
function write(content, title) {
    if (typeof content == "object") {
        content = JSON.stringify(content);
    }
    let el = createWriteSpace(content, title);
    buffer.push(el);
    if (targetElement != undefined) {
        targetElement.appendChild(el);
    }
    return el;
}
function setTargetElement(target, addBuffered = false) {
    targetElement = target;
    if (addBuffered === true && target != undefined) {
        buffer.forEach((el)=>target.appendChild(el)
        );
    }
}
const mod6 = {
    createWriteSpace: createWriteSpace,
    write: write,
    setTargetElement: setTargetElement
};
function createPageFromLoadedLogs(loadedLogs, title1) {
    function renderToElement2(root) {
        let logDiv = create("div", {
            className: "_logdiv_"
        });
        let controlsDiv = create("div", {
            className: "_controls-container_",
            elementContentList: []
        });
        root.appendChild(create("div", {
            className: "_loghelper-container_",
            elementContentList: [
                controlsDiv,
                logDiv
            ]
        }));
        renderLogs(logDiv);
        return ()=>{};
    }
    function renderLogs(targetDiv) {
        targetDiv.innerHTML = "";
        loadedLogs.lines.map(createLogLine).forEach((a)=>targetDiv.appendChild(a)
        );
    }
    function createLogLine(log, index) {
        return create("div", {
            className: "_logline_",
            elementContentList: [
                create("span", {
                    textContent: log.message
                }),
                create("hr")
            ],
            events: {
                contextmenu: (_, evt)=>{
                    evt.preventDefault();
                    createOn(evt, createLogLineContextMenu(index));
                }
            },
            attributes: {
                jsonparsed: log._jsonParsed
            }
        });
    }
    function showDetailPopup(index) {
        let log = loadedLogs.lines[index];
        create1(createDetailPopupCallback(log), `Linea ${index}`);
    }
    function createDetailPopupCallback(log) {
        return (popupContainer)=>popupContainer.appendChild(create("div", {
                className: "_loghelper_detail_popup_",
                elementContent: objectTable(log, {
                    vertical: true,
                    tdLeftClick: (_1, _2, k, v)=>{
                        create1(createFieldDetailPopup(v), k);
                    },
                    thRightClick: (_, evt, k, v)=>{
                        evt.preventDefault();
                        createOn(evt, createThContextMenu(k, v));
                    }
                })
            }))
        ;
    }
    function createLogLineContextMenu(index) {
        return [
            {
                text: "Mostra dettagli",
                callback: ()=>showDetailPopup(index)
            }, 
        ];
    }
    function createThContextMenu(k, v) {
        return [
            {
                text: "Filter by field value",
                callback: ()=>openFilteredInNewWindow((a)=>a[k] == v
                    , title1 + `[${k} = ${v}]`)
            }, 
        ];
    }
    function openFilteredInNewWindow(filter, title) {
        let filteredLogs = {
            keySet: loadedLogs.keySet,
            lines: loadedLogs.lines.filter(filter)
        };
        createPageFromLoadedLogs(filteredLogs, title);
    }
    function createFieldDetailPopup(value) {
        return (popupContainer)=>popupContainer.appendChild(create("div", {
                className: "_loghelper_detail_popup_",
                textContent: value
            }))
        ;
    }
    addPage(title1, renderToElement2, true);
}
function createPageFromLogFile(logfile, title) {
    createPageFromLoadedLogs(parseFile(logfile), title);
}
const mod7 = {
    createPageFromLoadedLogs: createPageFromLoadedLogs,
    createPageFromLogFile: createPageFromLogFile
};
let loadedFiles = [];
function renderToElement(root) {
    let fileinput = create("input", {
        attributes: {
            type: "file"
        }
    });
    let select1 = create("select");
    let div = create("div", {
        className: "_fileloader_container_",
        elementContentList: [
            create("div", {
                className: "_fileloader_fileinput-container_",
                elementContentList: [
                    fileinput,
                    create("button", {
                        textContent: "Load",
                        events: {
                            click: async ()=>{
                                await loadCurrent();
                                upateSelect(select1);
                            }
                        }
                    }), 
                ]
            }),
            create("div", {
                className: "_fileloader_loadedfile-selector_",
                elementContentList: [
                    select1,
                    create("button", {
                        textContent: "Run as js",
                        events: {
                            click: ()=>{
                                let selectedFile = getSelectedLoadedFile(select1);
                                if (!selectedFile) return;
                                eval(selectedFile.content);
                            }
                        }
                    }),
                    create("button", {
                        textContent: "Load as logfile",
                        events: {
                            click: ()=>{
                                let file = getSelectedLoadedFile(select1);
                                if (!file) return;
                                createPageFromLogFile(file.content, file.name);
                            }
                        }
                    }), 
                ]
            }), 
        ]
    });
    function getSelectedLoadedFile(select) {
        let value = parseInt(select.value);
        if (value === -1) return null;
        return loadedFiles[value];
    }
    async function loadCurrent() {
        let file = fileinput.files[0];
        if (!file) return;
        loadedFiles.push({
            name: file.name,
            content: await loadFile(file)
        });
    }
    upateSelect(select1);
    root.appendChild(div);
    return ()=>{};
}
function getLoadedFiles() {
    return loadedFiles;
}
function getLastLoadedFile() {
    return loadedFiles[loadedFiles.length - 1];
}
function upateSelect(select) {
    select.innerHTML = "";
    createOptions(loadedFiles.map((a)=>a.name
    )).forEach((el)=>select.appendChild(el)
    );
}
function filenameToOption(filename, index) {
    return createOption(filename, index);
}
function createOptions(files) {
    let opts = [
        createOption("Seleziona file", "-1")
    ];
    files.map(filenameToOption).forEach((e)=>{
        opts.push(e);
    });
    return opts;
}
const mod8 = {
    renderToElement: renderToElement,
    getLoadedFiles: getLoadedFiles,
    getLastLoadedFile: getLastLoadedFile,
    upateSelect: upateSelect,
    filenameToOption: filenameToOption,
    createOptions: createOptions
};
window.html = mod1;
window.utils = mod;
window.logutils = mod2;
window.objectcompare = __default;
window.popups = mod3;
window.contextmenu = mod4;
window.paging = mod5;
window.writer = mod6;
window.loghelper = mod7;
window.fileloader = mod8;
mod.onWindowLoad(()=>{
    document.body.addEventListener("contextmenu", (evt)=>evt.preventDefault()
    );
});
mod5.addPage("Writer", (root)=>{
    mod6.setTargetElement(root);
    return ()=>{};
});
mod5.addPage("FileLoader", mod8.renderToElement);
mod5.addPage("ObjectCompare", __default.renderToElement);
console.log(__default);
const write1 = mod6.write;
write1();
