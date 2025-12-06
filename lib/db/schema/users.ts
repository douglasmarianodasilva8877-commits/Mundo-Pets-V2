// lib/db/schema/users.ts
import { pgTable, text, varchar, boolean, json, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash"),
  role: text("role").default("USER").notNull(),
  avatarUrl: text("avatar_url"),
  city: text("city"),
  bio: text("bio"),
  cpf: text("cpf").unique(),
  phone: text("phone"),
  address: text("address"),
  birthDate: timestamp("birth_date"),
  privacy: json("privacy"),
  verified: boolean("verified").default(false),
  addressComplement: text("address_complement"),
  postalCode: text("postal_code"),
  hasEcommerceAccess: boolean("has_ecommerce_access").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
