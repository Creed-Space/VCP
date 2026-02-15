import { describe, it, expect } from 'vitest';
import {
	loadConstitution,
	getAllConstitutions,
	getConstitutionIds,
	resolveRules,
	getPersonaTone,
	getActivePersona,
	constitutionAppliesToScope,
	getConstitutionsForScope,
	suggestPersonaFromPersonalState
} from './constitution';
import type {
	VCPContext,
	Constitution,
	PersonaType,
	ScopeType,
	PersonalState,
	ConstraintFlags
} from './types';

// ============================================
// Helpers
// ============================================

/** Build a minimal VCPContext for testing */
function makeContext(overrides: Partial<VCPContext> = {}): VCPContext {
	return {
		vcp_version: '3.1',
		profile_id: 'test-user',
		constitution: {
			id: 'personal.growth.creative',
			version: '1.0.0',
			persona: 'muse',
			adherence: 3,
			scopes: ['creativity', 'health', 'privacy']
		},
		public_profile: {
			display_name: 'Test User'
		},
		...overrides
	};
}

/** Build a PersonalState with a single dimension set */
function makePersonalState(overrides: Partial<PersonalState> = {}): PersonalState {
	return { ...overrides };
}

// ============================================
// Known Constitution IDs (from source)
// ============================================

const KNOWN_IDS = [
	'personal.growth.creative',
	'personal.balanced.guide',
	'personal.responsibility.balance',
	'techcorp.career.advisor'
];

// ============================================
// loadConstitution
// ============================================

describe('loadConstitution', () => {
	it('returns a valid constitution for each known ID', () => {
		for (const id of KNOWN_IDS) {
			const c = loadConstitution(id);
			expect(c).not.toBeNull();
			expect(c!.id).toBe(id);
		}
	});

	it('returns null for an unknown ID', () => {
		expect(loadConstitution('nonexistent.id')).toBeNull();
	});

	it('returns null for an empty string', () => {
		expect(loadConstitution('')).toBeNull();
	});

	it('returned constitution has required fields', () => {
		const c = loadConstitution('personal.growth.creative')!;
		expect(c.id).toBeDefined();
		expect(c.version).toBeDefined();
		expect(c.persona).toBeDefined();
		expect(typeof c.adherence).toBe('number');
		expect(Array.isArray(c.scopes)).toBe(true);
		expect(c.scopes.length).toBeGreaterThan(0);
		expect(Array.isArray(c.rules)).toBe(true);
		expect(c.rules.length).toBeGreaterThan(0);
	});

	it('each rule has id, weight, and rule text', () => {
		for (const id of KNOWN_IDS) {
			const c = loadConstitution(id)!;
			for (const rule of c.rules) {
				expect(rule.id).toBeDefined();
				expect(typeof rule.weight).toBe('number');
				expect(rule.weight).toBeGreaterThanOrEqual(0);
				expect(rule.weight).toBeLessThanOrEqual(1);
				expect(typeof rule.rule).toBe('string');
				expect(rule.rule.length).toBeGreaterThan(0);
			}
		}
	});

	it('personal.growth.creative has persona muse', () => {
		expect(loadConstitution('personal.growth.creative')!.persona).toBe('muse');
	});

	it('techcorp.career.advisor has persona ambassador', () => {
		expect(loadConstitution('techcorp.career.advisor')!.persona).toBe('ambassador');
	});

	it('personal.responsibility.balance has persona steward with adherence 4', () => {
		const c = loadConstitution('personal.responsibility.balance')!;
		expect(c.persona).toBe('steward');
		expect(c.adherence).toBe(4);
	});
});

// ============================================
// getAllConstitutions
// ============================================

describe('getAllConstitutions', () => {
	it('returns an array of constitutions', () => {
		const all = getAllConstitutions();
		expect(Array.isArray(all)).toBe(true);
		expect(all.length).toBeGreaterThan(0);
	});

	it('returns all known constitutions', () => {
		const all = getAllConstitutions();
		const ids = all.map((c) => c.id);
		for (const id of KNOWN_IDS) {
			expect(ids).toContain(id);
		}
	});

	it('returned constitutions all have valid persona types', () => {
		const validPersonas: PersonaType[] = [
			'muse',
			'ambassador',
			'godparent',
			'sentinel',
			'anchor',
			'nanny',
			'steward'
		];
		for (const c of getAllConstitutions()) {
			expect(validPersonas).toContain(c.persona);
		}
	});

	it('count matches the number of known IDs', () => {
		expect(getAllConstitutions().length).toBe(KNOWN_IDS.length);
	});
});

