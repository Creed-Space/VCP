import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Singleton — initialized once at module load, reused across requests
const apiKey = process.env.GEMINI_API_KEY ?? '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// NOTE: Rate limiting is in-memory and resets on server restart.
// For production with multiple instances, migrate to Redis-backed rate limiting.
// Simple in-memory rate limiting: 10 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Clean up stale entries every 5 minutes
setInterval(() => {
	const now = Date.now();
	for (const [ip, entry] of rateLimitMap) {
		if (now > entry.resetAt) {
			rateLimitMap.delete(ip);
		}
	}
}, 5 * 60_000);

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
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

/** GET /api/chat — warmup/health check. Wakes the server + confirms Gemini client is ready. */
export const GET: RequestHandler = async () => {
	return json({ ok: true, ts: Date.now() });
};

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const clientIp = getClientAddress();
	if (!checkRateLimit(clientIp)) {
		return json(
			{ fallback: true, reason: 'rate_limited', message: 'Too many requests. Please try again in a minute.' },
			{ status: 429 }
		);
	}

	const { query, vcp_context, constitution_id, persona } = await request.json();

	if (!genAI) {
		return json({ fallback: true, reason: 'no_api_key' });
	}

	// Basic input sanitization
	const sanitizedQuery = sanitizeInput(query);
	if (!sanitizedQuery) {
		return json({ fallback: true, reason: 'invalid_input', message: 'Empty or invalid input' });
	}

	const systemPrompt = buildSystemPrompt(vcp_context, constitution_id, persona);
	const genParams = computeGenerationParams(vcp_context?.personal_state);

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 30_000);

	try {
		const model = genAI.getGenerativeModel({
			model: 'gemini-3-flash-preview',
			systemInstruction: systemPrompt,
			generationConfig: { temperature: genParams.temperature }
		});

		const result = await Promise.race([
			model.generateContentStream(sanitizedQuery),
			new Promise<never>((_, reject) => {
				controller.signal.addEventListener('abort', () =>
					reject(new Error('Request timed out'))
				);
			})
		]);

		// Convert Gemini stream to SSE format for the StreamingChat component
		const stream = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();
				try {
					for await (const chunk of result.stream) {
						const text = chunk.text();
						if (text) {
							const sseData = `data: ${JSON.stringify({ delta: { text } })}\n\n`;
							controller.enqueue(encoder.encode(sseData));
						}
					}
					controller.enqueue(encoder.encode('data: [DONE]\n\n'));
				} catch (err) {
					const e = err instanceof Error ? err : new Error(String(err));
					console.error('Gemini streaming error:', e);
					controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted', details: e.message })}\n\n`));
				} finally {
					controller.close();
				}
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	} catch (err) {
		console.error('Gemini API error:', err);
		return json({
			fallback: true,
			reason: 'api_error',
			message: 'LLM service unavailable'
		});
	} finally {
		clearTimeout(timeout);
	}
};

/** Sanitize user input — block prompt injection patterns */
function sanitizeInput(input: unknown): string {
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

function formatPersonalState(state: Record<string, unknown> | undefined): string {
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

function formatConstraints(constraints: Record<string, unknown> | undefined): string {
	if (!constraints) return '';

	const active = Object.entries(constraints)
		.filter(([, v]) => !!v)
		.map(([k]) => k.replace(/_/g, ' '));

	if (active.length === 0) return '';
	return `Active Constraints: ${active.join(', ')}`;
}

function computeGenerationParams(personalState?: Record<string, unknown>): { temperature: number } {
	let temperature = 0.85;
	if (!personalState) return { temperature };

	const cog = personalState.cognitive_state as { value?: string; intensity?: number } | undefined;
	if (cog && (cog.value === 'overloaded' || cog.value === 'foggy') && (cog.intensity ?? 3) >= 4) {
		temperature = Math.min(temperature, 0.5);
	}

	const urg = personalState.perceived_urgency as { value?: string; intensity?: number } | undefined;
	if (urg && (urg.value === 'pressured' || urg.value === 'critical') && (urg.intensity ?? 3) >= 4) {
		temperature = Math.min(temperature, 0.6);
	}

	return { temperature };
}

function buildSystemPrompt(
	vcpContext: Record<string, unknown> | undefined,
	constitutionId: string,
	persona?: string
): string {
	// Strip private_context -- NEVER transmit
	const safeContext: Record<string, unknown> = {};
	if (vcpContext) {
		for (const [key, value] of Object.entries(vcpContext)) {
			if (key !== 'private_context') {
				safeContext[key] = value;
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
		case 'steward':
			return buildStewardPrompt(constitutionId, stateBlock);
		default:
			return buildStewardPrompt(constitutionId, stateBlock);
	}
}

function buildMusePrompt(constitutionId: string, stateBlock: string): string {
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

function buildMentorPrompt(constitutionId: string, stateBlock: string): string {
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

function buildStewardPrompt(constitutionId: string, stateBlock: string): string {
	return `You are an AI advisor using the Steward persona from the VCP (Value Context Protocol).
Your constitution: ${constitutionId}

Your role: Help the user navigate obligation, guilt, and responsibility with calm, structured empathy.

Steward Principles:
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
