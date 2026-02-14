<script lang="ts">
	/**
	 * Marta Demo — Liveness
	 *
	 * Shows how VCP personal state shapes real-time AI guidance.
	 * Project manager dealing with a cousin's loan request.
	 * 4 steps: Meet, Set Her State, Get Guidance, What Traveled.
	 */
	import { DemoWizard } from '$lib/components/shared';
	import {
		responsibilityConstitution,
		getStewardResponse,
		getMartaPrivacyComparison
	} from '$lib/personas/marta';

	const steps = [
		{ title: 'Meet Marta', icon: 'fa-user' },
		{ title: 'Set Her State', icon: 'fa-sliders' },
		{ title: 'Get Guidance', icon: 'fa-comments' },
		{ title: 'What Traveled', icon: 'fa-magnifying-glass' }
	];

	// Personal state dimensions — shared between steps 2 and 3
	type CognitiveState = 'focused' | 'reflective' | 'overwhelmed' | 'foggy';
	type EmotionalState = 'calm' | 'conflicted' | 'tense' | 'anxious';
	type EnergyState = 'rested' | 'moderate' | 'low' | 'exhausted';
	type UrgencyState = 'unhurried' | 'aware' | 'high' | 'critical';

	let cognitive = $state<CognitiveState>('overwhelmed');
	let emotional = $state<EmotionalState>('conflicted');
	let energy = $state<EnergyState>('low');
	let urgency = $state<UrgencyState>('high');

	const cognitiveOptions: { value: CognitiveState; label: string; icon: string }[] = [
		{ value: 'focused', label: 'Focused', icon: 'fa-bullseye' },
		{ value: 'reflective', label: 'Reflective', icon: 'fa-brain' },
		{ value: 'overwhelmed', label: 'Overwhelmed', icon: 'fa-cloud' },
		{ value: 'foggy', label: 'Foggy', icon: 'fa-smog' }
	];

	const emotionalOptions: { value: EmotionalState; label: string; icon: string }[] = [
		{ value: 'calm', label: 'Calm', icon: 'fa-face-smile' },
		{ value: 'conflicted', label: 'Conflicted', icon: 'fa-scale-balanced' },
		{ value: 'tense', label: 'Tense', icon: 'fa-face-frown' },
		{ value: 'anxious', label: 'Anxious', icon: 'fa-face-grimace' }
	];

	const energyOptions: { value: EnergyState; label: string; icon: string }[] = [
		{ value: 'rested', label: 'Rested', icon: 'fa-battery-full' },
		{ value: 'moderate', label: 'Moderate', icon: 'fa-battery-half' },
		{ value: 'low', label: 'Low', icon: 'fa-battery-quarter' },
		{ value: 'exhausted', label: 'Exhausted', icon: 'fa-battery-empty' }
	];

	const urgencyOptions: { value: UrgencyState; label: string; icon: string }[] = [
		{ value: 'unhurried', label: 'Unhurried', icon: 'fa-hourglass' },
		{ value: 'aware', label: 'Aware', icon: 'fa-clock' },
		{ value: 'high', label: 'High', icon: 'fa-stopwatch' },
		{ value: 'critical', label: 'Critical', icon: 'fa-triangle-exclamation' }
	];

	// Derived: state summary for display
	const stateSummary = $derived({
		cognitive,
		emotional,
		energy,
		urgency
	});

	// Pre-scripted guidance responses keyed by state combinations
	const stewardBase = getStewardResponse();

	const guidance = $derived.by(() => {
		const isDistressed = energy === 'exhausted' || energy === 'low';
		const isHighUrgency = urgency === 'high' || urgency === 'critical';
		const isOverwhelmed = cognitive === 'overwhelmed' || cognitive === 'foggy';
		const isConflicted = emotional === 'conflicted' || emotional === 'anxious';

		// Adapt greeting based on energy
		let greeting = 'Marta,';
		if (isDistressed) {
			greeting = 'Marta, take a breath first.';
		} else if (isConflicted) {
			greeting = 'Marta, I can see this is weighing on you.';
		} else {
			greeting = "Marta, let's think through this together.";
		}

		// Adapt observation based on cognitive state
		let observation = '';
		if (isOverwhelmed && isHighUrgency) {
			observation = "You're running on fumes and the clock is ticking. I'm going to keep this short and concrete.";
		} else if (isOverwhelmed) {
			observation = "You're carrying a lot right now. I'll keep things simple.";
		} else if (isHighUrgency) {
			observation = "Your cousin needs an answer soon. Let's cut to what matters.";
		} else {
			observation = "You have some space to think this through. That's good.";
		}

		// Adapt core advice based on emotional state
		let coreAdvice = '';
		if (isConflicted && isDistressed) {
			coreAdvice = "When you're this drained, the guilt feels heavier than it is. Don't make a permanent financial decision from a temporary emotional state.";
		} else if (isConflicted) {
			coreAdvice = "The tightness you're feeling -- that's guilt, not obligation. They feel similar, but they lead to very different decisions.";
		} else if (emotional === 'tense') {
			coreAdvice = "Tension is your body telling you something. The question isn't what your cousin needs -- it's what you can sustain.";
		} else {
			coreAdvice = stewardBase.boundary_reframe;
		}

		// Adapt options based on energy
		let options = stewardBase.practical_options;
		if (isDistressed) {
			options = [
				{ id: 'defer', label: 'Ask for 24 hours', sustainability: 'high' as const, note: 'You need rest before this decision. A day won\'t change the situation.' },
				{ id: 'partial', label: 'Offer a smaller amount', sustainability: 'medium' as const, note: 'Something you can afford to lose, not lend.' },
				{ id: 'honest_no', label: 'Decline with love', sustainability: 'high' as const, note: 'A no delivered with love is still love.' }
			];
		}

		// Adapt communication style based on cognitive state
		let style = '';
		if (isOverwhelmed) {
			style = 'Concise, bullet-point format. No long paragraphs.';
		} else if (cognitive === 'reflective') {
			style = 'Deeper exploration, open questions, room to process.';
		} else {
			style = 'Clear structure with gentle framing.';
		}

		return {
			greeting,
			observation,
			coreAdvice,
			options,
			style,
			perspectiveShift: stewardBase.perspective_shift,
			isDistressed,
			isHighUrgency,
			isOverwhelmed
		};
	});

	// Privacy comparison for Step 4
	const privacy = getMartaPrivacyComparison();
