// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/svelte';
import StreamingChat from './StreamingChat.svelte';
import { tick } from 'svelte';

// Helper: create a JSON fallback Response
function makeFallbackResponse(message = 'test fallback') {
	return new Response(JSON.stringify({ fallback: true, message }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}

describe('StreamingChat', () => {
	let fetchMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		// jsdom does not implement scrollIntoView
		Element.prototype.scrollIntoView = vi.fn();
		fetchMock = vi.fn().mockResolvedValue(makeFallbackResponse());
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	// ── Empty state ──────────────────────────────────────────────

	it('renders empty state with prompt text', () => {
		render(StreamingChat);
		expect(screen.getByText('Ask your question to begin the conversation.')).toBeTruthy();
	});

	it('shows no messages on initial render', () => {
		const { container } = render(StreamingChat);
		const userMessages = container.querySelectorAll('.chat-message-user');
		const assistantMessages = container.querySelectorAll('.chat-message-assistant');
		expect(userMessages.length).toBe(0);
		expect(assistantMessages.length).toBe(0);
	});

	// ── Props defaults ───────────────────────────────────────────

	it('renders default placeholder in textarea', () => {
		render(StreamingChat);
		const textarea = screen.getByLabelText('Chat message input') as HTMLTextAreaElement;
		expect(textarea.placeholder).toBe('Type your message...');
	});

	it('renders custom placeholder when provided', () => {
		render(StreamingChat, { props: { placeholder: 'Ask anything...' } });
		const textarea = screen.getByLabelText('Chat message input') as HTMLTextAreaElement;
		expect(textarea.placeholder).toBe('Ask anything...');
	});

	// ── Warmup GET fires on mount ────────────────────────────────

	it('fires a warmup GET request on mount', async () => {
		render(StreamingChat, { props: { endpoint: '/api/chat' } });
		await waitFor(() => {
			const getCalls = fetchMock.mock.calls.filter(
				(call: unknown[]) => call[1]?.method === 'GET'
			);
			expect(getCalls.length).toBe(1);
			expect(getCalls[0][0]).toBe('/api/chat');
		});
	});

	// ── Send button disabled when empty ──────────────────────────

	it('disables send button when input is empty', () => {
		render(StreamingChat);
		const button = screen.getByLabelText('Send message') as HTMLButtonElement;
		expect(button.disabled).toBe(true);
	});

	it('enables send button when input has text', async () => {
		render(StreamingChat, { props: { initialMessage: 'Hello' } });
		await tick();
		const button = screen.getByLabelText('Send message') as HTMLButtonElement;
		expect(button.disabled).toBe(false);
	});

	// ── Empty / whitespace input doesn't submit ──────────────────

	it('does not call POST fetch when input is empty', async () => {
		render(StreamingChat);
		const button = screen.getByLabelText('Send message') as HTMLButtonElement;
		await fireEvent.click(button);
		await tick();

		const postCalls = fetchMock.mock.calls.filter(
			(call: unknown[]) => call[1]?.method === 'POST'
		);
		expect(postCalls.length).toBe(0);
	});

	it('does not call POST fetch when input is whitespace only', async () => {
		render(StreamingChat, { props: { initialMessage: '   ' } });
		await tick();
		const form = screen.getByLabelText('Chat message input').closest('form')!;
		await fireEvent.submit(form);
		await tick();

		const postCalls = fetchMock.mock.calls.filter(
			(call: unknown[]) => call[1]?.method === 'POST'
		);
		expect(postCalls.length).toBe(0);
	});

	// ── Fallback response on JSON 200 ────────────────────────────

	it('shows fallbackResponse text when fetch returns JSON with fallback: true', async () => {
		fetchMock.mockResolvedValue(makeFallbackResponse('server fallback msg'));

		render(StreamingChat, {
			props: {
				initialMessage: 'Hi there',
				fallbackResponse: 'Custom fallback text'
			}
		});
		await tick();

		const form = screen.getByLabelText('Chat message input').closest('form')!;
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(screen.getByText('Custom fallback text')).toBeTruthy();
		});
	});

	it('uses data.message when no fallbackResponse prop provided', async () => {
		fetchMock.mockResolvedValue(makeFallbackResponse('server says hello'));

		render(StreamingChat, {
			props: { initialMessage: 'Hi' }
		});
		await tick();

		const form = screen.getByLabelText('Chat message input').closest('form')!;
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(screen.getByText('server says hello')).toBeTruthy();
		});
	});

	// ── Fallback badge shown ─────────────────────────────────────

	it('shows "Pre-scripted" badge on fallback response', async () => {
		fetchMock.mockResolvedValue(makeFallbackResponse());

		render(StreamingChat, {
			props: {
				initialMessage: 'Hello',
				fallbackResponse: 'Scripted answer'
			}
		});
		await tick();

		const form = screen.getByLabelText('Chat message input').closest('form')!;
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(screen.getByText('Pre-scripted')).toBeTruthy();
		});
	});

	// ── Error falls back gracefully ──────────────────────────────

	it('shows fallback message on network error', async () => {
		fetchMock
			.mockResolvedValueOnce(new Response('ok'))
			.mockRejectedValueOnce(new Error('Network error'));

		render(StreamingChat, {
			props: {
				initialMessage: 'Test error',
				fallbackResponse: 'Error fallback text'
			}
		});
		await tick();

		const form = screen.getByLabelText('Chat message input').closest('form')!;
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(screen.getByText('Error fallback text')).toBeTruthy();
		});
	});

	it('shows default error text when no fallbackResponse and network error', async () => {
		fetchMock
			.mockResolvedValueOnce(new Response('ok'))
			.mockRejectedValueOnce(new Error('fail'));

		render(StreamingChat, {
			props: { initialMessage: 'Test' }
		});
		await tick();

		const form = screen.getByLabelText('Chat message input').closest('form')!;
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(
				screen.getByText('Unable to connect to AI advisor. Showing pre-scripted guidance.')
			).toBeTruthy();
		});
	});

	// ── Textarea disabled while streaming ────────────────────────

	it('disables textarea while a request is in flight', async () => {
		let resolvePost!: (value: Response) => void;
		fetchMock
			.mockResolvedValueOnce(new Response('ok'))
			.mockImplementationOnce(
				() => new Promise<Response>((resolve) => { resolvePost = resolve; })
			);

		render(StreamingChat, {
			props: { initialMessage: 'Hello' }
		});
		await tick();

		const textarea = screen.getByLabelText('Chat message input') as HTMLTextAreaElement;
		const form = textarea.closest('form')!;
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(textarea.disabled).toBe(true);
		});

		resolvePost(makeFallbackResponse());
		await waitFor(() => {
			expect(textarea.disabled).toBe(false);
		});
	});

	// ── Enter key submits ────────────────────────────────────────

	it('submits on Enter key press', async () => {
		render(StreamingChat, {
			props: {
				initialMessage: 'Enter test',
				fallbackResponse: 'Enter response'
			}
		});
		await tick();

		const textarea = screen.getByLabelText('Chat message input');
		await fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

		await waitFor(() => {
			expect(screen.getByText('Enter response')).toBeTruthy();
		});

		const postCalls = fetchMock.mock.calls.filter(
			(call: unknown[]) => call[1]?.method === 'POST'
		);
		expect(postCalls.length).toBe(1);
	});

	// ── Shift+Enter does NOT submit ──────────────────────────────

	it('does not submit on Shift+Enter key press', async () => {
		render(StreamingChat, {
			props: { initialMessage: 'No submit' }
		});
		await tick();

		const textarea = screen.getByLabelText('Chat message input');
		await fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
		await tick();

		const postCalls = fetchMock.mock.calls.filter(
			(call: unknown[]) => call[1]?.method === 'POST'
		);
		expect(postCalls.length).toBe(0);
	});

	// ── User messages have correct role class ────────────────────

	it('renders user message with chat-message-user class', async () => {
		render(StreamingChat, {
			props: {
				initialMessage: 'User msg test',
				fallbackResponse: 'Reply'
			}
		});
		await tick();

		const form = screen.getByLabelText('Chat message input').closest('form')!;
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(screen.getByText('User msg test')).toBeTruthy();
		});

		const userMsgEl = screen.getByText('User msg test').closest('.chat-message');
		expect(userMsgEl?.classList.contains('chat-message-user')).toBe(true);
	});

	// ── Assistant messages have correct role class ────────────────

	it('renders assistant message with chat-message-assistant class', async () => {
		fetchMock.mockResolvedValue(makeFallbackResponse());

		render(StreamingChat, {
			props: {
				initialMessage: 'Test query',
				fallbackResponse: 'Assistant reply here'
			}
		});
		await tick();

		const form = screen.getByLabelText('Chat message input').closest('form')!;
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(screen.getByText('Assistant reply here')).toBeTruthy();
		});

		const assistantMsgEl = screen.getByText('Assistant reply here').closest('.chat-message');
		expect(assistantMsgEl?.classList.contains('chat-message-assistant')).toBe(true);
	});

	// ── Warmup uses correct endpoint ─────────────────────────────

	it('uses custom endpoint for warmup GET', async () => {
		render(StreamingChat, { props: { endpoint: '/api/custom-chat' } });

		await waitFor(() => {
			const getCalls = fetchMock.mock.calls.filter(
				(call: unknown[]) => call[1]?.method === 'GET'
			);
			expect(getCalls.length).toBe(1);
			expect(getCalls[0][0]).toBe('/api/custom-chat');
		});
	});
});
