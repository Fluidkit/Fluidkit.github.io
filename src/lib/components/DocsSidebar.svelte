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
				{ title: 'llm.txt', href: '/llm.txt' },
				{ title: 'llm-full.txt', href: '/llm-full.txt' },
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

<aside class="sticky top-20 w-[220px] shrink-0 overflow-y-auto pr-6" style="max-height: calc(100vh - 6rem)">
	<nav>
		{#each nav as group, gi}
			{#if gi > 0}
				<div class="my-3 h-px bg-[var(--border)]"></div>
			{/if}
			<div class="flex flex-col gap-0.5">
				<span class="mb-1.5 px-3 text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
					{group.label}
				</span>
				<ul class="m-0 list-none p-0">
					{#each group.items as item}
						<li>
							<a
								href={item.href}
								target={item.href.startsWith('http') ? '_blank' : undefined}
								class="block rounded-md px-3 py-1.5 text-[0.84rem] no-underline transition-[color,background] duration-150
									{isActive(item.href)
										? 'text-[var(--fk-cyan)] bg-[rgba(104,215,239,0.06)]'
										: 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/[0.03]'}"
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
