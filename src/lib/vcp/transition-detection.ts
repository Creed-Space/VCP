import type { VCPContext, PersonalState, PersonalDimension } from './types';

export type TransitionSeverity = 'none' | 'minor' | 'major' | 'emergency';

export interface TransitionResult {
	severity: TransitionSeverity;
	changes: Map<string, { old: unknown; new: unknown }>;
	affects_safety: boolean;
}

const EMERGENCY_OCCASION_KEYWORDS = ['emergency'];
const EMERGENCY_ENVIRONMENT_KEYWORDS = ['dangerous', 'fire'];
const EMERGENCY_CONSTRAINT_KEYWORDS = ['emergency', 'enforcement'];

const PERSONAL_STATE_KEYS = [
	'cognitive_state',
	'emotional_tone',
	'energy_level',
	'perceived_urgency',
	'body_signals'
] as const;

function hasEmergencyIndicators(ctx: VCPContext): boolean {
	const privateCtx = ctx.private_context ?? {};

	const occasion = String(privateCtx.occasion ?? '').toLowerCase();
	if (EMERGENCY_OCCASION_KEYWORDS.some((kw) => occasion.includes(kw))) return true;

	const environment = String(privateCtx.environment ?? '').toLowerCase();
	if (EMERGENCY_ENVIRONMENT_KEYWORDS.some((kw) => environment.includes(kw))) return true;

	const constraints = ctx.constraints ?? {};
	const constraintStr = JSON.stringify(constraints).toLowerCase();
	if (EMERGENCY_CONSTRAINT_KEYWORDS.some((kw) => constraintStr.includes(kw))) return true;

	return false;
}

function getDimValue(dim?: PersonalDimension<string>): string | undefined {
	return dim?.value;
}

function getDimIntensity(dim?: PersonalDimension<string>): number {
	return dim?.intensity ?? 3;
}

function detectPersonalStateTransition(
	oldState?: PersonalState,
	newState?: PersonalState
): { severity: TransitionSeverity; changes: Map<string, { old: unknown; new: unknown }> } {
	const changes = new Map<string, { old: unknown; new: unknown }>();
	let severity: TransitionSeverity = 'none';

	if (!oldState && !newState) return { severity, changes };
	if (!oldState && newState) {
		for (const key of PERSONAL_STATE_KEYS) {
			if (newState[key]) {
				changes.set(key, { old: undefined, new: newState[key] });
			}
		}
		return { severity: changes.size >= 3 ? 'major' : changes.size > 0 ? 'minor' : 'none', changes };
	}

	for (const key of PERSONAL_STATE_KEYS) {
		const oldDim = oldState?.[key];
		const newDim = newState?.[key];
		const oldVal = getDimValue(oldDim);
		const newVal = getDimValue(newDim);

		if (oldVal !== newVal || getDimIntensity(oldDim) !== getDimIntensity(newDim)) {
			changes.set(key, { old: oldDim, new: newDim });
		}
	}

	if (changes.size === 0) return { severity: 'none', changes };

	// body_signals going to pain:4+ or unwell:5 = MAJOR
	const newBody = newState?.body_signals;
	if (newBody) {
		const bodyVal = newBody.value;
		const bodyInt = newBody.intensity ?? 3;
		if ((bodyVal === 'pain' && bodyInt >= 4) || (bodyVal === 'unwell' && bodyInt >= 5)) {
			severity = 'major';
		}
	}

	// Any dimension jumping 3+ intensity points = MAJOR
	for (const key of PERSONAL_STATE_KEYS) {
		const oldInt = getDimIntensity(oldState?.[key]);
		const newInt = getDimIntensity(newState?.[key]);
		if (Math.abs(newInt - oldInt) >= 3) {
			severity = 'major';
			break;
		}
	}

	if (severity === 'none') {
		severity = changes.size >= 3 ? 'major' : 'minor';
	}

	return { severity, changes };
}

export function detectTransition(oldContext: VCPContext, newContext: VCPContext): TransitionResult {
	// Emergency check first
	if (hasEmergencyIndicators(newContext)) {
		const changes = new Map<string, { old: unknown; new: unknown }>();
		changes.set('emergency', { old: false, new: true });
		return { severity: 'emergency', changes, affects_safety: true };
	}

	const allChanges = new Map<string, { old: unknown; new: unknown }>();
	let maxSeverity: TransitionSeverity = 'none';
	let affectsSafety = false;

	// Check agency/constraints dimension changes
	const oldConstraints = JSON.stringify(oldContext.constraints ?? {});
	const newConstraints = JSON.stringify(newContext.constraints ?? {});
	if (oldConstraints !== newConstraints) {
		allChanges.set('constraints', { old: oldContext.constraints, new: newContext.constraints });
		maxSeverity = 'major';
		affectsSafety = true;
	}

	// Check constitution (persona/adherence) changes
	const oldPersona = oldContext.constitution?.persona;
	const newPersona = newContext.constitution?.persona;
	if (oldPersona !== newPersona) {
		allChanges.set('persona', { old: oldPersona, new: newPersona });
		maxSeverity = 'major';
	}

	// Check personal state transitions
	const psResult = detectPersonalStateTransition(
		oldContext.personal_state,
		newContext.personal_state
	);
	for (const [k, v] of psResult.changes) {
		allChanges.set(k, v);
	}

	// Body signals at high intensity affect safety
	const newBody = newContext.personal_state?.body_signals;
	if (newBody && (newBody.value === 'pain' || newBody.value === 'unwell') && (newBody.intensity ?? 3) >= 4) {
		affectsSafety = true;
	}

	// Promote severity
	const severityOrder: TransitionSeverity[] = ['none', 'minor', 'major', 'emergency'];
	if (severityOrder.indexOf(psResult.severity) > severityOrder.indexOf(maxSeverity)) {
		maxSeverity = psResult.severity;
	}

	// If no changes detected at all
	if (allChanges.size === 0) {
		return { severity: 'none', changes: allChanges, affects_safety: false };
	}

	return { severity: maxSeverity, changes: allChanges, affects_safety: affectsSafety };
}
