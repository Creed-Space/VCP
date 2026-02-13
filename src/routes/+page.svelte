<script lang="ts">
	/**
	 * VCP Demo Landing Page
	 * 5 lean sections: Hero → Problem → Flow → Demo Cards → CTA
	 */
	import { HowItWorks } from '$lib/components/shared';
</script>

<svelte:head>
	<title>VCP - Context That Travels With You</title>
	<meta name="description" content="VCP is a protocol that lets your context — preferences, constraints, values, and current state — travel with you across every AI and service. Define it once, carry it everywhere." />
	<meta property="og:title" content="VCP - Context That Travels With You" />
	<meta property="og:description" content="Set your preferences once. Every AI and service adapts — in real time, across platforms, always current." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/vcp-logo.png" />
</svelte:head>

<div class="container">
	<!-- Section 1: Hero -->
	<section class="page-hero page-hero-landing">
		<p class="hero-eyebrow">Value Context Protocol</p>
		<h1>Context That Travels With You</h1>
		<p class="page-hero-subtitle">
			Set your preferences once. Every AI and service adapts &mdash;
			in real time, across platforms, always current.
		</p>
		<div class="hero-cta">
			<a href="/demos" class="btn btn-cta">
				<i class="fa-solid fa-play" aria-hidden="true"></i>
				See It In Action
			</a>
			<a href="/about" class="btn btn-secondary btn-lg">Learn How It Works</a>
		</div>
	</section>

	<!-- Section 2: Value Props -->
	<section class="problem-section">
		<h2 class="section-title">Set It Once. Carry It Everywhere.</h2>
		<div class="problem-row">
			<div class="problem-item">
				<span class="problem-icon"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i></span>
				<p>One profile, every platform &mdash; your preferences travel with you</p>
			</div>
			<div class="problem-item">
				<span class="problem-icon"><i class="fa-solid fa-bolt" aria-hidden="true"></i></span>
				<p>Your context stays current &mdash; change once, everything adapts</p>
			</div>
			<div class="problem-item">
				<span class="problem-icon"><i class="fa-solid fa-user-check" aria-hidden="true"></i></span>
				<p>AI that knows your situation &mdash; and responds accordingly</p>
			</div>
		</div>
	</section>

	<!-- Section 3: The Flow (reworked HowItWorks) -->
	<HowItWorks />

	<!-- Section 4: Demo Cards -->
	<section class="demo-selector">
		<h2 class="section-title">See It In Action</h2>
		<p class="section-description">
			Real scenarios showing how context shapes AI behavior — portable across platforms, live in the moment, enforced by hooks.
		</p>

		<div class="grid grid-3 gap-lg">
			<!-- Gentian — Portability -->
			<a href="/demos/gentian" class="card card-hover demo-card demo-card-personal">
				<div class="demo-badge-category"><span class="badge badge-primary">Consumer</span></div>
				<div class="demo-icon"><i class="fa-solid fa-guitar" aria-hidden="true"></i></div>
				<h3 class="demo-title">Gentian's Guitar Journey</h3>
				<p class="demo-scenario">Learning guitar across 4 different apps</p>
				<p class="demo-value">Set preferences once &mdash; every platform adapts instantly</p>
				<div class="demo-features">
					<span class="demo-feature"><i class="fa-solid fa-check" aria-hidden="true"></i> Cross-platform portability</span>
					<span class="demo-feature"><i class="fa-solid fa-check" aria-hidden="true"></i> Zero re-entry</span>
					<span class="demo-feature"><i class="fa-solid fa-check" aria-hidden="true"></i> Automatic adaptation</span>
				</div>
				<div class="demo-cta">
					<span class="btn btn-primary">Try This Demo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
				</div>
			</a>

			<!-- Campion — Adaptation -->
			<a href="/demos/campion" class="card card-hover demo-card demo-card-professional">
				<div class="demo-badge-category"><span class="badge badge-success">Enterprise</span></div>
				<div class="demo-icon"><i class="fa-solid fa-briefcase" aria-hidden="true"></i></div>
				<h3 class="demo-title">Campion's Corporate Training</h3>
				<p class="demo-scenario">Senior engineer with work and personal contexts</p>
				<p class="demo-value">Context switches automatically with your situation</p>
				<div class="demo-features">
					<span class="demo-feature"><i class="fa-solid fa-check" aria-hidden="true"></i> Dual profiles</span>
					<span class="demo-feature"><i class="fa-solid fa-check" aria-hidden="true"></i> Automatic switching</span>
					<span class="demo-feature"><i class="fa-solid fa-check" aria-hidden="true"></i> Full audit trail</span>
				</div>
				<div class="demo-cta">
					<span class="btn btn-primary">Try This Demo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
				</div>
			</a>

			<!-- Marta — Liveness -->
			<a href="/demos/marta" class="card card-hover demo-card demo-card-responsibility">
				<div class="demo-badge-category"><span class="badge badge-info">Values & Decisions</span></div>
				<div class="demo-icon"><i class="fa-solid fa-handshake-angle" aria-hidden="true"></i></div>
				<h3 class="demo-title">Marta's Responsibility Journey</h3>
				<p class="demo-scenario">Navigating family financial obligations with AI guidance</p>
				<p class="demo-value">Your values and real-time state shape AI guidance moment to moment</p>
				<div class="demo-features">
					<span class="demo-feature"><i class="fa-solid fa-check" aria-hidden="true"></i> Live LLM guidance</span>
					<span class="demo-feature"><i class="fa-solid fa-check" aria-hidden="true"></i> Value-aware adaptation</span>
					<span class="demo-feature"><i class="fa-solid fa-check" aria-hidden="true"></i> Real-time state</span>
				</div>
				<div class="demo-cta">
					<span class="btn btn-primary">Try This Demo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
				</div>
			</a>
		</div>

		<div class="more-demos">
			<a href="/demos" class="btn btn-ghost">
				<i class="fa-solid fa-grid-2" aria-hidden="true"></i>
				Explore All Demos
			</a>
		</div>
	</section>

	<!-- Section 5: CTA + Learn More -->
	<section class="playground-cta">
		<div class="playground-card card card-featured">
			<div class="playground-content">
				<div class="playground-icon"><i class="fa-solid fa-sliders" aria-hidden="true"></i></div>
				<div class="playground-text">
					<h3>Build Your Own Context Interaction</h3>
					<p>
						Create, inspect, and experiment with VCP tokens in real-time.
						Toggle constraints, change preferences, and watch the compact token update instantly.
					</p>
				</div>
			</div>
			<a href="/playground" class="btn btn-primary btn-lg">
				Open Playground <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
			</a>
		</div>
	</section>

	<section class="learn-more">
		<h2 class="section-title">Want to Understand the Details?</h2>
		<div class="learn-more-links">
			<a href="/about" class="learn-link">
				<i class="fa-solid fa-circle-info" aria-hidden="true"></i>
				<span>How VCP Works</span>
			</a>
			<a href="/docs" class="learn-link">
				<i class="fa-solid fa-book" aria-hidden="true"></i>
				<span>Technical Documentation</span>
			</a>
		</div>
	</section>
