/**
 * MCP-B Polyfill Loader
 *
 * Conditionally loads the @mcp-b/global polyfill to populate
 * navigator.modelContext in browsers without native WebMCP support.
 *
 * Gated behind ?webmcp=polyfill query param. No-op otherwise.
 *
 * NOTE: @mcp-b/global currently has a runtime bug (e.custom is not a function)
 * in its @modelcontextprotocol/sdk dependency. Polyfill loading is disabled
 * until the upstream issue is fixed. The query param is still recognized
 * for future use and the UI note adjusts accordingly.
 *
 * @see https://docs.mcp-b.ai/
 * @see https://github.com/WebMCP-org/npm-packages
 */

let polyfillLoaded = false;

/**
 * Check if the polyfill was requested via URL query param.
 */
export function isPolyfillRequested(): boolean {
	if (typeof window === 'undefined') return false;
	const params = new URLSearchParams(window.location.search);
	return params.get('webmcp') === 'polyfill';
}

/**
 * Load the MCP-B polyfill if requested via ?webmcp=polyfill.
 *
 * Currently disabled due to upstream bug in @mcp-b/global.
 * Returns false and logs a message instead.
 */
export async function loadPolyfillIfRequested(): Promise<boolean> {
	if (typeof window === 'undefined') return false;
	if (polyfillLoaded) return true;
	if (!isPolyfillRequested()) return false;

	// @mcp-b/global has a runtime error in its MCP SDK dependency.
	// Disable CDN loading until upstream is fixed.
	console.info(
		'[WebMCP] ?webmcp=polyfill detected but MCP-B polyfill is temporarily disabled',
		'due to upstream bug. Use Chrome 145+ for native WebMCP support.'
	);
	return false;
}
