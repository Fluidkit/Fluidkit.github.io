<script lang="ts">
	import DocCode from '$lib/components/DocCode.svelte';

	let { data } = $props();
	let b = $derived(data.blocks);
</script>

<h1>@form</h1>

<p>
	Use <code>@form</code> to write data via <code>&lt;form&gt;</code> elements. Forms work without
	JavaScript (progressive enhancement), support file uploads, nested Pydantic models, and can
	trigger redirects.
</p>

<h2>Basic usage</h2>

<DocCode html={b.basicPy.html} filename={b.basicPy.filename} lang={b.basicPy.lang} />

<p>
	The returned object spreads onto a <code>&lt;form&gt;</code> element. Field names match your
	Python parameter names:
</p>

<DocCode html={b.basicSvelte.html} filename={b.basicSvelte.filename} lang={b.basicSvelte.lang} />

<p>
	The form works as a native HTML form submission if JavaScript is unavailable. When JavaScript is
	present, SvelteKit progressively enhances it to submit without a full page reload.
</p>

<h2>Fields</h2>

<p>
	Each parameter in your function becomes a field. Call <code>.as(...)</code> on a field to get the
	attributes for the corresponding input type:
</p>

<DocCode html={b.fieldsPy.html} lang={b.fieldsPy.lang} />

<DocCode html={b.fieldsSvelte.html} lang={b.fieldsSvelte.lang} />

<p>
	The <code>.as(...)</code> method sets the correct input type, the <code>name</code> attribute
	used to construct form data, and the <code>aria-invalid</code> state for validation.
</p>

<h2>Nested types</h2>

<p>
	Forms support Pydantic models, arrays, and nested objects as parameters. SvelteKit parses the
	flat form fields into structured data before FluidKit forwards it to your Python handler:
</p>

<DocCode html={b.nestedPy.html} filename={b.nestedPy.filename} lang={b.nestedPy.lang} />

<DocCode html={b.nestedSvelte.html} lang={b.nestedSvelte.lang} />

<p>
	Nested fields use dot notation for objects (<code>info.height</code>) and bracket notation for
	arrays (<code>tags[0]</code>). SvelteKit coerces values based on the input name prefix:
	<code>n:</code> for numbers, <code>b:</code> for booleans.
</p>

<h2>File uploads</h2>

<p>
	Use <code>FileUpload</code> for file parameters. On the Svelte side, this maps to a file input:
</p>

<DocCode html={b.fileUploadPy.html} filename={b.fileUploadPy.filename} lang={b.fileUploadPy.lang} />

<DocCode html={b.fileUploadSvelte.html} lang={b.fileUploadSvelte.lang} />

<p>
	Add <code>enctype="multipart/form-data"</code> to the form when using file inputs.
	<code>FileUpload</code> extends FastAPI's <code>UploadFile</code>, so all its methods
	(<code>read()</code>, <code>filename</code>, <code>content_type</code>, etc.) are available.
</p>

<p>
	Files work alongside nested types. When files are present, FluidKit sends structured data as
	JSON and files as separate multipart fields:
</p>

<DocCode html={b.fileUploadNestedPy.html} lang={b.fileUploadNestedPy.lang} />

<DocCode html={b.fileUploadNestedSvelte.html} lang={b.fileUploadNestedSvelte.lang} />

<h2>Redirects</h2>

<p>Call <code>redirect()</code> to navigate after a successful submission:</p>

<DocCode html={b.redirectPy.html} lang={b.redirectPy.lang} />

<p>
	The redirect is captured by the FluidKit backend and forwarded to SvelteKit, which performs the
	navigation on the client. Common status codes:
</p>

<ul>
	<li><code>303</code> — See Other (most common for form submissions, redirects as GET)</li>
	<li><code>307</code> — Temporary Redirect (preserves request method)</li>
	<li><code>308</code> — Permanent Redirect (preserves request method, SEO transfers)</li>
</ul>

<h2>Errors</h2>

<p>Call <code>error()</code> to return an HTTP error:</p>

