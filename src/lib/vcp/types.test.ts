import { describe, it, expect } from 'vitest';
import { DEFAULT_FEATURES } from './types';

describe('DEFAULT_FEATURES', () => {
	const EXPECTED_TRUE_FLAGS = [
		'PROF_MORNING_JOURNEY',
		'PROF_EVENING_JOURNEY',
		'PROF_CONFLICT_JOURNEY',
		'PERS_PROFILE_WIZARD',
		'PERS_JUSTINGUITAR',
		'PERS_YOUSICIAN',
		'PERS_MUSICSHOP',
		'PERS_COACH_VIEW',
		'PERS_FULL_AUDIT',
		'RESP_DECISION_JOURNEY',
		'RESP_REFLECTION_JOURNEY',
		'RESP_LIVE_LLM'
	] as const;

	const EXPECTED_FALSE_FLAGS = ['PROF_PROFILE_EDITOR', 'REAL_CRYPTO', 'CLOUD_SYNC'] as const;

	it('has exactly 15 feature flags', () => {
		expect(Object.keys(DEFAULT_FEATURES)).toHaveLength(15);
	});

	it('contains all expected keys', () => {
		const allExpected = [...EXPECTED_TRUE_FLAGS, ...EXPECTED_FALSE_FLAGS];
		for (const key of allExpected) {
			expect(DEFAULT_FEATURES).toHaveProperty(key);
		}
	});

	it('has no unexpected keys', () => {
		const allExpected = new Set([...EXPECTED_TRUE_FLAGS, ...EXPECTED_FALSE_FLAGS]);
		for (const key of Object.keys(DEFAULT_FEATURES)) {
			expect(allExpected.has(key)).toBe(true);
		}
	});

	it.each([...EXPECTED_TRUE_FLAGS])('%s defaults to true', (flag) => {
		expect(DEFAULT_FEATURES[flag]).toBe(true);
	});

	it('PROF_PROFILE_EDITOR defaults to false', () => {
		expect(DEFAULT_FEATURES.PROF_PROFILE_EDITOR).toBe(false);
	});

	it('REAL_CRYPTO defaults to false', () => {
		expect(DEFAULT_FEATURES.REAL_CRYPTO).toBe(false);
	});

	it('CLOUD_SYNC defaults to false', () => {
		expect(DEFAULT_FEATURES.CLOUD_SYNC).toBe(false);
	});

	it('all values are booleans', () => {
		for (const [key, value] of Object.entries(DEFAULT_FEATURES)) {
			expect(typeof value).toBe('boolean');
		}
	});
});
