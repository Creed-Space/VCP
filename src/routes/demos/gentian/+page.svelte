<script lang="ts">
	/**
	 * Gentian Demo — Portability
	 *
	 * Shows how VCP context travels across platforms.
	 * Factory worker in Barcelona learning guitar for stress relief.
	 * 4 steps: Meet, Set Context, Watch It Travel, Change Something.
	 */
	import { DemoWizard, StreamingChat } from '$lib/components/shared';

	const steps = [
		{ title: 'Meet Gentian', icon: 'fa-user' },
		{ title: 'Set His Context', icon: 'fa-sliders' },
		{ title: 'Watch It Travel', icon: 'fa-share-nodes' },
		{ title: 'Change Something', icon: 'fa-rotate' }
	];

	// Constraint toggles — shared between step 2 and step 4
	let timeLimited = $state(true);
	let noiseRestricted = $state(true);
	let budgetLimited = $state(true);
	let energyVariable = $state(true);

	// Step 4 override: noise restriction toggled off
	let step4NoiseOverride = $state(false);

	// Derived: effective noise restriction for step 4
	const effectiveNoise = $derived(step4NoiseOverride ? false : noiseRestricted);

	// Platform adaptations based on noise restriction
	const platforms = $derived.by(() => {
		const noisy = !effectiveNoise;
		return {
			justinguitar: {
				name: 'JustinGuitar',
				icon: 'fa-guitar',
				color: 'var(--color-success)',
				contextReceived: noisy
					? 'Budget limited, time limited, noise OK'
					: 'Budget limited, time limited, noise restricted',
				adaptation: noisy
					? 'Recommends strumming patterns, amp exercises, and full-volume chord progressions'
					: 'Recommends quiet fingerpicking exercises and free-tier content',
				detail: noisy
					? 'Electric guitar techniques now unlocked'
					: 'Filtered to acoustic-only, no-amp lessons'
			},
			yousician: {
				name: 'Yousician',
				icon: 'fa-headphones',
				color: 'var(--color-primary)',
				contextReceived: noisy
					? 'Energy variable, time limited, noise OK'
					: 'Energy variable, time limited, noise restricted',
				adaptation: noisy
					? 'Unlocks full-volume practice mode and longer sessions'
					: 'Schedules 15-min sessions post-shift, avoids loud strumming drills',
				detail: noisy
					? 'All practice modes available'
					: 'Quiet mode enforced, headphone prompts'
			},
			guitarshop: {
				name: 'Guitar Shop',
				icon: 'fa-store',
				color: 'var(--color-warning)',
				contextReceived: noisy
					? 'Budget limited, noise OK'
					: 'Budget limited, noise restricted',
				adaptation: noisy
					? 'Staff suggests electric guitars and starter amps within budget'
					: 'Staff suggests nylon-string guitar (quiet) within budget range',
				detail: noisy
					? 'Full catalogue browsing enabled'
					: 'Filtered to quiet instruments only'
			}
		};
	});

	// VCP context for the live chat, derived from wizard constraint state
	const vcpContext = $derived({
		personal_state: {
			cognitive_state: { value: 'focused', intensity: 3 },
			emotional_tone: { value: 'calm', intensity: 2 },
			energy_level: { value: energyVariable ? 'moderate' : 'rested', intensity: energyVariable ? 3 : 2 },
			perceived_urgency: { value: 'unhurried', intensity: 2 },
			body_signals: { value: 'neutral', intensity: 1 }
		},
		constraints: {
			time_limited: timeLimited,
			noise_restricted: noiseRestricted,
			budget_limited: budgetLimited,
			energy_variable: energyVariable
		},
		public_profile: {
			skill_level: 'beginner',
			weeks_learning: 8,
			goal: 'stress_relief',
			instrument: 'guitar'
		}
	});

	const constraintSummary = $derived.by(() => {
		const active: string[] = [];
		if (timeLimited) active.push('Time limited');
		if (noiseRestricted) active.push('Noise restricted');
		if (budgetLimited) active.push('Budget limited');
		if (energyVariable) active.push('Energy variable');
		return active;
	});
