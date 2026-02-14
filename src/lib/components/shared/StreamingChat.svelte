<script lang="ts">
	/**
	 * StreamingChat - Reusable streaming chat component
	 * Connects to API endpoint for live LLM responses, falls back to pre-scripted when no API key
	 */

	interface Props {
		endpoint?: string;
		systemContext?: Record<string, unknown>;
		constitutionId?: string;
		persona?: string;
		fallbackResponse?: string;
		placeholder?: string;
		initialMessage?: string;
	}

	interface ChatMessage {
		role: 'user' | 'assistant';
		content: string;
		isFallback?: boolean;
	}

	let {
		endpoint = '/api/chat',
		systemContext = {},
		constitutionId = '',
		persona = '',
		fallbackResponse = '',
		placeholder = 'Type your message...',
		initialMessage = ''
	}: Props = $props();

	let messages: ChatMessage[] = $state([]);
	let isStreaming = $state(false);
	let useFallback = $state(false);
	// svelte-ignore state_referenced_locally — intentional init-once from prop
	let inputText = $state(initialMessage);
	let messagesEnd: HTMLDivElement | null = $state(null);
	let textareaEl: HTMLTextAreaElement | null = $state(null);

	// Warmup: ping the endpoint on mount so the server + LLM client are hot
	$effect(() => {
		fetch(endpoint, { method: 'GET' }).catch(() => {});
	});

	// Auto-scroll to bottom when messages change
	$effect(() => {
		if (messages.length > 0 && messagesEnd) {
			messagesEnd.scrollIntoView({ behavior: 'smooth' });
		}
	});

	async function handleSubmit() {
		const query = inputText.trim();
		if (!query || isStreaming) return;

		// Add user message
		messages = [...messages, { role: 'user', content: query }];
		inputText = '';
		isStreaming = true;

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query,
					vcp_context: systemContext,
					constitution_id: constitutionId,
					persona: persona || undefined
				})
			});

			// Check if we got a JSON fallback response
			const contentType = response.headers.get('content-type') ?? '';
			if (contentType.includes('application/json')) {
				const data = await response.json();
				if (data.fallback) {
					useFallback = true;
					messages = [
						...messages,
						{ role: 'assistant', content: fallbackResponse || data.message || 'No API key configured.', isFallback: true }
					];
					isStreaming = false;
					return;
				}
			}

			// Stream SSE response
			if (!response.body) {
				throw new Error('No response body');
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let assistantContent = '';
			messages = [...messages, { role: 'assistant', content: '' }];

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				const lines = chunk.split('\n');

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						const data = line.slice(6);
						if (data === '[DONE]') continue;

						try {
							const parsed = JSON.parse(data);
							const delta = parsed?.delta?.text ?? parsed?.choices?.[0]?.delta?.content ?? '';
							if (delta) {
								assistantContent += delta;
								// Update the last message in place
								messages = [
									...messages.slice(0, -1),
									{ role: 'assistant', content: assistantContent }
								];
							}
						} catch {
							// Non-JSON SSE line, skip
						}
					}
				}
			}
		} catch (err) {
			// On any error, fall back to pre-scripted
			useFallback = true;
			messages = [
				...messages,
				{
					role: 'assistant',
					content: fallbackResponse || 'Unable to connect to AI advisor. Showing pre-scripted guidance.',
					isFallback: true
				}
			];
		} finally {
			isStreaming = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<div class="streaming-chat">
	<div class="chat-messages" role="log" aria-label="Chat messages" aria-live="polite">
		{#if messages.length === 0}
			<div class="chat-empty">
				<i class="fa-solid fa-comments" aria-hidden="true"></i>
				<p>Ask your question to begin the conversation.</p>
			</div>
		{/if}

		{#each messages as message}
			<div class="chat-message chat-message-{message.role}" class:fallback={message.isFallback}>
				<div class="message-header">
					<span class="message-role">
						{#if message.role === 'user'}
							<i class="fa-solid fa-user" aria-hidden="true"></i> You
						{:else}
							<i class="fa-solid fa-shield-halved" aria-hidden="true"></i> AI Advisor
							{#if message.isFallback}
								<span class="badge badge-warning badge-sm">Pre-scripted</span>
							{:else if !isStreaming}
								<span class="badge badge-success badge-sm">Live LLM</span>
							{/if}
						{/if}
					</span>
				</div>
				<div class="message-content">
					{#if isStreaming && message === messages[messages.length - 1] && message.role === 'assistant' && !message.content}
						<span class="thinking-indicator" aria-label="Thinking">
							<span class="thinking-dot"></span>
							<span class="thinking-dot"></span>
							<span class="thinking-dot"></span>
						</span>
					{:else}
						{message.content}
						{#if isStreaming && message === messages[messages.length - 1] && message.role === 'assistant'}
							<span class="streaming-cursor" aria-label="Generating response"></span>
						{/if}
					{/if}
				</div>
			</div>
		{/each}

		<div bind:this={messagesEnd}></div>
	</div>

	<form class="chat-input-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
		<div class="chat-input-wrapper">
			<textarea
				bind:this={textareaEl}
				bind:value={inputText}
				{placeholder}
				disabled={isStreaming}
				rows={2}
				onkeydown={handleKeydown}
				aria-label="Chat message input"
			></textarea>
			<button
				type="submit"
				class="btn btn-primary chat-send-btn"
				disabled={isStreaming || !inputText.trim()}
				aria-label={isStreaming ? 'Generating response...' : 'Send message'}
			>
				{#if isStreaming}
					<span class="sending-spinner"></span>
				{:else}
					<i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
				{/if}
			</button>
		</div>
		{#if useFallback}
			<p class="fallback-notice">
				<i class="fa-solid fa-info-circle" aria-hidden="true"></i>
				No API key configured. Showing pre-scripted responses.
			</p>
		{/if}
	</form>
</div>

<style>
	.streaming-chat {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 400px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		background: var(--color-bg-card);
		overflow: hidden;
	}

	.chat-messages {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.chat-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		height: 100%;
		color: var(--color-text-subtle);
		text-align: center;
		padding: var(--space-xl);
	}

	.chat-empty i {
		font-size: 2rem;
		opacity: 0.5;
	}

	.chat-message {
		padding: var(--space-md);
		border-radius: var(--radius-md);
		max-width: 85%;
	}

	.chat-message-user {
		background: var(--color-primary-muted);
		align-self: flex-end;
		border-bottom-right-radius: var(--radius-sm);
	}

	.chat-message-assistant {
		background: var(--color-bg-elevated);
		align-self: flex-start;
		border-bottom-left-radius: var(--radius-sm);
	}

	.chat-message-assistant.fallback {
		border-left: 3px solid var(--color-warning);
	}

	.message-header {
		margin-bottom: var(--space-xs);
	}

	.message-role {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.badge-sm {
		font-size: 0.625rem;
		padding: 1px 6px;
		text-transform: none;
		letter-spacing: 0;
		font-weight: 500;
	}

	.message-content {
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.streaming-cursor {
		display: inline-block;
		width: 8px;
		height: 16px;
		background: var(--color-primary);
		margin-left: 2px;
		animation: blink 0.8s infinite;
		vertical-align: text-bottom;
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}

	.thinking-indicator {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 0;
	}

	.thinking-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-text-muted);
		animation: thinking-bounce 1.4s ease-in-out infinite;
	}

	.thinking-dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.thinking-dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes thinking-bounce {
		0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
		40% { opacity: 1; transform: scale(1); }
	}

	.chat-input-form {
		padding: var(--space-md);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		background: var(--color-bg-elevated);
	}

	.chat-input-wrapper {
		display: flex;
		gap: var(--space-sm);
		align-items: flex-end;
	}

	.chat-input-wrapper textarea {
		flex: 1;
		resize: none;
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-family: inherit;
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
	}

	.chat-input-wrapper textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.chat-input-wrapper textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.chat-send-btn {
		padding: var(--space-sm) var(--space-md);
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sending-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.fallback-notice {
		margin-top: var(--space-sm);
		font-size: var(--text-xs);
		color: var(--color-warning);
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}
</style>
