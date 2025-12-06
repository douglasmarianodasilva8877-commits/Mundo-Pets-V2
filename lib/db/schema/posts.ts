// lib/db/schema/posts.ts
import { pgTable, varchar, text, integer, timestamp, json } from "drizzle-orm/pg-core";
import { users } from "./users";
import { pets } from "./pets";

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey(),
  authorId: varchar("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  petId: varchar("pet_id").references(() => pets.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  // media: array of objects { type: "image" | "video" | "gif", url: string, blurhash?: string }
  media: json("media").default("[]").notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
