import { describe, it, expect, vi } from 'vitest';
import {
	PUBLIC_FIELDS,
	CONSENT_REQUIRED_FIELDS,
	PRIVATE_FIELDS,
	getFieldValue,
	isPrivateField,
	extractConstraintFlags,
	getStakeholderVisibleFields,
	getStakeholderHiddenFields,
	formatFieldName,
	getFieldPrivacyLevel,
	generatePrivacySummary,
	getSharePreview,
	filterContextForPlatform
} from './privacy';
import type {
	VCPContext,
	PlatformManifest,
	ConsentRecord,
	StakeholderType
} from './types';

// Mock the audit module so filterContextForPlatform doesn't hit localStorage
vi.mock('./audit', () => ({
	logAuditEntry: vi.fn()
}));

// ============================================
// Test Fixtures
// ============================================

function makeMinimalContext(overrides: Partial<VCPContext> = {}): VCPContext {
	return {
		vcp_version: '3.1',
		profile_id: 'test-user',
		constitution: { id: 'test', version: '1.0' },
		public_profile: {},
		...overrides
	};
}

function makeFullContext(): VCPContext {
	return {
		vcp_version: '3.1',
		profile_id: 'test-user',
		constitution: { id: 'test', version: '1.0' },
		public_profile: {
			display_name: 'Aisling',
			goal: 'Learn guitar',
			experience: 'beginner',
			learning_style: 'hands_on',
			pace: 'steady',
			motivation: 'personal_use',
			role: 'engineer',
			team: 'platform',
			career_goal: 'staff engineer'
		},
		portable_preferences: {
			noise_mode: 'quiet_preferred',
			session_length: '30_minutes',
			pressure_tolerance: 'medium',
			budget_range: 'medium',
			feedback_style: 'encouraging'
		},
		current_skills: {
			level: 'beginner',
			weeks_learning: 4,
			skills_acquired: ['open_chords', 'basic_strumming'],
			current_focus: 'barre_chords',
			struggle_areas: ['finger_stretching']
		},
		constraints: {
			time_limited: true,
			budget_limited: false,
			noise_restricted: true,
			energy_variable: false,
			schedule_irregular: false,
			mobility_limited: false,
			health_considerations: false
		},
		availability: {
			best_times: ['evening', 'weekend_morning'],
			avoid_times: ['early_morning'],
			session_length_preferred: '30_minutes',
			timezone: 'Europe/Dublin'
		},
		sharing_settings: {
			manager: {
				share: ['current_focus', 'skills_acquired'],
				hide: ['struggle_areas']
			},
			hr: {
				share: [],
				hide: ['budget_range']
			},
			community: {
				share: ['skills_acquired']
			}
		},
		private_context: {
			_note: 'Private details that influence constraint flags only',
			family_status: 'single_parent',
			dependents: 2,
			childcare_hours: '15:00-18:00',
			health_conditions: 'chronic_fatigue',
			financial_constraint: true,
			evening_available_after: '20:00',
			schedule: 'shift_work',
			neighbor_situation: 'noise_complaints'
		},
		shared_with_manager: {
			workload_level: 'high',
			budget_remaining_eur: 500
		}
	};
}

function makeManifest(overrides: Partial<PlatformManifest> = {}): PlatformManifest {
	return {
		platform_id: 'test-platform',
		platform_name: 'Test Platform',
		platform_type: 'learning',
		version: '1.0',
		context_requirements: {
			required: ['noise_mode', 'session_length'],
			optional: ['feedback_style', 'skills_acquired']
		},
		capabilities: ['adaptive_learning'],
		...overrides
	};
}

function makeConsent(overrides: Partial<ConsentRecord> = {}): ConsentRecord {
	return {
		platform_id: 'test-platform',
		granted_at: new Date().toISOString(),
		required_fields: ['noise_mode', 'session_length'],
		optional_fields: ['feedback_style'],
		...overrides
	};
}

// ============================================
// Field Classification Constants
// ============================================

