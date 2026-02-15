import { describe, it, expect } from 'vitest';
import {
	ADAPTATION_RULES,
	EXTENDED_BODY_RULES,
	getAdaptationGuidance,
	buildResponseGuidanceBlock
} from './adaptation-rules';
import type { AdaptationRule } from './adaptation-rules';
import type { PersonalState, PersonalDimension } from './types';

// Valid dimensions from the PersonalState interface
const VALID_DIMENSIONS = [
	'cognitive_state',
	'emotional_tone',
	'energy_level',
	'perceived_urgency',
	'body_signals'
] as const;

describe('ADAPTATION_RULES', () => {
	it('is a non-empty array', () => {
		expect(Array.isArray(ADAPTATION_RULES)).toBe(true);
		expect(ADAPTATION_RULES.length).toBeGreaterThan(0);
	});

	it('each rule has all required fields', () => {
		for (const rule of ADAPTATION_RULES) {
			expect(rule).toHaveProperty('dimension');
			expect(rule).toHaveProperty('value');
			expect(rule).toHaveProperty('minIntensity');
			expect(rule).toHaveProperty('guidance');
			expect(typeof rule.dimension).toBe('string');
			expect(typeof rule.value).toBe('string');
			expect(typeof rule.minIntensity).toBe('number');
			expect(typeof rule.guidance).toBe('string');
		}
	});

	it('each rule references a valid PersonalState dimension', () => {
		for (const rule of ADAPTATION_RULES) {
			expect(VALID_DIMENSIONS).toContain(rule.dimension);
		}
	});

	it('covers all five personal state dimensions', () => {
		const coveredDimensions = new Set(ADAPTATION_RULES.map((r) => r.dimension));
		for (const dim of VALID_DIMENSIONS) {
			expect(coveredDimensions.has(dim)).toBe(true);
		}
	});

	it('all minIntensity values are between 1 and 5', () => {
		for (const rule of ADAPTATION_RULES) {
			expect(rule.minIntensity).toBeGreaterThanOrEqual(1);
			expect(rule.minIntensity).toBeLessThanOrEqual(5);
		}
	});

	it('all maxIntensity values (when present) are between 1 and 5', () => {
		for (const rule of ADAPTATION_RULES) {
			if (rule.maxIntensity !== undefined) {
				expect(rule.maxIntensity).toBeGreaterThanOrEqual(1);
				expect(rule.maxIntensity).toBeLessThanOrEqual(5);
			}
		}
	});

	it('maxIntensity is always >= minIntensity when present', () => {
		for (const rule of ADAPTATION_RULES) {
			if (rule.maxIntensity !== undefined) {
				expect(rule.maxIntensity).toBeGreaterThanOrEqual(rule.minIntensity);
			}
		}
	});

	it('all guidance strings are non-empty', () => {
		for (const rule of ADAPTATION_RULES) {
			expect(rule.guidance.trim().length).toBeGreaterThan(0);
		}
	});

	it('all value strings are non-empty', () => {
		for (const rule of ADAPTATION_RULES) {
			expect(rule.value.trim().length).toBeGreaterThan(0);
		}
	});
});

describe('EXTENDED_BODY_RULES', () => {
	it('is a non-empty object', () => {
		expect(typeof EXTENDED_BODY_RULES).toBe('object');
		expect(Object.keys(EXTENDED_BODY_RULES).length).toBeGreaterThan(0);
	});

	it('has expected sub-signal keys', () => {
		const expectedKeys = ['bathroom', 'hunger', 'sensory', 'medication', 'movement', 'thirst'];
		for (const key of expectedKeys) {
			expect(EXTENDED_BODY_RULES).toHaveProperty(key);
		}
	});

	it('all values are non-empty strings', () => {
		for (const [key, value] of Object.entries(EXTENDED_BODY_RULES)) {
			expect(typeof value).toBe('string');
			expect(value.trim().length).toBeGreaterThan(0);
		}
	});
});

