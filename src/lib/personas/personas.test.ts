import { describe, it, expect } from 'vitest';

// Campion
import {
	campionProfile,
	workConstitution,
	personalConstitution,
	getActiveConstitution,
	inferContextFromTime,
	encodeContext,
	getCampionPrivacyComparison,
	getCampionRecommendationContext,
	getEveningContext,
	getGodparentResponse
} from './campion';

// Gentian
import {
	gentianProfile,
	gentianChallengeProgress,
	challengeLeaderboard,
	calendarScenarios,
	getGentianPrivacyComparison,
	getTodayCalendar,
	getCalendarBusyFreeView,
	getSkipDayContext
} from './gentian';

// Marta
import {
	martaProfile,
	responsibilityConstitution,
	encodeMartaContext,
	getDecisionMoment,
	getReflectionMoment,
	getMartaPrivacyComparison,
	getMediatorResponse,
	getReflectionResponse
} from './marta';

// ============================================
// Shared VCPContext structure validators
// ============================================

function assertValidConstitution(c: {
	id?: string;
	version?: string;
	persona?: string;
	adherence?: number;
	scopes?: string[];
}) {
	expect(c.id).toBeDefined();
	expect(typeof c.id).toBe('string');
	expect(c.id!.length).toBeGreaterThan(0);
	expect(c.version).toBeDefined();
	expect(typeof c.version).toBe('string');
	expect(c.persona).toBeDefined();
	expect(typeof c.persona).toBe('string');
	expect(c.adherence).toBeDefined();
	expect(typeof c.adherence).toBe('number');
	expect(c.adherence).toBeGreaterThanOrEqual(1);
	expect(c.adherence).toBeLessThanOrEqual(5);
	expect(c.scopes).toBeDefined();
	expect(Array.isArray(c.scopes)).toBe(true);
	expect(c.scopes!.length).toBeGreaterThan(0);
}

function assertValidPersonalState(ps: Record<string, { value: string; intensity: number }>) {
	const requiredDims = [
		'cognitive_state',
		'emotional_tone',
		'energy_level',
		'perceived_urgency',
		'body_signals'
	];
	for (const dim of requiredDims) {
		expect(ps[dim]).toBeDefined();
		expect(typeof ps[dim].value).toBe('string');
		expect(ps[dim].value.length).toBeGreaterThan(0);
		expect(typeof ps[dim].intensity).toBe('number');
		expect(ps[dim].intensity).toBeGreaterThanOrEqual(1);
		expect(ps[dim].intensity).toBeLessThanOrEqual(5);
	}
}

function assertValidVCPContext(ctx: {
	vcp_version: string;
	profile_id: string;
	constitution: Record<string, unknown>;
	public_profile: Record<string, unknown>;
	personal_state?: Record<string, unknown>;
}) {
	expect(ctx.vcp_version).toBeDefined();
	expect(typeof ctx.vcp_version).toBe('string');
	expect(ctx.profile_id).toBeDefined();
	expect(typeof ctx.profile_id).toBe('string');
	expect(ctx.constitution).toBeDefined();
	expect(ctx.public_profile).toBeDefined();
	expect(ctx.public_profile.display_name).toBeDefined();
}

// ============================================
// CAMPION
// ============================================

