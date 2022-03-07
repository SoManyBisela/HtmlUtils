export type Callback<T, K extends keyof T> = (key: K, value: T[K]) => void;
export function loopObject<T, K extends keyof T>(
	object: T,
	callback: Callback<T, K>
) {
	Object.keys(object).forEach((key: any) => {
		callback(key, object[key as keyof T] as any);
	});
}

const blowDownloaderLink = document.createElement("a");
blowDownloaderLink.style.display = "none";

export function downloadBlob(blob: Blob, fileName: string){
	document.body.appendChild(blowDownloaderLink);
	let url = window.URL.createObjectURL(blob);
	blowDownloaderLink.href = url;
	blowDownloaderLink.download = fileName;
	blowDownloaderLink.click();
	window.URL.revokeObjectURL(url);
	blowDownloaderLink.remove();
}

const windowLoadCallbacks: (() => void)[][]  = [];
export function onWindowLoad(callback: () => void, priority = 10) {
	if (!windowLoadCallbacks[priority]) windowLoadCallbacks[priority] = [];
	windowLoadCallbacks[priority].push(callback);
}

const domParser = new DOMParser();
export function parseXml(xml: string): Document {
	return domParser.parseFromString(xml, "text/xml");
}

window.addEventListener("load", () => windowLoadCallbacks.flat().forEach(f => f()));

export async function loadFile(file: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		let fr = new FileReader();
		fr.onload = () => resolve(fr.result as string);
		fr.onerror = reject;
		fr.readAsText(file);
	});
}
