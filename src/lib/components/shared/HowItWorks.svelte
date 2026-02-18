<script lang="ts">
	/**
	 * HowItWorks Component — Portability-focused
	 * 3-step visual flow: You Define → It Travels → Services Adapt
	 */

	let visible = $state(false);
	let flowDiagramRef = $state<HTMLElement | null>(null);

	function handleIntersect(entries: IntersectionObserverEntry[]) {
		if (entries[0]?.isIntersecting) {
			visible = true;
		}
	}

	$effect(() => {
		if (typeof IntersectionObserver !== 'undefined' && flowDiagramRef) {
			const observer = new IntersectionObserver(handleIntersect, {
				threshold: 0.2
			});
			observer.observe(flowDiagramRef);
			return () => observer.disconnect();
		}
	});
</script>

<section class="how-it-works">
	<h2 class="section-title">How It Works</h2>
	<p class="section-description">
		Define your context once. A compact token carries it everywhere. Every service adapts.
	</p>

	<div class="flow-diagram" class:visible bind:this={flowDiagramRef}>
		<!-- Step 1: You Define -->
		<div class="flow-step">
			<div class="step-header">
				<span class="step-number">1</span>
				<span class="step-title">You Define</span>
			</div>
			<div class="step-content">
				<div class="context-list">
					<div class="context-row">
						<span class="context-icon"><i class="fa-solid fa-bullseye" aria-hidden="true"></i></span>
						<span class="context-text">Goal: Learn guitar</span>
					</div>
					<div class="context-row">
						<span class="context-icon"><i class="fa-solid fa-clock" aria-hidden="true"></i></span>
						<span class="context-text">Schedule: Tight (shift work)</span>
					</div>
					<div class="context-row">
						<span class="context-icon"><i class="fa-solid fa-battery-half" aria-hidden="true"></i></span>
						<span class="context-text">Energy: Low today</span>
					</div>
					<div class="context-row">
						<span class="context-icon"><i class="fa-solid fa-hand" aria-hidden="true"></i></span>
						<span class="context-text">Style: Hands-on learner</span>
					</div>
				</div>
				<p class="step-note">Your preferences, constraints, and current state</p>
			</div>
		</div>

		<!-- Arrow -->
		<div class="flow-arrow">
			<div class="arrow-line"></div>
			<div class="arrow-label">encode</div>
		</div>

		<!-- Step 2: It Travels -->
		<div class="flow-step">
			<div class="step-header">
				<span class="step-number">2</span>
				<span class="step-title">It Travels</span>
			</div>
			<div class="step-content step-travel">
				<div class="token-compact">
					<div class="token-icon"><i class="fa-solid fa-passport" aria-hidden="true"></i></div>
					<div class="token-label">VCP Token</div>
					<div class="token-size">~200 bytes</div>
				</div>
				<div class="travel-destinations">
					<div class="travel-arrow"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></div>
					<div class="destination-icons">
						<span class="dest-icon" title="Music learning app"><i class="fa-solid fa-music" aria-hidden="true"></i></span>
						<span class="dest-icon" title="Practice platform"><i class="fa-solid fa-headphones" aria-hidden="true"></i></span>
						<span class="dest-icon" title="Retail service"><i class="fa-solid fa-store" aria-hidden="true"></i></span>
					</div>
				</div>
				<p class="step-note">One compact token, every service</p>
			</div>
		</div>

		<!-- Arrow -->
		<div class="flow-arrow">
			<div class="arrow-line"></div>
			<div class="arrow-label">adapt</div>
		</div>

		<!-- Step 3: Services Adapt -->
		<div class="flow-step">
			<div class="step-header">
				<span class="step-number">3</span>
				<span class="step-title">Services Adapt</span>
			</div>
			<div class="step-content">
				<div class="adapt-list">
					<div class="adapt-row">
						<span class="adapt-platform"><i class="fa-solid fa-music" aria-hidden="true"></i></span>
						<span class="adapt-text">Quiet fingerpicking exercises, free tier</span>
					</div>
					<div class="adapt-row">
						<span class="adapt-platform"><i class="fa-solid fa-headphones" aria-hidden="true"></i></span>
						<span class="adapt-text">15-minute sessions for after shifts</span>
					</div>
					<div class="adapt-row">
						<span class="adapt-platform"><i class="fa-solid fa-store" aria-hidden="true"></i></span>
						<span class="adapt-text">Nylon-string guitar, within budget</span>
					</div>
				</div>
				<p class="step-note">Each service reads what it needs and adjusts</p>
			</div>
		</div>
	</div>
