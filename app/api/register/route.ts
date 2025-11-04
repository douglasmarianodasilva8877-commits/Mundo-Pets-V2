// app/api/register/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // suportamos tanto JSON quanto multipart/form-data
    const contentType = req.headers.get("content-type") || "";

    let name: string | undefined;
    let email: string | undefined;
    let password: string | undefined;
    let avatarDataUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      name = (form.get("name") as string) || undefined;
      email = (form.get("email") as string) || undefined;
      password = (form.get("password") as string) || undefined;
      const file = form.get("avatar") as File | null;

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        avatarDataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    } else {
      // fallback para JSON (compatibilidade retroativa)
      const body = await req.json();
      name = body.name;
      email = body.email;
      password = body.password;
      if (body.avatarBase64) avatarDataUrl = body.avatarBase64;
    }

    if (!email || !password)
      return NextResponse.json({ success: false, error: "Campos obrigatórios" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ success: false, error: "E-mail já cadastrado" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        avatarUrl: avatarDataUrl || null,
      },
    });

    // Retornamos success para o front manter o fluxo atual
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("Erro em /api/register:", err);
    // mensagem segura para o cliente
    return NextResponse.json({ success: false, error: "Erro no servidor" }, { status: 500 });
  }
}
