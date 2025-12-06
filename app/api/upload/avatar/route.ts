// app/api/upload/avatar/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { uploadFileToBucket } from "@/lib/supabase/storage";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "missing token" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.sub) return NextResponse.json({ success: false, message: "invalid token" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ success: false, message: "missing file" }, { status: 400 });

    // generate path: pets/avatars/<tutorId>/<timestamp>-name.ext
    const ext = file.name?.split(".").pop() ?? "bin";
    const path = `pets/avatars/${payload.sub}/${Date.now()}.${ext}`;

    // upload via supabase helper (server)
    const { data, publicUrl } = await uploadFileToBucket({ file, path, bucket: "public", useAdmin: true });

    // return publicUrl (or signed url)
    return NextResponse.json({ success: true, url: publicUrl ?? null, data }, { status: 201 });
  } catch (err: any) {
    console.error("❌ /api/upload/avatar:", err);
    return NextResponse.json({ success: false, message: "internal" }, { status: 500 });
  }
}
