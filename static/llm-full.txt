# FluidKit — Complete Reference

> Web development for the Pythonist

FluidKit bridges Python and SvelteKit into a unified fullstack framework. Decorate Python functions — FluidKit registers them as FastAPI endpoints and generates colocated `.remote.ts` files that SvelteKit imports as native remote functions with full type safety, cookie forwarding, file uploads, redirects, and single-flight cache invalidation.

- Website: https://fluidkit.github.io
- GitHub: https://github.com/AswanthManoj/Fluidkit
- PyPI: https://pypi.org/project/fluidkit/
- SvelteKit remote functions: https://svelte.dev/docs/kit/remote-functions

## Install

pip install fluidkit

No system Node.js required — FluidKit bundles it via nodejs-wheel.

## How it works

1. You decorate a Python function (async or sync) with @query, @command, @form, or @prerender
2. FluidKit registers it as a FastAPI endpoint (parameter types, validation, return types extracted automatically)
3. FluidKit generates a colocated `.remote.ts` file — a SvelteKit remote function wrapper with full TypeScript types
4. You import from `$lib/yourfile.remote` in Svelte and use it as a native SvelteKit remote function

Generated `.remote.ts` files update automatically on save in dev mode via HMR (Jurigged). They are real TypeScript you can inspect and version control.

All four decorators support both async and sync functions. Use async def when you need await — for database calls, HTTP requests, or .refresh() and .set() on async queries. Use plain def for simple synchronous logic. Sync functions run in a threadpool automatically. If a query is sync, its .refresh() and .set() are also sync — no await needed.

---

## @query — Read data

Use @query to read data from the server. Queries are cached on the client and can be refreshed on demand.

### Basic usage

```python
from fluidkit import query

@query
async def get_posts():
    return [
        {"id": 1, "title": "Hello World"},
        {"id": 2, "title": "FluidKit"},
    ]
```

Svelte usage with await (recommended):
```svelte
<script>
  import { get_posts } from '$lib/posts.remote';
</script>

<ul>
  {#each await get_posts() as post}
    <li>{post.title}</li>
  {/each}
</ul>
```

Until the promise resolves — and if it errors — the nearest <svelte:boundary> will be invoked.

Alternative usage with loading/error/current properties:
```svelte
<script>
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
{/if}
```

### Arguments

Query functions can accept typed arguments:

```python
from fluidkit import query, error

@query
async def get_post(slug: str):
    post = db.get(slug)
    if not post:
        error(404, "Not found")
    return post
```

```svelte
<script>
  import { get_post } from '$lib/posts.remote';

  let { params } = $props();
  const post = $derived(await get_post(params.slug));
</script>

<h1>{post.title}</h1>
<div>{@html post.content}</div>
```

Arguments are validated by Python's type hints. FluidKit extracts the types from your function signature and generates the corresponding TypeScript types — no manual schema needed.

For richer validation, use Pydantic models:

```python
from pydantic import BaseModel

class PostFilter(BaseModel):
    tag: str | None = None
    limit: int = 10

@query
async def get_posts(filter: PostFilter):
    ...
```

FluidKit generates a TypeScript interface for PostFilter automatically and uses it in the generated .remote.ts file.

### Return types

Annotate your return type and FluidKit will reflect it into TypeScript:

```python
from pydantic import BaseModel

class Post(BaseModel):
    id: int
    title: str
    content: str
    likes: int

@query
async def get_posts() -> list[Post]:
    ...
```

The Svelte side gets full type safety — post.title autocompletes, post.nonexistent errors at build time. If you omit the return annotation, the generated type will be `any`.

### Errors

Call `error()` to return an HTTP error:

```python
from fluidkit import query, error

@query
async def get_post(slug: str):
    post = await db.find(slug)
    if not post:
        error(404, "Not found")
    return post
```

When using await in templates, this triggers the nearest <svelte:boundary>. If you're using the loading/error/current properties instead, the error is available via the error property on the query.

### Refreshing queries

Any query can be refetched via its refresh method:
```svelte
<button onclick={() => get_posts().refresh()}>
  Check for new posts
</button>
```

Queries are cached while they're on the page, meaning get_posts() === get_posts(). You don't need to store a reference to update it.

### Batching — @query.batch

When multiple components each call the same query with different arguments, each call normally results in a separate request. @query.batch solves this by collecting concurrent calls into a single request.

```python
from fluidkit import query

@query.batch
async def get_post_likes(post_ids: list[int]):
    likes = await db.get_likes_bulk(post_ids)
    lookup = {row.post_id: row.likes for row in likes}
    return lambda post_id, idx: lookup.get(post_id, 0)
```

The function receives a list of all the arguments from concurrent calls. It must return a callable with the signature (arg, index) -> result that resolves each individual call.

Svelte side usage looks identical to a regular query:
```svelte
<script>
  import { get_post_likes } from '$lib/posts.remote';
</script>

{#each posts as post}
  <div>
    {#await get_post_likes(post.id) then likes}
      <span>{likes} likes</span>
    {/await}
  </div>
{/each}
```

Even though each iteration calls get_post_likes individually, SvelteKit collects all calls within the same render and sends them as a single batched request.

Batch queries support .refresh() and .set() for individual arguments:

```python
@command
async def bump_likes(post_id: int) -> None:
    await db.increment_likes(post_id)
    await get_post_likes(post_id).refresh()  # re-fetches just this post's likes
```

