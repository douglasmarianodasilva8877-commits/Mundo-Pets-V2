// lib/db/queries/users.ts
import { db } from "../client";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import type { ID } from "@/lib/types";

/**
 * Criar usuário (register)
 */
export async function createUser({
  id,
  name,
  email,
  passwordHash,
  avatarUrl,
  role = "USER",
}: {
  id: ID;
  name?: string | null;
  email: string;
  passwordHash: string;
  avatarUrl?: string | null;
  role?: "USER" | "ADMIN";
}) {
  const res = await db
    .insert(users)
    .values({
      id,
      name: name ?? null,
      email,
      password: passwordHash,
      avatarUrl: avatarUrl ?? null,
      role,
    })
    .returning();

  return res[0];
}

/**
 * Busca usuário pelo email
 */
export async function getUserByEmail(email: string) {
  const res = await db.select().from(users).where(eq(users.email, email));
  return res[0] ?? null;
}

/**
 * Busca usuário pelo id
 */
export async function getUserById(id: ID) {
  const res = await db.select().from(users).where(eq(users.id, id));
  return res[0] ?? null;
}
