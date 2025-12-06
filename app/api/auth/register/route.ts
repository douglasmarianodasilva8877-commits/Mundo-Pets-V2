// app/api/auth/register/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { tutors } from "@/lib/db/schema/tutors";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let name: string | undefined;
    let email: string | undefined;
    let password: string | undefined;
    let avatarBase64: string | null = null;

    // -----------------------------------------
    // FORM-DATA (upload de imagem)
    // -----------------------------------------
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

      name = (form.get("name") as string) || undefined;
      email = (form.get("email") as string) || undefined;
      password = (form.get("password") as string) || undefined;

      const file = form.get("avatar") as File | null;

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        avatarBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    }

    // -----------------------------------------
    // JSON (fallback)
    // -----------------------------------------
    else {
      const body = await req.json();
      name = body.name;
      email = body.email;
      password = body.password;
      avatarBase64 = body.avatarBase64 || null;
    }

    // -----------------------------------------
    // VALIDAÇÃO
    // -----------------------------------------
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Verificar se já existe tutor com esse e-mail
    const existing = await db
      .select()
      .from(tutors)
      .where(eq(tutors.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "E-mail já cadastrado." },
        { status: 409 }
      );
    }

    // -----------------------------------------
    // CRIAÇÃO DO USUÁRIO
    // -----------------------------------------
    const id = nanoid();
    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(tutors).values({
      id,
      name,
      email,
      passwordHash,
      avatarUrl: avatarBase64,
    });

    return NextResponse.json({
      success: true,
      message: "Conta criada com sucesso!",
      user: {
        id,
        name,
        email,
        avatarUrl: avatarBase64,
      },
    });
  } catch (err: any) {
    console.error("❌ Erro em /api/auth/register:", err);

    return NextResponse.json(
      { success: false, message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
