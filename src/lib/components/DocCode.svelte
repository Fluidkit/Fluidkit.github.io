<script lang="ts">
	interface Props {
		filename?: string;
		lang?: string;
		code?: string;
		html?: string;
		highlights?: number[];
	}

	let { filename, lang, code, html, highlights = [] }: Props = $props();

	let lines = $derived(
		code
			? code
					.trim()
					.split('\n')
					.map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
			: []
	);
</script>

<div class="my-4 mb-6">
	<div class="overflow-hidden rounded-xl border border-[var(--fk-glass-border)] bg-black/40">
		{#if filename}
			<div class="flex items-center gap-1.5 border-b border-[var(--fk-glass-border)] bg-white/[0.02] px-4 py-3">
				<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-50"></span>
				<span class="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-50"></span>
				<span class="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-50"></span>
				<span class="ml-2 font-mono text-xs text-[var(--muted-foreground)]">{filename}</span>
				{#if lang}
					<span class="ml-auto text-[0.65rem] uppercase tracking-wide text-[var(--muted-foreground)] opacity-50">
						{lang}
					</span>
				{/if}
			</div>
		{/if}

		<div class="overflow-x-auto">
			{#if html}
				<div class="shiki-body">
					{@html html}
				</div>
			{:else if lines.length > 0}
				<pre class="m-0 p-0"><code class="block font-mono text-[0.8rem] leading-[1.7]">{#each lines as line, i}<span
							class="inline-flex w-full px-4 {highlights.includes(i + 1)
								? 'border-l-2 border-[var(--fk-cyan)] bg-[rgba(104,215,239,0.06)] pl-3.5'
								: ''}"
						><span class="mr-[1.5ch] inline-block w-[2.5ch] shrink-0 select-none text-right text-[var(--muted-foreground)] opacity-30">{String(i + 1).padStart(2, ' ')}</span><span class="min-w-0 flex-1">{@html line}</span></span>
{/each}</code></pre>
			{/if}
		</div>
	</div>
</div>
