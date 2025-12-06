// app/api/auth/login/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { tutors } from "@/lib/db/schema/tutors";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Buscar tutor (usuário humano do sistema)
    const result = await db
      .select()
      .from(tutors)
      .where(eq(tutors.email, email))
      .limit(1);

    const user = result[0];

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    // Validar senha
    if (!user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Conta inválida: senha não cadastrada.",
        },
        { status: 400 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Senha incorreta." },
        { status: 401 }
      );
    }

    // Resposta final segura
    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || null,
      },
    });
  } catch (err: any) {
    console.error("❌ Erro na rota de login:", err);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
