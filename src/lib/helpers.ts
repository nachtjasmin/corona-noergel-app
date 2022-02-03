import type { Receiver } from "./definitions";

/**
 * Returns a random element from the array.
 * @param input The array.
 * @returns A random element.
 */
export function getRandom<T>(input: T[]): T {
	return input[Math.floor(Math.random() * input.length)];
}

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
	return (
		input?.map((s) => {
			if (content.bundesland) {
				s = s.replace("${Bundesland}", content.bundesland);
			}
			if (content.receiver) {
				return s.replace(/\$\{(\w+)\}/g, (_, p) => content.receiver[p]);
			}
			return s;
		}) ?? []
	);
};
