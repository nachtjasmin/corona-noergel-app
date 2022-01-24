<script lang="ts">
	import { goto } from "$app/navigation";
	import { getRandom } from "$lib/helpers";
	import config from "../../data/cna.json";

	import { data } from "$lib/store";
	import { onMount, tick } from "svelte";

	let subject: string = "";
	let receiver: string = "";

	// if data is empty, navigate back
	onMount(async () => {
		if ($data.anrede === "") {
			goto("/", { replaceState: true });
			return;
		}
		subject = getRandom(config.betreff);
		const to = config.bundeslaender[$data.bundesland];
		receiver = to.bezeichnung + "\n";
		to.anschrift.forEach((l: string) => (receiver += l + "\n"));

		await tick(); // wait for changes to be applied
		window.print(); // finally print the current page
	});
</script>

<!-- where should the letter go? -->
<address class="receiver whitespace-pre-line">
	{receiver}
</address>

<!-- the current date -->
<p class="text-right">{new Date().toLocaleDateString("de", { dateStyle: "full" })}</p>

<p class="subject-line">{subject}</p>
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
		@apply font-bold text-lg mt-2 mb-6;
	}
	.text {
		@apply whitespace-pre-line leading-relaxed;
	}
</style>
