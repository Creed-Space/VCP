<script lang="ts">
	/**
	 * CompassTab — Philosophical profile questionnaire.
	 * Maps everyday preferences to constitution modules, generation preferences,
	 * and dimensional modifiers in real time.
	 */
	import { untrack } from 'svelte';
	import { deriveConstitutions, deriveGenerationPrefs, deriveDimensionalModifiers, CONSTITUTION_MAP } from '$lib/vcp/compass';
	import type { CompassProfile, ConstitutionInfo } from '$lib/vcp/compass';

	let { onSyncContext, onNavigateToContext }: {
		onSyncContext?: (constitutionId: string, genPrefs: Record<string, number>) => void;
		onNavigateToContext?: () => void;
	} = $props();

	let profile = $state<CompassProfile>({
		metaethics: null,
		epistemology: null,
		optimize_for: null,
		risk_tolerance: null,
		communication_style: null,
		explanations: null
	});

	let constitutions = $derived(deriveConstitutions(profile));
	let genPrefs = $derived(deriveGenerationPrefs(profile));
	let modifiers = $derived(deriveDimensionalModifiers(profile));
	let hasSelections = $derived(constitutions.length > 0 || Object.keys(genPrefs).length > 0 || Object.keys(modifiers).length > 0);

	const questions: Array<{
		key: keyof CompassProfile;
		label: string;
		icon: string;
		description: string;
		options: Array<{ value: string; label: string }>;
	}> = [
		{ key: 'optimize_for', label: 'What matters most to you?', icon: 'fa-heart', description: 'Your core value shapes which constitution modules activate.', options: [{ value: 'stability', label: 'Stability and security' }, { value: 'growth', label: 'Growth and learning' }, { value: 'freedom', label: 'Freedom and independence' }, { value: 'connection', label: 'Connection and relationships' }] },
		{ key: 'epistemology', label: 'How do you trust information?', icon: 'fa-magnifying-glass', description: 'Your epistemic style determines how the AI reasons with you.', options: [{ value: 'empiricist', label: 'Evidence — show me data' }, { value: 'rationalist', label: 'Logic — walk me through it' }, { value: 'pragmatist', label: 'Results — what works?' }, { value: 'skeptic', label: 'Caution — question everything' }] },
		{ key: 'metaethics', label: 'When facing tough calls...', icon: 'fa-scale-balanced', description: 'Your ethical lens guides how the AI handles moral dilemmas.', options: [{ value: 'consequentialist', label: 'The outcome matters most' }, { value: 'deontological', label: 'The principle matters most' }, { value: 'virtue_ethics', label: 'Character matters most' }, { value: 'anti_realist', label: 'It depends on context' }] },
		{ key: 'communication_style', label: 'How should AI talk to you?', icon: 'fa-comment-dots', description: 'Sets formality and directness generation preferences.', options: [{ value: 'gentle', label: 'Gently — softer tone' }, { value: 'balanced', label: 'Balanced — middle ground' }, { value: 'direct', label: 'Directly — no sugarcoating' }] },
		{ key: 'risk_tolerance', label: 'How much risk is OK?', icon: 'fa-gauge-high', description: 'Adjusts trust and rule-rigidity dimensional modifiers.', options: [{ value: 'conservative', label: 'Play it safe' }, { value: 'calculated', label: 'Weigh it carefully' }, { value: 'aggressive', label: 'Fortune favours the bold' }] },
		{ key: 'explanations', label: 'How detailed should explanations be?', icon: 'fa-list-check', description: 'Controls depth and technical level of AI responses.', options: [{ value: 'minimal', label: 'Just the answer' }, { value: 'brief', label: 'Brief context' }, { value: 'detailed', label: 'Full reasoning' }] }
	];

	const prefLabels: Record<string, string> = {
		formality: 'Formality', directness: 'Directness',
		depth: 'Depth', technical_level: 'Technical Level'
	};

	const modifierLabels: Record<string, string> = {
		trust_default: 'Trust Default', rule_rigidity: 'Rule Rigidity'
	};

	/** Unique accent color per question for preference↔derivation tracing */
	const questionColors: Record<string, string> = {
		optimize_for:        '#f97316',
		epistemology:        '#06b6d4',
		metaethics:          '#8b5cf6',
		communication_style: '#34d399',
		risk_tolerance:      '#f59e0b',
		explanations:        '#60a5fa',
	};

	/** Derivation titles/descriptions for gen prefs and modifiers (mirrors constitution card layout) */
	const commStyleTitles: Record<string, { title: string; desc: string }> = {
		gentle: { title: 'Gentle Communication', desc: 'Softer tone with higher formality, lower directness' },
		balanced: { title: 'Balanced Communication', desc: 'Middle ground on formality and directness' },
		direct: { title: 'Direct Communication', desc: 'Lower formality, higher directness — no sugarcoating' },
	};
	const explTitles: Record<string, { title: string; desc: string }> = {
		minimal: { title: 'Minimal Explanations', desc: 'Just the answer — low depth, low technical level' },
		brief: { title: 'Brief Explanations', desc: 'Moderate depth with balanced technical detail' },
		detailed: { title: 'Full Reasoning', desc: 'Deep analysis with high technical detail' },
	};
	const riskTitles: Record<string, { title: string; desc: string }> = {
		conservative: { title: 'Conservative Risk', desc: 'Lower trust default, higher rule rigidity' },
		calculated: { title: 'Calculated Risk', desc: 'Neutral trust and rigidity — balanced approach' },
		aggressive: { title: 'Bold Risk', desc: 'Higher trust default, lower rule rigidity' },
	};

	/** Map gen-pref keys back to the question that produced them */
	const genPrefSourceMap: Record<string, keyof CompassProfile> = {
		formality: 'communication_style',
		directness: 'communication_style',
		depth: 'explanations',
		technical_level: 'explanations',
	};

	function getConstitutionSource(c: ConstitutionInfo): keyof CompassProfile | null {
		if (profile.metaethics && CONSTITUTION_MAP[profile.metaethics]?.id === c.id) return 'metaethics';
		if (profile.epistemology && CONSTITUTION_MAP[profile.epistemology]?.id === c.id) return 'epistemology';
		if (profile.optimize_for && CONSTITUTION_MAP[profile.optimize_for]?.id === c.id) return 'optimize_for';
		return null;
	}

	function resetProfile() {
		profile = { metaethics: null, epistemology: null, optimize_for: null, risk_tolerance: null, communication_style: null, explanations: null };
	}

	function handleSelect(key: keyof CompassProfile, value: string) {
		if (profile[key] === value) {
			profile[key] = null as never;
		} else {
			profile[key] = value as never;
		}
	}

	// Auto-sync derived values to context builder whenever they change.
	// untrack the callback so the parent's read of context.constitution
	// (via spread) doesn't become a dependency of this effect.
	$effect(() => {
		if (constitutions.length > 0) {
			const id = constitutions[0].path;
			const prefs = genPrefs;
			untrack(() => onSyncContext?.(id, prefs));
		}
	});
