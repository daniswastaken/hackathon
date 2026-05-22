import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const DEV_PORT = 2121;

export default defineConfig({
	output: 'server',
	adapter: cloudflare(),
	server: {
		port: DEV_PORT,
	},
	integrations: [
		sitemap(),
		tailwind(),
	],
});
