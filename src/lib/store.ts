import { get, writable } from "svelte/store";
import type { Bundeslaender, Receiver } from "./definitions";

export type StoreStructure = {
	bundeslandKey: keyof Bundeslaender | "";
	topicName?: string;
	empfaenger?: Receiver;
	anrede?: string;
	einleitung?: string;
	beschwerde?: string;
	appell?: string;
	gruss?: string;
	name?: string;
};

const emptyStructure: StoreStructure = { bundeslandKey: "", name: "" };

const appendedText =
	"Ausführlichere Informationen zu meiner Position finden sich unter: https://beschweren.rocks/unsere-position";

function createDataStore() {
	const structure = writable<StoreStructure>(emptyStructure);

	const buildInnerText = (appendLinkToPosition = false): string => {
		const data = get(structure);
		let result = `${data.einleitung}\n${data.beschwerde}\n${data.appell}`;
		if (appendLinkToPosition) result += "\n" + appendedText;
		return result;
	};

	const buildText = (appendLinkToPosition = false): string => {
		const data = get(structure);
		return `${data.anrede},\n\n${buildInnerText(appendLinkToPosition)}\n\n${data.gruss}\n${
			data.name
		}`;
	};

	return {
		subscribe: structure.subscribe,
		update: structure.update,
		set: structure.set, // required for direct access like $data.value = <value>
		reset: () => {
			structure.set({
				...emptyStructure,

				// do not overwrite the following properties
				topicName: get(structure).topicName,
				bundeslandKey: get(structure).bundeslandKey,
			});
		},
		buildText,
		buildInnerText,
	};
}
export const data = createDataStore();

function buildPageTitleStore() {
	const appName = "Corona-Nörgel-App";
	const { subscribe, set } = writable<string>(appName);

	return {
		subscribe,
		setTitle: (title: string) => set(`${title} | ${appName}`),
		reset: () => set(appName),
	};
}

export const pageTitle = buildPageTitleStore();
