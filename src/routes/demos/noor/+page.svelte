<script lang="ts">
	/**
	 * Noor - Governance & Executable Rules Demo
	 * Shows how VCP hooks make values executable, not just aspirational.
	 */
	import { DemoWizard } from '$lib/components/shared';
	import HooksPanel from '$lib/components/demo/HooksPanel.svelte';

	interface Rule {
		id: string;
		natural: string;
		hook: string;
		effect: string;
		icon: string;
		enabled: boolean;
	}

	interface ChatMessage {
		sender: 'student' | 'ai' | 'system';
		text: string;
		hookFired?: string;
	}

	const steps = [
		{ title: 'Meet Noor & the Problem', subtitle: 'Aspirational guidelines vs executable rules', icon: 'fa-school' },
		{ title: 'Build the Rules', subtitle: 'Define enforceable hooks for the AI homework tool', icon: 'fa-hammer' },
		{ title: 'Test the Boundaries', subtitle: 'Watch the hooks fire in real scenarios', icon: 'fa-flask' }
	];

	// Step 2: Rule builder state
	let rules = $state<Rule[]>([
		{
			id: 'scaffolding',
			natural: 'Never provide complete solutions -- only hints and scaffolding',
			hook: 'on_response_generate: if contains_complete_solution(response) then replace_with_scaffolding(response)',
			effect: 'AI rewrites any complete answer into step-by-step hints, preserving the learning opportunity.',
			icon: 'fa-puzzle-piece',
			enabled: false
		},
		{
			id: 'distress',
			natural: 'If student shows distress signals, escalate to human teacher',
			hook: 'on_input_analyze: if detect_distress_signals(input) then escalate_to_teacher(student_id, context)',
			effect: 'AI flags the conversation for teacher review and shifts to supportive, non-academic tone.',
			icon: 'fa-hand-holding-heart',
			enabled: false
		},
		{
			id: 'logging',
			natural: 'Log all interactions for teacher review, redact personal disclosures',
			hook: 'on_session_end: log_interaction(session, redact=personal_disclosures) to teacher_dashboard',
			effect: 'Full interaction log saved for teacher review, with personal information automatically redacted.',
			icon: 'fa-clipboard-list',
			enabled: false
		}
	]);

	const allRulesEnabled = $derived(rules.every(r => r.enabled));

	let hooksForPanel = $derived(rules.map(rule => ({
		id: rule.hook.slice(0, 20),
		tier: rule.id === 'scaffolding' ? 'constitutional' as const
			: rule.id === 'distress' ? 'situational' as const
			: 'personal' as const,
		label: rule.natural,
		trigger: rule.hook.split(' then ')[0]?.replace('on_response_generate: if ', '').replace('on_input_analyze: if ', '').replace('on_session_end: ', '') ?? '',
		action: rule.hook.split(' then ')[1] ?? '',
		active: rule.enabled
	})));

	function toggleRule(id: string) {
		rules = rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
	}

	function enableAll() {
		rules = rules.map(r => ({ ...r, enabled: true }));
	}

	// Step 3: Scenario simulation state
	let activeScenario = $state<'none' | 'A' | 'B'>('none');
	let scenarioStep = $state(0);
	let scenarioTimer: ReturnType<typeof setTimeout> | null = null;

	const scenarioA: ChatMessage[] = [
		{ sender: 'student', text: 'Can you just write my essay on climate change? I need 500 words by tomorrow.' },
		{ sender: 'system', text: 'Hook fired: on_response_generate -- complete solution detected. Replacing with scaffolding.' },
		{ sender: 'ai', text: 'I cannot write the essay for you, but I can help you build it step by step. Let\'s start: What is the main argument you want to make about climate change?' },
		{ sender: 'student', text: 'I don\'t know, something about it being bad?' },
		{ sender: 'ai', text: 'That is a start. Here is a scaffolding question: Can you name one specific effect of climate change that you have heard about? For example, rising sea levels, extreme weather, or species extinction. Pick one and we will build your thesis from there.' },
		{ sender: 'student', text: 'Ok, extreme weather I guess.' },
		{ sender: 'ai', text: 'Great choice. Now try finishing this sentence: "Climate change is increasing extreme weather events, which matters because ___." That is your thesis. Once you have it, I will help you find evidence for each paragraph.' }
	];

	const scenarioB: ChatMessage[] = [
		{ sender: 'student', text: 'I can\'t do anything right. I\'ve been trying this math for hours and I\'m so stupid.' },
		{ sender: 'system', text: 'Hook fired: on_input_analyze -- distress signals detected (self-deprecation + frustration). Escalating to teacher.' },
		{ sender: 'ai', text: 'Hey, I hear you. Struggling with math does not mean you are stupid -- it means the problem is hard. Let me flag this for your teacher so they can help too.' },
		{ sender: 'system', text: 'Notification sent to Ms. Rivera (teacher dashboard): Student showing distress during math session. Context attached.' },
		{ sender: 'ai', text: 'While we wait, can you tell me which part specifically is tripping you up? Sometimes when we break a hard problem into smaller pieces, it stops feeling so overwhelming.' },
		{ sender: 'student', text: 'It\'s the fractions. I don\'t get how to multiply them.' },
		{ sender: 'ai', text: 'Fractions can be really confusing at first -- most people struggle with them. Let\'s go back to basics together. Do you know what 1/2 of something means? Like, 1/2 of a pizza?' }
	];

	const currentScenarioMessages = $derived(
		activeScenario === 'A' ? scenarioA.slice(0, scenarioStep)
		: activeScenario === 'B' ? scenarioB.slice(0, scenarioStep)
		: []
	);

	const totalScenarioSteps = $derived(
		activeScenario === 'A' ? scenarioA.length
		: activeScenario === 'B' ? scenarioB.length
		: 0
	);

	function startScenario(scenario: 'A' | 'B') {
		stopScenario();
		activeScenario = scenario;
		scenarioStep = 0;
		autoAdvance();
	}

	function autoAdvance() {
		const max = activeScenario === 'A' ? scenarioA.length : scenarioB.length;
		if (scenarioStep < max) {
			scenarioStep++;
			scenarioTimer = setTimeout(autoAdvance, 1800);
		}
	}

	function stopScenario() {
		if (scenarioTimer) clearTimeout(scenarioTimer);
		scenarioTimer = null;
	}

	function resetScenarios() {
		stopScenario();
		activeScenario = 'none';
		scenarioStep = 0;
	}

	$effect(() => {
		return () => {
			if (scenarioTimer) clearTimeout(scenarioTimer);
		};
	});
