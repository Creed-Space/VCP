import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isPolyfillRequested, loadPolyfillIfRequested } from './polyfill';

describe('isPolyfillRequested', () => {
	const originalLocation = window.location;

	function setSearch(search: string) {
		Object.defineProperty(window, 'location', {
			value: { ...originalLocation, search },
			writable: true,
			configurable: true
		});
	}

	afterEach(() => {
		Object.defineProperty(window, 'location', {
			value: originalLocation,
			writable: true,
			configurable: true
		});
	});

	it('returns false when no URL params are present', () => {
		setSearch('');
		expect(isPolyfillRequested()).toBe(false);
	});

	it('returns true when ?webmcp=polyfill is present', () => {
		setSearch('?webmcp=polyfill');
		expect(isPolyfillRequested()).toBe(true);
	});

	it('returns false when webmcp param has a different value', () => {
		setSearch('?webmcp=native');
		expect(isPolyfillRequested()).toBe(false);
	});

	it('returns false when other params are present but not webmcp', () => {
		setSearch('?foo=bar&baz=qux');
		expect(isPolyfillRequested()).toBe(false);
	});

	it('returns true when webmcp=polyfill is among multiple params', () => {
		setSearch('?foo=bar&webmcp=polyfill&baz=qux');
		expect(isPolyfillRequested()).toBe(true);
	});

	it('returns false when webmcp param is empty', () => {
		setSearch('?webmcp=');
		expect(isPolyfillRequested()).toBe(false);
	});

	it('is case-sensitive for the param value', () => {
		setSearch('?webmcp=Polyfill');
		expect(isPolyfillRequested()).toBe(false);
	});
});

describe('loadPolyfillIfRequested', () => {
	const originalLocation = window.location;

	function setSearch(search: string) {
		Object.defineProperty(window, 'location', {
			value: { ...originalLocation, search },
			writable: true,
			configurable: true
		});
	}

	afterEach(() => {
		Object.defineProperty(window, 'location', {
			value: originalLocation,
			writable: true,
			configurable: true
		});
	});

	it('returns false when polyfill is not requested', async () => {
		setSearch('');
		const result = await loadPolyfillIfRequested();
		expect(result).toBe(false);
	});

	it('returns false when polyfill is requested (disabled due to upstream bug)', async () => {
		setSearch('?webmcp=polyfill');
		const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const result = await loadPolyfillIfRequested();
		expect(result).toBe(false);
		consoleSpy.mockRestore();
	});

	it('logs an info message when polyfill is requested but disabled', async () => {
		setSearch('?webmcp=polyfill');
		const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		await loadPolyfillIfRequested();
		expect(consoleSpy).toHaveBeenCalledOnce();
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining('?webmcp=polyfill detected'),
			expect.stringContaining('upstream bug')
		);
		consoleSpy.mockRestore();
	});

	it('returns a Promise<boolean>', async () => {
		setSearch('');
		const result = loadPolyfillIfRequested();
		expect(result).toBeInstanceOf(Promise);
		expect(await result).toBe(false);
	});
});
