<script lang="ts">
	/**
	 * TypeWriter — Auto-typing text animation with a blinking cursor.
	 * Perfect for showing VCP tokens being built, code snippets,
	 * or rotating taglines. Supports multiple lines that cycle.
	 */
	interface Props {
		/** Lines of text to type (cycles through them) */
		lines: string[];
		/** Typing speed in ms per character */
		speed?: number;
		/** Pause duration after each line completes (ms) */
		pauseDuration?: number;
		/** Delete speed in ms per character */
		deleteSpeed?: number;
		/** Whether to loop through lines */
		loop?: boolean;
		/** Whether to use monospace font */
		mono?: boolean;
		/** CSS class */
		className?: string;
	}

	let {
		lines,
		speed = 50,
		pauseDuration = 2000,
		deleteSpeed = 30,
		loop = true,
		mono = true,
		className = '',
	}: Props = $props();

	let displayText = $state('');
	let lineIndex = $state(0);
	let isDeleting = $state(false);
	let cursorVisible = $state(true);

	$effect(() => {
		if (typeof window === 'undefined' || lines.length === 0) return;

		// Check reduced motion
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			displayText = lines[0] ?? '';
			return;
		}

		let timeout: ReturnType<typeof setTimeout>;
		const currentLine = lines[lineIndex % lines.length] ?? '';

		if (!isDeleting) {
			if (displayText.length < currentLine.length) {
				timeout = setTimeout(() => {
					displayText = currentLine.slice(0, displayText.length + 1);
				}, speed);
			} else {
				// Finished typing — pause then delete (if looping with multiple lines)
				if (loop && lines.length > 1) {
					timeout = setTimeout(() => {
						isDeleting = true;
					}, pauseDuration);
				}
			}
		} else {
			if (displayText.length > 0) {
				timeout = setTimeout(() => {
					displayText = displayText.slice(0, -1);
				}, deleteSpeed);
			} else {
				isDeleting = false;
				lineIndex = (lineIndex + 1) % lines.length;
			}
		}

		return () => clearTimeout(timeout);
	});

	// Blinking cursor
	$effect(() => {
		if (typeof window === 'undefined') return;
		const interval = setInterval(() => {
			cursorVisible = !cursorVisible;
		}, 530);
		return () => clearInterval(interval);
	});
</script>

<span class="typewriter {className}" class:mono aria-live="polite">
	<span class="typewriter-text">{displayText}</span>
	<span class="typewriter-cursor" class:visible={cursorVisible} aria-hidden="true">|</span>
</span>

<style>
	.typewriter {
		display: inline;
	}

	.mono {
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
	}

	.typewriter-text {
		white-space: pre-wrap;
	}

	.typewriter-cursor {
		opacity: 0;
		color: var(--color-primary, #6366f1);
		font-weight: 300;
		transition: opacity 0.1s;
		margin-left: 1px;
	}

	.typewriter-cursor.visible {
		opacity: 1;
	}
</style>
