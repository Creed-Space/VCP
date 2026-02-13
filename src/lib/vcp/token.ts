/**
 * VCP Token Encoding - CSM-1 (Compact State Message) Format
 *
 * Encodes VCP context into a compact, human-readable token format
 * using emoji shortcodes for constraints and privacy markers.
 *
 * Format:
 * VCP:<version>:<profile_id>
 * C:<constitution_id>@<version>
 * P:<persona>:<adherence>
 * G:<goal>:<experience>:<learning_style>
 * X:<constraint_flags>
 * F:<active_flags>
 * S:<private_markers>
 */

import type { VCPContext, ConstraintFlags, PortablePreferences, ProsaicDimensions, PersonalState } from './types';
import { computeEffectiveIntensity, computeLifecycleState, getDefaultDecayPolicy } from './decay';

// ============================================
// Emoji Shortcodes
// ============================================

export const CONSTRAINT_EMOJI = {
	noise_restricted: '🔇',
	budget_limited: '💰',
	energy_variable: '⚡',
	time_limited: '⏰',
	schedule_irregular: '📅',
	mobility_limited: '🚶',
	health_considerations: '💊'
} as const;

export const PREFERENCE_EMOJI = {
	quiet_preferred: '🔇',
	silent_required: '🔕',
	low: '💰',
	free_only: '🆓',
	high: '💎',
	flexible: '⏰',
	'15_minutes': '⚡',
	'30_minutes': '⏱️',
	'60_minutes': '🕐'
} as const;

export const PRIVATE_MARKER = '🔒';
export const SHARED_MARKER = '✓';

// Prosaic dimension emoji
export const PROSAIC_EMOJI = {
	urgency: '⚡',
	health: '💊',
	cognitive: '🧩',
	affect: '💭'
} as const;

// Personal state dimension emoji (v3.1)
export const PERSONAL_STATE_EMOJI = {
	cognitive_state: '🧠',
	emotional_tone: '💭',
	energy_level: '🔋',
	perceived_urgency: '⚡',
	body_signals: '🩺'
} as const;

// ============================================
// CSM-1 Encoding
// ============================================

/**
 * Encode a VCP context into CSM-1 format
 */
export function encodeContextToCSM1(ctx: VCPContext): string {
	if (!ctx.constitution?.id) {
		console.warn('VCP token: missing constitution ID');
		return '';
	}

	const lines: string[] = [];

	// Line 1: VCP header
	lines.push(`VCP:${ctx.vcp_version}:${ctx.profile_id}`);

	// Line 2: Constitution reference
	lines.push(`C:${ctx.constitution.id}@${ctx.constitution.version}`);

	// Line 3: Persona and adherence
	lines.push(`P:${ctx.constitution.persona || 'muse'}:${ctx.constitution.adherence || 3}`);

	// Line 4: Goal context
	const goal = ctx.public_profile?.goal || 'unset';
	const experience = ctx.public_profile?.experience || 'beginner';
	const style = ctx.public_profile?.learning_style || 'mixed';
	lines.push(`G:${goal}:${experience}:${style}`);

	// Line 5: Constraint flags with emoji
	lines.push(encodeConstraints(ctx.constraints, ctx.portable_preferences));

	// Line 6: Active flags
	lines.push(encodeActiveFlags(ctx.constraints));

	// Line 7: Private markers (show categories, not values)
	lines.push(encodePrivateMarkers(ctx.private_context));

	// Line 8: System context (if present)
	if (ctx.system_context) {
		lines.push(`SC:${ctx.system_context}`);
	}

	// Line 9: Personal state dimensions (v3.1) - preferred over prosaic
	const personalStateLine = encodePersonalState(ctx.personal_state);
	if (personalStateLine !== 'PS:none') {
		lines.push(personalStateLine);
		// Line 9: Lifecycle state for each dimension
		const lcLine = encodeLifecycleLine(ctx.personal_state);
		if (lcLine) {
			lines.push(lcLine);
		}
	} else {
		// Fallback to legacy prosaic encoding
		const prosaicLine = encodeProsaicDimensions(ctx.prosaic);
		if (prosaicLine !== 'R:none') {
			lines.push(prosaicLine);
		}
	}

	return lines.join('\n');
}

