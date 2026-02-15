import { describe, it, expect } from 'vitest';
import { generateConstitutionCode, PERSONA_INITIALS, SCOPE_INITIALS } from './constitution-codes';
import type { ConstitutionReference, PersonaType, ScopeType } from './types';

function makeRef(overrides: Partial<ConstitutionReference> = {}): ConstitutionReference {
	return {
		id: 'test-constitution',
		version: '1.0',
		persona: 'ambassador',
		adherence: 3,
		scopes: ['work', 'education'],
		...overrides
	};
}

// ============================================
// PERSONA_INITIALS
// ============================================

describe('PERSONA_INITIALS', () => {
	it('is a non-empty object', () => {
		expect(Object.keys(PERSONA_INITIALS).length).toBeGreaterThan(0);
	});

	it('has initials for all PersonaType values', () => {
		const allPersonas: PersonaType[] = [
			'ambassador', 'godparent', 'muse', 'sentinel', 'nanny', 'mediator'
		];
		for (const persona of allPersonas) {
			expect(PERSONA_INITIALS[persona]).toBeDefined();
			expect(typeof PERSONA_INITIALS[persona]).toBe('string');
			expect(PERSONA_INITIALS[persona].length).toBeGreaterThan(0);
		}
	});

	it('maps ambassador to A', () => {
		expect(PERSONA_INITIALS.ambassador).toBe('A');
	});

	it('maps godparent to G', () => {
		expect(PERSONA_INITIALS.godparent).toBe('G');
	});

	it('maps muse to M', () => {
		expect(PERSONA_INITIALS.muse).toBe('M');
	});

	it('maps sentinel to Se', () => {
		expect(PERSONA_INITIALS.sentinel).toBe('Se');
	});

	it('maps nanny to N', () => {
		expect(PERSONA_INITIALS.nanny).toBe('N');
	});

	it('maps mediator to Me', () => {
		expect(PERSONA_INITIALS.mediator).toBe('Me');
	});

	it('has exactly 6 persona types', () => {
		expect(Object.keys(PERSONA_INITIALS).length).toBe(6);
	});
});

// ============================================
// SCOPE_INITIALS
// ============================================

describe('SCOPE_INITIALS', () => {
	it('is a non-empty object', () => {
		expect(Object.keys(SCOPE_INITIALS).length).toBeGreaterThan(0);
	});

	it('has initials for all ScopeType values', () => {
		const allScopes: ScopeType[] = [
			'work', 'education', 'creativity', 'health', 'privacy', 'family',
			'finance', 'social', 'legal', 'safety', 'stewardship', 'commerce',
			'compliance', 'ethics', 'coordination', 'transparency', 'governance',
			'epistemic', 'accuracy'
		];
		for (const scope of allScopes) {
			expect(SCOPE_INITIALS[scope]).toBeDefined();
			expect(typeof SCOPE_INITIALS[scope]).toBe('string');
			expect(SCOPE_INITIALS[scope].length).toBeGreaterThan(0);
		}
	});

	it('maps work to W', () => {
		expect(SCOPE_INITIALS.work).toBe('W');
	});

	it('maps education to E', () => {
		expect(SCOPE_INITIALS.education).toBe('E');
	});

	it('maps creativity to C', () => {
		expect(SCOPE_INITIALS.creativity).toBe('C');
	});

	it('maps health to H', () => {
		expect(SCOPE_INITIALS.health).toBe('H');
	});

	it('maps privacy to P', () => {
		expect(SCOPE_INITIALS.privacy).toBe('P');
	});

	it('maps finance to Fi', () => {
		expect(SCOPE_INITIALS.finance).toBe('Fi');
	});

	it('maps stewardship to Sw', () => {
		expect(SCOPE_INITIALS.stewardship).toBe('Sw');
	});

	it('maps governance to Go', () => {
		expect(SCOPE_INITIALS.governance).toBe('Go');
	});

	it('maps epistemic to Ep', () => {
		expect(SCOPE_INITIALS.epistemic).toBe('Ep');
	});

	it('maps accuracy to Ac', () => {
		expect(SCOPE_INITIALS.accuracy).toBe('Ac');
	});

	it('has exactly 19 scope types', () => {
		expect(Object.keys(SCOPE_INITIALS).length).toBe(19);
	});
});

// ============================================
// generateConstitutionCode
// ============================================

