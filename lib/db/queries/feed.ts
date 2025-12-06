// lib/db/queries/feed.ts
import { db } from "../client";
import { posts, pets, users, comments } from "../schema";
import { eq, lt, desc, sql, and } from "drizzle-orm";
import type { FeedResponse } from "@/lib/types/feed";

export async function listFeed(
  limit = 10,
  cursor?: string | null,
  filters?: {
    species?: string | null;
    petId?: string | null;
    tutorId?: string | null;
    q?: string | null;
  }
): Promise<FeedResponse> {
  // ----- Subquery: contagem de comentários -----
  const commentsCount = db
    .select({
      postId: comments.postId,
      count: sql<number>`count(*)`,
    })
    .from(comments)
    .groupBy(comments.postId)
    .as("comments_count");

  // ----- Condições acumuladas -----
  const conditions = [];

  if (cursor) {
    conditions.push(lt(posts.createdAt, new Date(cursor)));
  }

  if (filters?.petId) conditions.push(eq(posts.petId, filters.petId));
  if (filters?.tutorId) conditions.push(eq(posts.authorId, filters.tutorId));
  if (filters?.species) conditions.push(eq(pets.species, filters.species));

  if (filters?.q) {
    const term = `%${filters.q}%`;
    conditions.push(
      sql`(posts.content ILIKE ${term} OR pets.name ILIKE ${term} OR users.name ILIKE ${term})`
    );
  }

  // ----- Query principal -----
  const rows = await db
    .select({
      post: posts,
      pet: pets,
      tutor: users,
      commentsCount: commentsCount.count,
    })
    .from(posts)
    .leftJoin(pets, eq(pets.id, posts.petId))
    .leftJoin(users, eq(users.id, posts.authorId))
    .leftJoin(commentsCount, eq(commentsCount.postId, posts.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(posts.createdAt))
    .limit(limit);

  const items = rows.map((r) => ({
    post: r.post,
    pet: r.pet ?? null,
    tutor: r.tutor ?? null,
    commentsCount: Number(r.commentsCount ?? 0),
  }));

  const nextCursor =
    items.length === limit
      ? items[items.length - 1].post.createdAt.toISOString()
      : null;

  return { items, nextCursor };
}
