import { highlightMany } from '$lib/server/highlight';

export async function load() {
	return {
		blocks: await highlightMany({
			basicPy: {
				lang: 'python',
				filename: 'src/lib/posts.py',
				code: `from fluidkit import command

@command
async def like_post(post_id: int) -> bool:
    return await db.increment_likes(post_id)`
			},
			basicSvelte: {
				lang: 'svelte',
				code: `<script>
  import { like_post } from '$lib/posts.remote';

  let { post } = $props();
</script>

<button onclick={async () => {
  try {
    await like_post(post.id);
  } catch (err) {
    showToast('Something went wrong');
  }
}}>
  👍 Like
</button>`
			},
			typedPy: {
				lang: 'python',
				code: `from pydantic import BaseModel
from fluidkit import command

class LikeResult(BaseModel):
    post_id: int
    new_count: int

@command
async def like_post(post_id: int) -> LikeResult:
    count = await db.increment_likes(post_id)
    return LikeResult(post_id=post_id, new_count=count)`
			},
			typedSvelte: {
				lang: 'svelte',
				code: `<button onclick={async () => {
  const result = await like_post(post.id);
  console.log(result.new_count); // fully typed
}}>
  👍 Like
</button>`
			},
			errorsPy: {
				lang: 'python',
				code: `from fluidkit import command, error, get_request_event

@command
async def delete_post(post_id: int) -> None:
    event = get_request_event()
    session_id = event.cookies.get("session_id")
    if not session_id:
        error(401, "Unauthorized")

    post = await db.find(post_id)
    if not post:
        error(404, "Not found")

    await db.delete(post_id)`
			},
			serverRefresh: {
				lang: 'python',
				code: `from fluidkit import query, command

@query
async def get_posts() -> list[Post]:
    return await db.get_all_posts()

@command
async def like_post(post_id: int) -> None:
    await db.increment_likes(post_id)
    await get_posts().refresh()  # re-runs get_posts, sends result with this response`
			},
			serverSet: {
				lang: 'python',
				code: `@command
async def like_post(post_id: int) -> None:
    updated_posts = await db.increment_and_return_all(post_id)
    await get_posts().set(updated_posts)  # no re-execution, just sets the value`
			},
			clientUpdates: {
				lang: 'svelte',
				code: `<button onclick={async () => {
  await like_post(post.id).updates(get_posts());
}}>
  👍 Like
</button>`
			},
			clientOptimistic: {
				lang: 'svelte',
				code: `<script>
  import { get_posts, like_post } from '$lib/posts.remote';

  let { post } = $props();
</script>

<button onclick={async () => {
  await like_post(post.id).updates(
    get_posts().withOverride((posts) =>
      posts.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p)
    )
  );
}}>
  👍 {post.likes}
</button>`
			},
			cookiesPy: {
				lang: 'python',
				code: `from fluidkit import command, get_request_event

@command
async def logout() -> None:
    event = get_request_event()
    event.cookies.set("session_id", "", httponly=True, path="/", max_age=0)`
			}
		})
	};
}
