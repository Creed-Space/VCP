<script lang="ts">
	/**
	 * Prosaic Context Panel - Interactive controls for personal state dimensions
	 * Supports both legacy prosaic (0.0-1.0 sliders) and v3.1 personal_state (categorical + intensity)
	 */
	import type { ProsaicDimensions, PersonalState, CognitiveState, EmotionalTone, EnergyLevel, PerceivedUrgency, BodySignals } from '$lib/vcp/types';

	interface Props {
		prosaic?: ProsaicDimensions;
		personalState?: PersonalState;
		onchange?: (prosaic: ProsaicDimensions) => void;
		onPersonalStateChange?: (state: PersonalState) => void;
		compact?: boolean;
		readonly?: boolean;
		title?: string;
		showImpact?: boolean;
		impactSummary?: string[];
		mode?: 'prosaic' | 'personal_state';
	}

	let {
		prosaic = $bindable(),
		personalState = $bindable(),
		onchange,
		onPersonalStateChange,
		compact = false,
		readonly = false,
		title = 'Personal State',
		showImpact = true,
		impactSummary = [],
		mode = 'prosaic'
	}: Props = $props();

	// Legacy prosaic dimensions
	const dimensions = [
		{ key: 'urgency', emoji: '⚡', label: 'Urgency', lowLabel: 'Relaxed', highLabel: 'Critical' },
		{ key: 'health', emoji: '💊', label: 'Health Impact', lowLabel: 'Feeling fine', highLabel: 'Unwell' },
		{ key: 'cognitive', emoji: '🧩', label: 'Cognitive Load', lowLabel: 'Clear headed', highLabel: 'Overwhelmed' },
		{ key: 'affect', emoji: '💭', label: 'Emotional State', lowLabel: 'Calm', highLabel: 'Intense' }
	] as const;

	// v3.1 personal state dimension definitions
	const personalStateDims = [
		{ key: 'cognitive_state', emoji: '🧠', label: 'Cognitive', options: ['focused', 'distracted', 'overloaded', 'foggy', 'reflective'] as CognitiveState[] },
		{ key: 'emotional_tone', emoji: '💭', label: 'Emotional', options: ['calm', 'tense', 'frustrated', 'neutral', 'uplifted'] as EmotionalTone[] },
		{ key: 'energy_level', emoji: '🔋', label: 'Energy', options: ['rested', 'low_energy', 'fatigued', 'wired', 'depleted'] as EnergyLevel[] },
		{ key: 'perceived_urgency', emoji: '⚡', label: 'Urgency', options: ['unhurried', 'time_aware', 'pressured', 'critical'] as PerceivedUrgency[] },
		{ key: 'body_signals', emoji: '🩺', label: 'Body', options: ['neutral', 'discomfort', 'pain', 'unwell', 'recovering'] as BodySignals[] }
	] as const;

	const presets = [
		{ id: 'normal', label: 'Normal', values: { urgency: 0.2, health: 0.1, cognitive: 0.2, affect: 0.2 } },
		{ id: 'hurry', label: 'In a hurry', values: { urgency: 0.9, health: 0.1, cognitive: 0.4, affect: 0.3 } },
		{ id: 'unwell', label: 'Not well', values: { urgency: 0.2, health: 0.7, cognitive: 0.5, affect: 0.4 } },
		{ id: 'overwhelmed', label: 'Overwhelmed', values: { urgency: 0.4, health: 0.3, cognitive: 0.9, affect: 0.6 } },
		{ id: 'grieving', label: 'Grieving', values: { urgency: 0.1, health: 0.4, cognitive: 0.5, affect: 0.9 } },
		{ id: 'crisis', label: 'Crisis mode', values: { urgency: 0.95, health: 0.6, cognitive: 0.8, affect: 0.8 } }
	];

	const personalStatePresets = [
		{ id: 'normal', label: 'Normal', values: { cognitive_state: { value: 'focused' as CognitiveState, intensity: 3 }, emotional_tone: { value: 'calm' as EmotionalTone, intensity: 2 }, energy_level: { value: 'rested' as EnergyLevel, intensity: 3 }, perceived_urgency: { value: 'unhurried' as PerceivedUrgency, intensity: 2 }, body_signals: { value: 'neutral' as BodySignals, intensity: 1 } } },
		{ id: 'stressed', label: 'Stressed', values: { cognitive_state: { value: 'overloaded' as CognitiveState, intensity: 4 }, emotional_tone: { value: 'tense' as EmotionalTone, intensity: 4 }, energy_level: { value: 'fatigued' as EnergyLevel, intensity: 3 }, perceived_urgency: { value: 'pressured' as PerceivedUrgency, intensity: 4 }, body_signals: { value: 'discomfort' as BodySignals, intensity: 2 } } },
		{ id: 'crisis', label: 'Crisis', values: { cognitive_state: { value: 'overloaded' as CognitiveState, intensity: 5 }, emotional_tone: { value: 'frustrated' as EmotionalTone, intensity: 5 }, energy_level: { value: 'depleted' as EnergyLevel, intensity: 4 }, perceived_urgency: { value: 'critical' as PerceivedUrgency, intensity: 5 }, body_signals: { value: 'unwell' as BodySignals, intensity: 3 } } }
	];

	function updateDimension(key: keyof ProsaicDimensions, value: number) {
		if (readonly) return;
		prosaic = { ...prosaic, [key]: value };
		onchange?.(prosaic!);
	}

	function applyPreset(preset: typeof presets[0]) {
		if (readonly) return;
		prosaic = { ...prosaic, ...preset.values };
		onchange?.(prosaic!);
	}

	function updatePersonalStateDim(key: string, field: 'value' | 'intensity', newValue: string | number) {
		if (readonly || !personalState) return;
		const current = personalState[key as keyof PersonalState] ?? { value: '', intensity: 3 };
		personalState = {
			...personalState,
			[key]: { ...current, [field]: newValue }
		};
		onPersonalStateChange?.(personalState);
	}

	function applyPersonalStatePreset(preset: typeof personalStatePresets[0]) {
		if (readonly) return;
		personalState = { ...preset.values };
		onPersonalStateChange?.(personalState!);
	}

	function getIntensityColor(intensity: number): string {
		if (intensity >= 4) return 'var(--color-danger)';
		if (intensity >= 3) return 'var(--color-warning)';
		return 'var(--color-success)';
	}

	function getHintText(key: string, value: number): string {
		if (key === 'urgency') {
			if (value >= 0.8) return '"I need this NOW"';
			if (value >= 0.5) return 'Some time pressure';
			return 'No rush';
		}
		if (key === 'health') {
			if (value >= 0.7) return '"I\'m not feeling well"';
			if (value >= 0.4) return 'Some fatigue/discomfort';
			return 'Feeling okay';
		}
		if (key === 'cognitive') {
			if (value >= 0.8) return '"Too many options"';
			if (value >= 0.5) return 'Some mental load';
			return 'Clear headed';
		}
		if (key === 'affect') {
			if (value >= 0.8) return 'High emotional intensity';
			if (value >= 0.5) return 'Some stress/emotion';
			return 'Calm, neutral';
		}
		return '';
	}

	function getBarColor(value: number): string {
		if (value >= 0.7) return 'var(--color-danger)';
		if (value >= 0.4) return 'var(--color-warning)';
		return 'var(--color-success)';
	}
