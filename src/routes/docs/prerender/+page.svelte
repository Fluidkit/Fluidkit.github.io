<script lang="ts">
	import DocCode from '$lib/components/DocCode.svelte';

	let { data } = $props();
	let b = $derived(data.blocks);
</script>

<h1>@prerender</h1>

<p>
	Use <code>@prerender</code> to fetch data at build time. Prerendered data is served as static
	assets from a CDN, making navigation near-instant. Use this for content that changes only when
	you redeploy.
</p>

<h2>Basic usage</h2>

<DocCode html={b.basicPy.html} filename={b.basicPy.filename} lang={b.basicPy.lang} />

<DocCode html={b.basicSvelte.html} filename={b.basicSvelte.filename} lang={b.basicSvelte.lang} />

<p>
	On the client, prerendered data is cached using the browser's
	<a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache" target="_blank" rel="noopener">Cache API</a>.
	This cache survives page reloads and is cleared when the user first visits a new deployment.
</p>

<h2>Arguments</h2>

<p>Like <code>@query</code>, prerender functions can accept arguments:</p>

<DocCode html={b.argsPy.html} lang={b.argsPy.lang} />

<DocCode html={b.argsSvelte.html} filename={b.argsSvelte.filename} lang={b.argsSvelte.lang} />

<p>
	Any calls found by SvelteKit's crawler during prerendering are saved automatically. But you can
	also specify which values to prerender using the <code>inputs</code> option.
</p>

<h2>Prerender inputs</h2>

<p>Pass a list of arguments to prerender at build time:</p>

<DocCode html={b.inputsStatic.html} lang={b.inputsStatic.lang} />

<p>You can also use a callable that returns the list:</p>

<DocCode html={b.inputsCallable.html} lang={b.inputsCallable.lang} />

<p>Async callables work too:</p>

<DocCode html={b.inputsAsyncCallable.html} lang={b.inputsAsyncCallable.lang} />

<h2>Dynamic fallback</h2>

<p>
	By default, prerender functions are excluded from your server bundle — calling them with an
	argument that wasn't prerendered will fail. Set <code>dynamic=True</code> to allow runtime
	fallback for non-prerendered arguments:
</p>

<DocCode html={b.dynamicPy.html} lang={b.dynamicPy.lang} />

<p>
	With <code>dynamic=True</code>, "hello-world" and "about-fluidkit" are prerendered at build time.
	Any other slug is fetched from the server at runtime — slower on first load, but the function
	still works.
</p>

<h2>No-argument prerender</h2>

<p>
	For data with no arguments, <code>@prerender</code> is used bare with no options:
</p>

<DocCode html={b.noArgPy.html} lang={b.noArgPy.lang} />

<p>
	This runs once at build time. Every page that calls <code>get_site_config()</code> gets the
	cached result instantly.
</p>

<h2>When to use @prerender vs @query</h2>

<table>
	<thead>
		<tr>
			<th></th>
			<th>@prerender</th>
			<th>@query</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Data fetched</td>
			<td>At build time</td>
			<td>At request time</td>
		</tr>
		<tr>
			<td>Speed</td>
			<td>Instant (static asset)</td>
			<td>Network round-trip</td>
		</tr>
		<tr>
			<td>Freshness</td>
			<td>Stale until redeployment</td>
			<td>Always current</td>
		</tr>
		<tr>
			<td>Use case</td>
			<td>Blog posts, docs, config</td>
			<td>User data, dashboards, feeds</td>
		</tr>
	</tbody>
</table>

<p>
	Use <code>@prerender</code> with <code>dynamic=True</code> for a hybrid approach — prerender
	known content for speed, fall back to the server for new content.
</p>

<h2>Limitations</h2>

<ul>
	<li>Prerender functions cannot set cookies (read-only, same as <code>@query</code>)</li>
	<li>
		Prerender functions do not support <code>.refresh()</code> or <code>.set()</code> — data is
		static
	</li>
</ul>

<h2>Next steps</h2>

<ul>
	<li><a href="/docs/query">@query</a> — dynamic data fetching at request time</li>
	<li><a href="/docs/form">@form</a> — form-based mutations with progressive enhancement</li>
	<li><a href="/docs/command">@command</a> — imperative mutations from event handlers</li>
</ul>
