// lib/db/client.ts
import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index";

// Normaliza a URL
const rawUrl =
  process.env.NEON_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "";

const url = rawUrl.trim();

if (!url) {
  throw new Error(
    "❌ DATABASE_URL / NEON_DATABASE_URL não foi encontrada. Verifique seu .env.local"
  );
}

if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
  throw new Error(`❌ URL inválida para Neon/Postgres. URL: ${url}`);
}

const sql = neon(url);

export const db = drizzle(sql, { schema });
