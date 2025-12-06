// app/api/feed/route.ts
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema/posts";
import { users } from "@/lib/db/schema/users";
import { pets } from "@/lib/db/schema/pets";
import { postLikes } from "@/lib/db/schema/postLikes";
import { listPosts } from "@/lib/actions/posts";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "10");
    const cursor = url.searchParams.get("cursor");

    // use existing action for pagination
    const { items, nextCursor } = await listPosts(limit, cursor);

    // try get current user id (NextAuth)
    let currentUserId: string | null = null;
    try {
      const session = await auth();
      currentUserId = session?.user?.id ?? null;
    } catch {}

    // For each post, check if liked by current user (optimized: batch query)
    const postIds = items.map((it: any) => it.post.id);
    let likedMap = new Map<string, boolean>();
    if (currentUserId && postIds.length > 0) {
      const rows = await db.select().from(postLikes).where(postLikes.postId.in(postIds), postLikes.userId.eq(currentUserId));
      for (const r of rows) likedMap.set(r.postId, true);
    }

    const normalized = items.map((it: any) => ({
      post: it.post,
      author: it.author ?? null,
      pet: it.pet ?? null,
      commentsCount: it.commentsCount ?? 0,
      likedByCurrentUser: likedMap.get(it.post.id) ?? false,
    }));

    return NextResponse.json({ success: true, items: normalized, nextCursor });
  } catch (err: any) {
    console.error("GET /api/feed error:", err);
    return NextResponse.json({ success: false, message: err?.message ?? "Erro" }, { status: 500 });
  }
}
