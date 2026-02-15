/**
 * VCP (Value Context Protocol) Type Definitions
 * Generated from schemas in _plans/schemas/
 */

// ============================================
// Core Enums
// ============================================

export type PersonaType = 'muse' | 'ambassador' | 'godparent' | 'sentinel' | 'nanny' | 'mediator';

export type ScopeType =
	| 'work'
	| 'education'
	| 'creativity'
	| 'health'
	| 'privacy'
	| 'family'
	| 'finance'
	| 'social'
	| 'legal'
	| 'safety'
	| 'stewardship'
	| 'mediation'
	| 'commerce'
	| 'compliance'
	| 'ethics'
	| 'coordination'
	| 'transparency'
	| 'governance'
	| 'epistemic'
	| 'accuracy';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type LearningStyle = 'visual' | 'auditory' | 'hands_on' | 'reading' | 'mixed';

export type Pace = 'intensive' | 'steady' | 'relaxed';

export type Motivation = 'career' | 'stress_relief' | 'social' | 'achievement' | 'curiosity' | 'personal_use';

export type NoiseMode = 'normal' | 'quiet_preferred' | 'silent_required';

export type SessionLength = '15_minutes' | '30_minutes' | '60_minutes' | 'flexible';

export type PressureTolerance = 'high' | 'medium' | 'low';

export type BudgetRange = 'unlimited' | 'high' | 'medium' | 'low' | 'free_only';

export type FeedbackStyle = 'direct' | 'encouraging' | 'detailed' | 'minimal';

// ============================================
// Constitution Types
// ============================================

export interface ConstitutionReference {
	id: string;
	version: string;
	persona?: PersonaType;
	adherence?: number; // 1-5
	scopes?: ScopeType[];
}

export interface Rule {
	id: string;
	weight: number; // 0.0-1.0
	rule: string;
	rationale?: string;
	triggers?: string[];
	exceptions?: string[];
	conflicts_with?: string[];
	priority_over?: string[];
}

export interface SharingPolicy {
	[stakeholder: string]: {
		allowed?: string[];
		forbidden?: string[];
		requires_consent?: string[];
		aggregation_only?: string[];
	};
}

export interface ContextTrigger {
	dimension: 'time' | 'location' | 'activity' | 'stakeholder' | 'energy' | 'context_type';
	operator: 'equals' | 'not_equals' | 'contains' | 'in_range' | 'matches';
	value: string | string[] | Record<string, unknown>;
}

export interface Constitution {
	id: string;
	version: string;
	name?: string;
	description?: string;
	author?: string;
	created?: string;
	updated?: string;
	persona: PersonaType;
	adherence: number;
	scopes: ScopeType[];
	rules: Rule[];
	sharing_policy?: SharingPolicy;
	context_triggers?: ContextTrigger[];
	conflicts_with?: string[];
	extends?: string;
}

// ============================================
// VCP Context Types
// ============================================

export interface PublicProfile {
	display_name?: string;
	goal?: string;
	experience?: ExperienceLevel;
	learning_style?: LearningStyle;
	pace?: Pace;
	motivation?: Motivation;
	// Professional fields
	role?: string;
	team?: string;
	tenure_years?: number;
	career_goal?: string;
	career_timeline?: string;
}

export interface PortablePreferences {
	noise_mode?: NoiseMode;
	session_length?: SessionLength;
	pressure_tolerance?: PressureTolerance;
	budget_range?: BudgetRange;
	feedback_style?: FeedbackStyle;
}

export interface CurrentSkills {
	level?: ExperienceLevel;
	weeks_learning?: number;
	skills_acquired?: string[];
	current_focus?: string;
	struggle_areas?: string[];
}

export interface ConstraintFlags {
	time_limited?: boolean;
	budget_limited?: boolean;
	noise_restricted?: boolean;
	energy_variable?: boolean;
	schedule_irregular?: boolean;
	mobility_limited?: boolean;
	health_considerations?: boolean;
}

export interface Availability {
	best_times?: string[];
	avoid_times?: string[];
	session_length_preferred?: SessionLength;
	timezone?: string;
}

export interface SharingSettings {
	[stakeholder: string]: {
		share?: string[];
		hide?: string[];
	};
}

export interface PrivateContext {
	_note?: string;
	[key: string]: unknown;
}

// ============================================
// Prosaic Dimensions (Extended Enneagram Protocol)
// ============================================

/**
 * Prosaic dimensions capture immediate user state.
 * All values 0.0-1.0 where higher = more intensity.
 */
