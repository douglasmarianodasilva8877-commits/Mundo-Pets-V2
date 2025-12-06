// app/api/comments/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { verifyToken } from "@/lib/auth/jwt";

import { createComment, getCommentsByPostId } from "@/lib/db/queries/comments";
import { getPetByTutor } from "@/lib/db/queries/pets"; // retorna o primeiro pet do tutor

/**
 * GET /api/comments?postId=xxxxx
 * Retorna comentários de um post.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "postId is required" },
        { status: 400 }
      );
    }

    const comments = await getCommentsByPostId(postId);

    return NextResponse.json({ success: true, comments });
  } catch (err: any) {
    console.error("❌ GET /api/comments error:", err);
    return NextResponse.json(
      { success: false, message: "internal", details: err?.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * Body:
 * {
 *   postId: string;
 *   content: string;
 *   petId?: string; // opcional
 * }
 */
export async function POST(req: Request) {
  try {
    // ---------------------------
    // 1) Autenticação JWT
    // ---------------------------
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "missing token" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload?.sub) {
      return NextResponse.json(
        { success: false, message: "invalid token" },
        { status: 401 }
      );
    }

    // ---------------------------
    // 2) Body
    // ---------------------------
    const { postId, content, petId } = await req.json();

    if (!postId || !content) {
      return NextResponse.json(
        { success: false, message: "postId and content are required" },
        { status: 400 }
      );
    }

    // ---------------------------
    // 3) Determinar o pet usado
    // ---------------------------
    let usedPetId = petId;

    if (!usedPetId) {
      const pet = await getPetByTutor(payload.sub);
      if (!pet) {
        return NextResponse.json(
          { success: false, message: "Tutor has no pet" },
          { status: 400 }
        );
      }
      usedPetId = pet.id;
    }

    // ---------------------------
    // 4) Criar comentário
    // ---------------------------
    const id = nanoid();
    const created = await createComment({
      id,
      postId,
      petId: usedPetId,
      content,
    });

    return NextResponse.json(
      { success: true, comment: created },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("❌ POST /api/comments error:", err);
    return NextResponse.json(
      { success: false, message: "internal", details: err?.message },
      { status: 500 }
    );
  }
}
