// app/api/tutor/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { updateTutor } from "@/lib/db/queries/mutations";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ success: false, message: "Token ausente" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded?.sub) {
      return NextResponse.json({ success: false, message: "Token inválido" }, { status: 401 });
    }

    if (decoded.sub !== params.id) {
      return NextResponse.json(
        { success: false, message: "Você não pode alterar outro tutor" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const updated = await updateTutor(params.id, {
      name: body.name ?? undefined,
      avatarUrl: body.avatarUrl ?? undefined,
      city: body.city ?? undefined,
      bio: body.bio ?? undefined,
      phone: body.phone ?? undefined,
      address: body.address ?? undefined,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      tutor: updated,
    });
  } catch (err: any) {
    console.error("❌ PATCH /api/tutor/[id]:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Erro interno" },
      { status: 500 }
    );
  }
}
