/// <reference types="@cloudflare/workers-types" />

import type { APIRoute } from 'astro';
import type { Env } from '../../types/env';
import type { D1Database, D1PreparedStatement } from '@cloudflare/workers-types';

/**
 * Simple authentication API using Cloudflare D1.
 * Supports two actions via query param `type`:
 *   - signup: registers a new user (email, password, role)
 *   - login: authenticates an existing user (email, password)
 *
 * NOTE: This implementation stores passwords in plain text for demo purposes.
 * In production you should hash passwords with a proper algorithm like bcrypt.
 */
export const post: APIRoute = async (context) => {
  const { request, url, env, locals } = context;
  console.log('--- CONTEXT KEYS ---', Object.keys(context));
  
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const type = url.searchParams.get('type');
    if (!type) {
      return new Response(JSON.stringify({ error: 'Missing type query param' }), { status: 400 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      const form = await request.formData();
      payload = { email: form.get('email'), password: form.get('password'), role: form.get('role') };
    }
    const { email, password, role } = payload as { email?: string; password?: string; role?: string };

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400 });
    }
// Log the entire env object to find where D1 binding is hidden
const db = (env as any).DB || (env as any).env?.DB || (locals as any)?.runtime?.env?.DB;

if (!db) {
  console.log('--- ENV DEBUG ---');
  console.log('Keys in env:', Object.keys(env || {}));
  console.log('Keys in locals:', Object.keys((locals as any) || {}));
  return new Response(JSON.stringify({ error: 'DB configuration missing. Available keys: ' + Object.keys(env || {}).join(', ') }), { status: 500 });
}



    if (type === 'signup') {
      await db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)')
        .bind(email, password, role ?? 'receiver').run();
      return new Response(JSON.stringify({ success: true }), { status: 201 });
    } else if (type === 'login') {
      const row = await db.prepare('SELECT id, email, role FROM users WHERE email = ? AND password = ?')
        .bind(email, password).first();
      if (row) {
        return new Response(JSON.stringify({ success: true, user: row }), { status: 200 });
      }
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    return new Response(JSON.stringify({ error: 'Invalid type' }), { status: 400 });
  } catch (e: any) {
    console.error('API Error:', e);
    return new Response(JSON.stringify({ error: 'Internal Error: ' + e.message }), { status: 500 });
  }
};

