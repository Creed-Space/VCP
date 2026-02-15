import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	auditTrail,
	logAuditEntry,
	logContextShared,
	logRecommendation,
	logAdjustment,
	todayAudit,
	auditedPlatforms,
	getStakeholderView,
	getFullView,
	getComparisonView,
	getAuditSummary
} from './audit';
import type { AuditEntry, StakeholderType } from './types';

// ============================================
// Helpers
// ============================================

function makeEntry(overrides: Partial<AuditEntry> = {}): AuditEntry {
	return {
		id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
		timestamp: new Date().toISOString(),
		event_type: 'context_shared',
		platform_id: 'test-platform',
		data_shared: ['display_name'],
		data_withheld: [],
		private_fields_influenced: 0,
		private_fields_exposed: 0,
		...overrides
	};
}

function makeTodayEntry(overrides: Partial<AuditEntry> = {}): AuditEntry {
	return makeEntry({
		timestamp: new Date().toISOString(),
		...overrides
	});
}

function makeYesterdayEntry(overrides: Partial<AuditEntry> = {}): AuditEntry {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return makeEntry({
		timestamp: yesterday.toISOString(),
		...overrides
	});
}

// ============================================
// Tests
// ============================================

describe('auditTrail store', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('starts empty when localStorage has no audit data', () => {
		expect(get(auditTrail)).toEqual([]);
	});

	it('clear empties the trail', () => {
		logAuditEntry(makeEntry());
		auditTrail.clear();
		expect(get(auditTrail)).toEqual([]);
	});

	it('getByPlatform filters by platform_id', () => {
		logAuditEntry(makeEntry({ platform_id: 'alpha' }));
		logAuditEntry(makeEntry({ platform_id: 'beta' }));
		logAuditEntry(makeEntry({ platform_id: 'alpha' }));
		const results = auditTrail.getByPlatform('alpha');
		expect(results).toHaveLength(2);
		for (const e of results) {
			expect(e.platform_id).toBe('alpha');
		}
	});

	it('getByPlatform returns empty for unknown platform', () => {
		logAuditEntry(makeEntry({ platform_id: 'alpha' }));
		expect(auditTrail.getByPlatform('nonexistent')).toEqual([]);
	});

	it('getByEventType filters by event_type', () => {
		logAuditEntry(makeEntry({ event_type: 'context_shared' }));
		logAuditEntry(makeEntry({ event_type: 'consent_granted' }));
		logAuditEntry(makeEntry({ event_type: 'context_shared' }));
		const results = auditTrail.getByEventType('context_shared');
		expect(results).toHaveLength(2);
		for (const e of results) {
			expect(e.event_type).toBe('context_shared');
		}
	});

	it('getByEventType returns empty for unmatched type', () => {
		logAuditEntry(makeEntry({ event_type: 'context_shared' }));
		expect(auditTrail.getByEventType('skip_requested')).toEqual([]);
	});

	it('getToday returns only entries from today', () => {
		logAuditEntry(makeTodayEntry({ id: 'today-1' }));
		logAuditEntry(makeYesterdayEntry({ id: 'yesterday-1' }));
		const results = auditTrail.getToday();
		expect(results).toHaveLength(1);
		expect(results[0].id).toBe('today-1');
	});

	it('getToday returns empty when all entries are old', () => {
		logAuditEntry(makeYesterdayEntry());
		expect(auditTrail.getToday()).toEqual([]);
	});
});

describe('logAuditEntry', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('adds an entry to the audit trail', () => {
		const entry = makeEntry({ id: 'entry-1' });
		logAuditEntry(entry);
		const trail = get(auditTrail);
		expect(trail).toHaveLength(1);
		expect(trail[0].id).toBe('entry-1');
	});

	it('appends to existing entries', () => {
		logAuditEntry(makeEntry({ id: 'first' }));
		logAuditEntry(makeEntry({ id: 'second' }));
		const trail = get(auditTrail);
		expect(trail).toHaveLength(2);
		expect(trail[0].id).toBe('first');
		expect(trail[1].id).toBe('second');
	});

	it('preserves entry timestamp', () => {
		const entry = makeEntry({ timestamp: '2026-01-15T12:00:00Z' });
		logAuditEntry(entry);
		expect(get(auditTrail)[0].timestamp).toBe('2026-01-15T12:00:00Z');
	});

	it('persists entries to localStorage', () => {
		logAuditEntry(makeEntry({ id: 'persisted' }));
		const stored = localStorage.getItem('vcp_audit_trail');
		expect(stored).not.toBeNull();
		const parsed = JSON.parse(stored!);
		expect(parsed).toHaveLength(1);
		expect(parsed[0].id).toBe('persisted');
	});
});

