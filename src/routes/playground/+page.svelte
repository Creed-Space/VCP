<script lang="ts">
	/**
	 * VCP Playground — Tabbed hub for Context Builder, Transparency, and Compass.
	 */
	import { page } from '$app/stores';
	import { replaceState } from '$app/navigation';
	import { encodeContextToCSM1, toWireFormat } from '$lib/vcp/token';
	import type { VCPContext } from '$lib/vcp/types';
	import { Breadcrumb, StreamingChat } from '$lib/components/shared';
	import { loadVcpWasm, type VcpWasmModule } from '$lib/vcp/wasmLoader';
	import { isPolyfillRequested } from '$lib/webmcp/polyfill';

	import ContextBuilderTab from '$lib/components/playground/ContextBuilderTab.svelte';
	import TransparencyTab from '$lib/components/playground/TransparencyTab.svelte';
	import CompassTab from '$lib/components/playground/CompassTab.svelte';

	const polyfillActive = $derived(typeof window !== 'undefined' && isPolyfillRequested());

	const breadcrumbItems = [
		{ label: 'Playground', icon: 'fa-sliders' }
	];

	// ============================================
	// Tab State
	// ============================================

	type TabId = 'context' | 'transparency' | 'compass';

	const tabDefs: { id: TabId; label: string; icon: string }[] = [
		{ id: 'context', label: 'Context Builder', icon: 'fa-sliders' },
		{ id: 'transparency', label: 'Transparency', icon: 'fa-eye' },
		{ id: 'compass', label: 'Compass', icon: 'fa-compass' }
	];

	// Read initial tab and preset from URL query params
	function getInitialTab(): TabId {
		if (typeof window === 'undefined') return 'context';
		const param = new URLSearchParams(window.location.search).get('tab');
		if (param === 'transparency' || param === 'compass') return param;
		return 'context';
	}

	function getInitialPreset(): string | undefined {
		if (typeof window === 'undefined') return undefined;
		return new URLSearchParams(window.location.search).get('preset') ?? undefined;
	}

	let activeTab = $state<TabId>(getInitialTab());
	let initialPreset = getInitialPreset();

	// Sync tab to URL — replaceState throws if router not yet initialized (e.g. SSR, tests)
	function safeReplaceState(url: string, state: Record<string, unknown>) {
		try { replaceState(url, state); } catch { /* router not ready yet — skip */ }
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		if (activeTab === 'context') {
			url.searchParams.delete('tab');
		} else {
			url.searchParams.set('tab', activeTab);
		}
		// Clear preset when leaving transparency tab
		if (activeTab !== 'transparency') {
			url.searchParams.delete('preset');
		}
		safeReplaceState(url.toString(), {});
	});

	// Also react to external navigation (e.g. redirect from /transparency)
	$effect(() => {
		const param = $page.url.searchParams.get('tab');
		if (param === 'transparency' || param === 'compass') {
			activeTab = param;
		}
	});

	function setTab(tab: TabId) {
		activeTab = tab;
	}

	function handleTabKeydown(e: KeyboardEvent) {
		const ids = tabDefs.map((t) => t.id);
		const idx = ids.indexOf(activeTab);
		let next = -1;

		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			next = (idx + 1) % ids.length;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			next = (idx - 1 + ids.length) % ids.length;
		} else if (e.key === 'Home') {
			e.preventDefault();
			next = 0;
		} else if (e.key === 'End') {
			e.preventDefault();
			next = ids.length - 1;
		}

		if (next >= 0) {
			activeTab = ids[next];
			// Focus the newly active tab button
			const btn = document.getElementById(`tab-${ids[next]}`);
			btn?.focus();
		}
	}

	// ============================================
	// Shared Context (owned here, bound to tabs)
	// ============================================

	let context = $state<VCPContext>({
		vcp_version: '1.0.0',
		profile_id: 'playground-user',
		constitution: {
			id: 'personal.growth.creative',
			version: '1.0.0',
			persona: 'muse',
			adherence: 3,
			scopes: ['creativity', 'health', 'privacy']
		},
		public_profile: {
			display_name: 'Playground User',
			goal: 'learn_guitar',
			experience: 'beginner',
			learning_style: 'hands_on',
			pace: 'steady',
			motivation: 'stress_relief'
		},
		portable_preferences: {
			noise_mode: 'quiet_preferred',
			session_length: '30_minutes',
			budget_range: 'low',
			feedback_style: 'encouraging'
		},
		constraints: {
			time_limited: true,
			budget_limited: true,
			noise_restricted: true,
			energy_variable: false,
			schedule_irregular: false
		},
		private_context: {
			_note: 'Private context - never transmitted',
			work_type: 'office_worker',
			housing: 'apartment'
		},
		personal_state: {
			cognitive_state: { value: 'focused', intensity: 3 },
			emotional_tone: { value: 'calm', intensity: 2 },
			energy_level: { value: 'rested', intensity: 3 },
			perceived_urgency: { value: 'unhurried', intensity: 2 },
			body_signals: { value: 'neutral', intensity: 1 }
		}
	});

	const token = $derived(encodeContextToCSM1(context));

	// Transparency tab personal state callback
	function handlePersonalStateChange(ps: import('$lib/vcp/types').PersonalState) {
		context.personal_state = ps;
	}

	// Sync preset to URL when changed by TransparencyTab
	function handlePresetChange(preset: string) {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		if (preset === 'neutral') {
			url.searchParams.delete('preset');
		} else {
			url.searchParams.set('preset', preset);
		}
		safeReplaceState(url.toString(), {});
	}

	// Compass "Apply to Context Builder" callback
	function handleCompassApply(constitutionId: string, _genPrefs: Record<string, number>) {
		context.constitution = { ...context.constitution, id: constitutionId };
		activeTab = 'context';
	}

	// ============================================
	// WASM Integration
	// ============================================

	let wasmMod = $state<VcpWasmModule | null>(null);
	let wasmReady = $derived(wasmMod !== null);
	let wasmParseResult = $state<{ success: boolean; data?: unknown; error?: string; timeUs?: number } | null>(null);
	let wireDecodeResult = $state<{ success: boolean; data?: unknown; error?: string } | null>(null);
	let wireInput = $state('');
	let inspectorTab = $state<'parse' | 'wire' | 'identity'>('parse');
	let identityInput = $state('family.safe.guide@1.2.0');
	let identityResult = $state<{ success: boolean; data?: unknown; error?: string } | null>(null);

	$effect(() => {
		if (typeof window !== 'undefined') {
			loadVcpWasm().then((mod) => { wasmMod = mod; });
		}
	});

	$effect(() => {
		if (!wasmMod || !token) { wasmParseResult = null; return; }
		const start = performance.now();
		try {
			const parsed = wasmMod.parse_csm1_token(token);
			const elapsed = Math.round((performance.now() - start) * 1000);
			wasmParseResult = { success: true, data: parsed, timeUs: elapsed };
		} catch (e) {
			const elapsed = Math.round((performance.now() - start) * 1000);
			wasmParseResult = { success: false, error: String(e), timeUs: elapsed };
		}
	});

	function decodeWire() {
		if (!wireInput.trim()) { wireDecodeResult = null; return; }
		if (!wasmMod) { wireDecodeResult = { success: false, error: 'WASM not available' }; return; }
		try {
			const parsed = wasmMod.parse_context_wire(wireInput);
			wireDecodeResult = { success: true, data: parsed };
		} catch (e) { wireDecodeResult = { success: false, error: String(e) }; }
	}

	function validateIdentity() {
		if (!identityInput.trim()) { identityResult = null; return; }
		if (!wasmMod) { identityResult = { success: false, error: 'WASM not available' }; return; }
		try {
			const parsed = wasmMod.validate_token(identityInput);
			identityResult = { success: true, data: parsed };
		} catch (e) { identityResult = { success: false, error: String(e) }; }
	}
