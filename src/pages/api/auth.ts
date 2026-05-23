/// <reference types="@cloudflare/workers-types" />

import type { APIRoute } from 'astro';
import type { Env } from '../../types/env';

/**
 * Simple authentication API using Cloudflare D1.
 * Supports two actions via query param `type`:
 *   - signup: registers a new user (email, password, role)
 *   - login: authenticates an existing user (email, password)
 *
 * NOTE: This implementation stores passwords in plain text for demo purposes.
 * In production you should hash passwords with a proper algorithm like bcrypt.
 */
export const post: APIRoute = async ({ request, url, env }) => {
  const type = url.searchParams.get('type');
  const { email, password, role } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Missing credentials' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // `env` is typed as `Env` where D1 binding is defined as `DB`
  const db = (env as unknown as Env).DB;

  if (type === 'signup') {
    // Insert new user. Role is either 'receiver' or 'provider'
    const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    try {
      await stmt.bind(email, password, role ?? 'receiver').run();
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } else if (type === 'login') {
    const stmt = db.prepare('SELECT id, email, role FROM users WHERE email = ? AND password = ?');
    const row = await stmt.bind(email, password).first();
    if (row) {
      // In a real app you would issue a JWT or set an HttpOnly cookie.
      return new Response(JSON.stringify({ success: true, user: row }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Invalid type' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
};
