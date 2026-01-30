<script lang="ts">
	/**
	 * VCP Demo Landing Page
	 * Entry point with clear explanation and demo paths
	 */
	import { HowItWorks } from '$lib/components/shared';
</script>

<svelte:head>
	<title>VCP - Share What You Need, Keep Why You Need It</title>
	<meta name="description" content="Share your preferences with AI and platforms without revealing private circumstances. VCP transmits the flag, not the story behind it." />
	<meta property="og:title" content="VCP - Privacy-Preserving Context Sharing" />
	<meta property="og:description" content="Tell AI your needs without explaining your circumstances. Quiet mode, tight budget, flexible schedule — they see the flag, not your life story." />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="container">
	<!-- Hero with clear explanation -->
	<section class="page-hero page-hero-landing">
		<p class="hero-eyebrow">Value Context Protocol</p>
		<h1>Reliably Porting Context<br />Where It Needs to Be</h1>
		<p class="page-hero-subtitle">
			Tell AI and platforms your preferences without revealing your private circumstances.
		</p>
		<p class="page-hero-explainer">
			You need quiet practice mode. They don't need to know it's because of thin apartment walls.
			You have a tight budget. They don't need your financial history.
			<strong>VCP transmits the flag, not the story behind it.</strong>
		</p>
		<div class="hero-cta">
			<a href="/playground" class="btn btn-cta">
				<i class="fa-solid fa-play" aria-hidden="true"></i>
				Try the Playground
			</a>
			<a href="/demos" class="btn btn-secondary btn-lg">See It In Action</a>
		</div>
	</section>

	<!-- How It Works - BEFORE the demos -->
	<HowItWorks />

	<!-- Demo Selector -->
	<section class="demo-selector">
		<h2 class="section-title">See It In Action</h2>
		<p class="section-description">
			Real scenarios where privacy matters. Watch how VCP protects personal details while enabling personalized experiences.
		</p>

		<div class="grid grid-2 gap-lg">
			<!-- Professional Demo Card -->
			<a href="/professional" class="card card-hover demo-card demo-card-professional">
				<div class="demo-badge-category"><span class="badge badge-success">Enterprise</span></div>
				<div class="demo-icon"><i class="fa-solid fa-briefcase" aria-hidden="true"></i></div>
				<h3 class="demo-title">Campion's Corporate Training</h3>
				<p class="demo-description">
					<strong>The situation:</strong> Campion needs flexible training schedules for personal reasons.
					<strong>The privacy need:</strong> HR sees her career goals, not why she can't do 9-to-5 study blocks.
					<strong>What she's protecting:</strong> Health situation that's none of her employer's business.
				</p>
				<div class="demo-features">
					<span class="demo-feature">
						<span class="feature-icon"><i class="fa-solid fa-building" aria-hidden="true"></i></span>
						HR sees goals, not circumstances
					</span>
					<span class="demo-feature">
						<span class="feature-icon"><i class="fa-solid fa-eye" aria-hidden="true"></i></span>
						Full audit trail of what's shared
					</span>
					<span class="demo-feature">
						<span class="feature-icon"><i class="fa-solid fa-masks-theater" aria-hidden="true"></i></span>
						Dual work/personal profiles
					</span>
				</div>
				<div class="demo-cta">
					<span class="btn btn-primary">Meet Campion <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
				</div>
			</a>

			<!-- Personal Demo Card -->
			<a href="/personal" class="card card-hover demo-card demo-card-personal">
				<div class="demo-badge-category"><span class="badge badge-primary">Consumer</span></div>
				<div class="demo-icon"><i class="fa-solid fa-guitar" aria-hidden="true"></i></div>
				<h3 class="demo-title">Gentian's Guitar Journey</h3>
				<p class="demo-description">
					<strong>The situation:</strong> Factory worker learning guitar across four different apps.
					<strong>The privacy need:</strong> Apps adapt to his budget without knowing he's barely making rent.
					<strong>What he's protecting:</strong> Shift schedules, thin walls, tight finances.
				</p>
				<div class="demo-features">
					<span class="demo-feature">
						<span class="feature-icon"><i class="fa-solid fa-rotate" aria-hidden="true"></i></span>
						Set preferences once, use everywhere
					</span>
					<span class="demo-feature">
						<span class="feature-icon"><i class="fa-solid fa-users" aria-hidden="true"></i></span>
						Community sees progress, not struggles
					</span>
					<span class="demo-feature">
						<span class="feature-icon"><i class="fa-solid fa-lock" aria-hidden="true"></i></span>
						Apps see flags, not life story
					</span>
				</div>
				<div class="demo-cta">
					<span class="btn btn-primary">Meet Gentian <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
				</div>
			</a>
		</div>

		<!-- More demos link -->
		<div class="more-demos">
			<a href="/demos" class="btn btn-ghost">
				<i class="fa-solid fa-grid-2" aria-hidden="true"></i>
				Explore All 12 Demos
			</a>
		</div>
	</section>

	<!-- Value Props -->
	<section class="value-props">
		<h2 class="section-title">Why This Matters</h2>
		<p class="section-description">
			The current choice — give up privacy or miss out on personalization — is a false one.
		</p>
		<div class="grid grid-2 gap-lg">
			<div class="value-card">
				<div class="value-icon"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></div>
				<h4>Your Story Stays Yours</h4>
				<p>
					Platforms see <code>budget_limited: true</code> — not "single parent between jobs."
					They see <code>noise_restricted: true</code> — not "thin walls, noise-sensitive neighbor."
					The flag travels. The story stays home.
				</p>
			</div>
			<div class="value-card">
				<div class="value-icon"><i class="fa-solid fa-rotate" aria-hidden="true"></i></div>
				<h4>Stop Repeating Yourself</h4>
				<p>
					Every app asks the same onboarding questions. With VCP, you define your preferences once.
					Every compatible platform instantly knows how to serve you — no repetitive forms, no inconsistent data.
				</p>
			</div>
			<div class="value-card">
				<div class="value-icon"><i class="fa-solid fa-receipt" aria-hidden="true"></i></div>
				<h4>See What They See</h4>
				<p>
					Complete audit trail of every transmission. Know exactly what each platform received,
					what was withheld, and which flags influenced their decisions.
					<em>You're not in the dark.</em>
				</p>
			</div>
			<div class="value-card">
				<div class="value-icon"><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i></div>
				<h4>Privacy + Accountability</h4>
				<p>
					Your coach sees you're making progress. Your employer sees you're on track.
					The community sees your streak. None of them need to know what you're juggling behind the scenes.
				</p>
			</div>
		</div>
	</section>

	<!-- Playground CTA -->
	<section class="playground-cta">
		<div class="playground-card card card-featured">
			<div class="playground-content">
				<div class="playground-icon"><i class="fa-solid fa-sliders" aria-hidden="true"></i></div>
				<div class="playground-text">
					<h3>Build Your Own Context Token</h3>
					<p>
						Create, inspect, and experiment with VCP tokens in real-time.
						Toggle constraints, change preferences, and watch the compact token update instantly.
						See exactly what gets transmitted — and what stays private.
					</p>
				</div>
			</div>
			<a href="/playground" class="btn btn-primary btn-lg">
				Open Playground <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
			</a>
		</div>
	</section>

	<!-- Learn More -->
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
			<a href="/docs/personas" class="learn-link">
				<i class="fa-solid fa-masks-theater" aria-hidden="true"></i>
				<span>Understanding Personas</span>
			</a>
		</div>
	</section>
