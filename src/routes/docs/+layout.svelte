<script lang="ts">
	import DocsSidebar from '$lib/components/DocsSidebar.svelte';
	import * as Sheet from '$lib/components/ui/sheet';

	let { children } = $props();
	let mobileNav = $state(false);
</script>

<div class="docs-layout">
	<!-- Desktop sidebar -->
	<div class="hidden lg:block">
		<DocsSidebar />
	</div>

	<!-- Mobile sidebar trigger -->
	<div class="mobile-nav lg:hidden">
		<Sheet.Root bind:open={mobileNav}>
			<Sheet.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						class="mobile-nav-btn"
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

			<Sheet.Content side="left" class="w-64 bg-[var(--background)] border-[var(--border)] p-4">
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
	<article class="docs-content">
		{@render children()}
	</article>
</div>

<style>
	.docs-layout {
		display: flex;
		max-width: 72rem;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 4rem;
		gap: 2rem;
	}

	.docs-content {
		flex: 1;
		min-width: 0;
		max-width: 52rem;
	}

	.mobile-nav {
		position: sticky;
		top: 4.5rem;
		z-index: 10;
		margin-bottom: 1.5rem;
	}

	.mobile-nav-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;
		font-size: 0.82rem;
		color: var(--muted-foreground);
		background: var(--fk-glass-bg);
		border: 1px solid var(--fk-glass-border);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.mobile-nav-btn:hover {
		color: var(--foreground);
		background: var(--fk-glass-bg-hover);
	}

	/* ── Prose styling for doc pages ──────────────── */
	.docs-content :global(h1) {
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 0.5rem;
		background: linear-gradient(135deg, var(--fk-cyan), var(--fk-purple));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.docs-content :global(h2) {
		font-size: 1.375rem;
		font-weight: 600;
		color: var(--foreground);
		margin: 2.5rem 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
	}

	.docs-content :global(h3) {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--foreground);
		margin: 2rem 0 0.75rem;
	}

	.docs-content :global(p) {
		font-size: 0.94rem;
		line-height: 1.7;
		color: var(--muted-foreground);
		margin: 0 0 1rem;
	}

	.docs-content :global(a) {
		color: var(--fk-cyan);
		text-decoration: none;
		transition: color 0.15s;
	}

	.docs-content :global(a:hover) {
		color: var(--foreground);
		text-decoration: underline;
	}

	.docs-content :global(code:not(pre code)) {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.82em;
		padding: 0.15em 0.4em;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.06);
		color: var(--foreground);
	}

	.docs-content :global(ul) {
		margin: 0 0 1rem;
		padding-left: 1.25rem;
	}

	.docs-content :global(li) {
		font-size: 0.94rem;
		line-height: 1.7;
		color: var(--muted-foreground);
		margin-bottom: 0.25rem;
	}

	.docs-content :global(blockquote) {
		margin: 1rem 0;
		padding: 0.75rem 1rem;
		border-left: 3px solid var(--fk-cyan);
		background: rgba(104, 215, 239, 0.04);
		border-radius: 0 8px 8px 0;
	}

	.docs-content :global(blockquote p) {
		margin: 0;
		font-size: 0.88rem;
	}

	.docs-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
		font-size: 0.88rem;
	}

	.docs-content :global(th) {
		text-align: left;
		padding: 0.625rem 1rem;
		font-weight: 600;
		color: var(--foreground);
		border-bottom: 1px solid var(--border);
	}

	.docs-content :global(td) {
		padding: 0.625rem 1rem;
		color: var(--muted-foreground);
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	}

	@media (max-width: 1023px) {
		.docs-layout {
			flex-direction: column;
			padding-top: 1.5rem;
		}
	}
</style>
