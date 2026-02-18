<script lang="ts">
	/**
	 * VCP Demo Landing Page
	 * 9 sections: Hero → Value Props → Flow → 3 Layers → Comparison → Demos → Stacked → Wave CTA → Learn More
	 */
	import { HowItWorks, FloatingOrbs, ScrollReveal, TokenFlow, GlowDivider, TypeWriter, ParticleField } from '$lib/components/shared';
</script>

<svelte:head>
	<title>VCP - Context That Travels With You | Value Context Protocol</title>
	<meta name="description" content="VCP is an open protocol that lets your context — preferences, constraints, values, and state — travel with you across every AI and service. Define it once, carry it everywhere." />
	<link rel="canonical" href="https://valuecontextprotocol.org/" />
	<meta property="og:title" content="VCP - Context That Travels With You" />
	<meta property="og:description" content="Set your preferences once. Every AI and service adapts — in real time, across platforms, always current." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://valuecontextprotocol.org/" />
	<meta property="og:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
	<meta property="og:site_name" content="Value Context Protocol" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="VCP - Context That Travels With You" />
	<meta name="twitter:description" content="Set your preferences once. Every AI and service adapts — in real time, across platforms, always current." />
	<meta name="twitter:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
</svelte:head>

<div class="landing">
	<!-- ======== Section 1: Aurora Hero ======== -->
	<section class="aurora-hero">
		<FloatingOrbs count={3} intensity={0.4} />
		<div class="container aurora-content">
			<p class="hero-eyebrow">Open Standard</p>
			<h1 class="hero-heading">Context That <span class="highlight">Travels</span> With You</h1>
			<p class="aurora-subtitle animate-hero-subtitle">
				Set your preferences once. Every AI and service adapts &mdash;
				in real time, across platforms, always current.
			</p>
			<p class="hero-typewriter animate-hero-subtitle">
				<TypeWriter
					lines={[
						'preferences · constraints · values · state',
						'one token, every platform',
						'portable · live · personal',
					]}
					speed={40}
					pauseDuration={2500}
					mono={true}
				/>
			</p>
			<div class="hero-cta animate-hero-cta">
				<a href="/demos" class="btn-aurora-primary">
					<span class="btn-shine"></span>
					<i class="fa-solid fa-play" aria-hidden="true"></i>
					See It In Action
				</a>
				<a href="/about" class="btn-aurora-secondary">
					Learn How It Works
					<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
				</a>
			</div>
		</div>
	</section>

	<!-- ======== Section 2: Value Props ======== -->
	<section class="problem-section">
		<ScrollReveal>
			<h2 class="section-title">Set It Once. Carry It Everywhere.</h2>
		</ScrollReveal>
		<div class="problem-row">
			<ScrollReveal delay={0}>
				<div class="problem-item">
					<span class="problem-icon"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i></span>
					<p>One profile, every platform &mdash; your preferences travel with you</p>
				</div>
			</ScrollReveal>
			<ScrollReveal delay={100}>
				<div class="problem-item">
					<span class="problem-icon"><i class="fa-solid fa-bolt" aria-hidden="true"></i></span>
					<p>Your context stays current &mdash; change once, everything adapts</p>
				</div>
			</ScrollReveal>
			<ScrollReveal delay={200}>
				<div class="problem-item">
					<span class="problem-icon"><i class="fa-solid fa-user-check" aria-hidden="true"></i></span>
					<p>AI that knows your situation &mdash; and responds accordingly</p>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<GlowDivider />

	<!-- ======== Section 3: How It Works ======== -->
	<HowItWorks />

	<!-- ======== Section 3b: Token Flow Visualization ======== -->
	<section class="token-flow-section">
		<ParticleField count={35} connectionDistance={100} />
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">One Token. Every Platform.</h2>
				<p class="section-description">
					Your preferences, constraints, values, and state &mdash; encoded once, understood everywhere.
				</p>
			</ScrollReveal>
			<ScrollReveal delay={100}>
				<TokenFlow />
			</ScrollReveal>
		</div>
	</section>

	<GlowDivider color="rgba(139, 92, 246, 0.5)" />

	<!-- ======== Section 4: 3 Powerful Layers ======== -->
	<section class="layers-section">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">3 Powerful Layers</h2>
			</ScrollReveal>
			<ScrollReveal delay={60}>
				<p class="section-description">Every VCP token carries three layers of context, each serving a distinct purpose.</p>
			</ScrollReveal>

			<div class="prismatic-grid">
				<ScrollReveal delay={0}>
					<div class="prismatic-card" style="--card-hue: 245;">
						<div class="prismatic-border"></div>
						<div class="prismatic-inner">
							<div class="prismatic-icon">
								<i class="fa-solid fa-scroll" aria-hidden="true"></i>
							</div>
							<h3>Constitutional</h3>
							<p>Rules, boundaries, and constitutions that govern AI behavior. Hard constraints set by you that AI platforms should respect.</p>
							<div class="prismatic-tags">
								<span class="ptag">Rules</span>
								<span class="ptag">Boundaries</span>
								<span class="ptag">Constitutions</span>
							</div>
						</div>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={120}>
					<div class="prismatic-card" style="--card-hue: 160;">
						<div class="prismatic-border"></div>
						<div class="prismatic-inner">
							<div class="prismatic-icon">
								<i class="fa-solid fa-compass" aria-hidden="true"></i>
							</div>
							<h3>Situational</h3>
							<p>Your current role, environment, and platform context. Are you at work or home? Learning or creating? Context switches accordingly.</p>
							<div class="prismatic-tags">
								<span class="ptag">Role</span>
								<span class="ptag">Environment</span>
								<span class="ptag">Platform</span>
							</div>
						</div>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={240}>
					<div class="prismatic-card" style="--card-hue: 30;">
						<div class="prismatic-border"></div>
						<div class="prismatic-inner">
							<div class="prismatic-icon">
								<i class="fa-solid fa-heart-pulse" aria-hidden="true"></i>
							</div>
							<h3>Personal</h3>
							<p>Your preferences, mood, energy, and state right now. A living snapshot of who you are in this moment &mdash; updated in real time.</p>
							<div class="prismatic-tags">
								<span class="ptag">Preferences</span>
								<span class="ptag">State</span>
								<span class="ptag">Mood</span>
							</div>
						</div>
					</div>
				</ScrollReveal>
			</div>
		</div>
	</section>

	<GlowDivider color="rgba(34, 197, 94, 0.4)" />

	<!-- ======== Section 5: Before/After Comparison ======== -->
	<section class="comparison-section">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">A Better Way</h2>
			</ScrollReveal>

			<div class="comparison-grid">
				<ScrollReveal delay={0}>
					<div class="comparison-card comparison-before">
						<div class="comparison-header">
							<span class="comparison-badge comparison-badge-old">Without VCP</span>
						</div>
						<ul class="comparison-list">
							<li>
								<i class="fa-solid fa-xmark" aria-hidden="true"></i>
								Re-enter preferences on every platform
							</li>
							<li>
								<i class="fa-solid fa-xmark" aria-hidden="true"></i>
								AI doesn't know your current state
							</li>
							<li>
								<i class="fa-solid fa-xmark" aria-hidden="true"></i>
								No control over your data in transit
							</li>
							<li>
								<i class="fa-solid fa-xmark" aria-hidden="true"></i>
								Static profiles that don't reflect you
							</li>
						</ul>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={100} direction="fade">
					<div class="comparison-arrow">
						<div class="arrow-line"></div>
						<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={200}>
					<div class="comparison-card comparison-after">
						<div class="comparison-header">
							<span class="comparison-badge comparison-badge-new">With VCP</span>
						</div>
						<ul class="comparison-list">
							<li>
								<i class="fa-solid fa-check" aria-hidden="true"></i>
								Set once, carry everywhere
							</li>
							<li>
								<i class="fa-solid fa-check" aria-hidden="true"></i>
								Real-time state awareness
							</li>
							<li>
								<i class="fa-solid fa-check" aria-hidden="true"></i>
								Privacy-first, user-controlled
							</li>
							<li>
								<i class="fa-solid fa-check" aria-hidden="true"></i>
								Living context that evolves with you
							</li>
						</ul>
					</div>
				</ScrollReveal>
			</div>
		</div>
	</section>

	<GlowDivider color="rgba(99, 102, 241, 0.4)" />

	<!-- ======== Section 6: Demo Showcase Cards ======== -->
	<section class="showcase-section">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">See It In Action</h2>
			</ScrollReveal>
			<ScrollReveal delay={60}>
				<p class="section-description">Real scenarios. Real context. Real adaptation.</p>
			</ScrollReveal>

			<div class="showcase-grid">
				<ScrollReveal delay={0}>
					<a href="/demos/gentian" class="showcase-card" style="--accent: 99, 102, 241;">
						<div class="showcase-bg"></div>
						<div class="showcase-content">
							<div class="showcase-number">01</div>
							<div class="showcase-icon-wrap">
								<i class="fa-solid fa-guitar" aria-hidden="true"></i>
							</div>
							<h3>Gentian's Guitar Journey</h3>
							<p>Learning guitar across 4 platforms with one persistent profile.</p>
							<span class="showcase-tag">Portability</span>
						</div>
						<div class="showcase-footer">
							<span>Try Demo</span>
							<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
						</div>
					</a>
				</ScrollReveal>

				<ScrollReveal delay={120}>
					<a href="/demos/campion" class="showcase-card" style="--accent: 5, 150, 105;">
						<div class="showcase-bg"></div>
						<div class="showcase-content">
							<div class="showcase-number">02</div>
							<div class="showcase-icon-wrap">
								<i class="fa-solid fa-briefcase" aria-hidden="true"></i>
							</div>
							<h3>Campion's Corporate Training</h3>
							<p>Dual profiles that switch automatically with your role.</p>
							<span class="showcase-tag">Adaptation</span>
						</div>
						<div class="showcase-footer">
							<span>Try Demo</span>
							<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
						</div>
					</a>
				</ScrollReveal>

				<ScrollReveal delay={240}>
					<a href="/demos/marta" class="showcase-card" style="--accent: 59, 130, 246;">
						<div class="showcase-bg"></div>
						<div class="showcase-content">
							<div class="showcase-number">03</div>
							<div class="showcase-icon-wrap">
								<i class="fa-solid fa-handshake-angle" aria-hidden="true"></i>
							</div>
							<h3>Marta's Responsibility Journey</h3>
							<p>Values and real-time state shaping AI guidance moment to moment.</p>
							<span class="showcase-tag">Liveness</span>
						</div>
						<div class="showcase-footer">
							<span>Try Demo</span>
							<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
						</div>
					</a>
				</ScrollReveal>
			</div>

			<div class="more-demos">
				<a href="/demos" class="btn btn-ghost">
					<i class="fa-solid fa-grid-2" aria-hidden="true"></i>
					Explore All Demos
				</a>
			</div>
		</div>
	</section>

	<!-- ======== Section 7: Stacked Feature Rows ======== -->
	<section class="stacked-section">
		<div class="container">
			<ScrollReveal>
				<div class="stacked-row">
					<div class="stacked-visual">
						<div class="code-window">
							<div class="code-titlebar">
								<span class="code-dot code-dot-red"></span>
								<span class="code-dot code-dot-yellow"></span>
								<span class="code-dot code-dot-green"></span>
								<span class="code-title">token.vcp</span>
							</div>
							<pre class="code-content"><code><span class="token-v">v3</span>|<span class="token-u">usr:gentian</span>|<span class="token-k">key:abc123</span>