```svelte
<button onclick={() => get_post_likes(post.id).refresh()}>
  Refresh
</button>
```

Each .refresh() call re-executes the batch function with just the single argument — it does not refetch all active batch entries.

Use @query.batch when the same query is called many times with different arguments in a single render — lists of cards, rows in a table, items in a feed. If a query is only ever called once at a time, regular @query is simpler.

### Accessing the request

Use get_request_event() to access cookies and other request data:

```python
from fluidkit import query, error, get_request_event

@query
async def get_profile():
    event = get_request_event()
    session_id = event.cookies.get("session_id")
    if not session_id:
        error(401, "Unauthorized")
    return await db.get_user(session_id)
```

Queries can read cookies but not set them. To set cookies, use @form or @command.

---

## @form — Write data via forms

Use @form to write data via <form> elements. Forms work without JavaScript (progressive enhancement), support file uploads, and can trigger redirects.

### Basic usage

```python
from fluidkit import form

@form
async def add_post(title: str, content: str) -> None:
    await db.insert(title, content)
```

The returned object spreads onto a <form> element. Field names match your Python parameter names:

```svelte
<script>
  import { add_post } from '$lib/posts.remote';
</script>

<form {...add_post}>
  <input {...add_post.fields.title.as('text')} placeholder="Title" />
  <textarea {...add_post.fields.content.as('text')} placeholder="Content"></textarea>
  <button>Publish</button>
</form>
```

The form works as a native HTML form submission if JavaScript is unavailable. When JavaScript is present, SvelteKit progressively enhances it to submit without a full page reload.

### Fields

Each parameter in your function becomes a field. Call .as(...) on a field to get the attributes for the corresponding input type:

```python
@form
async def create_profile(name: str, age: int, bio: str) -> None:
    ...
```

```svelte
<form {...create_profile}>
  <input {...create_profile.fields.name.as('text')} />
  <input {...create_profile.fields.age.as('number')} />
  <textarea {...create_profile.fields.bio.as('text')}></textarea>
  <button>Save</button>
</form>
```

The .as(...) method sets the correct input type, the name attribute used to construct form data, and the aria-invalid state for validation.

### Nested types

Forms support Pydantic models, arrays, and nested objects as parameters. SvelteKit parses flat form fields into structured data before FluidKit forwards it to your Python handler:
```python
from typing import Optional
from pydantic import BaseModel
from fluidkit import form

class Info(BaseModel):
    height: int
    likesDogs: Optional[bool] = None

@form
async def create_profile(name: str, age: int, tags: list[str], info: Info) -> None:
    await db.insert_profile(name, age, tags, info)
```
```svelte
<form {...create_profile}>
  <input {...create_profile.fields.name.as('text')} />
  <input {...create_profile.fields.age.as('number')} />

  <input {...create_profile.fields.tags[0].as('text')} placeholder="Tag 1" />
  <input {...create_profile.fields.tags[1].as('text')} placeholder="Tag 2" />

  <input {...create_profile.fields.info.height.as('number')} />
  <input {...create_profile.fields.info.likesDogs.as('checkbox')} /> Likes dogs

  <button>Save</button>
</form>
```

Nested fields use dot notation for objects (info.height) and bracket notation for arrays (tags[0]). SvelteKit coerces values based on the input name prefix: n: for numbers, b: for booleans.

Files work alongside nested types. When files are present, FluidKit sends structured data as JSON and files as separate multipart fields:
```python
from pydantic import BaseModel
from fluidkit import form, FileUpload

class Info(BaseModel):
    height: int
    likesDogs: bool = False

@form
async def create_profile(
    name: str,
    info: Info,
    tags: list[str],
    photo: FileUpload,
    docs: list[FileUpload],
) -> None:
    await storage.save(photo.filename, await photo.read())
    for doc in docs:
        await storage.save(doc.filename, await doc.read())
    await db.insert_profile(name, info, tags)
```
```svelte
<form {...create_profile} enctype="multipart/form-data">
  <input {...create_profile.fields.name.as('text')} />
  <input {...create_profile.fields.info.height.as('number')} />
  <input {...create_profile.fields.info.likesDogs.as('checkbox')} /> Likes dogs

  <input {...create_profile.fields.tags[0].as('text')} placeholder="Tag 1" />
  <input {...create_profile.fields.tags[1].as('text')} placeholder="Tag 2" />

  <input {...create_profile.fields.photo.as('file')} />
  <input {...create_profile.fields.docs.as('file')} multiple />

  <button>Save</button>
</form>
```

### File uploads

Use FileUpload for file parameters:

```python
from fluidkit import form, FileUpload

@form
async def upload_avatar(username: str, photo: FileUpload) -> None:
    contents = await photo.read()
    await storage.save(photo.filename, contents)
    await db.update_avatar(username, photo.filename)
```

```svelte
<form {...upload_avatar} enctype="multipart/form-data">
  <input {...upload_avatar.fields.username.as('text')} />
  <input {...upload_avatar.fields.photo.as('file')} />
  <button>Upload</button>
</form>
```

Add enctype="multipart/form-data" to the form when using file inputs. FileUpload extends FastAPI's UploadFile, so all its methods (read(), filename, content_type, etc.) are available.

### Redirects

