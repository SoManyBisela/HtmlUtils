const fileloader = function() {
    let loadedFiles = [];
    function renderToElement(root){
        let infile = html.create("input", {
            attributes: {
                type: "file"
            }
        });
        root.appendChild(infile);
        fileloader.load = async function () {
            return await utils.loadFile(infile.files[0]);
        };

        async function _loadCurrent() {
            let file = infile.files[0];
            if (!file) return;
            loadedFiles.push({
                name: file.name,
                content: await utils.loadFile(file)
            });
        }
        root.appendChild(html.create("button", {
            textContent: "Load",
            events: {
                click: _loadCurrent
            }
        }));
        root.appendChild(html.create("button", {
            textContent: "Run as js",
            events: {
                click: async () => {
                    await _loadCurrent();
                    eval(getLastLoadedFile().content)
                }
            }
        }));
        root.appendChild(html.create("button", {
            textContent: "Load as logfile",
            events: {
                click: async () => {
                    await _loadCurrent();
                    let file = getLastLoadedFile();
                    loghelper.createPageFromLogFile(file.content, file.name);
                }
            }
        }))
    }

    function getLoadedFiles(){
        return loadedFiles;
    }

    function getLastLoadedFile(){
        return loadedFiles[loadedFiles.length - 1];
    }

    return  {
        renderToElement,
        getLoadedFiles,
        getLastLoadedFile
    }
}();