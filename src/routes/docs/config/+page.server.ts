import { highlightMany } from '$lib/server/highlight';

export async function load() {
	return {
		blocks: await highlightMany({
			defaultConfig: {
				lang: 'json',
				filename: 'fluidkit.config.json',
				code: `{
  "entry": "src/app.py",
  "host": "0.0.0.0",
  "backend_port": 8000,
  "frontend_port": 5173,
  "schema_output": "src/lib/fluidkit",
  "watch_pattern": "src/**/*.py",
  "signed": true
}`
			}
		})
	};
}
