import { highlightMany } from '$lib/server/highlight';

export async function load() {
	return {
		blocks: await highlightMany({
			init: {
				lang: 'python',
				code: `from fluidkit import hooks

@hooks.init
async def setup():
    global db
    db = await Database.connect("postgresql://...")`
			},
			cleanup: {
				lang: 'python',
				code: `@hooks.cleanup
async def teardown():
    await db.close()`
			},
			lifespan: {
				lang: 'python',
				code: `@hooks.lifespan
async def manage_redis():
    global redis
    redis = await aioredis.from_url("redis://localhost")
    yield
    await redis.close()`
			},
			handle: {
				lang: 'python',
				code: `from fluidkit import hooks, error

@hooks.handle
async def auth(event, resolve):
    token = event.cookies.get("access_token")
    if not token:
        error(401, "Unauthorized")
    event.locals["user"] = await verify_token(token)
    return await resolve(event)`
			},
			handleLogging: {
				lang: 'python',
				code: `@hooks.handle
async def logging(event, resolve):
    import time
    start = time.time()
    result = await resolve(event)
    print(f"{event.method} {event.url} took {time.time() - start:.2f}s")
    return result`
			},
			sequence: {
				lang: 'python',
				code: `hooks.sequence(auth, logging)`
			},
			locals: {
				lang: 'python',
				code: `from fluidkit import hooks, query, get_request_event

@hooks.handle
async def auth(event, resolve):
    token = event.cookies.get("access_token")
    event.locals["user"] = await verify_token(token)
    return await resolve(event)

@query
async def get_profile() -> dict:
    event = get_request_event()
    user = event.locals.get("user")  # set by auth hook above
    if not user:
        error(401, "Unauthorized")
    return await db.get_profile(user["id"])`
			},
			handleError: {
				lang: 'python',
				code: `@hooks.handle_error
async def on_error(error, event, status, message):
    error_id = str(uuid4())
    logger.exception(error, extra={"error_id": error_id})
    return {"message": "Something went wrong", "error_id": error_id}`
			},
			handleValidationError: {
				lang: 'python',
				code: `@hooks.handle_validation_error
async def on_validation_error(issues, event):
    first = issues[0] if issues else {}
    field = first.get("loc", ("input",))[-1]
    return {"message": f"Invalid value for field: {field}"}`
			},
			deprecated: {
				lang: 'python',
				code: `# Before
from fluidkit import on_startup, on_shutdown

@on_startup
async def setup():
    global db
    db = await Database.connect("postgresql://...")

@on_shutdown
async def teardown():
    await db.close()

# After
from fluidkit import hooks

@hooks.init
async def setup():
    global db
    db = await Database.connect("postgresql://...")

@hooks.cleanup
async def teardown():
    await db.close()`
			}
		})
	};
}
