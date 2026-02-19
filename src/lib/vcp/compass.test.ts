import { describe, it, expect } from 'vitest';
import {
	deriveConstitutions,
	deriveGenerationPrefs,
	deriveDimensionalModifiers,
	CONSTITUTION_MAP
} from './compass';
import type { CompassProfile, ConstitutionInfo, CommunicationStyle, ExplanationLevel, RiskTolerance } from './compass';

// ============================================
// Helper: blank profile factory
// ============================================

function makeProfile(overrides: Partial<CompassProfile> = {}): CompassProfile {
	return {
		metaethics: null,
		epistemology: null,
		optimize_for: null,
		risk_tolerance: null,
		communication_style: null,
		explanations: null,
		...overrides
	};
}

// ============================================
// CONSTITUTION_MAP
// ============================================

describe('CONSTITUTION_MAP', () => {
	it('contains exactly 12 entries', () => {
		expect(Object.keys(CONSTITUTION_MAP)).toHaveLength(12);
	});

	it('contains all 4 metaethics entries', () => {
		const metaethicsKeys = ['consequentialist', 'deontological', 'virtue_ethics', 'anti_realist'];
		for (const key of metaethicsKeys) {
			expect(CONSTITUTION_MAP[key]).toBeDefined();
			expect(CONSTITUTION_MAP[key].id).toBe(key);
			expect(CONSTITUTION_MAP[key].path).toContain('modules/metaethics/');
		}
	});

	it('contains all 4 epistemology entries', () => {
		const epistemologyKeys = ['empiricist', 'rationalist', 'pragmatist', 'skeptic'];
		for (const key of epistemologyKeys) {
			expect(CONSTITUTION_MAP[key]).toBeDefined();
			expect(CONSTITUTION_MAP[key].id).toBe(key);
			expect(CONSTITUTION_MAP[key].path).toContain('modules/epistemology/');
		}
	});

	it('contains all 4 optimize_for (values) entries', () => {
		const valuesKeys = ['stability', 'growth', 'freedom', 'connection'];
		for (const key of valuesKeys) {
			expect(CONSTITUTION_MAP[key]).toBeDefined();
			expect(CONSTITUTION_MAP[key].id).toBe(key);
			expect(CONSTITUTION_MAP[key].path).toContain('modules/values/');
		}
	});

	it('every entry has id, path, title, and description as non-empty strings', () => {
		for (const [key, info] of Object.entries(CONSTITUTION_MAP)) {
			expect(info.id).toBe(key);
			expect(info.path.length).toBeGreaterThan(0);
			expect(info.title.length).toBeGreaterThan(0);
			expect(info.description.length).toBeGreaterThan(0);
		}
	});

	it('entry IDs match their map keys', () => {
		for (const [key, info] of Object.entries(CONSTITUTION_MAP)) {
			expect(info.id).toBe(key);
		}
	});
});

// ============================================
// deriveConstitutions
// ============================================

