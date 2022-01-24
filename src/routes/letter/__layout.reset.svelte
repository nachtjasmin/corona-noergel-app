<div class="letter">
	<slot />
</div>

<style lang="postcss">
	.letter {
		font-size: 11pt; /* reduce default font size for letters */
		@apply font-sans;

		/* apply margins according to DIN 5008 */
		margin-top: 45mm;
		margin-left: 25mm;
		margin-right: 20mm;
	}
</style>
