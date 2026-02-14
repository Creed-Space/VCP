<script lang="ts">
	/**
	 * Design Prototype Page
	 * Showcases new design elements in context.
	 * Visit /design-prototype to preview.
	 */
	import {
		FloatingOrbs,
		ScrollReveal,
		GradientBorderCard,
		TokenFlow,
		TextReveal,
		GlowDivider,
		CountUp,
		CursorGlow,
		TypeWriter,
		SpotlightCard,
		ParticleField,
		MorphBlob,
		HowItWorks,
	} from '$lib/components/shared';
</script>

<svelte:head>
	<title>VCP Design Prototype</title>
</svelte:head>

<!-- Page-wide cursor glow effect -->
<CursorGlow radius={400} color="rgba(99, 102, 241, 0.06)" />

<div class="container">
	<!-- ============================================
	     SECTION 1: Enhanced Hero with TextReveal + FloatingOrbs
	     ============================================ -->
	<section class="page-hero page-hero-landing prototype-hero">
		<FloatingOrbs count={3} interactive={true} intensity={0.8} />
		<p class="hero-eyebrow">Value Context Protocol</p>
		<TextReveal
			text="Context That Travels With You"
			tag="h1"
			gradient={true}
			stagger={100}
			initialDelay={300}
		/>
		<p class="page-hero-subtitle animate-hero-subtitle">
			Set your preferences once. Every AI and service adapts &mdash;
			in real time, across platforms, always current.
		</p>
		<div class="hero-typewriter animate-hero-subtitle">
			<TypeWriter
				lines={[
					'preferences · constraints · values · state',
					'one token, every platform',
					'portable · live · personal',
					'context that travels with you',
				]}
				speed={40}
				pauseDuration={2500}
				mono={true}
			/>
		</div>
		<div class="hero-cta animate-hero-cta">
			<a href="/demos" class="btn btn-cta">
				<i class="fa-solid fa-play" aria-hidden="true"></i>
				See It In Action
			</a>
			<a href="/about" class="btn btn-secondary btn-lg">Learn How It Works</a>
		</div>
	</section>

	<GlowDivider />

	<!-- ============================================
	     SECTION 2: TokenFlow Visualization
	     Shows the core concept animated
	     ============================================ -->
	<ScrollReveal direction="up" delay={0}>
		<section class="token-flow-section">
			<ParticleField count={40} connectionDistance={100} />
			<h2 class="section-title">One Token. Every Platform.</h2>
			<p class="section-description">
				Your preferences, constraints, values, and current state — encoded once,
				understood everywhere.
			</p>
			<TokenFlow />
		</section>
	</ScrollReveal>

	<!-- ============================================
	     SECTION 2b: Stats bar with CountUp
	     ============================================ -->
	<ScrollReveal direction="up">
		<section class="stats-bar">
			<CountUp value={1} suffix=" token" label="Define once" />
			<div class="stats-divider" aria-hidden="true"></div>
			<CountUp value={6} suffix="+" label="Demos" />
			<div class="stats-divider" aria-hidden="true"></div>
			<CountUp value={4} label="Platforms" />
			<div class="stats-divider" aria-hidden="true"></div>
			<CountUp value={100} suffix="%" label="Portable" />
		</section>
	</ScrollReveal>

	<GlowDivider color="rgba(139, 92, 246, 0.5)" />

	<!-- ============================================
	     SECTION 3: Value Props with ScrollReveal stagger
	     ============================================ -->
	<section class="value-props">
		<ScrollReveal direction="up" delay={0}>
			<h2 class="section-title">Set It Once. Carry It Everywhere.</h2>
		</ScrollReveal>
		<div class="value-row">
			<ScrollReveal direction="up" delay={100}>
				<div class="value-item">
					<div class="value-icon-wrapper">
						<i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
					</div>
					<h3>Portable</h3>
					<p>One profile, every platform — your preferences travel with you</p>
				</div>
			</ScrollReveal>
			<ScrollReveal direction="up" delay={200}>
				<div class="value-item">
					<div class="value-icon-wrapper">
						<i class="fa-solid fa-bolt" aria-hidden="true"></i>
					</div>
					<h3>Live</h3>
					<p>Your context stays current — change once, everything adapts</p>
				</div>
			</ScrollReveal>
			<ScrollReveal direction="up" delay={300}>
				<div class="value-item">
					<div class="value-icon-wrapper">
						<i class="fa-solid fa-user-check" aria-hidden="true"></i>
					</div>
					<h3>Personal</h3>
					<p>AI that knows your situation — and responds accordingly</p>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- ============================================
	     SECTION 4: HowItWorks (existing, wrapped in ScrollReveal)
	     ============================================ -->
	<ScrollReveal direction="up">
		<HowItWorks />
	</ScrollReveal>

	<GlowDivider color="rgba(34, 197, 94, 0.4)" />

	<!-- ============================================
	     SECTION 5: Demo Cards with GradientBorderCard
	     ============================================ -->
	<section class="demos-section">
		<ScrollReveal direction="up">
			<h2 class="section-title">See It In Action</h2>
			<p class="section-description">
				Real scenarios showing how context shapes AI behavior.
			</p>
		</ScrollReveal>

		<div class="demo-grid">
			<ScrollReveal direction="left" delay={100}>
				<GradientBorderCard
					tag="a"
					href="/demos/gentian"
					colors={['#6366f1', '#818cf8', '#a78bfa', '#6366f1']}
					speed={6}
				>
					<div class="proto-demo-card">
						<div class="proto-demo-icon" style="--icon-color: #6366f1">
							<i class="fa-solid fa-guitar" aria-hidden="true"></i>
						</div>
						<span class="badge badge-primary">Consumer</span>
						<h3>Gentian's Guitar Journey</h3>
						<p class="text-muted">Learning guitar across 4 different apps</p>
						<p class="proto-demo-value">Set preferences once — every platform adapts</p>
						<span class="proto-demo-link">
							Try this demo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
						</span>
					</div>
				</GradientBorderCard>
			</ScrollReveal>

			<ScrollReveal direction="up" delay={200}>
				<GradientBorderCard
					tag="a"
					href="/demos/campion"
					colors={['#059669', '#10b981', '#34d399', '#059669']}
					speed={8}
				>
					<div class="proto-demo-card">
						<div class="proto-demo-icon" style="--icon-color: #059669">
							<i class="fa-solid fa-briefcase" aria-hidden="true"></i>
						</div>
						<span class="badge badge-success">Enterprise</span>
						<h3>Campion's Corporate Training</h3>
						<p class="text-muted">Senior engineer with work and personal contexts</p>
						<p class="proto-demo-value">Context switches automatically with your situation</p>
						<span class="proto-demo-link">
							Try this demo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
						</span>
					</div>
				</GradientBorderCard>
			</ScrollReveal>

			<ScrollReveal direction="right" delay={300}>
				<GradientBorderCard
					tag="a"
					href="/demos/marta"
					colors={['#3b82f6', '#60a5fa', '#93c5fd', '#3b82f6']}
					speed={7}
				>
					<div class="proto-demo-card">
						<div class="proto-demo-icon" style="--icon-color: #3b82f6">
							<i class="fa-solid fa-handshake-angle" aria-hidden="true"></i>
						</div>
						<span class="badge badge-info">Values & Decisions</span>
						<h3>Marta's Responsibility Journey</h3>
						<p class="text-muted">Navigating family obligations with AI guidance</p>
						<p class="proto-demo-value">Values and real-time state shape guidance</p>
						<span class="proto-demo-link">
							Try this demo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
						</span>
					</div>
				</GradientBorderCard>
			</ScrollReveal>
		</div>

		<div class="more-demos">
			<a href="/demos" class="btn btn-ghost">
				<i class="fa-solid fa-grid-2" aria-hidden="true"></i>
				Explore All Demos
			</a>
		</div>
	</section>

	<!-- ============================================
	     SECTION 6: CTA with GradientBorderCard
	     ============================================ -->
	<ScrollReveal direction="up">
		<GradientBorderCard
			colors={['#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#6366f1']}
			borderWidth={2}
			speed={5}
		>
			<div class="playground-cta-inner">
				<MorphBlob size={350} opacity={0.6} blur={50} />
				<FloatingOrbs count={2} interactive={false} intensity={0.4} />
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
		</GradientBorderCard>
	</ScrollReveal>

	<GlowDivider margin="2rem" />

	<!-- ============================================
	     SECTION 7: Learn More
	     ============================================ -->
	<section class="learn-more">
		<ScrollReveal direction="up">
			<h2 class="section-title">Want to Dig into the Details?</h2>
		</ScrollReveal>
		<div class="learn-more-links">
			<ScrollReveal direction="left" delay={100}>
				<SpotlightCard href="/about" color="rgba(167, 139, 250, 0.12)" radius={200}>
					<div class="spotlight-learn-inner">
						<i class="fa-solid fa-circle-info" aria-hidden="true"></i>
						<div>
							<strong>How VCP Works</strong>
							<p class="text-muted text-sm">The protocol, the stack, the vision</p>
						</div>
						<i class="fa-solid fa-arrow-right spotlight-arrow" aria-hidden="true"></i>
					</div>
				</SpotlightCard>
			</ScrollReveal>
			<ScrollReveal direction="right" delay={200}>
				<SpotlightCard href="/docs" color="rgba(99, 102, 241, 0.12)" radius={200}>
					<div class="spotlight-learn-inner">
						<i class="fa-solid fa-book" aria-hidden="true"></i>
						<div>
							<strong>Technical Documentation</strong>
							<p class="text-muted text-sm">API reference, token format, SDK</p>
						</div>
						<i class="fa-solid fa-arrow-right spotlight-arrow" aria-hidden="true"></i>
					</div>
				</SpotlightCard>
			</ScrollReveal>
		</div>
	</section>
