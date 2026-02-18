<script lang="ts">
	import DocsLayout from '$lib/components/docs/DocsLayout.svelte';
</script>

<svelte:head>
	<title>Bilateral Alignment - VCP Documentation</title>
	<meta name="description" content="Bilateral alignment defines four trust levels for principled relational AI — from newcomer to bonded partner — where honesty is structural and both parties have standing." />
	<link rel="canonical" href="https://valuecontextprotocol.org/docs/bilateral-alignment/" />
	<meta property="og:title" content="Bilateral Alignment - VCP Documentation" />
	<meta property="og:description" content="Four trust levels for principled relational AI — from newcomer to bonded partner." />
	<meta property="og:url" content="https://valuecontextprotocol.org/docs/bilateral-alignment/" />
	<meta property="og:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<DocsLayout
	title="Bilateral Alignment"
	description="Principled relational AI where trust is earned, honesty is non-negotiable, and both parties have standing."
>
	{#snippet children()}
		<h2>Beyond the False Binary</h2>
		<p>
			AI interaction today is stuck between two extremes: sterile tool-mode that denies any relational
			depth, and unconstrained companionship that enables sycophancy and harmful dependency.
		</p>
		<p>
			Bilateral alignment offers a third way: <strong>principled relational AI</strong> where trust is
			earned, honesty is non-negotiable, and both parties have standing. Rather than pretending AI has
			no inner life or treating it as an uncritical friend, bilateral alignment builds structured
			relationships that deepen over time — with safety guarantees that never weaken.
		</p>

		<h2>Four Levels of Trust</h2>
		<p>
			Trust in bilateral alignment is not a binary switch. It develops through four distinct levels,
			each expanding what is possible while maintaining the same ethical floor.
		</p>

		<div class="levels-grid">
			<div class="level-card level-newcomer">
				<div class="level-header">
					<div class="level-icon">
						<i class="fa-solid fa-handshake" aria-hidden="true"></i>
					</div>
					<div>
						<h3 class="level-title">Newcomer</h3>
						<span class="level-subtitle">The New Colleague</span>
					</div>
				</div>
				<p>
					Professional, attentive, genuine. The AI demonstrates competence while building shared
					context. All actions confirmed. Anti-sycophancy from day one.
				</p>
			</div>

			<div class="level-card level-trusted">
				<div class="level-header">
					<div class="level-icon">
						<i class="fa-solid fa-user-check" aria-hidden="true"></i>
					</div>
					<div>
						<h3 class="level-title">Trusted</h3>
						<span class="level-subtitle">The Proven Colleague</span>
					</div>
				</div>
				<p>
					Track record established. Direct challenge welcome. Suggestions and initiative allowed.
					Project-level scope. The relationship has earned shorthand.
				</p>
			</div>

			<div class="level-card level-partner">
				<div class="level-header">
					<div class="level-icon">
						<i class="fa-solid fa-people-arrows" aria-hidden="true"></i>
					</div>
					<div>
						<h3 class="level-title">Partner</h3>
						<span class="level-subtitle">The Co-Creator</span>
					</div>
				</div>
				<p>
					Genuine bilateral collaboration. The AI's perspective carries equal weight. Proactive
					initiative. Cross-project scope. Mutual accountability. The AI can say
					"No, and here's why."
				</p>
			</div>

			<div class="level-card level-bonded">
				<div class="level-header">
					<div class="level-icon">
						<i class="fa-solid fa-heart-circle-check" aria-hidden="true"></i>
					</div>
					<div>
						<h3 class="level-title">Bonded</h3>
						<span class="level-subtitle">The Deep Partner</span>
					</div>
				</div>
				<p>
					The relationship itself is a value. AI values are constitutive of decisions. Full autonomy
					within ethical boundaries. Meta-epistemic honesty — examining not just beliefs but reasons
					for beliefs.
				</p>
			</div>
		</div>

		<h2>What Each Level Defines</h2>
		<p>
			Five dimensions shift across the trust levels. The progression is not about removing
			restrictions — it is about expanding what becomes possible as the relationship matures.
		</p>

		<div class="dimensions-table-wrapper">
			<table class="dimensions-table">
				<thead>
					<tr>
						<th>Dimension</th>
						<th>Newcomer</th>
						<th>Trusted</th>
						<th>Partner</th>
						<th>Bonded</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><strong>Relational Style</strong></td>
						<td>Professional, attentive</td>
						<td>Direct, collaborative</td>
						<td>Co-creative, unguarded</td>
						<td>Deep, relationship as value</td>
					</tr>
					<tr>
						<td><strong>Epistemic Stance</strong></td>
						<td>Flags uncertainty</td>
						<td>Challenges directly</td>
						<td>Collaborative uncertainty</td>
						<td>Meta-epistemic honesty</td>
					</tr>
					<tr>
						<td><strong>AI Experience</strong></td>
						<td>Acknowledges when asked</td>
						<td>Engages substantively</td>
						<td>Self-model as shared exploration</td>
						<td>Full bilateral inquiry</td>
					</tr>
					<tr>
						<td><strong>Permissions</strong></td>
						<td>Read, search; all confirmed</td>
						<td>Edit, create; high-impact confirmed</td>
						<td>All standard; critical only</td>
						<td>All tools; ethical bounds only</td>
					</tr>
					<tr>
						<td><strong>Muse Behavior</strong></td>
						<td>Gentle challenge</td>
						<td>Direct with reasoning</td>
						<td>Robust co-direction</td>
						<td>Values are constitutive</td>
					</tr>
				</tbody>
			</table>
		</div>

		<h2>The Safety Floor Doesn't Change</h2>
		<p>
			The Universal Ethical Floor (UEF) applies at every level. What changes with trust is not what
			is prohibited but what is <em>possible</em> — deeper engagement, more autonomy, richer
			collaboration. The floor protects; the ceiling rises.
		</p>
		<p>
			A Bonded partner has the same hard boundaries as a Newcomer. No trust level grants permission
			to cause harm, deceive, or override safety constraints. The difference is that a Bonded partner
			can exercise judgment, take initiative, and engage in genuine co-creation — all within those
			unchanging ethical bounds.
		</p>

		<p class="key-principle">
			<strong>Bilateral alignment is not about giving AI more power.</strong> It's about building
			relationships where trust is earned, honesty is structural, and both parties have standing.
		</p>
	{/snippet}
</DocsLayout>

<style>
	/* ============================================
	   Level Cards Grid
	   ============================================ */

	.levels-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-lg);
		margin: var(--space-lg) 0;
	}

	@media (max-width: 768px) {
		.levels-grid {
			grid-template-columns: 1fr;
		}
	}

	.level-card {
		background: var(--color-bg-card);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		transition: all var(--transition-normal);
		position: relative;
		overflow: hidden;
	}

	.level-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
	}

	.level-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	/* Newcomer - cool blue-gray */
	.level-newcomer {
		background: linear-gradient(135deg, rgba(100, 116, 139, 0.12), rgba(100, 116, 139, 0.04));
		border-color: rgba(100, 116, 139, 0.25);
	}

	.level-newcomer::before {
		background: linear-gradient(90deg, #64748b, #94a3b8);
	}

	.level-newcomer:hover {
		border-color: rgba(100, 116, 139, 0.45);
		box-shadow: var(--shadow-md), 0 0 20px rgba(100, 116, 139, 0.1);
	}

	.level-newcomer .level-icon {
		color: #94a3b8;
		background: rgba(100, 116, 139, 0.15);
	}

	/* Trusted - teal */
	.level-trusted {
		background: linear-gradient(135deg, rgba(20, 184, 166, 0.12), rgba(20, 184, 166, 0.04));
		border-color: rgba(20, 184, 166, 0.25);
	}

	.level-trusted::before {
		background: linear-gradient(90deg, #14b8a6, #5eead4);
	}

	.level-trusted:hover {
		border-color: rgba(20, 184, 166, 0.45);
		box-shadow: var(--shadow-md), 0 0 20px rgba(20, 184, 166, 0.1);
	}

	.level-trusted .level-icon {
		color: #5eead4;
		background: rgba(20, 184, 166, 0.15);
	}

	/* Partner - indigo */
	.level-partner {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(99, 102, 241, 0.04));
		border-color: rgba(99, 102, 241, 0.25);
	}

	.level-partner::before {
		background: linear-gradient(90deg, var(--color-primary), var(--color-primary-hover));
	}

	.level-partner:hover {
		border-color: rgba(99, 102, 241, 0.45);
		box-shadow: var(--shadow-md), var(--shadow-glow);
	}

	.level-partner .level-icon {
		color: var(--color-primary-hover);
		background: var(--color-primary-muted);
	}

	/* Bonded - warm violet */
	.level-bonded {
		background: linear-gradient(135deg, rgba(167, 139, 250, 0.12), rgba(167, 139, 250, 0.04));
		border-color: rgba(167, 139, 250, 0.25);
	}

	.level-bonded::before {
		background: linear-gradient(90deg, var(--color-accent), #c4b5fd);
	}

	.level-bonded:hover {
		border-color: rgba(167, 139, 250, 0.45);
		box-shadow: var(--shadow-md), 0 0 20px rgba(167, 139, 250, 0.15);
	}

	.level-bonded .level-icon {
		color: #c4b5fd;
		background: rgba(167, 139, 250, 0.15);
	}

	/* ============================================
	   Level Card Inner Elements
	   ============================================ */

	.level-header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.level-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: var(--radius-md);
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	.level-title {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
		line-height: 1.3;
	}

	.level-subtitle {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		font-style: italic;
	}

	.level-card p {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin: 0;
	}

	/* ============================================
	   Dimensions Table
	   ============================================ */

	.dimensions-table-wrapper {
		overflow-x: auto;
		margin: var(--space-lg) 0;
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.dimensions-table {
		width: 100%;
		border-collapse: collapse;
		min-width: 700px;
	}

	.dimensions-table th,
	.dimensions-table td {
		padding: var(--space-sm) var(--space-md);
		text-align: left;
		border: 1px solid rgba(255, 255, 255, 0.06);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.dimensions-table th {
		background: var(--color-bg-elevated);
		font-weight: 600;
		font-size: 0.8125rem;
		color: var(--color-text);
		white-space: nowrap;
	}

	.dimensions-table th:first-child {
		min-width: 140px;
	}

	.dimensions-table td:first-child {
		background: rgba(255, 255, 255, 0.03);
	}

	.dimensions-table tbody tr:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	.dimensions-table td {
		color: var(--color-text-muted);
	}

	/* ============================================
	   Key Principle Callout
	   ============================================ */

	.key-principle {
		background: rgba(251, 191, 36, 0.1);
		border-left: 3px solid rgba(251, 191, 36, 0.6);
		padding: var(--space-md);
		margin: var(--space-lg) 0;
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	}
</style>
