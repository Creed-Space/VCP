// @vitest-environment node
/**
 * SSR / Node environment tests for context.ts
 * Covers isBrowser() === false branches (lines 37, 48)
 */
import { describe, it, expect } from 'vitest';

describe('context SSR (node environment)', () => {
	it('module loads without crashing in node (no window/localStorage)', async () => {
		// createContextStore calls loadFromStorage which hits line 37:
		// if (!isBrowser()) return null
		const context = await import('./context');
		expect(context).toBeDefined();
		expect(context.vcpContext).toBeDefined();
	});

	it('vcpContext store initialises to null in node', async () => {
		const { vcpContext } = await import('./context');
		let value: unknown = 'not-set';
		const unsub = vcpContext.subscribe((v) => {
			value = v;
		});
		expect(value).toBeNull();
		unsub();
	});

	it('vcpContext.set does not throw in node (saveToStorage returns early)', async () => {
		const { vcpContext, createContext } = await import('./context');
		const ctx = createContext({ display_name: 'SSR Test' });
		// saveToStorage hits line 48: if (!isBrowser()) return
		expect(() => vcpContext.set(ctx)).not.toThrow();
	});

	it('vcpContext.clear does not throw in node', async () => {
		const { vcpContext } = await import('./context');
		expect(() => vcpContext.clear()).not.toThrow();
	});

	it('vcpConsents store initialises to empty object in node', async () => {
		const { vcpConsents } = await import('./context');
		let value: unknown = 'not-set';
		const unsub = vcpConsents.subscribe((v) => {
			value = v;
		});
		expect(value).toEqual({});
		unsub();
	});
});
