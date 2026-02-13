/**
 * Energy-Aware Scheduling Algorithm
 *
 * Recommends practice windows for users with irregular schedules
 * (e.g., Gentian — factory shift worker learning guitar).
 *
 * Uses VCP decay policies to project energy across candidate slots,
 * scores them by energy, noise feasibility, and user preference,
 * then returns the top-ranked windows with confidence and reasoning.
 */

import type { DecayPolicy } from '$lib/vcp/types';
import { computeEffectiveIntensity, getDefaultDecayPolicy } from '$lib/vcp/decay';

// ============================================
// Types
// ============================================

export type ShiftType = 'day' | 'night' | 'off' | 'recovery';

export interface PracticeWindow {
	label: string;
	start_hour: number;
	end_hour: number;
	day_offset: number;
	effective_energy: number;
	noise_ok: boolean;
	confidence: 'high' | 'medium' | 'low';
	reasoning: string;
}

interface CandidateSlot {
	day_offset: number;
	start_hour: number;
	end_hour: number;
	projected_energy: number;
	noise_ok: boolean;
	matches_preferred: boolean;
	day_label: string;
}

// ============================================
// Helpers
// ============================================

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_PERIOD_HOURS: Record<string, [number, number]> = {
	morning: [8, 12],
	afternoon: [12, 17],
	evening: [17, 22]
};

function getDayLabel(dayOffset: number): string {
	const date = new Date();
	date.setDate(date.getDate() + dayOffset);
	if (dayOffset === 0) return 'Today';
	if (dayOffset === 1) return 'Tomorrow';
	return DAY_NAMES[date.getDay()] ?? `Day +${dayOffset}`;
}

function formatHour(hour: number): string {
	if (hour === 0 || hour === 24) return '12am';
	if (hour === 12) return '12pm';
	if (hour < 12) return `${hour}am`;
	return `${hour - 12}pm`;
}

function isInQuietHours(hour: number, quietStart: number, quietEnd: number): boolean {
	if (quietStart <= quietEnd) {
		// Same-day range (e.g., 1-6)
		return hour >= quietStart && hour < quietEnd;
	}
	// Wraps midnight (e.g., 22-8)
	return hour >= quietStart || hour < quietEnd;
}

function matchesPreferred(hour: number, preferredTimes: string[]): boolean {
	for (const pref of preferredTimes) {
		const range = TIME_PERIOD_HOURS[pref.toLowerCase()];
		if (range && hour >= range[0] && hour < range[1]) return true;
	}
	return false;
}

/**
 * Determine which hours are blocked by work for a given shift type and day offset.
 * Returns a Set of hours that are unavailable.
 */
function getWorkHours(
	shift: ShiftType,
	dayOffset: number,
	recoveryHours: number
): Set<number> {
	const blocked = new Set<number>();

	if (shift === 'day') {
		// Day shift: 6am-2pm on workdays
		if (dayOffset === 0) {
			for (let h = 6; h < 14; h++) blocked.add(h);
		}
	} else if (shift === 'night') {
		// Night shift: 10pm-6am (blocks late evening today, early morning tomorrow)
		if (dayOffset === 0) {
			for (let h = 22; h < 24; h++) blocked.add(h);
			// Also block daytime for sleep after previous night
			for (let h = 0; h < 14; h++) blocked.add(h);
		}
		if (dayOffset === 1) {
			for (let h = 0; h < 6; h++) blocked.add(h);
		}
	} else if (shift === 'recovery') {
		// Recovery after night shift: blocked for recoveryHours from start of day
		if (dayOffset === 0) {
			for (let h = 0; h < Math.min(recoveryHours + 6, 24); h++) blocked.add(h);
		}
	}
	// 'off' — nothing blocked

	return blocked;
}

/**
 * Project energy for a candidate slot based on shift context.
 */
function projectBaseEnergy(
	shift: ShiftType,
	dayOffset: number,
	hour: number,
	currentEnergy: number
): number {
	// Same-day projections anchored to current energy
	if (dayOffset === 0) {
		if (shift === 'recovery') return Math.min(currentEnergy, 2);
		if (shift === 'night') return Math.min(currentEnergy, 2);
		if (shift === 'day' && hour >= 14) return Math.max(currentEnergy - 1, 2);
		return currentEnergy;
	}

	// Future-day heuristics
	if (shift === 'recovery') {
		// Post-recovery: gradually improving
		if (dayOffset === 1 && hour < 12) return 3;
		if (dayOffset === 1) return 4;
		return 4;
	}
	if (shift === 'night') {
		// Day after night shift is recovery
		if (dayOffset === 1 && hour < 14) return 2;
		if (dayOffset === 1) return 3;
		return 3;
	}
	if (shift === 'off') {
		// Days off: rested
		if (hour >= 8 && hour < 12) return 5;
		return 4;
	}
	// Day shift tomorrow
	if (dayOffset === 1 && hour >= 14) return 3;
	return 3;
}