describe('Campion persona', () => {
	describe('campionProfile VCPContext structure', () => {
		it('has valid top-level fields', () => {
			assertValidVCPContext(campionProfile as unknown as {
				vcp_version: string;
				profile_id: string;
				constitution: Record<string, unknown>;
				public_profile: Record<string, unknown>;
			});
		});

		it('has a valid constitution reference', () => {
			assertValidConstitution(campionProfile.constitution);
		});

		it('has all five personal state dimensions with valid intensity', () => {
			expect(campionProfile.personal_state).toBeDefined();
			assertValidPersonalState(
				campionProfile.personal_state as unknown as Record<
					string,
					{ value: string; intensity: number }
				>
			);
		});

		it('has sharing_settings with hr, manager, and platforms', () => {
			expect(campionProfile.sharing_settings).toBeDefined();
			expect(campionProfile.sharing_settings!.hr).toBeDefined();
			expect(campionProfile.sharing_settings!.manager).toBeDefined();
			expect(campionProfile.sharing_settings!.platforms).toBeDefined();
		});

		it('has private_context that is never empty', () => {
			expect(campionProfile.private_context).toBeDefined();
			expect(campionProfile.private_context!._note).toBeDefined();
		});

		it('has constraints', () => {
			expect(campionProfile.constraints).toBeDefined();
			expect(campionProfile.constraints!.time_limited).toBe(true);
		});

		it('has availability with timezone', () => {
			expect(campionProfile.availability).toBeDefined();
			expect(campionProfile.availability!.timezone).toBe('Europe/Amsterdam');
		});
	});

	describe('workConstitution', () => {
		it('has valid constitution fields', () => {
			assertValidConstitution(workConstitution);
		});

		it('uses ambassador persona with adherence 3', () => {
			expect(workConstitution.persona).toBe('ambassador');
			expect(workConstitution.adherence).toBe(3);
		});

		it('has work and education scopes', () => {
			expect(workConstitution.scopes).toContain('work');
			expect(workConstitution.scopes).toContain('education');
		});
	});

	describe('personalConstitution', () => {
		it('has valid constitution fields', () => {
			assertValidConstitution(personalConstitution);
		});

		it('uses godparent persona with adherence 4', () => {
			expect(personalConstitution.persona).toBe('godparent');
			expect(personalConstitution.adherence).toBe(4);
		});

		it('has family, privacy, and health scopes', () => {
			expect(personalConstitution.scopes).toContain('family');
			expect(personalConstitution.scopes).toContain('privacy');
			expect(personalConstitution.scopes).toContain('health');
		});
	});

	describe('getActiveConstitution', () => {
		it('returns workConstitution for professional context', () => {
			const result = getActiveConstitution('professional');
			expect(result).toBe(workConstitution);
		});

		it('returns personalConstitution for personal context', () => {
			const result = getActiveConstitution('personal');
			expect(result).toBe(personalConstitution);
		});
	});

	describe('inferContextFromTime', () => {
		it('returns professional for weekday 9am', () => {
			expect(inferContextFromTime(9, true)).toBe('professional');
		});

		it('returns professional for weekday 5pm', () => {
			expect(inferContextFromTime(17, true)).toBe('professional');
		});

		it('returns personal for weekday 8am (before work)', () => {
			expect(inferContextFromTime(8, true)).toBe('personal');
		});

		it('returns personal for weekday 6pm (after work)', () => {
			expect(inferContextFromTime(18, true)).toBe('personal');
		});

		it('returns personal for weekend regardless of hour', () => {
			expect(inferContextFromTime(10, false)).toBe('personal');
			expect(inferContextFromTime(14, false)).toBe('personal');
		});

		it('returns personal for weekday midnight', () => {
			expect(inferContextFromTime(0, true)).toBe('personal');
		});
	});

	describe('encodeContext', () => {
		it('returns a non-empty string for professional', () => {
			const result = encodeContext('professional');
			expect(typeof result).toBe('string');
			expect(result.length).toBeGreaterThan(0);
		});

		it('returns a non-empty string for personal', () => {
			const result = encodeContext('personal');
			expect(typeof result).toBe('string');
			expect(result.length).toBeGreaterThan(0);
		});

		it('professional encoding includes office emoji', () => {
			expect(encodeContext('professional')).toContain('\u{1F3E2}');
		});

		it('personal encoding includes home emoji', () => {
			expect(encodeContext('personal')).toContain('\u{1F3E1}');
		});

		it('professional and personal produce different encodings', () => {
			expect(encodeContext('professional')).not.toBe(encodeContext('personal'));
		});
	});

	describe('getCampionPrivacyComparison', () => {
		it('returns employeeSees and hrSees', () => {
			const result = getCampionPrivacyComparison();
			expect(result.employeeSees).toBeDefined();
			expect(result.hrSees).toBeDefined();
		});

		it('hrSees.privateContextExposed is always false', () => {
			expect(getCampionPrivacyComparison().hrSees.privateContextExposed).toBe(false);
		});

		it('hrSees.privateContextUsed is true', () => {
			expect(getCampionPrivacyComparison().hrSees.privateContextUsed).toBe(true);
		});

		it('employeeSees has profile and privateReasons', () => {
			const result = getCampionPrivacyComparison();
			expect(result.employeeSees.profile.name).toBe('Campion');
			expect(result.employeeSees.privateReasons).toBeDefined();
		});
	});

	describe('getCampionRecommendationContext', () => {
		it('has contextUsed, contextInfluencing, and contextWithheld', () => {
			const result = getCampionRecommendationContext();
			expect(Array.isArray(result.contextUsed)).toBe(true);
			expect(result.contextUsed.length).toBeGreaterThan(0);
			expect(Array.isArray(result.contextInfluencing)).toBe(true);
			expect(result.contextInfluencing.length).toBeGreaterThan(0);
			expect(Array.isArray(result.contextWithheld)).toBe(true);
			expect(result.contextWithheld.length).toBeGreaterThan(0);
		});

		it('withholds family_status and health_conditions', () => {
			const withheld = getCampionRecommendationContext().contextWithheld;
			expect(withheld).toContain('family_status');
			expect(withheld).toContain('health_conditions');
		});
	});

	describe('getEveningContext', () => {
		it('returns a recommendation to defer study', () => {
			const ctx = getEveningContext();
			expect(ctx.recommendation.action).toBe('defer_study');
		});

		it('detected context_type is personal', () => {
			expect(getEveningContext().detected.context_type).toBe('personal');
		});

		it('has personal_state with all five dimensions', () => {
			const ps = getEveningContext().detected.personal_state;
			expect(ps.cognitive_state).toBeDefined();
			expect(ps.emotional_tone).toBeDefined();
			expect(ps.energy_level).toBeDefined();
			expect(ps.perceived_urgency).toBeDefined();
			expect(ps.body_signals).toBeDefined();
		});

		it('has alternatives array with at least 2 items', () => {
			expect(getEveningContext().alternatives.length).toBeGreaterThanOrEqual(2);
		});

		it('uses personal constitution', () => {
			expect(getEveningContext().active_constitution).toBe(personalConstitution);
		});
	});

	describe('getGodparentResponse', () => {
		it('has caring tone', () => {
			expect(getGodparentResponse().tone).toBe('caring');
		});

		it('includes a privacy note', () => {
			expect(getGodparentResponse().privacy_note).toBeDefined();
			expect(getGodparentResponse().privacy_note.length).toBeGreaterThan(0);
		});

		it('has tonight suggestions with at least one option', () => {
			expect(getGodparentResponse().tonight_suggestions.length).toBeGreaterThanOrEqual(1);
		});

		it('has skip_tonight advice', () => {
			expect(Array.isArray(getGodparentResponse().skip_tonight)).toBe(true);
			expect(getGodparentResponse().skip_tonight.length).toBeGreaterThan(0);
		});
	});
});