describe('Field classification constants', () => {
	it('PUBLIC_FIELDS is a non-empty array', () => {
		expect(Array.isArray(PUBLIC_FIELDS)).toBe(true);
		expect(PUBLIC_FIELDS.length).toBeGreaterThan(0);
	});

	it('CONSENT_REQUIRED_FIELDS is a non-empty array', () => {
		expect(Array.isArray(CONSENT_REQUIRED_FIELDS)).toBe(true);
		expect(CONSENT_REQUIRED_FIELDS.length).toBeGreaterThan(0);
	});

	it('PRIVATE_FIELDS is a non-empty array', () => {
		expect(Array.isArray(PRIVATE_FIELDS)).toBe(true);
		expect(PRIVATE_FIELDS.length).toBeGreaterThan(0);
	});

	it('field lists have no overlap with each other', () => {
		for (const field of PUBLIC_FIELDS) {
			expect(CONSENT_REQUIRED_FIELDS).not.toContain(field);
			expect(PRIVATE_FIELDS).not.toContain(field);
		}
		for (const field of CONSENT_REQUIRED_FIELDS) {
			expect(PUBLIC_FIELDS).not.toContain(field);
			expect(PRIVATE_FIELDS).not.toContain(field);
		}
		for (const field of PRIVATE_FIELDS) {
			expect(PUBLIC_FIELDS).not.toContain(field);
			expect(CONSENT_REQUIRED_FIELDS).not.toContain(field);
		}
	});

	it('PUBLIC_FIELDS contains expected profile fields', () => {
		expect(PUBLIC_FIELDS).toContain('display_name');
		expect(PUBLIC_FIELDS).toContain('goal');
		expect(PUBLIC_FIELDS).toContain('experience');
	});

	it('CONSENT_REQUIRED_FIELDS contains preference fields', () => {
		expect(CONSENT_REQUIRED_FIELDS).toContain('noise_mode');
		expect(CONSENT_REQUIRED_FIELDS).toContain('session_length');
		expect(CONSENT_REQUIRED_FIELDS).toContain('budget_range');
	});

	it('PRIVATE_FIELDS contains sensitive personal data', () => {
		expect(PRIVATE_FIELDS).toContain('family_status');
		expect(PRIVATE_FIELDS).toContain('health_conditions');
		expect(PRIVATE_FIELDS).toContain('financial_constraint');
		expect(PRIVATE_FIELDS).toContain('dependents');
	});

	it('all field names are non-empty strings', () => {
		const allFields = [...PUBLIC_FIELDS, ...CONSENT_REQUIRED_FIELDS, ...PRIVATE_FIELDS];
		for (const field of allFields) {
			expect(typeof field).toBe('string');
			expect(field.length).toBeGreaterThan(0);
		}
	});
});

// ============================================
// getFieldValue
// ============================================

describe('getFieldValue', () => {
	it('returns value from public_profile', () => {
		const ctx = makeFullContext();
		expect(getFieldValue(ctx, 'display_name')).toBe('Aisling');
	});

	it('returns value from portable_preferences', () => {
		const ctx = makeFullContext();
		expect(getFieldValue(ctx, 'noise_mode')).toBe('quiet_preferred');
	});

	it('returns value from current_skills', () => {
		const ctx = makeFullContext();
		expect(getFieldValue(ctx, 'current_focus')).toBe('barre_chords');
	});

	it('returns value from constraints', () => {
		const ctx = makeFullContext();
		expect(getFieldValue(ctx, 'time_limited')).toBe(true);
	});

	it('returns value from availability', () => {
		const ctx = makeFullContext();
		expect(getFieldValue(ctx, 'best_times')).toEqual(['evening', 'weekend_morning']);
	});

	it('returns value from shared_with_manager', () => {
		const ctx = makeFullContext();
		expect(getFieldValue(ctx, 'workload_level')).toBe('high');
	});

	it('returns undefined for a field that does not exist', () => {
		const ctx = makeFullContext();
		expect(getFieldValue(ctx, 'nonexistent_field')).toBeUndefined();
	});

	it('returns undefined for minimal context with empty profile', () => {
		const ctx = makeMinimalContext();
		expect(getFieldValue(ctx, 'display_name')).toBeUndefined();
	});

	it('does NOT return values from private_context', () => {
		const ctx = makeFullContext();
		// private_context is intentionally not in the search sources
		expect(getFieldValue(ctx, 'family_status')).toBeUndefined();
	});

	it('returns first match when field exists in multiple sources', () => {
		// If public_profile and constraints both have a field, public_profile wins
		const ctx = makeMinimalContext({
			public_profile: { goal: 'from_profile' } as VCPContext['public_profile'],
			shared_with_manager: { goal: 'from_manager' }
		});
		expect(getFieldValue(ctx, 'goal')).toBe('from_profile');
	});

	it('handles context with all optional sections undefined', () => {
		const ctx = makeMinimalContext();
		expect(getFieldValue(ctx, 'noise_mode')).toBeUndefined();
		expect(getFieldValue(ctx, 'best_times')).toBeUndefined();
	});
});

