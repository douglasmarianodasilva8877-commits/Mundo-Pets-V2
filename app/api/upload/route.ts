import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";

/**
 * 🔹 Endpoint para upload de imagem local.
 * As imagens serão salvas em /public/uploads
 * e a URL pública será retornada.
 */
export async function POST(req: Request) {
  try {
    // Recebe o formData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    // Cria nome único para o arquivo
    const fileExt = path.extname(file.name) || ".jpg";
    const fileName = `${randomUUID()}${fileExt}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    // Converte o arquivo para buffer e grava
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Cria a URL pública
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/uploads/${fileName}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Falha no upload da imagem." }, { status: 500 });
  }
}
