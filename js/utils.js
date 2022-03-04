const utils = function(){
    function loopObject(object, callback){
        Object.keys(object).forEach(key => {
            callback(key, object[key]);
        });
    }

    let downloadBlob = (function () {
        var a = document.createElement("a");
        a.style = "display: none";
        return function (blob, fileName) {
            document.body.appendChild(a);
            url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        };
    }());

    let windowLoadCallbacks = []

    function onWindowLoad(callback, priority = 10){
        if(!windowLoadCallbacks[priority])windowLoadCallbacks[priority] = [];
        windowLoadCallbacks[priority].push(callback);
    }

    const parseXml = function(){
        let prs = new DOMParser();
        return (xml) => {
            return prs.parseFromString(xml, "text/xml");
        }
    }()
    
    let oldOnload = window.onload;
    window.onload = (...args) => {
        if(oldOnload && oldOnload instanceof Function) oldOnload(...args);
        for(callbacks of windowLoadCallbacks){
            if(callbacks)
                for(callback of callbacks){
                    callback(...args);
                }
        }
    }

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
        parseXml,
        loopObject,
        downloadBlob,
        onWindowLoad,
        loadFile
    }

    
}();