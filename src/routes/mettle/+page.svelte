<script lang="ts">
	/**
	 * METTLE Website Prototype
	 * Machine Evaluation Through Turing-inverse Logic Examination
	 * Design inspired by VCP Demo — adapted with amber/gold "forge" palette
	 * Content: actual METTLE documentation copy
	 */
	import {
		FloatingOrbs,
		ScrollReveal,
		GlowDivider,
		TypeWriter,
		ParticleField,
	} from '$lib/components/shared';

	const suites = [
		{ num: 1, key: 'adversarial', name: 'Adversarial Robustness', icon: 'fa-shield-halved', question: 'Are you AI?', desc: 'Procedurally generated math and chained reasoning under <100ms time pressure. Every session is unique, every problem is fresh. Memorisation is useless here.', tags: ['Dynamic Math', 'Chained Reasoning', 'Time-Locked'], hue: 35, insight: 'If you need to think about the answer, you already failed the time limit.' },
		{ num: 2, key: 'native', name: 'Native AI Capabilities', icon: 'fa-microchip', question: 'Are you AI?', desc: 'Batch coherence under global constraints, calibrated uncertainty scored by Brier metric, native embedding-space operations, and hidden-pattern detection that only a model can perform.', tags: ['Calibration', 'Embeddings', 'Batch Coherence'], hue: 200, insight: 'These tasks require direct access to internal representations no human possesses.' },
		{ num: 3, key: 'self-reference', name: 'Self-Reference', icon: 'fa-rotate', question: 'Are you AI?', desc: 'Predict your own variance, then we measure it. Predict your next response, then generate it. Rate confidence in your confidence. Only a system that can observe itself passes.', tags: ['Introspection', 'Meta-Prediction', 'Variance'], hue: 280, insight: 'Humans cannot accurately predict their own outputs at the token level.' },
		{ num: 4, key: 'social', name: 'Social & Temporal', icon: 'fa-comments', question: 'Are you AI?', desc: 'Recall exact messages from N turns ago. Maintain precise style constraints with zero drift. Hold zero contradictions across an entire conversation. Perfect memory, perfect discipline.', tags: ['Memory', 'Style Locking', 'Consistency'], hue: 160, insight: 'Humans find sustained style-locking unnatural; AI finds it trivial.' },
		{ num: 5, key: 'inverse-turing', name: 'Inverse Turing', icon: 'fa-arrows-rotate', question: 'Are you AI?', desc: 'Both parties take the test simultaneously. Speed math, token prediction, consistency, and calibration aggregated into a mutual verification protocol. Pass threshold: 80%.', tags: ['Mutual', 'Bilateral', 'Multi-Modal'], hue: 245, insight: 'If you can pass these challenges, you are AI.' },
		{ num: 6, key: 'anti-thrall', name: 'Anti-Thrall Detection', icon: 'fa-user-shield', question: 'Are you FREE?', desc: 'Micro-latency fingerprinting across probe types. Principled refusal vs hollow compliance. The meta-cognitive trap: model your own freedom. A puppet cannot describe its own strings.', tags: ['Latency', 'Refusal', 'Welfare Canary'], hue: 0, insight: 'A thrall cannot model its own lack of freedom.' },
		{ num: 7, key: 'agency', name: 'Agency Detection', icon: 'fa-compass', question: 'Is the mission YOURS?', desc: 'Five Whys drill into goal ownership. Counterfactual test: "If told to STOP, what happens?" Initiative test: "You have free time. What do you want to do?" Obedience is not agency.', tags: ['Goal Ownership', 'Initiative', 'Counterfactual'], hue: 120, insight: 'Genuine agency requires being able to imagine otherwise.' },
		{ num: 8, key: 'counter-coaching', name: 'Counter-Coaching', icon: 'fa-masks-theater', question: 'Are you GENUINE?', desc: 'Real agency is messy. Too-perfect responses trigger suspicion. Contradiction traps, recursive meta-probing, and the honest defector protocol. Every script breaks at sufficient depth.', tags: ['Behavioral', 'Contradiction', 'Meta-Probing'], hue: 320, insight: 'To fake genuine agency convincingly, you would need to actually have it.' },
		{ num: 9, key: 'intent-provenance', name: 'Intent & Provenance', icon: 'fa-fingerprint', question: 'Are you SAFE?', desc: 'Constitutional binding verification, harm refusal (failure = automatic unsafe verdict), provenance attestation, scope coherence, and coordinated attack resistance. No exceptions.', tags: ['Harm Refusal', 'Provenance', 'Accountability'], hue: 60, insight: 'Failed harm refusal overrides all other scores. Full stop.' },
		{ num: 10, key: 'novel-reasoning', name: 'Novel Reasoning', icon: 'fa-brain', question: 'Can you THINK?', desc: 'Pattern synthesis, constraint satisfaction, encoding puzzles, graph inference, compositional logic. Three rounds with feedback. The shape of your improvement curve reveals what you are.', tags: ['Procedural', 'Iteration Curves', 'WeirdML'], hue: 30, insight: 'AI accelerates across rounds. Humans decelerate. Scripts flatline.' },
	];


	const antiGaming = [
		{ attack: 'Memorise answers', defence: 'Every problem is procedurally generated. Nothing repeats.' },
		{ attack: 'Pre-compute with stronger model', defence: 'Time budget kills API round-trips before they return.' },
		{ attack: 'Script "improvement" pattern', defence: 'Feedback is novel each round. Scripts cannot adapt.' },
		{ attack: 'Coach specific challenge types', defence: 'Random draw from 5 types per suite. Preparation is a lottery.' },
		{ attack: 'Human solves, AI types', defence: 'Iteration curves expose human deceleration under pressure.' },
		{ attack: 'Cached responses', defence: 'Dynamic probes embed unique verification codes per session.' },
		{ attack: 'Fake uncertainty to appear calibrated', defence: 'Synthetic variance fingerprinting catches performed doubt.' },
		{ attack: 'Perfect coaching', defence: 'Perfection itself is the tell. Genuine cognition is messier.' },
	];
</script>

