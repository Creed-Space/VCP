import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	vcpContext,
	publicContext,
	influenceFlags,
	vcpConsents,
	filterContextForPlatform,
	getSharePreview,
	createContext,
	mergeContext,
	refreshEngagementDecay
} from './context';
import type { VCPContext, PlatformManifest, ConsentRecord } from './types';

// ============================================
// Helpers
// ============================================

function makeContext(overrides: Partial<VCPContext> = {}): VCPContext {
	return {
		vcp_version: '1.0.0',
		profile_id: 'test-user-1',
		created: '2026-01-15T12:00:00Z',
		updated: '2026-01-15T12:00:00Z',
		constitution: {
			id: 'personal.growth.creative',
			version: '1.0.0',
			persona: 'muse',
			adherence: 3,
			scopes: ['creativity', 'health', 'privacy']
		},
		public_profile: {
			display_name: 'Test User',
			goal: 'Learn guitar',
			experience: 'beginner'
		},
		portable_preferences: {},
		constraints: {},
		sharing_settings: {},
		...overrides
	};
}

function makeManifest(overrides: Partial<PlatformManifest> = {}): PlatformManifest {
	return {
		platform_id: 'test-platform',
		platform_name: 'Test Platform',
		platform_type: 'learning',
		version: '1.0.0',
		context_requirements: {
			required: ['learning_style', 'pace'],
			optional: ['noise_mode', 'session_length']
		},
		capabilities: ['lessons', 'progress'],
		...overrides
	};
}

function makeConsent(overrides: Partial<ConsentRecord> = {}): ConsentRecord {
	return {
		platform_id: 'test-platform',
		granted_at: '2026-01-15T12:00:00Z',
		required_fields: ['learning_style', 'pace'],
		optional_fields: ['noise_mode'],
		...overrides
	};
}

// ============================================
// Tests
// ============================================

describe('createContext', () => {
	it('returns a VCPContext with vcp_version 1.0.0', () => {
		const ctx = createContext({ display_name: 'Alice' });
		expect(ctx.vcp_version).toBe('1.0.0');
	});

	it('generates a profile_id when none is given', () => {
		const ctx = createContext({});
		expect(ctx.profile_id).toMatch(/^user-\d+$/);
	});

	it('uses the provided profileId', () => {
		const ctx = createContext({}, 'custom-id-42');
		expect(ctx.profile_id).toBe('custom-id-42');
	});

	it('sets created and updated timestamps', () => {
		const ctx = createContext({});
		expect(ctx.created).toBeDefined();
		expect(ctx.updated).toBeDefined();
		expect(ctx.created).toBe(ctx.updated);
	});

	it('populates the public_profile from the provided partial', () => {
		const ctx = createContext({
			display_name: 'Bob',
			goal: 'Compose music',
			experience: 'intermediate'
		});
		expect(ctx.public_profile.display_name).toBe('Bob');
		expect(ctx.public_profile.goal).toBe('Compose music');
		expect(ctx.public_profile.experience).toBe('intermediate');
	});

	it('sets default constitution fields', () => {
		const ctx = createContext({});
		expect(ctx.constitution.id).toBe('personal.growth.creative');
		expect(ctx.constitution.version).toBe('1.0.0');
		expect(ctx.constitution.persona).toBe('muse');
		expect(ctx.constitution.adherence).toBe(3);
		expect(ctx.constitution.scopes).toEqual(['creativity', 'health', 'privacy']);
	});

	it('initializes portable_preferences as empty object', () => {
		const ctx = createContext({});
		expect(ctx.portable_preferences).toEqual({});
	});

	it('initializes constraints as empty object', () => {
		const ctx = createContext({});
		expect(ctx.constraints).toEqual({});
	});

	it('initializes sharing_settings as empty object', () => {
		const ctx = createContext({});
		expect(ctx.sharing_settings).toEqual({});
	});
});