<DocCode html={b.errorsPy.html} lang={b.errorsPy.lang} />

<p>
	If an error occurs during form submission, the nearest <code>+error.svelte</code> page will be
	rendered. This is different from <a href="/docs/query"><code>@query</code></a> (which triggers
	<a href="https://svelte.dev/docs/svelte/svelte-boundary" target="_blank" rel="noopener"><code>&lt;svelte:boundary&gt;</code></a>)
	and <a href="/docs/command"><code>@command</code></a> (which relies on your own
	<code>try/catch</code>).
</p>

<h2>Validation</h2>

<p>
	SvelteKit provides client-side validation via the <code>issues()</code> method on each field and
	the <code>validate()</code> method on the form:
</p>

<DocCode html={b.validationSvelte.html} lang={b.validationSvelte.lang} />

<p>
	Server-side validation comes from Python's type system — if a parameter can't be coerced to the
	expected type (e.g. a string sent for an <code>int</code> field), the form handler returns a 400
	error automatically.
</p>

<h2>Returns</h2>

<p>Instead of redirecting, a form can return data. The result is available on the form object:</p>

<DocCode html={b.returnsPy.html} lang={b.returnsPy.lang} />

<DocCode html={b.returnsSvelte.html} lang={b.returnsSvelte.lang} />

<p>
	This value is ephemeral — it vanishes on resubmit, navigation, or page reload.
</p>

<h2>Single-flight mutations</h2>

<p>
	By default, all queries on the page are refreshed after a successful form submission. For more
	control, you can specify which queries to update inside the form handler. This avoids a second
	round-trip — the updated data is sent back with the form response.
</p>

<p>
	Use <code>.refresh()</code> to re-execute a query and include its new result:
</p>

<DocCode html={b.singleFlightRefresh.html} lang={b.singleFlightRefresh.lang} />

<p>
	Use <code>.set()</code> to update a query's value directly without re-executing it — useful when
	you already have the new data:
</p>

<DocCode html={b.singleFlightSet.html} lang={b.singleFlightSet.lang} />

<p>
	Both <code>.refresh()</code> and <code>.set()</code> only work inside <code>@form</code> and
	<code>@command</code> handlers. Calling them elsewhere produces a warning.
</p>

<h2>Cookies</h2>

<p>Forms can read and set cookies:</p>

<DocCode html={b.cookiesPy.html} lang={b.cookiesPy.lang} />

<blockquote>
	<p>
		Prefix sensitive parameter names with an underscore (e.g. <code>_password</code>) to prevent
		them from being sent back to the client on validation failure — matching SvelteKit's convention.
	</p>
</blockquote>

<h2>Enhance</h2>

<p>Customize submission behavior with the <code>enhance</code> method on the Svelte side:</p>

<DocCode html={b.enhanceSvelte.html} lang={b.enhanceSvelte.lang} />

<p>
	When using <code>enhance</code>, the form is not automatically reset — call
	<code>form.reset()</code> explicitly if needed.
</p>

<h2>Supported parameter types</h2>

<p>
	<code>@form</code> supports any type that can be represented as form fields:
</p>

<ul>
	<li><code>str</code>, <code>int</code>, <code>float</code>, <code>bool</code> — primitive inputs</li>
	<li><code>FileUpload</code>, <code>list[FileUpload]</code> — file inputs</li>
	<li><code>list[str]</code>, <code>list[int]</code>, etc. — multiple inputs with bracket notation</li>
	<li><code>Optional[...]</code> — optional fields</li>
	<li>Pydantic <code>BaseModel</code> — nested objects via dot notation</li>
</ul>

<h2>Next steps</h2>

<ul>
	<li><a href="/docs/command">@command</a> — write data from event handlers, not tied to a form</li>
	<li><a href="/docs/query">@query</a> — read data, the queries you'll be refreshing</li>
	<li><a href="/docs/prerender">@prerender</a> — build-time data with optional runtime fallback</li>
	<li><a href="/docs/hooks">Hooks</a> — lifecycle, request middleware, error handling</li>
</ul>