</div>

<style>
	/* Hero eyebrow */
	.hero-eyebrow {
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-primary);
		margin-bottom: var(--space-md);
		font-weight: 500;
	}

	/* Hero CTA area */
	.hero-cta {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		margin-top: var(--space-xl);
		flex-wrap: wrap;
	}

	/* Demo category badge */
	.demo-badge-category {
		margin-bottom: var(--space-sm);
	}

	/* Demo selector section */
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

	.demo-card-professional {
		border-color: var(--color-professional);
	}

	.demo-card-professional:hover {
		border-color: var(--color-professional);
		box-shadow: 0 10px 30px rgba(5, 150, 105, 0.2);
	}

	.demo-card-personal {
		border-color: var(--color-primary);
	}

	.demo-card-personal:hover {
		border-color: var(--color-primary);
		box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
	}

	.demo-icon {
		font-size: 3rem;
		margin-bottom: var(--space-md);
	}

	.demo-card-professional .demo-icon {
		color: var(--color-professional);
	}

	.demo-card-personal .demo-icon {
		color: var(--color-primary);
	}

	.demo-title {
		font-size: 1.25rem;
		margin-bottom: var(--space-sm);
	}

	.demo-description {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		margin-bottom: var(--space-lg);
		flex: 1;
		line-height: 1.6;
	}

	.demo-features {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		margin-bottom: var(--space-lg);
	}

	.demo-feature {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.feature-icon {
		color: var(--color-success);
	}

	.demo-cta {
		margin-top: auto;
	}

	.more-demos {
		text-align: center;
		margin-top: var(--space-xl);
	}

	/* Value props */
	.value-props {
		padding-bottom: var(--space-2xl);
	}

	.value-card {
		padding: var(--space-lg);
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.value-icon {
		font-size: 1.5rem;
		color: var(--color-primary);
		margin-bottom: var(--space-md);
	}

	.value-card h4 {
		margin-bottom: var(--space-sm);
	}

	.value-card p {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.value-card code {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		padding: 1px 4px;
		background: var(--color-bg);
		border-radius: var(--radius-sm);
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
		font-size: 2.5rem;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.playground-text h3 {
		margin-bottom: var(--space-sm);
	}

	.playground-text p {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	/* Learn More section */
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
		gap: var(--space-sm);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg-card);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-md);
		color: var(--color-text);
		text-decoration: none;
		transition: all var(--transition-fast);
	}

	.learn-link:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
		text-decoration: none;
	}

	.learn-link i {
		color: var(--color-primary);
	}

	@media (max-width: 768px) {
		.hero-cta {
			flex-direction: column;
			align-items: stretch;
		}

		.hero-cta .btn {
			width: 100%;
			justify-content: center;
		}

		.playground-card {
			flex-direction: column;
			text-align: center;
		}

		.playground-content {
			flex-direction: column;
			align-items: center;
		}

		.playground-text {
			text-align: center;
		}

		.learn-more-links {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
