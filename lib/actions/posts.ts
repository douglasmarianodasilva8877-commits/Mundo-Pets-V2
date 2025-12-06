// lib/actions/posts.ts
"use server";

import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema/posts";
import { users } from "@/lib/db/schema/users";
import { pets } from "@/lib/db/schema/pets";
import { comments } from "@/lib/db/schema/comments";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

/**
 * Tipos públicos usados pelas actions
 */
export type MediaItem = { type: "image" | "video" | "gif"; url: string };

export type CreatePostInput = {
  content?: string | null;
  media?: MediaItem[] | null;
  petId?: string | null;
};

/* ---------------------------
   Helper: requireAuth
   - usa auth() exportado em lib/auth.ts
   --------------------------- */
async function requireAuth() {
  // auth() deve retornar session ou null
  const session = await auth();
  if (!session?.user?.id) {
    const e = new Error("Usuário não autenticado");
    // @ts-ignore attach status
    e.status = 401;
    throw e;
  }
  return session.user.id as string;
}

/* ---------------------------
   createPost
   --------------------------- */
export async function createPost(input: CreatePostInput) {
  const userId = await requireAuth();

  const id = crypto.randomUUID();
  const now = new Date();

  const row = {
    id,
    author_id: userId, // caso seu schema use snake_case, ajuste abaixo (ver schema)
    authorId: userId, // também manter em camel se schema assim estiver tipado
    petId: input.petId ?? null,
    content: input.content ?? "",
    media: input.media ?? [],
    likesCount: 0,
    commentsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  // Ajuste: Insira apenas os campos que seu schema Drizzle espera.
  // Aqui uso a API genérica (supondo colunas camelCase).
  const res = await db.insert(posts).values({
    id,
    authorId: userId,
    petId: input.petId ?? null,
    content: input.content ?? "",
    media: input.media ?? [],
    likesCount: 0,
    commentsCount: 0,
    createdAt: now,
    updatedAt: now,
  }).returning();

  // revalidate feed page cache (se aplicável)
  try {
    revalidatePath("/feed");
  } catch (err) {
    console.warn("revalidatePath failed:", err);
  }

  return res[0];
}

/* ---------------------------
   getPostById
   --------------------------- */
export async function getPostById(postId: string) {
  const row = await db
    .select({
      post: posts,
      author: users,
      pet: pets,
      commentsCount: sql<number>`(
        SELECT count(*) FROM ${comments} WHERE ${comments}.post_id = ${posts.id}
      )`,
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.authorId))
    .leftJoin(pets, eq(pets.id, posts.petId))
    .where(eq(posts.id, postId))
    .limit(1);

  const item = row[0] ?? null;
  if (!item) return null;

  return {
    post: item.post,
    author: item.author ?? null,
    pet: item.pet ?? null,
    commentsCount: Number(item.commentsCount ?? 0),
  };
}

/* ---------------------------
   updatePost
   --------------------------- */
export async function updatePost(
  postId: string,
  updates: Partial<{ content: string | null; media: MediaItem[] | null }>
) {
  const userId = await requireAuth();

  const existing = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  const postRow = existing[0];
  if (!postRow) {
    const e = new Error("Post não encontrado");
    // @ts-ignore
    e.status = 404;
    throw e;
  }
  if (postRow.authorId !== userId) {
    const e = new Error("Você não tem permissão para editar este post");
    // @ts-ignore
    e.status = 403;
    throw e;
  }

  const setObj: any = {};
  if ("content" in updates) setObj.content = updates.content ?? "";
  if ("media" in updates) setObj.media = updates.media ?? [];
  setObj.updatedAt = new Date();

  await db.update(posts).set(setObj).where(eq(posts.id, postId));

  try {
    revalidatePath("/feed");
  } catch {}

  return getPostById(postId);
}

/* ---------------------------
   deletePost
   --------------------------- */
export async function deletePost(postId: string) {
  const userId = await requireAuth();

  const existing = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  const postRow = existing[0];
  if (!postRow) {
    const e = new Error("Post não encontrado");
    // @ts-ignore
    e.status = 404;
    throw e;
  }
  if (postRow.authorId !== userId) {
    const e = new Error("Você não tem permissão para deletar este post");
    // @ts-ignore
    e.status = 403;
    throw e;
  }

  await db.delete(posts).where(eq(posts.id, postId));

  try {
    revalidatePath("/feed");
  } catch {}

  return { success: true };
}

/* ---------------------------
   likePost
   --------------------------- */
export async function likePost(postId: string, liked: boolean) {
  const userId = await requireAuth();

  const existing = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  const postRow = existing[0];
  if (!postRow) {
    const e = new Error("Post não encontrado");
    // @ts-ignore
    e.status = 404;
    throw e;
  }

  const delta = liked ? 1 : -1;
  const newCount = Math.max(0, (postRow.likesCount ?? 0) + delta);

  await db.update(posts).set({ likesCount: newCount }).where(eq(posts.id, postId));

  try {
    revalidatePath("/feed");
  } catch {}

  return { postId, likesCount: newCount };
}

/* ---------------------------
   listPosts
   --------------------------- */
export async function listPosts(limit = 10, cursor?: string | null) {
  const q = db
    .select({
      post: posts,
      author: users,
      pet: pets,
      commentsCount: sql<number>`(
        SELECT count(*) FROM ${comments} WHERE ${comments}.post_id = ${posts.id}
      )`,
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.authorId))
    .leftJoin(pets, eq(pets.id, posts.petId))
    .orderBy(desc(posts.createdAt))
    .limit(limit);

  if (cursor) q.where(sql`${posts.createdAt} < ${new Date(cursor)}`);

  const rows = await q;
  const items = rows.map((r) => ({
    post: r.post,
    author: r.author ?? null,
    pet: r.pet ?? null,
    commentsCount: Number(r.commentsCount ?? 0),
  }));

  const nextCursor = items.length === limit ? items[items.length - 1].post.createdAt.toISOString() : null;

  return { items, nextCursor };
}
