import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { AUDIENCE_META } from './audience';
import type { AudienceType } from './audience';

// ============================================
// AUDIENCE_META (static data — safe to test directly)
// ============================================

describe('AUDIENCE_META', () => {
	it('has entries for general, business, and developer', () => {
		expect(AUDIENCE_META.general).toBeDefined();
		expect(AUDIENCE_META.business).toBeDefined();
		expect(AUDIENCE_META.developer).toBeDefined();
	});

	it('each entry has label, icon, and description', () => {
		for (const key of ['general', 'business', 'developer'] as AudienceType[]) {
			const meta = AUDIENCE_META[key];
			expect(typeof meta.label).toBe('string');
			expect(meta.label.length).toBeGreaterThan(0);
			expect(typeof meta.icon).toBe('string');
			expect(meta.icon.length).toBeGreaterThan(0);
			expect(typeof meta.description).toBe('string');
			expect(meta.description.length).toBeGreaterThan(0);
		}
	});

	it('general label is Everyone', () => {
		expect(AUDIENCE_META.general.label).toBe('Everyone');
	});

	it('business label is Business', () => {
		expect(AUDIENCE_META.business.label).toBe('Business');
	});

	it('developer label is Developer', () => {
		expect(AUDIENCE_META.developer.label).toBe('Developer');
	});

	it('has exactly 3 audience types', () => {
		expect(Object.keys(AUDIENCE_META).length).toBe(3);
	});
});

// ============================================
// audience store (requires fresh module per test)
// ============================================

describe('audience store', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();
		vi.resetModules();
	});

	it('defaults to general when no localStorage value', async () => {
		const { audience } = await import('./audience');
		expect(get(audience)).toBe('general');
	});

	it('restores stored value from localStorage', async () => {
		localStorage.setItem('vcp_audience', 'developer');
		const { audience } = await import('./audience');
		expect(get(audience)).toBe('developer');
	});

	it('ignores invalid localStorage values and defaults to general', async () => {
		localStorage.setItem('vcp_audience', 'invalid_value');
		const { audience } = await import('./audience');
		expect(get(audience)).toBe('general');
	});

	it('set() updates the store and localStorage', async () => {
		const { audience } = await import('./audience');
		audience.set('business');
		expect(get(audience)).toBe('business');
		expect(localStorage.getItem('vcp_audience')).toBe('business');
	});

	it('toggle() cycles general -> business -> developer -> general', async () => {
		const { audience } = await import('./audience');
		expect(get(audience)).toBe('general');

		audience.toggle();
		expect(get(audience)).toBe('business');

		audience.toggle();
		expect(get(audience)).toBe('developer');

		audience.toggle();
		expect(get(audience)).toBe('general');
	});

	it('toggle() persists to localStorage', async () => {
		const { audience } = await import('./audience');
		audience.toggle();
		expect(localStorage.getItem('vcp_audience')).toBe('business');
	});

	it('subscribe provides current value', async () => {
		const { audience } = await import('./audience');
		const values: AudienceType[] = [];
		const unsubscribe = audience.subscribe((v) => values.push(v));
		audience.set('developer');
		audience.set('business');
		unsubscribe();
		expect(values).toEqual(['general', 'developer', 'business']);
	});
});
