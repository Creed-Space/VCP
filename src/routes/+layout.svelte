<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import { registerVCPTools } from '$lib/vcp-webmcp-sdk';
	import { encodeContextToCSM1, getTransmissionSummary, parseCSM1Token } from '$lib/vcp/token';
	import { getWasmModule, loadVcpWasm } from '$lib/vcp/wasmLoader';
	import { loadPolyfillIfRequested, isPolyfillRequested } from '$lib/webmcp/polyfill';
	import type { VCPContext } from '$lib/vcp/types';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let mobileMenuOpen = $state(false);
	let showBackToTop = $state(false);
	let mobileNavElement: HTMLElement | null = $state(null);
	let agentActive = $state(false);
	let agentTimeout: ReturnType<typeof setTimeout> | undefined;

	// Derive current path for nav active states
	const currentPath = $derived($page.url.pathname);

	// ACCESSIBILITY FIX 2026-02-02: Focus trap for mobile menu
	$effect(() => {
		if (!mobileMenuOpen || !mobileNavElement) return;

		const focusableElements = mobileNavElement.querySelectorAll<HTMLElement>(
			'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
		);
		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		// Focus first element when menu opens
		firstElement?.focus();

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				mobileMenuOpen = false;
				return;
			}

			if (e.key !== 'Tab') return;

			if (e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault();
				lastElement?.focus();
			} else if (!e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault();
				firstElement?.focus();
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});

	// Check if a nav link is active (matches current path or is a parent)
	function isActive(href: string): boolean {
		if (href === '/') return currentPath === '/';
		return currentPath === href || currentPath.startsWith(href + '/');
	}

	// Back to top button visibility
	$effect(() => {
		if (typeof window === 'undefined') return;

		function handleScroll() {
			showBackToTop = window.scrollY > 600;
		}

		function handleKeydown(e: KeyboardEvent) {
			// Ctrl/Cmd + Home to scroll to top
			if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
				e.preventDefault();
				scrollToTop();
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	// WebMCP: register VCP tools via SDK (Chrome 145+, progressive enhancement)
	// If ?webmcp=polyfill is present, load MCP-B polyfill first.
	$effect(() => {
		if (typeof window === 'undefined') return;

		// Pre-load WASM for token parsing
		loadVcpWasm().catch(() => {});

		let cleanup: (() => void) | undefined;

		async function init() {
			// Load MCP-B polyfill if requested (populates navigator.modelContext)
			await loadPolyfillIfRequested();

			const result = await registerVCPTools({
				chatEndpoint: '/api/chat',
				tokenEncoder: (ctx) => encodeContextToCSM1(ctx as unknown as VCPContext),
				tokenParser: (token) => parseCSM1Token(token),
				wasmParser: getWasmModule()?.parse_csm1_token,
				transmissionSummary: (ctx) => getTransmissionSummary(ctx as unknown as VCPContext)
			});
			cleanup = result.cleanup;
		}

		init();
		return () => cleanup?.();
	});

	// Agent activity indicator: listen for tool calls from WebMCP
	$effect(() => {
		if (typeof window === 'undefined') return;

		function onToolCall() {
			agentActive = true;
			clearTimeout(agentTimeout);
			agentTimeout = setTimeout(() => { agentActive = false; }, 3000);
		}

		window.addEventListener('webmcp:tool-call', onToolCall);
		return () => {
			window.removeEventListener('webmcp:tool-call', onToolCall);
			clearTimeout(agentTimeout);
		};
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<div class="app">
	<!-- Skip to main content for keyboard users -->
	<a href="#main-content" class="skip-link">Skip to main content</a>

	<header class="app-header">
		<div class="container flex items-center justify-between">
			<a href="/" class="logo" aria-label="Value Context Protocol Home">
				<span class="logo-icon" aria-hidden="true"><img src="/favicon.svg" alt="" width="40" height="40" /></span>
				<span class="logo-text">Value <span class="logo-highlight">Context</span> Protocol</span>
			</a>

			<!-- Desktop Nav - ACCESSIBILITY FIX 2026-02-02: Moved nav inside, removed outer nav wrapper -->
			<nav class="nav-links desktop-nav" aria-label="Main navigation">
				<a href="/about" class="nav-link" class:active={isActive('/about')}>About</a>
				<a href="/demos" class="nav-link" class:active={isActive('/demos')}>Demos</a>
				<a href="/docs" class="nav-link" class:active={isActive('/docs')}>Docs</a>
				<a href="/playground" class="nav-link" class:active={isActive('/playground')}>Playground</a>
				{#if agentActive}
					<span class="webmcp-indicator" aria-live="polite">
						<i class="fa-solid fa-robot" aria-hidden="true"></i>
						Agent Active
					</span>
				{/if}
				<span class="nav-divider" aria-hidden="true"></span>
				<a
					href="https://creed.space"
					target="_blank"
					rel="noopener noreferrer"
					class="nav-link nav-link-brand"
					aria-label="Learn more about Creed Space (opens in new tab)"
				>
					<img src="/creedspace-logo.png" alt="" class="brand-logo" aria-hidden="true" />
					Creed Space
				</a>
			</nav>

			<!-- Mobile Menu Button -->
			<button
				class="mobile-menu-btn"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-nav"
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
			>
				<span class="hamburger" class:open={mobileMenuOpen}>
					<span></span>
					<span></span>
					<span></span>
				</span>
			</button>
		</div>

		<!-- Mobile Nav - ACCESSIBILITY FIX 2026-01-31: Use semantic nav element -->
		{#if mobileMenuOpen}
			<nav
				id="mobile-nav"
				class="mobile-nav animate-fade-in"
				aria-label="Mobile navigation"
				bind:this={mobileNavElement}
			>
				<a href="/about" class="mobile-nav-link" class:active={isActive('/about')} onclick={() => (mobileMenuOpen = false)}>
					About VCP
				</a>
				<a href="/demos" class="mobile-nav-link" class:active={isActive('/demos')} onclick={() => (mobileMenuOpen = false)}>
					Interactive Demos
				</a>
				<a href="/docs" class="mobile-nav-link" class:active={isActive('/docs')} onclick={() => (mobileMenuOpen = false)}>
					Documentation
				</a>
				<a href="/playground" class="mobile-nav-link" class:active={isActive('/playground')} onclick={() => (mobileMenuOpen = false)}>
					Playground
				</a>
				<hr class="mobile-nav-divider" />
				<!-- UX FIX 2026-01-31: Add onclick to close menu on external link click -->
				<a
					href="https://creed.space"
					target="_blank"
					rel="noopener noreferrer"
					class="mobile-nav-link mobile-nav-brand"
					onclick={() => (mobileMenuOpen = false)}
				>
					<img src="/creedspace-logo.png" alt="" class="brand-logo" aria-hidden="true" />
					Creed Space
				</a>
			</nav>
		{/if}
	</header>

	<main id="main-content" tabindex="-1">
		<ErrorBoundary>
			{@render children()}
		</ErrorBoundary>
	</main>

	<!-- Back to Top Button -->
	{#if showBackToTop}
		<button
			class="back-to-top"
			onclick={scrollToTop}
			aria-label="Back to top"
			title="Back to top (Ctrl+Home)"
		>
			<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
		</button>
	{/if}

	<footer class="app-footer">
		<div class="container">
			<div class="footer-content">
				<div class="footer-brand">
					<span class="footer-logo" aria-hidden="true"><img src="/favicon.svg" alt="" width="44" height="44" /></span>
					<div>
						<p class="footer-title">Value Context Protocol</p>
						<p class="footer-tagline">Context that travels with you, wherever you need it.</p>
					</div>
				</div>

				<div class="footer-links">
					<div class="footer-section">
						<h4>Explore</h4>
						<a href="/about">About VCP</a>
						<a href="/demos">All Demos</a>
						<a href="/playground">Playground</a>
						<a href="/docs">Documentation</a>
					</div>
					<div class="footer-section">
						<h4>Demos</h4>
						<a href="/demos/gentian">Gentian &mdash; Portability</a>
						<a href="/demos/campion">Campion &mdash; Adaptation</a>
						<a href="/demos/marta">Marta &mdash; Liveness</a>
						<a href="/demos/ren">Ren &mdash; Multi-Agent</a>
						<a href="/demos/noor">Noor &mdash; Governance</a>
						<a href="/demos/hana">Dr. Hana &mdash; Epistemic</a>
					</div>
					<div class="footer-section">
						<h4>Learn More</h4>
						<a href="https://creed.space" target="_blank" rel="noopener noreferrer" aria-label="Creed Space (opens in new tab)">
							Creed Space <span class="external-link-icon" aria-hidden="true">↗</span>
						</a>
						<a href="https://millos.net" target="_blank" rel="noopener noreferrer" aria-label="MillOS (opens in new tab)">
							MillOS <span class="external-link-icon" aria-hidden="true">↗</span>
						</a>
						<a href="https://github.com/Creed-Space/VCP-SDK" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in new tab)">
							GitHub <span class="external-link-icon" aria-hidden="true">↗</span>
						</a>
					</div>
				</div>
			</div>

			<div class="footer-bottom">
				<p>
					Value Context Protocol — an open standard
				</p>
			</div>
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/* ============================================
	   Header
	   ============================================ */

	.app-header {
		background: rgba(10, 10, 18, 0.75);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		padding: var(--space-sm) 0;
		position: sticky;
		top: 0;
		z-index: 100;
		-webkit-backdrop-filter: blur(20px) saturate(1.5);
		backdrop-filter: blur(20px) saturate(1.5);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		text-decoration: none;
		color: var(--color-text);
	}

	.logo:hover {
		text-decoration: none;
	}

	.logo-icon {
		display: flex;
		align-items: center;
	}

	.logo-icon img {
		width: 72px;
		height: 72px;
		margin: -14px 0;
	}

	.logo-text {
		font-weight: 400;
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.7);
		letter-spacing: 0.03em;
	}

	.logo-highlight {
		font-weight: 700;
		color: white;
		background: linear-gradient(135deg, #c4b5fd, #a78bfa);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.logo:hover .logo-text {
		color: rgba(255, 255, 255, 0.85);
	}

	.logo:hover .logo-highlight {
		background: linear-gradient(135deg, #ddd6fe, #a78bfa);
		-webkit-background-clip: text;
		background-clip: text;
	}

	/* Desktop Nav */
	.desktop-nav {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}

	.nav-link {
		color: var(--color-text-muted);
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: color var(--transition-fast);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
	}

	.nav-link:hover {
		color: var(--color-text);
		text-decoration: none;
		background: rgba(99, 102, 241, 0.1);
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	/* Agent Activity Indicator */
	.webmcp-indicator {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 8px;
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--color-primary);
		background: var(--color-primary-muted);
		border-radius: var(--radius-sm);
		animation: fadeInIndicator 0.3s ease;
		white-space: nowrap;
	}

	.webmcp-indicator i {
		font-size: 0.625rem;
	}

	@keyframes fadeInIndicator {
		from { opacity: 0; transform: scale(0.9); }
		to { opacity: 1; transform: scale(1); }
	}

	.nav-divider {
		width: 1px;
		height: 16px;
		background: rgba(255, 255, 255, 0.2);
	}

	.nav-link-brand {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		color: var(--color-primary);
	}

	.brand-logo {
		width: 20px;
		height: 20px;
		object-fit: contain;
	}

	/* Mobile Menu Button */
	.mobile-menu-btn {
		display: none;
		background: none;
		border: none;
		padding: var(--space-sm);
		cursor: pointer;
		border-radius: var(--radius-sm);
	}

	.mobile-menu-btn:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.mobile-menu-btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.hamburger {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 22px;
		height: 18px;
		position: relative;
	}

	.hamburger span {
		display: block;
		height: 2px;
		width: 100%;
		background: var(--color-text);
		border-radius: 2px;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		position: absolute;
		left: 0;
	}

	.hamburger span:nth-child(1) {
		top: 0;
	}

	.hamburger span:nth-child(2) {
		top: 8px;
	}

	.hamburger span:nth-child(3) {
		top: 16px;
	}

	.hamburger.open span:nth-child(1) {
		transform: rotate(45deg);
		top: 8px;
	}

	.hamburger.open span:nth-child(2) {
		opacity: 0;
		transform: translateX(-10px);
	}

	.hamburger.open span:nth-child(3) {
		transform: rotate(-45deg);
		top: 8px;
	}

	/* Mobile Nav */
	.mobile-nav {
		display: none;
		flex-direction: column;
		padding: var(--space-md);
		background: rgba(15, 15, 25, 0.95);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		-webkit-backdrop-filter: blur(20px);
		backdrop-filter: blur(20px);
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.mobile-nav-link {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		color: var(--color-text);
		text-decoration: none;
		font-weight: 500;
		border-radius: var(--radius-md);
		transition: background var(--transition-fast);
	}

	.mobile-nav-link:hover {
		background: rgba(255, 255, 255, 0.05);
		text-decoration: none;
	}

	.mobile-nav-link:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.mobile-nav-brand {
		color: var(--color-primary);
	}

	.mobile-nav-divider {
		border: none;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		margin: var(--space-sm) 0;
	}

	/* ============================================
	   Main Content
	   ============================================ */

	main {
		flex: 1;
	}

	/* ============================================
	   Back to Top Button
	   ============================================ */

	.back-to-top {
		position: fixed;
		bottom: var(--space-xl);
		right: var(--space-xl);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4), 0 0 30px rgba(99, 102, 241, 0.15);
		transition: all var(--transition-normal);
		z-index: 50;
		animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.back-to-top:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5), 0 0 50px rgba(99, 102, 241, 0.2);
	}

	.back-to-top:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 640px) {
		.back-to-top {
			bottom: var(--space-lg);
			right: var(--space-lg);
			width: 44px;
			height: 44px;
		}
	}

	/* ============================================
	   Footer
	   ============================================ */

	.app-footer {
		background: rgba(10, 10, 18, 0.85);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		padding: var(--space-xl) 0 var(--space-lg);
		margin-top: var(--space-2xl);
		-webkit-backdrop-filter: blur(16px);
		backdrop-filter: blur(16px);
		position: relative;
	}

	.app-footer::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 200px;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent);
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-xl);
		margin-bottom: var(--space-xl);
	}

	.footer-brand {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
	}

	.footer-logo {
		font-size: 2rem;
	}

	.footer-title {
		font-weight: 600;
		font-size: 1rem;
		margin-bottom: var(--space-xs);
	}

	.footer-tagline {
		color: var(--color-text-muted);
		font-size: 0.8125rem;
	}

	.footer-links {
		display: flex;
		gap: var(--space-2xl);
	}

	.footer-section h4 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-sm);
	}

	.footer-section a {
		display: block;
		color: var(--color-text);
		text-decoration: none;
		font-size: 0.875rem;
		padding: var(--space-xs) 0;
		transition: color var(--transition-fast);
	}

	.footer-section a:hover {
		color: var(--color-primary);
		text-decoration: none;
	}

	.footer-section a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.footer-bottom {
		padding-top: var(--space-lg);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	/* ============================================
	   Responsive
	   ============================================ */

	@media (max-width: 768px) {
		.desktop-nav {
			display: none;
		}

		.mobile-menu-btn {
			display: block;
			padding: var(--space-md);
		}

		.mobile-nav {
			display: flex;
		}

		.footer-content {
			flex-direction: column;
			gap: var(--space-xl);
		}

		.footer-links {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-lg);
		}

		.footer-bottom {
			flex-direction: column;
			gap: var(--space-sm);
			text-align: center;
		}

		.footer-brand {
			text-align: center;
			flex-direction: column;
		}
	}

	@media (max-width: 640px) {
		.logo-icon img {
			width: 48px;
			height: 48px;
			margin: -8px 0;
		}

		.logo-text {
			font-size: 1rem;
		}

		.footer-links {
			grid-template-columns: repeat(2, 1fr);
		}

		.app-footer {
			padding: var(--space-lg) 0 var(--space-md);
		}
	}

	@media (max-width: 480px) {
		.footer-links {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.footer-section a {
			display: inline-block;
		}

		.logo-text {
			font-size: 0.9rem;
			max-width: 160px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
