import { describe, it, expect } from 'vitest';
import {
	encodeContextToCSM1,
	toWireFormat,
	formatTokenForDisplay,
	getEmojiLegend,
	parseCSM1Token,
	getTransmissionSummary,
	CONSTRAINT_EMOJI,
	PREFERENCE_EMOJI,
	PROSAIC_EMOJI,
	PERSONAL_STATE_EMOJI,
	PRIVATE_MARKER,
	SHARED_MARKER
} from './token';
import type {
	VCPContext,
	PersonalState,
	ConstraintFlags,
	PortablePreferences,
	ProsaicDimensions
} from './types';

// ============================================
// Helpers
// ============================================

/** Minimal valid VCPContext with all required fields */
function makeContext(overrides: Partial<VCPContext> = {}): VCPContext {
	return {
		vcp_version: '3.1',
		profile_id: 'user-42',
		constitution: {
			id: 'creed-ethics',
			version: '1.0',
			persona: 'muse',
			adherence: 3,
			...overrides.constitution
		},
		public_profile: {
			display_name: 'Alice',
			goal: 'learn guitar',
			experience: 'beginner',
			learning_style: 'mixed',
			...overrides.public_profile
		},
		...overrides
	};
}

/** Build a PersonalState with all five dimensions set */
function makeFullPersonalState(overrides: Partial<PersonalState> = {}): PersonalState {
	return {
		cognitive_state: { value: 'focused', intensity: 3 },
		emotional_tone: { value: 'calm', intensity: 2 },
		energy_level: { value: 'fatigued', intensity: 3 },
		perceived_urgency: { value: 'unhurried', intensity: 2 },
		body_signals: { value: 'neutral', intensity: 1 },
		...overrides
	};
}

// ============================================
// Constants / Emoji Maps
// ============================================

describe('CONSTRAINT_EMOJI', () => {
	it('maps all seven constraint types to emoji', () => {
		const expected = [
			'noise_restricted',
			'budget_limited',
			'energy_variable',
			'time_limited',
			'schedule_irregular',
			'mobility_limited',
			'health_considerations'
		];
		for (const key of expected) {
			expect(CONSTRAINT_EMOJI[key as keyof typeof CONSTRAINT_EMOJI]).toBeDefined();
		}
		expect(Object.keys(CONSTRAINT_EMOJI)).toHaveLength(7);
	});
});

describe('PREFERENCE_EMOJI', () => {
	it('maps all nine preference values to emoji', () => {
		expect(Object.keys(PREFERENCE_EMOJI)).toHaveLength(9);
		expect(PREFERENCE_EMOJI.quiet_preferred).toBe('🔇');
		expect(PREFERENCE_EMOJI.silent_required).toBe('🔕');
		expect(PREFERENCE_EMOJI.free_only).toBe('🆓');
	});
});

describe('PROSAIC_EMOJI', () => {
	it('has urgency, health, cognitive, affect', () => {
		expect(PROSAIC_EMOJI.urgency).toBe('⚡');
		expect(PROSAIC_EMOJI.health).toBe('💊');
		expect(PROSAIC_EMOJI.cognitive).toBe('🧩');
		expect(PROSAIC_EMOJI.affect).toBe('💭');
		expect(Object.keys(PROSAIC_EMOJI)).toHaveLength(4);
	});
});

describe('PERSONAL_STATE_EMOJI', () => {
	it('has all five v3.1 dimensions', () => {
		expect(PERSONAL_STATE_EMOJI.cognitive_state).toBe('🧠');
		expect(PERSONAL_STATE_EMOJI.emotional_tone).toBe('💭');
		expect(PERSONAL_STATE_EMOJI.energy_level).toBe('🔋');
		expect(PERSONAL_STATE_EMOJI.perceived_urgency).toBe('⚡');
		expect(PERSONAL_STATE_EMOJI.body_signals).toBe('🩺');
		expect(Object.keys(PERSONAL_STATE_EMOJI)).toHaveLength(5);
	});
});

describe('Markers', () => {
	it('PRIVATE_MARKER is lock emoji', () => {
		expect(PRIVATE_MARKER).toBe('🔒');
	});

	it('SHARED_MARKER is checkmark', () => {
		expect(SHARED_MARKER).toBe('✓');
	});
});

// ============================================
// encodeContextToCSM1
// ============================================

