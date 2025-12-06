// app/api/pets/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPet } from "@/lib/db/queries/mutations";

/**
 * POST /api/pets
 * Recebe FormData:
 * - name, species, breed, age, bio, ownerEmail
 * - avatar (File)
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = form.get("name") as string | null;
    const species = form.get("species") as string | null;
    const breed = (form.get("breed") as string | null) ?? null;
    const ageRaw = (form.get("age") as string | null) ?? null;
    const bio = (form.get("bio") as string | null) ?? null;
    const ownerEmail = form.get("ownerEmail") as string | null;

    const file = form.get("avatar") as File | null;

    // validações
    if (!name || !species || !ownerEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Campos obrigatórios: name, species, ownerEmail",
        },
        { status: 400 }
      );
    }

    // upload para supabase
    let avatarUrl: string | null = null;
    if (file) {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `pets/${Date.now()}.${ext}`;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error: uploadErr } = await supabase.storage
        .from("pets")
        .upload(filePath, buffer, {
          contentType: file.type,
        });

      if (uploadErr) {
        console.error("Upload error:", uploadErr);
        return NextResponse.json(
          { success: false, message: "Erro ao enviar arquivo." },
          { status: 500 }
        );
      }

      const { data: publicUrl } = supabase.storage
        .from("pets")
        .getPublicUrl(filePath);

      avatarUrl = publicUrl.publicUrl;
    }

    const age = ageRaw ? parseInt(ageRaw) : null;

    // chama a mutation DRIZZLE
    const pet = await createPet({
      name,
      species,
      breed,
      age,
      avatarUrl,
      bio,
      ownerEmail,
    });

    return NextResponse.json(
      { success: true, pet },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ POST /api/pets error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message ?? "Erro ao criar pet",
      },
      { status: 500 }
    );
  }
}
