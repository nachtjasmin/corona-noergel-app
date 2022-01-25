import { get, writable } from "svelte/store";

export type StoreStructure = {
	bundeslandKey: string;
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
	beschwerde: {
		text: string;
		kategorie: string;
	};
	appell: {
		text: string;
		kategorie: string;
	};
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
