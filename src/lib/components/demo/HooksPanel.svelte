<script lang="ts">
	/**
	 * HooksPanel - Reusable 3-tier deterministic hooks display
	 * Shows constitutional, situational, and personal hooks with activation state
	 */

	export type HookTier = 'constitutional' | 'situational' | 'personal';

	export interface Hook {
		id: string;
		tier: HookTier;
		label: string;
		trigger: string;
		action: string;
		active: boolean;
	}

	interface Props {
		hooks: Hook[];
		compact?: boolean;
		title?: string;
	}

	let { hooks, compact = false, title = 'Active Hooks' }: Props = $props();

	const tierConfig: Record<HookTier, { color: string; border: string; badge: string; icon: string }> = {
		constitutional: {
			color: 'rgba(239, 68, 68, 0.1)',
			border: 'var(--color-danger, #ef4444)',
			badge: 'Hard Rule',
			icon: 'fa-gavel'
		},
		situational: {
			color: 'rgba(245, 158, 11, 0.1)',
			border: 'var(--color-warning, #f59e0b)',
			badge: 'Hard Rule',
			icon: 'fa-clock'
		},
		personal: {
			color: 'rgba(34, 197, 94, 0.1)',
			border: 'var(--color-success, #22c55e)',
			badge: 'Advisory',
			icon: 'fa-user'
		}
	};

	const tierOrder: HookTier[] = ['constitutional', 'situational', 'personal'];

	let groupedHooks = $derived.by(() => {
		const groups: Record<HookTier, Hook[]> = {
			constitutional: [],
			situational: [],
			personal: []
		};
		for (const hook of hooks) {
			groups[hook.tier].push(hook);
		}
		return groups;
	});
</script>

<div class="hooks-panel" class:compact>
	<div class="hooks-header">
		<h4>
			<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
			{title}
		</h4>
		<span class="hooks-count">{hooks.filter(h => h.active).length}/{hooks.length} active</span>
	</div>

	<div class="hooks-stack">
		{#each tierOrder as tier}
			{@const tierHooks = groupedHooks[tier]}
			{@const config = tierConfig[tier]}
			{#if tierHooks.length > 0}
				<div
					class="tier-card"
					style="background: {config.color}; border-left-color: {config.border}"
				>
					<div class="tier-header">
						<span class="tier-label">
							<i class="fa-solid {config.icon}" aria-hidden="true" style="color: {config.border}"></i>
							{tier}
						</span>
						<span class="tier-badge" style="color: {config.border}; border-color: {config.border}">
							{config.badge}
						</span>
					</div>

					<div class="tier-hooks">
						{#each tierHooks as hook}
							<div class="hook-item" class:active={hook.active} class:inactive={!hook.active}>
								<div class="hook-status">
									{#if hook.active}
										<i class="fa-solid fa-circle-check" aria-hidden="true" style="color: {config.border}"></i>
									{:else}
										<i class="fa-regular fa-circle" aria-hidden="true"></i>
									{/if}
								</div>
								<div class="hook-content">
									<span class="hook-label">{hook.label}</span>
									{#if !compact}
										<span class="hook-trigger">
											<strong>When:</strong> {hook.trigger}
										</span>
										<span class="hook-action">
											<strong>Then:</strong> {hook.action}
										</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.hooks-panel {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
	}

	.hooks-panel.compact {
		padding: var(--space-md);
	}

	.hooks-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-md);
	}

	.hooks-header h4 {
		margin: 0;
		font-size: var(--text-sm);
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		color: var(--color-text);
	}

	.hooks-count {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
	}

	.hooks-stack {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.tier-card {
		border-left: 3px solid;
		border-radius: var(--radius-md);
		padding: var(--space-md);
	}

	.tier-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-sm);
	}

	.tier-label {
		font-size: var(--text-sm);
		font-weight: 600;
		text-transform: capitalize;
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.tier-badge {
		font-size: 0.625rem;
		padding: 2px 6px;
		border: 1px solid;
		border-radius: var(--radius-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tier-hooks {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.hook-item {
		display: flex;
		gap: var(--space-sm);
		padding: var(--space-xs) 0;
	}

	.hook-item.inactive {
		opacity: 0.5;
	}

	.hook-status {
		flex-shrink: 0;
		width: 1.25rem;
		text-align: center;
		font-size: var(--text-sm);
	}

	.hook-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.hook-label {
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.hook-trigger,
	.hook-action {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		line-height: var(--leading-relaxed);
	}

	.hook-trigger strong,
	.hook-action strong {
		color: var(--color-text);
	}
</style>