/**
 * Encode v3.1 personal state dimensions
 * Format: PS:🧠focused:3|💭calm:2|🔋fatigued:3|⚡unhurried:2|🩺neutral:1
 */
function encodePersonalState(personalState?: PersonalState): string {
	if (!personalState) return 'PS:none';

	const parts: string[] = [];
	const dims = [
		{ key: 'cognitive_state', emoji: '🧠' },
		{ key: 'emotional_tone', emoji: '💭' },
		{ key: 'energy_level', emoji: '🔋' },
		{ key: 'perceived_urgency', emoji: '⚡' },
		{ key: 'body_signals', emoji: '🩺' }
	] as const;

	const now = new Date();
	for (const dim of dims) {
		const d = personalState[dim.key];
		if (d) {
			let intensity = d.intensity ?? 3;
			if (d.declared_at) {
				const policy = d.decay_policy ?? getDefaultDecayPolicy(dim.key);
				intensity = computeEffectiveIntensity(
					intensity,
					new Date(d.declared_at),
					policy,
					now
				);
			}
			const ext = d.extended ? `:${d.extended}` : '';
			parts.push(`${dim.emoji}${d.value}:${intensity}${ext}`);
		}
	}

	return parts.length > 0 ? `PS:${parts.join('|')}` : 'PS:none';
}

function encodeLifecycleLine(personalState?: PersonalState): string {
	if (!personalState) return '';

	const dims = [
		{ key: 'cognitive_state', emoji: '🧠' },
		{ key: 'emotional_tone', emoji: '💭' },
		{ key: 'energy_level', emoji: '🔋' },
		{ key: 'perceived_urgency', emoji: '⚡' },
		{ key: 'body_signals', emoji: '🩺' }
	] as const;

	const stateCodeMap: Record<string, string> = {
		set: 'S',
		active: 'A',
		decaying: 'D',
		stale: 'T',
		expired: 'X'
	};

	const parts: string[] = [];
	const now = new Date();

	for (const dim of dims) {
		const d = personalState[dim.key];
		if (!d) continue;

		const policy = d.decay_policy ?? getDefaultDecayPolicy(dim.key);
		if (d.pinned || policy.pinned) {
			parts.push(`${dim.emoji}P`);
			continue;
		}

		const declaredAt = d.declared_at ? new Date(d.declared_at) : now;
		const elapsed = Math.round((now.getTime() - declaredAt.getTime()) / 1000);
		const state = computeLifecycleState(d.intensity ?? 3, declaredAt, policy, now);
		parts.push(`${dim.emoji}${stateCodeMap[state] ?? 'A'}:${elapsed}s`);
	}

	return parts.length > 0 ? `LC:${parts.join('|')}` : '';
}

/**
 * Encode prosaic dimensions with emoji and values
 * Format: R:⚡0.8|💊0.2|🧩0.6|💭0.3
 */
function encodeProsaicDimensions(prosaic?: ProsaicDimensions): string {
	if (!prosaic) return 'R:none';

	const parts: string[] = [];

	if (prosaic.urgency !== undefined && prosaic.urgency > 0) {
		let urgencyStr = `⚡${prosaic.urgency.toFixed(1)}`;
		if (prosaic.sub_signals?.deadline_horizon) {
			urgencyStr += `:${prosaic.sub_signals.deadline_horizon}`;
		}
		parts.push(urgencyStr);
	}

	if (prosaic.health !== undefined && prosaic.health > 0) {
		let healthStr = `💊${prosaic.health.toFixed(1)}`;
		if (prosaic.sub_signals?.physical_need) {
			healthStr += `:${prosaic.sub_signals.physical_need}`;
		} else if (prosaic.sub_signals?.condition) {
			healthStr += `:${prosaic.sub_signals.condition}`;
		}
		parts.push(healthStr);
	}

	if (prosaic.cognitive !== undefined && prosaic.cognitive > 0) {
		let cogStr = `🧩${prosaic.cognitive.toFixed(1)}`;
		if (prosaic.sub_signals?.cognitive_state) {
			cogStr += `:${prosaic.sub_signals.cognitive_state}`;
		}
		parts.push(cogStr);
	}

	if (prosaic.affect !== undefined && prosaic.affect > 0) {
		let affectStr = `💭${prosaic.affect.toFixed(1)}`;
		if (prosaic.sub_signals?.emotional_state) {
			affectStr += `:${prosaic.sub_signals.emotional_state}`;
		}
		parts.push(affectStr);
	}

	if (parts.length === 0) {
		return 'R:none';
	}

	return `R:${parts.join('|')}`;
}

