import { get, writable } from "svelte/store";

export type StoreStructure = {
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

	const buildText = (): string => {
		const data = get(structure);
		return `${data.anrede},\n\n${data.einleitung}\n${data.beschwerde.text}\n${data.appell.text}\n\n${data.gruss}\n${data.name}`;
	};

	return {
		subscribe: structure.subscribe,
		update: structure.update,
		set: structure.set, // required for direct access like $data.value = <value>
		reset: () => structure.set({ ...emptyStructure }),
		buildText,
	};
}

export const data = createDataStore();
