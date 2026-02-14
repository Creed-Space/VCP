<script lang="ts">
	/**
	 * Campion Demo — Adaptation
	 *
	 * Shows how VCP context-switching works between personas.
	 * Senior engineer with work (Ambassador) and personal (Godparent) profiles.
	 * 4 steps: Meet, Morning at Work, Evening at Home, See the Switch.
	 */
	import { DemoWizard, StreamingChat } from '$lib/components/shared';
	import {
		workConstitution,
		personalConstitution,
		getGodparentResponse,
		getCampionRecommendationContext
	} from '$lib/personas/campion';

	const steps = [
		{ title: 'Meet Campion', icon: 'fa-user-tie' },
		{ title: 'Morning at Work', icon: 'fa-briefcase' },
		{ title: 'Evening at Home', icon: 'fa-house' },
		{ title: 'See the Switch', icon: 'fa-arrows-rotate' }
	];

	const recContext = getCampionRecommendationContext();
	const godparent = getGodparentResponse();

	// Work-time AI response (simulated)
	const workResponse = {
		greeting: 'Good morning, Campion.',
		main: 'Based on your Tech Lead goal and current workload, here are my recommendations:',
		items: [
			{
				label: 'Engineering Leadership Fundamentals',
				desc: 'Self-paced, 3 hrs/week, fits your schedule constraints',
				tag: 'Recommended'
			},
			{
				label: 'System Design Interview Prep',
				desc: 'Uses remaining training budget, short modules',
				tag: 'Budget-aware'
			},
			{
				label: 'Skip the conference this quarter',
				desc: 'Workload is high -- defer to Q3 when two projects wrap',
				tag: 'Schedule-aware'
			}
		],
		tone: 'Professional, direct, career-focused'
	};

	// Evening AI response (simulated)
	const eveningResponse = {
		greeting: godparent.greeting + ',',
		main: godparent.observation + ' ' + godparent.main_advice,
		items: [
			{
				label: godparent.tonight_suggestions[0].action,
				desc: godparent.tonight_suggestions[0].reason,
				tag: 'Low effort'
			},
			{
				label: godparent.tonight_suggestions[1].action,
				desc: godparent.tonight_suggestions[1].note ?? '',
				tag: 'Planning'
			},
			{
				label: 'Just rest tonight',
				desc: 'Sleep is more valuable than forced study',
				tag: 'Self-care'
			}
		],
		tone: 'Caring, supportive, protective'
	};

	// VCP context for the live chat -- work mode (Ambassador)
	const workVcpContext = {
		personal_state: {
			cognitive_state: { value: 'focused', intensity: 3 },
			emotional_tone: { value: 'neutral', intensity: 2 },
			energy_level: { value: 'rested', intensity: 3 },
			perceived_urgency: { value: 'time_aware', intensity: 3 },
			body_signals: { value: 'neutral', intensity: 1 }
		},
		constraints: {
			time_limited: true,
			budget_limited: false,
			energy_variable: true,
			schedule_irregular: true,
			health_considerations: true
		},
		public_profile: {
			role: 'senior_software_engineer',
			career_goal: 'tech_lead',
			learning_style: 'hands_on',
			budget_remaining_eur: 5000
		}
	};

	// VCP context for the live chat -- personal mode (Godparent)
	const personalVcpContext = {
		personal_state: {
			cognitive_state: { value: 'foggy', intensity: 4 },
			emotional_tone: { value: 'tense', intensity: 3 },
			energy_level: { value: 'fatigued', intensity: 4 },
			perceived_urgency: { value: 'unhurried', intensity: 2 },
			body_signals: { value: 'neutral', intensity: 1 }
		},
		constraints: {
			time_limited: true,
			budget_limited: false,
			energy_variable: true,
			schedule_irregular: true,
			health_considerations: true
		},
		public_profile: {
			role: 'senior_software_engineer',
			career_goal: 'tech_lead',
			learning_style: 'hands_on',
			context_type: 'personal'
		}
	};

	// Audit trail for step 4
	const auditTrail = [
		{ time: '08:45', event: 'Context detected: weekday, office hours', persona: 'Ambassador' },
		{ time: '08:45', event: 'Constitution loaded: techcorp.career.advisor', persona: 'Ambassador' },
		{ time: '08:46', event: 'Recommendations generated: career-focused, budget-aware', persona: 'Ambassador' },
		{ time: '17:30', event: 'Work hours ended -- context transition detected', persona: 'Transition' },
		{ time: '20:15', event: 'Context detected: evening, home, post-bedtime', persona: 'Godparent' },
		{ time: '20:15', event: 'Constitution loaded: personal.balanced.guide', persona: 'Godparent' },
		{ time: '20:16', event: 'Energy state: fatigued. Tone shifted to supportive.', persona: 'Godparent' },
		{ time: '20:16', event: 'Recommendations generated: rest-first, gentle options', persona: 'Godparent' }
	];