describe('logContextShared', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('creates a context_shared entry', () => {
		const entry = logContextShared('platform-1', ['name', 'goal'], ['email'], 2);
		expect(entry.event_type).toBe('context_shared');
		expect(entry.platform_id).toBe('platform-1');
	});

	it('records shared and withheld fields', () => {
		const entry = logContextShared('p1', ['name'], ['secret'], 1);
		expect(entry.data_shared).toEqual(['name']);
		expect(entry.data_withheld).toEqual(['secret']);
	});

	it('records private_fields_influenced', () => {
		const entry = logContextShared('p1', [], [], 3);
		expect(entry.private_fields_influenced).toBe(3);
	});

	it('always sets private_fields_exposed to 0', () => {
		const entry = logContextShared('p1', ['a'], ['b'], 5);
		expect(entry.private_fields_exposed).toBe(0);
	});

	it('adds the entry to the audit trail', () => {
		logContextShared('p1', ['name'], [], 0);
		expect(get(auditTrail)).toHaveLength(1);
	});

	it('generates a unique id starting with share-', () => {
		const entry = logContextShared('p1', [], [], 0);
		expect(entry.id).toMatch(/^share-/);
	});

	it('sets a valid ISO timestamp', () => {
		const entry = logContextShared('p1', [], [], 0);
		expect(() => new Date(entry.timestamp)).not.toThrow();
		expect(new Date(entry.timestamp).toISOString()).toBe(entry.timestamp);
	});
});

describe('logRecommendation', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('creates a recommendation_generated entry', () => {
		const entry = logRecommendation('p1', ['goal'], ['private_field']);
		expect(entry.event_type).toBe('recommendation_generated');
		expect(entry.platform_id).toBe('p1');
	});

	it('records context used and withheld', () => {
		const entry = logRecommendation('p1', ['goal', 'pace'], ['health']);
		expect(entry.data_shared).toEqual(['goal', 'pace']);
		expect(entry.data_withheld).toEqual(['health']);
	});

	it('sets private_fields_influenced to 1 when context is withheld', () => {
		const entry = logRecommendation('p1', [], ['something']);
		expect(entry.private_fields_influenced).toBe(1);
	});

	it('sets private_fields_influenced to 0 when nothing is withheld', () => {
		const entry = logRecommendation('p1', ['goal'], []);
		expect(entry.private_fields_influenced).toBe(0);
	});

	it('always sets private_fields_exposed to 0', () => {
		const entry = logRecommendation('p1', [], ['secret']);
		expect(entry.private_fields_exposed).toBe(0);
	});

	it('includes optional details', () => {
		const entry = logRecommendation('p1', [], [], { course_id: 'c1' });
		expect(entry.details?.course_id).toBe('c1');
	});

	it('generates a unique id starting with rec-', () => {
		const entry = logRecommendation('p1', [], []);
		expect(entry.id).toMatch(/^rec-/);
	});
});