export interface ProsaicDimensions {
	/** ⚡ Time pressure, priority, brevity preference */
	urgency?: number;
	/** 💊 Physical wellness, fatigue, pain, physical needs */
	health?: number;
	/** 🧩 Mental bandwidth, clarity, cognitive load */
	cognitive?: number;
	/** 💭 Emotional intensity, stress, valence */
	affect?: number;
	/** Optional sub-signals for specificity */
	sub_signals?: ProsaicSubSignals;
}

export interface ProsaicSubSignals {
	// Urgency sub-signals
	deadline_horizon?: string; // ISO 8601 duration
	brevity_preference?: number;
	// Health sub-signals
	fatigue_level?: number;
	pain_level?: number;
	physical_need?: 'bathroom' | 'hunger' | 'thirst' | 'movement' | 'rest' | 'sensory_break';
	condition?: 'illness' | 'migraine' | 'chronic_pain' | 'pregnancy' | 'flare_up' | 'insomnia';
	// Cognitive sub-signals
	cognitive_state?: 'overwhelmed' | 'overstimulated' | 'scattered' | 'brain_fog' | 'exec_dysfunction' | 'shutdown' | 'hyperfocused';
	decision_fatigue?: number;
	// Affect sub-signals
	emotional_state?: 'grieving' | 'anxious' | 'frustrated' | 'stressed' | 'triggered' | 'dysregulated' | 'joyful' | 'excited';
	valence?: number; // -1.0 to 1.0
}

// ============================================
// Personal State Dimensions (VCP 3.1)
// ============================================

/** v3.1 replaces float-based prosaic dimensions with categorical + intensity */

export type CognitiveState = 'focused' | 'distracted' | 'overloaded' | 'foggy' | 'reflective';
export type EmotionalTone = 'calm' | 'tense' | 'frustrated' | 'neutral' | 'uplifted';
export type EnergyLevel = 'rested' | 'low_energy' | 'fatigued' | 'wired' | 'depleted';
export type PerceivedUrgency = 'unhurried' | 'time_aware' | 'pressured' | 'critical';
export type BodySignals = 'neutral' | 'discomfort' | 'pain' | 'unwell' | 'recovering';

export type SystemContext = 'personal_device' | 'workplace_system' | 'shared_terminal' | 'monitored_environment';

export type DecayCurve = 'exponential' | 'linear' | 'step';
export type LifecycleState = 'set' | 'active' | 'decaying' | 'stale' | 'expired';

export interface StepThreshold {
	after_seconds: number;
	intensity: number;
}

export interface DecayPolicy {
	curve: DecayCurve;
	half_life_seconds: number;
	baseline: number;
	stale_threshold: number;
	fresh_window_seconds: number;
	pinned: boolean;
	reset_on_engagement: boolean;
	full_decay_seconds?: number;
	step_thresholds?: StepThreshold[];
}

export interface PersonalDimension<T extends string> {
	value: T;
	intensity?: number; // 1-5, defaults to 3
	declared_at?: string; // ISO timestamp
	decay_policy?: DecayPolicy;
	pinned?: boolean;
	extended?: string; // Sub-signal (e.g., 'bathroom', 'migraine', 'hunger')
}

export interface PersonalState {
	cognitive_state?: PersonalDimension<CognitiveState>;
	emotional_tone?: PersonalDimension<EmotionalTone>;
	energy_level?: PersonalDimension<EnergyLevel>;
	perceived_urgency?: PersonalDimension<PerceivedUrgency>;
	body_signals?: PersonalDimension<BodySignals>;
}

export interface VCPContext {
	vcp_version: string;
	profile_id: string;
	created?: string;
	updated?: string;
	constitution: ConstitutionReference;
	public_profile: PublicProfile;
	portable_preferences?: PortablePreferences;
	current_skills?: CurrentSkills;
	constraints?: ConstraintFlags;
	availability?: Availability;
	sharing_settings?: SharingSettings;
	private_context?: PrivateContext;
	/** @deprecated Use personal_state (v3.1) */
	prosaic?: ProsaicDimensions;
	/** Personal state dimensions - v3.1 categorical with intensity */
	personal_state?: PersonalState;
	system_context?: SystemContext;
	// Professional-specific additions
	shared_with_manager?: Record<string, unknown>;
}

// ============================================
// Platform Types
// ============================================

export interface PlatformManifest {
	platform_id: string;
	platform_name: string;
	platform_type: 'learning' | 'community' | 'commerce' | 'coaching';
	version: string;
	context_requirements: {
		required: string[];
		optional: string[];
	};
	capabilities: string[];
	branding?: {
		primary_color: string;
		logo?: string;
	};
}

