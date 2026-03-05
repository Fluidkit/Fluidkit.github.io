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

	// ── Skip animation if not animated ──────────────
	$effect(() => {
		if (!animated) {
			leftCount = left.lines.length;
			rightCount = right.lines.length;
			done = true;
		}
	});

	// ── Intersection observer ───────────────────────
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

	// ── Typing animation ────────────────────────────
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

	// ── Reduced motion: skip animation ──────────────
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

<div bind:this={el} class="split-wrapper {className}" class:visible>
	<!-- Left panel -->
	<div class="split-panel">
		<div class="panel-header">
			<div class="dots">
				<span class="dot dot-red"></span>
				<span class="dot dot-yellow"></span>
				<span class="dot dot-green"></span>
			</div>
			<span class="panel-filename">{left.filename}</span>
			<span class="panel-lang">{left.lang}</span>
		</div>
		<div class="panel-body">
			<pre><code>{#each left.lines as line, i}<span
					class="code-line"
					class:highlighted={left.highlights?.includes(i + 1)}
					class:left-visible={i < leftCount}
					class:left-hidden={i >= leftCount}
				><span class="line-number">{String(i + 1).padStart(2, ' ')}</span><span class="line-content"
						>{@html line}{#if !done && i === leftCount - 1}<span class="cursor">▎</span>{/if}</span
					></span>
{/each}</code></pre>
		</div>
	</div>

	<!-- Connector -->
	<div class="connector">
		<div class="connector-line"></div>
		<div class="connector-icon" class:connector-active={rightCount > 0}>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			>
				<path d="M5 12h14" />
				<path d="M12 5l7 7-7 7" />
			</svg>
		</div>
		<div class="connector-line"></div>
	</div>

	<!-- Right panel -->
	<div class="split-panel">
		<div class="panel-header">
			<div class="dots">
				<span class="dot dot-red"></span>
				<span class="dot dot-yellow"></span>
				<span class="dot dot-green"></span>
			</div>
			<span class="panel-filename">{right.filename}</span>
			<span class="panel-lang">{right.lang}</span>
		</div>
		<div class="panel-body">
			<pre><code>{#each right.lines as line, i}<span
					class="code-line"
					class:highlighted={right.highlights?.includes(i + 1)}
					class:right-visible={i < rightCount}
					class:right-hidden={i >= rightCount}
				><span class="line-number">{String(i + 1).padStart(2, ' ')}</span><span class="line-content"
						>{@html line}</span
					></span>
{/each}</code></pre>
		</div>
	</div>
</div>

<style>
	/* ── Wrapper ──────────────────────────────────── */
	.split-wrapper {
		display: flex;
		align-items: stretch;
		border-radius: 14px;
		border: 1px solid var(--fk-glass-border);
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
		font-size: 0.78rem;
		line-height: 1.7;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.8s ease-out, transform 0.8s ease-out;
	}

	.split-wrapper.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* ── Panels ───────────────────────────────────── */
	.split-panel {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.panel-header {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--fk-glass-border);
		background: rgba(255, 255, 255, 0.02);
	}

	.dots {
		display: flex;
		gap: 6px;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		opacity: 0.5;
	}

	.dot-red {
		background: #ff5f57;
	}
	.dot-yellow {
		background: #febc2e;
	}
	.dot-green {
		background: #28c840;
	}

	.panel-filename {
		margin-left: 8px;
		font-size: 0.72rem;
		color: var(--muted-foreground);
	}

	.panel-lang {
		margin-left: auto;
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted-foreground);
		opacity: 0.5;
	}

	.panel-body {
		padding: 14px 0;
		overflow-x: auto;
		flex: 1;
	}

	.panel-body pre {
		margin: 0;
		padding: 0;
	}

	.panel-body code {
		display: block;
	}

	/* ── Lines ────────────────────────────────────── */
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

	/* ── Left panel reveal (instant appear, like typing) ─── */
	.left-hidden {
		visibility: hidden;
	}

	.left-visible {
		visibility: visible;
	}

	/* ── Right panel reveal (smooth fade-in) ──────── */
	.right-hidden {
		opacity: 0;
		transform: translateY(3px);
	}

	.right-visible {
		opacity: 1;
		transform: translateY(0);
		transition: opacity 0.4s ease, transform 0.4s ease;
	}

	/* ── Typing cursor ────────────────────────────── */
	.cursor {
		color: var(--fk-cyan);
		animation: blink 1s step-end infinite;
		font-weight: 300;
		margin-left: 1px;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	/* ── Connector ────────────────────────────────── */
	.connector {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 0 4px;
		flex-shrink: 0;
		border-left: 1px solid var(--fk-glass-border);
		border-right: 1px solid var(--fk-glass-border);
		background: rgba(255, 255, 255, 0.015);
	}

	.connector-line {
		width: 1px;
		flex: 1;
		background: linear-gradient(180deg, transparent, rgba(104, 215, 239, 0.2), transparent);
		opacity: 0.3;
	}

	.connector-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		background: var(--fk-glass-bg);
		border: 1px solid var(--fk-glass-border);
		color: var(--muted-foreground);
		flex-shrink: 0;
		transition: all 0.4s ease;
	}

	.connector-active {
		color: var(--fk-cyan);
		border-color: rgba(104, 215, 239, 0.2);
		box-shadow: 0 0 12px rgba(104, 215, 239, 0.15);
	}

	/* ── Syntax tokens ────────────────────────────── */
	.split-wrapper :global(.kw) {
		color: #c792ea;
	}
	.split-wrapper :global(.fn) {
		color: #82aaff;
	}
	.split-wrapper :global(.st) {
		color: #c3e88d;
	}
	.split-wrapper :global(.cm) {
		color: #546e7a;
	}
	.split-wrapper :global(.tp) {
		color: #ffcb6b;
	}
	.split-wrapper :global(.nr) {
		color: #f78c6c;
	}
	.split-wrapper :global(.op) {
		color: #89ddff;
	}
	.split-wrapper :global(.dc) {
		color: #68d7ef;
	}
	.split-wrapper :global(.pr) {
		color: #f07178;
	}
	.split-wrapper :global(.im) {
		color: #89ddff;
	}
	.split-wrapper :global(.tg) {
		color: #f07178;
	}
	.split-wrapper :global(.at) {
		color: #c792ea;
	}

	/* ── Responsive ───────────────────────────────── */
	@media (max-width: 768px) {
		.split-wrapper {
			flex-direction: column;
		}

		.connector {
			flex-direction: row;
			padding: 8px 16px;
			border-left: none;
			border-right: none;
			border-top: 1px solid var(--fk-glass-border);
			border-bottom: 1px solid var(--fk-glass-border);
		}

		.connector-line {
			width: auto;
			height: 1px;
			background: linear-gradient(90deg, transparent, rgba(104, 215, 239, 0.2), transparent);
		}

		.connector-icon {
			transform: rotate(90deg);
		}
	}
</style>
