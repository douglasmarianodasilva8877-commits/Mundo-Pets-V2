// lib/db/schema/sponsors.ts
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const sponsors = pgTable("sponsors", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