Call `redirect()` to navigate after a successful submission:

```python
from fluidkit import form, redirect

@form
async def create_post(title: str, content: str) -> None:
    slug = title.lower().replace(" ", "-")
    await db.insert(slug, title, content)
    redirect(303, f"/blog/{slug}")
```

The redirect is captured by the FluidKit backend and forwarded to SvelteKit, which performs the navigation on the client. Common status codes:
- 303 — See Other (most common for form submissions, redirects as GET)
- 307 — Temporary Redirect (preserves request method)
- 308 — Permanent Redirect (preserves request method, SEO transfers)

### Errors

Call `error()` to return an HTTP error:

```python
from fluidkit import form, error, get_request_event

@form
async def create_post(title: str, content: str) -> None:
    event = get_request_event()
    session_id = event.cookies.get("session_id")
    if not session_id:
        error(401, "Unauthorized")
    await db.insert(title, content)
```

If an error occurs during form submission, the nearest +error.svelte page will be rendered. This is different from @query (which triggers <svelte:boundary>) and @command (which relies on your own try/catch).

### Validation

SvelteKit provides client-side validation via the issues() method on each field and the validate() method on the form:

```svelte
<form {...add_post} oninput={() => add_post.validate()}>
  <label>
    Title
    {#each add_post.fields.title.issues() as issue}
      <p class="error">{issue.message}</p>
    {/each}
    <input {...add_post.fields.title.as('text')} />
  </label>

  <button>Publish</button>
</form>
```

Server-side validation comes from Python's type system — if a parameter can't be coerced to the expected type (e.g. a string sent for an int field), the form handler returns a 400 error automatically.

### Returns

Instead of redirecting, a form can return data:

```python
@form
async def add_post(title: str, content: str) -> dict:
    await db.insert(title, content)
    return {"success": True}
```

```svelte
<form {...add_post}>
  <!-- fields -->
  <button>Publish</button>
</form>

{#if add_post.result?.success}
  <p>Published!</p>
{/if}
```

This value is ephemeral — it vanishes on resubmit, navigation, or page reload.

### Single-flight mutations

By default, all queries on the page are refreshed after a successful form submission. For more control, specify which queries to update inside the form handler:

Use .refresh() to re-execute a query and include its new result:

```python
from fluidkit import form, query

@query
async def get_posts() -> list[Post]:
    return await db.get_all_posts()

@form
async def add_post(title: str, content: str) -> None:
    await db.insert(title, content)
    await get_posts().refresh()  # re-runs get_posts, sends result with this response
```

Use .set() to update a query's value directly without re-executing it:

```python
@form
async def add_post(title: str, content: str) -> None:
    new_post = await db.insert_and_return(title, content)
    all_posts = await db.get_all_posts()
    await get_posts().set(all_posts)  # set value without re-running the query
```

Both .refresh() and .set() only work inside @form and @command handlers. Calling them elsewhere produces a warning.

### Cookies

Forms can read and set cookies:

```python
from fluidkit import form, get_request_event

@form
async def login(username: str, _password: str) -> None:
    user = await db.authenticate(username, _password)
    event = get_request_event()
    event.cookies.set("session_id", user.session, httponly=True, path="/")
```

Prefix sensitive parameter names with an underscore (e.g. _password) to prevent them from being sent back to the client on validation failure — matching SvelteKit's convention.

### Enhance

Customize submission behavior with the enhance method on the Svelte side:

```svelte
<form {...add_post.enhance(async ({ form, data, submit }) => {
  try {
    await submit();
    form.reset();
    showToast('Published!');
  } catch (error) {
    showToast('Something went wrong');
  }
})}>
  <!-- fields -->
</form>
```

When using enhance, the form is not automatically reset — call form.reset() explicitly if needed.

### Supported parameter types

@form supports any type that can be represented as form fields:
- str, int, float, bool — primitive inputs
- FileUpload, list[FileUpload] — file inputs
- list[str], list[int], etc. — multiple inputs with bracket notation
- Optional[...] — optional fields
- Pydantic BaseModel — nested objects via dot notation

---

## @command — Write data imperatively

Use @command to write data from anywhere — event handlers, button clicks, any imperative call. Unlike @form, commands are not tied to a <form> element and require JavaScript.

Prefer @form where possible, since it works without JavaScript via progressive enhancement. Use @command when the action doesn't map naturally to a form submission.

### Basic usage

```python
from fluidkit import command

@command
async def like_post(post_id: int) -> bool:
    return await db.increment_likes(post_id)
```

```svelte
<script>
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
</button>
```

Commands cannot be called during render — only from event handlers or other imperative code.

### Arguments and return types

Annotate parameters and return types for full type safety:

```python
from pydantic import BaseModel
from fluidkit import command

class LikeResult(BaseModel):
    post_id: int
    new_count: int

@command
async def like_post(post_id: int) -> LikeResult:
    count = await db.increment_likes(post_id)
    return LikeResult(post_id=post_id, new_count=count)
```

```svelte
<button onclick={async () => {
  const result = await like_post(post.id);
  console.log(result.new_count); // fully typed
}}>
```

### Errors

Call `error()` to return an HTTP error:

