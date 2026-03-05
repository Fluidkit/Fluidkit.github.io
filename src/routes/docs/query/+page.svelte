<script lang="ts">
	import DocCode from '$lib/components/DocCode.svelte';

	let { data } = $props();
	let b = $derived(data.blocks);
</script>

<h1>@query</h1>

<p>
	Use <code>@query</code> to read data from the server. Queries are cached on the client and can be
	refreshed on demand.
</p>

<h2>Basic usage</h2>

<DocCode html={b.basicPy.html} filename={b.basicPy.filename} lang={b.basicPy.lang} />

<p>
	The query works as a promise that you can <code>await</code> directly in a Svelte component:
</p>

<DocCode html={b.basicSvelteAwait.html} filename={b.basicSvelteAwait.filename} lang={b.basicSvelteAwait.lang} />

<p>
	Until the promise resolves — and if it errors — the nearest
	<a href="https://svelte.dev/docs/svelte/svelte-boundary" target="_blank" rel="noopener"><code>&lt;svelte:boundary&gt;</code></a>
	will be invoked.
</p>

<p>
	While using <code>await</code> is recommended, the query also has <code>loading</code>,
	<code>error</code> and <code>current</code> properties:
</p>

<DocCode html={b.basicSvelteProps.html} filename={b.basicSvelteProps.filename} lang={b.basicSvelteProps.lang} />

<h2>Arguments</h2>

<p>Query functions can accept typed arguments:</p>

<DocCode html={b.argsPy.html} lang={b.argsPy.lang} />

<DocCode html={b.argsSvelte.html} filename={b.argsSvelte.filename} lang={b.argsSvelte.lang} />

<p>
	Arguments are validated by Python's type hints. FluidKit extracts the types from your function
	signature and generates the corresponding TypeScript types — no manual schema needed. For richer
	validation, use Pydantic models:
</p>

<DocCode html={b.argsPydantic.html} lang={b.argsPydantic.lang} />

<p>
	FluidKit generates a TypeScript interface for <code>PostFilter</code> automatically and uses it
	in the generated <code>.remote.ts</code> file.
</p>

<h2>Return types</h2>

<p>Annotate your return type and FluidKit will reflect it into TypeScript:</p>

<DocCode html={b.returnTypes.html} lang={b.returnTypes.lang} />

<p>
	The Svelte side gets full type safety — <code>post.title</code> autocompletes,
	<code>post.nonexistent</code> errors at build time. If you omit the return annotation, the
	generated type will be <code>any</code>.
</p>

<h2>Errors</h2>

<p>Raise <code>error()</code> to return an HTTP error to the client:</p>

<DocCode html={b.errors.html} lang={b.errors.lang} />

<p>
	When using <code>await</code> in templates, this triggers the nearest
	<a href="https://svelte.dev/docs/svelte/svelte-boundary" target="_blank" rel="noopener"><code>&lt;svelte:boundary&gt;</code></a>.
	If you're using the <code>loading</code> / <code>error</code> / <code>current</code> properties
	instead, the error is available via the <code>error</code> property on the query.
</p>

<h2>Refreshing queries</h2>

<p>Any query can be refetched from the client via its <code>refresh</code> method:</p>

<DocCode html={b.refresh.html} lang={b.refresh.lang} />

<p>
	Queries are cached while they're on the page, meaning
	<code>get_posts() === get_posts()</code>. You don't need to store a reference to update it.
</p>

<h2>Batching</h2>

<p>
	When multiple components each call the same query with different arguments, each call normally
	results in a separate request. <code>@query.batch</code> solves this by collecting concurrent
	calls into a single request.
</p>

<DocCode html={b.batchPy.html} lang={b.batchPy.lang} />

<p>
	The function receives a list of all the arguments from concurrent calls. It must return a callable
	with the signature <code>(arg, index) → result</code> that resolves each individual call.
</p>

<p>
	On the Svelte side, usage looks identical to a regular query — each component calls it with a
	single argument:
</p>

<DocCode html={b.batchSvelte.html} filename={b.batchSvelte.filename} lang={b.batchSvelte.lang} />

<p>
	Even though each iteration calls <code>get_post_likes</code> individually, SvelteKit collects all
	calls that happen within the same render and sends them as a single batched request. Instead of N
	database queries, you get one.
</p>

<h3>Refreshing batch queries</h3>

<p>
	Batch queries support <code>.refresh()</code> and <code>.set()</code> for individual arguments,
	both from the client and inside <code>@command</code> / <code>@form</code> handlers:
</p>

<DocCode html={b.batchRefreshPy.html} lang={b.batchRefreshPy.lang} />

<DocCode html={b.batchRefreshSvelte.html} lang={b.batchRefreshSvelte.lang} />

<p>
	Each <code>.refresh()</code> call re-executes the batch function with just the single argument —
	it does not refetch all active batch entries.
</p>

<h3>When to use batch</h3>

<p>
	Use <code>@query.batch</code> when the same query is called many times with different arguments
	in a single render — lists of cards, rows in a table, items in a feed. If a query is only ever
	called once at a time, regular <code>@query</code> is simpler.
</p>

<h2>Accessing the request</h2>

<p>
	Use <code>get_request_event()</code> to access cookies and other request data:
</p>

<DocCode html={b.requestEvent.html} lang={b.requestEvent.lang} />

<blockquote>
	<p>
		Queries can read cookies but not set them. To set cookies, use
		<a href="/docs/form"><code>@form</code></a> or <a href="/docs/command"><code>@command</code></a>.
	</p>
</blockquote>

<h2>Next steps</h2>

<ul>
	<li><a href="/docs/form">@form</a> — form handling with file uploads, progressive enhancement, and cache invalidation</li>
	<li><a href="/docs/command">@command</a> — write data from anywhere, not tied to a form</li>
	<li><a href="/docs/prerender">@prerender</a> — build-time data with optional runtime fallback</li>
</ul>
