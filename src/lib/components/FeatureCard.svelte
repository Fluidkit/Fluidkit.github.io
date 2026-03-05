<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		href?: string;
		color?: string;
		icon?: Snippet;
		code?: string[];
	}

	let { title, description, href, color = 'var(--fk-cyan)', icon, code }: Props = $props();
</script>

{#if href}
	<a {href} class="card group" style="--accent: {color}">
		{@render content()}
	</a>
{:else}
	<div class="card group" style="--accent: {color}">
		{@render content()}
	</div>
{/if}

{#snippet content()}
	<div class="flex-1">
		{#if icon}
			<div class="card-icon mb-4 flex h-9 w-9 items-center justify-center rounded-[10px]">
				{@render icon()}
			</div>
		{/if}
		<h3 class="m-0 mb-2 font-mono text-base font-semibold text-[var(--accent)]">{title}</h3>
		<p class="m-0 text-sm leading-relaxed text-[var(--muted-foreground)]">{description}</p>
	</div>

	{#if code}
		<div class="mt-4 overflow-x-auto rounded-lg border border-white/[0.04] bg-black/30 px-4 py-3.5 font-mono text-[0.7rem] leading-[1.7]">
			{#each code as line}
				<div class="whitespace-nowrap">{@html line}</div>
			{/each}
		</div>
	{/if}

	{#if href}
		<div class="card-link mt-5 flex items-center gap-1.5 text-[0.8rem] font-medium text-[var(--accent)] opacity-70 transition-opacity duration-200 group-hover:opacity-100">
			<span>Learn more</span>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<path d="M5 12h14" />
				<path d="M12 5l7 7-7 7" />
			</svg>
		</div>
	{/if}
{/snippet}

<style>
	/* Card base + hover — uses color-mix() with var(--accent), can't be Tailwind */
	.card {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		border-radius: 14px;
		background: var(--fk-glass-bg);
		border: 1px solid var(--fk-glass-border);
		transition: all 0.3s ease;
		text-decoration: none;
		color: inherit;
	}

	.card:hover {
		background: var(--fk-glass-bg-hover);
		border-color: color-mix(in oklch, var(--accent) 25%, transparent);
		box-shadow: 0 0 24px color-mix(in oklch, var(--accent) 6%, transparent);
		transform: translateY(-2px);
	}

	.card-icon {
		background: color-mix(in oklch, var(--accent) 10%, transparent);
		border: 1px solid color-mix(in oklch, var(--accent) 15%, transparent);
		color: var(--accent);
	}
</style>
