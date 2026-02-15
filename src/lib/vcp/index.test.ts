import { describe, it, expect } from 'vitest';

/**
 * Index barrel export coverage test.
 * Importing from the barrel file exercises all re-export statements.
 */
describe('VCP index barrel exports', () => {
	it('re-exports context functions', async () => {
		const mod = await import('./index');
		expect(mod.vcpContext).toBeDefined();
		expect(mod.filterContextForPlatform).toBeTypeOf('function');
		expect(mod.createContext).toBeTypeOf('function');
		expect(mod.mergeContext).toBeTypeOf('function');
		expect(mod.getSharePreview).toBeTypeOf('function');
	});

	it('re-exports constitution functions', async () => {
		const mod = await import('./index');
		expect(mod.loadConstitution).toBeTypeOf('function');
		expect(mod.getAllConstitutions).toBeTypeOf('function');
		expect(mod.resolveRules).toBeTypeOf('function');
		expect(mod.getPersonaTone).toBeTypeOf('function');
	});

	it('re-exports audit functions', async () => {
		const mod = await import('./index');
		expect(mod.auditTrail).toBeDefined();
		expect(mod.logAuditEntry).toBeTypeOf('function');
		expect(mod.logContextShared).toBeTypeOf('function');
		expect(mod.getAuditSummary).toBeTypeOf('function');
	});

	it('re-exports privacy functions', async () => {
		const mod = await import('./index');
		expect(mod.PUBLIC_FIELDS).toBeDefined();
		expect(mod.isPrivateField).toBeTypeOf('function');
		expect(mod.getFieldPrivacyLevel).toBeTypeOf('function');
		expect(mod.generatePrivacySummary).toBeTypeOf('function');
	});

	it('re-exports transition detection', async () => {
		const mod = await import('./index');
		expect(mod.detectTransition).toBeTypeOf('function');
	});

	it('re-exports natural language parser', async () => {
		const mod = await import('./index');
		expect(mod.parsePersonalStateFromText).toBeTypeOf('function');
		expect(mod.applyParsedSignals).toBeTypeOf('function');
	});
});
