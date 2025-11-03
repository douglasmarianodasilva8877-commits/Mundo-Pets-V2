import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userName = formData.get("userName") as string;
    const petName = formData.get("petName") as string;
    const species = formData.get("species") as string;
    const bio = formData.get("bio") as string;
    const file = formData.get("photo") as File | null;

    // ====== Upload da imagem ======
    let avatarUrl = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      avatarUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    // ====== Verifica se o tutor já existe ======
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          name: userName,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });
    }

    // ====== Verifica se já existe pet para este tutor ======
    const existingPet = await prisma.pet.findUnique({
      where: { ownerEmail: email },
    });

    if (existingPet) {
      return NextResponse.json(
        { success: false, message: "Este tutor já possui um pet cadastrado." },
        { status: 400 }
      );
    }

    // ====== Cria o pet vinculado ======
    const slug = petName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    const pet = await prisma.pet.create({
      data: {
        name: petName,
        species,
        bio,
        avatarUrl,
        slug,
        ownerEmail: email,
        ownerId: user.id,
      },
    });

    return NextResponse.json({ success: true, user, pet });
  } catch (err: any) {
    console.error("❌ Erro no cadastro:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
