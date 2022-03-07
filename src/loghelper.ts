import { create as createElement, objectTable as createObjectTable } from "./html.ts";
import { create as createPopup, PopupCreator } from "./popups.ts"
import { createOn } from "./contextmenu.ts";
import { parseFile, Logs, LogLine } from "./logutils.ts";
import { addPage } from "./paging.ts";

export function createPageFromLoadedLogs(loadedLogs: Logs, title: string) {
	function renderToElement(root: HTMLDivElement) {
		let logDiv = createElement("div", {
			className: "_logdiv_"
		});
		let controlsDiv = createElement("div", {
			className: "_controls-container_",
			elementContentList: [],
		});
		root.appendChild(
			createElement("div", {
				className: "_loghelper-container_",
				elementContentList: [controlsDiv, logDiv],
			})
		);
		renderLogs(logDiv);
		return () => {}
	}

	function renderLogs(targetDiv: HTMLDivElement) {
		targetDiv.innerHTML = "";
		loadedLogs.lines
			.map(createLogLine)
			.forEach((a) => targetDiv.appendChild(a));
	}

	function createLogLine(log: LogLine, index: number) {
		return createElement("div", {
			className: "_logline_",
			elementContentList: [
				createElement("span", {
					textContent: log.message,
				}),
				createElement("hr")
			],
			events: {
				contextmenu: (_, evt) => {
					evt.preventDefault();
					createOn(evt, createLogLineContextMenu(index));
				},
			},
			attributes: {
				jsonparsed: log._jsonParsed as any,
			},
		});
	}

	function showDetailPopup(index: number) {
		let log = loadedLogs.lines[index];
		createPopup(createDetailPopupCallback(log), `Linea ${index}`);
	}

	function createDetailPopupCallback(log: LogLine): PopupCreator {
		return (popupContainer) =>
			popupContainer.appendChild(
				createElement("div", {
					className: "_loghelper_detail_popup_",
					elementContent: createObjectTable(log, {
						vertical: true,
						tdLeftClick: (_1, _2, k: string, v) => {
							createPopup(createFieldDetailPopup(v), k);
						},
						thRightClick: (_, evt, k, v) => {
							evt.preventDefault();
							createOn(
								evt,
								createThContextMenu(k, v)
							);
						},
					}),
				})
			);
	}

	function createLogLineContextMenu(index: number) {
		return [
			{
				text: "Mostra dettagli",
				callback: () => showDetailPopup(index),
			},
		];
	}

	function createThContextMenu(k: string, v: any) {
		return [
			{
				text: "Filter by field value",
				callback: () =>
					openFilteredInNewWindow(
						(a) => a[k] == v,
						title + `[${k} = ${v}]`
					),
			},
		];
	}

	function openFilteredInNewWindow(filter: (log: LogLine) => boolean, title: string) {
		let filteredLogs = {
			keySet: loadedLogs.keySet,
			lines: loadedLogs.lines.filter(filter),
		};
		createPageFromLoadedLogs(filteredLogs, title);
	}

	function createFieldDetailPopup(value: any): PopupCreator {
		return (popupContainer) =>
			popupContainer.appendChild(
				createElement("div", {
					className: "_loghelper_detail_popup_",
					textContent: value,
				})
			);
	}

	addPage(title, renderToElement, true);
}

export function createPageFromLogFile(logfile: string, title: string) {
	createPageFromLoadedLogs(parseFile(logfile), title);
}
