/**
 * Tests for all +page.server.ts redirect loaders across vcp-demo routes.
 *
 * Every page server in this codebase is a redirect loader that throws a
 * SvelteKit Redirect. These tests verify each redirect's status code and
 * destination URL to catch broken redirect mappings after route refactors.
 *
 * Mocking strategy: SvelteKit's redirect() throws a Redirect object with
 * { status, location } properties. We call load() with a minimal mock event
 * and catch the thrown Redirect to assert on its properties.
 */

import { describe, it, expect } from 'vitest';
import { isRedirect } from '@sveltejs/kit';

// ---------------------------------------------------------------------------
// Helper: call a redirect loader and extract the Redirect object
// ---------------------------------------------------------------------------

interface RedirectResult {
	status: number;
	location: string;
}

async function callRedirectLoader(
	loadFn: (event: unknown) => Promise<never>
): Promise<RedirectResult> {
	try {
		await loadFn({} as unknown);
		throw new Error('Expected load() to throw a redirect, but it returned normally');
	} catch (e: unknown) {
		if (isRedirect(e)) {
			return { status: e.status, location: e.location };
		}
		throw new Error(
			`Expected a SvelteKit Redirect but got: ${e instanceof Error ? e.message : String(e)}`
		);
	}
}

// ===========================================================================
// Personal routes -> /demos/gentian
// ===========================================================================

