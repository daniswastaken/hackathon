import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async () => {
  const db = env.DB;
  if (!db) {
    return new Response(JSON.stringify({ 
        rescued: 12450, 
        schools: 42, 
        volunteers: 1240 
    }), { status: 200 });
  }

  try {
      const stats = await db.prepare(`
        SELECT 
            (SELECT COUNT(*) FROM rescues) as total_rescues,
            (SELECT SUM(quantity) FROM rescues) as total_portions,
            (SELECT COUNT(DISTINCT school_name) FROM rescues) as active_schools
      `).first();
      return new Response(JSON.stringify(stats), { status: 200 });
  } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