describe('generateConstitutionCode', () => {
	describe('basic code generation', () => {
		it('generates A3+W+E for ambassador adherence 3 with work and education', () => {
			const ref = makeRef({ persona: 'ambassador', adherence: 3, scopes: ['work', 'education'] });
			expect(generateConstitutionCode(ref)).toBe('A3+W+E');
		});

		it('generates Me4+Sw+P for mediator adherence 4 with stewardship and privacy', () => {
			const ref = makeRef({ persona: 'mediator', adherence: 4, scopes: ['stewardship', 'privacy'] });
			expect(generateConstitutionCode(ref)).toBe('Me4+Sw+P');
		});

		it('generates M3+C+H+P for muse adherence 3 with creativity, health, privacy', () => {
			const ref = makeRef({ persona: 'muse', adherence: 3, scopes: ['creativity', 'health', 'privacy'] });
			expect(generateConstitutionCode(ref)).toBe('M3+C+H+P');
		});

		it('generates G5+F for godparent adherence 5 with family', () => {
			const ref = makeRef({ persona: 'godparent', adherence: 5, scopes: ['family'] });
			expect(generateConstitutionCode(ref)).toBe('G5+F');
		});

		it('generates Se1+Sa for sentinel adherence 1 with safety', () => {
			const ref = makeRef({ persona: 'sentinel', adherence: 1, scopes: ['safety'] });
			expect(generateConstitutionCode(ref)).toBe('Se1+Sa');
		});

		it('generates N4+H+F for nanny adherence 4 with health and family', () => {
			const ref = makeRef({ persona: 'nanny', adherence: 4, scopes: ['health', 'family'] });
			expect(generateConstitutionCode(ref)).toBe('N4+H+F');
		});
	});

	describe('all scope types produce valid codes', () => {
		const allScopes: ScopeType[] = [
			'work', 'education', 'creativity', 'health', 'privacy', 'family',
			'finance', 'social', 'legal', 'safety', 'stewardship', 'commerce',
			'compliance', 'ethics', 'coordination', 'transparency', 'governance',
			'epistemic', 'accuracy'
		];

		for (const scope of allScopes) {
			it(`includes ${scope} scope in generated code`, () => {
				const ref = makeRef({ scopes: [scope] });
				const code = generateConstitutionCode(ref);
				expect(code).toContain(SCOPE_INITIALS[scope]);
			});
		}
	});

	describe('all persona types produce valid codes', () => {
		const allPersonas: PersonaType[] = [
			'ambassador', 'godparent', 'muse', 'sentinel', 'nanny', 'mediator'
		];

		for (const persona of allPersonas) {
			it(`starts with ${persona} initials`, () => {
				const ref = makeRef({ persona });
				const code = generateConstitutionCode(ref);
				expect(code.startsWith(PERSONA_INITIALS[persona])).toBe(true);
			});
		}
	});

	describe('missing/undefined fields', () => {
		it('uses ? for missing persona', () => {
			const ref = makeRef({ persona: undefined });
			const code = generateConstitutionCode(ref);
			expect(code.startsWith('?')).toBe(true);
		});

		it('uses ? for missing adherence', () => {
			const ref = makeRef({ adherence: undefined });
			const code = generateConstitutionCode(ref);
			expect(code).toContain('?+');
		});

		it('uses ? for missing scopes', () => {
			const ref = makeRef({ scopes: undefined });
			const code = generateConstitutionCode(ref);
			expect(code.endsWith('+?')).toBe(true);
		});

		it('uses ? for empty scopes array', () => {
			const ref = makeRef({ scopes: [] });
			const code = generateConstitutionCode(ref);
			expect(code.endsWith('+?')).toBe(true);
		});

		it('generates ??+? when all fields missing', () => {
			const ref: ConstitutionReference = { id: 'empty', version: '1.0' };
			const code = generateConstitutionCode(ref);
			expect(code).toBe('??+?');
		});
	});

	describe('code format', () => {
		it('always contains a + separator', () => {
			const ref = makeRef();
			const code = generateConstitutionCode(ref);
			expect(code).toContain('+');
		});

		it('format is PersonaInitial + Adherence + Scopes joined by +', () => {
			const ref = makeRef({ persona: 'ambassador', adherence: 3, scopes: ['work', 'education'] });
			const code = generateConstitutionCode(ref);
			// Should be "A" + "3" + "+" + "W" + "+" + "E"
			expect(code).toMatch(/^[A-Z][a-z]?\d\+[A-Z][a-z]?(\+[A-Z][a-z]?)*$/);
		});

		it('multiple scopes are joined with +', () => {
			const ref = makeRef({ scopes: ['work', 'education', 'creativity'] });
			const code = generateConstitutionCode(ref);
			const parts = code.split('+');
			expect(parts.length).toBe(4); // persona+adherence, then 3 scopes
		});

		it('single scope produces two parts separated by +', () => {
			const ref = makeRef({ scopes: ['work'] });
			const code = generateConstitutionCode(ref);
			const parts = code.split('+');
			expect(parts.length).toBe(2);
		});
	});

	describe('adherence values', () => {
		it('includes adherence 1 in code', () => {
			const ref = makeRef({ adherence: 1 });
			const code = generateConstitutionCode(ref);
			expect(code).toMatch(/A1\+/);
		});

		it('includes adherence 5 in code', () => {
			const ref = makeRef({ adherence: 5 });
			const code = generateConstitutionCode(ref);
			expect(code).toMatch(/A5\+/);
		});
	});

	describe('unknown scope values use ?', () => {
		it('produces ? for a scope not in SCOPE_INITIALS', () => {
			const ref = makeRef({ scopes: ['nonexistent_scope' as ScopeType] });
			const code = generateConstitutionCode(ref);
			expect(code).toContain('?');
		});
	});

	describe('unknown persona values use ?', () => {
		it('produces ? for a persona not in PERSONA_INITIALS', () => {
			const ref = makeRef({ persona: 'unknown_persona' as PersonaType });
			const code = generateConstitutionCode(ref);
			expect(code.startsWith('?')).toBe(true);
		});
	});
});
