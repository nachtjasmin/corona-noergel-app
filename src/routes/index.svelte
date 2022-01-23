<script lang="ts">
	import config from "../data/cna.json";

	let empfaenger: string = "";
	let anreden: string[] = [];
	let finalText: string = "";

	let data = {
		anrede: "",
		einleitung: "",
		beschwerde: {
			text: "",
			kategorie: "",
		},
		appell: {
			text: "",
			kategorie: "",
		},
		gruss: "",
	};

	$: showSecondStep = empfaenger.length > 0;
	$: showThirdStep =
		showSecondStep &&
		data.anrede.length > 0 &&
		data.einleitung.length > 0 &&
		data.beschwerde.text.length > 0 &&
		data.appell.text.length > 0 &&
		data.gruss.length > 0;
	$: showSendButton = finalText.length > 0;
	$: mailto = buildMailToLink(empfaenger, finalText);
	$: anreden = config.anrede.map((a) => {
		if (empfaenger === undefined || empfaenger === null || empfaenger === "") {
			return a;
		}

		const to = config.bundeslaender[empfaenger];
		return a.replace(/\$\{(\w+)\}/g, (_, p) => to[p]);
	});

	let appelle: { text: string; kategorie: string }[] = [];
	$: appelle = config.appell.filter((a) => {
		if (a.kategorie === "allgemein" || data.beschwerde.kategorie === "allgemein") return true;

		return a.kategorie === data.beschwerde.kategorie;
	});
	const buildText = () => {
		finalText = `${data.anrede},\n\n${data.einleitung}\n${data.beschwerde.text}\n${data.appell.text}\n\n${data.gruss}\n`;
	};
	const buildMailToLink = (empfaenger: string, preview: string): string => {
		if (empfaenger === "" || preview === "") return "";

		const to = config.bundeslaender[empfaenger];
		let subject = encodeURI("");
		let body = encodeURI(preview);

		return `mailto:${to.mail}?subject=${subject}&body=${body}`;
	};
	function getRandom<T>(input: T[]): T {
		return input[Math.floor(Math.random() * input.length)];
	}
	const buildRandom = () => {
		console.log("build random stuff");
		data.anrede = getRandom(anreden);
		data.einleitung = getRandom(config.einleitung);
		data.beschwerde = getRandom(config.beschwerde);
		data.appell = getRandom(appelle);
		data.gruss = getRandom(config.gruss);

		buildText();
	};
</script>

<div class="container mx-auto my-4 md:mt-12 md:mb-8 lg:my-24 max-w-2xl">
	<h1 class="font-bold text-2xl">Corona-Nörgel-App 🦠😷</h1>
	<p class="mt-4">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere animi quibusdam mollitia
		doloremque, illo quis molestiae ipsa officiis sunt eius placeat dolorem a praesentium aliquid
		corporis cum. Doloribus, distinctio?
	</p>
	<form on:submit|preventDefault={buildText}>
		<section>
			<p class="section-header">Schritt 1: Bundesland auswählen</p>
			<select bind:value={empfaenger}>
				<option disabled>Bundesland auswählen</option>
				{#each Object.keys(config.bundeslaender) as land}
					<option value={land}>
						{config.bundeslaender[land].land}
					</option>
				{/each}
			</select>
		</section>
		<section class:hidden={!showSecondStep}>
			<div class="flex flex-col md:flex-row items-baseline justify-between">
				<p class="section-header">Schritt 2: Textbausteine wählen</p>
				<button type="button" class="btn-random" on:click={buildRandom}>Zufällig auswählen</button>
			</div>
			<label for="anrede">Anrede</label>
			<select id="anrede" bind:value={data.anrede}>
				<option disabled>Anrede auswählen</option>
				{#each anreden as s}
					<option value={s}>{s} </option>
				{/each}
			</select>

			<label for="einleitung">Einleitung</label>
			<select id="einleitung" bind:value={data.einleitung}>
				<option disabled>Einleitung auswählen</option>
				{#each config.einleitung as s}
					<option value={s}>{s} </option>
				{/each}
			</select>

			<label for="beschwerde">Beschwerde</label>
			<select id="beschwerde" bind:value={data.beschwerde}>
				<option disabled>Beschwerde auswählen</option>
				{#each config.beschwerde as s}
					<option value={s}>{s.text} </option>
				{/each}
			</select>

			<label for="appell">Appell</label>
			<select id="appell" bind:value={data.appell}>
				<option disabled>Appell auswählen</option>
				{#each appelle as s}
					<option value={s}>{s.text} </option>
				{/each}
			</select>

			<label for="gruss">Grußwort</label>
			<select id="gruss" bind:value={data.gruss}>
				<option disabled>Gruß auswählen</option>
				{#each config.gruss as s}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</section>
		<section class:hidden={!showThirdStep}>
			<p class="section-header">Schritt 3: Text erzeugen</p>
			<button type="submit" class="btn">Bastel mir den Text!</button>
			<textarea readonly class="w-full bg-gray-100 rounded mt-4" rows="10">{finalText}</textarea>
		</section>
	</form>
	<section class:hidden={!showSendButton}>
		<p class="section-header">Schritt 4: Mail verschicken</p>
		<p class="text-sm">
			Bei dem Klick auf den folgenden Button wird ein sogenannter <code>mailto:</code>-Link erzeugt.
			Dieser öffnet dein E-Mail-Programm mit dem obigen Text. Dabei werden zu keinem Zeitpunkt
			Informationen an uns übermittelt.
		</p>
		<a href={mailto} class="btn mt-4">Mail senden</a>
	</section>
</div>

<style lang="postcss">
	label {
		@apply text-sm;
	}
	select {
		@apply w-full rounded mt-1 mb-2;
	}
	section {
		@apply my-8;
	}
	.section-header {
		@apply mb-2 font-semibold;
	}
	.btn {
		@apply inline-block px-4 py-2 rounded motion-safe:transition-colors;
		@apply bg-green-200;
		@apply border border-green-800;
		@apply hover:bg-green-300;
		@apply active:bg-green-800 active:text-white;
	}
	.btn-random {
		@apply text-sm;
		@apply inline-block px-3 py-1 rounded motion-safe:transition-colors;
		@apply border border-green-800;
		@apply hover:bg-green-300;
		@apply active:bg-green-800 active:text-white;
	}
</style>
