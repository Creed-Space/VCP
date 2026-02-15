import { describe, it, expect, vi } from 'vitest';
import { createVCPTools } from './tools';
import type { VCPWebMCPConfig, WebMCPToolDefinition } from './types';

// ============================================
// Helper to find tool by name
// ============================================

function findTool(tools: WebMCPToolDefinition[], name: string): WebMCPToolDefinition | undefined {
	return tools.find((t) => t.name === name);
}

// ============================================
// createVCPTools — tool set composition
// ============================================

describe('createVCPTools', () => {
	it('returns an array of tools', () => {
		const tools = createVCPTools({});
		expect(Array.isArray(tools)).toBe(true);
	});

	it('with default config creates vcp_chat and vcp_list_personas', () => {
		const tools = createVCPTools({});
		expect(findTool(tools, 'vcp_chat')).toBeDefined();
		expect(findTool(tools, 'vcp_list_personas')).toBeDefined();
	});

	it('skips vcp_build_token when tokenEncoder not provided', () => {
		const tools = createVCPTools({});
		expect(findTool(tools, 'vcp_build_token')).toBeUndefined();
	});

	it('includes vcp_build_token when tokenEncoder is provided', () => {
		const tools = createVCPTools({
			tokenEncoder: () => 'mock-token'
		});
		expect(findTool(tools, 'vcp_build_token')).toBeDefined();
	});

	it('skips vcp_parse_token when neither tokenParser nor wasmParser provided', () => {
		const tools = createVCPTools({});
		expect(findTool(tools, 'vcp_parse_token')).toBeUndefined();
	});

	it('includes vcp_parse_token when tokenParser is provided', () => {
		const tools = createVCPTools({
			tokenParser: () => ({ parsed: true })
		});
		expect(findTool(tools, 'vcp_parse_token')).toBeDefined();
	});

	it('includes vcp_parse_token when wasmParser is provided', () => {
		const tools = createVCPTools({
			wasmParser: () => ({ parsed: true })
		});
		expect(findTool(tools, 'vcp_parse_token')).toBeDefined();
	});

	it('skips vcp_transmission_summary when transmissionSummary not provided', () => {
		const tools = createVCPTools({});
		expect(findTool(tools, 'vcp_transmission_summary')).toBeUndefined();
	});

	it('includes vcp_transmission_summary when transmissionSummary is provided', () => {
		const tools = createVCPTools({
			transmissionSummary: () => ({ transmitted: [], withheld: [], influencing: [] })
		});
		expect(findTool(tools, 'vcp_transmission_summary')).toBeDefined();
	});

	it('respects enableChat=false', () => {
		const tools = createVCPTools({ enableChat: false });
		expect(findTool(tools, 'vcp_chat')).toBeUndefined();
	});

	it('respects enablePersonas=false', () => {
		const tools = createVCPTools({ enablePersonas: false });
		expect(findTool(tools, 'vcp_list_personas')).toBeUndefined();
	});

	it('respects enableTokenBuilder=false even with tokenEncoder', () => {
		const tools = createVCPTools({
			enableTokenBuilder: false,
			tokenEncoder: () => 'mock'
		});
		expect(findTool(tools, 'vcp_build_token')).toBeUndefined();
	});

	it('respects enableTokenParser=false even with tokenParser', () => {
		const tools = createVCPTools({
			enableTokenParser: false,
			tokenParser: () => ({})
		});
		expect(findTool(tools, 'vcp_parse_token')).toBeUndefined();
	});

	it('respects enableSummary=false even with transmissionSummary', () => {
		const tools = createVCPTools({
			enableSummary: false,
			transmissionSummary: () => ({ transmitted: [], withheld: [], influencing: [] })
		});
		expect(findTool(tools, 'vcp_transmission_summary')).toBeUndefined();
	});

	it('with all features enabled and deps provided returns 5 tools', () => {
		const tools = createVCPTools({
			tokenEncoder: () => 'token',
			tokenParser: () => ({}),
			transmissionSummary: () => ({ transmitted: [], withheld: [], influencing: [] })
		});
		expect(tools.length).toBe(5);
	});

	it('all tools have name, description, inputSchema, and execute', () => {
		const tools = createVCPTools({
			tokenEncoder: () => 'token',
			tokenParser: () => ({}),
			transmissionSummary: () => ({ transmitted: [], withheld: [], influencing: [] })
		});
		for (const tool of tools) {
			expect(typeof tool.name).toBe('string');
			expect(tool.name.length).toBeGreaterThan(0);
			expect(typeof tool.description).toBe('string');
			expect(tool.description.length).toBeGreaterThan(0);
			expect(tool.inputSchema).toBeDefined();
			expect(typeof tool.execute).toBe('function');
		}
	});
});

