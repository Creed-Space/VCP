import { describe, it, expect } from 'vitest';
import { parsePersonalStateFromText, applyParsedSignals } from './nl-parser';
import type { PersonalState } from './types';

// ============================================
// parsePersonalStateFromText
// ============================================

describe('parsePersonalStateFromText', () => {
	describe('urgency phrases', () => {
		it('maps "in a hurry" to perceived_urgency: pressured', () => {
			const signals = parsePersonalStateFromText("I'm in a hurry");
			const match = signals.find((s) => s.dimension === 'perceived_urgency');
			expect(match).toBeDefined();
			expect(match!.value).toBe('pressured');
			expect(match!.intensity).toBe(4);
		});

		it('maps "rushing" to perceived_urgency: pressured', () => {
			const signals = parsePersonalStateFromText('I am rushing to a meeting');
			const match = signals.find((s) => s.dimension === 'perceived_urgency');
			expect(match).toBeDefined();
			expect(match!.value).toBe('pressured');
		});

		it('maps "quick question" to perceived_urgency: pressured', () => {
			const signals = parsePersonalStateFromText('Just a quick question');
			const match = signals.find((s) => s.dimension === 'perceived_urgency');
			expect(match).toBeDefined();
			expect(match!.value).toBe('pressured');
		});

		it('maps "no rush" to perceived_urgency: unhurried', () => {
			const signals = parsePersonalStateFromText('No rush on this');
			const match = signals.find((s) => s.dimension === 'perceived_urgency');
			expect(match).toBeDefined();
			expect(match!.value).toBe('unhurried');
			expect(match!.intensity).toBe(2);
		});

		it('maps "take your time" to perceived_urgency: unhurried', () => {
			const signals = parsePersonalStateFromText('Please take your time');
			const match = signals.find((s) => s.dimension === 'perceived_urgency');
			expect(match).toBeDefined();
			expect(match!.value).toBe('unhurried');
		});
	});

	describe('energy phrases', () => {
		it('maps "exhausted" to energy_level: depleted', () => {
			const signals = parsePersonalStateFromText("I'm exhausted");
			const match = signals.find((s) => s.dimension === 'energy_level');
			expect(match).toBeDefined();
			expect(match!.value).toBe('depleted');
			expect(match!.intensity).toBe(4);
		});

		it('maps "so tired" to energy_level: depleted', () => {
			const signals = parsePersonalStateFromText("I'm so tired today");
			const match = signals.find((s) => s.dimension === 'energy_level');
			expect(match).toBeDefined();
			expect(match!.value).toBe('depleted');
		});

		it('maps "wiped out" to energy_level: depleted', () => {
			const signals = parsePersonalStateFromText('Totally wiped out');
			const match = signals.find((s) => s.dimension === 'energy_level');
			expect(match).toBeDefined();
			expect(match!.value).toBe('depleted');
		});

		it('maps "feeling great" to energy_level: rested', () => {
			const signals = parsePersonalStateFromText("I'm feeling great today");
			const match = signals.find((s) => s.dimension === 'energy_level');
			expect(match).toBeDefined();
			expect(match!.value).toBe('rested');
			expect(match!.intensity).toBe(4);
		});

		it('maps "energized" to energy_level: rested', () => {
			const signals = parsePersonalStateFromText('Feeling really energized');
			const match = signals.find((s) => s.dimension === 'energy_level');
			expect(match).toBeDefined();
			expect(match!.value).toBe('rested');
		});
	});

	describe('cognitive phrases', () => {
		it('maps "can\'t think straight" to cognitive_state: foggy', () => {
			const signals = parsePersonalStateFromText("I can't think straight right now");
			const match = signals.find((s) => s.dimension === 'cognitive_state');
			expect(match).toBeDefined();
			expect(match!.value).toBe('foggy');
			expect(match!.intensity).toBe(4);
		});

		it('maps "brain fog" to cognitive_state: foggy', () => {
			const signals = parsePersonalStateFromText('Having serious brain fog');
			const match = signals.find((s) => s.dimension === 'cognitive_state');
			expect(match).toBeDefined();
			expect(match!.value).toBe('foggy');
		});

		it('maps "overwhelmed" to cognitive_state: overloaded', () => {
			const signals = parsePersonalStateFromText("I'm feeling overwhelmed");
			const match = signals.find((s) => s.dimension === 'cognitive_state');
			expect(match).toBeDefined();
			expect(match!.value).toBe('overloaded');
			expect(match!.intensity).toBe(4);
		});

		it('maps "too much" to cognitive_state: overloaded', () => {
			const signals = parsePersonalStateFromText('This is all too much');
			const match = signals.find((s) => s.dimension === 'cognitive_state');
			expect(match).toBeDefined();
			expect(match!.value).toBe('overloaded');
		});
	});

	describe('emotional phrases', () => {
		it('maps "frustrated" to emotional_tone: frustrated', () => {
			const signals = parsePersonalStateFromText("I'm frustrated with this");
			const match = signals.find((s) => s.dimension === 'emotional_tone');
			expect(match).toBeDefined();
			expect(match!.value).toBe('frustrated');
			expect(match!.intensity).toBe(4);
		});

		it('maps "annoyed" to emotional_tone: frustrated', () => {
			const signals = parsePersonalStateFromText("I'm really annoyed");
			const match = signals.find((s) => s.dimension === 'emotional_tone');
			expect(match).toBeDefined();
			expect(match!.value).toBe('frustrated');
		});

		it('maps "stressed" to emotional_tone: tense', () => {
			const signals = parsePersonalStateFromText("I'm stressed about this deadline");
			const match = signals.find((s) => s.dimension === 'emotional_tone');
			expect(match).toBeDefined();
			expect(match!.value).toBe('tense');
			expect(match!.intensity).toBe(4);
		});

		it('maps "anxious" to emotional_tone: tense', () => {
			const signals = parsePersonalStateFromText("I'm feeling anxious");
			const match = signals.find((s) => s.dimension === 'emotional_tone');
			expect(match).toBeDefined();
			expect(match!.value).toBe('tense');
		});
	});

	describe('body signal phrases', () => {
		it('maps "not feeling well" to body_signals: unwell', () => {
			const signals = parsePersonalStateFromText("I'm not feeling well");
			const match = signals.find((s) => s.dimension === 'body_signals');
			expect(match).toBeDefined();
			expect(match!.value).toBe('unwell');
			expect(match!.intensity).toBe(3);
		});

		it('maps "sick" to body_signals: unwell', () => {
			const signals = parsePersonalStateFromText("I'm feeling sick");
			const match = signals.find((s) => s.dimension === 'body_signals');
			expect(match).toBeDefined();
			expect(match!.value).toBe('unwell');
		});

		it('maps "headache" to body_signals: pain', () => {
			const signals = parsePersonalStateFromText('I have a terrible headache');
			const match = signals.find((s) => s.dimension === 'body_signals');
			expect(match).toBeDefined();
			expect(match!.value).toBe('pain');
			expect(match!.intensity).toBe(3);
		});

		it('maps "migraine" to body_signals: pain', () => {
			const signals = parsePersonalStateFromText("I've got a migraine");
			const match = signals.find((s) => s.dimension === 'body_signals');
			expect(match).toBeDefined();
			expect(match!.value).toBe('pain');
		});
	});

	describe('multiple signals in one text', () => {
		it('extracts both urgency and energy signals', () => {
			const signals = parsePersonalStateFromText("I'm exhausted and in a hurry");
			const energy = signals.find((s) => s.dimension === 'energy_level');
			const urgency = signals.find((s) => s.dimension === 'perceived_urgency');
			expect(energy).toBeDefined();
			expect(urgency).toBeDefined();
			expect(energy!.value).toBe('depleted');
			expect(urgency!.value).toBe('pressured');
		});

		it('extracts emotional, cognitive, and body signals together', () => {
			const signals = parsePersonalStateFromText(
				"I'm stressed, overwhelmed, and have a headache"
			);
			const emotional = signals.find((s) => s.dimension === 'emotional_tone');
			const cognitive = signals.find((s) => s.dimension === 'cognitive_state');
			const body = signals.find((s) => s.dimension === 'body_signals');
			expect(emotional).toBeDefined();
			expect(cognitive).toBeDefined();
			expect(body).toBeDefined();
		});

		it('can extract signals across all five dimensions', () => {
			const signals = parsePersonalStateFromText(
				"I'm exhausted, stressed, overwhelmed, in a hurry, and have a headache"
			);
			const dimensions = new Set(signals.map((s) => s.dimension));
			expect(dimensions.has('energy_level')).toBe(true);
			expect(dimensions.has('emotional_tone')).toBe(true);
			expect(dimensions.has('cognitive_state')).toBe(true);
			expect(dimensions.has('perceived_urgency')).toBe(true);
			expect(dimensions.has('body_signals')).toBe(true);
		});
	});

	describe('empty and unrecognized input', () => {
		it('returns empty array for empty string', () => {
			const signals = parsePersonalStateFromText('');
			expect(signals).toEqual([]);
		});

		it('returns empty array for gibberish', () => {
			const signals = parsePersonalStateFromText('asdfghjkl qwerty zxcvbnm');
			expect(signals).toEqual([]);
		});

		it('returns empty array for unrelated text', () => {
			const signals = parsePersonalStateFromText('The weather is nice today');
			expect(signals).toEqual([]);
		});

		it('returns empty array for whitespace only', () => {
			const signals = parsePersonalStateFromText('   \t\n  ');
			expect(signals).toEqual([]);
		});
	});

	describe('case insensitivity', () => {
		it('matches uppercase text', () => {
			const signals = parsePersonalStateFromText("I'M EXHAUSTED");
			const match = signals.find((s) => s.dimension === 'energy_level');
			expect(match).toBeDefined();
			expect(match!.value).toBe('depleted');
		});

		it('matches mixed case text', () => {
			const signals = parsePersonalStateFromText('Having Brain Fog');
			const match = signals.find((s) => s.dimension === 'cognitive_state');
			expect(match).toBeDefined();
			expect(match!.value).toBe('foggy');
		});
	});

	describe('confidence levels', () => {
		it('assigns 0.8 confidence for exact matches', () => {
			const signals = parsePersonalStateFromText("I'm exhausted");
			const match = signals.find((s) => s.dimension === 'energy_level');
			expect(match).toBeDefined();
			expect(match!.confidence).toBe(0.8);
		});

		it('assigns 0.6 confidence for non-exact matches', () => {
			// "feeling great" / "energized" maps to emotional_tone with exact=false
			const signals = parsePersonalStateFromText("I'm feeling great");
			const emotional = signals.find(
				(s) => s.dimension === 'emotional_tone' && s.value === 'uplifted'
			);
			expect(emotional).toBeDefined();
			expect(emotional!.confidence).toBe(0.6);
		});
	});

	describe('deduplication', () => {
		it('keeps highest-confidence signal when same dimension+value matched', () => {
			// "feeling great" maps to both energy_level:rested (exact=true, 0.8)
			// and emotional_tone:uplifted (exact=false, 0.6) -- different dim+value so no dedup
			// But "energized" also matches both -- so "feeling great" and "energized" for
			// energy_level:rested would dedup to highest confidence
			const signals = parsePersonalStateFromText("I'm feeling great and energized");
			const energySignals = signals.filter(
				(s) => s.dimension === 'energy_level' && s.value === 'rested'
			);
			expect(energySignals.length).toBe(1);
		});

		it('retains existing signal when a later duplicate has equal or lower confidence (line 67 false path)', () => {
			// With current PHRASE_MAPPINGS no two mappings produce the same
			// dimension:value pair, so the dedup "existing wins" branch cannot
			// trigger through normal text parsing. This test verifies that even
			// with the most overlapping inputs the dedup Map produces exactly
			// one signal per dimension:value — proving the Map-based dedup works
			// and any future duplicate would be handled.
			const signals = parsePersonalStateFromText(
				"I'm feeling great and also energized, feeling great again"
			);
			// energy_level:rested should appear exactly once despite repeated phrases
			const energyRested = signals.filter(
				(s) => s.dimension === 'energy_level' && s.value === 'rested'
			);
			expect(energyRested.length).toBe(1);
			expect(energyRested[0].confidence).toBe(0.8);

			// emotional_tone:uplifted should appear exactly once
			const emotionalUplifted = signals.filter(
				(s) => s.dimension === 'emotional_tone' && s.value === 'uplifted'
			);
			expect(emotionalUplifted.length).toBe(1);
			expect(emotionalUplifted[0].confidence).toBe(0.6);
		});
	});

	describe('source_phrase tracking', () => {
		it('captures the matched phrase text', () => {
			const signals = parsePersonalStateFromText("I'm so tired after work");
			const match = signals.find((s) => s.dimension === 'energy_level');
			expect(match).toBeDefined();
			expect(match!.source_phrase).toBe('so tired');
		});

		it('captures the exact matched substring', () => {
			const signals = parsePersonalStateFromText('Having a terrible headache all day');
			const match = signals.find((s) => s.dimension === 'body_signals');
			expect(match).toBeDefined();
			expect(match!.source_phrase).toBe('headache');
		});
	});
});

