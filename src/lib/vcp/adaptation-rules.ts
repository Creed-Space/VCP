/**
 * VCP v3.1 Response Adaptation Rules
 *
 * Codifies behavioral adaptation tables from spec section 2.3 and 8.4.
 * Used to generate system prompt guidance based on personal state.
 */

import type { PersonalState, PersonalDimension } from './types';

export interface AdaptationRule {
	dimension: keyof PersonalState;
	value: string;
	minIntensity: number;
	maxIntensity?: number;
	guidance: string;
}

export const ADAPTATION_RULES: AdaptationRule[] = [
	// Cognitive state
	{ dimension: 'cognitive_state', value: 'focused', minIntensity: 1, guidance: 'Support flow state, minimal interruption.' },
	{ dimension: 'cognitive_state', value: 'distracted', minIntensity: 3, guidance: 'Structure clearly, use headings, shorter chunks.' },
	{ dimension: 'cognitive_state', value: 'overloaded', minIntensity: 3, maxIntensity: 4, guidance: 'Reduce options, one thing at a time.' },
	{ dimension: 'cognitive_state', value: 'overloaded', minIntensity: 5, guidance: 'Absolute minimum. Yes/no questions only. Make recommendations instead of listing options.' },
	{ dimension: 'cognitive_state', value: 'foggy', minIntensity: 3, guidance: 'Very simple language. Repeat key points. Concrete examples. Shorter sentences.' },
	{ dimension: 'cognitive_state', value: 'reflective', minIntensity: 1, guidance: 'Allow space for thought. Deeper engagement OK.' },

	// Emotional tone
	{ dimension: 'emotional_tone', value: 'calm', minIntensity: 1, guidance: 'Normal interaction.' },
	{ dimension: 'emotional_tone', value: 'tense', minIntensity: 3, maxIntensity: 4, guidance: 'Reassuring tone, break down problems, reduce uncertainty.' },
	{ dimension: 'emotional_tone', value: 'tense', minIntensity: 5, guidance: 'Grounding, safety-focused, calm anchor.' },
	{ dimension: 'emotional_tone', value: 'frustrated', minIntensity: 3, maxIntensity: 4, guidance: 'Acknowledge frustration. Skip preamble. Get to solutions.' },
	{ dimension: 'emotional_tone', value: 'frustrated', minIntensity: 5, guidance: 'Minimal text, direct answers, do not escalate.' },
	{ dimension: 'emotional_tone', value: 'uplifted', minIntensity: 1, guidance: 'Match energy appropriately, celebrate.' },

	// Energy level
	{ dimension: 'energy_level', value: 'rested', minIntensity: 1, guidance: 'Normal interaction, full engagement OK.' },
	{ dimension: 'energy_level', value: 'low_energy', minIntensity: 3, maxIntensity: 4, guidance: 'Keep concise, reduce demands.' },
	{ dimension: 'energy_level', value: 'low_energy', minIntensity: 5, guidance: 'Minimal demands, offer to defer.' },
	{ dimension: 'energy_level', value: 'fatigued', minIntensity: 3, guidance: 'Gentler tone, simplify, chunk, suggest breaks.' },
	{ dimension: 'energy_level', value: 'wired', minIntensity: 3, guidance: 'Calming tone, help channel energy productively.' },
	{ dimension: 'energy_level', value: 'depleted', minIntensity: 3, maxIntensity: 4, guidance: 'Very gentle, defer non-urgent.' },
	{ dimension: 'energy_level', value: 'depleted', minIntensity: 5, guidance: 'Absolute minimum, prioritize rest.' },

	// Perceived urgency
	{ dimension: 'perceived_urgency', value: 'unhurried', minIntensity: 1, guidance: 'Normal pace, full explanations.' },
	{ dimension: 'perceived_urgency', value: 'time_aware', minIntensity: 3, guidance: 'Efficient, prioritize key points.' },
	{ dimension: 'perceived_urgency', value: 'pressured', minIntensity: 3, maxIntensity: 4, guidance: 'Concise, skip non-essential caveats.' },
	{ dimension: 'perceived_urgency', value: 'pressured', minIntensity: 5, guidance: 'Minimal, direct answers only.' },
	{ dimension: 'perceived_urgency', value: 'critical', minIntensity: 3, guidance: 'Absolute minimum. No pleasantries. Emergency mode.' },

	// Body signals
	{ dimension: 'body_signals', value: 'neutral', minIntensity: 1, guidance: 'Normal interaction.' },
	{ dimension: 'body_signals', value: 'discomfort', minIntensity: 3, maxIntensity: 4, guidance: 'Check in, offer to defer if needed.' },
	{ dimension: 'body_signals', value: 'discomfort', minIntensity: 5, guidance: 'Gentle, offer to postpone non-urgent.' },
	{ dimension: 'body_signals', value: 'pain', minIntensity: 3, guidance: 'Very gentle tone, minimal demands, offer deferrals.' },
	{ dimension: 'body_signals', value: 'unwell', minIntensity: 3, maxIntensity: 4, guidance: 'Gentler tone, simplify, acknowledge difficulty.' },
	{ dimension: 'body_signals', value: 'unwell', minIntensity: 5, guidance: 'Minimal interaction. Prioritize wellbeing. Suggest rest.' },
	{ dimension: 'body_signals', value: 'recovering', minIntensity: 1, guidance: 'Patient, acknowledge healing takes time.' },
];

/** Extended body signal adaptation rules (sub-signals) */
export const EXTENDED_BODY_RULES: Record<string, string> = {
	bathroom: 'Wrap up gracefully. Suggest continuing later.',
	hunger: 'Keep response brief. Acknowledge if conversation can wait.',
	sensory: 'Reduce formatting, calmer presentation.',
	medication: 'Brief reminder, then continue normally.',
	movement: 'Acknowledge need, suggest break.',
	thirst: 'Keep brief.',
};

/**
 * Get adaptation guidance for a personal state.
 * Returns an array of guidance strings to inject into the system prompt.
 */
export function getAdaptationGuidance(state?: PersonalState): string[] {
	if (!state) return [];

	const guidance: string[] = [];

	for (const rule of ADAPTATION_RULES) {
		const dim = state[rule.dimension] as PersonalDimension<string> | undefined;
		if (!dim) continue;

		const intensity = dim.intensity ?? 3;
		if (dim.value !== rule.value) continue;
		if (intensity < rule.minIntensity) continue;
		if (rule.maxIntensity !== undefined && intensity > rule.maxIntensity) continue;

		guidance.push(rule.guidance);
	}

	// Check extended body signals
	const body = state.body_signals;
	if (body?.extended) {
		const extGuidance = EXTENDED_BODY_RULES[body.extended];
		if (extGuidance) {
			guidance.push(extGuidance);
		}
	}

	return guidance;
}

/**
 * Build a formatted response guidance block for injection into system prompts.
 */
export function buildResponseGuidanceBlock(state?: PersonalState): string {
	const lines = getAdaptationGuidance(state);
	if (lines.length === 0) return '';

	return `\n## Personal State Adaptations\n${lines.map(l => `- ${l}`).join('\n')}`;
}