```python
from fluidkit import command, error, get_request_event

@command
async def delete_post(post_id: int) -> None:
    event = get_request_event()
    session_id = event.cookies.get("session_id")
    if not session_id:
        error(401, "Unauthorized")

    post = await db.find(post_id)
    if not post:
        error(404, "Not found")

    await db.delete(post_id)
```

Since commands are called imperatively, errors are caught by your own try/catch block. This is different from @query (triggers <svelte:boundary>) and @form (renders +error.svelte).

### Updating queries — server-driven

Inside the command handler, call .refresh() on any query to re-execute it and send the new data back in a single round-trip:

```python
from fluidkit import query, command

@query
async def get_posts() -> list[Post]:
    return await db.get_all_posts()

@command
async def like_post(post_id: int) -> None:
    await db.increment_likes(post_id)
    await get_posts().refresh()  # re-runs get_posts, sends result with this response
```

If you already have the updated data, use .set():

```python
@command
async def like_post(post_id: int) -> None:
    updated_posts = await db.increment_and_return_all(post_id)
    await get_posts().set(updated_posts)  # no re-execution, just sets the value
```

Both approaches are single-flight mutations — updated query data travels back with the command response, no second round-trip.

### Updating queries — client-driven

Specify which queries to update from the Svelte side using .updates():

```svelte
<button onclick={async () => {
  await like_post(post.id).updates(get_posts());
}}>
  👍 Like
</button>
```

For optimistic updates, use .withOverride():

```svelte
<script>
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
</button>
```

The override is applied immediately and released when the command completes or fails.

### Cookies

Commands can read and set cookies:

```python
from fluidkit import command, get_request_event

@command
async def logout() -> None:
    event = get_request_event()
    event.cookies.set("session_id", "", httponly=True, path="/", max_age=0)
```

### Redirects

Commands do NOT support redirects in FluidKit. If you call `redirect()` inside a `@command`, it will be logged as a warning and ignored on the client. Use @form if you need redirect behavior after a mutation.

---

## @prerender — Build-time data

Use @prerender to fetch data at build time. Prerendered data is served as static assets from a CDN, making navigation near-instant. Use this for content that changes only when you redeploy.

### Basic usage

```python
from fluidkit import prerender
from pydantic import BaseModel

class Post(BaseModel):
    slug: str
    title: str
    content: str

@prerender
async def get_posts() -> list[Post]:
    return await db.get_all_posts()
```

```svelte
<script>
  import { get_posts } from '$lib/content.remote';
</script>

{#each await get_posts() as post}
  <a href="/blog/{post.slug}">{post.title}</a>
{/each}
```

On the client, prerendered data is cached using the browser's Cache API. This cache survives page reloads and is cleared when the user first visits a new deployment.

### Arguments

Like @query, prerender functions can accept arguments:

```python
from fluidkit import prerender, error

@prerender
async def get_post(slug: str) -> Post:
    post = await db.find(slug)
    if not post:
        error(404, "Not found")
    return post
```

```svelte
<script>
  import { get_post } from '$lib/content.remote';

  let { params } = $props();
</script>

{#await get_post(params.slug) then post}
  <h1>{post.title}</h1>
  <div>{@html post.content}</div>
{/await}
```

Any calls found by SvelteKit's crawler during prerendering are saved automatically.

### Prerender inputs

Pass a list of arguments to prerender at build time:

```python
@prerender(inputs=["hello-world", "about-fluidkit", "getting-started"])
async def get_post(slug: str) -> Post:
    post = await db.find(slug)
    if not post:
        error(404, "Not found")
    return post
```

You can also use a callable:

```python
@prerender(inputs=lambda: db.get_all_slugs())
async def get_post(slug: str) -> Post:
    ...
```

Callable inputs — including async callables — are resolved at decoration time and serialized as static lists in the generated .remote.ts file.

### Dynamic fallback

By default, prerender functions are excluded from your server bundle — calling them with an argument that wasn't prerendered will fail. Set dynamic=True to allow runtime fallback:

```python
@prerender(inputs=["hello-world", "about-fluidkit"], dynamic=True)
async def get_post(slug: str) -> Post:
    post = await db.find(slug)
    if not post:
        error(404, "Not found")
    return post
```

With dynamic=True, "hello-world" and "about-fluidkit" are prerendered at build time. Any other slug is fetched from the server at runtime — slower on first load, but the function still works.

### No-argument prerender

For data with no arguments, @prerender is used bare:

```python
@prerender
async def get_site_config() -> SiteConfig:
    return await db.get_config()
```

This runs once at build time. Every page that calls get_site_config() gets the cached result instantly.

### When to use @prerender vs @query

@prerender:
- Data fetched at build time
- Instant (static asset)
- Stale until redeployment
- Best for: blog posts, docs, config

@query:
- Data fetched at request time
- Network round-trip
- Always current
- Best for: user data, dashboards, feeds

Use @prerender with dynamic=True for a hybrid approach.

### Limitations

- Prerender functions cannot set cookies (read-only, same as @query)
- Prerender functions do not support .refresh() or .set() — data is static

---

## Single-flight mutations — detailed

Inside @form and @command handlers, update queries without a second network round-trip:

### .refresh()
Re-executes the query on the server and sends the new data back with the response:
```python
await get_posts().refresh()
```

### .set(value)
Sets the query's cached value directly without re-executing it:
```python
await get_posts().set(updated_data)
```

Both only work inside @form and @command handlers. Calling them elsewhere produces a warning.

