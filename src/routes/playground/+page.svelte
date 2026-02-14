<script lang="ts">
	/**
	 * VCP Playground - Interactive token builder and inspector
	 */
	import { encodeContextToCSM1, getEmojiLegend, getTransmissionSummary, toWireFormat } from '$lib/vcp/token';
	import type { VCPContext, ConstraintFlags, PortablePreferences, PersonalState, CognitiveState, EmotionalTone, EnergyLevel, PerceivedUrgency, BodySignals } from '$lib/vcp/types';
	import { Breadcrumb, ContextLifecycleIndicator } from '$lib/components/shared';
	import { loadVcpWasm, type VcpWasmModule } from '$lib/vcp/wasmLoader';
	import { isPolyfillRequested } from '$lib/webmcp/polyfill';

	const polyfillActive = $derived(typeof window !== 'undefined' && isPolyfillRequested());

	const breadcrumbItems = [
		{ label: 'Playground', icon: 'fa-sliders' }
	];

	// Default context for playground
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
	const summary = $derived(getTransmissionSummary(context));
	const legend = getEmojiLegend();

	// Personas for quick selection
	const personas = [
		{ id: 'muse', name: 'Muse', iconClass: 'fa-palette' },
		{ id: 'ambassador', name: 'Ambassador', iconClass: 'fa-handshake' },
		{ id: 'godparent', name: 'Godparent', iconClass: 'fa-shield' },
		{ id: 'sentinel', name: 'Sentinel', iconClass: 'fa-eye' },
		{ id: 'anchor', name: 'Anchor', iconClass: 'fa-anchor' },
		{ id: 'nanny', name: 'Nanny', iconClass: 'fa-child' },
		{ id: 'steward', name: 'Steward', iconClass: 'fa-handshake-angle' }
	];

	function updateConstraint(key: keyof ConstraintFlags, value: boolean) {
		context.constraints = { ...context.constraints, [key]: value };
	}

	function updatePreference(key: keyof PortablePreferences, value: string) {
		context.portable_preferences = { ...context.portable_preferences, [key]: value };
	}

	// v3.1 personal state dimension definitions
	const personalStateDims = [
		{ key: 'cognitive_state' as const, emoji: '🧠', label: 'Cognitive State', options: ['focused', 'distracted', 'overloaded', 'foggy', 'reflective'] as CognitiveState[] },
		{ key: 'emotional_tone' as const, emoji: '💭', label: 'Emotional Tone', options: ['calm', 'tense', 'frustrated', 'neutral', 'uplifted'] as EmotionalTone[] },
		{ key: 'energy_level' as const, emoji: '🔋', label: 'Energy Level', options: ['rested', 'low_energy', 'fatigued', 'wired', 'depleted'] as EnergyLevel[] },
		{ key: 'perceived_urgency' as const, emoji: '⚡', label: 'Perceived Urgency', options: ['unhurried', 'time_aware', 'pressured', 'critical'] as PerceivedUrgency[] },
		{ key: 'body_signals' as const, emoji: '🩺', label: 'Body Signals', options: ['neutral', 'discomfort', 'pain', 'unwell', 'recovering'] as BodySignals[] }
	];

	function updatePersonalState(key: keyof PersonalState, field: 'value' | 'intensity', newValue: string | number) {
		const current = context.personal_state?.[key] ?? { value: '', intensity: 3 };
		context.personal_state = {
			...context.personal_state,
			[key]: { ...current, [field]: newValue, declared_at: new Date().toISOString() }
		};
	}

	function togglePin(dimension: string, pinned: boolean) {
		const key = dimension as keyof PersonalState;
		const current = context.personal_state?.[key];
		if (!current) return;
		context.personal_state = {
			...context.personal_state,
			[key]: { ...current, pinned }
		};
	}

	function getIntensityLabel(intensity: number): string {
		if (intensity >= 4) return 'High';
		if (intensity >= 3) return 'Moderate';
		if (intensity >= 2) return 'Low';
		return 'Minimal';
	}

	// Copy feedback state
	let copyFeedback = $state('');
	let copyTimeout: ReturnType<typeof setTimeout>;

	/**
	 * ACCESSIBILITY FIX 2026-02-03: Clipboard copy with fallback for HTTP contexts
	 * navigator.clipboard requires HTTPS or localhost. Fallback uses legacy execCommand.
	 */
	async function copyToClipboard(text: string): Promise<boolean> {
		// Try modern clipboard API first
		if (navigator.clipboard && window.isSecureContext) {
			try {
				await navigator.clipboard.writeText(text);
				return true;
			} catch (err) {
				console.warn('Clipboard API failed, trying fallback:', err);
			}
		}

		// Fallback for HTTP or older browsers using execCommand
		try {
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.position = 'fixed';
			textArea.style.left = '-9999px';
			textArea.style.top = '-9999px';
			textArea.setAttribute('readonly', '');
			document.body.appendChild(textArea);
			textArea.select();
			textArea.setSelectionRange(0, text.length);

			const success = document.execCommand('copy');
			document.body.removeChild(textArea);

			if (success) {
				return true;
			}
		} catch (err) {
			console.error('Fallback clipboard copy failed:', err);
		}

		return false;
	}

	async function copyToken() {
		const success = await copyToClipboard(token);
		if (success) {
			copyFeedback = 'Copied!';
		} else {
			// Show helpful message for users on HTTP
			copyFeedback = window.isSecureContext
				? 'Copy failed - please try again'
				: 'Copy requires HTTPS. Please select and copy manually.';
		}
		clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => {
			copyFeedback = '';
		}, success ? 2000 : 4000);
	}

	async function sharePlayground() {
		// Encode current context as URL parameter
		const encoded = btoa(JSON.stringify({
			p: context.public_profile,
			c: context.constraints,
			pp: context.portable_preferences,
			const: context.constitution
		}));
		const url = `${window.location.origin}/playground?ctx=${encoded}`;
		const success = await copyToClipboard(url);
		copyFeedback = success ? 'Link copied!' : 'Copy failed - URL shown in console';
		if (!success) {
			console.log('Share URL:', url);
		}
		clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => {
			copyFeedback = '';
		}, 2000);
	}

	function resetContext() {
		context = {
			...context,
			public_profile: {
				display_name: '',
				goal: '',
				experience: 'beginner',
				learning_style: 'hands_on',
				pace: 'steady',
				motivation: undefined
			},
			constraints: {
				time_limited: false,
				budget_limited: false,
				noise_restricted: false,
				energy_variable: false,
				schedule_irregular: false
			},
			portable_preferences: {
				noise_mode: 'normal',
				session_length: '30_minutes',
				budget_range: 'medium',
				feedback_style: 'encouraging'
			},
			personal_state: {
				cognitive_state: { value: 'focused', intensity: 3 },
				emotional_tone: { value: 'neutral', intensity: 2 },
				energy_level: { value: 'rested', intensity: 2 },
				perceived_urgency: { value: 'unhurried', intensity: 1 },
				body_signals: { value: 'neutral', intensity: 1 }
			}
		};
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
			loadVcpWasm().then((mod) => {
				wasmMod = mod;
			});
		}
	});

	// Auto-parse the token whenever it changes and WASM is ready
	$effect(() => {
		if (!wasmMod || !token) {
			wasmParseResult = null;
			return;
		}
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
		if (!wireInput.trim()) {
			wireDecodeResult = null;
			return;
		}
		if (!wasmMod) {
			wireDecodeResult = { success: false, error: 'WASM not available' };
			return;
		}
		try {
			const parsed = wasmMod.parse_context_wire(wireInput);
			wireDecodeResult = { success: true, data: parsed };
		} catch (e) {
			wireDecodeResult = { success: false, error: String(e) };
		}
	}

	function validateIdentity() {
		if (!identityInput.trim()) {
			identityResult = null;
			return;
		}
		if (!wasmMod) {
			identityResult = { success: false, error: 'WASM not available' };
			return;
		}
		try {
			const parsed = wasmMod.validate_token(identityInput);
			identityResult = { success: true, data: parsed };
		} catch (e) {
			identityResult = { success: false, error: String(e) };
		}
	}

	function loadExample(type: 'consumer' | 'enterprise' | 'values' | 'multiagent' | 'governance' | 'epistemic') {
		if (type === 'consumer') {
			context = {
				...context,
				public_profile: {
					display_name: 'Consumer User',
					goal: 'product_research',
					experience: 'intermediate',
					learning_style: 'hands_on',
					pace: 'steady',
					motivation: 'personal_use'
				},
				constraints: {
					time_limited: true,
					budget_limited: true,
					noise_restricted: false,
					energy_variable: false,
					schedule_irregular: false
				},
				portable_preferences: {
					noise_mode: 'normal',
					session_length: '30_minutes',
					budget_range: 'medium',
					feedback_style: 'encouraging'
				},
				constitution: {
					id: 'consumer.personal.guide',
					version: '1.0.0',
					persona: 'muse',
					adherence: 3,
					scopes: ['privacy', 'commerce', 'health']
				},
				personal_state: {
					cognitive_state: { value: 'focused', intensity: 3 },
					emotional_tone: { value: 'calm', intensity: 2 },
					energy_level: { value: 'rested', intensity: 3 },
					perceived_urgency: { value: 'time_aware', intensity: 2 },
					body_signals: { value: 'neutral', intensity: 1 }
				}
			};
		} else if (type === 'enterprise') {
			context = {
				...context,
				public_profile: {
					display_name: 'Enterprise Admin',
					goal: 'compliance_deployment',
					experience: 'advanced',
					learning_style: 'reading',
					pace: 'intensive',
					motivation: 'career'
				},
				constraints: {
					time_limited: true,
					budget_limited: false,
					noise_restricted: false,
					energy_variable: true,
					schedule_irregular: true
				},
				portable_preferences: {
					noise_mode: 'normal',
					session_length: '30_minutes',
					budget_range: 'high',
					feedback_style: 'encouraging'
				},
				constitution: {
					id: 'work.enterprise.compliance',
					version: '1.0.0',
					persona: 'ambassador',
					adherence: 5,
					scopes: ['work', 'compliance', 'privacy']
				},
				personal_state: {
					cognitive_state: { value: 'focused', intensity: 4 },
					emotional_tone: { value: 'tense', intensity: 3 },
					energy_level: { value: 'fatigued', intensity: 3 },
					perceived_urgency: { value: 'pressured', intensity: 4 },
					body_signals: { value: 'neutral', intensity: 1 }
				}
			};
		} else if (type === 'values') {
			context = {
				...context,
				public_profile: {
					display_name: 'Values Explorer',
					goal: 'ethical_decision_making',
					experience: 'intermediate',
					learning_style: 'reading',
					pace: 'steady',
					motivation: 'achievement'
				},
				constraints: {
					time_limited: false,
					budget_limited: false,
					noise_restricted: false,
					energy_variable: false,
					schedule_irregular: false
				},
				portable_preferences: {
					noise_mode: 'quiet_preferred',
					session_length: '30_minutes',
					budget_range: 'medium',
					feedback_style: 'encouraging'
				},
				constitution: {
					id: 'personal.values.deliberation',
					version: '1.0.0',
					persona: 'steward',
					adherence: 4,
					scopes: ['ethics', 'stewardship', 'privacy']
				},
				personal_state: {
					cognitive_state: { value: 'reflective', intensity: 4 },
					emotional_tone: { value: 'calm', intensity: 3 },
					energy_level: { value: 'rested', intensity: 3 },
					perceived_urgency: { value: 'unhurried', intensity: 1 },
					body_signals: { value: 'neutral', intensity: 1 }
				}
			};
		} else if (type === 'multiagent') {
			context = {
				...context,
				public_profile: {
					display_name: 'Agent Coordinator',
					goal: 'multi_agent_orchestration',
					experience: 'expert',
					learning_style: 'reading',
					pace: 'intensive',
					motivation: 'career'
				},
				constraints: {
					time_limited: true,
					budget_limited: true,
					noise_restricted: false,
					energy_variable: false,
					schedule_irregular: true
				},
				portable_preferences: {
					noise_mode: 'normal',
					session_length: '30_minutes',
					budget_range: 'medium',
					feedback_style: 'encouraging'
				},
				constitution: {
					id: 'work.multiagent.coordination',
					version: '1.0.0',
					persona: 'sentinel',
					adherence: 5,
					scopes: ['coordination', 'safety', 'transparency']
				},
				personal_state: {
					cognitive_state: { value: 'focused', intensity: 4 },
					emotional_tone: { value: 'neutral', intensity: 2 },
					energy_level: { value: 'rested', intensity: 3 },
					perceived_urgency: { value: 'time_aware', intensity: 3 },
					body_signals: { value: 'neutral', intensity: 1 }
				}
			};
		} else if (type === 'governance') {
			context = {
				...context,
				public_profile: {
					display_name: 'Policy Officer',
					goal: 'regulatory_oversight',
					experience: 'advanced',
					learning_style: 'reading',
					pace: 'steady',
					motivation: 'achievement'
				},
				constraints: {
					time_limited: false,
					budget_limited: false,
					noise_restricted: false,
					energy_variable: false,
					schedule_irregular: false
				},
				portable_preferences: {
					noise_mode: 'normal',
					session_length: '30_minutes',
					budget_range: 'unlimited',
					feedback_style: 'encouraging'
				},
				constitution: {
					id: 'governance.policy.oversight',
					version: '1.0.0',
					persona: 'godparent',
					adherence: 5,
					scopes: ['governance', 'compliance', 'transparency']
				},
				personal_state: {
					cognitive_state: { value: 'focused', intensity: 3 },
					emotional_tone: { value: 'calm', intensity: 2 },
					energy_level: { value: 'rested', intensity: 3 },
					perceived_urgency: { value: 'time_aware', intensity: 2 },
					body_signals: { value: 'neutral', intensity: 1 }
				}
			};
		} else {
			context = {
				...context,
				public_profile: {
					display_name: 'Researcher',
					goal: 'knowledge_synthesis',
					experience: 'advanced',
					learning_style: 'reading',
					pace: 'steady',
					motivation: 'achievement'
				},
				constraints: {
					time_limited: false,
					budget_limited: true,
					noise_restricted: true,
					energy_variable: true,
					schedule_irregular: false
				},
				portable_preferences: {
					noise_mode: 'quiet_preferred',
					session_length: '30_minutes',
					budget_range: 'low',
					feedback_style: 'encouraging'
				},
				constitution: {
					id: 'epistemic.research.integrity',
					version: '1.0.0',
					persona: 'anchor',
					adherence: 4,
					scopes: ['epistemic', 'accuracy', 'privacy']
				},
				personal_state: {
					cognitive_state: { value: 'reflective', intensity: 4 },
					emotional_tone: { value: 'calm', intensity: 2 },
					energy_level: { value: 'low_energy', intensity: 3 },
					perceived_urgency: { value: 'unhurried', intensity: 1 },
					body_signals: { value: 'neutral', intensity: 1 }
				}
			};
		}
	}
</script>

<svelte:head>
	<title>Playground - VCP</title>
	<meta name="description" content="Interactive VCP token builder and inspector." />
</svelte:head>

<div class="container">
	<Breadcrumb items={breadcrumbItems} />

	<section class="page-hero">
		<h1>VCP Playground</h1>
		<p class="page-hero-subtitle">
			Build context tokens interactively. Toggle constraints, change preferences, and watch the token update in real-time.
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

	<!-- Quick Load Examples -->
	<section class="example-loaders">
		<span class="example-label">Quick load:</span>
		<button class="btn btn-ghost btn-sm" onclick={() => loadExample('consumer')}>
			<i class="fa-solid fa-cart-shopping" aria-hidden="true"></i> Consumer
		</button>
		<button class="btn btn-ghost btn-sm" onclick={() => loadExample('enterprise')}>
			<i class="fa-solid fa-building" aria-hidden="true"></i> Enterprise
		</button>
		<button class="btn btn-ghost btn-sm" onclick={() => loadExample('values')}>
			<i class="fa-solid fa-scale-balanced" aria-hidden="true"></i> Values &amp; Decisions
		</button>
		<button class="btn btn-ghost btn-sm" onclick={() => loadExample('multiagent')}>
			<i class="fa-solid fa-network-wired" aria-hidden="true"></i> Multi-agent
		</button>
		<button class="btn btn-ghost btn-sm" onclick={() => loadExample('governance')}>
			<i class="fa-solid fa-landmark" aria-hidden="true"></i> Governance
		</button>
		<button class="btn btn-ghost btn-sm" onclick={() => loadExample('epistemic')}>
			<i class="fa-solid fa-microscope" aria-hidden="true"></i> Epistemic
		</button>
	</section>

	<div class="playground-grid">
		<!-- Controls Panel -->
		<div class="panel controls-panel">
			<div class="panel-header">
				<h2>Context Builder</h2>
				<button class="btn btn-ghost btn-sm" onclick={resetContext}>Reset</button>
			</div>

			<!-- Profile Section -->
			<section class="control-section">
				<h3>Profile</h3>
				<div class="control-group">
					<label class="label" for="display-name">Display Name</label>
					<input
						id="display-name"
						type="text"
						class="input"
						bind:value={context.public_profile.display_name}
					/>
				</div>
				<div class="control-group">
					<label class="label" for="goal">Goal</label>
					<input
						id="goal"
						type="text"
						class="input"
						bind:value={context.public_profile.goal}
					/>
				</div>
				<div class="control-row">
					<div class="control-group">
						<label class="label" for="experience">Experience</label>
						<select id="experience" class="input select" bind:value={context.public_profile.experience}>
							<option value="beginner">Beginner</option>
							<option value="intermediate">Intermediate</option>
							<option value="advanced">Advanced</option>
							<option value="expert">Expert</option>
						</select>
					</div>
					<div class="control-group">
						<label class="label" for="style">Learning Style</label>
						<select id="style" class="input select" bind:value={context.public_profile.learning_style}>
							<option value="visual">Visual</option>
							<option value="auditory">Auditory</option>
							<option value="hands_on">Hands-on</option>
							<option value="reading">Reading</option>
							<option value="mixed">Mixed</option>
						</select>
					</div>
				</div>
			</section>

			<!-- Constitution Section -->
			<section class="control-section">
				<h3>Constitution</h3>
				<fieldset class="control-group">
					<legend class="label">Persona</legend>
					<div class="persona-grid" role="radiogroup" aria-label="Select persona">
						{#each personas as persona, index}
							<button
								class="persona-btn"
								class:active={context.constitution.persona === persona.id}
								onclick={() => (context.constitution.persona = persona.id as any)}
								onkeydown={(e) => {
									const btns = e.currentTarget.parentElement?.querySelectorAll('.persona-btn');
									if (!btns) return;
									let nextIndex = index;
									if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
										e.preventDefault();
										nextIndex = (index + 1) % personas.length;
									} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
										e.preventDefault();
										nextIndex = (index - 1 + personas.length) % personas.length;
									}
									if (nextIndex !== index) {
										(btns[nextIndex] as HTMLElement)?.focus();
										context.constitution.persona = personas[nextIndex].id as any;
									}
								}}
								role="radio"
								aria-checked={context.constitution.persona === persona.id}
								tabindex={context.constitution.persona === persona.id ? 0 : -1}
							>
								<span class="persona-icon"><i class="fa-solid {persona.iconClass}" aria-hidden="true"></i></span>
								<span class="persona-name">{persona.name}</span>
							</button>
						{/each}
					</div>
				</fieldset>
				<div class="control-group">
					<label class="label" for="adherence">Adherence Level: {context.constitution.adherence}</label>
					<input
						id="adherence"
						type="range"
						min="1"
						max="5"
						bind:value={context.constitution.adherence}
						class="slider"
					/>
				</div>
			</section>

			<!-- Constraints Section -->
			<section class="control-section">
				<h3>Constraint Flags</h3>
				<div class="checkbox-grid">
					<label class="checkbox-label">
						<input
							type="checkbox"
							checked={context.constraints?.time_limited}
							onchange={(e) => updateConstraint('time_limited', e.currentTarget.checked)}
						/>
						<span><i class="fa-solid fa-clock" aria-hidden="true"></i> Time Limited</span>
					</label>
					<label class="checkbox-label">
						<input
							type="checkbox"
							checked={context.constraints?.budget_limited}
							onchange={(e) => updateConstraint('budget_limited', e.currentTarget.checked)}
						/>
						<span><i class="fa-solid fa-wallet" aria-hidden="true"></i> Budget Limited</span>
					</label>
					<label class="checkbox-label">
						<input
							type="checkbox"
							checked={context.constraints?.noise_restricted}
							onchange={(e) => updateConstraint('noise_restricted', e.currentTarget.checked)}
						/>
						<span><i class="fa-solid fa-volume-xmark" aria-hidden="true"></i> Noise Restricted</span>
					</label>
					<label class="checkbox-label">
						<input
							type="checkbox"
							checked={context.constraints?.energy_variable}
							onchange={(e) => updateConstraint('energy_variable', e.currentTarget.checked)}
						/>
						<span><i class="fa-solid fa-bolt" aria-hidden="true"></i> Energy Variable</span>
					</label>
					<label class="checkbox-label">
						<input
							type="checkbox"
							checked={context.constraints?.schedule_irregular}
							onchange={(e) => updateConstraint('schedule_irregular', e.currentTarget.checked)}
						/>
						<span><i class="fa-solid fa-calendar" aria-hidden="true"></i> Schedule Irregular</span>
					</label>
				</div>
			</section>

			<!-- Preferences Section -->
			<section class="control-section">
				<h3>Preferences</h3>
				<div class="control-row">
					<div class="control-group">
						<label class="label" for="noise-mode">Noise Mode</label>
						<select
							id="noise-mode"
							class="input select"
							value={context.portable_preferences?.noise_mode}
							onchange={(e) => updatePreference('noise_mode', e.currentTarget.value as any)}
						>
							<option value="normal">Normal</option>
							<option value="quiet_preferred">Quiet Preferred</option>
							<option value="silent_required">Silent Required</option>
						</select>
					</div>
					<div class="control-group">
						<label class="label" for="budget">Budget Range</label>
						<select
							id="budget"
							class="input select"
							value={context.portable_preferences?.budget_range}
							onchange={(e) => updatePreference('budget_range', e.currentTarget.value as any)}
						>
							<option value="unlimited">Unlimited</option>
							<option value="high">High</option>
							<option value="medium">Medium</option>
							<option value="low">Low</option>
							<option value="free_only">Free Only</option>
						</select>
					</div>
				</div>
			</section>

			<!-- Personal State Dimensions (v3.1) -->
			<section class="control-section personal-state-section">
				<h3>
					<button type="button" class="has-tooltip tooltip-trigger" data-tooltip="5 categorical dimensions with 1-5 intensity — how you are right now shapes how the AI communicates" aria-label="Personal State: 5 categorical dimensions with intensity that shape AI communication">Personal State</button>
					<span class="badge badge-new">v3.1</span>
				</h3>
				<p class="personal-state-intro">How are you right now? These shape <em>how</em> the AI communicates.</p>

				<div class="personal-state-presets">
					<span class="preset-label">Quick states:</span>
					<button class="btn btn-ghost btn-xs" onclick={() => { context.personal_state = { cognitive_state: { value: 'focused', intensity: 3 }, emotional_tone: { value: 'calm', intensity: 2 }, energy_level: { value: 'rested', intensity: 3 }, perceived_urgency: { value: 'unhurried', intensity: 2 }, body_signals: { value: 'neutral', intensity: 1 } }; }}>
						Normal
					</button>
					<button class="btn btn-ghost btn-xs" onclick={() => { context.personal_state = { cognitive_state: { value: 'overloaded', intensity: 4 }, emotional_tone: { value: 'tense', intensity: 4 }, energy_level: { value: 'fatigued', intensity: 3 }, perceived_urgency: { value: 'pressured', intensity: 4 }, body_signals: { value: 'discomfort', intensity: 2 } }; }}>
						Stressed
					</button>
					<button class="btn btn-ghost btn-xs" onclick={() => { context.personal_state = { cognitive_state: { value: 'overloaded', intensity: 5 }, emotional_tone: { value: 'frustrated', intensity: 5 }, energy_level: { value: 'depleted', intensity: 4 }, perceived_urgency: { value: 'critical', intensity: 5 }, body_signals: { value: 'unwell', intensity: 3 } }; }}>
						Crisis
					</button>
					<button class="btn btn-ghost btn-xs" onclick={() => { context.personal_state = { cognitive_state: { value: 'foggy', intensity: 3 }, emotional_tone: { value: 'neutral', intensity: 4 }, energy_level: { value: 'depleted', intensity: 4 }, perceived_urgency: { value: 'unhurried', intensity: 1 }, body_signals: { value: 'unwell', intensity: 3 } }; }}>
						Grieving
					</button>
				</div>

				<div class="personal-state-dims">
					{#each personalStateDims as dim}
						{@const current = context.personal_state?.[dim.key]}
						{@const currentValue = current?.value ?? dim.options[0]}
						{@const intensity = current?.intensity ?? 3}
						<div class="ps-dim-group" class:high={intensity >= 4} class:medium={intensity === 3}>
							<div class="ps-dim-header">
								<span class="ps-emoji">{dim.emoji}</span>
								<label class="label" for="ps-{dim.key}">{dim.label}</label>
								<span class="ps-intensity" style="color: {intensity >= 4 ? 'var(--color-danger)' : intensity >= 3 ? 'var(--color-warning)' : 'var(--color-success)'}">
									{intensity}/5 · {getIntensityLabel(intensity)}
								</span>
							</div>
							<select
								id="ps-{dim.key}"
								class="ps-select"
								value={currentValue}
								onchange={(e) => updatePersonalState(dim.key, 'value', e.currentTarget.value)}
								aria-label="{dim.label} category"
							>
								{#each dim.options as opt}
									<option value={opt}>{opt.replace(/_/g, ' ')}</option>
								{/each}
							</select>
							<input
								type="range"
								min="1"
								max="5"
								step="1"
								value={intensity}
								oninput={(e) => updatePersonalState(dim.key, 'intensity', parseInt(e.currentTarget.value))}
								class="slider ps-range"
								aria-label="{dim.label} intensity"
							/>
						</div>
					{/each}
				</div>
			</section>

			<!-- Context Lifecycle Indicator -->
			{#if context.personal_state}
				<section class="control-section">
					<ContextLifecycleIndicator
						personalState={context.personal_state}
						onTogglePin={togglePin}
					/>
				</section>
			{/if}
		</div>

		<!-- Token Panel -->
		<div class="panel token-panel">
			<div class="panel-header">
				<h2>Generated Token</h2>
				<div class="panel-actions">
					{#if copyFeedback}
						<span class="copy-feedback">{copyFeedback}</span>
					{/if}
					<button class="btn btn-ghost btn-sm" onclick={sharePlayground} title="Copy shareable link" aria-label="Copy shareable link">
						<i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
					</button>
					<button class="btn btn-primary btn-sm" onclick={copyToken}>
						<i class="fa-solid fa-copy" aria-hidden="true"></i> Copy Token
					</button>
				</div>
			</div>

			<div class="token-display">
				<pre>{token}</pre>
			</div>

			<!-- Legend -->
			<div class="legend-section">
				<h3>Emoji Key</h3>
				<div class="legend-grid">
					{#each legend as item}
						<div class="legend-item">
							<span class="legend-emoji">{item.emoji}</span>
							<span class="legend-meaning">{item.meaning}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Transmission Summary -->
			<div class="summary-section">
				<h3>Transmission Summary</h3>
				<div class="summary-grid">
					<div class="summary-group">
						<h4 class="summary-label summary-transmitted">
							Transmitted ({summary.transmitted.length})
						</h4>
						<div class="field-list">
							{#each summary.transmitted as field}
								<span class="field-tag field-tag-shared">{field}</span>
							{/each}
						</div>
					</div>
					<div class="summary-group">
						<h4 class="summary-label summary-influencing">
							Influencing ({summary.influencing.length})
						</h4>
						<div class="field-list">
							{#each summary.influencing as field}
								<span class="field-tag field-tag-influence">{field}</span>
							{/each}
						</div>
					</div>
					<div class="summary-group">
						<h4 class="summary-label summary-withheld">
							Withheld ({summary.withheld.length})
						</h4>
						<div class="field-list">
							{#each summary.withheld as field}
								<span class="field-tag field-tag-withheld">{field}</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

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
						<button
							class="tab-btn"
							class:active={inspectorTab === 'parse'}
							onclick={() => (inspectorTab = 'parse')}
							role="tab"
							aria-selected={inspectorTab === 'parse'}
						>Parse Token</button>
						<button
							class="tab-btn"
							class:active={inspectorTab === 'wire'}
							onclick={() => (inspectorTab = 'wire')}
							role="tab"
							aria-selected={inspectorTab === 'wire'}
						>Wire Decoder</button>
						<button
							class="tab-btn"
							class:active={inspectorTab === 'identity'}
							onclick={() => (inspectorTab = 'identity')}
							role="tab"
							aria-selected={inspectorTab === 'identity'}
						>Identity Validator</button>
					</div>
				</div>

				<div class="inspector-content">
					{#if inspectorTab === 'parse'}
						<!-- Auto-parsed from the generated token above -->
						{#if wasmParseResult}
							<div class="result-header">
								{#if wasmParseResult.success}
									<span class="result-badge result-pass">
										<i class="fa-solid fa-check" aria-hidden="true"></i> Parsed
									</span>
								{:else}
									<span class="result-badge result-fail">
										<i class="fa-solid fa-xmark" aria-hidden="true"></i> Parse Error
									</span>
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
							<input
								id="wire-input"
								type="text"
								class="input"
								placeholder="&#x23F0;&#x1F305;|&#x1F3E1;&#x2016;&#x1F9E0;focused:4|&#x1F4AD;calm:3"
								bind:value={wireInput}
								onkeydown={(e) => { if (e.key === 'Enter') decodeWire(); }}
							/>
							<div class="wire-actions">
								<button class="btn btn-primary btn-sm" onclick={decodeWire}>
									<i class="fa-solid fa-code" aria-hidden="true"></i> Decode
								</button>
								<button class="btn btn-ghost btn-sm" onclick={() => { wireInput = toWireFormat(context); decodeWire(); }}>
									Use Current Token
								</button>
							</div>
						</div>
						{#if wireDecodeResult}
							<div class="result-header">
								{#if wireDecodeResult.success}
									<span class="result-badge result-pass">
										<i class="fa-solid fa-check" aria-hidden="true"></i> Decoded
									</span>
								{:else}
									<span class="result-badge result-fail">
										<i class="fa-solid fa-xmark" aria-hidden="true"></i> Decode Error
									</span>
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
							<input
								id="identity-input"
								type="text"
								class="input"
								placeholder="family.safe.guide@1.2.0"
								bind:value={identityInput}
								onkeydown={(e) => { if (e.key === 'Enter') validateIdentity(); }}
							/>
							<button class="btn btn-primary btn-sm" onclick={validateIdentity}>
								<i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Validate
							</button>
						</div>
						{#if identityResult}
							<div class="result-header">
								{#if identityResult.success}
									<span class="result-badge result-pass">
										<i class="fa-solid fa-check" aria-hidden="true"></i> Valid
									</span>
								{:else}
									<span class="result-badge result-fail">
										<i class="fa-solid fa-xmark" aria-hidden="true"></i> Invalid
									</span>
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
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--color-primary-muted);
		border: 1px solid rgba(99, 102, 241, 0.2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.webmcp-note i {
		color: var(--color-primary);
		font-size: 1rem;
	}

	.webmcp-note strong {
		color: var(--color-text);
	}

	.webmcp-note code {
		padding: 1px 4px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 3px;
		font-size: 0.8em;
	}

	.polyfill-badge {
		display: inline-flex;
		align-items: center;
		padding: 1px 6px;
		background: var(--color-success-muted);
		color: var(--color-success);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 500;
	}

	.playground-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-lg);
		margin-bottom: var(--space-2xl);
	}

	.panel {
		background: var(--color-bg-card);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
		overflow: hidden;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-md) var(--space-lg);
		background: rgba(255, 255, 255, 0.03);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.panel-header h2 {
		font-size: 1rem;
		margin: 0;
	}

	.controls-panel {
		max-height: 80vh;
		overflow-y: auto;
	}

	.control-section {
		padding: var(--space-lg);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.control-section:last-child {
		border-bottom: none;
	}

	.control-section h3 {
		font-size: 0.8125rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.control-group {
		margin-bottom: var(--space-md);
	}

	.control-group:last-child {
		margin-bottom: 0;
	}

	.control-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
	}

	fieldset.control-group {
		border: none;
		padding: 0;
		margin: 0 0 var(--space-md) 0;
	}

	fieldset.control-group legend {
		padding: 0;
		margin-bottom: var(--space-xs);
	}

	.persona-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-xs);
	}

	.persona-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm);
		background: var(--color-bg-elevated);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.persona-btn:hover {
		border-color: rgba(255, 255, 255, 0.2);
	}

	.persona-btn.active {
		border-color: var(--color-primary);
		background: var(--color-primary-muted);
	}

	.persona-icon {
		font-size: 1.25rem;
	}

	.persona-name {
		font-size: 0.6875rem;
		color: var(--color-text-muted);
	}

	.slider {
		width: 100%;
		accent-color: var(--color-primary);
	}

	.checkbox-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-sm);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.8125rem;
		cursor: pointer;
	}

	.token-panel {
		position: sticky;
		top: 80px;
		max-height: 80vh;
		overflow-y: auto;
	}

	.token-display {
		padding: var(--space-lg);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.token-display pre {
		background: var(--color-bg);
		padding: var(--space-md);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1.6;
		overflow-x: auto;
		margin: 0;
	}

	.legend-section,
	.summary-section {
		padding: var(--space-lg);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.legend-section h3,
	.summary-section h3 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.legend-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-sm);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.75rem;
	}

	.legend-emoji {
		font-size: 1rem;
	}

	.legend-meaning {
		color: var(--color-text-muted);
	}

	.summary-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.summary-label {
		font-size: 0.75rem;
		font-weight: 500;
		margin-bottom: var(--space-xs);
	}

	.summary-transmitted {
		color: var(--color-success);
	}

	.summary-influencing {
		color: var(--color-warning);
	}

	.summary-withheld {
		color: var(--color-danger);
	}

	.field-tag-influence {
		background: var(--color-warning-muted);
		color: var(--color-warning);
	}

	/* Example loaders */
	.example-loaders {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
		padding: var(--space-md);
		background: var(--color-bg-card);
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.example-label {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	/* Panel actions */
	.panel-actions {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.copy-feedback {
		font-size: var(--text-xs);
		color: var(--color-success);
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-success-muted);
		border-radius: var(--radius-sm);
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-4px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (max-width: 900px) {
		.playground-grid {
			grid-template-columns: 1fr;
		}

		.token-panel {
			position: static;
			order: -1; /* Show token first on mobile */
		}

		.controls-panel {
			order: 1;
		}
	}

	/* Personal state section styles */
	.personal-state-section h3 {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.badge-new {
		background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
		color: white;
		font-size: 0.625rem;
		padding: 2px 6px;
		border-radius: var(--radius-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}

	.personal-state-intro {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.personal-state-dims {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.ps-dim-group {
		background: rgba(255, 255, 255, 0.02);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-left: 3px solid var(--color-success);
		transition: border-color var(--transition-fast);
	}

	.ps-dim-group.medium {
		border-left-color: var(--color-warning);
	}

	.ps-dim-group.high {
		border-left-color: var(--color-danger);
	}

	.ps-dim-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.ps-emoji {
		font-size: 1.125rem;
	}

	.ps-dim-header .label {
		flex: 1;
		margin: 0;
	}

	.ps-intensity {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		min-width: 5rem;
		text-align: right;
	}

	.ps-select {
		width: 100%;
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-bg);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font-size: var(--text-sm);
		margin-bottom: var(--space-xs);
		text-transform: capitalize;
	}

	.ps-range {
		width: 100%;
		margin: var(--space-xs) 0;
	}

	.personal-state-presets {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs);
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-md);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.preset-label {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.btn-xs {
		padding: var(--space-xs) var(--space-sm);
		font-size: 0.6875rem;
	}

	@media (max-width: 640px) {
		.control-row {
			grid-template-columns: 1fr;
		}

		.persona-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.checkbox-grid {
			grid-template-columns: 1fr;
		}

		.example-loaders {
			flex-direction: column;
			align-items: stretch;
		}

		.panel-actions {
			flex-wrap: wrap;
		}

		.personal-state-presets {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* Try Demo Section */
	.try-demo-section {
		margin-top: var(--space-2xl);
		padding-top: var(--space-xl);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.try-demo-section h3 {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
	}

	.demo-links {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-md);
		margin-top: var(--space-md);
	}

	.demo-link-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-lg);
		background: var(--color-bg-card);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: var(--color-text);
		text-align: center;
		transition: all var(--transition-normal);
	}

	.demo-link-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		text-decoration: none;
	}

	.demo-link-card i {
		font-size: 1.5rem;
		color: var(--color-primary);
	}

	.demo-link-concept {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	@media (max-width: 768px) {
		.demo-links {
			grid-template-columns: 1fr;
		}
	}

	/* WASM Inspector */
	.wasm-inspector {
		margin-bottom: var(--space-2xl);
	}

	.wasm-badge {
		font-size: 0.625rem;
		padding: 2px 8px;
		background: linear-gradient(135deg, #f97316, #ef4444);
		color: white;
		border-radius: var(--radius-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
		margin-left: var(--space-sm);
	}

	.inspector-tabs {
		display: flex;
		gap: 2px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-sm);
		padding: 2px;
	}

	.tab-btn {
		padding: var(--space-xs) var(--space-sm);
		font-size: 0.75rem;
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.tab-btn:hover {
		color: var(--color-text);
	}

	.tab-btn.active {
		background: var(--color-primary-muted);
		color: var(--color-primary);
	}

	.inspector-content {
		padding: var(--space-lg);
	}

	.result-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.result-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.result-pass {
		background: var(--color-success-muted);
		color: var(--color-success);
	}

	.result-fail {
		background: rgba(239, 68, 68, 0.15);
		color: #ef4444;
	}

	.perf-badge {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		padding: 2px 6px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
	}

	.result-json {
		background: var(--color-bg);
		padding: var(--space-md);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.5;
		overflow-x: auto;
		margin: 0;
		max-height: 400px;
		overflow-y: auto;
	}

	.result-error {
		background: rgba(239, 68, 68, 0.1);
		padding: var(--space-md);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: #ef4444;
		margin: 0;
	}

	.wire-input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.wire-actions {
		display: flex;
		gap: var(--space-sm);
	}

	@media (max-width: 900px) {
		.inspector-tabs {
			flex-wrap: wrap;
		}

		.wasm-inspector .panel-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-sm);
		}
	}
</style>
