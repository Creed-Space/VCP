import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: false
		}),
		paths: {
			// For GitHub Pages - will be set by GitHub Actions
			// Leave empty for custom domain (valuecontextprotocol.org)
			base: process.env.BASE_PATH || ''
		},
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Ignore missing favicon - we use an SVG one
				if (path === '/favicon.ico') {
					return;
				}
				// Ignore links to docs pages that are coming soon
				if (path.startsWith('/docs/') && !path.includes('getting-started') && !path.includes('concepts') && !path.includes('csm1-specification') && !path.includes('api-reference')) {
					console.warn(`Skipping prerender for coming soon doc: ${path}`);
					return;
				}
				// Ignore API routes referenced from prerendered pages (served dynamically at runtime)
				if (path.startsWith('/api/')) {
					console.warn(`Skipping prerender for API route: ${path}`);
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
