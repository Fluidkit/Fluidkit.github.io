<script lang="ts">
	import DocCode from '$lib/components/DocCode.svelte';
</script>

<h1>Getting Started</h1>

<p>
	FluidKit bridges Python and SvelteKit into a unified fullstack framework. Write backend functions in Python — FluidKit registers them as FastAPI endpoints and generates SvelteKit remote functions with full type safety.
</p>

<h2>Installation</h2>

<p>No system Node.js required — FluidKit bundles it automatically.</p>

<DocCode lang="bash" code={`pip install fluidkit`} />

<h2>Create a project</h2>

<DocCode lang="bash" code={`fluidkit init my-app
cd my-app`} />

<p>This scaffolds a SvelteKit project with FluidKit wired in and a working demo app:</p>

<DocCode filename="Project structure" code={`my-app/
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
└── package.json`} />

<h2>Run it</h2>

<DocCode lang="bash" code={`fluidkit dev`} />

<p>
	This starts both the FastAPI backend and Vite dev server together with hot module reloading. Open the app and you'll see a working posts demo — try adding posts and liking them.
</p>

<h2>How the demo works</h2>

<p>The scaffolded <code>demo.py</code> contains three decorated functions:</p>

<DocCode filename="src/lib/demo.py" lang="python" code={`from fluidkit import query, command, form

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
    await get_posts().refresh()`} />

<p>The route imports and uses them directly:</p>

<DocCode filename="src/routes/+page.svelte" lang="svelte" code={`<script>
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
{/each}`} />

<p>
	Notice the import path: <code>$lib/demo.remote</code>. FluidKit generates <code>demo.remote.ts</code> next to your <code>demo.py</code> — this is a standard SvelteKit remote function file that proxies calls to your Python backend. You never need to edit it.
</p>

<h2>What just happened?</h2>

<p>When you decorated functions with <code>@query</code>, <code>@command</code>, and <code>@form</code>, FluidKit:</p>

<ul>
	<li><strong>Registered each function as a FastAPI endpoint</strong> — with parameter types, validation, and return types extracted automatically</li>
	<li><strong>Generated a <code>.remote.ts</code> file</strong> — a SvelteKit remote function wrapper that calls your FastAPI endpoint with full type safety</li>
	<li><strong>Wired up cache invalidation</strong> — <code>get_posts().refresh()</code> inside <code>like_post</code> and <code>add_post</code> tells SvelteKit to refetch that query in the same round-trip</li>
</ul>

<h2>Next steps</h2>

<ul>
	<li><a href="/docs/query">@query</a> — arguments, batching, refresh</li>
	<li><a href="/docs/command">@command</a> — writing data, updating queries, optimistic updates</li>
	<li><a href="/docs/form">@form</a> — fields, validation, file uploads, progressive enhancement</li>
	<li><a href="/docs/prerender">@prerender</a> — build-time data with optional runtime fallback</li>
	<li><a href="/docs/cli">CLI</a> — all available commands</li>
	<li><a href="/docs/config">Configuration</a> — fluidkit.config.json reference</li>
</ul>
