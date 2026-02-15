<script lang="ts">
	/**
	 * About VCP - Overview page explaining the protocol
	 * Leads with the portability/adaptation/liveness triangle
	 */
	import { Breadcrumb, NextSteps, MorphBlob, ScrollReveal } from '$lib/components/shared';

	const breadcrumbItems = [
		{ label: 'About VCP', icon: 'fa-circle-info' }
	];

	const pillars = [
		{
			icon: 'fa-suitcase-rolling',
			title: 'Portability',
			description: 'Define your context once. Every AI and service you use receives it automatically — no re-entry, no repetition.',
			color: 'var(--color-primary)'
		},
		{
			icon: 'fa-arrows-rotate',
			title: 'Adaptation',
			description: 'Context switches with your situation. Work mode at the office, personal mode at home — the right profile activates automatically.',
			color: 'var(--color-professional, #059669)'
		},
		{
			icon: 'fa-signal',
			title: 'Liveness',
			description: 'Your real-time state shapes AI guidance moment to moment. Rushed? Stressed? The AI adjusts its tone and depth instantly.',
			color: '#3b82f6'
		}
	];

	const layers = [
		{
			icon: 'fa-shield-halved',
			title: 'Constitutional Rules',
			subtitle: 'What the AI should and should not do.',
			examples: 'Personas, safety boundaries, rulesets, adherence levels',
			timescale: 'Changes rarely',
			colorClass: 'layer-constitutional'
		},
		{
			icon: 'fa-compass',
			title: 'Situational Context',
			subtitle: 'Where, when, who, what occasion.',
			examples: 'Morning vs. evening, alone vs. with children, home vs. work',
			timescale: 'Changes per session',
			colorClass: 'layer-situational'
		},
		{
			icon: 'fa-fingerprint',
			title: 'Personal State',
			subtitle: 'How you are right now.',
			examples: 'Cognitive load, emotional tone, energy, urgency, body state',
			timescale: 'Changes moment to moment',
			colorClass: 'layer-personal'
		}
	];

	const demos = [
		{
			href: '/demos/gentian',
			icon: 'fa-guitar',
			pillar: 'Portability',
			title: "Gentian's Guitar Journey",
			description: 'One learner, four apps, zero re-entry'
		},
		{
			href: '/demos/campion',
			icon: 'fa-briefcase',
			pillar: 'Adaptation',
			title: "Campion's Corporate Training",
			description: 'Dual profiles that switch automatically'
		},
		{
			href: '/demos/marta',
			icon: 'fa-handshake-angle',
			pillar: 'Liveness',
			title: "Marta's Family Decision",
			description: 'Real-time state shapes live AI guidance'
		},
		{
			href: '/demos/ren',
			icon: 'fa-bolt',
			pillar: 'Multi-Agent',
			title: "Ren's Energy Cooperative",
			description: 'AI agents carry values into negotiation'
		},
		{
			href: '/demos/noor',
			icon: 'fa-scale-balanced',
			pillar: 'Governance',
			title: "Noor's School District",
			description: 'Values become enforceable AI constraints'
		},
		{
			href: '/demos/hana',
			icon: 'fa-stethoscope',
			pillar: 'Epistemics',
			title: "Dr. Hana's Diagnostic Tool",
			description: 'See what the AI actually knows vs. guesses'
		}
	];

	const nextSteps = [
		{
			href: '/demos',
			icon: 'fa-play-circle',
			title: 'Try the Demos',
			description: 'See VCP in action across six real scenarios',
			primary: true
		},
		{
			href: '/playground',
			icon: 'fa-sliders',
			title: 'Build a Token',
			description: 'Create and inspect VCP tokens interactively'
		},
		{
			href: '/docs',
			icon: 'fa-book',
			title: 'Read the Docs',
			description: 'Protocol specification and integration guides'
		}
	];
</script>

<svelte:head>
	<title>About VCP - Value Context Protocol</title>
	<meta name="description" content="Learn about the Value Context Protocol — a context protocol that lets your preferences, constraints, and state travel with you across every AI and service." />
</svelte:head>

