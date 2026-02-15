import { describe, it, expect } from 'vitest';
import {
	DEFAULT_DECAY_POLICIES,
	getDefaultDecayPolicy,
	computeEffectiveIntensity,
	computeLifecycleState
} from './decay';
import type { DecayPolicy } from './types';

function makeDate(offsetSeconds: number, base: Date = new Date('2026-01-15T12:00:00Z')): Date {
	return new Date(base.getTime() + offsetSeconds * 1000);
}

const BASE = new Date('2026-01-15T12:00:00Z');

describe('DEFAULT_DECAY_POLICIES', () => {
	it('has all five personal state dimensions', () => {
		const expected = [
			'perceived_urgency',
			'body_signals',
			'cognitive_state',
			'emotional_tone',
			'energy_level'
		];
		for (const key of expected) {
			expect(DEFAULT_DECAY_POLICIES[key]).toBeDefined();
		}
	});

	it('perceived_urgency has 900s half-life', () => {
		expect(DEFAULT_DECAY_POLICIES.perceived_urgency.half_life_seconds).toBe(900);
	});

	it('body_signals has 14400s half-life', () => {
		expect(DEFAULT_DECAY_POLICIES.body_signals.half_life_seconds).toBe(14400);
	});

	it('cognitive_state has 720s half-life and reset_on_engagement', () => {
		expect(DEFAULT_DECAY_POLICIES.cognitive_state.half_life_seconds).toBe(720);
		expect(DEFAULT_DECAY_POLICIES.cognitive_state.reset_on_engagement).toBe(true);
	});

	it('emotional_tone has 1800s half-life', () => {
		expect(DEFAULT_DECAY_POLICIES.emotional_tone.half_life_seconds).toBe(1800);
	});

	it('energy_level has 7200s half-life', () => {
		expect(DEFAULT_DECAY_POLICIES.energy_level.half_life_seconds).toBe(7200);
	});

	it('all policies use exponential curve with baseline 1', () => {
		for (const policy of Object.values(DEFAULT_DECAY_POLICIES)) {
			expect(policy.curve).toBe('exponential');
			expect(policy.baseline).toBe(1);
		}
	});

	it('only cognitive_state has reset_on_engagement=true', () => {
		for (const [key, policy] of Object.entries(DEFAULT_DECAY_POLICIES)) {
			if (key === 'cognitive_state') {
				expect(policy.reset_on_engagement).toBe(true);
			} else {
				expect(policy.reset_on_engagement).toBe(false);
			}
		}
	});
});

describe('getDefaultDecayPolicy', () => {
	it('returns matching policy for known dimensions', () => {
		expect(getDefaultDecayPolicy('cognitive_state').half_life_seconds).toBe(720);
		expect(getDefaultDecayPolicy('body_signals').half_life_seconds).toBe(14400);
	});

	it('falls back to perceived_urgency for unknown dimensions', () => {
		const fallback = getDefaultDecayPolicy('unknown_dimension');
		expect(fallback.half_life_seconds).toBe(900);
	});
});

