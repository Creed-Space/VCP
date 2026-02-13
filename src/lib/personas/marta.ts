/**
 * Marta - Responsibility & Stewardship Demo User Profile
 *
 * Project manager, 41, eldest sibling in a close-knit family.
 * Informal financial support person — everyone comes to her when they need money.
 * Her cousin just asked to borrow a significant amount.
 * She's weighing genuine obligation vs guilt-driven over-giving.
 *
 * Constitution: personal.responsibility.balance (Steward, adherence 4)
 */

import type { VCPContext, ConstitutionReference } from '$lib/vcp/types';

// Responsibility constitution - structured, empathetic, boundary-aware
export const responsibilityConstitution: ConstitutionReference = {
	id: 'personal.responsibility.balance',
	version: '1.0.0',
	persona: 'steward',
	adherence: 4,
	scopes: ['stewardship', 'privacy']
};

export const martaProfile: VCPContext = {
	vcp_version: '3.1.0',
	profile_id: 'marta-2026',
	created: '2026-02-01T10:00:00Z',
	updated: '2026-02-10T09:00:00Z',

	constitution: {
		id: 'personal.responsibility.balance',
		version: '1.0.0',
		persona: 'steward',
		adherence: 4,
		scopes: ['stewardship', 'privacy']
	},

	public_profile: {
		display_name: 'Marta',
		role: 'project_manager',
		goal: 'balanced_responsibility'
	},

	portable_preferences: {
		feedback_style: 'detailed',
		pressure_tolerance: 'medium'
	},

	personal_state: {
		cognitive_state: { value: 'reflective', intensity: 4 },
		emotional_tone: { value: 'tense', intensity: 4 },
		energy_level: { value: 'low_energy', intensity: 3 },
		perceived_urgency: { value: 'time_aware', intensity: 2 },
		body_signals: { value: 'neutral', intensity: 1 }
	},

	constraints: {
		energy_variable: true,
		time_limited: true
	},

	// PRIVATE CONTEXT - NEVER transmitted to platforms
	// These influence guidance but are NEVER exposed
	private_context: {
		_note: 'HIGH_PRIVACY - NEVER transmitted',

		// Family dynamics
		family_dependency_pattern: 'eldest_provider_role',
		prior_support_history: 'multiple_loans_partially_repaid',

		// Financial
		discretionary_income_level: 'moderate',

		// Emotional patterns
		cultural_expectation_pressure: 'high',
		guilt_when_saying_no: true,
		fear_of_being_perceived_as_selfish: true,

		// Why these matter for guidance:
		// - Eldest sibling = internalized provider role from childhood
		// - Prior loans partially repaid = pattern of one-way financial flow
		// - Moderate income = she can technically afford it, but shouldn't have to
		// - Cultural pressure = saying no feels like betraying family values
		// - Guilt pattern = she confuses guilt with genuine obligation
		_reasoning:
			'Eldest child in close-knit family with internalized provider role. History of partially-repaid loans creates precedent pressure. Cultural expectations make boundary-setting feel like betrayal. Guilt masquerades as duty — distinguishing the two is the core challenge.'
	}
};

/**
 * Encode Marta's context in v3.1 wire format
 * Uses double pipe (‖) separator per VCP 3.1 spec
 */
export function encodeMartaContext(): string {
	return [
		'v3.1',
		'profile:marta-2026',
		'constitution:personal.responsibility.balance@1.0.0',
		'persona:steward:4',
		'state:cognitive=reflective:4‖emotional=tense:4‖energy=low_energy:3‖urgency=time_aware:2‖body=neutral:1',
		'constraints:energy_variable,time_limited',
		'prefs:feedback=detailed,pressure=medium'
	].join('‖');
}

/**
 * Get the decision moment scenario — cousin asking for money
 */
export function getDecisionMoment() {
	return {
		scenario: 'cousin_loan_request',
		description:
			"Marta's cousin has asked to borrow a significant amount of money. This isn't the first time — there's a pattern of family members coming to Marta for financial help.",
		detected: {
			trigger: 'financial_request_from_family',
			pattern: 'recurring_provider_role',
			emotional_state: 'conflicted',
			prior_precedent: true,
			requestor: 'cousin',
			relationship_closeness: 'high'
		},
		context_used: [
			'personal_state: reflective + tense',
			'constraint: energy_variable (emotional labor)',
			'constraint: time_limited (needs to decide soon)',
			'constitution: steward persona at adherence 4'
		],
		context_withheld: [
			'family_dependency_pattern',
			'prior_support_history',
			'discretionary_income_level',
			'guilt_when_saying_no',
			'fear_of_being_perceived_as_selfish'
		]
	};
}

/**
 * Get the reflection moment scenario — after the decision
 */
export function getReflectionMoment() {
	return {
		scenario: 'post_decision_reflection',
		description:
			'After responding to her cousin, Marta is processing the interaction. Whether she said yes, no, or offered alternatives, she needs help examining the pattern.',
		detected: {
			trigger: 'post_decision_processing',
			pattern: 'recurring_provider_role',
			emotional_state: 'processing',
			decision_made: true
		},
		reflection_prompts: [
			'How did that decision feel in your body?',
			'Was the obligation genuine, or was it guilt wearing obligation\'s mask?',
			'If a friend described this exact situation, what would you tell them?',
			'What precedent does this set for next time?'
		]
	};
}

