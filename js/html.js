const html = function(){
    function findOne(query){
        return document.querySelector(query);
    }
    function findAll(query){
        return Array.from(document.querySelectorAll(query));
    }
    function create(tagname, options){
        let el = document.createElement(tagname);
        if(!options) return el;
        if(options.attributes != undefined){
            utils.loopObject(options.attributes, (k, v) => {
                el.setAttribute(k, v);
            });
        }
        if(options.class != undefined){
            el.setAttribute("class", options.class);
        }else if(options.classlist != undefined){
            el.classList.add(...classlist);
        }
        if(options.value != undefined){
            el.value = options.value;
        }
        if(options.id != undefined){
            el.id = options.id;
        }
        if(options.elementContent != undefined){
            el.appendChild(options.elementContent);
        }else if(options.elementContentList != undefined){
            options.elementContentList.forEach(element => {
                el.appendChild(element);
            });
        }else if(options.htmlContent != undefined){
            el.innerHTML = options.htmlContent;
        }else if(options.textContent != undefined){
            el.innerText = options.textContent;
        }
        if(options.events != undefined){
            utils.loopObject(options.events, (name, callbacks) => {
                if(name.startsWith("on")){
                    name = name.substr(2);
                }
                if(!Array.isArray(callbacks)){
                    callbacks = [callbacks];
                }
                for(let callback of callbacks){
                    el.addEventListener(name, (evt) => {
                        callback(el, evt);
                    });
                }
            });
        }
        return el;
    }
    let generatedIds = {};
    function generateId(name){
        if(name == undefined){
            name = "";
        }else{
            name = String(name);
        }
        if(generatedIds[name] == undefined){
            generatedIds[name] = 0;
        }else{
            generatedIds[name]++;
        }
        return name + generatedIds[name];
    }

    function createOption(text, value){
        return create("option", {
            textContent: text,
            attributes: {
                value
            }
        });
    }

    function obejctTable(ob, options= {}){
        let vertical = options.vertical ?? false;
        let thTemplate = options.thTemplate ?? ((value) => {
            return create("th", {
                textContent: value
            });
        });
        let tdTemplate = options.tdTemplate ?? ((value) => {
            return create("td", {
                textContent: value
            });
        });
        let trTemplate = options.trTemplate ?? ((cells) => {
            return create("tr", {
                elementContentList: cells
            })
        });
        let tableTemplate = options.tableTemplate ?? ((rows) => {
            return create("table", {
                elementContentList: rows
            })
        });
        let tdClicked = options.tdClicked ?? ((key, value) => {});
        let thClicked = options.thClicked ?? ((key, value) => {});

            
        let keys = Object.keys(ob);
        let ths = keys.map(thTemplate);
        let tds = keys.map(a => ob[a]).map(tdTemplate);
        let rows = [];
        if(vertical){
            for(let idx = 0; idx < keys.length; idx++){
                rows.push(trTemplate([ths[idx], tds[idx]]));
            }
        }else{
            rows.push(trTemplate(ths));
            rows.push(trTemplate(tds));
        }
        return tableTemplate(rows);
    }

    return {
        create,
        generateId,
        findOne,
        findAll,
        createOption,
        obejctTable
    };
}();