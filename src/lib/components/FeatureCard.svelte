<script lang="ts">
	import type { Snippet } from 'svelte';
	import { base } from '$app/paths';

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
	<a {href} class="card" style="--accent: {color}">
		{@render content()}
	</a>
{:else}
	<div class="card" style="--accent: {color}">
		{@render content()}
	</div>
{/if}

{#snippet content()}
	<div class="card-top">
		{#if icon}
			<div class="card-icon">
				{@render icon()}
			</div>
		{/if}
		<h3 class="card-title">{title}</h3>
		<p class="card-desc">{description}</p>
	</div>

	{#if code}
		<div class="card-code">
			{#each code as line}
				<div class="code-line">{@html line}</div>
			{/each}
		</div>
	{/if}

	{#if href}
		<div class="card-link">
			<span>Learn more</span>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<path d="M5 12h14" />
				<path d="M12 5l7 7-7 7" />
			</svg>
		</div>
	{/if}
{/snippet}

<style>
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

	.card-top {
		flex: 1;
	}

	.card-icon {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		background: color-mix(in oklch, var(--accent) 10%, transparent);
		border: 1px solid color-mix(in oklch, var(--accent) 15%, transparent);
		color: var(--accent);
		margin-bottom: 1rem;
	}

	.card-title {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 1rem;
		font-weight: 600;
		color: var(--accent);
		margin: 0 0 0.5rem;
	}

	.card-desc {
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--muted-foreground);
		margin: 0;
	}

	/* ── Mini code preview ────────────────────────── */
	.card-code {
		margin-top: 1rem;
		padding: 0.875rem 1rem;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.04);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.7rem;
		line-height: 1.7;
		overflow-x: auto;
	}

	.code-line {
		white-space: nowrap;
	}

	/* ── Link ─────────────────────────────────────── */
	.card-link {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 1.25rem;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--accent);
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	.card:hover .card-link {
		opacity: 1;
	}

	/* ── Syntax tokens ────────────────────────────── */
	.card :global(.kw) { color: #c792ea; }
	.card :global(.fn) { color: #82aaff; }
	.card :global(.st) { color: #c3e88d; }
	.card :global(.cm) { color: #546e7a; }
	.card :global(.tp) { color: #ffcb6b; }
	.card :global(.dc) { color: #68d7ef; }
	.card :global(.pr) { color: #f07178; }
	.card :global(.im) { color: #89ddff; }
	.card :global(.op) { color: #89ddff; }
</style>
