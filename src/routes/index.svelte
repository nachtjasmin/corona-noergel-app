<script lang="ts">
	import { cna } from "$lib/cna";
	import Button from "$lib/components/Button.svelte";
	import MonospacedInfo from "$lib/components/MonospacedInfo.svelte";
	import type { Bundeslaender } from "$lib/definitions";
	import { getRandom, replaceStringPlaceholders } from "$lib/helpers";
	import { data, pageTitle } from "$lib/store";
	import { tick } from "svelte";
	import bundeslaenderJson from "../data/bundeslaender.json";
	let bundeslaender = bundeslaenderJson as Bundeslaender;

	pageTitle.reset();

	let finalText = "";

	$: topic = $cna.topics.find((x) => x.name === $data.topicName);
	$: showBundeslandSelection = topic?.name?.length > 0;
	$: showSnippetSelection = $data.bundeslandKey !== "" && $data.empfaenger;
	$: showTextBuilder =
		showSnippetSelection &&
		$data.anrede.length > 0 &&
		$data.einleitung?.length > 0 &&
		$data.beschwerde?.length > 0 &&
		$data.appell?.length > 0 &&
		$data.gruss?.length > 0;
	$: showSendButton = finalText.length > 0;
	$: mailto = buildMailToLink($data.empfaenger?.mail ?? "", finalText);
	$: beschwerden = topic?.beschwerde;
	$: anreden = replaceStringPlaceholders($cna.anrede, { receiver: $data.empfaenger });
	$: appelle = replaceStringPlaceholders(topic?.appell, {
		bundesland: bundeslaender[$data.bundeslandKey]?.land ?? "",
	});

	const buildMailToLink = (empfaenger: string, preview: string): string => {
		if (empfaenger === "" || preview === "") return "";

		const to = $data.empfaenger;
		let subject = encodeURI(getRandom(topic.betreff));
		let body = encodeURI(preview);

		return `mailto:${to.mail}?subject=${subject}&body=${body}`;
	};
	const reset = () => {
		data.reset();
		cna.reset();
	};

	const buildRandom = async () => {
		$data.anrede = getRandom(anreden);
		$data.einleitung = getRandom(topic.einleitung);
		$data.beschwerde = getRandom(topic.beschwerde);
		$data.appell = getRandom(appelle);
		$data.gruss = getRandom($cna.gruss);

		finalText = data.buildText();
		await tick();
		focusText();
	};
	const focusText = () => document.getElementById("text").focus();

	$data.bundeslandKey = "SH";
	$data.topicName = $cna.topics[0].name;
</script>

<h1 class="text-2xl font-black">Fordern wir den Rücktritt von Karin Prien!</h1>
<div class="prose mt-8 dark:prose-invert">
	<p>
		Am 11.02.2022 hat Karin Prien, Bildungsministerin in Schleswig-Holstein <a
			target="_"
			href="https://twitter.com/PrienKarin/status/1492205554021904392"
			>einen unsäglichen Tweet abgesetzt</a
		>, der an die Eugenik in der Nazi-Diktatur erinnert. (Anmerkung: Nazis schlecht, Diktatur auch
		schlecht.)
	</p>
	<blockquote>
		Bitte differenzieren: Kinder sterben. Das ist extrem tragisch. Aber sie sterben mit COVID_19 und
		nur extrem selten wegen COVID_19.
	</blockquote>
	<p>
		Dieser Tweet ist nur die Spitze des Eisberges, während der Pandemie hatte Frau Prien schon
		häufiger mit falschen Informationen zu COVID-19 die Aufmerksamkeit auf sich gezogen.
		<b
			>Wir sind der Meinung, dass sie nicht länger tragbar ist und wollen auf diese Weise ihren
			Rücktritt hervorrufen.</b
		>
	</p>
	<p><b>Update: 14.02.:</b> Karin Prien hat ihren Twitteraccount gelöscht, weil sie sich dort ungerecht behandelt fühlte.
		An der Eignung für den Ministerposten zweifelt sie indes nicht.</p>
</div>

<!--
	Workaround for #19. Right now, the mobile Safari on iOS (tested with iOS 15.2.1) increases the
	viewport width and ignores the viewport settings defined in the <meta> tag.
	Although there is no overflowing content on this page, setting the overflow to hidden prevents
	the appearance of the the horizontal scrollbar.
