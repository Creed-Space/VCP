<script lang="ts">
	/**
	 * GradientBorderCard — A card with an animated prismatic gradient border.
	 * The gradient rotates continuously, creating a living, iridescent edge.
	 * Use for featured content, CTAs, or highlighted sections.
	 */
	interface Props {
		/** Gradient color stops */
		colors?: string[];
		/** Border width in px */
		borderWidth?: number;
		/** Animation speed in seconds (0 = static) */
		speed?: number;
		/** Whether to glow on hover */
		glow?: boolean;
		/** Additional CSS class */
		className?: string;
		/** Tag to render as */
		tag?: 'div' | 'a' | 'article' | 'section';
		/** href if tag is 'a' */
		href?: string;
		children: import('svelte').Snippet;
	}

	let {
		colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#6366f1'],
		borderWidth = 1.5,
		speed = 4,
		glow = true,
		className = '',
		tag = 'div',
		href,
		children
	}: Props = $props();

	const gradientStops = $derived(colors.join(', '));
</script>

{#if tag === 'a'}
	<a
		{href}
		class="gradient-border-card {className}"
		class:has-glow={glow}
		style="
			--gbc-border-width: {borderWidth}px;
			--gbc-speed: {speed}s;
			--gbc-gradient: {gradientStops};
		"
	>
		<div class="gbc-content">
			{@render children()}
		</div>
	</a>
{:else}
	<div
		class="gradient-border-card {className}"
		class:has-glow={glow}
		style="
			--gbc-border-width: {borderWidth}px;
			--gbc-speed: {speed}s;
			--gbc-gradient: {gradientStops};
		"
		role={tag === 'article' ? 'article' : undefined}
	>
		<div class="gbc-content">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.gradient-border-card {
		position: relative;
		border-radius: var(--radius-lg, 12px);
		padding: var(--gbc-border-width);
		background: conic-gradient(
			from 0deg,
			var(--gbc-gradient)
		);
		background-size: 100% 100%;
		animation: borderRotate var(--gbc-speed) linear infinite;
		text-decoration: none;
		color: inherit;
		display: block;
		transition: box-shadow 0.3s ease;
	}

	.gradient-border-card:hover {
		text-decoration: none;
		color: inherit;
	}

	.has-glow:hover {
		box-shadow:
			0 0 20px rgba(99, 102, 241, 0.2),
			0 0 40px rgba(139, 92, 246, 0.1);
	}

	.gbc-content {
		background: rgba(22, 22, 35, 0.95);
		border-radius: calc(var(--radius-lg, 12px) - var(--gbc-border-width));
		padding: var(--space-lg, 1.5rem);
		position: relative;
		z-index: 1;
		height: 100%;
	}

	@keyframes borderRotate {
		from {
			filter: hue-rotate(0deg);
		}
		to {
			filter: hue-rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.gradient-border-card {
			animation: none;
		}
	}
</style>
