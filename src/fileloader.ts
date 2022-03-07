
import { create, createOption } from "./html.ts";
import { createPageFromLogFile } from "./loghelper.ts";
import { loadFile } from "./utils.ts";

let loadedFiles: File[] = [];

export interface File{
	name: string;
	content: string;
}
export function  renderToElement(root: HTMLDivElement): () => void {
	let fileinput = create("input", {
		attributes: {
			type: "file",
		},
	});

	let select = create("select");

	let div = create("div", {
		className: "_fileloader_container_",
		elementContentList: [
			create("div", {
				className: "_fileloader_fileinput-container_",
				elementContentList: [
					fileinput,
					create("button", {
						textContent: "Load",
						events: {
							click: async () => {
								await loadCurrent();
								upateSelect(select);
							},
						},
					}),
				],
			}),
			create("div", {
				className: "_fileloader_loadedfile-selector_",
				elementContentList: [
					select,
					create("button", {
						textContent: "Run as js",
						events: {
							click: () => {
								let selectedFile =
									getSelectedLoadedFile(select);
								if (!selectedFile) return;
								eval(selectedFile.content);
							},
						},
					}),
					create("button", {
						textContent: "Load as logfile",
						events: {
							click: () => {
								let file = getSelectedLoadedFile(select);
								if (!file) return;
								createPageFromLogFile(
									file.content,
									file.name
								);
							},
						},
					}),
				],
			}),
		],
	});

	function getSelectedLoadedFile(select: HTMLSelectElement) {
		let value = parseInt(select.value);
		if (value === -1) return null;
		return loadedFiles[value];
	}

	async function loadCurrent() {
		let file = fileinput.files![0];
		if (!file) return;
		loadedFiles.push({
			name: file.name,
			content: await loadFile(file),
		});
	}
	upateSelect(select);

	root.appendChild(div);
	return () => {};
}

export function  getLoadedFiles() {
	return loadedFiles;
}

export function  getLastLoadedFile() {
	return loadedFiles[loadedFiles.length - 1];
}

export function upateSelect(select: HTMLSelectElement) {
	select.innerHTML = "";
	createOptions(loadedFiles.map((a) => a.name)).forEach((el) =>
		select.appendChild(el)
	);
}

export function filenameToOption(filename: string, index: number) {
	return createOption(filename, index);
}

export function createOptions(files: string[]) {
	let opts = [createOption("Seleziona file", "-1")];

	files.map(filenameToOption).forEach((e) => {
		opts.push(e);
	});

	return opts;
}
