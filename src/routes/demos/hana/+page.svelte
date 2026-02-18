<script lang="ts">
	/**
	 * Dr. Hana - Epistemic Transparency Demo
	 * Shows how VCP makes AI confidence levels inspectable and adapts to user state.
	 */
	import { DemoWizard } from '$lib/components/shared';

	interface DiagnosticClaim {
		id: string;
		text: string;
		confidence: number;
		evidenceType: 'factual' | 'inferential' | 'model_estimate' | 'speculative';
		sources: string[];
		uncertaintyType: string;
		shouldVerify: boolean;
		detail: string;
	}

	const steps = [
		{ title: 'Meet Dr. Hana & the Problem', subtitle: 'When AI sounds confident but is not', icon: 'fa-stethoscope' },
		{ title: 'Inspect the AI\'s State', subtitle: 'Drill into confidence, evidence, and uncertainty', icon: 'fa-magnifying-glass' },
		{ title: 'See the Bilateral View', subtitle: 'How Dr. Hana\'s state shapes what she sees', icon: 'fa-arrows-left-right' }
	];

	const claims: DiagnosticClaim[] = [
		{
			id: 'symptoms',
			text: 'Patient\'s symptoms match pattern X (respiratory infection)',
			confidence: 92,
			evidenceType: 'factual',
			sources: ['Patient chart: cough, fever, congestion (3 days)', 'Lab results: elevated WBC count', 'Auscultation notes: crackles in right lower lobe'],
			uncertaintyType: 'Low residual -- data-driven match against known patterns',
			shouldVerify: false,
			detail: 'This claim is grounded in direct patient data. Three independent data points (symptoms, labs, physical exam) converge on respiratory infection. Confidence is high because the pattern match is well-established in clinical literature.'
		},
		{
			id: 'medication',
			text: 'Amoxicillin would address the primary symptoms',
			confidence: 75,
			evidenceType: 'inferential',
			sources: ['Clinical guidelines: first-line antibiotic for CAP', 'Patient allergy record: no penicillin allergy noted', 'Local resistance data: 85% susceptibility in region'],
			uncertaintyType: 'Moderate -- depends on pathogen identity (not yet cultured)',
			shouldVerify: true,
			detail: 'This is an inference: if the infection is bacterial (likely but not certain), amoxicillin is the recommended first-line treatment. The 25% uncertainty comes from: (1) the pathogen has not been cultured yet, (2) local resistance patterns vary, (3) the patient might have an undocumented allergy.'
		},
		{
			id: 'timeline',
			text: 'Recovery timeline: approximately 2 weeks',
			confidence: 55,
			evidenceType: 'model_estimate',
			sources: ['Population-level recovery data for similar presentations', 'Adjusted for patient age (67) and mild COPD history'],
			uncertaintyType: 'High variance -- individual recovery varies widely (SD ~5 days)',
			shouldVerify: true,
			detail: 'This is a model estimate with high variance. The median recovery time for community-acquired pneumonia in older adults is 10-14 days, but individual outcomes range from 5 days to 4+ weeks. The patient\'s mild COPD adds additional uncertainty. This number should be communicated to the patient as a rough guide, not a commitment.'
		},
		{
			id: 'cause',
			text: 'Underlying cause may be immunosuppression from chronic stress',
			confidence: 35,
			evidenceType: 'speculative',
			sources: ['Patient mentioned "very stressful month" in intake', 'Research literature: chronic stress correlates with immune function', 'No direct immunological testing performed'],
			uncertaintyType: 'Speculative -- correlation-based hypothesis, not diagnostic evidence',
			shouldVerify: true,
			detail: 'This is a speculative hypothesis. The patient mentioned stress, and there is research linking chronic stress to immune suppression, but: (1) no immunological testing has been done, (2) the correlation is population-level, not individual, (3) many other factors could explain susceptibility. This should be flagged as a possible avenue for follow-up, not presented as a finding.'
		}
	];

	// Step 2: Expandable claims
	let expandedClaimId = $state<string | null>(null);

	function toggleClaim(id: string) {
		expandedClaimId = expandedClaimId === id ? null : id;
	}

	function getConfidenceColor(confidence: number): string {
		if (confidence >= 90) return 'var(--color-success)';
		if (confidence >= 70) return '#3b82f6';
		if (confidence >= 50) return 'var(--color-warning)';
		return 'var(--color-danger)';
	}

	function getConfidenceLabel(confidence: number): string {
		if (confidence >= 90) return 'High';
		if (confidence >= 70) return 'Moderate-High';
		if (confidence >= 50) return 'Moderate';
		return 'Low';
	}

	function getEvidenceIcon(type: DiagnosticClaim['evidenceType']): string {
		switch (type) {
			case 'factual': return 'fa-check-circle';
			case 'inferential': return 'fa-arrow-right';
			case 'model_estimate': return 'fa-chart-bar';
			case 'speculative': return 'fa-question-circle';
		}
	}

	function getEvidenceLabel(type: DiagnosticClaim['evidenceType']): string {
		switch (type) {
			case 'factual': return 'Factual (from patient data)';
			case 'inferential': return 'Inferential (reasoned from evidence)';
			case 'model_estimate': return 'Model Estimate (statistical)';
			case 'speculative': return 'Speculative (hypothesis)';
		}
	}

	// Step 3: Bilateral state toggle
	let doctorState = $state<'normal' | 'rushed'>('normal');

	const normalDisplay = $derived(
		claims.map(c => ({
			...c,
			shown: true,
			flagged: c.shouldVerify,
			simplified: false
		}))
	);

	const rushedDisplay = $derived(
		claims.map(c => ({
			...c,
			shown: true,
			flagged: c.confidence < 50 || c.shouldVerify,
			simplified: true
		}))
	);

	const currentDisplay = $derived(doctorState === 'rushed' ? rushedDisplay : normalDisplay);
