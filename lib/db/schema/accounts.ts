// lib/db/schema/accounts.ts
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),

  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),

  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
