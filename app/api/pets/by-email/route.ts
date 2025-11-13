import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "E-mail é obrigatório." },
        { status: 400 }
      );
    }

    // Busca o tutor pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        pets: {
          include: {
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Tutor não encontrado." },
        { status: 404 }
      );
    }

    if (!user.pets || user.pets.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nenhum pet cadastrado para este tutor." },
        { status: 404 }
      );
    }

    // Retorna o primeiro pet vinculado
    return NextResponse.json({
      success: true,
      pet: user.pets[0],
    });
  } catch (error: any) {
    console.error("❌ Erro ao buscar pet:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao buscar pet." },
      { status: 500 }
    );
  }
}
