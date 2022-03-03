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

    function onWindowLoad(callback){
        let a = window.onload;
        window.onload = (...args) => {
            if(a && a instanceof Function) a(...args);
            callback(...args);
        };
    }

    const parseXml = function(){
        let prs = new DOMParser();
        return (xml) => {
            return prs.parseFromString(xml, "text/xml");
        }
    }()


    return {
        parseXml,
        loopObject,
        downloadBlob,
        onWindowLoad
    }

    
}();