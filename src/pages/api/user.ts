import type { APIRoute } from 'astro';

export const get: APIRoute = async ({ request, url, locals }) => {
  try {
    const db = (locals as any)?.runtime?.env?.DB || (request as any)?.env?.DB || (globalThis as any)?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
    }

    const userId = url.searchParams.get('id');
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 });
    }

    const user = await db.prepare('SELECT id, email, role, name, avatar, phone, organization, city, address, points FROM users WHERE id = ?')
      .bind(userId).first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    console.error('API User GET Error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const post: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any)?.runtime?.env?.DB || (request as any)?.env?.DB || (globalThis as any)?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
    }

    const payload = await request.json();
    const { id, name, email, phone, city, address, avatar } = payload as {
      id: number;
      name?: string;
      email?: string;
      phone?: string;
      city?: string;
      address?: string;
      avatar?: string;
    };

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 });
    }

    // Update the database
    const query = `
      UPDATE users 
      SET name = COALESCE(?, name), 
          email = COALESCE(?, email), 
          phone = COALESCE(?, phone), 
          city = COALESCE(?, city), 
          address = COALESCE(?, address),
          avatar = COALESCE(?, avatar)
      WHERE id = ?
    `;
    await db.prepare(query)
      .bind(name || null, email || null, phone || null, city || null, address || null, avatar || null, id).run();

    // Get the updated user info
    const updatedUser = await db.prepare('SELECT id, email, role, name, avatar, phone, organization, city, address, points FROM users WHERE id = ?')
      .bind(id).first();

    return new Response(JSON.stringify({ success: true, user: updatedUser }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    console.error('API User POST Error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
