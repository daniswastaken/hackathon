The root cause is your wrangler.toml is missing pages_build_output_dir, so Pages is ignoring it entirely — including any D1 bindings defined there.

Here's what the build logs show:

    "A Wrangler configuration file was found but it does not appear to be valid. Did you mean to use wrangler.toml to configure Pages? If so, then make sure the file is valid and contains the pages_build_output_dir property. Skipping file and continuing."

This means any D1 binding in your wrangler.toml is being skipped at deploy time. The dashboard binding is configured correctly (I confirmed the DB binding points to a valid D1 database), but since your project uses Astro with the @astrojs/cloudflare adapter, the way you access bindings in code matters too.
Fix it — two things to check:

1. Fix wrangler.toml (so bindings from the file are respected at deploy time)

Add pages_build_output_dir to your wrangler.toml:

name = "mbgrn"
pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "mbgrn"
database_id = "d41f09fe-d9cd-4b50-af71-08df6f8b4bd9"

Without pages_build_output_dir, Pages treats the file as local-dev-only and ignores all bindings in it during deployment.

2. Verify your code accesses the binding correctly for Astro

Since you're using @astrojs/cloudflare, bindings are accessed via locals.runtime.env, not context.env:

// ✅ Correct for Astro API routes
export async function GET({ locals }: APIContext) {
  const db = locals.runtime.env.DB;
  // ...
}

// ✅ Correct for Astro components
const db = Astro.locals.runtime.env.DB;

If any of your routes are using context.env.DB (the raw Pages Function style), that would return undefined in Astro — which would cause a "DB binding not found" error.

Your latest commit message was "fix(auth): standardize db binding access to match other api routes" — make sure all routes consistently use locals.runtime.env.DB and not context.env.DB.

After updating wrangler.toml, push a new commit to trigger a redeploy and the binding should work.