export interface ConsentRecord {
	platform_id: string;
	granted_at: string;
	required_fields: string[];
	optional_fields: string[];
	expires_at?: string;
}

export interface FilteredContext {
	public: Partial<PublicProfile>;
	preferences: Partial<PortablePreferences>;
	constraints: ConstraintFlags;
	skills?: Partial<CurrentSkills>;
}

// ============================================
// Audit Types
// ============================================

export type AuditEventType =
	| 'context_shared'
	| 'context_withheld'
	| 'consent_granted'
	| 'consent_revoked'
	| 'progress_synced'
	| 'recommendation_generated'
	| 'skip_requested'
	| 'adjustment_recorded';

export interface AuditEntry {
	id: string;
	timestamp: string;
	event_type: AuditEventType;
	platform_id?: string;
	data_shared?: string[];
	data_withheld?: string[];
	private_fields_influenced?: number;
	private_fields_exposed?: number; // Should always be 0
	details?: Record<string, unknown>;
}

export interface StakeholderAuditEntry {
	timestamp: string;
	event_type: AuditEventType;
	private_context_used: boolean;
	private_context_exposed: boolean; // Always false
	compliance_status?: {
		policy_followed: boolean;
		budget_compliant?: boolean;
		mandatory_addressed?: boolean;
	};
	progress_summary?: string;
}

export type StakeholderType = 'hr' | 'manager' | 'community' | 'employee' | 'coach';

// ============================================
// Progress Types
// ============================================

export interface DailyProgress {
	date: string;
	practiced: boolean;
	adjusted: boolean;
	adjustment_reason?: string; // Private, never shared
	duration_minutes?: number;
	skills_practiced?: string[];
}

export interface ChallengeProgress {
	challenge_id: string;
	challenge_name: string;
	start_date: string;
	end_date: string;
	total_days: number;
	days_completed: number;
	days_adjusted: number;
	current_streak: number;
	best_streak: number;
	daily_log: DailyProgress[];
	badges?: string[];
}

export interface LeaderboardEntry {
	rank: number;
	display_name: string;
	days_completed: number;
	days_adjusted: number;
	total_days: number;
	is_current_user: boolean;
}

// ============================================
// Recommendation Types (Professional Demo)
// ============================================

export type CoursePriority = 'required' | 'recommended' | 'deferred';

export interface Course {
	id: string;
	title: string;
	duration_hours?: number;
	duration_weeks?: number;
	hours_per_week?: number;
	price_eur: number;
	format: 'self_paced' | 'video' | 'interactive' | 'live';
	mandatory: boolean;
	deadline?: string;
	career_paths: string[];
	priority?: CoursePriority;
	defer_reason?: string;
}

export interface RecommendationResult {
	courses: Course[];
	reasoning: string;
	context_used: string[];
	context_withheld: string[];
	budget_remaining: number;
	budget_used: number;
}

// ============================================
// Demo Feature Flags
// ============================================

export interface FeatureFlags {
	// Professional demo
	PROF_MORNING_JOURNEY: boolean;
	PROF_EVENING_JOURNEY: boolean;
	PROF_CONFLICT_JOURNEY: boolean;
	PROF_PROFILE_EDITOR: boolean;

	// Personal demo
	PERS_PROFILE_WIZARD: boolean;
	PERS_JUSTINGUITAR: boolean;
	PERS_YOUSICIAN: boolean;
	PERS_MUSICSHOP: boolean;
	PERS_COACH_VIEW: boolean;
	PERS_FULL_AUDIT: boolean;

	// Responsibility demo
	RESP_DECISION_JOURNEY: boolean;
	RESP_REFLECTION_JOURNEY: boolean;
	RESP_LIVE_LLM: boolean;

	// Shared
	REAL_CRYPTO: boolean;
	CLOUD_SYNC: boolean;
}

// Default v0.1 feature flags
export const DEFAULT_FEATURES: FeatureFlags = {
	PROF_MORNING_JOURNEY: true,
	PROF_EVENING_JOURNEY: true,
	PROF_CONFLICT_JOURNEY: true,
	PROF_PROFILE_EDITOR: false,

	PERS_PROFILE_WIZARD: true,
	PERS_JUSTINGUITAR: true,
	PERS_YOUSICIAN: true,
	PERS_MUSICSHOP: true,
	PERS_COACH_VIEW: true,
	PERS_FULL_AUDIT: true,

	RESP_DECISION_JOURNEY: true,
	RESP_REFLECTION_JOURNEY: true,
	RESP_LIVE_LLM: true,

	REAL_CRYPTO: false,
	CLOUD_SYNC: false
};
