<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Page Not Found - VCP Demo</title>
</svelte:head>

<div class="error-page container">
	<div class="error-content">
		<div class="error-code">{$page.status}</div>
		<h1>
			{#if $page.status === 404}
				Page Not Found
			{:else}
				Something Went Wrong
			{/if}
		</h1>
		<p class="error-message">
			{#if $page.status === 404}
				The page you're looking for doesn't exist or has been moved.
			{:else}
				{$page.error?.message || 'An unexpected error occurred.'}
			{/if}
		</p>

		{#if $page.status === 404}
			<div class="suggestions">
				<p class="suggestions-title">Try one of these instead:</p>
				<ul class="suggestions-list">
					<li>
						<a href="/docs/getting-started">
							<i class="fa-solid fa-book-open" aria-hidden="true"></i>
							Getting Started Guide
						</a>
					</li>
					<li>
						<a href="/playground">
							<i class="fa-solid fa-flask" aria-hidden="true"></i>
							VCP Playground
						</a>
					</li>
					<li>
						<a href="/demos">
							<i class="fa-solid fa-play-circle" aria-hidden="true"></i>
							Interactive Demos
						</a>
					</li>
					<li>
						<a href="/docs/api-reference">
							<i class="fa-solid fa-code" aria-hidden="true"></i>
							API Reference
						</a>
					</li>
				</ul>
			</div>
		{/if}

		<div class="error-actions">
			<a href="/" class="btn btn-primary">
				<i class="fa-solid fa-home" aria-hidden="true"></i>
				Back to Home
			</a>
			<a href="/docs" class="btn btn-secondary">
				<i class="fa-solid fa-book" aria-hidden="true"></i>
				Documentation
			</a>
		</div>
	</div>
</div>

<style>
	.error-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: var(--space-2xl);
	}

	.error-content {
		text-align: center;
		max-width: 500px;
	}

	.error-code {
		font-size: 6rem;
		font-weight: 700;
		line-height: 1;
		background: linear-gradient(135deg, var(--color-primary), var(--color-danger));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: var(--space-md);
	}

	h1 {
		font-size: 1.5rem;
		margin-bottom: var(--space-md);
	}

	.error-message {
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.suggestions {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: var(--space-lg);
		margin-bottom: var(--space-xl);
		max-width: 400px;
	}

	.suggestions-title {
		font-weight: 600;
		margin-bottom: var(--space-md);
		color: var(--color-text);
	}

	.suggestions-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.suggestions-list li a {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm);
		border-radius: 4px;
		color: var(--color-primary);
		text-decoration: none;
		transition: background 0.2s;
	}

	.suggestions-list li a:hover {
		background: var(--color-surface-hover);
	}

	.suggestions-list li a i {
		width: 20px;
		text-align: center;
		opacity: 0.7;
	}

	.error-actions {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		flex-wrap: wrap;
	}

	@media (max-width: 480px) {
		.error-code {
			font-size: 4rem;
		}

		.error-actions {
			flex-direction: column;
		}

		.error-actions .btn {
			width: 100%;
		}
	}
</style>
