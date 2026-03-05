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

		if (charIndex < step.command.length) {
			const speed = 40 + Math.random() * 40;
			const timeout = setTimeout(() => { charIndex++; }, speed);
			return () => clearTimeout(timeout);
		}

		if (!showOutput) {
			const timeout = setTimeout(() => { showOutput = true; }, 300);
			return () => clearTimeout(timeout);
		}

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

<div
	bind:this={el}
	class="mx-auto max-w-[640px] overflow-hidden rounded-[14px] border border-[var(--fk-glass-border)] bg-black/50 font-mono text-[0.82rem] leading-[1.7] transition-all duration-[800ms] ease-out {visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} {className}"
>
	<!-- Header -->
	<div class="flex items-center gap-1.5 border-b border-[var(--fk-glass-border)] bg-white/[0.02] px-4 py-3">
		<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-50"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-50"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-50"></span>
		<span class="ml-2 text-[0.72rem] text-[var(--muted-foreground)]">{title}</span>
	</div>

	<!-- Body -->
	<div class="p-4">
		{#each steps as step, i}
			{#if i < currentStep}
				<div class="flex items-center whitespace-nowrap">
					<span class="mr-[0.75ch] shrink-0 select-none text-[var(--fk-cyan)]">{step.prompt}</span>
					<span class="text-[var(--foreground)]">{step.command}</span>
				</div>
				{#if step.output}
					{#each step.output as line}
						<div class="pl-[2.5ch] text-[0.76rem] text-[var(--muted-foreground)]">{@html line}</div>
					{/each}
				{/if}
			{:else if i === currentStep}
				<div class="flex items-center whitespace-nowrap">
					<span class="mr-[0.75ch] shrink-0 select-none text-[var(--fk-cyan)]">{step.prompt}</span>
					<span class="text-[var(--foreground)]">{displayedCommand}</span>
					{#if !done}
						<span class="ml-px animate-cursor-blink text-[var(--fk-cyan)]">▎</span>
					{/if}
				</div>
				{#if showOutput && step.output}
					{#each step.output as line, j}
						<div
							class="animate-output-in pl-[2.5ch] text-[0.76rem] text-[var(--muted-foreground)] opacity-0"
							style="animation-delay: {j * 60}ms"
						>{@html line}</div>
					{/each}
				{/if}
			{/if}
		{/each}

		{#if done}
			<div class="flex items-center whitespace-nowrap">
				<span class="mr-[0.75ch] shrink-0 select-none text-[var(--fk-cyan)]">{steps[steps.length - 1]?.prompt ?? '$'}</span>
				<span class="ml-px animate-cursor-blink text-[var(--fk-cyan)]">▎</span>
			</div>
		{/if}
	</div>
</div>
