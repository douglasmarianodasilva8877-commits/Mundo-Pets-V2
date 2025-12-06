// lib/actions/posts.ts
"use server";

import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema/posts";
import { users } from "@/lib/db/schema/users";
import { pets } from "@/lib/db/schema/pets";
import { comments } from "@/lib/db/schema/comments";
import { postLikes } from "@/lib/db/schema/postLikes";

import { eq, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

/* -------------------------------------------------
   AUTH
-------------------------------------------------- */
async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    const e: any = new Error("Usuário não autenticado");
    e.status = 401;
    throw e;
  }
  return session.user.id;
}

/* -------------------------------------------------
   CREATE POST
-------------------------------------------------- */
export async function createPost(input: {
  content?: string | null;
  mediaUrls?: string[] | null;
  imageUrl?: string | null;
  petId?: string | null;
}) {
  const userId = await requireAuth();
  const id = crypto.randomUUID();
  const now = new Date();

  const row = {
    id,
    authorId: userId,
    petId: input.petId ?? null,
    content: input.content ?? "",
    mediaUrls: input.mediaUrls ?? null,
    imageUrl: input.imageUrl ?? null,
    likesCount: 0,
    commentsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const res = await db.insert(posts).values(row).returning();

  try {
    revalidatePath("/feed");
  } catch {}

  return res[0];
}

/* -------------------------------------------------
   TOGGLE LIKE (CURTIR/DESCURTIR)
-------------------------------------------------- */
export async function toggleLike(postId: string) {
  const userId = await requireAuth();

  // garante post existente
  const postRow = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!postRow[0]) {
    const e: any = new Error("Post não encontrado");
    e.status = 404;
    throw e;
  }

  // verifica se já curtiu
  const likeExists = await db
    .select()
    .from(postLikes)
    .where(
      and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))
    );

  let liked: boolean;
  let newCount: number;

  if (likeExists.length > 0) {
    // remover like
    await db
      .delete(postLikes)
      .where(
        and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))
      );

    newCount = Math.max(0, (postRow[0].likesCount ?? 0) - 1);
    liked = false;
  } else {
    // adicionar like
    await db.insert(postLikes).values({
      postId,
      userId,
    });

    newCount = (postRow[0].likesCount ?? 0) + 1;
    liked = true;
  }

  await db
    .update(posts)
    .set({ likesCount: newCount })
    .where(eq(posts.id, postId));

  try {
    revalidatePath("/feed");
  } catch {}

  return { postId, liked, likesCount: newCount };
}

/* -------------------------------------------------
   UPDATE
-------------------------------------------------- */
export async function updatePost(
  postId: string,
  updates: { content?: string | null; mediaUrls?: string[] | null }
) {
  const userId = await requireAuth();

  const existing = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!existing[0]) {
    const e: any = new Error("Post não encontrado");
    e.status = 404;
    throw e;
  }
  if (existing[0].authorId !== userId) {
    const e: any = new Error("Sem permissão para editar");
    e.status = 403;
    throw e;
  }

  const setObj: any = {};
  if ("content" in updates) setObj.content = updates.content ?? "";
  if ("mediaUrls" in updates) setObj.mediaUrls = updates.mediaUrls ?? null;

  setObj.updatedAt = new Date();

  await db.update(posts).set(setObj).where(eq(posts.id, postId));

  try {
    revalidatePath("/feed");
  } catch {}

  return { success: true };
}

/* -------------------------------------------------
   DELETE POST
-------------------------------------------------- */
export async function deletePost(postId: string) {
  const userId = await requireAuth();

  const existing = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!existing[0]) {
    const e: any = new Error("Post não encontrado");
    e.status = 404;
    throw e;
  }
  if (existing[0].authorId !== userId) {
    const e: any = new Error("Sem permissão");
    e.status = 403;
    throw e;
  }

  await db.delete(posts).where(eq(posts.id, postId));

  try {
    revalidatePath("/feed");
  } catch {}

  return { success: true };
}
