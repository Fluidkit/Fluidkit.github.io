<script lang="ts">
	import DocCode from '$lib/components/DocCode.svelte';

	let { data } = $props();
	let b = $derived(data.blocks);
</script>

<h1>Getting Started</h1>

<p>
	FluidKit bridges Python and SvelteKit into a unified fullstack framework. Write backend functions
	in Python — FluidKit registers them as FastAPI endpoints and generates SvelteKit remote functions
	with full type safety.
</p>

<h2>Installation</h2>

<p>No system Node.js required — FluidKit bundles it automatically.</p>

<DocCode html={b.install.html} />

<h2>Create a project</h2>

<DocCode html={b.scaffold.html} />

<p>This scaffolds a SvelteKit project with FluidKit wired in and a working demo app:</p>

<DocCode html={b.structure.html} filename={b.structure.filename} />

<h2>Run it</h2>

<DocCode html={b.dev.html} />

<p>
	This starts both the FastAPI backend and Vite dev server together with hot module reloading. Open
	the app and you'll see a working posts demo — try adding posts and liking them.
</p>

<h2>How the demo works</h2>

<p>The scaffolded <code>demo.py</code> contains three decorated functions:</p>

<DocCode html={b.demoPy.html} filename={b.demoPy.filename} lang={b.demoPy.lang} />

<p>The route imports and uses them directly:</p>

<DocCode html={b.demoSvelte.html} filename={b.demoSvelte.filename} lang={b.demoSvelte.lang} />

<p>
	Notice the import path: <code>$lib/demo.remote</code>. FluidKit generates
	<code>demo.remote.ts</code> next to your <code>demo.py</code> — this is a standard SvelteKit
	remote function file that proxies calls to your Python backend. You never need to edit it.
</p>

<h2>What just happened?</h2>

<p>
	When you decorated functions with <code>@query</code>, <code>@command</code>, and
	<code>@form</code>, FluidKit:
</p>

<ul>
	<li>
		<strong>Registered each function as a FastAPI endpoint</strong> — with parameter types,
		validation, and return types extracted automatically
	</li>
	<li>
		<strong>Generated a <code>.remote.ts</code> file</strong> — a SvelteKit remote function wrapper
		that calls your FastAPI endpoint with full type safety
	</li>
	<li>
		<strong>Wired up cache invalidation</strong> —
		<code>get_posts().refresh()</code> inside <code>like_post</code> and <code>add_post</code> tells
		SvelteKit to refetch that query in the same round-trip
	</li>
</ul>

<p>
	All four decorators support both <code>async</code> and regular sync functions. Use
	<code>async def</code> when you need <code>await</code> — for database calls, HTTP requests, or
	<code>.refresh()</code> and <code>.set()</code>. Use plain <code>def</code> for simple
	synchronous logic. FluidKit handles both transparently.
</p>

<h2>Next steps</h2>

<ul>
	<li><a href="/docs/query">@query</a> — arguments, batching, refresh</li>
	<li><a href="/docs/command">@command</a> — writing data, updating queries, optimistic updates</li>
	<li><a href="/docs/form">@form</a> — fields, validation, file uploads, progressive enhancement</li>
	<li><a href="/docs/prerender">@prerender</a> — build-time data with optional runtime fallback</li>
	<li><a href="/docs/cli">CLI</a> — all available commands</li>
	<li><a href="/docs/config">Configuration</a> — fluidkit.config.json reference</li>
</ul>