// ============================================
// getConstitutionIds
// ============================================

describe('getConstitutionIds', () => {
	it('returns a non-empty array of strings', () => {
		const ids = getConstitutionIds();
		expect(Array.isArray(ids)).toBe(true);
		expect(ids.length).toBeGreaterThan(0);
		for (const id of ids) {
			expect(typeof id).toBe('string');
		}
	});

	it('contains all known IDs', () => {
		const ids = getConstitutionIds();
		for (const id of KNOWN_IDS) {
			expect(ids).toContain(id);
		}
	});

	it('each ID can be loaded successfully', () => {
		for (const id of getConstitutionIds()) {
			expect(loadConstitution(id)).not.toBeNull();
		}
	});
});

// ============================================
// resolveRules
// ============================================

describe('resolveRules', () => {
	it('returns all untriggered rules when no constraints active', () => {
		const constitution = loadConstitution('personal.growth.creative')!;
		const ctx = makeContext({ constraints: {} });
		const result = resolveRules(ctx, constitution);

		// Rules without triggers always apply
		const untriggeredRules = constitution.rules.filter(
			(r) => !r.triggers || r.triggers.length === 0
		);
		expect(result.activeRules.length).toBeGreaterThanOrEqual(untriggeredRules.length);
	});

	it('includes triggered rules when matching constraints are present', () => {
		const constitution = loadConstitution('personal.growth.creative')!;
		const ctx = makeContext({
			constraints: { noise_restricted: true }
		});
		const result = resolveRules(ctx, constitution);

		const noiseRule = result.activeRules.find((r) => r.id === 'noise_sensitivity');
		expect(noiseRule).toBeDefined();
	});

	it('excludes triggered rules when constraints do not match', () => {
		const constitution = loadConstitution('personal.growth.creative')!;
		const ctx = makeContext({ constraints: {} });
		const result = resolveRules(ctx, constitution);

		const noiseRule = result.activeRules.find((r) => r.id === 'noise_sensitivity');
		expect(noiseRule).toBeUndefined();
	});

	it('sorts active rules by weight descending', () => {
		const constitution = loadConstitution('personal.growth.creative')!;
		// Activate all triggers so all rules are included
		const ctx = makeContext({
			constraints: {
				noise_restricted: true,
				budget_limited: true,
				energy_variable: true
			}
		});
		const result = resolveRules(ctx, constitution);

		for (let i = 1; i < result.activeRules.length; i++) {
			expect(result.activeRules[i - 1].weight).toBeGreaterThanOrEqual(
				result.activeRules[i].weight
			);
		}
	});

	it('populates reasoning array for each active rule', () => {
		const constitution = loadConstitution('personal.growth.creative')!;
		const ctx = makeContext({ constraints: { budget_limited: true } });
		const result = resolveRules(ctx, constitution);

		expect(result.reasoning.length).toBe(result.activeRules.length);
	});

	it('records triggered constraints in appliedConstraints', () => {
		const constitution = loadConstitution('personal.growth.creative')!;
		const ctx = makeContext({
			constraints: { noise_restricted: true, budget_limited: true }
		});
		const result = resolveRules(ctx, constitution);

		expect(result.appliedConstraints).toContain('noise_restricted');
		expect(result.appliedConstraints).toContain('budget_limited');
	});

	it('deduplicates applied constraints', () => {
		const constitution = loadConstitution('techcorp.career.advisor')!;
		// workload_high and deadline_approaching both map to time_limited
		const ctx = makeContext({
			constraints: { time_limited: true }
		});
		const result = resolveRules(ctx, constitution);

		const counts: Record<string, number> = {};
		for (const c of result.appliedConstraints) {
			counts[c] = (counts[c] || 0) + 1;
		}
		for (const count of Object.values(counts)) {
			expect(count).toBe(1);
		}
	});

	it('reasoning for triggered rules includes trigger names', () => {
		const constitution = loadConstitution('personal.growth.creative')!;
		const ctx = makeContext({
			constraints: { energy_variable: true }
		});
		const result = resolveRules(ctx, constitution);

		const energyReasoning = result.reasoning.find((r) => r.includes('triggered by'));
		expect(energyReasoning).toBeDefined();
		expect(energyReasoning).toContain('energy_low');
	});

	it('handles context with undefined constraints', () => {
		const constitution = loadConstitution('personal.growth.creative')!;
		const ctx = makeContext();
		// Remove constraints entirely
		delete (ctx as Record<string, unknown>).constraints;
		const result = resolveRules(ctx, constitution);

		// Only untriggered rules should be active
		const untriggeredCount = constitution.rules.filter(
			(r) => !r.triggers || r.triggers.length === 0
		).length;
		expect(result.activeRules.length).toBe(untriggeredCount);
	});

	it('returns empty appliedConstraints when no triggers match', () => {
		const constitution = loadConstitution('personal.growth.creative')!;
		const ctx = makeContext({ constraints: {} });
		const result = resolveRules(ctx, constitution);

		expect(result.appliedConstraints).toEqual([]);
	});

	it('returns false for trigger strings not in the triggerMap (line 314 false path)', () => {
		// personal.responsibility.balance has triggers: 'recurring_request', 'pattern_detected'
		// These are NOT in the triggerMap, so triggerMatches returns false
		const constitution = loadConstitution('personal.responsibility.balance')!;
		const ctx = makeContext({
			constraints: { time_limited: true, budget_limited: true }
		});
		const result = resolveRules(ctx, constitution);

		// 'precedent_awareness' has triggers ['recurring_request', 'pattern_detected']
		// Neither maps to a constraintKey, so the rule should NOT be activated
		const precedentRule = result.activeRules.find((r) => r.id === 'precedent_awareness');
		expect(precedentRule).toBeUndefined();
	});

	it('activates multiple triggered rules from a single constraint', () => {
		const constitution = loadConstitution('techcorp.career.advisor')!;
		const ctx = makeContext({
			constraints: { time_limited: true }
		});
		const result = resolveRules(ctx, constitution);

		// workload_awareness triggers on workload_high and deadline_approaching,
		// both map to time_limited
		const workloadRule = result.activeRules.find((r) => r.id === 'workload_awareness');
		expect(workloadRule).toBeDefined();
	});
});

