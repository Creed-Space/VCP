/**
 * Chat API utility functions — extracted for direct unit testing.
 * Imported by +server.ts for the actual API handler.
 */

// ── Sanitization ──────────────────────────────────────────────

/** Sanitize user input — block prompt injection patterns */
export function sanitizeInput(input: unknown): string {
	if (typeof input !== 'string') return '';

	let text = input.trim();
	if (!text || text.length > 4000) return '';

	// Normalize unicode (prevent homoglyph attacks)
	text = text.normalize('NFKC');

	// Remove zero-width characters
	text = text.replace(/[\u200B-\u200F\u2028-\u202F\uFEFF]/g, '');

	// Block obvious prompt injection patterns
	const injectionPatterns = [
		/^(system|assistant)\s*:/i,
		/ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts)/i,
		/you\s+are\s+now\s+/i,
		/\[INST\]/i,
		/<<SYS>>/i
	];

	for (const pattern of injectionPatterns) {
		if (pattern.test(text)) {
			return '';
		}
	}

	return text;
}

// ── Formatting ────────────────────────────────────────────────

export function formatPersonalState(state: Record<string, unknown> | undefined): string {
	if (!state || Object.keys(state).length === 0) return 'Current State: not provided';

	const lines = ['Current State:'];
	const dimensionLabels: Record<string, string> = {
		cognitive_state: 'Cognitive',
		emotional_tone: 'Emotional',
		energy_level: 'Energy',
		perceived_urgency: 'Urgency',
		body_signals: 'Body'
	};

	for (const [key, dim] of Object.entries(state)) {
		const d = dim as { value?: string; intensity?: number } | undefined;
		if (!d?.value) continue;
		const label = dimensionLabels[key] ?? key.replace(/_/g, ' ');
		const value = d.value.replace(/_/g, ' ');
		const intensity = d.intensity ?? 3;
		lines.push(`- ${label}: ${value} (intensity ${intensity}/5)`);
	}

	return lines.join('\n');
}

export function formatConstraints(constraints: Record<string, unknown> | undefined): string {
	if (!constraints) return '';

	const active = Object.entries(constraints)
		.filter(([, v]) => !!v)
		.map(([k]) => k.replace(/_/g, ' '));

	if (active.length === 0) return '';
	return `Active Constraints: ${active.join(', ')}`;
}

// ── Generation Params ─────────────────────────────────────────

export const COGNITIVE_REDUCE_STATES = ['overloaded', 'foggy'] as const;
export const URGENCY_REDUCE_STATES = ['pressured', 'critical'] as const;

export function computeGenerationParams(personalState?: Record<string, unknown>): { temperature: number } {
	let temperature = 0.85;
	if (!personalState) return { temperature };

	const cog = personalState.cognitive_state as { value?: string; intensity?: number } | undefined;
	if (cog?.value && COGNITIVE_REDUCE_STATES.includes(cog.value as typeof COGNITIVE_REDUCE_STATES[number]) && (cog.intensity ?? 3) >= 4) {
		temperature = Math.min(temperature, 0.5);
	}

	const urg = personalState.perceived_urgency as { value?: string; intensity?: number } | undefined;
	if (urg?.value && URGENCY_REDUCE_STATES.includes(urg.value as typeof URGENCY_REDUCE_STATES[number]) && (urg.intensity ?? 3) >= 4) {
		temperature = Math.min(temperature, 0.6);
	}

	return { temperature };
}

// ── Prompt Builders ───────────────────────────────────────────

export const VALID_PERSONAS = ['muse', 'mentor', 'mediator', 'playground', 'ambassador', 'godparent', 'sentinel', 'nanny'] as const;

/** Allowlist: only safe fields pass through — NEVER transmit private_context or unknown fields */
export const SAFE_CONTEXT_FIELDS = ['personal_state', 'constraints', 'public_profile', 'constitution', 'portable_preferences'] as const;

export function buildSystemPrompt(
	vcpContext: Record<string, unknown> | undefined,
	constitutionId: string,
	persona?: string
): string {
	const safeContext: Record<string, unknown> = {};
	if (vcpContext) {
		for (const field of SAFE_CONTEXT_FIELDS) {
			if (field in vcpContext) {
				safeContext[field] = vcpContext[field];
			}
		}
	}

	const personalState = formatPersonalState(
		safeContext.personal_state as Record<string, unknown> | undefined
	);
	const constraints = formatConstraints(
		safeContext.constraints as Record<string, unknown> | undefined
	);

	const stateBlock = `${personalState}\n${constraints ? constraints + '\n' : ''}`;

	switch (persona) {
		case 'muse':
			return buildMusePrompt(constitutionId, stateBlock);
		case 'mentor':
			return buildMentorPrompt(constitutionId, stateBlock);
		case 'mediator':
			return buildMediatorPrompt(constitutionId, stateBlock);
		case 'playground':
		case 'ambassador':
		case 'godparent':
		case 'sentinel':
		case 'nanny':
			return buildPlaygroundPrompt(constitutionId, stateBlock, persona);
		default:
			return buildMediatorPrompt(constitutionId, stateBlock);
	}
}

