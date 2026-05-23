# How to Run Locally

This project uses **Astro** and **Cloudflare Pages** with **Cloudflare D1** for the database.

## Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [pnpm](https://pnpm.io/) or npm
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (`npm install -g wrangler`)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize/Sync Local Database:**
   Apply the database schema to your local D1 instance:
   ```bash
   npx wrangler d1 execute mbgrn --local --file=schema.sql
   ```

## Running the Development Server

Because this project relies on Cloudflare Pages functions and D1 bindings, you must use `wrangler pages dev` instead of the standard `astro dev` to run it fully integrated.

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Start with Wrangler:**
   ```bash
   npx wrangler pages dev dist --d1=DB=mbgrn
   ```

The application will be available at `http://127.0.0.1:8788`.
