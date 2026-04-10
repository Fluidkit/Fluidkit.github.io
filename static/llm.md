# FluidKit

> Web development for the Pythonist

FluidKit bridges Python and SvelteKit into a unified fullstack framework. Decorate Python functions — FluidKit registers them as FastAPI endpoints and generates colocated `.remote.ts` files that SvelteKit imports as native remote functions with full type safety.

- Website: https://fluidkit.github.io
- GitHub: https://github.com/AswanthManoj/Fluidkit
- PyPI: https://pypi.org/project/fluidkit/
- SvelteKit remote functions: https://svelte.dev/docs/kit/remote-functions
- Full LLM reference: https://fluidkit.github.io/llm-full.txt

## Install

pip install fluidkit

No system Node.js required — FluidKit bundles it via nodejs-wheel.

## How it works

1. You decorate a Python function (async or sync) with @query, @command, @form, or @prerender
2. FluidKit registers it as a FastAPI endpoint (parameter types, validation, return types extracted automatically)
3. FluidKit generates a colocated `.remote.ts` file — a SvelteKit remote function wrapper with full TypeScript types
4. You import from `$lib/yourfile.remote` in Svelte and use it as a native SvelteKit remote function

Generated `.remote.ts` files update automatically on save in dev mode via HMR. They are real TypeScript you can inspect.

All four decorators support both async and sync functions. Use async def when you need await — for database calls, HTTP requests, or .refresh() and .set() on async queries. Use plain def for synchronous logic. Sync functions run in a threadpool automatically.

## Decorators

### @query — Read data

Cached on client, refreshable on demand. Errors trigger nearest `<svelte:boundary>` when using await.

```python
from fluidkit import query

@query
async def get_posts() -> list[Post]:
    return await db.get_all_posts()
```

Svelte usage:
```svelte
<script>
  import { get_posts } from '$lib/posts.remote';
</script>
{#each await get_posts() as post}
  <h2>{post.title}</h2>
{/each}
```

Query also exposes `.loading`, `.error`, `.current` properties as an alternative to await.

Refreshing: `get_posts().refresh()` — refetches from server.
Caching: `get_posts() === get_posts()` — cached while on page, no reference needed.

#### @query.batch — Solve N+1

Batches concurrent calls into a single request. Function receives list of all arguments, must return a callable `(arg, index) -> result`.

```python
@query.batch
async def get_post_likes(post_ids: list[int]):
    likes = await db.get_likes_bulk(post_ids)
    lookup = {row.post_id: row.likes for row in likes}
    return lambda post_id, idx: lookup.get(post_id, 0)
```

Svelte side usage is identical to regular @query — each call uses a single argument.

### @form — Write data via forms

Works without JavaScript (progressive enhancement). Supports file uploads, nested Pydantic models, and redirects. Errors render nearest `+error.svelte`.

```python
from fluidkit import form, redirect, FileUpload

@form
async def create_post(title: str, content: str) -> None:
    slug = title.lower().replace(" ", "-")
    await db.insert(slug, title, content)
    redirect(303, f"/blog/{slug}")

@form
async def upload_file(label: str, attachment: FileUpload) -> dict:
    contents = await attachment.read()
    return {"success": True, "filename": attachment.filename}
```

Svelte usage:
```svelte
<form {...create_post}>
  <input {...create_post.fields.title.as('text')} />
  <input {...create_post.fields.content.as('text')} />
  <button>Publish</button>
</form>
```

For file uploads, add `enctype="multipart/form-data"` to the form.
`FileUpload` extends FastAPI's `UploadFile` — `read()`, `filename`, `content_type` are available.

Supported parameter types: `str`, `int`, `float`, `bool`, `FileUpload`, `list[FileUpload]`, `list[str]`, `list[int]`, `Optional[...]`, Pydantic `BaseModel` (nested objects via dot notation).

Nested types example:
```python
from typing import Optional
from pydantic import BaseModel
from fluidkit import form, FileUpload

class Info(BaseModel):
    height: int
    likesDogs: Optional[bool] = None

@form
async def create_profile(name: str, age: int, tags: list[str], info: Info, photo: FileUpload) -> None:
    await db.insert_profile(name, age, tags, info)
```
```svelte
<form {...create_profile} enctype="multipart/form-data">
  <input {...create_profile.fields.name.as('text')} />
  <input {...create_profile.fields.age.as('number')} />
  <input {...create_profile.fields.tags[0].as('text')} />
  <input {...create_profile.fields.tags[1].as('text')} />
  <input {...create_profile.fields.info.height.as('number')} />
  <input {...create_profile.fields.info.likesDogs.as('checkbox')} />
  <input {...create_profile.fields.photo.as('file')} />
  <button>Save</button>
</form>
```

Nested fields use dot notation for objects (`info.height`) and bracket notation for arrays (`tags[0]`). SvelteKit coerces values based on input name prefix: `n:` for numbers, `b:` for booleans. Files work alongside nested types — FluidKit sends structured data as JSON and files as separate multipart fields.

