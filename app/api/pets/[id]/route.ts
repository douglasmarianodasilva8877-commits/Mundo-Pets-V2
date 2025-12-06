// app/api/pets/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { getPetById } from "@/lib/db/queries/pets";
import {
  updatePet,
  deletePet,
} from "@/lib/db/queries/mutations";
import { createClient } from "@/lib/supabase/server";

// ---------------- GET -----------------
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const pet = await getPetById(params.id);
    if (!pet) {
      return NextResponse.json(
        { success: false, message: "Pet não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, pet });
  } catch (err) {
    console.error("❌ GET /api/pets/[id]:", err);
    return NextResponse.json(
      { success: false, message: "Erro interno" },
      { status: 500 }
    );
  }
}

// ---------------- PATCH -----------------
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token)
      return NextResponse.json(
        { success: false, message: "Token ausente" },
        { status: 401 }
      );

    const decoded = verifyToken(token);
    if (!decoded?.sub)
      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 401 }
      );

    const tutorId = decoded.sub;
    const id = params.id;

    // validar se o pet pertence ao tutor
    const pet = await getPetById(id);
    if (!pet)
      return NextResponse.json(
        { success: false, message: "Pet não encontrado" },
        { status: 404 }
      );

    if (pet.ownerId !== tutorId)
      return NextResponse.json(
        { success: false, message: "Você não é o dono deste pet" },
        { status: 403 }
      );

    // body pode ser json ou formdata (upload de avatar)
    let body: any = {};
    let avatarUrl: string | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());

      const file = form.get("avatar") as File | null;

      if (file) {
        const supabase = createClient();
        const ext = file.name.split(".").pop();
        const path = `pets/${id}-${Date.now()}.${ext}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const { error: uploadErr } = await supabase.storage
          .from("pets")
          .upload(path, buffer, { contentType: file.type });

        if (uploadErr) throw uploadErr;

        avatarUrl = supabase.storage.from("pets").getPublicUrl(path).data.publicUrl;
      }
    } else {
      body = await req.json();
    }

    // Normaliza
    const updates: any = {
      name: body.name ?? undefined,
      species: body.species ?? undefined,
      breed: body.breed ?? undefined,
      age: body.age ? Number(body.age) : undefined,
      bio: body.bio ?? undefined,
      avatarUrl: avatarUrl ?? body.avatarUrl ?? undefined,
    };

    const updated = await updatePet(id, updates);

    return NextResponse.json({ success: true, pet: updated });
  } catch (err: any) {
    console.error("❌ PATCH /api/pets/[id]:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Erro interno" },
      { status: 500 }
    );
  }
}

// ---------------- DELETE -----------------
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token)
      return NextResponse.json(
        { success: false, message: "Token ausente" },
        { status: 401 }
      );

    const decoded = verifyToken(token);
    if (!decoded?.sub)
      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 401 }
      );

    const tutorId = decoded.sub;
    const id = params.id;

    const pet = await getPetById(id);
    if (!pet)
      return NextResponse.json(
        { success: false, message: "Pet não encontrado" },
        { status: 404 }
      );

    if (pet.ownerId !== tutorId)
      return NextResponse.json(
        { success: false, message: "Você não é o dono deste pet" },
        { status: 403 }
      );

    await deletePet(id);

    return NextResponse.json({
      success: true,
      message: "Pet deletado com sucesso",
    });
  } catch (err: any) {
    console.error("❌ DELETE /api/pets/[id]:", err);
    return NextResponse.json(
      { success: false, message: "Erro interno" },
      { status: 500 }
    );
  }
}
