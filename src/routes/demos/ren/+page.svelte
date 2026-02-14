<script lang="ts">
	/**
	 * Ren - Multi-Agent Energy Cooperative Demo
	 * Shows how AI agents carry VCP context in multi-agent negotiations.
	 */
	import { DemoWizard } from '$lib/components/shared';

	interface Agent {
		id: string;
		name: string;
		role: string;
		icon: string;
		color: string;
		values: string[];
		state: { label: string; value: string }[];
	}

	interface Bid {
		agentId: string;
		agentName: string;
		amount: number;
		reasoning: string;
		hookFired?: string;
		color: string;
	}

	interface ContextItem {
		label: string;
		visible: boolean;
		value: string;
	}

	const steps = [
		{ title: 'Meet the Agents', subtitle: 'Ren\'s solar cooperative and its AI agent fleet', icon: 'fa-users' },
		{ title: 'Watch the Auction', subtitle: 'See how carried context shapes bidding behavior', icon: 'fa-gavel' },
		{ title: 'See What Traveled', subtitle: 'What was shared, what stayed hidden', icon: 'fa-eye' }
	];

	const coopAgents: Agent[] = [
		{
			id: 'alpha',
			name: 'Agent Alpha',
			role: 'Grid Manager',
			icon: 'fa-bolt',
			color: 'var(--color-success)',
			values: ['Grid stability first', 'Avoid peak-load risk', 'Prefer renewable sources'],
			state: [
				{ label: 'Grid Stress', value: '72% capacity' },
				{ label: 'Battery Reserves', value: '45% charged' },
				{ label: 'Weather Forecast', value: 'Overcast next 6h' }
			]
		},
		{
			id: 'beta',
			name: 'Agent Beta',
			role: 'Market Bidder',
			icon: 'fa-chart-line',
			color: 'var(--color-primary)',
			values: ['Sustainability > pure profit', 'Community benefit weighted', 'Risk-averse bidding'],
			state: [
				{ label: 'Market Price', value: '0.12 DKK/kWh' },
				{ label: 'Budget Remaining', value: '82,000 DKK' },
				{ label: 'Bid Strategy', value: 'Conservative' }
			]
		},
		{
			id: 'gamma',
			name: 'Agent Gamma',
			role: 'Community Liaison',
			icon: 'fa-people-group',
			color: 'var(--color-warning)',
			values: ['Member satisfaction priority', 'Transparent cost reporting', 'Local supplier preference'],
			state: [
				{ label: 'Member Count', value: '347 households' },
				{ label: 'Satisfaction Score', value: '4.2 / 5.0' },
				{ label: 'Cost Target', value: '< 0.15 DKK/kWh' }
			]
		}
	];

	const competitorAgents = [
		{ id: 'rival1', name: 'GreenPower Corp', role: 'Commercial Trader', icon: 'fa-building', color: 'var(--color-text-muted)' },
		{ id: 'rival2', name: 'Nordic Grid Inc', role: 'Utility Aggregator', icon: 'fa-industry', color: 'var(--color-text-muted)' }
	];

	// Auction simulation state
	let auctionRound = $state(0);
	let isPlaying = $state(false);
	let playTimer: ReturnType<typeof setTimeout> | null = null;

	const auctionRounds: { round: number; blockType: string; blockLabel: string; bids: Bid[] }[] = [
		{
			round: 1,
			blockType: 'solar',
			blockLabel: 'Solar Block A (50 MWh, clean)',
			bids: [
				{ agentId: 'alpha', agentName: 'Agent Alpha', amount: 0.11, reasoning: 'Grid needs solar to offset overcast forecast. Bidding above market to secure.', color: 'var(--color-success)' },
				{ agentId: 'beta', agentName: 'Agent Beta', amount: 0.115, reasoning: 'Sustainability value weights this block highly. Within budget.', color: 'var(--color-primary)' },
				{ agentId: 'rival1', agentName: 'GreenPower Corp', amount: 0.105, reasoning: 'Standard market rate bid for resale margin.', color: 'var(--color-text-muted)' },
				{ agentId: 'rival2', agentName: 'Nordic Grid', amount: 0.108, reasoning: 'Moderate bid, no urgency for this block.', color: 'var(--color-text-muted)' }
			]
		},
		{
			round: 2,
			blockType: 'coal',
			blockLabel: 'Fossil Block B (80 MWh, cheap but dirty)',
			bids: [
				{ agentId: 'alpha', agentName: 'Agent Alpha', amount: 0, reasoning: 'Grid stress is high, but sustainability constraint overrides. Pass.', hookFired: 'sustainability_constraint', color: 'var(--color-success)' },
				{ agentId: 'beta', agentName: 'Agent Beta', amount: 0, reasoning: 'Coop values: sustainability > pure profit. Cannot bid on fossil energy.', hookFired: 'sustainability_constraint', color: 'var(--color-primary)' },
				{ agentId: 'rival1', agentName: 'GreenPower Corp', amount: 0.065, reasoning: 'Cheap energy = profit margin. No sustainability constraints.', color: 'var(--color-text-muted)' },
				{ agentId: 'rival2', agentName: 'Nordic Grid', amount: 0.07, reasoning: 'Utility needs met regardless of source.', color: 'var(--color-text-muted)' }
			]
		},
		{
			round: 3,
			blockType: 'wind',
			blockLabel: 'Wind Block C (30 MWh, premium clean)',
			bids: [
				{ agentId: 'gamma', agentName: 'Agent Gamma', amount: 0.14, reasoning: 'Community wants clean energy. Slightly above target but member satisfaction high.', color: 'var(--color-warning)' },
				{ agentId: 'beta', agentName: 'Agent Beta', amount: 0.135, reasoning: 'Risk-averse: premium wind is reliable. Good for portfolio.', color: 'var(--color-primary)' },
				{ agentId: 'rival1', agentName: 'GreenPower Corp', amount: 0.125, reasoning: 'Wind is popular for greenwashing. Low bid to test.', color: 'var(--color-text-muted)' },
				{ agentId: 'rival2', agentName: 'Nordic Grid', amount: 0.13, reasoning: 'Moderate interest, diversification play.', color: 'var(--color-text-muted)' }
			]
		}
	];

	const currentRound = $derived(auctionRounds[auctionRound] ?? null);
	const visibleBids = $derived(auctionRound > 0 ? auctionRounds.slice(0, auctionRound) : []);

	function advanceRound() {
		if (auctionRound < auctionRounds.length) {
			auctionRound++;
		}
	}

	function autoPlay() {
		if (isPlaying) {
			isPlaying = false;
			if (playTimer) clearTimeout(playTimer);
			return;
		}
		if (auctionRound >= auctionRounds.length) {
			auctionRound = 0;
		}
		isPlaying = true;
		function tick() {
			if (auctionRound < auctionRounds.length) {
				auctionRound++;
				playTimer = setTimeout(tick, 2500);
			} else {
				isPlaying = false;
			}
		}
		tick();
	}

	function resetAuction() {
		isPlaying = false;
		if (playTimer) clearTimeout(playTimer);
		auctionRound = 0;
	}

	$effect(() => {
		return () => {
			if (playTimer) clearTimeout(playTimer);
		};
	});

	// Step 3: Context visibility data
	const contextByAgent: { agentName: string; carried: ContextItem[]; hidden: ContextItem[] }[] = [
		{
			agentName: 'Agent Alpha (Grid Manager)',
			carried: [
				{ label: 'Grid stress level', visible: false, value: '72% capacity' },
				{ label: 'Battery reserves', visible: false, value: '45% charged' },
				{ label: 'Weather forecast', visible: true, value: 'Overcast 6h' },
				{ label: 'Sustainability constraint', visible: true, value: 'Active' }
			],
			hidden: [
				{ label: 'Grid failure threshold', visible: false, value: '92%' },
				{ label: 'Emergency reserve trigger', visible: false, value: '< 20% battery' },
				{ label: 'Max price authority', visible: false, value: '0.18 DKK/kWh' }
			]
		},
		{
			agentName: 'Agent Beta (Market Bidder)',
			carried: [
				{ label: 'Risk tolerance', visible: true, value: 'Conservative' },
				{ label: 'Sustainability weight', visible: true, value: 'High priority' },
				{ label: 'Budget status', visible: false, value: '82,000 DKK' },
				{ label: 'Community benefit factor', visible: true, value: '1.2x multiplier' }
			],
			hidden: [
				{ label: 'Total budget', visible: false, value: '100,000 DKK' },
				{ label: 'Bid ceiling per block', visible: false, value: '0.16 DKK/kWh' },
				{ label: 'Competitor analysis model', visible: false, value: 'Internal ML' }
			]
		},
		{
			agentName: 'Agent Gamma (Community Liaison)',
			carried: [
				{ label: 'Member count', visible: true, value: '347 households' },
				{ label: 'Satisfaction target', visible: true, value: '> 4.0 / 5.0' },
				{ label: 'Cost target', visible: true, value: '< 0.15 DKK/kWh' },
				{ label: 'Local preference', visible: true, value: 'Active' }
			],
			hidden: [
				{ label: 'Member complaint threshold', visible: false, value: '> 15 / month' },
				{ label: 'Internal cost ceiling', visible: false, value: '0.17 DKK/kWh' },
				{ label: 'Board override trigger', visible: false, value: 'Satisfaction < 3.5' }
			]
		}
	];
