const fileloader = function() {
    let loadedFiles = [];
    function renderToElement(root){

        let fileinput = html.create("input", {
            attributes: {
                type: "file"
            }
        });

        let select = html.create("select");

        let div = html.create("div", {
            class : "_fileloader_container_",
            elementContentList: [
                html.create("div", {
                    class: "_fileloader_fileinput-container_",
                    elementContentList: [
                        fileinput,
                        html.create("button", {
                            textContent: "Load",
                            events: {
                                click:  async () => {
                                    await _loadCurrent();
                                    _upateSelect(select);
                                }
                            }
                        })
                    ]
                }),
                html.create("div", {
                    class: "_fileloader_loadedfile-selector_",
                    elementContentList: [
                        select,
                        html.create("button", {
                            textContent: "Run as js",
                            events: {
                                click: () => {
                                    let selectedFile = _getSelectedLoadedFile(select);
                                    if(!selectedFile) return;
                                    eval(selectedFile.content)
                                }
                            }
                        }),
                        html.create("button", {
                            textContent: "Load as logfile",
                            events: {
                                click: () => {
                                    let file = _getSelectedLoadedFile(select);
                                    if(!file) return;
                                    loghelper.createPageFromLogFile(file.content, file.name);
                                }
                            }
                        })

                    ]
                })
            ]
        });

        function _getSelectedLoadedFile(select){
            if(select.value == -1) return null;
            return loadedFiles[select.value];
        }

        async function _loadCurrent() {
            let file = fileinput.files[0];
            if (!file) return;
            loadedFiles.push({
                name: file.name,
                content: await utils.loadFile(file)
            });
        }
        _upateSelect(select);

        root.appendChild(div);
    }

    function getLoadedFiles(){
        return loadedFiles;
    }

    function getLastLoadedFile(){
        return loadedFiles[loadedFiles.length - 1];
    }

    function _upateSelect(select) {
        select.innerHTML = "";
        _createOptions(
            loadedFiles.map(a => a.name)
        ).forEach(el => select.appendChild(el));
    }

    function _filenameToOption(filename, index) {
        return html.createOption(filename, index);
    }

    function _createOptions(files) {
        let opts = [
            html.createOption("Seleziona file", "-1")
        ];

        files.map(_filenameToOption).forEach(e => {
            opts.push(e);
        });

        return opts;
    }


    return  {
        renderToElement,
        getLoadedFiles,
        getLastLoadedFile
    }
}();