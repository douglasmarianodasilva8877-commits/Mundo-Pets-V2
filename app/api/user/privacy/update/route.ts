// app/api/user/privacy/update/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * ==========================================
 * 🔐 API — Atualização de Privacidade do Usuário
 * ==========================================
 * PATCH /api/user/privacy/update
 * Body esperado: {
 *   showPhone?: boolean;
 *   showAddress?: boolean;
 *   showBirthDate?: boolean;
 *   allowCommerceUse?: boolean;
 *   allowContactUse?: boolean;
 * }
 */

export async function PATCH(req: Request) {
  try {
    // 🔸 Autenticação obrigatória
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    // 🔸 Validação do corpo
    const body = await req.json();
    const allowedKeys = [
      "showPhone",
      "showAddress",
      "showBirthDate",
      "allowCommerceUse",
      "allowContactUse",
    ];

    // 🧹 Sanitização dos dados recebidos
    const privacyData: Record<string, boolean> = {};
    for (const key of allowedKeys) {
      if (key in body) {
        privacyData[key] = Boolean(body[key]);
      }
    }

    // 🔸 Atualização no banco via Prisma
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        privacy: privacyData,
      },
      select: {
        id: true,
        name: true,
        email: true,
        privacy: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Preferências de privacidade atualizadas com sucesso.",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar privacidade:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar as configurações de privacidade." },
      { status: 500 }
    );
  }
}
