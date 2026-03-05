<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		gradient?: boolean;
		align?: 'left' | 'center';
	}

	let { title, subtitle, gradient = true, align = 'center' }: Props = $props();
</script>

<div class="mb-14 {align === 'center' ? 'text-center' : 'text-left'}">
	<h2
		class="text-3xl font-bold tracking-tight md:text-4xl"
		class:fk-gradient-text={gradient}
		class:text-foreground={!gradient}
	>
		{title}
	</h2>
	{#if subtitle}
		<p class="mt-4 max-w-2xl text-lg text-muted-foreground {align === 'center' ? 'mx-auto' : ''}">
			{subtitle}
		</p>
	{/if}
</div>
