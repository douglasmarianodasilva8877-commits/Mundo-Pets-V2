import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// ⚙️ Chave secreta de segurança (pode mudar à vontade)
const SETUP_KEY = process.env.SETUP_KEY || "segredo123";

export async function GET(request: Request) {
  try {
    // 🔐 Verifica se foi passada a chave correta
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key !== SETUP_KEY) {
      return NextResponse.json(
        { success: false, message: "🚫 Acesso negado. Chave incorreta." },
        { status: 401 }
      );
    }

    // 🔎 Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: "mundo.pets.sjrp@gmail.com" },
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "⚠️ Setup já executado. Usuário já existe.",
      });
    }

    // 🔐 Criptografa a senha 369963
    const hashedPassword = await bcrypt.hash("369963", 10);

    // 👤 Cria o usuário administrador
    const user = await prisma.user.create({
      data: {
        name: "Douglas Mariano",
        email: "mundo.pets.sjrp@gmail.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Usuário administrador criado com sucesso!",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Erro no setup:", error);
    return NextResponse.json(
      { success: false, message: "❌ Erro ao criar o usuário." },
      { status: 500 }
    );
  }
}
