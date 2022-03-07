import { create } from "./html.ts";
import { generateId } from "./html.ts";
import { downloadBlob } from "./utils.ts";

let buffer: HTMLDivElement[] = [];
let targetElement: HTMLDivElement | undefined;
export function createWriteSpace(content?: string, title?: string) {
	let id = generateId("write");
	let textContent = title == undefined ? id : title;
	let el = create("div", {
		className: "write",
		elementContentList: [
			create("div", {
				textContent,
				className: "write-name",
				attributes: {
					contenteditable: "true",
				},
			}),
			create("textarea", {
				id,
				className: "write-content",
				value: content ?? "",
			}),
			create("button", {
				textContent: "remove",
				className: "write-removal",
				events: {
					click: (self, evt) => {
						self.parentElement?.remove();
					},
				},
			}),
			create("button", {
				textContent: "download",
				className: "write-downloader",
				events: {
					click: (self, evt) => {
						let title = (
							self.parentElement?.querySelector(
								".write-name"
							) as HTMLElement | null
						)?.innerText;
						let content = (
							self.parentElement?.querySelector(
								".write-content"
							) as HTMLInputElement | null
						)?.value;
						if (title != undefined && content != undefined)
							downloadBlob(
								new Blob([content], { type: "text/plain" }),
								title
							);
					},
				},
			}),
		],
	});
	return el;
}

export function write(content?: any, title?: string) {
	if (typeof content == "object") {
		content = JSON.stringify(content);
	}
	let el = createWriteSpace(content, title);
	buffer.push(el);
	if (targetElement != undefined) {
		targetElement.appendChild(el);
	}
	return el;
}

export function setTargetElement(target: HTMLDivElement, addBuffered = false) {
	targetElement = target;
	if (addBuffered === true && target != undefined) {
		buffer.forEach((el) => target.appendChild(el));
	}
}
