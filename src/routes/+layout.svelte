<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
	<title>FluidKit — Web development for the Pythonist</title>
	<meta name="description" content="Bridge Python and SvelteKit into a unified fullstack framework with full type safety." />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="FluidKit — Web development for the Pythonist" />
	<meta property="og:description" content="Write backend functions in Python. FluidKit turns them into type-safe SvelteKit remote functions." />
	<meta property="og:url" content="https://fluidkit.github.io" />
	<meta property="og:image" content="https://fluidkit.github.io/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Nav />
	<main class="flex-1 pt-16">
		{@render children()}
	</main>
	<Footer />
</div>
