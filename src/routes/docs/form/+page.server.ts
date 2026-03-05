import { highlightMany } from '$lib/server/highlight';

export async function load() {
	return {
		blocks: await highlightMany({
			basicPy: {
				lang: 'python',
				filename: 'src/lib/posts.py',
				code: `from fluidkit import form

@form
async def add_post(title: str, content: str) -> None:
    await db.insert(title, content)`
			},
			basicSvelte: {
				lang: 'svelte',
				filename: '+page.svelte',
				code: `<script>
  import { add_post } from '$lib/posts.remote';
</script>

<form {...add_post}>
  <input {...add_post.fields.title.as('text')} placeholder="Title" />
  <textarea {...add_post.fields.content.as('text')} placeholder="Content"></textarea>
  <button>Publish</button>
</form>`
			},
			fieldsPy: {
				lang: 'python',
				code: `@form
async def create_profile(name: str, age: int, bio: str) -> None:
    ...`
			},
			fieldsSvelte: {
				lang: 'svelte',
				code: `<form {...create_profile}>
  <input {...create_profile.fields.name.as('text')} />
  <input {...create_profile.fields.age.as('number')} />
  <textarea {...create_profile.fields.bio.as('text')}></textarea>
  <button>Save</button>
</form>`
			},
			fileUploadPy: {
				lang: 'python',
				filename: 'src/lib/uploads.py',
				code: `from fluidkit import form, FileUpload

@form
async def upload_avatar(username: str, photo: FileUpload) -> None:
    contents = await photo.read()
    await storage.save(photo.filename, contents)
    await db.update_avatar(username, photo.filename)`
			},
			fileUploadSvelte: {
				lang: 'svelte',
				code: `<form {...upload_avatar} enctype="multipart/form-data">
  <input {...upload_avatar.fields.username.as('text')} />
  <input {...upload_avatar.fields.photo.as('file')} />
  <button>Upload</button>
</form>`
			},
			redirectPy: {
				lang: 'python',
				code: `from fluidkit import form, Redirect

@form
async def create_post(title: str, content: str) -> None:
    slug = title.lower().replace(" ", "-")
    await db.insert(slug, title, content)
    raise Redirect(303, f"/blog/{slug}")`
			},
			errorsPy: {
				lang: 'python',
				code: `from fluidkit import form, error, get_request_event

@form
async def create_post(title: str, content: str) -> None:
    event = get_request_event()
    session_id = event.cookies.get("session_id")
    if not session_id:
        raise error(401, "Unauthorized")
    await db.insert(title, content)`
			},
			validationSvelte: {
				lang: 'svelte',
				code: `<form {...add_post} oninput={() => add_post.validate()}>
  <label>
    Title
    {#each add_post.fields.title.issues() as issue}
      <p class="error">{issue.message}</p>
    {/each}
    <input {...add_post.fields.title.as('text')} />
  </label>

  <button>Publish</button>
</form>`
			},
			returnsPy: {
				lang: 'python',
				code: `@form
async def add_post(title: str, content: str) -> dict:
    await db.insert(title, content)
    return {"success": True}`
			},
			returnsSvelte: {
				lang: 'svelte',
				code: `<form {...add_post}>
  <!-- fields -->
  <button>Publish</button>
</form>

{#if add_post.result?.success}
  <p>Published!</p>
{/if}`
			},
			singleFlightRefresh: {
				lang: 'python',
				code: `from fluidkit import form, query

@query
async def get_posts() -> list[Post]:
    return await db.get_all_posts()

@form
async def add_post(title: str, content: str) -> None:
    await db.insert(title, content)
    await get_posts().refresh()  # re-runs get_posts, sends result with this response`
			},
			singleFlightSet: {
				lang: 'python',
				code: `@form
async def add_post(title: str, content: str) -> None:
    new_post = await db.insert_and_return(title, content)
    all_posts = await db.get_all_posts()
    await get_posts().set(all_posts)  # set value without re-running the query`
			},
			cookiesPy: {
				lang: 'python',
				code: `from fluidkit import form, get_request_event

@form
async def login(username: str, _password: str) -> None:
    user = await db.authenticate(username, _password)
    event = get_request_event()
    event.cookies.set("session_id", user.session, httponly=True, path="/")`
			},
			enhanceSvelte: {
				lang: 'svelte',
				code: `<form {...add_post.enhance(async ({ form, data, submit }) => {
  try {
    await submit();
    form.reset();
    showToast('Published!');
  } catch (error) {
    showToast('Something went wrong');
  }
})}>
  <!-- fields -->
</form>`
			}
		})
	};
}