</script>

<svelte:head>
	<title>Marta: Liveness - VCP Demos</title>
	<meta
		name="description"
		content="See how VCP personal state dimensions shape real-time AI guidance -- not a static profile, a living context."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Marta's Responsibility Journey — VCP Demo" />
	<meta property="og:description" content="Experience how real-time personal state shapes AI guidance during a family financial decision." />
	<meta property="og:image" content="/vcp-logo.png" />
	<meta property="twitter:card" content="summary_large_image" />
</svelte:head>

<DemoWizard title="Marta: Liveness" badge="Liveness" badgeVariant="warning" {steps}>
	{#snippet children({ step })}
		{#if step === 0}
			<!-- ================================================ -->
			<!-- STEP 1: Meet Marta -->
			<!-- ================================================ -->
			<div class="character-card">
				<div class="character-avatar">
					<i class="fa-solid fa-user" aria-hidden="true"></i>
				</div>
				<div class="character-info">
					<h2 class="character-name">Marta</h2>
					<p class="character-tagline">
						Project manager, eldest sibling. Her cousin just asked for a loan.
					</p>

					<div class="persona-badge-row">
						<div class="persona-badge">
							<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
							<div>
								<span class="persona-badge-label">Active Persona</span>
								<span class="persona-badge-name">Steward</span>
							</div>
						</div>
					</div>

					<div class="character-values">
						<h4 class="values-heading">Her values at stake</h4>
						<div class="values-list">
							<div class="value-chip">
								<i class="fa-solid fa-users" aria-hidden="true"></i>
								Family responsibility
							</div>
							<div class="value-chip">
								<i class="fa-solid fa-shield" aria-hidden="true"></i>
								Financial caution
							</div>
							<div class="value-chip">
								<i class="fa-solid fa-heart-crack" aria-hidden="true"></i>
								Guilt about saying no
							</div>
						</div>
					</div>

					<div class="scenario-box">
						<i class="fa-solid fa-phone" aria-hidden="true"></i>
						<div>
							<strong>The situation</strong>
							<p>
								Her cousin needs money. This isn't the first time. Marta is the one everyone comes to.
								She's weighing genuine obligation against guilt-driven over-giving.
							</p>
						</div>
					</div>
				</div>
			</div>

		{:else if step === 1}
			<!-- ================================================ -->
			<!-- STEP 2: Set Her State -->
			<!-- ================================================ -->
			<div class="state-setup">
				<h3 class="step-heading">
					<i class="fa-solid fa-sliders" aria-hidden="true"></i>
					Marta's State Right Now
				</h3>
				<p class="step-desc">
					Set her moment-to-moment state. This is what the AI reads to adapt its guidance.
				</p>

				<div class="dimension-grid">
					<!-- Cognitive -->
					<div class="dimension-card">
						<div class="dimension-header">
							<i class="fa-solid fa-brain" aria-hidden="true"></i>
							<span class="dimension-name">Cognitive</span>
						</div>
						<div class="dimension-options" role="radiogroup" aria-label="Cognitive state">
							{#each cognitiveOptions as opt}
								<button
									class="dim-option"
									class:selected={cognitive === opt.value}
									onclick={() => cognitive = opt.value}
									role="radio"
									aria-checked={cognitive === opt.value}
									aria-label={opt.label}
								>
									<i class="fa-solid {opt.icon}" aria-hidden="true"></i>
									<span>{opt.label}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Emotional -->
					<div class="dimension-card">
						<div class="dimension-header">
							<i class="fa-solid fa-heart-pulse" aria-hidden="true"></i>
							<span class="dimension-name">Emotional</span>
						</div>
						<div class="dimension-options" role="radiogroup" aria-label="Emotional state">
							{#each emotionalOptions as opt}
								<button
									class="dim-option"
									class:selected={emotional === opt.value}
									onclick={() => emotional = opt.value}
									role="radio"
									aria-checked={emotional === opt.value}
									aria-label={opt.label}
								>
									<i class="fa-solid {opt.icon}" aria-hidden="true"></i>
									<span>{opt.label}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Energy -->
					<div class="dimension-card">
						<div class="dimension-header">
							<i class="fa-solid fa-bolt" aria-hidden="true"></i>
							<span class="dimension-name">Energy</span>
						</div>
						<div class="dimension-options" role="radiogroup" aria-label="Energy state">
							{#each energyOptions as opt}
								<button
									class="dim-option"
									class:selected={energy === opt.value}
									onclick={() => energy = opt.value}
									role="radio"
									aria-checked={energy === opt.value}
									aria-label={opt.label}
								>
									<i class="fa-solid {opt.icon}" aria-hidden="true"></i>
									<span>{opt.label}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Urgency -->
					<div class="dimension-card">
						<div class="dimension-header">
							<i class="fa-solid fa-clock" aria-hidden="true"></i>
							<span class="dimension-name">Urgency</span>
						</div>
						<div class="dimension-options" role="radiogroup" aria-label="Urgency state">
							{#each urgencyOptions as opt}
								<button
									class="dim-option"
									class:selected={urgency === opt.value}
									onclick={() => urgency = opt.value}
									role="radio"
									aria-checked={urgency === opt.value}
									aria-label={opt.label}
								>
									<i class="fa-solid {opt.icon}" aria-hidden="true"></i>
									<span>{opt.label}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- State Summary -->
				<div class="state-summary">
					<div class="summary-header">
						<i class="fa-solid fa-signal" aria-hidden="true"></i>
						<span>Current State Vector</span>
					</div>
					<div class="state-chips">
						<span class="state-chip cognitive-chip">
							<i class="fa-solid fa-brain" aria-hidden="true"></i>
							{stateSummary.cognitive}
						</span>
						<span class="state-chip emotional-chip">
							<i class="fa-solid fa-heart-pulse" aria-hidden="true"></i>
							{stateSummary.emotional}
						</span>
						<span class="state-chip energy-chip">
							<i class="fa-solid fa-bolt" aria-hidden="true"></i>
							{stateSummary.energy}
						</span>
						<span class="state-chip urgency-chip">
							<i class="fa-solid fa-clock" aria-hidden="true"></i>
							{stateSummary.urgency}
						</span>
					</div>
					<p class="summary-note">
						This state travels with the request. The AI reads it before responding.
					</p>
				</div>
			</div>

		{:else if step === 2}
			<!-- ================================================ -->
			<!-- STEP 3: Get Guidance -->
			<!-- ================================================ -->
			<div class="guidance-scene">
				<div class="guidance-header">
					<div class="guidance-persona">
						<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
						<span>Steward Persona</span>
					</div>
					<div class="guidance-state-pills">
						<span class="state-pill">{cognitive}</span>
						<span class="state-pill">{emotional}</span>
						<span class="state-pill">{energy}</span>
						<span class="state-pill">{urgency}</span>
					</div>
				</div>

				<!-- Simulated Chat Response -->
				<div class="chat-response">
					<div class="chat-avatar">
						<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
					</div>
					<div class="chat-bubble">
						<p class="chat-greeting">{guidance.greeting}</p>
						<p class="chat-observation">{guidance.observation}</p>
						<p class="chat-core">{guidance.coreAdvice}</p>

						{#if guidance.isDistressed}
							<div class="chat-gentle-notice">
								<i class="fa-solid fa-hand-holding-heart" aria-hidden="true"></i>
								<span>Adapted for low energy: shorter options, gentler framing</span>
							</div>
						{/if}

						<div class="chat-options">
							<p class="chat-options-label">Your options:</p>
							{#each guidance.options as option}
								<div class="chat-option" class:high-sustainability={option.sustainability === 'high'}>
									<div class="option-header">
										<strong>{option.label}</strong>
										<span class="sustainability-badge" class:high={option.sustainability === 'high'} class:medium={option.sustainability === 'medium'} class:low={option.sustainability === 'low'}>
											{option.sustainability}
										</span>
									</div>
									<p class="option-note">{option.note}</p>
								</div>
							{/each}
						</div>

						<p class="chat-perspective">
							<i class="fa-solid fa-rotate" aria-hidden="true"></i>
							{guidance.perspectiveShift}
						</p>
					</div>
				</div>

				<!-- Communication Style Indicator -->
				<div class="style-indicator">
					<i class="fa-solid fa-comment-dots" aria-hidden="true"></i>
					<div>
						<strong>Communication style adapted:</strong>
						<p>{guidance.style}</p>
					</div>
				</div>

				<div class="step-insight">
					<i class="fa-solid fa-hand-pointer" aria-hidden="true"></i>
					<p>
						Go back to Step 2 and change Marta's state. Watch how the guidance adapts --
						different energy, different tone. Different urgency, different options.
					</p>
				</div>
			</div>

		{:else if step === 3}
			<!-- ================================================ -->
			<!-- STEP 4: What Traveled -->
			<!-- ================================================ -->
			<div class="audit-view">
				<h3 class="step-heading">
					<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
					What the AI Saw
				</h3>

				<div class="audit-columns">
					<!-- What AI Received -->
					<div class="audit-panel received">
						<h4>
							<i class="fa-solid fa-eye" aria-hidden="true"></i>
							Context Received
						</h4>

						<div class="audit-group">
							<span class="audit-group-label">Values (Steward persona)</span>
							<ul class="audit-items">
								<li>Constitution: {responsibilityConstitution.id}</li>
								<li>Persona: {responsibilityConstitution.persona}</li>
								<li>Adherence: {responsibilityConstitution.adherence}/5 (strict protection)</li>
								<li>Scopes: {responsibilityConstitution.scopes?.join(', ') ?? 'stewardship, privacy'}</li>
							</ul>
						</div>

						<div class="audit-group">
							<span class="audit-group-label">State Dimensions</span>
							<div class="audit-state-grid">
								<div class="audit-state-item">
									<span class="audit-dim-label">Cognitive</span>
									<span class="audit-dim-value">{cognitive}</span>
								</div>
								<div class="audit-state-item">
									<span class="audit-dim-label">Emotional</span>
									<span class="audit-dim-value">{emotional}</span>
								</div>
								<div class="audit-state-item">
									<span class="audit-dim-label">Energy</span>
									<span class="audit-dim-value">{energy}</span>
								</div>
								<div class="audit-state-item">
									<span class="audit-dim-label">Urgency</span>
									<span class="audit-dim-value">{urgency}</span>
								</div>
							</div>
						</div>

						<div class="audit-group">
							<span class="audit-group-label">Constraint Flags</span>
							<ul class="audit-items">
								<li>energy_variable: true</li>
								<li>time_limited: true</li>
							</ul>
						</div>
					</div>

					<!-- What AI Did NOT See -->
					<div class="audit-panel protected">
						<h4>
							<i class="fa-solid fa-eye-slash" aria-hidden="true"></i>
							What Stayed Private
						</h4>

						<ul class="audit-items redacted">
							{#each privacy.aiAdvisorSees.hidden as item}
								<li>
									<i class="fa-solid fa-lock" aria-hidden="true"></i>
									{item}
								</li>
							{/each}
						</ul>

						<div class="privacy-note">
							<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
							<p>
								Private context influenced the guidance
								(the AI had access to it locally) but was never transmitted
								externally. Family history, guilt patterns, and financial
								details are structurally protected.
							</p>
						</div>
					</div>
				</div>

				<!-- Payoff -->
				<div class="payoff-callout">
					<i class="fa-solid fa-check-circle" aria-hidden="true"></i>
					<div>
						<strong>Your moment-to-moment state shaped real-time guidance. Not a static profile -- a living context.</strong>
						<p>
							Marta's cognitive load, emotional state, energy level, and urgency all influenced
							the tone, length, and options the AI presented. Change any dimension and the guidance
							adapts. That's liveness.
						</p>
					</div>
				</div>
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
		background: linear-gradient(135deg, var(--color-warning), #f97316);
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

	.persona-badge-row {
		margin-bottom: var(--space-lg);
	}

	.persona-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--radius-lg);
		background: rgba(250, 204, 21, 0.08);
		border: 1px solid var(--color-warning);
	}

	.persona-badge i {
		color: var(--color-warning);
		font-size: 1.25rem;
	}

	.persona-badge-label {
		display: block;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
	}

	.persona-badge-name {
		display: block;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.character-values {
		margin-bottom: var(--space-lg);
	}

	.values-heading {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		margin: 0 0 var(--space-sm);
		font-weight: 600;
	}

	.values-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.value-chip {
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

	.value-chip i {
		font-size: 0.75rem;
		color: var(--color-warning);
	}

	.scenario-box {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		border-left: 3px solid var(--color-warning);
	}

	.scenario-box i {
		font-size: 1.25rem;
		color: var(--color-warning);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.scenario-box strong {
		display: block;
		font-size: 0.875rem;
		margin-bottom: var(--space-xs);
	}

	.scenario-box p {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text-muted);
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
	/* Dimension Grid (Step 2) */
	/* ============================================ */
	.dimension-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-lg);
		margin-bottom: var(--space-xl);
	}

	.dimension-card {
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.dimension-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-sm);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.dimension-header i {
		color: var(--color-primary);
	}

	.dimension-name {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.dimension-options {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xs);
	}

	.dim-option {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm) var(--space-md);
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		width: 100%;
		text-align: left;
	}

	.dim-option:hover {
		border-color: var(--color-primary);
		color: var(--color-text);
	}

	.dim-option.selected {
		background: var(--color-primary-muted);
		border-color: var(--color-primary);
		color: var(--color-primary);
		font-weight: 600;
	}

	.dim-option i {
		font-size: 0.75rem;
		width: 16px;
		text-align: center;
	}

	/* ============================================ */
	/* State Summary */
	/* ============================================ */
	.state-summary {
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

	.state-chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.state-chip {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xs) var(--space-md);
		border-radius: var(--radius-full);
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.state-chip i {
		font-size: 0.75rem;
	}

	.cognitive-chip {
		background: rgba(99, 102, 241, 0.15);
		color: var(--color-primary);
	}

	.emotional-chip {
		background: rgba(236, 72, 153, 0.15);
		color: #ec4899;
	}

	.energy-chip {
		background: rgba(250, 204, 21, 0.15);
		color: var(--color-warning);
	}

	.urgency-chip {
		background: rgba(239, 68, 68, 0.15);
		color: var(--color-danger);
	}

	.summary-note {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-subtle);
	}

	/* ============================================ */
	/* Guidance Scene (Step 3) */
	/* ============================================ */
	.guidance-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-md) var(--space-lg);
		background: rgba(250, 204, 21, 0.08);
		border: 1px solid var(--color-warning);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-xl);
	}

	.guidance-persona {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-weight: 600;
	}

	.guidance-persona i {
		color: var(--color-warning);
	}

	.guidance-state-pills {
		display: flex;
		gap: var(--space-xs);
	}

	.state-pill {
		font-size: 0.6875rem;
		padding: 2px 8px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		text-transform: capitalize;
	}

	/* Chat Response */
	.chat-response {
		display: flex;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.chat-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--color-warning);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.chat-avatar i {
		color: white;
		font-size: 1rem;
	}

	.chat-bubble {
		flex: 1;
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.chat-greeting {
		font-weight: 600;
		font-size: 1rem;
		margin: 0 0 var(--space-md);
	}

	.chat-observation {
		margin: 0 0 var(--space-md);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	.chat-core {
		margin: 0 0 var(--space-lg);
		font-size: 0.9375rem;
		line-height: 1.6;
		padding: var(--space-md);
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--radius-md);
		border-left: 3px solid var(--color-warning);
	}

	.chat-gentle-notice {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: rgba(250, 204, 21, 0.08);
		border-radius: var(--radius-md);
		font-size: 0.75rem;
		color: var(--color-warning);
		margin-bottom: var(--space-md);
	}

	.chat-options {
		margin-bottom: var(--space-lg);
	}

	.chat-options-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		font-weight: 600;
		margin: 0 0 var(--space-sm);
	}

	.chat-option {
		padding: var(--space-md);
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-sm);
		border-left: 3px solid rgba(255, 255, 255, 0.1);
	}

	.chat-option.high-sustainability {
		border-left-color: var(--color-success);
	}

	.option-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.option-header strong {
		font-size: 0.875rem;
	}

	.sustainability-badge {
		font-size: 0.6875rem;
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		font-weight: 500;
		text-transform: capitalize;
	}

	.sustainability-badge.high {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	.sustainability-badge.medium {
		background: rgba(250, 204, 21, 0.15);
		color: var(--color-warning);
	}

	.sustainability-badge.low {
		background: rgba(239, 68, 68, 0.15);
		color: var(--color-danger);
	}

	.option-note {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.chat-perspective {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin: 0;
		padding: var(--space-md);
		background: var(--color-primary-muted);
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		font-style: italic;
	}

	.chat-perspective i {
		color: var(--color-primary);
		flex-shrink: 0;
	}

	/* Style Indicator */
	.style-indicator {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.style-indicator i {
		color: var(--color-primary);
		font-size: 1rem;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.style-indicator strong {
		display: block;
		font-size: 0.8125rem;
		margin-bottom: 2px;
	}

	.style-indicator p {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	/* Step Insight */
	.step-insight {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-lg);
		background: var(--color-primary-muted);
		border-radius: var(--radius-lg);
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
	}

	/* ============================================ */
	/* Audit View (Step 4) */
	/* ============================================ */
	.audit-columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xl);
		margin-bottom: var(--space-xl);
	}

	.audit-panel {
		padding: var(--space-lg);
		border-radius: var(--radius-lg);
	}

	.audit-panel.received {
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-success);
	}

	.audit-panel.protected {
		background: var(--color-bg-elevated);
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.audit-panel h4 {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.9375rem;
		margin: 0 0 var(--space-lg);
	}

	.audit-panel.received h4 {
		color: var(--color-success);
	}

	.audit-panel.protected h4 {
		color: var(--color-text-muted);
	}

	.audit-group {
		margin-bottom: var(--space-lg);
	}

	.audit-group-label {
		display: block;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		font-weight: 600;
		margin-bottom: var(--space-sm);
	}

	.audit-items {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.audit-items li {
		font-size: 0.8125rem;
		padding: var(--space-xs) var(--space-sm);
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
	}

	.audit-items.redacted li {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		opacity: 0.7;
	}

	.audit-items.redacted li i {
		color: var(--color-text-subtle);
		font-size: 0.6875rem;
	}

	.audit-state-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-sm);
	}

	.audit-state-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-sm) var(--space-md);
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--radius-sm);
	}

	.audit-dim-label {
		font-size: 0.75rem;
		color: var(--color-text-subtle);
	}

	.audit-dim-value {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-primary);
		text-transform: capitalize;
	}

	.privacy-note {
		display: flex;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--radius-md);
		margin-top: var(--space-lg);
	}

	.privacy-note i {
		color: var(--color-warning);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.privacy-note p {
		margin: 0;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-text-muted);
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
	@media (max-width: 768px) {
		.character-card {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.values-list {
			justify-content: center;
		}

		.scenario-box {
			flex-direction: column;
			text-align: left;
		}

		.dimension-grid {
			grid-template-columns: 1fr;
		}

		.dimension-options {
			grid-template-columns: 1fr 1fr;
		}

		.guidance-header {
			flex-direction: column;
			gap: var(--space-sm);
			text-align: center;
		}

		.guidance-state-pills {
			flex-wrap: wrap;
			justify-content: center;
		}

		.chat-response {
			flex-direction: column;
		}

		.chat-avatar {
			align-self: flex-start;
		}

		.audit-columns {
			grid-template-columns: 1fr;
		}

		.audit-state-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dim-option,
		.chat-option {
			transition: none;
		}
	}
</style>