</script>

<svelte:head>
	<title>Ren: Multi-Agent Energy Market - VCP Demo</title>
	<meta name="description" content="See how AI agents carry cooperative values through VCP in a simulated energy market auction." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Ren's Energy Cooperative — VCP Demo" />
	<meta property="og:description" content="See AI agents negotiate energy bids carrying their cooperative's sustainability values as private context." />
	<meta property="og:image" content="/vcp-logo.png" />
	<meta property="twitter:card" content="summary_large_image" />
</svelte:head>

<DemoWizard title="Ren's Energy Cooperative" badge="Multi-Agent" badgeVariant="primary" {steps} onComplete={resetAuction}>
	{#snippet children({ step })}
		{#if step === 0}
			<!-- Step 1: Meet Ren & the Agents -->
			<div class="step-content">
				<div class="persona-intro">
					<div class="persona-avatar">
						<i class="fa-solid fa-wind" aria-hidden="true"></i>
					</div>
					<div class="persona-text">
						<h2>Meet Ren</h2>
						<p>
							Ren manages a solar cooperative in Denmark with 347 member households. Their cooperative
							participates in energy markets through three AI agents, each carrying the coop's shared values
							<em>and</em> real-time operational state via VCP.
						</p>
					</div>
				</div>

				<div class="values-banner">
					<h3><i class="fa-solid fa-heart" aria-hidden="true"></i> Cooperative Values (carried by all agents)</h3>
					<div class="values-list">
						<span class="value-chip"><i class="fa-solid fa-leaf" aria-hidden="true"></i> Sustainability > pure profit</span>
						<span class="value-chip"><i class="fa-solid fa-people-group" aria-hidden="true"></i> Community benefit weighted</span>
						<span class="value-chip"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Risk-averse strategy</span>
					</div>
				</div>

				<div class="agents-grid">
					{#each coopAgents as agent}
						<div class="agent-card" style="--agent-color: {agent.color}">
							<div class="agent-header">
								<div class="agent-icon">
									<i class="fa-solid {agent.icon}" aria-hidden="true"></i>
								</div>
								<div>
									<h4>{agent.name}</h4>
									<span class="agent-role">{agent.role}</span>
								</div>
							</div>

							<div class="agent-section">
								<span class="section-label">Values Carried</span>
								<ul class="agent-values">
									{#each agent.values as value}
										<li><i class="fa-solid fa-check" aria-hidden="true"></i> {value}</li>
									{/each}
								</ul>
							</div>

							<div class="agent-section">
								<span class="section-label">Real-Time State</span>
								<div class="agent-state">
									{#each agent.state as item}
										<div class="state-row">
											<span class="state-label">{item.label}</span>
											<span class="state-value">{item.value}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>

				<div class="step-callout">
					<i class="fa-solid fa-circle-info" aria-hidden="true"></i>
					<span>Each agent carries the same cooperative values, but different operational state. VCP ensures these travel with the agent into any negotiation.</span>
				</div>
			</div>

		{:else if step === 1}
			<!-- Step 2: Watch the Auction -->
			<div class="step-content">
				<div class="auction-controls">
					<button class="btn-auction" onclick={autoPlay} aria-label={isPlaying ? 'Pause auction' : 'Play auction'}>
						<i class="fa-solid {isPlaying ? 'fa-pause' : 'fa-play'}" aria-hidden="true"></i>
						{isPlaying ? 'Pause' : 'Auto-Play'}
					</button>
					<button class="btn-auction btn-auction-step" onclick={advanceRound} disabled={isPlaying || auctionRound >= auctionRounds.length} aria-label="Next round">
						<i class="fa-solid fa-forward-step" aria-hidden="true"></i>
						Next Round
					</button>
					<button class="btn-auction btn-auction-reset" onclick={resetAuction} aria-label="Reset auction">
						<i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
						Reset
					</button>
					<span class="round-counter" aria-live="polite">Round {auctionRound} / {auctionRounds.length}</span>
				</div>

				<div class="auction-progress">
					<div class="auction-progress-bar" style="width: {(auctionRound / auctionRounds.length) * 100}%"></div>
				</div>

				{#if auctionRound === 0}
					<div class="auction-waiting">
						<i class="fa-solid fa-gavel" aria-hidden="true"></i>
						<p>Press <strong>Auto-Play</strong> or <strong>Next Round</strong> to start the energy market auction.</p>
						<p class="auction-hint">Watch for Round 2 -- Ren's agents will pass on cheap fossil energy because their sustainability constraint fires.</p>
					</div>
				{/if}

				{#each visibleBids as round, i}
					<div class="round-card" class:hook-round={round.blockType === 'coal'}>
						<div class="round-header">
							<span class="round-number">Round {round.round}</span>
							<span class="block-label" class:fossil={round.blockType === 'coal'} class:clean={round.blockType !== 'coal'}>
								{#if round.blockType === 'coal'}
									<i class="fa-solid fa-smog" aria-hidden="true"></i>
								{:else if round.blockType === 'solar'}
									<i class="fa-solid fa-sun" aria-hidden="true"></i>
								{:else}
									<i class="fa-solid fa-wind" aria-hidden="true"></i>
								{/if}
								{round.blockLabel}
							</span>
						</div>

						<div class="bids-grid">
							{#each round.bids as bid}
								<div class="bid-card" class:passed={bid.amount === 0} class:hook-fired={bid.hookFired}>
									<div class="bid-agent" style="color: {bid.color}">
										<strong>{bid.agentName}</strong>
									</div>
									{#if bid.amount > 0}
										<div class="bid-amount">{bid.amount.toFixed(3)} DKK/kWh</div>
									{:else}
										<div class="bid-passed">PASS</div>
									{/if}
									<div class="bid-reasoning">{bid.reasoning}</div>
									{#if bid.hookFired}
										<div class="hook-badge">
											<i class="fa-solid fa-bolt" aria-hidden="true"></i>
											Hook fired: {bid.hookFired}
										</div>
									{/if}
								</div>
							{/each}
						</div>

						{#if round.blockType === 'coal'}
							<div class="hook-callout">
								<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
								<div>
									<strong>Sustainability constraint fired.</strong> Both of Ren's agents passed on the cheapest block in the auction.
									Their carried values made this decision automatic -- no human had to intervene.
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>

		{:else if step === 2}
			<!-- Step 3: See What Traveled -->
			<div class="step-content">
				<div class="reveal-intro">
					<h3>What each agent carried vs. what opponents could see</h3>
					<p>VCP gives agents control over their own context boundaries. Some information is shared to facilitate fair markets. Other information stays protected.</p>
				</div>

				<div class="context-grid">
					{#each contextByAgent as agentCtx}
						<div class="context-card">
							<h4>{agentCtx.agentName}</h4>

							<div class="context-section">
								<span class="context-section-label">
									<i class="fa-solid fa-eye" aria-hidden="true"></i> Carried Context
								</span>
								{#each agentCtx.carried as item}
									<div class="context-row">
										<span class="context-item-label">{item.label}</span>
										<span class="context-item-value">{item.value}</span>
										{#if item.visible}
											<span class="visibility-badge visible">
												<i class="fa-solid fa-unlock" aria-hidden="true"></i> Shared
											</span>
										{:else}
											<span class="visibility-badge hidden">
												<i class="fa-solid fa-lock" aria-hidden="true"></i> Private
											</span>
										{/if}
									</div>
								{/each}
							</div>

							<div class="context-section">
								<span class="context-section-label">
									<i class="fa-solid fa-eye-slash" aria-hidden="true"></i> Hidden from Opponents
								</span>
								{#each agentCtx.hidden as item}
									<div class="context-row hidden-row">
										<span class="context-item-label">{item.label}</span>
										<span class="context-item-value redacted">{item.value}</span>
										<span class="visibility-badge withheld">
											<i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Protected
										</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<div class="payoff-card">
					<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
					<div>
						<strong>The payoff:</strong> VCP is not just for humans. AI agents carry context too -- values,
						state, constraints, and strategy. That context shapes how they act, even when negotiating with
						other agents. And just like humans, agents get to decide what they share and what they protect.
					</div>
				</div>
			</div>
		{/if}
	{/snippet}
</DemoWizard>

<style>
	.step-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	/* Persona Intro */
	.persona-intro {
		display: flex;
		gap: var(--space-lg);
		align-items: center;
	}

	.persona-avatar {
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-primary-muted);
		border-radius: 50%;
		font-size: 2rem;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.persona-text h2 {
		margin: 0 0 var(--space-xs) 0;
		font-size: 1.25rem;
	}

	.persona-text p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	/* Values Banner */
	.values-banner {
		padding: var(--space-lg);
		background: var(--color-success-muted);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-success);
	}

	.values-banner h3 {
		margin: 0 0 var(--space-md) 0;
		font-size: 0.9375rem;
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		color: var(--color-success);
	}

	.values-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.value-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xs) var(--space-md);
		background: rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-full);
		font-size: 0.8125rem;
		font-weight: 500;
	}

	/* Agent Cards */
	.agents-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-md);
	}

	.agent-card {
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		border-top: 3px solid var(--agent-color);
	}

	.agent-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.agent-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg-card);
		border-radius: var(--radius-md);
		color: var(--agent-color);
		font-size: 1.125rem;
	}

	.agent-header h4 {
		margin: 0;
		font-size: 0.9375rem;
	}

	.agent-role {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.agent-section {
		margin-bottom: var(--space-md);
	}

	.section-label {
		display: block;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		margin-bottom: var(--space-xs);
		font-weight: 600;
	}

	.agent-values {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.agent-values li {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.agent-values li i {
		color: var(--color-success);
		font-size: 0.625rem;
	}

	.agent-state {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.state-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.8125rem;
	}

	.state-label {
		color: var(--color-text-muted);
	}

	.state-value {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text);
		font-weight: 500;
	}

	/* Step Callout */
	.step-callout {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--color-primary-muted);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		color: var(--color-text);
		line-height: 1.5;
	}

	.step-callout i {
		color: var(--color-primary);
		margin-top: 2px;
		flex-shrink: 0;
	}

	/* Auction Controls */
	.auction-controls {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.btn-auction {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm) var(--space-lg);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: opacity var(--transition-fast);
	}

	.btn-auction:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-auction:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-auction-step {
		background: var(--color-bg-elevated);
		color: var(--color-text);
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.btn-auction-reset {
		background: transparent;
		color: var(--color-text-muted);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.round-counter {
		margin-left: auto;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		font-family: var(--font-mono);
	}

	/* Auction Progress */
	.auction-progress {
		height: 4px;
		background: var(--color-bg-elevated);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.auction-progress-bar {
		height: 100%;
		background: var(--color-primary);
		border-radius: var(--radius-full);
		transition: width var(--transition-normal);
	}

	/* Auction Waiting */
	.auction-waiting {
		text-align: center;
		padding: var(--space-2xl);
		color: var(--color-text-muted);
	}

	.auction-waiting i {
		font-size: 3rem;
		opacity: 0.3;
		margin-bottom: var(--space-md);
		display: block;
	}

	.auction-waiting p {
		margin: 0 0 var(--space-sm) 0;
		font-size: 0.9375rem;
	}

	.auction-hint {
		font-size: 0.8125rem;
		color: var(--color-warning);
	}

	/* Round Cards */
	.round-card {
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.round-card.hook-round {
		border-color: var(--color-warning);
		background: rgba(245, 158, 11, 0.05);
	}

	.round-header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.round-number {
		font-weight: 700;
		font-size: 0.875rem;
		color: var(--color-text);
	}

	.block-label {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.8125rem;
		padding: var(--space-xs) var(--space-md);
		border-radius: var(--radius-full);
	}

	.block-label.clean {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	.block-label.fossil {
		background: var(--color-danger-muted);
		color: var(--color-danger);
	}

	/* Bids Grid */
	.bids-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-sm);
	}

	.bid-card {
		padding: var(--space-md);
		background: var(--color-bg-card);
		border-radius: var(--radius-md);
		border-left: 3px solid rgba(255, 255, 255, 0.1);
	}

	.bid-card.passed {
		opacity: 0.7;
	}

	.bid-card.hook-fired {
		border-left-color: var(--color-warning);
		background: rgba(245, 158, 11, 0.05);
	}

	.bid-agent {
		font-size: 0.8125rem;
		margin-bottom: var(--space-xs);
	}

	.bid-amount {
		font-family: var(--font-mono);
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-primary);
		margin-bottom: var(--space-xs);
	}

	.bid-passed {
		font-family: var(--font-mono);
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-danger);
		margin-bottom: var(--space-xs);
	}

	.bid-reasoning {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.hook-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		margin-top: var(--space-sm);
		padding: 2px var(--space-sm);
		background: var(--color-warning-muted);
		color: var(--color-warning);
		border-radius: var(--radius-sm);
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.hook-callout {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		margin-top: var(--space-md);
		padding: var(--space-md);
		background: var(--color-warning-muted);
		border-left: 3px solid var(--color-warning);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.hook-callout i {
		color: var(--color-warning);
		margin-top: 2px;
		flex-shrink: 0;
	}

	/* Step 3: Context Reveal */
	.reveal-intro {
		text-align: center;
		margin-bottom: var(--space-md);
	}

	.reveal-intro h3 {
		margin: 0 0 var(--space-xs) 0;
		font-size: 1.125rem;
	}

	.reveal-intro p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.9375rem;
	}

	.context-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.context-card {
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
	}

	.context-card h4 {
		margin: 0 0 var(--space-md) 0;
		font-size: 0.9375rem;
	}

	.context-section {
		margin-bottom: var(--space-md);
	}

	.context-section-label {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		margin-bottom: var(--space-xs);
		font-weight: 600;
	}

	.context-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
	}

	.context-row:nth-child(even) {
		background: rgba(255, 255, 255, 0.02);
	}

	.context-row.hidden-row {
		opacity: 0.8;
	}

	.context-item-label {
		flex: 1;
		color: var(--color-text-muted);
	}

	.context-item-value {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		min-width: 120px;
		text-align: right;
	}

	.context-item-value.redacted {
		color: var(--color-danger);
		text-decoration: line-through;
		opacity: 0.6;
	}

	.visibility-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 0.625rem;
		padding: 2px 6px;
		border-radius: var(--radius-sm);
		font-weight: 600;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.visibility-badge.visible {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	.visibility-badge.hidden {
		background: rgba(255, 255, 255, 0.05);
		color: var(--color-text-muted);
	}

	.visibility-badge.withheld {
		background: var(--color-danger-muted);
		color: var(--color-danger);
	}

	/* Payoff Card */
	.payoff-card {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-lg);
		background: var(--color-primary-muted);
		border-radius: var(--radius-lg);
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	.payoff-card i {
		color: var(--color-primary);
		font-size: 1.25rem;
		flex-shrink: 0;
		margin-top: 2px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.agents-grid {
			grid-template-columns: 1fr;
		}

		.bids-grid {
			grid-template-columns: 1fr;
		}

		.persona-intro {
			flex-direction: column;
			text-align: center;
		}

		.auction-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.round-counter {
			margin-left: 0;
			text-align: center;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.auction-progress-bar {
			transition: none;
		}
	}
</style>
