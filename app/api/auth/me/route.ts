// app/api/auth/me/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { tutors } from "@/lib/db/schema/tutors";
import { pets } from "@/lib/db/schema/pets";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, message: "Token ausente" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.sub) {
      return NextResponse.json({ success: false, message: "Token inválido" }, { status: 401 });
    }

    const tutorId = payload.sub;

    const tutorRes = await db.select().from(tutors).where(eq(tutors.id, tutorId)).limit(1);
    const tutor = tutorRes[0];
    if (!tutor) return NextResponse.json({ success: false, message: "Tutor não encontrado" }, { status: 404 });

    const petsRes = await db.select().from(pets).where(eq(pets.tutorId, tutorId));

    return NextResponse.json({
      success: true,
      tutor: {
        id: tutor.id,
        name: tutor.name,
        email: tutor.email,
        avatarUrl: tutor.avatarUrl ?? null,
        createdAt: tutor.createdAt,
      },
      pets: petsRes,
    });
  } catch (err: any) {
    console.error("❌ /api/auth/me error:", err);
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 });
  }
}