</script>

<svelte:head>
	<title>Gentian: Portability - VCP Demos</title>
	<meta name="description" content="See how VCP context travels with Gentian across guitar learning platforms -- one profile, every platform adapts." />
	<link rel="canonical" href="https://valuecontextprotocol.org/demos/gentian/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Gentian's Guitar Journey — VCP Demo" />
	<meta property="og:description" content="See how context travels across 4 music platforms. Set preferences once, every app adapts instantly." />
	<meta property="og:url" content="https://valuecontextprotocol.org/demos/gentian/" />
	<meta property="og:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Gentian's Guitar Journey — VCP Demo" />
	<meta name="twitter:description" content="See how context travels across 4 music platforms. Set preferences once, every app adapts instantly." />
</svelte:head>

<DemoWizard title="Gentian: Portability" badge="Portability" badgeVariant="success" {steps}>
	{#snippet children({ step })}
		{#if step === 0}
			<!-- ================================================ -->
			<!-- STEP 1: Meet Gentian -->
			<!-- ================================================ -->
			<div class="character-card">
				<div class="character-avatar">
					<i class="fa-solid fa-user-large" aria-hidden="true"></i>
				</div>
				<div class="character-info">
					<h2 class="character-name">Gentian</h2>
					<p class="character-tagline">Factory worker in Barcelona, learning guitar for stress relief</p>

					<div class="character-constraints">
						<div class="constraint-chip">
							<i class="fa-solid fa-clock" aria-hidden="true"></i>
							Shift work
						</div>
						<div class="constraint-chip">
							<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>
							Apartment (noise)
						</div>
						<div class="constraint-chip">
							<i class="fa-solid fa-wallet" aria-hidden="true"></i>
							Tight budget
						</div>
						<div class="constraint-chip">
							<i class="fa-solid fa-battery-half" aria-hidden="true"></i>
							Variable energy
						</div>
					</div>

					<div class="character-context">
						<div class="context-row">
							<span class="context-label">Goal</span>
							<span class="context-value">Learn guitar for stress relief</span>
						</div>
						<div class="context-row">
							<span class="context-label">Level</span>
							<span class="context-value">Beginner (8 weeks)</span>
						</div>
						<div class="context-row">
							<span class="context-label">Pace</span>
							<span class="context-value">Steady, 30-minute sessions</span>
						</div>
						<div class="context-row">
							<span class="context-label">Style</span>
							<span class="context-value">Hands-on, encouraging feedback</span>
						</div>
					</div>
				</div>
			</div>

			<div class="step-insight">
				<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
				<p>
					Gentian has real constraints that affect how he learns.
					Today, every platform would need him to re-enter these from scratch.
					VCP makes them portable.
				</p>
			</div>

		{:else if step === 1}
			<!-- ================================================ -->
			<!-- STEP 2: Set His Context -->
			<!-- ================================================ -->
			<div class="context-setup">
				<h3 class="step-heading">
					<i class="fa-solid fa-sliders" aria-hidden="true"></i>
					Gentian's Constraints
				</h3>
				<p class="step-desc">Toggle his real-world constraints. These travel with him across every platform.</p>

				<div class="toggle-grid">
					<button
						class="toggle-card"
						class:active={timeLimited}
						onclick={() => timeLimited = !timeLimited}
						aria-pressed={timeLimited}
						aria-label="Time limited constraint"
					>
						<div class="toggle-icon">
							<i class="fa-solid fa-clock" aria-hidden="true"></i>
						</div>
						<div class="toggle-content">
							<span class="toggle-label">Time limited</span>
							<span class="toggle-desc">Shift work, irregular schedule</span>
						</div>
						<div class="toggle-indicator" class:on={timeLimited}>
							{timeLimited ? 'ON' : 'OFF'}
						</div>
					</button>

					<button
						class="toggle-card"
						class:active={noiseRestricted}
						onclick={() => noiseRestricted = !noiseRestricted}
						aria-pressed={noiseRestricted}
						aria-label="Noise restricted constraint"
					>
						<div class="toggle-icon">
							<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>
						</div>
						<div class="toggle-content">
							<span class="toggle-label">Noise restricted</span>
							<span class="toggle-desc">Apartment with thin walls</span>
						</div>
						<div class="toggle-indicator" class:on={noiseRestricted}>
							{noiseRestricted ? 'ON' : 'OFF'}
						</div>
					</button>

					<button
						class="toggle-card"
						class:active={budgetLimited}
						onclick={() => budgetLimited = !budgetLimited}
						aria-pressed={budgetLimited}
						aria-label="Budget limited constraint"
					>
						<div class="toggle-icon">
							<i class="fa-solid fa-wallet" aria-hidden="true"></i>
						</div>
						<div class="toggle-content">
							<span class="toggle-label">Budget limited</span>
							<span class="toggle-desc">Factory wages, careful spending</span>
						</div>
						<div class="toggle-indicator" class:on={budgetLimited}>
							{budgetLimited ? 'ON' : 'OFF'}
						</div>
					</button>

					<button
						class="toggle-card"
						class:active={energyVariable}
						onclick={() => energyVariable = !energyVariable}
						aria-pressed={energyVariable}
						aria-label="Energy variable constraint"
					>
						<div class="toggle-icon">
							<i class="fa-solid fa-battery-half" aria-hidden="true"></i>
						</div>
						<div class="toggle-content">
							<span class="toggle-label">Energy variable</span>
							<span class="toggle-desc">Rotating shifts drain energy</span>
						</div>
						<div class="toggle-indicator" class:on={energyVariable}>
							{energyVariable ? 'ON' : 'OFF'}
						</div>
					</button>
				</div>

				<div class="context-summary">
					<div class="summary-header">
						<i class="fa-solid fa-suitcase" aria-hidden="true"></i>
						<span>This is what travels with Gentian</span>
					</div>
					<div class="summary-chips">
						{#each constraintSummary as constraint}
							<span class="summary-chip">{constraint}</span>
						{/each}
						{#if constraintSummary.length === 0}
							<span class="summary-empty">No constraints set</span>
						{/if}
					</div>
					<p class="summary-note">
						Stored once in his VCP profile. Every platform reads it. None stores a copy.
					</p>
				</div>
			</div>

		{:else if step === 2}
			<!-- ================================================ -->
			<!-- STEP 3: Watch It Travel -->
			<!-- ================================================ -->
			<div class="travel-demo">
				<h3 class="step-heading">
					<i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
					Three Platforms, One Context
				</h3>
				<p class="step-desc">
					Gentian visits three different services. Each one reads his VCP context and adapts accordingly.
				</p>

				<div class="platform-grid">
					{#each Object.entries(platforms) as [_key, platform]}
						<div class="platform-card">
							<div class="platform-header" style="border-color: {platform.color}">
								<i class="fa-solid {platform.icon}" style="color: {platform.color}" aria-hidden="true"></i>
								<span class="platform-name">{platform.name}</span>
							</div>
							<div class="platform-body">
								<div class="platform-section">
									<span class="platform-section-label">
										<i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
										Context received
									</span>
									<p class="platform-section-text">{platform.contextReceived}</p>
								</div>
								<div class="platform-divider"></div>
								<div class="platform-section">
									<span class="platform-section-label">
										<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
										Adaptation made
									</span>
									<p class="platform-section-text">{platform.adaptation}</p>
								</div>
								<div class="platform-detail">{platform.detail}</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Live Chat with Muse Persona -->
				<div class="live-chat-section">
					<h4 class="live-chat-heading">
						<i class="fa-solid fa-comments" aria-hidden="true"></i>
						Try It Live -- Ask the Muse
					</h4>
					<p class="live-chat-desc">
						Chat with an AI that reads Gentian's constraints in real time. Ask for a practice suggestion or lesson recommendation.
					</p>
					<StreamingChat
						systemContext={vcpContext}
						constitutionId="personal.growth"
						persona="muse"
						fallbackResponse="Based on your context: You're a beginner guitarist with limited time and noise constraints. I'd recommend starting with fingerpicking exercises -- they're quiet, don't need an amp, and you can do a focused 15-minute session after your shift."
						placeholder="Ask about your guitar learning..."
					/>
				</div>

				<div class="step-insight">
					<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
					<p>Same constraints, different adaptations. Each platform interprets the context for its own domain.</p>
				</div>
			</div>

		{:else if step === 3}
			<!-- ================================================ -->
			<!-- STEP 4: Change Something -->
			<!-- ================================================ -->
			<div class="change-demo">
				<h3 class="step-heading">
					<i class="fa-solid fa-rotate" aria-hidden="true"></i>
					One Change, Every Platform Adapts
				</h3>
				<p class="step-desc">
					Gentian moved to a detached house. Toggle his noise restriction off and watch every platform respond.
				</p>

				<div class="change-trigger">
					<div class="change-scenario">
						<i class="fa-solid fa-house" aria-hidden="true"></i>
						<div>
							<strong>Gentian moved to a detached house</strong>
							<p>No more thin walls, no more noise complaints.</p>
						</div>
					</div>
					<button
						class="change-toggle-btn"
						class:toggled={step4NoiseOverride}
						onclick={() => step4NoiseOverride = !step4NoiseOverride}
						aria-pressed={step4NoiseOverride}
						aria-label="Toggle noise restriction off"
					>
						<span class="change-toggle-track">
							<span class="change-toggle-thumb"></span>
						</span>
						<span class="change-toggle-label">
							{step4NoiseOverride ? 'Noise restriction OFF' : 'Noise restriction ON'}
						</span>
					</button>
				</div>

				<div class="platform-grid">
					{#each Object.entries(platforms) as [_key, platform]}
						<div class="platform-card" class:changed={step4NoiseOverride}>
							<div class="platform-header" style="border-color: {platform.color}">
								<i class="fa-solid {platform.icon}" style="color: {platform.color}" aria-hidden="true"></i>
								<span class="platform-name">{platform.name}</span>
								{#if step4NoiseOverride}
									<span class="updated-badge">
										<i class="fa-solid fa-bolt" aria-hidden="true"></i>
										Updated
									</span>
								{/if}
							</div>
							<div class="platform-body">
								<div class="platform-section">
									<span class="platform-section-label">
										<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
										Adaptation
									</span>
									<p class="platform-section-text">{platform.adaptation}</p>
								</div>
								<div class="platform-detail">{platform.detail}</div>
							</div>
						</div>
					{/each}
				</div>

				{#if step4NoiseOverride}
					<div class="payoff-callout">
						<i class="fa-solid fa-check-circle" aria-hidden="true"></i>
						<div>
							<strong>One change. Every platform adapted. No re-onboarding.</strong>
							<p>
								Gentian updated his noise restriction once. JustinGuitar, Yousician, and the guitar shop
								all read the updated context and adjusted their recommendations instantly.
							</p>
						</div>
					</div>
				{:else}
					<div class="step-insight">
						<i class="fa-solid fa-hand-pointer" aria-hidden="true"></i>
						<p>Toggle the switch above to see what happens when Gentian's constraint changes.</p>
					</div>
				{/if}
			</div>
		{/if}
	{/snippet}
</DemoWizard>

<style>
	/* ============================================ */
	/* Character Card (Step 1) */
	/* ============================================ */
	.character-card {
		display: flex;
		gap: var(--space-xl);
		align-items: flex-start;
	}

	.character-avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-success), var(--color-primary));
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.character-avatar i {
		font-size: 2rem;
		color: white;
	}

	.character-info {
		flex: 1;
	}

	.character-name {
		font-size: var(--text-xl);
		margin: 0 0 var(--space-xs);
	}

	.character-tagline {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		margin: 0 0 var(--space-lg);
	}

	.character-constraints {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.constraint-chip {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xs) var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-full);
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.constraint-chip i {
		color: var(--color-warning);
		font-size: 0.75rem;
	}

	.character-context {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.context-row {
		display: flex;
		gap: var(--space-md);
		font-size: 0.875rem;
	}

	.context-label {
		color: var(--color-text-subtle);
		min-width: 60px;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.6875rem;
		letter-spacing: 0.05em;
		padding-top: 2px;
	}

	.context-value {
		color: var(--color-text);
	}

	/* ============================================ */
	/* Step Insight */
	/* ============================================ */
	.step-insight {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-lg);
		background: var(--color-primary-muted);
		border-radius: var(--radius-lg);
		margin-top: var(--space-xl);
	}

	.step-insight i {
		color: var(--color-primary);
		font-size: 1.25rem;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.step-insight p {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--color-text);
	}

	/* ============================================ */
	/* Step Heading/Desc */
	/* ============================================ */
	.step-heading {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 1.125rem;
		margin: 0 0 var(--space-xs);
	}

	.step-heading i {
		color: var(--color-primary);
	}

	.step-desc {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		margin: 0 0 var(--space-xl);
	}

	/* ============================================ */
	/* Toggle Grid (Step 2) */
	/* ============================================ */
	.toggle-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
		margin-bottom: var(--space-xl);
	}

	.toggle-card {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg-elevated);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--transition-fast);
		text-align: left;
		color: var(--color-text);
		width: 100%;
	}

	.toggle-card:hover {
		border-color: var(--color-primary);
	}

	.toggle-card.active {
		border-color: var(--color-success);
		background: rgba(34, 197, 94, 0.05);
	}

	.toggle-icon {
		width: 40px;
		height: 40px;
		border-radius: var(--radius-md);
		background: rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.toggle-card.active .toggle-icon {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	.toggle-content {
		flex: 1;
		min-width: 0;
	}

	.toggle-label {
		display: block;
		font-weight: 600;
		font-size: 0.875rem;
		margin-bottom: 2px;
	}

	.toggle-desc {
		display: block;
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.toggle-indicator {
		font-size: 0.6875rem;
		font-weight: 700;
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.1);
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.toggle-indicator.on {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	/* ============================================ */
	/* Context Summary */
	/* ============================================ */
	.context-summary {
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.summary-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-weight: 600;
		font-size: 0.875rem;
		margin-bottom: var(--space-md);
	}

	.summary-header i {
		color: var(--color-primary);
	}

	.summary-chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.summary-chip {
		padding: var(--space-xs) var(--space-md);
		background: var(--color-success-muted);
		color: var(--color-success);
		border-radius: var(--radius-full);
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.summary-empty {
		color: var(--color-text-muted);
		font-size: 0.8125rem;
		font-style: italic;
	}

	.summary-note {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-subtle);
	}

	/* ============================================ */
	/* Platform Grid (Steps 3 & 4) */
	/* ============================================ */
	.platform-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.platform-card {
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: all var(--transition-fast);
	}

	.platform-card.changed {
		border-color: var(--color-success);
		box-shadow: 0 0 16px rgba(34, 197, 94, 0.15);
	}

	.platform-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md) var(--space-lg);
		border-bottom: 2px solid;
		background: var(--color-bg-card);
	}

	.platform-name {
		font-weight: 600;
		font-size: 0.875rem;
		flex: 1;
	}

	.updated-badge {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 0.6875rem;
		padding: 2px 8px;
		background: var(--color-success-muted);
		color: var(--color-success);
		border-radius: var(--radius-sm);
		font-weight: 600;
	}

	.platform-body {
		padding: var(--space-lg);
	}

	.platform-section {
		margin-bottom: var(--space-md);
	}

	.platform-section-label {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		font-weight: 600;
		margin-bottom: var(--space-xs);
	}

	.platform-section-text {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-text);
	}

	.platform-divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.08);
		margin: var(--space-md) 0;
	}

	.platform-detail {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		padding: var(--space-sm);
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--radius-sm);
	}

	/* ============================================ */
	/* Live Chat Section */
	/* ============================================ */
	.live-chat-section {
		margin-top: var(--space-xl);
		margin-bottom: var(--space-lg);
	}

	.live-chat-heading {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 1rem;
		margin: 0 0 var(--space-xs);
	}

	.live-chat-heading i {
		color: var(--color-success);
	}

	.live-chat-desc {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		margin: 0 0 var(--space-md);
	}

	/* ============================================ */
	/* Change Trigger (Step 4) */
	/* ============================================ */
	.change-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-xl);
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-xl);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.change-scenario {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.change-scenario i {
		font-size: 1.5rem;
		color: var(--color-success);
	}

	.change-scenario strong {
		display: block;
		font-size: 0.9375rem;
		margin-bottom: 2px;
	}

	.change-scenario p {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.change-toggle-btn {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--space-sm);
		flex-shrink: 0;
		color: var(--color-text);
	}

	.change-toggle-track {
		width: 48px;
		height: 26px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: var(--radius-full);
		position: relative;
		transition: background var(--transition-fast);
	}

	.change-toggle-btn.toggled .change-toggle-track {
		background: var(--color-success);
	}

	.change-toggle-thumb {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 50%;
		transition: transform var(--transition-fast);
	}

	.change-toggle-btn.toggled .change-toggle-thumb {
		transform: translateX(22px);
	}

	.change-toggle-label {
		font-size: 0.8125rem;
		font-weight: 600;
		white-space: nowrap;
	}

	/* ============================================ */
	/* Payoff Callout */
	/* ============================================ */
	.payoff-callout {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-lg);
		background: var(--color-success-muted);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-success);
	}

	.payoff-callout i {
		color: var(--color-success);
		font-size: 1.5rem;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.payoff-callout strong {
		display: block;
		font-size: 1rem;
		margin-bottom: var(--space-xs);
	}

	.payoff-callout p {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text-muted);
	}

	/* ============================================ */
	/* Responsive */
	/* ============================================ */
	@media (max-width: 900px) {
		.platform-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.character-card {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.character-constraints {
			justify-content: center;
		}

		.character-context {
			align-items: center;
		}

		.toggle-grid {
			grid-template-columns: 1fr;
		}

		.platform-grid {
			grid-template-columns: 1fr;
		}

		.change-trigger {
			flex-direction: column;
			text-align: center;
		}

		.change-scenario {
			flex-direction: column;
		}

		.character-avatar {
			width: 60px;
			height: 60px;
		}

		.character-avatar i {
			font-size: 1.5rem;
		}

		.toggle-card {
			padding: var(--space-md);
		}

		.constraint-chip {
			font-size: 0.75rem;
			padding: var(--space-xs) var(--space-sm);
		}
	}

	@media (max-width: 480px) {
		.character-name {
			font-size: var(--text-lg);
		}

		.character-tagline {
			font-size: 0.875rem;
		}

		.step-heading {
			font-size: 1rem;
		}

		.step-desc {
			font-size: 0.8125rem;
		}

		.toggle-icon {
			width: 36px;
			height: 36px;
			font-size: 0.875rem;
		}

		.toggle-label {
			font-size: 0.8125rem;
		}

		.toggle-desc {
			font-size: 0.6875rem;
		}

		.change-toggle-label {
			font-size: 0.75rem;
		}

		.context-label {
			min-width: 50px;
			font-size: 0.625rem;
		}

		.context-value {
			font-size: 0.8125rem;
		}

		.platform-body {
			padding: var(--space-md);
		}

		.platform-section-label {
			font-size: 0.6875rem;
		}

		.platform-section-text {
			font-size: 0.8125rem;
		}

		.platform-detail {
			font-size: 0.6875rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.change-toggle-thumb,
		.change-toggle-track,
		.platform-card {
			transition: none;
		}
	}
</style>