Prefix sensitive params with underscore (e.g. `_password`) to prevent round-tripping on validation failure.

Validation: `add_post.fields.title.issues()` returns validation errors. `add_post.validate()` triggers validation.
Returns: `add_post.result?.success` — ephemeral, vanishes on resubmit/navigation/reload.

Enhance (custom submit behavior):
```svelte
<form {...add_post.enhance(async ({ form, data, submit }) => {
  await submit();
  form.reset();  // not automatic with enhance
})}>
```

Redirect status codes: `303` (See Other, most common), `307` (Temporary), `308` (Permanent).

### @command — Write data imperatively

Called from event handlers, not tied to a form. Requires JavaScript. Errors are caught by your own try/catch.

```python
from fluidkit import command

@command
async def like_post(post_id: int) -> bool:
    return await db.increment_likes(post_id)
```

Svelte usage:
```svelte
<button onclick={async () => {
  try {
    await like_post(post.id);
  } catch (err) {
    showToast('Something went wrong');
  }
}}>
```

Commands cannot be called during render.
Commands do NOT support redirects — use @form for redirect behavior.

Client-driven query updates:
```svelte
await like_post(post.id).updates(get_posts())
```

Optimistic updates:
```svelte
await like_post(post.id).updates(
  get_posts().withOverride((posts) => posts.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p))
)
```

### @prerender — Build-time data

Runs at build time, served as static assets. Cached via browser Cache API. Cache survives reloads, cleared on new deployment.

```python
from fluidkit import prerender

@prerender
async def get_site_config() -> SiteConfig:
    return await db.get_config()

@prerender(inputs=["about", "contact"], dynamic=True)
async def get_page(slug: str) -> Page:
    return await db.get_page(slug)
```

`inputs`: list of arguments to prerender at build time. Also accepts a callable: `inputs=lambda: db.get_all_slugs()`. Async callables are resolved at decoration time.
`dynamic=True`: allows runtime fallback for non-prerendered arguments.

Prerender functions cannot set cookies and do not support `.refresh()` or `.set()`.

## Single-flight mutations

Inside @form and @command handlers, update queries without a second round-trip:

```python
await get_posts().refresh()  # re-executes query, sends new data with response
await get_posts().set(data)  # sets value directly without re-executing
```

`.refresh()` and `.set()` only work inside `@form` and `@command` handlers. Calling them elsewhere produces a warning.

By default, all queries on the page are refreshed after a successful `@form` submission.
For `@command`, you must explicitly specify which queries to update.

## Key APIs

### error(status, message)

Call to return an HTTP error. Behavior depends on context:
- `@query`: triggers nearest `<svelte:boundary>`
- `@form`: renders nearest `+error.svelte`
- `@command`: caught by caller's try/catch

```python
from fluidkit import error

error(404, "Not found")
```

### redirect(status, url)

Only works in `@form`. Call to navigate after submission.

```python
from fluidkit import redirect

redirect(303, "/dashboard")
```

Redirect status codes: `303` (See Other), `307` (Temporary), `308` (Permanent).

### get_request_event()

Access cookies and request data. Available in all decorators. Can also be injected directly as a typed parameter:

```python
from fluidkit import get_request_event, RequestEvent

# Option 1 — call inside body
@query
async def get_profile():
    event = get_request_event()
    return await db.get_user(event.cookies.get("session_id"))

# Option 2 — declare as parameter (injected automatically)
@query
async def get_profile(request: RequestEvent):
    return await db.get_user(request.cookies.get("session_id"))
```

`event.cookies.set(name, value, **kwargs)` — only available in `@form` and `@command`. Calling it in `@query` or `@prerender` raises `RuntimeError`.

Cookie options: `httponly`, `path`, `max_age`, `secure`, `samesite`, `domain` — passed through to SvelteKit's cookie API.

`event.locals` — shared dict between hooks and the remote function handler. Serializable values are forwarded to SvelteKit. Values set in `@hooks.handle` are visible inside the handler and vice versa.

### FileUpload

File parameter type for `@form`. Extends FastAPI's `UploadFile`.

```python
from fluidkit import FileUpload

@form
async def upload(photo: FileUpload):
    contents = await photo.read()
    name = photo.filename
    mime = photo.content_type
```

### preserve(value_or_factory)

Keep expensive objects alive across HMR reloads in dev mode.

```python
from fluidkit import preserve

client = preserve(lambda: httpx.AsyncClient(base_url="https://api.example.com"))
cache = preserve({})
```

Accepts a value or zero-argument callable. Callable is invoked only on first execution. Only use for objects that must survive re-execution (DB connections, HTTP clients, loaded models).

## Hooks

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

`@hooks.init` and `@hooks.cleanup`: async or sync, no parameters, one per application.
`@hooks.lifespan`: async or sync generator, yields once, one per application. Code before yield runs at startup, code after at shutdown.