describe('deriveConstitutions', () => {
	it('returns empty array for a blank profile', () => {
		const result = deriveConstitutions(makeProfile());
		expect(result).toEqual([]);
	});

	it('returns a single constitution when only metaethics is set', () => {
		const result = deriveConstitutions(makeProfile({ metaethics: 'consequentialist' }));
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('consequentialist');
	});

	it('returns a single constitution when only epistemology is set', () => {
		const result = deriveConstitutions(makeProfile({ epistemology: 'empiricist' }));
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('empiricist');
	});

	it('returns a single constitution when only optimize_for is set', () => {
		const result = deriveConstitutions(makeProfile({ optimize_for: 'growth' }));
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('growth');
	});

	it('returns 3 items in correct order when all three are set', () => {
		const result = deriveConstitutions(
			makeProfile({
				metaethics: 'deontological',
				epistemology: 'rationalist',
				optimize_for: 'stability'
			})
		);
		expect(result).toHaveLength(3);
		// Order: metaethics first, epistemology second, optimize_for third
		expect(result[0].id).toBe('deontological');
		expect(result[1].id).toBe('rationalist');
		expect(result[2].id).toBe('stability');
	});

	it('returns 2 items when metaethics + epistemology set (no optimize_for)', () => {
		const result = deriveConstitutions(
			makeProfile({ metaethics: 'virtue_ethics', epistemology: 'skeptic' })
		);
		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('virtue_ethics');
		expect(result[1].id).toBe('skeptic');
	});

	it('returns 2 items when metaethics + optimize_for set (no epistemology)', () => {
		const result = deriveConstitutions(
			makeProfile({ metaethics: 'anti_realist', optimize_for: 'freedom' })
		);
		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('anti_realist');
		expect(result[1].id).toBe('freedom');
	});

	it('returns 2 items when epistemology + optimize_for set (no metaethics)', () => {
		const result = deriveConstitutions(
			makeProfile({ epistemology: 'pragmatist', optimize_for: 'connection' })
		);
		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('pragmatist');
		expect(result[1].id).toBe('connection');
	});

	it('ignores non-constitution fields like risk_tolerance and communication_style', () => {
		const result = deriveConstitutions(
			makeProfile({
				risk_tolerance: 'aggressive',
				communication_style: 'direct',
				explanations: 'detailed'
			})
		);
		expect(result).toEqual([]);
	});

	it('returns correct ConstitutionInfo shape for each result', () => {
		const result = deriveConstitutions(makeProfile({ metaethics: 'consequentialist' }));
		const info: ConstitutionInfo = result[0];
		expect(info).toHaveProperty('id');
		expect(info).toHaveProperty('path');
		expect(info).toHaveProperty('title');
		expect(info).toHaveProperty('description');
		expect(info.id).toBe('consequentialist');
		expect(info.path).toBe('modules/metaethics/consequentialist.md');
		expect(info.title).toBe('Consequentialism');
	});

	it('tests every metaethics value', () => {
		const values = ['consequentialist', 'deontological', 'virtue_ethics', 'anti_realist'] as const;
		for (const v of values) {
			const result = deriveConstitutions(makeProfile({ metaethics: v }));
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe(v);
		}
	});

	it('tests every epistemology value', () => {
		const values = ['empiricist', 'rationalist', 'pragmatist', 'skeptic'] as const;
		for (const v of values) {
			const result = deriveConstitutions(makeProfile({ epistemology: v }));
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe(v);
		}
	});

	it('tests every optimize_for value', () => {
		const values = ['stability', 'growth', 'freedom', 'connection'] as const;
		for (const v of values) {
			const result = deriveConstitutions(makeProfile({ optimize_for: v }));
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe(v);
		}
	});
});

// ============================================
// deriveGenerationPrefs
// ============================================

