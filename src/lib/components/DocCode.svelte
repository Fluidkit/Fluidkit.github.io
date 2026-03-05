<script lang="ts">
	interface Props {
		filename?: string;
		lang?: string;
		code: string;
		highlights?: number[];
	}

	let { filename, lang, code, highlights = [] }: Props = $props();

	let lines = $derived(
		code
			.trim()
			.split('\n')
			.map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
	);
</script>

<div class="doc-code-wrap">
	<div class="code-block">
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
			<pre><code>{#each lines as line, i}<span
					class="code-line"
					class:highlighted={highlights.includes(i + 1)}
				><span class="line-number">{String(i + 1).padStart(2, ' ')}</span><span class="line-content">{@html line}</span></span>
{/each}</code></pre>
		</div>
	</div>
</div>

<style>
	.doc-code-wrap {
		margin: 1rem 0 1.5rem;
	}

	.code-block {
		border-radius: 12px;
		border: 1px solid var(--fk-glass-border);
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
		font-size: 0.8rem;
		line-height: 1.7;
	}

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
	}

	.code-lang {
		margin-left: auto;
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted-foreground);
		opacity: 0.5;
	}

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

	.code-line {
		display: inline-flex;
		width: 100%;
		padding: 0 16px;
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
</style>
