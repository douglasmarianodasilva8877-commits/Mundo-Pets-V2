export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { randomUUID } from "crypto";

/**
 * 🔹 Endpoint para upload de mídia (imagens e vídeos)
 * As mídias são salvas em /public/uploads/pets e uma URL pública é retornada.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // Cria pasta se não existir
    const uploadDir = path.join(process.cwd(), "public", "uploads", "pets");
    await mkdir(uploadDir, { recursive: true });

    // Gera nome único
    const ext = path.extname(file.name) || ".dat";
    const fileName = `${randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Salva arquivo localmente
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Gera URL pública
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.VERCEL_URL ||
      "http://localhost:3000";

    const cleanBase = base.replace(/^https?:\/\//, "");
    const url = `https://${cleanBase}/uploads/pets/${fileName}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error("❌ Erro no upload:", err);
    return NextResponse.json({ error: "Falha no upload da mídia." }, { status: 500 });
  }
}
