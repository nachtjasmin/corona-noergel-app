<script>
	import { pageTitle } from "$lib/store";
</script>

<svelte:head>
	<title>{$pageTitle}</title>
</svelte:head>

<!-- empty slot without styling -->
<slot />
