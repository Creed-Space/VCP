<script lang="ts">
	/**
	 * GlowDivider — A luminous horizontal divider that adds visual rhythm
	 * between sections. Features a gradient glow that subtly pulses,
	 * creating a sense of energy flowing through the page.
	 */
	interface Props {
		/** Color of the glow */
		color?: string;
		/** Width of the glow line (CSS value) */
		width?: string;
		/** Whether to animate */
		animate?: boolean;
		/** Vertical margin */
		margin?: string;
	}

	let {
		color = 'rgba(99, 102, 241, 0.6)',
		width = '200px',
		animate = true,
		margin = '3rem'
	}: Props = $props();
</script>

<div
	class="glow-divider"
	class:animate
	style="--gd-color: {color}; --gd-width: {width}; --gd-margin: {margin}"
	aria-hidden="true"
>
	<div class="glow-line"></div>
	<div class="glow-dot"></div>
	<div class="glow-line"></div>
</div>

<style>
	.glow-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin: var(--gd-margin) auto;
		width: 100%;
		max-width: 500px;
	}

	.glow-line {
		flex: 1;
		height: 1px;
		max-width: var(--gd-width);
		background: linear-gradient(
			90deg,
			transparent,
			var(--gd-color),
			transparent
		);
	}

	.glow-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--gd-color);
		box-shadow: 0 0 12px var(--gd-color), 0 0 24px color-mix(in srgb, var(--gd-color) 50%, transparent);
		flex-shrink: 0;
	}

	.animate .glow-dot {
		animation: dotPulse 3s ease-in-out infinite;
	}

	.animate .glow-line {
		animation: lineShimmer 3s ease-in-out infinite;
	}

	.animate .glow-line:first-child {
		animation-delay: -0.5s;
	}

	@keyframes dotPulse {
		0%, 100% {
			opacity: 0.6;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.4);
		}
	}

	@keyframes lineShimmer {
		0%, 100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.animate .glow-dot,
		.animate .glow-line {
			animation: none;
		}
	}
</style>
