import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

const BASE_URL = 'https://fluidkit.github.io';

const pages = [
  '/',
  '/docs',
  '/docs/query',
  '/docs/form',
  '/docs/command',
  '/docs/prerender',
  '/docs/cli',
  '/docs/config',
];

export const GET: RequestHandler = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (path) => `  <url>
    <loc>${BASE_URL}${path}</loc>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
