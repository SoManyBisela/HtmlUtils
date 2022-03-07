import {create as createElement} from "./html.ts";
import { onWindowLoad } from "./utils.ts";
class PopupContainer {
	titleContainer: HTMLDivElement;
	element: HTMLDivElement;
	content?: HTMLElement;

	constructor(onCloseClick: (target: HTMLElementTagNameMap["button"], event: Event) => void) {
		this.titleContainer = createElement("div", {
			className: "_popup_container_title_",
		});
		this.element = createElement("div", {
			className: "_popup_container_",
			elementContentList: [
				this.titleContainer,
				createElement("button", {
					textContent: "X",
					events: {
						click: onCloseClick,
					},
					className: "_close_popup_button_",
				}),
			],
			events: {
				click: (self, evt) => {
					(evt as any)._popup_clicked_ = true;
				},
			},
		});
	}

	show(popup: HTMLElement, titleElement: HTMLElement) {
		this.clear();
		this.content = popup;
		this.element.appendChild(popup);
		this.titleContainer.innerHTML = "";
		this.titleContainer.appendChild(titleElement);
	}

	clear() {
		if (this.content) {
			this.content.remove();
		}
	}
}

interface Popup{
	element: HTMLElement;
	title: string;
}

class PopupList {
	container: PopupContainer;
	arr: Popup[];
	constructor(container: PopupContainer) {
		this.container = container;
		this.arr = [];
	}

	clear() {
		this.container.clear();
		this.arr = [];
	}

	push(element: HTMLElement, title: string) {
		this.arr.push({ element, title });
		this.showLast();
	}

	pop() {
		this.arr.pop();
		this.showLast();
		return this.arr.length <= 0;
	}

	showLast() {
		let arlen = this.arr.length;
		if (arlen > 0) {
			let el = this.arr[this.arr.length - 1];
			this.container.show(el.element, this.buildTitle());
		} else {
			this.container.clear();
		}
	}

	buildTitle() {
		let titles = this.arr
			.map((a) => a.title)
			.flatMap((title, index) => [
				createElement("span", {
					textContent: ">",
				}),
				createElement("span", {
					className: "_popup_clickable-link_",
					textContent: title,
					events: {
						click: () => this.backTo(index),
					},
				}),
			])
			.splice(1);

		return createElement("div", {
			className: "_popup_title_",
			elementContentList: titles,
		});
	}

	backTo(index: number) {
		this.arr.splice(index + 1);
		this.showLast();
	}
}
let popup_container = new PopupContainer(closePopup);
let popups = new PopupList(popup_container);
let popup_bg = createElement("div", {
	className: "_popup_background_",
	elementContent: popup_container.element,
	events: {
		click: (_, evt) => {
			if ((evt as any)._popup_clicked_) return;
			popups.clear();
			hidePopupBg();
		},
	},
});

function hidePopupBg() {
	popup_bg.hidden = true;
}

function showPopupBg() {
	popup_bg.hidden = false;
}

function closePopup() {
	if (popups.pop()) hidePopupBg();
}

hidePopupBg();
onWindowLoad(() => {
	document.body.appendChild(popup_bg);
}, 15);


export type PopupCreator = (target: HTMLDivElement) => void;
export function create(callback: PopupCreator, title: string) {
	createPopupMain(callback, title);
	showPopupBg();
}

function createPopupMain(callback: PopupCreator, title: string) {
	let pm = createElement("div", {
		className: "_popup_main_",
	});
	callback(pm);
	popups.push(pm, title);
}
