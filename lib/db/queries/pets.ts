// lib/db/queries/pets.ts
import { db } from "../client";
import { pets } from "../schema";
import type { ID } from "@/lib/types";
import { eq } from "drizzle-orm";

/**
 * Criar pet
 */
export async function createPet({
  id,
  name,
  species,
  slug,
  breed,
  age,
  avatarUrl,
  bio,
  description,
  ownerId,
  ownerEmail,
}: {
  id: ID;
  name: string;
  species?: string | null;
  slug: string;
  breed?: string | null;
  age?: number | null;
  avatarUrl?: string | null;
  bio?: string | null;
  description?: string | null;
  ownerId?: ID | null;
  ownerEmail: string;
}) {
  const res = await db
    .insert(pets)
    .values({
      id,
      name,
      species: species ?? null,
      slug,
      breed: breed ?? null,
      age: age ?? null,
      avatarUrl: avatarUrl ?? null,
      bio: bio ?? null,
      description: description ?? null,
      ownerId: ownerId ?? null,
      ownerEmail,
    })
    .returning();

  return res[0];
}

/**
 * Buscar pet por id
 */
export async function getPetById(id: ID) {
  const res = await db.select().from(pets).where(eq(pets.id, id));
  return res[0] ?? null;
}

/**
 * Listar pets por proprietário
 */
export async function listPetsByOwner(ownerId: ID) {
  const res = await db.select().from(pets).where(eq(pets.ownerId, ownerId));
  return res;
}

/**
 * Listar pets por tutor (correção para seu código)
 */
export async function listPetsByTutor(tutorId: ID) {
  const res = await db.select().from(pets).where(eq(pets.ownerId, tutorId));
  return res;
}

/**
 * Pet principal (para posts)
 */
export async function getPrimaryPet(ownerId: ID) {
  const res = await db
    .select()
    .from(pets)
    .where(eq(pets.ownerId, ownerId))
    .limit(1);

  return res[0] ?? null;
}
