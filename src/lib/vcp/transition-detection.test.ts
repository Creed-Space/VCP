import { describe, it, expect } from 'vitest';
import { detectTransition } from './transition-detection';
import type { TransitionSeverity, TransitionResult } from './transition-detection';
import type { VCPContext, PersonalState, PersonalDimension } from './types';

function makeContext(overrides: Partial<VCPContext> = {}): VCPContext {
	return {
		vcp_version: '3.1',
		profile_id: 'test-user',
		constitution: { id: 'test', version: '1.0', persona: 'ambassador', adherence: 3, scopes: ['work'] },
		public_profile: { display_name: 'Test User' },
		...overrides
	};
}

function makeDim<T extends string>(value: T, intensity = 3): PersonalDimension<T> {
	return { value, intensity, declared_at: '2026-01-15T12:00:00Z' };
}

// ============================================
// detectTransition
// ============================================

describe('detectTransition', () => {
	describe('identical states produce no transition', () => {
		it('returns severity "none" when both contexts are identical', () => {
			const ctx = makeContext({
				personal_state: {
					cognitive_state: makeDim('focused'),
					emotional_tone: makeDim('calm'),
					energy_level: makeDim('rested'),
					perceived_urgency: makeDim('unhurried'),
					body_signals: makeDim('neutral')
				}
			});
			const result = detectTransition(ctx, ctx);
			expect(result.severity).toBe('none');
			expect(result.changes.size).toBe(0);
			expect(result.affects_safety).toBe(false);
		});

		it('returns severity "none" when both have no personal state', () => {
			const ctx = makeContext();
			const result = detectTransition(ctx, ctx);
			expect(result.severity).toBe('none');
		});

		it('returns severity "none" when both have empty personal state', () => {
			const ctx = makeContext({ personal_state: {} });
			const result = detectTransition(ctx, ctx);
			expect(result.severity).toBe('none');
		});
	});

	describe('minor transitions', () => {
		it('detects single dimension value change as minor', () => {
			const old = makeContext({
				personal_state: { cognitive_state: makeDim('focused') }
			});
			const updated = makeContext({
				personal_state: { cognitive_state: makeDim('distracted') }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('minor');
			expect(result.changes.has('cognitive_state')).toBe(true);
		});

		it('detects single dimension intensity change as minor', () => {
			const old = makeContext({
				personal_state: { emotional_tone: makeDim('calm', 2) }
			});
			const updated = makeContext({
				personal_state: { emotional_tone: makeDim('calm', 3) }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('minor');
			expect(result.changes.has('emotional_tone')).toBe(true);
		});

		it('detects two dimension changes as minor', () => {
			const old = makeContext({
				personal_state: {
					cognitive_state: makeDim('focused'),
					emotional_tone: makeDim('calm')
				}
			});
			const updated = makeContext({
				personal_state: {
					cognitive_state: makeDim('distracted'),
					emotional_tone: makeDim('tense')
				}
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('minor');
			expect(result.changes.size).toBe(2);
		});
	});

	describe('major transitions', () => {
		it('detects three or more dimension changes as major', () => {
			const old = makeContext({
				personal_state: {
					cognitive_state: makeDim('focused'),
					emotional_tone: makeDim('calm'),
					energy_level: makeDim('rested')
				}
			});
			const updated = makeContext({
				personal_state: {
					cognitive_state: makeDim('overloaded'),
					emotional_tone: makeDim('frustrated'),
					energy_level: makeDim('depleted')
				}
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('major');
			expect(result.changes.size).toBeGreaterThanOrEqual(3);
		});

		it('detects intensity jump of 3+ points as major', () => {
			const old = makeContext({
				personal_state: { perceived_urgency: makeDim('unhurried', 1) }
			});
			const updated = makeContext({
				personal_state: { perceived_urgency: makeDim('critical', 4) }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('major');
		});

		it('detects body_signals pain at intensity 4+ as major', () => {
			const old = makeContext({
				personal_state: { body_signals: makeDim('neutral', 1) }
			});
			const updated = makeContext({
				personal_state: { body_signals: makeDim('pain', 4) }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('major');
			expect(result.affects_safety).toBe(true);
		});

		it('detects body_signals unwell at intensity 5 as major', () => {
			const old = makeContext({
				personal_state: { body_signals: makeDim('neutral', 1) }
			});
			const updated = makeContext({
				personal_state: { body_signals: makeDim('unwell', 5) }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('major');
			expect(result.affects_safety).toBe(true);
		});

		it('detects constraint changes as major and safety-affecting', () => {
			const old = makeContext({ constraints: { time_limited: false } });
			const updated = makeContext({ constraints: { time_limited: true } });
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('major');
			expect(result.affects_safety).toBe(true);
			expect(result.changes.has('constraints')).toBe(true);
		});

		it('detects persona change as major', () => {
			const old = makeContext({
				constitution: { id: 'c1', version: '1.0', persona: 'ambassador', adherence: 3, scopes: ['work'] }
			});
			const updated = makeContext({
				constitution: { id: 'c1', version: '1.0', persona: 'sentinel', adherence: 3, scopes: ['work'] }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('major');
			expect(result.changes.has('persona')).toBe(true);
		});
	});

	describe('emergency transitions', () => {
		it('detects emergency occasion keyword as emergency severity', () => {
			const old = makeContext();
			const updated = makeContext({
				private_context: { occasion: 'This is an emergency situation' }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('emergency');
			expect(result.affects_safety).toBe(true);
		});

		it('detects dangerous environment as emergency', () => {
			const old = makeContext();
			const updated = makeContext({
				private_context: { environment: 'dangerous area' }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('emergency');
			expect(result.affects_safety).toBe(true);
		});

		it('detects fire environment as emergency', () => {
			const old = makeContext();
			const updated = makeContext({
				private_context: { environment: 'building on fire' }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('emergency');
			expect(result.affects_safety).toBe(true);
		});

		it('detects emergency constraint keyword as emergency', () => {
			const old = makeContext();
			const updated = makeContext({
				constraints: { time_limited: true },
				private_context: {},
			});
			// Emergency constraint keywords are in the constraints JSON
			const emergencyCtx = makeContext();
			(emergencyCtx as Record<string, unknown>).constraints = { emergency: true };
			const result = detectTransition(old, emergencyCtx);
			expect(result.severity).toBe('emergency');
			expect(result.affects_safety).toBe(true);
		});

		it('detects enforcement constraint keyword as emergency', () => {
			const old = makeContext();
			const emergencyCtx = makeContext();
			(emergencyCtx as Record<string, unknown>).constraints = { enforcement: true, mode: 'enforcement active' };
			const result = detectTransition(old, emergencyCtx);
			expect(result.severity).toBe('emergency');
			expect(result.affects_safety).toBe(true);
		});

		it('emergency always sets affects_safety to true', () => {
			const old = makeContext();
			const updated = makeContext({
				private_context: { occasion: 'emergency' }
			});
			const result = detectTransition(old, updated);
			expect(result.affects_safety).toBe(true);
		});

		it('emergency changes map includes emergency indicator', () => {
			const old = makeContext();
			const updated = makeContext({
				private_context: { occasion: 'emergency' }
			});
			const result = detectTransition(old, updated);
			expect(result.changes.has('emergency')).toBe(true);
			expect(result.changes.get('emergency')).toEqual({ old: false, new: true });
		});
	});

	describe('safety-affecting transitions', () => {
		it('body_signals pain at intensity 4 affects safety', () => {
			const old = makeContext({ personal_state: {} });
			const updated = makeContext({
				personal_state: { body_signals: makeDim('pain', 4) }
			});
			const result = detectTransition(old, updated);
			expect(result.affects_safety).toBe(true);
		});

		it('body_signals unwell at intensity 4 affects safety', () => {
			const old = makeContext({ personal_state: {} });
			const updated = makeContext({
				personal_state: { body_signals: makeDim('unwell', 4) }
			});
			const result = detectTransition(old, updated);
			expect(result.affects_safety).toBe(true);
		});

		it('body_signals pain at intensity 2 does not affect safety', () => {
			const old = makeContext({ personal_state: {} });
			const updated = makeContext({
				personal_state: { body_signals: makeDim('pain', 2) }
			});
			const result = detectTransition(old, updated);
			expect(result.affects_safety).toBe(false);
		});

		it('constraint changes affect safety', () => {
			const old = makeContext({ constraints: {} });
			const updated = makeContext({ constraints: { health_considerations: true } });
			const result = detectTransition(old, updated);
			expect(result.affects_safety).toBe(true);
		});
	});

	describe('new personal state from undefined', () => {
		it('detects creation of personal state as a transition', () => {
			const old = makeContext();
			const updated = makeContext({
				personal_state: {
					cognitive_state: makeDim('focused'),
					emotional_tone: makeDim('calm')
				}
			});
			const result = detectTransition(old, updated);
			expect(result.severity).not.toBe('none');
			expect(result.changes.size).toBeGreaterThan(0);
		});

		it('single new dimension from undefined is minor', () => {
			const old = makeContext();
			const updated = makeContext({
				personal_state: { energy_level: makeDim('rested') }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('minor');
		});

		it('three+ new dimensions from undefined is major', () => {
			const old = makeContext();
			const updated = makeContext({
				personal_state: {
					cognitive_state: makeDim('focused'),
					emotional_tone: makeDim('calm'),
					energy_level: makeDim('rested')
				}
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('major');
		});

		it('returns "none" when oldState is undefined and newState has no dimensions (line 61 none path)', () => {
			// oldContext has no personal_state, newContext has empty personal_state
			// detectPersonalStateTransition(undefined, {}) → changes.size=0 → 'none'
			const old = makeContext();
			const updated = makeContext({ personal_state: {} });
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('none');
			expect(result.affects_safety).toBe(false);
		});
	});

	describe('body_signals unwell branch coverage', () => {
		it('unwell at intensity 5 triggers major via detectPersonalStateTransition (line 81)', () => {
			// This specifically tests the (bodyVal === 'unwell' && bodyInt >= 5) branch
			const old = makeContext({
				personal_state: { body_signals: makeDim('neutral', 2) }
			});
			const updated = makeContext({
				personal_state: { body_signals: makeDim('unwell', 5) }
			});
			const result = detectTransition(old, updated);
			expect(result.severity).toBe('major');
		});

		it('unwell at intensity 4 triggers safety but not the >= 5 major path (line 144)', () => {
			// unwell:4 does NOT match line 82 (needs bodyInt >= 5 for unwell)
			// but DOES match line 144 (unwell && intensity >= 4)
			const old = makeContext({
				personal_state: { body_signals: makeDim('neutral', 3) }
			});
			const updated = makeContext({
				personal_state: { body_signals: makeDim('unwell', 4) }
			});
			const result = detectTransition(old, updated);
			expect(result.affects_safety).toBe(true);
		});
	});

	describe('TransitionResult structure', () => {
		it('changes is a Map', () => {
			const ctx = makeContext();
			const result = detectTransition(ctx, ctx);
			expect(result.changes).toBeInstanceOf(Map);
		});

		it('result has severity, changes, and affects_safety fields', () => {
			const ctx = makeContext();
			const result = detectTransition(ctx, ctx);
			expect(result).toHaveProperty('severity');
			expect(result).toHaveProperty('changes');
			expect(result).toHaveProperty('affects_safety');
		});

		it('severity is one of the valid TransitionSeverity values', () => {
			const validSeverities: TransitionSeverity[] = ['none', 'minor', 'major', 'emergency'];
			const ctx = makeContext();
			const result = detectTransition(ctx, ctx);
			expect(validSeverities).toContain(result.severity);
		});
	});
});