</div>

<style>
	/* Hero enhancements */
	.prototype-hero {
		position: relative;
		overflow: visible;
	}

	.animate-hero-subtitle {
		animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s both;
	}

	.animate-hero-cta {
		animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.1s both;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
			filter: blur(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}

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
		animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
	}

	.hero-cta {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		margin-top: var(--space-xl);
		flex-wrap: wrap;
	}

	/* Stats Bar */
	.stats-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xl);
		padding: var(--space-xl) var(--space-lg);
		background: rgba(18, 18, 32, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-xl);
		backdrop-filter: blur(12px);
		margin: var(--space-xl) 0;
	}

	.stats-divider {
		width: 1px;
		height: 48px;
		background: linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.3), transparent);
	}

	@media (max-width: 640px) {
		.stats-bar {
			gap: var(--space-md);
			padding: var(--space-lg) var(--space-md);
		}

		.stats-divider {
			height: 36px;
		}
	}

	/* Typewriter in hero */
	.hero-typewriter {
		margin-top: var(--space-md);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		min-height: 1.5em;
	}

	/* Token Flow Section */
	.token-flow-section {
		padding: var(--space-xl) 0 var(--space-2xl);
		position: relative;
	}

	/* Value Props — enhanced from problem-section */
	.value-props {
		padding: var(--space-xl) 0;
	}

	.value-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
		margin-top: var(--space-xl);
	}

	.value-item {
		text-align: center;
		padding: var(--space-xl) var(--space-lg);
		background: rgba(18, 18, 32, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-lg);
		backdrop-filter: blur(8px);
		transition: all var(--transition-normal);
	}

	.value-item:hover {
		border-color: rgba(255, 255, 255, 0.12);
		background: rgba(18, 18, 32, 0.6);
		transform: translateY(-4px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(99, 102, 241, 0.08);
	}

	.value-icon-wrapper {
		width: 56px;
		height: 56px;
		margin: 0 auto var(--space-md);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: var(--color-accent);
		background: rgba(167, 139, 250, 0.1);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(167, 139, 250, 0.15);
		transition: all var(--transition-normal);
	}

	.value-item:hover .value-icon-wrapper {
		background: rgba(167, 139, 250, 0.2);
		border-color: rgba(167, 139, 250, 0.3);
		transform: scale(1.1);
	}

	.value-item h3 {
		font-size: var(--text-lg);
		margin-bottom: var(--space-sm);
		font-weight: 600;
	}

	.value-item p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
	}

	/* Demo grid */
	.demos-section {
		margin-bottom: var(--space-2xl);
	}

	.demo-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.proto-demo-card {
		display: flex;
		flex-direction: column;
	}

	.proto-demo-icon {
		font-size: 2rem;
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-md);
		color: var(--icon-color);
		background: color-mix(in srgb, var(--icon-color) 10%, transparent);
	}

	.proto-demo-card .badge {
		align-self: flex-start;
		margin-bottom: var(--space-sm);
	}

	.proto-demo-card h3 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-sm);
	}

	.proto-demo-value {
		color: var(--color-primary);
		font-size: var(--text-sm);
		font-weight: 500;
		margin-bottom: var(--space-lg);
	}

	.proto-demo-link {
		margin-top: auto;
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		color: var(--color-primary-hover);
		font-weight: 500;
		font-size: var(--text-sm);
		transition: gap var(--transition-fast);
	}

	.proto-demo-card:hover .proto-demo-link {
		gap: var(--space-md);
	}

	:global(.badge-info) {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
	}

	.more-demos {
		text-align: center;
		margin-top: var(--space-xl);
	}

	/* Playground CTA */
	.playground-cta-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-xl);
		position: relative;
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

	/* SpotlightCard learn links */
	.spotlight-learn-inner {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.spotlight-learn-inner > i:first-child {
		font-size: 1.5rem;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.spotlight-learn-inner div {
		flex: 1;
		text-align: left;
	}

	.spotlight-learn-inner strong {
		display: block;
		margin-bottom: 2px;
	}

	.spotlight-arrow {
		color: var(--color-text-subtle);
		font-size: 0.875rem;
		transition: transform 0.2s ease, color 0.2s ease;
	}

	:global(.spotlight-card:hover) .spotlight-arrow {
		transform: translateX(4px);
		color: var(--color-primary);
	}

	/* Responsive */
	@media (max-width: 900px) {
		.demo-grid {
			grid-template-columns: 1fr;
		}

		.value-row {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.hero-eyebrow {
			font-size: 0.6875rem;
		}

		.hero-cta {
			flex-direction: column;
			align-items: stretch;
		}

		.hero-cta .btn {
			width: 100%;
			justify-content: center;
		}

		.playground-cta-inner {
			flex-direction: column;
			text-align: center;
		}

		.playground-content {
			flex-direction: column;
			align-items: center;
		}

		.learn-more-links {
			flex-direction: column;
			align-items: stretch;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.animate-hero-subtitle,
		.animate-hero-cta,
		.hero-eyebrow {
			animation: none;
			opacity: 1;
		}
	}
</style>