// ============================================
// Tool execution tests
// ============================================

describe('vcp_build_token execute', () => {
	it('calls tokenEncoder and returns result', async () => {
		const encoder = vi.fn().mockReturnValue('encoded-token-123');
		const tools = createVCPTools({ tokenEncoder: encoder });
		const tool = findTool(tools, 'vcp_build_token')!;

		const result = await tool.execute({ vcp_context: { profile_id: 'test' } });
		expect(encoder).toHaveBeenCalledWith({ profile_id: 'test' });
		expect(result.content[0].text).toBe('encoded-token-123');
	});

	it('returns error when vcp_context is not an object', async () => {
		const tools = createVCPTools({ tokenEncoder: () => 'token' });
		const tool = findTool(tools, 'vcp_build_token')!;

		const result = await tool.execute({ vcp_context: 'not-an-object' });
		expect(result.content[0].text).toContain('Error');
	});

	it('returns error when tokenEncoder throws', async () => {
		const encoder = vi.fn().mockImplementation(() => {
			throw new Error('encode failed');
		});
		const tools = createVCPTools({ tokenEncoder: encoder });
		const tool = findTool(tools, 'vcp_build_token')!;

		const result = await tool.execute({ vcp_context: { id: 'test' } });
		expect(result.content[0].text).toContain('Error');
		expect(result.content[0].text).toContain('encode failed');
	});
});

describe('vcp_parse_token execute', () => {
	it('uses JS parser and returns structured result', async () => {
		const parser = vi.fn().mockReturnValue({ profile_id: 'parsed' });
		const tools = createVCPTools({ tokenParser: parser });
		const tool = findTool(tools, 'vcp_parse_token')!;

		const result = await tool.execute({ token: 'some-token-string' });
		expect(parser).toHaveBeenCalledWith('some-token-string');
		const parsed = JSON.parse(result.content[0].text);
		expect(parsed.parsed.profile_id).toBe('parsed');
		expect(parsed.parser).toBe('js');
	});

	it('prefers wasmParser over tokenParser', async () => {
		const jsParser = vi.fn().mockReturnValue({ from: 'js' });
		const wasmParser = vi.fn().mockReturnValue({ from: 'wasm' });
		const tools = createVCPTools({ tokenParser: jsParser, wasmParser: wasmParser });
		const tool = findTool(tools, 'vcp_parse_token')!;

		const result = await tool.execute({ token: 'test-token' });
		expect(wasmParser).toHaveBeenCalled();
		expect(jsParser).not.toHaveBeenCalled();
		const parsed = JSON.parse(result.content[0].text);
		expect(parsed.parser).toBe('wasm');
	});

	it('returns error for empty token', async () => {
		const tools = createVCPTools({ tokenParser: () => ({}) });
		const tool = findTool(tools, 'vcp_parse_token')!;

		const result = await tool.execute({ token: '' });
		expect(result.content[0].text).toContain('Error');
	});

	it('returns error when parser throws', async () => {
		const parser = vi.fn().mockImplementation(() => {
			throw new Error('parse failed');
		});
		const tools = createVCPTools({ tokenParser: parser });
		const tool = findTool(tools, 'vcp_parse_token')!;

		const result = await tool.execute({ token: 'bad-token' });
		expect(result.content[0].text).toContain('Error');
		expect(result.content[0].text).toContain('parse failed');
	});
});

