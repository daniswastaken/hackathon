import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, locals }) => {
  const db = (locals as any)?.runtime?.env?.DB || (request as any)?.env?.DB || (globalThis as any)?.env?.DB;
  
  if (!db) {
    console.error('Reserve API: DB binding not found');
    return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
  }

  try {
    const { listingId, userId } = await request.json();
    console.log('Reserve request:', { listingId, userId });

    if (!listingId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing listingId or userId' }), { status: 400 });
    }

    // Check if already reserved
    const existing = await db.prepare('SELECT id FROM claims WHERE listing_id = ?').bind(listingId).first();
    if (existing) {
      return new Response(JSON.stringify({ error: 'Food already reserved' }), { status: 400 });
    }

    // Create a claim entry
    await db.prepare('INSERT INTO claims (listing_id, receiver_id, status) VALUES (?, ?, "pending")')
      .bind(listingId, userId).run();
    // Update listing status
    await db.prepare('UPDATE food_listings SET status = "reserved" WHERE id = ?').bind(listingId).run();
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    console.error('Reserve API Error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
