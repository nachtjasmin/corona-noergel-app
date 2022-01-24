<script lang="ts">
	export let type: "button" | "submit" | "reset" = "button";
	export let size: "small" | "regular" = "regular";
</script>

<button {type} class:small={size === "small"} on:click>
	<slot />
</button>

<style lang="postcss">
	button {
		@apply inline-block px-4 py-2 rounded motion-safe:transition-colors;
		@apply bg-green-200 text-black;
		@apply border border-green-800;
		@apply hover:bg-green-300;
		@apply active:bg-green-800 active:text-white;
	}

	.small {
		@apply text-sm px-3 py-1;
	}
</style>
