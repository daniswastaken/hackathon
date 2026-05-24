import type { APIRoute } from 'astro';
import type { Env } from '../../types/env';

export const post: APIRoute = async ({ request, env }) => {
  const db = (env as Env).DB;
  const { action, listingId } = await request.json();

  if (!db) {
    return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
  }

  try {
    if (action === 'complete') {
      await db.prepare('UPDATE claims SET status = "completed" WHERE listing_id = ?').bind(listingId).run();
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else if (action === 'delete') {
      await db.prepare('DELETE FROM food_listings WHERE id = ?').bind(listingId).run();
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else if (action === 'cancel') {
      await db.prepare('DELETE FROM claims WHERE listing_id = ?').bind(listingId).run();
      await db.prepare('UPDATE food_listings SET status = "available" WHERE id = ?').bind(listingId).run();
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
