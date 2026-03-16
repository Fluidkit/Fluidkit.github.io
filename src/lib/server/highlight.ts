import { createHighlighter, type Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

function getShiki(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark-dimmed'],
      langs: ['python', 'svelte', 'typescript', 'javascript', 'bash', 'json', 'html', 'css', 'text']
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang: string = 'text', filename?: string) {
  const shiki = await getShiki();

  const html = shiki.codeToHtml(code.trim(), {
    lang,
    theme: 'github-dark-dimmed',
    transformers: [
      {
        pre(node) {
          delete node.properties.style;
        }
      }
    ]
  });

  return { html, lang, filename };
}

export async function highlightMany(
  blocks: Record<string, { code: string; lang?: string; filename?: string }>
) {
  const entries = await Promise.all(
    Object.entries(blocks).map(async ([key, { code, lang, filename }]) => [
      key,
      await highlight(code, lang, filename)
    ])
  );
  return Object.fromEntries(entries);
}
