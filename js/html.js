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
        let tdClicked = options.tdClicked ?? ((self, key, value) => {});
        let thClicked = options.thClicked ?? ((self, key, value) => {});

        let verticalRows = Object.keys(ob).map(k => {
            let v = ob[k];
            let td = tdTemplate(v);
            let th = thTemplate(k);
            td.addEventListener("click", () => tdClicked(td, k, v));
            th.addEventListener("click", () => thClicked(th, k, v));
            return [th, td];
        });
        let rows;
        if(vertical){
            rows = verticalRows.map(trTemplate);
        }else{
            let ths = [];
            let tds = [];
            rows.forEach(a => {
                ths.push(a[0]);
                tds.push(a[1]);
            });
            rows = [ths.map(trTemplate), tds.map(trTemplate)];
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