### Request middleware — @hooks.handle

Runs on every remote function call. Multiple allowed, execute in source order.

```python
from fluidkit import hooks, error

@hooks.handle
async def auth(event, resolve):
    token = event.cookies.get("access_token")
    if not token:
        error(401, "Unauthorized")
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

Must accept `(event, resolve)` and return `await resolve(event)` or an early return.

Use `hooks.sequence()` for explicit ordering. Calling it from the same module replaces the previous order. Calling it from a different module raises `RuntimeError`.

```python
hooks.sequence(auth, logging)
```

`event` fields:

| Field | Type | Description |
|---|---|---|
| `event.url` | `str` | Full request URL |
| `event.method` | `str` | HTTP method |
| `event.headers` | `dict[str, str]` | Incoming request headers |
| `event.cookies` | `Cookies` | Shared with remote function handler |
| `event.locals` | `dict` | Shared with remote function handler, forwarded to SvelteKit |
| `event.is_remote` | `bool` | `True` for remote function calls, `False` for page-level requests |

### Error hooks

`@hooks.handle_error`: catches unexpected errors — not `error()` (HTTPError) or `redirect()` which are intentional control flow. Must accept `(error, event, status, message)`. Must return `{"message": str, ...}`.

```python
@hooks.handle_error
async def on_error(error, event, status, message):
    logger.exception(error)
    return {"message": "Something went wrong"}
```

`@hooks.handle_validation_error`: catches pydantic validation failures. Must accept `(issues, event)` where `issues` is pydantic's `e.errors()` list. Must return `{"message": str, ...}`.

```python
@hooks.handle_validation_error
async def on_validation_error(issues, event):
    return {"message": "Invalid input"}
```

One of each per application. If the hook itself raises, the default response is used silently.

### Generated src/hooks.server.ts

When any hooks are registered, FluidKit automatically generates `src/hooks.server.ts`. Do not edit it — FluidKit overwrites it on every `dev` and `build`. If you need custom SvelteKit handle logic alongside it, use SvelteKit's `sequence()` helper in a separate file. If no hooks are registered and this file was previously generated, it is removed automatically.

### Deprecated lifecycle API

`@on_startup`, `@on_shutdown`, and `@lifespan` imported directly from `fluidkit` still work but emit `DeprecationWarning`.

| Deprecated | Replacement |
|---|---|
| `@on_startup` | `@hooks.init` |
| `@on_shutdown` | `@hooks.cleanup` |
| `@lifespan` | `@hooks.lifespan` |

## Type mapping

| Python | TypeScript |
|---|---|
| `str` | `string` |
| `int`, `float` | `number` |
| `bool` | `boolean` |
| `list[X]` | `X[]` |
| `dict` | `Record<string, unknown>` |
| `Optional[X]`, `X \| None` | `X \| null` |
| Pydantic `BaseModel` | `interface` |
| `Enum(str, Enum)` | `enum` |

Unannotated parameters generate `any` — always annotate for type safety.

## Generated files

For `src/lib/posts.py` containing decorated functions, FluidKit generates:

- `src/lib/posts.remote.ts` — SvelteKit remote function wrappers (import from `$lib/posts.remote`)
- `$fluidkit/schema.ts` — TypeScript interfaces and enums from Pydantic models
- `$fluidkit/config.ts` — `BASE_URL` and the shared undici HTTP agent used by all generated remote files

Generated files update automatically on save in dev mode. Do not edit them manually.

## CLI

```
fluidkit init [name]          # scaffold SvelteKit project with FluidKit
fluidkit dev                  # FastAPI + Vite together with HMR
fluidkit build                # codegen + npm run build
fluidkit preview              # preview production build locally
fluidkit install <pkg>        # shorthand for npm install (-D for dev)
fluidkit npm <args>           # passthrough to npm
fluidkit npx <args>           # passthrough to npx
fluidkit node <args>          # passthrough to node
```

Dev flags: `--host`, `--backend-port`, `--frontend-port`, `--no-hmr`

## Configuration

`fluidkit.config.json` in project root:

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

Precedence: CLI flags > `fluidkit.config.json` > defaults.

`signed` controls whether SvelteKit→FastAPI requests are HMAC-signed. Disable only if you are handling request authentication entirely yourself.

## Error behavior summary

| Decorator | Error behavior |
|---|---|
| `@query` | Triggers nearest `<svelte:boundary>` |
| `@form` | Renders nearest `+error.svelte` |
| `@command` | Caught by caller's try/catch |
| `@prerender` | Fails build; with `dynamic=True` at runtime, same as `@query` |

## Built with

- SvelteKit — frontend framework with remote functions
- FastAPI — API layer and request handling
- Pydantic — type extraction and validation
- Jurigged — hot module reloading in dev mode
- nodejs-wheel — bundled Node.js, no system install needed
