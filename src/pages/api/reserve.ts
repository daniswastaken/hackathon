import type { APIRoute } from 'astro';
import type { Env } from '../../types/env';

export const post: APIRoute = async ({ request, env }) => {
  const db = (env as Env).DB;
  const { listingId, userId } = await request.json();

  if (!db) {
    return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
  }

  try {
    // Create a claim entry
    await db.prepare('INSERT INTO claims (listing_id, receiver_id, status) VALUES (?, ?, "pending")')
      .bind(listingId, userId).run();
    // Update listing status
    await db.prepare('UPDATE food_listings SET status = "reserved" WHERE id = ?').bind(listingId).run();
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
