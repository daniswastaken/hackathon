import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const db = locals.runtime.env.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "Database not bound" }), { status: 500 });
  }

  const data = await request.json();
  const { school_name, food_type, category, quantity, pickup_deadline, location_name, address, lat, lng, description } = data;

  const { success } = await db.prepare(
    "INSERT INTO rescues (school_name, food_type, category, quantity, pickup_deadline, location_name, address, lat, lng, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(school_name, food_type, category, quantity, pickup_deadline, location_name, address, lat, lng, description).run();

  return new Response(JSON.stringify({ success }), { status: success ? 201 : 500 });
};
