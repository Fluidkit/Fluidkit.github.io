import { highlightMany } from '$lib/server/highlight';

export async function load() {
	return {
		blocks: await highlightMany({
			basicPy: {
				lang: 'python',
				filename: 'src/lib/posts.py',
				code: `from fluidkit import query

@query
async def get_posts():
    return [
        {"id": 1, "title": "Hello World"},
        {"id": 2, "title": "FluidKit"},
    ]`
			},
			basicSvelteAwait: {
				lang: 'svelte',
				filename: '+page.svelte',
				code: `<script>
  import { get_posts } from '$lib/posts.remote';
</script>

<ul>
  {#each await get_posts() as post}
    <li>{post.title}</li>
  {/each}
</ul>`
			},
			basicSvelteProps: {
				lang: 'svelte',
				filename: '+page.svelte',
				code: `<script>
  import { get_posts } from '$lib/posts.remote';

  const posts = get_posts();
</script>

{#if posts.error}
  <p>Something went wrong.</p>
{:else if posts.loading}
  <p>Loading...</p>
{:else}
  <ul>
    {#each posts.current as post}
      <li>{post.title}</li>
    {/each}
  </ul>
{/if}`
			},
			argsPy: {
				lang: 'python',
				code: `from fluidkit import query, error

@query
async def get_post(slug: str):
    post = db.get(slug)
    if not post:
        raise error(404, "Not found")
    return post`
			},
			argsSvelte: {
				lang: 'svelte',
				filename: '+page.svelte',
				code: `<script>
  import { get_post } from '$lib/posts.remote';

  let { params } = $props();
  const post = $derived(await get_post(params.slug));
</script>

<h1>{post.title}</h1>
<div>{@html post.content}</div>`
			},
			argsPydantic: {
				lang: 'python',
				code: `from pydantic import BaseModel

class PostFilter(BaseModel):
    tag: str | None = None
    limit: int = 10

@query
async def get_posts(filter: PostFilter):
    ...`
			},
			returnTypes: {
				lang: 'python',
				code: `from pydantic import BaseModel

class Post(BaseModel):
    id: int
    title: str
    content: str
    likes: int

@query
async def get_posts() -> list[Post]:
    ...`
			},
			errors: {
				lang: 'python',
				code: `from fluidkit import query, error

@query
async def get_post(slug: str):
    post = await db.find(slug)
    if not post:
        raise error(404, "Not found")
    return post`
			},
			refresh: {
				lang: 'svelte',
				code: `<button onclick={() => get_posts().refresh()}>
  Check for new posts
</button>`
			},
			batchPy: {
				lang: 'python',
				code: `from fluidkit import query

@query.batch
async def get_post_likes(post_ids: list[int]):
    likes = await db.get_likes_bulk(post_ids)
    lookup = {row.post_id: row.likes for row in likes}
    return lambda post_id, idx: lookup.get(post_id, 0)`
			},
			batchSvelte: {
				lang: 'svelte',
				filename: '+page.svelte',
				code: `<script>
  import { get_post_likes } from '$lib/posts.remote';
</script>

{#each posts as post}
  <div>
    {#await get_post_likes(post.id) then likes}
      <span>{likes} likes</span>
    {/await}
  </div>
{/each}`
			},
			batchRefreshPy: {
				lang: 'python',
				code: `@command
async def bump_likes(post_id: int) -> None:
    await db.increment_likes(post_id)
    await get_post_likes(post_id).refresh()`
			},
			batchRefreshSvelte: {
				lang: 'svelte',
				code: `<button onclick={() => get_post_likes(post.id).refresh()}>
  Refresh
</button>`
			},
			requestEvent: {
				lang: 'python',
				code: `from fluidkit import query, error, get_request_event

@query
async def get_profile():
    event = get_request_event()
    session_id = event.cookies.get("session_id")
    if not session_id:
        raise error(401, "Unauthorized")
    return await db.get_user(session_id)`
			}
		})
	};
}
