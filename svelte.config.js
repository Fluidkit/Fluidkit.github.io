import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
            precompress: false,
			strict: true
		}),
		alias: { '$fluidkit': './src/lib/fluidkit' },
		experimental: { remoteFunctions: true },
        prerender: {
			handleHttpError: 'warn'    // don't crash on missing pages
		}
	},
	compilerOptions: { experimental: { async: true } }
};

export default config;
