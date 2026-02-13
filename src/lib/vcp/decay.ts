import type { DecayPolicy, LifecycleState } from './types';

export const DEFAULT_DECAY_POLICIES: Record<string, DecayPolicy> = {
	perceived_urgency: {
		curve: 'exponential',
		half_life_seconds: 900,
		baseline: 1,
		stale_threshold: 0.3,
		fresh_window_seconds: 60,
		pinned: false,
		reset_on_engagement: false
	},
	body_signals: {
		curve: 'exponential',
		half_life_seconds: 14400,
		baseline: 1,
		stale_threshold: 0.3,
		fresh_window_seconds: 60,
		pinned: false,
		reset_on_engagement: false
	},
	cognitive_state: {
		curve: 'exponential',
		half_life_seconds: 720,
		baseline: 1,
		stale_threshold: 0.3,
		fresh_window_seconds: 60,
		pinned: false,
		reset_on_engagement: true
	},
	emotional_tone: {
		curve: 'exponential',
		half_life_seconds: 1800,
		baseline: 1,
		stale_threshold: 0.3,
		fresh_window_seconds: 60,
		pinned: false,
		reset_on_engagement: false
	},
	energy_level: {
		curve: 'exponential',
		half_life_seconds: 7200,
		baseline: 1,
		stale_threshold: 0.3,
		fresh_window_seconds: 60,
		pinned: false,
		reset_on_engagement: false
	}
};

export function getDefaultDecayPolicy(dimension: string): DecayPolicy {
	return DEFAULT_DECAY_POLICIES[dimension] ?? DEFAULT_DECAY_POLICIES.perceived_urgency;
}

export function computeEffectiveIntensity(
	declared: number,
	declaredAt: Date,
	policy: DecayPolicy,
	now: Date = new Date()
): number {
	if (policy.pinned) return declared;

	const elapsed = (now.getTime() - declaredAt.getTime()) / 1000;
	if (elapsed < 0) {
		console.warn('VCP decay: declared_at is in the future, returning original intensity');
		return declared;
	}
	if (elapsed === 0) return declared;

	if (policy.curve === 'exponential') {
		const lambda = Math.LN2 / policy.half_life_seconds;
		const decayed = policy.baseline + (declared - policy.baseline) * Math.exp(-lambda * elapsed);
		return Math.max(policy.baseline, Math.floor(decayed));
	}

	if (policy.curve === 'linear') {
		const fullDecay = policy.full_decay_seconds ?? policy.half_life_seconds * 4;
		const fraction = Math.min(1, elapsed / fullDecay);
		const decayed = declared - (declared - policy.baseline) * fraction;
		return Math.max(policy.baseline, Math.floor(decayed));
	}

	if (policy.curve === 'step') {
		const thresholds = [...(policy.step_thresholds ?? [])].sort(
			(a, b) => b.after_seconds - a.after_seconds
		);
		for (const t of thresholds) {
			if (elapsed >= t.after_seconds) return Math.max(policy.baseline, t.intensity);
		}
		return declared;
	}

	return declared;
}

export function computeLifecycleState(
	declared: number,
	declaredAt: Date,
	policy: DecayPolicy,
	now: Date = new Date()
): LifecycleState {
	if (policy.pinned) return 'active';

	const elapsed = (now.getTime() - declaredAt.getTime()) / 1000;
	if (elapsed <= 0) return 'set';
	if (elapsed < policy.fresh_window_seconds) return 'active';

	const effective = computeEffectiveIntensity(declared, declaredAt, policy, now);
	if (effective <= policy.baseline) return 'expired';

	const staleLevel = policy.baseline + (declared - policy.baseline) * policy.stale_threshold;
	if (effective <= staleLevel) return 'stale';

	return 'decaying';
}
