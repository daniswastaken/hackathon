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
export const post: APIRoute = async ({ request, url, env }) => {
  // Ensure request is POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const type = url.searchParams.get('type');
  // Validate type param
  if (!type) {
    return new Response(JSON.stringify({ error: 'Missing type query param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }


  let payload;
  try {
    // Try JSON first (e.g., fetch API)
    payload = await request.json();
  } catch (e) {
    // Fallback for traditional form submissions (application/x-www-form-urlencoded)
    const form = await request.formData();
    payload = {
      email: form.get('email')?.toString(),
      password: form.get('password')?.toString(),
      role: form.get('role')?.toString(),
    };
  }
  const { email, password, role } = payload as { email?: string; password?: string; role?: string };

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Missing credentials' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db: D1Database = (env as Env).DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (type === 'signup') {
    const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    try {
      await stmt.bind(email, password, role ?? 'receiver').run();
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message ?? 'Signup failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else if (type === 'login') {
    const stmt = db.prepare('SELECT id, email, role FROM users WHERE email = ? AND password = ?');
    const row = await stmt.bind(email, password).first();
    if (row) {
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