### Default behavior differences
- @form: By default, ALL queries on the page are refreshed after a successful submission. Using .refresh() or .set() inside the handler overrides this to only update specified queries.
- @command: By default, NO queries are refreshed. You must explicitly specify which to update, either server-side (.refresh()/.set()) or client-side (.updates()).

### Client-driven updates
From Svelte, use .updates() on the command or enhanced form submit:
```
await like_post(post.id).updates(get_posts())
```

### Optimistic updates
Use .withOverride() to set a temporary value while the mutation is in flight:
```
await like_post(post.id).updates(
  get_posts().withOverride((posts) => [...posts, optimisticPost])
)
```
The override is applied immediately and released when the mutation completes or fails.

---

## Key APIs

### error(status, message)
Call to return an HTTP error. Import from fluidkit.

```python
from fluidkit import error

error(404, "Not found")
error(401, "Unauthorized")
error(400, "Bad request")
```

Behavior depends on calling context:
- @query: triggers nearest <svelte:boundary>
- @form: renders nearest +error.svelte
- @command: caught by caller's try/catch
- @prerender: fails the build; with dynamic=True at runtime, triggers nearest <svelte:boundary>

### redirect(status, url)
Only works in @form. Call to navigate after submission.

```python
from fluidkit import redirect

redirect(303, "/dashboard")
redirect(307, "/temporary-location")
redirect(308, "/permanent-location")
```

Status codes:
- 303 — See Other (most common for forms, redirects as GET)
- 307 — Temporary Redirect (preserves method)
- 308 — Permanent Redirect (preserves method, SEO transfers)

Calling `redirect()` in @command is logged as a warning and ignored on the client.

### get_request_event()
Access cookies, locals, and request data. Available in all decorators.

```python
from fluidkit import get_request_event

event = get_request_event()

# Read cookies (all decorators)
session_id = event.cookies.get("session_id")
locale = event.cookies.get("locale") or "en"

# Set cookies (@form and @command only)
event.cookies.set("session_id", value, httponly=True, path="/")
event.cookies.set("session_id", "", httponly=True, path="/", max_age=0)  # delete

# Locals — shared with @hooks.handle. Serializable values forwarded to SvelteKit.
event.locals["user_id"] = user.id
```

Cookie options: httponly, path, max_age, secure, samesite, domain — passed through to SvelteKit's cookie API.

Restrictions:
- @query and @prerender: can read cookies, CANNOT set them (raises RuntimeError)
- @form and @command: can read and set cookies

### FileUpload
File parameter type for @form. Extends FastAPI's UploadFile.

```python
from fluidkit import FileUpload

@form
async def upload(label: str, photo: FileUpload) -> dict:
    contents = await photo.read()
    name = photo.filename
    mime = photo.content_type
    size = len(contents)
    return {"filename": name, "size": size}
```

Available properties and methods:
- photo.filename — original filename
- photo.content_type — MIME type
- await photo.read() — read file contents as bytes
- All other FastAPI UploadFile methods

On the Svelte side, use .as('file') and add enctype="multipart/form-data" to the form.

### preserve(value_or_factory)
Keep expensive objects alive across HMR reloads in dev mode.

```python
from fluidkit import preserve
import httpx

# Factory — only called once, survives HMR
client = preserve(lambda: httpx.AsyncClient(base_url="https://api.example.com"))

# Direct value — created once, reused on reload
cache = preserve({})
```

Accepts a value or zero-argument callable. If a callable is passed, it's invoked only on the first execution. On subsequent HMR reloads, the stored value is returned.

Only use for objects that must survive re-execution (DB connections, HTTP clients, caches). Don't use for values you want to update during development — those update automatically via HMR.

---

## Hooks

Import `hooks` from `fluidkit`:

```python
from fluidkit import hooks
```

### Lifecycle

```python
@hooks.init
async def setup():
    global db
    db = await Database.connect("postgresql://...")

@hooks.cleanup
async def teardown():
    await db.close()

@hooks.lifespan
async def manage_redis():
    global redis
    redis = await aioredis.from_url("redis://localhost")
    yield
    await redis.close()
```

`@hooks.init` and `@hooks.cleanup` accept async or sync functions with no parameters. Only one of each is allowed per application.

`@hooks.lifespan` accepts an async or sync generator that yields exactly once. Code before yield runs at startup, code after runs at shutdown. Only one is allowed per application.

### Request middleware — @hooks.handle

Runs on every remote function call. Receives `(event, resolve)`. Must return `await resolve(event)` or an early return value.

```python
@hooks.handle
async def auth(event, resolve):
    token = event.cookies.get("access_token")
    event.locals["user"] = await verify_token(token)
    return await resolve(event)

@hooks.handle
async def logging(event, resolve):
    import time
    start = time.time()
    result = await resolve(event)
    print(f"{event.method} {event.url} took {time.time() - start:.2f}s")
    return result
```

Multiple `@hooks.handle` hooks are allowed. Default execution order is source order within a file, then file import order across files. Use `hooks.sequence()` for explicit order:

```python
hooks.sequence(auth, logging)
```

`hooks.sequence()` can only be called once per application — calling it from a second module raises `RuntimeError`. Calling it again from the same module replaces the previous order. Each function passed must already be decorated with `@hooks.handle`.

