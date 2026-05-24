import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

const DEV_PORT = 2121;

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: cloudflare({
		mode: 'directory',
	}),

	experimental: {
		viewTransitions: true,
	},

	/* Like Vercel, Netlify,… Mimicking for dev. server */
	// trailingSlash: 'always',

	server: {
		/* Dev. server only */
		port: DEV_PORT,
	},

	integrations: [
		//
		sitemap(),
		tailwind(),
	],
});
