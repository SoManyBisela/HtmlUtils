import { createOn } from "./contextmenu.ts";
import { create as createElement } from "./html.ts";
import { onWindowLoad } from "./utils.ts";

interface Page{
	pageTitle: string,
	headerButton: HTMLDivElement,
	pseudoContainer: HTMLDivElement,
	onload: () => void
}

let container = createElement("div", { className: "_container_" });
let header = createElement("div", { className: "_paging_" });
let pages: Page[] = [];
let activePage: Page;



function createPage(pageTitle: string, removable = false): Page {
	let page: any = {};
	page.pseudoContainer = createElement("div", { className: "_pseudocontainer_" });
	page.headerButton = createElement("div", {
		className: "_page_" + (removable == true ? " removable" : ""),
		events: {
			click: () => swapTo(page),
			contextmenu: (self, evt) => {
				if (!removable) return;
				evt.preventDefault();
				createOn(evt, [
					{ text: "Close", callback: () => removePage(page) },
				]);
			},
		},
		textContent: pageTitle,
	});
	page.pageTitle = pageTitle;
	page.onload = () => {};
	return page;
}

function removePage(page: Page) {
	pages = pages.filter((a) => a !== page);
	page.headerButton.remove();
	if (activePage == page) {
		swapTo(pages[0]);
	}
}

export function swapTo(page: Page) {
	if (!pages.includes(page) || activePage === page) return;
	container.innerHTML = "";
	container.appendChild(page.pseudoContainer);
	activePage = page;
	if (activePage.onload) {
		activePage.onload();
	}
}

type CreatePageCallback = (container: HTMLDivElement) => (() => void)

export function addPage(name: string, callback: CreatePageCallback, removable = false) {
	let page = createPage(name, removable);
	page.onload = callback(page.pseudoContainer);
	pages.push(page);
	header.appendChild(page.headerButton);
	if (pages.length == 1) swapTo(page);
}

onWindowLoad(() => {
	document.body.appendChild(header);
	document.body.appendChild(container);
});
