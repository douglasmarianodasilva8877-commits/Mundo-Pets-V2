// app/api/pets/list/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { listPetsByTutor } from "@/lib/db/queries/pets";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "missing token" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.sub) return NextResponse.json({ success: false, message: "invalid token" }, { status: 401 });

    const tutorId = payload.sub;
    const pets = await listPetsByTutor(tutorId);
    return NextResponse.json({ success: true, pets });
  } catch (err: any) {
    console.error("❌ /api/pets/list:", err);
    return NextResponse.json({ success: false, message: "internal" }, { status: 500 });
  }
}
