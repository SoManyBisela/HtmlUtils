const logutils = function(){
    function parseFile(filecontent){
        let keySet = new Set();
        let lines = filecontent.split("\n").map(a => {
            let parsed;
            try{
                parsed = JSON.parse(a);
                parsed._jsonParsed = true;
            }catch(e){
                parsed = {
                    message: a,
                    _jsonParsed: false
                }
            }
            Object.keys(parsed).forEach(a => keySet.add(a));
            return parsed;
        });
        return {
            keySet,
            lines
        }
    }

    function groupBy(logs, field){
        let obj = {};
        function add(val, log){
            if(!obj[val]) obj[val] = [];
            obj[val].push(log);
        }
        logs.forEach(log => {
            add(log[field], log);
        });
        return obj;
    }

    return {
        parseFile,
        groupBy
    }
}();