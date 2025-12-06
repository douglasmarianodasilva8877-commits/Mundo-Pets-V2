// lib/db/schema/comments.ts
import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { pets } from "./pets";

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey(),

  // FK → posts
  postId: varchar("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),

  // FK → pets (autor do comentário)
  petId: varchar("pet_id")
    .notNull()
    .references(() => pets.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
