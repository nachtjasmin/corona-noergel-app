import { writable } from "svelte/store";
import cnaJson from "../data/cna.json";
import type { CNAData } from "./definitions";

const getCopy = () => JSON.parse(JSON.stringify(cnaJson)) as CNAData;

const createCNADataStore = () => {
	const { set, subscribe } = writable(getCopy());

	return {
		subscribe,
		reset: () => set(getCopy()),
	};
};

export const cna = createCNADataStore();
