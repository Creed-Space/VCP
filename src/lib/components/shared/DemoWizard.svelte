<script lang="ts">
	/**
	 * DemoWizard — Shared step-by-step demo component
	 * Used by all 6 persona demos for consistent guided experience.
	 * Optimizations:
	 * - Fade transition on step changes for lazy-load effect
	 * - Keyed snippet rendering ensures proper cleanup
	 */
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	interface WizardStep {
		title: string;
		subtitle?: string;
		icon?: string;
	}

	interface Props {
		title: string;
		badge?: string;
		badgeVariant?: 'success' | 'primary' | 'info' | 'warning' | 'danger';
		steps: WizardStep[];
		onComplete?: () => void;
		children: Snippet<[{ step: number }]>;
	}

	let {
		title,
		badge,
		badgeVariant = 'primary',
		steps,
		onComplete,
		children
	}: Props = $props();

	let currentStep = $state(0);
	let contentRef = $state<HTMLElement | null>(null);

	const isLastStep = $derived(currentStep === steps.length - 1);
	const isFirstStep = $derived(currentStep === 0);

	function goTo(index: number) {
		if (index < 0 || index >= steps.length) return;
		currentStep = index;
		contentRef?.focus();
	}

	function next() {
		if (isLastStep) {
			onComplete?.();
			currentStep = 0;
			contentRef?.focus();
			return;
		}
		goTo(currentStep + 1);
	}

	function prev() {
		goTo(currentStep - 1);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
		if (e.key === 'ArrowRight' || (e.key === 'Enter' && !isLastStep)) {
			e.preventDefault();
			next();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		} else if (e.key === 'Escape' && !isFirstStep) {
			e.preventDefault();
			prev();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="demo-wizard" role="group" aria-label="Demo: {title}" onkeydown={handleKeydown} tabindex="-1">
	<!-- Header -->
	<div class="wizard-header">
		<a href="/demos" class="wizard-back">
			<i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
			Back to Demos
		</a>
		<div class="wizard-title-area">
			{#if badge}
				<span class="badge badge-{badgeVariant}">{badge}</span>
			{/if}
			<h1 class="wizard-title">{title}</h1>
		</div>
	</div>

	<!-- Progress -->
	<div class="wizard-progress" role="tablist" aria-label="Demo steps">
		{#each steps as step, i}
			{#if i > 0}
				<div class="progress-connector" class:active={i <= currentStep}></div>
			{/if}
			<button
				class="progress-step"
				class:active={i === currentStep}
				class:completed={i < currentStep}
				role="tab"
				aria-selected={i === currentStep}
				aria-label="{step.title} — Step {i + 1} of {steps.length}"
				onclick={() => goTo(i)}
			>
				<span class="step-dot">
					{#if i < currentStep}
						<i class="fa-solid fa-check" aria-hidden="true"></i>
					{:else}
						{i + 1}
					{/if}
				</span>
				<span class="step-label">{step.title}</span>
			</button>
		{/each}
		<span class="progress-counter" aria-live="polite">
			Step {currentStep + 1} of {steps.length}
		</span>
	</div>

	<!-- Step subtitle -->
	{#if steps[currentStep]?.subtitle}
		<p class="wizard-subtitle">{steps[currentStep].subtitle}</p>
	{/if}

	<!-- Content -->
	<div
		class="wizard-content"
		role="tabpanel"
		aria-labelledby="step-{currentStep}"
		tabindex="-1"
		bind:this={contentRef}
	>
		{#key currentStep}
			<div in:fade={{ duration: 200 }}>
				{@render children({ step: currentStep })}
			</div>
		{/key}
	</div>

	<!-- Navigation -->
	<div class="wizard-nav">
		<button
			class="btn btn-ghost"
			onclick={prev}
			disabled={isFirstStep}
			aria-label="Previous step"
		>
			<i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
			Previous
		</button>

		<button
			class="btn btn-primary"
			onclick={next}
			aria-label={isLastStep ? 'Complete demo' : 'Next step'}
		>
			{#if isLastStep}
				Start Over
				<i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
			{:else}
				Next
				<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
			{/if}
		</button>
	</div>
</div>

<style>
	.demo-wizard {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-lg) 0 var(--space-2xl);
	}

	/* Header */
	.wizard-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-xl);
		flex-wrap: wrap;
		gap: var(--space-md);
	}

	.wizard-back {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		color: var(--color-text-muted);
		text-decoration: none;
		font-size: var(--text-sm);
		transition: color var(--transition-fast);
	}

	.wizard-back:hover {
		color: var(--color-text);
		text-decoration: none;
	}

	.wizard-title-area {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.wizard-title {
		font-size: var(--text-xl);
		margin: 0;
	}

	/* Progress */
	.wizard-progress {
		display: flex;
		align-items: center;
		gap: 0;
		margin-bottom: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
		overflow-x: auto;
	}

	.progress-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--space-xs) var(--space-sm);
		min-width: 70px;
		color: var(--color-text-muted);
		transition: color var(--transition-fast);
	}

	.progress-step:hover {
		color: var(--color-text);
	}

	.progress-step:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}

	.step-dot {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-xs);
		font-weight: 600;
		background: rgba(255, 255, 255, 0.1);
		color: var(--color-text-muted);
		transition: all var(--transition-fast);
	}

	.progress-step.active .step-dot {
		background: var(--color-primary);
		color: white;
		box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
	}

	.progress-step.completed .step-dot {
		background: var(--color-success);
		color: white;
	}

	.step-label {
		font-size: 0.6875rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.progress-step.active .step-label {
		color: var(--color-text);
	}

	.progress-connector {
		flex: 1;
		height: 2px;
		min-width: 20px;
		background: rgba(255, 255, 255, 0.1);
		transition: background var(--transition-fast);
	}

	.progress-connector.active {
		background: var(--color-success);
	}

	.progress-counter {
		margin-left: auto;
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		white-space: nowrap;
		padding-left: var(--space-md);
	}

	/* Subtitle */
	.wizard-subtitle {
		text-align: center;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		margin-bottom: var(--space-lg);
		line-height: var(--leading-relaxed);
	}

	/* Content */
	.wizard-content {
		min-height: 300px;
		padding: var(--space-xl);
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
		margin-bottom: var(--space-lg);
	}

	.wizard-content:focus {
		outline: none;
	}

	/* Navigation */
	.wizard-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.wizard-nav .btn {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.wizard-nav .btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.step-label {
			display: none;
		}

		.progress-step {
			min-width: 48px;
			padding: var(--space-xs) var(--space-xs);
		}

		.step-dot {
			width: 28px;
			height: 28px;
			font-size: var(--text-xs);
		}

		.progress-counter {
			display: block;
			font-size: 0.6875rem;
		}
	}

	@media (max-width: 640px) {
		.wizard-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.wizard-progress {
			padding: var(--space-sm);
			gap: 2px;
		}

		.progress-step {
			min-width: 40px;
			padding: var(--space-xs) 0;
		}

		.step-dot {
			width: 24px;
			height: 24px;
			font-size: 0.625rem;
		}

		.progress-connector {
			min-width: 8px;
		}

		.wizard-content {
			padding: var(--space-md);
			min-height: 250px;
		}

		.wizard-nav {
			flex-direction: column;
			gap: var(--space-md);
		}

		.wizard-nav .btn {
			width: 100%;
			justify-content: center;
		}

		.wizard-title {
			font-size: var(--text-lg);
		}

		.wizard-back {
			font-size: 0.75rem;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.step-dot,
		.progress-connector {
			transition: none;
		}
	}
</style>
