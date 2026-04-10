<script lang="ts">
	import DocCode from '$lib/components/DocCode.svelte';

	let { data } = $props();
	let b = $derived(data.blocks);
</script>

<h1>Hooks</h1>

<p>
	FluidKit hooks let you run Python code at server lifecycle points and intercept every remote
	function call — without writing any TypeScript. They mirror SvelteKit's
	<code>hooks.server.ts</code> behavior but live entirely in Python.
</p>

<h2>Lifecycle</h2>

<h3>@hooks.init</h3>

<p>
	Runs once when the server starts. Async or sync, no parameters. One per application —
	registering a second from the same module replaces the first with a warning, from a different
	module raises <code>RuntimeError</code>.
</p>

<DocCode html={b.init.html} lang={b.init.lang} />

<h3>@hooks.cleanup</h3>

<p>Runs once when the server shuts down. Async or sync, no parameters. One per application.</p>

<DocCode html={b.cleanup.html} lang={b.cleanup.lang} />

<h3>@hooks.lifespan</h3>

<p>
	Paired setup and teardown via a generator. Code before <code>yield</code> runs at startup, code
	after runs at shutdown. Async or sync generator, yields exactly once. One per application.
</p>

<DocCode html={b.lifespan.html} lang={b.lifespan.lang} />

<h2>Request middleware — @hooks.handle</h2>

<p>
	Runs before every remote function call. Receives <code>(event, resolve)</code>. Must return
	<code>await resolve(event)</code> to continue, or return early to short-circuit.
</p>

<DocCode html={b.handle.html} lang={b.handle.lang} />

<p>Multiple <code>@hooks.handle</code> hooks are allowed and execute in source order by default:</p>

<DocCode html={b.handleLogging.html} lang={b.handleLogging.lang} />

<h3>Ordering</h3>

<p>
	Use <code>hooks.sequence()</code> to set explicit execution order. Each function must already be
	decorated with <code>@hooks.handle</code>. Calling it from the same module replaces the previous
	order. Calling it from a different module raises <code>RuntimeError</code>.
</p>

<DocCode html={b.sequence.html} lang={b.sequence.lang} />

<h3>HookEvent reference</h3>

<p>
	The <code>event</code> object passed to every <code>@hooks.handle</code> handler:
</p>

<table>
	<thead>
		<tr>
			<th>Field</th>
			<th>Type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>event.url</code></td>
			<td><code>str</code></td>
			<td>Full request URL</td>
		</tr>
		<tr>
			<td><code>event.method</code></td>
			<td><code>str</code></td>
			<td>HTTP method</td>
		</tr>
		<tr>
			<td><code>event.headers</code></td>
			<td><code>dict[str, str]</code></td>
			<td>Incoming request headers</td>
		</tr>
		<tr>
			<td><code>event.cookies</code></td>
			<td><code>Cookies</code></td>
			<td>Shared with the remote function handler. Reads and writes collected together.</td>
		</tr>
		<tr>
			<td><code>event.locals</code></td>
			<td><code>dict</code></td>
			<td>Shared with the remote function handler. Serializable values forwarded to SvelteKit.</td>
		</tr>
		<tr>
			<td><code>event.is_remote</code></td>
			<td><code>bool</code></td>
			<td><code>True</code> for remote function calls, <code>False</code> for page-level requests.</td>
		</tr>
	</tbody>
</table>

<h3>Sharing data via event.locals</h3>

<p>
	<code>event.locals</code> and <code>event.cookies</code> are the same instances shared with
	<code>RequestEvent</code> inside the remote function. A value set in a hook is immediately
	visible inside the handler. Serializable values in <code>locals</code> are forwarded to
	SvelteKit automatically.
</p>

<DocCode html={b.locals.html} lang={b.locals.lang} />

<h2>Error hooks</h2>

<p>
	Error hooks fire for unexpected exceptions only. <code>error()</code> and
	<code>redirect()</code> are intentional control flow and never reach these hooks.
</p>

<h3>@hooks.handle_error</h3>

<p>
	Fires for <code>TypeError</code> (status 400), <code>ValueError</code> (400 in
	<code>@form</code>, 500 elsewhere), and any other unhandled exception (status 500). Must accept
	<code>(error, event, status, message)</code>. Must return a dict with at minimum
	<code>&#123;"message": str&#125;</code>
</p>

<DocCode html={b.handleError.html} lang={b.handleError.lang} />

<h3>@hooks.handle_validation_error</h3>

<p>
	Fires when a remote function parameter fails Pydantic schema validation (status 400). Must
	accept <code>(issues, event)</code> where <code>issues</code> is Pydantic's
	<code>e.errors()</code> list. Must return a dict with at minimum <code>&#123;"message": str&#125;</code>.
</p>

<DocCode html={b.handleValidationError.html} lang={b.handleValidationError.lang} />

<p>
	One of each per application. If either hook itself raises, the default error response is used
	silently.
</p>

<h2>Generated src/hooks.server.ts</h2>

<p>
	When any hooks are registered, FluidKit automatically generates
	<code>src/hooks.server.ts</code>. Do not edit it — FluidKit overwrites it on every
	<code>dev</code> and <code>build</code>. If you need additional SvelteKit handle logic, use
	SvelteKit's <code>sequence()</code> helper in a separate file.
</p>

<p>
	If no hooks are registered and this file was previously generated by FluidKit, it is removed
	automatically.
</p>

<h2>Deprecated API</h2>

<p>
	<code>@on_startup</code>, <code>@on_shutdown</code>, and <code>@lifespan</code> imported
	directly from <code>fluidkit</code> still work but emit <code>DeprecationWarning</code>.
</p>

<table>
	<thead>
		<tr>
			<th>Deprecated</th>
			<th>Replacement</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>@on_startup</code></td>
			<td><code>@hooks.init</code></td>
		</tr>
		<tr>
			<td><code>@on_shutdown</code></td>
			<td><code>@hooks.cleanup</code></td>
		</tr>
		<tr>
			<td><code>@lifespan</code></td>
			<td><code>@hooks.lifespan</code></td>
		</tr>
	</tbody>
</table>

<DocCode html={b.deprecated.html} lang={b.deprecated.lang} />

<h2>Next steps</h2>

<ul>
	<li><a href="/docs/query">@query</a> — read data, access cookies and locals</li>
	<li><a href="/docs/command">@command</a> — write data, set cookies</li>
	<li><a href="/docs/form">@form</a> — form handling with redirects and file uploads</li>
</ul>
