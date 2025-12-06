// app/api/posts/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { getPostById, updatePost, deletePost } from "@/lib/db/queries/posts";
import { createClient } from "@/lib/supabase/server";

/** GET /api/posts/:id */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await getPostById(params.id);
    if (!post) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    console.error("GET /api/posts/[id] error:", err);
    return NextResponse.json({ success: false, message: "Erro" }, { status: 500 });
  }
}

/** PATCH /api/posts/:id */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "missing token" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ success: false, message: "invalid token" }, { status: 401 });
    const userId = payload.sub;

    const postRow = await getPostById(params.id);
    if (!postRow) return NextResponse.json({ success: false, message: "post not found" }, { status: 404 });
    if (postRow.authorId !== userId) return NextResponse.json({ success: false, message: "not owner" }, { status: 403 });

    // accept JSON or multipart (for new media)
    const contentType = req.headers.get("content-type") || "";
    let updates: any = {};
    let mediaUrls: string[] | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      updates.content = (form.get("content") as string) ?? undefined;
      const raw = form.getAll("media");
      const files = raw.filter((r) => r instanceof File) as File[];

      if (files.length > 0) {
        const supabase = createClient();
        mediaUrls = [];
        for (const file of files) {
          const ext = (file.name.split(".").pop() || "bin").toLowerCase();
          const path = `posts/${params.id}-${Date.now()}-${crypto.randomUUID()}.${ext}`;
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const { error: uploadErr } = await supabase.storage.from("posts").upload(path, buffer, { contentType: file.type });
          if (uploadErr) continue;
          const { data: publicUrl } = supabase.storage.from("posts").getPublicUrl(path);
          mediaUrls.push(publicUrl.publicUrl);
        }
      }
    } else {
      const body = await req.json();
      updates.content = body.content ?? undefined;
      if (body.mediaUrls) mediaUrls = body.mediaUrls;
    }

    if (mediaUrls !== null) updates.mediaUrls = mediaUrls.length ? mediaUrls : null;
    const updated = await updatePost(params.id, { content: updates.content, mediaUrls: updates.mediaUrls, imageUrl: updates.imageUrl ?? undefined });

    return NextResponse.json({ success: true, post: updated });
  } catch (err: any) {
    console.error("PATCH /api/posts/[id] error:", err);
    return NextResponse.json({ success: false, message: err?.message ?? "Erro" }, { status: 500 });
  }
}

/** DELETE /api/posts/:id */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "missing token" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ success: false, message: "invalid token" }, { status: 401 });
    const userId = payload.sub;

    const postRow = await getPostById(params.id);
    if (!postRow) return NextResponse.json({ success: false, message: "post not found" }, { status: 404 });
    if (postRow.authorId !== userId) return NextResponse.json({ success: false, message: "not owner" }, { status: 403 });

    await deletePost(params.id);
    return NextResponse.json({ success: true, message: "deleted" });
  } catch (err: any) {
    console.error("DELETE /api/posts/[id] error:", err);
    return NextResponse.json({ success: false, message: err?.message ?? "Erro" }, { status: 500 });
  }
}
