<script lang="ts">
	/**
	 * CountUp — Animated number counter that ticks up when scrolled into view.
	 * Use for stats, metrics, or any number you want to give visual weight.
	 */
	interface Props {
		/** Target number to count up to */
		value: number;
		/** Duration of the animation in ms */
		duration?: number;
		/** Prefix text (e.g. "$", "#") */
		prefix?: string;
		/** Suffix text (e.g. "+", "%", "ms") */
		suffix?: string;
		/** Label below the number */
		label?: string;
		/** Decimal places to show */
		decimals?: number;
	}

	let {
		value,
		duration = 1500,
		prefix = '',
		suffix = '',
		label = '',
		decimals = 0,
	}: Props = $props();

	let displayValue = $state(0);
	let element: HTMLElement | null = $state(null);
	let hasAnimated = $state(false);

	$effect(() => {
		if (!element || typeof IntersectionObserver === 'undefined') {
			displayValue = value;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !hasAnimated) {
					hasAnimated = true;
					animate();
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);

		observer.observe(element);
		return () => observer.disconnect();
	});

	function animate() {
		const start = performance.now();
		const from = 0;
		const to = value;

		function tick(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);

			// Ease-out cubic for a satisfying deceleration
			const eased = 1 - Math.pow(1 - progress, 3);
			displayValue = from + (to - from) * eased;

			if (progress < 1) {
				requestAnimationFrame(tick);
			} else {
				displayValue = to;
			}
		}

		requestAnimationFrame(tick);
	}

	const formatted = $derived(() => {
		const num = decimals > 0
			? displayValue.toFixed(decimals)
			: Math.round(displayValue).toString();
		return `${prefix}${num}${suffix}`;
	});
</script>

<div class="count-up" bind:this={element}>
	<span class="count-up-value">{formatted()}</span>
	{#if label}
		<span class="count-up-label">{label}</span>
	{/if}
</div>

<style>
	.count-up {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.375rem;
	}

	.count-up-value {
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.02em;
		background: linear-gradient(135deg, #ffffff 30%, var(--color-primary-hover, #818cf8) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-variant-numeric: tabular-nums;
	}

	.count-up-label {
		font-size: 0.8125rem;
		color: var(--color-text-muted, #c4c4d0);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	@media (max-width: 640px) {
		.count-up-value {
			font-size: 2rem;
		}

		.count-up-label {
			font-size: 0.75rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.count-up-value {
			transition: none;
		}
	}
</style>
