// lib/db/schema/sessions.ts
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  sessionToken: text("session_token").unique().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
