import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import {
	sanitizeInput,
	buildSystemPrompt,
	computeGenerationParams,
	checkRateLimit,
	VALID_PERSONAS
} from '$lib/chat/utils';

// Lazy-initialized Gemini client (reads env at call time, not module load)
let genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI | null {
	const key = env.GEMINI_API_KEY ?? '';
	if (!key) return null;
	if (!genAI) genAI = new GoogleGenerativeAI(key);
	return genAI;
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

	let query: string, vcp_context: Record<string, unknown> | undefined,
		constitution_id: string, persona: string | undefined;
	try {
		({ query, vcp_context, constitution_id, persona } = await request.json());
	} catch {
		return json({ fallback: true, reason: 'invalid_input', message: 'Malformed request body' }, { status: 400 });
	}

	// Input validation
	if (typeof constitution_id !== 'string' || constitution_id.length > 200) {
		return json({ fallback: true, reason: 'invalid_input' }, { status: 400 });
	}
	if (persona && !VALID_PERSONAS.includes(persona as typeof VALID_PERSONAS[number])) {
		return json({ fallback: true, reason: 'invalid_persona' }, { status: 400 });
	}
	if (vcp_context && JSON.stringify(vcp_context).length > 10_000) {
		return json({ fallback: true, reason: 'context_too_large' }, { status: 400 });
	}

	const ai = getGenAI();
	if (!ai) {
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
		const modelId = env.GEMINI_MODEL_ID ?? 'gemini-3-flash-preview';
		const model = ai.getGenerativeModel({
			model: modelId,
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
			async start(streamController) {
				const encoder = new TextEncoder();
				let closed = false;
				const safeClose = () => {
					if (!closed) {
						closed = true;
						streamController.close();
					}
				};

				const abortHandler = () => { safeClose(); };
				request.signal?.addEventListener('abort', abortHandler);

				try {
					for await (const chunk of result.stream) {
						if (request.signal?.aborted) break;
						const text = chunk.text();
						if (text) {
							const sseData = `data: ${JSON.stringify({ delta: { text } })}\n\n`;
							streamController.enqueue(encoder.encode(sseData));
						}
					}
					if (!closed) {
						streamController.enqueue(encoder.encode('data: [DONE]\n\n'));
					}
				} catch (err) {
					console.error('Gemini streaming error:', err instanceof Error ? err : new Error(String(err)));
					if (!closed) {
						streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
					}
				} finally {
					request.signal?.removeEventListener('abort', abortHandler);
					safeClose();
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
