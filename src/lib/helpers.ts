import type { Receiver, WithCategory } from "./definitions";

/**
 * Returns a random element from the array.
 * @param input The array.
 * @returns A random element.
 */
export function getRandom<T>(input: T[]): T {
	return input[Math.floor(Math.random() * input.length)];
}

/**
 * Filters a list by a category.
 *
 * @param input The input.
 * @param kategorie The category.
 * @returns The filtered list.
 */
export const filterByCategory = (input: WithCategory[], kategorie?: string): WithCategory[] => {
	if (!kategorie) return input;
	if (kategorie === "allgemein") return input;

	return input.filter((x) => x.kategorie === kategorie || x.kategorie === "allgemein");
};

export type ReplacementContent = {
	/** The name of the bundesland. */
	bundesland?: string;

	/** The data of the receiver. */
	receiver?: Receiver;
};

/**
 * Replaces the placeholders in each element.
 *
 * @param input The array.
 * @param content The replacement content.
 * @returns The array with replaced placeholders.
 */
export const replaceStringPlaceholders = (
	input: string[],
	content: ReplacementContent,
): string[] => {
	return input?.map((x) => replacePlaceholders(x, content)) ?? [];
};

/**
 * Replaces the placeholders in each element.
 *
 * @param input The array.
 * @param content The replacement content.
 * @returns The array with replaced placeholders.
 */
export const replaceCategoryTextPlaceholders = (
	input: WithCategory[],
	content: ReplacementContent,
): WithCategory[] => {
	const res = input?.map((x) => {
		x.text = replacePlaceholders(x.text, content);
		return x;
	});
	return res ?? [];
};

const replacePlaceholders = (s: string, content: ReplacementContent): string => {
	if (content.bundesland) {
		s = s.replace("${Bundesland}", content.bundesland);
	}
	if (content.receiver) {
		return s.replace(/\$\{(\w+)\}/g, (_, p) => content.receiver[p]);
	}
	return s;
};
