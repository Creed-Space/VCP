<script lang="ts">
	/**
	 * TokenFlow — Animated visualization of a VCP token flowing between platforms.
	 * Shows the core concept: one token, many destinations, each receiving what they need.
	 * Designed as a hero-worthy visual that communicates the protocol at a glance.
	 */
	interface Props {
		/** Whether to auto-play the animation */
		autoplay?: boolean;
		/** Platforms to show as destinations */
		platforms?: Array<{ name: string; icon: string; color: string }>;
	}

	let {
		autoplay = true,
		platforms = [
			{ name: 'Music App', icon: 'fa-solid fa-music', color: '#ff6b35' },
			{ name: 'Learning', icon: 'fa-solid fa-graduation-cap', color: '#7b68ee' },
			{ name: 'Health', icon: 'fa-solid fa-heart-pulse', color: '#22c55e' },
			{ name: 'Finance', icon: 'fa-solid fa-building-columns', color: '#f59e0b' },
		]
	}: Props = $props();

	let activeIndex = $state(-1); // -1 = token at center
	let animating = $derived(autoplay);

	// Token fields map to real CSM-1 line prefixes: C, P, G, PS
	const tokenFields = [
		{ label: 'constitution', color: '#f472b6', short: 'RULE' },
		{ label: 'persona', color: '#60a5fa', short: 'ROLE' },
		{ label: 'goal', color: '#34d399', short: 'GOAL' },
		{ label: 'personal state', color: '#fbbf24', short: 'STAT' },
	];

	// Icon centers derived from CSS positions (viewBox 600x300, icon ring 48px)
	const iconCenters = [
		{ x: 58, y: 84 },   // Music App: left 5% + 28 (nudged inward)
		{ x: 546, y: 69 },  // Learning: right 5% - 24, top 15% + 24
		{ x: 528, y: 213 }, // Health: right 8% - 24, bottom 15% (node ~66px tall)
		{ x: 72, y: 228 },  // Finance: left 8% + 24, bottom 10% (node ~66px tall)
	];

	const origin = { x: 300, y: 150 };
	const circleRadius = 26;

	// Line endpoints stop at the edge of each circle, pointed at center
	const endpoints = iconCenters.map(center => {
		const dx = center.x - origin.x;
		const dy = center.y - origin.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		return {
			x: Math.round(center.x - (circleRadius * dx / dist)),
			y: Math.round(center.y - (circleRadius * dy / dist)),
		};
	});

	$effect(() => {
		if (!animating) return;

		const interval = setInterval(() => {
			activeIndex = (activeIndex + 1) % (platforms.length + 1);
			if (activeIndex === platforms.length) activeIndex = -1;
		}, 2000);

		return () => clearInterval(interval);
	});
</script>

