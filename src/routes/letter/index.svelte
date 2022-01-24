<script>
	import { goto } from "$app/navigation";
	import { data } from "$lib/store";
	import { onMount } from "svelte";

	// if data is empty, navigate back
	if ($data.anrede === "") goto("/");
	onMount(() => window.print());
</script>

<div class="normal">
	<div id="wrapper">
		<!-- only hide it this way to keep the spacing -->
		<blockquote style="visibility: hidden">
			<h1 id="macandi">Mac Andi</h1>

			<p>Markdown-Profi</p>

			<p>
				Musterstraße 2<br />
				12345 Musterdorf
			</p>

			<p>
				Telefon: 01234 56789<br />
				Mobil: 0123 123456789<br />
				E-Mail: <a href="mailto:redaktion@mac-and-i.de">redaktion@mac-and-i.de</a><br />
				Website: <a href="http://www.mac-and-i.de">www.mac-and-i.de</a>
			</p>

			<p>
				IBAN: DE00 1234 5678 1234 5678 90<br />
				BIC: MARKDOW0000
			</p>
		</blockquote>

		<hr />

		<blockquote>
			<h2>
				<!-- empty to keep layout intact -->
			</h2>

			<p>
				Karl Empfänger<br />
				Musterweg 3<br />
				67890 Musterstadt
			</p>
		</blockquote>

		<hr />

		<blockquote>
			<p>{new Date().toLocaleDateString("de", { dateStyle: "full" })}</p>
		</blockquote>

		<h3>TODO: Betreffzeile</h3>

		<p class="whitespace-pre-line">{data.buildInnerText()}</p>

		<blockquote>
			<p>{$data.gruss}</p>
			<p>{$data.name}</p>
		</blockquote>
	</div>
</div>
