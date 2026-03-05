<script lang="ts">
	interface TerminalStep {
		prompt: string;
		command: string;
		output?: string[];
		delay?: number;
	}

	interface Props {
		steps: TerminalStep[];
		title?: string;
		class?: string;
	}

	let { steps, title = 'Terminal', class: className = '' }: Props = $props();

	let visible = $state(false);
	let currentStep = $state(0);
	let charIndex = $state(0);
	let showOutput = $state(false);
	let done = $state(false);
	let el: HTMLDivElement;

	// Derived from current state
	let displayedCommand = $derived(
		steps[currentStep]?.command.slice(0, charIndex) ?? ''
	);

	$effect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.3, rootMargin: '-60px 0px' }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!visible || done) return;

		const step = steps[currentStep];
		if (!step) {
			done = true;
			return;
		}

		// Typing phase
		if (charIndex < step.command.length) {
			const speed = 40 + Math.random() * 40;
			const timeout = setTimeout(() => {
				charIndex++;
			}, speed);
			return () => clearTimeout(timeout);
		}

		// Show output after typing completes
		if (!showOutput) {
			const timeout = setTimeout(() => {
				showOutput = true;
			}, 300);
			return () => clearTimeout(timeout);
		}

		// Move to next step
		if (currentStep < steps.length - 1) {
			const timeout = setTimeout(() => {
				currentStep++;
				charIndex = 0;
				showOutput = false;
			}, step.delay ?? 1200);
			return () => clearTimeout(timeout);
		} else {
			done = true;
		}
	});

	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mq.matches) {
			currentStep = steps.length - 1;
			charIndex = steps[steps.length - 1]?.command.length ?? 0;
			showOutput = true;
			done = true;
		}
	});
</script>

<div bind:this={el} class="terminal {className}" class:visible>
	<div class="terminal-header">
		<div class="dots">
			<span class="dot dot-red"></span>
			<span class="dot dot-yellow"></span>
			<span class="dot dot-green"></span>
		</div>
		<span class="terminal-title">{title}</span>
	</div>

	<div class="terminal-body">
		{#each steps as step, i}
			{#if i < currentStep}
				<!-- Completed steps -->
				<div class="term-line">
					<span class="term-prompt">{step.prompt}</span>
					<span class="term-cmd">{step.command}</span>
				</div>
				{#if step.output}
					{#each step.output as line}
						<div class="term-output">{@html line}</div>
					{/each}
				{/if}
			{:else if i === currentStep}
				<!-- Active step -->
				<div class="term-line">
					<span class="term-prompt">{step.prompt}</span>
					<span class="term-cmd">{displayedCommand}</span>
					{#if !done}
						<span class="term-cursor">▎</span>
					{/if}
				</div>
				{#if showOutput && step.output}
					{#each step.output as line, j}
						<div class="term-output fade-in" style="--delay: {j * 60}ms">{@html line}</div>
					{/each}
				{/if}
			{/if}
		{/each}

		{#if done}
			<div class="term-line">
				<span class="term-prompt">{steps[steps.length - 1]?.prompt ?? '$'}</span>
				<span class="term-cursor">▎</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.terminal {
		border-radius: 14px;
		border: 1px solid var(--fk-glass-border);
		background: rgba(0, 0, 0, 0.5);
		overflow: hidden;
		font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
		font-size: 0.82rem;
		line-height: 1.7;
		max-width: 640px;
		margin: 0 auto;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.8s ease, transform 0.8s ease;
	}

	.terminal.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* ── Header ───────────────────────────────────── */
	.terminal-header {
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

	.dot-red { background: #ff5f57; }
	.dot-yellow { background: #febc2e; }
	.dot-green { background: #28c840; }

	.terminal-title {
		margin-left: 8px;
		font-size: 0.72rem;
		color: var(--muted-foreground);
	}

	/* ── Body ─────────────────────────────────────── */
	.terminal-body {
		padding: 16px;
	}

	.term-line {
		display: flex;
		align-items: center;
		gap: 0;
		white-space: nowrap;
	}

	.term-prompt {
		color: var(--fk-cyan);
		margin-right: 0.75ch;
		user-select: none;
		flex-shrink: 0;
	}

	.term-cmd {
		color: var(--foreground);
	}

	.term-cursor {
		color: var(--fk-cyan);
		animation: blink 1s step-end infinite;
		margin-left: 1px;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}

	.term-output {
		color: var(--muted-foreground);
		padding-left: 2.5ch;
		font-size: 0.76rem;
	}

	.fade-in {
		opacity: 0;
		animation: outputIn 0.3s ease forwards;
		animation-delay: var(--delay);
	}

	@keyframes outputIn {
		to { opacity: 1; }
	}

	/* ── Output token colors ──────────────────────── */
	.terminal :global(.t-green) { color: #28c840; }
	.terminal :global(.t-cyan) { color: var(--fk-cyan); }
	.terminal :global(.t-dim) { color: #546e7a; }
	.terminal :global(.t-yellow) { color: #febc2e; }
	.terminal :global(.t-purple) { color: var(--fk-purple); }
</style>
