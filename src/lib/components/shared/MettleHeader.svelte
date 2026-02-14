<script lang="ts">
	import { page } from '$app/stores';

	let mobileMenuOpen = $state(false);
	let mobileNavElement: HTMLElement | null = $state(null);
	let scrolled = $state(false);

	const currentPath = $derived($page.url.pathname);

	function isActive(href: string): boolean {
		if (href === '/mettle') return currentPath === '/mettle';
		return currentPath === href || currentPath.startsWith(href + '/');
	}

	// Track scroll position for header border effect
	$effect(() => {
		function handleScroll() {
			scrolled = window.scrollY > 10;
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Focus trap for mobile menu
	$effect(() => {
		if (!mobileMenuOpen || !mobileNavElement) return;

		const focusable = mobileNavElement.querySelectorAll<HTMLElement>(
			'a[href], button, [tabindex]:not([tabindex="-1"])'
		);
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		first?.focus();

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') { mobileMenuOpen = false; return; }
			if (e.key !== 'Tab') return;
			if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
			else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
		}

		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});
</script>

<header class="mettle-header" class:scrolled>
	<div class="container flex items-center justify-between">
		<a href="/mettle" class="mettle-logo" aria-label="METTLE Home">
			<span class="mettle-logo-icon" aria-hidden="true">
				<i class="fa-solid fa-fire-flame-curved"></i>
			</span>
			<span class="mettle-logo-text">
				<span class="mettle-logo-highlight">METTLE</span>
			</span>
		</a>

		<!-- Desktop Nav -->
		<nav class="mettle-nav desktop-nav" aria-label="Main navigation">
			<a href="/mettle#suites" class="nav-link">Suites</a>
			<a href="/mettle/docs" class="nav-link" class:active={isActive('/mettle/docs')}>Docs</a>
			<span class="nav-divider" aria-hidden="true"></span>
			<a
				href="https://creed.space"
				target="_blank"
				rel="noopener noreferrer"
				class="nav-link nav-link-brand"
				aria-label="Creed Space (opens in new tab)"
			>
				<i class="fa-solid fa-shield-heart" aria-hidden="true"></i>
				Creed Space
			</a>
			<a href="/mettle/docs#authentication" class="nav-cta">
				<i class="fa-solid fa-key" aria-hidden="true"></i>
				Get API Key
			</a>
		</nav>

		<!-- Mobile Menu Button -->
		<button
			class="mobile-menu-btn"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-expanded={mobileMenuOpen}
			aria-controls="mettle-mobile-nav"
			aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
		>
			<span class="hamburger" class:open={mobileMenuOpen}>
				<span></span>
				<span></span>
				<span></span>
			</span>
		</button>
	</div>

	<!-- Mobile Nav -->
	{#if mobileMenuOpen}
		<nav
			id="mettle-mobile-nav"
			class="mobile-nav"
			aria-label="Mobile navigation"
			bind:this={mobileNavElement}
		>
			<a href="/mettle#suites" class="mobile-nav-link" onclick={() => (mobileMenuOpen = false)}>Suites</a>
			<a href="/mettle/docs" class="mobile-nav-link" onclick={() => (mobileMenuOpen = false)}>Docs</a>
			<hr class="mobile-nav-divider" />
			<a
				href="https://creed.space"
				target="_blank"
				rel="noopener noreferrer"
				class="mobile-nav-link mobile-nav-brand"
				onclick={() => (mobileMenuOpen = false)}
			>
				<i class="fa-solid fa-shield-heart" aria-hidden="true"></i>
				Creed Space
			</a>
			<a href="/mettle/docs#authentication" class="mobile-nav-cta" onclick={() => (mobileMenuOpen = false)}>
				<i class="fa-solid fa-key" aria-hidden="true"></i>
				Get API Key
			</a>
		</nav>
	{/if}
</header>

<style>
	.mettle-header {
		background: rgba(10, 10, 18, 0.75);
		border-bottom: 1px solid rgba(245, 158, 11, 0.08);
		padding: var(--space-sm) 0;
		position: sticky;
		top: 0;
		z-index: 100;
		-webkit-backdrop-filter: blur(20px) saturate(1.5);
		backdrop-filter: blur(20px) saturate(1.5);
		transition: border-color 0.3s ease, background 0.3s ease;
	}

	.mettle-header.scrolled {
		border-bottom: 1px solid rgba(245, 158, 11, 0.2);
		background: rgba(10, 10, 18, 0.9);
	}

	/* Logo */
	.mettle-logo {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		text-decoration: none;
		color: var(--color-text);
	}

	.mettle-logo:hover { text-decoration: none; }

	.mettle-logo-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 146, 60, 0.08));
		color: #f59e0b;
		font-size: 1.125rem;
		transition: all 0.3s ease;
	}

	.mettle-logo:hover .mettle-logo-icon {
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(251, 146, 60, 0.12));
		box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
	}

	.mettle-logo-text {
		font-weight: 400;
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.7);
		letter-spacing: 0.03em;
	}

	.mettle-logo-highlight {
		font-weight: 800;
		letter-spacing: 0.08em;
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.mettle-logo:hover .mettle-logo-text {
		color: rgba(255, 255, 255, 0.85);
	}

	.mettle-logo:hover .mettle-logo-highlight {
		background: linear-gradient(135deg, #fde68a, #fbbf24);
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
		background: rgba(245, 158, 11, 0.08);
	}

	.nav-link:focus-visible {
		outline: 2px solid #f59e0b;
		outline-offset: 2px;
	}

	.nav-link.active {
		color: #fbbf24;
	}

	.nav-divider {
		width: 1px;
		height: 16px;
		background: rgba(255, 255, 255, 0.15);
	}

	.nav-link-brand {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		color: #f59e0b;
	}

	.nav-link-brand:hover {
		color: #fbbf24;
	}

	/* Desktop CTA Button */
	.nav-cta {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 16px;
		background: linear-gradient(135deg, #f59e0b, #fb923c);
		color: #0a0a12;
		font-size: 0.8125rem;
		font-weight: 700;
		text-decoration: none;
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.nav-cta:hover {
		text-decoration: none;
		filter: brightness(1.1);
		box-shadow: 0 0 16px rgba(245, 158, 11, 0.3);
		transform: translateY(-1px);
	}

	.nav-cta:focus-visible {
		outline: 2px solid #f59e0b;
		outline-offset: 2px;
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

	.mobile-menu-btn:hover { background: rgba(255, 255, 255, 0.05); }
	.mobile-menu-btn:focus-visible { outline: 2px solid #f59e0b; outline-offset: 2px; }

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

	.hamburger span:nth-child(1) { top: 0; }
	.hamburger span:nth-child(2) { top: 8px; }
	.hamburger span:nth-child(3) { top: 16px; }
	.hamburger.open span:nth-child(1) { transform: rotate(45deg); top: 8px; }
	.hamburger.open span:nth-child(2) { opacity: 0; transform: translateX(-10px); }
	.hamburger.open span:nth-child(3) { transform: rotate(-45deg); top: 8px; }

	/* Mobile Nav */
	.mobile-nav {
		display: none;
		flex-direction: column;
		padding: var(--space-md);
		background: rgba(15, 15, 25, 0.95);
		border-top: 1px solid rgba(245, 158, 11, 0.06);
		animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		-webkit-backdrop-filter: blur(20px);
		backdrop-filter: blur(20px);
	}

	@keyframes slideDown {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
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

	.mobile-nav-link:hover { background: rgba(255, 255, 255, 0.05); text-decoration: none; }
	.mobile-nav-link:focus-visible { outline: 2px solid #f59e0b; outline-offset: 2px; }
	.mobile-nav-brand { color: #f59e0b; }
	.mobile-nav-divider { border: none; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: var(--space-sm) 0; }

	/* Mobile CTA Button */
	.mobile-nav-cta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		margin-top: var(--space-sm);
		background: linear-gradient(135deg, #f59e0b, #fb923c);
		color: #0a0a12;
		font-weight: 700;
		font-size: 0.9375rem;
		text-decoration: none;
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
	}

	.mobile-nav-cta:hover {
		text-decoration: none;
		filter: brightness(1.1);
		box-shadow: 0 0 16px rgba(245, 158, 11, 0.3);
	}

	.mobile-nav-cta:focus-visible {
		outline: 2px solid #f59e0b;
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.desktop-nav { display: none; }
		.mobile-menu-btn { display: block; }
		.mobile-nav { display: flex; }
	}
</style>
