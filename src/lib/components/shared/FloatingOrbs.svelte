<script lang="ts">
	/**
	 * FloatingOrbs — Ambient animated gradient orbs that float behind content.
	 * Creates depth and atmosphere without distracting from content.
	 * Use as a background layer inside hero or feature sections.
	 */
	interface Props {
		/** Number of orbs to render (2-5 recommended) */
		count?: number;
		/** Whether to respond to mouse movement with parallax */
		interactive?: boolean;
		/** Opacity multiplier (0-1) */
		intensity?: number;
	}

	let { count = 3, interactive = true, intensity = 1 }: Props = $props();

	let mouseX = $state(0.5);
	let mouseY = $state(0.5);
	let containerEl: HTMLElement | null = $state(null);

	// Predefined orb configurations for visual harmony
	const orbConfigs = [
		{ cx: 25, cy: 30, size: 400, color1: 'rgba(99, 102, 241, 0.15)', color2: 'rgba(139, 92, 246, 0.05)', duration: 20, delay: 0 },
		{ cx: 70, cy: 60, size: 350, color1: 'rgba(167, 139, 250, 0.12)', color2: 'rgba(99, 102, 241, 0.04)', duration: 25, delay: -5 },
		{ cx: 50, cy: 20, size: 300, color1: 'rgba(139, 92, 246, 0.10)', color2: 'rgba(59, 130, 246, 0.03)', duration: 30, delay: -10 },
		{ cx: 80, cy: 40, size: 250, color1: 'rgba(59, 130, 246, 0.08)', color2: 'rgba(99, 102, 241, 0.03)', duration: 22, delay: -8 },
		{ cx: 15, cy: 70, size: 320, color1: 'rgba(168, 85, 247, 0.10)', color2: 'rgba(139, 92, 246, 0.04)', duration: 28, delay: -15 },
	];

	const activeOrbs = $derived(orbConfigs.slice(0, Math.min(count, 5)));

	$effect(() => {
		if (!interactive || typeof window === 'undefined') return;

		function handleMouseMove(e: MouseEvent) {
			if (!containerEl) return;
			const rect = containerEl.getBoundingClientRect();
			mouseX = (e.clientX - rect.left) / rect.width;
			mouseY = (e.clientY - rect.top) / rect.height;
		}

		window.addEventListener('mousemove', handleMouseMove, { passive: true });
		return () => window.removeEventListener('mousemove', handleMouseMove);
	});

	function parallaxOffset(base: number, axis: number): number {
		if (!interactive) return base;
		return base + (axis - 0.5) * 8; // subtle 8% parallax
	}
</script>

<div class="floating-orbs" bind:this={containerEl} aria-hidden="true">
	{#each activeOrbs as orb, i}
		<div
			class="orb"
			style="
				left: {parallaxOffset(orb.cx, mouseX)}%;
				top: {parallaxOffset(orb.cy, mouseY)}%;
				width: {orb.size}px;
				height: {orb.size}px;
				background: radial-gradient(circle, {orb.color1} 0%, {orb.color2} 50%, transparent 70%);
				animation-duration: {orb.duration}s;
				animation-delay: {orb.delay}s;
				opacity: {intensity};
			"
		></div>
	{/each}
</div>

<style>
	.floating-orbs {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: -1;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		filter: blur(60px);
		animation: orbFloat linear infinite;
		will-change: transform, left, top;
		transition: left 0.8s ease-out, top 0.8s ease-out;
	}

	@keyframes orbFloat {
		0%, 100% {
			transform: translate(-50%, -50%) scale(1) rotate(0deg);
		}
		25% {
			transform: translate(-50%, -50%) scale(1.1) rotate(90deg);
		}
		50% {
			transform: translate(-50%, -50%) scale(0.95) rotate(180deg);
		}
		75% {
			transform: translate(-50%, -50%) scale(1.05) rotate(270deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.orb {
			animation: none;
		}
	}
</style>
