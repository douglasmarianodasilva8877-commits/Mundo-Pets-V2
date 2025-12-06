// lib/db/schema/followers.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { pets } from "./pets";

export const followers = pgTable("followers", {
  id: text("id").primaryKey(),
  followerPetId: text("follower_pet_id").notNull().references(() => pets.id),
  followingPetId: text("following_pet_id").notNull().references(() => pets.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
