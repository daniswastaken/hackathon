# Cloudflare D1 SaaS Migration Plan

## Overview
The current project is an **Astro static site** that generates HTML at build time. To turn it into a live SaaS we need to add **dynamic server‑side capabilities** powered by **Cloudflare Workers** and persist data in **Cloudflare D1 (SQLite‑compatible)**.

---

## 1. High‑Level Architecture
1. **Frontend (Astro)** – Remains the UI layer, now rendered **client‑side** for dynamic pages (e.g., dashboards, forms).
2. **Edge Backend (Cloudflare Workers)** – Server‑less functions exposing a **REST/GraphQL API** and handling authentication, business logic, and interaction with D1.
3. **Database (Cloudflare D1)** – Stores user accounts, SaaS data (e.g., settings, records). Uses standard SQLite syntax.
4. **Identity (Cloudflare Access / Workers‑auth)** – Optional OAuth/OpenID Connect for user login.
5. **CI/CD (GitHub Actions → Cloudflare Pages/Workers)** – Automated build, test, and deployment pipeline.

---

## 2. Project Structure Changes
```
/ (repo root)
├─ src/                     # Astro components/pages (unchanged)
│   ├─ pages/              # UI routes – will fetch data via API
│   └─ app/SideBar.astro    # UI component (already updated)
├─ functions/               # Cloudflare Workers source
│   ├─ api/                 # API route handlers (e.g., users.ts, items.ts)
│   └─ utils/               # DB helper, auth, validation
├─ public/                  # static assets (unchanged)
├─ wrangler.toml            # Workers configuration (incl. D1 binding)
├─ astro.config.mjs          # Add `adapter: '@astrojs/cloudflare'`
├─ package.json
└─ PLAN.md                  # Migration plan (this file)
```

---

## 3. Set Up Cloudflare Workers & D1
1. **Install Wrangler**
   ```bash
   npm install -D wrangler
   ```
2. **Initialize Workers project** in the repo root:
   ```bash
   npx wrangler init --site
   ```
   This creates a `wrangler.toml`.
3. **Add D1 binding** to `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "hackathon"
   database_id = "<YOUR_D1_ID>"
   ```
4. **Create the D1 database** via Cloudflare dashboard or CLI:
   ```bash
   npx wrangler d1 create hackathon
   npx wrangler d1 execute hackathon --file ./schema.sql
   ```
   `schema.sql` defines tables (users, sessions, SaaS entities).

---

## 4. API Layer (Workers)
- Use **TypeScript** for strong typing.
- Export functions from `functions/api/*.ts` that match the route pattern `/api/*`.
- Example handler (`functions/api/users.ts`):
  ```ts
  import { DB } from "wrangler";
  import { json } from "@cloudflare/expressions"; // or tinyhttp

  export async function onRequest(context) {
    const { request } = context;
    if (request.method === "POST") {
      const body = await request.json();
      // validate + insert
      const stmt = DB.prepare(`INSERT INTO users (email, password) VALUES (?, ?)`);
      await stmt.run(body.email, body.password);
      return new Response(JSON.stringify({ success: true }), { status: 201 });
    }
    // GET, PUT, DELETE…
  }
  ```
- **Routing**: Cloudflare Pages can automatically route `/api/*` to Workers if `routes = [{ pattern = "*/api/*" }]` in `wrangler.toml`.
- **Authentication**: Use **CF Access JWT** or a lightweight session cookie stored in D1. Middleware verifies token on each request.

---

## 5. Integrate Frontend with API
1. Replace static data fetches (e.g., hard‑coded JSON) with **fetch calls** to `/api/...`.
2. Use **Astro `client:load`** or **React/Vue components** for interactive parts that need data after page load.
3. Store auth token in **httpOnly cookie**; on the client, call `fetch('/api/me', { credentials: 'include' })` to get current user.
4. UI updates (e.g., sidebar highlight) remain unchanged.

---

## 6. CI / Deployment Pipeline
```yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build   # Astro static build
      - name: Publish Workers
        env:
          CF_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
        run: npx wrangler publish --dry-run=false
```
- The workflow builds the Astro site, uploads static assets to **Cloudflare Pages**, and publishes the Workers (including D1 migrations).

---

## 7. Data Migration & Seeding
- Provide a **seed script** (`scripts/seed.ts`) that runs locally or via CI to populate initial tables.
- Example:
  ```ts
  import { DB } from "wrangler";
  await DB.exec(`INSERT INTO users (email, password) VALUES ('admin@example.com', 'hashed')`);
  ```

---

## 8. Security & Performance Considerations
- **Rate‑limit** API endpoints with Cloudflare Workers KV counters.
- **Sanitize** all inputs; use prepared statements (parameterized queries) to prevent SQL injection.
- Enable **CORS** only for allowed origins.
- Use **Cache‑API** for read‑heavy endpoints (e.g., public listings) to reduce D1 reads.
- Enable **Cloudflare Turnstile** or reCAPTCHA for bot protection on sign‑up forms.

---

## 9. Monitoring & Observability
- Leverage **Cloudflare Analytics** for worker request counts, latency, and error rates.
- Add **log statements** (`console.log`) that feed into Workers logs, viewable via `wrangler tail`.
- Optionally integrate **Sentry** for front‑end error tracking.

---

## 10. Roadmap / Milestones
| Milestone | Description | Owner | Target Date |
|----------|-------------|-------|-------------|
| 1️⃣ Setup Workers & D1 | Initialise wrangler, create DB, basic CRUD API | Dev A | 1 week |
| 2️⃣ Auth Layer | Implement JWT/CF Access login flow | Dev B | 2 weeks |
| 3️⃣ Frontend Refactor | Replace static data with API calls, add client‑side fetches | Dev C | 3 weeks |
| 4️⃣ CI/CD Pipeline | GitHub Actions for build & deploy | Dev Ops | 4 weeks |
| 5️⃣ Beta Launch | Deploy to a staging sub‑domain, collect feedback | Team | 5 weeks |
| 6️⃣ Production Go‑Live | Promote to primary domain, monitor | Team | 6 weeks |

---

## 11. Risks & Mitigations
- **Cold start latency** – Mitigate by keeping Workers warm (ping endpoint) and using Cloudflare's **Durable Objects** for session cache if needed.
- **D1 quota limits** – Monitor usage; consider partitioning large tables or using **Workers KV** for non‑relational data.
- **Complexity of migration** – Keep a feature‑flag system to toggle between static and dynamic data during rollout.

---

## 12. Next Steps for the Team
1. **Approve schema.sql** and create the D1 instance in Cloudflare.
2. Add `@astrojs/cloudflare` adapter to `astro.config.mjs` and test local dev (`npm run dev` with `wrangler dev`).
3. Scaffold the first API endpoint (`/api/health`) to verify Workers‑D1 connectivity.
4. Incrementally migrate existing pages (e.g., dashboard) to fetch data from the new API.
5. Set up the CI workflow and push the first commit.

---

*This plan provides a concrete path from a static generator to a fully‑featured SaaS running on Cloudflare's edge platform with D1 persistence.*