2026-05-23T03:30:42.870415Z	Cloning repository...
2026-05-23T03:30:43.705527Z	From https://github.com/daniswastaken/hackathon
2026-05-23T03:30:43.70615Z	 * branch            bc18f6016083007095d7f6cf5ae7beff0174b59a -> FETCH_HEAD
2026-05-23T03:30:43.706308Z	
2026-05-23T03:30:43.784083Z	HEAD is now at bc18f60 fix: fix
2026-05-23T03:30:43.784515Z	
2026-05-23T03:30:43.854736Z	
2026-05-23T03:30:43.855418Z	Using v2 root directory strategy
2026-05-23T03:30:43.877122Z	Success: Finished cloning repository files
2026-05-23T03:30:45.402596Z	Checking for configuration in a Wrangler configuration file (BETA)
2026-05-23T03:30:45.403201Z	
2026-05-23T03:30:45.403366Z	Found wrangler.toml file. Reading build configuration...
2026-05-23T03:30:46.513029Z	A Wrangler configuration file was found but it does not appear to be valid. Did you mean to use wrangler.toml to configure Pages? If so, then make sure the file is valid and contains the `pages_build_output_dir` property. Skipping file and continuing.
2026-05-23T03:30:46.669966Z	Detected the following tools from environment: npm@10.9.2, pnpm@10.11.1, nodejs@22.16.0
2026-05-23T03:30:47.461405Z	Installing project dependencies: pnpm install
2026-05-23T03:30:47.964471Z	 WARN  Ignoring not compatible lockfile at /opt/buildhome/repo/pnpm-lock.yaml
2026-05-23T03:30:48.151443Z	Progress: resolved 1, reused 0, downloaded 0, added 0
2026-05-23T03:30:48.408651Z	 WARN  deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
2026-05-23T03:30:49.214045Z	Progress: resolved 25, reused 0, downloaded 23, added 0
2026-05-23T03:30:50.21745Z	Progress: resolved 104, reused 0, downloaded 93, added 0
2026-05-23T03:30:51.217541Z	Progress: resolved 199, reused 0, downloaded 178, added 0
2026-05-23T03:30:52.217874Z	Progress: resolved 317, reused 0, downloaded 254, added 0
2026-05-23T03:30:53.22635Z	Progress: resolved 447, reused 0, downloaded 372, added 0
2026-05-23T03:30:54.230748Z	Progress: resolved 588, reused 0, downloaded 506, added 0
2026-05-23T03:30:55.236454Z	Progress: resolved 742, reused 0, downloaded 634, added 0
2026-05-23T03:30:55.349172Z	 WARN  5 deprecated subdependencies found: @humanwhocodes/config-array@0.13.0, @humanwhocodes/object-schema@2.0.3, glob@7.2.3, inflight@1.0.6, rimraf@3.0.2
2026-05-23T03:30:55.392062Z	Packages: +674
2026-05-23T03:30:55.394269Z	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
2026-05-23T03:30:55.947217Z	Progress: resolved 742, reused 0, downloaded 679, added 674, done
2026-05-23T03:30:57.103693Z	
2026-05-23T03:30:57.104026Z	dependencies:
2026-05-23T03:30:57.104086Z	+ @astrojs/cloudflare 6.8.1 (13.5.4 is available)
2026-05-23T03:30:57.104113Z	+ @astrojs/sitemap 1.4.0 (3.7.2 is available)
2026-05-23T03:30:57.104136Z	+ @astrojs/tailwind 3.1.3 (6.0.2 is available)
2026-05-23T03:30:57.104159Z	+ @faker-js/faker 7.6.0 (10.4.0 is available)
2026-05-23T03:30:57.104189Z	+ apexcharts 3.54.1 (5.13.0 is available)
2026-05-23T03:30:57.104213Z	+ astro 2.10.15 (6.3.7 is available)
2026-05-23T03:30:57.104235Z	+ extend 3.0.2
2026-05-23T03:30:57.104264Z	+ flowbite 2.5.2 (4.0.2 is available)
2026-05-23T03:30:57.104286Z	+ flowbite-typography 1.0.5
2026-05-23T03:30:57.104331Z	+ shiki 0.14.7 (4.1.0 is available)
2026-05-23T03:30:57.10436Z	+ tailwind-scrollbar 3.1.0 (4.0.2 is available)
2026-05-23T03:30:57.104382Z	+ tailwindcss 3.4.19 (4.3.0 is available)
2026-05-23T03:30:57.104406Z	
2026-05-23T03:30:57.104431Z	devDependencies:
2026-05-23T03:30:57.104459Z	+ @types/eslint 8.56.12 (9.6.1 is available)
2026-05-23T03:30:57.104639Z	+ @typescript-eslint/eslint-plugin 5.62.0 (8.59.4 is available)
2026-05-23T03:30:57.104676Z	+ @typescript-eslint/parser 5.62.0 (8.59.4 is available)
2026-05-23T03:30:57.1047Z	+ astro-eslint-parser 0.11.0 (1.4.0 is available)
2026-05-23T03:30:57.104725Z	+ eslint 8.57.1 (10.4.0 is available) deprecated
2026-05-23T03:30:57.104757Z	+ eslint-config-airbnb-base 15.0.0
2026-05-23T03:30:57.104801Z	+ eslint-config-airbnb-typescript 17.1.0 (18.0.0 is available)
2026-05-23T03:30:57.104852Z	+ eslint-config-prettier 8.10.2 (10.1.8 is available)
2026-05-23T03:30:57.104899Z	+ eslint-import-resolver-typescript 3.10.1 (4.4.4 is available)
2026-05-23T03:30:57.104945Z	+ eslint-plugin-astro 0.23.0 (1.7.0 is available)
2026-05-23T03:30:57.104979Z	+ eslint-plugin-import 2.32.0
2026-05-23T03:30:57.105016Z	+ eslint-plugin-prettier 4.2.5 (5.5.5 is available)
2026-05-23T03:30:57.105048Z	+ eslint-plugin-tsdoc 0.2.17 (0.5.2 is available)
2026-05-23T03:30:57.105084Z	
2026-05-23T03:30:57.105138Z	╭ Warning ─────────────────────────────────────────────────────────────────────╮
2026-05-23T03:30:57.105197Z	│                                                                              │
2026-05-23T03:30:57.10524Z	│   Ignored build scripts: esbuild, unrs-resolver.                             │
2026-05-23T03:30:57.105275Z	│   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
2026-05-23T03:30:57.105311Z	│   to run scripts.                                                            │
2026-05-23T03:30:57.105342Z	│                                                                              │
2026-05-23T03:30:57.105375Z	╰──────────────────────────────────────────────────────────────────────────────╯
2026-05-23T03:30:57.105411Z	
2026-05-23T03:30:57.130975Z	Done in 9.4s using pnpm v10.11.1
2026-05-23T03:30:57.227162Z	Executing user command: npm run build
2026-05-23T03:30:57.691222Z	
2026-05-23T03:30:57.691548Z	> flowbite-astro-admin-dashboard@1.0.2 build
2026-05-23T03:30:57.691632Z	> astro build
2026-05-23T03:30:57.691671Z	
2026-05-23T03:30:59.282187Z	03:30:59 AM [content] No content directory found. Skipping type generation.
2026-05-23T03:30:59.284194Z	03:30:59 AM [build] output target: server
2026-05-23T03:30:59.28448Z	03:30:59 AM [build] deploy adapter: @astrojs/cloudflare
2026-05-23T03:30:59.285045Z	03:30:59 AM [build] Collecting build info...
2026-05-23T03:30:59.285695Z	03:30:59 AM [build] Completed in 179ms.
2026-05-23T03:30:59.286624Z	03:30:59 AM [build] Building server entrypoints...
2026-05-23T03:30:59.877644Z	03:30:59 AM [getStaticPaths] The getStaticPaths() statement in /src/pages/api/[...entity].ts has been ignored because `output: "server"` is set.
2026-05-23T03:30:59.878238Z	
2026-05-23T03:30:59.878426Z	Add `export const prerender = true;` to prerender this page.
2026-05-23T03:31:02.563663Z	[31m[vite]: Rollup failed to resolve import "shiki/themes/hc_light.json" from "/opt/buildhome/repo/node_modules/.pnpm/astro@2.10.15_@types+node@17.0.45/node_modules/astro/components/shiki-themes.js".
2026-05-23T03:31:02.564098Z	This is most likely unintended because it can break your application at runtime.
2026-05-23T03:31:02.564228Z	If you do want to externalize this module explicitly add it to
2026-05-23T03:31:02.564287Z	`build.rollupOptions.external`[39m
2026-05-23T03:31:02.992764Z	 error   [vite]: Rollup failed to resolve import "shiki/themes/hc_light.json" from "/opt/buildhome/repo/node_modules/.pnpm/astro@2.10.15_@types+node@17.0.45/node_modules/astro/components/shiki-themes.js".
2026-05-23T03:31:02.993328Z	  This is most likely unintended because it can break your application at runtime.
2026-05-23T03:31:02.993473Z	  If you do want to externalize this module explicitly add it to
2026-05-23T03:31:02.993525Z	  `build.rollupOptions.external`
2026-05-23T03:31:02.993563Z	Error: [vite]: Rollup failed to resolve import "shiki/themes/hc_light.json" from "/opt/buildhome/repo/node_modules/.pnpm/astro@2.10.15_@types+node@17.0.45/node_modules/astro/components/shiki-themes.js".
2026-05-23T03:31:02.993598Z	This is most likely unintended because it can break your application at runtime.
2026-05-23T03:31:02.993635Z	If you do want to externalize this module explicitly add it to
2026-05-23T03:31:02.993683Z	`build.rollupOptions.external`
2026-05-23T03:31:02.993723Z	    at viteWarn (file:///opt/buildhome/repo/node_modules/.pnpm/vite@4.5.14_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-827b23df.js:48272:27)
2026-05-23T03:31:02.993759Z	    at onRollupWarning (file:///opt/buildhome/repo/node_modules/.pnpm/vite@4.5.14_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-827b23df.js:48304:9)
2026-05-23T03:31:02.993791Z	    at onwarn (file:///opt/buildhome/repo/node_modules/.pnpm/vite@4.5.14_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-827b23df.js:48032:13)
2026-05-23T03:31:02.993839Z	    at file:///opt/buildhome/repo/node_modules/.pnpm/rollup@3.30.0/node_modules/rollup/dist/es/shared/node-entry.js:24305:13
2026-05-23T03:31:02.993899Z	    at Object.logger [as onLog] (file:///opt/buildhome/repo/node_modules/.pnpm/rollup@3.30.0/node_modules/rollup/dist/es/shared/node-entry.js:25979:9)
2026-05-23T03:31:02.993933Z	    at ModuleLoader.handleInvalidResolvedId (file:///opt/buildhome/repo/node_modules/.pnpm/rollup@3.30.0/node_modules/rollup/dist/es/shared/node-entry.js:24891:26)
2026-05-23T03:31:02.993965Z	    at ModuleLoader.resolveDynamicImport (file:///opt/buildhome/repo/node_modules/.pnpm/rollup@3.30.0/node_modules/rollup/dist/es/shared/node-entry.js:24949:58)
2026-05-23T03:31:02.993998Z	    at async file:///opt/buildhome/repo/node_modules/.pnpm/rollup@3.30.0/node_modules/rollup/dist/es/shared/node-entry.js:24836:32
2026-05-23T03:31:03.156733Z	Failed: Error while executing user command. Exited with error code: 1
2026-05-23T03:31:03.164106Z	Failed: build command exited with code: 1
2026-05-23T03:31:03.835826Z	Failed: error occurred while running build command
