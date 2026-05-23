import type { APIRoute } from 'astro';
import type { Env } from '../../types/env';

export const get: APIRoute = async ({ request, locals }) => {
  try {
    // Try to get DB from locals.runtime (newer Astro/Cloudflare) or fallback
    const db = (locals as any)?.runtime?.env?.DB || (request as any)?.env?.DB || (globalThis as any)?.env?.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
    }

    const stmt = db.prepare(`
      SELECT f.*, u.name as school, u.organization
      FROM food_listings f
      JOIN users u ON f.provider_id = u.id
      ORDER BY f.created_at DESC
    `);
    
    const { results } = await stmt.all();
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const post: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any)?.runtime?.env?.DB || (request as any)?.env?.DB || (globalThis as any)?.env?.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
    }

    const data = await request.json();
    const { provider_id, title, description, category, quantity_portions, pickup_time, location, address, latitude, longitude } = data;

    const stmt = db.prepare(`
      INSERT INTO food_listings (provider_id, title, description, category, quantity_portions, pickup_time, location, address, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.bind(
      provider_id, title, description || '', category, quantity_portions, pickup_time, location || '', address || '', latitude || null, longitude || null
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