<div class="container">
	<Breadcrumb items={breadcrumbItems} />

	<!-- Hero -->
	<section class="page-hero about-hero">
		<MorphBlob
			size={500}
			colors={['rgba(99, 102, 241, 0.15)', 'rgba(139, 92, 246, 0.08)']}
			duration={15}
			opacity={0.7}
			blur={50}
		/>
		<h1>What is VCP?</h1>
		<p class="page-hero-subtitle">
			A protocol for portable, adaptive, live context across AI and services.
		</p>
		<p class="page-hero-explainer">
			VCP is not a product. It is an open protocol that lets you define your preferences,
			constraints, and current state once — and have every compatible AI and service adapt
			to you automatically, in real time.
		</p>
	</section>

	<!-- Three Pillars -->
	<section class="content-section">
		<h2>Three Properties That Matter</h2>
		<p class="section-intro">
			Today your context is fragmented across services, static, and invisible.
			VCP makes it portable, adaptive, and live.
		</p>

		<div class="pillar-grid">
			{#each pillars as pillar, i}
				<ScrollReveal direction="up" delay={i * 120}>
					<div class="pillar-card">
						<span class="pillar-icon" style="color: {pillar.color}">
							<i class="fa-solid {pillar.icon}" aria-hidden="true"></i>
						</span>
						<h3>{pillar.title}</h3>
						<p>{pillar.description}</p>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</section>

	<!-- How It Works -->
	<section class="content-section">
		<h2>How It Works</h2>
		<p class="section-intro">
			You declare your context. VCP encodes it as structured data.
			Services read the flags and adapt — without seeing the private reasons behind them.
		</p>

		<div class="how-it-works">
			<div class="step">
				<div class="step-number">1</div>
				<h3>You Set Context</h3>
				<p>
					Define your goals, constraints, and current state.
					Mark what is shareable and what stays private.
				</p>
			</div>
			<div class="step-arrow">
				<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
			</div>
			<div class="step">
				<div class="step-number">2</div>
				<h3>VCP Encodes It</h3>
				<p>
					Private circumstances become categorical flags.
					"Thin walls" becomes <code>noise_restricted</code>.
					The flag travels. Your story stays home.
				</p>
			</div>
			<div class="step-arrow">
				<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
			</div>
			<div class="step">
				<div class="step-number">3</div>
				<h3>Services Adapt</h3>
				<p>
					Every compatible app and AI reads the flags and adjusts.
					When your state changes, every service updates in real time.
				</p>
			</div>
		</div>
	</section>

	<!-- Protocol Stack -->
	<section class="content-section">
		<h2>The Protocol Stack</h2>
		<p class="section-intro">
			VCP is a four-layer protocol stack — like the OSI model but for AI values.
		</p>

		<div class="how-it-works" style="justify-content: center;">
			<div class="step">
				<div class="step-number" style="background: rgba(139, 92, 246, 0.8);">I</div>
				<h3>VCP/I — Identity</h3>
				<p>Token naming, namespaces, and registry. <em>What is it called?</em></p>
			</div>
			<div class="step-arrow">
				<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
			</div>
			<div class="step">
				<div class="step-number" style="background: rgba(59, 130, 246, 0.8);">T</div>
				<h3>VCP/T — Transport</h3>
				<p>Signed bundles, verify-then-inject. <em>How is it delivered safely?</em></p>
			</div>
			<div class="step-arrow">
				<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
			</div>
			<div class="step">
				<div class="step-number" style="background: rgba(16, 185, 129, 0.8);">S</div>
				<h3>VCP/S — Semantics</h3>
				<p>CSM-1 grammar, personas, composition. <em>What does it mean?</em></p>
			</div>
			<div class="step-arrow">
				<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
			</div>
			<div class="step">
				<div class="step-number" style="background: rgba(251, 191, 36, 0.8);">A</div>
				<h3>VCP/A — Adaptation</h3>
				<p>Context encoding, state tracking. <em>When and how does it apply?</em></p>
			</div>
		</div>
	</section>

	<!-- Three-Layer Model -->
	<section class="content-section">
		<h2>The Three-Layer Model</h2>
		<p class="section-intro">
			Within the Adaptation layer, VCP organizes context at three timescales — stable rules, shifting situations,
			and moment-to-moment state.
		</p>

		<div class="three-layer-grid">
			{#each layers as layer}
				<div class="layer-box {layer.colorClass}">
					<div class="layer-header">
						<span class="layer-icon">
							<i class="fa-solid {layer.icon}" aria-hidden="true"></i>
						</span>
						<h3>{layer.title}</h3>
					</div>
					<p><strong>{layer.subtitle}</strong></p>
					<p class="layer-examples">{layer.examples}</p>
					<p class="layer-timescale"><em>{layer.timescale}</em></p>
				</div>
			{/each}
		</div>
	</section>

	<!-- What Makes It Different -->
	<section class="content-section">
		<h2>Not a Magic Mirror</h2>
		<p class="section-intro">
			You declare your context.
			The AI adapts to what you share, not to what it guesses.
		</p>

		<div class="contrast-table">
			<div class="contrast-row contrast-header">
				<div class="contrast-cell">Common Approaches</div>
				<div class="contrast-cell">VCP Approach</div>
			</div>
			<div class="contrast-row">
				<div class="contrast-cell">AI infers your state</div>
				<div class="contrast-cell">You <strong>declare</strong> your state</div>
			</div>
			<div class="contrast-row">
				<div class="contrast-cell">Context locked to one platform</div>
				<div class="contrast-cell">Context <strong>travels</strong> across platforms</div>
			</div>
			<div class="contrast-row">
				<div class="contrast-cell">Static profile, set and forget</div>
				<div class="contrast-cell"><strong>Live</strong> state, always current</div>
			</div>
			<div class="contrast-row">
				<div class="contrast-cell">Platform decides what to share</div>
				<div class="contrast-cell">You <strong>control</strong> what is shared</div>
			</div>
		</div>
	</section>

	<!-- MCP Integration -->
	<section class="content-section">
		<h2>Works With MCP</h2>
		<p class="section-intro">
			VCP integrates natively with the <strong>Model Context Protocol (MCP)</strong>.
			MCP is the delivery channel. VCP is the structured content it carries.
		</p>

		<div class="mcp-explainer">
			<div class="mcp-row">
				<div class="mcp-card">
					<span class="mcp-label">MCP</span>
					<h3>Transport</h3>
					<p>Connects AI agents to tools and data sources. The plumbing.</p>
				</div>
				<div class="mcp-plus">
					<i class="fa-solid fa-plus" aria-hidden="true"></i>
				</div>
				<div class="mcp-card">
					<span class="mcp-label mcp-label-vcp">VCP</span>
					<h3>Policy</h3>
					<p>Encodes values, context, and constitutional rules. The meaning.</p>
				</div>
			</div>
			<p class="mcp-result">
				Any MCP-compatible agent can call VCP tools to discover what constitutional rules apply,
				encode the current context, and adapt behaviour accordingly.
				VCP also integrates via REST API, export artifacts, and GPT Actions.
			</p>
		</div>
	</section>

	<!-- Demo Links -->
	<section class="content-section">
		<h2>See It In Action</h2>
		<p class="section-intro">
			Six scenarios showing portability, adaptation, and liveness in practice.
		</p>

		<div class="demo-link-grid">
			{#each demos as demo}
				<a href={demo.href} class="demo-link-card">
					<div class="demo-link-left">
						<span class="demo-link-icon">
							<i class="fa-solid {demo.icon}" aria-hidden="true"></i>
						</span>
						<div>
							<h3>{demo.title}</h3>
							<p>{demo.description}</p>
						</div>
					</div>
					<span class="demo-link-pillar">{demo.pillar}</span>
				</a>
			{/each}
		</div>
	</section>

	<NextSteps steps={nextSteps} />
</div>

<style>
	.about-hero {
		position: relative;
		overflow: visible;
	}

	.content-section {
		margin-bottom: var(--space-2xl);
	}

	.content-section h2 {
		text-align: center;
		margin-bottom: var(--space-xl);
	}

	.section-intro {
		text-align: center;
		color: var(--color-text-muted);
		max-width: 600px;
		margin: 0 auto var(--space-xl);
		line-height: 1.6;
	}

	/* Pillars */
	.pillar-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.pillar-card {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-xl);
		border: 1px solid rgba(255, 255, 255, 0.1);
		text-align: center;
	}

	.pillar-icon {
		font-size: 2.5rem;
		display: block;
		margin-bottom: var(--space-md);
	}

	.pillar-card h3 {
		margin-bottom: var(--space-sm);
		font-size: 1.25rem;
	}

	.pillar-card p {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	/* How It Works */
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
		font-size: 1.25rem;
		padding-top: var(--space-xl);
	}

	/* Three-layer grid */
	.three-layer-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.layer-box {
		padding: var(--space-lg);
		border-radius: var(--radius-lg);
		border: 1px solid;
	}

	.layer-constitutional {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05));
		border-color: rgba(139, 92, 246, 0.3);
	}

	.layer-situational {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
		border-color: rgba(59, 130, 246, 0.3);
	}

	.layer-personal {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
		border-color: rgba(16, 185, 129, 0.3);
	}

	.layer-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
	}

	.layer-icon {
		font-size: 1.25rem;
	}

	.layer-constitutional .layer-icon {
		color: rgba(139, 92, 246, 0.8);
	}

	.layer-situational .layer-icon {
		color: rgba(59, 130, 246, 0.8);
	}

	.layer-personal .layer-icon {
		color: rgba(16, 185, 129, 0.8);
	}

	.layer-box h3 {
		margin: 0;
		font-size: 1rem;
	}

	.layer-box p {
		font-size: var(--text-sm);
		margin: 0 0 var(--space-xs);
	}

	.layer-examples {
		color: var(--color-text-muted);
	}

	.layer-timescale {
		color: var(--color-text-muted);
		font-size: 0.8125rem;
	}

	/* Contrast table */
	.contrast-table {
		max-width: 600px;
		margin: 0 auto var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.contrast-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.contrast-header {
		background: var(--color-bg-elevated);
	}

	.contrast-header .contrast-cell {
		font-weight: 600;
		color: var(--color-text);
	}

	.contrast-cell {
		padding: var(--space-md);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.contrast-cell:first-child {
		border-right: 1px solid rgba(255, 255, 255, 0.05);
	}

	.contrast-row:last-child .contrast-cell {
		border-bottom: none;
	}

	/* MCP Integration */
	.mcp-explainer {
		max-width: 600px;
		margin: 0 auto;
	}

	.mcp-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.mcp-card {
		flex: 1;
		max-width: 240px;
		background: var(--color-bg-card);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		text-align: center;
	}

	.mcp-card h3 {
		font-size: 1rem;
		margin-bottom: var(--space-xs);
	}

	.mcp-card p {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		line-height: 1.5;
		margin: 0;
	}

	.mcp-label {
		display: inline-block;
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 2px 10px;
		border-radius: var(--radius-sm);
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
		margin-bottom: var(--space-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.mcp-label-vcp {
		background: rgba(139, 92, 246, 0.15);
		color: #a78bfa;
	}

	.mcp-plus {
		color: var(--color-text-muted);
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	.mcp-result {
		text-align: center;
		color: var(--color-text-muted);
		font-size: 0.875rem;
		line-height: 1.6;
		max-width: 520px;
		margin: 0 auto;
	}

	/* Demo links */
	.demo-link-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-md);
	}

	.demo-link-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg-card);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: var(--color-text);
		transition: all var(--transition-fast);
	}

	.demo-link-card:hover {
		border-color: var(--color-primary);
		text-decoration: none;
	}

	.demo-link-left {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.demo-link-icon {
		font-size: 1.25rem;
		color: var(--color-primary);
		flex-shrink: 0;
		width: 2rem;
		text-align: center;
	}

	.demo-link-card h3 {
		font-size: var(--text-sm);
		margin: 0 0 var(--space-xs);
	}

	.demo-link-card p {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.4;
	}

	.demo-link-pillar {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-primary);
		white-space: nowrap;
		padding: var(--space-xs) var(--space-sm);
		background: rgba(99, 102, 241, 0.1);
		border-radius: var(--radius-sm);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.pillar-grid,
		.three-layer-grid {
			grid-template-columns: 1fr;
		}

		.how-it-works {
			flex-direction: column;
		}

		.step-arrow {
			transform: rotate(90deg);
			padding: var(--space-sm) 0;
			text-align: center;
		}

		.mcp-row {
			flex-direction: column;
		}

		.mcp-plus {
			transform: rotate(90deg);
		}

		.mcp-card {
			max-width: 100%;
			width: 100%;
		}

		.demo-link-grid {
			grid-template-columns: 1fr;
		}

		.demo-link-card {
			flex-direction: column;
			align-items: flex-start;
		}

		.demo-link-pillar {
			align-self: flex-start;
		}
	}

	@media (max-width: 640px) {
		.contrast-row {
			grid-template-columns: 1fr;
		}

		.contrast-cell:first-child {
			border-right: none;
		}

		.step-arrow {
			display: flex;
			justify-content: center;
			width: 100%;
		}

		.mcp-card {
			overflow: hidden;
		}

		.demo-link-left {
			gap: var(--space-sm);
		}

		.section-title {
			font-size: 1.5rem;
		}
	}
</style>
