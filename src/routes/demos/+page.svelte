<script lang="ts">
	/** Demos Hub — Two-tier persona cards: 3 primary + 3 niche */
	import { Breadcrumb } from '$lib/components/shared';

	const breadcrumbItems = [
		{ label: 'Interactive Demos', icon: 'fa-play-circle' }
	];

	const primaryDemos = [
		{
			href: '/demos/gentian',
			icon: 'fa-guitar',
			iconColor: 'var(--color-primary)',
			badge: 'Consumer',
			badgeClass: 'badge-primary',
			title: "Gentian's Guitar Journey",
			concept: 'Context travels across platforms',
			description: 'A factory worker sets his preferences once — every music app adapts instantly. Change one constraint and watch everything update.',
			features: ['Cross-platform portability', 'Zero re-entry', 'Live updates']
		},
		{
			href: '/demos/campion',
			icon: 'fa-briefcase',
			iconColor: 'var(--color-professional, #059669)',
			badge: 'Enterprise',
			badgeClass: 'badge-success',
			title: "Campion's Corporate Training",
			concept: 'Context switches with your situation',
			description: 'A senior engineer has work and personal profiles. The AI automatically adapts when her situation changes — no manual switching.',
			features: ['Dual profiles', 'Automatic switching', 'Audit trail']
		},
		{
			href: '/demos/marta',
			icon: 'fa-handshake-angle',
			iconColor: '#3b82f6',
			badge: 'Values & Decisions',
			badgeClass: 'badge-info',
			title: "Marta's Responsibility Journey",
			concept: 'Context shapes real-time guidance',
			description: 'A project manager navigates a family loan decision. Her values and moment-to-moment state shape how the AI guides her.',
			features: ['Live guidance', 'Value-aware', 'Real-time state']
		}
	];

	const productionApps = [
		{
			href: 'https://creed.space',
			logo: '/creedspace-logo.png',
			logoAlt: 'Creed Space heart logo',
			badge: 'Constitutional AI',
			badgeClass: 'badge-purple',
			title: 'Creed Space',
			description: 'Governance platform where organisations define AI constitutions as VCP tokens. Policies travel with every interaction — the PDP enforces them at the protocol level, not as afterthoughts.',
			features: ['Constitution portability', 'PDP enforcement', 'Bilateral alignment', 'Audit trail']
		},
		{
			href: 'https://millos.net',
			emoji: '\u{1F3ED}',
			badge: 'AI-Native Organizational OS',
			badgeClass: 'badge-success',
			title: 'MillOS',
			description: 'AI-native organizational operating system where VCP provides the context layer for agent coordination. User preferences persist across applications and agents adapt in real time — no re-entry, no drift.',
			features: ['Multi-agent coordination', 'Persistent context', 'Real-time adaptation', 'Cross-app portability']
		}
	];

	const nicheDemos = [
		{
			href: '/demos/ren',
			icon: 'fa-bolt',
			iconColor: '#f59e0b',
			badge: 'Multi-Agent',
			badgeClass: 'badge-warning',
			title: "Ren's Energy Cooperative",
			concept: 'AI agents negotiate with private context',
			description: 'AI agents bid in energy markets carrying their cooperative\'s values — sustainability over pure profit.',
		},
		{
			href: '/demos/noor',
			icon: 'fa-scale-balanced',
			iconColor: '#8b5cf6',
			badge: 'Governance',
			badgeClass: 'badge-purple',
			title: "Noor's School District",
			concept: 'Values become enforceable hooks',
			description: 'A school coordinator turns "don\'t do homework for students" from an aspiration into executable VCP hooks that fire at the protocol level.',
		},
		{
			href: '/demos/hana',
			icon: 'fa-stethoscope',
			iconColor: '#06b6d4',
			badge: 'Epistemic',
			badgeClass: 'badge-cyan',
			title: "Dr. Hana's Diagnostic Tool",
			concept: 'See what the AI actually knows',
			description: 'A rural GP inspects AI diagnostic confidence — distinguishing 92% certainty from 35% speculation.',
		}
	];
</script>

<svelte:head>
	<title>Interactive Demos - VCP</title>
	<meta name="description" content="See how context flows through real scenarios — from everyday convenience to advanced AI coordination. Pick a story and try VCP." />
	<link rel="canonical" href="https://valuecontextprotocol.org/demos/" />
	<meta property="og:title" content="Interactive Demos - VCP" />
	<meta property="og:description" content="See how context flows through real scenarios — from everyday convenience to advanced AI coordination. Pick a story and try VCP." />
	<meta property="og:url" content="https://valuecontextprotocol.org/demos/" />
	<meta property="og:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Interactive Demos - VCP" />
	<meta name="twitter:description" content="See how context flows through real scenarios — from everyday convenience to advanced AI coordination." />
</svelte:head>

