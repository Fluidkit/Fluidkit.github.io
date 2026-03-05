<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	const links = [
		{ label: 'Docs', href: `${base}/docs` },
		{ label: 'GitHub', href: 'https://github.com/AswanthManoj/Fluidkit', external: true },
	];

	function isActive(href: string): boolean {
		if (href.startsWith('http')) return false;
		return page.url.pathname.startsWith(href);
	}

	$effect(() => {
		const onScroll = () => { scrolled = window.scrollY > 20; };
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<nav
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300
		{scrolled ? 'nav-scrolled' : ''}"
>
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
		<a href={base || '/'} class="flex items-center gap-2.5 no-underline">
			<svg class="h-7 w-7" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
				<rect width="250" height="250" rx="38" fill="rgba(255,255,255,0.06)"/>
				<rect x="65" y="38" width="148" height="82" rx="12" fill="var(--fk-cyan)"/>
				<rect x="51" y="84" width="105" height="83" rx="12" fill="var(--fk-blue)"/>
				<rect x="38" y="130" width="61" height="82" rx="12" fill="var(--fk-purple)"/>
			</svg>
			<span class="text-lg font-semibold tracking-tight text-foreground">FluidKit</span>
		</a>

		<!-- Desktop -->
		<div class="hidden items-center gap-1 md:flex">
			{#each links as link}
				<a
					href={link.href}
					target={link.external ? '_blank' : undefined}
					rel={link.external ? 'noopener' : undefined}
					class="rounded-lg px-3.5 py-2 text-sm transition-colors
						{isActive(link.href) ? 'text-fk-cyan' : 'text-muted-foreground hover:text-foreground'}"
				>
					{link.label}
				</a>
			{/each}

			<div class="ml-2">
				<Button
					variant="outline"
					size="sm"
					class="fk-glass border-[var(--fk-glass-border)] font-mono text-xs
						hover:bg-[var(--fk-glass-bg-hover)] hover:border-white/12"
					href="https://pypi.org/project/fluidkit/"
					target="_blank"
				>
					pip install fluidkit
				</Button>
			</div>
		</div>

		<!-- Mobile -->
		<div class="md:hidden">
			<Sheet.Root bind:open={mobileOpen}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<button
							{...props}
							class="flex h-9 w-9 items-center justify-center rounded-lg
								text-muted-foreground transition-colors hover:text-foreground"
							aria-label="Open menu"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2" stroke-linecap="round">
								<line x1="3" y1="6" x2="21" y2="6" />
								<line x1="3" y1="12" x2="21" y2="12" />
								<line x1="3" y1="18" x2="21" y2="18" />
							</svg>
						</button>
					{/snippet}
				</Sheet.Trigger>

				<Sheet.Content side="right" class="w-72 border-border bg-background">
					<Sheet.Header>
						<Sheet.Title class="fk-gradient-text">FluidKit</Sheet.Title>
					</Sheet.Header>
					<div class="mt-6 flex flex-col gap-1">
						{#each links as link}
							<a
								href={link.href}
								target={link.external ? '_blank' : undefined}
								rel={link.external ? 'noopener' : undefined}
								class="rounded-lg px-3 py-2.5 text-sm text-muted-foreground
									transition-colors hover:bg-secondary hover:text-foreground"
								onclick={() => { mobileOpen = false; }}
							>
								{link.label}
							</a>
						{/each}
						<div class="mt-4 px-3">
							<code class="block rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
								pip install fluidkit
							</code>
						</div>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</nav>

<style>
	.nav-scrolled {
		background: rgba(12, 10, 9, 0.8);
		backdrop-filter: blur(16px) saturate(1.2);
		border-bottom: 1px solid var(--fk-glass-border);
	}
</style>
