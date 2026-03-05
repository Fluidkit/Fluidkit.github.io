<!-- src/routes/docs/+layout.svelte -->
<script lang="ts">
	import DocsSidebar from '$lib/components/DocsSidebar.svelte';
	import * as Sheet from '$lib/components/ui/sheet';

	let { children } = $props();
	let mobileNav = $state(false);
</script>

<div class="mx-auto flex max-w-6xl gap-8 px-6 py-10 pb-16 max-lg:flex-col max-lg:pt-6">
	<!-- Desktop sidebar -->
	<div class="hidden lg:block">
		<DocsSidebar />
	</div>

	<!-- Mobile sidebar trigger -->
	<div class="sticky top-[4.5rem] z-10 mb-6 lg:hidden">
		<Sheet.Root bind:open={mobileNav}>
			<Sheet.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--fk-glass-border)] bg-[var(--fk-glass-bg)] px-3.5 py-2 text-[0.82rem] text-muted-foreground transition-all duration-200 hover:bg-[var(--fk-glass-bg-hover)] hover:text-foreground"
						aria-label="Open navigation"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
							<line x1="3" y1="6" x2="21" y2="6" />
							<line x1="3" y1="12" x2="21" y2="12" />
							<line x1="3" y1="18" x2="21" y2="18" />
						</svg>
						<span>Menu</span>
					</button>
				{/snippet}
			</Sheet.Trigger>

			<Sheet.Content side="left" class="w-64 border-border bg-background p-4">
				<Sheet.Header>
					<Sheet.Title class="fk-gradient-text text-sm">Documentation</Sheet.Title>
				</Sheet.Header>
				<div class="mt-4">
					<DocsSidebar onnavigate={() => { mobileNav = false; }} />
				</div>
			</Sheet.Content>
		</Sheet.Root>
	</div>

	<!-- Content -->
	<article class="docs-prose min-w-0 max-w-3xl flex-1">
		{@render children()}
	</article>
</div>
