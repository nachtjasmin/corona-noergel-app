<script lang="ts">
	import { cna } from "$lib/cna";
	import Button from "$lib/components/Button.svelte";
	import MonospacedInfo from "$lib/components/MonospacedInfo.svelte";
	import type { Bundesland, Topic, Bundeslaender } from "$lib/definitions";
	import { getRandom, replaceStringPlaceholders } from "$lib/helpers";
	import { data, pageTitle } from "$lib/store";
	import { tick } from "svelte";
	import bundeslaenderJson from "../data/bundeslaender.json";
	let bundeslaender = bundeslaenderJson as Bundeslaender;
	delete bundeslaender.$schema;

	pageTitle.reset();

	let finalText = "";
	let appendLinkToPosition = false;

	$: topic = $cna.topics.find((x) => x.name === $data.topicName);
	$: showStateSelection = $data.bundeslandKey;
	$: showSnippetSelection = $data.bundeslandKey !== "" && $data.empfaenger;
	$: showTextBuilder =
		showSnippetSelection &&
		$data.anrede.length > 0 &&
		$data.einleitung?.length > 0 &&
		$data.beschwerde?.length > 0 &&
		$data.appell?.length > 0 &&
		$data.gruss?.length > 0;
	$: showSendButton = showTextBuilder && finalText.length > 0;
	$: mailto = buildMailToLink($data.empfaenger?.mail ?? "", finalText);
	$: telLink = `tel:${$data?.empfaenger?.tel}`;
	$: filterTopics($data.bundeslandKey);
	$: beschwerden = topic?.beschwerde;
	$: anreden = replaceStringPlaceholders($data.empfaenger?.anreden ?? $cna.anrede, {
		receiver: $data.empfaenger,
	});
	$: appelle = replaceStringPlaceholders(topic?.appell, {
		bundesland: bundeslaender[$data.bundeslandKey]?.land ?? "",
	});
	$: kontakte = bundeslaender[$data.bundeslandKey]?.kontakte ?? [];

	let topics: Topic[] = [];
	const filterTopics = (bundeslandKey: string) => {
		topics = $cna.topics.filter((t) => {
			let bundesland = bundeslaender[bundeslandKey] as Bundesland;

			// if undefined, always keep empty.
			if (!bundesland) return false;

			// exclude items without limit if needed
			if (bundesland.onlyLimitedEntries && !t.limit) {
				return false;
			} else if (!bundesland.onlyLimitedEntries && t.limit) {
				return t.limit.includes($data.bundeslandKey) ?? false;
			}
			return true;
		});
	};

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

		finalText = data.buildText(appendLinkToPosition);
		await tick();
		focusText();
	};
	const focusText = () => document.getElementById("text").focus();
	const refreshText = async () => {
		finalText = data.buildText(appendLinkToPosition);

		await tick();
		focusText();
	};
</script>

<h1 class="text-2xl font-bold">Corona-Nörgel-App &mdash; Sommerwelle-Update 🌞</h1>
<div class="prose mt-4 dark:prose-invert">
	<p>
		Die deutsche Bundesregierung ist weiterhin nicht in der Lage, angemessen mit der Corona-Pandemie
		umzugehen. Die Inzidenzen sind immer noch zu hoch, um überhaupt das Ende der Pandemie annehmen
		zu können. Long Covid ist immer noch ein Ding und das Einzige, was unserem Gesundheitsminister
		einfällt ist "bitte lasst euch noch die 4. Impfung geben". Impfungen sind zwar nice, aber ähm,
		davon alleine geht die Pandemie leider nicht weg.
	</p>
	<p>
		Hier kannst du für die gesundheitspolitischen Sprecher*innen und Obleute, also die jeweils
		Vorsitzenden für eine Fraktion, im Gesundheitsausschuss Mails generieren. Abschicken musst du es
		noch selbst, dafür brauchst du ein eingerichtetes Mailprogramm wie Thunderbird, Outlook oder K9.
	</p>
	<p>
		Die bisherige Historie von <i>beschweren.rocks</i> lässt sich
		<a href="/history">hier einsehen</a>, dort sind Updates und bisherige Teilerfolge verbucht.
	</p>
</div>

<!--
	Workaround for #19. Right now, the mobile Safari on iOS (tested with iOS 15.2.1) increases the
	viewport width and ignores the viewport settings defined in the <meta> tag.
	Although there is no overflowing content on this page, setting the overflow to hidden prevents
	the appearance of the the horizontal scrollbar.
