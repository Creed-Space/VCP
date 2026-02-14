<script lang="ts">
	/**
	 * MorphBlob — Organic animated SVG shape that slowly morphs between
	 * blob states. Use as a decorative background accent behind sections.
	 * Soft, biomorphic, and hypnotic.
	 */
	interface Props {
		/** Size in px */
		size?: number;
		/** Fill colors for the gradient */
		colors?: [string, string];
		/** Animation duration in seconds */
		duration?: number;
		/** Opacity */
		opacity?: number;
		/** Blur amount in px */
		blur?: number;
	}

	let {
		size = 400,
		colors = ['rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.15)'] as [string, string],
		duration = 12,
		opacity = 1,
		blur = 40,
	}: Props = $props();

	// 4 organic blob paths that morph between each other
	const blobPaths = [
		'M44.5,-76.4C56.9,-69.1,65.6,-55.4,72.4,-41.1C79.2,-26.9,84,-12.1,83.3,2.3C82.5,16.7,76.2,30.7,67.2,42.4C58.2,54.1,46.6,63.5,33.5,70.8C20.5,78.2,5.9,83.5,-8.8,82.4C-23.5,81.3,-38.4,73.8,-50.6,63.3C-62.9,52.8,-72.5,39.4,-78.1,24.3C-83.7,9.2,-85.3,-7.5,-80.4,-21.8C-75.6,-36.1,-64.3,-48,-51.1,-55.1C-37.9,-62.2,-22.8,-64.5,-7.7,-67.3C7.5,-70.2,32.1,-83.7,44.5,-76.4Z',
		'M39.5,-67.8C50.6,-60.5,58.3,-48.1,64.8,-35C71.3,-21.9,76.5,-8.2,76.1,5.8C75.7,19.8,69.6,34.1,60.3,44.8C51.1,55.6,38.7,62.8,25.3,68.5C12,74.2,-2.3,78.4,-16.3,76.2C-30.3,74,-44,65.4,-54.8,54.2C-65.5,43,-73.3,29.2,-76.4,14.3C-79.6,-0.7,-78.1,-16.8,-71.8,-30.3C-65.4,-43.8,-54.1,-54.7,-41.4,-61.3C-28.6,-67.9,-14.3,-70.2,0.5,-71.1C15.3,-72,28.4,-75.1,39.5,-67.8Z',
		'M47.3,-80.5C60.1,-72.4,68.4,-57.1,74.8,-41.5C81.2,-25.9,85.7,-10.1,84.1,5.1C82.4,20.3,74.7,34.9,64.5,46.8C54.4,58.7,41.9,67.8,27.9,73.6C14,79.4,-1.4,81.9,-16.2,78.8C-31.1,75.7,-45.4,67,-56.4,55.4C-67.4,43.9,-75.1,29.5,-78.5,13.9C-81.9,-1.8,-81,-18.7,-74.5,-32.8C-68,-46.9,-55.9,-58.2,-42.3,-65.9C-28.7,-73.5,-14.3,-77.5,1.6,-80.2C17.5,-82.9,34.5,-88.5,47.3,-80.5Z',
		'M41.9,-71.2C53.3,-64.5,60.8,-51,67.2,-37.3C73.5,-23.6,78.8,-9.6,78.3,4.3C77.8,18.2,71.6,31.9,62.5,43C53.5,54.1,41.6,62.5,28.4,68.2C15.2,73.9,0.7,76.8,-13.5,74.9C-27.7,73,-41.6,66.2,-52.8,56.1C-64,46,-72.4,32.5,-76.2,17.7C-79.9,2.9,-78.9,-13.2,-73.1,-27C-67.2,-40.8,-56.5,-52.3,-43.8,-58.4C-31.1,-64.5,-16.4,-65.2,-0.4,-64.5C15.6,-63.9,30.5,-77.8,41.9,-71.2Z',
	];
</script>

<div
	class="morph-blob"
	style="
		width: {size}px;
		height: {size}px;
		opacity: {opacity};
		filter: blur({blur}px);
	"
	aria-hidden="true"
>
	<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color={colors[0]} />
				<stop offset="100%" stop-color={colors[1]} />
			</linearGradient>
		</defs>
		<path fill="url(#blob-gradient)" style="--morph-duration: {duration}s">
			<animate
				attributeName="d"
				dur="{duration}s"
				repeatCount="indefinite"
				values="{blobPaths[0]};{blobPaths[1]};{blobPaths[2]};{blobPaths[3]};{blobPaths[0]}"
				calcMode="spline"
				keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
			/>
		</path>
	</svg>
</div>

<style>
	.morph-blob {
		position: absolute;
		pointer-events: none;
		z-index: -1;
	}

	svg {
		width: 100%;
		height: 100%;
	}

	@media (prefers-reduced-motion: reduce) {
		.morph-blob animate {
			/* SVG animate elements don't respond to CSS — this is handled by the browser's native reduced-motion support for SVG SMIL animations */
			animation-play-state: paused;
		}
	}
</style>
