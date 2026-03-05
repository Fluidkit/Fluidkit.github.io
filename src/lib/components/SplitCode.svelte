<script lang="ts">
	interface CodePanel {
		filename: string;
		lang: string;
		lines: string[];
		highlights?: number[];
	}

	interface RevealGroup {
		leftEnd: number;
		rightEnd: number;
	}

	interface Props {
		left: CodePanel;
		right: CodePanel;
		animated?: boolean;
		revealGroups?: RevealGroup[];
		class?: string;
	}

	let { left, right, animated = false, revealGroups = [], class: className = '' }: Props = $props();

	let leftCount = $state(0);
	let rightCount = $state(0);
	let done = $state(false);
	let visible = $state(false);
	let el: HTMLDivElement;

	$effect(() => {
		if (!animated) {
			leftCount = left.lines.length;
			rightCount = right.lines.length;
			done = true;
		}
	});

	$effect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.3, rootMargin: '-80px 0px' }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!animated || !visible || done) return;

		let current = 0;
		let paused = false;

		const interval = setInterval(() => {
			if (paused) return;

			if (current >= left.lines.length) {
				rightCount = right.lines.length;
				done = true;
				clearInterval(interval);
				return;
			}

			current++;
			leftCount = current;

			const group = revealGroups.find((g) => g.leftEnd === current - 1);
			if (group !== undefined) {
				paused = true;
				setTimeout(() => {
					rightCount = group.rightEnd + 1;
					setTimeout(() => {
						paused = false;
					}, 400);
				}, 300);
			}
		}, 130);

		return () => clearInterval(interval);
	});

	$effect(() => {
		if (!animated) return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mq.matches) {
			leftCount = left.lines.length;
			rightCount = right.lines.length;
			done = true;
		}
	});
</script>

<div
	bind:this={el}
	class="split-root flex flex-col md:flex-row md:items-stretch overflow-hidden rounded-[14px] border border-[var(--fk-glass-border)] bg-black/40 font-mono text-[0.78rem] leading-[1.7] transition-all duration-[800ms] ease-out {visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} {className}"
>
	<!-- Left panel -->
	<div class="flex min-w-0 flex-1 flex-col">
		<div class="flex items-center gap-1.5 border-b border-[var(--fk-glass-border)] bg-white/[0.02] px-4 py-3">
			<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-50"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-50"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-50"></span>
			<span class="ml-2 text-[0.72rem] text-[var(--muted-foreground)]">{left.filename}</span>
			<span class="ml-auto text-[0.62rem] uppercase tracking-wide text-[var(--muted-foreground)] opacity-50">{left.lang}</span>
		</div>
		<div class="flex-1 overflow-x-auto py-3.5">
			<pre class="m-0 p-0"><code class="block">{#each left.lines as line, i}<span
						class="inline-flex w-full px-4 {left.highlights?.includes(i + 1) ? 'border-l-2 border-[var(--fk-cyan)] bg-[rgba(104,215,239,0.06)] pl-3.5' : ''} {i < leftCount ? 'visible' : 'invisible'}"
					><span class="mr-[1.5ch] inline-block w-[2.5ch] shrink-0 select-none text-right text-[var(--muted-foreground)] opacity-30">{String(i + 1).padStart(2, ' ')}</span><span class="min-w-0 flex-1">{@html line}{#if !done && i === leftCount - 1}<span class="ml-px font-light text-[var(--fk-cyan)] animate-cursor-blink">▎</span>{/if}</span></span>
{/each}</code></pre>
		</div>
	</div>

	<!-- Connector -->
	<div class="connector flex shrink-0 items-center justify-center gap-2 border-[var(--fk-glass-border)] bg-white/[0.015] md:flex-col md:border-x md:px-1 md:py-0 max-md:flex-row max-md:border-y max-md:px-4 max-md:py-2">
		<div class="connector-line flex-1 opacity-30"></div>
		<div
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-[var(--fk-glass-bg)] transition-all duration-400 max-md:rotate-90
				{rightCount > 0
					? 'border-[rgba(104,215,239,0.2)] text-[var(--fk-cyan)] shadow-[0_0_12px_rgba(104,215,239,0.15)]'
					: 'border-[var(--fk-glass-border)] text-[var(--muted-foreground)]'}"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<path d="M5 12h14" />
				<path d="M12 5l7 7-7 7" />
			</svg>
		</div>
		<div class="connector-line flex-1 opacity-30"></div>
	</div>

	<!-- Right panel -->
	<div class="flex min-w-0 flex-1 flex-col">
		<div class="flex items-center gap-1.5 border-b border-[var(--fk-glass-border)] bg-white/[0.02] px-4 py-3">
			<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-50"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-50"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-50"></span>
			<span class="ml-2 text-[0.72rem] text-[var(--muted-foreground)]">{right.filename}</span>
			<span class="ml-auto text-[0.62rem] uppercase tracking-wide text-[var(--muted-foreground)] opacity-50">{right.lang}</span>
		</div>
		<div class="flex-1 overflow-x-auto py-3.5">
			<pre class="m-0 p-0"><code class="block">{#each right.lines as line, i}<span
						class="inline-flex w-full px-4 {right.highlights?.includes(i + 1) ? 'border-l-2 border-[var(--fk-cyan)] bg-[rgba(104,215,239,0.06)] pl-3.5' : ''} {i < rightCount ? 'opacity-100 translate-y-0 transition-all duration-400 ease-out' : 'opacity-0 translate-y-[3px]'}"
					><span class="mr-[1.5ch] inline-block w-[2.5ch] shrink-0 select-none text-right text-[var(--muted-foreground)] opacity-30">{String(i + 1).padStart(2, ' ')}</span><span class="min-w-0 flex-1">{@html line}</span></span>
{/each}</code></pre>
		</div>
	</div>
</div>

<style>
	/* ── Connector gradient lines — can't do in Tailwind ── */
	.connector-line {
		background: linear-gradient(180deg, transparent, rgba(104, 215, 239, 0.2), transparent);
	}

	/* Vertical line in desktop, horizontal in mobile */
	@media (min-width: 768px) {
		.connector-line {
			width: 1px;
		}
	}

	@media (max-width: 767px) {
		.connector-line {
			height: 1px;
			width: auto;
			background: linear-gradient(90deg, transparent, rgba(104, 215, 239, 0.2), transparent);
		}
	}
</style>