</script>

<svelte:head>
	<title>Playground - VCP</title>
	<meta name="description" content="Interactive VCP playground — build context tokens, explore intent inference, and discover your philosophical profile." />
	<link rel="canonical" href="https://valuecontextprotocol.org/playground/" />
	<meta property="og:title" content="Playground - VCP" />
	<meta property="og:description" content="Interactive VCP playground — build context tokens, explore intent inference, and discover your philosophical profile." />
	<meta property="og:url" content="https://valuecontextprotocol.org/playground/" />
	<meta property="og:image" content="https://valuecontextprotocol.org/vcp-logo.png" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Playground - VCP" />
	<meta name="twitter:description" content="Build context tokens, explore intent inference, and discover your philosophical profile." />
</svelte:head>

<div class="container">
	<Breadcrumb items={breadcrumbItems} />

	<section class="page-hero">
		<h1>VCP Playground</h1>
		<p class="page-hero-subtitle">
			Build context tokens, explore intent inference, and discover your philosophical profile — all in one place.
		</p>
		<p class="page-hero-explainer">
			See exactly what each service receives — compact flags, not personal details.
			<a href="/docs/csm1-specification">Learn about the token format</a>
		</p>
	</section>

	<!-- WebMCP Note -->
	<div class="webmcp-note">
		<i class="fa-solid fa-robot" aria-hidden="true"></i>
		<span>
			<strong>WebMCP tools available</strong> — AI agents can discover and use VCP tools on this page.
			{#if polyfillActive}
				<span class="polyfill-badge">Polyfill active</span>
			{:else}
				Try with <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">Chrome 146+</a> or add
				<code>?webmcp=polyfill</code> to the URL.
			{/if}
		</span>
	</div>

	<!-- Tab Bar -->
	<div class="tab-bar" role="tablist" aria-label="Playground sections">
		{#each tabDefs as tab}
			<button
				class="tab-btn"
				class:active={activeTab === tab.id}
				onclick={() => setTab(tab.id)}
				onkeydown={handleTabKeydown}
				role="tab"
				aria-selected={activeTab === tab.id}
				aria-controls="tabpanel-{tab.id}"
				id="tab-{tab.id}"
				tabindex={activeTab === tab.id ? 0 : -1}
			>
				<i class="fa-solid {tab.icon}" aria-hidden="true"></i>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Tab Panels — use hidden attribute to preserve state across switches -->
	<div
		id="tabpanel-context"
		role="tabpanel"
		aria-labelledby="tab-context"
		hidden={activeTab !== 'context'}
	>
		<ContextBuilderTab bind:context />
	</div>

	<div
		id="tabpanel-transparency"
		role="tabpanel"
		aria-labelledby="tab-transparency"
		hidden={activeTab !== 'transparency'}
	>
		<TransparencyTab
			personalState={context.personal_state ?? { cognitive_state: { value: 'focused', intensity: 3 }, emotional_tone: { value: 'calm', intensity: 2 }, energy_level: { value: 'rested', intensity: 3 }, perceived_urgency: { value: 'unhurried', intensity: 2 }, body_signals: { value: 'neutral', intensity: 1 } }}
			onPersonalStateChange={handlePersonalStateChange}
			{initialPreset}
			onPresetChange={handlePresetChange}
		/>
	</div>

	<div
		id="tabpanel-compass"
		role="tabpanel"
		aria-labelledby="tab-compass"
		hidden={activeTab !== 'compass'}
	>
		<CompassTab onApplyToContext={handleCompassApply} />
	</div>

	<!-- LLM Chat Panel -->
	<section class="chat-section">
		<div class="panel">
			<div class="panel-header">
				<h2>
					<i class="fa-solid fa-comments" aria-hidden="true"></i>
					Chat with AI
					<span class="chat-persona-badge">{context.constitution.persona}</span>
				</h2>
				<span class="chat-hint">Context-aware — changes above shape responses below</span>
			</div>
			<div class="chat-container">
				<StreamingChat
					systemContext={context as unknown as Record<string, unknown>}
					constitutionId={context.constitution.id}
					persona={context.constitution.persona}
					fallbackResponse="This is a demo response. With a live API key, the AI would adapt its tone and suggestions based on your current VCP context — your energy level, constraints, preferences, and persona."
					placeholder="Ask the AI something — it knows your VCP context..."
				/>
			</div>
		</div>
	</section>

	<!-- WASM Token Inspector -->
	{#if wasmReady}
		<section class="wasm-inspector">
			<div class="panel">
				<div class="panel-header">
					<h2>
						<i class="fa-solid fa-microchip" aria-hidden="true"></i>
						Token Inspector
						<span class="wasm-badge">Rust SDK (WASM)</span>
					</h2>
					<div class="inspector-tabs" role="tablist">
						<button class="inspector-tab-btn" class:active={inspectorTab === 'parse'} onclick={() => (inspectorTab = 'parse')} role="tab" aria-selected={inspectorTab === 'parse'}>Parse Token</button>
						<button class="inspector-tab-btn" class:active={inspectorTab === 'wire'} onclick={() => (inspectorTab = 'wire')} role="tab" aria-selected={inspectorTab === 'wire'}>Wire Decoder</button>
						<button class="inspector-tab-btn" class:active={inspectorTab === 'identity'} onclick={() => (inspectorTab = 'identity')} role="tab" aria-selected={inspectorTab === 'identity'}>Identity Validator</button>
					</div>
				</div>

				<div class="inspector-content">
					{#if inspectorTab === 'parse'}
						{#if wasmParseResult}
							<div class="result-header">
								{#if wasmParseResult.success}
									<span class="result-badge result-pass"><i class="fa-solid fa-check" aria-hidden="true"></i> Parsed</span>
								{:else}
									<span class="result-badge result-fail"><i class="fa-solid fa-xmark" aria-hidden="true"></i> Parse Error</span>
								{/if}
								{#if wasmParseResult.timeUs !== undefined}
									<span class="perf-badge">{wasmParseResult.timeUs}&#181;s</span>
								{/if}
							</div>
							{#if wasmParseResult.success && wasmParseResult.data}
								<pre class="result-json">{JSON.stringify(wasmParseResult.data, null, 2)}</pre>
							{:else if wasmParseResult.error}
								<pre class="result-error">{wasmParseResult.error}</pre>
							{/if}
						{:else}
							<p class="text-muted">Build a token above to see the parsed structure.</p>
						{/if}

					{:else if inspectorTab === 'wire'}
						<div class="wire-input-group">
							<label class="label" for="wire-input">Context Wire Format</label>
							<input id="wire-input" type="text" class="input" placeholder="&#x23F0;&#x1F305;|&#x1F3E1;&#x2016;&#x1F9E0;focused:4|&#x1F4AD;calm:3" bind:value={wireInput} onkeydown={(e) => { if (e.key === 'Enter') decodeWire(); }} />
							<div class="wire-actions">
								<button class="btn btn-primary btn-sm" onclick={decodeWire}>
									<i class="fa-solid fa-code" aria-hidden="true"></i> Decode
								</button>
								<button class="btn btn-ghost btn-sm" onclick={() => { wireInput = toWireFormat(context); decodeWire(); }}>Use Current Token</button>
							</div>
						</div>
						{#if wireDecodeResult}
							<div class="result-header">
								{#if wireDecodeResult.success}
									<span class="result-badge result-pass"><i class="fa-solid fa-check" aria-hidden="true"></i> Decoded</span>
								{:else}
									<span class="result-badge result-fail"><i class="fa-solid fa-xmark" aria-hidden="true"></i> Decode Error</span>
								{/if}
							</div>
							{#if wireDecodeResult.success && wireDecodeResult.data}
								<pre class="result-json">{JSON.stringify(wireDecodeResult.data, null, 2)}</pre>
							{:else if wireDecodeResult.error}
								<pre class="result-error">{wireDecodeResult.error}</pre>
							{/if}
						{/if}

					{:else if inspectorTab === 'identity'}
						<div class="wire-input-group">
							<label class="label" for="identity-input">VCP/I Identity Token</label>
							<input id="identity-input" type="text" class="input" placeholder="family.safe.guide@1.2.0" bind:value={identityInput} onkeydown={(e) => { if (e.key === 'Enter') validateIdentity(); }} />
							<button class="btn btn-primary btn-sm" onclick={validateIdentity}>
								<i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Validate
							</button>
						</div>
						{#if identityResult}
							<div class="result-header">
								{#if identityResult.success}
									<span class="result-badge result-pass"><i class="fa-solid fa-check" aria-hidden="true"></i> Valid</span>
								{:else}
									<span class="result-badge result-fail"><i class="fa-solid fa-xmark" aria-hidden="true"></i> Invalid</span>
								{/if}
							</div>
							{#if identityResult.success && identityResult.data}
								<pre class="result-json">{JSON.stringify(identityResult.data, null, 2)}</pre>
							{:else if identityResult.error}
								<pre class="result-error">{identityResult.error}</pre>
							{/if}
						{/if}
					{/if}
				</div>
			</div>
		</section>
	{/if}

	<!-- Try in a Demo -->
	<section class="try-demo-section">
		<h3><i class="fa-solid fa-play" aria-hidden="true"></i> Try This Context in a Demo</h3>
		<p class="text-muted">See how the context you've built here would work in a real scenario.</p>
		<div class="demo-links">
			<a href="/demos/campion" class="demo-link-card">
				<i class="fa-solid fa-building" aria-hidden="true"></i>
				<span>Enterprise — Corporate Training</span>
				<span class="demo-link-concept">Automatic context switching</span>
			</a>
			<a href="/demos/noor" class="demo-link-card">
				<i class="fa-solid fa-network-wired" aria-hidden="true"></i>
				<span>Multi-agent — Coordinated AI</span>
				<span class="demo-link-concept">Cross-agent context negotiation</span>
			</a>
			<a href="/demos/ren" class="demo-link-card">
				<i class="fa-solid fa-microscope" aria-hidden="true"></i>
				<span>Epistemic — Research Integrity</span>
				<span class="demo-link-concept">Source-aware reasoning</span>
			</a>
		</div>
	</section>
</div>

<style>
	/* WebMCP Note */
	.webmcp-note {
		display: flex; align-items: center; gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md); background: var(--color-primary-muted);
		border: 1px solid rgba(99, 102, 241, 0.2); border-radius: var(--radius-md);
		font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-lg);
	}
	.webmcp-note i { color: var(--color-primary); font-size: 1rem; }
	.webmcp-note strong { color: var(--color-text); }
	.webmcp-note code { padding: 1px 4px; background: rgba(255, 255, 255, 0.08); border-radius: 3px; font-size: 0.8em; }
	.polyfill-badge { display: inline-flex; align-items: center; padding: 1px 6px; background: var(--color-success-muted); color: var(--color-success); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 500; }

	/* Tab Bar */
	.tab-bar {
		display: flex; gap: 2px; padding: 3px;
		background: var(--color-bg-card); border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-md); margin-bottom: var(--space-lg);
	}

	.tab-btn {
		flex: 1; display: flex; align-items: center; justify-content: center; gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md); font-size: var(--text-sm); font-weight: 700;
		background: transparent; border: none; color: var(--color-text-muted);
		cursor: pointer; border-radius: var(--radius-sm); transition: all var(--transition-fast);
	}

	.tab-btn:hover { color: var(--color-text); background: rgba(255, 255, 255, 0.05); }
	.tab-btn.active { background: var(--color-primary-muted); color: var(--color-primary); }
	.tab-btn i { font-size: 0.875rem; }

	/* Panel shared */
	.panel {
		background: var(--color-bg-card); border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;
	}

	.panel-header {
		display: flex; justify-content: space-between; align-items: center;
		padding: var(--space-md) var(--space-lg); background: rgba(255, 255, 255, 0.03);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.panel-header h2 { font-size: 1rem; margin: 0; display: flex; align-items: center; gap: var(--space-sm); }

	/* Chat Section */
	.chat-section { margin-top: var(--space-2xl); margin-bottom: var(--space-2xl); }
	.chat-section .panel-header h2 { display: flex; align-items: center; gap: var(--space-sm); }

	.chat-persona-badge {
		font-size: 0.625rem; padding: 2px 8px;
		background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
		color: white; border-radius: var(--radius-sm); text-transform: capitalize;
		letter-spacing: 0.05em; font-weight: 600;
	}

	.chat-hint { font-size: var(--text-xs); color: var(--color-text-muted); }
	.chat-container { height: 500px; }

	/* WASM Inspector */
	.wasm-inspector { margin-bottom: var(--space-2xl); }

	.wasm-badge {
		font-size: 0.625rem; padding: 2px 8px;
		background: linear-gradient(135deg, #f97316, #ef4444);
		color: white; border-radius: var(--radius-sm); text-transform: uppercase;
		letter-spacing: 0.05em; font-weight: 600; margin-left: var(--space-sm);
	}

	.inspector-tabs {
		display: flex; gap: 2px; background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-sm); padding: 2px;
	}

	.inspector-tab-btn {
		padding: var(--space-xs) var(--space-sm); font-size: 0.75rem;
		background: transparent; border: none; color: var(--color-text-muted);
		cursor: pointer; border-radius: var(--radius-sm); transition: all var(--transition-fast);
	}

	.inspector-tab-btn:hover { color: var(--color-text); }
	.inspector-tab-btn.active { background: var(--color-primary-muted); color: var(--color-primary); }

	.inspector-content { padding: var(--space-lg); }

	.result-header { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-md); }

	.result-badge {
		display: inline-flex; align-items: center; gap: var(--space-xs);
		padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm);
		font-size: 0.75rem; font-weight: 600;
	}

	.result-pass { background: var(--color-success-muted); color: var(--color-success); }
	.result-fail { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

	.perf-badge {
		font-family: var(--font-mono); font-size: 0.6875rem; padding: 2px 6px;
		background: rgba(255, 255, 255, 0.05); border-radius: var(--radius-sm);
		color: var(--color-text-muted);
	}

	.result-json {
		background: var(--color-bg); padding: var(--space-md); border-radius: var(--radius-md);
		font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.5;
		overflow-x: auto; margin: 0; max-height: 400px; overflow-y: auto;
	}

	.result-error {
		background: rgba(239, 68, 68, 0.1); padding: var(--space-md); border-radius: var(--radius-md);
		font-family: var(--font-mono); font-size: 0.75rem; color: #ef4444; margin: 0;
	}

	.wire-input-group { display: flex; flex-direction: column; gap: var(--space-sm); margin-bottom: var(--space-md); }
	.wire-actions { display: flex; gap: var(--space-sm); }

	/* Try Demo Section */
	.try-demo-section {
		margin-top: var(--space-2xl); padding-top: var(--space-xl);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.try-demo-section h3 { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm); }

	.demo-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin-top: var(--space-md); }

	.demo-link-card {
		display: flex; flex-direction: column; align-items: center; gap: var(--space-sm);
		padding: var(--space-lg); background: var(--color-bg-card);
		border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-lg);
		text-decoration: none; color: var(--color-text); text-align: center;
		transition: all var(--transition-normal);
	}

	.demo-link-card:hover { border-color: var(--color-primary); transform: translateY(-2px); text-decoration: none; }
	.demo-link-card i { font-size: 1.5rem; color: var(--color-primary); }
	.demo-link-concept { font-size: 0.75rem; color: var(--color-text-muted); }

	@media (max-width: 900px) {
		.inspector-tabs { flex-wrap: wrap; }
		.wasm-inspector .panel-header { flex-direction: column; align-items: flex-start; gap: var(--space-sm); }
	}

	@media (max-width: 768px) {
		.demo-links { grid-template-columns: 1fr; }
	}

	@media (max-width: 640px) {
		.tab-bar { flex-direction: column; }
	}
</style>
