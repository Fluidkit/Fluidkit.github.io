import { highlightMany } from '$lib/server/highlight';

export async function load() {
	return {
		blocks: await highlightMany({
			install: { code: 'pip install fluidkit', lang: 'bash' },
			scaffold: { code: `fluidkit init my-app\ncd my-app`, lang: 'bash' },
			dev: { code: 'fluidkit dev', lang: 'bash' },
			structure: {
				code: `my-app/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── lib/
│   │   ├── demo.py              # your backend logic
│   │   └── demo.remote.ts       # generated — don't edit
│   └── app.py                   # FastAPI entry point
├── fluidkit.config.json
├── svelte.config.js
└── package.json`,
				lang: 'text',
				filename: 'Project structure'
			},
			demoPy: {
				lang: 'python',
				filename: 'src/lib/demo.py',
				code: `from fluidkit import query, command, form

db = {
    "posts": [
        {"id": 1, "title": "Hello World", "content": "First post.", "likes": 10},
    ]
}

@query
async def get_posts():
    return db["posts"]

@command
async def like_post(post_id: int):
    for post in db["posts"]:
        if post["id"] == post_id:
            post["likes"] += 1
            await get_posts().refresh()
            return True
    return None

@form
async def add_post(title: str, content: str):
    new_post = {
        "id": len(db["posts"]) + 1,
        "title": title,
        "content": content,
        "likes": 0,
    }
    db["posts"].append(new_post)
    await get_posts().refresh()`
			},
			demoSvelte: {
				lang: 'svelte',
				filename: 'src/routes/+page.svelte',
				code: `<script>
  import { get_posts, like_post, add_post } from '$lib/demo.remote';
</script>

<form {...add_post}>
  <input {...add_post.fields.title.as('text')} placeholder="Title" />
  <input {...add_post.fields.content.as('text')} placeholder="Content" />
  <button>Add Post</button>
</form>

{#each await get_posts() as post}
  <div>
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    <button onclick={async () => await like_post(post.id)}>
      👍 {post.likes}
    </button>
  </div>
{/each}`
			}
		})
	};
}