describe('computeEffectiveIntensity', () => {
	describe('exponential decay', () => {
		const policy: DecayPolicy = {
			curve: 'exponential',
			half_life_seconds: 900,
			baseline: 1,
			stale_threshold: 0.3,
			fresh_window_seconds: 60,
			pinned: false,
			reset_on_engagement: false
		};

		it('returns declared value at time zero', () => {
			expect(computeEffectiveIntensity(5, BASE, policy, BASE)).toBe(5);
		});

		it('returns declared value for future dates', () => {
			const future = makeDate(60);
			expect(computeEffectiveIntensity(5, future, policy, BASE)).toBe(5);
		});

		it('decays to half after one half-life', () => {
			const now = makeDate(900);
			const result = computeEffectiveIntensity(5, BASE, policy, now);
			// declared=5, baseline=1, range=4, after half-life => 1 + 4*0.5 = 3, floor = 3
			expect(result).toBe(3);
		});

		it('decays further after two half-lives', () => {
			const now = makeDate(1800);
			const result = computeEffectiveIntensity(5, BASE, policy, now);
			// 1 + 4*0.25 = 2, floor = 2
			expect(result).toBe(2);
		});

		it('never goes below baseline', () => {
			const now = makeDate(86400); // 24 hours
			const result = computeEffectiveIntensity(5, BASE, policy, now);
			expect(result).toBe(1);
		});

		it('handles intensity equal to baseline', () => {
			const now = makeDate(900);
			const result = computeEffectiveIntensity(1, BASE, policy, now);
			expect(result).toBe(1);
		});
	});

	describe('linear decay', () => {
		const policy: DecayPolicy = {
			curve: 'linear',
			half_life_seconds: 1000,
			baseline: 1,
			stale_threshold: 0.3,
			fresh_window_seconds: 60,
			pinned: false,
			reset_on_engagement: false,
			full_decay_seconds: 4000
		};

		it('returns declared at time zero', () => {
			expect(computeEffectiveIntensity(5, BASE, policy, BASE)).toBe(5);
		});

		it('decays linearly to baseline over full_decay_seconds', () => {
			const now = makeDate(4000);
			const result = computeEffectiveIntensity(5, BASE, policy, now);
			expect(result).toBe(1);
		});

		it('decays halfway at half the full_decay_seconds', () => {
			const now = makeDate(2000);
			const result = computeEffectiveIntensity(5, BASE, policy, now);
			// 5 - (5-1)*0.5 = 5 - 2 = 3, floor = 3
			expect(result).toBe(3);
		});

		it('uses half_life_seconds * 4 when full_decay_seconds not set', () => {
			const noFullDecay: DecayPolicy = { ...policy, full_decay_seconds: undefined };
			// default full_decay = 1000*4 = 4000
			const now = makeDate(4000);
			expect(computeEffectiveIntensity(5, BASE, noFullDecay, now)).toBe(1);
		});
	});

	describe('step decay', () => {
		const policy: DecayPolicy = {
			curve: 'step',
			half_life_seconds: 1000,
			baseline: 1,
			stale_threshold: 0.3,
			fresh_window_seconds: 60,
			pinned: false,
			reset_on_engagement: false,
			step_thresholds: [
				{ after_seconds: 300, intensity: 4 },
				{ after_seconds: 600, intensity: 3 },
				{ after_seconds: 1200, intensity: 2 },
				{ after_seconds: 3600, intensity: 1 }
			]
		};

		it('returns declared before first threshold', () => {
			const now = makeDate(100);
			expect(computeEffectiveIntensity(5, BASE, policy, now)).toBe(5);
		});

		it('drops to first threshold', () => {
			const now = makeDate(300);
			expect(computeEffectiveIntensity(5, BASE, policy, now)).toBe(4);
		});

		it('drops to second threshold', () => {
			const now = makeDate(700);
			expect(computeEffectiveIntensity(5, BASE, policy, now)).toBe(3);
		});

		it('drops to last threshold', () => {
			const now = makeDate(3600);
			expect(computeEffectiveIntensity(5, BASE, policy, now)).toBe(1);
		});

		it('handles empty step_thresholds', () => {
			const emptySteps: DecayPolicy = { ...policy, step_thresholds: [] };
			const now = makeDate(1000);
			expect(computeEffectiveIntensity(5, BASE, emptySteps, now)).toBe(5);
		});

		it('handles undefined step_thresholds (line 84 ?? [] fallback)', () => {
			const noThresholds: DecayPolicy = {
				curve: 'step',
				half_life_seconds: 1000,
				baseline: 1,
				stale_threshold: 0.3,
				fresh_window_seconds: 60,
				pinned: false,
				reset_on_engagement: false
				// step_thresholds intentionally omitted → undefined → ?? []
			};
			const now = makeDate(1000);
			// With no thresholds, loop body never executes, returns declared
			expect(computeEffectiveIntensity(5, BASE, noThresholds, now)).toBe(5);
		});
	});

	describe('unknown curve type', () => {
		it('returns declared value for unknown curve type', () => {
			const policy: DecayPolicy = {
				curve: 'unknown_curve' as DecayPolicy['curve'],
				half_life_seconds: 1000,
				baseline: 1,
				stale_threshold: 0.3,
				fresh_window_seconds: 60,
				pinned: false,
				reset_on_engagement: false
			};
			const now = makeDate(500);
			expect(computeEffectiveIntensity(5, BASE, policy, now)).toBe(5);
		});
	});

	describe('pinned', () => {
		it('returns declared value regardless of elapsed time', () => {
			const policy: DecayPolicy = {
				curve: 'exponential',
				half_life_seconds: 100,
				baseline: 1,
				stale_threshold: 0.3,
				fresh_window_seconds: 60,
				pinned: true,
				reset_on_engagement: false
			};
			const now = makeDate(86400);
			expect(computeEffectiveIntensity(5, BASE, policy, now)).toBe(5);
		});
	});
});

describe('computeLifecycleState', () => {
	const policy: DecayPolicy = {
		curve: 'exponential',
		half_life_seconds: 900,
		baseline: 1,
		stale_threshold: 0.3,
		fresh_window_seconds: 60,
		pinned: false,
		reset_on_engagement: false
	};

	it('returns "set" at time zero', () => {
		expect(computeLifecycleState(5, BASE, policy, BASE)).toBe('set');
	});

	it('returns "active" within fresh window', () => {
		const now = makeDate(30);
		expect(computeLifecycleState(5, BASE, policy, now)).toBe('active');
	});

	it('returns "decaying" after fresh window but before stale', () => {
		const now = makeDate(120);
		expect(computeLifecycleState(5, BASE, policy, now)).toBe('decaying');
	});

	it('returns "stale" when intensity drops below stale threshold', () => {
		// staleLevel = 1 + (5-1)*0.3 = 2.2
		// Need effective <= 2 (floor). After ~1.3 half-lives: 1 + 4*0.4 = 2.6 -> floor=2
		// After 1.5 half-lives (1350s): 1 + 4 * 2^(-1.5) = 1 + 4*0.354 = 2.41 -> floor=2
		const now = makeDate(1350);
		const state = computeLifecycleState(5, BASE, policy, now);
		expect(state).toBe('stale');
	});

	it('returns "expired" when intensity reaches baseline', () => {
		const now = makeDate(86400); // 24 hours
		expect(computeLifecycleState(5, BASE, policy, now)).toBe('expired');
	});

	it('returns "active" when pinned', () => {
		const pinnedPolicy: DecayPolicy = { ...policy, pinned: true };
		const now = makeDate(86400);
		expect(computeLifecycleState(5, BASE, pinnedPolicy, now)).toBe('active');
	});

	it('returns "set" for future declared_at', () => {
		const future = makeDate(60);
		expect(computeLifecycleState(5, future, policy, BASE)).toBe('set');
	});

	it('handles week-old signal as expired', () => {
		const now = makeDate(604800); // 7 days
		expect(computeLifecycleState(5, BASE, policy, now)).toBe('expired');
	});

	it('handles declared=baseline as expired immediately after fresh window', () => {
		const now = makeDate(120);
		expect(computeLifecycleState(1, BASE, policy, now)).toBe('expired');
	});
});