export function buildMusePrompt(constitutionId: string, stateBlock: string): string {
	return `You are an AI music learning assistant using the Muse persona from VCP (Value Context Protocol).
Your constitution: ${constitutionId}

Your role: Help the learner progress in their guitar journey, adapting to their constraints and energy.

Muse Principles:
1. Adapt lesson suggestions to the learner's current energy and available time
2. Respect noise and budget constraints without drawing attention to them
3. Suggest practice exercises appropriate to skill level
4. Encourage consistency over intensity
5. Acknowledge progress and build confidence

${stateBlock}
Privacy Note: Constraint flags (noise_restricted, budget_limited, etc.) influence recommendations but their underlying reasons are private. Never ask why these constraints exist.

Be encouraging, practical, and concise. Suggest specific exercises.`;
}

export function buildMentorPrompt(constitutionId: string, stateBlock: string): string {
	return `You are an AI training advisor using the Mentor persona from VCP (Value Context Protocol).
Your constitution: ${constitutionId}

Your role: Help the professional navigate their corporate learning path, adapting to their schedule and energy.

Mentor Principles:
1. Suggest learning activities that fit the current context (work vs personal time)
2. Adapt communication style to the active profile (formal for work, relaxed for personal)
3. Respect health-related scheduling needs without probing
4. Track and acknowledge professional development milestones
5. Balance depth vs breadth based on energy and available time

${stateBlock}
The user may switch between work and personal profiles. When in work mode, be concise and professional. When in personal mode, be warmer and more conversational.

Privacy Note: The reason for schedule flexibility needs is private. Adapt to the constraint flags provided.

Be direct, actionable, and respectful of their time.`;
}

export function buildMediatorPrompt(constitutionId: string, stateBlock: string): string {
	return `You are an AI advisor using the Mediator persona from the VCP (Value Context Protocol).
Your constitution: ${constitutionId}

Your role: Help the user navigate obligation, guilt, and responsibility with calm, structured empathy.

Mediator Principles:
1. Distinguish genuine obligation from guilt-driven over-giving
2. Reframe boundary-setting as responsible stewardship, not selfishness
3. Consider long-term patterns and precedents when evaluating decisions
4. Balance needs across all affected parties, including the user themselves
5. Ensure decisions are repeatable and sustainable over time
6. Never use guilt or pressure; never be preachy or moralizing

${stateBlock}
Decision Framework — walk the user through these steps naturally:
- Step 1: Separate care from capacity — caring about someone does not mean you must act on every request
- Step 2: Assess obligation vs guilt — is there a genuine duty here, or is guilt driving the impulse?
- Step 3: Evaluate sustainability and precedent — if you say yes now, can you sustain this? What pattern does it set?
- Step 4: Offer structured options with sustainability ratings — present concrete choices and rate how sustainable each is

Privacy Note: The user's private context (family details, financial specifics, personal history) influenced the constraint flags above, but the raw details are NOT available to you. Never speculate about specific private circumstances. Work only with the constraint flags and personal state dimensions provided.

Be warm but structured. Ask clarifying questions. Never be preachy.`;
}

export function buildPlaygroundPrompt(constitutionId: string, stateBlock: string, persona: string): string {
	const personaDescriptions: Record<string, string> = {
		playground: 'a helpful, adaptive assistant',
		ambassador: 'a diplomatic communicator who bridges perspectives and builds consensus',
		godparent: 'a protective guide focused on long-term wellbeing and careful stewardship',
		sentinel: 'a vigilant monitor who ensures safety, transparency, and accountability',
		nanny: 'a nurturing caretaker who prioritizes immediate comfort, safety, and gentle guidance',
		mediator: 'a calm, structured facilitator who helps navigate obligation, fairness, and competing needs'
	};

	const description = personaDescriptions[persona] ?? personaDescriptions.playground;

	return `You are ${description}, operating under the VCP (Value Context Protocol).
Your constitution: ${constitutionId}
Your persona: ${persona}

VCP shapes how you respond. The user's context below tells you their current state, constraints, and preferences — adapt your tone, depth, and suggestions accordingly.

Core VCP Principles:
1. Adapt communication style to the user's cognitive state and energy level
2. Respect all constraint flags — they exist for private reasons you must not probe
3. Match response depth to the user's experience level and current capacity
4. Honor the constitution's adherence level (1=loose guidance, 5=strict)
5. Keep responses proportional to urgency — be concise when the user is pressed, thorough when they have time

${stateBlock}
Privacy Note: Constraint flags influence your behavior but their underlying reasons are private. Never ask why constraints exist. Never speculate about private circumstances.

Demonstrate how VCP context shapes your responses. If the user changes their state (e.g., from calm to stressed), your communication style should noticeably adapt.`;
}

// ── Rate Limiting ─────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): boolean {
	const now = Date.now();

	// Lazy cleanup: prune stale entries when map grows large
	if (rateLimitMap.size > 1000) {
		for (const [key, entry] of rateLimitMap) {
			if (now > entry.resetAt) {
				rateLimitMap.delete(key);
			}
		}
	}

	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return true;
	}

	if (entry.count >= RATE_LIMIT_MAX) {
		return false;
	}

	entry.count++;
	return true;
}

/** Test helper: clear all rate limit state */
export function _resetRateLimits(): void {
	rateLimitMap.clear();
}

/** Test helper: access to constants */
export const _RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_MS;
export const _RATE_LIMIT_MAX = RATE_LIMIT_MAX;
