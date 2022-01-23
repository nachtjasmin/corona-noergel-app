<script lang="ts">
	import config from "../data/test.json";

	type receiverType = typeof config.receivers[0];
	let receiver: receiverType;
	let wantedPhrases: string[] = [];
	let preview: string = "";
	let mailto: string = "";

	$: showSecondStep = receiver !== undefined && receiver !== null;
	$: showThirdStep = showSecondStep && wantedPhrases.length > 0;
	$: showSendButton = preview.length > 0;

	const updatePreview = (): void => {
		let p = `${receiver.person.anrede} ${receiver.person.name},\n\n`;
		wantedPhrases.forEach((phrase) => (p += phrase + "\n\n"));
		preview = p;

		mailto = buildMailToLink();
	};
	const buildMailToLink = (): string => {
		let subject = encodeURI("test");
		let body = encodeURI(preview);

		return `mailto:${receiver.mail}?subject=${subject}&body=${body}`;
	};
</script>

<div class="container mx-auto my-4 md:mt-12 lg:mt-24 max-w-xl">
	<h1 class="font-bold text-2xl">Corona-Nörgel-App 🦠😷</h1>
	<p class="mt-4">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere animi quibusdam mollitia
		doloremque, illo quis molestiae ipsa officiis sunt eius placeat dolorem a praesentium aliquid
		corporis cum. Doloribus, distinctio?
	</p>
	<form on:submit|preventDefault={updatePreview}>
		<section>
			<p class="section-header">Schritt 1: Empfänger*in auswählen</p>
			<select class="w-full" bind:value={receiver}>
				<option disabled value={null}>Empfänger*in auswählen</option>
				{#each config.receivers as receiver}
					<option value={receiver}>
						{receiver.name} ({receiver.person.description}: {receiver.person.name})
					</option>
				{/each}
			</select>
		</section>
		<section class:hidden={!showSecondStep}>
			<p class="section-header">Schritt 2: Textbausteine wählen</p>
			{#each config.allPhrases as phrase}
				<label class="flex flex-row items-center mb-1">
					<input
						type="checkbox"
						class="rounded text-green-500"
						bind:group={wantedPhrases}
						value={phrase}
					/>
					<span class="ml-2">
						{phrase}
					</span>
				</label>
			{/each}
		</section>
		<section class:hidden={!showThirdStep}>
			<p class="section-header">Schritt 3: Text erzeugen</p>
			<button type="submit" class="btn">Bastel mir den Text!</button>
			<textarea readonly class="w-full bg-gray-100 rounded mt-4" rows="10">{preview}</textarea>
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
	select {
		@apply w-full rounded;
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
</style>