describe('getAdaptationGuidance', () => {
	it('returns empty array when state is undefined', () => {
		expect(getAdaptationGuidance(undefined)).toEqual([]);
	});

	it('returns empty array when state is empty object', () => {
		expect(getAdaptationGuidance({})).toEqual([]);
	});

	it('returns guidance for a matching cognitive_state rule', () => {
		const state: PersonalState = {
			cognitive_state: { value: 'focused', intensity: 3 }
		};
		const result = getAdaptationGuidance(state);
		expect(result.length).toBeGreaterThan(0);
		expect(result).toContain('Support flow state, minimal interruption.');
	});

	it('returns guidance for a matching emotional_tone rule', () => {
		const state: PersonalState = {
			emotional_tone: { value: 'frustrated', intensity: 3 }
		};
		const result = getAdaptationGuidance(state);
		expect(result.length).toBeGreaterThan(0);
		expect(result).toContain('Acknowledge frustration. Skip preamble. Get to solutions.');
	});

	it('returns guidance for energy_level', () => {
		const state: PersonalState = {
			energy_level: { value: 'fatigued', intensity: 4 }
		};
		const result = getAdaptationGuidance(state);
		expect(result).toContain('Gentler tone, simplify, chunk, suggest breaks.');
	});

	it('returns guidance for perceived_urgency', () => {
		const state: PersonalState = {
			perceived_urgency: { value: 'critical', intensity: 5 }
		};
		const result = getAdaptationGuidance(state);
		expect(result).toContain('Absolute minimum. No pleasantries. Emergency mode.');
	});

	it('returns guidance for body_signals', () => {
		const state: PersonalState = {
			body_signals: { value: 'pain', intensity: 4 }
		};
		const result = getAdaptationGuidance(state);
		expect(result).toContain('Very gentle tone, minimal demands, offer deferrals.');
	});

	it('does not return guidance when intensity is below minIntensity', () => {
		const state: PersonalState = {
			cognitive_state: { value: 'distracted', intensity: 1 }
		};
		const result = getAdaptationGuidance(state);
		// The distracted rule requires minIntensity: 3
		expect(result).not.toContain('Structure clearly, use headings, shorter chunks.');
	});

	it('does not return guidance when intensity exceeds maxIntensity', () => {
		const state: PersonalState = {
			cognitive_state: { value: 'overloaded', intensity: 5 }
		};
		const result = getAdaptationGuidance(state);
		// overloaded minIntensity:3 maxIntensity:4 should NOT match at intensity 5
		expect(result).not.toContain('Reduce options, one thing at a time.');
		// But overloaded minIntensity:5 (no max) SHOULD match
		expect(result).toContain(
			'Absolute minimum. Yes/no questions only. Make recommendations instead of listing options.'
		);
	});

	it('defaults to intensity 3 when intensity is not specified', () => {
		const state: PersonalState = {
			cognitive_state: { value: 'distracted' }
		};
		const result = getAdaptationGuidance(state);
		// distracted has minIntensity: 3, default intensity is 3 => should match
		expect(result).toContain('Structure clearly, use headings, shorter chunks.');
	});

	it('returns multiple guidance strings when multiple rules match', () => {
		const state: PersonalState = {
			cognitive_state: { value: 'overloaded', intensity: 5 },
			emotional_tone: { value: 'tense', intensity: 5 },
			energy_level: { value: 'depleted', intensity: 5 }
		};
		const result = getAdaptationGuidance(state);
		expect(result.length).toBeGreaterThanOrEqual(3);
	});

	it('includes extended body signal guidance when present', () => {
		const state: PersonalState = {
			body_signals: { value: 'neutral', intensity: 1, extended: 'hunger' }
		};
		const result = getAdaptationGuidance(state);
		expect(result).toContain('Keep response brief. Acknowledge if conversation can wait.');
	});

	it('does not include extended guidance for unknown sub-signals', () => {
		const state: PersonalState = {
			body_signals: { value: 'neutral', intensity: 1, extended: 'unknown_signal' }
		};
		const result = getAdaptationGuidance(state);
		// Should still get 'Normal interaction.' from the neutral body_signals rule
		expect(result).toContain('Normal interaction.');
		// But no extended guidance
		expect(result.length).toBe(1);
	});

	it('combines main rules and extended body signal guidance', () => {
		const state: PersonalState = {
			body_signals: { value: 'discomfort', intensity: 3, extended: 'bathroom' }
		};
		const result = getAdaptationGuidance(state);
		expect(result).toContain('Check in, offer to defer if needed.');
		expect(result).toContain('Wrap up gracefully. Suggest continuing later.');
	});

	it('does not match when value does not correspond to dimension', () => {
		const state: PersonalState = {
			cognitive_state: { value: 'calm' as any, intensity: 3 }
		};
		const result = getAdaptationGuidance(state);
		// 'calm' is an emotional_tone value, not cognitive_state
		// No cognitive_state rule has value 'calm', so nothing should match
		expect(result).toEqual([]);
	});
});

describe('buildResponseGuidanceBlock', () => {
	it('returns empty string when state is undefined', () => {
		expect(buildResponseGuidanceBlock(undefined)).toBe('');
	});

	it('returns empty string when no rules match', () => {
		expect(buildResponseGuidanceBlock({})).toBe('');
	});

	it('returns formatted markdown block with matching guidance', () => {
		const state: PersonalState = {
			cognitive_state: { value: 'focused', intensity: 3 }
		};
		const result = buildResponseGuidanceBlock(state);
		expect(result).toContain('## Personal State Adaptations');
		expect(result).toContain('- Support flow state, minimal interruption.');
	});

	it('includes all matching guidance as bullet points', () => {
		const state: PersonalState = {
			cognitive_state: { value: 'overloaded', intensity: 5 },
			emotional_tone: { value: 'frustrated', intensity: 5 }
		};
		const result = buildResponseGuidanceBlock(state);
		const bulletLines = result
			.split('\n')
			.filter((line) => line.startsWith('- '));
		expect(bulletLines.length).toBeGreaterThanOrEqual(2);
	});

	it('starts with a newline followed by the heading', () => {
		const state: PersonalState = {
			energy_level: { value: 'rested', intensity: 1 }
		};
		const result = buildResponseGuidanceBlock(state);
		expect(result.startsWith('\n## Personal State Adaptations')).toBe(true);
	});
});
