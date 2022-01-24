export async function handle({ event, resolve }) {
	// disable SSR for all pages. Mainly used for development, as we use the adapter-static anyway.
	return await resolve(event, { ssr: false });
}
