<script lang="ts">
	import DocCode from '$lib/components/DocCode.svelte';

	let { data } = $props();
	let b = $derived(data.blocks);
</script>

<h1>@command</h1>

<p>
	Use <code>@command</code> to write data from anywhere — event handlers, button clicks, any
	imperative call. Unlike <a href="/docs/form"><code>@form</code></a>, commands are not tied to a
	<code>&lt;form&gt;</code> element and require JavaScript.
</p>

<blockquote>
	<p>
		Prefer <code>@form</code> where possible, since it works without JavaScript via progressive
		enhancement. Use <code>@command</code> when the action doesn't map naturally to a form
		submission.
	</p>
</blockquote>

<h2>Basic usage</h2>

<DocCode html={b.basicPy.html} filename={b.basicPy.filename} lang={b.basicPy.lang} />

<p>Call it from an event handler on the Svelte side:</p>

<DocCode html={b.basicSvelte.html} lang={b.basicSvelte.lang} />

<blockquote>
	<p>Commands cannot be called during render — only from event handlers or other imperative code.</p>
</blockquote>

<h2>Arguments and return types</h2>

<p>
	Annotate parameters and return types for full type safety:
</p>

<DocCode html={b.typedPy.html} lang={b.typedPy.lang} />

<DocCode html={b.typedSvelte.html} lang={b.typedSvelte.lang} />

<h2>Errors</h2>

<p>Call <code>error()</code> to return an HTTP error to the client:</p>

<DocCode html={b.errorsPy.html} lang={b.errorsPy.lang} />

<p>
	Since commands are called imperatively, errors are caught by your own <code>try/catch</code>
	block in the calling code. This is different from <a href="/docs/query"><code>@query</code></a>
	(where errors trigger the nearest
	<a href="https://svelte.dev/docs/svelte/svelte-boundary" target="_blank" rel="noopener"><code>&lt;svelte:boundary&gt;</code></a>)
	and <a href="/docs/form"><code>@form</code></a> (where errors render the nearest
	<code>+error.svelte</code> page).
</p>

<h2>Updating queries</h2>

<p>
	After a mutation, you'll usually want to update related queries. There are two approaches —
	server-driven and client-driven.
</p>

<h3>Server-driven</h3>

<p>
	Inside the command handler, call <code>.refresh()</code> on any query to re-execute it and send
	the new data back with the command response in a single round-trip:
</p>

<DocCode html={b.serverRefresh.html} lang={b.serverRefresh.lang} />

<p>
	If you already have the updated data, use <code>.set()</code> to update the query's value without
	re-executing it:
</p>

<DocCode html={b.serverSet.html} lang={b.serverSet.lang} />

<p>
	Both approaches are single-flight mutations — the updated query data travels back with the
	command response, avoiding a second network round-trip.
</p>

<h3>Client-driven</h3>

<p>
	Alternatively, specify which queries to update from the Svelte side using
	<code>.updates()</code>:
</p>

<DocCode html={b.clientUpdates.html} lang={b.clientUpdates.lang} />

<p>
	For optimistic updates, use <code>.withOverride()</code> to set a temporary value while the
	command is in flight:
</p>

<DocCode html={b.clientOptimistic.html} lang={b.clientOptimistic.lang} />

<p>
	The override is applied immediately and released when the command completes or fails.
</p>

<h2>Cookies</h2>

<p>Commands can read and set cookies:</p>

<DocCode html={b.cookiesPy.html} lang={b.cookiesPy.lang} />

<h2>Redirects</h2>

<p>
    Commands do not support redirects in FluidKit. If you call <code>redirect()</code> inside a
    <code>@command</code>, it will be logged as a warning and ignored on the client. Use
    <a href="/docs/form"><code>@form</code></a> if you need redirect behavior after a mutation.
</p>

<h2>Next steps</h2>

<ul>
	<li><a href="/docs/form">@form</a> — form-based mutations with progressive enhancement and redirects</li>
	<li><a href="/docs/query">@query</a> — the queries you'll be updating</li>
	<li><a href="/docs/prerender">@prerender</a> — build-time data with optional runtime fallback</li>
	<li><a href="/docs/hooks">Hooks</a> — lifecycle, request middleware, error handling</li>
</ul>
