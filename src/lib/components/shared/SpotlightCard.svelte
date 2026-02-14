<script lang="ts">
	/**
	 * SpotlightCard — A card with an internal radial highlight that follows
	 * the mouse cursor. Creates a premium "lit from within" effect.
	 */
	interface Props {
		/** Spotlight color */
		color?: string;
		/** Spotlight radius in px */
		radius?: number;
		/** Whether to render as a link */
		href?: string;
		/** Additional CSS class */
		className?: string;
		children: import('svelte').Snippet;
	}

	let {
		color = 'rgba(99, 102, 241, 0.08)',
		radius = 250,
		href,
		className = '',
		children,
	}: Props = $props();

	let spotX = $state(0);
	let spotY = $state(0);
	let isHovered = $state(false);
	let cardEl: HTMLElement | null = $state(null);

	function handleMouseMove(e: MouseEvent) {
		if (!cardEl) return;
		const rect = cardEl.getBoundingClientRect();
		spotX = e.clientX - rect.left;
		spotY = e.clientY - rect.top;
	}

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
	}
</script>

{#if href}
	<a
		{href}
		class="spotlight-card {className}"
		bind:this={cardEl}
		onmousemove={handleMouseMove}
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
	>
		<div
			class="spotlight-overlay"
			class:visible={isHovered}
			style="
				background: radial-gradient(circle {radius}px at {spotX}px {spotY}px, {color}, transparent);
			"
			aria-hidden="true"
		></div>
		<div class="spotlight-content">
			{@render children()}
		</div>
	</a>
{:else}
	<div
		class="spotlight-card {className}"
		bind:this={cardEl}
		onmousemove={handleMouseMove}
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		role="presentation"
	>
		<div
			class="spotlight-overlay"
			class:visible={isHovered}
			style="
				background: radial-gradient(circle {radius}px at {spotX}px {spotY}px, {color}, transparent);
			"
			aria-hidden="true"
		></div>
		<div class="spotlight-content">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.spotlight-card {
		position: relative;
		overflow: hidden;
		background: var(--color-bg-card, rgba(18, 18, 32, 0.6));
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-lg, 12px);
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.spotlight-card:hover {
		border-color: rgba(255, 255, 255, 0.15);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		text-decoration: none;
		color: inherit;
	}

	.spotlight-overlay {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
		z-index: 0;
	}

	.spotlight-overlay.visible {
		opacity: 1;
	}

	.spotlight-content {
		position: relative;
		z-index: 1;
		padding: var(--space-lg, 1.5rem);
	}

	a.spotlight-card:focus-visible {
		outline: 2px solid var(--color-primary, #6366f1);
		outline-offset: 2px;
	}
</style>
