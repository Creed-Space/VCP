/**
 * VCP WebMCP SDK
 *
 * Register VCP capabilities as discoverable tools for AI agents via
 * the navigator.modelContext API (Chrome 145+, W3C Draft 2026-02-10).
 *
 * Usage:
 *   import { registerVCPTools } from '$lib/vcp-webmcp-sdk';
 *   const { registered, cleanup } = await registerVCPTools({
 *     chatEndpoint: '/api/chat',
 *     tokenEncoder: encodeContextToCSM1,
 *     tokenParser: parseCSM1Token,
 *     transmissionSummary: getTransmissionSummary,
 *   });
 *
 * Designed to be extracted into @vcp/webmcp as a standalone npm package.
 */

export type {
	VCPWebMCPConfig,
	VCPWebMCPResult,
	PersonaInfo,
	TransmissionSummary,
	WebMCPToolDefinition,
	WebMCPToolResult,
	WebMCPToolRegistration,
	WebMCPModelContext
} from './types';

export { createVCPTools } from './tools';

import type { VCPWebMCPConfig, VCPWebMCPResult } from './types';
import type { WebMCPToolRegistration } from './types';
import { createVCPTools } from './tools';

const EMPTY_RESULT: VCPWebMCPResult = {
	registered: [],
	cleanup: () => {}
};

/**
 * Register VCP tools with navigator.modelContext.
 *
 * Safe to call during SSR (returns immediately) and in browsers without
 * WebMCP support (returns empty result, no errors logged).
 *
 * @param config - Optional configuration for tool selection and dependencies
 * @returns Promise resolving to registered tool names and a cleanup function
 */
export async function registerVCPTools(
	config: VCPWebMCPConfig = {}
): Promise<VCPWebMCPResult> {
	// SSR guard
	if (typeof window === 'undefined') return EMPTY_RESULT;

	// Feature detection
	if (!navigator.modelContext?.registerTool) return EMPTY_RESULT;

	const tools = createVCPTools(config);
	const registrations: WebMCPToolRegistration[] = [];
	const registered: string[] = [];

	for (const tool of tools) {
		try {
			const reg = navigator.modelContext.registerTool(tool);
			registrations.push(reg);
			registered.push(tool.name);
		} catch (err) {
			console.warn(`[VCP WebMCP SDK] Failed to register ${tool.name}:`, err);
		}
	}

	if (registered.length > 0) {
		console.log(`[VCP WebMCP SDK] Registered ${registered.length} tools: ${registered.join(', ')}`);
	}

	return {
		registered,
		cleanup() {
			for (const reg of registrations) {
				try {
					reg.unregister();
				} catch {
					// already unregistered or browser cleaned up
				}
			}
		}
	};
}
