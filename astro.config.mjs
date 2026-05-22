import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
	output: 'server',
	adapter: cloudflare({
		mode: 'directory',
        functionPerRoute: false 
	}),
	integrations: [
		sitemap(),
		tailwind(),
	],
});