// ============================================
// GENTIAN
// ============================================

describe('Gentian persona', () => {
	describe('gentianProfile VCPContext structure', () => {
		it('has valid top-level fields', () => {
			assertValidVCPContext(gentianProfile as unknown as {
				vcp_version: string;
				profile_id: string;
				constitution: Record<string, unknown>;
				public_profile: Record<string, unknown>;
			});
		});

		it('has a valid constitution reference', () => {
			assertValidConstitution(gentianProfile.constitution);
		});

		it('uses muse persona', () => {
			expect(gentianProfile.constitution.persona).toBe('muse');
		});

		it('has all five personal state dimensions', () => {
			expect(gentianProfile.personal_state).toBeDefined();
			assertValidPersonalState(
				gentianProfile.personal_state as unknown as Record<
					string,
					{ value: string; intensity: number }
				>
			);
		});

		it('has noise_restricted constraint', () => {
			expect(gentianProfile.constraints).toBeDefined();
			expect(gentianProfile.constraints!.noise_restricted).toBe(true);
		});

		it('has private_context that is never empty', () => {
			expect(gentianProfile.private_context).toBeDefined();
			expect(gentianProfile.private_context!._note).toBeDefined();
		});

		it('has current_skills with beginner level', () => {
			expect(gentianProfile.current_skills).toBeDefined();
			expect(gentianProfile.current_skills!.level).toBe('beginner');
		});

		it('has sharing_settings with community, coach, and platforms', () => {
			expect(gentianProfile.sharing_settings).toBeDefined();
			expect(gentianProfile.sharing_settings!.community).toBeDefined();
			expect(gentianProfile.sharing_settings!.coach).toBeDefined();
			expect(gentianProfile.sharing_settings!.platforms).toBeDefined();
		});
	});

	describe('gentianChallengeProgress', () => {
		it('is a 30-day challenge', () => {
			expect(gentianChallengeProgress.total_days).toBe(30);
		});

		it('has consistent days_completed count', () => {
			const practiced = gentianChallengeProgress.daily_log.filter((d) => d.practiced).length;
			expect(practiced).toBe(gentianChallengeProgress.days_completed);
		});

		it('has consistent days_adjusted count', () => {
			const adjusted = gentianChallengeProgress.daily_log.filter((d) => d.adjusted).length;
			expect(adjusted).toBe(gentianChallengeProgress.days_adjusted);
		});

		it('has badges array', () => {
			expect(Array.isArray(gentianChallengeProgress.badges)).toBe(true);
			expect(gentianChallengeProgress.badges!.length).toBeGreaterThan(0);
		});

		it('daily_log entries are either practiced or adjusted, not both', () => {
			for (const entry of gentianChallengeProgress.daily_log) {
				if (entry.adjusted) {
					expect(entry.practiced).toBe(false);
				}
			}
		});

		it('adjusted entries have adjustment_reason', () => {
			const adjustedEntries = gentianChallengeProgress.daily_log.filter((d) => d.adjusted);
			for (const entry of adjustedEntries) {
				expect(entry.adjustment_reason).toBeDefined();
				expect(entry.adjustment_reason!.length).toBeGreaterThan(0);
			}
		});
	});

	describe('challengeLeaderboard', () => {
		it('has 5 entries', () => {
			expect(challengeLeaderboard.length).toBe(5);
		});

		it('ranks are 1-5 in order', () => {
			for (let i = 0; i < challengeLeaderboard.length; i++) {
				expect(challengeLeaderboard[i].rank).toBe(i + 1);
			}
		});

		it('Gentian is at rank 3 and marked as current user', () => {
			const gentian = challengeLeaderboard.find((e) => e.display_name === 'Gentian');
			expect(gentian).toBeDefined();
			expect(gentian!.rank).toBe(3);
			expect(gentian!.is_current_user).toBe(true);
		});

		it('only one entry is current_user', () => {
			const currentUsers = challengeLeaderboard.filter((e) => e.is_current_user);
			expect(currentUsers.length).toBe(1);
		});

		it('days_completed is sorted descending', () => {
			for (let i = 1; i < challengeLeaderboard.length; i++) {
				expect(challengeLeaderboard[i - 1].days_completed).toBeGreaterThanOrEqual(
					challengeLeaderboard[i].days_completed
				);
			}
		});
	});

	describe('calendarScenarios', () => {
		it('has recovery, free_afternoon, and double_shift', () => {
			expect(calendarScenarios.recovery).toBeDefined();
			expect(calendarScenarios.free_afternoon).toBeDefined();
			expect(calendarScenarios.double_shift).toBeDefined();
		});

		it('each scenario has label, description, slots, recommendation, and confidence', () => {
			for (const scenario of Object.values(calendarScenarios)) {
				expect(typeof scenario.label).toBe('string');
				expect(typeof scenario.description).toBe('string');
				expect(Array.isArray(scenario.slots)).toBe(true);
				expect(scenario.slots.length).toBeGreaterThan(0);
				expect(typeof scenario.recommendation).toBe('string');
				expect(['high', 'medium', 'low']).toContain(scenario.confidence);
			}
		});

		it('each slot has valid type', () => {
			const validTypes = ['work', 'recovery', 'free', 'busy'];
			for (const scenario of Object.values(calendarScenarios)) {
				for (const slot of scenario.slots) {
					expect(validTypes).toContain(slot.type);
					expect(typeof slot.label).toBe('string');
					expect(typeof slot.time).toBe('string');
					expect(typeof slot.isPrivate).toBe('boolean');
				}
			}
		});
	});

	describe('getTodayCalendar', () => {
		it('returns slots for recovery scenario', () => {
			const slots = getTodayCalendar('recovery');
			expect(slots.length).toBe(calendarScenarios.recovery.slots.length);
		});

		it('returns slots for free_afternoon scenario', () => {
			const slots = getTodayCalendar('free_afternoon');
			expect(slots.length).toBe(calendarScenarios.free_afternoon.slots.length);
		});

		it('defaults to recovery when called with recovery', () => {
			const slots = getTodayCalendar('recovery');
			expect(slots).toBe(calendarScenarios.recovery.slots);
		});
	});

	describe('getCalendarBusyFreeView', () => {
		it('maps free slots to Free and others to Busy', () => {
			const view = getCalendarBusyFreeView('free_afternoon');
			for (const item of view) {
				expect(['Busy', 'Free']).toContain(item.status);
				expect(typeof item.time).toBe('string');
			}
		});

		it('free_afternoon has at least one Free slot', () => {
			const view = getCalendarBusyFreeView('free_afternoon');
			const freeSlots = view.filter((v) => v.status === 'Free');
			expect(freeSlots.length).toBeGreaterThan(0);
		});

		it('double_shift has at least one Free slot for break', () => {
			const view = getCalendarBusyFreeView('double_shift');
			const freeSlots = view.filter((v) => v.status === 'Free');
			expect(freeSlots.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe('getSkipDayContext', () => {
		it('recommends skip for recovery scenario', () => {
			const ctx = getSkipDayContext(false, 'recovery');
			expect(ctx.recommendation.action).toBe('skip_today');
		});

		it('recommends practice for free_afternoon', () => {
			const ctx = getSkipDayContext(false, 'free_afternoon');
			expect(ctx.recommendation.action).toBe('practice');
		});

		it('recommends skip for double_shift', () => {
			const ctx = getSkipDayContext(false, 'double_shift');
			expect(ctx.recommendation.action).toBe('skip_today');
		});

		it('includes calendar_confirms when calendar enabled', () => {
			const ctx = getSkipDayContext(true, 'recovery');
			expect(ctx.recommendation.calendar_confirms).toBe(true);
		});

		it('has alternatives array', () => {
			const ctx = getSkipDayContext(false, 'recovery');
			expect(Array.isArray(ctx.alternatives)).toBe(true);
			expect(ctx.alternatives.length).toBeGreaterThan(0);
		});

		it('recovery trigger is post_night_shift', () => {
			const ctx = getSkipDayContext(false, 'recovery');
			expect(ctx.detected.trigger).toBe('post_night_shift');
		});

		it('double_shift trigger is double_shift', () => {
			const ctx = getSkipDayContext(false, 'double_shift');
			expect(ctx.detected.trigger).toBe('double_shift');
		});

		it('free_afternoon trigger is none', () => {
			const ctx = getSkipDayContext(false, 'free_afternoon');
			expect(ctx.detected.trigger).toBe('none');
		});
	});

	describe('getGentianPrivacyComparison', () => {
		it('returns gentianSees and communitySees', () => {
			const result = getGentianPrivacyComparison();
			expect(result.gentianSees).toBeDefined();
			expect(result.communitySees).toBeDefined();
		});

		it('community cannot see adjustment reasons', () => {
			const result = getGentianPrivacyComparison();
			expect(result.communitySees.hidden).toContain('Why days were adjusted');
		});

		it('gentianSees has adjustment_reasons with details', () => {
			const result = getGentianPrivacyComparison();
			expect(result.gentianSees.progress.adjustment_reasons.length).toBeGreaterThan(0);
		});
	});
});

// ============================================
// MARTA
// ============================================

describe('Marta persona', () => {
	describe('martaProfile VCPContext structure', () => {
		it('has valid top-level fields', () => {
			assertValidVCPContext(martaProfile as unknown as {
				vcp_version: string;
				profile_id: string;
				constitution: Record<string, unknown>;
				public_profile: Record<string, unknown>;
			});
		});

		it('uses VCP version 3.1.0', () => {
			expect(martaProfile.vcp_version).toBe('3.1.0');
		});

		it('has a valid constitution reference', () => {
			assertValidConstitution(martaProfile.constitution);
		});

		it('uses mediator persona with adherence 4', () => {
			expect(martaProfile.constitution.persona).toBe('mediator');
			expect(martaProfile.constitution.adherence).toBe(4);
		});

		it('has all five personal state dimensions', () => {
			expect(martaProfile.personal_state).toBeDefined();
			assertValidPersonalState(
				martaProfile.personal_state as unknown as Record<
					string,
					{ value: string; intensity: number }
				>
			);
		});

		it('has private_context with HIGH_PRIVACY note', () => {
			expect(martaProfile.private_context).toBeDefined();
			expect(martaProfile.private_context!._note).toContain('HIGH_PRIVACY');
		});

		it('has stewardship and privacy scopes', () => {
			expect(martaProfile.constitution.scopes).toContain('stewardship');
			expect(martaProfile.constitution.scopes).toContain('privacy');
		});
	});

	describe('responsibilityConstitution', () => {
		it('has valid constitution fields', () => {
			assertValidConstitution(responsibilityConstitution);
		});

		it('matches martaProfile constitution values', () => {
			expect(responsibilityConstitution.id).toBe(martaProfile.constitution.id);
			expect(responsibilityConstitution.persona).toBe(martaProfile.constitution.persona);
			expect(responsibilityConstitution.adherence).toBe(martaProfile.constitution.adherence);
		});
	});

	describe('encodeMartaContext', () => {
		it('returns a non-empty string', () => {
			const result = encodeMartaContext();
			expect(typeof result).toBe('string');
			expect(result.length).toBeGreaterThan(0);
		});

		it('starts with v3.1', () => {
			expect(encodeMartaContext()).toMatch(/^v3\.1/);
		});

		it('includes profile id', () => {
			expect(encodeMartaContext()).toContain('profile:marta-2026');
		});

		it('includes constitution reference', () => {
			expect(encodeMartaContext()).toContain('constitution:personal.responsibility.balance@1.0.0');
		});

		it('includes persona and adherence', () => {
			expect(encodeMartaContext()).toContain('persona:mediator:4');
		});

		it('uses double-pipe separator', () => {
			expect(encodeMartaContext()).toContain('\u2016');
		});
	});

	describe('getDecisionMoment', () => {
		it('returns cousin_loan_request scenario', () => {
			expect(getDecisionMoment().scenario).toBe('cousin_loan_request');
		});

		it('has detected trigger of financial_request_from_family', () => {
			expect(getDecisionMoment().detected.trigger).toBe('financial_request_from_family');
		});

		it('has context_used and context_withheld arrays', () => {
			const dm = getDecisionMoment();
			expect(Array.isArray(dm.context_used)).toBe(true);
			expect(dm.context_used.length).toBeGreaterThan(0);
			expect(Array.isArray(dm.context_withheld)).toBe(true);
			expect(dm.context_withheld.length).toBeGreaterThan(0);
		});

		it('withholds guilt_when_saying_no', () => {
			expect(getDecisionMoment().context_withheld).toContain('guilt_when_saying_no');
		});
	});

	describe('getReflectionMoment', () => {
		it('returns post_decision_reflection scenario', () => {
			expect(getReflectionMoment().scenario).toBe('post_decision_reflection');
		});

		it('has reflection_prompts array with at least 3 prompts', () => {
			expect(getReflectionMoment().reflection_prompts.length).toBeGreaterThanOrEqual(3);
		});

		it('detected.decision_made is true', () => {
			expect(getReflectionMoment().detected.decision_made).toBe(true);
		});
	});

	describe('getMartaPrivacyComparison', () => {
		it('returns martaSees and aiAdvisorSees', () => {
			const result = getMartaPrivacyComparison();
			expect(result.martaSees).toBeDefined();
			expect(result.aiAdvisorSees).toBeDefined();
		});

		it('aiAdvisorSees.privateContextExposed is always false', () => {
			expect(getMartaPrivacyComparison().aiAdvisorSees.privateContextExposed).toBe(false);
		});

		it('aiAdvisorSees.privateContextUsed is true', () => {
			expect(getMartaPrivacyComparison().aiAdvisorSees.privateContextUsed).toBe(true);
		});

		it('aiAdvisorSees cannot see guilt patterns', () => {
			const hidden = getMartaPrivacyComparison().aiAdvisorSees.hidden;
			expect(hidden.some((h: string) => h.toLowerCase().includes('guilt'))).toBe(true);
		});

		it('martaSees has personal_state with intensity ratings', () => {
			const ps = getMartaPrivacyComparison().martaSees.personal_state;
			expect(ps.cognitive).toContain('4/5');
			expect(ps.emotional).toContain('4/5');
		});
	});

	describe('getMediatorResponse', () => {
		it('has calm_structured tone', () => {
			expect(getMediatorResponse().tone).toBe('calm_structured');
		});

		it('has practical_options with at least 3 options', () => {
			expect(getMediatorResponse().practical_options.length).toBeGreaterThanOrEqual(3);
		});

		it('each option has id, label, sustainability, and note', () => {
			for (const opt of getMediatorResponse().practical_options) {
				expect(opt.id).toBeDefined();
				expect(opt.label).toBeDefined();
				expect(opt.sustainability).toBeDefined();
				expect(opt.note).toBeDefined();
			}
		});

		it('includes a privacy note', () => {
			expect(getMediatorResponse().privacy_note).toBeDefined();
			expect(getMediatorResponse().privacy_note.length).toBeGreaterThan(0);
		});

		it('has obligation_assessment with framework', () => {
			const oa = getMediatorResponse().obligation_assessment;
			expect(oa.question).toBeDefined();
			expect(oa.framework.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe('getReflectionResponse', () => {
		it('has gentle_structured tone', () => {
			expect(getReflectionResponse().tone).toBe('gentle_structured');
		});

		it('has reflection_framework with at least 3 questions', () => {
			expect(getReflectionResponse().reflection_framework.length).toBeGreaterThanOrEqual(3);
		});

		it('each reflection has question, purpose, and steward_note', () => {
			for (const r of getReflectionResponse().reflection_framework) {
				expect(r.question).toBeDefined();
				expect(r.purpose).toBeDefined();
				expect(r.steward_note).toBeDefined();
			}
		});

		it('includes a privacy note', () => {
			expect(getReflectionResponse().privacy_note).toBeDefined();
		});

		it('has pattern_observation', () => {
			expect(getReflectionResponse().pattern_observation).toBeDefined();
			expect(getReflectionResponse().pattern_observation.length).toBeGreaterThan(0);
		});
	});
});

// ============================================
// Cross-persona consistency
// ============================================

describe('Cross-persona consistency', () => {
	it('all profiles use the same VCP types', () => {
		// All have vcp_version, profile_id, constitution, public_profile
		for (const profile of [campionProfile, gentianProfile, martaProfile]) {
			expect(profile.vcp_version).toBeDefined();
			expect(profile.profile_id).toBeDefined();
			expect(profile.constitution).toBeDefined();
			expect(profile.public_profile).toBeDefined();
		}
	});

	it('all profiles have personal_state with all five dimensions', () => {
		for (const profile of [campionProfile, gentianProfile, martaProfile]) {
			expect(profile.personal_state).toBeDefined();
			expect(profile.personal_state!.cognitive_state).toBeDefined();
			expect(profile.personal_state!.emotional_tone).toBeDefined();
			expect(profile.personal_state!.energy_level).toBeDefined();
			expect(profile.personal_state!.perceived_urgency).toBeDefined();
			expect(profile.personal_state!.body_signals).toBeDefined();
		}
	});

	it('all privacy comparisons have privateContextExposed=false', () => {
		expect(getCampionPrivacyComparison().hrSees.privateContextExposed).toBe(false);
		expect(getMartaPrivacyComparison().aiAdvisorSees.privateContextExposed).toBe(false);
		// Gentian uses a different structure — community just cannot see the data
		const gentianComparison = getGentianPrivacyComparison();
		expect(gentianComparison.communitySees.hidden.length).toBeGreaterThan(0);
	});

	it('each persona uses a distinct persona type', () => {
		const personas = [
			campionProfile.constitution.persona,
			gentianProfile.constitution.persona,
			martaProfile.constitution.persona
		];
		// Campion=ambassador, Gentian=muse, Marta=mediator
		expect(new Set(personas).size).toBe(3);
	});

	it('each profile has a unique profile_id', () => {
		const ids = [campionProfile.profile_id, gentianProfile.profile_id, martaProfile.profile_id];
		expect(new Set(ids).size).toBe(3);
	});
});
