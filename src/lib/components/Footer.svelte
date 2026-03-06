<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
</script>

<footer class="w-full px-6 pb-10 pt-4">
	<div class="mx-auto max-w-6xl">
		<Separator class="mb-8" />
		<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
			<div class="flex items-center gap-2 text-sm text-muted-foreground">
				<svg class="h-4 w-4 opacity-60" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
					<rect width="250" height="250" rx="38" fill="rgba(255,255,255,0.06)"/>
					<rect x="65" y="38" width="148" height="82" rx="12" fill="var(--fk-cyan)"/>
					<rect x="51" y="84" width="105" height="83" rx="12" fill="var(--fk-blue)"/>
					<rect x="38" y="130" width="61" height="82" rx="12" fill="var(--fk-purple)"/>
				</svg>
				<span>FluidKit</span>
			</div>

			<div class="flex items-center gap-5">
				{#each [
					{ href: 'https://github.com/AswanthManoj/Fluidkit', label: 'GitHub',
					  icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' },
					{ href: 'https://pypi.org/project/fluidkit/', label: 'PyPI',
					  icon: 'M12.042 0L5.2 3.045v6.088L1.474 11.09v6.088L5.2 19.136v-6.088l3.726-1.957v6.088l3.726 1.957 3.726-1.957v-6.088l3.726-1.957V5L12.042 0zm-.014 2.15l2.678 1.406-2.678 1.406-2.678-1.406L12.028 2.15zM8.89 4.46l2.714 1.425v3.166l-2.714-1.426V4.46zm6.276 0v3.166l-2.714 1.425V5.885L15.166 4.46z' },
					{ href: 'https://svelte.dev/docs/kit/remote-functions', label: 'SvelteKit Docs',
					  icon: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z' },
					{ href: '/llm.txt', label: 'LLM Context',
  					  icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' }
				] as item}
					<a
						href={item.href}
						target="_blank"
						rel="noopener"
						class="text-muted-foreground transition-colors hover:text-foreground"
						aria-label={item.label}
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path d={item.icon}/>
						</svg>
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
