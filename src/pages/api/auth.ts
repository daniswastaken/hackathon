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

  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const type = url.searchParams.get('type');
    
    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      const form = await request.formData();
      payload = { email: form.get('email'), name: form.get('name'), password: form.get('password'), role: form.get('role') };
    }
    const { email, name, password, role } = payload as { email?: string; name?: string; password?: string; role?: string };

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400 });
    }

    const db = (locals as any)?.runtime?.env?.DB || (request as any)?.env?.DB || (globalThis as any)?.env?.DB;

    if (!db) {
      return new Response(JSON.stringify({ error: 'DB binding not found' }), { status: 500 });
    }


    if (type === 'signup') {
      await db.prepare('INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)')
        .bind(email, name || `User_${Math.floor(Math.random() * 10000)}`, password, role ?? 'receiver').run();
      return new Response(JSON.stringify({ success: true }), { status: 201 });
    } else if (type === 'login') {
      let row = await db.prepare('SELECT id, email, role, name, avatar, phone, organization, city, address, points FROM users WHERE email = ? AND password = ?')
        .bind(email, password).first();
      if (row) {
        if (!row.name) {
          const generatedName = `User_${row.id}`;
          await db.prepare('UPDATE users SET name = ? WHERE id = ?').bind(generatedName, row.id).run();
          row.name = generatedName;
        }
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