describe('logAdjustment', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('creates an adjustment_recorded entry', () => {
		const entry = logAdjustment('p1', 'Schedule conflict', { reason: 'migraine' });
		expect(entry.event_type).toBe('adjustment_recorded');
		expect(entry.platform_id).toBe('p1');
	});

	it('records adjustment_count and adjustment_date as shared fields', () => {
		const entry = logAdjustment('p1', 'reason', {});
		expect(entry.data_shared).toEqual(['adjustment_count', 'adjustment_date']);
	});

	it('withholds private detail keys', () => {
		const entry = logAdjustment('p1', 'reason', { migraine: true, fatigue: 0.8 });
		expect(entry.data_withheld).toContain('migraine');
		expect(entry.data_withheld).toContain('fatigue');
	});

	it('sets private_fields_influenced to 1', () => {
		const entry = logAdjustment('p1', 'reason', {});
		expect(entry.private_fields_influenced).toBe(1);
	});

	it('always sets private_fields_exposed to 0', () => {
		const entry = logAdjustment('p1', 'reason', { secret: true });
		expect(entry.private_fields_exposed).toBe(0);
	});

	it('stores public_summary in details', () => {
		const entry = logAdjustment('p1', 'Schedule conflict', {});
		expect(entry.details?.public_summary).toBe('Schedule conflict');
	});

	it('stores private details under _private in details', () => {
		const entry = logAdjustment('p1', 'reason', { migraine: true });
		const priv = entry.details?._private as Record<string, unknown>;
		expect(priv.migraine).toBe(true);
	});

	it('generates a unique id starting with adj-', () => {
		const entry = logAdjustment('p1', 'reason', {});
		expect(entry.id).toMatch(/^adj-/);
	});
});

describe('todayAudit derived store', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('returns empty when trail is empty', () => {
		expect(get(todayAudit)).toEqual([]);
	});

	it('returns only entries from today', () => {
		logAuditEntry(makeTodayEntry({ id: 'today' }));
		logAuditEntry(makeYesterdayEntry({ id: 'yesterday' }));
		const today = get(todayAudit);
		expect(today).toHaveLength(1);
		expect(today[0].id).toBe('today');
	});

	it('returns all entries when all are from today', () => {
		logAuditEntry(makeTodayEntry({ id: 't1' }));
		logAuditEntry(makeTodayEntry({ id: 't2' }));
		expect(get(todayAudit)).toHaveLength(2);
	});
});

describe('auditedPlatforms derived store', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('returns empty when trail is empty', () => {
		expect(get(auditedPlatforms)).toEqual([]);
	});

	it('returns unique platform ids', () => {
		logAuditEntry(makeEntry({ platform_id: 'alpha' }));
		logAuditEntry(makeEntry({ platform_id: 'beta' }));
		logAuditEntry(makeEntry({ platform_id: 'alpha' }));
		const platforms = get(auditedPlatforms);
		expect(platforms).toHaveLength(2);
		expect(platforms).toContain('alpha');
		expect(platforms).toContain('beta');
	});

	it('excludes entries with undefined platform_id', () => {
		logAuditEntry(makeEntry({ platform_id: undefined }));
		logAuditEntry(makeEntry({ platform_id: 'alpha' }));
		const platforms = get(auditedPlatforms);
		expect(platforms).toEqual(['alpha']);
	});
});

