<div class="letter">
	<slot />
</div>

<style lang="postcss">
	.letter {
		font-size: 10pt; /* reduce default font size for letters */
		@apply font-sans;

		/* apply margins according to DIN 5008, adjusted for web */
		margin-top: 45mm;
		margin-left: 20mm;
		margin-right: 15mm;
	}
</style>