describe('deriveGenerationPrefs', () => {
	it('returns empty object for a blank profile', () => {
		const result = deriveGenerationPrefs(makeProfile());
		expect(result).toEqual({});
	});

	// --- communication_style only ---

	it('returns formality and directness when communication_style is gentle', () => {
		const result = deriveGenerationPrefs(makeProfile({ communication_style: 'gentle' }));
		expect(result).toEqual({ formality: 0.7, directness: 0.3 });
	});

	it('returns formality and directness when communication_style is balanced', () => {
		const result = deriveGenerationPrefs(makeProfile({ communication_style: 'balanced' }));
		expect(result).toEqual({ formality: 0.5, directness: 0.5 });
	});

	it('returns formality and directness when communication_style is direct', () => {
		const result = deriveGenerationPrefs(makeProfile({ communication_style: 'direct' }));
		expect(result).toEqual({ formality: 0.3, directness: 0.8 });
	});

	// --- explanations only ---

	it('returns depth and technical_level when explanations is minimal', () => {
		const result = deriveGenerationPrefs(makeProfile({ explanations: 'minimal' }));
		expect(result).toEqual({ depth: 0.2, technical_level: 0.3 });
	});

	it('returns depth and technical_level when explanations is brief', () => {
		const result = deriveGenerationPrefs(makeProfile({ explanations: 'brief' }));
		expect(result).toEqual({ depth: 0.5, technical_level: 0.5 });
	});

	it('returns depth and technical_level when explanations is detailed', () => {
		const result = deriveGenerationPrefs(makeProfile({ explanations: 'detailed' }));
		expect(result).toEqual({ depth: 0.9, technical_level: 0.7 });
	});

	// --- both set ---

	it('returns all 4 keys when both communication_style and explanations are set', () => {
		const result = deriveGenerationPrefs(
			makeProfile({ communication_style: 'direct', explanations: 'detailed' })
		);
		expect(result).toEqual({
			formality: 0.3,
			directness: 0.8,
			depth: 0.9,
			technical_level: 0.7
		});
	});

	it('returns all 4 keys for gentle + minimal combination', () => {
		const result = deriveGenerationPrefs(
			makeProfile({ communication_style: 'gentle', explanations: 'minimal' })
		);
		expect(result).toEqual({
			formality: 0.7,
			directness: 0.3,
			depth: 0.2,
			technical_level: 0.3
		});
	});

	it('returns all 4 keys for balanced + brief combination', () => {
		const result = deriveGenerationPrefs(
			makeProfile({ communication_style: 'balanced', explanations: 'brief' })
		);
		expect(result).toEqual({
			formality: 0.5,
			directness: 0.5,
			depth: 0.5,
			technical_level: 0.5
		});
	});

	// --- non-pref fields are ignored ---

	it('ignores metaethics, epistemology, optimize_for, and risk_tolerance', () => {
		const result = deriveGenerationPrefs(
			makeProfile({
				metaethics: 'consequentialist',
				epistemology: 'empiricist',
				optimize_for: 'growth',
				risk_tolerance: 'aggressive'
			})
		);
		expect(result).toEqual({});
	});

	// --- exhaustive communication_style x explanations matrix ---

	it('covers all communication_style values correctly', () => {
		const expected: Record<CommunicationStyle, { formality: number; directness: number }> = {
			gentle: { formality: 0.7, directness: 0.3 },
			balanced: { formality: 0.5, directness: 0.5 },
			direct: { formality: 0.3, directness: 0.8 }
		};
		for (const [style, vals] of Object.entries(expected)) {
			const result = deriveGenerationPrefs(
				makeProfile({ communication_style: style as CommunicationStyle })
			);
			expect(result.formality).toBe(vals.formality);
			expect(result.directness).toBe(vals.directness);
		}
	});

	it('covers all explanation levels correctly', () => {
		const expected: Record<ExplanationLevel, { depth: number; technical_level: number }> = {
			minimal: { depth: 0.2, technical_level: 0.3 },
			brief: { depth: 0.5, technical_level: 0.5 },
			detailed: { depth: 0.9, technical_level: 0.7 }
		};
		for (const [level, vals] of Object.entries(expected)) {
			const result = deriveGenerationPrefs(
				makeProfile({ explanations: level as ExplanationLevel })
			);
			expect(result.depth).toBe(vals.depth);
			expect(result.technical_level).toBe(vals.technical_level);
		}
	});
});

// ============================================
// deriveDimensionalModifiers
// ============================================