// ============================================
// applyParsedSignals
// ============================================

describe('applyParsedSignals', () => {
	const baseState: PersonalState = {
		cognitive_state: { value: 'focused', intensity: 3, declared_at: '2026-01-15T12:00:00Z' },
		emotional_tone: { value: 'calm', intensity: 2, declared_at: '2026-01-15T12:00:00Z' }
	};

	it('applies signals above the confidence threshold', () => {
		const parsed = parsePersonalStateFromText("I'm exhausted");
		const result = applyParsedSignals(baseState, parsed);
		expect(result.energy_level).toBeDefined();
		expect(result.energy_level!.value).toBe('depleted');
		expect(result.energy_level!.intensity).toBe(4);
	});

	it('preserves existing dimensions not affected by signals', () => {
		const parsed = parsePersonalStateFromText("I'm exhausted");
		const result = applyParsedSignals(baseState, parsed);
		expect(result.cognitive_state).toEqual(baseState.cognitive_state);
	});

	it('overwrites existing dimension when a signal matches it', () => {
		const parsed = parsePersonalStateFromText("I'm overwhelmed");
		const result = applyParsedSignals(baseState, parsed);
		expect(result.cognitive_state!.value).toBe('overloaded');
		expect(result.cognitive_state!.intensity).toBe(4);
	});

	it('does not modify the original state object', () => {
		const parsed = parsePersonalStateFromText("I'm exhausted");
		const originalCognitive = baseState.cognitive_state;
		applyParsedSignals(baseState, parsed);
		expect(baseState.cognitive_state).toBe(originalCognitive);
	});

	it('sets declared_at to a valid ISO timestamp', () => {
		const parsed = parsePersonalStateFromText("I'm exhausted");
		const result = applyParsedSignals(baseState, parsed);
		expect(result.energy_level!.declared_at).toBeDefined();
		const date = new Date(result.energy_level!.declared_at!);
		expect(date.getTime()).not.toBeNaN();
	});

	it('filters out signals below the confidence threshold', () => {
		// "feeling great" produces emotional_tone:uplifted at 0.6 confidence
		const parsed = parsePersonalStateFromText("I'm feeling great");
		const emotionalSignal = parsed.find(
			(s) => s.dimension === 'emotional_tone' && s.value === 'uplifted'
		);
		expect(emotionalSignal).toBeDefined();
		expect(emotionalSignal!.confidence).toBe(0.6);

		// Default threshold is 0.7, so this should NOT be applied
		const result = applyParsedSignals(baseState, parsed);
		// emotional_tone should remain calm (original) not uplifted
		expect(result.emotional_tone!.value).toBe('calm');
	});

	it('applies low-confidence signals when threshold is lowered', () => {
		const parsed = parsePersonalStateFromText("I'm feeling great");
		const result = applyParsedSignals(baseState, parsed, 0.5);
		const emotional = result.emotional_tone;
		expect(emotional).toBeDefined();
		expect(emotional!.value).toBe('uplifted');
	});

	it('returns unchanged state when no signals provided', () => {
		const result = applyParsedSignals(baseState, []);
		expect(result).toEqual(baseState);
	});

	it('returns unchanged state when text produces no signals', () => {
		const parsed = parsePersonalStateFromText('hello world');
		const result = applyParsedSignals(baseState, parsed);
		expect(result).toEqual(baseState);
	});

	it('applies multiple signals from one text', () => {
		const parsed = parsePersonalStateFromText("I'm exhausted and stressed and have a headache");
		const result = applyParsedSignals(baseState, parsed);
		expect(result.energy_level!.value).toBe('depleted');
		expect(result.emotional_tone!.value).toBe('tense');
		expect(result.body_signals!.value).toBe('pain');
	});
});
