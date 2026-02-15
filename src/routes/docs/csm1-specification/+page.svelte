<script lang="ts">
	import DocsLayout from '$lib/components/docs/DocsLayout.svelte';
</script>

<svelte:head>
	<title>CSM-1 Specification - VCP Documentation</title>
	<meta name="description" content="Complete specification for the Compact State Message (CSM-1) token format." />
</svelte:head>

<DocsLayout
	title="CSM-1 Specification"
	description="Complete specification for the Compact State Message format."
>
	{#snippet children()}
		<h2>Overview</h2>
		<p>
			<strong>CSM-1 (Compact State Message v1)</strong> is a human-readable token format for encoding
			VCP context. It's designed to be:
		</p>
		<ul>
			<li><strong>Compact</strong> — Minimal bytes, fits in headers and logs</li>
			<li><strong>Human-readable</strong> — Developers can inspect tokens visually</li>
			<li><strong>Privacy-preserving</strong> — Private data is represented by markers only</li>
			<li><strong>Versioned</strong> — Forward compatible with future extensions</li>
		</ul>

		<div style="border-left: 4px solid var(--color-primary); background: rgba(99, 102, 241, 0.1); padding: 1rem; margin-bottom: 1rem; border-radius: 0.375rem;">
			<strong>Version note:</strong> The VCP protocol is at <strong>v3.1</strong>. The CSM-1 <em>format</em> is at
			<strong>v1.0</strong> — the token header reads <code>VCP:1.0</code>. These are separate version numbers:
			the protocol version tracks the overall specification (layers, adaptation, personal state),
			while the format version tracks the token grammar itself.
		</div>

		<h2>Token Format</h2>
		<p>A CSM-1 token consists of 8 lines (the R-line was added in VCP 3.1 for personal state):</p>

		<pre><code>{`VCP:<version>:<profile_id>
C:<constitution_id>@<version>
P:<persona>:<adherence>
G:<goal>:<experience>:<learning_style>
X:<constraint_flags>
F:<active_flags>
S:<private_markers>
R:<personal_state_dimensions>`}</code></pre>

		<h3>Example Token</h3>
		<pre><code>{`VCP:1.0:user_001
C:learning-assistant@1.0
P:muse:3
G:learn_guitar:beginner:visual
X:🔇quiet:💰low:⏱️30minutes
F:time_limited|budget_limited
S:🔒work|🔒housing
R:🧠focused:3|💭calm:4|🔋rested:3|⚡unhurried:2|🩺neutral:1`}</code></pre>

		<h2>Line-by-Line Breakdown</h2>

		<h3>Line 1: Header</h3>
		<pre><code>VCP:&lt;version&gt;:&lt;profile_id&gt;</code></pre>
		<table>
			<thead>
				<tr><th>Field</th><th>Type</th><th>Description</th></tr>
			</thead>
			<tbody>
				<tr><td>version</td><td>string</td><td>VCP protocol version (e.g., "1.0")</td></tr>
				<tr><td>profile_id</td><td>string</td><td>Unique user/profile identifier</td></tr>
			</tbody>
		</table>

		<h3>Line 2: Constitution Reference</h3>
		<pre><code>C:&lt;constitution_id&gt;@&lt;version&gt;</code></pre>
		<table>
			<thead>
				<tr><th>Field</th><th>Type</th><th>Description</th></tr>
			</thead>
			<tbody>
				<tr><td>constitution_id</td><td>string</td><td>Constitution identifier (e.g., "learning-assistant")</td></tr>
				<tr><td>version</td><td>string</td><td>Constitution version</td></tr>
			</tbody>
		</table>

		<h3>Line 3: Persona</h3>
		<pre><code>P:&lt;persona&gt;:&lt;adherence&gt;</code></pre>
		<table>
			<thead>
				<tr><th>Field</th><th>Type</th><th>Values</th></tr>
			</thead>
			<tbody>
				<tr><td>persona</td><td>enum</td><td>muse, ambassador, godparent, sentinel, nanny, mediator</td></tr>
				<tr><td>adherence</td><td>1-5</td><td>How strictly to follow constitution rules</td></tr>
			</tbody>
		</table>

		<h3>Line 4: Goal Context</h3>
		<pre><code>G:&lt;goal&gt;:&lt;experience&gt;:&lt;learning_style&gt;</code></pre>
		<table>
			<thead>
				<tr><th>Field</th><th>Type</th><th>Values</th></tr>
			</thead>
			<tbody>
				<tr><td>goal</td><td>string</td><td>User's primary goal (e.g., "learn_guitar")</td></tr>
				<tr><td>experience</td><td>enum</td><td>beginner, intermediate, advanced, expert</td></tr>
				<tr><td>learning_style</td><td>enum</td><td>visual, auditory, hands_on, reading, mixed</td></tr>
			</tbody>
		</table>

		<h3>Line 5: Constraint Flags (X-line)</h3>
		<pre><code>X:&lt;emoji_flags&gt;</code></pre>
		<p>Colon-separated constraint markers using emoji shortcodes:</p>

		<table>
			<thead>
				<tr><th>Emoji</th><th>Meaning</th><th>Example</th></tr>
			</thead>
			<tbody>
				<tr><td>🔇</td><td>Quiet mode preference</td><td><code>🔇quiet</code></td></tr>
				<tr><td>🔕</td><td>Silent required</td><td><code>🔕silent</code></td></tr>
				<tr><td>💰</td><td>Budget tier</td><td><code>💰low</code></td></tr>
				<tr><td>🆓</td><td>Free only</td><td><code>🆓</code></td></tr>
				<tr><td>💎</td><td>Premium budget</td><td><code>💎high</code></td></tr>
				<tr><td>⚡</td><td>Energy variable</td><td><code>⚡var</code></td></tr>
				<tr><td>⏰</td><td>Time limited</td><td><code>⏰lim</code></td></tr>
				<tr><td>⏱️</td><td>Session length</td><td><code>⏱️30minutes</code></td></tr>
				<tr><td>📅</td><td>Irregular schedule</td><td><code>📅irreg</code></td></tr>
			</tbody>
		</table>
		<p>If no constraints: <code>X:none</code></p>

		<h3>Line 6: Active Flags (F-line)</h3>
		<pre><code>F:&lt;flag1&gt;|&lt;flag2&gt;|...</code></pre>
		<p>Pipe-separated list of currently active constraint flags:</p>
		<ul>
			<li><code>time_limited</code></li>
			<li><code>budget_limited</code></li>
			<li><code>noise_restricted</code></li>
			<li><code>energy_variable</code></li>
			<li><code>schedule_irregular</code></li>
			<li><code>mobility_limited</code></li>
			<li><code>health_considerations</code></li>
		</ul>
		<p>If none: <code>F:none</code></p>

		<h3>Line 7: Private Markers (S-line)</h3>
		<pre><code>S:🔒&lt;category1&gt;|🔒&lt;category2&gt;|...</code></pre>
		<p>
			Shows <em>categories</em> of private data that influenced the context, but
			<strong>never the values</strong>:
		</p>
		<ul>
			<li><code>🔒work</code> — Work-related private context exists</li>
			<li><code>🔒housing</code> — Housing-related private context exists</li>
			<li><code>🔒health</code> — Health-related private context exists</li>
			<li><code>🔒financial</code> — Financial private context exists</li>
		</ul>
		<p>If no private context: <code>S:none</code></p>

		<h3>Line 8: Personal State (R-line) — v3.1</h3>
		<pre><code>R:&lt;emoji&gt;&lt;value&gt;:&lt;intensity&gt;|...</code></pre>
		<p>
			Pipe-separated personal state dimensions. Each dimension is an emoji symbol
			followed by a categorical value and intensity (1-5):
		</p>

		<table>
			<thead>
				<tr><th>Symbol</th><th>Dimension</th><th>Values</th><th>Intensity</th></tr>
			</thead>
			<tbody>
				<tr><td>🧠</td><td>Cognitive State</td><td>focused, distracted, overloaded, foggy, reflective</td><td>1–5</td></tr>
				<tr><td>💭</td><td>Emotional Tone</td><td>calm, tense, frustrated, neutral, uplifted</td><td>1–5</td></tr>
				<tr><td>🔋</td><td>Energy Level</td><td>rested, low_energy, fatigued, wired, depleted</td><td>1–5</td></tr>
				<tr><td>⚡</td><td>Perceived Urgency</td><td>unhurried, time_aware, pressured, critical</td><td>1–5</td></tr>
				<tr><td>🩺</td><td>Body Signals</td><td>neutral, discomfort, pain, unwell, recovering</td><td>1–5</td></tr>
			</tbody>
		</table>
		<p>
			If intensity is omitted, it defaults to 3 (fail-open design). Extended sub-signals
			can follow a second colon: <code>🩺unwell:4:migraine</code>.
		</p>
		<p>If no personal state: <code>R:none</code></p>

		<h3>Situational Context Encoding</h3>
		<p>
			VCP 3.1 also defines a separate <strong>context wire format</strong> using the
			Extended Enneagram Protocol — 9 situational dimensions plus the 5 personal state
			dimensions above:
		</p>
		<pre><code>{`⏰🌅|📍🏡|👥👶|📡💻‖🧠focused:4|💭calm:5|🔋rested:4|⚡unhurried:2|🩺neutral:1
└── situational (|) ──┘‖└──── personal state (|) ────────────────────────────────┘`}</code></pre>
		<p>
			The <code>|</code> pipe separates dimensions <em>within</em> a layer.
			The <code>‖</code> double bar separates Layer 2 (situational) from Layer 3 (personal state).
		</p>

		<table>
			<thead>
				<tr><th>Symbol</th><th>Dimension</th><th>Example</th></tr>
			</thead>
			<tbody>
				<tr><td>⏰</td><td>Time</td><td>🌅morning, 🌙night, 📅weekday</td></tr>
				<tr><td>📍</td><td>Space</td><td>🏡home, 🏢office, 🏫school</td></tr>
				<tr><td>👥</td><td>Company</td><td>👤alone, 👶children, 👔colleagues</td></tr>
				<tr><td>🌍</td><td>Culture</td><td>🇺🇸american, 🌍global</td></tr>
				<tr><td>🎭</td><td>Occasion</td><td>➖normal, 🚨emergency</td></tr>
				<tr><td>🌡️</td><td>Environment</td><td>🔇quiet, 🥵hot</td></tr>
				<tr><td>🔷</td><td>Agency</td><td>👑leader, 🤝peer, 🔐limited</td></tr>
				<tr><td>🔶</td><td>Constraints</td><td>○minimal, ⚖️legal, 💸economic</td></tr>
				<tr><td>📡</td><td>System Context</td><td>💻personal_device, 🏢workplace_system</td></tr>
			</tbody>
		</table>

		<h2>Encoding Rules</h2>

		<h3>String Encoding</h3>
		<ul>
			<li>All strings are UTF-8</li>
			<li>Spaces in values are replaced with underscores</li>
			<li>Colons (<code>:</code>) in values must be escaped as <code>\:</code></li>
			<li>Pipes (<code>|</code>) in values must be escaped as <code>\|</code></li>
		</ul>

		<h3>Optional Fields</h3>
		<ul>
			<li>Missing goal: <code>G:unset:beginner:mixed</code></li>
			<li>Missing persona: <code>P:muse:3</code> (default)</li>
			<li>Empty constraints: <code>X:none</code></li>
		</ul>

		<h2>Parsing</h2>
		<p>To parse a CSM-1 token:</p>
		<pre><code>{`function parseCSM1(token: string) {
  const lines = token.split('\\n');
  const result = {};

  for (const line of lines) {
    const [key, ...values] = line.split(':');
    result[key] = values.join(':');
  }

  return result;
}

// Returns:
// {
//   VCP: "1.0:user_001",
//   C: "learning-assistant@1.0",
//   P: "muse:3",
//   G: "learn_guitar:beginner:visual",
//   X: "🔇quiet:💰low:⏱️30minutes",
//   F: "time_limited|budget_limited",
//   S: "🔒work|🔒housing",
//   R: "🧠focused:3|💭calm:4|🔋rested:3|⚡unhurried:2|🩺neutral:1"
// }`}</code></pre>

		<h2>Display Formatting</h2>
		<p>For visual display, tokens can be boxed:</p>
		<pre><code>{`┌──────────────────────────────────────────────────────────────────┐
│ VCP:1.0:user_001                                                 │
│ C:learning-assistant@1.0                                         │
│ P:muse:3                                                         │
│ G:learn_guitar:beginner:visual                                   │
│ X:🔇quiet:💰low:⏱️30minutes                                      │
│ F:time_limited|budget_limited                                    │
│ S:🔒work|🔒housing                                               │
│ R:🧠focused:3|💭calm:4|🔋rested:3|⚡unhurried:2|🩺neutral:1       │
└──────────────────────────────────────────────────────────────────┘`}</code></pre>

		<h2>Security Considerations</h2>

		<h3>What CSM-1 Guarantees</h3>
		<ul>
			<li>Private context values are <strong>never</strong> included in tokens</li>
			<li>Only category names appear in the S-line, not values</li>
			<li>Tokens can be logged and inspected without privacy leakage</li>
		</ul>

		<h3>What CSM-1 Does NOT Do</h3>
		<ul>
			<li>Encryption — Tokens are readable by anyone who receives them</li>
			<li>Authentication — Tokens don't prove who created them</li>
			<li>Integrity — Tokens can be modified in transit</li>
		</ul>
		<p>
			Authentication and integrity are handled by the <strong>VCP Transport layer (VCP/T)</strong>,
			which wraps CSM-1 tokens in <strong>signed bundles</strong> using the verify-then-inject pattern.
			The orchestrator verifies signatures and content hashes before the LLM receives the text.
			See <a href="/docs/concepts">Core Concepts</a> for the full protocol stack.
		</p>

		<h2>Extensions</h2>
		<p>CSM-1 is designed for forward compatibility. Future versions may add:</p>
		<ul>
			<li>Additional lines for new context types</li>
			<li>New emoji shortcodes for constraints</li>
			<li>Compression for high-volume scenarios</li>
		</ul>
		<p>Parsers should ignore unrecognized lines gracefully.</p>

		<h2>Next Steps</h2>
		<ul>
			<li><a href="/docs/api-reference">API Reference</a> — Encoding/decoding functions</li>
			<li><a href="/playground">Playground</a> — Build tokens interactively</li>
			<li><a href="/demos/gentian">Gentian Demo</a> — See a CSM-1 token travel across platforms (portability)</li>
			<li><a href="/demos/campion">Campion Demo</a> — Watch tokens switch between work and home contexts (adaptation)</li>
		</ul>
	{/snippet}
</DocsLayout>
