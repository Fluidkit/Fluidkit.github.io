<script lang="ts">
	let visible = $state(false);
	let el: HTMLDivElement;

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

	const steps = [
		{
			label: 'You write',
			title: '@query',
			color: 'var(--fk-cyan)',
			code: [
				'<span class="dc">@query</span>',
				'<span class="kw">async def</span> <span class="fn">get_posts</span>():',
				'    <span class="kw">return await</span> db.<span class="fn">get_all</span>()',
			]
		},
		{
			label: 'FluidKit registers',
			title: 'FastAPI endpoint',
			color: 'var(--fk-blue)',
			code: [
				'<span class="cm">POST</span> <span class="st">/remote/get_posts</span>',
				'<span class="cm">├</span> validates input',
				'<span class="cm">├</span> forwards cookies',
				'<span class="cm">└</span> returns typed JSON',
			]
		},
		{
			label: 'You import',
			title: '.svelte',
			color: 'var(--fk-purple)',
			code: [
				'<span class="im">import</span> { <span class="fn">get_posts</span> }',
				'  <span class="im">from</span> <span class="st">\'$lib/posts.remote\'</span>',
				'',
				'<span class="kw">await</span> <span class="fn">get_posts</span>()',
			]
		}
	];
</script>

<div
	bind:this={el}
	class="flex w-full items-center justify-center gap-0 max-md:flex-col"
>
	{#each steps as step, i}
		{#if i > 0}
			<div
				class="shrink-0 px-2 text-[var(--muted-foreground)] transition-opacity duration-500 max-md:rotate-90 max-md:px-0 max-md:py-2 {visible ? 'opacity-40' : 'opacity-0'}"
				style="transition-delay: {0.3 + i * 0.25}s"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
					<path d="M5 12h14" />
					<path d="M12 5l7 7-7 7" />
				</svg>
			</div>
		{/if}

		<div
			class="flex flex-1 flex-col items-center gap-3 max-w-[280px] transition-all duration-[600ms] ease-out max-md:max-w-full {visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}"
			style="transition-delay: {0.15 + i * 0.25}s; --accent: {step.color}"
		>
			<span class="text-[0.65rem] font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
				{step.label}
			</span>

			<div class="step-card w-full rounded-xl border border-[var(--fk-glass-border)] bg-[var(--fk-glass-bg)] p-5 transition-all duration-300">
				<div
					class="mb-3 font-mono text-[0.85rem] font-semibold"
					style="color: {step.color}"
				>
					{step.title}
				</div>
				<div class="font-mono text-[0.72rem] leading-[1.7]">
					{#each step.code as line}
						<div class="text-[var(--foreground)] opacity-80">{@html line}</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	/* Hover glow — needs color-mix which Tailwind can't express */
	.step-card:hover {
		border-color: color-mix(in oklch, var(--accent) 30%, transparent);
		box-shadow: 0 0 20px color-mix(in oklch, var(--accent) 8%, transparent);
	}
</style>
