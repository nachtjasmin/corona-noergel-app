<script>
	import "../app.css";
</script>

<div class="container mx-auto my-4 md:mt-12 md:mb-8 lg:my-24 max-w-2xl px-4">
	<slot />

	<ul class="flex flex-col sm:flex-row space-x-4 justify-center">
		<li><a href="/" class="footer-link">Zum Formular</a></li>
		<li><a href="/imprint" class="footer-link">Impressum & Datenschutzerklärung</a></li>
	</ul>
</div>

<style lang="postcss">
	.footer-link {
		@apply text-xs text-gray-500 underline;
	}
</style>
