import { highlightMany } from '$lib/server/highlight';

export async function load() {
	return {
		blocks: await highlightMany({
			init: {
				lang: 'bash',
				code: `fluidkit init              # scaffold in current directory
fluidkit init my-app       # create folder and scaffold inside it`
			},
			dev: {
				lang: 'bash',
				code: `fluidkit dev`
			},
			build: {
				lang: 'bash',
				code: `fluidkit build`
			},
			preview: {
				lang: 'bash',
				code: `fluidkit preview`
			},
			install: {
				lang: 'bash',
				code: `fluidkit install tailwindcss         # npm install tailwindcss
fluidkit install -D prettier         # npm install --save-dev prettier`
			},
			npm: {
				lang: 'bash',
				code: `fluidkit npm run build
fluidkit npm install
fluidkit npm audit`
			},
			npx: {
				lang: 'bash',
				code: `fluidkit npx sv add tailwindcss
fluidkit npx prisma generate`
			},
			node: {
				lang: 'bash',
				code: `fluidkit node scripts/seed.js
fluidkit node --version`
			}
		})
	};
}
