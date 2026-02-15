// @vitest-environment jsdom

/**
 * Integration tests for the VCP Playground page.
 *
 * Mocking strategy:
 * - WASM loader: mocked (no WASM in jsdom)
 * - Polyfill: mocked (no real URL params)
 * - Shared Svelte components: mocked as lightweight stubs (avoids deep render chains,
 *   interval timers, fetch warmups, and complex Svelte 5 child lifecycle in jsdom)
 * - $lib/vcp/token: uses real pure functions (no side effects)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';

// ---------------------------------------------------------------------------
// Mocks -- must be declared before any import that transitively touches them
// ---------------------------------------------------------------------------

vi.mock('$lib/vcp/wasmLoader', () => ({
	loadVcpWasm: vi.fn().mockResolvedValue(null)
}));

vi.mock('$lib/webmcp/polyfill', () => ({
	isPolyfillRequested: vi.fn().mockReturnValue(false)
}));

// Mock shared Svelte components as minimal HTML stubs so the Playground can
// render without pulling in StreamingChat's fetch warmup, ContextLifecycleIndicator's
// setInterval ticker, or Breadcrumb's icon dependencies.
//
// Svelte 5 calls components as plain functions (not with `new`), so stubs
// must be plain functions that append a DOM element to the target.
vi.mock('$lib/components/shared', () => {
	function makeStub(tag: string, className: string, textContent?: string) {
		return function stubComponent($$anchor: any, $$props?: any) {
			// Svelte 5 compiled output passes an anchor comment node.
			// We insert our stub element before that anchor.
			const el = document.createElement(tag);
			el.className = className;
			if (textContent) el.textContent = textContent;
			if ($$anchor?.parentNode) {
				$$anchor.parentNode.insertBefore(el, $$anchor);
			}
		};
	}

	return {
		Breadcrumb: makeStub('nav', 'breadcrumb-stub', 'Breadcrumb'),
		StreamingChat: makeStub('div', 'streaming-chat', 'StreamingChat'),
		ContextLifecycleIndicator: makeStub('div', 'lifecycle-indicator-stub', 'Lifecycle')
	};
});

// Mock fetch globally for any warmup GET or streaming calls
globalThis.fetch = vi.fn().mockResolvedValue(new Response('{}'));

// ---------------------------------------------------------------------------
// Import component under test AFTER mocks are established
// ---------------------------------------------------------------------------
import Page from './+page.svelte';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function renderPage() {
	return render(Page);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Playground page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		cleanup();
	});

	// ------------------------------------------------------------------
	// 1. Page renders title
	// ------------------------------------------------------------------
	it('renders the "VCP Playground" heading', () => {
		renderPage();
		const heading = screen.getByRole('heading', { name: /VCP Playground/i });
		expect(heading).toBeTruthy();
		expect(heading.tagName).toBe('H1');
	});

	// ------------------------------------------------------------------
	// 2. StreamingChat renders on page
	// ------------------------------------------------------------------
	it('renders the StreamingChat component', () => {
		const { container } = renderPage();
		const chatEl = container.querySelector('.streaming-chat');
		expect(chatEl).toBeTruthy();
	});

	// ------------------------------------------------------------------
	// 3. Demo links section present
	// ------------------------------------------------------------------
	it('renders the "Or Explore a Guided Demo" section', () => {
		renderPage();
		const heading = screen.getByText(/Or Explore a Guided Demo/i);
		expect(heading).toBeTruthy();
	});

	// ------------------------------------------------------------------
	// 4. Demo links point to correct routes
	// ------------------------------------------------------------------
	it('has demo links to /demos/ren, /demos/noor, /demos/hana', () => {
		const { container } = renderPage();
		const demoLinks = container.querySelectorAll('.demo-link-card');
		const hrefs = Array.from(demoLinks).map((a) => a.getAttribute('href'));

		expect(hrefs).toContain('/demos/ren');
		expect(hrefs).toContain('/demos/noor');
		expect(hrefs).toContain('/demos/hana');
	});

	// ------------------------------------------------------------------
	// 5. Quick load buttons render
	// ------------------------------------------------------------------
	it('renders all six quick load buttons', () => {
		renderPage();
		const expectedLabels = [
			'Consumer',
			'Enterprise',
			'Values & Decisions',
			'Multi-agent',
			'Governance',
			'Epistemic'
		];
		for (const label of expectedLabels) {
			const btn = screen.getByRole('button', { name: new RegExp(label, 'i') });
			expect(btn).toBeTruthy();
		}
	});

	// ------------------------------------------------------------------
	// 6. Reset button present
	// ------------------------------------------------------------------
	it('renders the Reset button in the Context Builder panel', () => {
		renderPage();
		const resetBtn = screen.getByRole('button', { name: /^Reset$/i });
		expect(resetBtn).toBeTruthy();
	});

	// ------------------------------------------------------------------
	// 7. Persona buttons render
	// ------------------------------------------------------------------
	it('renders all 7 persona buttons', () => {
		renderPage();
		const personaNames = ['Muse', 'Ambassador', 'Godparent', 'Sentinel', 'Anchor', 'Nanny', 'Steward'];
		for (const name of personaNames) {
			const btn = screen.getByRole('radio', { name: new RegExp(name, 'i') });
			expect(btn).toBeTruthy();
		}
	});

	// ------------------------------------------------------------------
	// 8. Chat container has correct height style
	// ------------------------------------------------------------------
	it('has a playground-chat-container element', () => {
		const { container } = renderPage();
		const chatContainer = container.querySelector('.playground-chat-container');
		expect(chatContainer).toBeTruthy();
		// The 450px height is defined in the component's scoped CSS.
		// In jsdom, computed styles are not applied, so we verify the element
		// exists with the correct class. The CSS rule is:
		//   .playground-chat-container { height: 450px; }
		expect(chatContainer?.classList.contains('playground-chat-container')).toBe(true);
	});

	// ------------------------------------------------------------------
	// 9. Personal state presets render
	// ------------------------------------------------------------------
	it('renders Normal, Stressed, Crisis, and Grieving personal state preset buttons', () => {
		renderPage();
		const presets = ['Normal', 'Stressed', 'Crisis', 'Grieving'];
		for (const preset of presets) {
			const btn = screen.getByRole('button', { name: new RegExp(`^\\s*${preset}\\s*$`, 'i') });
			expect(btn).toBeTruthy();
		}
	});

	// ------------------------------------------------------------------
	// Additional structural tests
	// ------------------------------------------------------------------

	it('renders the Context Builder heading', () => {
		renderPage();
		const heading = screen.getByRole('heading', { name: /Context Builder/i });
		expect(heading).toBeTruthy();
	});

	it('renders the Generated Token heading', () => {
		renderPage();
		const heading = screen.getByRole('heading', { name: /Generated Token/i });
		expect(heading).toBeTruthy();
	});

	it('renders the Copy Token button', () => {
		renderPage();
		const btn = screen.getByRole('button', { name: /Copy Token/i });
		expect(btn).toBeTruthy();
	});

	it('renders the Emoji Key legend section', () => {
		renderPage();
		const heading = screen.getByText(/Emoji Key/i);
		expect(heading).toBeTruthy();
	});

	it('renders the Transmission Summary section', () => {
		renderPage();
		const heading = screen.getByText(/Transmission Summary/i);
		expect(heading).toBeTruthy();
	});

	it('renders Profile form fields (Display Name and Goal)', () => {
		renderPage();
		const displayName = screen.getByLabelText(/Display Name/i);
		const goal = screen.getByLabelText(/Goal/i);
		expect(displayName).toBeTruthy();
		expect(goal).toBeTruthy();
	});

	it('renders constraint checkboxes', () => {
		renderPage();
		const constraints = ['Time Limited', 'Budget Limited', 'Noise Restricted', 'Energy Variable', 'Schedule Irregular'];
		for (const label of constraints) {
			const checkbox = screen.getByLabelText(new RegExp(label, 'i'));
			expect(checkbox).toBeTruthy();
		}
	});

	it('renders the page subtitle describing the playground purpose', () => {
		renderPage();
		const subtitle = screen.getByText(/Build context tokens interactively/i);
		expect(subtitle).toBeTruthy();
	});

	it('renders the WebMCP note section', () => {
		const { container } = renderPage();
		const note = container.querySelector('.webmcp-note');
		expect(note).toBeTruthy();
		expect(note?.textContent).toContain('WebMCP tools available');
	});
});
