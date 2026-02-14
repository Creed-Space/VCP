<script lang="ts">
	/**
	 * DocsLayout - Documentation page layout with sidebar navigation
	 */
	import { page } from '$app/stores';

	interface Props {
		title: string;
		description?: string;
		children: import('svelte').Snippet;
	}

	let { title, description, children }: Props = $props();

	const navSections = [
		{
			title: 'Getting Started',
			items: [
				{ href: '/docs/getting-started', label: 'Quick Start', time: '5 min' },
				{ href: '/docs/concepts', label: 'Core Concepts', time: '10 min' }
			]
		},
		{
			title: 'Understanding VCP',
			items: [
				{ href: '/docs/security', label: 'Security Model', time: '10 min' },
				{ href: '/docs/bilateral-alignment', label: 'Bilateral Alignment', time: '8 min' }
			]
		},
		{
			title: 'Reference',
			items: [
				{ href: '/docs/csm1-specification', label: 'CSM-1 Format', time: '15 min' },
				{ href: '/docs/api-reference', label: 'API Reference', time: 'Ref' }
			]
		}
	];

	let currentPath = $derived($page.url.pathname);
	let sidebarOpen = $state(false);
	let articleRef: HTMLElement | null = $state(null);
	let searchQuery = $state('');

	// Search keywords for each doc page
	const searchIndex: Record<string, string[]> = {
		'/docs/getting-started': ['quick start', 'install', 'setup', 'begin', 'tutorial', 'first'],
		'/docs/concepts': ['core', 'concepts', 'principles', 'fundamentals', 'basics', 'overview', 'personas', 'profiles', 'identity', 'roles', 'contexts'],
		'/docs/security': ['security', 'privacy', 'protection', 'encryption', 'authentication'],
		'/docs/bilateral-alignment': ['bilateral', 'alignment', 'trust', 'levels', 'newcomer', 'trusted', 'partner', 'bonded', 'relational', 'safety'],
		'/docs/csm1-specification': ['csm-1', 'format', 'specification', 'token', 'syntax', 'encoding'],
		'/docs/api-reference': ['api', 'reference', 'endpoints', 'methods', 'integration']
	};

	// Filter nav sections based on search
	let filteredNavSections = $derived(
		searchQuery.trim() === ''
			? navSections
			: navSections
					.map((section) => ({
						...section,
						items: section.items.filter((item) => {
							const query = searchQuery.toLowerCase();
							const labelMatch = item.label.toLowerCase().includes(query);
							const keywords = searchIndex[item.href] || [];
							const keywordMatch = keywords.some((kw) => kw.includes(query));
							return labelMatch || keywordMatch;
						})
					}))
					.filter((section) => section.items.length > 0)
	);

	function setCopyButtonState(btn: HTMLElement, iconClass: string, text: string, className?: string) {
		const iconEl = btn.querySelector('.copy-icon i');
		const textSpan = btn.querySelector('.copy-text');
		if (iconEl) iconEl.className = iconClass;
		if (textSpan) textSpan.textContent = text;
		if (className) {
			btn.classList.add(className);
		} else {
			btn.classList.remove('copied');
		}
	}

	// Add copy buttons to code blocks
	$effect(() => {
		if (!articleRef) return;

		const preBlocks = articleRef.querySelectorAll('pre');
		preBlocks.forEach((pre) => {
			// Create wrapper div
			const wrapper = document.createElement('div');
			wrapper.className = 'code-block-wrapper';
			pre.parentNode?.insertBefore(wrapper, pre);
			wrapper.appendChild(pre);

			// Create copy button with safe DOM methods
			const copyBtn = document.createElement('button');
			copyBtn.className = 'code-copy-btn';
			copyBtn.setAttribute('aria-label', 'Copy code to clipboard');

			const iconSpan = document.createElement('span');
			iconSpan.className = 'copy-icon';
			const iconI = document.createElement('i');
			iconI.className = 'fa-regular fa-clipboard';
			iconI.setAttribute('aria-hidden', 'true');
			iconSpan.appendChild(iconI);

			const textSpan = document.createElement('span');
			textSpan.className = 'copy-text';
			textSpan.textContent = 'Copy';

			copyBtn.appendChild(iconSpan);
			copyBtn.appendChild(textSpan);

			copyBtn.addEventListener('click', async () => {
				const code = pre.querySelector('code')?.textContent || pre.textContent || '';
				try {
					await navigator.clipboard.writeText(code);
					setCopyButtonState(copyBtn, 'fa-solid fa-check', 'Copied!', 'copied');
					setTimeout(() => setCopyButtonState(copyBtn, 'fa-regular fa-clipboard', 'Copy'), 2000);
				} catch {
					setCopyButtonState(copyBtn, 'fa-solid fa-xmark', 'Failed');
					setTimeout(() => setCopyButtonState(copyBtn, 'fa-regular fa-clipboard', 'Copy'), 2000);
				}
			});

			wrapper.appendChild(copyBtn);
		});
	});

	// Flatten nav items for prev/next navigation
	const allNavItems = navSections.flatMap((section) => section.items);

	let currentIndex = $derived(allNavItems.findIndex((item) => item.href === currentPath));
	let prevPage = $derived(currentIndex > 0 ? allNavItems[currentIndex - 1] : null);
	let nextPage = $derived(
		currentIndex >= 0 && currentIndex < allNavItems.length - 1
			? allNavItems[currentIndex + 1]
			: null
	);
