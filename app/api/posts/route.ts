// app/api/posts/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPost, listPosts } from "@/lib/db/queries/posts";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * POST /api/posts
 * - FormData: content, petId (optional), media[] (files)
 * - Auth: Authorization: Bearer <jwt>
 * Returns created post (with joins) for immediate feed update
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "missing token" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ success: false, message: "invalid token" }, { status: 401 });

    const userId = payload.sub;

    const contentType = req.headers.get("content-type") || "";
    // accept both JSON and multipart
    let content: string | null = null;
    let petId: string | null = null;
    let files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      content = (form.get("content") as string) ?? null;
      petId = (form.get("petId") as string) ?? null;
      const raw = form.getAll("media");
      files = raw.filter((r) => r instanceof File) as File[];
    } else {
      const body = await req.json();
      content = body.content ?? null;
      petId = body.petId ?? null;
      // no files in JSON
    }

    // upload files to Supabase storage if any
    const supabase = createClient();
    const mediaUrls: string[] = [];
    let imageUrl: string | null = null;

    for (const file of files) {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const path = `posts/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error: uploadErr } = await supabase.storage.from("posts").upload(path, buffer, { contentType: file.type });
      if (uploadErr) {
        console.warn("Supabase upload failed:", uploadErr);
        continue;
      }
      const { data: publicUrl } = supabase.storage.from("posts").getPublicUrl(path);
      const url = publicUrl.publicUrl;
      mediaUrls.push(url);
    }

    // if single image only, set imageUrl to first media for legacy support
    if (mediaUrls.length === 1) imageUrl = mediaUrls[0];

    // create post in DB
    const post = await createPost({
      authorId: userId,
      petId: petId ?? null,
      content,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : null,
      imageUrl: imageUrl ?? null,
    });

    // return created post raw (client will fetch feed/ transform)
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (err: any) {
    console.error("❌ POST /api/posts error:", err);
    return NextResponse.json({ success: false, message: err?.message ?? "Erro interno" }, { status: 500 });
  }
}

/** optional GET to list recent posts (simple) */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const cursor = url.searchParams.get("cursor") ?? null;

    const { items, nextCursor } = await listPosts(limit, cursor);
    return NextResponse.json({ success: true, items, nextCursor });
  } catch (err: any) {
    console.error("❌ GET /api/posts error:", err);
    return NextResponse.json({ success: false, message: err?.message ?? "Erro" }, { status: 500 });
  }
}
