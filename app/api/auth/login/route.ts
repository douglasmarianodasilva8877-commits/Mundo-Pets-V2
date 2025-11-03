import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password || "");
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Senha incorreta." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso!",
      user,
    });
  } catch (error: any) {
    console.error("❌ Erro no login:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
