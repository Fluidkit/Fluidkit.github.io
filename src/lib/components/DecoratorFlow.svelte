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
			title: '.remote.ts',
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

<div bind:this={el} class="flow-wrapper" class:visible>
	{#each steps as step, i}
		{#if i > 0}
			<div class="flow-arrow" style="--delay: {0.3 + i * 0.25}s">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
					<path d="M5 12h14" />
					<path d="M12 5l7 7-7 7" />
				</svg>
			</div>
		{/if}

		<div class="flow-step" style="--delay: {0.15 + i * 0.25}s; --accent: {step.color}">
			<span class="step-label">{step.label}</span>
			<div class="step-card">
				<div class="step-title" style="color: {step.color}">{step.title}</div>
				<div class="step-code">
					{#each step.code as line}
						<div class="step-line">{@html line}</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.flow-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		width: 100%;
	}

	/* ── Step ─────────────────────────────────────── */
	.flow-step {
		flex: 1;
		max-width: 280px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.6s ease, transform 0.6s ease;
		transition-delay: var(--delay);
	}

	.visible .flow-step {
		opacity: 1;
		transform: translateY(0);
	}

	.step-label {
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}

	.step-card {
		width: 100%;
		padding: 1.25rem;
		border-radius: 12px;
		background: var(--fk-glass-bg);
		border: 1px solid var(--fk-glass-border);
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.step-card:hover {
		border-color: color-mix(in oklch, var(--accent) 30%, transparent);
		box-shadow: 0 0 20px color-mix(in oklch, var(--accent) 8%, transparent);
	}

	.step-title {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.step-code {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.72rem;
		line-height: 1.7;
	}

	.step-line {
		color: var(--foreground);
		opacity: 0.8;
	}

	/* ── Arrow ────────────────────────────────────── */
	.flow-arrow {
		flex-shrink: 0;
		padding: 0 0.5rem;
		color: var(--muted-foreground);
		opacity: 0;
		transition: opacity 0.5s ease;
		transition-delay: var(--delay);
	}

	.visible .flow-arrow {
		opacity: 0.4;
	}

	/* ── Syntax tokens ────────────────────────────── */
	.flow-wrapper :global(.kw) { color: #c792ea; }
	.flow-wrapper :global(.fn) { color: #82aaff; }
	.flow-wrapper :global(.st) { color: #c3e88d; }
	.flow-wrapper :global(.cm) { color: #546e7a; }
	.flow-wrapper :global(.dc) { color: #68d7ef; }
	.flow-wrapper :global(.im) { color: #89ddff; }

	/* ── Responsive ───────────────────────────────── */
	@media (max-width: 768px) {
		.flow-wrapper {
			flex-direction: column;
			gap: 0;
		}

		.flow-step {
			max-width: 100%;
		}

		.flow-arrow {
			transform: rotate(90deg);
			padding: 0.5rem 0;
		}
	}
</style>