/**
 * Encode constraint flags with emoji shortcodes
 */
function encodeConstraints(
	constraints?: ConstraintFlags,
	prefs?: PortablePreferences
): string {
	const parts: string[] = [];

	// From constraints
	if (constraints?.noise_restricted) parts.push('🔇');
	if (constraints?.time_limited) parts.push('⏰lim');
	if (constraints?.energy_variable) parts.push('⚡var');

	// From preferences
	if (prefs?.noise_mode === 'quiet_preferred') parts.push('🔇quiet');
	if (prefs?.noise_mode === 'silent_required') parts.push('🔕silent');
	if (prefs?.budget_range === 'low') parts.push('💰low');
	if (prefs?.budget_range === 'free_only') parts.push('🆓');
	if (prefs?.session_length) parts.push(`⏱️${prefs.session_length.replace('_', '')}`);

	if (parts.length === 0) {
		return 'X:none';
	}

	return `X:${parts.join(':')}`;
}

/**
 * Encode which flags are currently active
 */
function encodeActiveFlags(constraints?: ConstraintFlags): string {
	const flags: string[] = [];

	if (constraints?.time_limited) flags.push('time_limited');
	if (constraints?.noise_restricted) flags.push('noise_restricted');
	if (constraints?.budget_limited) flags.push('budget_limited');
	if (constraints?.energy_variable) flags.push('energy_variable');
	if (constraints?.schedule_irregular) flags.push('schedule_irregular');

	if (flags.length === 0) {
		return 'F:none';
	}

	return `F:${flags.join('|')}`;
}

/**
 * Encode private context markers (categories only, never values)
 */
function encodePrivateMarkers(privateContext?: Record<string, unknown>): string {
	if (!privateContext) {
		return 'S:none';
	}

	const markers: string[] = [];
	const keys = Object.keys(privateContext).filter(
		(k) => k !== '_note' && k !== '_reasoning'
	);

	// Group by category prefix
	const categories = new Set<string>();
	for (const key of keys) {
		// Extract category from key (e.g., work_type -> work)
		const category = key.split('_')[0];
		categories.add(category);
	}

	for (const cat of categories) {
		markers.push(`${PRIVATE_MARKER}${cat}`);
	}

	if (markers.length === 0) {
		return 'S:none';
	}

	return `S:${markers.join('|')}`;
}

// ============================================
// Display Formatting
// ============================================

/**
 * Format CSM-1 token for display with box drawing
 */
export function formatTokenForDisplay(csm1: string): string {
	const lines = csm1.split('\n');
	const maxLen = Math.max(...lines.map((l) => l.length), 40);

	const border = '─'.repeat(maxLen + 2);
	const formatted = lines.map((l) => `│ ${l.padEnd(maxLen)} │`).join('\n');

	return `┌${border}┐\n${formatted}\n└${border}┘`;
}

/**
 * Get emoji legend for display
 */
export function getEmojiLegend(): { emoji: string; meaning: string }[] {
	return [
		{ emoji: '🔇', meaning: 'quiet mode' },
		{ emoji: '🔕', meaning: 'silent required' },
		{ emoji: '💰', meaning: 'budget tier' },
		{ emoji: '🆓', meaning: 'free only' },
		{ emoji: '⏰', meaning: 'time limited' },
		{ emoji: '⏱️', meaning: 'session length' },
		{ emoji: '📅', meaning: 'irregular schedule' },
		{ emoji: '🔒', meaning: 'private (hidden value)' },
		{ emoji: '✓', meaning: 'shared' },
		// Prosaic dimensions (legacy)
		{ emoji: '💊', meaning: 'health state' },
		{ emoji: '🧩', meaning: 'cognitive load' },
		// Personal state dimensions (v3.1)
		{ emoji: '🧠', meaning: 'cognitive state' },
		{ emoji: '⚡', meaning: 'urgency / perceived urgency' },
		{ emoji: '💭', meaning: 'emotional tone / affect' },
		{ emoji: '🔋', meaning: 'energy level' },
		{ emoji: '🩺', meaning: 'body signals' }
	];
}

