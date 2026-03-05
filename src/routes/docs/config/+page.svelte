<script lang="ts">
	import DocCode from '$lib/components/DocCode.svelte';

	let { data } = $props();
	let b = $derived(data.blocks);
</script>

<h1>Configuration</h1>

<p>
	FluidKit is configured via a <code>fluidkit.config.json</code> file in your project root. This
	file is created automatically when you run <code>fluidkit init</code>.
</p>

<h2>Default configuration</h2>

<DocCode html={b.defaultConfig.html} filename={b.defaultConfig.filename} lang={b.defaultConfig.lang} />

<h2>Options</h2>

<table>
	<thead>
		<tr>
			<th>Option</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>entry</code></td>
			<td><code>string</code></td>
			<td><code>"src/app.py"</code></td>
			<td>Path to your Python app entry point</td>
		</tr>
		<tr>
			<td><code>host</code></td>
			<td><code>string</code></td>
			<td><code>"0.0.0.0"</code></td>
			<td>Host address for the backend server</td>
		</tr>
		<tr>
			<td><code>backend_port</code></td>
			<td><code>int</code></td>
			<td><code>8000</code></td>
			<td>Port for the Python FastAPI backend</td>
		</tr>
		<tr>
			<td><code>frontend_port</code></td>
			<td><code>int</code></td>
			<td><code>5173</code></td>
			<td>Port for the Vite dev server</td>
		</tr>
		<tr>
			<td><code>schema_output</code></td>
			<td><code>string</code></td>
			<td><code>"src/lib/fluidkit"</code></td>
			<td>Directory where FluidKit writes its runtime TypeScript files</td>
		</tr>
		<tr>
			<td><code>watch_pattern</code></td>
			<td><code>string</code></td>
			<td><code>"src/**/*.py"</code></td>
			<td>Glob pattern for HMR file watching</td>
		</tr>
	</tbody>
</table>

<h2>Precedence</h2>

<p>
	CLI flags → <code>fluidkit.config.json</code> → defaults.
</p>

<p>
	For example, running <code>fluidkit dev --backend-port 9000</code> will use port
	<code>9000</code> regardless of what's in the config file.
</p>

<h2>Schema output</h2>

<p>
	The <code>schema_output</code> directory contains FluidKit's generated runtime TypeScript files. A
	<code>$fluidkit</code> alias is automatically added to your <code>svelte.config.js</code> pointing
	to this directory. If you change <code>schema_output</code>, the alias is updated on the next
	<code>fluidkit dev</code> or <code>fluidkit build</code>.
</p>
