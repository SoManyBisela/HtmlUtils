
import { loopObject } from "./utils.ts"
export const findOne = document.querySelector;


export function findAll<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K][];
export function findAll<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K][];
export function findAll<E extends Element = Element>(selectors: string): E[];

export function findAll(query: any): any[] {
	return Array.from(document.querySelectorAll(query));
}

type EventCallback<K extends keyof HTMLElementTagNameMap, E extends keyof HTMLElementEventMap> = (target: HTMLElementTagNameMap[K], event: HTMLElementEventMap[E]) => void;

export type ElementOptions<K extends keyof HTMLElementTagNameMap> = {
	attributes?: {[K: string]: string};
	value?: any;
	id?: string;
	events?: {[E in keyof HTMLElementEventMap]?: EventCallback<K, E> | EventCallback<K, E>[] }
} & 
(
	{className?: string, classList?: undefined} |
	{className?: undefined, classList?: string[]}
) & 
(
	{
		elementContent?: HTMLElement;
		elementContentList?: undefined;
		htmlContent?: undefined;
		textContent?: undefined;
	} | 
	{
		elementContentList?: HTMLElement[];
		elementContent?: undefined;
		htmlContent?: undefined;
		textContent?: undefined;
	} | 
	{
		htmlContent?: string;
		elementContent?: undefined;
		elementContentList?: undefined;
		textContent?: undefined;
	} | 
	{
		textContent?: string;
		elementContent?: undefined;
		elementContentList?: undefined;
		htmlContent?: undefined;
	}
);

export function create<K extends keyof HTMLElementTagNameMap>(tagname: K, options?: ElementOptions<K>): HTMLElementTagNameMap[K] {
	let el = document.createElement(tagname);
	if (!options) return el;
	if (options.attributes != undefined) {
		loopObject(options.attributes, (k: string, v: string) => {
			el.setAttribute(k, v);
		});
	}
	if (options.className != undefined) {
		el.setAttribute("class", options.className);
	} else if (options.classList != undefined) {
		el.classList.add(...options.classList);
	}
	if (options.value != undefined) {
		(el as any).value = options.value;
	}
	if (options.id != undefined) {
		el.id = options.id;
	}
	if (options.elementContent != undefined) {
		el.appendChild(options.elementContent);
	} else if (options.elementContentList != undefined) {
		options.elementContentList.forEach((element) => {
			el.appendChild(element);
		});
	} else if (options.htmlContent != undefined) {
		el.innerHTML = options.htmlContent;
	} else if (options.textContent != undefined) {
		el.innerText = options.textContent;
	}
	if (options.events != undefined) {
		loopObject(options.events, (name: keyof HTMLElementEventMap, callbacks: any ) => {
			if(callbacks === undefined) callbacks = [];
			if (!Array.isArray(callbacks)) {
				callbacks = [callbacks];
			}
			for (let callback of callbacks) {
				el.addEventListener(name, (evt) => {
					callback(el, evt);
				});
			}
		});
	}
	return el;
}

let generatedIds: {[k: string]: number} = {};
export function generateId(name: string) {
	if (name == undefined) {
		name = "";
	} else {
		name = String(name);
	}
	if (generatedIds[name] == undefined) {
		generatedIds[name] = 0;
	} else {
		generatedIds[name]++;
	}
	return name + generatedIds[name];
}

export function createOption(text: string, value: any) {
	return create("option", {
		textContent: text,
		attributes: {
			value,
		},
	});
}

type TableCellBuilder = (value: any) => HTMLTableCellElement;
type TableRowBuilder = (cells: HTMLTableCellElement[]) => HTMLTableRowElement;
type TableBuilder = (rows: HTMLTableRowElement[]) => HTMLTableElement;
type TableCellClickHandler = (self: HTMLTableCellElement, evt: MouseEvent, key: string, value: any) => void

export type ObjectTableOptions = {
	vertical?: boolean;
	thTemplate?: TableCellBuilder;
	tdTemplate?: TableCellBuilder;
	trTemplate?: TableRowBuilder;
	tableTemplate?: TableBuilder;
	tdLeftClick?: TableCellClickHandler;
	thLeftClick?: TableCellClickHandler;
	tdRightClick?: TableCellClickHandler;
	thRightClick?: TableCellClickHandler;
}

export function objectTable(ob: any, options: ObjectTableOptions = {}) {
	let vertical = options.vertical ?? false;
	let thTemplate =
		options.thTemplate ??
		((value) => {
			return create("th", {
				textContent: value,
			});
		});
	let tdTemplate =
		options.tdTemplate ??
		((value) => {
			return create("td", {
				textContent: value,
			});
		});
	let trTemplate =
		options.trTemplate ??
		((cells) => {
			return create("tr", {
				elementContentList: cells,
			});
		});
	let tableTemplate =
		options.tableTemplate ??
		((rows) => {
			return create("table", {
				elementContentList: rows,
			});
		});
	let tdLeftClick = options.tdLeftClick ?? ((self, evt, key, value) => {});
	let thLeftClick = options.thLeftClick ?? ((self, evt, key, value) => {});
	let tdRightClick = options.tdRightClick ?? ((self, evt, key, value) => {});
	let thRightClick = options.thRightClick ?? ((self, evt, key, value) => {});

	let verticalRows = Object.keys(ob).map((k) => {
		let v = ob[k];
		let td = tdTemplate(v);
		let th = thTemplate(k);
		td.addEventListener("click", (evt) => tdLeftClick(td, evt, k, v));
		th.addEventListener("click", (evt) => thLeftClick(th, evt, k, v));
		td.addEventListener("contextmenu", (evt) =>
			tdRightClick(td, evt, k, v)
		);
		th.addEventListener("contextmenu", (evt) =>
			thRightClick(th, evt, k, v)
		);
		return [th, td];
	});
	let rows: HTMLTableRowElement[];
	if (vertical) {
		rows = verticalRows.map(trTemplate);
	} else {
		let ths: HTMLTableCellElement[] = [];
		let tds: HTMLTableCellElement[] = [];
		
		verticalRows.forEach((a) => {
			ths.push(a[0]);
			tds.push(a[1]);
		});
		rows = [trTemplate(ths), trTemplate(tds)];
	}
	return tableTemplate(rows);
}
