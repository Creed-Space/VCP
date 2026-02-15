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
	// 2. Try Demo section present
	// ------------------------------------------------------------------
	it('renders the "Try This Context in a Demo" section', () => {
		renderPage();
		const heading = screen.getByText(/Try This Context in a Demo/i);
		expect(heading).toBeTruthy();
	});

	// ------------------------------------------------------------------
	// 3. Demo links point to correct routes
	// ------------------------------------------------------------------
	it('has demo links to /demos/campion, /demos/noor, /demos/ren', () => {
		const { container } = renderPage();
		const demoLinks = container.querySelectorAll('.demo-link-card');
		const hrefs = Array.from(demoLinks).map((a) => a.getAttribute('href'));

		expect(hrefs).toContain('/demos/campion');
		expect(hrefs).toContain('/demos/noor');
		expect(hrefs).toContain('/demos/ren');
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
	it('renders all 6 persona buttons', () => {
		renderPage();
		const personaNames = ['Muse', 'Ambassador', 'Godparent', 'Sentinel', 'Nanny', 'Mediator'];
		for (const name of personaNames) {
			const btn = screen.getByRole('radio', { name: new RegExp(name, 'i') });
			expect(btn).toBeTruthy();
		}
	});

	// ------------------------------------------------------------------
	// 8. Playground grid layout element exists
	// ------------------------------------------------------------------
	it('has a playground-grid element', () => {
		const { container } = renderPage();
		const grid = container.querySelector('.playground-grid');
		expect(grid).toBeTruthy();
		expect(grid?.classList.contains('playground-grid')).toBe(true);
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
