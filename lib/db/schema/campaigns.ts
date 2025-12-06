// lib/db/schema/campaigns.ts
import { pgTable, text, varchar, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { sponsors } from "./sponsors";

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey(),
  sponsorId: varchar("sponsor_id").notNull().references(() => sponsors.id),

  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),

  budget: doublePrecision("budget").default(0),
  active: boolean("active").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
