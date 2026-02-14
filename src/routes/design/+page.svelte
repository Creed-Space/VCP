<script lang="ts">
	/**
	 * Design Prototype Page
	 * Showcasing beautiful design elements for VCP Demo site
	 */

	let orbContainer: HTMLElement | null = $state(null);

	// Intersection observer for scroll-reveal animations
	let revealElements: HTMLElement[] = $state([]);

	$effect(() => {
		if (typeof window === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('revealed');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
		);

		// Observe all elements with scroll-reveal class
		document.querySelectorAll('.scroll-reveal').forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	});

	// Animated counter
	let counterVisible = $state(false);
	let counts = $state({ protocols: 0, platforms: 0, tokens: 0 });

	function animateCounter(target: number, key: keyof typeof counts, duration: number = 2000) {
		const start = performance.now();
		function tick(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
			counts[key] = Math.round(eased * target);
			if (progress < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	$effect(() => {
		if (!counterVisible) return;
		animateCounter(1, 'protocols', 1500);
		animateCounter(50, 'platforms', 2000);
		animateCounter(10000, 'tokens', 2500);
	});

	// Track counter section visibility
	$effect(() => {
		if (typeof window === 'undefined') return;

		const counterSection = document.querySelector('.stats-section');
		if (!counterSection) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					counterVisible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);

		observer.observe(counterSection);
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Design Prototypes | VCP Demo</title>
</svelte:head>

<div class="design-page">
	<!-- =============================================
	     ELEMENT 1: Aurora Hero with Animated Mesh
	     ============================================= -->
	<section class="aurora-hero">
		<div class="aurora-bg">
			<div class="aurora-orb aurora-orb-1"></div>
			<div class="aurora-orb aurora-orb-2"></div>
			<div class="aurora-orb aurora-orb-3"></div>
		</div>
		<div class="container aurora-content">
			<p class="proto-label scroll-reveal">Element 1: Aurora Hero</p>
			<span class="hero-chip scroll-reveal">
				<span class="chip-dot"></span>
				Open Standard
			</span>
			<h1 class="aurora-title scroll-reveal">
				Context That
				<span class="gradient-word">Travels</span>
				With You
			</h1>
			<p class="aurora-subtitle scroll-reveal">
				One profile. Every platform. Your preferences, values, and state &mdash;
				carried seamlessly wherever AI meets you.
			</p>
			<div class="aurora-cta scroll-reveal">
				<button class="btn-aurora-primary">
					<span class="btn-shine"></span>
					<i class="fa-solid fa-play" aria-hidden="true"></i>
					See It In Action
				</button>
				<button class="btn-aurora-secondary">
					Learn How It Works
					<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
				</button>
			</div>
		</div>
	</section>

	<!-- =============================================
	     ELEMENT 2: Animated Stats Counter
	     ============================================= -->
	<section class="stats-section">
		<div class="container">
			<p class="proto-label scroll-reveal">Element 2: Stats with Animated Counters</p>
			<div class="stats-row">
				<div class="stat-card scroll-reveal">
					<div class="stat-number">{counts.protocols}</div>
					<div class="stat-label">Open Protocol</div>
					<div class="stat-sublabel">No vendor lock-in</div>
				</div>
				<div class="stat-divider"></div>
				<div class="stat-card scroll-reveal">
					<div class="stat-number">{counts.platforms}+</div>
					<div class="stat-label">Platform Integrations</div>
					<div class="stat-sublabel">Growing ecosystem</div>
				</div>
				<div class="stat-divider"></div>
				<div class="stat-card scroll-reveal">
					<div class="stat-number">{(counts.tokens / 1000).toFixed(counts.tokens >= 10000 ? 0 : 1)}k</div>
					<div class="stat-label">Tokens Generated</div>
					<div class="stat-sublabel">Real user contexts</div>
				</div>
			</div>
		</div>
	</section>

	<!-- =============================================
	     ELEMENT 3: Prismatic Feature Cards
	     ============================================= -->
	<section class="prismatic-section">
		<div class="container">
			<p class="proto-label scroll-reveal">Element 3: Prismatic Feature Cards</p>
			<h2 class="section-heading scroll-reveal">How VCP Works</h2>
			<p class="section-desc scroll-reveal">Three layers of context, carried in one portable token.</p>

			<div class="prismatic-grid">
				<div class="prismatic-card scroll-reveal" style="--card-hue: 245;">
					<div class="prismatic-border"></div>
					<div class="prismatic-inner">
						<div class="prismatic-icon">
							<i class="fa-solid fa-id-card" aria-hidden="true"></i>
						</div>
						<h3>Identity Layer</h3>
						<p>Persistent preferences, values, and boundaries that define who you are across platforms.</p>
						<div class="prismatic-tags">
							<span class="ptag">Preferences</span>
							<span class="ptag">Values</span>
							<span class="ptag">Constraints</span>
						</div>
					</div>
				</div>

				<div class="prismatic-card scroll-reveal" style="--card-hue: 160;">
					<div class="prismatic-border"></div>
					<div class="prismatic-inner">
						<div class="prismatic-icon">
							<i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i>
						</div>
						<h3>Temporal Layer</h3>
						<p>Your current state &mdash; mood, energy, focus &mdash; updating in real-time as your situation changes.</p>
						<div class="prismatic-tags">
							<span class="ptag">Mood</span>
							<span class="ptag">Energy</span>
							<span class="ptag">Context</span>
						</div>
					</div>
				</div>

				<div class="prismatic-card scroll-reveal" style="--card-hue: 30;">
					<div class="prismatic-border"></div>
					<div class="prismatic-inner">
						<div class="prismatic-icon">
							<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
						</div>
						<h3>Safety Layer</h3>
						<p>Hooks and constitutions that protect your boundaries, enforced at the protocol level.</p>
						<div class="prismatic-tags">
							<span class="ptag">Hooks</span>
							<span class="ptag">Constitutions</span>
							<span class="ptag">Audit</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- =============================================
	     ELEMENT 4: Flowing Comparison Section
	     ============================================= -->
	<section class="comparison-section">
		<div class="container">
			<p class="proto-label scroll-reveal">Element 4: Before/After Comparison</p>
			<h2 class="section-heading scroll-reveal">A Better Way</h2>

			<div class="comparison-grid">
				<div class="comparison-card comparison-before scroll-reveal">
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

				<div class="comparison-arrow scroll-reveal">
					<div class="arrow-line"></div>
					<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
				</div>

				<div class="comparison-card comparison-after scroll-reveal">
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
			</div>
		</div>
	</section>

	<!-- =============================================
	     ELEMENT 5: Glowing Testimonial Cards
	     ============================================= -->
	<section class="testimonial-section">
		<div class="container">
			<p class="proto-label scroll-reveal">Element 5: Testimonial / Quote Cards</p>
			<h2 class="section-heading scroll-reveal">What People Are Saying</h2>

			<div class="testimonial-grid">
				<div class="testimonial-card scroll-reveal">
					<div class="testimonial-glow"></div>
					<blockquote>
						"VCP finally solved the context fragmentation problem. My students' preferences follow them
						across every learning tool we use."
					</blockquote>
					<div class="testimonial-author">
						<div class="author-avatar">
							<i class="fa-solid fa-user" aria-hidden="true"></i>
						</div>
						<div>
							<div class="author-name">Dr. Sarah Chen</div>
							<div class="author-role">EdTech Director, Stanford</div>
						</div>
					</div>
				</div>

				<div class="testimonial-card testimonial-featured scroll-reveal">
					<div class="testimonial-glow"></div>
					<blockquote>
						"The real-time state layer is a game-changer. Our mental health app can now adapt
						to users' emotional state without them having to explain anything."
					</blockquote>
					<div class="testimonial-author">
						<div class="author-avatar">
							<i class="fa-solid fa-user" aria-hidden="true"></i>
						</div>
						<div>
							<div class="author-name">Marcus Rivera</div>
							<div class="author-role">CTO, MindBridge Health</div>
						</div>
					</div>
				</div>

				<div class="testimonial-card scroll-reveal">
					<div class="testimonial-glow"></div>
					<blockquote>
						"We integrated VCP in a weekend. The SDK handles the complexity &mdash;
						we just read the token and adapt."
					</blockquote>
					<div class="testimonial-author">
						<div class="author-avatar">
							<i class="fa-solid fa-user" aria-hidden="true"></i>
						</div>
						<div>
							<div class="author-name">Anika Patel</div>
							<div class="author-role">Lead Engineer, Harmony AI</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- =============================================
	     ELEMENT 6: Interactive Demo Showcase Cards
	     ============================================= -->
	<section class="showcase-section">
		<div class="container">
			<p class="proto-label scroll-reveal">Element 6: Demo Showcase Cards (Enhanced)</p>
			<h2 class="section-heading scroll-reveal">See It In Action</h2>
			<p class="section-desc scroll-reveal">Real scenarios. Real context. Real adaptation.</p>

			<div class="showcase-grid">
				<a href="/demos/gentian" class="showcase-card scroll-reveal">
					<div class="showcase-bg" style="--accent: 99, 102, 241;"></div>
					<div class="showcase-content">
						<div class="showcase-number">01</div>
						<div class="showcase-icon-wrap" style="--accent: 99, 102, 241;">
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

				<a href="/demos/campion" class="showcase-card scroll-reveal">
					<div class="showcase-bg" style="--accent: 5, 150, 105;"></div>
					<div class="showcase-content">
						<div class="showcase-number">02</div>
						<div class="showcase-icon-wrap" style="--accent: 5, 150, 105;">
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

				<a href="/demos/marta" class="showcase-card scroll-reveal">
					<div class="showcase-bg" style="--accent: 59, 130, 246;"></div>
					<div class="showcase-content">
						<div class="showcase-number">03</div>
						<div class="showcase-icon-wrap" style="--accent: 59, 130, 246;">
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
			</div>
		</div>
	</section>

	<!-- =============================================
	     ELEMENT 7: Wave Section Divider + CTA
	     ============================================= -->
	<section class="wave-cta-section">
		<svg class="wave-top" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
			<path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,45 1440,60 L1440,0 L0,0 Z" />
		</svg>
		<div class="container wave-content">
			<p class="proto-label scroll-reveal" style="color: rgba(255,255,255,0.5);">Element 7: Wave Divider + CTA Block</p>
			<div class="cta-block scroll-reveal">
				<div class="cta-icon-ring">
					<i class="fa-solid fa-sliders" aria-hidden="true"></i>
				</div>
				<h2>Build Your Own Context</h2>
				<p>Create, inspect, and experiment with VCP tokens in real-time.</p>
				<button class="btn-aurora-primary btn-lg">
					<span class="btn-shine"></span>
					Open Playground
					<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
				</button>
			</div>
		</div>
		<svg class="wave-bottom" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
			<path d="M0,60 C360,0 720,120 1080,60 C1260,30 1380,75 1440,60 L1440,120 L0,120 Z" />
		</svg>
	</section>

	<!-- =============================================
	     ELEMENT 8: Stacked Feature Row
	     ============================================= -->
	<section class="stacked-section">
		<div class="container">
			<p class="proto-label scroll-reveal">Element 8: Stacked Feature Rows (Alternating)</p>

			<div class="stacked-row scroll-reveal">
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

			<div class="stacked-row stacked-row-reverse scroll-reveal">
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
		</div>
	</section>

	<!-- =============================================
	     ELEMENT 9: Elegant Footer CTA Strip
	     ============================================= -->
	<section class="footer-cta-strip">
		<div class="container">
			<p class="proto-label scroll-reveal" style="color: rgba(255,255,255,0.4);">Element 9: Footer CTA Strip</p>
			<div class="cta-strip scroll-reveal">
				<div class="cta-strip-text">
					<h3>Ready to explore?</h3>
					<p>Dive into the docs, try the playground, or see a live demo.</p>
				</div>
				<div class="cta-strip-actions">
					<a href="/docs" class="strip-link">
						<i class="fa-solid fa-book" aria-hidden="true"></i>
						Docs
					</a>
					<a href="/playground" class="strip-link strip-link-primary">
						<i class="fa-solid fa-sliders" aria-hidden="true"></i>
						Playground
					</a>
					<a href="/demos" class="strip-link">
						<i class="fa-solid fa-play" aria-hidden="true"></i>
						Demos
					</a>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	/* =============================================
	   Global Prototype Styles
	   ============================================= */

	.design-page {
		overflow-x: hidden;
	}

	.proto-label {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-text-subtle);
		margin-bottom: var(--space-xl);
		font-family: var(--font-mono);
		opacity: 0.6;
	}

	.section-heading {
		font-size: var(--text-3xl);
		font-weight: 700;
		text-align: center;
		margin-bottom: var(--space-sm);
		letter-spacing: -0.02em;
	}

	.section-desc {
		text-align: center;
		color: var(--color-text-muted);
		font-size: var(--text-lg);
		max-width: 560px;
		margin: 0 auto var(--space-2xl);
		line-height: var(--leading-relaxed);
	}

	/* Scroll reveal animation */
	.scroll-reveal {
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
					transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
	}

	:global(.scroll-reveal.revealed) {
		opacity: 1;
		transform: translateY(0);
	}

	/* Stagger children */
	.scroll-reveal:nth-child(2) { transition-delay: 0.08s; }
	.scroll-reveal:nth-child(3) { transition-delay: 0.16s; }
	.scroll-reveal:nth-child(4) { transition-delay: 0.24s; }

	/* =============================================
	   ELEMENT 1: Aurora Hero
	   ============================================= */

	.aurora-hero {
		position: relative;
		min-height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.aurora-bg {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.aurora-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(100px);
		opacity: 0.35;
		animation: auroraFloat 20s ease-in-out infinite;
	}

	.aurora-orb-1 {
		width: 600px;
		height: 600px;
		background: radial-gradient(circle, #6366f1 0%, transparent 70%);
		top: -10%;
		left: -5%;
		animation-delay: 0s;
	}

	.aurora-orb-2 {
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, #a78bfa 0%, transparent 70%);
		top: 20%;
		right: -10%;
		animation-delay: -7s;
		animation-duration: 25s;
	}

	.aurora-orb-3 {
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, #22c55e 0%, transparent 70%);
		bottom: -5%;
		left: 30%;
		animation-delay: -14s;
		animation-duration: 22s;
		opacity: 0.2;
	}

	@keyframes auroraFloat {
		0%, 100% { transform: translate(0, 0) scale(1); }
		25% { transform: translate(40px, -30px) scale(1.05); }
		50% { transform: translate(-20px, 20px) scale(0.95); }
		75% { transform: translate(30px, 10px) scale(1.02); }
	}

	.aurora-content {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: var(--space-2xl) var(--space-lg);
	}

	.hero-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 6px 16px;
		background: rgba(99, 102, 241, 0.08);
		border: 1px solid rgba(99, 102, 241, 0.2);
		border-radius: 100px;
		font-size: var(--text-xs);
		color: var(--color-accent);
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-weight: 500;
		margin-bottom: var(--space-xl);
	}

	.chip-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-success);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.aurora-title {
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-bottom: var(--space-lg);
	}

	.gradient-word {
		background: linear-gradient(135deg, #818cf8, #a78bfa, #c084fc);
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

	.aurora-cta {
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
		transition: all var(--transition-normal);
		box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35),
					0 0 40px rgba(99, 102, 241, 0.1);
	}

	.btn-aurora-primary:hover {
		transform: translateY(-2px);
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
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
		transition: all var(--transition-normal);
	}

	.btn-aurora-secondary:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}

	/* =============================================
	   ELEMENT 2: Stats
	   ============================================= */

	.stats-section {
		padding: var(--space-2xl) 0;
	}

	.stats-row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-2xl);
	}

	.stat-card {
		text-align: center;
		padding: var(--space-lg);
	}

	.stat-number {
		font-size: 3.5rem;
		font-weight: 800;
		background: linear-gradient(135deg, var(--color-text), var(--color-accent));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1;
		margin-bottom: var(--space-sm);
	}

	.stat-label {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: var(--space-xs);
	}

	.stat-sublabel {
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}

	.stat-divider {
		width: 1px;
		height: 60px;
		background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent);
	}

	/* =============================================
	   ELEMENT 3: Prismatic Cards
	   ============================================= */

	.prismatic-section {
		padding: var(--space-2xl) 0;
	}

	.prismatic-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.prismatic-card {
		position: relative;
		border-radius: var(--radius-xl);
		padding: 1px; /* border width */
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
	   ELEMENT 4: Comparison
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
		margin: 0 auto;
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
	   ELEMENT 5: Testimonials
	   ============================================= */

	.testimonial-section {
		padding: var(--space-2xl) 0;
	}

	.testimonial-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.testimonial-card {
		position: relative;
		padding: var(--space-xl);
		border-radius: var(--radius-xl);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(18, 18, 32, 0.6);
		-webkit-backdrop-filter: blur(16px);
		backdrop-filter: blur(16px);
		transition: all 0.4s ease;
		overflow: hidden;
	}

	.testimonial-card:hover {
		transform: translateY(-3px);
		border-color: rgba(255, 255, 255, 0.12);
	}

	.testimonial-glow {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.06), transparent 50%);
		pointer-events: none;
	}

	.testimonial-featured {
		border-color: rgba(99, 102, 241, 0.2);
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(18, 18, 32, 0.6));
	}

	.testimonial-card blockquote {
		position: relative;
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
		font-style: italic;
	}

	.testimonial-featured blockquote {
		color: var(--color-text);
	}

	.testimonial-author {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.author-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(167, 139, 250, 0.2));
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-accent);
		font-size: 0.875rem;
	}

	.author-name {
		font-weight: 600;
		font-size: var(--text-sm);
	}

	.author-role {
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}

	/* =============================================
	   ELEMENT 6: Showcase Cards
	   ============================================= */

	.showcase-section {
		padding: var(--space-2xl) 0;
	}

	.showcase-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
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
		transition: opacity 0.4s ease;
	}

	.showcase-card:hover .showcase-bg {
		opacity: 1.5;
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

	/* =============================================
	   ELEMENT 7: Wave CTA
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

	.wave-top path {
		fill: var(--color-bg);
	}

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

	.cta-block h2 {
		font-size: var(--text-3xl);
		font-weight: 700;
		margin-bottom: var(--space-sm);
	}

	.cta-block p {
		color: var(--color-text-muted);
		margin-bottom: var(--space-xl);
	}

	/* =============================================
	   ELEMENT 8: Stacked Feature Rows
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
		color: var(--color-primary);
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
	   ELEMENT 9: Footer CTA Strip
	   ============================================= */

	.footer-cta-strip {
		padding: var(--space-2xl) 0;
	}

	.cta-strip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-xl) var(--space-2xl);
		border-radius: var(--radius-xl);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(18, 18, 32, 0.5);
		-webkit-backdrop-filter: blur(16px);
		backdrop-filter: blur(16px);
	}

	.cta-strip-text h3 {
		font-size: var(--text-xl);
		font-weight: 700;
		margin-bottom: var(--space-xs);
	}

	.cta-strip-text p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.cta-strip-actions {
		display: flex;
		gap: var(--space-sm);
	}

	.strip-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 10px 20px;
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.03);
		color: var(--color-text-muted);
		text-decoration: none;
		font-size: var(--text-sm);
		font-weight: 500;
		transition: all var(--transition-normal);
	}

	.strip-link:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.15);
		color: var(--color-text);
		text-decoration: none;
		transform: translateY(-1px);
	}

	.strip-link-primary {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08));
		border-color: rgba(99, 102, 241, 0.25);
		color: var(--color-primary-hover);
	}

	.strip-link-primary:hover {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.12));
		border-color: rgba(99, 102, 241, 0.4);
		color: white;
	}

	/* =============================================
	   Responsive
	   ============================================= */

	@media (max-width: 900px) {
		.prismatic-grid,
		.testimonial-grid,
		.showcase-grid {
			grid-template-columns: 1fr;
			max-width: 480px;
			margin-left: auto;
			margin-right: auto;
		}

		.comparison-grid {
			grid-template-columns: 1fr;
			max-width: 480px;
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

		.stats-row {
			flex-direction: column;
			gap: var(--space-lg);
		}

		.stat-divider {
			width: 60px;
			height: 1px;
			background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
		}

		.cta-strip {
			flex-direction: column;
			text-align: center;
			gap: var(--space-lg);
		}

		.cta-strip-actions {
			flex-wrap: wrap;
			justify-content: center;
		}
	}

	@media (max-width: 640px) {
		.aurora-title {
			font-size: 2rem;
		}

		.aurora-subtitle {
			font-size: var(--text-base);
		}

		.aurora-cta {
			flex-direction: column;
			align-items: stretch;
		}

		.stat-number {
			font-size: 2.5rem;
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
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.aurora-orb {
			animation: none;
		}

		.scroll-reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}

		.btn-shine {
			display: none;
		}

		.chip-dot {
			animation: none;
		}
	}
</style>