The `event` object passed to `@hooks.handle` (`HookEvent`):
- `event.url` — full request URL string
- `event.method` — HTTP method string
- `event.headers` — dict of incoming request headers
- `event.cookies` — shared `Cookies` instance. The same instance is shared with `RequestEvent` inside the remote function, so cookie writes from a hook are visible inside the handler and collected together at response time
- `event.locals` — shared `_LocalsDict`. Values set here are visible inside the remote function. Serializable values are forwarded to SvelteKit via `__fk_locals`
- `event.is_remote` — `True` for remote function calls, `False` for page-level requests

Sync handle hooks are supported — they run in a thread executor automatically.

### Error hooks

Error hooks fire for unexpected exceptions only. `error()` (HTTPError) and `redirect()` are intentional control flow and never reach these hooks.

#### @hooks.handle_error

Catches unexpected errors. Fires for:
- `TypeError` — wrong argument types (status 400)
- `ValueError` — invalid data in `@form` handlers (status 400), unhandled elsewhere (status 500)
- Any other unhandled `Exception` (status 500)

Must accept four parameters: `(error, event, status, message)`. Must return a dict with at minimum `{"message": str}`. The returned dict becomes the full JSON response body at the corresponding status code.

```python
@hooks.handle_error
async def on_error(error, event, status, message):
    error_id = str(uuid4())
    logger.exception(error, extra={"error_id": error_id})
    return {"message": "Something went wrong", "error_id": error_id}
```

#### @hooks.handle_validation_error

Catches pydantic `ValidationError` raised when a remote function parameter fails schema validation (status 400). Does not fire for other error types.

Must accept two parameters: `(issues, event)` where `issues` is pydantic's `e.errors()` structured list. Must return a dict with at minimum `{"message": str}`.

```python
@hooks.handle_validation_error
async def on_validation_error(issues, event):
    first = issues[0] if issues else {}
    field = first.get("loc", ("input",))[-1]
    return {"message": f"Invalid value for field: {field}"}
```

Only one `@hooks.handle_error` and one `@hooks.handle_validation_error` are allowed per application. If either hook itself raises, the default error response is used silently — the hook's exception is not propagated.

### Generated src/hooks.server.ts

When any hooks are registered, FluidKit automatically generates `src/hooks.server.ts` containing a SvelteKit `handle` export. The generated file POST's to `/__fk_hooks__` before every page request. The Python server runs your `@hooks.handle` chain and returns cookies and locals piggybacked on the response. Cookies are applied via `event.cookies.set()` and locals are merged into `event.locals` before the page renders — which is why cookie writes from handle hooks work correctly even for `@query` and `@prerender`.

If no hooks are registered and the file was previously generated by FluidKit, it is removed automatically. Do not edit this file manually — FluidKit overwrites it. If you need additional SvelteKit server handle logic, use SvelteKit's `sequence()` helper to compose the generated handle with your own.

### Deprecated lifecycle API

`@on_startup`, `@on_shutdown`, and `@lifespan` imported directly from `fluidkit` are deprecated wrappers. They still work but emit `DeprecationWarning` at decoration time and delegate to the hooks API.

| Deprecated import | Replacement |
|---|---|
| `from fluidkit import on_startup` | `@hooks.init` |
| `from fluidkit import on_shutdown` | `@hooks.cleanup` |
| `from fluidkit import lifespan` | `@hooks.lifespan` |

Migration example:
```python
# Before
from fluidkit import on_startup, on_shutdown

@on_startup
async def setup():
    ...

@on_shutdown
async def teardown():
    ...

# After
from fluidkit import hooks

@hooks.init
async def setup():
    ...

@hooks.cleanup
async def teardown():
    ...
```

## Type mapping

Python type annotations and Pydantic models are reflected into TypeScript automatically.

| Python                | TypeScript                    |
|-----------------------|-------------------------------|
| str                   | string                        |
| int                   | number                        |
| float                 | number                        |
| bool                  | boolean                       |
| list[X]               | X[]                           |
| dict                  | Record<string, unknown>       |
| Optional[X]           | X \| null                     |
| X \| None             | X \| null                     |
| Pydantic BaseModel    | interface                     |
| Enum(str, Enum)       | enum                          |
| list[str]             | string[]                      |
| list[int]             | number[]                      |

Pydantic models example:

```python
from enum import Enum
from pydantic import BaseModel

class Category(str, Enum):
    ELECTRONICS = "electronics"
    BOOKS = "books"
    CLOTHING = "clothing"

class Product(BaseModel):
    id: int
    name: str
    price: float
    category: Category
    tags: list[str] = []

class CatalogPage(BaseModel):
    products: list[Product]
    total: int
    page: int

@query
async def get_catalog(page: int = 1, category: Category | None = None) -> CatalogPage:
    ...
```

FluidKit generates:

```typescript
// $fluidkit/schema.ts (auto-generated)
export enum Category {
  ELECTRONICS = "electronics",
  BOOKS = "books",
  CLOTHING = "clothing",
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  tags?: string[];
}

export interface CatalogPage {
  products: Product[];
  total: number;
  page: number;
}
```

Unannotated parameters generate `any` in TypeScript — always annotate for type safety.

---

## Generated files

