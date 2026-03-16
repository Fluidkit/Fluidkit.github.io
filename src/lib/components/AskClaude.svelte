<!-- AskClaude.svelte -->
<script lang="ts">
  import { page } from '$app/state';
  import ClaudeLogo from '$lib/assets/claude.svg?raw';

  interface Props {
    section?: string;
    label?: string;
  }

  let { section, label = 'Ask Claude' }: Props = $props();

  const docsUrl = 'https://fluidkit.github.io/llm-full.txt';

  let prompt = $derived(() => {
    const parts = [
      `Fetch the FluidKit documentation: ${docsUrl}`,
      `FluidKit uses Svelte 5 and SvelteKit remote functions — refer to https://svelte.dev/docs/kit/remote-functions for the SvelteKit side.`,
      `The user is on ${page.url.pathname}`,
      section ? `focusing on: ${section}.` : '.',
      `Answer their questions about FluidKit concisely.`
    ];
    return parts.join(' ');
  });

  let href = $derived(`https://claude.ai/new?q=${encodeURIComponent(prompt())}`);
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="group fixed bottom-6 right-4 z-50 inline-flex items-center gap-2 rounded-full
         px-3 py-3 sm:px-4 sm:py-2.5
         text-sm font-medium fk-glass border-white/10
         shadow-lg shadow-black/40 hover:bg-white/[0.06]
         hover:shadow-xl hover:shadow-black/50 transition-all duration-200 select-none
         safe-bottom"
>
  <span
    class="size-4 shrink-0 text-[#D4856A] opacity-80 group-hover:opacity-100 transition-opacity [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
  >
    {@html ClaudeLogo}
  </span>
  <span class="fk-gradient-text hidden sm:inline">{label}</span>
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
    class="hidden sm:block shrink-0 opacity-40 group-hover:opacity-70 -translate-x-0.5 group-hover:translate-x-0 transition-all duration-200"
  >
    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</a>
