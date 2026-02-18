<script lang="ts">
	/**
	 * UVC Naming Scheme Documentation
	 * Universal Value Code token format and resolution
	 */
	import { Breadcrumb } from '$lib/components/shared';

	const breadcrumbItems = [
		{ label: 'Docs', href: '/docs' },
		{ label: 'UVC Naming', icon: 'fa-tag' }
	];
</script>

<svelte:head>
	<title>UVC Naming - VCP Documentation</title>
	<meta name="description" content="Universal Value Code naming scheme: token format, namespace tiers, semantic mapping, and resolution." />
	<link rel="canonical" href="https://valuecontextprotocol.org/docs/naming/" />
	<meta property="og:title" content="UVC Naming - VCP Documentation" />
	<meta property="og:description" content="Universal Value Code naming scheme: token format, namespace tiers, semantic mapping, and resolution." />
	<meta property="og:url" content="https://valuecontextprotocol.org/docs/naming/" />
	<meta property="og:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<div class="container-narrow">
	<Breadcrumb items={breadcrumbItems} />

	<section class="page-hero">
		<h1>UVC Naming</h1>
		<p class="page-hero-subtitle">
			Universal Value Codes give every constitution a unique, human-readable identifier
			that encodes domain, approach, role, version, and organizational scope.
		</p>
	</section>

	<!-- Token Format -->
	<section class="doc-section">
		<h2>Token Format</h2>
		<p class="section-intro">
			A UVC token is a dot-separated hierarchy with optional version and namespace suffixes.
		</p>

		<div class="format-block">
			<div class="format-syntax">
				<code>domain<span class="sep">.</span>approach<span class="sep">.</span>role<span class="opt">[@version]</span><span class="opt">[:namespace]</span></code>
			</div>
			<div class="format-parts">
				<div class="format-part">
					<span class="part-label">Required</span>
					<span class="part-desc">domain.approach.role</span>
				</div>
				<div class="format-part">
					<span class="part-label part-label-opt">Optional</span>
					<span class="part-desc">@version (semver) and :namespace (org scope)</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Semantic Mapping -->
	<section class="doc-section">
		<h2>Semantic Mapping</h2>
		<p class="section-intro">
			Each component of the token carries specific meaning.
		</p>

		<div class="mapping-table-wrap">
			<table class="mapping-table">
				<thead>
					<tr>
						<th>Component</th>
						<th>Description</th>
						<th>Example</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>domain</code></td>
						<td>Value domain -- the broad area of concern</td>
						<td>family, work, secure, health</td>
					</tr>
					<tr>
						<td><code>approach</code></td>
						<td>Approach within the domain -- how values are applied</td>
						<td>safe, strict, flexible, balanced</td>
					</tr>
					<tr>
						<td><code>role</code></td>
						<td>Specific function the constitution fulfils</td>
						<td>guide, compliance, tutor, moderator</td>
					</tr>
					<tr>
						<td><code>version</code></td>
						<td>Semantic version (optional) -- pinned or ranged</td>
						<td>@1.2.0, @2.0.0</td>
					</tr>
					<tr>
						<td><code>namespace</code></td>
						<td>Organizational scope (optional) -- who governs</td>
						<td>:SEC, :NHS, :acme-corp</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<!-- Namespace Tiers -->
	<section class="doc-section">
		<h2>Namespace Tiers</h2>
		<p class="section-intro">
			Namespaces determine governance scope. Higher tiers have broader authority
			and stricter review processes.
		</p>

		<div class="tier-cards">
			<div class="tier-card tier-core">
				<div class="tier-header">
					<i class="fa-solid fa-globe" aria-hidden="true"></i>
					<div>
						<h4>Core</h4>
						<span class="tier-prefix">(no prefix)</span>
					</div>
				</div>
				<p>Governed by the VCP Consortium. Universal constitutions that apply across all contexts.</p>
				<div class="tier-example"><code>family.safe.guide@1.0.0</code></div>
			</div>

			<div class="tier-card tier-org">
				<div class="tier-header">
					<i class="fa-solid fa-building" aria-hidden="true"></i>
					<div>
						<h4>Organizational</h4>
						<span class="tier-prefix">company.*</span>
					</div>
				</div>
				<p>Governed by an organization. Scoped to corporate policies and industry regulations.</p>
				<div class="tier-example"><code>company.acme.legal.compliance:SEC</code></div>
			</div>

			<div class="tier-card tier-community">
				<div class="tier-header">
					<i class="fa-solid fa-people-group" aria-hidden="true"></i>
					<div>
						<h4>Community</h4>
						<span class="tier-prefix">community.*</span>
					</div>
				</div>
				<p>Governed by a community group. Shared norms for specific interest groups or movements.</p>
				<div class="tier-example"><code>community.educators.stem.tutor@2.1.0</code></div>
			</div>

			<div class="tier-card tier-personal">
				<div class="tier-header">
					<i class="fa-solid fa-user" aria-hidden="true"></i>
					<div>
						<h4>Personal</h4>
						<span class="tier-prefix">user.*</span>
					</div>
				</div>
				<p>Governed by an individual. Custom constitutions for personal use or experimentation.</p>
				<div class="tier-example"><code>user.nell.creative.writer@1.0.0</code></div>
			</div>
		</div>
	</section>

	<!-- Resolution -->
	<section class="doc-section">
		<h2>Resolution</h2>
		<p class="section-intro">
			UVC tokens resolve to URIs that locate the signed constitution bundle
			in a content-addressed repository.
		</p>

		<div class="resolution-block">
			<div class="resolution-step">
				<h4><i class="fa-solid fa-tag" aria-hidden="true"></i> Token</h4>
				<code class="resolution-code">family.safe.guide@1.2.0</code>
			</div>

			<div class="resolution-arrow">
				<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
			</div>

			<div class="resolution-step">
				<h4><i class="fa-solid fa-link" aria-hidden="true"></i> URI</h4>
				<code class="resolution-code">creed://creed.space/family/safe/guide?v=1.2.0</code>
			</div>
		</div>

		<div class="resolution-details">
			<div class="tech-item">
				<h4>Path Mapping</h4>
				<p>
					Dots become path segments: <code>family.safe.guide</code> maps to
					<code>/family/safe/guide</code>. The version is passed as a query parameter.
				</p>
			</div>
			<div class="tech-item">
				<h4>Namespace Scoping</h4>
				<p>
					Namespaced tokens resolve under the namespace authority:
					<code>company.acme.legal.compliance:SEC</code> maps to
					<code>creed://creed.space/company/acme/legal/compliance?ns=SEC</code>.
				</p>
			</div>
			<div class="tech-item">
				<h4>Version Resolution</h4>
				<p>
					If no version is specified, the resolver returns the latest stable release.
					Pinned versions (<code>@1.2.0</code>) are immutable once published.
				</p>
			</div>
		</div>
	</section>

	<!-- Examples -->
	<section class="doc-section">
		<h2>Examples</h2>
		<p class="section-intro">
			Real-world UVC tokens showing the naming scheme in practice.
		</p>

		<div class="example-cards">
			<div class="example-card">
				<div class="example-token"><code>family.safe.guide@1.2.0</code></div>
				<div class="example-breakdown">
					<span class="example-tag tag-domain">family</span>
					<span class="example-tag tag-approach">safe</span>
					<span class="example-tag tag-role">guide</span>
					<span class="example-tag tag-version">v1.2.0</span>
				</div>
				<p>A core family-safety constitution for guiding children's AI interactions. Age-appropriate filtering, gentle redirection, parental reporting.</p>
			</div>

			<div class="example-card">
				<div class="example-token"><code>company.acme.legal.compliance:SEC</code></div>
				<div class="example-breakdown">
					<span class="example-tag tag-domain">company.acme</span>
					<span class="example-tag tag-approach">legal</span>
					<span class="example-tag tag-role">compliance</span>
					<span class="example-tag tag-namespace">SEC</span>
				</div>
				<p>Acme Corp's SEC compliance constitution. Ensures AI responses in financial contexts meet regulatory disclosure requirements.</p>
			</div>

			<div class="example-card">
				<div class="example-token"><code>community.educators.stem.tutor@2.1.0</code></div>
				<div class="example-breakdown">
					<span class="example-tag tag-domain">community.educators</span>
					<span class="example-tag tag-approach">stem</span>
					<span class="example-tag tag-role">tutor</span>
					<span class="example-tag tag-version">v2.1.0</span>
				</div>
				<p>A community-maintained tutoring constitution for STEM education. Encourages exploration, Socratic questioning, worked examples.</p>
			</div>

			<div class="example-card">
				<div class="example-token"><code>health.cautious.advisor@1.0.0</code></div>
				<div class="example-breakdown">
					<span class="example-tag tag-domain">health</span>
					<span class="example-tag tag-approach">cautious</span>
					<span class="example-tag tag-role">advisor</span>
					<span class="example-tag tag-version">v1.0.0</span>
				</div>
				<p>A core health constitution. Conservative approach: always recommends professional consultation, avoids diagnosis, respects privacy.</p>
			</div>

			<div class="example-card">
				<div class="example-token"><code>user.nell.creative.writer@1.0.0</code></div>
				<div class="example-breakdown">
					<span class="example-tag tag-domain">user.nell</span>
					<span class="example-tag tag-approach">creative</span>
					<span class="example-tag tag-role">writer</span>
					<span class="example-tag tag-version">v1.0.0</span>
				</div>
				<p>A personal constitution for creative writing assistance. Prioritizes voice preservation, avoids over-editing, encourages experimentation.</p>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="cta-section">
		<h2>Build Your Own Token</h2>
		<p>See how UVC tokens work in practice with the interactive playground.</p>
		<div class="cta-buttons">
			<a href="/playground" class="btn btn-primary">
				<i class="fa-solid fa-sliders" aria-hidden="true"></i>
				Open Playground
			</a>
			<a href="/docs/security" class="btn btn-secondary">
				<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
				Transport Security
			</a>
		</div>
	</section>
