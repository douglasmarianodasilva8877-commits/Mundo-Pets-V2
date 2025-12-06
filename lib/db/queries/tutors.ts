// lib/db/queries/tutors.ts
import { db } from "../client";
import { tutors } from "../schema";
import type { ID } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function createTutor({
  id,
  name,
  email,
  avatarUrl,
  passwordHash,
}: {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  passwordHash?: string | null;
}) {
  const res = await db
    .insert(tutors)
    .values({
      id,
      name,
      email,
      avatar_url: avatarUrl ?? null,
      password_hash: passwordHash ?? null,
    })
    .returning();

  return res[0];
}

export async function getTutorByEmail(email: string) {
  const res = await db.select().from(tutors).where(eq(tutors.email, email));
  return res[0] ?? null;
}

export async function getTutorById(id: ID) {
  const res = await db.select().from(tutors).where(eq(tutors.id, id));
  return res[0] ?? null;
}

/**
 * Buscar tutor pelo user.id (NextAuth)
 */
export async function getTutorByUser(userId: ID) {
  const res = await db.select().from(tutors).where(eq(tutors.id, userId));
  return res[0] ?? null;
}
