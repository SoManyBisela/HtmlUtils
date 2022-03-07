import { create as createElement } from "./html.ts"
import { onWindowLoad } from "./utils.ts";

let contextMenuContainer = createElement("div", {
	className: "_contextmenu_container_",
	events: {
		click: (_, evt) => {
			(evt as any)._context_menu_clicked_ = true;
		},
	},
});

function hideBackground() {
	contextMenuContainer.hidden = true;
}
function showBackground() {
	contextMenuContainer.hidden = false;
	contextMenuContainer.focus();
}

function createMenuOptionElement(text: string, callback: () => void) {
	return createElement("div", {
		className: "_contextmenu_option_",
		textContent: text,
		events: {
			click: () => {
				hideBackground();
				callback();
			},
		},
	});
}

interface MenuOption{
	text: string;
	callback: () => void;
}

export function create(x: number, y: number, menuOptions: MenuOption[]) {
	contextMenuContainer.style.left = x + "px";
	contextMenuContainer.style.top = y + "px";
	contextMenuContainer.innerHTML = "";
	menuOptions
		.map((menuOption) =>
			createMenuOptionElement(menuOption.text, menuOption.callback)
		)
		.forEach((element) => {
			contextMenuContainer.appendChild(element);
		});
	setTimeout(() => showBackground(), 0);
}

export function createOn(evt: MouseEvent, menuOptions: MenuOption[]) {
	let { clientX, clientY } = evt;
	create(clientX, clientY, menuOptions);
}


onWindowLoad(() => {
	document.body.appendChild(contextMenuContainer);
	document.body.addEventListener("click", (evt) => {
		if ((evt as any)._context_menu_clicked_) return;
		hideBackground();
	});
}, 20);
hideBackground();
