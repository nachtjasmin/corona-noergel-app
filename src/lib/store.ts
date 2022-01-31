import { get, writable } from "svelte/store";
import type { Bundeslaender, Receiver, Topic, WithCategory } from "./definitions";

export type StoreStructure = {
	bundeslandKey: keyof Bundeslaender | "";
	topic?: Topic;
	empfaenger?: Receiver;
	anrede?: string;
	einleitung?: WithCategory;
	beschwerde?: WithCategory;
	appell?: WithCategory;
	gruss?: string;
	name?: string;
};

const emptyStructure: StoreStructure = { bundeslandKey: "", name: "" };

function createDataStore() {
	const structure = writable<StoreStructure>(emptyStructure);

	const buildInnerText = (): string => {
		const data = get(structure);
		return `${data.einleitung.text}\n${data.beschwerde.text}\n${data.appell.text}`;
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

				// do not overwrite the following properties
				topic: get(structure).topic,
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
