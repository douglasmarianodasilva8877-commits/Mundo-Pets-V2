export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 🔹 Rota de Pets (GET e POST)
 * - GET: Lista todos os pets
 * - POST: Cria um pet vinculado a um tutor (User)
 */
export async function GET() {
  try {
    const pets = await prisma.pet.findMany({
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json(pets);
  } catch (error) {
    console.error("❌ Erro ao buscar pets:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pets." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, species, breed, age, bio, avatarUrl, ownerId } = body;

    if (!name || !species || !ownerId) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    // 🔍 Busca o tutor
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true, email: true },
    });

    if (!owner) {
      return NextResponse.json(
        { error: "Tutor não encontrado." },
        { status: 404 }
      );
    }

    // 🧠 Cria slug único
    const slug = `${name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")}-${Date.now()}`;

    // 🐾 Cria o pet com todos os campos necessários
    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age,
        bio,
        avatarUrl,
        slug, // ✅ campo obrigatório
        ownerId,
        ownerEmail: owner.email, // ✅ campo obrigatório
      },
    });

    return NextResponse.json(
      { success: true, message: "Pet criado com sucesso!", pet },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Erro ao criar pet:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
