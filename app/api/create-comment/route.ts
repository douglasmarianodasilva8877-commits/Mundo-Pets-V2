// app/api/create-comment/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema/comments";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const { postId, authorId, content } = await req.json();

    if (!postId || !authorId || !content) {
      return NextResponse.json(
        { error: "postId, authorId e content são obrigatórios." },
        { status: 400 }
      );
    }

    const newComment = {
      id: uuid(),
      postId,
      authorId,
      content,
      createdAt: new Date(),
    };

    await db.insert(comments).values(newComment);

    return NextResponse.json({ comment: newComment });
  } catch (err) {
    console.error("Erro ao criar comentário:", err);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}