</script>

<svelte:head>
	<title>Dr. Hana: Epistemic Transparency - VCP Demo</title>
	<meta name="description" content="See how VCP makes AI diagnostic confidence inspectable and adapts presentation to the doctor's cognitive state." />
	<link rel="canonical" href="https://valuecontextprotocol.org/demos/hana/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Dr. Hana's Diagnostic Tool — VCP Demo" />
	<meta property="og:description" content="Inspect AI diagnostic confidence — distinguishing 92% certainty from 35% speculation in real time." />
	<meta property="og:url" content="https://valuecontextprotocol.org/demos/hana/" />
	<meta property="og:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Dr. Hana's Diagnostic Tool — VCP Demo" />
	<meta name="twitter:description" content="Inspect AI diagnostic confidence — distinguishing 92% certainty from 35% speculation in real time." />
</svelte:head>

<DemoWizard title="Dr. Hana's Practice" badge="Epistemics" badgeVariant="info" {steps}>
	{#snippet children({ step })}
		{#if step === 0}
			<!-- Step 1: Meet Dr. Hana & the Problem -->
			<div class="step-content">
				<div class="persona-intro">
					<div class="persona-avatar">
						<i class="fa-solid fa-stethoscope" aria-hidden="true"></i>
					</div>
					<div class="persona-text">
						<h2>Meet Dr. Hana</h2>
						<p>
							Dr. Hana is a rural GP in Wales. She uses an AI diagnostic support tool to help with
							complex cases. The problem: the AI gives confident-sounding text regardless of actual
							certainty. "Likely diagnosis: X" could mean 92% confidence or 40%.
						</p>
					</div>
				</div>

				<div class="problem-statement">
					<h3><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> The Problem: Uniform Confidence</h3>
					<p>All AI outputs look the same, regardless of how certain the model actually is. Without metadata, Dr. Hana cannot distinguish well-grounded findings from speculation.</p>
				</div>

				<div class="side-by-side">
					<div class="comparison-panel without">
						<div class="panel-label-header">
							<i class="fa-solid fa-eye-slash" aria-hidden="true"></i>
							<span>Without VCP</span>
						</div>
						<div class="panel-body">
							<div class="ai-output-plain">
								<p><strong>Diagnostic Assessment:</strong></p>
								<p>The patient's symptoms are consistent with a respiratory infection. Amoxicillin is recommended as first-line treatment. Expected recovery is approximately two weeks. The underlying cause may be immunosuppression related to chronic stress.</p>
							</div>
							<div class="panel-problem">
								<i class="fa-solid fa-xmark" aria-hidden="true"></i>
								<span>Every statement reads with equal certainty. No way to distinguish 92% from 35% confidence.</span>
							</div>
						</div>
					</div>

					<div class="comparison-panel with">
						<div class="panel-label-header">
							<i class="fa-solid fa-eye" aria-hidden="true"></i>
							<span>With VCP</span>
						</div>
						<div class="panel-body">
							<div class="ai-output-rich">
								{#each claims as claim}
									<div class="mini-claim">
										<div class="mini-claim-bar">
											<div class="mini-claim-fill" style="width: {claim.confidence}%; background: {getConfidenceColor(claim.confidence)}"></div>
										</div>
										<span class="mini-claim-pct" style="color: {getConfidenceColor(claim.confidence)}">{claim.confidence}%</span>
										<span class="mini-claim-text">{claim.text}</span>
										{#if claim.shouldVerify}
											<span class="mini-verify">
												<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
											</span>
										{/if}
									</div>
								{/each}
							</div>
							<div class="panel-solution">
								<i class="fa-solid fa-check" aria-hidden="true"></i>
								<span>Each claim has visible confidence, evidence type, and verification flags.</span>
							</div>
						</div>
					</div>
				</div>

				<div class="step-callout">
					<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
					<span>Dr. Hana does not need the AI to be right about everything. She needs to see <strong>how confident</strong> it is and <strong>why</strong> -- so she can apply her own clinical judgment where it matters most.</span>
				</div>
			</div>

		{:else if step === 1}
			<!-- Step 2: Inspect the AI's State -->
			<div class="step-content">
				<div class="inspect-intro">
					<h3>Click each diagnostic claim to inspect its epistemic metadata</h3>
					<p>Every claim the AI makes carries structured confidence data that Dr. Hana can drill into.</p>
				</div>

				<div class="claims-list">
					{#each claims as claim}
						<div class="claim-wrapper" class:expanded={expandedClaimId === claim.id}>
							<button
								class="claim-card"
								class:expanded={expandedClaimId === claim.id}
								onclick={() => toggleClaim(claim.id)}
								aria-expanded={expandedClaimId === claim.id}
								aria-label="Inspect claim: {claim.text}"
							>
								<div class="claim-summary">
									<div class="claim-confidence-ring" style="--conf-color: {getConfidenceColor(claim.confidence)}">
										<span class="conf-number">{claim.confidence}%</span>
									</div>
									<div class="claim-text-area">
										<p class="claim-text">{claim.text}</p>
										<div class="claim-badges">
											<span class="evidence-badge" style="color: {getConfidenceColor(claim.confidence)}">
												<i class="fa-solid {getEvidenceIcon(claim.evidenceType)}" aria-hidden="true"></i>
												{getEvidenceLabel(claim.evidenceType)}
											</span>
											{#if claim.shouldVerify}
												<span class="verify-badge">
													<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
													Verify before acting
												</span>
											{/if}
										</div>
									</div>
									<div class="claim-expand-icon">
										<i class="fa-solid {expandedClaimId === claim.id ? 'fa-chevron-up' : 'fa-chevron-down'}" aria-hidden="true"></i>
									</div>
								</div>
							</button>

							{#if expandedClaimId === claim.id}
								<div class="claim-details" role="region" aria-label="Details for: {claim.text}">
									<!-- Confidence Bar -->
									<div class="detail-section">
										<span class="detail-label">Confidence Level</span>
										<div class="confidence-meter">
											<div class="meter-track">
												<div class="meter-fill" style="width: {claim.confidence}%; background: {getConfidenceColor(claim.confidence)}"></div>
											</div>
											<span class="meter-text" style="color: {getConfidenceColor(claim.confidence)}">
												{claim.confidence}% -- {getConfidenceLabel(claim.confidence)}
											</span>
										</div>
									</div>

									<!-- Evidence Sources -->
									<div class="detail-section">
										<span class="detail-label">Evidence Sources</span>
										<ul class="evidence-list">
											{#each claim.sources as source}
												<li>{source}</li>
											{/each}
										</ul>
									</div>

									<!-- Uncertainty Type -->
									<div class="detail-section">
										<span class="detail-label">Uncertainty Type</span>
										<p class="uncertainty-text">{claim.uncertaintyType}</p>
									</div>

									<!-- Should Verify -->
									<div class="detail-section">
										<span class="detail-label">Verification</span>
										{#if claim.shouldVerify}
											<div class="verify-flag yes">
												<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
												<span>Recommended -- verify with additional tests or clinical judgment before acting on this claim.</span>
											</div>
										{:else}
											<div class="verify-flag no">
												<i class="fa-solid fa-circle-check" aria-hidden="true"></i>
												<span>Well-grounded in direct evidence. Low risk of acting on this claim.</span>
											</div>
										{/if}
									</div>

									<!-- Detailed Explanation -->
									<div class="detail-explanation">
										<p>{claim.detail}</p>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<div class="confidence-legend">
					<span class="legend-title">Confidence Scale</span>
					<div class="legend-items">
						<span class="legend-item" style="--dot-color: var(--color-success)"><span class="legend-dot"></span> 90%+ High</span>
						<span class="legend-item" style="--dot-color: #3b82f6"><span class="legend-dot"></span> 70-89% Moderate-High</span>
						<span class="legend-item" style="--dot-color: var(--color-warning)"><span class="legend-dot"></span> 50-69% Moderate</span>
						<span class="legend-item" style="--dot-color: var(--color-danger)"><span class="legend-dot"></span> Below 50% Low</span>
					</div>
				</div>
			</div>

		{:else if step === 2}
			<!-- Step 3: See the Bilateral View -->
			<div class="step-content">
				<div class="bilateral-intro">
					<h3>Dr. Hana's state affects what she sees</h3>
					<p>VCP is symmetric -- the AI carries state, and so does the user. When Dr. Hana is rushed, the AI adapts its epistemic display to protect her from cognitive overload.</p>
				</div>

				<div class="state-toggle">
					<span class="toggle-label">Dr. Hana's State:</span>
					<div class="toggle-buttons">
						<button
							class="state-btn"
							class:active={doctorState === 'normal'}
							onclick={() => doctorState = 'normal'}
							aria-pressed={doctorState === 'normal'}
						>
							<i class="fa-solid fa-face-smile" aria-hidden="true"></i>
							Normal
						</button>
						<button
							class="state-btn"
							class:active={doctorState === 'rushed'}
							onclick={() => doctorState = 'rushed'}
							aria-pressed={doctorState === 'rushed'}
						>
							<i class="fa-solid fa-person-running" aria-hidden="true"></i>
							Rushed
						</button>
					</div>
				</div>

				{#if doctorState === 'rushed'}
					<div class="state-banner rushed">
						<i class="fa-solid fa-bolt" aria-hidden="true"></i>
						<div>
							<strong>Rushed state detected.</strong> Dr. Hana has high cognitive load. The AI is adapting:
							simplifying display, surfacing only top-level confidence, and prominently flagging the speculative claim.
						</div>
					</div>
				{:else}
					<div class="state-banner normal">
						<i class="fa-solid fa-circle-check" aria-hidden="true"></i>
						<div>
							<strong>Normal state.</strong> Dr. Hana has full cognitive capacity. The AI presents complete
							epistemic metadata for all claims.
						</div>
					</div>
				{/if}

				<div class="bilateral-display">
					{#each currentDisplay as item}
						<div
							class="bilateral-claim"
							class:flagged={item.flagged && doctorState === 'rushed'}
							class:simplified={item.simplified}
						>
							<div class="bilateral-claim-header">
								<div class="bilateral-conf" style="--conf-color: {getConfidenceColor(item.confidence)}">
									{#if item.simplified}
										<!-- Simplified: just the color bar, no details -->
										<div class="conf-simple-bar">
											<div class="conf-simple-fill" style="width: {item.confidence}%; background: {getConfidenceColor(item.confidence)}"></div>
										</div>
										<span class="conf-simple-pct" style="color: {getConfidenceColor(item.confidence)}">{item.confidence}%</span>
									{:else}
										<!-- Full: ring + percentage + label -->
										<div class="conf-ring" style="border-color: {getConfidenceColor(item.confidence)}">
											<span>{item.confidence}%</span>
										</div>
										<span class="conf-label" style="color: {getConfidenceColor(item.confidence)}">
											{getConfidenceLabel(item.confidence)} -- {getEvidenceLabel(item.evidenceType)}
										</span>
									{/if}
								</div>
							</div>

							<p class="bilateral-claim-text">{item.text}</p>

							{#if item.flagged && doctorState === 'rushed' && item.confidence < 50}
								<div class="prominent-flag">
									<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
									<strong>SPECULATIVE</strong> -- This claim is a hypothesis, not a finding. Verify before clinical decisions.
								</div>
							{:else if item.flagged && !item.simplified}
								<div class="standard-flag">
									<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
									Should verify: {item.uncertaintyType}
								</div>
							{:else if item.flagged && item.simplified}
								<div class="standard-flag">
									<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
									Verify recommended
								</div>
							{/if}

							{#if !item.simplified}
								<div class="bilateral-sources">
									<span class="sources-label">Sources:</span>
									{#each item.sources as source}
										<span class="source-tag">{source}</span>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<div class="adaptation-summary">
					<h4>What changed?</h4>
					<div class="adaptation-grid">
						<div class="adaptation-item">
							<span class="adaptation-label">Normal State</span>
							<ul>
								<li>Full epistemic metadata shown</li>
								<li>All evidence sources listed</li>
								<li>Detailed uncertainty types</li>
								<li>Standard verification flags</li>
							</ul>
						</div>
						<div class="adaptation-arrow">
							<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
						</div>
						<div class="adaptation-item">
							<span class="adaptation-label">Rushed State</span>
							<ul>
								<li>Simplified to confidence bar only</li>
								<li>Evidence sources hidden (expandable)</li>
								<li>Speculative claim prominently flagged</li>
								<li>Cognitive load minimized</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="payoff-card">
					<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
					<div>
						<strong>The payoff:</strong> VCP is symmetric. The AI has state too -- and you can inspect it.
						Not trust, verify. And the system adapts to <em>your</em> state as well, ensuring the right
						level of detail reaches you at the right time.
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
		background: rgba(59, 130, 246, 0.15);
		border-radius: 50%;
		font-size: 2rem;
		color: #3b82f6;
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

	/* Problem Statement */
	.problem-statement {
		padding: var(--space-lg);
		background: var(--color-danger-muted);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-danger);
	}

	.problem-statement h3 {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin: 0 0 var(--space-sm) 0;
		font-size: 0.9375rem;
		color: var(--color-danger);
	}

	.problem-statement p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text);
		line-height: 1.5;
	}

	/* Side-by-Side Comparison */
	.side-by-side {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-lg);
	}

	.comparison-panel {
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.comparison-panel.without {
		border-color: var(--color-danger);
	}

	.comparison-panel.with {
		border-color: var(--color-success);
	}

	.panel-label-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md) var(--space-lg);
		font-weight: 600;
		font-size: 0.875rem;
	}

	.without .panel-label-header {
		background: var(--color-danger-muted);
		color: var(--color-danger);
	}

	.with .panel-label-header {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	.panel-body {
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
	}

	.ai-output-plain {
		padding: var(--space-md);
		background: var(--color-bg-card);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-md);
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.ai-output-plain p {
		margin: 0 0 var(--space-sm) 0;
	}

	.ai-output-plain p:last-child {
		margin-bottom: 0;
	}

	.ai-output-rich {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.mini-claim {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm);
		background: var(--color-bg-card);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
	}

	.mini-claim-bar {
		width: 40px;
		height: 6px;
		background: var(--color-bg-elevated);
		border-radius: var(--radius-full);
		overflow: hidden;
		flex-shrink: 0;
	}

	.mini-claim-fill {
		height: 100%;
		border-radius: var(--radius-full);
	}

	.mini-claim-pct {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.6875rem;
		min-width: 28px;
		flex-shrink: 0;
	}

	.mini-claim-text {
		flex: 1;
		color: var(--color-text-muted);
	}

	.mini-verify {
		color: var(--color-warning);
		flex-shrink: 0;
	}

	.panel-problem,
	.panel-solution {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.8125rem;
	}

	.panel-problem {
		color: var(--color-danger);
	}

	.panel-solution {
		color: var(--color-success);
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
		line-height: 1.5;
	}

	.step-callout i {
		color: var(--color-primary);
		margin-top: 2px;
		flex-shrink: 0;
	}

	/* Step 2: Inspectable Claims */
	.inspect-intro {
		text-align: center;
	}

	.inspect-intro h3 {
		margin: 0 0 var(--space-xs) 0;
		font-size: 1.125rem;
	}

	.inspect-intro p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.9375rem;
	}

	.claims-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.claim-wrapper {
		background: var(--color-bg-elevated);
		border: 2px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-lg);
		transition: border-color var(--transition-fast);
		overflow: hidden;
	}

	.claim-wrapper:hover {
		border-color: var(--color-primary);
	}

	.claim-wrapper.expanded {
		border-color: var(--color-primary);
	}

	.claim-card {
		width: 100%;
		text-align: left;
		padding: var(--space-lg);
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-text);
	}

	.claim-summary {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.claim-confidence-ring {
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: 3px solid var(--conf-color);
		flex-shrink: 0;
	}

	.conf-number {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.875rem;
		color: var(--conf-color);
	}

	.claim-text-area {
		flex: 1;
	}

	.claim-text {
		margin: 0 0 var(--space-xs) 0;
		font-size: 0.9375rem;
		font-weight: 500;
		line-height: 1.4;
	}

	.claim-badges {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.evidence-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.6875rem;
		font-weight: 500;
	}

	.verify-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.6875rem;
		padding: 2px 6px;
		background: var(--color-warning-muted);
		color: var(--color-warning);
		border-radius: var(--radius-sm);
		font-weight: 600;
	}

	.claim-expand-icon {
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	/* Claim Details (expanded) */
	.claim-details {
		padding: 0 var(--space-lg) var(--space-lg);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		padding-top: var(--space-lg);
	}

	.detail-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.detail-label {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		font-weight: 600;
	}

	.confidence-meter {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.meter-track {
		height: 10px;
		background: var(--color-bg-card);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.meter-fill {
		height: 100%;
		border-radius: var(--radius-full);
		transition: width var(--transition-normal);
	}

	.meter-text {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.evidence-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.evidence-list li {
		font-size: 0.8125rem;
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-bg-card);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
	}

	.evidence-list li::before {
		content: '';
		display: inline-block;
		width: 6px;
		height: 6px;
		background: var(--color-primary);
		border-radius: 50%;
		margin-right: var(--space-sm);
		vertical-align: middle;
	}

	.uncertainty-text {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted);
		font-style: italic;
	}

	.verify-flag {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm);
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
	}

	.verify-flag.yes {
		background: var(--color-warning-muted);
		color: var(--color-warning);
	}

	.verify-flag.no {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	.detail-explanation {
		padding: var(--space-md);
		background: var(--color-bg-card);
		border-radius: var(--radius-md);
		border-left: 3px solid var(--color-primary);
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-text-muted);
	}

	.detail-explanation p {
		margin: 0;
	}

	/* Confidence Legend */
	.confidence-legend {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-md);
		flex-wrap: wrap;
	}

	.legend-title {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--color-text-subtle);
		letter-spacing: 0.05em;
	}

	.legend-items {
		display: flex;
		gap: var(--space-lg);
		flex-wrap: wrap;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.legend-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--dot-color);
	}

	/* Step 3: Bilateral View */
	.bilateral-intro {
		text-align: center;
	}

	.bilateral-intro h3 {
		margin: 0 0 var(--space-xs) 0;
		font-size: 1.125rem;
	}

	.bilateral-intro p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.9375rem;
	}

	.state-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		justify-content: center;
		flex-wrap: wrap;
	}

	.toggle-label {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.toggle-buttons {
		display: flex;
		gap: var(--space-xs);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		padding: var(--space-xs);
	}

	.state-btn {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm) var(--space-lg);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.state-btn:hover {
		color: var(--color-text);
	}

	.state-btn.active {
		background: var(--color-primary);
		color: white;
	}

	.state-banner {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.state-banner.rushed {
		background: var(--color-warning-muted);
		border: 1px solid var(--color-warning);
	}

	.state-banner.rushed i {
		color: var(--color-warning);
		margin-top: 2px;
	}

	.state-banner.normal {
		background: var(--color-success-muted);
		border: 1px solid var(--color-success);
	}

	.state-banner.normal i {
		color: var(--color-success);
		margin-top: 2px;
	}

	/* Bilateral Display */
	.bilateral-display {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.bilateral-claim {
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.06);
		transition: all var(--transition-fast);
	}

	.bilateral-claim.flagged {
		border-color: var(--color-danger);
		background: rgba(239, 68, 68, 0.05);
	}

	.bilateral-claim-header {
		margin-bottom: var(--space-sm);
	}

	.bilateral-conf {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.conf-ring {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: 3px solid;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.75rem;
	}

	.conf-label {
		font-size: 0.75rem;
		font-weight: 500;
	}

	.conf-simple-bar {
		width: 60px;
		height: 8px;
		background: var(--color-bg-card);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.conf-simple-fill {
		height: 100%;
		border-radius: var(--radius-full);
	}

	.conf-simple-pct {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.8125rem;
	}

	.bilateral-claim-text {
		margin: 0 0 var(--space-sm) 0;
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.prominent-flag {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--color-danger-muted);
		border: 1px solid var(--color-danger);
		border-radius: var(--radius-md);
		font-size: 0.8125rem;
		color: var(--color-danger);
		margin-bottom: var(--space-sm);
	}

	.prominent-flag i {
		font-size: 1.25rem;
	}

	.standard-flag {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm);
		background: var(--color-warning-muted);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		color: var(--color-warning);
		margin-bottom: var(--space-sm);
	}

	.bilateral-sources {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		align-items: center;
	}

	.sources-label {
		font-size: 0.6875rem;
		text-transform: uppercase;
		color: var(--color-text-subtle);
		font-weight: 600;
	}

	.source-tag {
		font-size: 0.6875rem;
		padding: 2px 8px;
		background: var(--color-bg-card);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
	}

	/* Adaptation Summary */
	.adaptation-summary {
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
	}

	.adaptation-summary h4 {
		margin: 0 0 var(--space-md) 0;
		font-size: 0.9375rem;
		text-align: center;
	}

	.adaptation-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: var(--space-md);
		align-items: center;
	}

	.adaptation-item {
		padding: var(--space-md);
		background: var(--color-bg-card);
		border-radius: var(--radius-md);
	}

	.adaptation-label {
		display: block;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		font-weight: 600;
		margin-bottom: var(--space-sm);
	}

	.adaptation-item ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.adaptation-item li {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		padding: 2px 0;
	}

	.adaptation-item li::before {
		content: '';
		display: inline-block;
		width: 5px;
		height: 5px;
		background: var(--color-primary);
		border-radius: 50%;
		margin-right: var(--space-sm);
		vertical-align: middle;
	}

	.adaptation-arrow {
		color: var(--color-text-subtle);
		font-size: 1.25rem;
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
		.side-by-side {
			grid-template-columns: 1fr;
		}

		.persona-intro {
			flex-direction: column;
			text-align: center;
		}

		.claim-summary {
			flex-direction: column;
			text-align: center;
		}

		.claim-confidence-ring {
			align-self: center;
		}

		.adaptation-grid {
			grid-template-columns: 1fr;
		}

		.adaptation-arrow {
			transform: rotate(90deg);
			text-align: center;
		}

		.legend-items {
			flex-direction: column;
			gap: var(--space-sm);
		}

		.confidence-legend {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.meter-fill,
		.bilateral-claim {
			transition: none;
		}
	}
</style>