-->
<form on:submit|preventDefault={() => (finalText = data.buildText())} class="overflow-hidden px-1">
	<fieldset>
		<legend>Schritt 1 von 5: Auswahl des*der Empfänger*in</legend>
		<label for="bundesland">Institution</label>
		<select id="bundesland" bind:value={$data.bundeslandKey} on:change={reset}>
			<option disabled>Institution auswählen</option>
			{#each Object.keys(bundeslaender).filter((x) => x !== "$schema") as land}
				<option value={land}>
					{bundeslaender[land].land}
				</option>
			{/each}
		</select>

		{#if $data.bundeslandKey}
			<label for="kontakt">Empfänger*in</label>
			<select id="kontakt" bind:value={$data.empfaenger}>
				{#each kontakte as k}
					<option value={k}>{k.bezeichnung}</option>
				{/each}
			</select>
		{/if}
	</fieldset>
	<fieldset class:hidden={!showStateSelection}>
		<legend>Schritt 2 von 5: Auswahl des Themas</legend>
		<label for="Thema">Thema</label>
		<select id="Thema" bind:value={$data.topicName}>
			{#each topics as topic}
				<option value={topic.name}> {topic.name} </option>
			{/each}
		</select>
	</fieldset>
	<fieldset class:hidden={!showSnippetSelection}>
		<div class="flex flex-col items-baseline justify-between md:flex-row">
			<legend>Schritt 3 von 5: Textbausteine wählen</legend>
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

		<div class="relative flex items-start">
			<div class="flex h-5 items-center">
				<input
					id="append-link-to-position"
					aria-describedby="append-link-to-position-description"
					name="append-link-to-position"
					type="checkbox"
					bind:checked={appendLinkToPosition}
					on:change={() => refreshText()}
				/>
			</div>
			<div class="ml-3 text-sm">
				<label for="append-link-to-position" class="font-medium text-slate-700 dark:text-slate-300">
					Verweis zu unserer Position anhängen
				</label>
				<p id="append-link-to-position-description" class="text-slate-500">
					Dies ergänzt den Text um einen abschließenden Verweis auf eine <a
						class="underline"
						href="/unsere-position"
						>ausführlichere Position, die die Anliegen detaillierter erläutert</a
					>.
				</p>
			</div>
		</div>
	</fieldset>
	<fieldset class:hidden={!showTextBuilder}>
		<legend>Schritt 4 von 5: Text erzeugen</legend>
		<Button type="submit" on:click={focusText}>Bastel mir den Text</Button>
		<div class="mt-8">
			<p class="mb-2 text-sm">
				Empfänger*in: <MonospacedInfo>{$data.empfaenger?.mail ?? ""}</MonospacedInfo>
			</p>
			<textarea id="text" readonly rows="10">{finalText}</textarea>
		</div>
	</fieldset>
</form>
<section class:hidden={!showSendButton}>
	<p class="section-header">Schritt 5 von 5: Druck aufbauen!</p>
	<p>
		Damit wir endlich gehört werden, ist es Zeit, Druck auf die Verantwortlichen aufzubauen! Dies
		kann über verschiedene Wege geschehen, der Einfachste dürfte dabei für Viele der Versand der
		automatisch erstellten E-Mail sein.
	</p>
	<p>
		Aber auch der Anruf oder das Versanden eines Faxes sind <b>sehr effektive Methoden</b>, um Druck
		aufzubauen. Diese sind aber nicht für alle zugänglich. Sofern Du jedoch Kapazitäten für den ein
		oder anderen Anruf hast, scheue dich nicht!
	</p>

	<div class="mt-4 flex flex-col justify-between gap-8">
		<div>
			<p class="mb-2 text-sm">
				Bei dem Klick auf den Button wird ein sogenannter <code>mailto:</code>-Link erzeugt. Dieser
				öffnet dein E-Mail-Programm mit dem obigen Text. Dabei werden zu keinem Zeitpunkt
				Informationen an uns übermittelt.
			</p>
			<Button href={mailto}>Mail senden</Button>
		</div>
		<div>
			<p class="mb-2 text-sm">
				Papier ist in Deutschland heilig, wenn du möchstest, kannst du den obigen Text auch als
				fertigen Brief ausdrucken oder als Fax absenden.
			</p>
			<Button href="/letter">Brief/Fax senden</Button>
		</div>
		{#if $data?.empfaenger?.tel}
			<div>
				<p class="mb-2 text-sm">
					Der Text kann für einen Anruf als Gedankenstütze dienen. Erreichen tust du die
					Verantwortlichen unter:
					<MonospacedInfo>{$data.empfaenger.tel}</MonospacedInfo>
				</p>
				<Button href={telLink}>Anrufen</Button>
			</div>
		{/if}
	</div>
</section>

<style lang="postcss">
	label {
		@apply text-sm;
	}
	select,
	input[type="text"],
	textarea {
		@apply mt-1 mb-4 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm;
		@apply dark:border-slate-600 dark:bg-slate-800;
	}
	input[type="checkbox"] {
		@apply h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500;
		@apply dark:border-slate-600 dark:bg-slate-800;
	}
	textarea {
		@apply bg-slate-50 dark:bg-slate-800;
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
