<script>
	import { goto } from "$app/navigation";
	import { data } from "$lib/store";
	import { onMount } from "svelte";

	// if data is empty, navigate back
	onMount(() => {
		if ($data.anrede === "") {
			goto("/", { replaceState: true });
			return;
		}

		// otherwise, show the default print menu
		window.print();
	});
</script>

<!-- where should the letter go? -->
<address class="receiver">
	Ministerium für Gedöns<br />
	Musterstraße 3<br />
	13245 Musterstadt
</address>

<!-- the current date -->
<p class="text-right">{new Date().toLocaleDateString("de", { dateStyle: "full" })}</p>

<p class="subject-line">TODO: Betreffzeile</p>
<p class="text">
	{data.buildInnerText()}
</p>

<p class="mt-8">
	{$data.gruss}<br />
	{$data.name}
</p>

<style>
	@page {
		size: "A4";
		margin: 0; /* margins are set by the rest of the elements */
	}

	.receiver {
		@apply not-italic;
		width: 80mm;
		height: 45mm;
		margin-top: 45mm; /* vom oberen Blattrand */
	}
	.subject-line {
		@apply font-bold text-lg mb-6;
	}
	.text {
		@apply whitespace-pre-line leading-relaxed;
	}
</style>
