export interface Logs{
	keySet: string[],
	lines: LogLine[]
}

export interface LogLine{
	_jsonParsed: boolean;
	[x: string]: any;
}

export function parseFile(filecontent: string): Logs {
	let keySet = new Set<string>();
	let lines = filecontent.split("\n").map((a) => {
		let parsed;
		try {
			parsed = JSON.parse(a);
			parsed._jsonParsed = true;
		} catch (e) {
			parsed = {
				message: a,
				_jsonParsed: false,
			};
		}
		Object.keys(parsed).forEach((a: string) => keySet.add(a));
		return parsed;
	});
	return {
		keySet: Array.from(keySet),
		lines,
	};
}

export function groupBy(logs: LogLine[], field: string) {
	let obj: any = {};
	function add(val: any, log: LogLine) {
		if (!obj[val]) obj[val] = [];
		obj[val].push(log);
	}
	logs.forEach((log) => {
		add(log[field], log);
	});
	return obj;
}