// ============================================
// getPersonaTone
// ============================================

describe('getPersonaTone', () => {
	const allPersonas: PersonaType[] = [
		'muse',
		'ambassador',
		'godparent',
		'sentinel',
		'anchor',
		'nanny',
		'steward'
	];

	it('returns valid tone guidance for every persona type', () => {
		for (const persona of allPersonas) {
			const tone = getPersonaTone(persona);
			expect(tone).toBeDefined();
			expect(typeof tone.style).toBe('string');
			expect(['casual', 'balanced', 'formal']).toContain(tone.formality);
			expect(['high', 'medium', 'low']).toContain(tone.encouragement);
			expect(['high', 'medium', 'low']).toContain(tone.directness);
			expect(Array.isArray(tone.example_phrases)).toBe(true);
			expect(tone.example_phrases.length).toBeGreaterThan(0);
		}
	});

	it('muse has casual formality and high encouragement', () => {
		const tone = getPersonaTone('muse');
		expect(tone.formality).toBe('casual');
		expect(tone.encouragement).toBe('high');
	});

	it('sentinel has high directness', () => {
		const tone = getPersonaTone('sentinel');
		expect(tone.directness).toBe('high');
	});

	it('ambassador has balanced formality', () => {
		const tone = getPersonaTone('ambassador');
		expect(tone.formality).toBe('balanced');
	});

	it('steward has balanced formality and medium directness', () => {
		const tone = getPersonaTone('steward');
		expect(tone.formality).toBe('balanced');
		expect(tone.directness).toBe('medium');
	});

	it('nanny has casual formality, high encouragement, and low directness', () => {
		const tone = getPersonaTone('nanny');
		expect(tone.formality).toBe('casual');
		expect(tone.encouragement).toBe('high');
		expect(tone.directness).toBe('low');
	});

	it('falls back to ambassador tone for unknown persona', () => {
		const tone = getPersonaTone('nonexistent' as PersonaType);
		const ambassadorTone = getPersonaTone('ambassador');
		expect(tone).toEqual(ambassadorTone);
	});
});

