const objectcompare = function () {
    let compareObject = function () {
        function addArrToSet(set, arr) {
            for (let i = 0; i < arr.length; i++) {
                set.add(arr[i]);
            }
        }

        function distinctSortedArrayFromArrays(...arrays) {
            let set = new Set();
            for (let i = 0; i < arrays.length; i++) {
                addArrToSet(set, arrays[i]);
            }
            return Array.from(set)
                .sort((a, b) => {
                    let a1 = String(a).toLowerCase();
                    let b1 = String(b).toLowerCase();
                    return a1.localeCompare(b1);
                });
        }

        function getType(a) {
            if (a instanceof Array) return "Array";
            if (a instanceof Object) return "Object";
            if (typeof (a) === "string") return "String";
            if (typeof (a) === "number") return "Number";
            if (typeof (a) === "boolean") return "Boolean";
            if (typeof (a) === "undefined") return "Missing";
            return "Other";
        }

        return function (o1, o2) {
            let allKeysSet = distinctSortedArrayFromArrays(Object.keys(o1), Object.keys(o2));
            let result = { equal: true, fieldAnalysis: {} };

            for (const key of allKeysSet) {
                value1 = o1[key];
                value2 = o2[key];
                type1 = getType(value1);
                type2 = getType(value2);
                result.fieldAnalysis[key] = { o1: type1, o2: type2 };
                if (type1 === type2) {
                    if (type1 === "Object" || type1 === "Array") {
                        let comparison = compareObject(value1, value2);
                        result.fieldAnalysis[key].equal = comparison.equal;
                        result.equal = result.equal && comparison.equal;
                        result.fieldAnalysis[key].fieldAnalysis = comparison.fieldAnalysis;
                    } else {
                        result.fieldAnalysis[key].equal = true;
                    }
                } else {
                    result.fieldAnalysis[key].equal = false;
                    result.equal = false;
                }
            }

            return result;
        }
    }();

    let formatAsTable = function () {

        function fieldLine(fieldParts, o1, o2) {
            return { fieldParts, o1, o2 };
        }

        function fieldPart(name, isArrIndex) {
            return { name, isArrIndex };
        }

        function getFullFieldName(fieldParts) {
            let fieldName = "";
            let isArr = false;
            for (let fieldPart of fieldParts) {
                if (isArr) {
                    fieldName += `[${fieldPart.name}]`;

                    isArr = fieldPart.isArrIndex;
                    continue;
                }
                if (fieldName.length > 0)
                    fieldName += ".";
                fieldName += fieldPart.name;
                isArr = fieldPart.isArrIndex;
            }
            return fieldName;
        }

        function formatFieldLines(fieldLines) {
            let fieldRows = fieldLines.map(fieldLine => {
                let fullFieldName = getFullFieldName(fieldLine.fieldParts);
                let o1 = fieldLine.o1;
                let o2 = fieldLine.o2;
                return `<tr>
                            <td>${fullFieldName}</td>
                            <td>${o1}</td>
                            <td>${o2}</td>
                        </tr>`;
            }).join("\n");
            let table = `<thead>
                            <tr>
                                <th>Field</th>
                                <th>Object1</th>
                                <th>Object2</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${fieldRows}
                        </tbody>`;
            return table;
        }

        function getFieldLines(fieldAnalysis) {
            let fields = Array.from(Object.keys(fieldAnalysis));
            let diffs = [];
            for (let field of fields) {
                if (!fieldAnalysis[field].equal) {
                    let newdiffs = parseField(fieldAnalysis[field]);
                    for (diff of newdiffs) {
                        diff.fieldParts.unshift(
                            fieldPart(field, fieldAnalysis[field].o1 === "Array")
                        );
                        diffs.push(diff);
                    }

                }

            }
            return diffs;
        }

        function parseField(field) {
            if (field.o1 === field.o2) {
                return getFieldLines(field.fieldAnalysis);
            } else {
                return [fieldLine([], field.o1, field.o2)];
            }
        }
        return function (diffObject) {
            if (diffObject.equal)
                return html.create("div", {
                    textContent: "Nessuna differenza trovata"
                });

            let fieldLines = getFieldLines(diffObject.fieldAnalysis);
            return html.create("table", {
                htmlContent: formatFieldLines(fieldLines)
            });
        }
    }();

    function renderToElement(root) {
        let resultsDiv = html.create("div", { class: "results" });
        let object1 = html.create("textarea", { class: "object_textarea" });
        let object2 = html.create("textarea", { class: "object_textarea" });
        let compareButton = html.create("button", {
            events: {
                onclick: function () {
                    let o1 = object1.value;
                    let o2 = object2.value;
                    o1 = JSON.parse(o1);
                    o2 = JSON.parse(o2);
                    let compareResult = compareObject(o1, o2);
                    resultsDiv.innerHTML = "";
                    resultsDiv.appendChild(formatAsTable(compareResult));
                }
            },
            textContent: "compare"
        });
        root.appendChild(
            html.create("table", {
                elementContentList: [
                    html.create("tr", {
                        elementContentList: [
                            html.create("td", { textContent: "Object1:" }),
                            html.create("td", { textContent: "Object2:" })
                        ]
                    }),
                    html.create("tr", {
                        elementContentList: [
                            html.create("td", { elementContent: object1 }),
                            html.create("td", { elementContent: object2 })
                        ]
                    }),
                ]
            })
        )
        root.appendChild(compareButton);
        root.appendChild(html.create("hr"));
        root.appendChild(resultsDiv);
        root.classList.add("_objectcompare_")
    }

    return {
        compareObject,
        formatAsTable,
        renderToElement
    }
}();