<div class="token-flow" role="img" aria-label="VCP token flowing between platforms">
	<!-- Center: The Token -->
	<div class="token-core" class:sending={activeIndex >= 0}>
		<div class="token-glow"></div>
		<div class="token-body">
			<div class="token-header">
				<span class="token-version">CSM-1</span>
			</div>
			<div class="token-fields">
				{#each tokenFields as field, i}
					<div
						class="token-field"
						class:active={activeIndex >= 0 && (activeIndex % tokenFields.length === i || activeIndex === -1)}
						style="--field-color: {field.color}"
					>
						<span class="field-dot"></span>
						<span class="field-label">{field.short}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Flow lines to platforms (endpoints match CSS positions of platform nodes) -->
	<svg class="flow-lines" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
		{#each platforms as platform, i}
			{@const end = endpoints[i]}
			<line
				x1="300" y1="150"
				x2={end.x} y2={end.y}
				class="flow-line"
				class:active={activeIndex === i}
				style="--line-color: {platform.color}"
			/>
			{#if activeIndex === i}
				<circle
					r="4"
					fill={platform.color}
					class="flow-particle"
				>
					<animateMotion
						dur="0.8s"
						fill="freeze"
						path="M300,150 L{end.x},{end.y}"
					/>
				</circle>
			{/if}
		{/each}
	</svg>

	<!-- Platform Destinations -->
	<div class="platforms">
		{#each platforms as platform, i}
			<div
				class="platform-node"
				class:active={activeIndex === i}
				style="--platform-color: {platform.color}"
			>
				<div class="platform-icon-ring">
					<i class={platform.icon} aria-hidden="true"></i>
				</div>
				<span class="platform-label">{platform.name}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.token-flow {
		position: relative;
		width: 100%;
		max-width: 600px;
		height: 300px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Center Token */
	.token-core {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
	}

	.token-glow {
		position: absolute;
		inset: -20px;
		background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
		border-radius: 50%;
		transition: opacity 0.5s ease;
		pointer-events: none;
	}

	.token-core.sending .token-glow {
		animation: tokenPulse 2s ease-in-out infinite;
	}

	.token-body {
		background: rgba(22, 22, 35, 0.95);
		border: 1.5px solid rgba(99, 102, 241, 0.5);
		border-radius: 12px;
		padding: 12px 16px;
		position: relative;
		backdrop-filter: blur(8px);
		min-width: 120px;
	}

	.token-header {
		text-align: center;
		margin-bottom: 8px;
	}

	.token-version {
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
		font-size: 0.625rem;
		color: #a78bfa;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 600;
	}

	.token-fields {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.token-field {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 2px 6px;
		border-radius: 4px;
		transition: all 0.3s ease;
	}

	.token-field.active {
		background: color-mix(in srgb, var(--field-color) 15%, transparent);
	}

	.field-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--field-color);
		opacity: 0.4;
		transition: opacity 0.3s ease, transform 0.3s ease;
	}

	.token-field.active .field-dot {
		opacity: 1;
		transform: scale(1.3);
	}

	.field-label {
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
		font-size: 0.625rem;
		color: rgba(240, 240, 245, 0.6);
		letter-spacing: 0.05em;
		transition: color 0.3s ease;
	}

	.token-field.active .field-label {
		color: var(--field-color);
	}

	/* Flow Lines (SVG) */
	.flow-lines {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}

	.flow-line {
		stroke: rgba(255, 255, 255, 0.06);
		stroke-width: 1;
		stroke-dasharray: 4 4;
		transition: stroke 0.5s ease, stroke-width 0.3s ease;
	}

	.flow-line.active {
		stroke: var(--line-color);
		stroke-width: 2;
		stroke-dasharray: none;
		filter: drop-shadow(0 0 4px var(--line-color));
	}

	.flow-particle {
		filter: drop-shadow(0 0 6px currentColor);
	}

	/* Platform Nodes */
	.platforms {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.platform-node {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		transition: all 0.3s ease;
		opacity: 0.5;
	}

	.platform-node.active {
		opacity: 1;
		transform: scale(1.1);
	}

	/* Position platforms in an arc */
	.platform-node:nth-child(1) { left: 5%; top: 20%; }
	.platform-node:nth-child(2) { right: 5%; top: 15%; }
	.platform-node:nth-child(3) { right: 8%; bottom: 15%; }
	.platform-node:nth-child(4) { left: 8%; bottom: 10%; }

	.platform-icon-ring {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.125rem;
		color: var(--platform-color);
		background: color-mix(in srgb, var(--platform-color) 10%, rgba(22, 22, 35, 0.9));
		border: 1.5px solid color-mix(in srgb, var(--platform-color) 30%, transparent);
		transition: all 0.3s ease;
	}

	.platform-node.active .platform-icon-ring {
		border-color: var(--platform-color);
		box-shadow: 0 0 16px color-mix(in srgb, var(--platform-color) 30%, transparent);
	}

	.platform-label {
		font-size: 0.6875rem;
		color: rgba(240, 240, 245, 0.5);
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.platform-node.active .platform-label {
		color: var(--platform-color);
	}

	@keyframes tokenPulse {
		0%, 100% { opacity: 0.6; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.15); }
	}

	@media (prefers-reduced-motion: reduce) {
		.token-core.sending .token-glow,
		.flow-particle {
			animation: none;
		}
	}

	@media (max-width: 640px) {
		.token-flow {
			height: 240px;
		}

		.platform-icon-ring {
			width: 40px;
			height: 40px;
			font-size: 0.875rem;
		}

		.platform-label {
			font-size: 0.5625rem;
		}

		.token-body {
			padding: 8px 12px;
			min-width: 100px;
		}
	}
</style>
