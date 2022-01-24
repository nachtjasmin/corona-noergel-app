/**
 * Returns a random element from the array.
 * @param input The array.
 * @returns A random element.
 */
export function getRandom<T>(input: T[]): T {
	return input[Math.floor(Math.random() * input.length)];
}
