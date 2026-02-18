import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
	const plugins = [sveltekit()];
	if (process.env.NODE_ENV !== 'production') {
		try {
			const { svelteTesting } = await import('@testing-library/svelte/vite');
			plugins.push(svelteTesting());
		} catch {
			// testing-library not available in production builds
		}
	}
	return {
		plugins,
		test: {
			environment: 'jsdom'
		}
	};
});