-->
<form on:submit|preventDefault={() => (finalText = data.buildText())} class="overflow-hidden">
	<fieldset class:hidden={!showBundeslandSelection}>
		<legend>Schritt 1 von 4: Auswahl des*der Empfänger*in</legend>
		{#if $data.bundeslandKey}
			<label for="kontakt">Empfänger*in</label>
			<select id="kontakt" bind:value={$data.empfaenger}>
				{#each bundeslaender[$data.bundeslandKey].kontakte as k}
					<option value={k}>{k.bezeichnung}</option>
				{/each}
			</select>
		{/if}
	</fieldset>
	<fieldset class:hidden={!showSnippetSelection}>
		<div class="flex flex-col items-baseline justify-between md:flex-row">
			<legend>Schritt 2 von 4: Textbausteine wählen</legend>
			<Button size="small" on:click={buildRandom}>Zufällig auswählen</Button>
		</div>
		<label for="anrede">Anrede</label>
		<select id="anrede" bind:value={$data.anrede}>
			<option disabled value="">Anrede auswählen</option>
			{#each anreden as s}
				<option value={s}>{s} </option>
			{/each}
		</select>

		<label for="einleitung">Einleitung</label>
		<select id="einleitung" bind:value={$data.einleitung}>
			<option disabled value="">Einleitung auswählen</option>
			{#each topic?.einleitung || [] as s}
				<option value={s}>{s} </option>
			{/each}
		</select>

		<label for="beschwerde">Beschwerde</label>
		<select id="beschwerde" bind:value={$data.beschwerde}>
			<option disabled value="">Beschwerde auswählen</option>
			{#each beschwerden || [] as s}
				<option value={s}>{s} </option>
			{/each}
		</select>

		<label for="appell">Appell</label>
		<select id="appell" bind:value={$data.appell}>
			<option disabled value="">Appell auswählen</option>
			{#each appelle || [] as s}
				<option value={s}>{s} </option>
			{/each}
		</select>

		<label for="gruss">Grußformel</label>
		<select id="gruss" bind:value={$data.gruss}>
			<option disabled value="">Grußformel auswählen</option>
			{#each $cna.gruss as s}
				<option value={s}>{s}</option>
			{/each}
		</select>

		<label for="name">Dein Name</label>
		<input id="name" type="text" placeholder="(optional)" bind:value={$data.name} />
	</fieldset>
	<fieldset class:hidden={!showTextBuilder}>
		<legend>Schritt 3 von 4: Text erzeugen</legend>
		<Button type="submit" on:click={focusText}>Bastel mir den Text</Button>
		<div class="mt-8">
			<p class="mb-2 text-sm">
				Empfänger*in: <MonospacedInfo>{$data.empfaenger?.mail ?? ""}</MonospacedInfo>
			</p>
			<textarea id="text" readonly class="w-full rounded bg-gray-100 dark:bg-slate-800" rows="10"
				>{finalText}</textarea
			>
		</div>
	</fieldset>
</form>
<section class:hidden={!showSendButton}>
	<p class="section-header">Schritt 4 von 4: Mail verschicken</p>
	<p class="text-sm">
		Bei dem Klick auf den folgenden Button wird ein sogenannter <code>mailto:</code>-Link erzeugt.
		Dieser öffnet dein E-Mail-Programm mit dem obigen Text. Dabei werden zu keinem Zeitpunkt
		Informationen an uns übermittelt.
	</p>
	<Button href={mailto} class="mt-4">Mail senden</Button>

	<p class="section-header mt-4">
		Alternativ: Brief/Fax senden <sup class="text-gray-600 dark:text-gray-400">(beta)</sup>
	</p>
	<p class="text-sm">
		Papier ist in Deutschland heilig, wenn du möchstest, kannst du den obigen Text auch als fertigen
		Brief ausdrucken oder als Fax absenden.
	</p>
	<Button href="/letter" class="mt-4">Brief/Fax senden</Button>
</section>

<style lang="postcss">
	label {
		@apply text-sm;
	}
	select,
	input {
		@apply mt-1 mb-2 w-full rounded;
		@apply dark:bg-slate-800;
	}
	fieldset,
	section {
		@apply my-8;
	}
	legend,
	.section-header {
		@apply mb-2 font-semibold;
	}
</style>
