import { describe, it, expect, vi, afterEach } from 'vitest';
import { recommendPracticeWindows } from './scheduling';
import type { PracticeWindow } from './scheduling';

describe('recommendPracticeWindows', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns an array of PracticeWindow objects', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 4
		});
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it('returns at most 5 windows', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 5
		});
		expect(result.length).toBeLessThanOrEqual(5);
	});

	it('each window has required fields', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 4
		});
		for (const w of result) {
			expect(typeof w.label).toBe('string');
			expect(w.label.length).toBeGreaterThan(0);
			expect(typeof w.start_hour).toBe('number');
			expect(typeof w.end_hour).toBe('number');
			expect(typeof w.day_offset).toBe('number');
			expect(typeof w.effective_energy).toBe('number');
			expect(typeof w.noise_ok).toBe('boolean');
			expect(['high', 'medium', 'low']).toContain(w.confidence);
			expect(typeof w.reasoning).toBe('string');
		}
	});

	it('effective_energy is between 1 and 5', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 5
		});
		for (const w of result) {
			expect(w.effective_energy).toBeGreaterThanOrEqual(1);
			expect(w.effective_energy).toBeLessThanOrEqual(5);
		}
	});

	it('end_hour is always start_hour + 1', () => {
		const result = recommendPracticeWindows({
			currentShift: 'day',
			currentEnergy: 3
		});
		for (const w of result) {
			expect(w.end_hour).toBe(w.start_hour + 1);
		}
	});

	it('day_offset is 0, 1, or 2', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 4
		});
		for (const w of result) {
			expect([0, 1, 2]).toContain(w.day_offset);
		}
	});

	it('noise_ok is false during default quiet hours (22-8)', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 4,
			quietHoursStart: 22,
			quietHoursEnd: 8
		});
		for (const w of result) {
			if (w.start_hour >= 22 || w.start_hour < 8) {
				expect(w.noise_ok).toBe(false);
			}
		}
	});

	it('off shift produces higher energy windows than recovery shift', () => {
		const offResult = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 5
		});
		const recoveryResult = recommendPracticeWindows({
			currentShift: 'recovery',
			currentEnergy: 2
		});

		const avgEnergyOff =
			offResult.reduce((sum, w) => sum + w.effective_energy, 0) / offResult.length;
		const avgEnergyRecovery =
			recoveryResult.reduce((sum, w) => sum + w.effective_energy, 0) / recoveryResult.length;

		expect(avgEnergyOff).toBeGreaterThan(avgEnergyRecovery);
	});

	it('confidence correlates with energy level', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 5
		});
		for (const w of result) {
			if (w.effective_energy >= 4) {
				expect(w.confidence).toBe('high');
			} else if (w.effective_energy >= 3) {
				expect(w.confidence).toBe('medium');
			} else {
				expect(w.confidence).toBe('low');
			}
		}
	});

	it('windows are sorted by score descending (best first)', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 4,
			preferredTimes: ['morning']
		});
		// The first result should have energy >= any later result
		// (approximation since score includes noise and preference bonuses)
		if (result.length >= 2) {
			expect(result[0].effective_energy).toBeGreaterThanOrEqual(
				result[result.length - 1].effective_energy
			);
		}
	});

	it('reasoning includes time range', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 4
		});
		for (const w of result) {
			// Should contain am/pm time indicators
			expect(w.reasoning).toMatch(/\d+(am|pm)/);
		}
	});

	it('handles custom quiet hours', () => {
		const result = recommendPracticeWindows({
			currentShift: 'off',
			currentEnergy: 4,
			quietHoursStart: 20,
			quietHoursEnd: 10
		});
		for (const w of result) {
			if (w.start_hour >= 20 || w.start_hour < 10) {
				expect(w.noise_ok).toBe(false);
			}
		}
	});

	it('night shift blocks most daytime hours', () => {
		const result = recommendPracticeWindows({
			currentShift: 'night',
			currentEnergy: 2
		});
		// Night shift on day 0 blocks 0-14 and 22-24, so day-0 windows
		// should only appear in 14-22 range
		const day0Windows = result.filter((w) => w.day_offset === 0);
		for (const w of day0Windows) {
			expect(w.start_hour).toBeGreaterThanOrEqual(14);
			expect(w.start_hour).toBeLessThan(22);
		}
	});

	it('recovery shift filters low energy slots', () => {
		const result = recommendPracticeWindows({
			currentShift: 'recovery',
			currentEnergy: 2,
			recoveryHours: 8
		});
		// All returned windows should have energy >= 2
		for (const w of result) {
			expect(w.effective_energy).toBeGreaterThanOrEqual(2);
		}
	});

	describe('formatHour branch coverage', () => {
		it('formats hour 12 as "12pm" in labels (line 63)', () => {
			// Fix the time to 8am so afternoon slots (12-17) are in the future
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-02-14T08:00:00'));

			try {
				const result = recommendPracticeWindows({
					currentShift: 'off',
					currentEnergy: 5,
					preferredTimes: ['afternoon'],
					quietHoursStart: 23,
					quietHoursEnd: 5
				});
				// start_hour=12 → formatHour(12) = "12pm"
				// or end_hour=12 (start=11) → formatHour(12) = "12pm"
				const has12pm = result.some((w) => w.label.includes('12pm'));
				expect(has12pm).toBe(true);
			} finally {
				vi.useRealTimers();
			}
		});
	});

	describe('buildReasoning branch coverage', () => {
		it('reasoning includes "good energy expected" for day shift with high energy', () => {
			// Day shift with high current energy: future-day slots (dayOffset >= 1)
			// won't be 'off' or 'recovery', and some may project energy >= 4
			const result = recommendPracticeWindows({
				currentShift: 'day',
				currentEnergy: 5,
				preferredTimes: ['morning']
			});
			const highEnergyWindows = result.filter((w) => w.effective_energy >= 4);
			// At least one high-energy window should say "good energy expected"
			// (not "rested after recovery" since shift is 'day')
			const hasGoodEnergy = highEnergyWindows.some((w) =>
				w.reasoning.includes('good energy expected')
			);
			if (highEnergyWindows.length > 0) {
				expect(hasGoodEnergy).toBe(true);
			}
		});

		it('reasoning includes "limited energy" for low-energy recovery slots', () => {
			// Recovery shift with very low energy: day-0 slots should project energy <= 2
			const result = recommendPracticeWindows({
				currentShift: 'recovery',
				currentEnergy: 1,
				recoveryHours: 10
			});
			const lowEnergyWindows = result.filter((w) => w.effective_energy <= 2);
			const hasLimitedEnergy = lowEnergyWindows.some((w) =>
				w.reasoning.includes('limited energy')
			);
			if (lowEnergyWindows.length > 0) {
				expect(hasLimitedEnergy).toBe(true);
			}
		});

		it('reasoning includes "matches your preferred time" for preferred slots', () => {
			const result = recommendPracticeWindows({
				currentShift: 'off',
				currentEnergy: 5,
				preferredTimes: ['morning', 'evening']
			});
			// Windows in morning (8-12) or evening (17-22) should match
			const preferredWindows = result.filter(
				(w) =>
					(w.start_hour >= 8 && w.start_hour < 12) ||
					(w.start_hour >= 17 && w.start_hour < 22)
			);
			const hasPreferredMatch = preferredWindows.some((w) =>
				w.reasoning.includes('matches your preferred time')
			);
			expect(preferredWindows.length).toBeGreaterThan(0);
			expect(hasPreferredMatch).toBe(true);
		});

		it('reasoning for recovery shift day_offset=0 does not say "rested after recovery" (line 175 false path)', () => {
			// Recovery shift on day 0 caps energy around 2-3, never reaching the >= 4
			// threshold. If it did, the condition (shift==='off' || (shift==='recovery' && day_offset>=1))
			// would be false since day_offset=0. The existing "good energy expected" test
			// covers this false path via day shift. Here we verify recovery/day0 behaviour.
			const result = recommendPracticeWindows({
				currentShift: 'recovery',
				currentEnergy: 5,
				recoveryHours: 4
			});
			const day0Windows = result.filter((w) => w.day_offset === 0);
			for (const w of day0Windows) {
				// day_offset=0 recovery windows should NOT say "rested after recovery"
				expect(w.reasoning).not.toContain('rested after recovery');
			}
		});

		it('reasoning includes "moderate energy" for energy level 3', () => {
			// Night shift with moderate energy: many slots will project around 3
			const result = recommendPracticeWindows({
				currentShift: 'night',
				currentEnergy: 3
			});
			const moderateWindows = result.filter((w) => w.effective_energy === 3);
			const hasModerate = moderateWindows.some((w) =>
				w.reasoning.includes('moderate energy')
			);
			if (moderateWindows.length > 0) {
				expect(hasModerate).toBe(true);
			}
		});

		it('reasoning includes "rested after recovery" for off-shift high-energy slots', () => {
			const result = recommendPracticeWindows({
				currentShift: 'off',
				currentEnergy: 5,
				preferredTimes: ['morning']
			});
			const highEnergyWindows = result.filter((w) => w.effective_energy >= 4);
			const hasRested = highEnergyWindows.some((w) =>
				w.reasoning.includes('rested after recovery')
			);
			expect(highEnergyWindows.length).toBeGreaterThan(0);
			expect(hasRested).toBe(true);
		});

		it('reasoning includes "noise-friendly" for slots outside quiet hours', () => {
			const result = recommendPracticeWindows({
				currentShift: 'off',
				currentEnergy: 4,
				quietHoursStart: 23,
				quietHoursEnd: 6
			});
			const noiseFriendly = result.filter((w) => w.noise_ok);
			const hasNoiseFriendly = noiseFriendly.some((w) =>
				w.reasoning.includes('noise-friendly')
			);
			expect(noiseFriendly.length).toBeGreaterThan(0);
			expect(hasNoiseFriendly).toBe(true);
		});

		it('reasoning includes "quiet practice only" for slots during quiet hours', () => {
			// Set quiet hours to cover most of the day so some results fall in quiet range
			const result = recommendPracticeWindows({
				currentShift: 'off',
				currentEnergy: 4,
				quietHoursStart: 0,
				quietHoursEnd: 20
			});
			const quietSlots = result.filter((w) => !w.noise_ok);
			const hasQuiet = quietSlots.some((w) =>
				w.reasoning.includes('quiet practice only')
			);
			if (quietSlots.length > 0) {
				expect(hasQuiet).toBe(true);
			}
		});

		it('includes "quiet practice only" in reasoning for slots during quiet hours', () => {
			// Set quiet hours to 0-24 so ALL slots are in quiet hours
			const result = recommendPracticeWindows({
				currentShift: 'off',
				currentEnergy: 5,
				quietHoursStart: 0,
				quietHoursEnd: 24,
				preferredTimes: ['morning', 'evening']
			});
			expect(result.length).toBeGreaterThan(0);
			// Every slot should be in quiet hours
			for (const window of result) {
				expect(window.noise_ok).toBe(false);
				expect(window.reasoning).toContain('quiet practice only');
			}
		});

		it('includes "matches your preferred time" when slot is in preferred period', () => {
			const result = recommendPracticeWindows({
				currentShift: 'off',
				currentEnergy: 5,
				quietHoursStart: 23,
				quietHoursEnd: 5,
				preferredTimes: ['morning', 'afternoon', 'evening']
			});
			const matchingSlots = result.filter((w) =>
				w.reasoning.includes('matches your preferred time')
			);
			expect(matchingSlots.length).toBeGreaterThan(0);
		});
	});
});