</script>

<!-- Mapping Chain -->
<div class="mapping-chain">
	<span class="chain-step"><i class="fa-solid fa-user" aria-hidden="true"></i> Everyday answer</span>
	<i class="fa-solid fa-arrow-right chain-arrow" aria-hidden="true"></i>
	<span class="chain-step"><i class="fa-solid fa-book" aria-hidden="true"></i> Philosophical category</span>
	<i class="fa-solid fa-arrow-right chain-arrow" aria-hidden="true"></i>
	<span class="chain-step"><i class="fa-solid fa-scroll" aria-hidden="true"></i> Constitution module</span>
	<i class="fa-solid fa-arrow-right chain-arrow" aria-hidden="true"></i>
	<span class="chain-step"><i class="fa-solid fa-robot" aria-hidden="true"></i> Behavior change</span>
</div>

<div class="two-panel">
	<!-- Left Panel: Questions -->
	<div class="panel panel-questions">
		<div class="panel-header">
			<h2><i class="fa-solid fa-sliders" aria-hidden="true"></i> Your Preferences</h2>
			<button class="reset-btn" onclick={resetProfile} aria-label="Reset all selections">
				<i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Reset
			</button>
		</div>

		{#each questions as q}
			<div class="question-group" style="--q-color: {questionColors[q.key]}">
				<span class="question-label">
					<i class="fa-solid {q.icon}" aria-hidden="true"></i>
					{q.label}
				</span>
				<p class="question-desc">{q.description}</p>
				<div class="option-grid" role="radiogroup" aria-label={q.label}>
					{#each q.options as opt}
						<button
							class="option-btn"
							class:selected={profile[q.key] === opt.value}
							onclick={() => handleSelect(q.key, opt.value)}
							role="radio"
							aria-checked={profile[q.key] === opt.value}
						>
							{opt.label}
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<!-- Right Panel: Live Output -->
	<div class="panel panel-output">
		<div class="panel-header">
			<h2><i class="fa-solid fa-bolt" aria-hidden="true"></i> Live Derivation</h2>
			{#if onNavigateToContext && hasSelections && constitutions.length > 0}
				<button class="btn btn-primary btn-sm" onclick={onNavigateToContext}>
					<i class="fa-solid fa-play" aria-hidden="true"></i> See your choices in action
				</button>
			{/if}
		</div>

		{#if !hasSelections}
			<div class="empty-state">
				<i class="fa-solid fa-hand-pointer" aria-hidden="true"></i>
				<p>Select preferences on the left to see how they shape AI behavior.</p>
			</div>
		{:else}
			<div class="derivation-list">
				{#each constitutions as c}
					{@const source = getConstitutionSource(c)}
					<div class="derivation-item" style="--q-color: {source ? questionColors[source] : 'var(--color-primary)'}">
						<div class="deriv-source">
							<i class="fa-solid {source ? (questions.find(q => q.key === source)?.icon ?? 'fa-link') : 'fa-scroll'}" aria-hidden="true"></i>
							{source ? questions.find(q => q.key === source)?.label : 'Constitution'}
						</div>
						<div class="deriv-title">{c.title}</div>
						<div class="deriv-detail">{c.description}</div>
					</div>
				{/each}

				{#if profile.communication_style}
					{@const info = commStyleTitles[profile.communication_style]}
					<div class="derivation-item" style="--q-color: {questionColors['communication_style']}">
						<div class="deriv-source">
							<i class="fa-solid fa-comment-dots" aria-hidden="true"></i>
							How should AI talk to you?
						</div>
						<div class="deriv-title">{info.title}</div>
						<div class="deriv-detail">Formality {Math.round((genPrefs.formality ?? 0) * 100)}% · Directness {Math.round((genPrefs.directness ?? 0) * 100)}%</div>
					</div>
				{/if}

				{#if profile.explanations}
					{@const info = explTitles[profile.explanations]}
					<div class="derivation-item" style="--q-color: {questionColors['explanations']}">
						<div class="deriv-source">
							<i class="fa-solid fa-list-check" aria-hidden="true"></i>
							How detailed should explanations be?
						</div>
						<div class="deriv-title">{info.title}</div>
						<div class="deriv-detail">Depth {Math.round((genPrefs.depth ?? 0) * 100)}% · Technical Level {Math.round((genPrefs.technical_level ?? 0) * 100)}%</div>
					</div>
				{/if}

				{#if profile.risk_tolerance}
					{@const riskInfo = riskTitles[profile.risk_tolerance]}
					<div class="derivation-item" style="--q-color: {questionColors['risk_tolerance']}">
						<div class="deriv-source">
							<i class="fa-solid fa-gauge-high" aria-hidden="true"></i>
							How much risk is OK?
						</div>
						<div class="deriv-title">{riskInfo.title}</div>
						<div class="deriv-detail">Trust {modifiers.trust_default > 0 ? '+' : ''}{modifiers.trust_default?.toFixed(2)} · Rigidity {modifiers.rule_rigidity > 0 ? '+' : ''}{modifiers.rule_rigidity?.toFixed(2)}</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.mapping-chain {
		display: flex; align-items: center; justify-content: center;
		gap: var(--space-sm); flex-wrap: wrap; margin-bottom: var(--space-lg);
	}

	.chain-step {
		display: inline-flex; align-items: center; gap: var(--space-xs);
		padding: var(--space-xs) var(--space-sm);
		background: var(--glass-bg, rgba(255, 255, 255, 0.03));
		border: var(--glass-border, 1px solid rgba(255, 255, 255, 0.06));
		border-radius: var(--radius-md); font-size: var(--text-sm);
		color: var(--color-text-muted); white-space: nowrap;
	}

	.chain-step i { color: var(--color-primary); }
	.chain-arrow { color: var(--color-text-subtle, var(--color-text-muted)); font-size: var(--text-xs); }

	.two-panel { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); align-items: start; }

	.panel {
		background: var(--glass-bg, var(--color-bg-card));
		border: var(--glass-border, 1px solid rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-lg); padding: var(--space-lg);
	}

	.panel-header {
		display: flex; align-items: center; justify-content: space-between;
		margin-bottom: var(--space-lg); padding-bottom: var(--space-md);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.panel-header h2 {
		display: flex; align-items: center; gap: var(--space-sm);
		font-size: var(--text-xl); font-weight: 600; margin: 0;
	}

	.panel-header h2 i { color: var(--color-primary); }
	.panel-output { position: sticky; top: 100px; }

	.reset-btn {
		display: inline-flex; align-items: center; gap: var(--space-xs);
		padding: var(--space-xs) var(--space-sm); background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-sm);
		color: var(--color-text-muted); font-size: var(--text-sm); cursor: pointer;
		transition: all var(--transition-fast);
	}

	.reset-btn:hover { background: rgba(255, 255, 255, 0.1); color: var(--color-text); }
	.reset-btn:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

	/* Preference question cards — boxed with colored left accent */
	.question-group {
		margin-bottom: var(--space-md);
		padding: var(--space-md);
		background: color-mix(in srgb, var(--q-color) 5%, transparent);
		border: 1px solid color-mix(in srgb, var(--q-color) 15%, transparent);
		border-left: 3px solid var(--q-color);
		border-radius: var(--radius-md);
		transition: background var(--transition-fast);
	}
	.question-group:last-child { margin-bottom: 0; }
	.question-group:hover { background: color-mix(in srgb, var(--q-color) 8%, transparent); }

	.question-label {
		display: flex; align-items: center; gap: var(--space-sm);
		font-size: var(--text-base); font-weight: 600; color: var(--color-text);
		margin-bottom: var(--space-xs);
	}

	.question-label i { color: var(--q-color, var(--color-primary)); width: 16px; text-align: center; }

	.question-desc {
		font-size: var(--text-sm); color: var(--color-text-subtle, var(--color-text-muted));
		margin-bottom: var(--space-sm); padding-left: 28px;
	}

	.option-grid { display: flex; flex-wrap: wrap; gap: var(--space-xs); padding-left: 28px; }

	.option-btn {
		padding: var(--space-xs) var(--space-md);
		background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-md); color: var(--color-text-muted);
		font-size: var(--text-sm); cursor: pointer; transition: all var(--transition-fast);
	}

	.option-btn:hover {
		background: color-mix(in srgb, var(--q-color) 10%, transparent);
		border-color: color-mix(in srgb, var(--q-color) 30%, transparent);
		color: var(--color-text);
	}
	.option-btn:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

	.option-btn.selected {
		background: color-mix(in srgb, var(--q-color) 15%, transparent);
		border-color: var(--q-color);
		color: var(--q-color); font-weight: 500;
	}

	.empty-state { text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--color-text-subtle, var(--color-text-muted)); }
	.empty-state i { font-size: 2rem; margin-bottom: var(--space-md); color: var(--color-primary-muted); display: block; }
	.empty-state p { font-size: var(--text-sm); line-height: var(--leading-relaxed, 1.6); }

	/* Lightweight derivation list — colored left accents, no full card boxes */
	.derivation-list { display: flex; flex-direction: column; }

	.derivation-item {
		padding: var(--space-sm) var(--space-md);
		border-left: 3px solid var(--q-color, var(--color-primary));
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		transition: background var(--transition-fast);
	}
	.derivation-item:last-child { border-bottom: none; }
	.derivation-item:hover { background: color-mix(in srgb, var(--q-color) 5%, transparent); }

	.deriv-source {
		display: flex; align-items: center; gap: var(--space-xs);
		font-size: var(--text-xs); color: var(--q-color);
		font-weight: 500; margin-bottom: 2px;
	}
	.deriv-source i { font-size: 0.625rem; }

	.deriv-title { font-weight: 600; font-size: var(--text-sm); color: var(--color-text); }

	.deriv-detail {
		font-size: var(--text-xs); color: var(--color-text-subtle, var(--color-text-muted));
		margin-top: 1px;
	}

	@media (max-width: 900px) {
		.two-panel { grid-template-columns: 1fr; }
		.panel-output { position: static; }
	}

	@media (max-width: 640px) {
		.mapping-chain { flex-direction: column; }
		.chain-arrow { transform: rotate(90deg); }
		.option-grid { padding-left: 0; }
		.question-desc { padding-left: 0; }
	}
</style>
