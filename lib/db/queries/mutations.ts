// lib/db/queries/mutations.ts
import { db } from "../client";
import { users, pets } from "../schema";
import { eq } from "drizzle-orm";
import type { ID } from "@/lib/types";

/**
 * Atualiza dados do tutor (usuário)
 * Recebe apenas os campos que deseja atualizar.
 */
export async function updateTutor(tutorId: ID, updates: Partial<{
  name: string | null;
  avatarUrl: string | null;
  city: string | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
  birthDate: Date | null;
}>): Promise<typeof users.$inferSelect | null> {
  try {
    // Mapeia nomes camelCase -> colunas do schema (se necessário)
    const setObj: Record<string, any> = {};

    if ("name" in updates) setObj.name = updates.name ?? null;
    if ("avatarUrl" in updates) setObj.avatar_url = updates.avatarUrl ?? null;
    if ("city" in updates) setObj.city = updates.city ?? null;
    if ("bio" in updates) setObj.bio = updates.bio ?? null;
    if ("phone" in updates) setObj.phone = updates.phone ?? null;
    if ("address" in updates) setObj.address = updates.address ?? null;
    if ("birthDate" in updates) setObj.birth_date = updates.birthDate ?? null;

    const res = await db
      .update(users)
      .set(setObj)
      .where(eq(users.id, tutorId))
      .returning();

    return res[0] ?? null;
  } catch (err) {
    console.error("updateTutor error:", err);
    throw err;
  }
}

/**
 * Cria um pet. Se id não informado, gera usando crypto.randomUUID().
 * Gera slug se não informado (nome + timestamp).
 */
export async function createPet(data: {
  id?: ID;
  name: string;
  species?: string | null;
  slug?: string;
  breed?: string | null;
  age?: number | null;
  avatarUrl?: string | null;
  bio?: string | null;
  description?: string | null;
  ownerId?: ID | null;
  ownerEmail: string;
}) {
  try {
    const id = data.id ?? crypto.randomUUID();
    const slug = data.slug ?? slugify(data.name);

    const row = await db
      .insert(pets)
      .values({
        id,
        name: data.name,
        species: data.species ?? null,
        slug,
        breed: data.breed ?? null,
        age: data.age ?? null,
        avatar_url: data.avatarUrl ?? null,
        bio: data.bio ?? null,
        description: data.description ?? null,
        owner_id: data.ownerId ?? null,
        owner_email: data.ownerEmail,
      })
      .returning();

    return row[0];
  } catch (err: any) {
    // Caso de violação de unicidade, repassar mensagem legível
    if (err?.code === "23505") {
      throw new Error("Violação de unicidade: slug ou ownerEmail já existe.");
    }
    console.error("createPet error:", err);
    throw err;
  }
}

/**
 * Atualiza um pet por id. Retorna o pet atualizado ou null.
 */
export async function updatePet(petId: ID, updates: Partial<{
  name: string | null;
  species: string | null;
  slug: string | null;
  breed: string | null;
  age: number | null;
  avatarUrl: string | null;
  bio: string | null;
  description: string | null;
}>) {
  try {
    const setObj: Record<string, any> = {};

    if ("name" in updates) setObj.name = updates.name ?? null;
    if ("species" in updates) setObj.species = updates.species ?? null;
    if ("slug" in updates) setObj.slug = updates.slug ?? null;
    if ("breed" in updates) setObj.breed = updates.breed ?? null;
    if ("age" in updates) setObj.age = updates.age ?? null;
    if ("avatarUrl" in updates) setObj.avatar_url = updates.avatarUrl ?? null;
    if ("bio" in updates) setObj.bio = updates.bio ?? null;
    if ("description" in updates) setObj.description = updates.description ?? null;

    const res = await db
      .update(pets)
      .set(setObj)
      .where(eq(pets.id, petId))
      .returning();

    return res[0] ?? null;
  } catch (err) {
    console.error("updatePet error:", err);
    throw err;
  }
}

/**
 * Deleta pet por id. Retorna true se removido, false se não achou.
 */
export async function deletePet(petId: ID) {
  try {
    const res = await db.delete(pets).where(eq(pets.id, petId)).returning();
    return (res && res.length > 0);
  } catch (err) {
    console.error("deletePet error:", err);
    throw err;
  }
}

/* -----------------------
   Helpers
   ----------------------- */
function slugify(s: string) {
  return `${s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")}-${Date.now().toString().slice(-5)}`;
}
