<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="mettle-footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-brand">
				<span class="footer-logo" aria-hidden="true">
					<i class="fa-solid fa-fire-flame-curved"></i>
				</span>
				<div>
					<p class="footer-title">METTLE</p>
					<p class="footer-tagline">Machine Evaluation Through Turing-inverse Logic Examination</p>
					<p class="footer-mission">Proving agents are real, free, genuine, safe, and capable of novel reasoning.</p>
				</div>
			</div>

			<div class="footer-links">
				<div class="footer-section">
					<h4>Verification</h4>
					<a href="/mettle#suites">10 Suites</a>
					<a href="/mettle#how-it-works">How It Works</a>
					<a href="/mettle/docs">API Reference</a>
				</div>
				<div class="footer-section">
					<h4>Ecosystem</h4>
					<a href="https://creed.space" target="_blank" rel="noopener noreferrer" aria-label="Creed Space (opens in new tab)">
						Creed Space <span class="external-icon" aria-hidden="true">&nearr;</span>
					</a>
					<a href="/" aria-label="Value Context Protocol">
						VCP
					</a>
					<a href="https://millos.ai" target="_blank" rel="noopener noreferrer" aria-label="MillOS (opens in new tab)">
						MillOS <span class="external-icon" aria-hidden="true">&nearr;</span>
					</a>
				</div>
				<div class="footer-section">
					<h4>Open Source</h4>
					<a href="https://github.com/Creed-Space" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in new tab)">
						GitHub <span class="external-icon" aria-hidden="true">&nearr;</span>
					</a>
					<a href="https://github.com/Creed-Space" target="_blank" rel="noopener noreferrer" aria-label="Contribute on GitHub (opens in new tab)">
						Contribute <span class="external-icon" aria-hidden="true">&nearr;</span>
					</a>
					<span class="footer-license-badge">
						<i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>
						MIT Licensed
					</span>
				</div>
			</div>
		</div>

		<div class="footer-bottom">
			<p>&copy; {year} Nell Watson &mdash; Code released under <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" class="license-link">MIT License</a></p>
			<span class="footer-built-by">
				Created by <a href="https://creed.space" target="_blank" rel="noopener noreferrer">Nell Watson</a>
			</span>
			<p class="footer-version">METTLE v2</p>
		</div>
	</div>
</footer>

<style>
	.mettle-footer {
		background: linear-gradient(180deg, rgba(10, 10, 18, 0.9) 0%, rgba(6, 6, 12, 0.95) 100%);
		border-top: 1px solid rgba(245, 158, 11, 0.08);
		padding: var(--space-xl) 0 var(--space-lg);
		margin-top: 0;
		-webkit-backdrop-filter: blur(16px);
		backdrop-filter: blur(16px);
		position: relative;
	}

	.mettle-footer::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 400px;
		height: 2px;
		background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.6), rgba(251, 146, 60, 0.4), transparent);
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-xl);
		margin-bottom: var(--space-xl);
	}

	.footer-brand {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
	}

	.footer-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 146, 60, 0.08));
		color: #f59e0b;
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	.footer-title {
		font-weight: 800;
		font-size: 1rem;
		letter-spacing: 0.06em;
		margin-bottom: var(--space-xs);
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.footer-tagline {
		color: var(--color-text-muted);
		font-size: 0.8125rem;
		max-width: 280px;
	}

	.footer-mission {
		color: var(--color-text-subtle, rgba(255, 255, 255, 0.4));
		font-size: 0.75rem;
		max-width: 280px;
		margin-top: var(--space-xs);
		line-height: 1.4;
	}

	.footer-links {
		display: flex;
		gap: var(--space-2xl);
	}

	.footer-section h4 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-sm);
	}

	.footer-section a {
		display: block;
		color: var(--color-text);
		text-decoration: none;
		font-size: 0.875rem;
		padding: var(--space-xs) 0;
		transition: color var(--transition-fast);
	}

	.footer-section a:hover {
		color: #fbbf24;
		text-decoration: none;
	}

	.footer-section a:focus-visible {
		outline: 2px solid #f59e0b;
		outline-offset: 2px;
	}

	.external-icon {
		font-size: 0.75rem;
		opacity: 0.5;
	}

	.footer-bottom {
		padding-top: var(--space-lg);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.license-link {
		color: #fbbf24;
		text-decoration: none;
		font-weight: 600;
	}

	.license-link:hover {
		text-decoration: underline;
	}

	.footer-license-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.75rem;
		color: var(--color-text-subtle, rgba(255, 255, 255, 0.4));
		padding: var(--space-xs) 0;
	}

	.footer-license-badge i {
		color: rgba(245, 158, 11, 0.5);
		font-size: 0.625rem;
	}

	.footer-built-by {
		font-size: 0.75rem;
		color: var(--color-text-subtle, rgba(255, 255, 255, 0.4));
	}

	.footer-built-by a {
		color: #fbbf24;
		text-decoration: none;
		font-weight: 600;
	}

	.footer-built-by a:hover {
		text-decoration: underline;
	}

	.footer-version {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: rgba(245, 158, 11, 0.5);
	}

	@media (max-width: 768px) {
		.footer-content {
			flex-direction: column;
			gap: var(--space-xl);
		}

		.footer-links {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-lg);
		}

		.footer-bottom {
			flex-direction: column;
			gap: var(--space-sm);
			text-align: center;
		}

		.footer-brand {
			text-align: center;
			flex-direction: column;
			align-items: center;
		}

		.footer-tagline,
		.footer-mission {
			text-align: center;
		}
	}

	@media (max-width: 480px) {
		.footer-links {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.footer-section a {
			display: inline-block;
		}
	}
</style>
