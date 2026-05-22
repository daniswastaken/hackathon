import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const { email, role } = await request.json();
  const db = locals.runtime.env.DB;

  const { success } = await db.prepare(
    "INSERT INTO users (email, role) VALUES (?, ?)"
  ).bind(email, role).run();

  return new Response(JSON.stringify({ success }), { status: success ? 201 : 500 });
};
