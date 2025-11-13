import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const bio = formData.get("bio") as string;
    const file = formData.get("photo") as File | null;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "E-mail é obrigatório." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { success: false, message: "Tutor não encontrado." },
        { status: 404 }
      );

    const pet = await prisma.pet.findFirst({ where: { ownerId: user.id } });
    if (!pet)
      return NextResponse.json(
        { success: false, message: "Pet não encontrado." },
        { status: 404 }
      );

    let photoUrl = pet.avatarUrl;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      photoUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const updated = await prisma.pet.update({
      where: { id: pet.id },
      data: { name, species, bio, avatarUrl: photoUrl },
    });

    return NextResponse.json({ success: true, pet: updated });
  } catch (error: any) {
    console.error("❌ Erro ao atualizar pet:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
