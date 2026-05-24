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
      // 1. Get the listing and claim info before updating
      const data = await db.prepare(`
        SELECT f.quantity_portions, c.receiver_id 
        FROM food_listings f 
        LEFT JOIN claims c ON f.id = c.listing_id 
        WHERE f.id = ?
      `).bind(listingId).first();

      // 2. Mark listing as picked up
      await db.prepare('UPDATE food_listings SET status = "picked_up" WHERE id = ?').bind(listingId).run();

      // 3. Mark any existing claim as completed
      await db.prepare('UPDATE claims SET status = "completed" WHERE listing_id = ?').bind(listingId).run();

      // 4. Update receiver points if a claim exists
      if (data && data.receiver_id) {
        await db.prepare('UPDATE users SET points = points + ? WHERE id = ?').bind(data.quantity_portions, data.receiver_id).run();
      } else {
        // 5. If no claim exists (provider marking it done without receiver), create a ghost claim so it shows in dashboard
        // Find the provider's own ID to attribute the rescue if no one claimed it
        const listing = await db.prepare('SELECT provider_id FROM food_listings WHERE id = ?').bind(listingId).first();
        if (listing) {
          await db.prepare('INSERT INTO claims (listing_id, receiver_id, status) VALUES (?, ?, "completed")')
            .bind(listingId, listing.provider_id).run();
        }
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
 else if (action === 'delete') {
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
