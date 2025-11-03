import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const bio = formData.get("bio") as string;
    const email = formData.get("email") as string | null;
    const file = formData.get("photo") as File | null;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "E-mail do tutor é obrigatório." },
        { status: 400 }
      );
    }

    // Verifica se o tutor existe
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Tutor não encontrado. Faça login antes de cadastrar o pet." },
        { status: 404 }
      );
    }

    // Gera a imagem (caso exista)
    let photoUrl = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      photoUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    // Cria o pet vinculado ao tutor
    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        bio,
        avatarUrl: photoUrl,
        slug,
        ownerEmail: email,
        ownerId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pet cadastrado com sucesso!",
      pet,
    });
  } catch (error: any) {
    console.error("❌ Erro ao cadastrar pet:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