// ============================================
// isPrivateField
// ============================================

describe('isPrivateField', () => {
	it('returns true for fields in PRIVATE_FIELDS list', () => {
		const ctx = makeMinimalContext();
		expect(isPrivateField(ctx, 'family_status')).toBe(true);
		expect(isPrivateField(ctx, 'health_conditions')).toBe(true);
		expect(isPrivateField(ctx, 'financial_constraint')).toBe(true);
		expect(isPrivateField(ctx, 'dependents')).toBe(true);
	});

	it('returns true for fields that exist in private_context but not in PRIVATE_FIELDS', () => {
		const ctx = makeMinimalContext({
			private_context: { custom_secret: 'hidden_value' }
		});
		expect(isPrivateField(ctx, 'custom_secret')).toBe(true);
	});

	it('returns false for public fields', () => {
		const ctx = makeMinimalContext();
		expect(isPrivateField(ctx, 'display_name')).toBe(false);
		expect(isPrivateField(ctx, 'goal')).toBe(false);
		expect(isPrivateField(ctx, 'experience')).toBe(false);
	});

	it('returns false for consent-required fields', () => {
		const ctx = makeMinimalContext();
		expect(isPrivateField(ctx, 'noise_mode')).toBe(false);
		expect(isPrivateField(ctx, 'session_length')).toBe(false);
	});

	it('returns false for unknown fields when private_context is empty', () => {
		const ctx = makeMinimalContext();
		expect(isPrivateField(ctx, 'totally_made_up')).toBe(false);
	});

	it('returns false for unknown fields when private_context is undefined', () => {
		const ctx = makeMinimalContext();
		delete ctx.private_context;
		expect(isPrivateField(ctx, 'some_field')).toBe(false);
	});

	it('does not treat _note in private_context as private field by PRIVATE_FIELDS list', () => {
		// _note is a metadata key in private_context, but it IS in private_context
		const ctx = makeMinimalContext({
			private_context: { _note: 'just a note' }
		});
		expect(isPrivateField(ctx, '_note')).toBe(true);
	});
});

// ============================================
// extractConstraintFlags
// ============================================