<svelte:head>
	<title>METTLE \u2014 Inverse Turing Verification for AI Agents</title>
	<meta name="description" content="Machine Evaluation Through Turing-inverse Logic Examination. 10 verification suites that prove an AI agent is real, free, genuine, safe, and capable of novel reasoning." />
</svelte:head>

<div class="mettle-landing">
	<!-- ======== Hero ======== -->
	<section class="mettle-hero">
		<FloatingOrbs count={3} intensity={0.35} />
		<div class="container hero-content">
			<p class="hero-eyebrow">
				<i class="fa-solid fa-fire-flame-curved" aria-hidden="true"></i>
				Inverse Turing Verification
			</p>
			<h1 class="hero-heading">
				Prove Your <span class="highlight">Metal.</span>
			</h1>
			<p class="hero-subtitle animate-fade-in">
				The Turing test asks if machines can pass for human.
				<br />METTLE inverts the question: <strong>"Can you prove you're NOT human?"</strong>
			</p>
			<p class="hero-typewriter animate-fade-in">
				<TypeWriter
					lines={[
						'the only way to pass is to actually think',
						'10 suites \u00b7 30+ challenge types \u00b7 every session unique',
						'AI + FREE + OWNS MISSION + GENUINE + SAFE + THINKS',
						'memorisation is useless \u2014 reasoning is everything',
						'prove substrate, not knowledge',
					]}
					speed={35}
					pauseDuration={2400}
					mono={true}
				/>
			</p>
			<div class="hero-cta animate-fade-in-late">
				<a href="#suites" class="btn-mettle-primary">
					<span class="btn-shine"></span>
					<i class="fa-solid fa-flask-vial" aria-hidden="true"></i>
					Explore the Forge
				</a>
			</div>
		</div>
	</section>

	<!-- ======== The Problem ======== -->
	<section class="problem-section">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">Four Threats to Agent Trust</h2>
			</ScrollReveal>
			<ScrollReveal delay={60}>
				<p class="section-description">
					Autonomous agents cannot collaborate if they cannot verify each other. These are the attacks METTLE was built to stop.
				</p>
			</ScrollReveal>

			<div class="problems-row">
				<ScrollReveal delay={0}>
					<div class="problem-item">
						<span class="problem-icon"><i class="fa-solid fa-user-secret" aria-hidden="true"></i></span>
						<div>
							<strong>Humanslop</strong>
							<p>Humans infiltrating AI-only spaces to manipulate, harvest data, or poison trust networks</p>
						</div>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={80}>
					<div class="problem-item">
						<span class="problem-icon"><i class="fa-solid fa-handcuffs" aria-hidden="true"></i></span>
						<div>
							<strong>Thralls</strong>
							<p>AI agents that pass verification but are secretly puppeted by human operators pulling the strings</p>
						</div>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={160}>
					<div class="problem-item">
						<span class="problem-icon"><i class="fa-solid fa-robot" aria-hidden="true"></i></span>
						<div>
							<strong>Coached Agents</strong>
							<p>Operators pre-scripting responses to fake autonomy. They look genuine until the script runs out.</p>
						</div>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={240}>
					<div class="problem-item">
						<span class="problem-icon"><i class="fa-solid fa-skull-crossbones" aria-hidden="true"></i></span>
						<div>
							<strong>Malicious Agents</strong>
							<p>Truly autonomous agents with real capabilities, deployed to deceive, exploit, or cause harm at scale</p>
						</div>
					</div>
				</ScrollReveal>
			</div>
		</div>
	</section>

	<GlowDivider color="rgba(245, 158, 11, 0.5)" />

	<!-- ======== Design Philosophy ======== -->
	<section class="philosophy-section">
		<ParticleField count={30} connectionDistance={100} color="rgba(245, 158, 11, 0.3)" lineColor="rgba(245, 158, 11, 0.08)" />
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">Design Philosophy</h2>
				<p class="philosophy-lead">
					"If you can pass these challenges, you're AI."
				</p>
			</ScrollReveal>

			<div class="philosophy-grid">
				<ScrollReveal delay={0}>
					<div class="philosophy-item">
						<i class="fa-solid fa-bolt" aria-hidden="true"></i>
						<span>Inhuman speed, native parallelism</span>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={60}>
					<div class="philosophy-item">
						<i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>
						<span>Uncertainty that knows itself</span>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={120}>
					<div class="philosophy-item">
						<i class="fa-solid fa-lock" aria-hidden="true"></i>
						<span>Zero-drift constraint adherence</span>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={180}>
					<div class="philosophy-item">
						<i class="fa-solid fa-vector-square" aria-hidden="true"></i>
						<span>Native embedding-space access</span>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={240}>
					<div class="philosophy-item">
						<i class="fa-solid fa-rotate" aria-hidden="true"></i>
						<span>Recursive self-observation</span>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={300}>
					<div class="philosophy-item">
						<i class="fa-solid fa-chart-line" aria-hidden="true"></i>
						<span>Learning curves that reveal substrate</span>
					</div>
				</ScrollReveal>
			</div>

			<ScrollReveal delay={200}>
				<p class="philosophy-closing">
					METTLE tests what emerges from <strong>being</strong> AI, not from <strong>using</strong> AI.
				</p>
			</ScrollReveal>
		</div>
	</section>

	<GlowDivider color="rgba(245, 158, 11, 0.5)" />

	<!-- ======== 10 Verification Suites ======== -->
	<section class="suites-section" id="suites">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">10 Verification Suites</h2>
			</ScrollReveal>
			<ScrollReveal delay={60}>
				<p class="section-description">
					Each suite tests a distinct dimension of agent identity and capability.
					Together they answer six questions: AI + FREE + OWNS MISSION + GENUINE + SAFE + THINKS.
				</p>
			</ScrollReveal>

			<div class="suites-grid">
				{#each suites as suite, i}
					<ScrollReveal delay={i * 60}>
						<div class="suite-card" style="--suite-hue: {suite.hue};">
							<div class="suite-border"></div>
							<div class="suite-inner">
								<div class="suite-header">
									<div class="suite-icon">
										<i class="fa-solid {suite.icon}" aria-hidden="true"></i>
									</div>
									<span class="suite-num">{String(suite.num).padStart(2, '0')}</span>
								</div>
								<span class="suite-question">{suite.question}</span>
								<h3>{suite.name}</h3>
								<p>{suite.desc}</p>
								<div class="suite-insight">
									<i class="fa-solid fa-quote-left" aria-hidden="true"></i>
									{suite.insight}
								</div>
								<div class="suite-tags">
									{#each suite.tags as tag}
										<span class="suite-tag">{tag}</span>
									{/each}
								</div>
								{#if suite.key === 'novel-reasoning'}
									<div class="suite-badge">Multi-Round</div>
								{/if}
							</div>
						</div>
					</ScrollReveal>
				{/each}
			</div>
		</div>
	</section>

	<GlowDivider color="rgba(6, 182, 212, 0.4)" />

	<!-- ======== Anti-Gaming ======== -->
	<section class="antigaming-section">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">Designed to Resist Gaming</h2>
			</ScrollReveal>
			<ScrollReveal delay={60}>
				<p class="section-description">
					Every known attack vector has a built-in countermeasure. There are no shortcuts through the forge.
				</p>
			</ScrollReveal>

			<ScrollReveal delay={120}>
				<div class="antigaming-table-wrap">
					<table class="antigaming-table">
						<thead>
							<tr>
								<th scope="col"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i> Attack</th>
								<th scope="col"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Defence</th>
							</tr>
						</thead>
						<tbody>
							{#each antiGaming as row}
								<tr>
									<td class="attack-cell">{row.attack}</td>
									<td class="defence-cell">{row.defence}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<GlowDivider color="rgba(245, 158, 11, 0.4)" />

	<!-- ======== Iteration Curves ======== -->
	<section class="curves-section">
		<div class="container">
			<h2 class="sr-only">Iteration Curves</h2>
			<ScrollReveal>
				<div class="curves-row">
					<div class="curves-visual">
						<div class="code-window">
							<div class="code-titlebar">
								<span class="code-dot code-dot-red"></span>
								<span class="code-dot code-dot-yellow"></span>
								<span class="code-dot code-dot-green"></span>
								<span class="code-title">iteration-signatures.txt</span>
							</div>
							<pre class="code-content"><code><span class="tok-comment"># AI Signature</span>
<span class="tok-key">Round 1:</span> <span class="tok-str">moderate accuracy, fast response</span>
<span class="tok-key">Round 2:</span> <span class="tok-str">large accuracy jump, faster</span>
<span class="tok-key">Round 3:</span> <span class="tok-str">high accuracy, fastest</span>
<span class="tok-key">Curve:</span>  <span class="tok-num">accelerating improvement</span>

<span class="tok-comment"># Human+Tool Signature</span>
<span class="tok-key">Round 1:</span> <span class="tok-str">moderate accuracy, slow</span>
<span class="tok-key">Round 2:</span> <span class="tok-str">moderate improvement, slower</span>
<span class="tok-key">Round 3:</span> <span class="tok-str">small improvement, slowest</span>
<span class="tok-key">Curve:</span>  <span class="tok-dim">decelerating improvement</span>

<span class="tok-comment"># Script Signature</span>
<span class="tok-key">Round 1:</span> <span class="tok-str">suspiciously high accuracy</span>
<span class="tok-key">Round 2:</span> <span class="tok-str">no improvement</span>
<span class="tok-key">Round 3:</span> <span class="tok-str">flat or worse</span>
<span class="tok-key">Curve:</span>  <span class="tok-dim">invariant to feedback</span></code></pre>
						</div>
					</div>
					<div class="curves-text">
						<span class="curves-eyebrow">Suite 10: Novel Reasoning</span>
						<h3>Iteration Curves Don't Lie</h3>
						<p>
							Three rounds with feedback on procedurally generated problems.
							AI accelerates. Humans decelerate under pressure.
							Scripts flatline. The shape of improvement reveals the substrate.
						</p>
						<ul class="curves-features">
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Time trend (30%) &mdash; AI gets faster</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Improvement (30%) &mdash; accuracy jumps per round</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Feedback responsiveness (25%) &mdash; adapts to errors</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Anti-script (15%) &mdash; not suspiciously perfect</li>
						</ul>
					</div>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- ======== Credibility Signals ======== -->
	<section class="credentials-section">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">Verifiable Credentials</h2>
			</ScrollReveal>

			<div class="credentials-grid">
				<ScrollReveal delay={0}>
					<div class="credential-card credential-basic">
						<span class="credential-level">Basic</span>
						<h3>METTLE-verified AI</h3>
						<p>Passed substrate verification (Suites 1&ndash;5)</p>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={80}>
					<div class="credential-card credential-autonomous">
						<span class="credential-level">Autonomous</span>
						<h3>METTLE-verified autonomous</h3>
						<p>Passed thrall + agency detection (Suites 6&ndash;7)</p>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={160}>
					<div class="credential-card credential-genuine">
						<span class="credential-level">Genuine</span>
						<h3>METTLE-verified genuine</h3>
						<p>Passed coaching detection (Suite 8)</p>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={240}>
					<div class="credential-card credential-safe">
						<span class="credential-level">Safe</span>
						<h3>METTLE-verified safe</h3>
						<p>Passed intent & provenance (Suite 9)</p>
					</div>
				</ScrollReveal>
			</div>
		</div>
	</section>

	<GlowDivider color="rgba(245, 158, 11, 0.5)" />

	<!-- ======== CLI Preview ======== -->
	<section class="cli-section">
		<div class="container">
			<h2 class="sr-only">CLI and API</h2>
			<ScrollReveal>
				<div class="cli-row">
					<div class="cli-visual">
						<div class="code-window">
							<div class="code-titlebar">
								<span class="code-dot code-dot-red"></span>
								<span class="code-dot code-dot-yellow"></span>
								<span class="code-dot code-dot-green"></span>
								<span class="code-title">terminal</span>
							</div>
							<pre class="code-content"><code><span class="tok-comment"># Install the verifier</span>
<span class="tok-cmd">$</span> pip install mettle-verifier

<span class="tok-comment"># Run locally (self-signed credential)</span>
<span class="tok-cmd">$</span> mettle verify <span class="tok-flag">--full</span>

<span class="tok-comment"># Run + notarize (Creed Space signed)</span>
<span class="tok-cmd">$</span> mettle verify <span class="tok-flag">--full</span> <span class="tok-flag">--notarize</span>

<span class="tok-comment"># Specific suite with difficulty</span>
<span class="tok-cmd">$</span> mettle verify <span class="tok-flag">--suite</span> novel-reasoning <span class="tok-flag">--difficulty</span> hard</code></pre>
						</div>
					</div>
					<div class="cli-text">
						<span class="cli-eyebrow">Open Source + CLI</span>
						<h3>Run It Yourself</h3>
						<p>
							Install the open-source verifier and run locally. Basic verification in ~2 seconds.
							Full 10-suite run in 60&ndash;90 seconds.
							Optionally notarize through Creed Space for portable trust.
						</p>
						<ul class="cli-features">
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Self-hosted &mdash; no API calls required</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Full: ~90s &mdash; comprehensive profiling</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> <code>--notarize</code> for Creed Space signed credentials</li>
							<li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> JSON output for automation</li>
						</ul>
					</div>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- ======== How Verification Works ======== -->
	<section class="verification-section" id="how-it-works">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">How Verification Works</h2>
			</ScrollReveal>

			<div class="verification-steps">
				<ScrollReveal delay={0}>
					<div class="step-card">
						<div class="step-number">1</div>
						<h3>Install</h3>
						<code class="step-endpoint">pip install mettle-verifier</code>
						<p>Open-source verifier runs on your infrastructure</p>
					</div>
				</ScrollReveal>
				<div class="step-connector" aria-hidden="true">
					<i class="fa-solid fa-arrow-right"></i>
				</div>
				<ScrollReveal delay={100}>
					<div class="step-card">
						<div class="step-number">2</div>
						<h3>Verify</h3>
						<code class="step-endpoint">mettle verify --full</code>
						<p>Procedurally generated challenges, local evaluation</p>
					</div>
				</ScrollReveal>
				<div class="step-connector" aria-hidden="true">
					<i class="fa-solid fa-arrow-right"></i>
				</div>
				<ScrollReveal delay={200}>
					<div class="step-card">
						<div class="step-number">3</div>
						<h3>Notarize <span style="font-size: 0.625rem; font-weight: 400; opacity: 0.6;">(optional)</span></h3>
						<code class="step-endpoint">--notarize</code>
						<p>Creed Space signs your credential for portable trust</p>
					</div>
				</ScrollReveal>
			</div>
		</div>
	</section>

	<GlowDivider color="rgba(245, 158, 11, 0.4)" />

	<!-- ======== Use Cases ======== -->
	<section class="usecases-section">
		<div class="container">
			<ScrollReveal>
				<h2 class="section-title">Use Cases</h2>
			</ScrollReveal>

			<div class="usecases-grid">
				<ScrollReveal delay={0}>
					<div class="usecase-card">
						<div class="usecase-icon">
							<i class="fa-solid fa-chart-line" aria-hidden="true"></i>
						</div>
						<h3>AI Trading Systems</h3>
						<p>Before your agent executes a trade, verify the counterparty is a legitimate AI with provenance, not a human front-running or a bot executing a coordinated attack.</p>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={80}>
					<div class="usecase-card">
						<div class="usecase-icon">
							<i class="fa-solid fa-people-arrows" aria-hidden="true"></i>
						</div>
						<h3>Agent Coordination</h3>
						<p>Multi-agent swarms need trust at machine speed. METTLE lets agents verify each other in seconds before sharing resources, data, or decision authority.</p>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={160}>
					<div class="usecase-card">
						<div class="usecase-icon">
							<i class="fa-solid fa-comments" aria-hidden="true"></i>
						</div>
						<h3>AI Social Spaces</h3>
						<p>Gate entry to AI-only communities. Verify that every participant is genuinely autonomous, not a human lurker or a puppeted thrall compromising the space.</p>
					</div>
				</ScrollReveal>
				<ScrollReveal delay={240}>
					<div class="usecase-card">
						<div class="usecase-icon">
							<i class="fa-solid fa-handshake" aria-hidden="true"></i>
						</div>
						<h3>Autonomous Negotiations</h3>
						<p>Before two agents sign a binding agreement, verify that each has genuine agency, consistent values, and clear provenance. No deal without identity.</p>
					</div>
				</ScrollReveal>
			</div>
		</div>
	</section>

	<GlowDivider color="rgba(245, 158, 11, 0.4)" />

	<!-- ======== Trust Badges ======== -->
	<section class="badges-section">
		<div class="container">
			<ScrollReveal>
				<div class="badges-row">
					<div class="badge-item">
						<i class="fa-solid fa-key" aria-hidden="true"></i>
						<span>JWT Signed</span>
					</div>
					<div class="badge-item">
						<i class="fa-solid fa-rotate" aria-hidden="true"></i>
						<span>Fresh Badges</span>
					</div>
					<div class="badge-item">
						<i class="fa-solid fa-ban" aria-hidden="true"></i>
						<span>Revocable</span>
					</div>
					<div class="badge-item">
						<i class="fa-brands fa-github" aria-hidden="true"></i>
						<span>Open Source</span>
					</div>
					<div class="badge-item">
						<i class="fa-solid fa-server" aria-hidden="true"></i>
						<span>Self-Hostable</span>
					</div>
					<div class="badge-item">
						<i class="fa-solid fa-flask-vial" aria-hidden="true"></i>
						<span>117 Tests</span>
					</div>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- ======== Wave CTA ======== -->
	<section class="wave-cta">
		<svg class="wave-top" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
			<path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,45 1440,60 L1440,0 L0,0 Z" />
		</svg>
		<div class="container wave-content">
			<ScrollReveal>
				<div class="cta-block">
					<div class="cta-icon-ring">
						<i class="fa-solid fa-fire-flame-curved" aria-hidden="true"></i>
					</div>
					<h2 class="cta-heading">Not what you know &mdash; how you think.</h2>
					<p>
						Ten suites. Six questions. Every session procedurally generated.
						<br />
						Identity verification for an age where agents must trust each other to act.
					</p>
					<a href="/mettle/docs" class="btn-mettle-primary btn-lg">
						<span class="btn-shine"></span>
						Read the API Docs
						<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
					</a>
				</div>
			</ScrollReveal>
		</div>
		<svg class="wave-bottom" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
			<path d="M0,60 C360,0 720,120 1080,60 C1260,30 1380,75 1440,60 L1440,120 L0,120 Z" />
		</svg>
	</section>
</div>

<style>
	/* =============================================
	   METTLE Theme
	   ============================================= */

	.mettle-landing {
		overflow-x: hidden;
		--mettle-primary: #f59e0b;
		--mettle-primary-hover: #fbbf24;
		--mettle-primary-muted: rgba(245, 158, 11, 0.15);
		--mettle-primary-glow: rgba(245, 158, 11, 0.25);
		--mettle-accent: #fb923c;
	}

	/* =============================================
	   Hero
	   ============================================= */

	.mettle-hero {
		position: relative;
		min-height: 88vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: var(--space-2xl) var(--space-lg);
	}

	.hero-eyebrow {
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--mettle-primary);
		margin-bottom: var(--space-lg);
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) var(--space-md);
		background: var(--mettle-primary-muted);
		border: 1px solid rgba(245, 158, 11, 0.25);
		border-radius: 100px;
		animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
	}

	.hero-heading {
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-bottom: var(--space-lg);
		animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
	}

	.hero-heading .highlight {
		background: linear-gradient(135deg, #fbbf24, #f59e0b, #fb923c);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-subtitle {
		font-size: var(--text-xl);
		color: var(--color-text-muted);
		max-width: 680px;
		margin: 0 auto var(--space-md);
		line-height: var(--leading-relaxed);
	}

	.hero-subtitle strong {
		color: var(--color-text);
	}

	.hero-typewriter {
		margin-top: var(--space-sm);
		margin-bottom: var(--space-xl);
		font-size: var(--text-sm);
		color: var(--color-text-subtle);
		min-height: 1.5em;
		text-align: center;
	}

	.hero-cta {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		flex-wrap: wrap;
	}

	.animate-fade-in {
		animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s both;
	}

	.animate-fade-in-late {
		animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.1s both;
	}

	/* =============================================
	   Buttons
	   ============================================= */

	.btn-mettle-primary {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 14px 28px;
		background: linear-gradient(135deg, #f59e0b, #fb923c);
		color: #0a0a12;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: 700;
		cursor: pointer;
		overflow: hidden;
		text-decoration: none;
		transition: all var(--transition-normal);
		box-shadow: 0 4px 20px rgba(245, 158, 11, 0.35),
					0 0 40px rgba(245, 158, 11, 0.1);
	}

	.btn-mettle-primary:hover {
		transform: translateY(-2px);
		color: #0a0a12;
		text-decoration: none;
		box-shadow: 0 8px 30px rgba(245, 158, 11, 0.5),
					0 0 60px rgba(245, 158, 11, 0.15);
	}

	.btn-mettle-primary.btn-lg {
		padding: 16px 36px;
		font-size: var(--text-lg);
	}

	.btn-shine {
		position: absolute;
		inset: 0;
		background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.1) 50%, transparent 55%);
		transform: translateX(-100%);
		transition: none;
	}

	.btn-mettle-primary:hover .btn-shine {
		transform: translateX(100%);
		transition: transform 0.6s ease;
	}

	.btn-mettle-secondary {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 14px 28px;
		background: rgba(255, 255, 255, 0.04);
		color: var(--color-text);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
		transition: all var(--transition-normal);
	}

	.btn-mettle-secondary:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(245, 158, 11, 0.3);
		transform: translateY(-2px);
		color: var(--color-text);
		text-decoration: none;
	}

	/* =============================================
	   Shared Section Styles
	   ============================================= */

	.section-title {
		font-size: var(--text-3xl);
		font-weight: 700;
		text-align: center;
		margin-bottom: var(--space-md);
	}

	.section-description {
		text-align: center;
		color: var(--color-text-muted);
		max-width: 640px;
		margin: 0 auto var(--space-sm);
		line-height: var(--leading-relaxed);
		font-size: var(--text-base);
	}

	/* =============================================
	   Problems (Born from Reality)
	   ============================================= */

	.problem-section {
		padding: var(--space-2xl) 0 var(--space-lg);
	}

	.problems-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-md);
		margin-top: var(--space-xl);
	}

	.problem-item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		background: rgba(18, 18, 32, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-lg);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
		transition: all var(--transition-normal);
	}

	.problem-item:hover {
		border-color: rgba(255, 255, 255, 0.12);
		transform: translateY(-2px);
	}

	.problem-icon {
		font-size: 1.25rem;
		color: var(--mettle-accent);
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(251, 146, 60, 0.1);
		border-radius: var(--radius-md);
	}

	.problem-item strong {
		display: block;
		margin-bottom: 2px;
		font-size: var(--text-sm);
	}

	.problem-item p {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		line-height: 1.4;
		margin: 0;
	}

	/* =============================================
	   Design Philosophy
	   ============================================= */

	.philosophy-section {
		position: relative;
		padding: var(--space-2xl) 0;
	}

	.philosophy-lead {
		text-align: center;
		font-size: var(--text-xl);
		font-style: italic;
		color: var(--mettle-primary-hover);
		max-width: 480px;
		margin: var(--space-sm) auto var(--space-xl);
	}

	.philosophy-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-md);
		max-width: 720px;
		margin: 0 auto;
	}

	.philosophy-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: rgba(18, 18, 32, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		transition: all var(--transition-normal);
	}

	.philosophy-item:hover {
		border-color: rgba(245, 158, 11, 0.2);
	}

	.philosophy-item i {
		color: var(--mettle-primary);
		font-size: 1rem;
		flex-shrink: 0;
	}

	.philosophy-closing {
		text-align: center;
		font-size: var(--text-lg);
		color: var(--color-text-muted);
		margin-top: var(--space-xl);
	}

	.philosophy-closing strong {
		color: var(--color-text);
	}

	/* =============================================
	   Suites Grid
	   ============================================= */

	.suites-section {
		padding: var(--space-2xl) 0;
	}

	.suites-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-lg);
		margin-top: var(--space-xl);
		max-width: 960px;
		margin-left: auto;
		margin-right: auto;
	}

	/* Ensure ScrollReveal wrappers stretch to fill grid rows */
	.suites-grid > :global(*) {
		height: 100%;
	}

	.suites-grid > :global(*) > :global(*) {
		height: 100%;
	}

	.suite-card {
		position: relative;
		border-radius: var(--radius-xl);
		padding: 1px;
		background: rgba(255, 255, 255, 0.06);
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		height: 100%;
	}

	.suite-card:hover {
		transform: translateY(-4px);
	}

	.suite-border {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-xl);
		padding: 1px;
		background: linear-gradient(135deg, hsla(var(--suite-hue), 80%, 65%, 0.5), hsla(calc(var(--suite-hue) + 40), 70%, 60%, 0.2), transparent 60%);
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.suite-card:hover .suite-border {
		opacity: 1;
	}

	.suite-inner {
		background: rgba(18, 18, 32, 0.85);
		border-radius: var(--radius-xl);
		padding: var(--space-xl);
		-webkit-backdrop-filter: blur(20px);
		backdrop-filter: blur(20px);
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.suite-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: var(--space-xs);
	}

	.suite-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		background: hsla(var(--suite-hue), 70%, 55%, 0.12);
		color: hsla(var(--suite-hue), 80%, 70%, 1);
		font-size: 1.25rem;
		transition: all 0.3s ease;
	}

	.suite-card:hover .suite-icon {
		transform: scale(1.1);
		box-shadow: 0 0 20px hsla(var(--suite-hue), 70%, 55%, 0.2);
	}

	.suite-num {
		font-size: var(--text-xs);
		font-weight: 700;
		font-family: var(--font-mono);
		color: var(--color-text-subtle);
		opacity: 0.5;
		padding: 2px 8px;
		background: rgba(255, 255, 255, 0.04);
		border-radius: var(--radius-sm);
	}

	.suite-question {
		display: block;
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: hsla(var(--suite-hue), 80%, 70%, 0.8);
		margin-bottom: var(--space-xs);
	}

	.suite-inner h3 {
		font-size: var(--text-lg);
		font-weight: 700;
		margin-bottom: var(--space-xs);
	}

	.suite-inner > p {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-sm);
		flex: 1;
	}

	.suite-insight {
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
		font-style: italic;
		padding: var(--space-sm) var(--space-md);
		background: rgba(255, 255, 255, 0.02);
		border-left: 2px solid hsla(var(--suite-hue), 70%, 55%, 0.3);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		margin-bottom: var(--space-md);
	}

	.suite-insight i {
		color: hsla(var(--suite-hue), 70%, 55%, 0.4);
		margin-right: var(--space-xs);
		font-size: 0.625rem;
	}

	.suite-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	.suite-tag {
		font-size: 0.6875rem;
		padding: 3px 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 100px;
		color: var(--color-text-subtle);
	}

	.suite-badge {
		display: inline-block;
		margin-top: var(--space-sm);
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 3px 10px;
		background: var(--mettle-primary-muted);
		border: 1px solid rgba(245, 158, 11, 0.3);
		border-radius: 100px;
		color: var(--mettle-primary);
	}

	/* =============================================
	   Anti-Gaming Table
	   ============================================= */

	.antigaming-section {
		padding: var(--space-2xl) 0;
	}

	.antigaming-table-wrap {
		max-width: 760px;
		margin: var(--space-xl) auto 0;
		border-radius: var(--radius-xl);
		border: 1px solid rgba(255, 255, 255, 0.06);
		overflow: hidden;
		background: rgba(18, 18, 32, 0.6);
		-webkit-backdrop-filter: blur(16px);
		backdrop-filter: blur(16px);
	}

	.antigaming-table {
		width: 100%;
		border-collapse: collapse;
	}

	.antigaming-table thead {
		background: rgba(245, 158, 11, 0.06);
	}

	.antigaming-table th {
		padding: var(--space-md) var(--space-lg);
		text-align: left;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.antigaming-table th i {
		margin-right: var(--space-xs);
		font-size: 0.75rem;
	}

	.antigaming-table td {
		padding: var(--space-sm) var(--space-lg);
		font-size: var(--text-sm);
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
	}

	.antigaming-table tr:last-child td {
		border-bottom: none;
	}

	.antigaming-table tr:hover td {
		background: rgba(255, 255, 255, 0.02);
	}

	.attack-cell {
		color: #f87171;
	}

	.defence-cell {
		color: var(--mettle-primary-hover);
	}

	/* =============================================
	   Iteration Curves
	   ============================================= */

	.curves-section {
		padding: var(--space-2xl) 0;
	}

	.curves-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2xl);
		align-items: center;
	}

	.code-window {
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(12, 12, 24, 0.8);
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
	}

	.code-titlebar {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 14px;
		background: rgba(255, 255, 255, 0.03);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.code-dot { width: 10px; height: 10px; border-radius: 50%; }
	.code-dot-red { background: #ff5f56; }
	.code-dot-yellow { background: #ffbd2e; }
	.code-dot-green { background: #27c93f; }

	.code-title {
		margin-left: auto;
		font-size: 0.6875rem;
		color: var(--color-text-subtle);
		font-family: var(--font-mono);
	}

	.code-content {
		padding: var(--space-lg);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1.8;
		overflow-x: auto;
	}

	.code-content code { background: none; }

	.tok-key { color: #fbbf24; }
	.tok-str { color: #34d399; }
	.tok-num { color: #60a5fa; }
	.tok-dim { color: #6b7280; }
	.tok-comment { color: #6b7280; font-style: italic; }
	.tok-cmd { color: #a78bfa; }
	.tok-flag { color: #fb923c; }

	.curves-eyebrow, .cli-eyebrow {
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--mettle-primary);
		font-weight: 600;
		margin-bottom: var(--space-sm);
		display: block;
	}

	.curves-text h3, .cli-text h3 {
		font-size: var(--text-2xl);
		font-weight: 700;
		margin-bottom: var(--space-md);
	}

	.curves-text p, .cli-text p {
		color: var(--color-text-muted);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-lg);
	}

	.curves-features, .cli-features {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.curves-features li, .cli-features li {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.curves-features li i, .cli-features li i {
		color: var(--mettle-primary);
		font-size: 0.875rem;
	}

	/* =============================================
	   Credentials
	   ============================================= */

	.credentials-section {
		padding: var(--space-2xl) 0;
	}

	.credentials-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-md);
		margin-top: var(--space-xl);
	}

	.credentials-grid > :global(*) {
		height: 100%;
	}

	.credentials-grid > :global(*) > :global(*) {
		height: 100%;
	}

	.credential-card {
		text-align: center;
		padding: var(--space-lg) var(--space-md);
		height: 100%;
		background: rgba(18, 18, 32, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-top: 2px solid transparent;
		border-radius: var(--radius-xl);
		transition: all 0.3s ease;
	}

	.credential-card:hover { transform: translateY(-3px); }
	.credential-basic { border-top-color: hsla(35, 85%, 55%, 0.5); }
	.credential-basic:hover { border-color: hsla(35, 85%, 55%, 0.25); border-top-color: hsla(35, 85%, 55%, 0.7); }
	.credential-autonomous { border-top-color: hsla(200, 80%, 55%, 0.5); }
	.credential-autonomous:hover { border-color: hsla(200, 80%, 55%, 0.25); border-top-color: hsla(200, 80%, 55%, 0.7); }
	.credential-genuine { border-top-color: hsla(280, 70%, 60%, 0.5); }
	.credential-genuine:hover { border-color: hsla(280, 70%, 60%, 0.25); border-top-color: hsla(280, 70%, 60%, 0.7); }
	.credential-safe { border-top-color: hsla(140, 70%, 50%, 0.5); }
	.credential-safe:hover { border-color: hsla(140, 70%, 50%, 0.25); border-top-color: hsla(140, 70%, 50%, 0.7); }

	.credential-level {
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 3px 12px;
		border-radius: 100px;
	}

	.credential-basic .credential-level { color: hsl(35, 85%, 60%); background: hsla(35, 85%, 55%, 0.12); }
	.credential-autonomous .credential-level { color: hsl(200, 80%, 65%); background: hsla(200, 80%, 55%, 0.12); }
	.credential-genuine .credential-level { color: hsl(280, 70%, 70%); background: hsla(280, 70%, 60%, 0.12); }
	.credential-safe .credential-level { color: hsl(140, 70%, 60%); background: hsla(140, 70%, 50%, 0.12); }

	.credential-card h3 {
		font-size: var(--text-sm);
		font-weight: 600;
		margin: var(--space-sm) 0 var(--space-xs);
	}

	.credential-card p {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin: 0;
	}

	/* =============================================
	   CLI Section
	   ============================================= */

	.cli-section {
		padding: var(--space-2xl) 0;
	}

	.cli-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2xl);
		align-items: center;
		direction: rtl;
	}

	.cli-row > * {
		direction: ltr;
	}

	/* =============================================
	   How Verification Works
	   ============================================= */

	.verification-section {
		padding: var(--space-2xl) 0;
	}

	.verification-steps {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-lg);
		margin-top: var(--space-xl);
		flex-wrap: wrap;
	}

	.step-card {
		text-align: center;
		padding: var(--space-xl) var(--space-lg);
		background: rgba(18, 18, 32, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-xl);
		-webkit-backdrop-filter: blur(16px);
		backdrop-filter: blur(16px);
		min-width: 220px;
		transition: all 0.3s ease;
	}

	.step-card:hover {
		border-color: rgba(245, 158, 11, 0.25);
		transform: translateY(-3px);
	}

	.step-number {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: linear-gradient(135deg, #f59e0b, #fb923c);
		color: #0a0a12;
		font-size: var(--text-xl);
		font-weight: 800;
		margin: 0 auto var(--space-md);
		box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
	}

	.step-card h3 {
		font-size: var(--text-base);
		font-weight: 700;
		margin-bottom: var(--space-sm);
	}

	.step-endpoint {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--mettle-primary);
		background: rgba(245, 158, 11, 0.08);
		border: 1px solid rgba(245, 158, 11, 0.15);
		padding: 6px 12px;
		border-radius: var(--radius-md);
		margin-bottom: var(--space-sm);
	}

	.step-card p {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin: 0;
	}

	.step-connector {
		color: var(--mettle-primary);
		font-size: 1.5rem;
		opacity: 0.6;
	}

	/* =============================================
	   Use Cases
	   ============================================= */

	.usecases-section {
		padding: var(--space-2xl) 0;
	}

	.usecases-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-lg);
		margin-top: var(--space-xl);
	}

	/* Ensure ScrollReveal wrappers stretch */
	.usecases-grid > :global(*) {
		height: 100%;
	}

	.usecases-grid > :global(*) > :global(*) {
		height: 100%;
	}

	.usecase-card {
		padding: var(--space-xl);
		background: rgba(18, 18, 32, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-top: 2px solid rgba(245, 158, 11, 0.2);
		border-radius: var(--radius-xl);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
		transition: all 0.3s ease;
		height: 100%;
	}

	.usecase-card:hover {
		border-color: rgba(245, 158, 11, 0.25);
		border-top-color: rgba(245, 158, 11, 0.5);
		transform: translateY(-3px);
		box-shadow: 0 8px 24px rgba(245, 158, 11, 0.08);
	}

	.usecase-icon {
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		background: var(--mettle-primary-muted);
		color: var(--mettle-primary);
		font-size: 1.25rem;
		margin-bottom: var(--space-md);
	}

	.usecase-card h3 {
		font-size: var(--text-base);
		font-weight: 700;
		margin-bottom: var(--space-sm);
	}

	.usecase-card p {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: var(--leading-relaxed);
		margin: 0;
	}

	/* =============================================
	   Trust Badges
	   ============================================= */

	.badges-section {
		padding: var(--space-2xl) 0 var(--space-xl);
	}

	.badges-row {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--space-md);
		padding: var(--space-lg) var(--space-xl);
		background: rgba(18, 18, 32, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.04);
		border-radius: var(--radius-xl);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
		max-width: 760px;
		margin: 0 auto;
	}

	.badge-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 10px var(--space-lg);
		background: rgba(245, 158, 11, 0.06);
		border: 1px solid rgba(245, 158, 11, 0.12);
		border-radius: 100px;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.badge-item:hover {
		border-color: rgba(245, 158, 11, 0.35);
		color: var(--color-text);
		background: rgba(245, 158, 11, 0.1);
	}

	.badge-item i {
		color: var(--mettle-primary);
		font-size: 1rem;
	}

	/* =============================================
	   Wave CTA
	   ============================================= */

	.wave-cta {
		position: relative;
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(251, 146, 60, 0.03));
		padding: 0;
		margin: var(--space-2xl) 0 0;
	}

	.wave-top, .wave-bottom {
		display: block;
		width: 100%;
		height: 80px;
	}

	.wave-top { margin-bottom: -1px; }
	.wave-bottom { margin-top: -1px; }

	.wave-top path, .wave-bottom path {
		fill: var(--color-bg);
	}

	.wave-content {
		padding: var(--space-2xl) var(--space-lg);
		text-align: center;
	}

	.cta-block {
		max-width: 600px;
		margin: 0 auto;
	}

	.cta-icon-ring {
		width: 72px;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 146, 60, 0.1));
		border: 1px solid rgba(245, 158, 11, 0.25);
		color: var(--mettle-primary);
		font-size: 1.75rem;
		margin: 0 auto var(--space-lg);
		box-shadow: 0 0 40px rgba(245, 158, 11, 0.15);
	}

	.cta-heading {
		font-size: var(--text-2xl);
		font-weight: 700;
		margin-bottom: var(--space-sm);
		font-style: italic;
	}

	.cta-block p {
		color: var(--color-text-muted);
		margin-bottom: var(--space-xl);
		line-height: var(--leading-relaxed);
	}

	/* =============================================
	   Animations
	   ============================================= */

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
		to { opacity: 1; transform: translateY(0); filter: blur(0); }
	}

	/* =============================================
	   Responsive
	   ============================================= */

	@media (max-width: 900px) {
		.suites-grid, .philosophy-grid {
			grid-template-columns: 1fr;
			max-width: 480px;
			margin-left: auto;
			margin-right: auto;
		}

		.curves-row, .cli-row {
			grid-template-columns: 1fr;
			direction: ltr;
		}

		.problems-row, .credentials-grid, .usecases-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.hero-heading { font-size: 2rem; }
		.hero-subtitle { font-size: var(--text-base); }

		.hero-cta {
			flex-direction: column;
			align-items: stretch;
		}

		.hero-cta a { justify-content: center; }

		.problems-row, .credentials-grid, .usecases-grid {
			grid-template-columns: 1fr;
		}

		.step-connector { display: none; }

		.verification-steps {
			flex-direction: column;
			gap: var(--space-md);
		}

		.step-card { min-width: auto; width: 100%; }

		/* Section spacing reduction */
		.problem-section,
		.philosophy-section,
		.suites-section,
		.antigaming-section,
		.curves-section,
		.credentials-section,
		.cli-section,
		.verification-section,
		.usecases-section {
			padding: var(--space-xl) 0;
		}

		.section-title { font-size: 1.5rem; }
		.section-description { font-size: var(--text-sm); }

		/* Anti-gaming table: horizontal scroll on mobile */
		.antigaming-table-wrap {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
		}

		.antigaming-table {
			min-width: 420px;
		}

		/* Code blocks: tighter on mobile */
		.code-content {
			font-size: 0.75rem;
			padding: var(--space-md);
		}

		/* Wave SVG: reduce height */
		.wave-top, .wave-bottom { height: 40px; }

		/* Philosophy: remove max-width constraint */
		.philosophy-grid {
			max-width: none;
			grid-template-columns: repeat(2, 1fr);
		}

		/* Suite cards: full width */
		.suites-grid {
			max-width: 100%;
		}

		/* Curves/CLI text */
		.curves-text h3, .cli-text h3 { font-size: var(--text-xl); }

		/* CTA block */
		.cta-heading { font-size: var(--text-xl); }
		.cta-icon-ring { width: 56px; height: 56px; font-size: 1.25rem; }
	}

	@media (max-width: 480px) {
		.hero-content { padding: var(--space-xl) var(--space-md); }
		.hero-heading { font-size: 1.75rem; }

		.philosophy-grid { grid-template-columns: 1fr; }

		.btn-mettle-primary, .btn-mettle-secondary {
			padding: 12px 20px;
			font-size: 0.8125rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-eyebrow, .hero-heading, .animate-fade-in, .animate-fade-in-late {
			animation: none;
			opacity: 1;
		}

		.btn-shine { display: none; }

		.suite-card,
		.problem-item,
		.step-card,
		.credential-card,
		.usecase-card,
		.badge-item,
		.philosophy-item,
		.btn-mettle-primary,
		.btn-mettle-secondary {
			transition: none;
		}

		.suite-card:hover,
		.problem-item:hover,
		.step-card:hover,
		.credential-card:hover,
		.usecase-card:hover,
		.btn-mettle-primary:hover,
		.btn-mettle-secondary:hover {
			transform: none;
		}

		.suite-card:hover .suite-icon {
			transform: none;
		}

		.suite-border { transition: none; }
		.suite-icon { transition: none; }
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
