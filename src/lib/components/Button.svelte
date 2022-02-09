<script lang="ts">
	export let type: "button" | "submit" | "reset" = "button";
	export let size: "small" | "regular" = "regular";
	export let href = "";
	let clazz = "";
	export { clazz as class };
</script>

{#if href !== ""}
	<a class="btn {clazz}" class:small={size === "small"} on:click {href}>
		<slot />
	</a>
{:else}
	<button {type} class="btn {clazz}" class:small={size === "small"} on:click>
		<slot />
	</button>
{/if}

<style lang="postcss">
	.btn {
		@apply inline-block rounded px-4 py-2 motion-safe:transition-colors;
		@apply bg-green-200 text-black;
		@apply border border-green-800;
		@apply hover:bg-green-300;
		@apply active:bg-green-800 active:text-white;

		@apply dark:bg-green-600 dark:text-white dark:hover:bg-green-700 dark:active:bg-green-900;
	}

	.small {
		@apply px-3 py-1 text-sm;
	}
</style>