describe('extractConstraintFlags', () => {
	it('returns all false flags for minimal context', () => {
		const ctx = makeMinimalContext();
		const flags = extractConstraintFlags(ctx);
		expect(flags.time_limited).toBeFalsy();
		expect(flags.budget_limited).toBeFalsy();
		expect(flags.noise_restricted).toBeFalsy();
		expect(flags.energy_variable).toBeFalsy();
		expect(flags.schedule_irregular).toBeFalsy();
		expect(flags.mobility_limited).toBeFalsy();
		expect(flags.health_considerations).toBeFalsy();
	});

	it('derives time_limited from constraints.time_limited', () => {
		const ctx = makeMinimalContext({
			constraints: { time_limited: true }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.time_limited).toBe(true);
	});

	it('derives time_limited from private_context.childcare_hours', () => {
		const ctx = makeMinimalContext({
			private_context: { childcare_hours: '15:00-18:00' }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.time_limited).toBe(true);
	});

	it('derives time_limited from private_context.schedule_irregular', () => {
		const ctx = makeMinimalContext({
			private_context: { schedule_irregular: true }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.time_limited).toBe(true);
	});

	it('derives budget_limited from constraints.budget_limited', () => {
		const ctx = makeMinimalContext({
			constraints: { budget_limited: true }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.budget_limited).toBe(true);
	});

	it('derives budget_limited from private_context.financial_constraint', () => {
		const ctx = makeMinimalContext({
			private_context: { financial_constraint: true }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.budget_limited).toBe(true);
	});

	it('derives noise_restricted from private_context.neighbor_situation', () => {
		const ctx = makeMinimalContext({
			private_context: { neighbor_situation: 'noise_complaints' }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.noise_restricted).toBe(true);
	});

	it('derives noise_restricted from private_context.noise_sensitive', () => {
		const ctx = makeMinimalContext({
			private_context: { noise_sensitive: true }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.noise_restricted).toBe(true);
	});

	it('derives energy_variable from private_context.health_conditions', () => {
		const ctx = makeMinimalContext({
			private_context: { health_conditions: 'chronic_fatigue' }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.energy_variable).toBe(true);
	});

	it('derives energy_variable from private_context.schedule (shift work)', () => {
		const ctx = makeMinimalContext({
			private_context: { schedule: 'shift_work' }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.energy_variable).toBe(true);
	});

	it('derives schedule_irregular from private_context.schedule', () => {
		const ctx = makeMinimalContext({
			private_context: { schedule: 'shift_work' }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.schedule_irregular).toBe(true);
	});

	it('derives schedule_irregular from private_context.childcare_hours', () => {
		const ctx = makeMinimalContext({
			private_context: { childcare_hours: '15:00-18:00' }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.schedule_irregular).toBe(true);
	});

	it('derives health_considerations from private_context.health_conditions', () => {
		const ctx = makeMinimalContext({
			private_context: { health_conditions: 'chronic_fatigue' }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.health_considerations).toBe(true);
	});

	it('derives health_considerations from private_context.health_appointments', () => {
		const ctx = makeMinimalContext({
			private_context: { health_appointments: 'weekly' }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.health_considerations).toBe(true);
	});

	it('derives mobility_limited from constraints.mobility_limited', () => {
		const ctx = makeMinimalContext({
			constraints: { mobility_limited: true }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.mobility_limited).toBe(true);
	});

	it('derives mobility_limited from private_context.mobility_limited', () => {
		const ctx = makeMinimalContext({
			private_context: { mobility_limited: true }
		});
		const flags = extractConstraintFlags(ctx);
		expect(flags.mobility_limited).toBe(true);
	});

	it('returns all expected flag keys', () => {
		const ctx = makeMinimalContext();
		const flags = extractConstraintFlags(ctx);
		const expectedKeys = [
			'time_limited',
			'budget_limited',
			'noise_restricted',
			'energy_variable',
			'schedule_irregular',
			'mobility_limited',
			'health_considerations'
		];
		for (const key of expectedKeys) {
			expect(flags).toHaveProperty(key);
		}
	});

	it('flags from full context with rich private data', () => {
		const ctx = makeFullContext();
		const flags = extractConstraintFlags(ctx);
		// Full context has childcare_hours, financial_constraint, neighbor_situation,
		// health_conditions, schedule (shift_work), health_appointments not set
		expect(flags.time_limited).toBe(true);
		expect(flags.budget_limited).toBe(true);
		expect(flags.noise_restricted).toBe(true);
		expect(flags.energy_variable).toBe(true);
		expect(flags.schedule_irregular).toBe(true);
		expect(flags.health_considerations).toBe(true);
	});

	it('never exposes the private values themselves -- only boolean flags', () => {
		const ctx = makeFullContext();
		const flags = extractConstraintFlags(ctx);
		const flagValues = Object.values(flags);
		for (const val of flagValues) {
			expect(typeof val).toBe('boolean');
		}
	});
});

// ============================================
// getStakeholderVisibleFields
// ============================================

describe('getStakeholderVisibleFields', () => {
	it('returns PUBLIC_FIELDS when no sharing_settings exist', () => {
		const ctx = makeMinimalContext();
		const visible = getStakeholderVisibleFields(ctx, 'hr');
		expect(visible).toEqual(PUBLIC_FIELDS);
	});

	it('returns PUBLIC_FIELDS when stakeholder has no settings', () => {
		const ctx = makeMinimalContext({
			sharing_settings: {
				manager: { share: ['current_focus'] }
			}
		});
		const visible = getStakeholderVisibleFields(ctx, 'hr');
		expect(visible).toEqual(PUBLIC_FIELDS);
	});

	it('adds explicitly shared fields to public fields', () => {
		const ctx = makeFullContext();
		const visible = getStakeholderVisibleFields(ctx, 'manager');
		expect(visible).toContain('display_name'); // public
		expect(visible).toContain('current_focus'); // explicitly shared
		expect(visible).toContain('skills_acquired'); // explicitly shared
	});

	it('removes hidden fields from the visible list', () => {
		const ctx = makeFullContext();
		const visible = getStakeholderVisibleFields(ctx, 'manager');
		expect(visible).not.toContain('struggle_areas');
	});

	it('never includes private fields even if explicitly shared', () => {
		const ctx = makeMinimalContext({
			sharing_settings: {
				manager: { share: ['family_status', 'health_conditions', 'current_focus'] }
			}
		});
		const visible = getStakeholderVisibleFields(ctx, 'manager');
		expect(visible).not.toContain('family_status');
		expect(visible).not.toContain('health_conditions');
	});

	it('does not duplicate fields already in PUBLIC_FIELDS', () => {
		const ctx = makeMinimalContext({
			sharing_settings: {
				community: { share: ['display_name', 'goal'] }
			}
		});
		const visible = getStakeholderVisibleFields(ctx, 'community');
		const displayNameCount = visible.filter((f) => f === 'display_name').length;
		expect(displayNameCount).toBe(1);
	});

	it('HR stakeholder with hide setting removes fields', () => {
		const ctx = makeFullContext();
		const visible = getStakeholderVisibleFields(ctx, 'hr');
		expect(visible).not.toContain('budget_range');
	});
});

// ============================================
// getStakeholderHiddenFields
// ============================================

describe('getStakeholderHiddenFields', () => {
	it('always includes all PRIVATE_FIELDS', () => {
		const ctx = makeMinimalContext();
		const hidden = getStakeholderHiddenFields(ctx, 'manager');
		for (const field of PRIVATE_FIELDS) {
			expect(hidden).toContain(field);
		}
	});

	it('includes consent-required fields not in visible list', () => {
		const ctx = makeMinimalContext();
		const hidden = getStakeholderHiddenFields(ctx, 'hr');
		// Without sharing_settings, only PUBLIC_FIELDS are visible
		// All consent-required fields should be hidden
		for (const field of CONSENT_REQUIRED_FIELDS) {
			expect(hidden).toContain(field);
		}
	});

	it('does not include consent-required fields that are visible', () => {
		const ctx = makeMinimalContext({
			sharing_settings: {
				manager: { share: ['noise_mode', 'session_length'] }
			}
		});
		const hidden = getStakeholderHiddenFields(ctx, 'manager');
		expect(hidden).not.toContain('noise_mode');
		expect(hidden).not.toContain('session_length');
	});

	it('visible + hidden covers all private and consent-required fields', () => {
		const ctx = makeFullContext();
		const visible = getStakeholderVisibleFields(ctx, 'manager');
		const hidden = getStakeholderHiddenFields(ctx, 'manager');

		// Every consent-required field is either visible or hidden
		for (const field of CONSENT_REQUIRED_FIELDS) {
			const isVisible = visible.includes(field);
			const isHidden = hidden.includes(field);
			expect(isVisible || isHidden).toBe(true);
		}

		// Every private field is hidden
		for (const field of PRIVATE_FIELDS) {
			expect(hidden).toContain(field);
		}
	});
});

// ============================================
// formatFieldName
// ============================================

describe('formatFieldName', () => {
	it('converts snake_case to Title Case', () => {
		expect(formatFieldName('display_name')).toBe('Display Name');
	});

	it('converts single word', () => {
		expect(formatFieldName('goal')).toBe('Goal');
	});

	it('handles multiple underscores', () => {
		expect(formatFieldName('budget_remaining_eur')).toBe('Budget Remaining Eur');
	});

	it('handles camelCase by capitalising first letter of each word boundary', () => {
		// The regex replaces underscores and capitalises word boundaries
		// camelCase has no underscores, so only the first char of each \b\w match gets capitalised
		const result = formatFieldName('camelCase');
		expect(result).toBe('CamelCase');
	});

	it('handles empty string', () => {
		expect(formatFieldName('')).toBe('');
	});

	it('handles string with no underscores', () => {
		expect(formatFieldName('motivation')).toBe('Motivation');
	});

	it('handles field names with numbers', () => {
		const result = formatFieldName('version_2_update');
		expect(result).toBe('Version 2 Update');
	});
});

// ============================================
// getFieldPrivacyLevel
// ============================================

describe('getFieldPrivacyLevel', () => {
	it('returns "public" for fields in PUBLIC_FIELDS', () => {
		expect(getFieldPrivacyLevel('display_name')).toBe('public');
		expect(getFieldPrivacyLevel('goal')).toBe('public');
		expect(getFieldPrivacyLevel('experience')).toBe('public');
		expect(getFieldPrivacyLevel('role')).toBe('public');
		expect(getFieldPrivacyLevel('career_goal')).toBe('public');
	});

	it('returns "private" for fields in PRIVATE_FIELDS', () => {
		expect(getFieldPrivacyLevel('family_status')).toBe('private');
		expect(getFieldPrivacyLevel('health_conditions')).toBe('private');
		expect(getFieldPrivacyLevel('financial_constraint')).toBe('private');
		expect(getFieldPrivacyLevel('dependents')).toBe('private');
		expect(getFieldPrivacyLevel('housing')).toBe('private');
	});

	it('returns "consent-required" for fields in CONSENT_REQUIRED_FIELDS', () => {
		expect(getFieldPrivacyLevel('noise_mode')).toBe('consent-required');
		expect(getFieldPrivacyLevel('session_length')).toBe('consent-required');
		expect(getFieldPrivacyLevel('budget_range')).toBe('consent-required');
		expect(getFieldPrivacyLevel('feedback_style')).toBe('consent-required');
	});

	it('returns "consent-required" for unknown fields (default)', () => {
		expect(getFieldPrivacyLevel('unknown_field')).toBe('consent-required');
		expect(getFieldPrivacyLevel('something_random')).toBe('consent-required');
	});

	it('every field in PUBLIC_FIELDS is classified as public', () => {
		for (const field of PUBLIC_FIELDS) {
			expect(getFieldPrivacyLevel(field)).toBe('public');
		}
	});

	it('every field in PRIVATE_FIELDS is classified as private', () => {
		for (const field of PRIVATE_FIELDS) {
			expect(getFieldPrivacyLevel(field)).toBe('private');
		}
	});

	it('every field in CONSENT_REQUIRED_FIELDS is classified as consent-required', () => {
		for (const field of CONSENT_REQUIRED_FIELDS) {
			expect(getFieldPrivacyLevel(field)).toBe('consent-required');
		}
	});
});

// ============================================
// generatePrivacySummary
// ============================================

describe('generatePrivacySummary', () => {
	it('includes shared count when fields are shared', () => {
		const summary = generatePrivacySummary(['display_name', 'goal'], [], 0);
		expect(summary).toContain('2 fields shared');
	});

	it('includes withheld count when fields are withheld', () => {
		const summary = generatePrivacySummary([], ['family_status', 'health_conditions'], 0);
		expect(summary).toContain('2 fields kept private');
	});

	it('includes private influence count when private fields influenced', () => {
		const summary = generatePrivacySummary([], [], 3);
		expect(summary).toContain('3 private constraints influenced recommendations');
		expect(summary).toContain('details not exposed');
	});

	it('combines all three sections with bullet separator', () => {
		const summary = generatePrivacySummary(['display_name'], ['family_status'], 2);
		const parts = summary.split(' \u2022 ');
		expect(parts.length).toBe(3);
	});

	it('returns empty string when no fields shared, withheld, or influenced', () => {
		const summary = generatePrivacySummary([], [], 0);
		expect(summary).toBe('');
	});

	it('handles only shared fields', () => {
		const summary = generatePrivacySummary(['a', 'b', 'c'], [], 0);
		expect(summary).toBe('3 fields shared');
		expect(summary).not.toContain('\u2022');
	});

	it('handles only withheld fields', () => {
		const summary = generatePrivacySummary([], ['a'], 0);
		expect(summary).toBe('1 fields kept private');
	});

	it('handles only private influence', () => {
		const summary = generatePrivacySummary([], [], 1);
		expect(summary).toContain('1 private constraints influenced recommendations');
	});
});

// ============================================
// getSharePreview
// ============================================

describe('getSharePreview', () => {
	it('always includes PUBLIC_FIELDS in wouldShare', () => {
		const ctx = makeMinimalContext();
		const manifest = makeManifest();
		const preview = getSharePreview(ctx, manifest);
		for (const field of PUBLIC_FIELDS) {
			expect(preview.wouldShare).toContain(field);
		}
	});

	it('puts required non-private fields into requiresConsent', () => {
		const ctx = makeMinimalContext();
		const manifest = makeManifest({
			context_requirements: {
				required: ['noise_mode', 'session_length'],
				optional: []
			}
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.requiresConsent).toContain('noise_mode');
		expect(preview.requiresConsent).toContain('session_length');
	});

	it('withholds required fields that are private', () => {
		const ctx = makeMinimalContext();
		const manifest = makeManifest({
			context_requirements: {
				required: ['family_status', 'health_conditions'],
				optional: []
			}
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldWithhold).toContain('family_status');
		expect(preview.wouldWithhold).toContain('health_conditions');
		expect(preview.requiresConsent).not.toContain('family_status');
	});

	it('withholds optional fields by default (not explicitly shared)', () => {
		const ctx = makeMinimalContext();
		const manifest = makeManifest({
			context_requirements: {
				required: [],
				optional: ['feedback_style', 'skills_acquired']
			}
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldWithhold).toContain('feedback_style');
		expect(preview.wouldWithhold).toContain('skills_acquired');
	});

	it('shares optional fields that are explicitly in sharing_settings.platforms.share', () => {
		const ctx = makeMinimalContext({
			sharing_settings: {
				platforms: { share: ['feedback_style'], hide: [] }
			}
		});
		const manifest = makeManifest({
			context_requirements: {
				required: [],
				optional: ['feedback_style']
			}
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldShare).toContain('feedback_style');
	});

	it('withholds required fields that are in sharing_settings.platforms.hide', () => {
		const ctx = makeMinimalContext({
			sharing_settings: {
				platforms: { share: [], hide: ['noise_mode'] }
			}
		});
		const manifest = makeManifest({
			context_requirements: {
				required: ['noise_mode'],
				optional: []
			}
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldWithhold).toContain('noise_mode');
		expect(preview.requiresConsent).not.toContain('noise_mode');
	});

	it('withholds all private_context keys (except _note)', () => {
		const ctx = makeMinimalContext({
			private_context: {
				_note: 'some note',
				secret_field: 'hidden',
				another_secret: 42
			}
		});
		const manifest = makeManifest({
			context_requirements: { required: [], optional: [] }
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.wouldWithhold).toContain('secret_field');
		expect(preview.wouldWithhold).toContain('another_secret');
		expect(preview.wouldWithhold).not.toContain('_note');
	});

	it('deduplicates fields in all output arrays', () => {
		const ctx = makeMinimalContext({
			private_context: {
				family_status: 'test',
				dependents: 1
			}
		});
		const manifest = makeManifest({
			context_requirements: {
				required: ['family_status'],
				optional: ['family_status'] // duplicate across required and optional
			}
		});
		const preview = getSharePreview(ctx, manifest);
		const familyCount = preview.wouldWithhold.filter((f) => f === 'family_status').length;
		expect(familyCount).toBe(1);
	});

	it('returns empty requiresConsent when all required are private', () => {
		const ctx = makeMinimalContext();
		const manifest = makeManifest({
			context_requirements: {
				required: ['family_status', 'health_conditions'],
				optional: []
			}
		});
		const preview = getSharePreview(ctx, manifest);
		expect(preview.requiresConsent).toHaveLength(0);
	});
});

// ============================================
// filterContextForPlatform
// ============================================

describe('filterContextForPlatform', () => {
	it('includes public fields in result.public', () => {
		const ctx = makeFullContext();
		const manifest = makeManifest();
		const consent = makeConsent();
		const result = filterContextForPlatform(ctx, manifest, consent);
		expect(result.public).toHaveProperty('display_name', 'Aisling');
		expect(result.public).toHaveProperty('goal', 'Learn guitar');
	});

	it('includes consented required fields in result.preferences', () => {
		const ctx = makeFullContext();
		const manifest = makeManifest();
		const consent = makeConsent({
			required_fields: ['noise_mode', 'session_length']
		});
		const result = filterContextForPlatform(ctx, manifest, consent);
		expect(result.preferences).toHaveProperty('noise_mode', 'quiet_preferred');
		expect(result.preferences).toHaveProperty('session_length', '30_minutes');
	});

	it('includes consented optional fields in result.preferences', () => {
		const ctx = makeFullContext();
		const manifest = makeManifest();
		const consent = makeConsent({
			optional_fields: ['feedback_style']
		});
		const result = filterContextForPlatform(ctx, manifest, consent);
		expect(result.preferences).toHaveProperty('feedback_style', 'encouraging');
	});

	it('withholds optional fields without consent', () => {
		const ctx = makeFullContext();
		const manifest = makeManifest();
		const consent = makeConsent({
			optional_fields: [] // no optional consent
		});
		const result = filterContextForPlatform(ctx, manifest, consent);
		expect(result.preferences).not.toHaveProperty('feedback_style');
	});

	it('never includes private fields even when listed as required', () => {
		const ctx = makeFullContext();
		const manifest = makeManifest({
			context_requirements: {
				required: ['family_status', 'health_conditions', 'noise_mode'],
				optional: []
			}
		});
		const consent = makeConsent({
			required_fields: ['family_status', 'health_conditions', 'noise_mode']
		});
		const result = filterContextForPlatform(ctx, manifest, consent);
		expect(result.preferences).not.toHaveProperty('family_status');
		expect(result.preferences).not.toHaveProperty('health_conditions');
	});

	it('includes constraint flags as booleans', () => {
		const ctx = makeFullContext();
		const manifest = makeManifest();
		const consent = makeConsent();
		const result = filterContextForPlatform(ctx, manifest, consent);
		expect(result.constraints).toBeDefined();
		expect(typeof result.constraints.time_limited).toBe('boolean');
		expect(typeof result.constraints.budget_limited).toBe('boolean');
	});

	it('only has public, preferences, and constraints keys (no private leakage)', () => {
		const ctx = makeFullContext();
		const manifest = makeManifest();
		const consent = makeConsent();
		const result = filterContextForPlatform(ctx, manifest, consent);
		const resultStr = JSON.stringify(result);
		// No private values should appear in the serialised result
		expect(resultStr).not.toContain('single_parent');
		expect(resultStr).not.toContain('chronic_fatigue');
		expect(resultStr).not.toContain('noise_complaints');
		expect(resultStr).not.toContain('shift_work');
	});
});

// ============================================
// Security: Private Context Never Leaks
// ============================================

describe('Security: private_context never appears in public outputs', () => {
	const ctx = makeFullContext();

	it('getSharePreview never includes private values in wouldShare', () => {
		const manifest = makeManifest({
			context_requirements: {
				required: PRIVATE_FIELDS.slice(0, 3),
				optional: PRIVATE_FIELDS.slice(3)
			}
		});
		const preview = getSharePreview(ctx, manifest);
		for (const field of PRIVATE_FIELDS) {
			expect(preview.wouldShare).not.toContain(field);
		}
	});

	it('filterContextForPlatform never leaks private_context values', () => {
		const manifest = makeManifest({
			context_requirements: {
				required: [...PRIVATE_FIELDS, ...CONSENT_REQUIRED_FIELDS],
				optional: []
			}
		});
		const consent = makeConsent({
			required_fields: [...PRIVATE_FIELDS, ...CONSENT_REQUIRED_FIELDS]
		});
		const result = filterContextForPlatform(ctx, manifest, consent);
		const resultStr = JSON.stringify(result);
		// Check that no identifiable private_context string values appear in the output.
		// We filter to string values only -- primitive booleans/numbers like `true` or `2`
		// would false-positive against constraint flags and public numeric fields.
		const privateStringValues = Object.entries(ctx.private_context || {})
			.filter(([key]) => key !== '_note')
			.filter(([, val]) => typeof val === 'string')
			.map(([, val]) => val as string);
		for (const val of privateStringValues) {
			expect(resultStr).not.toContain(val);
		}
	});

	it('getStakeholderVisibleFields never includes private fields', () => {
		const stakeholders: StakeholderType[] = ['hr', 'manager', 'community', 'employee', 'coach'];
		for (const stakeholder of stakeholders) {
			const visible = getStakeholderVisibleFields(ctx, stakeholder);
			for (const field of PRIVATE_FIELDS) {
				expect(visible).not.toContain(field);
			}
		}
	});

	it('getStakeholderHiddenFields always includes all private fields', () => {
		const stakeholders: StakeholderType[] = ['hr', 'manager', 'community', 'employee', 'coach'];
		for (const stakeholder of stakeholders) {
			const hidden = getStakeholderHiddenFields(ctx, stakeholder);
			for (const field of PRIVATE_FIELDS) {
				expect(hidden).toContain(field);
			}
		}
	});

	it('extractConstraintFlags returns only booleans, never raw private data', () => {
		const flags = extractConstraintFlags(ctx);
		for (const [, value] of Object.entries(flags)) {
			expect(typeof value).toBe('boolean');
		}
	});
});

// ============================================
// filterContextForPlatform: required field not consented
// ============================================

describe('filterContextForPlatform withheld/private edge cases', () => {
	it('withholds required fields not in consent required_fields', () => {
		const ctx = makeFullContext();
		// Manifest requires 'learning_style' but consent does NOT include it
		const manifest = makeManifest({
			context_requirements: {
				required: ['learning_style'],
				optional: []
			}
		});
		const consent = makeConsent({
			required_fields: [], // no consent for learning_style
			optional_fields: []
		});
		const result = filterContextForPlatform(ctx, manifest, consent);
		// learning_style is NOT private, but consent is missing -> withheld
		expect(result.preferences).not.toHaveProperty('learning_style');
	});

	it('withholds optional fields that are in PRIVATE_FIELDS', () => {
		const ctx = makeFullContext();
		// Manifest lists 'health_conditions' as optional
		const manifest = makeManifest({
			context_requirements: {
				required: [],
				optional: ['health_conditions']
			}
		});
		const consent = makeConsent({
			required_fields: [],
			optional_fields: ['health_conditions'] // even with consent
		});
		const result = filterContextForPlatform(ctx, manifest, consent);
		// health_conditions is in PRIVATE_FIELDS -> never shared
		expect(result.preferences).not.toHaveProperty('health_conditions');
		// Verify no private values leaked anywhere in the result
		const resultStr = JSON.stringify(result);
		expect(resultStr).not.toContain('chronic_fatigue');
	});
});
