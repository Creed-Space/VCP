/**
 * Constitution Code Generator
 *
 * Generates compact constitution codes like A3+W+E from
 * ConstitutionReference objects. Used in UI badges and
 * the comparison table.
 *
 * These are multi-char DISPLAY codes for UI readability.
 * The single-char WIRE codes (CSM1) are defined in:
 *   services/vcp/semantics/csm1.py — NZGAMDC
 *   data/schemas/vcp-semantics-csm1.schema.json
 *
 * Persona wire codes: N=Nanny, Z=Sentinel, G=Godparent,
 *   A=Ambassador, M=Muse, D=Mediator, C=Custom
 *
 * VCP token section codes (4-letter aliases, see token.ts):
 *   RULE = C-line (constitution/rules)
 *   ROLE = P-line (persona/adherence)
 *   GOAL = G-line (goal/experience/style)
 *   STAT = PS-line (personal state)
 */

import type { ConstitutionReference, PersonaType, ScopeType } from './types';

const PERSONA_INITIALS: Record<PersonaType, string> = {
	ambassador: 'A',
	godparent: 'G',
	muse: 'M',
	sentinel: 'Se',
	nanny: 'N',
	mediator: 'Me'
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
 *   { persona: 'mediator', adherence: 4, scopes: ['stewardship', 'privacy'] } → "Me4+Sw+P"
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