</script>

<div class="prosaic-panel" class:compact class:readonly>
	<div class="panel-header">
		<h3>{title}</h3>
		<span class="prosaic-badge">{mode === 'personal_state' ? '🧠💭🔋⚡🩺' : '⚡💊🧩💭'}</span>
	</div>

	{#if mode === 'personal_state'}
		<!-- v3.1 Personal State: categorical dropdowns + intensity sliders -->
		{#if !compact}
			<div class="presets">
				{#each personalStatePresets as preset}
					<button
						class="preset-btn"
						onclick={() => applyPersonalStatePreset(preset)}
						disabled={readonly}
					>
						{preset.label}
					</button>
				{/each}
			</div>
		{/if}

		<div class="dimensions">
			{#each personalStateDims as dim}
				{@const current = personalState?.[dim.key as keyof PersonalState]}
				{@const currentValue = current?.value ?? dim.options[0]}
				{@const intensity = current?.intensity ?? 3}
				<div class="dimension" class:high={intensity >= 4} class:medium={intensity === 3}>
					<div class="dim-header">
						<span class="dim-emoji">{dim.emoji}</span>
						<span class="dim-label">{dim.label}</span>
						<span class="dim-value">{intensity}/5</span>
					</div>
					{#if !readonly}
						<select
							class="dim-select"
							value={currentValue}
							onchange={(e) => updatePersonalStateDim(dim.key, 'value', e.currentTarget.value)}
							aria-label="{dim.label} category"
						>
							{#each dim.options as opt}
								<option value={opt}>{opt.replace(/_/g, ' ')}</option>
							{/each}
						</select>
						<input
							type="range"
							min="1"
							max="5"
							step="1"
							value={intensity}
							oninput={(e) => updatePersonalStateDim(dim.key, 'intensity', parseInt(e.currentTarget.value))}
							class="dim-slider"
							aria-label="{dim.label} intensity: {intensity}"
							aria-valuemin={1}
							aria-valuemax={5}
							aria-valuenow={intensity}
						/>
					{:else}
						<div class="dim-readonly-value">{String(currentValue).replace(/_/g, ' ')}</div>
						<div class="dim-bar">
							<div class="dim-bar-fill" style="width: {(intensity / 5) * 100}%; background: {getIntensityColor(intensity)}"></div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<!-- Legacy prosaic mode: 0.0-1.0 float sliders -->
		{#if !compact}
			<div class="presets">
				{#each presets as preset}
					<button
						class="preset-btn"
						onclick={() => applyPreset(preset)}
						disabled={readonly}
					>
						{preset.label}
					</button>
				{/each}
			</div>
		{/if}

		<div class="dimensions">
			{#each dimensions as dim}
				{@const rawValue = prosaic?.[dim.key as keyof ProsaicDimensions]}
				{@const value = typeof rawValue === 'number' ? rawValue : 0}
				<div class="dimension" class:high={value >= 0.7} class:medium={value >= 0.4 && value < 0.7}>
					<div class="dim-header">
						<span class="dim-emoji">{dim.emoji}</span>
						<span class="dim-label">{dim.label}</span>
						<span class="dim-value">{value.toFixed(1)}</span>
					</div>
					{#if !readonly}
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={value}
							oninput={(e) => updateDimension(dim.key as keyof ProsaicDimensions, parseFloat(e.currentTarget.value))}
							class="dim-slider"
							aria-label="{dim.label}: {value.toFixed(1)}"
							aria-valuemin="0"
							aria-valuemax="1"
							aria-valuenow={value}
							aria-valuetext="{value >= 0.7 ? dim.highLabel : value >= 0.4 ? 'moderate' : dim.lowLabel}"
						/>
					{:else}
						<div class="dim-bar">
							<div class="dim-bar-fill" style="width: {value * 100}%; background: {getBarColor(value)}"></div>
						</div>
					{/if}
					{#if !compact}
						<div class="dim-hint">{getHintText(dim.key, value)}</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#if showImpact && impactSummary.length > 0}
		<div class="impact-section">
			<h4>How this affects adaptation:</h4>
			<ul class="impact-list">
				{#each impactSummary as impact}
					<li>{impact}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.prosaic-panel {
		background: var(--color-bg-card);
		border: 1px solid rgba(16, 185, 129, 0.3);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
	}

	.prosaic-panel.compact {
		padding: var(--space-md);
	}

	.prosaic-panel.readonly {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent);
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-md);
	}

	.panel-header h3 {
		margin: 0;
		font-size: 1rem;
		color: var(--color-success);
	}

	.prosaic-badge {
		font-size: 0.875rem;
		opacity: 0.7;
	}

	.presets {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-md);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.preset-btn {
		padding: var(--space-xs) var(--space-sm);
		font-size: 0.6875rem;
		background: var(--color-bg);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
		color: var(--color-text);
	}

	.preset-btn:hover:not(:disabled) {
		border-color: var(--color-success);
		background: rgba(16, 185, 129, 0.1);
	}

	.preset-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.dimensions {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.compact .dimensions {
		gap: var(--space-sm);
	}

	.dimension {
		padding: var(--space-sm);
		background: rgba(255, 255, 255, 0.02);
		border-radius: var(--radius-md);
		border-left: 3px solid var(--color-success);
		transition: border-color var(--transition-fast);
	}

	.dimension.medium {
		border-left-color: var(--color-warning);
	}

	.dimension.high {
		border-left-color: var(--color-danger);
	}

	.dim-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.dim-emoji {
		font-size: 1rem;
	}

	.dim-label {
		flex: 1;
		font-size: var(--text-sm);
	}

	.compact .dim-label {
		font-size: var(--text-xs);
	}

	.dim-value {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-primary);
		min-width: 2rem;
		text-align: right;
	}

	.dim-select {
		width: 100%;
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-bg);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font-size: var(--text-sm);
		margin-bottom: var(--space-xs);
		text-transform: capitalize;
	}

	.dim-readonly-value {
		font-size: var(--text-sm);
		color: var(--color-text);
		text-transform: capitalize;
		margin-bottom: var(--space-xs);
	}

	.dim-slider {
		width: 100%;
		accent-color: var(--color-success);
	}

	.dim-bar {
		height: 6px;
		background: var(--color-bg);
		border-radius: 3px;
		overflow: hidden;
	}

	.dim-bar-fill {
		height: 100%;
		border-radius: 3px;
		transition: width var(--transition-normal);
	}

	.dim-hint {
		font-size: 0.6875rem;
		color: var(--color-text-muted);
		font-style: italic;
		margin-top: var(--space-xs);
		min-height: 1rem;
	}

	.impact-section {
		margin-top: var(--space-md);
		padding-top: var(--space-md);
		border-top: 1px solid rgba(255, 255, 255, 0.05);
	}

	.impact-section h4 {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin: 0 0 var(--space-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.impact-list {
		margin: 0;
		padding-left: var(--space-md);
		font-size: var(--text-sm);
	}

	.impact-list li {
		margin: var(--space-xs) 0;
		color: var(--color-text-muted);
	}
</style>
