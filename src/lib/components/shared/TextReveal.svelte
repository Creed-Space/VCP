<script lang="ts">
	/**
	 * TextReveal — Staggered word-by-word reveal animation for headlines.
	 * Each word fades and slides up individually, creating an elegant
	 * cascading entrance. Pairs beautifully with hero sections.
	 */
	interface Props {
		/** The text to animate */
		text: string;
		/** Tag to render */
		tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
		/** Delay between each word in ms */
		stagger?: number;
		/** Initial delay before animation starts in ms */
		initialDelay?: number;
		/** Whether to apply gradient color to text */
		gradient?: boolean;
		/** Additional CSS class */
		className?: string;
	}

	let {
		text,
		tag = 'h1',
		stagger = 80,
		initialDelay = 200,
		gradient = false,
		className = ''
	}: Props = $props();

	let visible = $state(false);
	let element: HTMLElement | null = $state(null);

	const words = $derived(text.split(/\s+/));

	$effect(() => {
		if (!element || typeof IntersectionObserver === 'undefined') {
			visible = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);

		observer.observe(element);
		return () => observer.disconnect();
	});
</script>

<svelte:element
	this={tag}
	bind:this={element}
	class="text-reveal {className}"
	class:gradient
	class:visible
>
	{#each words as word, i}
		<span
			class="word-wrapper"
			style="--word-delay: {initialDelay + i * stagger}ms"
		>
			<span class="word">{word}</span>
		</span>
		{' '}
	{/each}
</svelte:element>

<style>
	.text-reveal {
		overflow: hidden;
	}

	.text-reveal.gradient {
		background: linear-gradient(135deg, #ffffff 20%, #818cf8 60%, #a78bfa 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.word-wrapper {
		display: inline-block;
		overflow: hidden;
		vertical-align: bottom;
	}

	.word {
		display: inline-block;
		transform: translateY(110%);
		opacity: 0;
		transition:
			transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) var(--word-delay),
			opacity 0.4s ease var(--word-delay);
	}

	.visible .word {
		transform: translateY(0);
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.word {
			transform: none;
			opacity: 1;
			transition: none;
		}
	}
</style>
