<script lang="ts">
	import { base } from '$app/paths';
	import { Button } from '$lib/components/ui/button';

	let copied = $state(false);

	async function copyInstall() {
		await navigator.clipboard.writeText('pip install fluidkit');
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}
</script>

<section class="relative flex flex-col items-center overflow-hidden px-6 pb-20 pt-28 md:pb-32 md:pt-36">
	<!-- Background glow -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="hero-bg-glow"></div>
	</div>

	<!-- Logo row -->
	<div class="relative flex items-center gap-0">
		<!-- Svelte -->
		<div class="flex flex-col items-center gap-4">
			<div class="logo-wrap relative flex h-[90px] w-[90px] items-center justify-center max-sm:h-[60px] max-sm:w-[60px]">
				<div class="glow glow-svelte"></div>
				<svg class="relative z-2 h-full w-full float-1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<path
						class="svelte-path"
						d="M27.573 4.229c-2.927-4.25-8.656-5.479-13.068-2.802l-7.464 4.745c-2.042 1.281-3.443 3.365-3.854 5.734-0.365 1.969-0.047 4.005 0.891 5.776-0.641 0.964-1.073 2.052-1.266 3.198-0.427 2.406 0.13 4.885 1.547 6.88 2.932 4.24 8.646 5.474 13.068 2.828l7.469-4.75c2.031-1.281 3.427-3.365 3.839-5.734 0.359-1.964 0.042-3.995-0.896-5.755 1.984-3.115 1.88-7.12-0.266-10.12zM13.76 28.172c-2.401 0.625-4.938-0.318-6.349-2.359-0.865-1.198-1.182-2.677-0.932-4.146l0.146-0.708 0.135-0.438 0.401 0.266c0.88 0.667 1.865 1.146 2.917 1.469l0.271 0.094-0.031 0.266c-0.026 0.37 0.083 0.786 0.297 1.104 0.438 0.63 1.198 0.932 1.932 0.734 0.161-0.052 0.318-0.104 0.453-0.188l7.438-4.745c0.375-0.24 0.615-0.599 0.708-1.026 0.083-0.443-0.026-0.896-0.266-1.255-0.443-0.615-1.198-0.891-1.932-0.708-0.161 0.057-0.333 0.12-0.469 0.203l-2.813 1.786c-2.661 1.583-6.099 0.839-7.865-1.708-0.859-1.198-1.198-2.693-0.938-4.146 0.26-1.438 1.12-2.698 2.365-3.469l7.422-4.745c0.469-0.292 0.974-0.505 1.521-0.667 2.401-0.625 4.932 0.318 6.349 2.349 1 1.406 1.281 3.203 0.76 4.849l-0.135 0.443-0.385-0.266c-0.891-0.651-1.88-1.146-2.932-1.469l-0.266-0.078 0.026-0.266c0.026-0.391-0.083-0.802-0.297-1.12-0.438-0.63-1.198-0.896-1.932-0.708-0.161 0.052-0.318 0.104-0.453 0.188l-7.453 4.786c-0.375 0.25-0.615 0.599-0.693 1.036-0.078 0.427 0.026 0.896 0.266 1.24 0.427 0.63 1.203 0.896 1.922 0.708 0.172-0.052 0.333-0.104 0.464-0.188l2.844-1.813c0.464-0.307 0.984-0.531 1.516-0.677 2.417-0.63 4.938 0.318 6.349 2.359 0.865 1.198 1.198 2.677 0.958 4.13-0.25 1.438-1.099 2.698-2.333 3.469l-7.438 4.734c-0.484 0.292-1.005 0.521-1.547 0.677z"
					/>
				</svg>
			</div>
			<span class="label label-svelte">SvelteKit</span>
		</div>

		<!-- Left beam -->
		<div class="beam beam-left">
			<div class="beam-line"></div>
			<div class="beam-glow"></div>
			<div class="beam-particle p1"></div>
			<div class="beam-particle p2"></div>
			<div class="beam-particle p3"></div>
		</div>

		<!-- FluidKit -->
		<div class="flex flex-col items-center gap-4">
			<div class="logo-wrap relative flex h-[110px] w-[110px] items-center justify-center max-sm:h-[76px] max-sm:w-[76px]">
				<div class="glow glow-fk"></div>
				<svg class="relative z-2 h-full w-full float-2" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
					<g>
						<rect class="fk-bg" width="250" height="250" rx="38" />
						<rect id="lg" class="fk-shape" x="65" y="38" width="148" height="82" rx="12" />
						<rect id="md" class="fk-shape" x="51" y="84" width="105" height="83" rx="12" />
						<rect id="sm" class="fk-shape" x="38" y="130" width="61" height="82" rx="12" />
					</g>
				</svg>
			</div>
			<span class="label label-fk">FluidKit</span>
		</div>

		<!-- Right beam -->
		<div class="beam beam-right">
			<div class="beam-line"></div>
			<div class="beam-glow"></div>
			<div class="beam-particle p1"></div>
			<div class="beam-particle p2"></div>
			<div class="beam-particle p3"></div>
		</div>

		<!-- Python -->
		<div class="flex flex-col items-center gap-4">
			<div class="logo-wrap relative flex h-[90px] w-[90px] items-center justify-center max-sm:h-[60px] max-sm:w-[60px]">
				<div class="glow glow-python"></div>
				<svg class="relative z-2 h-full w-full float-3" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
					<path
						class="py-blue"
						d="M54.8,3.6c-26.1,0-24.8,11.3-24.8,11.3l0,11.5h25.4v3.6H24.3c0,0-17.5-2.1-17.5,25.4 c0,27.5,15.2,26.4,15.2,26.4h11.1v-12.6c0,0-0.2-14.7,14.6-14.7h15.9c0,0,14.3,0.3,14.3-13.8V21.6c0,0,1.9-18-23.1-18H54.8z M41.8,11.8c2.4,0,4.3,1.9,4.3,4.3c0,2.4-1.9,4.3-4.3,4.3c-2.4,0-4.3-1.9-4.3-4.3C37.5,13.7,39.4,11.8,41.8,11.8z"
					/>
					<path
						class="py-yellow"
						d="M55.4,106.6c26.1,0,24.8-11.3,24.8-11.3l0-11.5H54.8v-3.6h31.1c0,0,17.5,2.1,17.5-25.4 c0-27.5-15.2-26.4-15.2-26.4H77.1v12.6c0,0,0.2,14.7-14.6,14.7H46.6c0,0-14.3-0.3-14.3,13.8v19.1c0,0-1.9,18,23.1,18H55.4z M68.4,98.4c-2.4,0-4.3-1.9-4.3-4.3c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3C72.7,96.5,70.8,98.4,68.4,98.4z"
					/>
				</svg>
			</div>
			<span class="label label-python">Python</span>
		</div>
	</div>

	<!-- Title block -->
	<div class="title-block">
		<h1 class="title">FluidKit</h1>
		<p class="m-0 text-lg font-medium text-[var(--foreground)] max-sm:text-base">Web development for the Pythonist</p>
		<p class="mt-1 max-w-[520px] text-base leading-relaxed text-[var(--muted-foreground)] max-sm:max-w-[340px] max-sm:text-sm">
			Write backend functions in Python — FluidKit turns them into type&#8209;safe
			SvelteKit remote&nbsp;functions. No glue code. No&nbsp;duplicated&nbsp;types.
		</p>
	</div>

	<!-- CTA row -->
	<div class="cta-row">
		<button
			class="inline-flex cursor-pointer items-center gap-3 rounded-[10px] border border-[var(--fk-glass-border)] bg-[var(--fk-glass-bg)] py-2.5 pl-5 pr-4 text-[var(--foreground)] transition-all duration-300 hover:border-white/12 hover:bg-[var(--fk-glass-bg-hover)]"
			onclick={copyInstall}
		>
			<span class="select-none font-mono text-[0.85rem] font-medium text-[var(--fk-cyan)]">$</span>
			<code class="font-mono text-[0.85rem] text-[var(--foreground)]">pip install fluidkit</code>
			<span class="flex items-center text-[var(--muted-foreground)] transition-colors duration-200 group-hover:text-[var(--foreground)]">
				{#if copied}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
				{:else}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
				{/if}
			</span>
		</button>

		<div class="flex items-center gap-2">
			<Button
				href="/docs"
				variant="outline"
				class="fk-glass fk-glass-hover h-10 rounded-lg border-[var(--fk-glass-border)] px-5 text-sm"
			>
				Documentation
			</Button>
			<a
				href="https://github.com/AswanthManoj/Fluidkit"
				target="_blank"
				rel="noopener"
				class="inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
				</svg>
				GitHub
			</a>
		</div>
	</div>

	<!-- Scroll hint -->
	<div class="scroll-hint">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
			<path d="M7 10l5 5 5-5" />
		</svg>
	</div>
</section>

<style>
	/* ── Background Glow ─────────────────────────── */
	.hero-bg-glow {
		position: absolute;
		top: -40%;
		left: 50%;
		transform: translateX(-50%);
		width: 800px;
		height: 600px;
		background: radial-gradient(
			ellipse at center,
			rgba(104, 215, 239, 0.06) 0%,
			rgba(122, 96, 253, 0.04) 40%,
			transparent 70%
		);
		filter: blur(60px);
		animation: bgPulse 8s ease-in-out infinite;
	}

	@keyframes bgPulse {
		0%, 100% { opacity: 0.6; }
		50% { opacity: 1; }
	}

	/* ── Floating ─────────────────────────────────── */
	.float-1 { animation: float 5s ease-in-out infinite; }
	.float-2 { animation: float 5s ease-in-out 0.8s infinite; }
	.float-3 { animation: float 5s ease-in-out 1.6s infinite; }

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	/* ── Glow Orbs ───────────────────────────────── */
	.glow {
		position: absolute;
		width: 80%;
		height: 80%;
		border-radius: 50%;
		z-index: 1;
		opacity: 0;
		filter: blur(40px);
		animation: glowIn 1.5s 1.5s ease-out forwards;
	}

	.glow-svelte { background: #ff3e00; }
	.glow-fk { background: linear-gradient(135deg, #45A9EC, #7A60FD); }
	.glow-python { background: linear-gradient(135deg, #3776AB, #FFD43B); }

	@keyframes glowIn { to { opacity: 0.35; } }

	/* ── Labels ───────────────────────────────────── */
	.label {
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0;
		animation: fadeUp 0.8s 2.6s ease-out forwards;
	}

	.label-svelte { color: #ff3e00; }
	.label-fk { color: #68D7EF; }
	.label-python { color: #3776AB; }

	@media (max-width: 640px) {
		.label { font-size: 0.6rem; }
	}

	/* ── Svelte Logo ──────────────────────────────── */
	.svelte-path {
		fill: transparent;
		stroke: #ff3e00;
		stroke-width: 0.5;
		stroke-dasharray: 250;
		stroke-dashoffset: 250;
		stroke-linecap: round;
		stroke-linejoin: round;
		animation: draw 1.8s ease-out forwards, fillSvelte 0.8s 1.8s ease-in forwards;
	}

	@keyframes fillSvelte { to { fill: #ff3e00; stroke: transparent; } }

	/* ── FluidKit Logo ────────────────────────────── */
	.fk-bg {
		fill: transparent;
		stroke: rgba(255, 255, 255, 0.12);
		stroke-width: 4;
		stroke-dasharray: 1000;
		stroke-dashoffset: 1000;
		animation: draw 1.8s ease-out forwards, fillFkBg 0.8s 1.8s ease-in forwards;
	}

	@keyframes fillFkBg { to { fill: rgba(255, 255, 255, 0.05); stroke: rgba(255, 255, 255, 0.06); } }

	.fk-shape {
		fill: transparent;
		stroke-width: 8;
		stroke-dasharray: 600;
		stroke-dashoffset: 600;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	:global(#lg) {
		stroke: #68D7EF;
		animation: draw 1.8s ease-out forwards, fillShape 0.8s 1.8s ease-in forwards;
		--fill: #68D7EF;
	}
	:global(#md) {
		stroke: #45A9EC;
		animation: draw 1.8s ease-out forwards, fillShape 0.8s 1.8s ease-in forwards;
		--fill: #45A9EC;
	}
	:global(#sm) {
		stroke: #7A60FD;
		animation: draw 1.8s ease-out forwards, fillShape 0.8s 1.8s ease-in forwards;
		--fill: #7A60FD;
	}

	@keyframes fillShape { to { fill: var(--fill); stroke: transparent; } }

	/* ── Python Logo ──────────────────────────────── */
	.py-blue, .py-yellow {
		fill: transparent;
		stroke-width: 2;
		stroke-dasharray: 600;
		stroke-dashoffset: 600;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.py-blue {
		stroke: #3776AB;
		animation: draw 1.8s ease-out forwards, fillPyBlue 0.8s 1.8s ease-in forwards;
	}
	.py-yellow {
		stroke: #FFD43B;
		animation: draw 1.8s ease-out forwards, fillPyYellow 0.8s 1.8s ease-in forwards;
	}

	@keyframes fillPyBlue { to { fill: #3776AB; stroke: transparent; } }
	@keyframes fillPyYellow { to { fill: #FFD43B; stroke: transparent; } }

	@keyframes draw { to { stroke-dashoffset: 0; } }

	/* ── Beams ────────────────────────────────────── */
	.beam {
		position: relative;
		width: 100px;
		height: 40px;
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.beam-line {
		position: absolute;
		width: 100%;
		height: 1.5px;
		border-radius: 1px;
		opacity: 0;
		animation: fadeIn 0.8s 2s ease-out forwards, beamPulse 3s 3s ease-in-out infinite;
	}

	.beam-left .beam-line {
		background: linear-gradient(90deg, #ff3e00, #68D7EF);
	}
	.beam-right .beam-line {
		background: linear-gradient(90deg, #7A60FD, #3776AB);
	}

	.beam-glow {
		position: absolute;
		width: 100%;
		height: 12px;
		border-radius: 6px;
		filter: blur(6px);
		opacity: 0;
		animation: fadeIn 0.8s 2s ease-out forwards;
	}

	.beam-left .beam-glow {
		background: linear-gradient(90deg, rgba(255, 62, 0, 0.15), rgba(104, 215, 239, 0.2));
	}
	.beam-right .beam-glow {
		background: linear-gradient(90deg, rgba(122, 96, 253, 0.2), rgba(55, 118, 171, 0.15));
	}

	@keyframes beamPulse {
		0%, 100% { opacity: 0.6; }
		50% { opacity: 1; }
	}

	/* ── Beam Particles ──────────────────────────── */
	.beam-particle {
		position: absolute;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0;
	}

	.beam-left .beam-particle {
		background: #68D7EF;
		box-shadow: 0 0 6px 2px rgba(104, 215, 239, 0.6), 0 0 16px 4px rgba(104, 215, 239, 0.2);
	}
	.beam-left .p1 { animation: orbRight 2.2s 2.5s ease-in-out infinite; }
	.beam-left .p2 { animation: orbRight 2.8s 3.1s ease-in-out infinite; width: 4px; height: 4px; }
	.beam-left .p3 { animation: orbRight 1.8s 3.7s ease-in-out infinite; width: 3px; height: 3px; }

	.beam-right .beam-particle {
		background: #7A60FD;
		box-shadow: 0 0 6px 2px rgba(122, 96, 253, 0.6), 0 0 16px 4px rgba(122, 96, 253, 0.2);
	}
	.beam-right .p1 { animation: orbLeft 2.4s 2.7s ease-in-out infinite; }
	.beam-right .p2 { animation: orbLeft 2s 3.3s ease-in-out infinite; width: 4px; height: 4px; }
	.beam-right .p3 { animation: orbLeft 2.6s 3.9s ease-in-out infinite; width: 3px; height: 3px; }

	@keyframes orbRight {
		0%   { left: -6px; opacity: 0; }
		10%  { opacity: 1; }
		85%  { opacity: 1; }
		100% { left: calc(100% + 6px); opacity: 0; }
	}

	@keyframes orbLeft {
		0%   { left: calc(100% + 6px); opacity: 0; }
		10%  { opacity: 1; }
		85%  { opacity: 1; }
		100% { left: -6px; opacity: 0; }
	}

	@media (max-width: 640px) {
		.beam { width: 40px; }
	}

	/* ── Title Block ──────────────────────────────── */
	.title-block {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		margin-top: 3.5rem;
		opacity: 0;
		animation: fadeUp 1s 2.4s ease-out forwards;
	}

	.title {
		font-size: 3.5rem;
		font-weight: 700;
		margin: 0;
		background: linear-gradient(135deg, #68D7EF, #7A60FD);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	@media (max-width: 640px) {
		.title-block { margin-top: 2.5rem; }
		.title { font-size: 2.25rem; }
	}

	/* ── CTA Row ──────────────────────────────────── */
	.cta-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		margin-top: 2.5rem;
		opacity: 0;
		animation: fadeUp 1s 2.8s ease-out forwards;
	}

	/* ── Scroll Hint ──────────────────────────────── */
	.scroll-hint {
		margin-top: 3rem;
		color: var(--muted-foreground);
		opacity: 0;
		animation: fadeUp 0.8s 3.4s ease-out forwards, bob 2s 4.2s ease-in-out infinite;
	}

	@keyframes bob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(6px); }
	}

	/* ── Shared ───────────────────────────────────── */
	@keyframes fadeIn { to { opacity: 0.5; } }
	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* ── Reduced motion ──────────────────────────── */
	@media (prefers-reduced-motion: reduce) {
		*, *::before, *::after {
			animation-duration: 0.01ms !important;
			animation-delay: 0ms !important;
			animation-iteration-count: 1 !important;
		}
	}
</style>