describe('Personal route redirects', () => {
	const expectedStatus = 301;
	const expectedLocation = '/demos/gentian';

	it('personal/ redirects to /demos/gentian', async () => {
		const { load } = await import('../personal/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('personal/skip redirects to /demos/gentian', async () => {
		const { load } = await import('../personal/skip/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('personal/coach redirects to /demos/gentian', async () => {
		const { load } = await import('../personal/coach/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('personal/audit redirects to /demos/gentian', async () => {
		const { load } = await import('../personal/audit/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('personal/community redirects to /demos/gentian', async () => {
		const { load } = await import('../personal/community/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('personal/platforms/musicshop redirects to /demos/gentian', async () => {
		const { load } = await import('../personal/platforms/musicshop/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('personal/platforms/justinguitar redirects to /demos/gentian', async () => {
		const { load } = await import('../personal/platforms/justinguitar/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('personal/platforms/yousician redirects to /demos/gentian', async () => {
		const { load } = await import('../personal/platforms/yousician/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});
});

// ===========================================================================
// Responsibility routes -> /demos/marta
// ===========================================================================

describe('Responsibility route redirects', () => {
	const expectedStatus = 301;
	const expectedLocation = '/demos/marta';

	it('responsibility/ redirects to /demos/marta', async () => {
		const { load } = await import('../responsibility/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('responsibility/setup redirects to /demos/marta', async () => {
		const { load } = await import('../responsibility/setup/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('responsibility/audit redirects to /demos/marta', async () => {
		const { load } = await import('../responsibility/audit/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('responsibility/decision redirects to /demos/marta', async () => {
		const { load } = await import('../responsibility/decision/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('responsibility/reflection redirects to /demos/marta', async () => {
		const { load } = await import('../responsibility/reflection/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});
});

// ===========================================================================
// Professional routes -> /demos/campion
// ===========================================================================

describe('Professional route redirects', () => {
	const expectedStatus = 301;
	const expectedLocation = '/demos/campion';

	it('professional/ redirects to /demos/campion', async () => {
		const { load } = await import('../professional/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('professional/morning redirects to /demos/campion', async () => {
		const { load } = await import('../professional/morning/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('professional/conflict redirects to /demos/campion', async () => {
		const { load } = await import('../professional/conflict/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('professional/audit redirects to /demos/campion', async () => {
		const { load } = await import('../professional/audit/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('professional/evening redirects to /demos/campion', async () => {
		const { load } = await import('../professional/evening/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});
});

// ===========================================================================
// Category routes -> /demos
// ===========================================================================

describe('Category route redirects to /demos', () => {
	const expectedStatus = 301;
	const expectedLocation = '/demos';

	it('sharing/ redirects to /demos', async () => {
		const { load } = await import('../sharing/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('coordination/ redirects to /demos', async () => {
		const { load } = await import('../coordination/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('psychosecurity/ redirects to /demos', async () => {
		const { load } = await import('../psychosecurity/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('self-modeling/ redirects to /demos', async () => {
		const { load } = await import('../self-modeling/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});

	it('adaptation/ redirects to /demos', async () => {
		const { load } = await import('../adaptation/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(expectedStatus);
		expect(result.location).toBe(expectedLocation);
	});
});

// ===========================================================================
// External redirect: safety-index -> creed.space
// ===========================================================================

describe('External redirect routes', () => {
	it('safety-index/ redirects to https://creed.space/safety-index', async () => {
		const { load } = await import('../safety-index/+page.server');
		const result = await callRedirectLoader(load);
		expect(result.status).toBe(301);
		expect(result.location).toBe('https://creed.space/safety-index');
	});
});

// ===========================================================================
// Cross-cutting: every loader exports a load function
// ===========================================================================

describe('All page servers export a load function', () => {
	const modules = [
		['personal/', () => import('../personal/+page.server')],
		['personal/skip', () => import('../personal/skip/+page.server')],
		['personal/coach', () => import('../personal/coach/+page.server')],
		['personal/audit', () => import('../personal/audit/+page.server')],
		['personal/community', () => import('../personal/community/+page.server')],
		['personal/platforms/musicshop', () => import('../personal/platforms/musicshop/+page.server')],
		['personal/platforms/justinguitar', () => import('../personal/platforms/justinguitar/+page.server')],
		['personal/platforms/yousician', () => import('../personal/platforms/yousician/+page.server')],
		['responsibility/', () => import('../responsibility/+page.server')],
		['responsibility/setup', () => import('../responsibility/setup/+page.server')],
		['responsibility/audit', () => import('../responsibility/audit/+page.server')],
		['responsibility/decision', () => import('../responsibility/decision/+page.server')],
		['responsibility/reflection', () => import('../responsibility/reflection/+page.server')],
		['professional/', () => import('../professional/+page.server')],
		['professional/morning', () => import('../professional/morning/+page.server')],
		['professional/conflict', () => import('../professional/conflict/+page.server')],
		['professional/audit', () => import('../professional/audit/+page.server')],
		['professional/evening', () => import('../professional/evening/+page.server')],
		['sharing/', () => import('../sharing/+page.server')],
		['coordination/', () => import('../coordination/+page.server')],
		['psychosecurity/', () => import('../psychosecurity/+page.server')],
		['self-modeling/', () => import('../self-modeling/+page.server')],
		['adaptation/', () => import('../adaptation/+page.server')],
		['safety-index/', () => import('../safety-index/+page.server')]
	] as const;

	it.each(modules)('%s exports a load function', async (_name, importFn) => {
		const mod = await importFn();
		expect(typeof mod.load).toBe('function');
	});
});

// ===========================================================================
// Redirect mapping completeness: verify all routes map to expected targets
// ===========================================================================

describe('Redirect mapping completeness', () => {
	const routeMap: Array<[string, () => Promise<{ load: (e: unknown) => Promise<never> }>, string]> = [
		['personal/', () => import('../personal/+page.server'), '/demos/gentian'],
		['personal/skip', () => import('../personal/skip/+page.server'), '/demos/gentian'],
		['personal/coach', () => import('../personal/coach/+page.server'), '/demos/gentian'],
		['personal/audit', () => import('../personal/audit/+page.server'), '/demos/gentian'],
		['personal/community', () => import('../personal/community/+page.server'), '/demos/gentian'],
		['personal/platforms/musicshop', () => import('../personal/platforms/musicshop/+page.server'), '/demos/gentian'],
		['personal/platforms/justinguitar', () => import('../personal/platforms/justinguitar/+page.server'), '/demos/gentian'],
		['personal/platforms/yousician', () => import('../personal/platforms/yousician/+page.server'), '/demos/gentian'],
		['responsibility/', () => import('../responsibility/+page.server'), '/demos/marta'],
		['responsibility/setup', () => import('../responsibility/setup/+page.server'), '/demos/marta'],
		['responsibility/audit', () => import('../responsibility/audit/+page.server'), '/demos/marta'],
		['responsibility/decision', () => import('../responsibility/decision/+page.server'), '/demos/marta'],
		['responsibility/reflection', () => import('../responsibility/reflection/+page.server'), '/demos/marta'],
		['professional/', () => import('../professional/+page.server'), '/demos/campion'],
		['professional/morning', () => import('../professional/morning/+page.server'), '/demos/campion'],
		['professional/conflict', () => import('../professional/conflict/+page.server'), '/demos/campion'],
		['professional/audit', () => import('../professional/audit/+page.server'), '/demos/campion'],
		['professional/evening', () => import('../professional/evening/+page.server'), '/demos/campion'],
		['sharing/', () => import('../sharing/+page.server'), '/demos'],
		['coordination/', () => import('../coordination/+page.server'), '/demos'],
		['psychosecurity/', () => import('../psychosecurity/+page.server'), '/demos'],
		['self-modeling/', () => import('../self-modeling/+page.server'), '/demos'],
		['adaptation/', () => import('../adaptation/+page.server'), '/demos'],
		['safety-index/', () => import('../safety-index/+page.server'), 'https://creed.space/safety-index']
	];

	it.each(routeMap)(
		'%s -> %s',
		async (_route, importFn, expectedLocation) => {
			const { load } = await importFn();
			const result = await callRedirectLoader(load);
			expect(result.location).toBe(expectedLocation);
		}
	);

	it('all redirects use 301 permanent status', async () => {
		for (const [_route, importFn] of routeMap) {
			const { load } = await importFn();
			const result = await callRedirectLoader(load);
			expect(result.status).toBe(301);
		}
	});
});
