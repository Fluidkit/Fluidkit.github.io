import { highlightMany } from '$lib/server/highlight';

export async function load() {
	return {
		blocks: await highlightMany({
			basicPy: {
				lang: 'python',
				filename: 'src/lib/content.py',
				code: `from fluidkit import prerender
from pydantic import BaseModel

class Post(BaseModel):
    slug: str
    title: str
    content: str

@prerender
async def get_posts() -> list[Post]:
    return await db.get_all_posts()`
			},
			basicSvelte: {
				lang: 'svelte',
				filename: '+page.svelte',
				code: `<script>
  import { get_posts } from '$lib/content.remote';
</script>

{#each await get_posts() as post}
  <a href="/blog/{post.slug}">{post.title}</a>
{/each}`
			},
			argsPy: {
				lang: 'python',
				code: `from fluidkit import prerender, error

@prerender
async def get_post(slug: str) -> Post:
    post = await db.find(slug)
    if not post:
        error(404, "Not found")
    return post`
			},
			argsSvelte: {
				lang: 'svelte',
				filename: '+page.svelte',
				code: `<script>
  import { get_post } from '$lib/content.remote';

  let { params } = $props();
</script>

{#await get_post(params.slug) then post}
  <h1>{post.title}</h1>
  <div>{@html post.content}</div>
{/await}`
			},
			inputsStatic: {
				lang: 'python',
				code: `@prerender(inputs=["hello-world", "about-fluidkit", "getting-started"])
async def get_post(slug: str) -> Post:
    post = await db.find(slug)
    if not post:
        error(404, "Not found")
    return post`
			},
			inputsCallable: {
				lang: 'python',
				code: `@prerender(inputs=lambda: db.get_all_slugs())
async def get_post(slug: str) -> Post:
    ...`
			},
			inputsAsyncCallable: {
	lang: 'python',
	code: `async def get_all_slugs():
    return await db.fetch_slugs()

@prerender(inputs=get_all_slugs)
async def get_post(slug: str) -> Post:
    ...`
			},
			dynamicPy: {
				lang: 'python',
				code: `@prerender(inputs=["hello-world", "about-fluidkit"], dynamic=True)
async def get_post(slug: str) -> Post:
    post = await db.find(slug)
    if not post:
        error(404, "Not found")
    return post`
			},
			noArgPy: {
				lang: 'python',
				code: `@prerender
async def get_site_config() -> SiteConfig:
    return await db.get_config()`
			}
		})
	};
}
