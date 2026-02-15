// @vitest-environment node
/**
 * SSR / Node environment tests for audit.ts
 * Covers isBrowser() === false branches (lines 20, 30)
 * and nullish-coalescing fallbacks in getStakeholderView (lines 210, 227)
 */
import { describe, it, expect } from 'vitest';
import type { AuditEntry, StakeholderAuditEntry } from './types';

describe('audit SSR (node environment)', () => {
	it('module loads without crashing in node (no window/localStorage)', async () => {
		// loadAuditFromStorage hits line 20: if (!isBrowser()) return []
		// saveAuditToStorage hits line 30: if (!isBrowser()) return
		// The module-level createAuditStore() calls loadAuditFromStorage on import
		const audit = await import('./audit');
		expect(audit).toBeDefined();
		expect(audit.auditTrail).toBeDefined();
	});

	it('auditTrail store initialises to empty array in node', async () => {
		const { auditTrail } = await import('./audit');
		let value: AuditEntry[] = [];
		const unsub = auditTrail.subscribe((v) => {
			value = v;
		});
		expect(value).toEqual([]);
		unsub();
	});

	it('logAuditEntry does not throw in node', async () => {
		const { logAuditEntry } = await import('./audit');
		const entry: AuditEntry = {
			id: 'test-1',
			timestamp: new Date().toISOString(),
			event_type: 'context_shared',
			platform_id: 'test-platform',
			data_shared: ['a'],
			data_withheld: ['b'],
			private_fields_influenced: 1,
			private_fields_exposed: 0
		};
		expect(() => logAuditEntry(entry)).not.toThrow();
	});
});

describe('getStakeholderView nullish-coalescing fallbacks', () => {
	it('handles entry with undefined private_fields_influenced (line 210)', async () => {
		const { getStakeholderView } = await import('./audit');
		const entry = {
			id: 'test-2',
			timestamp: new Date().toISOString(),
			event_type: 'context_shared' as const,
			platform_id: 'test',
			data_shared: [],
			data_withheld: [],
			private_fields_exposed: 0
			// private_fields_influenced intentionally omitted → undefined → ?? 0
		} as AuditEntry;

		const result = getStakeholderView([entry], 'hr');
		expect(result).toHaveLength(1);
		expect(result[0].private_context_used).toBe(false);
	});

	it('handles entry with undefined details for manager view (line 227)', async () => {
		const { getStakeholderView } = await import('./audit');
		const entry: AuditEntry = {
			id: 'test-3',
			timestamp: new Date().toISOString(),
			event_type: 'context_shared',
			platform_id: 'test',
			data_shared: [],
			data_withheld: [],
			private_fields_influenced: 0,
			private_fields_exposed: 0
			// details intentionally omitted → undefined → budget_compliant ?? true
		};

		const result = getStakeholderView([entry], 'manager');
		expect(result).toHaveLength(1);
		expect(result[0].compliance_status?.budget_compliant).toBe(true);
	});

	it('handles entry with details but no budget_compliant for hr view', async () => {
		const { getStakeholderView } = await import('./audit');
		const entry: AuditEntry = {
			id: 'test-4',
			timestamp: new Date().toISOString(),
			event_type: 'context_shared',
			platform_id: 'test',
			data_shared: [],
			data_withheld: [],
			private_fields_influenced: 1,
			private_fields_exposed: 0,
			details: { some_other_field: true }
			// budget_compliant and mandatory_addressed not in details → ?? true
		};

		const result = getStakeholderView([entry], 'hr');
		expect(result).toHaveLength(1);
		expect(result[0].private_context_used).toBe(true);
		expect(result[0].compliance_status?.budget_compliant).toBe(true);
		expect(result[0].compliance_status?.mandatory_addressed).toBe(true);
	});
});