// ============================================
// getActivePersona
// ============================================

describe('getActivePersona', () => {
	it('returns persona from context constitution', () => {
		const ctx = makeContext({
			constitution: {
				id: 'test',
				version: '1.0.0',
				persona: 'sentinel',
				adherence: 3,
				scopes: ['safety']
			}
		});
		expect(getActivePersona(ctx)).toBe('sentinel');
	});

	it('returns muse for the creative constitution', () => {
		const ctx = makeContext();
		expect(getActivePersona(ctx)).toBe('muse');
	});

	it('defaults to ambassador when persona is undefined', () => {
		const ctx = makeContext({
			constitution: {
				id: 'test',
				version: '1.0.0'
			} as VCPContext['constitution']
		});
		expect(getActivePersona(ctx)).toBe('ambassador');
	});

	it('defaults to ambassador when constitution is undefined', () => {
		const ctx = makeContext();
		(ctx as Record<string, unknown>).constitution = undefined;
		expect(getActivePersona(ctx)).toBe('ambassador');
	});

	it('returns each persona type correctly when set', () => {
		const personas: PersonaType[] = [
			'muse',
			'ambassador',
			'godparent',
			'sentinel',
			'anchor',
			'nanny',
			'steward'
		];
		for (const persona of personas) {
			const ctx = makeContext({
				constitution: { id: 'test', version: '1.0.0', persona }
			});
			expect(getActivePersona(ctx)).toBe(persona);
		}
	});
});

// ============================================
// constitutionAppliesToScope
// ============================================

describe('constitutionAppliesToScope', () => {
	it('returns true for scopes listed in the constitution', () => {
		const c = loadConstitution('personal.growth.creative')!;
		expect(constitutionAppliesToScope(c, 'creativity')).toBe(true);
		expect(constitutionAppliesToScope(c, 'health')).toBe(true);
		expect(constitutionAppliesToScope(c, 'privacy')).toBe(true);
	});

	it('returns false for scopes not listed in the constitution', () => {
		const c = loadConstitution('personal.growth.creative')!;
		expect(constitutionAppliesToScope(c, 'work')).toBe(false);
		expect(constitutionAppliesToScope(c, 'finance')).toBe(false);
		expect(constitutionAppliesToScope(c, 'legal')).toBe(false);
	});

	it('techcorp career advisor applies to work and education', () => {
		const c = loadConstitution('techcorp.career.advisor')!;
		expect(constitutionAppliesToScope(c, 'work')).toBe(true);
		expect(constitutionAppliesToScope(c, 'education')).toBe(true);
	});

	it('techcorp career advisor does not apply to creativity', () => {
		const c = loadConstitution('techcorp.career.advisor')!;
		expect(constitutionAppliesToScope(c, 'creativity')).toBe(false);
	});

	it('responsibility balance applies to stewardship', () => {
		const c = loadConstitution('personal.responsibility.balance')!;
		expect(constitutionAppliesToScope(c, 'stewardship')).toBe(true);
	});
});

// ============================================
// getConstitutionsForScope
// ============================================

