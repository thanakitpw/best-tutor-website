// Prisma 7 configuration
// Ref: https://pris.ly/d/config-datasource
//
// Database URLs are read from environment variables at runtime via dotenv.
// Required env vars (in .env.local):
//   - DATABASE_URL: pooled Postgres connection (used by the runtime client)
//   - DIRECT_URL:   direct Postgres connection (used for migrations + `prisma db push`)

import { config as loadEnv } from "dotenv";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Load .env.local first (Next.js convention), then fall back to .env
loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Runtime Prisma CLI uses this for migrate / db push.
    // Use DIRECT_URL in preference to DATABASE_URL because Supabase's pooled
    // connection doesn't support some migration ops; fall back to DATABASE_URL
    // when DIRECT_URL isn't provided.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
