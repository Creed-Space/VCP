// @vitest-environment node
/**
 * SSR / Node environment tests for wasmLoader.ts
 * Covers line 29: if (typeof window === 'undefined') return null
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('wasmLoader SSR (node environment)', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('loadVcpWasm returns null in node (no window) — line 29', async () => {
		const { loadVcpWasm } = await import('./wasmLoader');
		const result = await loadVcpWasm();
		expect(result).toBeNull();
	});

	it('isWasmLoaded returns false in node', async () => {
		const { isWasmLoaded } = await import('./wasmLoader');
		expect(isWasmLoaded()).toBe(false);
	});

	it('getWasmModule returns null in node', async () => {
		const { getWasmModule } = await import('./wasmLoader');
		expect(getWasmModule()).toBeNull();
	});

	it('loadVcpWasm returns null on repeated calls in node', async () => {
		const { loadVcpWasm } = await import('./wasmLoader');
		const result1 = await loadVcpWasm();
		const result2 = await loadVcpWasm();
		expect(result1).toBeNull();
		expect(result2).toBeNull();
	});
});
