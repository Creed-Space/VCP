import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * wasmLoader uses module-level state (wasmModule, loading), so we must
 * reset the module between tests to avoid cross-contamination.
 */
describe('wasmLoader', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('isWasmLoaded returns false before any loading', async () => {
		const { isWasmLoaded } = await import('./wasmLoader');
		expect(isWasmLoaded()).toBe(false);
	});

	it('getWasmModule returns null before any loading', async () => {
		const { getWasmModule } = await import('./wasmLoader');
		expect(getWasmModule()).toBeNull();
	});

	it('loadVcpWasm returns null when WASM import fails', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const { loadVcpWasm } = await import('./wasmLoader');
		const result = await loadVcpWasm();

		expect(result).toBeNull();
		warnSpy.mockRestore();
	});

	it('loadVcpWasm logs a warning when WASM import fails', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const { loadVcpWasm } = await import('./wasmLoader');
		await loadVcpWasm();

		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(warnSpy).toHaveBeenCalledWith(
			'VCP WASM failed to load, falling back to JS:',
			expect.anything()
		);
		warnSpy.mockRestore();
	});

	it('isWasmLoaded remains false after a failed load', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const { loadVcpWasm, isWasmLoaded } = await import('./wasmLoader');
		await loadVcpWasm();

		expect(isWasmLoaded()).toBe(false);
		warnSpy.mockRestore();
	});

	it('getWasmModule remains null after a failed load', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const { loadVcpWasm, getWasmModule } = await import('./wasmLoader');
		await loadVcpWasm();

		expect(getWasmModule()).toBeNull();
		warnSpy.mockRestore();
	});

	it('calling loadVcpWasm twice reuses the same loading promise', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const { loadVcpWasm } = await import('./wasmLoader');
		const promise1 = loadVcpWasm();
		const promise2 = loadVcpWasm();

		const [result1, result2] = await Promise.all([promise1, promise2]);

		expect(result1).toBeNull();
		expect(result2).toBeNull();
		// warn should only fire once, not twice, because loading is deduplicated
		expect(warnSpy).toHaveBeenCalledTimes(1);
		warnSpy.mockRestore();
	});

	it('loadVcpWasm returns module on successful WASM load', async () => {
		const mockDefault = vi.fn().mockResolvedValue(undefined);
		const mockModule = {
			default: mockDefault,
			parse_csm1: vi.fn(),
			encode_csm1: vi.fn(),
			parse_csm1_token: vi.fn(),
			encode_csm1_token: vi.fn(),
			parse_context_wire: vi.fn(),
			encode_context_wire: vi.fn(),
			validate_token: vi.fn(),
			hash_content: vi.fn(),
			verify_hash: vi.fn(),
			verify_bundle: vi.fn()
		};

		// Mock the dynamic import at the global level
		const originalImport = globalThis.__vitest_dynamic_import__ ?? undefined;
		// Vitest transforms import() calls - we intercept via URL mock + module mock
		const OriginalURL = globalThis.URL;

		// Create a data URL that vitest/node can import
		const moduleCode = [
			'export default function init() { return Promise.resolve(); }',
			'export function parse_csm1() {}',
			'export function encode_csm1() {}',
			'export function parse_csm1_token() {}',
			'export function encode_csm1_token() {}',
			'export function parse_context_wire() {}',
			'export function encode_context_wire() {}',
			'export function validate_token() {}',
			'export function hash_content() {}',
			'export function verify_hash() {}',
			'export function verify_bundle() {}'
		].join('\n');
		const dataUrl = `data:text/javascript,${encodeURIComponent(moduleCode)}`;

		// Override URL so the loader constructs our data URL
		globalThis.URL = class MockURL extends OriginalURL {
			constructor(path: string | URL, base?: string | URL) {
				if (typeof path === 'string' && path === '/wasm/vcp_wasm.js') {
					super(dataUrl);
				} else {
					super(path, base);
				}
			}
		} as typeof URL;

		try {
			const { loadVcpWasm, isWasmLoaded, getWasmModule } = await import('./wasmLoader');
			const result = await loadVcpWasm();

			expect(result).not.toBeNull();
			expect(isWasmLoaded()).toBe(true);
			expect(getWasmModule()).not.toBeNull();
		} finally {
			globalThis.URL = OriginalURL;
		}
	});

	it('loadVcpWasm returns cached module on second call (line 28 early return)', async () => {
		const OriginalURL = globalThis.URL;

		const moduleCode = [
			'export default function init() { return Promise.resolve(); }',
			'export function parse_csm1() {}',
			'export function encode_csm1() {}',
			'export function parse_csm1_token() {}',
			'export function encode_csm1_token() {}',
			'export function parse_context_wire() {}',
			'export function encode_context_wire() {}',
			'export function validate_token() {}',
			'export function hash_content() {}',
			'export function verify_hash() {}',
			'export function verify_bundle() {}'
		].join('\n');
		const dataUrl = `data:text/javascript,${encodeURIComponent(moduleCode)}`;

		globalThis.URL = class MockURL extends OriginalURL {
			constructor(path: string | URL, base?: string | URL) {
				if (typeof path === 'string' && path === '/wasm/vcp_wasm.js') {
					super(dataUrl);
				} else {
					super(path, base);
				}
			}
		} as typeof URL;

		try {
			const { loadVcpWasm } = await import('./wasmLoader');
			// First call: loads the module
			const first = await loadVcpWasm();
			expect(first).not.toBeNull();

			// Second call: wasmModule is set, hits line 28 early return
			const second = await loadVcpWasm();
			expect(second).not.toBeNull();
			expect(second).toBe(first); // Same reference (cached)
		} finally {
			globalThis.URL = OriginalURL;
		}
	});
});