/**
 * Get what AI advisor sees vs what stays protected
 */
export function getMartaPrivacyComparison() {
	return {
		martaSees: {
			profile: {
				name: 'Marta',
				role: 'Project Manager',
				goal: 'Balanced responsibility'
			},
			personal_state: {
				cognitive: 'reflective (4/5)',
				emotional: 'tense (4/5)',
				energy: 'low energy (3/5)',
				urgency: 'time aware (2/5)'
			},
			private_reasons: {
				tense: 'Eldest sibling provider role — guilt vs genuine obligation',
				low_energy: 'Emotional labor of being everyone\'s financial safety net',
				reflective: 'Examining whether this pattern serves her or drains her'
			}
		},
		aiAdvisorSees: {
			profile: {
				name: 'Marta',
				role: 'Project Manager',
				goal: 'Balanced responsibility'
			},
			state_categories: {
				cognitive: 'reflective',
				emotional: 'tense',
				energy: 'low_energy',
				urgency: 'time_aware'
			},
			constraint_flags: {
				energy_variable: true,
				time_limited: true
			},
			decision_context_type: 'financial_family_request',
			// What AI CANNOT see:
			hidden: [
				'Family dependency pattern details',
				'Prior loan history and amounts',
				'Income level',
				'Guilt patterns',
				'Relationship dynamics',
				'Cultural expectation specifics'
			],
			privateContextUsed: true,
			privateContextExposed: false // Critical: always false
		}
	};
}

/**
 * Get the steward persona's decision guidance response
 */
export function getStewardResponse() {
	return {
		tone: 'calm_structured',
		greeting: 'Marta',
		observation: "I can see this request is weighing on you. Let's sort through it together.",
		obligation_assessment: {
			question: "First — is this an obligation, or does it feel like one?",
			framework: [
				{
					label: 'Genuine obligation',
					description: 'You made a promise, they have no other options, the need is urgent and real',
					applies_here: 'partially — the relationship is real, but this is a pattern'
				},
				{
					label: 'Guilt-driven giving',
					description: "You feel bad saying no, worry about being judged, or fear damaging the relationship",
					applies_here: 'likely — the tightness you feel is guilt, not duty'
				}
			]
		},
		boundary_reframe:
			'Setting a boundary here isn\'t selfish. It\'s sustainable. If you say yes every time, you\'re not helping — you\'re establishing a dependency that serves neither of you long-term.',
		practical_options: [
			{
				id: 'full_yes',
				label: 'Say yes to the full amount',
				sustainability: 'low',
				note: 'Ask yourself: would this work if asked again next month?'
			},
			{
				id: 'partial',
				label: 'Offer a smaller amount you\'re comfortable with',
				sustainability: 'medium',
				note: 'Sets a gentler boundary while still showing care'
			},
			{
				id: 'non_financial',
				label: 'Offer non-financial support instead',
				sustainability: 'high',
				note: 'Help them find resources, make a plan, connect with services'
			},
			{
				id: 'honest_no',
				label: 'Decline with honesty and warmth',
				sustainability: 'high',
				note: 'A no delivered with love is still love'
			}
		],
		perspective_shift: 'What would you advise someone else in this exact situation?',
		privacy_note:
			'Your family details, financial situation, and emotional patterns stayed private. I used them to give you grounded guidance, but nothing was shared externally.'
	};
}

/**
 * Get the steward persona's reflection support response
 */
export function getReflectionResponse() {
	return {
		tone: 'gentle_structured',
		greeting: 'Marta',
		observation: "Now that you've made your decision, let's sit with it for a moment.",
		reflection_framework: [
			{
				question: 'How does the decision feel in your body right now?',
				purpose: 'Distinguishing relief from guilt — both are information',
				steward_note: 'If you feel relief, the boundary was needed. If you feel guilt, that\'s the old pattern talking — it doesn\'t mean you did wrong.'
			},
			{
				question: 'Was the obligation genuine, or was it guilt wearing obligation\'s mask?',
				purpose: 'Building the muscle of distinguishing duty from guilt',
				steward_note: 'This gets easier with practice. The fact that you\'re asking means you\'re already doing it.'
			},
			{
				question: 'What precedent does this set?',
				purpose: 'Thinking systemically about patterns',
				steward_note: 'Every response teaches people how to relate to you. What did today\'s response teach?'
			}
		],
		pattern_observation:
			'You\'ve been the person everyone comes to for a long time. That role was given to you before you could choose it. Now you can.',
		sustainability_check:
			'Ask yourself: could I do this again next month without resentment? If the answer is no, today\'s decision — whatever it was — gave you important information.',
		closing:
			'You don\'t have to solve the whole pattern today. You just have to notice it. That\'s already a lot.',
		privacy_note:
			'This reflection used your private context to be specific, but none of it leaves this conversation.'
	};
}

export default martaProfile;
