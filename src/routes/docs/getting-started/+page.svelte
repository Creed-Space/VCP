<script lang="ts">
	import DocsLayout from '$lib/components/docs/DocsLayout.svelte';
</script>

<svelte:head>
	<title>Getting Started - VCP Documentation</title>
	<meta name="description" content="Quick start guide for implementing VCP in your application." />
</svelte:head>

<DocsLayout
	title="Getting Started"
	description="Get up and running with VCP in 5 minutes."
>
	{#snippet children()}
		<h2>What is VCP?</h2>
		<p>
			The <strong>Value Context Protocol (VCP)</strong> is a standard for encoding user preferences,
			constraints, and context as portable categorical flags. Set it once, change it in real time,
			and every connected service adapts instantly. Private details stay on-device by design.
		</p>

		<p>
			VCP is built on three pillars:
		</p>
		<ul>
			<li><strong>Portability</strong> -- Your context travels with you across platforms and services</li>
			<li><strong>Adaptation</strong> -- AI behavior shifts automatically as your situation changes</li>
			<li><strong>Liveness</strong> -- Personal state updates in real time, shaping responses moment to moment</li>
		</ul>

		<blockquote>
			"Context that travels with you, wherever you need it."
		</blockquote>

		<h2>Quick Start</h2>

		<h3>1. Define a VCP Context</h3>
		<p>A VCP context contains your preferences, constraints, and personal state:</p>

		<pre><code>{`import type { VCPContext } from 'vcp';

const context: VCPContext = {
  vcp_version: "1.0",
  profile_id: "user_001",

  // Reference a constitution (behavioral guidelines)
  constitution: {
    id: "learning-assistant",
    version: "1.0",
    persona: "muse",
    adherence: 3
  },

  // Public preferences - shared with all stakeholders
  public_profile: {
    goal: "learn_guitar",
    experience: "beginner",
    learning_style: "visual"
  },

  // Portable preferences - follow you across platforms
  portable_preferences: {
    noise_mode: "quiet_preferred",
    session_length: "30_minutes",
    budget_range: "low"
  },

  // Private context - influences AI but NEVER exposed
  private_context: {
    _note: "Values here shape recommendations but are never transmitted",
    work_situation: "unemployed",
    housing_situation: "living_with_parents"
  },

  // Personal state (v3.1) - real-time user state
  personal_state: {
    cognitive_state: { value: "focused", intensity: 3 },
    emotional_tone: { value: "calm", intensity: 4 },
    energy_level: { value: "rested", intensity: 3 },
    perceived_urgency: { value: "unhurried", intensity: 2 },
    body_signals: { value: "neutral", intensity: 1 }
  }
};`}</code></pre>

		<h3>2. Encode to CSM-1 Token</h3>
		<p>The <strong>CSM-1 (Compact State Message)</strong> format is a human-readable token that encodes your context:</p>

		<pre><code>{`import { encodeContextToCSM1 } from 'vcp';

const token = encodeContextToCSM1(context);

// Output:
// VCP:1.0:user_001
// C:learning-assistant@1.0
// P:muse:3
// G:learn_guitar:beginner:visual
// X:🔇quiet:💰low:⏱️30minutes
// F:none
// S:🔒work|🔒housing
// R:🧠focused:3|💭calm:4|🔋rested:3|⚡unhurried:2|🩺neutral:1`}</code></pre>

		<h3>3. Share with Stakeholders</h3>
		<p>The token carries what each service needs to adapt — compact, categorical, and instantly parseable:</p>

		<table>
			<thead>
				<tr>
					<th>Line</th>
					<th>Meaning</th>
					<th>AI Sees</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>G:learn_guitar:beginner:visual</code></td>
					<td>Goal + skill level + style</td>
					<td>✓ Full detail</td>
				</tr>
				<tr>
					<td><code>X:🔇quiet:💰low</code></td>
					<td>Noise + budget constraints</td>
					<td>✓ Flags only</td>
				</tr>
				<tr>
					<td><code>S:🔒work|🔒housing</code></td>
					<td>Private context exists</td>
					<td>✗ Categories only</td>
				</tr>
				<tr>
					<td><code>R:🧠focused:3|💭calm:4|...</code></td>
					<td>Real-time personal state</td>
					<td>✓ Shapes response style</td>
				</tr>
			</tbody>
		</table>

		<p>
			The AI knows <em>that</em> work and housing context influenced the recommendations, but not
			<em>what</em> that context is. This enables personalization without surveillance.
		</p>

		<h2>Key Concepts</h2>

		<h3>Privacy Levels</h3>
		<ul>
			<li><strong>Public</strong> — Always shared (goals, experience level)</li>
			<li><strong>Consent</strong> — Shared when you approve (specific preferences)</li>
			<li><strong>Private</strong> — Never transmitted, only influences locally (sensitive reasons)</li>
		</ul>

		<h3>Constitutions</h3>
		<p>
			Constitutions define AI behavioral guidelines. They specify what an AI should prioritize,
			avoid, and how it should interact. VCP contexts reference constitutions to ensure consistent
			behavior.
		</p>

		<h3>Personas</h3>
		<p>Different interaction styles built into constitutions:</p>
		<ul>
			<li><strong>Muse</strong> — Creative, exploratory, encouraging</li>
			<li><strong>Sentinel</strong> — Cautious, protective, conservative</li>
			<li><strong>Godparent</strong> — Nurturing, supportive, patient</li>
			<li><strong>Ambassador</strong> — Professional, diplomatic, balanced</li>
			<li><strong>Anchor</strong> — Stable, grounding, realistic</li>
			<li><strong>Nanny</strong> — Structured, directive, safe</li>
		</ul>

		<h2>See It in Action</h2>
		<p>Each pillar comes alive in a persona-driven demo:</p>
		<ul>
			<li><a href="/demos/gentian">Gentian</a> — <strong>Portability</strong>: Watch a single VCP token travel across three guitar-learning platforms</li>
			<li><a href="/demos/campion">Campion</a> — <strong>Adaptation</strong>: See how context-switching between work and home personas changes AI behavior instantly</li>
			<li><a href="/demos/marta">Marta</a> — <strong>Liveness</strong>: Adjust personal state sliders and watch AI guidance respond in real time</li>
		</ul>

		<h2>Next Steps</h2>
		<ul>
			<li><a href="/docs/concepts">Core Concepts</a> — Deep dive into VCP architecture</li>
			<li><a href="/docs/csm1-specification">CSM-1 Specification</a> — Full token format reference</li>
			<li><a href="/playground">Playground</a> — Build tokens interactively</li>
			<li><a href="/demos">All Demos</a> — Six interactive demos covering portability, adaptation, liveness, and more</li>
		</ul>
	{/snippet}
</DocsLayout>