describe('vcp_transmission_summary execute', () => {
	it('formats summary with transmitted, withheld, and influencing sections', async () => {
		const summary = vi.fn().mockReturnValue({
			transmitted: ['name', 'role'],
			withheld: ['family_status'],
			influencing: ['time_limited']
		});
		const tools = createVCPTools({ transmissionSummary: summary });
		const tool = findTool(tools, 'vcp_transmission_summary')!;

		const result = await tool.execute({ vcp_context: { profile_id: 'test' } });
		const text = result.content[0].text;
		expect(text).toContain('Transmitted');
		expect(text).toContain('name');
		expect(text).toContain('Withheld');
		expect(text).toContain('family_status');
		expect(text).toContain('Influencing');
		expect(text).toContain('time_limited');
	});

	it('returns error when vcp_context is not an object', async () => {
		const tools = createVCPTools({
			transmissionSummary: () => ({ transmitted: [], withheld: [], influencing: [] })
		});
		const tool = findTool(tools, 'vcp_transmission_summary')!;

		const result = await tool.execute({ vcp_context: 42 });
		expect(result.content[0].text).toContain('Error');
	});

	it('handles empty arrays gracefully', async () => {
		const tools = createVCPTools({
			transmissionSummary: () => ({ transmitted: [], withheld: [], influencing: [] })
		});
		const tool = findTool(tools, 'vcp_transmission_summary')!;

		const result = await tool.execute({ vcp_context: {} });
		expect(result.content[0].text).toContain('(none)');
	});
});

describe('vcp_list_personas execute', () => {
	it('returns markdown table with default personas', async () => {
		const tools = createVCPTools({});
		const tool = findTool(tools, 'vcp_list_personas')!;

		const result = await tool.execute({});
		const text = result.content[0].text;
		expect(text).toContain('VCP Personas');
		expect(text).toContain('muse');
		expect(text).toContain('ambassador');
		expect(text).toContain('godparent');
		expect(text).toContain('sentinel');
		expect(text).toContain('anchor');
		expect(text).toContain('nanny');
		expect(text).toContain('steward');
	});

	it('uses custom personas when provided', async () => {
		const tools = createVCPTools({
			personas: [
				{ id: 'custom', name: 'Custom', description: 'A custom persona', use: 'Testing' }
			]
		});
		const tool = findTool(tools, 'vcp_list_personas')!;

		const result = await tool.execute({});
		expect(result.content[0].text).toContain('custom');
		expect(result.content[0].text).toContain('Custom');
		// Should NOT contain default personas
		expect(result.content[0].text).not.toContain('muse');
	});
});

// ============================================
// onToolCall callback
// ============================================

describe('onToolCall callback', () => {
	it('fires when a tool is executed', async () => {
		const callback = vi.fn();
		const tools = createVCPTools({
			onToolCall: callback,
			tokenEncoder: () => 'token'
		});
		const buildTool = findTool(tools, 'vcp_build_token')!;

		await buildTool.execute({ vcp_context: { id: 'test' } });
		expect(callback).toHaveBeenCalledWith('vcp_build_token');
	});

	it('fires for vcp_list_personas', async () => {
		const callback = vi.fn();
		const tools = createVCPTools({ onToolCall: callback });
		const personasTool = findTool(tools, 'vcp_list_personas')!;

		await personasTool.execute({});
		expect(callback).toHaveBeenCalledWith('vcp_list_personas');
	});
});

// ============================================
// Tool annotations
// ============================================

describe('tool annotations', () => {
	it('vcp_build_token is readOnlyHint=true', () => {
		const tools = createVCPTools({ tokenEncoder: () => 'token' });
		const tool = findTool(tools, 'vcp_build_token')!;
		expect(tool.annotations?.readOnlyHint).toBe(true);
	});

	it('vcp_chat is readOnlyHint=false (it makes requests)', () => {
		const tools = createVCPTools({});
		const tool = findTool(tools, 'vcp_chat')!;
		expect(tool.annotations?.readOnlyHint).toBe(false);
	});

	it('vcp_list_personas is idempotentHint=true', () => {
		const tools = createVCPTools({});
		const tool = findTool(tools, 'vcp_list_personas')!;
		expect(tool.annotations?.idempotentHint).toBe(true);
	});
});
