<script lang="ts">
	import { base } from '$app/paths';
    import { FLUIDKIT_VERSION } from '$lib/config';
	import Hero from '$lib/components/Hero.svelte';
	import Section from '$lib/components/Section.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import SplitCode from '$lib/components/SplitCode.svelte';
	import DecoratorFlow from '$lib/components/DecoratorFlow.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import AnimatedTerminal from '$lib/components/AnimatedTerminal.svelte';

	// ── SplitCode: Python ───────────────────────────
	const pythonCode = {
		filename: 'src/lib/posts.py',
		lang: 'python',
		highlights: [3, 7, 13],
		lines: [
			'<span class="im">from</span> <span class="tp">fluidkit</span> <span class="im">import</span> query, command, form',
			'',
			'<span class="dc">@query</span>',
			'<span class="kw">async def</span> <span class="fn">get_posts</span>() <span class="op">-&gt;</span> <span class="tp">list</span>[<span class="tp">Post</span>]:',
			'    <span class="kw">return await</span> db.<span class="fn">get_all_posts</span>()',
			'',
			'<span class="dc">@command</span>',
			'<span class="kw">async def</span> <span class="fn">like_post</span>(<span class="pr">post_id</span>: <span class="tp">int</span>) <span class="op">-&gt;</span> <span class="tp">bool</span>:',
			'    <span class="kw">await</span> db.<span class="fn">increment_likes</span>(<span class="pr">post_id</span>)',
			'    <span class="kw">await</span> <span class="fn">get_posts</span>().<span class="fn">refresh</span>()',
			'    <span class="kw">return</span> <span class="tp">True</span>',
			'',
			'<span class="dc">@form</span>',
			'<span class="kw">async def</span> <span class="fn">add_post</span>(<span class="pr">title</span>: <span class="tp">str</span>, <span class="pr">content</span>: <span class="tp">str</span>):',
			'    <span class="kw">await</span> db.<span class="fn">insert</span>(<span class="pr">title</span>, <span class="pr">content</span>)',
			'    <span class="kw">await</span> <span class="fn">get_posts</span>().<span class="fn">refresh</span>()',
		]
	};

	// ── SplitCode: Svelte ───────────────────────────
	const svelteCode = {
		filename: '+page.svelte',
		lang: 'svelte',
		highlights: [7, 12, 18],
		lines: [
			'<span class="tg">&lt;script&gt;</span>',
			'  <span class="im">import</span> { <span class="fn">get_posts</span>, <span class="fn">like_post</span>, <span class="fn">add_post</span> }',
			'    <span class="im">from</span> <span class="st">\'$lib/posts.remote\'</span>;',
			'<span class="tg">&lt;/script&gt;</span>',
			'',
			'<span class="cm">&lt;!-- @query \u2192 await directly in templates --&gt;</span>',
			'{<span class="kw">#each</span> <span class="kw">await</span> <span class="fn">get_posts</span>() <span class="kw">as</span> post}',
			'  <span class="tg">&lt;h2&gt;</span>{post.title}<span class="tg">&lt;/h2&gt;</span>',
			'  <span class="tg">&lt;p&gt;</span>{post.content}<span class="tg">&lt;/p&gt;</span>',
			'',
			'  <span class="cm">&lt;!-- @command \u2192 call from event handlers --&gt;</span>',
			'  <span class="tg">&lt;button</span> <span class="at">onclick</span>={() <span class="op">=&gt;</span> <span class="fn">like_post</span>(post.id)}<span class="tg">&gt;</span>',
			'    \uD83D\uDC4D {post.likes}',
			'  <span class="tg">&lt;/button&gt;</span>',
			'{<span class="kw">/each</span>}',
			'',
			'<span class="cm">&lt;!-- @form \u2192 spread onto form elements --&gt;</span>',
			'<span class="tg">&lt;form</span> {<span class="op">...</span><span class="fn">add_post</span>}<span class="tg">&gt;</span>',
			'  <span class="tg">&lt;input</span> {<span class="op">...</span><span class="fn">add_post</span>.fields.title.<span class="fn">as</span>(<span class="st">\'text\'</span>)} <span class="tg">/&gt;</span>',
			'  <span class="tg">&lt;input</span> {<span class="op">...</span><span class="fn">add_post</span>.fields.content.<span class="fn">as</span>(<span class="st">\'text\'</span>)} <span class="tg">/&gt;</span>',
			'  <span class="tg">&lt;button&gt;</span>Add Post<span class="tg">&lt;/button&gt;</span>',
			'<span class="tg">&lt;/form&gt;</span>',
		]
	};

	const revealGroups = [
		{ leftEnd: 0, rightEnd: 3 },
		{ leftEnd: 4, rightEnd: 8 },
		{ leftEnd: 10, rightEnd: 14 },
		{ leftEnd: 15, rightEnd: 21 },
	];

	// ── Feature cards ───────────────────────────────
	const features = [
		{
			title: '@query',
			description: 'Read data. Cached on the client, refreshable on demand. Supports batching for the N+1 problem.',
			color: 'var(--fk-cyan)',
			href: `${base}/docs/query`,
			code: [
				'<span class="dc">@query</span>',
				'<span class="kw">async def</span> <span class="fn">get_posts</span>() <span class="op">-&gt;</span> <span class="tp">list</span>[<span class="tp">Post</span>]:',
				'    <span class="kw">return await</span> db.<span class="fn">get_all</span>()',
			]
		},
		{
			title: '@form',
			description: 'Write data via forms. File uploads, progressive enhancement, and redirects — works without JavaScript.',
			color: '#28c840',
			href: `${base}/docs/form`,
			code: [
				'<span class="dc">@form</span>',
				'<span class="kw">async def</span> <span class="fn">create</span>(<span class="pr">title</span>: <span class="tp">str</span>, <span class="pr">photo</span>: <span class="tp">FileUpload</span>):',
				'    <span class="kw">await</span> db.<span class="fn">insert</span>(<span class="pr">title</span>, <span class="pr">photo</span>)',
			]
		},
		{
			title: '@command',
			description: 'Write data from anywhere — event handlers, button clicks. Single-flight cache invalidation built in.',
			color: 'var(--fk-purple)',
			href: `${base}/docs/command`,
			code: [
				'<span class="dc">@command</span>',
				'<span class="kw">async def</span> <span class="fn">like_post</span>(<span class="pr">post_id</span>: <span class="tp">int</span>):',
				'    <span class="kw">await</span> db.<span class="fn">increment</span>(<span class="pr">post_id</span>)',
			]
		},
		{
			title: '@prerender',
			description: 'Fetch data at build time. Served from a CDN for instant loads, with optional runtime fallback.',
			color: 'var(--fk-blue)',
			href: `${base}/docs/prerender`,
			code: [
				'<span class="dc">@prerender</span>(<span class="pr">inputs</span>=<span class="op">[</span><span class="st">"about"</span>, <span class="st">"contact"</span><span class="op">]</span>)',
				'<span class="kw">async def</span> <span class="fn">get_page</span>(<span class="pr">slug</span>: <span class="tp">str</span>):',
				'    <span class="kw">return await</span> db.<span class="fn">find</span>(<span class="pr">slug</span>)',
			]
		}
	];

	// ── Terminal steps ──────────────────────────────
	const terminalSteps = [
		{
			prompt: '$',
			command: 'pip install fluidkit',
			output: [
				'<span class="t-dim">Collecting fluidkit...</span>',
				`<span class="t-green">Successfully installed</span> fluidkit-${FLUIDKIT_VERSION}`,
			],
			delay: 1400,
		},
		{
			prompt: '$',
			command: 'fluidkit init my-app',
			output: [
				'<span class="t-cyan">◆</span> Scaffolding SvelteKit project...',
				'<span class="t-cyan">◆</span> Installing dependencies...',
				'<span class="t-cyan">◆</span> Patching configs...',
				'<span class="t-green">✓</span> Project ready at <span class="t-cyan">./my-app</span>',
			],
			delay: 1600,
		},
		{
			prompt: '$',
			command: 'cd my-app && fluidkit dev',
			output: [
				'<span class="t-dim">[fluid]</span> HMR enabled',
				'<span class="t-dim">[fluid]</span> Uvicorn running on <span class="t-cyan">http://0.0.0.0:8000</span>',
				'<span class="t-dim">[vite]</span>  VITE v7.3.1 ready in 1545 ms',
				'',
				`  <span class="t-purple">fluidkit v${FLUIDKIT_VERSION}</span>`,
				'',
				'  → <span class="t-dim">[fluid]</span>  <span class="t-cyan">http://localhost:8000</span>',
				'  → <span class="t-dim">[vite]</span>   <span class="t-cyan">http://localhost:5173</span>',
			],
		}
	];
