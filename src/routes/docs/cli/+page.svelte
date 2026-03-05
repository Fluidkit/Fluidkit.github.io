<script lang="ts">
	import DocCode from '$lib/components/DocCode.svelte';

	let { data } = $props();
	let b = $derived(data.blocks);
</script>

<h1>CLI</h1>

<p>
	FluidKit provides a single CLI entry point for scaffolding, development, building, and managing
	Node.js tooling — all without requiring a system Node.js installation.
</p>

<h2>init</h2>

<DocCode html={b.init.html} lang="bash" />

<p>
	Creates a new SvelteKit project with FluidKit wired in. This runs <code>sv create</code> under
	the hood, installs dependencies, copies template files, and patches
	<code>svelte.config.js</code> and <code>vite.config.ts</code> with the required settings.
</p>

<p>
	The scaffolded project includes a working demo app you can run immediately with
	<code>fluidkit dev</code>.
</p>

<h2>dev</h2>

<DocCode html={b.dev.html} lang="bash" />

<p>
	Starts the FastAPI backend and Vite dev server together. Python changes are picked up instantly
	via hot module reloading, and generated <code>.remote.ts</code> files update automatically on
	save.
</p>

<table>
	<thead>
		<tr>
			<th>Flag</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>--host TEXT</code></td>
			<td>Override bind address (default: <code>0.0.0.0</code>)</td>
		</tr>
		<tr>
			<td><code>--backend-port INT</code></td>
			<td>Override backend port (default: <code>8000</code>)</td>
		</tr>
		<tr>
			<td><code>--frontend-port INT</code></td>
			<td>Override frontend port (default: <code>5173</code>)</td>
		</tr>
		<tr>
			<td><code>--no-hmr</code></td>
			<td>Disable hot module reloading, restart on change instead</td>
		</tr>
	</tbody>
</table>

<h2>build</h2>

<DocCode html={b.build.html} lang="bash" />

<p>
	Runs codegen and then <code>npm run build</code>. Use this to produce a production build.
</p>

<table>
	<thead>
		<tr>
			<th>Flag</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>--backend-port INT</code></td>
			<td>Override backend port (default: <code>8000</code>)</td>
		</tr>
	</tbody>
</table>

<h2>preview</h2>

<DocCode html={b.preview.html} lang="bash" />

<p>
	Previews the production build locally. Starts both the FastAPI backend and the Vite preview
	server.
</p>

<table>
	<thead>
		<tr>
			<th>Flag</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>--backend-port INT</code></td>
			<td>Override backend port (default: <code>8000</code>)</td>
		</tr>
		<tr>
			<td><code>--frontend-port INT</code></td>
			<td>Override frontend port (default: <code>5173</code>)</td>
		</tr>
	</tbody>
</table>

<h2>install</h2>

<DocCode html={b.install.html} lang="bash" />

<p>
	Shorthand for <code>npm install</code>. The <code>-D</code> / <code>--save-dev</code> flag
	installs as a dev dependency.
</p>

<h2>npm</h2>

<DocCode html={b.npm.html} lang="bash" />

<p>
	Passthrough to npm. Any arguments after <code>npm</code> are forwarded directly.
</p>

<h2>npx</h2>

<DocCode html={b.npx.html} lang="bash" />

<p>
	Passthrough to npx. Any arguments after <code>npx</code> are forwarded directly.
</p>

<h2>node</h2>

<DocCode html={b.node.html} lang="bash" />

<p>
	Passthrough to node. Any arguments after <code>node</code> are forwarded directly.
</p>

<h2>Flag precedence</h2>

<p>
	CLI flags override <code>fluidkit.config.json</code>, which overrides defaults. See
	<a href="/docs/config">Configuration</a> for the config file reference.
</p>