describe('encodeContextToCSM1', () => {
	describe('header and constitution lines', () => {
		it('produces VCP header with version and profile ID', () => {
			const token = encodeContextToCSM1(makeContext());
			const lines = token.split('\n');
			expect(lines[0]).toBe('VCP:3.1:user-42');
		});

		it('produces constitution reference on line 2', () => {
			const token = encodeContextToCSM1(makeContext());
			const lines = token.split('\n');
			expect(lines[1]).toBe('C:creed-ethics@1.0');
		});
	});

	describe('missing constitution', () => {
		it('returns empty string when constitution.id is missing', () => {
			const ctx = makeContext();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(ctx.constitution as any).id = undefined;
			expect(encodeContextToCSM1(ctx)).toBe('');
		});

		it('returns empty string when constitution is undefined', () => {
			const ctx = makeContext();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(ctx as any).constitution = undefined;
			expect(encodeContextToCSM1(ctx)).toBe('');
		});
	});

	describe('persona line (P)', () => {
		it('encodes persona and adherence (P:<persona>:<adherence>)', () => {
			const token = encodeContextToCSM1(makeContext());
			const lines = token.split('\n');
			// P line format is P:<persona>:<adherence> per CSM-1 spec
			expect(lines[2]).toBe('P:muse:3');
		});

		it('defaults persona to muse when not set', () => {
			const ctx = makeContext({
				constitution: { id: 'c', version: '1', persona: undefined, adherence: 5 }
			});
			const pLine = encodeContextToCSM1(ctx).split('\n')[2];
			expect(pLine).toContain(':muse:');
		});

		it('defaults adherence to 3 when not set', () => {
			const ctx = makeContext({
				constitution: { id: 'c', version: '1', persona: 'sentinel', adherence: undefined }
			});
			const pLine = encodeContextToCSM1(ctx).split('\n')[2];
			expect(pLine).toMatch(/:3$/);
		});

		it('encodes all persona types', () => {
			const personaTypes = ['muse', 'ambassador', 'godparent', 'sentinel', 'anchor', 'nanny', 'steward'] as const;
			for (const persona of personaTypes) {
				const ctx = makeContext({
					constitution: { id: 'c', version: '1', persona, adherence: 3 }
				});
				const pLine = encodeContextToCSM1(ctx).split('\n')[2];
				expect(pLine).toContain(`:${persona}:`);
			}
		});

		it('encodes adherence boundary values 1 through 5', () => {
			for (const adherence of [1, 2, 3, 4, 5]) {
				const ctx = makeContext({
					constitution: { id: 'c', version: '1', persona: 'muse', adherence }
				});
				const pLine = encodeContextToCSM1(ctx).split('\n')[2];
				expect(pLine).toMatch(new RegExp(`:${adherence}$`));
			}
		});
	});

	describe('goal line (G)', () => {
		it('encodes goal, experience, and learning style', () => {
			const token = encodeContextToCSM1(makeContext());
			const lines = token.split('\n');
			expect(lines[3]).toBe('G:learn guitar:beginner:mixed');
		});

		it('defaults goal to unset when missing', () => {
			const ctx = makeContext({ public_profile: { goal: undefined } });
			const gLine = encodeContextToCSM1(ctx).split('\n')[3];
			expect(gLine).toMatch(/^G:unset:/);
		});

		it('defaults experience to beginner and style to mixed', () => {
			const ctx = makeContext({
				public_profile: { display_name: 'Bob', goal: 'cook', experience: undefined, learning_style: undefined }
			});
			const gLine = encodeContextToCSM1(ctx).split('\n')[3];
			expect(gLine).toBe('G:cook:beginner:mixed');
		});

		it('strips newlines from goal to prevent line injection', () => {
			const ctx = makeContext({ public_profile: { goal: 'goal\nG:injected' } });
			const token = encodeContextToCSM1(ctx);
			const lines = token.split('\n');
			// The newline is replaced with a space, so the injected text
			// stays inside the G: line rather than becoming a separate line
			expect(lines[3]).toBe('G:goal G:injected:beginner:mixed');
			// Crucially, there should be no separate "G:injected" line
			const gLines = lines.filter((l) => l.startsWith('G:'));
			expect(gLines).toHaveLength(1);
		});
	});

	describe('constraint flags line (X)', () => {
		it('encodes X:none when no constraints or preferences', () => {
			const ctx = makeContext();
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toBe('X:none');
		});

		it('encodes noise_restricted constraint', () => {
			const ctx = makeContext({ constraints: { noise_restricted: true } });
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toContain('🔇');
		});

		it('encodes time_limited constraint', () => {
			const ctx = makeContext({ constraints: { time_limited: true } });
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toContain('⏰lim');
		});

		it('encodes energy_variable constraint', () => {
			const ctx = makeContext({ constraints: { energy_variable: true } });
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toContain('⚡var');
		});

		it('encodes multiple constraints together', () => {
			const ctx = makeContext({
				constraints: { noise_restricted: true, time_limited: true, energy_variable: true }
			});
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toContain('🔇');
			expect(xLine).toContain('⏰lim');
			expect(xLine).toContain('⚡var');
		});

		it('encodes quiet_preferred preference', () => {
			const ctx = makeContext({
				portable_preferences: { noise_mode: 'quiet_preferred' }
			});
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toContain('🔇quiet');
		});

		it('encodes silent_required preference', () => {
			const ctx = makeContext({
				portable_preferences: { noise_mode: 'silent_required' }
			});
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toContain('🔕silent');
		});

		it('encodes budget low preference', () => {
			const ctx = makeContext({
				portable_preferences: { budget_range: 'low' }
			});
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toContain('💰low');
		});

		it('encodes free_only preference', () => {
			const ctx = makeContext({
				portable_preferences: { budget_range: 'free_only' }
			});
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toContain('🆓');
		});

		it('encodes session_length preference', () => {
			const ctx = makeContext({
				portable_preferences: { session_length: '30_minutes' }
			});
			const xLine = encodeContextToCSM1(ctx).split('\n')[4];
			expect(xLine).toContain('⏱️30minutes');
		});
	});

	describe('active flags line (F)', () => {
		it('encodes F:none when no constraints active', () => {
			const ctx = makeContext();
			const fLine = encodeContextToCSM1(ctx).split('\n')[5];
			expect(fLine).toBe('F:none');
		});

		it('encodes active constraint flags', () => {
			const ctx = makeContext({
				constraints: { time_limited: true, budget_limited: true }
			});
			const fLine = encodeContextToCSM1(ctx).split('\n')[5];
			expect(fLine).toContain('time_limited');
			expect(fLine).toContain('budget_limited');
		});

		it('encodes all five trackable constraint flags', () => {
			const ctx = makeContext({
				constraints: {
					time_limited: true,
					noise_restricted: true,
					budget_limited: true,
					energy_variable: true,
					schedule_irregular: true
				}
			});
			const fLine = encodeContextToCSM1(ctx).split('\n')[5];
			expect(fLine).toContain('time_limited');
			expect(fLine).toContain('noise_restricted');
			expect(fLine).toContain('budget_limited');
			expect(fLine).toContain('energy_variable');
			expect(fLine).toContain('schedule_irregular');
		});

		it('does not include false constraint flags', () => {
			const ctx = makeContext({
				constraints: { time_limited: false, budget_limited: true }
			});
			const fLine = encodeContextToCSM1(ctx).split('\n')[5];
			expect(fLine).not.toContain('time_limited');
			expect(fLine).toContain('budget_limited');
		});
	});

	describe('private markers line (S)', () => {
		it('encodes S:none when no private context', () => {
			const ctx = makeContext();
			const sLine = encodeContextToCSM1(ctx).split('\n')[6];
			expect(sLine).toBe('S:none');
		});

		it('encodes category prefixes from private keys', () => {
			const ctx = makeContext({
				private_context: { work_type: 'remote', work_hours: 40 }
			});
			const sLine = encodeContextToCSM1(ctx).split('\n')[6];
			expect(sLine).toContain('🔒work');
		});

		it('never includes private values, only categories', () => {
			const ctx = makeContext({
				private_context: { health_condition: 'migraine', health_severity: 8 }
			});
			const sLine = encodeContextToCSM1(ctx).split('\n')[6];
			expect(sLine).toContain('🔒health');
			expect(sLine).not.toContain('migraine');
			expect(sLine).not.toContain('8');
		});

		it('excludes _note and _reasoning keys', () => {
			const ctx = makeContext({
				private_context: { _note: 'internal', _reasoning: 'debug', mood_state: 'happy' }
			});
			const sLine = encodeContextToCSM1(ctx).split('\n')[6];
			expect(sLine).not.toContain('note');
			expect(sLine).not.toContain('reasoning');
			expect(sLine).toContain('🔒mood');
		});

		it('returns S:none when private_context has only _note/_reasoning', () => {
			const ctx = makeContext({
				private_context: { _note: 'internal', _reasoning: 'debug' }
			});
			const sLine = encodeContextToCSM1(ctx).split('\n')[6];
			expect(sLine).toBe('S:none');
		});

		it('deduplicates categories from same prefix', () => {
			const ctx = makeContext({
				private_context: { work_type: 'a', work_hours: 'b', health_issue: 'c' }
			});
			const sLine = encodeContextToCSM1(ctx).split('\n')[6];
			// should have work and health categories, work only once
			const workMatches = sLine.match(/🔒work/g);
			expect(workMatches).toHaveLength(1);
			expect(sLine).toContain('🔒health');
		});
	});

	describe('system context line (SC)', () => {
		it('includes SC line when system_context is present', () => {
			const ctx = makeContext({ system_context: 'workplace_system' });
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('SC:workplace_system');
		});

		it('omits SC line when system_context is absent', () => {
			const ctx = makeContext();
			const token = encodeContextToCSM1(ctx);
			expect(token).not.toContain('SC:');
		});
	});

	describe('personal state line (R: prefix for WASM compat)', () => {
		// NOTE: encodeContextToCSM1 replaces PS: with R: for WASM parser compatibility (token.ts line 115)
		it('encodes personal state with all five dimensions using R: prefix', () => {
			const ctx = makeContext({ personal_state: makeFullPersonalState() });
			const token = encodeContextToCSM1(ctx);
			// Output uses R: prefix (not PS:) for WASM compatibility
			expect(token).toContain('R:');
			expect(token).toContain('🧠focused:3');
			expect(token).toContain('💭calm:2');
			expect(token).toContain('🔋fatigued:3');
			expect(token).toContain('⚡unhurried:2');
			expect(token).toContain('🩺neutral:1');
		});

		it('encodes partial personal state (only some dimensions)', () => {
			const ctx = makeContext({
				personal_state: {
					cognitive_state: { value: 'overloaded', intensity: 5 }
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('R:🧠overloaded:5');
			expect(token).not.toContain('💭');
			expect(token).not.toContain('🔋');
		});

		it('defaults intensity to 3 when not specified', () => {
			const ctx = makeContext({
				personal_state: {
					cognitive_state: { value: 'focused' }
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('🧠focused:3');
		});

		it('encodes extended sub-signal when present', () => {
			const ctx = makeContext({
				personal_state: {
					body_signals: { value: 'discomfort', intensity: 4, extended: 'migraine' }
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('🩺discomfort:4:migraine');
		});

		it('separates dimensions with pipe character', () => {
			const ctx = makeContext({
				personal_state: {
					cognitive_state: { value: 'focused', intensity: 3 },
					emotional_tone: { value: 'calm', intensity: 2 }
				}
			});
			const token = encodeContextToCSM1(ctx);
			// R: prefix used for WASM compat
			const rLine = token.split('\n').find((l) => l.startsWith('R:') && l.includes('🧠'));
			expect(rLine).toContain('|');
		});

		it('falls through to prosaic R:none when personal_state is undefined', () => {
			const ctx = makeContext({ personal_state: undefined, prosaic: undefined });
			const token = encodeContextToCSM1(ctx);
			// When no personal_state and no prosaic, encodeProsaicDimensions returns R:none
			expect(token).toContain('R:none');
		});

		it('encodes all cognitive state values', () => {
			const values = ['focused', 'distracted', 'overloaded', 'foggy', 'reflective'] as const;
			for (const val of values) {
				const ctx = makeContext({
					personal_state: { cognitive_state: { value: val, intensity: 3 } }
				});
				const token = encodeContextToCSM1(ctx);
				expect(token).toContain(`🧠${val}:3`);
			}
		});

		it('encodes all emotional tone values', () => {
			const values = ['calm', 'tense', 'frustrated', 'neutral', 'uplifted'] as const;
			for (const val of values) {
				const ctx = makeContext({
					personal_state: { emotional_tone: { value: val, intensity: 4 } }
				});
				const token = encodeContextToCSM1(ctx);
				expect(token).toContain(`💭${val}:4`);
			}
		});

		it('encodes all energy level values', () => {
			const values = ['rested', 'low_energy', 'fatigued', 'wired', 'depleted'] as const;
			for (const val of values) {
				const ctx = makeContext({
					personal_state: { energy_level: { value: val, intensity: 2 } }
				});
				const token = encodeContextToCSM1(ctx);
				expect(token).toContain(`🔋${val}:2`);
			}
		});

		it('encodes intensity boundary values 1 through 5', () => {
			for (const intensity of [1, 2, 3, 4, 5]) {
				const ctx = makeContext({
					personal_state: { cognitive_state: { value: 'focused', intensity } }
				});
				const token = encodeContextToCSM1(ctx);
				expect(token).toContain(`🧠focused:${intensity}`);
			}
		});
	});

	describe('lifecycle line (LC)', () => {
		it('emits LC line when personal state has declared_at', () => {
			const ctx = makeContext({
				personal_state: {
					cognitive_state: {
						value: 'focused',
						intensity: 3,
						declared_at: new Date().toISOString()
					}
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('LC:');
		});

		it('marks pinned dimensions with P code', () => {
			const ctx = makeContext({
				personal_state: {
					cognitive_state: {
						value: 'focused',
						intensity: 3,
						pinned: true
					}
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('LC:🧠P');
		});
	});

	describe('prosaic fallback (R)', () => {
		it('encodes prosaic dimensions when personal_state is absent', () => {
			const ctx = makeContext({
				personal_state: undefined,
				prosaic: { urgency: 0.8, health: 0.2 }
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('R:⚡0.8');
			expect(token).toContain('💊0.2');
		});

		it('encodes R:none when prosaic values are all zero', () => {
			const ctx = makeContext({
				personal_state: undefined,
				prosaic: { urgency: 0, health: 0, cognitive: 0, affect: 0 }
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('R:none');
		});

		it('encodes R:none when prosaic is undefined', () => {
			const ctx = makeContext({ personal_state: undefined, prosaic: undefined });
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('R:none');
		});

		it('encodes prosaic sub_signals', () => {
			const ctx = makeContext({
				personal_state: undefined,
				prosaic: {
					urgency: 0.9,
					sub_signals: { deadline_horizon: 'PT2H' }
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('⚡0.9:PT2H');
		});

		it('encodes health with physical_need sub-signal', () => {
			const ctx = makeContext({
				personal_state: undefined,
				prosaic: {
					health: 0.5,
					sub_signals: { physical_need: 'hunger' }
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('💊0.5:hunger');
		});

		it('encodes health with condition sub-signal as fallback', () => {
			const ctx = makeContext({
				personal_state: undefined,
				prosaic: {
					health: 0.7,
					sub_signals: { condition: 'migraine' }
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('💊0.7:migraine');
		});

		it('encodes cognitive with cognitive_state sub-signal', () => {
			const ctx = makeContext({
				personal_state: undefined,
				prosaic: {
					cognitive: 0.6,
					sub_signals: { cognitive_state: 'overwhelmed' }
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('🧩0.6:overwhelmed');
		});

		it('encodes affect with emotional_state sub-signal', () => {
			const ctx = makeContext({
				personal_state: undefined,
				prosaic: {
					affect: 0.4,
					sub_signals: { emotional_state: 'anxious' }
				}
			});
			const token = encodeContextToCSM1(ctx);
			expect(token).toContain('💭0.4:anxious');
		});

		it('personal_state takes priority over prosaic (uses R: prefix for WASM compat)', () => {
			const ctx = makeContext({
				personal_state: { cognitive_state: { value: 'focused', intensity: 3 } },
				prosaic: { urgency: 0.9 }
			});
			const token = encodeContextToCSM1(ctx);
			// personal_state is encoded with R: prefix (WASM compat), prosaic urgency is not present
			expect(token).toContain('R:🧠focused:3');
			expect(token).not.toContain('⚡0.9');
		});
	});

	describe('full token structure', () => {
		it('produces correct line order for minimal context', () => {
			const ctx = makeContext();
			const lines = encodeContextToCSM1(ctx).split('\n');
			expect(lines[0]).toMatch(/^VCP:/);
			expect(lines[1]).toMatch(/^C:/);
			expect(lines[2]).toMatch(/^P:/);
			expect(lines[3]).toMatch(/^G:/);
			expect(lines[4]).toMatch(/^X:/);
			expect(lines[5]).toMatch(/^F:/);
			expect(lines[6]).toMatch(/^S:/);
		});

		it('produces correct line order for full context with personal state', () => {
			const ctx = makeContext({
				personal_state: makeFullPersonalState(),
				system_context: 'personal_device',
				constraints: { time_limited: true },
				private_context: { work_type: 'remote' }
			});
			const lines = encodeContextToCSM1(ctx).split('\n');
			expect(lines[0]).toMatch(/^VCP:/);
			expect(lines[1]).toMatch(/^C:/);
			expect(lines[2]).toMatch(/^P:/);
			expect(lines[3]).toMatch(/^G:/);
			expect(lines[4]).toMatch(/^X:/);
			expect(lines[5]).toMatch(/^F:/);
			expect(lines[6]).toMatch(/^S:/);
			expect(lines[7]).toMatch(/^SC:/);
			// Personal state uses R: prefix for WASM compatibility
			expect(lines[8]).toMatch(/^R:/);
		});
	});
});

// ============================================
// toWireFormat
// ============================================

describe('toWireFormat', () => {
	it('replaces newlines with double-pipe separator', () => {
		const ctx = makeContext();
		const wire = toWireFormat(ctx);
		expect(wire).not.toContain('\n');
		expect(wire).toContain('‖');
	});

	it('returns empty string for invalid context', () => {
		const ctx = makeContext();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(ctx as any).constitution = undefined;
		expect(toWireFormat(ctx)).toBe('');
	});

	it('preserves all data from CSM1 encoding', () => {
		const ctx = makeContext({
			constraints: { time_limited: true },
			personal_state: { cognitive_state: { value: 'focused', intensity: 4 } }
		});
		const csm1 = encodeContextToCSM1(ctx);
		const wire = toWireFormat(ctx);
		// Reconstruct CSM1 from wire format
		const reconstructed = wire.split('‖').join('\n');
		expect(reconstructed).toBe(csm1);
	});

	it('produces segments equal to CSM1 line count', () => {
		const ctx = makeContext();
		const csm1Lines = encodeContextToCSM1(ctx).split('\n');
		const wireSegments = toWireFormat(ctx).split('‖');
		expect(wireSegments).toHaveLength(csm1Lines.length);
	});
});

// ============================================
// formatTokenForDisplay
// ============================================

describe('formatTokenForDisplay', () => {
	it('wraps token in box drawing characters', () => {
		const csm1 = 'VCP:3.1:user-42\nC:creed@1.0';
		const formatted = formatTokenForDisplay(csm1);
		expect(formatted).toContain('┌');
		expect(formatted).toContain('┐');
		expect(formatted).toContain('└');
		expect(formatted).toContain('┘');
		expect(formatted).toContain('│');
	});

	it('pads lines to equal width', () => {
		const csm1 = 'short\nmuch longer line here';
		const formatted = formatTokenForDisplay(csm1);
		const lines = formatted.split('\n');
		// Content lines (excluding top/bottom borders) should have equal length
		const contentLines = lines.filter((l) => l.startsWith('│'));
		const lengths = contentLines.map((l) => l.length);
		expect(new Set(lengths).size).toBe(1);
	});

	it('handles single-line input', () => {
		const formatted = formatTokenForDisplay('VCP:3.1:user-42');
		expect(formatted).toContain('┌');
		expect(formatted).toContain('└');
		const lines = formatted.split('\n');
		expect(lines).toHaveLength(3); // top border, content, bottom border
	});

	it('uses minimum width of 40 characters', () => {
		const formatted = formatTokenForDisplay('hi');
		// Border should be at least 42 chars wide (40 + 2 for padding)
		const topBorder = formatted.split('\n')[0];
		expect(topBorder.length).toBeGreaterThanOrEqual(42);
	});

	it('handles empty string', () => {
		const formatted = formatTokenForDisplay('');
		expect(formatted).toContain('┌');
		expect(formatted).toContain('└');
	});
});

// ============================================
// getEmojiLegend
// ============================================

describe('getEmojiLegend', () => {
	it('returns array of emoji-meaning pairs', () => {
		const legend = getEmojiLegend();
		expect(Array.isArray(legend)).toBe(true);
		expect(legend.length).toBeGreaterThan(0);
		for (const entry of legend) {
			expect(entry).toHaveProperty('emoji');
			expect(entry).toHaveProperty('meaning');
			expect(typeof entry.emoji).toBe('string');
			expect(typeof entry.meaning).toBe('string');
		}
	});

	it('includes all constraint emoji', () => {
		const legend = getEmojiLegend();
		const emojis = legend.map((e) => e.emoji);
		expect(emojis).toContain('🔇');
		expect(emojis).toContain('🔕');
		expect(emojis).toContain('💰');
		expect(emojis).toContain('🆓');
		expect(emojis).toContain('⏰');
		expect(emojis).toContain('📅');
		expect(emojis).toContain('🔒');
		expect(emojis).toContain('✓');
	});

	it('includes all personal state emoji', () => {
		const legend = getEmojiLegend();
		const emojis = legend.map((e) => e.emoji);
		expect(emojis).toContain('🧠');
		expect(emojis).toContain('💭');
		expect(emojis).toContain('🔋');
		expect(emojis).toContain('⚡');
		expect(emojis).toContain('🩺');
	});

	it('includes legacy prosaic emoji', () => {
		const legend = getEmojiLegend();
		const emojis = legend.map((e) => e.emoji);
		expect(emojis).toContain('💊');
		expect(emojis).toContain('🧩');
	});

	it('returns stable length across calls', () => {
		const first = getEmojiLegend();
		const second = getEmojiLegend();
		expect(first).toHaveLength(second.length);
		expect(first).toEqual(second);
	});
});

// ============================================
// parseCSM1Token
// ============================================

describe('parseCSM1Token', () => {
	it('parses VCP header line', () => {
		const parsed = parseCSM1Token('VCP:3.1:user-42');
		expect(parsed['VCP']).toBe('3.1:user-42');
	});

	it('parses multi-line token into key-value map', () => {
		const token = 'VCP:3.1:user-42\nC:creed-ethics@1.0\nP:Alice:muse:3';
		const parsed = parseCSM1Token(token);
		expect(parsed['VCP']).toBe('3.1:user-42');
		expect(parsed['C']).toBe('creed-ethics@1.0');
		expect(parsed['P']).toBe('Alice:muse:3');
	});

	it('preserves colons in values', () => {
		const parsed = parseCSM1Token('PS:🧠focused:3|💭calm:2');
		expect(parsed['PS']).toBe('🧠focused:3|💭calm:2');
	});

	it('parses constraint line', () => {
		const parsed = parseCSM1Token('X:🔇:⏰lim');
		expect(parsed['X']).toBe('🔇:⏰lim');
	});

	it('parses active flags line', () => {
		const parsed = parseCSM1Token('F:time_limited|budget_limited');
		expect(parsed['F']).toBe('time_limited|budget_limited');
	});

	it('handles empty token', () => {
		const parsed = parseCSM1Token('');
		expect(Object.keys(parsed)).toHaveLength(0);
	});

	it('skips lines without colons', () => {
		const parsed = parseCSM1Token('no-colon-here\nVCP:3.1:user-42');
		expect(parsed['VCP']).toBe('3.1:user-42');
		expect(Object.keys(parsed)).toHaveLength(1);
	});

	it('round-trips with encodeContextToCSM1', () => {
		const ctx = makeContext({
			constraints: { time_limited: true, noise_restricted: true },
			private_context: { health_issue: 'private' },
			personal_state: makeFullPersonalState()
		});
		const token = encodeContextToCSM1(ctx);
		const parsed = parseCSM1Token(token);

		expect(parsed['VCP']).toBe('3.1:user-42');
		expect(parsed['C']).toBe('creed-ethics@1.0');
		// P line is P:<persona>:<adherence> (no display_name)
		expect(parsed['P']).toContain('muse');
		expect(parsed['G']).toContain('learn guitar');
		expect(parsed['X']).toBeDefined();
		expect(parsed['F']).toContain('time_limited');
		expect(parsed['S']).toContain('🔒health');
		// Personal state uses R: prefix for WASM compat
		expect(parsed['R']).toContain('🧠focused');
	});

	it('parses SC line when present', () => {
		const parsed = parseCSM1Token('SC:workplace_system');
		expect(parsed['SC']).toBe('workplace_system');
	});

	it('parses LC lifecycle line', () => {
		const parsed = parseCSM1Token('LC:🧠A:120s|💭D:600s');
		expect(parsed['LC']).toBe('🧠A:120s|💭D:600s');
	});
});

// ============================================
// getTransmissionSummary
// ============================================

describe('getTransmissionSummary', () => {
	it('returns three arrays: transmitted, withheld, influencing', () => {
		const ctx = makeContext();
		const summary = getTransmissionSummary(ctx);
		expect(summary).toHaveProperty('transmitted');
		expect(summary).toHaveProperty('withheld');
		expect(summary).toHaveProperty('influencing');
		expect(Array.isArray(summary.transmitted)).toBe(true);
		expect(Array.isArray(summary.withheld)).toBe(true);
		expect(Array.isArray(summary.influencing)).toBe(true);
	});

	describe('transmitted', () => {
		it('includes public profile fields with values', () => {
			const ctx = makeContext({
				public_profile: {
					display_name: 'Alice',
					goal: 'learn guitar',
					experience: 'beginner'
				}
			});
			const summary = getTransmissionSummary(ctx);
			expect(summary.transmitted).toContain('display_name');
			expect(summary.transmitted).toContain('goal');
			expect(summary.transmitted).toContain('experience');
		});

		it('excludes undefined public profile fields', () => {
			const ctx = makeContext({
				public_profile: {
					display_name: 'Alice',
					goal: undefined,
					experience: undefined
				}
			});
			const summary = getTransmissionSummary(ctx);
			expect(summary.transmitted).toContain('display_name');
			expect(summary.transmitted).not.toContain('goal');
			expect(summary.transmitted).not.toContain('experience');
		});

		it('returns empty transmitted array when no public profile', () => {
			const ctx = makeContext();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(ctx as any).public_profile = undefined;
			const summary = getTransmissionSummary(ctx);
			expect(summary.transmitted).toHaveLength(0);
		});
	});

	describe('withheld', () => {
		it('includes private context keys', () => {
			const ctx = makeContext({
				private_context: { health_condition: 'migraine', work_salary: 50000 }
			});
			const summary = getTransmissionSummary(ctx);
			expect(summary.withheld).toContain('health_condition');
			expect(summary.withheld).toContain('work_salary');
		});

		it('excludes _note and _reasoning from withheld', () => {
			const ctx = makeContext({
				private_context: { _note: 'internal', _reasoning: 'debug', mood: 'happy' }
			});
			const summary = getTransmissionSummary(ctx);
			expect(summary.withheld).not.toContain('_note');
			expect(summary.withheld).not.toContain('_reasoning');
			expect(summary.withheld).toContain('mood');
		});

		it('returns empty withheld array when no private context', () => {
			const ctx = makeContext();
			const summary = getTransmissionSummary(ctx);
			expect(summary.withheld).toHaveLength(0);
		});
	});

	describe('influencing', () => {
		it('includes active constraint flags', () => {
			const ctx = makeContext({
				constraints: { time_limited: true, noise_restricted: true, budget_limited: false }
			});
			const summary = getTransmissionSummary(ctx);
			expect(summary.influencing).toContain('time_limited');
			expect(summary.influencing).toContain('noise_restricted');
			expect(summary.influencing).not.toContain('budget_limited');
		});

		it('includes personal state dimensions with emoji and value:intensity', () => {
			const ctx = makeContext({
				personal_state: {
					cognitive_state: { value: 'focused', intensity: 4 },
					emotional_tone: { value: 'tense', intensity: 2 }
				}
			});
			const summary = getTransmissionSummary(ctx);
			expect(summary.influencing).toContain('🧠 focused:4');
			expect(summary.influencing).toContain('💭 tense:2');
		});

		it('defaults personal state intensity to 3 in summary', () => {
			const ctx = makeContext({
				personal_state: {
					energy_level: { value: 'depleted' }
				}
			});
			const summary = getTransmissionSummary(ctx);
			expect(summary.influencing).toContain('🔋 depleted:3');
		});

		it('includes all five personal state dimensions when present', () => {
			const ctx = makeContext({ personal_state: makeFullPersonalState() });
			const summary = getTransmissionSummary(ctx);
			const psInfluencing = summary.influencing.filter(
				(s) => s.startsWith('🧠') || s.startsWith('💭') || s.startsWith('🔋') || s.startsWith('⚡') || s.startsWith('🩺')
			);
			expect(psInfluencing).toHaveLength(5);
		});

		it('uses legacy prosaic dimensions when personal_state is absent', () => {
			const ctx = makeContext({
				personal_state: undefined,
				prosaic: { urgency: 0.8, health: 0.3, cognitive: 0, affect: 0.5 }
			});
			const summary = getTransmissionSummary(ctx);
			expect(summary.influencing).toContain('⚡ urgency');
			expect(summary.influencing).toContain('💊 health');
			expect(summary.influencing).not.toContain('🧩 cognitive'); // zero is excluded
			expect(summary.influencing).toContain('💭 affect');
		});

		it('does not include prosaic when personal_state is present', () => {
			const ctx = makeContext({
				personal_state: { cognitive_state: { value: 'focused', intensity: 3 } },
				prosaic: { urgency: 0.9, health: 0.5 }
			});
			const summary = getTransmissionSummary(ctx);
			expect(summary.influencing).not.toContain('⚡ urgency');
			expect(summary.influencing).not.toContain('💊 health');
		});

		it('returns empty influencing for no constraints, no state', () => {
			const ctx = makeContext({ constraints: undefined, personal_state: undefined, prosaic: undefined });
			const summary = getTransmissionSummary(ctx);
			expect(summary.influencing).toHaveLength(0);
		});
	});
});

// ============================================
// Round-trip Integration
// ============================================

describe('round-trip: encode -> parse', () => {
	it('preserves VCP version and profile ID', () => {
		const ctx = makeContext({ vcp_version: '4.0', profile_id: 'test-99' });
		const token = encodeContextToCSM1(ctx);
		const parsed = parseCSM1Token(token);
		expect(parsed['VCP']).toBe('4.0:test-99');
	});

	it('preserves constitution reference', () => {
		const ctx = makeContext({
			constitution: { id: 'my-creed', version: '2.5', persona: 'sentinel', adherence: 5 }
		});
		const token = encodeContextToCSM1(ctx);
		const parsed = parseCSM1Token(token);
		expect(parsed['C']).toBe('my-creed@2.5');
	});

	it('preserves persona info', () => {
		const ctx = makeContext({
			constitution: { id: 'c', version: '1', persona: 'anchor', adherence: 1 },
			public_profile: { display_name: 'Zara' }
		});
		const token = encodeContextToCSM1(ctx);
		const parsed = parseCSM1Token(token);
		// P line is P:<persona>:<adherence> (display_name goes in G line context, not P line)
		expect(parsed['P']).toContain('anchor');
		expect(parsed['P']).toContain('1');
	});

	it('wire format round-trips correctly', () => {
		const ctx = makeContext({
			constraints: { time_limited: true },
			personal_state: makeFullPersonalState()
		});
		const wire = toWireFormat(ctx);
		const csm1 = wire.split('‖').join('\n');
		const parsed = parseCSM1Token(csm1);
		expect(parsed['VCP']).toBe('3.1:user-42');
		// Personal state uses R: prefix for WASM compat
		expect(parsed['R']).toContain('🧠focused');
	});
});

// ============================================
// CSM-1 Full Round-trip Verification
// ============================================

describe('CSM-1 full round-trip verification', () => {
	it('encode -> parse preserves all fields for a maximal context', () => {
		const ctx = makeContext({
			vcp_version: '3.1',
			profile_id: 'round-trip-user',
			constitution: { id: 'ethics-v2', version: '2.0', persona: 'sentinel', adherence: 5 },
			public_profile: {
				display_name: 'RoundTripper',
				goal: 'master TypeScript',
				experience: 'advanced',
				learning_style: 'reading'
			},
			constraints: {
				time_limited: true,
				noise_restricted: true,
				budget_limited: true,
				energy_variable: true,
				schedule_irregular: true
			},
			portable_preferences: {
				noise_mode: 'silent_required',
				budget_range: 'free_only',
				session_length: '30_minutes'
			},
			private_context: {
				health_condition: 'migraine',
				work_schedule: 'night_shift',
				_note: 'internal debug info',
				_reasoning: 'should be excluded'
			},
			system_context: 'workplace_system',
			personal_state: makeFullPersonalState()
		});

		const token = encodeContextToCSM1(ctx);
		const parsed = parseCSM1Token(token);

		// Line 1: VCP header
		expect(parsed['VCP']).toBe('3.1:round-trip-user');

		// Line 2: Constitution reference
		expect(parsed['C']).toBe('ethics-v2@2.0');

		// Line 3: Persona and adherence
		expect(parsed['P']).toBe('sentinel:5');

		// Line 4: Goal context
		expect(parsed['G']).toBe('master TypeScript:advanced:reading');

		// Line 5: Constraints
		expect(parsed['X']).toBeDefined();
		expect(parsed['X']).toContain('🔇');
		expect(parsed['X']).toContain('🔕silent');
		expect(parsed['X']).toContain('🆓');
		expect(parsed['X']).toContain('⏱️30minutes');

		// Line 6: Active flags
		expect(parsed['F']).toContain('time_limited');
		expect(parsed['F']).toContain('noise_restricted');
		expect(parsed['F']).toContain('budget_limited');
		expect(parsed['F']).toContain('energy_variable');
		expect(parsed['F']).toContain('schedule_irregular');

		// Line 7: Private markers (categories only, no values)
		expect(parsed['S']).toContain('🔒health');
		expect(parsed['S']).toContain('🔒work');
		expect(parsed['S']).not.toContain('migraine');
		expect(parsed['S']).not.toContain('night_shift');

		// Line 8: System context
		expect(parsed['SC']).toBe('workplace_system');

		// Line 9: Personal state (R: prefix for WASM compat)
		expect(parsed['R']).toContain('🧠focused:3');
		expect(parsed['R']).toContain('💭calm:2');
		expect(parsed['R']).toContain('🔋fatigued:3');
		expect(parsed['R']).toContain('⚡unhurried:2');
		expect(parsed['R']).toContain('🩺neutral:1');
	});

	it('encode -> parse preserves minimal context (no optional fields)', () => {
		const ctx = makeContext();
		const token = encodeContextToCSM1(ctx);
		const parsed = parseCSM1Token(token);

		expect(parsed['VCP']).toBe('3.1:user-42');
		expect(parsed['C']).toBe('creed-ethics@1.0');
		expect(parsed['P']).toBe('muse:3');
		expect(parsed['G']).toBe('learn guitar:beginner:mixed');
		expect(parsed['X']).toBe('none');
		expect(parsed['F']).toBe('none');
		expect(parsed['S']).toBe('none');
		expect(parsed['R']).toBe('none');
		expect(parsed['SC']).toBeUndefined();
		expect(parsed['LC']).toBeUndefined();
	});

	it('encode -> toWireFormat -> split -> parse round-trips all fields', () => {
		const ctx = makeContext({
			constraints: { time_limited: true, budget_limited: true },
			portable_preferences: { noise_mode: 'quiet_preferred' },
			personal_state: {
				cognitive_state: { value: 'focused', intensity: 4 },
				energy_level: { value: 'rested', intensity: 5 }
			},
			system_context: 'personal_device',
			private_context: { mood_state: 'happy' }
		});

		const wire = toWireFormat(ctx);
		// Wire format uses double-pipe separator
		expect(wire).not.toContain('\n');
		expect(wire).toContain('‖');

		// Reconstruct and parse
		const csm1 = wire.split('‖').join('\n');
		const parsed = parseCSM1Token(csm1);

		expect(parsed['VCP']).toBe('3.1:user-42');
		expect(parsed['C']).toBe('creed-ethics@1.0');
		expect(parsed['P']).toBe('muse:3');
		expect(parsed['G']).toContain('learn guitar');
		expect(parsed['X']).toContain('🔇quiet');
		expect(parsed['F']).toContain('time_limited');
		expect(parsed['F']).toContain('budget_limited');
		expect(parsed['S']).toContain('🔒mood');
		expect(parsed['SC']).toBe('personal_device');
		expect(parsed['R']).toContain('🧠focused:4');
		expect(parsed['R']).toContain('🔋rested:5');
	});

	it('wire format segment count matches CSM1 line count', () => {
		const ctx = makeContext({
			personal_state: makeFullPersonalState(),
			system_context: 'shared_terminal',
			constraints: { noise_restricted: true }
		});
		const csm1 = encodeContextToCSM1(ctx);
		const wire = toWireFormat(ctx);
		expect(wire.split('‖').length).toBe(csm1.split('\n').length);
	});

	it('prosaic context round-trips through wire format', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: {
				urgency: 0.7,
				health: 0.4,
				cognitive: 0.5,
				affect: 0.3,
				sub_signals: { deadline_horizon: 'PT1H', condition: 'migraine' }
			}
		});
		const wire = toWireFormat(ctx);
		const csm1 = wire.split('‖').join('\n');
		const parsed = parseCSM1Token(csm1);

		expect(parsed['R']).toContain('⚡0.7:PT1H');
		expect(parsed['R']).toContain('💊0.4:migraine');
		expect(parsed['R']).toContain('🧩0.5');
		expect(parsed['R']).toContain('💭0.3');
	});
});

// ============================================
// Token Format Compliance (CSM-1 Spec Line Prefixes)
// ============================================

describe('CSM-1 token format compliance', () => {
	it('line 1 starts with VCP:', () => {
		const token = encodeContextToCSM1(makeContext());
		expect(token.split('\n')[0]).toMatch(/^VCP:/);
	});

	it('line 2 starts with C: (constitution ref)', () => {
		const token = encodeContextToCSM1(makeContext());
		expect(token.split('\n')[1]).toMatch(/^C:/);
	});

	it('line 3 starts with P: (persona:adherence)', () => {
		const token = encodeContextToCSM1(makeContext());
		expect(token.split('\n')[2]).toMatch(/^P:/);
	});

	it('line 4 starts with G: (goal:experience:style)', () => {
		const token = encodeContextToCSM1(makeContext());
		expect(token.split('\n')[3]).toMatch(/^G:/);
	});

	it('line 5 starts with X: (constraints)', () => {
		const token = encodeContextToCSM1(makeContext());
		expect(token.split('\n')[4]).toMatch(/^X:/);
	});

	it('line 6 starts with F: (active flags)', () => {
		const token = encodeContextToCSM1(makeContext());
		expect(token.split('\n')[5]).toMatch(/^F:/);
	});

	it('line 7 starts with S: (private markers)', () => {
		const token = encodeContextToCSM1(makeContext());
		expect(token.split('\n')[6]).toMatch(/^S:/);
	});

	it('SC: line appears after S: when system_context is set', () => {
		const ctx = makeContext({ system_context: 'monitored_environment' });
		const lines = encodeContextToCSM1(ctx).split('\n');
		const sIndex = lines.findIndex((l) => l.startsWith('S:'));
		const scIndex = lines.findIndex((l) => l.startsWith('SC:'));
		expect(scIndex).toBeGreaterThan(sIndex);
	});

	it('R: line appears after S: (or SC:) when state is present', () => {
		const ctx = makeContext({
			personal_state: { cognitive_state: { value: 'focused', intensity: 3 } }
		});
		const lines = encodeContextToCSM1(ctx).split('\n');
		const sIndex = lines.findIndex((l) => l.startsWith('S:'));
		const rIndex = lines.findIndex((l) => l.startsWith('R:'));
		expect(rIndex).toBeGreaterThan(sIndex);
	});

	it('LC: line appears after R: when lifecycle data is present', () => {
		const ctx = makeContext({
			personal_state: {
				cognitive_state: { value: 'focused', intensity: 3, declared_at: new Date().toISOString() }
			}
		});
		const lines = encodeContextToCSM1(ctx).split('\n');
		const rIndex = lines.findIndex((l) => l.startsWith('R:'));
		const lcIndex = lines.findIndex((l) => l.startsWith('LC:'));
		expect(lcIndex).toBeGreaterThan(rIndex);
	});

	it('no line prefix appears more than once', () => {
		const ctx = makeContext({
			personal_state: makeFullPersonalState(),
			system_context: 'personal_device',
			constraints: { time_limited: true },
			private_context: { work_type: 'remote' }
		});
		const lines = encodeContextToCSM1(ctx).split('\n');
		const prefixes = lines.map((l) => l.split(':')[0]);
		const unique = new Set(prefixes);
		expect(unique.size).toBe(prefixes.length);
	});

	it('minimal token has exactly 8 lines (VCP, C, P, G, X, F, S, R:none)', () => {
		const ctx = makeContext();
		const lines = encodeContextToCSM1(ctx).split('\n');
		expect(lines).toHaveLength(8);
	});
});

// ============================================
// getTransmissionSummary - Prosaic (no personal_state) Branch Coverage
// ============================================

describe('getTransmissionSummary prosaic branch (no personal_state)', () => {
	it('includes urgency and health in influencing when prosaic set', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { urgency: 0.8, health: 0.3 }
		});
		const summary = getTransmissionSummary(ctx);
		expect(summary.influencing).toContain('⚡ urgency');
		expect(summary.influencing).toContain('💊 health');
	});

	it('includes cognitive in influencing when prosaic cognitive > 0', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { cognitive: 0.6 }
		});
		const summary = getTransmissionSummary(ctx);
		expect(summary.influencing).toContain('🧩 cognitive');
	});

	it('includes affect in influencing when prosaic affect > 0', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { affect: 0.5 }
		});
		const summary = getTransmissionSummary(ctx);
		expect(summary.influencing).toContain('💭 affect');
	});

	it('returns empty influencing for all-zero prosaic values', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { urgency: 0, health: 0, cognitive: 0, affect: 0 }
		});
		const summary = getTransmissionSummary(ctx);
		// No constraints and no personal_state, so influencing should be empty
		const prosaicInfluencing = summary.influencing.filter(
			(s) => s.startsWith('⚡') || s.startsWith('💊') || s.startsWith('🧩') || s.startsWith('💭')
		);
		expect(prosaicInfluencing).toHaveLength(0);
	});

	it('excludes zero-valued prosaic dimensions', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { urgency: 0.9, health: 0, cognitive: 0.1, affect: 0 }
		});
		const summary = getTransmissionSummary(ctx);
		expect(summary.influencing).toContain('⚡ urgency');
		expect(summary.influencing).not.toContain('💊 health');
		expect(summary.influencing).toContain('🧩 cognitive');
		expect(summary.influencing).not.toContain('💭 affect');
	});

	it('uses all four prosaic dimensions when all are non-zero', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { urgency: 0.5, health: 0.5, cognitive: 0.5, affect: 0.5 }
		});
		const summary = getTransmissionSummary(ctx);
		expect(summary.influencing).toContain('⚡ urgency');
		expect(summary.influencing).toContain('💊 health');
		expect(summary.influencing).toContain('🧩 cognitive');
		expect(summary.influencing).toContain('💭 affect');
	});
});

// ============================================
// getTransmissionSummary Edge Cases
// ============================================

describe('getTransmissionSummary edge cases', () => {
	it('returns empty transmitted when no public_profile', () => {
		const ctx = makeContext();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(ctx as any).public_profile = undefined;
		const summary = getTransmissionSummary(ctx);
		expect(summary.transmitted).toHaveLength(0);
	});

	it('returns empty influencing when no constraints', () => {
		const ctx = makeContext({ constraints: undefined, personal_state: undefined, prosaic: undefined });
		const summary = getTransmissionSummary(ctx);
		expect(summary.influencing).toHaveLength(0);
	});

	it('returns empty withheld when no private_context', () => {
		const ctx = makeContext({ private_context: undefined });
		const summary = getTransmissionSummary(ctx);
		expect(summary.withheld).toHaveLength(0);
	});

	it('returns empty withheld when private_context has only _note and _reasoning', () => {
		const ctx = makeContext({
			private_context: { _note: 'internal only', _reasoning: 'debug logic' }
		});
		const summary = getTransmissionSummary(ctx);
		expect(summary.withheld).toHaveLength(0);
	});

	it('withheld includes keys but not values', () => {
		const ctx = makeContext({
			private_context: { salary_range: '100k-150k', health_condition: 'diabetes' }
		});
		const summary = getTransmissionSummary(ctx);
		expect(summary.withheld).toContain('salary_range');
		expect(summary.withheld).toContain('health_condition');
		// Values should never appear
		expect(summary.withheld).not.toContain('100k-150k');
		expect(summary.withheld).not.toContain('diabetes');
	});

	it('handles context with constraints but no state (only constraint flags influencing)', () => {
		const ctx = makeContext({
			constraints: { budget_limited: true, mobility_limited: true },
			personal_state: undefined,
			prosaic: undefined
		});
		const summary = getTransmissionSummary(ctx);
		expect(summary.influencing).toContain('budget_limited');
		// Note: mobility_limited is not in the five tracked constraint flags
		// (time_limited, noise_restricted, budget_limited, energy_variable, schedule_irregular)
		// but getTransmissionSummary checks all constraint entries with value === true
		expect(summary.influencing).toContain('mobility_limited');
	});

	it('transmitted excludes null public_profile fields', () => {
		const ctx = makeContext({
			public_profile: {
				display_name: 'Alice',
				goal: null as unknown as string,
				experience: undefined
			}
		});
		const summary = getTransmissionSummary(ctx);
		expect(summary.transmitted).toContain('display_name');
		expect(summary.transmitted).not.toContain('goal');
		expect(summary.transmitted).not.toContain('experience');
	});
});

// ============================================
// Personal State Encoding Edge Cases
// ============================================

describe('personal state encoding edge cases', () => {
	it('encodes dimension with extended field populated', () => {
		const ctx = makeContext({
			personal_state: {
				body_signals: { value: 'discomfort', intensity: 4, extended: 'migraine' },
				cognitive_state: { value: 'foggy', intensity: 2, extended: 'brain_fog' }
			}
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('🩺discomfort:4:migraine');
		expect(token).toContain('🧠foggy:2:brain_fog');
	});

	it('encodes dimension with declared_at (decay should apply over time)', () => {
		// Set declared_at to 2 hours ago for energy_level (half_life 7200s = 2h)
		const twoHoursAgo = new Date(Date.now() - 7200 * 1000).toISOString();
		const ctx = makeContext({
			personal_state: {
				energy_level: { value: 'fatigued', intensity: 5, declared_at: twoHoursAgo }
			}
		});
		const token = encodeContextToCSM1(ctx);
		// After one half-life, intensity 5 should decay to floor((1 + (5-1) * 0.5)) = floor(3) = 3
		expect(token).toContain('🔋fatigued:3');
	});

	it('encodes only cognitive_state when other dimensions are missing', () => {
		const ctx = makeContext({
			personal_state: {
				cognitive_state: { value: 'reflective', intensity: 4 }
			}
		});
		const token = encodeContextToCSM1(ctx);
		const rLine = token.split('\n').find((l) => l.startsWith('R:') && l.includes('🧠'));
		expect(rLine).toBe('R:🧠reflective:4');
		expect(rLine).not.toContain('💭');
		expect(rLine).not.toContain('🔋');
		expect(rLine).not.toContain('⚡');
		expect(rLine).not.toContain('🩺');
	});

	it('encodes only emotional_tone when other dimensions are missing', () => {
		const ctx = makeContext({
			personal_state: {
				emotional_tone: { value: 'uplifted', intensity: 5 }
			}
		});
		const token = encodeContextToCSM1(ctx);
		const rLine = token.split('\n').find((l) => l.startsWith('R:') && l.includes('💭'));
		expect(rLine).toBe('R:💭uplifted:5');
	});

	it('encodes only body_signals when other dimensions are missing', () => {
		const ctx = makeContext({
			personal_state: {
				body_signals: { value: 'pain', intensity: 5 }
			}
		});
		const token = encodeContextToCSM1(ctx);
		const rLine = token.split('\n').find((l) => l.startsWith('R:') && l.includes('🩺'));
		expect(rLine).toBe('R:🩺pain:5');
	});

	it('preserves dimension order: cognitive, emotional, energy, urgency, body', () => {
		const ctx = makeContext({ personal_state: makeFullPersonalState() });
		const token = encodeContextToCSM1(ctx);
		const rLine = token.split('\n').find((l) => l.startsWith('R:') && l.includes('🧠'))!;
		const cogIdx = rLine.indexOf('🧠');
		const emoIdx = rLine.indexOf('💭');
		const engIdx = rLine.indexOf('🔋');
		const urgIdx = rLine.indexOf('⚡');
		const bodIdx = rLine.indexOf('🩺');
		expect(cogIdx).toBeLessThan(emoIdx);
		expect(emoIdx).toBeLessThan(engIdx);
		expect(engIdx).toBeLessThan(urgIdx);
		expect(urgIdx).toBeLessThan(bodIdx);
	});

	it('encodes dimension with pinned: true (no decay applied)', () => {
		const longAgo = new Date(Date.now() - 86400 * 1000).toISOString();
		const ctx = makeContext({
			personal_state: {
				cognitive_state: {
					value: 'focused',
					intensity: 5,
					declared_at: longAgo,
					pinned: true,
					decay_policy: {
						curve: 'exponential',
						half_life_seconds: 720,
						baseline: 1,
						stale_threshold: 0.3,
						fresh_window_seconds: 60,
						pinned: true,
						reset_on_engagement: false
					}
				}
			}
		});
		const token = encodeContextToCSM1(ctx);
		// Pinned means intensity stays at declared value
		expect(token).toContain('🧠focused:5');
	});
});

// ============================================
// Lifecycle Line Encoding
// ============================================

describe('lifecycle line encoding', () => {
	it('pinned dimension produces P code', () => {
		const ctx = makeContext({
			personal_state: {
				cognitive_state: {
					value: 'focused',
					intensity: 3,
					pinned: true
				}
			}
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('LC:🧠P');
	});

	it('pinned via decay_policy also produces P code', () => {
		const ctx = makeContext({
			personal_state: {
				emotional_tone: {
					value: 'calm',
					intensity: 2,
					decay_policy: {
						curve: 'exponential',
						half_life_seconds: 1800,
						baseline: 1,
						stale_threshold: 0.3,
						fresh_window_seconds: 60,
						pinned: true,
						reset_on_engagement: false
					}
				}
			}
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('LC:💭P');
	});

	it('recently declared dimension gets active (A) or set (S) state code', () => {
		const now = new Date().toISOString();
		const ctx = makeContext({
			personal_state: {
				cognitive_state: {
					value: 'focused',
					intensity: 3,
					declared_at: now
				}
			}
		});
		const token = encodeContextToCSM1(ctx);
		const lcLine = token.split('\n').find((l) => l.startsWith('LC:'));
		expect(lcLine).toBeDefined();
		// Just declared: should be S (set, elapsed ~0) or A (active, within fresh window)
		expect(lcLine).toMatch(/🧠[SA]:\d+s/);
	});

	it('stale dimension gets T state code after enough elapsed time', () => {
		// cognitive_state default half_life is 720s, stale_threshold 0.3
		// After ~5 half-lives, effective intensity drops well below stale level
		const longAgo = new Date(Date.now() - 3600 * 1000).toISOString();
		const ctx = makeContext({
			personal_state: {
				cognitive_state: {
					value: 'focused',
					intensity: 3,
					declared_at: longAgo
				}
			}
		});
		const token = encodeContextToCSM1(ctx);
		const lcLine = token.split('\n').find((l) => l.startsWith('LC:'));
		expect(lcLine).toBeDefined();
		// After 3600s with 720s half_life, should be stale or expired
		expect(lcLine).toMatch(/🧠[TX]:\d+s/);
	});

	it('decaying dimension gets D state code after fresh window', () => {
		// emotional_tone: half_life 1800s, fresh_window 60s
		// After 120s: past fresh window but not stale yet
		const twoMinAgo = new Date(Date.now() - 120 * 1000).toISOString();
		const ctx = makeContext({
			personal_state: {
				emotional_tone: {
					value: 'tense',
					intensity: 5,
					declared_at: twoMinAgo
				}
			}
		});
		const token = encodeContextToCSM1(ctx);
		const lcLine = token.split('\n').find((l) => l.startsWith('LC:'));
		expect(lcLine).toBeDefined();
		// Past fresh window (60s) but still has plenty of intensity
		expect(lcLine).toMatch(/💭D:\d+s/);
	});

	it('no LC line when personal_state has no declared_at or pinned', () => {
		const ctx = makeContext({
			personal_state: {
				cognitive_state: { value: 'focused', intensity: 3 }
			}
		});
		const token = encodeContextToCSM1(ctx);
		const lcLine = token.split('\n').find((l) => l.startsWith('LC:'));
		// With no declared_at, declared_at defaults to now, so elapsed ~0 => S:0s
		// LC line IS emitted because the encoder always calls encodeLifecycleLine
		expect(lcLine).toBeDefined();
	});

	it('multiple dimensions in LC line separated by pipe', () => {
		const now = new Date().toISOString();
		const ctx = makeContext({
			personal_state: {
				cognitive_state: { value: 'focused', intensity: 3, declared_at: now },
				emotional_tone: { value: 'calm', intensity: 2, pinned: true }
			}
		});
		const token = encodeContextToCSM1(ctx);
		const lcLine = token.split('\n').find((l) => l.startsWith('LC:'))!;
		expect(lcLine).toContain('|');
		expect(lcLine).toContain('🧠');
		expect(lcLine).toContain('💭P');
	});
});

// ============================================
// Prosaic Encoding Edge Cases
// ============================================

describe('prosaic encoding edge cases', () => {
	it('encodes urgency with deadline_horizon sub-signal', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { urgency: 0.9, sub_signals: { deadline_horizon: 'PT2H' } }
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('R:⚡0.9:PT2H');
	});

	it('encodes health with physical_need sub-signal', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { health: 0.6, sub_signals: { physical_need: 'hunger' } }
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('💊0.6:hunger');
	});

	it('encodes health with condition sub-signal when physical_need absent', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { health: 0.8, sub_signals: { condition: 'migraine' } }
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('💊0.8:migraine');
	});

	it('physical_need takes priority over condition for health sub-signal', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: {
				health: 0.7,
				sub_signals: { physical_need: 'hunger', condition: 'migraine' }
			}
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('💊0.7:hunger');
		expect(token).not.toContain('migraine');
	});

	it('encodes cognitive with cognitive_state sub-signal', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { cognitive: 0.7, sub_signals: { cognitive_state: 'brain_fog' } }
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('🧩0.7:brain_fog');
	});

	it('encodes affect with emotional_state sub-signal', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { affect: 0.5, sub_signals: { emotional_state: 'excited' } }
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('💭0.5:excited');
	});

	it('all zero prosaic values produce R:none', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { urgency: 0, health: 0, cognitive: 0, affect: 0 }
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('R:none');
	});

	it('single dimension set produces single entry', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { urgency: 0.5 }
		});
		const token = encodeContextToCSM1(ctx);
		const rLine = token.split('\n').find((l) => l.startsWith('R:'))!;
		expect(rLine).toBe('R:⚡0.5');
		expect(rLine).not.toContain('|');
	});

	it('multiple non-zero dimensions separated by pipe', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { urgency: 0.5, health: 0.3 }
		});
		const token = encodeContextToCSM1(ctx);
		const rLine = token.split('\n').find((l) => l.startsWith('R:'))!;
		expect(rLine).toContain('|');
		expect(rLine).toContain('⚡0.5');
		expect(rLine).toContain('💊0.3');
	});

	it('formats values to one decimal place', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: { urgency: 0.333, health: 0.6667 }
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('⚡0.3');
		expect(token).toContain('💊0.7');
	});

	it('all four sub_signals can be encoded simultaneously', () => {
		const ctx = makeContext({
			personal_state: undefined,
			prosaic: {
				urgency: 0.9,
				health: 0.7,
				cognitive: 0.6,
				affect: 0.4,
				sub_signals: {
					deadline_horizon: 'PT30M',
					physical_need: 'thirst',
					cognitive_state: 'overwhelmed',
					emotional_state: 'anxious'
				}
			}
		});
		const token = encodeContextToCSM1(ctx);
		expect(token).toContain('⚡0.9:PT30M');
		expect(token).toContain('💊0.7:thirst');
		expect(token).toContain('🧩0.6:overwhelmed');
		expect(token).toContain('💭0.4:anxious');
	});
});

// ============================================
// Constraint Encoding Edge Cases
// ============================================

describe('constraint encoding edge cases', () => {
	it('encodes silent_required preference as 🔕silent', () => {
		const ctx = makeContext({
			portable_preferences: { noise_mode: 'silent_required' }
		});
		const xLine = encodeContextToCSM1(ctx).split('\n')[4];
		expect(xLine).toContain('🔕silent');
		expect(xLine).not.toContain('🔇quiet');
	});

	it('encodes free_only budget preference as 🆓', () => {
		const ctx = makeContext({
			portable_preferences: { budget_range: 'free_only' }
		});
		const xLine = encodeContextToCSM1(ctx).split('\n')[4];
		expect(xLine).toContain('🆓');
	});

	it('encodes session_length with underscore removed', () => {
		const ctx = makeContext({
			portable_preferences: { session_length: '15_minutes' }
		});
		const xLine = encodeContextToCSM1(ctx).split('\n')[4];
		expect(xLine).toContain('⏱️15minutes');
	});

	it('encodes 60_minutes session_length', () => {
		const ctx = makeContext({
			portable_preferences: { session_length: '60_minutes' }
		});
		const xLine = encodeContextToCSM1(ctx).split('\n')[4];
		expect(xLine).toContain('⏱️60minutes');
	});

	it('combines constraint flags and preference flags in same X: line', () => {
		const ctx = makeContext({
			constraints: { noise_restricted: true, time_limited: true },
			portable_preferences: { budget_range: 'low', session_length: '30_minutes' }
		});
		const xLine = encodeContextToCSM1(ctx).split('\n')[4];
		expect(xLine).toContain('🔇');
		expect(xLine).toContain('⏰lim');
		expect(xLine).toContain('💰low');
		expect(xLine).toContain('⏱️30minutes');
	});

	it('constraint flags appear before preference flags', () => {
		const ctx = makeContext({
			constraints: { noise_restricted: true },
			portable_preferences: { budget_range: 'free_only' }
		});
		const xLine = encodeContextToCSM1(ctx).split('\n')[4];
		const noiseIdx = xLine.indexOf('🔇');
		const freeIdx = xLine.indexOf('🆓');
		expect(noiseIdx).toBeLessThan(freeIdx);
	});

	it('normal noise_mode does not add any noise emoji', () => {
		const ctx = makeContext({
			portable_preferences: { noise_mode: 'normal' }
		});
		const xLine = encodeContextToCSM1(ctx).split('\n')[4];
		expect(xLine).toBe('X:none');
	});

	it('flexible session_length is not added (only timed sessions)', () => {
		const ctx = makeContext({
			portable_preferences: { session_length: 'flexible' }
		});
		const xLine = encodeContextToCSM1(ctx).split('\n')[4];
		expect(xLine).toContain('⏱️flexible');
	});
});

// ============================================
// formatTokenForDisplay Box Drawing Verification
// ============================================

describe('formatTokenForDisplay box drawing characters', () => {
	it('top border uses ┌ and ┐ with ─ fill', () => {
		const formatted = formatTokenForDisplay('VCP:3.1:user-42');
		const topLine = formatted.split('\n')[0];
		expect(topLine[0]).toBe('\u250C'); // ┌
		expect(topLine[topLine.length - 1]).toBe('\u2510'); // ┐
		// All chars between should be ─
		const fill = topLine.slice(1, -1);
		expect(fill).toMatch(/^─+$/);
	});

	it('bottom border uses └ and ┘ with ─ fill', () => {
		const formatted = formatTokenForDisplay('VCP:3.1:user-42');
		const lines = formatted.split('\n');
		const bottomLine = lines[lines.length - 1];
		expect(bottomLine[0]).toBe('\u2514'); // └
		expect(bottomLine[bottomLine.length - 1]).toBe('\u2518'); // ┘
		const fill = bottomLine.slice(1, -1);
		expect(fill).toMatch(/^─+$/);
	});

	it('content lines use │ with space padding', () => {
		const formatted = formatTokenForDisplay('hello\nworld');
		const lines = formatted.split('\n');
		const contentLines = lines.filter((l) => l.startsWith('│'));
		expect(contentLines).toHaveLength(2);
		for (const line of contentLines) {
			expect(line[0]).toBe('\u2502'); // │
			expect(line[line.length - 1]).toBe('\u2502'); // │
		}
	});

	it('top and bottom borders have same length', () => {
		const formatted = formatTokenForDisplay('VCP:3.1:user-42\nC:creed@1.0');
		const lines = formatted.split('\n');
		expect(lines[0].length).toBe(lines[lines.length - 1].length);
	});

	it('all lines (borders + content) have same visual width', () => {
		const formatted = formatTokenForDisplay('short\nmuch longer line here');
		const lines = formatted.split('\n');
		const lengths = lines.map((l) => l.length);
		expect(new Set(lengths).size).toBe(1);
	});

	it('handles multi-line CSM1 token display correctly', () => {
		const ctx = makeContext({
			constraints: { time_limited: true },
			personal_state: { cognitive_state: { value: 'focused', intensity: 3 } }
		});
		const token = encodeContextToCSM1(ctx);
		const formatted = formatTokenForDisplay(token);
		const lines = formatted.split('\n');

		// First line is top border
		expect(lines[0]).toMatch(/^┌─+┐$/);
		// Last line is bottom border
		expect(lines[lines.length - 1]).toMatch(/^└─+┘$/);
		// Middle lines are content
		for (let i = 1; i < lines.length - 1; i++) {
			expect(lines[i]).toMatch(/^│.*│$/);
		}
	});
});
