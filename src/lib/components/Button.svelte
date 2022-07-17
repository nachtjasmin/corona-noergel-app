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
		@apply bg-accent-200 text-black;
		@apply border border-accent-800;
		@apply hover:bg-accent-300;
		@apply active:bg-accent-800 active:text-white;

		@apply dark:bg-accent-600 dark:text-white dark:hover:bg-accent-700 dark:active:bg-accent-900;
	}

	.small {
		@apply px-3 py-1 text-sm;
	}
</style>
