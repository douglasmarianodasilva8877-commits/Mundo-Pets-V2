// lib/db/schema/postLikes.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

export const postLikes = pgTable("post_likes", {
  id: text("id").primaryKey(), // e.g. uuid
  postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
