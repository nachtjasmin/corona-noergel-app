<script lang="ts">
	import { goto } from "$app/navigation";
	import { getRandom } from "$lib/helpers";
	import config from "../../data/cna.json";

	import { data } from "$lib/store";
	import { onMount } from "svelte";
	import FormContainer from "$lib/components/FormContainer.svelte";
	import Button from "$lib/components/Button.svelte";
	import MonospacedInfo from "$lib/components/MonospacedInfo.svelte";

	let letterInformation: {
		name?: string;
		address1?: string;
		address2?: string;
		postalCode?: string;
		city?: string;
	} = {
		name: $data.name,
	};

	let subject: string = "";
	let receiver: string = "";
	let fax: string = "";

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
		fax = to.fax;
	});
</script>

<form class="print:hidden">
	<FormContainer>
		<p class="mb-4 italic">
			Dieses Feature ist noch in einer Entwicklungsphase, daher kann es noch zu Darstellungsfehlern
			kommen. Probleme können über die Mail-Adresse im <a class="underline" href="/imprint"
				>Impressum</a
			> gerne gemeldet werden.
		</p>
		<p class="mb-12 text-base">
			Damit dein Brief auch alle notwendigen Daten enthält, brauchen wir noch ein paar weitere
			Informationen. Diese Informationen werden zu keinem Zeitpunkt an uns übermittelt.
		</p>
		<label for="name">Dein vollständiger Name</label>
		<input type="text" id="name" bind:value={letterInformation.name} />
		<label for="address1">Addresszeile 1</label>
		<input
			id="address1"
			placeholder="Musterstraße 1"
			type="text"
			bind:value={letterInformation.address1}
		/>
		<label for="address2">Addresszeile 2</label>
		<input
			id="address2"
			placeholder="(optional)"
			type="text"
			bind:value={letterInformation.address2}
		/>
		<label for="postalCode">Postleitzahl (PLZ)</label>
		<input
			id="postalCode"
			placeholder="12345"
			type="text"
			bind:value={letterInformation.postalCode}
		/>
		<label for="city">Stadt</label>
		<input id="city" type="text" placeholder="Musterstadt" bind:value={letterInformation.city} />
		<Button on:click={() => window.print()}>Brief ausdrucken</Button>

		<p class="mt-8 text-center">
			<span> Du kannst diesen Brief auch per Fax an folgende Fax-Nummer senden: </span>
			<br />
			<MonospacedInfo class="mt-2 text-lg">{fax}</MonospacedInfo>
		</p>
	</FormContainer>
</form>

<section class="hidden print:block letter">
	<!-- where should the letter go? -->
	<div class="receiver-wrapper">
		<address class="receiver">
			<p class="whitespace-pre-line">{receiver}</p>
		</address>
		<div class="text-right justify-self-end">
			<p>{letterInformation.name}</p>
			<p>{letterInformation.address1}</p>
			{#if letterInformation.address2}
				<p>{letterInformation.address2}</p>
			{/if}
			<p>{letterInformation.postalCode} {letterInformation.city}</p>
		</div>
	</div>

	<!-- the current date -->
	<p class="text-right mt-8">{new Date().toLocaleDateString("de", { dateStyle: "full" })}</p>

	<p class="subject-line">{subject}</p>
	<p class="text">
		{data.buildInnerText()}
	</p>

	<p class="mt-8">{$data.gruss}</p>
	<p class="mt-[2cm]">{letterInformation.name}</p>
</section>

<style lang="postcss">
	label {
		@apply text-sm mt-2;
	}
	input {
		@apply w-full rounded mt-1 mb-2;
		@apply dark:bg-slate-800;
	}

	.letter {
		font-size: 10pt; /* reduce default font size for letters */
		@apply font-sans;

		/* apply margins according to DIN 5008, adjusted for web */
		margin-top: 25mm;
		margin-left: 20mm;
		margin-right: 15mm;
	}

	@page {
		size: "A4";
		margin: 0; /* margins are set by the rest of the elements */
	}

	.receiver-wrapper {
		height: 45mm;
		margin-top: 45mm; /* vom oberen Blattrand */
		@apply grid grid-cols-[8cm,1fr] gap-[2cm];
	}
	.receiver {
		@apply not-italic;
		@apply flex flex-col;
		width: 80mm;
	}
	.subject-line {
		@apply font-bold text-lg mt-2 mb-6;
	}
	.text {
		@apply whitespace-pre-line leading-relaxed;
	}
</style>
