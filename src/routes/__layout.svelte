<script>
	import FormContainer from "$lib/components/FormContainer.svelte";
	import { pageTitle } from "$lib/store";
	import "../app.css";
	import version from "../data/version.txt?raw";
</script>

<svelte:head>
	<title>{$pageTitle}</title>
</svelte:head>

<FormContainer>
	<slot />
	<ul class="flex flex-col sm:flex-row sm:space-x-4 justify-center mb-8">
		<li><a href="/" class="footer-link">Startseite</a></li>
		<li><a href="/imprint" class="footer-link">Impressum & Datenschutzerklärung</a></li>
	</ul>

	<!-- The app version is set in the svelte.config.js -->
	<p class="text-center italic text-xs mt-8 text-gray-600 dark:text-gray-200">Version: {version}</p>
</FormContainer>

<style lang="postcss">
	.footer-link {
		@apply text-sm underline;
		@apply text-gray-600 dark:text-gray-200;
	}
</style>