For `src/lib/posts.py` containing decorated functions, FluidKit generates:
- `src/lib/posts.remote.ts` — SvelteKit remote function wrappers (import from `$lib/posts.remote`)
- `$fluidkit/schema.ts` — TypeScript interfaces and enums from Pydantic models

A `$fluidkit` alias is automatically added to svelte.config.js pointing to the schema_output directory.

Generated files update automatically on save in dev mode. Do not edit them manually.

---

## CLI

### fluidkit init [name]
Scaffold a SvelteKit project with FluidKit wired in. Runs sv create, installs dependencies, copies templates, patches svelte.config.js and vite.config.ts.

```bash
fluidkit init              # scaffold in current directory
fluidkit init my-app       # create folder and scaffold inside it
```

### fluidkit dev
Start FastAPI backend and Vite dev server together with HMR.

```bash
fluidkit dev
```

Flags:
  --host TEXT           Override bind address (default: 0.0.0.0)
  --backend-port INT    Override backend port (default: 8000)
  --frontend-port INT   Override frontend port (default: 5173)
  --no-hmr              Disable hot module reloading, restart on change instead

### fluidkit build
Run codegen and then npm run build.

```bash
fluidkit build
```

Flags:
  --backend-port INT    Override backend port (default: 8000)

### fluidkit preview
Preview production build locally. Starts both FastAPI and Vite preview server.

```bash
fluidkit preview
```

Flags:
  --backend-port INT    Override backend port (default: 8000)
  --frontend-port INT   Override frontend port (default: 5173)

### fluidkit install
Shorthand for npm install.

```bash
fluidkit install tailwindcss         # npm install tailwindcss
fluidkit install -D prettier         # npm install --save-dev prettier
```

### fluidkit npm / npx / node
Passthrough to npm, npx, or node. All arguments forwarded directly.

```bash
fluidkit npm run build
fluidkit npm audit
fluidkit npx sv add tailwindcss
fluidkit npx prisma generate
fluidkit node scripts/seed.js
fluidkit node --version
```

No system Node.js required — FluidKit uses nodejs-wheel for all Node operations.

---

## Configuration

fluidkit.config.json in project root (created by fluidkit init):

```json
{
  "entry": "src/app.py",
  "host": "0.0.0.0",
  "backend_port": 8000,
  "frontend_port": 5173,
  "schema_output": "src/lib/fluidkit",
  "watch_pattern": "src/**/*.py",
  "signed": true
}
```

| Option         | Type   | Default              | Description                                        |
|----------------|--------|----------------------|----------------------------------------------------|
| entry          | string | "src/app.py"         | Path to your Python app entry point                |
| host           | string | "0.0.0.0"            | Host address for the backend server                |
| backend_port   | int    | 8000                 | Port for the Python FastAPI backend                |
| frontend_port  | int    | 5173                 | Port for the Vite dev server                       |
| schema_output  | string | "src/lib/fluidkit"   | Directory for generated runtime TypeScript files   |
| watch_pattern  | string | "src/**/*.py"        | Glob pattern for HMR file watching                 |
| signed         | bool   | true                 | Whether SvelteKit→FastAPI requests are HMAC-signed. Disable if you are handling request authentication yourself |

Precedence: CLI flags > fluidkit.config.json > defaults.

The schema_output directory contains FluidKit's generated TypeScript files. A $fluidkit alias is automatically added to svelte.config.js. If you change schema_output, the alias is updated on the next fluidkit dev or fluidkit build.

---

## Error behavior summary

| Decorator   | Error behavior                                           |
|-------------|----------------------------------------------------------|
| @query      | Triggers nearest <svelte:boundary>                       |
| @form       | Renders nearest +error.svelte                            |
| @command    | Caught by caller's try/catch                             |
| @prerender  | Fails build; with dynamic=True at runtime, same as @query |

`@hooks.handle_error` intercepts unexpected errors (TypeError, ValueError, unhandled Exception) before the default response is sent. It does not intercept `error()` (HTTPError) or `redirect()`.

`@hooks.handle_validation_error` intercepts pydantic `ValidationError` when a parameter fails schema validation.

---

## Decorator comparison

| Feature            | @query | @form | @command | @prerender |
|--------------------|--------|-------|----------|------------|
| Read data          | ✓      |       |          | ✓ (build)  |
| Write data         |        | ✓     | ✓        |            |
| Works without JS   |        | ✓     |          |            |
| File uploads       |        | ✓     |          |            |
| Nested types       |        | ✓     | ✓        |            |
| Redirects          |        | ✓     |          |            |
| Batching           | ✓      |       |          |            |
| .refresh()/.set()  |        | ✓     | ✓        |            |
| Set cookies        |        | ✓     | ✓        |            |
| Read cookies       | ✓      | ✓     | ✓        | ✓          |

---

## Complete examples

### Blog CRUD

```python
# src/lib/blog.py
from pydantic import BaseModel
from fluidkit import query, command, form, redirect

class Post(BaseModel):
    id: int
    title: str
    content: str
    likes: int = 0

posts: list[Post] = [
    Post(id=1, title="Hello World", content="First post.", likes=3),
]

@query
async def get_posts() -> list[Post]:
    return posts

@query
async def get_post(post_id: int) -> Post | None:
    return next((p for p in posts if p.id == post_id), None)

@form
async def create_post(title: str, content: str) -> None:
    post = Post(id=len(posts) + 1, title=title, content=content)
    posts.append(post)
    await get_posts().refresh()
    redirect(303, "/blog")

@command
async def like_post(post_id: int) -> bool:
    for post in posts:
        if post.id == post_id:
            post.likes += 1
            await get_posts().refresh()
            return True
    return False

@command
async def delete_post(post_id: int) -> None:
    global posts
    posts = [p for p in posts if p.id != post_id]
    await get_posts().refresh()
```

