/**
 * VCP WASM Loader — SSR-safe dynamic loader for vcp-wasm bindings.
 *
 * Loads the WASM module lazily on first use (client-side only).
 * Falls back gracefully when WASM is unavailable.
 */

interface VcpWasmModule {
	parse_csm1: (code: string) => unknown;
	encode_csm1: (obj: unknown) => string;
	parse_csm1_token: (token: string) => unknown;
	encode_csm1_token: (obj: unknown) => string;
	parse_context_wire: (wire: string) => unknown;
	encode_context_wire: (obj: unknown) => string;
	validate_token: (token: string) => unknown;
	hash_content: (content: string) => string;
	verify_hash: (content: string, expected: string) => boolean;
	verify_bundle: (manifest: string, content: string) => unknown;
}

let wasmModule: VcpWasmModule | null = null;
let loading: Promise<VcpWasmModule | null> | null = null;

/**
 * Load the VCP WASM module. Returns null if loading fails (SSR, old browser, CSP).
 */
export async function loadVcpWasm(): Promise<VcpWasmModule | null> {
	if (wasmModule) return wasmModule;
	if (typeof window === 'undefined') return null;

	if (loading) return loading;

	loading = (async () => {
		try {
			// Construct URL dynamically to prevent Vite 6 from resolving it as
			// a static/public asset during SSR module analysis (which blocks
			// import() of JS files inside the public directory).
			const wasmJsUrl = new URL('/wasm/vcp_wasm.js', window.location.origin).href;
			const wasm = await import(/* @vite-ignore */ wasmJsUrl);
			await wasm.default('/wasm/vcp_wasm_bg.wasm');
			wasmModule = wasm as unknown as VcpWasmModule;
			return wasmModule;
		} catch (err) {
			console.warn('VCP WASM failed to load, falling back to JS:', err);
			return null;
		}
	})();

	return loading;
}

/**
 * Check if WASM module is loaded and ready.
 */
export function isWasmLoaded(): boolean {
	return wasmModule !== null;
}

/**
 * Get the loaded WASM module (null if not loaded).
 */
export function getWasmModule(): VcpWasmModule | null {
	return wasmModule;
}

export type { VcpWasmModule };
