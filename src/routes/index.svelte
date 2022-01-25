<script lang="ts">
	import { tick } from "svelte";
	import { data } from "$lib/store";

	import config from "../data/cna.json";
	import bundeslaender from "../data/bundeslaender.json";
	import { getRandom } from "$lib/helpers";
	import Button from "$lib/components/Button.svelte";
	import MonospacedInfo from "$lib/components/MonospacedInfo.svelte";

	let anreden: string[] = [];
	let finalText: string = "";

	$: showSecondStep = $data.bundeslandKey !== "";
	$: showThirdStep =
		showSecondStep &&
		$data.anrede.length > 0 &&
		$data.einleitung.length > 0 &&
		$data.beschwerde.text.length > 0 &&
		$data.appell.text.length > 0 &&
		$data.gruss.length > 0;
	$: showSendButton = finalText.length > 0;
	$: mailto = buildMailToLink($data.empfaenger?.mail ?? "", finalText);
	$: anreden = config.anrede.map((a) => {
		if ($data.empfaenger === undefined) {
			return a;
		}

		const to = $data.empfaenger;
		return a.replace(/\$\{(\w+)\}/g, (_, p) => to[p]);
	});

	let appelle: { text: string; kategorie: string }[] = [];
	$: appelle = config.appell
		.filter((a) => {
			if (a.kategorie === "allgemein" || $data.beschwerde.kategorie === "allgemein") return true;

			return a.kategorie === $data.beschwerde.kategorie;
		})
		.map((a) => {
			// It's important to query all information here, not just the contact information.

			if (
				$data.bundeslandKey === undefined ||
				$data.bundeslandKey === null ||
				$data.bundeslandKey === ""
			) {
				return a;
			}

			const to = bundeslaender[$data.bundeslandKey];

			// todo: find dynamic way for replacing variables
			a.text = a.text.replace("${Bundesland}", to.land);

			return a;
		});

	const buildMailToLink = (empfaenger: string, preview: string): string => {
		if (empfaenger === "" || preview === "") return "";

		const to = $data.empfaenger;
		let subject = encodeURI(getRandom(config.betreff));
		let body = encodeURI(preview);

		return `mailto:${to.mail}?subject=${subject}&body=${body}`;
	};

	const buildRandom = async () => {
		$data.anrede = getRandom(anreden);
		$data.einleitung = getRandom(config.einleitung);
		$data.beschwerde = getRandom(config.beschwerde);
		$data.appell = getRandom(appelle);
		$data.gruss = getRandom(config.gruss);

		finalText = data.buildText();
		await tick();
		document.getElementById("text").scrollIntoView();
	};
</script>

<h1 class="font-bold text-2xl">Corona-Nörgel-App 🦠😷</h1>
<div class="prose mt-4">
	<p>
		Am 22.01. haben die Gesundheitsministieren in einer Telefonkonferenz weitgehende <a
			href="https://www.gmkonline.de/Beschluesse.html?uid=268&jahr=2022"
			>Einschränkungen für PCR-Tests</a
		> beschlossen. Hier kannst du passend für dein Bundesland eine Beschwerdemail für dein zuständiges
		Ministerium generieren. Abschicken musst du es noch selbst, dafür brauchst du ein eingerichtetes
		Mailprogramm wie Thunderbird, Outlook oder K9.
	</p>
	<p>
		<b>Update (25.01.2022):</b> Wir haben die Kontaktdaten um die jeweiligen Staats- und Senatskanzleien
		erweitert, sodass diese nun auch auf einfachem Wege kontaktiert werden können.
	</p>
</div>

<form on:submit|preventDefault={() => (finalText = data.buildText())}>
	<section>
		<p class="section-header">Schritt 1: Bundesland auswählen</p>
		<label for="bundesland">Bundesland</label>
		<select id="bundesland" bind:value={$data.bundeslandKey} on:change={() => data.reset()}>
			<option disabled>Bundesland auswählen</option>
			{#each Object.keys(bundeslaender) as land}
				<option value={land}>
					{bundeslaender[land].land}
				</option>
			{/each}
		</select>

		{#if $data.bundeslandKey}
			<label for="kontakt">Empfänger*in</label>
			<select id="kontakt" bind:value={$data.empfaenger}>
				<option value={bundeslaender[$data.bundeslandKey].gesundheit}>
					{bundeslaender[$data.bundeslandKey].gesundheit.bezeichnung}
				</option>
				<option value={bundeslaender[$data.bundeslandKey].chef}>
					{bundeslaender[$data.bundeslandKey].chef.bezeichnung}
				</option>
			</select>
		{/if}
	</section>
	<section class:hidden={!showSecondStep}>
		<div class="flex flex-col md:flex-row items-baseline justify-between">
			<p class="section-header">Schritt 2: Textbausteine wählen</p>
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
			{#each config.einleitung as s}
				<option value={s}>{s} </option>
			{/each}
		</select>

		<label for="beschwerde">Beschwerde</label>
		<select id="beschwerde" bind:value={$data.beschwerde}>
			<option disabled value="">Beschwerde auswählen</option>
			{#each config.beschwerde as s}
				<option value={s}>{s.text} </option>
			{/each}
		</select>

		<label for="appell">Appell</label>
		<select id="appell" bind:value={$data.appell}>
			<option disabled value="">Appell auswählen</option>
			{#each appelle as s}
				<option value={s}>{s.text} </option>
			{/each}
		</select>

		<label for="gruss">Grußformel</label>
		<select id="gruss" bind:value={$data.gruss}>
			<option disabled value="">Grußformel auswählen</option>
			{#each config.gruss as s}
				<option value={s}>{s}</option>
			{/each}
		</select>

		<label for="name">Dein Name</label>
		<input id="name" type="text" placeholder="(optional)" bind:value={$data.name} />
	</section>
	<section id="text" class:hidden={!showThirdStep}>
		<p class="section-header">Schritt 3: Text erzeugen</p>
		<Button type="submit">Bastel mir den Text</Button>
		<div class="mt-8">
			<p class="mb-2 text-sm">
				Empfänger*in: <MonospacedInfo>{$data.empfaenger?.mail ?? ""}</MonospacedInfo>
			</p>
			<textarea readonly class="w-full bg-gray-100 dark:bg-slate-800 rounded" rows="10"
				>{finalText}</textarea
			>
		</div>
	</section>
</form>
<section class:hidden={!showSendButton}>
	<p class="section-header">Schritt 4: Mail verschicken</p>
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
		@apply w-full rounded mt-1 mb-2;
		@apply dark:bg-slate-800;
	}
	section {
		@apply my-8;
	}
	.section-header {
		@apply mb-2 font-semibold;
	}
</style>