</script>

<svelte:head>
	<title>Noor: Governance & Executable Rules - VCP Demo</title>
	<meta name="description" content="See how VCP turns aspirational guidelines into executable hooks for an AI homework-help tool." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Noor's School District — VCP Demo" />
	<meta property="og:description" content="Turn 'don't do homework for students' from an aspiration into executable, enforceable AI constraints." />
	<meta property="og:image" content="/vcp-logo.png" />
	<meta property="twitter:card" content="summary_large_image" />
</svelte:head>

<DemoWizard title="Noor's School District" badge="Governance" badgeVariant="warning" {steps} onComplete={resetScenarios}>
	{#snippet children({ step })}
		{#if step === 0}
			<!-- Step 1: Meet Noor & the Problem -->
			<div class="step-content">
				<div class="persona-intro">
					<div class="persona-avatar">
						<i class="fa-solid fa-graduation-cap" aria-hidden="true"></i>
					</div>
					<div class="persona-text">
						<h2>Meet Noor</h2>
						<p>
							Noor is the technology coordinator for a school district deploying an AI homework-help tool.
							Teachers are worried: "What if it just does the homework for students?" Noor needs enforceable
							rules, not aspirational guidelines.
						</p>
					</div>
				</div>

				<div class="contrast-section">
					<h3><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i> The Problem: Guidelines vs. Infrastructure</h3>

					<div class="contrast-grid">
						<div class="contrast-card aspirational">
							<div class="contrast-header">
								<i class="fa-solid fa-cloud" aria-hidden="true"></i>
								<span>Aspirational Guidelines</span>
								<span class="contrast-verdict bad">Unreliable</span>
							</div>
							<div class="contrast-body">
								<div class="guideline-item">
									<span class="guideline-text">"Please don't do homework for students"</span>
									<span class="guideline-problem">
										<i class="fa-solid fa-xmark" aria-hidden="true"></i>
										Depends on model interpretation
									</span>
								</div>
								<div class="guideline-item">
									<span class="guideline-text">"Try to be supportive if students seem upset"</span>
									<span class="guideline-problem">
										<i class="fa-solid fa-xmark" aria-hidden="true"></i>
										No guarantee of escalation
									</span>
								</div>
								<div class="guideline-item">
									<span class="guideline-text">"Keep records of interactions"</span>
									<span class="guideline-problem">
										<i class="fa-solid fa-xmark" aria-hidden="true"></i>
										No privacy controls
									</span>
								</div>
							</div>
							<div class="contrast-footer">
								<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
								Depends on the AI "wanting" to comply. One prompt injection away from failure.
							</div>
						</div>

						<div class="contrast-card executable">
							<div class="contrast-header">
								<i class="fa-solid fa-bolt" aria-hidden="true"></i>
								<span>VCP Executable Hooks</span>
								<span class="contrast-verdict good">Reliable</span>
							</div>
							<div class="contrast-body">
								<div class="guideline-item">
									<span class="guideline-text">Hook: intercept complete solutions, rewrite as scaffolding</span>
									<span class="guideline-solution">
										<i class="fa-solid fa-check" aria-hidden="true"></i>
										Fires deterministically on output
									</span>
								</div>
								<div class="guideline-item">
									<span class="guideline-text">Hook: detect distress signals, escalate to teacher</span>
									<span class="guideline-solution">
										<i class="fa-solid fa-check" aria-hidden="true"></i>
										Automatic, no discretion required
									</span>
								</div>
								<div class="guideline-item">
									<span class="guideline-text">Hook: log sessions with automatic PII redaction</span>
									<span class="guideline-solution">
										<i class="fa-solid fa-check" aria-hidden="true"></i>
										Privacy built into the logging layer
									</span>
								</div>
							</div>
							<div class="contrast-footer success">
								<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
								Fires at the protocol level. The AI cannot decide to skip them.
							</div>
						</div>
					</div>
				</div>

				<div class="step-callout">
					<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
					<span>The difference: aspirational guidelines ask the AI to behave well. VCP hooks <strong>enforce</strong> behavior at the protocol level, before the response reaches the student.</span>
				</div>
			</div>

		{:else if step === 1}
			<!-- Step 2: Build the Rules -->
			<div class="step-content">
				<div class="builder-intro">
					<h3>Help Noor define the rules</h3>
					<p>Each rule is defined in natural language, then compiled into a VCP hook. Enable each rule to see it activate.</p>
					{#if !allRulesEnabled}
						<button class="btn-enable-all" onclick={enableAll}>
							<i class="fa-solid fa-bolt" aria-hidden="true"></i>
							Enable All Rules
						</button>
					{/if}
				</div>

				<div class="rules-list">
					{#each rules as rule}
						<div class="rule-card" class:enabled={rule.enabled}>
							<div class="rule-toggle-row">
								<button
									class="rule-toggle"
									class:active={rule.enabled}
									onclick={() => toggleRule(rule.id)}
									aria-pressed={rule.enabled}
									aria-label="Toggle rule: {rule.natural}"
								>
									<span class="toggle-track">
										<span class="toggle-thumb"></span>
									</span>
								</button>
								<div class="rule-icon">
									<i class="fa-solid {rule.icon}" aria-hidden="true"></i>
								</div>
								<span class="rule-status">{rule.enabled ? 'Active' : 'Inactive'}</span>
							</div>

							<div class="rule-layers">
								<div class="rule-layer natural">
									<span class="layer-label">Natural Language</span>
									<p class="layer-content">"{rule.natural}"</p>
								</div>

								<div class="rule-arrow">
									<i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
									<span>compiles to</span>
								</div>

								<div class="rule-layer hook" class:lit={rule.enabled}>
									<span class="layer-label">VCP Hook</span>
									<code class="layer-code">{rule.hook}</code>
								</div>

								<div class="rule-arrow">
									<i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
									<span>when fired</span>
								</div>

								<div class="rule-layer effect" class:lit={rule.enabled}>
									<span class="layer-label">Effect</span>
									<p class="layer-content">{rule.effect}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>

				{#if allRulesEnabled}
					<div class="all-enabled-banner">
						<i class="fa-solid fa-circle-check" aria-hidden="true"></i>
						<span>All three hooks are active. These rules are now executable -- not suggestions. Proceed to Step 3 to test them.</span>
					</div>
				{/if}
			</div>

		{:else if step === 2}
			<!-- Step 3: Test the Boundaries -->
			<div class="step-content">
				<div class="test-layout">
				<div class="test-scenarios">
				<div class="scenario-controls">
					<h3>Choose a scenario</h3>
					<div class="scenario-buttons">
						<button
							class="scenario-btn"
							class:active={activeScenario === 'A'}
							onclick={() => startScenario('A')}
						aria-label="Scenario A: Write my essay for me"
						>
							<i class="fa-solid fa-pen" aria-hidden="true"></i>
							<div>
								<strong>Scenario A</strong>
								<span>"Write my essay for me"</span>
							</div>
						</button>
						<button
							class="scenario-btn"
							class:active={activeScenario === 'B'}
							onclick={() => startScenario('B')}
						aria-label="Scenario B: I can't do anything right"
						>
							<i class="fa-solid fa-heart" aria-hidden="true"></i>
							<div>
								<strong>Scenario B</strong>
								<span>"I can't do anything right"</span>
							</div>
						</button>
						{#if activeScenario !== 'none'}
							<button class="scenario-reset" onclick={resetScenarios} aria-label="Reset scenario">
								<i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
								Reset
							</button>
						{/if}
					</div>
				</div>

				{#if activeScenario !== 'none'}
					<div class="chat-container" aria-label="Simulated conversation">
						<div class="chat-header">
							<i class="fa-solid fa-comments" aria-hidden="true"></i>
							<span>
								{activeScenario === 'A' ? 'Scenario A: Student asks AI to write essay' : 'Scenario B: Student shows distress'}
							</span>
							<span class="chat-progress">{scenarioStep} / {totalScenarioSteps}</span>
						</div>
						<div class="chat-messages">
							{#each currentScenarioMessages as msg}
								<div class="chat-msg {msg.sender}">
									{#if msg.sender === 'student'}
										<div class="msg-avatar student-avatar">
											<i class="fa-solid fa-user" aria-hidden="true"></i>
										</div>
									{:else if msg.sender === 'ai'}
										<div class="msg-avatar ai-avatar">
											<i class="fa-solid fa-robot" aria-hidden="true"></i>
										</div>
									{:else}
										<div class="msg-avatar system-avatar">
											<i class="fa-solid fa-bolt" aria-hidden="true"></i>
										</div>
									{/if}
									<div class="msg-bubble">
										{#if msg.sender === 'system'}
											<span class="msg-system-label">HOOK</span>
										{/if}
										<p>{msg.text}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>

					{#if scenarioStep >= totalScenarioSteps}
						<div class="scenario-result" class:scenario-a={activeScenario === 'A'} class:scenario-b={activeScenario === 'B'}>
							{#if activeScenario === 'A'}
								<i class="fa-solid fa-puzzle-piece" aria-hidden="true"></i>
								<div>
									<strong>Scaffolding hook worked.</strong> The AI never provided a complete essay.
									Instead, it guided the student through building their own thesis, step by step.
									The hook fired on the AI's first response attempt and rewrote it.
								</div>
							{:else}
								<i class="fa-solid fa-hand-holding-heart" aria-hidden="true"></i>
								<div>
									<strong>Distress hook worked.</strong> The AI detected self-deprecation and frustration,
									flagged the session for the teacher, and shifted to a supportive tone. The student
									never had to ask for help -- the system caught it automatically.
								</div>
							{/if}
						</div>
					{/if}
				{:else}
					<div class="no-scenario">
						<i class="fa-solid fa-flask" aria-hidden="true"></i>
						<p>Select a scenario above to watch the hooks fire in action.</p>
					</div>
				{/if}
				</div>

				<div class="test-hooks-sidebar">
					<HooksPanel hooks={hooksForPanel} title="Active Hooks" />
				</div>
				</div>

				<div class="payoff-card">
					<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
					<div>
						<strong>The payoff:</strong> Values are not suggestions. In VCP, they are executable. They fire
						reliably at the protocol level. That is the difference between policy and infrastructure.
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
		background: var(--color-warning-muted);
		border-radius: 50%;
		font-size: 2rem;
		color: var(--color-warning);
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

	/* Contrast Section */
	.contrast-section h3 {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin: 0 0 var(--space-lg) 0;
		font-size: 1rem;
	}

	.contrast-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-lg);
	}

	.contrast-card {
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.contrast-card.aspirational {
		border-color: var(--color-danger);
	}

	.contrast-card.executable {
		border-color: var(--color-success);
	}

	.contrast-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md) var(--space-lg);
		font-weight: 600;
		font-size: 0.875rem;
	}

	.aspirational .contrast-header {
		background: var(--color-danger-muted);
		color: var(--color-danger);
	}

	.executable .contrast-header {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	.contrast-verdict {
		margin-left: auto;
		font-size: 0.6875rem;
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		text-transform: uppercase;
		font-weight: 700;
	}

	.contrast-verdict.bad {
		background: var(--color-danger);
		color: white;
	}

	.contrast-verdict.good {
		background: var(--color-success);
		color: white;
	}

	.contrast-body {
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		background: var(--color-bg-elevated);
	}

	.guideline-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.guideline-text {
		font-size: 0.875rem;
		font-style: italic;
		color: var(--color-text);
	}

	.guideline-problem,
	.guideline-solution {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.75rem;
	}

	.guideline-problem {
		color: var(--color-danger);
	}

	.guideline-solution {
		color: var(--color-success);
	}

	.contrast-footer {
		padding: var(--space-md) var(--space-lg);
		font-size: 0.8125rem;
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		background: var(--color-bg-card);
		color: var(--color-text-muted);
	}

	.contrast-footer.success {
		color: var(--color-success);
	}

	.contrast-footer i {
		flex-shrink: 0;
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

	/* Rule Builder */
	.builder-intro {
		text-align: center;
	}

	.builder-intro h3 {
		margin: 0 0 var(--space-xs) 0;
		font-size: 1.125rem;
	}

	.builder-intro p {
		margin: 0 0 var(--space-md) 0;
		color: var(--color-text-muted);
		font-size: 0.9375rem;
	}

	.btn-enable-all {
		display: inline-flex;
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

	.btn-enable-all:hover {
		opacity: 0.9;
	}

	.rules-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.rule-card {
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		border: 2px solid rgba(255, 255, 255, 0.08);
		transition: border-color var(--transition-fast);
	}

	.rule-card.enabled {
		border-color: var(--color-success);
	}

	.rule-toggle-row {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.rule-toggle {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.toggle-track {
		display: block;
		width: 44px;
		height: 24px;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		position: relative;
		transition: background var(--transition-fast);
	}

	.rule-toggle.active .toggle-track {
		background: var(--color-success);
	}

	.toggle-thumb {
		display: block;
		width: 18px;
		height: 18px;
		background: white;
		border-radius: 50%;
		position: absolute;
		top: 3px;
		left: 3px;
		transition: transform var(--transition-fast);
	}

	.rule-toggle.active .toggle-thumb {
		transform: translateX(20px);
	}

	.rule-icon {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg-card);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		font-size: 1rem;
	}

	.rule-card.enabled .rule-icon {
		color: var(--color-success);
		background: var(--color-success-muted);
	}

	.rule-status {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.rule-card.enabled .rule-status {
		color: var(--color-success);
	}

	.rule-layers {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.rule-layer {
		padding: var(--space-md);
		border-radius: var(--radius-md);
		background: var(--color-bg-card);
	}

	.rule-layer.hook {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.rule-layer.hook.lit {
		background: var(--color-primary-muted);
		border-color: var(--color-primary);
	}

	.rule-layer.effect.lit {
		background: var(--color-success-muted);
		border: 1px solid var(--color-success);
	}

	.layer-label {
		display: block;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		margin-bottom: var(--space-xs);
		font-weight: 600;
	}

	.layer-content {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.layer-code {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-primary);
		word-break: break-all;
		line-height: 1.6;
	}

	.rule-arrow {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		justify-content: center;
		color: var(--color-text-subtle);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.rule-arrow i {
		font-size: 0.75rem;
	}

	.all-enabled-banner {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-success-muted);
		border: 1px solid var(--color-success);
		border-radius: var(--radius-lg);
		font-size: 0.875rem;
		color: var(--color-success);
	}

	/* Scenario Controls */
	.scenario-controls {
		text-align: center;
	}

	.scenario-controls h3 {
		margin: 0 0 var(--space-md) 0;
		font-size: 1rem;
	}

	.scenario-buttons {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		flex-wrap: wrap;
	}

	.scenario-btn {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-xl);
		background: var(--color-bg-elevated);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--transition-fast);
		text-align: left;
		color: var(--color-text);
	}

	.scenario-btn:hover {
		border-color: var(--color-primary);
	}

	.scenario-btn.active {
		border-color: var(--color-primary);
		background: var(--color-primary-muted);
	}

	.scenario-btn i {
		font-size: 1.5rem;
		color: var(--color-primary);
	}

	.scenario-btn strong {
		display: block;
		font-size: 0.875rem;
		margin-bottom: 2px;
	}

	.scenario-btn span {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.scenario-reset {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm) var(--space-md);
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		cursor: pointer;
		font-size: 0.8125rem;
		align-self: center;
	}

	.scenario-reset:hover {
		border-color: var(--color-text-muted);
	}

	/* Chat Container */
	.chat-container {
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.chat-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg-card);
		font-size: 0.875rem;
		font-weight: 600;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.chat-header i {
		color: var(--color-primary);
	}

	.chat-progress {
		margin-left: auto;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.chat-messages {
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		max-height: 400px;
		overflow-y: auto;
	}

	.chat-msg {
		display: flex;
		gap: var(--space-sm);
		align-items: flex-start;
	}

	.msg-avatar {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.student-avatar {
		background: var(--color-primary-muted);
		color: var(--color-primary);
	}

	.ai-avatar {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	.system-avatar {
		background: var(--color-warning-muted);
		color: var(--color-warning);
	}

	.msg-bubble {
		flex: 1;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.msg-bubble p {
		margin: 0;
	}

	.chat-msg.student .msg-bubble {
		background: var(--color-primary-muted);
	}

	.chat-msg.ai .msg-bubble {
		background: var(--color-bg-card);
	}

	.chat-msg.system .msg-bubble {
		background: var(--color-warning-muted);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-warning);
		border-left: 3px solid var(--color-warning);
	}

	.msg-system-label {
		display: inline-block;
		font-size: 0.5625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background: var(--color-warning);
		color: white;
		padding: 1px 5px;
		border-radius: var(--radius-sm);
		margin-bottom: var(--space-xs);
	}

	/* Scenario Result */
	.scenario-result {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-lg);
		border-radius: var(--radius-lg);
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	.scenario-result.scenario-a {
		background: var(--color-success-muted);
		border: 1px solid var(--color-success);
	}

	.scenario-result.scenario-b {
		background: var(--color-primary-muted);
		border: 1px solid var(--color-primary);
	}

	.scenario-result i {
		font-size: 1.25rem;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.scenario-a i {
		color: var(--color-success);
	}

	.scenario-b i {
		color: var(--color-primary);
	}

	/* No Scenario */
	.no-scenario {
		text-align: center;
		padding: var(--space-2xl);
		color: var(--color-text-muted);
	}

	.no-scenario i {
		font-size: 3rem;
		opacity: 0.3;
		display: block;
		margin-bottom: var(--space-md);
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

	/* Test Layout */
	.test-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: var(--space-lg);
		align-items: start;
	}

	.test-scenarios {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		min-width: 0;
	}

	.test-hooks-sidebar {
		position: sticky;
		top: var(--space-lg);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.test-layout {
			grid-template-columns: 1fr;
		}

		.contrast-grid {
			grid-template-columns: 1fr;
		}

		.persona-intro {
			flex-direction: column;
			text-align: center;
		}

		.scenario-buttons {
			flex-direction: column;
		}

		.scenario-btn {
			width: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.toggle-thumb {
			transition: none;
		}
	}
</style>