describe('mergeContext', () => {
	it('returns a new VCPContext with merged values', () => {
		const existing = makeContext();
		const merged = mergeContext(existing, { vcp_version: '2.0.0' });
		expect(merged.vcp_version).toBe('2.0.0');
	});

	it('preserves existing fields not present in updates', () => {
		const existing = makeContext({ profile_id: 'keep-me' });
		const merged = mergeContext(existing, {});
		expect(merged.profile_id).toBe('keep-me');
	});

	it('deep-merges public_profile so existing fields are preserved', () => {
		const existing = makeContext({
			public_profile: {
				display_name: 'Alice',
				goal: 'Learn piano',
				experience: 'beginner'
			}
		});
		const merged = mergeContext(existing, {
			public_profile: { goal: 'Learn guitar' }
		});
		expect(merged.public_profile.display_name).toBe('Alice');
		expect(merged.public_profile.goal).toBe('Learn guitar');
		expect(merged.public_profile.experience).toBe('beginner');
	});

	it('deep-merges portable_preferences', () => {
		const existing = makeContext({
			portable_preferences: { noise_mode: 'quiet_preferred' }
		});
		const merged = mergeContext(existing, {
			portable_preferences: { session_length: '30_minutes' }
		});
		expect(merged.portable_preferences?.noise_mode).toBe('quiet_preferred');
		expect(merged.portable_preferences?.session_length).toBe('30_minutes');
	});

	it('deep-merges constraints', () => {
		const existing = makeContext({ constraints: { time_limited: true } });
		const merged = mergeContext(existing, {
			constraints: { budget_limited: true }
		});
		expect(merged.constraints?.time_limited).toBe(true);
		expect(merged.constraints?.budget_limited).toBe(true);
	});

	it('later values override earlier ones in public_profile', () => {
		const existing = makeContext({
			public_profile: { display_name: 'Old' }
		});
		const merged = mergeContext(existing, {
			public_profile: { display_name: 'New' }
		});
		expect(merged.public_profile.display_name).toBe('New');
	});

	it('updates the updated timestamp', () => {
		const existing = makeContext({ updated: '2020-01-01T00:00:00Z' });
		const merged = mergeContext(existing, {});
		expect(merged.updated).not.toBe('2020-01-01T00:00:00Z');
	});
});

describe('filterContextForPlatform', () => {
	it('always includes display_name, goal, experience in public', () => {
		const ctx = makeContext();
		const manifest = makeManifest();
		const consent = makeConsent();
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect(filtered.public.display_name).toBe('Test User');
		expect(filtered.public.goal).toBe('Learn guitar');
		expect(filtered.public.experience).toBe('beginner');
	});

	it('includes required fields that are consented and have values', () => {
		const ctx = makeContext({
			public_profile: {
				display_name: 'Test User',
				goal: 'Learn guitar',
				experience: 'beginner',
				learning_style: 'visual',
				pace: 'steady'
			}
		});
		const manifest = makeManifest();
		const consent = makeConsent({ required_fields: ['learning_style', 'pace'] });
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect((filtered.preferences as Record<string, unknown>).learning_style).toBe('visual');
		expect((filtered.preferences as Record<string, unknown>).pace).toBe('steady');
	});

	it('withholds required fields not in consent', () => {
		const ctx = makeContext({
			public_profile: {
				display_name: 'Test',
				goal: 'goal',
				experience: 'beginner',
				learning_style: 'visual',
				pace: 'steady'
			}
		});
		const manifest = makeManifest();
		const consent = makeConsent({ required_fields: [] });
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect((filtered.preferences as Record<string, unknown>).learning_style).toBeUndefined();
		expect((filtered.preferences as Record<string, unknown>).pace).toBeUndefined();
	});

	it('includes optional fields that are consented', () => {
		const ctx = makeContext({
			portable_preferences: { noise_mode: 'quiet_preferred' }
		});
		const manifest = makeManifest();
		const consent = makeConsent({ optional_fields: ['noise_mode'] });
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect((filtered.preferences as Record<string, unknown>).noise_mode).toBe('quiet_preferred');
	});

	it('withholds optional fields not in consent', () => {
		const ctx = makeContext({
			portable_preferences: { noise_mode: 'quiet_preferred', session_length: '30_minutes' }
		});
		const manifest = makeManifest();
		const consent = makeConsent({ optional_fields: [] });
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect((filtered.preferences as Record<string, unknown>).session_length).toBeUndefined();
	});

	it('never exposes private_context fields directly', () => {
		const ctx = makeContext({
			private_context: {
				health_conditions: 'migraine',
				financial_constraint: true
			}
		});
		const manifest = makeManifest();
		const consent = makeConsent();
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect((filtered as Record<string, unknown>).private_context).toBeUndefined();
	});

	it('sets private_fields_exposed to 0 by design', () => {
		// We cannot directly inspect the audit entry from here,
		// but we verify the filtered result has no private data
		const ctx = makeContext({
			private_context: { energy_variable: true }
		});
		const manifest = makeManifest();
		const consent = makeConsent();
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect(filtered.constraints).toBeDefined();
		// Constraint flags are booleans, not details
		for (const val of Object.values(filtered.constraints)) {
			expect(typeof val).toBe('boolean');
		}
	});

	it('computes constraint flags from private_context as booleans', () => {
		const ctx = makeContext({
			private_context: {
				schedule_irregular: true,
				financial_constraint: true,
				noise_sensitive: true,
				energy_variable: true
			}
		});
		const manifest = makeManifest();
		const consent = makeConsent();
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect(filtered.constraints.time_limited).toBe(true);
		expect(filtered.constraints.budget_limited).toBe(true);
		expect(filtered.constraints.noise_restricted).toBe(true);
		expect(filtered.constraints.energy_variable).toBe(true);
	});

	it('prefers explicit constraints over private_context inference', () => {
		const ctx = makeContext({
			constraints: { time_limited: false },
			private_context: { schedule_irregular: true }
		});
		const manifest = makeManifest();
		const consent = makeConsent();
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect(filtered.constraints.time_limited).toBe(false);
	});

	it('handles empty private_context gracefully', () => {
		const ctx = makeContext({ private_context: undefined });
		const manifest = makeManifest();
		const consent = makeConsent();
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect(filtered.constraints.time_limited).toBe(false);
		expect(filtered.constraints.budget_limited).toBe(false);
	});
});

