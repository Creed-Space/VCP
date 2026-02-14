<script lang="ts">
	/**
	 * ScrollReveal — Intersection Observer wrapper that reveals children
	 * with a smooth animation when they enter the viewport.
	 * Wrap any section or element to give it a scroll-triggered entrance.
	 */
	interface Props {
		/** Animation direction */
		direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
		/** Stagger delay in ms (useful for lists) */
		delay?: number;
		/** Distance to travel in px */
		distance?: number;
		/** Animation duration in ms */
		duration?: number;
		/** Viewport threshold (0-1) to trigger */
		threshold?: number;
		/** Whether to animate only once */
		once?: boolean;
		children: import('svelte').Snippet;
	}

	let {
		direction = 'up',
		delay = 0,
		distance = 30,
		duration = 600,
		threshold = 0.15,
		once = true,
		children
	}: Props = $props();

	let visible = $state(false);
	let element: HTMLElement | null = $state(null);

	$effect(() => {
		if (!element || typeof IntersectionObserver === 'undefined') {
			visible = true; // fallback: show immediately
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visible = true;
						if (once) observer.unobserve(entry.target);
					} else if (!once) {
						visible = false;
					}
				}
			},
			{ threshold, rootMargin: '0px 0px -40px 0px' }
		);

		observer.observe(element);
		return () => observer.disconnect();
	});

	const transforms = $derived.by(() => {
		const d = distance;
		return {
			up: `translateY(${d}px)`,
			down: `translateY(-${d}px)`,
			left: `translateX(${d}px)`,
			right: `translateX(-${d}px)`,
			fade: 'none',
		} as Record<string, string>;
	});
</script>

<div
	bind:this={element}
	class="scroll-reveal"
	class:visible
	style="
		--sr-transform: {transforms[direction]};
		--sr-delay: {delay}ms;
		--sr-duration: {duration}ms;
	"
>
	{@render children()}
</div>

<style>
	.scroll-reveal {
		opacity: 0;
		transform: var(--sr-transform);
		filter: blur(4px);
		transition:
			opacity var(--sr-duration) cubic-bezier(0.4, 0, 0.2, 1) var(--sr-delay),
			transform var(--sr-duration) cubic-bezier(0.4, 0, 0.2, 1) var(--sr-delay),
			filter var(--sr-duration) cubic-bezier(0.4, 0, 0.2, 1) var(--sr-delay);
		will-change: opacity, transform, filter;
	}

	.scroll-reveal.visible {
		opacity: 1;
		transform: none;
		filter: blur(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-reveal {
			opacity: 1;
			transform: none;
			filter: none;
			transition: none;
		}
	}
</style>
