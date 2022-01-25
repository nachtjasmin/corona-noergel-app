import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
	// disable SSR for all pages. Mainly used for development, as we use the adapter-static anyway.
	return await resolve(event, { ssr: false });
};
