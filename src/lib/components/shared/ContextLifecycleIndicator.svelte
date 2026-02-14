<script lang="ts">
	import type { PersonalState } from '$lib/vcp/types';
	import {
		computeEffectiveIntensity,
		computeLifecycleState,
		getDefaultDecayPolicy
	} from '$lib/vcp/decay';

	interface Props {
		personalState: PersonalState;
		onTogglePin?: (dimension: string, pinned: boolean) => void;
	}

	let { personalState, onTogglePin }: Props = $props();

	const dims = [
		{ key: 'cognitive_state' as const, emoji: '🧠', label: 'Cognitive' },
		{ key: 'emotional_tone' as const, emoji: '💭', label: 'Emotional' },
		{ key: 'energy_level' as const, emoji: '🔋', label: 'Energy' },
		{ key: 'perceived_urgency' as const, emoji: '⚡', label: 'Urgency' },
		{ key: 'body_signals' as const, emoji: '🩺', label: 'Body' }
	];

	let now = $state(new Date());
	let tickInterval: ReturnType<typeof setInterval> | undefined;

	$effect(() => {
		tickInterval = setInterval(() => {
			now = new Date();
		}, 1000);
		return () => {
			if (tickInterval) clearInterval(tickInterval);
		};
	});

	const dimStates = $derived(
		dims.map((dim) => {
			const d = personalState?.[dim.key];
			if (!d) return null;

			const policy = d.decay_policy ?? getDefaultDecayPolicy(dim.key);
			const isPinned = d.pinned ?? policy.pinned;
			const declaredAt = d.declared_at ? new Date(d.declared_at) : now;
			const declared = d.intensity ?? 3;
			const effective = isPinned
				? declared
				: computeEffectiveIntensity(declared, declaredAt, policy, now);
			const state = isPinned
				? 'active'
				: computeLifecycleState(declared, declaredAt, policy, now);
			const elapsed = Math.max(0, Math.round((now.getTime() - declaredAt.getTime()) / 1000));
			const progress = isPinned ? 1 : Math.max(0, (effective - policy.baseline) / Math.max(1, declared - policy.baseline));

			return {
				...dim,
				declared,
				effective,
				state,
				elapsed,
				progress,
				isPinned,
				hasDeclaredAt: !!d.declared_at
			};
		}).filter((d): d is NonNullable<typeof d> => d !== null)
	);

	function formatElapsed(seconds: number): string {
		if (seconds < 60) return `${seconds}s`;
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
		return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
	}

	function stateColor(state: string): string {
		if (state === 'set' || state === 'active') return 'var(--color-success)';
		if (state === 'decaying') return 'var(--color-warning)';
		if (state === 'stale') return 'var(--color-danger)';
		return 'var(--color-text-muted)';
	}

	function stateLabel(state: string): string {
		if (state === 'set') return 'Set';
		if (state === 'active') return 'Active';
		if (state === 'decaying') return 'Decaying';
		if (state === 'stale') return 'Stale';
		return 'Expired';
	}
</script>

<div class="lifecycle-indicator">
	<div class="lifecycle-header">
		<h3>
			<i class="fa-solid fa-hourglass-half" aria-hidden="true"></i>
			Context Lifecycle
		</h3>
	</div>

	{#if dimStates.length === 0}
		<p class="lifecycle-empty">No personal state dimensions set.</p>
	{:else}
		<div class="lifecycle-dims">
			{#each dimStates as dim}
				<div
					class="lifecycle-dim"
					class:expired={dim.state === 'expired'}
				>
					<div class="dim-top">
						<span class="dim-emoji">{dim.emoji}</span>
						<span class="dim-label">{dim.label}</span>
						<span
							class="dim-state"
							style="color: {stateColor(dim.state)}"
						>
							{stateLabel(dim.state)}
						</span>
						{#if onTogglePin}
							<button
								class="pin-btn"
								class:pinned={dim.isPinned}
								onclick={() => onTogglePin?.(dim.key, !dim.isPinned)}
								title={dim.isPinned ? 'Unpin (allow decay)' : 'Pin (prevent decay)'}
								aria-label={dim.isPinned ? `Unpin ${dim.label}` : `Pin ${dim.label}`}
							>
								<i class="fa-solid {dim.isPinned ? 'fa-thumbtack' : 'fa-thumbtack'}" aria-hidden="true"></i>
							</button>
						{/if}
					</div>

					<div class="dim-bar-container">
						<div
							class="dim-bar"
							style="width: {dim.progress * 100}%; background: {stateColor(dim.state)}"
						></div>
					</div>

					<div class="dim-meta">
						<span class="dim-intensity">
							{dim.effective}/{dim.declared}
						</span>
						{#if dim.hasDeclaredAt}
							<span class="dim-elapsed">
								{formatElapsed(dim.elapsed)} ago
							</span>
						{/if}
						{#if dim.isPinned}
							<span class="dim-pinned-badge">pinned</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.lifecycle-indicator {
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.lifecycle-header {
		padding: var(--space-sm) var(--space-md);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.lifecycle-header h3 {
		font-size: 0.8125rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin: 0;
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.lifecycle-empty {
		padding: var(--space-md);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-align: center;
	}

	.lifecycle-dims {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: rgba(255, 255, 255, 0.03);
	}

	.lifecycle-dim {
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-card);
		transition: opacity var(--transition-fast);
	}

	.lifecycle-dim.expired {
		opacity: 0.4;
	}

	.dim-top {
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
		font-weight: 500;
	}

	.dim-state {
		font-size: var(--text-xs);
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.pin-btn {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		cursor: pointer;
		padding: 2px 6px;
		font-size: 0.6875rem;
		transition: all var(--transition-fast);
	}

	.pin-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.pin-btn.pinned {
		background: var(--color-primary-muted);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.dim-bar-container {
		height: 4px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: var(--space-xs);
	}

	.dim-bar {
		height: 100%;
		border-radius: 2px;
		transition: width 1s linear;
	}

	.dim-meta {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
	}

	.dim-pinned-badge {
		background: var(--color-primary-muted);
		color: var(--color-primary);
		padding: 1px 4px;
		border-radius: var(--radius-sm);
		font-size: 0.5625rem;
		text-transform: uppercase;
	}
</style>
