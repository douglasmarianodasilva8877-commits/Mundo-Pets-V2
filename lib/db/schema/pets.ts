// lib/db/schema/pets.ts
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const pets = pgTable("pets", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  species: text("species"),
  breed: text("breed"),
  age: integer("age"),
  bio: text("bio"),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  ownerEmail: text("owner_email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