```svelte
<!-- src/routes/blog/+page.svelte -->
<script>
  import { get_posts, like_post, delete_post, create_post } from '$lib/blog.remote';
</script>

<h1>Blog</h1>

<form {...create_post}>
  <input {...create_post.fields.title.as('text')} placeholder="Title" />
  <textarea {...create_post.fields.content.as('text')} placeholder="Content"></textarea>
  <button>Publish</button>
</form>

{#each await get_posts() as post}
  <article>
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    <button onclick={async () => await like_post(post.id)}>👍 {post.likes}</button>
    <button onclick={async () => await delete_post(post.id)}>🗑️ Delete</button>
  </article>
{/each}
```

### Auth guard with cookies

```python
# src/lib/auth.py
from fluidkit import query, form, command, error, redirect, get_request_event

USERS = {"admin": "secret123"}

@form
async def login(username: str, _password: str) -> None:
    if USERS.get(username) != _password:
        error(401, "Invalid credentials")

    event = get_request_event()
    event.cookies.set("session", username, httponly=True, path="/")
    redirect(303, "/dashboard")

@command
async def logout() -> None:
    event = get_request_event()
    event.cookies.set("session", "", httponly=True, path="/", max_age=0)

@query
async def get_current_user() -> dict | None:
    event = get_request_event()
    username = event.cookies.get("session")
    if not username:
        return None
    return {"username": username}
```

```svelte
<!-- src/routes/login/+page.svelte -->
<script>
  import { login } from '$lib/auth.remote';
</script>

<form {...login}>
  <input {...login.fields.username.as('text')} placeholder="Username" />
  <input {...login.fields._password.as('password')} placeholder="Password" />
  <button>Log in</button>
</form>
```

### Batching queries

```python
# src/lib/weather.py
from fluidkit import query, command
from pydantic import BaseModel

class CityWeather(BaseModel):
    city_id: str
    name: str
    temp: float

weather_db: dict[str, CityWeather] = {
    "nyc": CityWeather(city_id="nyc", name="New York", temp=72.0),
    "la":  CityWeather(city_id="la",  name="Los Angeles", temp=85.0),
    "sf":  CityWeather(city_id="sf",  name="San Francisco", temp=60.0),
}

@query.batch
async def get_weather(city_ids: list[str]):
    lookup = {cid: weather_db.get(cid) for cid in city_ids}
    return lambda city_id, idx: lookup.get(city_id)

@command
async def set_temp(city_id: str, temp: float) -> None:
    if city_id in weather_db:
        weather_db[city_id].temp = temp
        await get_weather(city_id).refresh()
```

```svelte
<script>
  import { get_weather, set_temp } from '$lib/weather.remote';

  const cities = ['nyc', 'la', 'sf'];
</script>

{#each cities as id}
  <div>
    {#await get_weather(id) then weather}
      <h3>{weather.name}</h3>
      <p>{weather.temp}°F</p>
      <button onclick={async () => await set_temp(id, weather.temp + 1)}>+1°</button>
    {/await}
  </div>
{/each}
```

### File upload

```python
# src/lib/uploads.py
from fluidkit import form, FileUpload

UPLOADS: list[dict] = []

@form
async def upload_file(label: str, attachment: FileUpload) -> dict:
    contents = await attachment.read()
    entry = {
        "label": label,
        "filename": attachment.filename,
        "size": len(contents),
        "content_type": attachment.content_type,
    }
    UPLOADS.append(entry)
    return {"success": True, "filename": attachment.filename}
```

```svelte
<script>
  import { upload_file } from '$lib/uploads.remote';
</script>

<form {...upload_file} enctype="multipart/form-data">
  <input {...upload_file.fields.label.as('text')} placeholder="Label" />
  <input {...upload_file.fields.attachment.as('file')} />
  <button>Upload</button>
</form>

{#if upload_file.result?.success}
  <p>Uploaded: {upload_file.result.filename}</p>
{/if}
```

### Lifecycle hooks

```python
# src/app.py
from fluidkit import hooks
import aioredis

db = None
redis_client = None

@hooks.init
async def connect_db():
    global db
    db = await Database.connect("postgresql://...")

@hooks.cleanup
async def disconnect_db():
    await db.disconnect()

@hooks.lifespan
async def manage_redis():
    global redis_client
    redis_client = await aioredis.from_url("redis://localhost")
    yield
    await redis_client.close()
```

### preserve() for HMR-safe state

```python
# src/lib/services.py
import httpx
from fluidkit import preserve

# Factory — only called once, survives HMR
client = preserve(lambda: httpx.AsyncClient(base_url="https://api.example.com"))

# Direct value — created once, reused on reload
cache = preserve({})
```

---

## Built with

- SvelteKit — frontend framework with remote functions
- FastAPI — API layer and request handling
- Pydantic — type extraction and validation
- Jurigged — hot module reloading in dev mode
- nodejs-wheel — bundled Node.js, no system install needed
