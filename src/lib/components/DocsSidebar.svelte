<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';

	interface NavItem {
		title: string;
		href: string;
	}

	interface NavGroup {
		label: string;
		items: NavItem[];
	}

    interface Props {
		onnavigate?: () => void;
	}

	const nav: NavGroup[] = [
		{
			label: 'Getting Started',
			items: [
				{ title: 'Quick Start', href: `${base}/docs` },
			]
		},
		{
			label: 'Remote Functions',
			items: [
				{ title: '@query', href: `${base}/docs/query` },
				{ title: '@form', href: `${base}/docs/form` },
				{ title: '@command', href: `${base}/docs/command` },
				{ title: '@prerender', href: `${base}/docs/prerender` },
			]
		},
		{
			label: 'Reference',
			items: [
				{ title: 'CLI', href: `${base}/docs/cli` },
				{ title: 'Configuration', href: `${base}/docs/config` },
			]
		}
	];

    let { onnavigate }: Props = $props();

	function isActive(href: string): boolean {
		const current = page.url.pathname.replace(/\/$/, '');
		const target = href.replace(/\/$/, '');
		return current === target;
	}
</script>

<aside class="sidebar">
	<nav>
		{#each nav as group, gi}
			{#if gi > 0}
				<div class="sidebar-sep"></div>
			{/if}
			<div class="sidebar-group">
				<span class="sidebar-label">{group.label}</span>
				<ul>
					{#each group.items as item}
						<li>
							<a
								href={item.href}
                                target={item.href.startsWith('http') ? '_blank' : undefined}
                                class="sidebar-link"
                                class:active={isActive(item.href)}
                                onclick={() => onnavigate?.()}
                            >
                                {item.title}
                            </a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>
</aside>

<style>
	.sidebar {
		width: 220px;
		flex-shrink: 0;
		position: sticky;
		top: 5rem;
		max-height: calc(100vh - 6rem);
		overflow-y: auto;
		padding-right: 1.5rem;
	}

	.sidebar-group {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.sidebar-label {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		padding: 0 0.75rem;
		margin-bottom: 0.375rem;
	}

	.sidebar-sep {
		height: 1px;
		background: var(--border);
		margin: 0.75rem 0;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.sidebar-link {
		display: block;
		padding: 0.375rem 0.75rem;
		font-size: 0.84rem;
		color: var(--muted-foreground);
		text-decoration: none;
		border-radius: 6px;
		transition: color 0.15s, background 0.15s;
	}

	.sidebar-link:hover {
		color: var(--foreground);
		background: rgba(255, 255, 255, 0.03);
	}

	.sidebar-link.active {
		color: var(--fk-cyan);
		background: rgba(104, 215, 239, 0.06);
	}
</style>
