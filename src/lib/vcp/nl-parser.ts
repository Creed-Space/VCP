import type { PersonalState, PersonalDimension } from './types';

export interface ParsedSignal {
	dimension: keyof PersonalState;
	value: string;
	intensity: number;
	confidence: number;
	source_phrase: string;
}

interface PhraseMapping {
	patterns: RegExp[];
	dimension: keyof PersonalState;
	value: string;
	intensity: number;
	exact: boolean;
}

const PHRASE_MAPPINGS: PhraseMapping[] = [
	// Urgency
	{ patterns: [/\bin a hurry\b/i, /\brushing\b/i, /\bquick question\b/i], dimension: 'perceived_urgency', value: 'pressured', intensity: 4, exact: true },
	{ patterns: [/\btake your time\b/i, /\bno rush\b/i], dimension: 'perceived_urgency', value: 'unhurried', intensity: 2, exact: true },

	// Energy
	{ patterns: [/\bexhausted\b/i, /\bso tired\b/i, /\bwiped out\b/i], dimension: 'energy_level', value: 'depleted', intensity: 4, exact: true },
	{ patterns: [/\bfeeling great\b/i, /\benergized\b/i], dimension: 'energy_level', value: 'rested', intensity: 4, exact: true },

	// Cognitive
	{ patterns: [/\bcan'?t think straight\b/i, /\bbrain fog\b/i], dimension: 'cognitive_state', value: 'foggy', intensity: 4, exact: true },
	{ patterns: [/\boverwhelmed\b/i, /\btoo much\b/i], dimension: 'cognitive_state', value: 'overloaded', intensity: 4, exact: true },

	// Emotional
	{ patterns: [/\bfrustrated\b/i, /\bannoyed\b/i], dimension: 'emotional_tone', value: 'frustrated', intensity: 4, exact: true },
	{ patterns: [/\bstressed\b/i, /\banxious\b/i], dimension: 'emotional_tone', value: 'tense', intensity: 4, exact: true },
	{ patterns: [/\bfeeling great\b/i, /\benergized\b/i], dimension: 'emotional_tone', value: 'uplifted', intensity: 3, exact: false },

	// Body signals
	{ patterns: [/\bnot feeling well\b/i, /\bsick\b/i], dimension: 'body_signals', value: 'unwell', intensity: 3, exact: true },
	{ patterns: [/\bheadache\b/i, /\bmigraine\b/i], dimension: 'body_signals', value: 'pain', intensity: 3, exact: true },
];

export function parsePersonalStateFromText(text: string): ParsedSignal[] {
	const signals: ParsedSignal[] = [];
	const normalizedText = text.normalize('NFKC');

	for (const mapping of PHRASE_MAPPINGS) {
		for (const pattern of mapping.patterns) {
			const match = normalizedText.match(pattern);
			if (match) {
				signals.push({
					dimension: mapping.dimension,
					value: mapping.value,
					intensity: mapping.intensity,
					confidence: mapping.exact ? 0.8 : 0.6,
					source_phrase: match[0]
				});
				break; // Only match first pattern per mapping
			}
		}
	}

	// Deduplicate: keep highest-confidence signal per dimension+value
	const deduped = new Map<string, ParsedSignal>();
	for (const signal of signals) {
		const key = `${signal.dimension}:${signal.value}`;
		const existing = deduped.get(key);
		if (!existing || signal.confidence > existing.confidence) {
			deduped.set(key, signal);
		}
	}

	return Array.from(deduped.values());
}

export function applyParsedSignals(
	current: PersonalState,
	parsed: ParsedSignal[],
	confidenceThreshold = 0.7
): PersonalState {
	const result = { ...current };
	const now = new Date().toISOString();

	for (const signal of parsed) {
		if (signal.confidence < confidenceThreshold) continue;

		const dim: PersonalDimension<string> = {
			value: signal.value,
			intensity: signal.intensity,
			declared_at: now
		};

		(result as Record<string, PersonalDimension<string>>)[signal.dimension] = dim;
	}

	return result;
}
