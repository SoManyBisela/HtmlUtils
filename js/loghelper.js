const loghelper = function () {

    let loadedLogs;

    function renderToElement(root) {
        let select = html.create("select");
        let logDiv = html.create("div", {
            class: "_logdiv_"
        });
        let controlsDiv = html.create("div", {
            class: "_controls-container_",
            elementContentList: [
                select,
                html.create("button", {
                    textContent: "Carica log",
                    events: {
                        click: () => {
                            if (select.value != -1) {
                                filecontent = fileloader.loadedFiles[select.value].content;
                                loadedLogs = logutils.parseFile(filecontent);
                                _renderLogs(logDiv);
                            }
                        }
                    }
                })
            ]
        });
        root.appendChild(html.create("div", {
            class: "_loghelper-container_",
            elementContentList: [
                controlsDiv,
                logDiv
            ]
        }))
        return () => {
            _upateSelect(select);
        };
    }

    function _renderLogs(targetDiv) {
        targetDiv.innerHTML = "";
        loadedLogs.lines
            .map(_createLogLine)
            .forEach(a => targetDiv.appendChild(a));
    }

    function _createLogLine(log, index) {
        return html.create("div", {
            class: "_logline_",
            elementContentList: [
                html.create("span", {
                    textContent: log.message
                }),
                html.create("hr")
            ],
            events: {
                aclick: () => (_showDetailPopup(index)),
                contextmenu: (_, evt) => {
                    evt.preventDefault();
                    contextmenu.createOn(evt, _createLogLineContextMenu(index));

                }
            },
            attributes: {
                jsonparsed: log._jsonParsed
            }
        });
    }

    function _showDetailPopup(index) {
        let log = loadedLogs.lines[index];
        popups.create(_createDetailPopupCallback(log), `Linea ${index}`);
    }

    function _createDetailPopupCallback(log) {
        return (popupContainer) => 
        popupContainer.appendChild(
            html.create("div", {
                class: "_loghelper_detail_popup_",
                elementContent: html.obejctTable(log, {
                    vertical: true,
                    tdLeftClick: (_1, _2, k, v) => {
                        popups.create(_createFieldDetailPopup(v), k);
                    },
                    thRightClick: (_, evt, k, v) => {
                        evt.preventDefault();
                        contextmenu.createOn(evt, _createThContextMenu(k, v))
                    }
                })
            })
        );
    }

    function _createLogLineContextMenu(index){
        return [
            {text: "Mostra dettagli", callback: () => _showDetailPopup(index)}
        ]
    }

    function _createThContextMenu(k, v){
        return [
            {text: "filterByThis", callback: () => {
                console.log(loadedLogs.lines.filter(a => a[k] == v));
            }}
        ]
    }

    function _createFieldDetailPopup(value){
        return (popupContainer) => 
        popupContainer.appendChild(
            html.create("div", {
                class: "_loghelper_detail_popup_",
                textContent: value
            })
        );
    }

    function _filenameToOption(filename, index) {
        return html.createOption(filename, index);
    }

    function _createOptions(files) {
        let opts = [
            html.createOption("Seleziona file da caricare", "-1")
        ];

        files.map(_filenameToOption).forEach(e => {
            opts.push(e);
        });

        return opts;
    }

    function _upateSelect(select) {
        select.innerHTML = "";
        _createOptions(
            fileloader.loadedFiles.map(a => a.name)
        ).forEach(el => select.appendChild(el));
    }

    function getLoadedLogs() {
        return loadedLogs;
    }

    return {
        renderToElement,
        getLoadedLogs
    };
}()