/**
 * Parse CSM-1 token back into components (for display/debugging)
 */
export function parseCSM1Token(token: string): Record<string, string> {
	const lines = token.split('\n');
	const parsed: Record<string, string> = {};

	for (const line of lines) {
		const [key, ...rest] = line.split(':');
		if (key && rest.length > 0) {
			parsed[key] = rest.join(':');
		}
	}

	return parsed;
}

/**
 * Get what would be transmitted vs withheld for a context
 */
export function getTransmissionSummary(ctx: VCPContext): {
	transmitted: string[];
	withheld: string[];
	influencing: string[];
} {
	const transmitted: string[] = [];
	const withheld: string[] = [];
	const influencing: string[] = [];

	// Public profile - transmitted
	if (ctx.public_profile) {
		for (const [key, value] of Object.entries(ctx.public_profile)) {
			if (value !== undefined && value !== null) {
				transmitted.push(key);
			}
		}
	}

	// Constraints - transmitted as flags, influencing decisions
	if (ctx.constraints) {
		for (const [key, value] of Object.entries(ctx.constraints)) {
			if (value === true) {
				influencing.push(key);
			}
		}
	}

	// Private context - withheld
	if (ctx.private_context) {
		for (const key of Object.keys(ctx.private_context)) {
			if (key !== '_note' && key !== '_reasoning') {
				withheld.push(key);
			}
		}
	}

	// Personal state (v3.1) - influencing
	if (ctx.personal_state) {
		const ps = ctx.personal_state;
		if (ps.cognitive_state) influencing.push(`🧠 ${ps.cognitive_state.value}:${ps.cognitive_state.intensity ?? 3}`);
		if (ps.emotional_tone) influencing.push(`💭 ${ps.emotional_tone.value}:${ps.emotional_tone.intensity ?? 3}`);
		if (ps.energy_level) influencing.push(`🔋 ${ps.energy_level.value}:${ps.energy_level.intensity ?? 3}`);
		if (ps.perceived_urgency) influencing.push(`⚡ ${ps.perceived_urgency.value}:${ps.perceived_urgency.intensity ?? 3}`);
		if (ps.body_signals) influencing.push(`🩺 ${ps.body_signals.value}:${ps.body_signals.intensity ?? 3}`);
	}

	// Prosaic dimensions - influencing (declared state shapes response) - legacy fallback
	if (!ctx.personal_state && ctx.prosaic) {
		if (ctx.prosaic.urgency && ctx.prosaic.urgency > 0) influencing.push('⚡ urgency');
		if (ctx.prosaic.health && ctx.prosaic.health > 0) influencing.push('💊 health');
		if (ctx.prosaic.cognitive && ctx.prosaic.cognitive > 0) influencing.push('🧩 cognitive');
		if (ctx.prosaic.affect && ctx.prosaic.affect > 0) influencing.push('💭 affect');
	}

	return { transmitted, withheld, influencing };
}

/**
 * Encode context to compact wire format using ‖ separator (spec §3.1).
 * CSM-1 uses \n for LLM readability; wire format uses ‖ for machine parsing.
 */
export function toWireFormat(ctx: VCPContext): string {
	const csm1 = encodeContextToCSM1(ctx);
	return csm1.split('\n').join('‖');
}

export default {
	encodeContextToCSM1,
	toWireFormat,
	formatTokenForDisplay,
	getEmojiLegend,
	parseCSM1Token,
	getTransmissionSummary,
	CONSTRAINT_EMOJI,
	PROSAIC_EMOJI,
	PERSONAL_STATE_EMOJI,
	PRIVATE_MARKER,
	SHARED_MARKER
};