describe('getStakeholderView', () => {
	it('returns empty array for empty entries', () => {
		expect(getStakeholderView([], 'hr')).toEqual([]);
	});

	it('strips private information from entries', () => {
		const entries: AuditEntry[] = [
			makeEntry({
				data_shared: ['name', 'goal'],
				data_withheld: ['health'],
				private_fields_influenced: 2,
				details: { _private: { migraine: true } }
			})
		];
		const view = getStakeholderView(entries, 'hr');
		expect(view).toHaveLength(1);
		const entry = view[0];
		// Should not have data_shared, data_withheld, or private details
		expect((entry as Record<string, unknown>).data_shared).toBeUndefined();
		expect((entry as Record<string, unknown>).data_withheld).toBeUndefined();
		expect((entry as Record<string, unknown>).details).toBeUndefined();
	});

	it('preserves timestamp and event_type', () => {
		const entries = [makeEntry({ timestamp: '2026-01-15T12:00:00Z', event_type: 'context_shared' })];
		const view = getStakeholderView(entries, 'manager');
		expect(view[0].timestamp).toBe('2026-01-15T12:00:00Z');
		expect(view[0].event_type).toBe('context_shared');
	});

	it('sets private_context_used based on private_fields_influenced > 0', () => {
		const entries = [
			makeEntry({ private_fields_influenced: 0 }),
			makeEntry({ private_fields_influenced: 3 })
		];
		const view = getStakeholderView(entries, 'hr');
		expect(view[0].private_context_used).toBe(false);
		expect(view[1].private_context_used).toBe(true);
	});

	it('always sets private_context_exposed to false', () => {
		const entries = [makeEntry({ private_fields_exposed: 0 })];
		const view = getStakeholderView(entries, 'hr');
		expect(view[0].private_context_exposed).toBe(false);
	});

	describe('HR stakeholder', () => {
		it('includes compliance_status with policy_followed, budget_compliant, mandatory_addressed', () => {
			const entries = [makeEntry()];
			const view = getStakeholderView(entries, 'hr');
			expect(view[0].compliance_status).toBeDefined();
			expect(view[0].compliance_status?.policy_followed).toBe(true);
			expect(view[0].compliance_status?.budget_compliant).toBe(true);
			expect(view[0].compliance_status?.mandatory_addressed).toBe(true);
		});

		it('reads budget_compliant from entry details when present', () => {
			const entries = [makeEntry({ details: { budget_compliant: false } })];
			const view = getStakeholderView(entries, 'hr');
			expect(view[0].compliance_status?.budget_compliant).toBe(false);
		});
	});

	describe('manager stakeholder', () => {
		it('includes compliance_status without mandatory_addressed', () => {
			const entries = [makeEntry()];
			const view = getStakeholderView(entries, 'manager');
			expect(view[0].compliance_status).toBeDefined();
			expect(view[0].compliance_status?.policy_followed).toBe(true);
			expect(view[0].compliance_status?.mandatory_addressed).toBeUndefined();
		});
	});

	describe('community stakeholder', () => {
		it('does not include compliance_status', () => {
			const entries = [makeEntry()];
			const view = getStakeholderView(entries, 'community');
			expect(view[0].compliance_status).toBeUndefined();
		});

		it('includes progress_summary when available in details', () => {
			const entries = [makeEntry({ details: { progress_summary: '5 days completed' } })];
			const view = getStakeholderView(entries, 'community');
			expect(view[0].progress_summary).toBe('5 days completed');
		});

		it('has undefined progress_summary when not in details', () => {
			const entries = [makeEntry()];
			const view = getStakeholderView(entries, 'community');
			expect(view[0].progress_summary).toBeUndefined();
		});
	});

	describe('coach stakeholder', () => {
		it('includes progress_summary when available', () => {
			const entries = [makeEntry({ details: { progress_summary: 'On track' } })];
			const view = getStakeholderView(entries, 'coach');
			expect(view[0].progress_summary).toBe('On track');
		});

		it('does not include compliance_status', () => {
			const entries = [makeEntry()];
			const view = getStakeholderView(entries, 'coach');
			expect(view[0].compliance_status).toBeUndefined();
		});
	});

	describe('employee stakeholder', () => {
		it('returns entries without compliance or progress extras', () => {
			const entries = [makeEntry()];
			const view = getStakeholderView(entries, 'employee');
			expect(view[0].compliance_status).toBeUndefined();
			expect(view[0].progress_summary).toBeUndefined();
		});
	});
});

describe('getFullView', () => {
	it('returns the same entries array', () => {
		const entries = [makeEntry({ id: 'a' }), makeEntry({ id: 'b' })];
		const view = getFullView(entries);
		expect(view).toBe(entries);
		expect(view).toHaveLength(2);
	});

	it('returns empty array for empty input', () => {
		expect(getFullView([])).toEqual([]);
	});

	it('preserves all fields including private details', () => {
		const entries = [
			makeEntry({
				data_shared: ['name'],
				data_withheld: ['health'],
				details: { _private: { migraine: true } }
			})
		];
		const view = getFullView(entries);
		expect(view[0].data_shared).toEqual(['name']);
		expect(view[0].data_withheld).toEqual(['health']);
		expect(view[0].details?._private).toEqual({ migraine: true });
	});
});

