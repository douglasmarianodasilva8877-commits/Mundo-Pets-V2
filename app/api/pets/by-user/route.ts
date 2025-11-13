import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email)
      return NextResponse.json(
        { success: false, message: "E-mail não informado." },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { success: false, message: "Tutor não encontrado." },
        { status: 404 }
      );

    const pet = await prisma.pet.findFirst({
      where: { ownerId: user.id },
    });

    if (!pet)
      return NextResponse.json(
        { success: false, message: "Nenhum pet cadastrado ainda." },
        { status: 404 }
      );

    return NextResponse.json({ success: true, pet });
  } catch (error: any) {
    console.error("❌ Erro ao buscar pet:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Erro interno." },
      { status: 500 }
    );
  }
}
