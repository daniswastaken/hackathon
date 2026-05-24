import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, locals }) => {
  const db = (locals as any)?.runtime?.env?.DB || (request as any)?.env?.DB || (globalThis as any)?.env?.DB;

  if (!db) {
    return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
  }

  try {
    const { action, listingId } = await request.json();
    console.log('Rescue request:', { action, listingId });
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