</script>

<div class="docs-layout">
	<!-- Mobile sidebar toggle -->
	<button
		class="sidebar-toggle"
		onclick={() => (sidebarOpen = !sidebarOpen)}
		aria-expanded={sidebarOpen}
		aria-controls="docs-sidebar"
	>
		<span class="toggle-icon"><i class={sidebarOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} aria-hidden="true"></i></span>
		<span class="toggle-text">Menu</span>
	</button>

	<!-- Sidebar -->
	<aside id="docs-sidebar" class="sidebar" class:open={sidebarOpen}>
		<nav class="sidebar-nav" aria-label="Documentation navigation">
			<!-- Search -->
			<div class="sidebar-search">
				<label for="docs-search" class="visually-hidden">Search documentation</label>
				<div class="search-input-wrapper">
					<i class="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i>
					<input
						type="search"
						id="docs-search"
						class="search-input"
						placeholder="Search docs..."
						bind:value={searchQuery}
					/>
					{#if searchQuery}
						<button
							class="search-clear"
							onclick={() => (searchQuery = '')}
							aria-label="Clear search"
						>
							<i class="fa-solid fa-xmark" aria-hidden="true"></i>
						</button>
					{/if}
				</div>
			</div>

			<a href="/docs" class="sidebar-home" class:active={currentPath === '/docs'}>
				<i class="fa-solid fa-book" aria-hidden="true"></i>
				Documentation Home
			</a>

			{#each filteredNavSections as section}
				<div class="nav-section">
					<h3 class="nav-section-title">{section.title}</h3>
					<ul class="nav-list">
						{#each section.items as item}
							<li>
								<a
									href={item.href}
									class="nav-link"
									class:active={currentPath === item.href}
									onclick={() => (sidebarOpen = false)}
								>
									<span class="nav-link-label">{item.label}</span>
									<span class="nav-link-time">{item.time}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}

			{#if searchQuery && filteredNavSections.length === 0}
				<div class="no-results">
					<p>No docs found for "{searchQuery}"</p>
					<button class="btn btn-ghost btn-sm" onclick={() => (searchQuery = '')}>
						Clear search
					</button>
				</div>
			{/if}
		</nav>
	</aside>

	<!-- Main content -->
	<main class="docs-content">
		<header class="docs-header">
			<nav class="breadcrumbs" aria-label="Breadcrumb">
				<a href="/docs">Docs</a>
				<span class="breadcrumb-sep" aria-hidden="true">/</span>
				<span class="breadcrumb-current">{title}</span>
			</nav>
			<h1>{title}</h1>
			{#if description}
				<p class="docs-description">{description}</p>
			{/if}
		</header>

		<article class="docs-article" bind:this={articleRef}>
			{@render children()}
		</article>

		<footer class="docs-footer">
			<div class="footer-nav">
				{#if prevPage}
					<a href={prevPage.href} class="footer-link prev">
						<span class="footer-link-direction">←</span>
						<div class="footer-link-content">
							<span class="footer-link-label">Previous</span>
							<span class="footer-link-title">{prevPage.label}</span>
						</div>
					</a>
				{:else}
					<a href="/docs" class="footer-link prev">
						<span class="footer-link-direction">←</span>
						<div class="footer-link-content">
							<span class="footer-link-label">Back to</span>
							<span class="footer-link-title">Documentation</span>
						</div>
					</a>
				{/if}

				{#if nextPage}
					<a href={nextPage.href} class="footer-link next">
						<div class="footer-link-content">
							<span class="footer-link-label">Next</span>
							<span class="footer-link-title">{nextPage.label}</span>
						</div>
						<span class="footer-link-direction">→</span>
					</a>
				{:else}
					<a href="/playground" class="footer-link next">
						<div class="footer-link-content">
							<span class="footer-link-label">Try the</span>
							<span class="footer-link-title">Playground</span>
						</div>
						<span class="footer-link-direction">→</span>
					</a>
				{/if}
			</div>
		</footer>
	</main>
</div>

<!-- Overlay for mobile -->
{#if sidebarOpen}
	<button
		class="sidebar-overlay"
		onclick={() => (sidebarOpen = false)}
		aria-label="Close sidebar"
	></button>
{/if}

<style>
	.docs-layout {
		display: grid;
		grid-template-columns: 280px 1fr;
		min-height: calc(100vh - 80px);
	}

	/* ============================================
	   Sidebar
	   ============================================ */

	.sidebar {
		background: var(--color-bg-elevated);
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		padding: var(--space-lg);
		position: sticky;
		top: 60px;
		height: calc(100vh - 60px);
		overflow-y: auto;
	}

	/* Search */
	.sidebar-search {
		margin-bottom: var(--space-lg);
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: var(--space-sm);
		color: var(--color-text-subtle);
		font-size: 0.75rem;
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		padding-left: calc(var(--space-sm) + 1rem + var(--space-xs));
		padding-right: calc(var(--space-md) + 1.5rem);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-size: 0.875rem;
		transition: all var(--transition-fast);
	}

	.search-input::placeholder {
		color: var(--color-text-subtle);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-primary);
		background: rgba(255, 255, 255, 0.08);
	}

	.search-clear {
		position: absolute;
		right: var(--space-xs);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		color: var(--color-text-subtle);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.search-clear:hover {
		background: rgba(255, 255, 255, 0.1);
		color: var(--color-text);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.sidebar-home {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		border-radius: var(--radius-md);
		color: var(--color-text);
		text-decoration: none;
		font-weight: 500;
		margin-bottom: var(--space-lg);
		transition: all var(--transition-fast);
	}

	.sidebar-home:hover {
		background: rgba(255, 255, 255, 0.05);
		text-decoration: none;
	}

	.sidebar-home.active {
		background: var(--color-primary-muted);
		color: var(--color-primary);
	}

	.home-icon {
		font-size: 1.25rem;
	}

	.nav-section {
		margin-bottom: var(--space-lg);
	}

	.nav-section-title {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
		padding: 0 var(--space-md);
		margin-bottom: var(--space-sm);
	}

	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-link {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		text-decoration: none;
		font-size: 0.875rem;
		transition: all var(--transition-fast);
	}

	.nav-link:hover {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.05);
		text-decoration: none;
	}

	.nav-link.active {
		color: var(--color-primary);
		background: var(--color-primary-muted);
	}

	.nav-link-time {
		font-size: 0.6875rem;
		color: var(--color-text-subtle);
	}

	.nav-link.active .nav-link-time {
		color: var(--color-primary);
		opacity: 0.7;
	}

	.no-results {
		padding: var(--space-lg);
		text-align: center;
		color: var(--color-text-subtle);
	}

	.no-results p {
		margin-bottom: var(--space-md);
		font-size: 0.875rem;
	}

	/* ============================================
	   Content
	   ============================================ */

	.docs-content {
		padding: var(--space-xl) var(--space-2xl);
		max-width: 900px;
		min-width: 0;
	}

	.docs-header {
		margin-bottom: var(--space-2xl);
		padding-bottom: var(--space-xl);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.breadcrumbs {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.8125rem;
		margin-bottom: var(--space-md);
	}

	.breadcrumbs a {
		color: var(--color-text-muted);
		text-decoration: none;
	}

	.breadcrumbs a:hover {
		color: var(--color-primary);
	}

	.breadcrumb-sep {
		color: var(--color-text-subtle);
	}

	.breadcrumb-current {
		color: var(--color-text);
	}

	.docs-header h1 {
		font-size: 2rem;
		margin-bottom: var(--space-sm);
	}

	.docs-description {
		color: var(--color-text-muted);
		font-size: 1.125rem;
		line-height: 1.6;
	}

	.docs-article {
		line-height: 1.7;
	}

	/* Article typography */
	.docs-article :global(h2) {
		font-size: 1.5rem;
		margin-top: var(--space-2xl);
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-sm);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.docs-article :global(h3) {
		font-size: 1.25rem;
		margin-top: var(--space-xl);
		margin-bottom: var(--space-sm);
	}

	.docs-article :global(h4) {
		font-size: 1rem;
		margin-top: var(--space-lg);
		margin-bottom: var(--space-sm);
		color: var(--color-text-muted);
	}

	.docs-article :global(p) {
		margin-bottom: var(--space-md);
	}

	.docs-article :global(ul),
	.docs-article :global(ol) {
		margin-bottom: var(--space-md);
		padding-left: var(--space-xl);
	}

	.docs-article :global(li) {
		margin-bottom: var(--space-sm);
	}

	.docs-article :global(code) {
		font-family: var(--font-mono);
		font-size: 0.875em;
		background: var(--color-bg-elevated);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
	}

	.docs-article :global(pre) {
		background: var(--color-bg-elevated);
		border-radius: var(--radius-md);
		padding: var(--space-lg);
		overflow-x: auto;
		margin-bottom: var(--space-lg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.docs-article :global(pre code) {
		background: none;
		padding: 0;
		font-size: 0.8125rem;
		line-height: 1.6;
	}

	/* Code block copy button */
	.docs-article :global(.code-block-wrapper) {
		position: relative;
	}

	.docs-article :global(.code-copy-btn) {
		position: absolute;
		top: var(--space-sm);
		right: var(--space-sm);
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xs) var(--space-sm);
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: var(--radius-sm);
		color: var(--color-text-subtle);
		font-size: 0.6875rem;
		cursor: pointer;
		opacity: 0;
		transition: all var(--transition-fast);
	}

	.docs-article :global(.code-block-wrapper:hover .code-copy-btn) {
		opacity: 1;
	}

	.docs-article :global(.code-copy-btn:hover) {
		background: rgba(255, 255, 255, 0.15);
		color: var(--color-text);
	}

	.docs-article :global(.code-copy-btn:focus) {
		opacity: 1;
		outline: none;
		box-shadow: var(--focus-ring, 0 0 0 2px var(--color-primary));
	}

	.docs-article :global(.code-copy-btn.copied) {
		background: var(--color-success, #22c55e);
		border-color: var(--color-success, #22c55e);
		color: white;
	}

	.docs-article :global(.code-copy-btn .copy-icon) {
		font-size: 0.75rem;
	}

	.docs-article :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: var(--space-lg);
	}

	.docs-article :global(th),
	.docs-article :global(td) {
		padding: var(--space-sm) var(--space-md);
		border: 1px solid rgba(255, 255, 255, 0.1);
		text-align: left;
	}

	.docs-article :global(th) {
		background: var(--color-bg-elevated);
		font-weight: 600;
	}

	.docs-article :global(blockquote) {
		border-left: 3px solid var(--color-primary);
		padding-left: var(--space-lg);
		margin: var(--space-lg) 0;
		color: var(--color-text-muted);
		font-style: italic;
	}

	/* ============================================
	   Footer
	   ============================================ */

	.docs-footer {
		margin-top: var(--space-2xl);
		padding-top: var(--space-xl);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.footer-nav {
		display: flex;
		justify-content: space-between;
	}

	.footer-link {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		color: var(--color-text-muted);
		text-decoration: none;
		padding: var(--space-md) var(--space-lg);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
		border: 1px solid rgba(255, 255, 255, 0.1);
		min-width: 180px;
	}

	.footer-link:hover {
		color: var(--color-primary);
		background: var(--color-primary-muted);
		border-color: var(--color-primary);
		text-decoration: none;
	}

	.footer-link.next {
		text-align: right;
		margin-left: auto;
	}

	.footer-link-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.footer-link-label {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
	}

	.footer-link:hover .footer-link-label {
		color: var(--color-primary);
		opacity: 0.7;
	}

	.footer-link-title {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-text);
	}

	.footer-link:hover .footer-link-title {
		color: var(--color-primary);
	}

	.footer-link-direction {
		font-size: 1.25rem;
		opacity: 0.6;
	}

	.footer-link:hover .footer-link-direction {
		opacity: 1;
	}

	/* ============================================
	   Mobile Toggle
	   ============================================ */

	.sidebar-toggle {
		display: none;
		position: fixed;
		bottom: var(--space-lg);
		right: var(--space-lg);
		z-index: 200;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-full);
		padding: var(--space-md) var(--space-lg);
		font-weight: 500;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.sidebar-toggle:hover {
		background: var(--color-primary-hover);
	}

	.toggle-icon {
		margin-right: var(--space-xs);
	}

	.sidebar-overlay {
		display: none;
	}

	/* ============================================
	   Responsive
	   ============================================ */

	@media (max-width: 1024px) {
		.docs-layout {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: fixed;
			left: -280px;
			top: 60px;
			height: calc(100vh - 60px);
			z-index: 150;
			transition: left var(--transition-normal);
		}

		.sidebar.open {
			left: 0;
		}

		.sidebar-toggle {
			display: flex;
			align-items: center;
		}

		.sidebar-overlay {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 140;
			border: none;
			cursor: pointer;
		}

		.docs-content {
			padding: var(--space-lg);
		}
	}

	@media (max-width: 640px) {
		.docs-header h1 {
			font-size: 1.5rem;
		}

		.docs-description {
			font-size: 1rem;
		}

		.footer-nav {
			flex-direction: column;
			gap: var(--space-sm);
		}
	}
</style>
