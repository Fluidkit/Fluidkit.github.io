<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id?: string;
		class?: string;
		narrow?: boolean;
		children: Snippet;
	}

	let { id, class: className = '', narrow = false, children }: Props = $props();
</script>

<section {id} class="w-full px-6 py-20 md:py-28 {className}">
	<div class="mx-auto {narrow ? 'max-w-3xl' : 'max-w-6xl'}">
		{@render children()}
	</div>
</section>