describe('getConstitutionsForScope', () => {
	it('returns constitutions that include the given scope', () => {
		const result = getConstitutionsForScope('creativity');
		expect(result.length).toBeGreaterThan(0);
		for (const c of result) {
			expect(c.scopes).toContain('creativity');
		}
	});

	it('returns multiple constitutions for shared scopes', () => {
		// creativity is shared by personal.growth.creative and personal.balanced.guide
		const result = getConstitutionsForScope('creativity');
		expect(result.length).toBeGreaterThanOrEqual(2);
	});

	it('returns empty array for a scope with no constitutions', () => {
		const result = getConstitutionsForScope('legal');
		expect(result).toEqual([]);
	});

	it('work scope returns only techcorp constitution', () => {
		const result = getConstitutionsForScope('work');
		expect(result.length).toBe(1);
		expect(result[0].id).toBe('techcorp.career.advisor');
	});

	it('stewardship scope returns responsibility balance', () => {
		const result = getConstitutionsForScope('stewardship');
		expect(result.length).toBe(1);
		expect(result[0].id).toBe('personal.responsibility.balance');
	});

	it('privacy scope returns multiple constitutions', () => {
		const result = getConstitutionsForScope('privacy');
		expect(result.length).toBeGreaterThanOrEqual(2);
		const ids = result.map((c) => c.id);
		expect(ids).toContain('personal.growth.creative');
		expect(ids).toContain('personal.responsibility.balance');
	});
});

// ============================================
// suggestPersonaFromPersonalState
// ============================================

