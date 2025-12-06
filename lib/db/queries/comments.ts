// lib/db/queries/comments.ts
import { db } from "../client";
import { comments, pets } from "../schema";
import { eq, desc } from "drizzle-orm";

/**
 * Cria um comentário.
 * Compatível com a API /api/comments (que usa petId como autor)
 */
export async function createComment({
  id,
  postId,
  petId,
  content,
}: {
  id: string;
  postId: string;
  petId: string;
  content: string;
}) {
  const result = await db
    .insert(comments)
    .values({
      id,
      postId,
      petId,
      content,
    })
    .returning();

  return result[0];
}

/**
 * Lista comentários de um post.
 * Já retorna com dados do Pet (nome, avatar), para montar UI completa.
 */
export async function getCommentsByPostId(postId: string) {
  const rows = await db
    .select({
      id: comments.id,
      postId: comments.postId,
      content: comments.content,
      createdAt: comments.createdAt,

      // join com Pets (autor)
      pet: {
        id: pets.id,
        name: pets.name,
        avatar: pets.avatarUrl,
      },
    })
    .from(comments)
    .leftJoin(pets, eq(pets.id, comments.petId))
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));

  return rows;
}

/**
 * Deleta comentário.
 * Permite apenas caso o comentário exista — regras de permissão
 * serão aplicadas na API, não aqui.
 */
export async function deleteComment(commentId: string) {
  const result = await db
    .delete(comments)
    .where(eq(comments.id, commentId))
    .returning();

  return result[0];
}
