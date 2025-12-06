import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema/**/*.ts",
  out: "./drizzle/migrations",

  dialect: "postgresql",

  dbCredentials: {
    url: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "",
  },

  verbose: true,
  strict: true,
} satisfies Config;
