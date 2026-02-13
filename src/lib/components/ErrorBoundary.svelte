<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let error = $state<Error | null>(null);
	let errorInfo = $state<string>('');

	function handleError(e: ErrorEvent) {
		error = e.error || new Error(e.message);
		errorInfo = e.filename ? `${e.filename}:${e.lineno}:${e.colno}` : '';
	}

	function handleRejection(e: PromiseRejectionEvent) {
		error = e.reason instanceof Error ? e.reason : new Error(String(e.reason));
		errorInfo = 'Unhandled Promise Rejection';
	}

	function reset() {
		error = null;
		errorInfo = '';
	}

	$effect(() => {
		window.addEventListener('error', handleError);
		window.addEventListener('unhandledrejection', handleRejection);

		return () => {
			window.removeEventListener('error', handleError);
			window.removeEventListener('unhandledrejection', handleRejection);
		};
	});
</script>

{#if error}
	<div class="error-boundary" role="alert" aria-live="assertive">
		<div class="error-boundary-content">
			<div class="error-icon" aria-hidden="true">
				<i class="fa-solid fa-triangle-exclamation"></i>
			</div>
			<h2>Something went wrong</h2>
			<p class="error-message">{error.message}</p>
			{#if errorInfo}
				<p class="error-info">{errorInfo}</p>
			{/if}
			<div class="error-actions">
				<button class="btn btn-primary" onclick={reset}>
					<i class="fa-solid fa-arrow-rotate-left" aria-hidden="true"></i>
					Try Again
				</button>
				<a href="/" class="btn btn-secondary">
					<i class="fa-solid fa-home" aria-hidden="true"></i>
					Back to Home
				</a>
			</div>
		</div>
	</div>
{:else}
	{@render children()}
{/if}

<style>
	.error-boundary {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		padding: var(--space-xl);
	}

	.error-boundary-content {
		text-align: center;
		max-width: 500px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: var(--space-2xl);
	}

	.error-icon {
		font-size: 3rem;
		color: var(--color-danger);
		margin-bottom: var(--space-md);
	}

	h2 {
		margin: 0 0 var(--space-md);
		font-size: 1.5rem;
		color: var(--color-text);
	}

	.error-message {
		color: var(--color-text-muted);
		margin-bottom: var(--space-sm);
		word-break: break-word;
	}

	.error-info {
		font-family: monospace;
		font-size: 0.75rem;
		color: var(--color-text-muted);
		opacity: 0.7;
		margin-bottom: var(--space-lg);
	}

	.error-actions {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border-radius: 6px;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		border: none;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--color-primary);
		color: white;
	}

	.btn-primary:hover {
		background: var(--color-primary-dark);
	}

	.btn-secondary {
		background: var(--color-surface);
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background: var(--color-surface-hover);
	}

	@media (prefers-reduced-motion: reduce) {
		.btn {
			transition: none;
		}
	}
</style>
