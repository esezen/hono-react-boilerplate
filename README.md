# hono-react-boilerplate

A fullstack boilerplate for developing modern web applications with a Hono-based backend powered by Bun and a React-powered frontend. This repository is designed to provide a smooth developer experience with clear organizational structure, rapid startup, and integrated Cloudflare D1 database support.

## Initial Setup

Before you get started, ensure you have the following prerequisites installed:

- [Bun](https://bun.sh)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- A Cloudflare account with access to D1 databases

### Steps:

1. **Install Dependencies**

   Run `bun install` in both the `frontend` and `backend` directories:

   ```bash
   cd frontend && bun install
   cd ../backend && bun install
   ```

2. **Create the D1 Database**

   Use the Wrangler CLI to create your Cloudflare D1 database:

   ```bash
   wrangler d1 create <DATABASE_NAME>
   ```

   After creation, update the `wrangler.jsonc` file in the backend directory with the output details, such as your `CLOUDFLARE_DATABASE_ID`.

3. **Configure Environment Variables**

   In the `backend` directory, copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

   Then, update the following variables in your `.env` file with your Cloudflare credentials and database details:

   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_DATABASE_ID`
   - `CLOUDFLARE_D1_TOKEN`
   - `DB_NAME`

4. **Run the Application**

   To start the backend server:

   ```bash
   bun run dev
   ```

   For development of the frontend (if using Vite or the bundled script), you can run:

   ```bash
   bun run dev
   ```
