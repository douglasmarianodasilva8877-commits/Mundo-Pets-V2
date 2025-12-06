// app/api/create-post/route.ts
import { NextResponse } from "next/server";
import { createPost } from "@/lib/posts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, media, petId } = body;

    const post = await createPost({
      content: content ?? "",
      media: Array.isArray(media) ? media : [],
      petId: petId ?? null,
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/create-post error:", err);
    return NextResponse.json(
      { success: false, message: err?.message ?? "Erro" },
      { status: 500 }
    );
  }
}