describe('getComparisonView', () => {
	it('returns both userView and stakeholderView', () => {
		const entries = [makeEntry()];
		const comparison = getComparisonView(entries, 'hr');
		expect(comparison.userView).toBeDefined();
		expect(comparison.stakeholderView).toBeDefined();
	});

	it('userView contains full entries', () => {
		const entries = [makeEntry({ id: 'full-entry', data_shared: ['name'] })];
		const comparison = getComparisonView(entries, 'hr');
		expect(comparison.userView[0].id).toBe('full-entry');
		expect(comparison.userView[0].data_shared).toEqual(['name']);
	});

	it('stakeholderView strips private data', () => {
		const entries = [
			makeEntry({
				data_shared: ['name'],
				data_withheld: ['health'],
				private_fields_influenced: 1
			})
		];
		const comparison = getComparisonView(entries, 'hr');
		expect((comparison.stakeholderView[0] as Record<string, unknown>).data_shared).toBeUndefined();
		expect(comparison.stakeholderView[0].private_context_used).toBe(true);
		expect(comparison.stakeholderView[0].private_context_exposed).toBe(false);
	});

	it('both views have the same number of entries', () => {
		const entries = [makeEntry(), makeEntry(), makeEntry()];
		const comparison = getComparisonView(entries, 'manager');
		expect(comparison.userView).toHaveLength(3);
		expect(comparison.stakeholderView).toHaveLength(3);
	});

	it('works with empty entries', () => {
		const comparison = getComparisonView([], 'community');
		expect(comparison.userView).toEqual([]);
		expect(comparison.stakeholderView).toEqual([]);
	});

	it('works for each stakeholder type', () => {
		const entries = [makeEntry()];
		const types: StakeholderType[] = ['hr', 'manager', 'community', 'employee', 'coach'];
		for (const t of types) {
			const comparison = getComparisonView(entries, t);
			expect(comparison.userView).toHaveLength(1);
			expect(comparison.stakeholderView).toHaveLength(1);
		}
	});
});

describe('getAuditSummary', () => {
	it('returns zeros for empty entries', () => {
		const summary = getAuditSummary([]);
		expect(summary.totalEvents).toBe(0);
		expect(summary.platformsAccessed).toEqual([]);
		expect(summary.fieldsSharedCount).toBe(0);
		expect(summary.fieldsWithheldCount).toBe(0);
		expect(summary.privateInfluencedCount).toBe(0);
		expect(summary.privateExposedCount).toBe(0);
	});

	it('counts total events', () => {
		const entries = [makeEntry(), makeEntry(), makeEntry()];
		const summary = getAuditSummary(entries);
		expect(summary.totalEvents).toBe(3);
	});

	it('counts events by type', () => {
		const entries = [
			makeEntry({ event_type: 'context_shared' }),
			makeEntry({ event_type: 'context_shared' }),
			makeEntry({ event_type: 'consent_granted' })
		];
		const summary = getAuditSummary(entries);
		expect(summary.eventsByType.context_shared).toBe(2);
		expect(summary.eventsByType.consent_granted).toBe(1);
	});

	it('collects unique platforms accessed', () => {
		const entries = [
			makeEntry({ platform_id: 'a' }),
			makeEntry({ platform_id: 'b' }),
			makeEntry({ platform_id: 'a' })
		];
		const summary = getAuditSummary(entries);
		expect(summary.platformsAccessed).toHaveLength(2);
		expect(summary.platformsAccessed).toContain('a');
		expect(summary.platformsAccessed).toContain('b');
	});

	it('sums fields shared across entries', () => {
		const entries = [
			makeEntry({ data_shared: ['name', 'goal'] }),
			makeEntry({ data_shared: ['experience'] })
		];
		const summary = getAuditSummary(entries);
		expect(summary.fieldsSharedCount).toBe(3);
	});

	it('sums fields withheld across entries', () => {
		const entries = [
			makeEntry({ data_withheld: ['health'] }),
			makeEntry({ data_withheld: ['finance', 'location'] })
		];
		const summary = getAuditSummary(entries);
		expect(summary.fieldsWithheldCount).toBe(3);
	});

	it('sums private fields influenced', () => {
		const entries = [
			makeEntry({ private_fields_influenced: 2 }),
			makeEntry({ private_fields_influenced: 1 })
		];
		const summary = getAuditSummary(entries);
		expect(summary.privateInfluencedCount).toBe(3);
	});

	it('privateExposedCount is always 0 by design', () => {
		const entries = [
			makeEntry({ private_fields_exposed: 0 }),
			makeEntry({ private_fields_exposed: 0 })
		];
		const summary = getAuditSummary(entries);
		expect(summary.privateExposedCount).toBe(0);
	});

	it('handles entries with undefined optional fields', () => {
		const entry: AuditEntry = {
			id: 'minimal',
			timestamp: new Date().toISOString(),
			event_type: 'context_shared'
		};
		const summary = getAuditSummary([entry]);
		expect(summary.totalEvents).toBe(1);
		expect(summary.fieldsSharedCount).toBe(0);
		expect(summary.fieldsWithheldCount).toBe(0);
		expect(summary.privateInfluencedCount).toBe(0);
		expect(summary.privateExposedCount).toBe(0);
	});

	it('excludes undefined platform_id from platformsAccessed', () => {
		const entries = [
			makeEntry({ platform_id: undefined }),
			makeEntry({ platform_id: 'alpha' })
		];
		const summary = getAuditSummary(entries);
		expect(summary.platformsAccessed).toEqual(['alpha']);
	});
});

