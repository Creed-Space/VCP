/**
 * Constitution Code Generator
 *
 * Generates compact constitution codes like A3+W+E from
 * ConstitutionReference objects. Used in UI badges and
 * the comparison table.
 */

import type { ConstitutionReference, PersonaType, ScopeType } from './types';

const PERSONA_INITIALS: Record<PersonaType, string> = {
	ambassador: 'A',
	godparent: 'G',
	muse: 'M',
	sentinel: 'Se',
	anchor: 'An',
	nanny: 'N',
	steward: 'St'
};

const SCOPE_INITIALS: Record<ScopeType, string> = {
	work: 'W',
	education: 'E',
	creativity: 'C',
	health: 'H',
	privacy: 'P',
	family: 'F',
	finance: 'Fi',
	social: 'So',
	legal: 'L',
	safety: 'Sa',
	stewardship: 'Sw',
	commerce: 'Co',
	compliance: 'Cm',
	ethics: 'Et',
	coordination: 'Cd',
	transparency: 'Tr',
	governance: 'Go',
	epistemic: 'Ep',
	accuracy: 'Ac'
};

/**
 * Generate a compact constitution code from a ConstitutionReference.
 *
 * Examples:
 *   { persona: 'ambassador', adherence: 3, scopes: ['work', 'education'] } → "A3+W+E"
 *   { persona: 'steward', adherence: 4, scopes: ['stewardship', 'privacy'] } → "St4+Sw+P"
 *   { persona: 'muse', adherence: 3, scopes: ['creativity', 'health', 'privacy'] } → "M3+C+H+P"
 */
export function generateConstitutionCode(ref: ConstitutionReference): string {
	const persona = ref.persona ? (PERSONA_INITIALS[ref.persona] ?? '?') : '?';
	const adherence = ref.adherence ?? '?';
	const scopes = ref.scopes?.length
		? ref.scopes.map((s) => SCOPE_INITIALS[s] ?? '?').join('+')
		: '?';

	return `${persona}${adherence}+${scopes}`;
}

export { PERSONA_INITIALS, SCOPE_INITIALS };