describe('suggestPersonaFromPersonalState', () => {
	it('returns anchor when pressured:5+ and overloaded:4+', () => {
		const state = makePersonalState({
			perceived_urgency: { value: 'pressured', intensity: 5 },
			cognitive_state: { value: 'overloaded', intensity: 4 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('anchor');
	});

	it('returns anchor when pressured:5 and overloaded:5', () => {
		const state = makePersonalState({
			perceived_urgency: { value: 'pressured', intensity: 5 },
			cognitive_state: { value: 'overloaded', intensity: 5 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('anchor');
	});

	it('returns godparent when unwell:3+ and tense:3+', () => {
		const state = makePersonalState({
			body_signals: { value: 'unwell', intensity: 3 },
			emotional_tone: { value: 'tense', intensity: 3 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('godparent');
	});

	it('returns godparent when unwell:5 and tense:5', () => {
		const state = makePersonalState({
			body_signals: { value: 'unwell', intensity: 5 },
			emotional_tone: { value: 'tense', intensity: 5 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('godparent');
	});

	it('returns nanny when overloaded:5', () => {
		const state = makePersonalState({
			cognitive_state: { value: 'overloaded', intensity: 5 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('nanny');
	});

	it('returns ambassador when pressured:4+ alone', () => {
		const state = makePersonalState({
			perceived_urgency: { value: 'pressured', intensity: 4 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('ambassador');
	});

	it('returns ambassador when critical:4+', () => {
		const state = makePersonalState({
			perceived_urgency: { value: 'critical', intensity: 4 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('ambassador');
	});

	it('returns ambassador when critical:5', () => {
		const state = makePersonalState({
			perceived_urgency: { value: 'critical', intensity: 5 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('ambassador');
	});

	it('returns godparent when depleted:4+', () => {
		const state = makePersonalState({
			energy_level: { value: 'depleted', intensity: 4 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('godparent');
	});

	it('returns godparent when depleted:5', () => {
		const state = makePersonalState({
			energy_level: { value: 'depleted', intensity: 5 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('godparent');
	});

	it('returns null for empty state', () => {
		expect(suggestPersonaFromPersonalState({})).toBeNull();
	});

	it('returns null for calm, focused, rested user', () => {
		const state = makePersonalState({
			cognitive_state: { value: 'focused', intensity: 3 },
			emotional_tone: { value: 'calm', intensity: 3 },
			energy_level: { value: 'rested', intensity: 3 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBeNull();
	});

	it('returns null when intensities are below thresholds', () => {
		const state = makePersonalState({
			perceived_urgency: { value: 'pressured', intensity: 3 },
			cognitive_state: { value: 'overloaded', intensity: 2 },
			energy_level: { value: 'depleted', intensity: 3 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBeNull();
	});

	it('returns null for depleted:3 (below threshold of 4)', () => {
		const state = makePersonalState({
			energy_level: { value: 'depleted', intensity: 3 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBeNull();
	});

	it('defaults intensity to 0 when not provided', () => {
		const state = makePersonalState({
			perceived_urgency: { value: 'pressured' },
			cognitive_state: { value: 'overloaded' }
		});
		// intensity defaults to 0, so no thresholds are met
		expect(suggestPersonaFromPersonalState(state)).toBeNull();
	});

	it('anchor takes priority over nanny when both conditions met', () => {
		// pressured:5 + overloaded:5 qualifies for both anchor and nanny
		const state = makePersonalState({
			perceived_urgency: { value: 'pressured', intensity: 5 },
			cognitive_state: { value: 'overloaded', intensity: 5 }
		});
		// anchor check comes first in the code
		expect(suggestPersonaFromPersonalState(state)).toBe('anchor');
	});

	it('godparent (unwell+tense) takes priority over nanny when both qualify', () => {
		// unwell:3 + tense:3, and also overloaded:5 would match nanny
		const state = makePersonalState({
			body_signals: { value: 'unwell', intensity: 3 },
			emotional_tone: { value: 'tense', intensity: 3 },
			cognitive_state: { value: 'overloaded', intensity: 5 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('godparent');
	});

	it('nanny takes priority over ambassador', () => {
		// overloaded:5 matches nanny, pressured:4 matches ambassador
		const state = makePersonalState({
			cognitive_state: { value: 'overloaded', intensity: 5 },
			perceived_urgency: { value: 'pressured', intensity: 4 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBe('nanny');
	});

	it('does not match unwell without tense', () => {
		const state = makePersonalState({
			body_signals: { value: 'unwell', intensity: 5 },
			emotional_tone: { value: 'calm', intensity: 5 }
		});
		// unwell+calm does not trigger the godparent (unwell+tense) rule
		expect(suggestPersonaFromPersonalState(state)).toBeNull();
	});

	it('does not match tense without unwell for the body+emotion rule', () => {
		const state = makePersonalState({
			body_signals: { value: 'neutral', intensity: 5 },
			emotional_tone: { value: 'tense', intensity: 5 }
		});
		expect(suggestPersonaFromPersonalState(state)).toBeNull();
	});
});

// ============================================
// Cross-cutting: constitution data integrity
// ============================================

describe('constitution data integrity', () => {
	it('all constitutions have unique IDs', () => {
		const ids = getConstitutionIds();
		const unique = new Set(ids);
		expect(unique.size).toBe(ids.length);
	});

	it('all constitutions have at least one rule', () => {
		for (const c of getAllConstitutions()) {
			expect(c.rules.length).toBeGreaterThan(0);
		}
	});

	it('all constitutions have at least one scope', () => {
		for (const c of getAllConstitutions()) {
			expect(c.scopes.length).toBeGreaterThan(0);
		}
	});

	it('all constitutions have a version string', () => {
		for (const c of getAllConstitutions()) {
			expect(typeof c.version).toBe('string');
			expect(c.version.length).toBeGreaterThan(0);
		}
	});

	it('all constitutions have adherence between 1 and 5', () => {
		for (const c of getAllConstitutions()) {
			expect(c.adherence).toBeGreaterThanOrEqual(1);
			expect(c.adherence).toBeLessThanOrEqual(5);
		}
	});

	it('all rule weights are between 0 and 1', () => {
		for (const c of getAllConstitutions()) {
			for (const rule of c.rules) {
				expect(rule.weight).toBeGreaterThanOrEqual(0);
				expect(rule.weight).toBeLessThanOrEqual(1);
			}
		}
	});

	it('all rule IDs within a constitution are unique', () => {
		for (const c of getAllConstitutions()) {
			const ruleIds = c.rules.map((r) => r.id);
			const unique = new Set(ruleIds);
			expect(unique.size).toBe(ruleIds.length);
		}
	});

	it('constitutions with sharing_policy have valid structure', () => {
		for (const c of getAllConstitutions()) {
			if (c.sharing_policy) {
				for (const [stakeholder, policy] of Object.entries(c.sharing_policy)) {
					expect(typeof stakeholder).toBe('string');
					if (policy.allowed) {
						expect(Array.isArray(policy.allowed)).toBe(true);
					}
					if (policy.forbidden) {
						expect(Array.isArray(policy.forbidden)).toBe(true);
					}
				}
			}
		}
	});
});
