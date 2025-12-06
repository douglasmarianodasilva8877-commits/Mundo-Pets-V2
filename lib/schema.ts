import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { pets } from "./pets";
import { tutors } from "./tutors";

// ------------------------------
// POSTS — versão revisada e compatível
// ------------------------------

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),

  petId: text("pet_id")
    .notNull()
    .references(() => pets.id),

  tutorId: text("tutor_id")
    .notNull()
    .references(() => tutors.id),

  content: text("content"),

  // Lista de URLs absolutas ou relativas
  mediaUrls: text("media_urls").array().default([]),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
