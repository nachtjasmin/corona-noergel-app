import { get, writable } from "svelte/store";
import type { Beschwerde, Bundeslaender } from "./definitions";

export type StoreStructure = {
	bundeslandKey: keyof Bundeslaender | "";
	empfaenger?: {
		bezeichnung: string;
		titel: string;
		name: string;
		mail: string;
		fax: string;
		anschrift: string[];
	};
	anrede: string;
	einleitung: string;
	beschwerde: Beschwerde;
	appell: Beschwerde;
	gruss: string;
	name: string;
};

const emptyStructure: StoreStructure = {
	bundeslandKey: "",
	anrede: "",
	einleitung: "",
	beschwerde: {
		text: "",
		kategorie: "",
	},
	appell: {
		text: "",
		kategorie: "",
	},
	gruss: "",
	name: "",
};

function createDataStore() {
	const structure = writable<StoreStructure>(emptyStructure);

	const buildInnerText = (): string => {
		const data = get(structure);
		return `${data.einleitung}\n${data.beschwerde.text}\n${data.appell.text}`;
	};

	const buildText = (): string => {
		const data = get(structure);
		return `${data.anrede},\n\n${buildInnerText()}\n\n${data.gruss}\n${data.name}`;
	};

	return {
		subscribe: structure.subscribe,
		update: structure.update,
		set: structure.set, // required for direct access like $data.value = <value>
		reset: () => {
			structure.set({
				...emptyStructure,
				empfaenger: get(structure).empfaenger, // do not overwrite the bundesland, it's excluded for the reset
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
