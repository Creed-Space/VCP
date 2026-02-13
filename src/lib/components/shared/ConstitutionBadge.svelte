<script lang="ts">
	/**
	 * ConstitutionBadge - Displays a compact constitution code badge
	 * e.g. "St4+Sw+P" with the full ID below in muted text
	 */
	import type { ConstitutionReference } from '$lib/vcp/types';
	import { generateConstitutionCode } from '$lib/vcp/constitution-codes';

	interface Props {
		constitution: ConstitutionReference;
		size?: 'sm' | 'md' | 'lg';
	}

	const { constitution, size = 'md' }: Props = $props();

	const code = $derived(generateConstitutionCode(constitution));
</script>

<span class="constitution-badge size-{size}">
	<span class="badge-code">{code}</span>
	<span class="badge-id">{constitution.id}</span>
</span>

<style>
	.constitution-badge {
		display: inline-flex;
		flex-direction: column;
		align-items: flex-start;
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-bg-elevated);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: var(--radius-sm);
		gap: 2px;
	}

	.badge-code {
		font-family: var(--font-mono);
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--color-primary);
	}

	.badge-id {
		font-size: 0.625rem;
		color: var(--color-text-subtle);
		word-break: break-all;
		line-height: 1.2;
	}

	/* Sizes */
	.size-sm .badge-code {
		font-size: 0.6875rem;
	}

	.size-sm .badge-id {
		font-size: 0.5625rem;
	}

	.size-md .badge-code {
		font-size: 0.8125rem;
	}

	.size-lg {
		padding: var(--space-sm) var(--space-md);
	}

	.size-lg .badge-code {
		font-size: 1rem;
	}

	.size-lg .badge-id {
		font-size: 0.75rem;
	}
</style>