describe('getSharePreview', () => {
	it('always includes display_name, goal, experience in wouldShare', () => {
		const ctx = makeContext();
		const manifest = makeManifest();
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldShare).toContain('display_name');
		expect(preview.wouldShare).toContain('goal');
		expect(preview.wouldShare).toContain('experience');
	});

	it('adds required fields to wouldShare by default', () => {
		const ctx = makeContext();
		const manifest = makeManifest({
			context_requirements: { required: ['learning_style'], optional: [] }
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldShare).toContain('learning_style');
	});

	it('withholds required fields in the hide list', () => {
		const ctx = makeContext({
			sharing_settings: {
				platforms: { share: [], hide: ['learning_style'] }
			}
		});
		const manifest = makeManifest({
			context_requirements: { required: ['learning_style'], optional: [] }
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldWithhold).toContain('learning_style');
		expect(preview.wouldShare).not.toContain('learning_style');
	});

	it('includes optional fields only if in the share list', () => {
		const ctx = makeContext({
			sharing_settings: {
				platforms: { share: ['noise_mode'], hide: [] }
			}
		});
		const manifest = makeManifest({
			context_requirements: { required: [], optional: ['noise_mode', 'session_length'] }
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldShare).toContain('noise_mode');
		expect(preview.wouldWithhold).toContain('session_length');
	});

	it('withholds optional fields not in share list', () => {
		const ctx = makeContext();
		const manifest = makeManifest({
			context_requirements: { required: [], optional: ['noise_mode'] }
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldWithhold).toContain('noise_mode');
	});

	it('always withholds private_context keys except _note', () => {
		const ctx = makeContext({
			private_context: {
				_note: 'internal',
				health_conditions: 'migraine',
				financial_constraint: true
			}
		});
		const manifest = makeManifest();
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldWithhold).toContain('health_conditions');
		expect(preview.wouldWithhold).toContain('financial_constraint');
		expect(preview.wouldWithhold).not.toContain('_note');
	});

	it('handles undefined private_context without error', () => {
		const ctx = makeContext({ private_context: undefined });
		const manifest = makeManifest();
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldShare).toBeDefined();
		expect(preview.wouldWithhold).toBeDefined();
	});

	it('handles empty manifest requirements', () => {
		const ctx = makeContext();
		const manifest = makeManifest({
			context_requirements: { required: [], optional: [] }
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldShare).toEqual(['display_name', 'goal', 'experience']);
	});

	it('handles sharing_settings.platforms with undefined share/hide (lines 368-369 fallback)', () => {
		const ctx = makeContext({
			sharing_settings: {
				platforms: {} as { share?: string[]; hide?: string[] }
			}
		});
		const manifest = makeManifest({
			context_requirements: { required: ['learning_style'], optional: ['noise_mode'] }
		});
		const preview = getSharePreview(ctx, manifest);
		// With no hide list, required fields go to wouldShare
		expect(preview.wouldShare).toContain('learning_style');
		// With no share list, optional fields go to wouldWithhold
		expect(preview.wouldWithhold).toContain('noise_mode');
	});
});

describe('vcpContext store', () => {
	beforeEach(() => {
		vcpContext.clear();
		localStorage.clear();
	});

	it('starts as null when localStorage is empty', () => {
		const value = get(vcpContext);
		expect(value).toBeNull();
	});

	it('set stores context and persists to localStorage', () => {
		const ctx = makeContext();
		vcpContext.set(ctx);
		expect(get(vcpContext)).toEqual(ctx);
		const stored = localStorage.getItem('vcp_context');
		expect(stored).not.toBeNull();
		expect(JSON.parse(stored!).profile_id).toBe('test-user-1');
	});

	it('clear removes context and clears localStorage', () => {
		vcpContext.set(makeContext());
		vcpContext.clear();
		expect(get(vcpContext)).toBeNull();
		expect(localStorage.getItem('vcp_context')).toBeNull();
	});

	it('updateField updates a single field on the context', () => {
		vcpContext.set(makeContext());
		vcpContext.updateField('vcp_version', '2.0.0');
		expect(get(vcpContext)?.vcp_version).toBe('2.0.0');
	});

	it('updateField does nothing when context is null', () => {
		vcpContext.clear();
		vcpContext.updateField('vcp_version', '2.0.0');
		expect(get(vcpContext)).toBeNull();
	});

	it('updateField updates the updated timestamp', () => {
		vcpContext.set(makeContext({ updated: '2020-01-01T00:00:00Z' }));
		vcpContext.updateField('vcp_version', '2.0.0');
		expect(get(vcpContext)?.updated).not.toBe('2020-01-01T00:00:00Z');
	});
});

describe('publicContext derived store', () => {
	beforeEach(() => {
		vcpContext.clear();
	});

	it('returns null when vcpContext is null', () => {
		expect(get(publicContext)).toBeNull();
	});

	it('extracts public profile fields from context', () => {
		vcpContext.set(
			makeContext({
				public_profile: {
					display_name: 'Alice',
					goal: 'Compose',
					experience: 'advanced',
					learning_style: 'visual',
					pace: 'intensive',
					motivation: 'career',
					role: 'Engineer',
					team: 'Platform',
					career_goal: 'Lead'
				}
			})
		);
		const pub = get(publicContext);
		expect(pub?.display_name).toBe('Alice');
		expect(pub?.goal).toBe('Compose');
		expect(pub?.experience).toBe('advanced');
		expect(pub?.learning_style).toBe('visual');
		expect(pub?.pace).toBe('intensive');
		expect(pub?.motivation).toBe('career');
		expect(pub?.role).toBe('Engineer');
		expect(pub?.team).toBe('Platform');
		expect(pub?.career_goal).toBe('Lead');
	});

	it('does not expose private_context through publicContext', () => {
		vcpContext.set(
			makeContext({
				private_context: { health_conditions: 'secret' }
			})
		);
		const pub = get(publicContext) as Record<string, unknown>;
		expect(pub.health_conditions).toBeUndefined();
		expect(pub.private_context).toBeUndefined();
	});
});

describe('influenceFlags derived store', () => {
	beforeEach(() => {
		vcpContext.clear();
	});

	it('returns null when vcpContext is null', () => {
		expect(get(influenceFlags)).toBeNull();
	});

	it('derives flags from explicit constraints', () => {
		vcpContext.set(
			makeContext({
				constraints: {
					time_limited: true,
					budget_limited: false,
					energy_variable: true
				}
			})
		);
		const flags = get(influenceFlags);
		expect(flags?.time_limited).toBe(true);
		expect(flags?.budget_limited).toBe(false);
		expect(flags?.energy_variable).toBe(true);
	});

	it('derives flags from private_context when constraints are absent', () => {
		vcpContext.set(
			makeContext({
				constraints: {},
				private_context: {
					schedule_irregular: true,
					financial_constraint: true,
					noise_sensitive: true,
					energy_variable: true,
					mobility_limited: true,
					health_conditions: 'chronic pain'
				}
			})
		);
		const flags = get(influenceFlags);
		expect(flags?.time_limited).toBe(true);
		expect(flags?.budget_limited).toBe(true);
		expect(flags?.noise_restricted).toBe(true);
		expect(flags?.energy_variable).toBe(true);
		expect(flags?.schedule_irregular).toBe(true);
		expect(flags?.mobility_limited).toBe(true);
		expect(flags?.health_considerations).toBe(true);
	});

	it('prefers explicit constraints over private_context', () => {
		vcpContext.set(
			makeContext({
				constraints: { time_limited: false },
				private_context: { schedule_irregular: true }
			})
		);
		const flags = get(influenceFlags);
		expect(flags?.time_limited).toBe(false);
	});

	it('returns all false when both constraints and private_context are empty', () => {
		vcpContext.set(makeContext({ constraints: {}, private_context: {} }));
		const flags = get(influenceFlags);
		expect(flags?.time_limited).toBe(false);
		expect(flags?.budget_limited).toBe(false);
		expect(flags?.noise_restricted).toBe(false);
		expect(flags?.energy_variable).toBe(false);
	});
});

describe('vcpConsents store', () => {
	beforeEach(() => {
		vcpContext.clear();
		vcpConsents.set({});
		localStorage.clear();
	});

	it('starts empty when localStorage has no consent data', () => {
		const consents = get(vcpConsents);
		expect(Object.keys(consents)).toHaveLength(0);
	});

	it('grantConsent creates a consent record', () => {
		const consent = vcpConsents.grantConsent('platform-1', ['name'], ['email']);
		expect(consent.platform_id).toBe('platform-1');
		expect(consent.required_fields).toEqual(['name']);
		expect(consent.optional_fields).toEqual(['email']);
		expect(consent.granted_at).toBeDefined();
	});

	it('grantConsent persists to store', () => {
		vcpConsents.grantConsent('platform-1', ['name'], []);
		expect(vcpConsents.hasConsent('platform-1')).toBe(true);
	});

	it('revokeConsent removes a consent record', () => {
		vcpConsents.grantConsent('platform-1', ['name'], []);
		vcpConsents.revokeConsent('platform-1');
		expect(vcpConsents.hasConsent('platform-1')).toBe(false);
	});

	it('hasConsent returns false for unknown platforms', () => {
		expect(vcpConsents.hasConsent('nonexistent')).toBe(false);
	});

	it('getConsent returns the record or null', () => {
		vcpConsents.grantConsent('platform-1', ['name'], ['email']);
		const record = vcpConsents.getConsent('platform-1');
		expect(record).not.toBeNull();
		expect(record?.platform_id).toBe('platform-1');

		expect(vcpConsents.getConsent('nonexistent')).toBeNull();
	});

	it('revoking a nonexistent consent does not throw', () => {
		expect(() => vcpConsents.revokeConsent('nonexistent')).not.toThrow();
	});

	it('handles multiple platforms independently', () => {
		vcpConsents.grantConsent('a', ['f1'], []);
		vcpConsents.grantConsent('b', ['f2'], ['f3']);
		expect(vcpConsents.hasConsent('a')).toBe(true);
		expect(vcpConsents.hasConsent('b')).toBe(true);
		vcpConsents.revokeConsent('a');
		expect(vcpConsents.hasConsent('a')).toBe(false);
		expect(vcpConsents.hasConsent('b')).toBe(true);
	});
});

// ============================================
// refreshEngagementDecay
// ============================================

describe('refreshEngagementDecay', () => {
	beforeEach(() => {
		vcpContext.clear();
		localStorage.clear();
	});

	it('returns unchanged ctx when context is null', () => {
		vcpContext.clear();
		refreshEngagementDecay();
		expect(get(vcpContext)).toBeNull();
	});

	it('returns unchanged ctx when personal_state is undefined', () => {
		vcpContext.set(makeContext());
		const before = get(vcpContext);
		refreshEngagementDecay();
		// updated timestamp should not change because no personal_state exists
		expect(get(vcpContext)?.updated).toBe(before?.updated);
	});

	it('returns unchanged ctx when no dimensions have reset_on_engagement', () => {
		vcpContext.set(
			makeContext({
				personal_state: {
					emotional_tone: {
						value: 'calm',
						intensity: 3,
						declared_at: '2026-01-15T12:00:00Z'
					}
				}
			})
		);
		const before = get(vcpContext);
		refreshEngagementDecay();
		// emotional_tone has reset_on_engagement=false by default, so nothing changes
		expect(get(vcpContext)?.personal_state?.emotional_tone?.declared_at).toBe(
			before?.personal_state?.emotional_tone?.declared_at
		);
	});

	it('refreshes declared_at for cognitive_state (reset_on_engagement=true)', () => {
		const oldTimestamp = '2026-01-15T12:00:00Z';
		vcpContext.set(
			makeContext({
				personal_state: {
					cognitive_state: {
						value: 'focused',
						intensity: 3,
						declared_at: oldTimestamp
					}
				}
			})
		);
		refreshEngagementDecay();
		const ctx = get(vcpContext);
		expect(ctx?.personal_state?.cognitive_state?.declared_at).not.toBe(oldTimestamp);
		// The updated timestamp should also be refreshed
		expect(ctx?.updated).not.toBe('2026-01-15T12:00:00Z');
	});

	it('does NOT refresh declared_at for emotional_tone (reset_on_engagement=false)', () => {
		const oldTimestamp = '2026-01-15T12:00:00Z';
		vcpContext.set(
			makeContext({
				personal_state: {
					cognitive_state: {
						value: 'focused',
						intensity: 3,
						declared_at: oldTimestamp
					},
					emotional_tone: {
						value: 'calm',
						intensity: 2,
						declared_at: oldTimestamp
					}
				}
			})
		);
		refreshEngagementDecay();
		const ctx = get(vcpContext);
		// cognitive_state should be refreshed
		expect(ctx?.personal_state?.cognitive_state?.declared_at).not.toBe(oldTimestamp);
		// emotional_tone should NOT be refreshed
		expect(ctx?.personal_state?.emotional_tone?.declared_at).toBe(oldTimestamp);
	});

	it('does NOT refresh dimensions without declared_at even if reset_on_engagement is true', () => {
		vcpContext.set(
			makeContext({
				personal_state: {
					cognitive_state: {
						value: 'focused',
						intensity: 3
						// no declared_at
					}
				}
			})
		);
		const before = get(vcpContext);
		refreshEngagementDecay();
		// No declared_at means condition dim.declared_at is falsy, so no refresh
		expect(get(vcpContext)?.personal_state?.cognitive_state?.declared_at).toBeUndefined();
		expect(get(vcpContext)?.updated).toBe(before?.updated);
	});

	it('skips falsy dimensions in personal_state (line 461 !dim continue)', () => {
		vcpContext.set(
			makeContext({
				personal_state: {
					cognitive_state: {
						value: 'focused',
						intensity: 3,
						declared_at: '2026-01-15T12:00:00Z'
					},
					// explicitly set a dimension to undefined to trigger the !dim continue path
					emotional_tone: undefined
				}
			})
		);
		refreshEngagementDecay();
		const ctx = get(vcpContext);
		// cognitive_state should still be refreshed (reset_on_engagement=true)
		expect(ctx?.personal_state?.cognitive_state?.declared_at).not.toBe('2026-01-15T12:00:00Z');
		// emotional_tone should remain undefined
		expect(ctx?.personal_state?.emotional_tone).toBeUndefined();
	});
});

// ============================================
// updateField with personal_state auto-timestamp
// ============================================

describe('updateField personal_state auto-timestamp', () => {
	beforeEach(() => {
		vcpContext.clear();
		localStorage.clear();
	});

	it('auto-adds declared_at to personal_state dimensions that lack it', () => {
		vcpContext.set(makeContext());
		vcpContext.updateField('personal_state', {
			cognitive_state: { value: 'focused', intensity: 3 }
		});
		const ctx = get(vcpContext);
		expect(ctx?.personal_state?.cognitive_state?.declared_at).toBeDefined();
		// Should be a valid ISO timestamp
		expect(() => new Date(ctx!.personal_state!.cognitive_state!.declared_at!)).not.toThrow();
	});
});

// ============================================
// filterContextForPlatform: getFieldValue coverage
// ============================================

describe('filterContextForPlatform getFieldValue paths', () => {
	it('retrieves a value from availability (e.g., timezone)', () => {
		const ctx = makeContext({
			availability: {
				timezone: 'Europe/Dublin',
				best_times: ['evening']
			}
		});
		const manifest = makeManifest({
			context_requirements: {
				required: ['timezone'],
				optional: []
			}
		});
		const consent = makeConsent({
			required_fields: ['timezone'],
			optional_fields: []
		});
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect((filtered.preferences as Record<string, unknown>).timezone).toBe('Europe/Dublin');
	});

	it('retrieves a value from shared_with_manager', () => {
		const ctx = makeContext({
			shared_with_manager: {
				workload_level: 'high'
			}
		});
		const manifest = makeManifest({
			context_requirements: {
				required: ['workload_level'],
				optional: []
			}
		});
		const consent = makeConsent({
			required_fields: ['workload_level'],
			optional_fields: []
		});
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect((filtered.preferences as Record<string, unknown>).workload_level).toBe('high');
	});

	it('retrieves a value from current_skills', () => {
		const ctx = makeContext({
			current_skills: {
				current_focus: 'barre_chords',
				level: 'beginner'
			}
		});
		const manifest = makeManifest({
			context_requirements: {
				required: ['current_focus'],
				optional: []
			}
		});
		const consent = makeConsent({
			required_fields: ['current_focus'],
			optional_fields: []
		});
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect((filtered.preferences as Record<string, unknown>).current_focus).toBe('barre_chords');
	});

	it('retrieves a value from constraints', () => {
		const ctx = makeContext({
			constraints: { time_limited: true, budget_limited: false }
		});
		const manifest = makeManifest({
			context_requirements: {
				required: ['time_limited'],
				optional: []
			}
		});
		const consent = makeConsent({
			required_fields: ['time_limited'],
			optional_fields: []
		});
		const filtered = filterContextForPlatform(ctx, manifest, consent);
		expect((filtered.preferences as Record<string, unknown>).time_limited).toBe(true);
	});
});

describe('saveToStorage error handling', () => {
	beforeEach(() => {
		vcpContext.clear();
		localStorage.clear();
	});

	it('handles localStorage.setItem throwing without crashing', () => {
		const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('QuotaExceededError');
		});
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			expect(() => vcpContext.set(makeContext())).not.toThrow();
			expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to save'));
		} finally {
			spy.mockRestore();
			warnSpy.mockRestore();
		}
	});
});

describe('loadFromStorage error handling (module re-init)', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('recovers gracefully from corrupt JSON in localStorage', async () => {
		localStorage.setItem('vcp_context', '!!!not-valid-json!!!');
		const ctxMod = await import('./context');
		const storeMod = await import('svelte/store');
		expect(storeMod.get(ctxMod.vcpContext)).toBeNull();
		localStorage.removeItem('vcp_context');
	});

	it('recovers gracefully when localStorage.getItem throws', async () => {
		const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('SecurityError');
		});
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			const ctxMod = await import('./context');
			const storeMod = await import('svelte/store');
			expect(storeMod.get(ctxMod.vcpContext)).toBeNull();
			expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load'));
		} finally {
			spy.mockRestore();
			warnSpy.mockRestore();
		}
	});
});
