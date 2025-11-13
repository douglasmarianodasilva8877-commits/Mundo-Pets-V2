// app/api/pets/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint: POST /api/pets
 * Recebe FormData:
 * - name, species, breed, age, bio, tutorEmail, photo (file)
 *
 * Cria Pet vinculado ao tutor (User). Gera slug único e seta ownerEmail
 * (obrigatório pelo schema).
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = (formData.get("name") as string | null) ?? null;
    const species = (formData.get("species") as string | null) ?? null;
    const breed = (formData.get("breed") as string | null) ?? null;
    const ageRaw = (formData.get("age") as string | null) ?? null;
    const bio = (formData.get("bio") as string | null) ?? null;
    const tutorEmail = (formData.get("tutorEmail") as string | null) ?? null;
    const file = formData.get("photo") as File | null;

    // Validações mínimas
    if (!name || !species || !tutorEmail) {
      return NextResponse.json(
        { success: false, message: "Campos obrigatórios ausentes: name, species ou tutorEmail." },
        { status: 400 }
      );
    }

    // Localiza tutor pelo email
    const tutor = await prisma.user.findUnique({
      where: { email: tutorEmail },
      select: { id: true, email: true },
    });

    if (!tutor) {
      return NextResponse.json(
        { success: false, message: "Tutor não encontrado." },
        { status: 404 }
      );
    }

    // Proteção: evita criar múltiplos pets com mesmo ownerEmail (campo unique no schema)
    const existingPetByEmail = await prisma.pet.findUnique({
      where: { ownerEmail: tutor.email },
    });

    if (existingPetByEmail) {
      return NextResponse.json(
        { success: false, message: "Este tutor já possui um pet cadastrado (ownerEmail já existe)." },
        { status: 400 }
      );
    }

    // Upload opcional: converte para base64 (se houver). Se quiser salvar arquivo físico,
    // ajuste aqui para escrever em disco / storage.
    let avatarUrl: string | null = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      avatarUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    // Gera slug único e sanitizado
    const makeSlug = (s: string) =>
      `${s
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/-+/g, "-")}-${Date.now()}`;

    const slug = makeSlug(name);

    // Normaliza age
    const age = ageRaw ? parseInt(ageRaw, 10) : null;

    // Cria pet no banco com todos os campos exigidos pelo schema (slug + ownerEmail)
    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed: breed || null,
        age: Number.isFinite(age) ? age : null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        slug,
        ownerId: tutor.id,
        ownerEmail: tutor.email, // obrigatório no seu schema
      },
    });

    return NextResponse.json({ success: true, message: "Pet criado com sucesso!", pet }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Erro ao cadastrar pet:", error);

    // Prisma unique constraint error
    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Violação de unicidade (slug ou ownerEmail já existe)." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, message: error?.message || "Erro interno no servidor." }, { status: 500 });
  }
}