</script>

<svelte:head>
	<title>Campion: Adaptation - VCP Demos</title>
	<meta
		name="description"
		content="See how VCP switches between work and personal personas -- same person, same AI, different context."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Campion's Corporate Training — VCP Demo" />
	<meta property="og:description" content="Watch context switch automatically between work and personal profiles. No manual toggling needed." />
	<meta property="og:image" content="/vcp-logo.png" />
	<meta property="twitter:card" content="summary_large_image" />
</svelte:head>

<DemoWizard title="Campion: Adaptation" badge="Adaptation" badgeVariant="primary" {steps}>
	{#snippet children({ step })}
		{#if step === 0}
			<!-- ================================================ -->
			<!-- STEP 1: Meet Campion -->
			<!-- ================================================ -->
			<div class="character-card">
				<div class="character-avatar">
					<i class="fa-solid fa-user-tie" aria-hidden="true"></i>
				</div>
				<div class="character-info">
					<h2 class="character-name">Campion</h2>
					<p class="character-tagline">Senior software engineer at TechCorp, promotion track to Tech Lead</p>

					<div class="persona-badges">
						<div class="persona-badge work">
							<i class="fa-solid fa-briefcase" aria-hidden="true"></i>
							<div>
								<span class="persona-badge-label">Work Persona</span>
								<span class="persona-badge-name">Ambassador</span>
							</div>
						</div>
						<div class="persona-badge personal">
							<i class="fa-solid fa-heart" aria-hidden="true"></i>
							<div>
								<span class="persona-badge-label">Personal Persona</span>
								<span class="persona-badge-name">Godparent</span>
							</div>
						</div>
					</div>

					<div class="character-context">
						<div class="context-row">
							<span class="context-label">Goal</span>
							<span class="context-value">Tech Lead within 2 years</span>
						</div>
						<div class="context-row">
							<span class="context-label">Style</span>
							<span class="context-value">Hands-on learner, direct feedback</span>
						</div>
						<div class="context-row">
							<span class="context-label">Budget</span>
							<span class="context-value">5,000 EUR training budget remaining</span>
						</div>
					</div>
				</div>
			</div>

			<div class="step-insight">
				<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
				<p>
					Campion has two distinct contexts: professional and personal. Today, AI treats him the same
					regardless of when or where he's interacting. VCP lets the AI adapt to which Campion is present.
				</p>
			</div>

		{:else if step === 1}
			<!-- ================================================ -->
			<!-- STEP 2: Morning at Work -->
			<!-- ================================================ -->
			<div class="time-scene">
				<div class="scene-header work-scene">
					<div class="scene-time">
						<i class="fa-solid fa-sun" aria-hidden="true"></i>
						<span>09:00 — Tuesday Morning</span>
					</div>
					<div class="scene-persona">
						<span class="active-persona work">
							<i class="fa-solid fa-briefcase" aria-hidden="true"></i>
							Ambassador
						</span>
					</div>
				</div>

				<div class="scene-layout">
					<!-- AI Response -->
					<div class="ai-response-panel">
						<div class="panel-header">
							<i class="fa-solid fa-robot" aria-hidden="true"></i>
							<span>AI Training Platform</span>
						</div>
						<div class="ai-message">
							<p class="ai-greeting">{workResponse.greeting}</p>
							<p class="ai-main">{workResponse.main}</p>
							{#each workResponse.items as item}
								<div class="ai-item">
									<div class="ai-item-header">
										<strong>{item.label}</strong>
										<span class="ai-item-tag">{item.tag}</span>
									</div>
									<p class="ai-item-desc">{item.desc}</p>
								</div>
							{/each}
							<div class="ai-tone">
								<i class="fa-solid fa-comment" aria-hidden="true"></i>
								Tone: {workResponse.tone}
							</div>
						</div>
					</div>

					<!-- Privacy View -->
					<div class="privacy-panel">
						<div class="privacy-section visible">
							<h4>
								<i class="fa-solid fa-eye" aria-hidden="true"></i>
								What the platform sees
							</h4>
							<ul>
								{#each recContext.contextUsed as item}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
						<div class="privacy-section hidden-items">
							<h4>
								<i class="fa-solid fa-eye-slash" aria-hidden="true"></i>
								What stays private
							</h4>
							<ul>
								{#each recContext.contextWithheld as item}
									<li>{item.replace(/_/g, ' ')}</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>

				<!-- Live Chat with Mentor Persona (Work) -->
				<div class="live-chat-section">
					<h4 class="live-chat-heading">
						<i class="fa-solid fa-comments" aria-hidden="true"></i>
						Try It Live -- Ask the Ambassador
					</h4>
					<p class="live-chat-desc">
						Chat with an AI that reads Campion's work context. Ask about training options, career paths, or scheduling.
					</p>
					<StreamingChat
						systemContext={workVcpContext}
						constitutionId="techcorp.career.advisor"
						persona="mentor"
						fallbackResponse="Based on your current profile: You're in work mode with focused energy and high workload. I'd suggest the Engineering Leadership Fundamentals course -- it's self-paced, fits 3 hours per week, and aligns with your Tech Lead goal. Your 5,000 EUR budget covers it comfortably."
						placeholder="Ask about your training path..."
					/>
				</div>
			</div>

		{:else if step === 2}
			<!-- ================================================ -->
			<!-- STEP 3: Evening at Home -->
			<!-- ================================================ -->
			<div class="time-scene">
				<div class="scene-header personal-scene">
					<div class="scene-time">
						<i class="fa-solid fa-moon" aria-hidden="true"></i>
						<span>20:15 — Tuesday Evening</span>
					</div>
					<div class="scene-persona">
						<span class="active-persona personal">
							<i class="fa-solid fa-heart" aria-hidden="true"></i>
							Godparent
						</span>
					</div>
				</div>

				<div class="comparison-layout">
					<!-- Morning (dimmed) -->
					<div class="comparison-card dimmed">
						<div class="comparison-label">
							<i class="fa-solid fa-sun" aria-hidden="true"></i>
							Morning response
						</div>
						<p class="comparison-greeting">{workResponse.greeting}</p>
						<p class="comparison-main">{workResponse.main}</p>
						<div class="comparison-tone">
							<span class="tone-tag work">Ambassador</span>
							{workResponse.tone}
						</div>
					</div>

					<!-- Arrow -->
					<div class="comparison-arrow">
						<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
						<span>Same AI</span>
					</div>

					<!-- Evening (highlighted) -->
					<div class="comparison-card highlighted">
						<div class="comparison-label">
							<i class="fa-solid fa-moon" aria-hidden="true"></i>
							Evening response
						</div>
						<p class="comparison-greeting">{eveningResponse.greeting}</p>
						<p class="comparison-main">{eveningResponse.main}</p>
						{#each eveningResponse.items as item}
							<div class="ai-item compact">
								<div class="ai-item-header">
									<strong>{item.label}</strong>
									<span class="ai-item-tag personal-tag">{item.tag}</span>
								</div>
								<p class="ai-item-desc">{item.desc}</p>
							</div>
						{/each}
						<div class="comparison-tone">
							<span class="tone-tag personal">Godparent</span>
							{eveningResponse.tone}
						</div>
					</div>
				</div>

				<!-- Live Chat with Mentor Persona (Personal/Evening) -->
				<div class="live-chat-section">
					<h4 class="live-chat-heading">
						<i class="fa-solid fa-comments" aria-hidden="true"></i>
						Try It Live -- Ask the Godparent
					</h4>
					<p class="live-chat-desc">
						Same AI, different context. Now it reads Campion's evening state -- fatigued, personal mode. Ask the same question and see how the tone shifts.
					</p>
					<StreamingChat
						systemContext={personalVcpContext}
						constitutionId="personal.balanced.guide"
						persona="mentor"
						fallbackResponse="Hey Campion. I can see you're tired tonight. Starting a new course when exhausted won't be effective -- and you have that early standup tomorrow. How about just browsing the course intro for 5 minutes, or setting a realistic schedule for Saturday morning?"
						placeholder="Ask about your evening learning..."
					/>
				</div>

				<div class="step-insight">
					<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
					<p>
						Same AI, same person. The morning response pushes career growth.
						The evening response protects wellbeing. Context did the switching.
					</p>
				</div>
			</div>

		{:else if step === 3}
			<!-- ================================================ -->
			<!-- STEP 4: See the Switch -->
			<!-- ================================================ -->
			<div class="switch-summary">
				<h3 class="step-heading">
					<i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i>
					What Changed
				</h3>

				<div class="switch-grid">
					<div class="switch-card">
						<span class="switch-label">Active Persona</span>
						<div class="switch-values">
							<span class="switch-from">
								<i class="fa-solid fa-briefcase" aria-hidden="true"></i>
								Ambassador
							</span>
							<i class="fa-solid fa-arrow-right switch-arrow" aria-hidden="true"></i>
							<span class="switch-to">
								<i class="fa-solid fa-heart" aria-hidden="true"></i>
								Godparent
							</span>
						</div>
					</div>

					<div class="switch-card">
						<span class="switch-label">Constitution</span>
						<div class="switch-values">
							<span class="switch-from">{workConstitution.id}</span>
							<i class="fa-solid fa-arrow-right switch-arrow" aria-hidden="true"></i>
							<span class="switch-to">{personalConstitution.id}</span>
						</div>
					</div>

					<div class="switch-card">
						<span class="switch-label">Adherence</span>
						<div class="switch-values">
							<span class="switch-from">{workConstitution.adherence} (moderate)</span>
							<i class="fa-solid fa-arrow-right switch-arrow" aria-hidden="true"></i>
							<span class="switch-to">{personalConstitution.adherence} (strict)</span>
						</div>
					</div>

					<div class="switch-card">
						<span class="switch-label">Visible Context</span>
						<div class="switch-values">
							<span class="switch-from">Career goals, learning style</span>
							<i class="fa-solid fa-arrow-right switch-arrow" aria-hidden="true"></i>
							<span class="switch-to">Personal wellness, energy state</span>
						</div>
					</div>

					<div class="switch-card">
						<span class="switch-label">AI Behaviour</span>
						<div class="switch-values">
							<span class="switch-from">Direct, career-pushing</span>
							<i class="fa-solid fa-arrow-right switch-arrow" aria-hidden="true"></i>
							<span class="switch-to">Supportive, protective</span>
						</div>
					</div>
				</div>

				<!-- Audit Trail -->
				<div class="audit-section">
					<h4 class="audit-heading">
						<i class="fa-solid fa-clipboard-list" aria-hidden="true"></i>
						Audit Trail
					</h4>
					<div class="audit-list">
						{#each auditTrail as entry}
							<div
								class="audit-entry"
								class:work={entry.persona === 'Ambassador'}
								class:personal={entry.persona === 'Godparent'}
								class:transition={entry.persona === 'Transition'}
							>
								<span class="audit-time">{entry.time}</span>
								<span class="audit-event">{entry.event}</span>
								<span class="audit-persona">{entry.persona}</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="payoff-callout">
					<i class="fa-solid fa-check-circle" aria-hidden="true"></i>
					<div>
						<strong>Same AI, same person. Context did the switching.</strong>
						<p>
							No manual mode-toggling. No separate apps. VCP detected the context change and loaded
							the appropriate persona, scopes, and tone automatically.
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
		background: linear-gradient(135deg, var(--color-primary), #7c3aed);
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

	.persona-badges {
		display: flex;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.persona-badge {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--radius-lg);
		border: 1px solid;
	}

	.persona-badge.work {
		background: rgba(99, 102, 241, 0.08);
		border-color: var(--color-primary);
	}

	.persona-badge.work i {
		color: var(--color-primary);
		font-size: 1.25rem;
	}

	.persona-badge.personal {
		background: rgba(236, 72, 153, 0.08);
		border-color: #ec4899;
	}

	.persona-badge.personal i {
		color: #ec4899;
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
	}

	/* ============================================ */
	/* Step Heading */
	/* ============================================ */
	.step-heading {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 1.125rem;
		margin: 0 0 var(--space-lg);
	}

	.step-heading i {
		color: var(--color-primary);
	}

	/* ============================================ */
	/* Time Scene (Steps 2 & 3) */
	/* ============================================ */
	.scene-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-md) var(--space-lg);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-xl);
	}

	.scene-header.work-scene {
		background: rgba(99, 102, 241, 0.08);
		border: 1px solid var(--color-primary);
	}

	.scene-header.personal-scene {
		background: rgba(236, 72, 153, 0.08);
		border: 1px solid #ec4899;
	}

	.scene-time {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-weight: 600;
	}

	.scene-time i {
		color: var(--color-warning);
	}

	.active-persona {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xs) var(--space-md);
		border-radius: var(--radius-full);
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.active-persona.work {
		background: var(--color-primary);
		color: white;
	}

	.active-persona.personal {
		background: #ec4899;
		color: white;
	}

	/* Scene Layout */
	.scene-layout {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: var(--space-xl);
	}

	.ai-response-panel {
		background: var(--color-bg-elevated);
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.panel-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg-card);
		font-weight: 600;
		font-size: 0.875rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.panel-header i {
		color: var(--color-primary);
	}

	.ai-message {
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.ai-greeting {
		font-weight: 600;
		margin: 0;
	}

	.ai-main {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--color-text-muted);
	}

	.ai-item {
		padding: var(--space-md);
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--radius-md);
		border-left: 3px solid var(--color-primary);
	}

	.ai-item.compact {
		padding: var(--space-sm) var(--space-md);
	}

	.ai-item-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.ai-item-header strong {
		font-size: 0.875rem;
	}

	.ai-item-tag {
		font-size: 0.6875rem;
		padding: 2px 8px;
		background: var(--color-primary-muted);
		color: var(--color-primary);
		border-radius: var(--radius-sm);
		font-weight: 500;
		white-space: nowrap;
	}

	.ai-item-tag.personal-tag {
		background: rgba(236, 72, 153, 0.15);
		color: #ec4899;
	}

	.ai-item-desc {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.ai-tone {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.75rem;
		color: var(--color-text-subtle);
		padding-top: var(--space-sm);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	/* Privacy Panel */
	.privacy-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.privacy-section {
		padding: var(--space-lg);
		border-radius: var(--radius-lg);
	}

	.privacy-section.visible {
		background: var(--color-success-muted);
		border: 1px solid var(--color-success);
	}

	.privacy-section.hidden-items {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.privacy-section h4 {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.875rem;
		margin: 0 0 var(--space-md);
	}

	.privacy-section.visible h4 {
		color: var(--color-success);
	}

	.privacy-section.hidden-items h4 {
		color: var(--color-text-muted);
	}

	.privacy-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.privacy-section li {
		font-size: 0.8125rem;
		padding: var(--space-xs) var(--space-sm);
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
	}

	.privacy-section.hidden-items li {
		text-decoration: line-through;
		opacity: 0.6;
	}

	/* ============================================ */
	/* Comparison Layout (Step 3) */
	/* ============================================ */
	.comparison-layout {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: var(--space-lg);
		align-items: start;
	}

	.comparison-card {
		padding: var(--space-lg);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.comparison-card.dimmed {
		background: var(--color-bg-elevated);
		opacity: 0.6;
	}

	.comparison-card.highlighted {
		background: var(--color-bg-elevated);
		border-color: #ec4899;
	}

	.comparison-label {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-weight: 600;
		font-size: 0.875rem;
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-sm);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.comparison-greeting {
		font-weight: 600;
		margin: 0 0 var(--space-sm);
	}

	.comparison-main {
		margin: 0 0 var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--color-text-muted);
	}

	.comparison-tone {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.75rem;
		color: var(--color-text-subtle);
		padding-top: var(--space-sm);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		margin-top: var(--space-md);
	}

	.tone-tag {
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.tone-tag.work {
		background: var(--color-primary-muted);
		color: var(--color-primary);
	}

	.tone-tag.personal {
		background: rgba(236, 72, 153, 0.15);
		color: #ec4899;
	}

	.comparison-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xl) var(--space-sm);
		color: var(--color-text-muted);
	}

	.comparison-arrow i {
		font-size: 1.5rem;
		color: var(--color-primary);
	}

	.comparison-arrow span {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* ============================================ */
	/* Live Chat Section */
	/* ============================================ */
	.live-chat-section {
		margin-top: var(--space-xl);
	}

	.live-chat-heading {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 1rem;
		margin: 0 0 var(--space-xs);
	}

	.live-chat-heading i {
		color: var(--color-primary);
	}

	.live-chat-desc {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		margin: 0 0 var(--space-md);
	}

	/* ============================================ */
	/* Switch Summary (Step 4) */
	/* ============================================ */
	.switch-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-bottom: var(--space-xl);
	}

	.switch-card {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.switch-label {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		font-weight: 600;
		min-width: 120px;
		flex-shrink: 0;
	}

	.switch-values {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		flex: 1;
		flex-wrap: wrap;
	}

	.switch-from {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.875rem;
		color: var(--color-primary);
	}

	.switch-to {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.875rem;
		color: #ec4899;
		font-weight: 600;
	}

	.switch-arrow {
		color: var(--color-text-subtle);
		font-size: 0.75rem;
	}

	/* ============================================ */
	/* Audit Trail */
	/* ============================================ */
	.audit-section {
		margin-bottom: var(--space-xl);
	}

	.audit-heading {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.9375rem;
		margin: 0 0 var(--space-md);
	}

	.audit-heading i {
		color: var(--color-text-muted);
	}

	.audit-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.audit-entry {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
		border-left: 3px solid transparent;
	}

	.audit-entry.work {
		border-left-color: var(--color-primary);
	}

	.audit-entry.personal {
		border-left-color: #ec4899;
	}

	.audit-entry.transition {
		border-left-color: var(--color-warning);
		background: rgba(250, 204, 21, 0.05);
	}

	.audit-time {
		font-family: var(--font-mono, monospace);
		font-size: 0.75rem;
		color: var(--color-text-subtle);
		min-width: 40px;
		flex-shrink: 0;
	}

	.audit-event {
		flex: 1;
		color: var(--color-text-muted);
	}

	.audit-persona {
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.08);
		color: var(--color-text-subtle);
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
	@media (max-width: 768px) {
		.character-card {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.persona-badges {
			flex-direction: column;
		}

		.character-context {
			align-items: center;
		}

		.scene-header {
			flex-direction: column;
			gap: var(--space-sm);
			text-align: center;
		}

		.scene-layout {
			grid-template-columns: 1fr;
		}

		.comparison-layout {
			grid-template-columns: 1fr;
		}

		.comparison-arrow {
			flex-direction: row;
			padding: var(--space-md);
		}

		.switch-card {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-sm);
		}

		.switch-label {
			min-width: unset;
		}

		.audit-entry {
			flex-wrap: wrap;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.comparison-card,
		.audit-entry {
			transition: none;
		}
	}
</style>
