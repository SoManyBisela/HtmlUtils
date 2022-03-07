import * as html from "./html.ts";
import * as utils from "./utils.ts";
import * as logutils from "./logutils.ts";
import objectcompare from "./objectcompare.js";
import * as popups from "./popups.ts";
import * as contextmenu from "./contextmenu.ts";
import * as paging from "./paging.ts";
import * as writer from "./writer.ts";
import * as loghelper from "./loghelper.ts";
import * as fileloader from "./fileloader.ts";

(window as any).html = html;
(window as any).utils = utils;
(window as any).logutils = logutils;
(window as any).objectcompare = objectcompare;
(window as any).popups = popups;
(window as any).contextmenu = contextmenu;
(window as any).paging = paging;
(window as any).writer = writer;
(window as any).loghelper = loghelper;
(window as any).fileloader = fileloader;

utils.onWindowLoad(() => {
	document.body.addEventListener("contextmenu", (evt) =>
		evt.preventDefault()
	);
});

paging.addPage("Writer", (root) => {
	writer.setTargetElement(root);
	return () => {};
});
paging.addPage("FileLoader", fileloader.renderToElement);
paging.addPage("ObjectCompare", (objectcompare as any).renderToElement);
console.log(objectcompare);
const write = writer.write;
write();