<script>
	import FormContainer from "$lib/components/FormContainer.svelte";
	import { pageTitle } from "$lib/store";
	import { page } from "$app/stores";
	import "../app.css";
	import version from "../data/version.txt?raw";

	const navigation = [
		{ path: "/", name: "Startseite" },
		{ path: "/faq", name: "FAQ" },
		{ path: "/unsere-position", name: "Unsere Position" },
		{ path: "/imprint", name: "Impressum & Datenschutz" },
	];
</script>

<svelte:head>
	<title>{$pageTitle}</title>
</svelte:head>

<FormContainer>
	<nav>
		<ul class="mb-8 flex flex-col justify-center sm:flex-row sm:space-x-4">
			{#each navigation as link}
				<li>
					<a
						class="footer-link"
						href={link.path}
						aria-current={$page.url.pathname === link.path}
						class:active={$page.url.pathname === link.path}>{link.name}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
	<slot />

	<!-- The app version is set in the svelte.config.js -->
	<p class="mt-8 text-center text-xs italic text-gray-600 dark:text-gray-200">Version: {version}</p>
</FormContainer>

<style lang="postcss">
	.footer-link {
		@apply text-sm underline;
		@apply text-gray-600 dark:text-gray-200;
	}
	.footer-link.active {
		@apply font-semibold;
	}
</style>
