import type { APIRoute } from 'astro';

export const get: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any)?.runtime?.env?.DB || (request as any)?.env?.DB || (globalThis as any)?.env?.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
    }

    // 1. Total rescued portions
    const { results: totalRescuedRaw } = await db.prepare(`SELECT SUM(quantity_portions) as total FROM food_listings`).all();
    const totalRescued = totalRescuedRaw[0]?.total || 0;

    // 2. Top Schools (Providers)
    const { results: topSchools } = await db.prepare(`
      SELECT u.id, u.name, u.organization, SUM(f.quantity_portions) as total_rescued
      FROM users u
      LEFT JOIN food_listings f ON u.id = f.provider_id
      WHERE u.role = 'provider'
      GROUP BY u.id
      ORDER BY total_rescued DESC
      LIMIT 5
    `).all();

    // 3. Top Volunteers (Receivers)
    const { results: topVolunteers } = await db.prepare(`
      SELECT id, name, email, points
      FROM users
      WHERE role = 'receiver'
      ORDER BY points DESC
      LIMIT 5
    `).all();

    // 4. Active Schools
    const { results: activeSchoolsRaw } = await db.prepare(`SELECT COUNT(id) as total FROM users WHERE role = 'provider'`).all();
    const activeSchools = activeSchoolsRaw[0]?.total || 0;

    // 5. Total Volunteers
    const { results: totalVolunteersRaw } = await db.prepare(`SELECT COUNT(id) as total FROM users WHERE role = 'receiver'`).all();
    const totalVolunteers = totalVolunteersRaw[0]?.total || 0;

    return new Response(JSON.stringify({
      totalRescued,
      topSchools,
      topVolunteers,
      activeSchools,
      totalVolunteers
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
