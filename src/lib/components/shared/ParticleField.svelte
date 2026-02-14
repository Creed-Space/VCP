<script lang="ts">
	/**
	 * ParticleField — Canvas-based constellation/starfield effect.
	 * Tiny dots drift slowly and connect with lines when near each other,
	 * forming an organic network. Great as a section background.
	 */
	interface Props {
		/** Number of particles */
		count?: number;
		/** Connection distance in px */
		connectionDistance?: number;
		/** Particle color */
		color?: string;
		/** Line color */
		lineColor?: string;
		/** Max particle speed */
		speed?: number;
		/** Particle size range [min, max] */
		sizeRange?: [number, number];
	}

	let {
		count = 50,
		connectionDistance = 120,
		color = 'rgba(99, 102, 241, 0.4)',
		lineColor = 'rgba(99, 102, 241, 0.1)',
		speed = 0.3,
		sizeRange = [1, 2.5] as [number, number],
	}: Props = $props();

	let canvas: HTMLCanvasElement | null = $state(null);

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
	}

	$effect(() => {
		if (!canvas || typeof window === 'undefined') return;

		// Respect reduced motion
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animId: number = 0;
		let particles: Particle[] = [];
		let width = 0;
		let height = 0;

		function resize() {
			if (!canvas) return;
			const parent = canvas.parentElement;
			if (!parent) return;
			width = parent.clientWidth;
			height = parent.clientHeight;
			canvas.width = width * window.devicePixelRatio;
			canvas.height = height * window.devicePixelRatio;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
		}

		function initParticles() {
			particles = Array.from({ length: count }, () => ({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * speed * 2,
				vy: (Math.random() - 0.5) * speed * 2,
				size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
			}));
		}

		function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);

			// Draw connections
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i]!.x - particles[j]!.x;
					const dy = particles[i]!.y - particles[j]!.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < connectionDistance) {
						const opacity = 1 - dist / connectionDistance;
						ctx.beginPath();
						ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${opacity * 0.15})`);
						ctx.lineWidth = 0.5;
						ctx.moveTo(particles[i]!.x, particles[i]!.y);
						ctx.lineTo(particles[j]!.x, particles[j]!.y);
						ctx.stroke();
					}
				}
			}

			// Draw and update particles
			for (const p of particles) {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = color;
				ctx.fill();

				if (!prefersReducedMotion) {
					p.x += p.vx;
					p.y += p.vy;

					// Wrap around edges
					if (p.x < -10) p.x = width + 10;
					if (p.x > width + 10) p.x = -10;
					if (p.y < -10) p.y = height + 10;
					if (p.y > height + 10) p.y = -10;
				}
			}

			animId = requestAnimationFrame(draw);
		}

		resize();
		initParticles();

		// Static render for reduced motion
		if (prefersReducedMotion) {
			draw();
			cancelAnimationFrame(animId);
		} else {
			draw();
		}

		window.addEventListener('resize', () => {
			resize();
			initParticles();
		});

		return () => {
			cancelAnimationFrame(animId);
		};
	});
</script>

<div class="particle-field" aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.particle-field {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: -1;
	}

	canvas {
		display: block;
	}
</style>
