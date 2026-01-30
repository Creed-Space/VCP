<script lang="ts">
	/**
	 * About VCP - Overview page for all audiences
	 */
	import { Breadcrumb, NextSteps } from '$lib/components/shared';

	const breadcrumbItems = [
		{ label: 'About VCP', icon: 'fa-circle-info' }
	];

	const nextSteps = [
		{
			href: '/professional',
			icon: 'fa-briefcase',
			title: 'See It In Action',
			description: 'Follow Campion through a corporate training scenario',
			primary: true
		},
		{
			href: '/playground',
			icon: 'fa-sliders',
			title: 'Build Your Own Token',
			description: 'Create and inspect VCP tokens interactively'
		},
		{
			href: '/docs/personas',
			icon: 'fa-masks-theater',
			title: 'Learn About Personas',
			description: 'Understand the 6 behavioral profiles'
		}
	];
</script>

<svelte:head>
	<title>About VCP - Value Context Protocol</title>
	<meta name="description" content="Learn about the Value Context Protocol - privacy-preserving context sharing for AI interactions." />
</svelte:head>

<div class="container">
	<Breadcrumb items={breadcrumbItems} />

	<section class="page-hero">
		<h1>What is VCP?</h1>
		<p class="page-hero-subtitle">
			A protocol that lets you share your preferences with AI and platforms — without revealing your private circumstances.
		</p>
		<p class="page-hero-explainer">
			VCP encodes what you need (quiet mode, tight budget, flexible schedule) as simple flags.
			Platforms adapt to serve you better. They never learn <em>why</em> you need these things.
		</p>
	</section>

	<section class="content-section">
		<h2>The Problem</h2>
		<div class="problem-grid">
			<div class="problem-card">
				<span class="problem-icon"><i class="fa-solid fa-lock-open" aria-hidden="true"></i></span>
				<h3>Privacy Erosion</h3>
				<p>
					To get personalized experiences, you currently have to expose your personal details.
					Platforms know <em>why</em> you need accommodations, not just <em>that</em> you need them.
				</p>
			</div>
			<div class="problem-card">
				<span class="problem-icon"><i class="fa-solid fa-rotate" aria-hidden="true"></i></span>
				<h3>Context Fragmentation</h3>
				<p>
					Every platform asks the same questions. Your preferences, constraints, and goals
					are scattered across dozens of systems that don't talk to each other.
				</p>
			</div>
			<div class="problem-card">
				<span class="problem-icon"><i class="fa-solid fa-robot" aria-hidden="true"></i></span>
				<h3>Opaque AI</h3>
				<p>
					AI systems make decisions about you based on context you can't see or control.
					There's no standard way to share your values and preferences with AI.
				</p>
			</div>
		</div>
	</section>

	<section class="content-section">
		<h2>How VCP Solves This</h2>
		<div class="solution-grid">
			<div class="solution-card">
				<span class="solution-icon"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></span>
				<h3>Flags, Not Stories</h3>
				<p>
					Platforms see <code>noise_restricted: true</code> — not "thin walls, noise-sensitive neighbor."
					They see <code>budget_limited: true</code> — not your financial situation. The flag travels. Your story stays home.
				</p>
			</div>
			<div class="solution-card">
				<span class="solution-icon"><i class="fa-solid fa-rotate" aria-hidden="true"></i></span>
				<h3>Set Once, Use Everywhere</h3>
				<p>
					Define your preferences once. Every compatible platform instantly knows how to serve you —
					no more answering the same onboarding questions across a dozen apps.
				</p>
			</div>
			<div class="solution-card">
				<span class="solution-icon"><i class="fa-solid fa-receipt" aria-hidden="true"></i></span>
				<h3>See What They See</h3>
				<p>
					Complete audit trail of every transmission. Know exactly what each platform received,
					what was withheld, and which flags influenced their recommendations.
				</p>
			</div>
			<div class="solution-card">
				<span class="solution-icon"><i class="fa-solid fa-masks-theater" aria-hidden="true"></i></span>
				<h3>
					<span class="has-tooltip" data-tooltip="Different behavioral profiles for different contexts — work mode vs. personal mode">Values Profiles</span>
				</h3>
				<p>
					Different contexts need different approaches. Your work profile shares career goals with HR.
					Your personal profile protects that same information. Context-appropriate behavior, automatically.
				</p>
			</div>
		</div>
	</section>

	<section class="content-section">
		<h2>How It Works</h2>
		<div class="how-it-works">
			<div class="step">
				<div class="step-number">1</div>
				<h3>Set Your Preferences</h3>
				<p>
					Tell VCP your goals, constraints, and preferences. Mark what's okay to share publicly,
					what needs permission, and what should never leave your device.
				</p>
			</div>
			<div class="step-arrow">→</div>
			<div class="step">
				<div class="step-number">2</div>
				<h3>Private → Flags</h3>
				<p>
					Your private circumstances become simple boolean flags.
					"Thin walls" becomes <code>noise_restricted</code>. "Tight budget" becomes <code>budget_limited</code>.
				</p>
			</div>
			<div class="step-arrow">→</div>
			<div class="step">
				<div class="step-number">3</div>
				<h3>Platforms Adapt</h3>
				<p>
					Apps and AI see the flags and adjust their behavior.
					They recommend quiet exercises and free resources — without knowing why you need them.
				</p>
			</div>
			<div class="step-arrow">→</div>
			<div class="step">
				<div class="step-number">4</div>
				<h3>You Stay Informed</h3>
				<p>
					See exactly what was shared with whom. Audit trails show every transmission.
					No surprises, no black boxes.
				</p>
			</div>
		</div>
	</section>

	<NextSteps steps={nextSteps} />
</div>

<style>
	.content-section {
		margin-bottom: var(--space-2xl);
	}

	.content-section h2 {
		text-align: center;
		margin-bottom: var(--space-xl);
	}

	.problem-grid,
	.solution-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-lg);
	}

	.problem-card,
	.solution-card {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-xl);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.problem-icon,
	.solution-icon {
		font-size: 2.5rem;
		display: block;
		margin-bottom: var(--space-md);
	}

	.problem-card h3,
	.solution-card h3 {
		margin-bottom: var(--space-sm);
	}

	.problem-card p,
	.solution-card p {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	.how-it-works {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
		overflow-x: auto;
		padding: var(--space-md) 0;
	}

	.step {
		flex: 1;
		min-width: 200px;
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.step-number {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-primary);
		color: white;
		border-radius: 50%;
		font-weight: 600;
		margin-bottom: var(--space-md);
	}

	.step h3 {
		margin-bottom: var(--space-sm);
		font-size: 1rem;
	}

	.step p {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.step-arrow {
		color: var(--color-primary);
		font-size: 1.5rem;
		padding-top: var(--space-xl);
	}

	@media (max-width: 768px) {
		.how-it-works {
			flex-direction: column;
		}

		.step-arrow {
			transform: rotate(90deg);
			padding: var(--space-sm) 0;
		}
	}
</style>