describe('deriveDimensionalModifiers', () => {
	it('returns empty object when no risk_tolerance is set', () => {
		const result = deriveDimensionalModifiers(makeProfile());
		expect(result).toEqual({});
	});

	it('returns correct modifiers for conservative', () => {
		const result = deriveDimensionalModifiers(makeProfile({ risk_tolerance: 'conservative' }));
		expect(result).toEqual({ trust_default: -0.15, rule_rigidity: 0.15 });
	});

	it('returns correct modifiers for calculated', () => {
		const result = deriveDimensionalModifiers(makeProfile({ risk_tolerance: 'calculated' }));
		expect(result).toEqual({ trust_default: 0, rule_rigidity: 0 });
	});

	it('returns correct modifiers for aggressive', () => {
		const result = deriveDimensionalModifiers(makeProfile({ risk_tolerance: 'aggressive' }));
		expect(result).toEqual({ trust_default: 0.15, rule_rigidity: -0.15 });
	});

	it('ignores other profile fields (only risk_tolerance matters)', () => {
		const result = deriveDimensionalModifiers(
			makeProfile({
				metaethics: 'deontological',
				epistemology: 'rationalist',
				optimize_for: 'stability',
				communication_style: 'gentle',
				explanations: 'detailed',
				risk_tolerance: 'aggressive'
			})
		);
		expect(result).toEqual({ trust_default: 0.15, rule_rigidity: -0.15 });
	});

	it('returns only trust_default and rule_rigidity keys', () => {
		const result = deriveDimensionalModifiers(makeProfile({ risk_tolerance: 'conservative' }));
		expect(Object.keys(result).sort()).toEqual(['rule_rigidity', 'trust_default']);
	});

	it('covers all RiskTolerance values exhaustively', () => {
		const expected: Record<RiskTolerance, { trust_default: number; rule_rigidity: number }> = {
			conservative: { trust_default: -0.15, rule_rigidity: 0.15 },
			calculated: { trust_default: 0, rule_rigidity: 0 },
			aggressive: { trust_default: 0.15, rule_rigidity: -0.15 }
		};
		for (const [tolerance, vals] of Object.entries(expected)) {
			const result = deriveDimensionalModifiers(
				makeProfile({ risk_tolerance: tolerance as RiskTolerance })
			);
			expect(result.trust_default).toBe(vals.trust_default);
			expect(result.rule_rigidity).toBe(vals.rule_rigidity);
		}
	});

	it('returns an empty plain object (not null/undefined) when no risk_tolerance', () => {
		const result = deriveDimensionalModifiers(makeProfile({ risk_tolerance: null }));
		expect(result).toBeDefined();
		expect(result).not.toBeNull();
		expect(typeof result).toBe('object');
		expect(Object.keys(result)).toHaveLength(0);
	});
});

// ============================================
// Cross-function integration
// ============================================

describe('cross-function integration', () => {
	it('a fully-filled profile produces constitutions, gen prefs, and modifiers', () => {
		const profile = makeProfile({
			metaethics: 'virtue_ethics',
			epistemology: 'pragmatist',
			optimize_for: 'connection',
			risk_tolerance: 'calculated',
			communication_style: 'balanced',
			explanations: 'brief'
		});

		const constitutions = deriveConstitutions(profile);
		const prefs = deriveGenerationPrefs(profile);
		const mods = deriveDimensionalModifiers(profile);

		expect(constitutions).toHaveLength(3);
		expect(Object.keys(prefs)).toHaveLength(4);
		expect(Object.keys(mods)).toHaveLength(2);
	});

	it('a profile with only non-constitution fields produces no constitutions but has prefs/mods', () => {
		const profile = makeProfile({
			risk_tolerance: 'aggressive',
			communication_style: 'direct',
			explanations: 'minimal'
		});

		const constitutions = deriveConstitutions(profile);
		const prefs = deriveGenerationPrefs(profile);
		const mods = deriveDimensionalModifiers(profile);

		expect(constitutions).toHaveLength(0);
		expect(Object.keys(prefs)).toHaveLength(4);
		expect(Object.keys(mods)).toHaveLength(2);
	});

	it('a profile with only constitution fields produces constitutions but no prefs/mods', () => {
		const profile = makeProfile({
			metaethics: 'consequentialist',
			epistemology: 'empiricist',
			optimize_for: 'stability'
		});

		const constitutions = deriveConstitutions(profile);
		const prefs = deriveGenerationPrefs(profile);
		const mods = deriveDimensionalModifiers(profile);

		expect(constitutions).toHaveLength(3);
		expect(Object.keys(prefs)).toHaveLength(0);
		expect(Object.keys(mods)).toHaveLength(0);
	});
});