</section>

<style>
	.how-it-works {
		padding: var(--space-2xl) 0;
	}

	.section-title {
		text-align: center;
		margin-bottom: var(--space-sm);
	}

	.section-description {
		text-align: center;
		color: var(--color-text-muted);
		margin-bottom: var(--space-xl);
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
		line-height: var(--leading-relaxed);
		text-wrap: balance;
	}

	.flow-diagram {
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: var(--space-lg);
		padding: var(--space-lg) 0;
	}

	.flow-step {
		flex: 1;
		max-width: 300px;
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.5s ease, transform 0.5s ease;
	}

	/* Staggered animation */
	.flow-diagram.visible .flow-step:nth-child(1) {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 0s;
	}

	.flow-diagram.visible .flow-step:nth-child(3) {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 0.2s;
	}

	.flow-diagram.visible .flow-step:nth-child(5) {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 0.4s;
	}

	.flow-diagram.visible .flow-arrow {
		opacity: 1;
	}

	.step-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: rgba(255, 255, 255, 0.05);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.step-number {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-primary);
		color: white;
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.step-title {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.step-content {
		padding: var(--space-md);
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.step-note {
		margin-top: auto;
		padding-top: var(--space-sm);
		font-size: 0.6875rem;
		color: var(--color-text-muted);
		text-align: center;
		font-style: italic;
	}

	/* Step 1: Context list */
	.context-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.context-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.03);
		font-size: 0.75rem;
	}

	.context-icon {
		color: var(--color-primary);
		font-size: 0.625rem;
		flex-shrink: 0;
		width: 16px;
		text-align: center;
	}

	.context-text {
		color: var(--color-text);
	}

	/* Step 2: Token travel */
	.step-travel {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
	}

	.token-compact {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-md);
		background: var(--color-primary-muted);
		border: 1px solid rgba(99, 102, 241, 0.3);
		border-radius: var(--radius-lg);
		width: 100%;
	}

	.token-icon {
		font-size: 1.5rem;
		color: var(--color-primary);
	}

	.token-label {
		font-weight: 600;
		font-size: 0.8125rem;
	}

	.token-size {
		font-size: 0.625rem;
		color: var(--color-text-muted);
		font-family: var(--font-mono);
	}

	.travel-destinations {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.travel-arrow {
		color: var(--color-primary);
		font-size: 0.875rem;
	}

	.destination-icons {
		display: flex;
		gap: var(--space-sm);
	}

	.dest-icon {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	/* Step 3: Adaptation list */
	.adapt-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.adapt-row {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		border-left: 2px solid var(--color-success);
		background: rgba(255, 255, 255, 0.03);
	}

	.adapt-platform {
		flex-shrink: 0;
		color: var(--color-text-muted);
		width: 16px;
		text-align: center;
	}

	.adapt-text {
		color: var(--color-text);
		line-height: 1.4;
	}

	/* Arrows */
	.flow-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		padding: 0 var(--space-md);
		opacity: 0;
		transition: opacity 0.5s ease 0.1s;
	}

	.arrow-line {
		width: 50px;
		height: 3px;
		background: linear-gradient(90deg, var(--color-primary), var(--color-primary-hover));
		position: relative;
		border-radius: 2px;
	}

	.arrow-line::after {
		content: '';
		position: absolute;
		right: -6px;
		top: -5px;
		border: 7px solid transparent;
		border-left-color: var(--color-primary-hover);
	}

	.arrow-label {
		font-size: var(--text-xs);
		text-transform: uppercase;
		color: var(--color-primary);
		letter-spacing: 0.1em;
		font-weight: 500;
	}

	/* Responsive */
	@media (max-width: 900px) {
		.flow-diagram {
			flex-direction: column;
			align-items: center;
			gap: var(--space-sm);
		}

		.flow-step {
			max-width: 100%;
			width: 100%;
		}

		.flow-diagram.visible .flow-step {
			opacity: 1;
			transform: translateY(0);
			transition-delay: 0s;
		}

		.flow-diagram.visible .flow-arrow {
			opacity: 1;
		}

		.flow-arrow {
			padding: var(--space-sm);
			flex-direction: row;
		}

		.arrow-line {
			width: 3px;
			height: 30px;
		}

		.arrow-line::after {
			right: auto;
			left: -5px;
			top: auto;
			bottom: -8px;
			border-left-color: transparent;
			border-top-color: var(--color-primary-hover);
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.flow-step,
		.flow-arrow {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