<span class="token-c">con:guitar-learning</span>
<span class="token-p">per:visual-learner</span>
<span class="token-g">goal:fingerpicking</span>
<span class="token-f">flags:dyslexia-friendly</span>
<span class="token-pr">priv:medical=none</span></code></pre>
						</div>
					</div>
					<div class="stacked-text">
						<span class="stacked-eyebrow">Compact Encoding</span>
						<h3>Tiny Tokens, Rich Context</h3>
						<p>
							VCP tokens pack your entire context into a compact, portable format.
							Preferences, constraints, current state &mdash; all traveling in a few hundred bytes.
						</p>
						<ul class="stacked-features">
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Human-readable format</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Privacy-preserving layers</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Real-time updates</li>
						</ul>
					</div>
				</div>
			</ScrollReveal>

			<ScrollReveal>
				<div class="stacked-row stacked-row-reverse">
					<div class="stacked-visual">
						<div class="platform-mosaic">
							<div class="mosaic-tile mosaic-tile-1">
								<i class="fa-solid fa-graduation-cap" aria-hidden="true"></i>
								<span>Learning</span>
							</div>
							<div class="mosaic-tile mosaic-tile-2">
								<i class="fa-solid fa-briefcase" aria-hidden="true"></i>
								<span>Work</span>
							</div>
							<div class="mosaic-tile mosaic-tile-3">
								<i class="fa-solid fa-heart-pulse" aria-hidden="true"></i>
								<span>Health</span>
							</div>
							<div class="mosaic-tile mosaic-tile-4">
								<i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
								<span>Shopping</span>
							</div>
							<div class="mosaic-center">
								<i class="fa-solid fa-user" aria-hidden="true"></i>
								<span>You</span>
							</div>
						</div>
					</div>
					<div class="stacked-text">
						<span class="stacked-eyebrow">Cross-Platform</span>
						<h3>One You, Every Service</h3>
						<p>
							Your context follows you across every AI and service.
							No more re-entering preferences, re-explaining constraints, or starting from scratch.
						</p>
						<ul class="stacked-features">
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Zero re-entry</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Automatic adaptation</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Platform-agnostic</li>
						</ul>
					</div>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- ======== Section 8: Wave CTA ======== -->
	<section class="wave-cta-section">
		<svg class="wave-top" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
			<path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,45 1440,60 L1440,0 L0,0 Z" />
		</svg>
		<div class="container wave-content">
			<ScrollReveal>
				<div class="cta-block">
					<div class="cta-icon-ring">
						<i class="fa-solid fa-sliders" aria-hidden="true"></i>
					</div>
					<h3>Build Your Own Context</h3>
					<p>
						Create, inspect, and experiment with VCP tokens in real-time.
						Toggle constraints, change preferences, and watch the compact token update instantly.
					</p>
					<a href="/playground" class="btn-aurora-primary btn-lg">
						<span class="btn-shine"></span>
						Open Playground
						<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
					</a>
				</div>
			</ScrollReveal>
		</div>
		<svg class="wave-bottom" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
			<path d="M0,60 C360,0 720,120 1080,60 C1260,30 1380,75 1440,60 L1440,120 L0,120 Z" />
		</svg>
	</section>

	<!-- ======== Section 9: Learn More ======== -->
	<section class="learn-more">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">Want to Understand the Details?</h2>
			</ScrollReveal>
			<ScrollReveal delay={100}>
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
			</ScrollReveal>
		</div>
	</section>
