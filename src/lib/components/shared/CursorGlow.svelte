<script lang="ts">
	/**
	 * CursorGlow — A soft radial gradient that follows the mouse cursor,
	 * creating a flashlight-like effect on the dark background.
	 * Place once in the layout for a page-wide atmospheric effect.
	 */
	interface Props {
		/** Radius of the glow in px */
		radius?: number;
		/** Primary glow color */
		color?: string;
		/** Opacity of the glow (0-1) */
		opacity?: number;
		/** Whether the glow is active */
		enabled?: boolean;
	}

	let {
		radius = 350,
		color = 'rgba(99, 102, 241, 0.07)',
		opacity = 1,
		enabled = true,
	}: Props = $props();

	let x = $state(-1000);
	let y = $state(-1000);
	let isVisible = $state(false);

	$effect(() => {
		if (!enabled || typeof window === 'undefined') return;

		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		// Check for coarse pointer (touch devices) — skip glow
		const isTouch = window.matchMedia('(pointer: coarse)').matches;
		if (isTouch) return;

		function handleMouseMove(e: MouseEvent) {
			x = e.clientX;
			y = e.clientY;
			if (!isVisible) isVisible = true;
		}

		function handleMouseLeave() {
			isVisible = false;
		}

		document.addEventListener('mousemove', handleMouseMove, { passive: true });
		document.addEventListener('mouseleave', handleMouseLeave);
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
		};
	});
</script>

{#if enabled && isVisible}
	<div
		class="cursor-glow"
		style="
			left: {x}px;
			top: {y}px;
			width: {radius * 2}px;
			height: {radius * 2}px;
			background: radial-gradient(circle, {color} 0%, transparent 70%);
			opacity: {opacity};
		"
		aria-hidden="true"
	></div>
{/if}

<style>
	.cursor-glow {
		position: fixed;
		pointer-events: none;
		z-index: 0;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		transition: opacity 0.3s ease;
		will-change: left, top;
	}
</style>
