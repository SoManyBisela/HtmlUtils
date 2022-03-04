const loghelper = function () {

    function createPageFromLoadedLogs(loadedLogs, title) {
        function _renderToElement(root) {
            let logDiv = html.create("div", {
                class: "_logdiv_"
            });
            let controlsDiv = html.create("div", {
                class: "_controls-container_",
                elementContentList: []
            });
            root.appendChild(html.create("div", {
                class: "_loghelper-container_",
                elementContentList: [
                    controlsDiv,
                    logDiv
                ]
            }));
            _renderLogs(logDiv);
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

        function _createLogLineContextMenu(index) {
            return [
                { text: "Mostra dettagli", callback: () => _showDetailPopup(index) }
            ]
        }

        function _createThContextMenu(k, v) {
            return [
                {
                    text: "Filter by field value", callback: () => 
                        _openFilteredInNewWindow(a => a[k] == v, title + `[${k} = ${v}]`)
                }
            ]
        }

        function _openFilteredInNewWindow(filter, title){
            let filteredLogs = {
                keySet: loadedLogs.keySet, 
                lines: loadedLogs.lines.filter(filter)
            };
            createPageFromLoadedLogs(filteredLogs, title);
        }

        function _createFieldDetailPopup(value) {
            return (popupContainer) =>
                popupContainer.appendChild(
                    html.create("div", {
                        class: "_loghelper_detail_popup_",
                        textContent: value
                    })
                );
        }

        paging.addPage(title, _renderToElement, true);
    }

    function createPageFromLogFile(logfile, title) {
        createPageFromLoadedLogs(logutils.parseFile(logfile), title);
    }

    return {
        createPageFromLogFile,
        createPageFromLoadedLogs
    };
}();