</script>

<svelte:head>
	<title>FluidKit — Web development for the Pythonist</title>
</svelte:head>

<Hero />

<!-- How it works: Python → Svelte side-by-side -->
<Section id="how-it-works">
	<SectionHeader
		title="Write Python. Use it in Svelte."
		subtitle="Decorate a function on the left — import and use it on the right. FluidKit generates the bridge, the types, and the cache invalidation."
	/>
	<SplitCode
		left={pythonCode}
		right={svelteCode}
		animated={true}
		{revealGroups}
	/>
</Section>

<!-- Under the hood: 3-step flow -->
<Section id="under-the-hood">
	<SectionHeader
		title="Under the Hood"
		subtitle="One decorator. Three things happen."
	/>
	<DecoratorFlow />
</Section>

<!-- Four decorators -->
<Section id="decorators">
	<SectionHeader
		title="Four Decorators. Full Stack."
		subtitle="Each maps to a SvelteKit remote function type — pick the one that fits."
	/>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each features as feature}
			<FeatureCard {...feature} />
		{/each}
	</div>
</Section>

<!-- CLI / Terminal -->
<Section id="cli">
	<SectionHeader
		title="Zero to Running in Seconds"
		subtitle="No system Node.js needed. FluidKit bundles everything."
	/>
	<AnimatedTerminal steps={terminalSteps} title="~" />
</Section>