<div class="container">
	<Breadcrumb items={breadcrumbItems} />

	<section class="page-hero">
		<h1>Pick a Story</h1>
		<p class="page-hero-subtitle">
			See how context flows through real scenarios &mdash;
			from everyday convenience to enforceable hooks and advanced AI coordination.
		</p>
	</section>

	<!-- Primary Demos -->
	<section class="primary-demos">
		<div class="primary-grid">
			{#each primaryDemos as demo}
				<a href={demo.href} class="primary-card card card-hover">
					<div class="card-badge"><span class="badge {demo.badgeClass}">{demo.badge}</span></div>
					<div class="card-icon" style="color: {demo.iconColor}">
						<i class="fa-solid {demo.icon}" aria-hidden="true"></i>
					</div>
					<h3>{demo.title}</h3>
					<p class="card-concept">{demo.concept}</p>
					<p class="card-desc">{demo.description}</p>
					<div class="card-features">
						{#each demo.features as feature}
							<span class="feature-tag">
								<i class="fa-solid fa-check" aria-hidden="true"></i>
								{feature}
							</span>
						{/each}
					</div>
					<span class="card-cta">
						Try This Demo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
					</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- Divider -->
	<div class="tier-divider">
		<span class="divider-line"></span>
		<span class="divider-text">Go Deeper</span>
		<span class="divider-line"></span>
	</div>

	<!-- Niche Demos -->
	<section class="niche-demos">
		<div class="niche-grid">
			{#each nicheDemos as demo}
				<a href={demo.href} class="niche-card card card-hover">
					<div class="niche-header">
						<span class="niche-icon" style="color: {demo.iconColor}">
							<i class="fa-solid {demo.icon}" aria-hidden="true"></i>
						</span>
						<span class="badge {demo.badgeClass}">{demo.badge}</span>
					</div>
					<h3>{demo.title}</h3>
					<p class="niche-concept">{demo.concept}</p>
					<p class="niche-desc">{demo.description}</p>
					<span class="card-cta">
						Explore <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
					</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- In Production -->
	<div class="tier-divider">
		<span class="divider-line"></span>
		<span class="divider-text">Powered by VCP</span>
		<span class="divider-line"></span>
	</div>

	<section class="production-demos">
		<h2>Powered by VCP</h2>
		<div class="production-grid">
			{#each productionApps as app}
				<a href={app.href} class="production-card card card-hover" target="_blank" rel="noopener noreferrer">
					<div class="production-header">
						<div class="production-icon">
							{#if app.logo}
								<img src={app.logo} alt={app.logoAlt} class="production-logo" />
							{:else if app.emoji}
								<span class="production-emoji">{app.emoji}</span>
							{/if}
						</div>
						<div>
							<span class="badge {app.badgeClass}">{app.badge}</span>
							<h3>{app.title}</h3>
						</div>
					</div>
					<p class="production-desc">{app.description}</p>
					<div class="card-features">
						{#each app.features as feature}
							<span class="feature-tag">
								<i class="fa-solid fa-check" aria-hidden="true"></i>
								{feature}
							</span>
						{/each}
					</div>
					<span class="card-cta">
						Visit <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
					</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- Build Your Own -->
	<section class="build-section">
		<h2>
			<i class="fa-solid fa-hammer" aria-hidden="true"></i>
			Build Your Own
		</h2>
		<div class="tools-grid">
			<a href="/playground" class="tool-card">
				<span class="tool-icon"><i class="fa-solid fa-sliders" aria-hidden="true"></i></span>
				<div>
					<h3>Playground</h3>
					<p>Build and inspect VCP tokens interactively</p>
				</div>
			</a>
			<a href="/docs" class="tool-card">
				<span class="tool-icon"><i class="fa-solid fa-book" aria-hidden="true"></i></span>
				<div>
					<h3>Documentation</h3>
					<p>Protocol specification, API reference, and integration guides</p>
				</div>
			</a>
		</div>
	</section>
</div>

<style>
	/* Primary demos */
	.primary-demos {
		margin-bottom: var(--space-xl);
	}

	.primary-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.primary-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: var(--color-text);
		padding: var(--space-xl);
	}

	.primary-card:hover {
		text-decoration: none;
	}

	.card-badge {
		margin-bottom: var(--space-sm);
	}

	.card-icon {
		font-size: 2.5rem;
		margin-bottom: var(--space-md);
	}

	.primary-card h3 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-xs);
	}

	.card-concept {
		color: var(--color-primary);
		font-size: var(--text-sm);
		font-weight: 500;
		margin-bottom: var(--space-sm);
	}

	.card-desc {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-md);
		flex: 1;
	}

	.card-features {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs) var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.feature-tag {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.feature-tag i {
		color: var(--color-success);
		font-size: 0.625rem;
	}

	.card-cta {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		color: var(--color-primary);
		font-weight: 500;
		font-size: var(--text-sm);
		margin-top: auto;
	}

	/* Tier divider */
	.tier-divider {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
		margin: var(--space-lg) 0 var(--space-xl);
	}

	.divider-line {
		flex: 1;
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
	}

	.divider-text {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Niche demos */
	.niche-demos {
		margin-bottom: var(--space-2xl);
	}

	.niche-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.niche-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: var(--color-text);
		padding: var(--space-lg);
	}

	.niche-card:hover {
		text-decoration: none;
	}

	.niche-header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.niche-icon {
		font-size: 1.5rem;
	}

	.niche-card h3 {
		font-size: var(--text-base);
		margin-bottom: var(--space-xs);
	}

	.niche-concept {
		color: var(--color-primary);
		font-size: 0.8125rem;
		font-weight: 500;
		margin-bottom: var(--space-sm);
	}

	.niche-desc {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-md);
		flex: 1;
	}

	/* Badge variants for niche demos */
	:global(.badge-warning) {
		background: rgba(245, 158, 11, 0.15);
		color: #f59e0b;
	}

	:global(.badge-purple) {
		background: rgba(139, 92, 246, 0.15);
		color: #8b5cf6;
	}

	:global(.badge-cyan) {
		background: rgba(6, 182, 212, 0.15);
		color: #06b6d4;
	}

	:global(.badge-info) {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
	}

	/* Production demos */
	.production-demos {
		margin-bottom: var(--space-2xl);
	}

	.production-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-lg);
	}

	.production-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: var(--color-text);
		padding: var(--space-xl);
		border: 1px solid rgba(167, 139, 250, 0.2);
		background: linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
	}

	.production-card:hover {
		text-decoration: none;
		border-color: rgba(167, 139, 250, 0.4);
	}

	.production-header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.production-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.production-logo {
		width: 3rem;
		height: 3rem;
		object-fit: contain;
	}

	.production-emoji {
		font-size: 2.5rem;
		line-height: 1;
	}

	.production-header h3 {
		font-size: var(--text-xl);
		margin-top: var(--space-xs);
	}

	.production-desc {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-md);
		flex: 1;
	}

	/* Build section */
	.build-section {
		margin-bottom: var(--space-2xl);
	}

	.build-section h2 {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-md);
	}

	.tool-card {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
		padding: var(--space-lg);
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
		text-decoration: none;
		color: var(--color-text);
		transition: all var(--transition-fast);
	}

	.tool-card:hover {
		border-color: var(--color-primary);
		text-decoration: none;
	}

	.tool-icon {
		font-size: 2rem;
		color: var(--color-primary);
	}

	.tool-card h3 {
		font-size: var(--text-base);
		margin-bottom: var(--space-xs);
	}

	.tool-card p {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	/* Responsive */
	@media (max-width: 900px) {
		.primary-grid,
		.niche-grid {
			gap: var(--space-md);
		}
	}

	@media (max-width: 768px) {
		.primary-grid,
		.niche-grid,
		.production-grid {
			grid-template-columns: 1fr;
		}

		.tools-grid {
			grid-template-columns: 1fr;
		}

		.production-card {
			padding: var(--space-lg);
		}

		.production-logo {
			width: 2rem;
			height: 2rem;
		}

		.production-emoji {
			font-size: 2rem;
		}

		.production-header h3 {
			font-size: var(--text-lg);
		}

		.primary-card,
		.niche-card {
			padding: var(--space-lg);
		}

		.card-icon {
			font-size: 2rem;
		}

		.primary-card h3 {
			font-size: var(--text-lg);
		}

		.niche-card h3 {
			font-size: var(--text-base);
		}

		.card-concept,
		.niche-concept {
			font-size: 0.8125rem;
		}

		.card-desc,
		.niche-desc {
			font-size: 0.8125rem;
		}

		.feature-tag {
			font-size: 0.6875rem;
		}

		.niche-icon {
			font-size: 1.25rem;
		}

		.tool-icon {
			font-size: 1.5rem;
		}

		.tool-card {
			flex-direction: column;
			text-align: center;
			gap: var(--space-md);
		}

		.tool-card h3 {
			font-size: var(--text-base);
		}

		.tool-card p {
			font-size: 0.8125rem;
		}
	}

	@media (max-width: 640px) {
		.primary-card {
			padding: var(--space-md);
		}

		.niche-card {
			padding: var(--space-md);
		}

		.card-icon {
			font-size: 1.5rem;
			margin-bottom: var(--space-sm);
		}

		.primary-card h3 {
			font-size: var(--text-base);
		}

		.card-features {
			gap: var(--space-xs) var(--space-sm);
		}

		.tier-divider {
			gap: var(--space-sm);
			margin: var(--space-lg) 0;
		}

		.divider-text {
			font-size: 0.6875rem;
		}

		.tool-card {
			padding: var(--space-md);
			gap: var(--space-md);
		}

		.production-card {
			padding: var(--space-md);
		}

		.production-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.niche-header {
			gap: var(--space-sm);
		}

	}
</style>