// ============================================
// auditTrail.set method
// ============================================

describe('auditTrail set method', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('replaces the entire trail and persists to localStorage', () => {
		const entry1 = makeEntry({ id: 'set-1', platform_id: 'alpha' });
		const entry2 = makeEntry({ id: 'set-2', platform_id: 'beta' });
		auditTrail.set([entry1, entry2]);
		const trail = get(auditTrail);
		expect(trail).toHaveLength(2);
		expect(trail[0].id).toBe('set-1');
		expect(trail[1].id).toBe('set-2');
		// Verify localStorage persistence
		const stored = localStorage.getItem('vcp_audit_trail');
		expect(stored).not.toBeNull();
		const parsed = JSON.parse(stored!);
		expect(parsed).toHaveLength(2);
		expect(parsed[0].id).toBe('set-1');
	});
});

// ============================================
// loadAuditFromStorage error handling
// ============================================

describe('loadAuditFromStorage error handling', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('returns empty array when localStorage has invalid JSON', () => {
		// Seed localStorage with invalid JSON before the store reads it
		localStorage.setItem('vcp_audit_trail', '{not valid json!!!');
		// The store was already created, but we can test getToday/getByPlatform
		// which read from the current store state (initialized at module load).
		// To truly test loadAuditFromStorage, we verify the store handles gracefully
		// by checking that operations on the store still work after bad data.
		auditTrail.clear();
		expect(get(auditTrail)).toEqual([]);
		// Confirm we can still add entries after corrupt localStorage
		logAuditEntry(makeEntry({ id: 'after-corrupt' }));
		expect(get(auditTrail)).toHaveLength(1);
		expect(get(auditTrail)[0].id).toBe('after-corrupt');
	});
});

describe('saveAuditToStorage error handling', () => {
	beforeEach(() => {
		auditTrail.clear();
		localStorage.clear();
	});

	it('handles localStorage.setItem throwing via logAuditEntry', () => {
		const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('QuotaExceededError');
		});
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			expect(() => logAuditEntry(makeEntry({ id: 'fail-save' }))).not.toThrow();
			expect(get(auditTrail).some((e) => e.id === 'fail-save')).toBe(true);
			expect(warnSpy).toHaveBeenCalledWith('Failed to save audit trail to localStorage');
		} finally {
			spy.mockRestore();
			warnSpy.mockRestore();
		}
	});

	it('handles localStorage.setItem throwing via store set', () => {
		const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('QuotaExceededError');
		});
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			expect(() => auditTrail.set([makeEntry({ id: 'set-fail' })])).not.toThrow();
		} finally {
			spy.mockRestore();
			warnSpy.mockRestore();
		}
	});
});

describe('loadAuditFromStorage error handling (module re-init)', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('recovers gracefully from corrupt JSON in localStorage', async () => {
		localStorage.setItem('vcp_audit_trail', '!!!not-valid-json!!!');
		const auditMod = await import('./audit');
		const storeMod = await import('svelte/store');
		// Module loaded despite corrupt data - catch returned []
		expect(storeMod.get(auditMod.auditTrail)).toEqual([]);
		localStorage.removeItem('vcp_audit_trail');
	});

	it('recovers gracefully when localStorage.getItem throws', async () => {
		const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('SecurityError');
		});
		try {
			const auditMod = await import('./audit');
			const storeMod = await import('svelte/store');
			expect(storeMod.get(auditMod.auditTrail)).toEqual([]);
		} finally {
			spy.mockRestore();
		}
	});
});