</div>

<style>
	.doc-section {
		margin-bottom: var(--space-2xl);
	}

	.doc-section h2 {
		margin-bottom: var(--space-md);
	}

	.section-intro {
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
		line-height: var(--leading-relaxed);
	}

	/* Format block */
	.format-block {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-xl);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.format-syntax {
		text-align: center;
		margin-bottom: var(--space-lg);
	}

	.format-syntax code {
		font-size: var(--text-lg);
		padding: var(--space-sm) var(--space-lg);
		background: var(--color-bg);
		border-radius: var(--radius-md);
		display: inline-block;
	}

	.format-syntax .sep {
		color: var(--color-primary);
		font-weight: 700;
	}

	.format-syntax .opt {
		color: var(--color-text-muted);
	}

	.format-parts {
		display: flex;
		gap: var(--space-lg);
		justify-content: center;
		flex-wrap: wrap;
	}

	.format-part {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
	}

	.part-label {
		font-size: var(--text-xs);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		background: var(--color-primary-muted);
		color: var(--color-primary);
		font-weight: 500;
	}

	.part-label-opt {
		background: rgba(255, 255, 255, 0.1);
		color: var(--color-text-muted);
	}

	.part-desc {
		color: var(--color-text-muted);
	}

	/* Mapping table */
	.mapping-table-wrap {
		overflow-x: auto;
	}

	.mapping-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
	}

	.mapping-table th,
	.mapping-table td {
		padding: var(--space-sm) var(--space-md);
		text-align: left;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.mapping-table th {
		color: var(--color-text-muted);
		font-weight: 500;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.mapping-table td code {
		font-size: var(--text-xs);
		padding: 1px 6px;
		background: var(--color-bg-card);
		border-radius: var(--radius-sm);
		color: var(--color-primary);
	}

	.mapping-table td {
		color: var(--color-text-muted);
	}

	/* Tier cards */
	.tier-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: var(--space-md);
	}

	.tier-card {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		border-left: 4px solid;
	}

	.tier-core { border-left-color: var(--color-primary); }
	.tier-org { border-left-color: var(--color-warning); }
	.tier-community { border-left-color: var(--color-success); }
	.tier-personal { border-left-color: #a78bfa; }

	.tier-header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-sm);
	}

	.tier-header i {
		font-size: 1.25rem;
		color: var(--color-primary);
	}

	.tier-header h4 {
		font-size: var(--text-base);
		margin: 0;
	}

	.tier-prefix {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
	}

	.tier-card p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-md);
	}

	.tier-example code {
		font-size: var(--text-xs);
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-bg);
		border-radius: var(--radius-sm);
	}

	/* Resolution */
	.resolution-block {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-xl);
		border: 1px solid rgba(255, 255, 255, 0.1);
		margin-bottom: var(--space-lg);
		flex-wrap: wrap;
		justify-content: center;
	}

	.resolution-step {
		text-align: center;
	}

	.resolution-step h4 {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-sm);
	}

	.resolution-step h4 i {
		color: var(--color-primary);
	}

	.resolution-code {
		font-size: var(--text-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg);
		border-radius: var(--radius-sm);
		display: inline-block;
	}

	.resolution-arrow {
		color: var(--color-primary);
		font-size: 1.25rem;
	}

	.resolution-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.tech-item {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.tech-item h4 {
		margin-bottom: var(--space-sm);
	}

	.tech-item p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
	}

	.tech-item code {
		font-size: var(--text-xs);
		padding: 1px 4px;
		background: var(--color-bg);
		border-radius: var(--radius-sm);
	}

	/* Example cards */
	.example-cards {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.example-card {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.example-token {
		margin-bottom: var(--space-md);
	}

	.example-token code {
		font-size: var(--text-base);
		padding: var(--space-xs) var(--space-md);
		background: var(--color-bg);
		border-radius: var(--radius-sm);
	}

	.example-breakdown {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-bottom: var(--space-md);
	}

	.example-tag {
		font-size: var(--text-xs);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		font-weight: 500;
	}

	.tag-domain { background: var(--color-primary-muted); color: var(--color-primary); }
	.tag-approach { background: var(--color-success-muted); color: var(--color-success); }
	.tag-role { background: var(--color-warning-muted); color: var(--color-warning); }
	.tag-version { background: rgba(167, 139, 250, 0.15); color: #a78bfa; }
	.tag-namespace { background: var(--color-danger-muted); color: var(--color-danger); }

	.example-card p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
	}

	/* CTA */
	.cta-section {
		text-align: center;
		padding: var(--space-xl);
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.cta-section h2 {
		margin-bottom: var(--space-sm);
	}

	.cta-section p {
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: var(--space-md);
		flex-wrap: wrap;
	}

	@media (max-width: 768px) {
		.resolution-block {
			flex-direction: column;
		}

		.resolution-arrow {
			transform: rotate(90deg);
		}

		.tier-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
