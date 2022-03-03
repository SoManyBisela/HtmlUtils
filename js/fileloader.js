const fileloader = function() {
    async function loadFile(file) {
        return new Promise((resolve, reject) => {
            let fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result);
            };
            fr.onerror = fr.onabort = () => {
                reject();
            }
            fr.readAsText(file);
        });
    }
    return {
        loadFile
    }
}();