// app/api/comments/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { getCommentById, deleteCommentById } from "@/lib/db/queries/comments";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "missing token" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ success: false, message: "invalid token" }, { status: 401 });

    const id = params.id;
    const comment = await getCommentById(id);
    if (!comment) return NextResponse.json({ success: false, message: "comment not found" }, { status: 404 });

    // only owner (pet's tutor) can delete: verify tutor via pet
    // comment.petId -> pet -> tutorId
    const { db } = await import("@/lib/db/client"); // lazy import to avoid edge issues
    const { pets } = await import("@/lib/db/schema/pets");
    const petRow = (await db.select().from(pets).where(pets.id.eq(comment.petId)).limit(1))[0];
    if (!petRow) return NextResponse.json({ success: false, message: "pet not found" }, { status: 404 });

    if (petRow.tutorId !== payload.sub) {
      return NextResponse.json({ success: false, message: "forbidden" }, { status: 403 });
    }

    await deleteCommentById(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ DELETE /api/comments/[id]:", err);
    return NextResponse.json({ success: false, message: "internal" }, { status: 500 });
  }
}
