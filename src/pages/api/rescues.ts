import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async () => {
  // Debug: see if env exists and what keys it has
  if (!env) {
      return new Response(JSON.stringify({ error: "env is undefined" }), { status: 500 });
  }

  const db = env.DB;
  if (!db) {
    // Return mock data for local testing
    return new Response(JSON.stringify([
        { school_name: "SDN 01 Menteng (Mock)", food_type: "Nasi Kuning", quantity: 15, pickup_deadline: "14:30", location_name: "Canteen" },
        { school_name: "SMPN 12 Jakarta (Mock)", food_type: "Vegetable Soup", quantity: 25, pickup_deadline: "15:00", location_name: "Front Gate" }
    ]), { status: 200 });
  }

  try {
      if (!db) {
          console.error("DB binding not found in environment");
          throw new Error("DB binding missing");
      }
      const { results } = await db.prepare("SELECT * FROM rescues ORDER BY created_at DESC").all();
      return new Response(JSON.stringify(results), { status: 200 });
  } catch (err) {
      console.error("API Error details:", err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
