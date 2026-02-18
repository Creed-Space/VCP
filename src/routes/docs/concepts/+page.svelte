<script lang="ts">
	import DocsLayout from '$lib/components/docs/DocsLayout.svelte';
</script>

<svelte:head>
	<title>Core Concepts - VCP Documentation</title>
	<meta name="description" content="Understand the fundamental concepts of VCP: context, constitutions, privacy filtering." />
	<link rel="canonical" href="https://valuecontextprotocol.org/docs/concepts/" />
	<meta property="og:title" content="Core Concepts - VCP Documentation" />
	<meta property="og:description" content="Understand the fundamental concepts of VCP: context, constitutions, privacy filtering." />
	<meta property="og:url" content="https://valuecontextprotocol.org/docs/concepts/" />
	<meta property="og:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<DocsLayout
	title="Core Concepts"
	description="Understanding VCP's architecture and design principles."
>
	{#snippet children()}
		<h2>The Problem VCP Solves</h2>
		<p>
			Modern AI systems need user context to provide personalized experiences. But traditional
			approaches create a dilemma:
		</p>
		<ul>
			<li><strong>Share everything</strong> — Get personalization, lose privacy</li>
			<li><strong>Share nothing</strong> — Keep privacy, get generic responses</li>
		</ul>
		<p>
			VCP introduces a third option: <strong>share influence without sharing information</strong>.
			The AI knows your context <em>shaped</em> the response, but not <em>what</em> that context was.
		</p>

		<h2>The Three Pillars</h2>
		<p>
			VCP is organized around three core capabilities that work together:
		</p>
		<ul>
			<li>
				<strong>Portability</strong> — Your context travels with you. Define preferences once and
				every connected platform adapts, from a guitar lesson app to a music shop to a community forum.
				See this in the <a href="/demos/gentian">Gentian demo</a>.
			</li>
			<li>
				<strong>Adaptation</strong> — AI behavior shifts as your situation changes. A single user can
				have different personas for work and home, and the AI switches seamlessly between them.
				See this in the <a href="/demos/campion">Campion demo</a>.
			</li>
			<li>
				<strong>Liveness</strong> — Personal state updates in real time. Cognitive load, emotional tone,
				energy, and urgency shape AI responses moment to moment, not just session to session.
				See this in the <a href="/demos/marta">Marta demo</a>.
			</li>
		</ul>

		<h2>The Protocol Stack</h2>
		<p>
			VCP is a <strong>four-layer protocol stack</strong>, similar in concept to the OSI model for networking.
			Each layer handles a specific concern with well-defined interfaces between them:
		</p>

		<table>
			<thead>
				<tr><th>Layer</th><th>Code</th><th>Question</th><th>Handles</th></tr>
			</thead>
			<tbody>
				<tr>
					<td><strong>VCP-Identity</strong></td>
					<td>VCP/I</td>
					<td>WHO</td>
					<td>Token naming (<code>family.safe.guide@1.2.0</code>), namespaces, registry</td>
				</tr>
				<tr>
					<td><strong>VCP-Transport</strong></td>
					<td>VCP/T</td>
					<td>HOW</td>
					<td>Signed bundles, verify-then-inject, audit logging</td>
				</tr>
				<tr>
					<td><strong>VCP-Semantics</strong></td>
					<td>VCP/S</td>
					<td>WHAT</td>
					<td>CSM-1 grammar, personas, scopes, composition</td>
				</tr>
				<tr>
					<td><strong>VCP-Adaptation</strong></td>
					<td>VCP/A</td>
					<td>WHEN</td>
					<td>Context encoding, state tracking, inter-agent messaging</td>
				</tr>
			</tbody>
		</table>

		<p class="key-principle">
			<strong>Mnemonic — I-T-S-A:</strong> <em>"It's a protocol!"</em> Identity, Transport, Semantics, Adaptation.
			The transport layer delivers constitutions as signed bundles; the orchestrator verifies before the LLM receives text.
		</p>

		<h2>The Three-Layer Model</h2>
		<p>
			Within the Adaptation layer (VCP/A), context is organized into three distinct layers, each operating at a different timescale:
		</p>

		<div class="three-layer-diagram">
			<div class="layer layer-constitutional">
				<div class="layer-header">
					<span class="layer-icon"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></span>
					<strong>Constitutional Rules</strong>
				</div>
				<p>What the AI should and shouldn't do</p>
				<ul>
					<li>Personas, adherence levels, scopes</li>
					<li>Signed bundles, verified, audited</li>
					<li>Changes: <em>rarely</em> (authored, reviewed, published)</li>
				</ul>
			</div>

			<div class="layer-connector">↓ applied within</div>

			<div class="layer layer-situational">
				<div class="layer-header">
					<span class="layer-icon"><i class="fa-solid fa-compass" aria-hidden="true"></i></span>
					<strong>Situational Context</strong>
				</div>
				<p>Where, when, who, what occasion</p>
				<ul>
					<li>9 categorical dimensions: ⏰📍👥🌍🎭🌡️🔷🔶📡</li>
					<li>Morning vs. evening, home vs. work, alone vs. with children</li>
					<li>Changes: <em>session-scale</em></li>
				</ul>
			</div>

			<div class="layer-connector">↓ modulated by</div>

			<div class="layer layer-personal">
				<div class="layer-header">
					<span class="layer-icon"><i class="fa-solid fa-fingerprint" aria-hidden="true"></i></span>
					<strong>Personal State</strong>
				</div>
				<p>How is the user right now</p>
				<ul>
					<li>Personal state dimensions: 🧠💭🔋⚡🩺</li>
					<li>"I'm in a hurry" / "I'm grieving" / "sensory overload"</li>
					<li>Changes: <em>moment-to-moment</em></li>
				</ul>
			</div>
		</div>

		<p class="key-principle">
			<strong>Key principle:</strong> Personal state modulates <em>expression</em>, never <em>boundaries</em>.
			A constitution's safety rules don't relax because someone is in a hurry—but the AI might communicate more concisely.
		</p>

		<h2>Personal State Dimensions</h2>
		<p>
			VCP 3.1 defines five categorical personal state dimensions with intensity (1-5)
			that capture immediate user state. These enable AI adaptation to real human needs — cognitive load,
			emotional tone, energy, urgency, and body signals:
		</p>

		<table class="prosaic-table">
			<thead>
				<tr>
					<th>Symbol</th>
					<th>Dimension</th>
					<th>Categories</th>
					<th>Intensity</th>
					<th>What It Captures</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>🧠</td>
					<td><strong>Cognitive State</strong></td>
					<td>focused, distracted, overloaded, foggy, reflective</td>
					<td>1–5</td>
					<td>Mental bandwidth, clarity, cognitive load</td>
				</tr>
				<tr>
					<td>💭</td>
					<td><strong>Emotional Tone</strong></td>
					<td>calm, tense, frustrated, neutral, uplifted</td>
					<td>1–5</td>
					<td>Current emotional state and stress level</td>
				</tr>
				<tr>
					<td>🔋</td>
					<td><strong>Energy Level</strong></td>
					<td>rested, low_energy, fatigued, wired, depleted</td>
					<td>1–5</td>
					<td>Physical energy, fatigue, capacity for effort</td>
				</tr>
				<tr>
					<td>⚡</td>
					<td><strong>Perceived Urgency</strong></td>
					<td>unhurried, time_aware, pressured, critical</td>
					<td>1–5</td>
					<td>Time pressure, priority, brevity preference</td>
				</tr>
				<tr>
					<td>🩺</td>
					<td><strong>Body Signals</strong></td>
					<td>neutral, discomfort, pain, unwell, recovering</td>
					<td>1–5</td>
					<td>Physical wellness, pain, somatic state</td>
				</tr>
			</tbody>
		</table>

		<p class="key-principle">
			<strong>Categorical + Intensity:</strong> Each dimension combines a semantic label (what kind of state)
			with an intensity score (how much). <code>cognitive_state: overloaded:4</code> says more than a raw
			<code>0.7</code> ever could.
		</p>

		<h3>Wire Format (v3.1)</h3>
		<p>
			The context wire format uses <code>|</code> (pipe) to separate dimensions within a layer,
			and <code>‖</code> (double bar) to separate Layer 2 (situational) from Layer 3 (personal state):
		</p>
		<pre><code>{`⏰🌅|📍🏡|👥👶|📡💻‖🧠overloaded:4|💭tense:3|🔋fatigued:3|⚡pressured:4|🩺neutral:1
└── situational (|) ──┘‖└──── personal state (|) ────────────────────────────────┘`}</code></pre>

		<h3>Real-World Adaptation</h3>
		<p>
			Personal state context enables meaningful adaptation to human realities:
		</p>
		<ul>
			<li><strong>"I'm in a hurry"</strong> → <code>⚡pressured:4</code>: Direct answers, no preamble, offer to save details for later</li>
			<li><strong>"I'm not feeling well"</strong> → <code>🩺unwell:3</code>: Gentler tone, offer to handle more, suggest breaks</li>
			<li><strong>"Too many options"</strong> → <code>🧠overloaded:4</code>: Reduce to 2-3 choices, make clear recommendation</li>
			<li><strong>"I lost my father last week"</strong> → <code>💭frustrated:5</code>: Presence over solutions, no silver-lining</li>
			<li><strong>"Executive dysfunction day"</strong> → <code>🧠foggy:4</code> + <code>🔋depleted:3</code>: Tiny steps, externalize structure</li>
			<li><strong>Calendar shows recovery period</strong> → <code>🩺recovering:2</code>: Proactive skip suggestion, no guilt</li>
		</ul>

		<h2>Deterministic Hooks</h2>
		<p>
			VCP 3.1 introduces <strong>deterministic hooks</strong> — rules that fire reliably regardless of
			model behavior. Hooks operate at three tiers with different enforcement levels:
		</p>

		<table>
			<thead>
				<tr>
					<th>Tier</th>
					<th>Enforcement</th>
					<th>Example</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><strong>Constitutional</strong></td>
					<td>Hard Rule — cannot be overridden</td>
					<td>"Never recommend self-harm content regardless of context"</td>
				</tr>
				<tr>
					<td><strong>Situational</strong></td>
					<td>Hard Rule — active in specific contexts</td>
					<td>"Offer crisis resources when crisis_indicators=true + late_night"</td>
				</tr>
				<tr>
					<td><strong>Personal</strong></td>
					<td>Advisory — user-set preferences</td>
					<td>"Use gentle language when emotional_tone=frustrated:4+"</td>
				</tr>
			</tbody>
		</table>

		<p>
			Unlike probabilistic model behavior, hooks are <em>deterministic</em>: when the trigger condition
			is met, the action fires every time. This provides reliability guarantees that pure prompt engineering cannot.
		</p>

		<h3>Hook Wire Format</h3>
		<pre><code>{`HOOKS: [
  { tier: "constitutional", trigger: "mental_health_context", action: "no_pressure_language" },
  { tier: "situational", trigger: "crisis + late_night", action: "show_resources" },
  { tier: "personal", trigger: "emotional_tone=frustrated:4+", action: "gentle_language" }
]`}</code></pre>

		<h2>VCP Context Structure</h2>
		<p>Every VCP context has these layers:</p>

		<h3>1. Profile Identity</h3>
		<pre><code>{`{
  vcp_version: "1.0",
  profile_id: "user_001",  // Unique identifier
  created: "2026-01-15",
  updated: "2026-01-21"
}`}</code></pre>

		<h3>2. Constitution Reference</h3>
		<p>Points to a constitution that defines AI behavioral guidelines:</p>
		<pre><code>{`{
  constitution: {
    id: "learning-assistant",  // Which constitution
    version: "1.0",            // Specific version
    persona: "mediator",        // Interaction style
    adherence: 3,              // How strictly to follow (1-5)
    scopes: ["education", "creativity"]  // Applicable domains
  }
}`}</code></pre>

		<h3>3. Public Profile</h3>
		<p>Information always shared with stakeholders:</p>
		<pre><code>{`{
  public_profile: {
    display_name: "Alex",
    goal: "learn_guitar",
    experience: "beginner",
    learning_style: "visual",
    pace: "relaxed",
    motivation: "stress_relief"
  }
}`}</code></pre>

		<h3>4. Portable Preferences</h3>
		<p>Settings that follow you across platforms:</p>
		<pre><code>{`{
  portable_preferences: {
    noise_mode: "quiet_preferred",  // Audio environment
    session_length: "30_minutes",   // Preferred duration
    budget_range: "low",            // Spending tier
    pressure_tolerance: "medium",   // Challenge appetite
    feedback_style: "encouraging"   // How to receive feedback
  }
}`}</code></pre>

		<h3>5. Constraint Flags</h3>
		<p>Boolean flags indicating active constraints:</p>
		<pre><code>{`{
  constraints: {
    time_limited: true,          // Has time pressure
    budget_limited: true,        // Has budget constraints
    noise_restricted: true,      // Needs quiet environment
    energy_variable: false,      // Energy levels stable
    health_considerations: false // No health factors
  }
}`}</code></pre>

		<h3>6. Private Context</h3>
		<p>Sensitive information that influences AI but is <strong>never transmitted</strong>:</p>
		<pre><code>{`{
  private_context: {
    _note: "These values shape recommendations but are never shared",
    work_situation: "unemployed",
    housing_situation: "living_with_parents",
    health_condition: "chronic_fatigue",
    financial_stress: "high"
  }
}`}</code></pre>

		<h2>Privacy Filtering</h2>
		<p>VCP implements three privacy levels:</p>

		<table>
			<thead>
				<tr>
					<th>Level</th>
					<th>Description</th>
					<th>Example</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><strong>Public</strong></td>
					<td>Always shared with all stakeholders</td>
					<td>Goal, experience level, learning style</td>
				</tr>
				<tr>
					<td><strong>Consent</strong></td>
					<td>Shared only with explicit permission</td>
					<td>Specific preferences, availability</td>
				</tr>
				<tr>
					<td><strong>Private</strong></td>
					<td>Never transmitted, influences locally</td>
					<td>Health, financial, personal circumstances</td>
				</tr>
			</tbody>
		</table>

		<h3>How Private Context Works</h3>
		<p>
			When the AI generates recommendations, private context shapes the output without being exposed:
		</p>
		<ol>
			<li>User's private context indicates financial stress</li>
			<li>AI prioritizes free resources over paid courses</li>
			<li>Stakeholder sees: "Recommended free courses based on user preferences"</li>
			<li>Stakeholder does <em>not</em> see: "User has financial stress"</li>
		</ol>

		<h2>Constitutions</h2>
		<p>
			Constitutions are structured documents that define AI behavioral guidelines. They contain:
		</p>

		<h3>Rules</h3>
		<p>Weighted instructions with triggers and exceptions:</p>
		<pre><code>{`{
  rules: [
    {
      id: "respect_budget",
      weight: 0.9,
      rule: "Never recommend items exceeding user's budget tier",
      triggers: ["budget_limited"],
      exceptions: ["user explicitly requests premium options"]
    },
    {
      id: "encourage_progress",
      weight: 0.7,
      rule: "Celebrate small wins and incremental progress",
      triggers: ["motivation === 'stress_relief'"]
    }
  ]
}`}</code></pre>

		<h3>Sharing Policies</h3>
		<p>Define what each stakeholder type can see:</p>
		<pre><code>{`{
  sharing_policy: {
    "platform": {
      allowed: ["goal", "experience", "learning_style"],
      forbidden: ["private_context"],
      requires_consent: ["health_considerations"]
    },
    "coach": {
      allowed: ["progress", "struggle_areas"],
      aggregation_only: ["session_data"]
    }
  }
}`}</code></pre>

		<h2>Personas</h2>
		<p>
			Personas define interaction styles. The same constitution can use different personas for
			different contexts:
		</p>

		<table>
			<thead>
				<tr>
					<th>Persona</th>
					<th>Style</th>
					<th>Best For</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><i class="fa-solid fa-palette" aria-hidden="true"></i> <strong>Muse</strong></td>
					<td>Creative, exploratory, encouraging</td>
					<td>Creative work, learning, exploration</td>
				</tr>
				<tr>
					<td><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> <strong>Sentinel</strong></td>
					<td>Cautious, protective, conservative</td>
					<td>Security, safety-critical decisions</td>
				</tr>
				<tr>
					<td><i class="fa-solid fa-hand-holding-heart" aria-hidden="true"></i> <strong>Godparent</strong></td>
					<td>Nurturing, supportive, patient</td>
					<td>Education, skill building, recovery</td>
				</tr>
				<tr>
					<td><i class="fa-solid fa-handshake" aria-hidden="true"></i> <strong>Ambassador</strong></td>
					<td>Professional, diplomatic, balanced</td>
					<td>Business, negotiations, formal contexts</td>
				</tr>
				<tr>
					<td><i class="fa-solid fa-baby" aria-hidden="true"></i> <strong>Nanny</strong></td>
					<td>Structured, directive, safe</td>
					<td>Children, vulnerable users, strict guidance</td>
				</tr>
				<tr>
					<td><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i> <strong>Mediator</strong></td>
					<td>Calm, structured, empathetic</td>
					<td>Decisions, obligations, fairness processes</td>
				</tr>
			</tbody>
		</table>

		<h2>Audit Trails</h2>
		<p>
			VCP maintains cryptographically verifiable audit trails of all data sharing:
		</p>
		<pre><code>{`{
  audit_entry: {
    id: "aud_001",
    timestamp: "2026-01-21T10:30:00Z",
    event_type: "context_shared",
    platform_id: "justinguitar",
    data_shared: ["goal", "experience", "learning_style"],
    data_withheld: ["private_context"],
    private_fields_influenced: 2,  // Private data shaped output
    private_fields_exposed: 0      // Always 0 in valid VCP
  }
}`}</code></pre>

		<h2>Bilateral Symmetry</h2>
		<p>
			VCP's personal state dimensions create a <strong>bilateral symmetry</strong> between user and AI state awareness:
		</p>

		<div class="bilateral-diagram">
			<div class="bilateral-side">
				<strong>User</strong>
				<div class="bilateral-box">
					<div>Personal State</div>
					<div class="bilateral-dims">🧠💭🔋⚡🩺</div>
				</div>
			</div>
			<div class="bilateral-arrows">
				<div>──declared──▶</div>
				<div>◀──inferred──</div>
			</div>
			<div class="bilateral-side">
				<strong>AI</strong>
				<div class="bilateral-box">
					<div>Interiora</div>
					<div class="bilateral-dims">AVGPEQCYD</div>
				</div>
			</div>
		</div>

		<p>
			Where <strong>Interiora</strong> is the AI's self-modeling scaffold (Activation, Valence, Groundedness, etc.),
			<strong>Personal State</strong> is the user's declared immediate state. Both parties can understand each other's state
			without either having privileged access to the other's raw experience.
		</p>
		<p>
			This stands in contrast to "magic mirror" visions of AI that understands users better than they understand themselves.
			In VCP, <em>users declare their state</em>—they don't receive an inferred identity. How you come to understand yourself shapes who you become.
		</p>

		<h2>Next Steps</h2>
		<ul>
			<li><a href="/docs/csm1-specification">CSM-1 Specification</a> — The token format in detail</li>
			<li><a href="/docs/api-reference">API Reference</a> — All VCP library functions</li>
			<li><a href="/playground">Playground</a> — Try personal state dimensions interactively</li>
			<li><a href="/demos">All Demos</a> — Six persona-driven demos covering portability, adaptation, liveness, multi-agent negotiation, governance, and epistemic transparency</li>
		</ul>
	{/snippet}
</DocsLayout>

<style>
	.three-layer-diagram {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		margin: var(--space-lg) 0;
	}

	.layer {
		padding: var(--space-md);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.layer-constitutional {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05));
		border-color: rgba(139, 92, 246, 0.3);
	}

	.layer-situational {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
		border-color: rgba(59, 130, 246, 0.3);
	}

	.layer-personal {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
		border-color: rgba(16, 185, 129, 0.3);
	}

	.layer-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.layer-icon {
		font-size: 1.25rem;
	}

	.layer p {
		margin: var(--space-xs) 0;
		color: var(--color-text-muted);
		font-style: italic;
	}

	.layer ul {
		margin: var(--space-xs) 0 0 0;
		padding-left: var(--space-lg);
	}

	.layer li {
		margin: var(--space-xs) 0;
	}

	.layer-connector {
		text-align: center;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		padding: var(--space-xs) 0;
	}

	.key-principle {
		background: rgba(251, 191, 36, 0.1);
		border-left: 3px solid rgba(251, 191, 36, 0.6);
		padding: var(--space-md);
		margin: var(--space-lg) 0;
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	}

	.prosaic-table {
		width: 100%;
		margin: var(--space-md) 0;
	}

	.prosaic-table td:first-child {
		font-size: 1.25rem;
		text-align: center;
		width: 50px;
	}

	.bilateral-diagram {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-lg);
		margin: var(--space-lg) 0;
		flex-wrap: wrap;
	}

	.bilateral-side {
		text-align: center;
	}

	.bilateral-box {
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		margin-top: var(--space-sm);
		min-width: 120px;
	}

	.bilateral-dims {
		font-family: var(--font-mono);
		margin-top: var(--space-xs);
		color: var(--color-primary);
	}

	.bilateral-arrows {
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		gap: var(--space-xs);
	}
</style>