function getConfidence(energy: number): 'high' | 'medium' | 'low' {
	if (energy >= 4) return 'high';
	if (energy >= 3) return 'medium';
	return 'low';
}

function buildReasoning(slot: CandidateSlot, shift: ShiftType, preferredTimes: string[]): string {
	const parts: string[] = [];

	parts.push(`${slot.day_label} ${formatHour(slot.start_hour)}-${formatHour(slot.end_hour)}`);

	// Energy context
	if (slot.projected_energy >= 4) {
		if (shift === 'off' || (shift === 'recovery' && slot.day_offset >= 1)) {
			parts.push('rested after recovery');
		} else {
			parts.push('good energy expected');
		}
	} else if (slot.projected_energy === 3) {
		parts.push('moderate energy');
	} else {
		parts.push('limited energy — keep it light');
	}

	// Noise
	if (slot.noise_ok) {
		parts.push('noise-friendly');
	} else {
		parts.push('quiet practice only');
	}

	// Preference match
	if (slot.matches_preferred) {
		parts.push('matches your preferred time');
	}

	return parts.join(', ');
}

// ============================================
// Main function
// ============================================

export function recommendPracticeWindows(options: {
	currentShift: ShiftType;
	currentEnergy: number;
	quietHoursStart?: number;
	quietHoursEnd?: number;
	preferredTimes?: string[];
	recoveryHours?: number;
}): PracticeWindow[] {
	const {
		currentShift,
		currentEnergy,
		quietHoursStart = 22,
		quietHoursEnd = 8,
		preferredTimes = ['evening'],
		recoveryHours = 6
	} = options;

	const energyPolicy: DecayPolicy = getDefaultDecayPolicy('energy_level');
	const now = new Date();

	// Generate candidate 1-hour slots for next 48 hours
	const candidates: CandidateSlot[] = [];

	for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
		const workBlocked = getWorkHours(currentShift, dayOffset, recoveryHours);

		for (let hour = 0; hour < 24; hour++) {
			// Skip blocked work hours
			if (workBlocked.has(hour)) continue;

			const baseEnergy = projectBaseEnergy(currentShift, dayOffset, hour, currentEnergy);

			// Apply decay from current declared energy using the VCP decay system
			const hoursFromNow = dayOffset * 24 + (hour - now.getHours());
			if (hoursFromNow < 0) continue; // Skip past hours
			if (hoursFromNow > 48) continue; // 48-hour window

			const declaredAt = new Date(now.getTime());
			const slotTime = new Date(now.getTime() + hoursFromNow * 3600 * 1000);
			const decayed = computeEffectiveIntensity(
				currentEnergy,
				declaredAt,
				energyPolicy,
				slotTime
			);

			// Blend: base heuristic weighted 60%, decay-adjusted 40%
			const projected = Math.round(baseEnergy * 0.6 + decayed * 0.4);
			const clampedEnergy = Math.max(1, Math.min(5, projected));

			// Filter out very low energy slots
			if (clampedEnergy < 2) continue;

			const noiseOk = !isInQuietHours(hour, quietHoursStart, quietHoursEnd);
			const matchesPref = matchesPreferred(hour, preferredTimes);
			const dayLabel = getDayLabel(dayOffset);

			candidates.push({
				day_offset: dayOffset,
				start_hour: hour,
				end_hour: hour + 1,
				projected_energy: clampedEnergy,
				noise_ok: noiseOk,
				matches_preferred: matchesPref,
				day_label: dayLabel
			});
		}
	}

	// Score candidates
	const scored = candidates.map((slot) => {
		const score =
			slot.projected_energy *
			(slot.noise_ok ? 1.5 : 0.8) *
			(slot.matches_preferred ? 1.3 : 1.0);
		return { slot, score };
	});

	// Sort by score descending
	scored.sort((a, b) => b.score - a.score);

	// Take top 5 (or fewer if not enough candidates)
	const top = scored.slice(0, 5);

	return top.map(({ slot }) => ({
		label: `${slot.day_label} ${formatHour(slot.start_hour)}-${formatHour(slot.end_hour)}`,
		start_hour: slot.start_hour,
		end_hour: slot.end_hour,
		day_offset: slot.day_offset,
		effective_energy: slot.projected_energy,
		noise_ok: slot.noise_ok,
		confidence: getConfidence(slot.projected_energy),
		reasoning: buildReasoning(slot, currentShift, preferredTimes)
	}));
}
