// app/api/toggle-like/route.ts
import { NextResponse } from "next/server";
import { toggleLike } from "@/lib/actions/posts";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ success: false, message: "postId required" }, { status: 400 });
    const res = await toggleLike(postId);
    return NextResponse.json({ success: true, ...res });
  } catch (err: any) {
    console.error("POST /api/toggle-like error:", err);
    return NextResponse.json({ success: false, message: err?.message ?? "Erro" }, { status: 500 });
  }
}
