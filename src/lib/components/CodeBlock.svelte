<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		filename?: string;
		lang?: string;
		lines?: string[];
		highlights?: number[];
		class?: string;
		children?: Snippet;
	}

	let {
		filename,
		lang = '',
		lines = [],
		highlights = [],
		class: className = '',
		children
	}: Props = $props();
</script>

<div class="code-block {className}">
	{#if filename}
		<div class="code-header">
			<div class="code-dot dot-red"></div>
			<div class="code-dot dot-yellow"></div>
			<div class="code-dot dot-green"></div>
			<span class="code-filename">{filename}</span>
			{#if lang}
				<span class="code-lang">{lang}</span>
			{/if}
		</div>
	{/if}

	<div class="code-body">
		{#if lines.length > 0}
			<pre><code>{#each lines as line, i}<span
				class="code-line"
				class:highlighted={highlights.includes(i + 1)}
			><span class="line-number">{String(i + 1).padStart(2, ' ')}</span><span class="line-content">{@html line}</span></span>
{/each}</code></pre>
		{:else if children}
			<pre><code>{@render children()}</code></pre>
		{/if}
	</div>
</div>

<style>
	.code-block {
		border-radius: 12px;
		border: 1px solid var(--fk-glass-border);
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
		font-size: 0.8rem;
		line-height: 1.7;
	}

	/* ── Header / Tab ────────────────────────────── */
	.code-header {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--fk-glass-border);
		background: rgba(255, 255, 255, 0.02);
	}

	.code-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		opacity: 0.5;
	}

	.dot-red { background: #ff5f57; }
	.dot-yellow { background: #febc2e; }
	.dot-green { background: #28c840; }

	.code-filename {
		margin-left: 8px;
		font-size: 0.75rem;
		color: var(--muted-foreground);
		letter-spacing: 0.01em;
	}

	.code-lang {
		margin-left: auto;
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted-foreground);
		opacity: 0.5;
	}

	/* ── Body ─────────────────────────────────────── */
	.code-body {
		padding: 16px 0;
		overflow-x: auto;
	}

	.code-body pre {
		margin: 0;
		padding: 0;
	}

	.code-body code {
		display: block;
	}

	/* ── Lines ────────────────────────────────────── */
	.code-line {
		display: inline-flex;
		width: 100%;
		padding: 0 16px;
		transition: background 0.2s;
	}

	.code-line.highlighted {
		background: rgba(104, 215, 239, 0.06);
		border-left: 2px solid var(--fk-cyan);
		padding-left: 14px;
	}

	.line-number {
		display: inline-block;
		width: 2.5ch;
		margin-right: 1.5ch;
		color: var(--muted-foreground);
		opacity: 0.3;
		user-select: none;
		text-align: right;
		flex-shrink: 0;
	}

	.line-content {
		flex: 1;
		min-width: 0;
	}

	/* ── Syntax token colors ─────────────────────── */
	.code-block :global(.kw) { color: #c792ea; }       /* keywords */
	.code-block :global(.fn) { color: #82aaff; }       /* functions */
	.code-block :global(.st) { color: #c3e88d; }       /* strings */
	.code-block :global(.cm) { color: #546e7a; }       /* comments */
	.code-block :global(.tp) { color: #ffcb6b; }       /* types */
	.code-block :global(.nr) { color: #f78c6c; }       /* numbers */
	.code-block :global(.op) { color: #89ddff; }       /* operators / punctuation */
	.code-block :global(.dc) { color: #68D7EF; }       /* decorators */
	.code-block :global(.pr) { color: #f07178; }       /* parameters / properties */
	.code-block :global(.im) { color: #89ddff; }       /* import keywords */
</style>
