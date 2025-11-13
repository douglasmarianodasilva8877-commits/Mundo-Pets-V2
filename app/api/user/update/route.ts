import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const cpf = formData.get("cpf") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const birthDate = formData.get("birthDate") as string;
    const file = formData.get("avatar") as File | null;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "E-mail é obrigatório." },
        { status: 400 }
      );
    }

    // 📸 Converte a foto, se enviada
    let avatarUrl: string | null = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      avatarUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    // 🔎 Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });

    let user;

    if (existingUser) {
      // Atualiza dados do tutor existente
      user = await prisma.user.update({
        where: { email },
        data: {
          name,
          cpf,
          phone,
          address,
          birthDate: birthDate ? new Date(birthDate) : null,
          avatarUrl: avatarUrl || existingUser.avatarUrl,
        },
      });
    } else {
      // Cria novo tutor
      user = await prisma.user.create({
        data: {
          email,
          name,
          cpf,
          phone,
          address,
          birthDate: birthDate ? new Date(birthDate) : null,
          avatarUrl,
          role: "USER",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: existingUser
        ? "Dados do tutor atualizados com sucesso!"
        : "Tutor criado com sucesso!",
      user,
    });
  } catch (error: any) {
    console.error("❌ Erro ao atualizar/criar tutor:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar dados do tutor." },
      { status: 500 }
    );
  }
}