</div>

<style>
	/* Hero */
	.hero-eyebrow {
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--color-accent);
		margin-bottom: var(--space-lg);
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) var(--space-md);
		background: rgba(167, 139, 250, 0.1);
		border: 1px solid rgba(167, 139, 250, 0.2);
		border-radius: 100px;
	}

	.hero-cta {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		margin-top: var(--space-xl);
		flex-wrap: wrap;
	}

	/* Problem section */
	.problem-section {
		padding: var(--space-2xl) 0 var(--space-lg);
	}

	.problem-row {
		display: flex;
		justify-content: center;
		gap: var(--space-lg);
		margin-top: var(--space-xl);
	}

	.problem-item {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		max-width: 320px;
		padding: var(--space-md) var(--space-lg);
		background: rgba(30, 30, 48, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-lg);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
		transition: all var(--transition-normal);
	}

	.problem-item:hover {
		border-color: rgba(255, 255, 255, 0.12);
		background: rgba(30, 30, 48, 0.6);
		transform: translateY(-2px);
	}

	.problem-icon {
		font-size: 1.25rem;
		color: var(--color-accent);
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(167, 139, 250, 0.1);
		border-radius: var(--radius-md);
	}

	.problem-item p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: 1.5;
		margin: 0;
	}

	/* Demo cards */
	.demo-selector {
		margin-bottom: var(--space-2xl);
	}

	.demo-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: var(--color-text);
	}

	.demo-card:hover {
		text-decoration: none;
	}

	.demo-badge-category {
		margin-bottom: var(--space-sm);
	}

	.demo-card-professional {
		border-color: rgba(5, 150, 105, 0.3);
	}

	.demo-card-professional:hover {
		border-color: rgba(5, 150, 105, 0.6);
		box-shadow: 0 12px 40px rgba(5, 150, 105, 0.15), 0 0 30px rgba(5, 150, 105, 0.1);
	}

	.demo-card-personal {
		border-color: rgba(99, 102, 241, 0.3);
	}

	.demo-card-personal:hover {
		border-color: rgba(99, 102, 241, 0.6);
		box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15), 0 0 30px rgba(99, 102, 241, 0.1);
	}

	.demo-card-responsibility {
		border-color: rgba(59, 130, 246, 0.3);
	}

	.demo-card-responsibility:hover {
		border-color: rgba(59, 130, 246, 0.6);
		box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15), 0 0 30px rgba(59, 130, 246, 0.1);
	}

	.demo-card-responsibility .demo-icon {
		color: #3b82f6;
		background: rgba(59, 130, 246, 0.1);
	}

	:global(.badge-info) {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
	}

	.demo-icon {
		font-size: 2.5rem;
		margin-bottom: var(--space-md);
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
	}

	.demo-card-professional .demo-icon {
		color: var(--color-professional);
		background: rgba(5, 150, 105, 0.1);
	}

	.demo-card-personal .demo-icon {
		color: var(--color-primary);
		background: rgba(99, 102, 241, 0.1);
	}

	.demo-title {
		font-size: 1.25rem;
		margin-bottom: var(--space-sm);
	}

	.demo-scenario {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		margin-bottom: var(--space-xs);
		line-height: 1.5;
	}

	.demo-value {
		color: var(--color-primary);
		font-size: 0.8125rem;
		font-weight: 500;
		margin-bottom: var(--space-md);
		line-height: 1.4;
	}

	.demo-features {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs) var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.demo-feature {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.demo-feature i {
		color: var(--color-success);
		font-size: 0.625rem;
	}

	.demo-cta {
		margin-top: auto;
	}

	.more-demos {
		text-align: center;
		margin-top: var(--space-xl);
	}

	/* Playground CTA */
	.playground-cta {
		margin-bottom: var(--space-2xl);
	}

	.playground-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-xl);
	}

	.playground-content {
		display: flex;
		align-items: flex-start;
		gap: var(--space-lg);
	}

	.playground-icon {
		font-size: 2rem;
		color: var(--color-primary);
		flex-shrink: 0;
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(99, 102, 241, 0.1);
		border-radius: var(--radius-lg);
	}

	.playground-text h3 {
		margin-bottom: var(--space-sm);
	}

	.playground-text p {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	/* Learn More */
	.learn-more {
		padding: var(--space-xl) 0 var(--space-2xl);
		text-align: center;
	}

	.learn-more-links {
		display: flex;
		justify-content: center;
		gap: var(--space-lg);
		margin-top: var(--space-lg);
		flex-wrap: wrap;
	}

	.learn-link {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-xl);
		background: rgba(30, 30, 48, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: var(--radius-lg);
		color: var(--color-text);
		text-decoration: none;
		transition: all var(--transition-normal);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
	}

	.learn-link:hover {
		border-color: rgba(99, 102, 241, 0.4);
		color: var(--color-text);
		text-decoration: none;
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(99, 102, 241, 0.1);
	}

	.learn-link i {
		color: var(--color-primary);
		font-size: 1.25rem;
	}

	/* Responsive */
	@media (max-width: 900px) {
		:global(.grid-3) {
			grid-template-columns: 1fr;
		}

		.problem-row {
			flex-direction: column;
			align-items: center;
			gap: var(--space-md);
		}
	}

	@media (max-width: 768px) {
		.demo-icon {
			font-size: 2.5rem;
		}

		.demo-title {
			font-size: var(--text-lg);
		}

		.demo-scenario {
			font-size: 0.8125rem;
		}

		.demo-value {
			font-size: 0.75rem;
		}

		.demo-feature {
			font-size: 0.6875rem;
		}

		.playground-icon {
			font-size: 2rem;
		}

		.playground-text h3 {
			font-size: var(--text-lg);
		}

		.playground-text p {
			font-size: 0.875rem;
		}
	}

	@media (max-width: 640px) {
		.hero-eyebrow {
			font-size: 0.6875rem;
		}

		.page-hero-subtitle {
			font-size: var(--text-lg);
		}

		.problem-item {
			max-width: 100%;
		}

		.problem-icon {
			font-size: 1rem;
		}

		.problem-item p {
			font-size: 0.8125rem;
		}

		.hero-cta {
			flex-direction: column;
			align-items: stretch;
			gap: var(--space-md);
		}

		.hero-cta .btn {
			width: 100%;
			justify-content: center;
			padding: var(--space-md) var(--space-lg);
		}

		.playground-card {
			flex-direction: column;
			text-align: center;
			gap: var(--space-lg);
		}

		.playground-content {
			flex-direction: column;
			align-items: center;
		}

		.playground-icon {
			font-size: 1.5rem;
		}

		.playground-text {
			text-align: center;
		}

		.playground-text h3 {
			font-size: var(--text-base);
		}

		.playground-text p {
			font-size: 0.8125rem;
		}

		.learn-more-links {
			flex-direction: column;
			align-items: stretch;
			gap: var(--space-md);
		}

		.learn-link {
			padding: var(--space-md);
			font-size: 0.875rem;
		}

		.learn-link i {
			font-size: 1.25rem;
		}
	}
</style>
