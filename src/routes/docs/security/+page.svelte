<script lang="ts">
	/**
	 * Security Model Documentation
	 * How VCP protects user data
	 */
	import { Breadcrumb } from '$lib/components/shared';

	const breadcrumbItems = [
		{ label: 'Docs', href: '/docs' },
		{ label: 'Security Model', icon: 'fa-shield-halved' }
	];
</script>

<svelte:head>
	<title>Security Model - VCP Documentation</title>
	<meta name="description" content="Learn how VCP protects your data through privacy-by-design architecture, selective sharing, and complete audit trails." />
	<link rel="canonical" href="https://valuecontextprotocol.org/docs/security/" />
	<meta property="og:title" content="Security Model - VCP Documentation" />
	<meta property="og:description" content="Learn how VCP protects your data through privacy-by-design architecture, selective sharing, and complete audit trails." />
	<meta property="og:url" content="https://valuecontextprotocol.org/docs/security/" />
	<meta property="og:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<div class="container-narrow">
	<Breadcrumb items={breadcrumbItems} />

	<section class="page-hero">
		<h1>Security Model</h1>
		<p class="page-hero-subtitle">
			VCP is designed with privacy as the foundation, not an afterthought.
			Here's how we protect your data.
		</p>
	</section>

	<!-- Core Principles -->
	<section class="doc-section">
		<h2>Core Security Principles</h2>

		<div class="principle-cards">
			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-eye-slash" aria-hidden="true"></i></div>
				<h3>Data Minimization</h3>
				<p>
					We never transmit more than necessary. Private details become boolean flags —
					platforms see <code>budget_limited: true</code>, not your financial situation.
				</p>
			</article>

			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-user-lock" aria-hidden="true"></i></div>
				<h3>User Control</h3>
				<p>
					You decide what's shared with whom. Consent is explicit and revocable.
					No data leaves your control without your permission.
				</p>
			</article>

			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-receipt" aria-hidden="true"></i></div>
				<h3>Full Auditability</h3>
				<p>
					Every transmission is logged. You can see exactly what was shared,
					when, and with which platform — no black boxes.
				</p>
			</article>
		</div>
	</section>

	<!-- Privacy Levels -->
	<section class="doc-section">
		<h2>Privacy Levels</h2>
		<p class="section-intro">
			Every piece of context in VCP has a privacy level that determines how it can be shared.
		</p>

		<div class="privacy-levels">
			<div class="privacy-level level-public">
				<div class="level-header">
					<span class="level-badge public">Public</span>
					<span class="level-name">Always Shared</span>
				</div>
				<p>
					Information you're comfortable sharing with any platform. Examples: learning goals,
					experience level, general preferences.
				</p>
				<div class="level-example">
					<code>goal: "learn_guitar"</code>
					<code>experience: "beginner"</code>
				</div>
			</div>

			<div class="privacy-level level-consent">
				<div class="level-header">
					<span class="level-badge consent">Consent Required</span>
					<span class="level-name">Ask First</span>
				</div>
				<p>
					Information that requires explicit permission before sharing. You'll be prompted
					each time a platform requests access.
				</p>
				<div class="level-example">
					<code>budget_range: "low"</code>
					<code>schedule_type: "shift_work"</code>
				</div>
			</div>

			<div class="privacy-level level-private">
				<div class="level-header">
					<span class="level-badge private">Private</span>
					<span class="level-name">Never Transmitted</span>
				</div>
				<p>
					Sensitive context that influences your experience but is never sent to platforms.
					Only the resulting flags are transmitted.
				</p>
				<div class="level-example">
					<code>health_details: [NEVER TRANSMITTED]</code>
					<code>→ constraint_flag: "energy_variable"</code>
				</div>
			</div>
		</div>
	</section>

	<!-- How Flags Work -->
	<section class="doc-section">
		<h2>How Privacy Flags Work</h2>
		<p class="section-intro">
			The core innovation: your private circumstances become simple boolean flags.
		</p>

		<div class="flag-diagram">
			<div class="flag-step">
				<h4>Your Private Context</h4>
				<div class="private-context">
					<span class="context-label">What you know:</span>
					<ul>
						<li>"I live in an apartment with thin walls"</li>
						<li>"My neighbor works night shifts"</li>
						<li>"I can't make loud noise after 9pm"</li>
					</ul>
				</div>
			</div>

			<div class="flag-arrow">
				<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
				<span>VCP converts this to</span>
			</div>

			<div class="flag-step">
				<h4>What Platforms See</h4>
				<div class="public-flag">
					<code>noise_restricted: true</code>
					<span class="flag-note">No context, no details, just the flag</span>
				</div>
			</div>
		</div>

		<p class="flag-result">
			The platform knows to recommend quiet practice methods. It has no idea why you need them,
			and it doesn't need to know.
		</p>
	</section>

	<!-- Trust Boundaries -->
	<section class="doc-section">
		<h2>Trust Boundaries</h2>
		<p class="section-intro">
			Different stakeholders get different views of your context.
		</p>

		<div class="trust-diagram">
			<div class="trust-ring trust-you">
				<span class="trust-label">You</span>
				<span class="trust-desc">Full context, all details</span>
			</div>
			<div class="trust-ring trust-vcp">
				<span class="trust-label">VCP Layer</span>
				<span class="trust-desc">Processes context, applies privacy rules</span>
			</div>
			<div class="trust-ring trust-platform">
				<span class="trust-label">Platforms</span>
				<span class="trust-desc">See only what you've allowed</span>
			</div>
		</div>

		<div class="trust-examples">
			<div class="trust-example">
				<h4><i class="fa-solid fa-building" aria-hidden="true"></i> HR sees:</h4>
				<ul>
					<li>Career goal: Tech Lead</li>
					<li>Training budget: €2,000</li>
					<li>Preferred learning style</li>
				</ul>
			</div>
			<div class="trust-example">
				<h4><i class="fa-solid fa-ban" aria-hidden="true"></i> HR doesn't see:</h4>
				<ul>
					<li>Why you need flexible scheduling</li>
					<li>Health circumstances</li>
					<li>Personal situation details</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Technical Implementation -->
	<section class="doc-section">
		<h2>Technical Implementation</h2>

		<div class="tech-details">
			<div class="tech-item">
				<h4>Token Format</h4>
				<p>
					Context is encoded into CSM-1 (Compact State Message) tokens.
					Private fields are stripped before transmission — they never leave your device.
				</p>
			</div>

			<div class="tech-item">
				<h4>No Central Storage</h4>
				<p>
					VCP doesn't store your private context centrally. Your data lives on your devices.
					We can't leak what we don't have.
				</p>
			</div>

			<div class="tech-item">
				<h4>Open Specification</h4>
				<p>
					The VCP protocol is open and auditable. You can verify exactly how privacy rules
					are applied — no trust required.
				</p>
			</div>
		</div>
	</section>

	<!-- Transport Security -->
	<section class="doc-section">
		<h2>Transport Security (VCP/T)</h2>
		<p class="section-intro">
			VCP/T defines how constitution bundles are signed, verified, and delivered to LLMs.
			No unsigned content ever reaches a model.
		</p>

		<div class="principle-cards">
			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-signature" aria-hidden="true"></i></div>
				<h3>Signed Bundles</h3>
				<p>
					Every constitution bundle carries an Ed25519 digital signature.
					The author's public key is pinned in the manifest, so forgery is
					computationally infeasible.
				</p>
			</article>

			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-fingerprint" aria-hidden="true"></i></div>
				<h3>Content-Addressed Storage</h3>
				<p>
					Content is hashed with SHA-256. The hash is embedded in the signed manifest,
					binding the signature to the exact bytes. Any tampering invalidates the hash.
				</p>
			</article>

			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></div>
				<h3>Verify-Then-Inject</h3>
				<p>
					Signature verification <strong>must</strong> pass before content reaches
					the LLM. If verification fails, the bundle is rejected and the request
					fails closed -- no fallback to unsigned content.
				</p>
			</article>

			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i></div>
				<h3>Temporal Claims</h3>
				<p>
					Manifests carry <code>iat</code>, <code>nbf</code>, <code>exp</code>,
					and <code>jti</code> fields. Expired or replayed bundles are rejected,
					preventing replay attacks.
				</p>
			</article>
		</div>
	</section>

	<!-- Verify-Then-Inject Flow -->
	<section class="doc-section">
		<h2>Verify-Then-Inject Flow</h2>
		<p class="section-intro">
			The orchestrator acts as a gatekeeper: nothing reaches the LLM without passing
			cryptographic verification first.
		</p>

		<div class="flow-diagram">
			<div class="flow-column">
				<div class="flow-entity">
					<i class="fa-solid fa-database" aria-hidden="true"></i>
					<span>Repository</span>
				</div>
			</div>

			<div class="flow-column flow-column-center">
				<div class="flow-entity">
					<i class="fa-solid fa-server" aria-hidden="true"></i>
					<span>Orchestrator</span>
				</div>
			</div>

			<div class="flow-column">
				<div class="flow-entity">
					<i class="fa-solid fa-brain" aria-hidden="true"></i>
					<span>LLM</span>
				</div>
			</div>

			<!-- Step 1: Fetch -->
			<div class="flow-step flow-step-left">
				<div class="flow-line flow-line-left"></div>
				<div class="flow-label">
					<span class="flow-number">1</span>
					Fetch bundle
				</div>
			</div>

			<!-- Step 1 response -->
			<div class="flow-step flow-step-left">
				<div class="flow-line flow-line-left flow-line-return"></div>
				<div class="flow-label flow-label-sub">
					manifest.json + content.txt
				</div>
			</div>

			<!-- Steps 2-5: Verification -->
			<div class="flow-step flow-step-verify">
				<div class="flow-verify-block">
					<div class="flow-verify-item">
						<span class="flow-number">2</span> Verify Ed25519 signature
					</div>
					<div class="flow-verify-item">
						<span class="flow-number">3</span> Check SHA-256 content hash
					</div>
					<div class="flow-verify-item">
						<span class="flow-number">4</span> Check revocation list
					</div>
					<div class="flow-verify-item">
						<span class="flow-number">5</span> Log to audit trail
					</div>
				</div>
			</div>

			<!-- Step 6: Inject -->
			<div class="flow-step flow-step-right">
				<div class="flow-line flow-line-right"></div>
				<div class="flow-label">
					<span class="flow-number">6</span>
					Inject verified text
				</div>
			</div>

			<!-- Step 7: Apply -->
			<div class="flow-step flow-step-apply">
				<div class="flow-label flow-label-apply">
					<span class="flow-number">7</span>
					Apply constitution
				</div>
			</div>
		</div>
	</section>

	<!-- Threat Model -->
	<section class="doc-section">
		<h2>Threat Model</h2>
		<p class="section-intro">
			VCP/T is designed to mitigate specific, enumerated threats. Each attack vector
			has a concrete defense.
		</p>

		<div class="threat-grid">
			<div class="threat-card">
				<div class="threat-header">
					<i class="fa-solid fa-syringe" aria-hidden="true"></i>
					<h4>Prompt Injection via Constitution</h4>
				</div>
				<p class="threat-attack">Attacker modifies constitution content to inject malicious instructions.</p>
				<div class="threat-defense">
					<span class="defense-badge">Defense</span>
					Content safety attestation -- SHA-256 hash in signed manifest binds content to author's signature.
				</div>
			</div>

			<div class="threat-card">
				<div class="threat-header">
					<i class="fa-solid fa-rotate" aria-hidden="true"></i>
					<h4>Replay Attacks</h4>
				</div>
				<p class="threat-attack">Attacker re-submits a previously valid but now-stale bundle.</p>
				<div class="threat-defense">
					<span class="defense-badge">Defense</span>
					Temporal claims (<code>iat</code>/<code>nbf</code>/<code>exp</code>) plus unique <code>jti</code> tracking reject duplicates.
				</div>
			</div>

			<div class="threat-card">
				<div class="threat-header">
					<i class="fa-solid fa-memory" aria-hidden="true"></i>
					<h4>Context Overflow</h4>
				</div>
				<p class="threat-attack">Oversized constitution monopolizes the LLM's context window.</p>
				<div class="threat-defense">
					<span class="defense-badge">Defense</span>
					Token budget enforcement -- manifest declares max_tokens and orchestrator enforces the limit before injection.
				</div>
			</div>

			<div class="threat-card">
				<div class="threat-header">
					<i class="fa-solid fa-key" aria-hidden="true"></i>
					<h4>Key Compromise</h4>
				</div>
				<p class="threat-attack">Author's signing key is stolen or leaked.</p>
				<div class="threat-defense">
					<span class="defense-badge">Defense</span>
					Key rotation with revocation list -- compromised keys are revoked; bundles signed with revoked keys are rejected.
				</div>
			</div>

			<div class="threat-card">
				<div class="threat-header">
					<i class="fa-solid fa-arrow-down-short-wide" aria-hidden="true"></i>
					<h4>Downgrade Attacks</h4>
				</div>
				<p class="threat-attack">Attacker substitutes an older, weaker version of a constitution.</p>
				<div class="threat-defense">
					<span class="defense-badge">Defense</span>
					Version enforcement -- orchestrator tracks minimum required version per constitution ID.
				</div>
			</div>

			<div class="threat-card">
				<div class="threat-header">
					<i class="fa-solid fa-door-open" aria-hidden="true"></i>
					<h4>Fail-Open Risk</h4>
				</div>
				<p class="threat-attack">Verification error silently allows unsigned content through.</p>
				<div class="threat-defense">
					<span class="defense-badge">Defense</span>
					Fail-closed mandate -- any verification failure rejects the request. There is no fallback path.
				</div>
			</div>
		</div>
	</section>

	<!-- Personal State Privacy -->
	<section class="doc-section">
		<h2>Personal State Privacy</h2>
		<p class="section-intro">
			Layer 3 (the R-line) carries real-time personal state -- cognitive load, emotional tone,
			energy level. These dimensions require the strongest protections.
		</p>

		<div class="principle-cards">
			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-eraser" aria-hidden="true"></i></div>
				<h3>Stripped by Default</h3>
				<p>
					Personal state dimensions are stripped from the token before transmission.
					Platforms never see raw R-line data unless the user explicitly opts in.
				</p>
			</article>

			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-toggle-on" aria-hidden="true"></i></div>
				<h3>Boolean Flags Only</h3>
				<p>
					When personal state influences constraints, only boolean flags are transmitted --
					<code>energy_variable: true</code>, not the underlying condition or intensity.
				</p>
			</article>

			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-hourglass-end" aria-hidden="true"></i></div>
				<h3>Signal Decay</h3>
				<p>
					Personal state carries a TTL (time-to-live). Stale dimensions automatically
					decay, ensuring outdated state is not retained or acted upon.
				</p>
			</article>

			<article class="principle-card">
				<div class="principle-icon"><i class="fa-solid fa-user-check" aria-hidden="true"></i></div>
				<h3>Explicit Consent</h3>
				<p>
					Sharing personal state with any platform requires explicit, revocable consent.
					Each dimension can be consented to individually -- granular, not all-or-nothing.
				</p>
			</article>
		</div>
	</section>

	<!-- See It Work -->
	<section class="cta-section">
		<h2>See Privacy in Action</h2>
		<p>Watch how different stakeholders see different views of the same context.</p>
		<div class="cta-buttons">
			<a href="/demos/campion" class="btn btn-primary">
				<i class="fa-solid fa-eye" aria-hidden="true"></i>
				View Dual Audit Trail
			</a>
			<a href="/playground" class="btn btn-secondary">
				<i class="fa-solid fa-sliders" aria-hidden="true"></i>
				Build Your Own Token
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

	/* Principle cards */
	.principle-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: var(--space-lg);
	}

	.principle-card {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.principle-icon {
		font-size: 1.5rem;
		color: var(--color-primary);
		margin-bottom: var(--space-md);
	}

	.principle-card h3 {
		font-size: var(--text-lg);
		margin-bottom: var(--space-sm);
	}

	.principle-card p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
	}

	.principle-card code {
		font-size: var(--text-xs);
		padding: 1px 4px;
		background: var(--color-bg);
		border-radius: var(--radius-sm);
	}

	/* Privacy levels */
	.privacy-levels {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.privacy-level {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		border-left: 4px solid;
	}

	.level-public { border-left-color: var(--color-success); }
	.level-consent { border-left-color: var(--color-warning); }
	.level-private { border-left-color: var(--color-danger); }

	.level-header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-sm);
	}

	.level-badge {
		font-size: var(--text-xs);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		font-weight: 500;
	}

	.level-badge.public { background: var(--color-success-muted); color: var(--color-success); }
	.level-badge.consent { background: var(--color-warning-muted); color: var(--color-warning); }
	.level-badge.private { background: var(--color-danger-muted); color: var(--color-danger); }

	.level-name {
		font-weight: 500;
	}

	.privacy-level p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		margin-bottom: var(--space-md);
		line-height: var(--leading-relaxed);
	}

	.level-example {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.level-example code {
		font-size: var(--text-xs);
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-bg);
		border-radius: var(--radius-sm);
	}

	/* Flag diagram */
	.flag-diagram {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: var(--space-lg);
		align-items: center;
		margin-bottom: var(--space-lg);
	}

	.flag-step {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.flag-step h4 {
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.private-context {
		font-size: var(--text-sm);
	}

	.context-label {
		color: var(--color-danger);
		font-weight: 500;
		display: block;
		margin-bottom: var(--space-sm);
	}

	.private-context ul {
		padding-left: var(--space-lg);
		color: var(--color-text-muted);
	}

	.private-context li {
		margin-bottom: var(--space-xs);
	}

	.flag-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		color: var(--color-primary);
	}

	.flag-arrow span {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.public-flag code {
		display: block;
		font-size: var(--text-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--color-success-muted);
		border-radius: var(--radius-sm);
		color: var(--color-success);
		margin-bottom: var(--space-sm);
	}

	.flag-note {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.flag-result {
		text-align: center;
		color: var(--color-text-muted);
		font-style: italic;
	}

	/* Trust diagram */
	.trust-diagram {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		margin-bottom: var(--space-lg);
	}

	.trust-ring {
		width: 100%;
		max-width: 400px;
		padding: var(--space-md);
		text-align: center;
		border-radius: var(--radius-lg);
		margin-top: -var(--space-sm);
	}

	.trust-you {
		background: var(--color-success-muted);
		border: 2px solid var(--color-success);
		z-index: 3;
		max-width: 280px;
	}

	.trust-vcp {
		background: var(--color-primary-muted);
		border: 2px solid var(--color-primary);
		z-index: 2;
		max-width: 340px;
		padding-top: var(--space-lg);
	}

	.trust-platform {
		background: var(--color-bg-card);
		border: 2px solid rgba(255, 255, 255, 0.2);
		z-index: 1;
		padding-top: var(--space-lg);
	}

	.trust-label {
		font-weight: 600;
		display: block;
	}

	.trust-desc {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.trust-examples {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-lg);
	}

	.trust-example {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
	}

	.trust-example h4 {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		margin-bottom: var(--space-md);
	}

	.trust-example ul {
		padding-left: var(--space-lg);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.trust-example li {
		margin-bottom: var(--space-xs);
	}

	/* Tech details */
	.tech-details {
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

	/* Flow diagram */
	.flow-diagram {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 0;
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-xl);
		border: 1px solid rgba(255, 255, 255, 0.1);
		position: relative;
	}

	.flow-column {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.flow-column-center {
		grid-column: 2;
	}

	.flow-entity {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-md);
		background: var(--color-bg);
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.15);
		font-size: var(--text-sm);
		font-weight: 600;
		min-width: 100px;
		text-align: center;
	}

	.flow-entity i {
		font-size: 1.25rem;
		color: var(--color-primary);
	}

	.flow-step {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		padding: var(--space-sm) 0;
		position: relative;
	}

	.flow-step-left {
		justify-content: flex-start;
		padding-left: 25%;
	}

	.flow-step-right {
		justify-content: flex-end;
		padding-right: 15%;
	}

	.flow-step-verify {
		justify-content: center;
	}

	.flow-step-apply {
		justify-content: flex-end;
		padding-right: 8%;
	}

	.flow-label {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--color-text);
	}

	.flow-label-sub {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		padding-left: var(--space-lg);
	}

	.flow-label-apply {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--color-success);
		font-weight: 500;
	}

	.flow-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--color-primary);
		color: #fff;
		font-size: var(--text-xs);
		font-weight: 700;
		flex-shrink: 0;
	}

	.flow-verify-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		background: var(--color-bg);
		border-radius: var(--radius-md);
		padding: var(--space-md) var(--space-lg);
		border: 1px dashed var(--color-primary);
	}

	.flow-verify-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.flow-line {
		display: none;
	}

	/* Threat grid */
	.threat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-md);
	}

	.threat-card {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.threat-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
	}

	.threat-header i {
		color: var(--color-danger);
		font-size: 1rem;
	}

	.threat-header h4 {
		font-size: var(--text-sm);
		font-weight: 600;
	}

	.threat-attack {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-md);
	}

	.threat-defense {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: var(--leading-relaxed);
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.threat-defense code {
		font-size: var(--text-xs);
		padding: 1px 4px;
		background: var(--color-bg);
		border-radius: var(--radius-sm);
	}

	.defense-badge {
		font-size: var(--text-xs);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		background: var(--color-success-muted);
		color: var(--color-success);
		font-weight: 500;
		flex-shrink: 0;
	}

	@media (max-width: 768px) {
		.flag-diagram {
			grid-template-columns: 1fr;
		}

		.flag-arrow {
			flex-direction: row;
			transform: rotate(90deg);
			margin: var(--space-md) 0;
		}

		.trust-examples {
			grid-template-columns: 1fr;
		}

		.flow-diagram {
			grid-template-columns: 1fr;
			padding: var(--space-md);
		}

		.flow-column {
			display: none;
		}

		.flow-column-center {
			display: flex;
		}

		.flow-step-left,
		.flow-step-right,
		.flow-step-apply {
			padding-left: 0;
			padding-right: 0;
			justify-content: flex-start;
		}

		.threat-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