</div>

<style>
	.landing {
		overflow-x: hidden;
	}

	/* =============================================
	   Section 1: Aurora Hero
	   ============================================= */

	.aurora-hero {
		position: relative;
		min-height: 85vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.aurora-content {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: var(--space-2xl) var(--space-lg);
	}

	.hero-heading {
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-bottom: var(--space-lg);
		animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
	}

	.hero-heading .highlight {
		background: linear-gradient(135deg, #a78bfa, #8b5cf6);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.aurora-subtitle {
		font-size: var(--text-xl);
		color: var(--color-text-muted);
		max-width: 640px;
		margin: 0 auto var(--space-xl);
		line-height: var(--leading-relaxed);
	}

	.hero-cta {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Aurora buttons */
	.btn-aurora-primary {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 14px 28px;
		background: linear-gradient(135deg, #6366f1, #8b5cf6);
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: 600;
		cursor: pointer;
		overflow: hidden;
		text-decoration: none;
		transition: all var(--transition-normal);
		box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35),
					0 0 40px rgba(99, 102, 241, 0.1);
	}

	.btn-aurora-primary:hover {
		transform: translateY(-2px);
		color: white;
		text-decoration: none;
		box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5),
					0 0 60px rgba(99, 102, 241, 0.15);
	}

	.btn-aurora-primary.btn-lg {
		padding: 16px 36px;
		font-size: var(--text-lg);
	}

	.btn-shine {
		position: absolute;
		inset: 0;
		background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 50%, transparent 55%);
		transform: translateX(-100%);
		transition: none;
	}

	.btn-aurora-primary:hover .btn-shine {
		transform: translateX(100%);
		transition: transform 0.6s ease;
	}

	.btn-aurora-secondary {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 14px 28px;
		background: rgba(255, 255, 255, 0.04);
		color: var(--color-text);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
		transition: all var(--transition-normal);
	}

	.btn-aurora-secondary:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
		color: var(--color-text);
		text-decoration: none;
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

	/* Hero typewriter */
	.hero-typewriter {
		margin-top: var(--space-sm);
		margin-bottom: var(--space-xl);
		font-size: var(--text-sm);
		color: var(--color-text-subtle);
		min-height: 1.5em;
		text-align: center;
	}

	/* Token Flow Section */
	.token-flow-section {
		position: relative;
		padding: var(--space-xl) 0 var(--space-2xl);
	}

	/* =============================================
	   Section 2: Value Props
	   ============================================= */

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
		background: rgba(18, 18, 32, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-lg);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
		transition: all var(--transition-normal);
	}

	.problem-item:hover {
		border-color: rgba(255, 255, 255, 0.12);
		background: rgba(18, 18, 32, 0.6);
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

	/* =============================================
	   Section 4: 3 Powerful Layers (Prismatic Cards)
	   ============================================= */

	.layers-section {
		padding: var(--space-2xl) 0;
	}

	.prismatic-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
		margin-top: var(--space-xl);
	}

	.prismatic-card {
		position: relative;
		border-radius: var(--radius-xl);
		padding: 1px;
		background: rgba(255, 255, 255, 0.06);
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.prismatic-card:hover {
		transform: translateY(-4px);
	}

	.prismatic-border {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-xl);
		padding: 1px;
		background: linear-gradient(
			135deg,
			hsla(var(--card-hue), 80%, 65%, 0.4),
			hsla(calc(var(--card-hue) + 40), 70%, 60%, 0.2),
			transparent 60%
		);
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.prismatic-card:hover .prismatic-border {
		opacity: 1;
	}

	.prismatic-inner {
		background: rgba(18, 18, 32, 0.8);
		border-radius: var(--radius-xl);
		padding: var(--space-xl);
		-webkit-backdrop-filter: blur(20px);
		backdrop-filter: blur(20px);
		height: 100%;
	}

	.prismatic-icon {
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		background: hsla(var(--card-hue), 70%, 60%, 0.1);
		color: hsla(var(--card-hue), 80%, 70%, 1);
		font-size: 1.5rem;
		margin-bottom: var(--space-lg);
		transition: all 0.3s ease;
	}

	.prismatic-card:hover .prismatic-icon {
		transform: scale(1.08);
		box-shadow: 0 0 20px hsla(var(--card-hue), 70%, 60%, 0.2);
	}

	.prismatic-inner h3 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-sm);
		font-weight: 700;
	}

	.prismatic-inner p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-lg);
	}

	.prismatic-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	.ptag {
		font-size: 0.6875rem;
		padding: 3px 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 100px;
		color: var(--color-text-subtle);
	}

	/* =============================================
	   Section 5: Comparison
	   ============================================= */

	.comparison-section {
		padding: var(--space-2xl) 0;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: var(--space-lg);
		align-items: center;
		max-width: 900px;
		margin: var(--space-xl) auto 0;
	}

	.comparison-card {
		padding: var(--space-xl);
		border-radius: var(--radius-xl);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(18, 18, 32, 0.6);
		-webkit-backdrop-filter: blur(16px);
		backdrop-filter: blur(16px);
	}

	.comparison-before {
		border-color: rgba(239, 68, 68, 0.15);
	}

	.comparison-after {
		border-color: rgba(34, 197, 94, 0.15);
		background: rgba(34, 197, 94, 0.02);
	}

	.comparison-header {
		margin-bottom: var(--space-lg);
	}

	.comparison-badge {
		font-size: var(--text-xs);
		font-weight: 600;
		padding: 4px 12px;
		border-radius: 100px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.comparison-badge-old {
		background: rgba(239, 68, 68, 0.1);
		color: #f87171;
	}

	.comparison-badge-new {
		background: rgba(34, 197, 94, 0.1);
		color: #4ade80;
	}

	.comparison-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.comparison-list li {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.comparison-before .comparison-list li i {
		color: #f87171;
		margin-top: 3px;
		flex-shrink: 0;
	}

	.comparison-after .comparison-list li i {
		color: #4ade80;
		margin-top: 3px;
		flex-shrink: 0;
	}

	.comparison-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
		color: var(--color-primary);
		font-size: 1.25rem;
	}

	.arrow-line {
		width: 1px;
		height: 40px;
		background: linear-gradient(to bottom, transparent, var(--color-primary));
	}

	/* =============================================
	   Section 6: Showcase Demo Cards
	   ============================================= */

	.showcase-section {
		padding: var(--space-2xl) 0;
	}

	.showcase-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
		margin-top: var(--space-xl);
	}

	.showcase-card {
		position: relative;
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-xl);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(18, 18, 32, 0.6);
		overflow: hidden;
		text-decoration: none;
		color: var(--color-text);
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.showcase-card:hover {
		transform: translateY(-6px);
		border-color: rgba(var(--accent), 0.3);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
					0 0 40px rgba(var(--accent), 0.08);
		text-decoration: none;
		color: var(--color-text);
	}

	.showcase-bg {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at top right, rgba(var(--accent), 0.06), transparent 60%);
		pointer-events: none;
	}

	.showcase-content {
		position: relative;
		padding: var(--space-xl);
		flex: 1;
	}

	.showcase-number {
		font-size: 3rem;
		font-weight: 900;
		color: rgba(255, 255, 255, 0.04);
		position: absolute;
		top: var(--space-md);
		right: var(--space-lg);
		line-height: 1;
		font-family: var(--font-mono);
	}

	.showcase-icon-wrap {
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		background: rgba(var(--accent), 0.1);
		color: rgba(var(--accent), 1);
		font-size: 1.5rem;
		margin-bottom: var(--space-lg);
	}

	.showcase-card h3 {
		font-size: var(--text-xl);
		font-weight: 700;
		margin-bottom: var(--space-sm);
	}

	.showcase-card p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-md);
	}

	.showcase-tag {
		display: inline-block;
		font-size: 0.6875rem;
		padding: 3px 10px;
		background: rgba(var(--accent), 0.08);
		border: 1px solid rgba(var(--accent), 0.15);
		border-radius: 100px;
		color: rgba(var(--accent), 1);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 500;
	}

	.showcase-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-md) var(--space-xl);
		border-top: 1px solid rgba(255, 255, 255, 0.04);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-muted);
		transition: color var(--transition-fast);
	}

	.showcase-card:hover .showcase-footer {
		color: var(--color-text);
	}

	.showcase-footer i {
		transition: transform var(--transition-normal);
	}

	.showcase-card:hover .showcase-footer i {
		transform: translateX(4px);
	}

	.more-demos {
		text-align: center;
		margin-top: var(--space-xl);
	}

	/* =============================================
	   Section 7: Stacked Feature Rows
	   ============================================= */

	.stacked-section {
		padding: var(--space-2xl) 0;
	}

	.stacked-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2xl);
		align-items: center;
		margin-bottom: var(--space-2xl);
	}

	.stacked-row-reverse {
		direction: rtl;
	}

	.stacked-row-reverse > * {
		direction: ltr;
	}

	.stacked-eyebrow {
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-primary);
		font-weight: 600;
		margin-bottom: var(--space-sm);
		display: block;
	}

	.stacked-text h3 {
		font-size: var(--text-2xl);
		font-weight: 700;
		margin-bottom: var(--space-md);
	}

	.stacked-text p {
		color: var(--color-text-muted);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-lg);
	}

	.stacked-features {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.stacked-features li {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.stacked-features li i {
		color: var(--color-success);
		font-size: 0.875rem;
	}

	/* Code window */
	.code-window {
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(12, 12, 24, 0.8);
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
	}

	.code-titlebar {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 14px;
		background: rgba(255, 255, 255, 0.03);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.code-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.code-dot-red { background: #ff5f56; }
	.code-dot-yellow { background: #ffbd2e; }
	.code-dot-green { background: #27c93f; }

	.code-title {
		margin-left: auto;
		font-size: 0.6875rem;
		color: var(--color-text-subtle);
		font-family: var(--font-mono);
	}

	.code-content {
		padding: var(--space-lg);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1.8;
		overflow-x: auto;
	}

	.code-content code {
		background: none;
	}

	.token-v { color: var(--token-color-version); }
	.token-u { color: var(--token-color-user); }
	.token-k { color: var(--token-color-key); }
	.token-c { color: var(--token-color-constitution); }
	.token-p { color: var(--token-color-persona); }
	.token-g { color: var(--token-color-goal); }
	.token-f { color: var(--token-color-flags); }
	.token-pr { color: var(--token-color-private); }

	/* Platform mosaic */
	.platform-mosaic {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		max-width: 360px;
		margin: 0 auto;
	}

	.mosaic-tile {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);
		width: 120px;
		height: 120px;
		border-radius: var(--radius-xl);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(18, 18, 32, 0.7);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		transition: all 0.3s ease;
	}

	.mosaic-tile:hover {
		transform: scale(1.05);
		border-color: rgba(99, 102, 241, 0.3);
	}

	.mosaic-tile i {
		font-size: 1.5rem;
	}

	.mosaic-tile-1 {
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	.mosaic-tile-1 i { color: var(--color-primary); }

	.mosaic-tile-2 {
		top: 50%;
		right: 0;
		transform: translateY(-50%);
	}
	.mosaic-tile-2 i { color: var(--color-professional); }

	.mosaic-tile-3 {
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	.mosaic-tile-3 i { color: var(--color-danger); }

	.mosaic-tile-4 {
		top: 50%;
		left: 0;
		transform: translateY(-50%);
	}
	.mosaic-tile-4 i { color: var(--color-warning); }

	.mosaic-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80px;
		height: 80px;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1));
		border: 1px solid rgba(99, 102, 241, 0.3);
		color: var(--color-accent);
		font-size: 0.75rem;
		font-weight: 600;
		box-shadow: 0 0 40px rgba(99, 102, 241, 0.2);
	}

	.mosaic-center i {
		font-size: 1.25rem;
	}

	/* =============================================
	   Section 8: Wave CTA
	   ============================================= */

	.wave-cta-section {
		position: relative;
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.04));
		padding: 0;
		margin: var(--space-2xl) 0;
	}

	.wave-top,
	.wave-bottom {
		display: block;
		width: 100%;
		height: 80px;
	}

	.wave-top {
		margin-bottom: -1px;
	}

	.wave-bottom {
		margin-top: -1px;
	}

	.wave-top path,
	.wave-bottom path {
		fill: var(--color-bg);
	}

	.wave-content {
		padding: var(--space-2xl) var(--space-lg);
		text-align: center;
	}

	.cta-block {
		max-width: 560px;
		margin: 0 auto;
	}

	.cta-icon-ring {
		width: 72px;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1));
		border: 1px solid rgba(99, 102, 241, 0.2);
		color: var(--color-primary);
		font-size: 1.75rem;
		margin: 0 auto var(--space-lg);
		box-shadow: 0 0 40px rgba(99, 102, 241, 0.15);
	}

	.cta-block h3 {
		font-size: var(--text-3xl);
		font-weight: 700;
		margin-bottom: var(--space-sm);
	}

	.cta-block p {
		color: var(--color-text-muted);
		margin-bottom: var(--space-xl);
	}

	/* =============================================
	   Section 9: Learn More
	   ============================================= */

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
		background: rgba(18, 18, 32, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.06);
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

	/* =============================================
	   Responsive
	   ============================================= */

	@media (max-width: 900px) {
		.prismatic-grid,
		.showcase-grid {
			grid-template-columns: 1fr;
			max-width: 480px;
			margin-left: auto;
			margin-right: auto;
		}

		.comparison-grid {
			grid-template-columns: 1fr;
			max-width: 480px;
			margin-left: auto;
			margin-right: auto;
		}

		.comparison-arrow {
			transform: rotate(90deg);
			margin: var(--space-md) auto;
		}

		.stacked-row,
		.stacked-row-reverse {
			grid-template-columns: 1fr;
			direction: ltr;
		}

		.problem-row {
			flex-direction: column;
			align-items: center;
			gap: var(--space-md);
		}
	}

	@media (max-width: 640px) {
		.hero-heading {
			font-size: 2rem;
		}

		.aurora-subtitle {
			font-size: var(--text-base);
		}

		.hero-cta {
			flex-direction: column;
			align-items: stretch;
		}

		.hero-cta a {
			justify-content: center;
		}

		.problem-item {
			max-width: 100%;
		}

		.platform-mosaic {
			max-width: 280px;
		}

		.mosaic-tile {
			width: 90px;
			height: 90px;
			font-size: 0.6875rem;
		}

		.mosaic-tile i {
			font-size: 1.25rem;
		}

		.mosaic-center {
			width: 64px;
			height: 64px;
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

		/* Section spacing reduction */
		.problem-section,
		.layers-section,
		.comparison-section,
		.showcase-section,
		.stacked-section,
		.learn-more {
			padding: var(--space-xl) 0;
		}

		.section-title { font-size: 1.5rem; }
		.section-description { font-size: var(--text-sm); }

		/* Code blocks: tighter on mobile */
		.code-content {
			font-size: 0.75rem;
			padding: var(--space-md);
		}

		/* Wave SVG: reduce height */
		.wave-top, .wave-bottom { height: 40px; }

		/* Stacked section text */
		.stacked-text h3 { font-size: var(--text-xl); }

		/* CTA block */
		.cta-block h3 { font-size: var(--text-xl); }
		.cta-icon-ring { width: 56px; height: 56px; font-size: 1.25rem; }
	}

	@media (max-width: 480px) {
		.aurora-content { padding: var(--space-xl) var(--space-md); }
		.hero-heading { font-size: 1.75rem; }

		.platform-mosaic { max-width: 240px; }
		.mosaic-tile { width: 75px; height: 75px; font-size: 0.625rem; }
		.mosaic-tile i { font-size: 1rem; }
		.mosaic-center { width: 56px; height: 56px; }

		.btn-aurora-primary, .btn-aurora-secondary {
			padding: 12px 20px;
			font-size: 0.8125rem;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.hero-eyebrow,
		.hero-heading,
		.animate-hero-subtitle,
		.animate-hero-cta {
			animation: none;
			opacity: 1;
		}

		.btn-shine {
			display: none;
		}
	}
</style>
