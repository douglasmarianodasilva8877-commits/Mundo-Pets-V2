// app/api/uploadthing/route.ts — DEV fallback: salva arquivo localmente em public/uploads
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

async function ensureUploadsDir() {
  const d = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  return d;
}

export async function POST(req: Request) {
  try {
    // Lê formData
    const form = await req.formData();
    const file = form.get("file") as unknown as File | undefined;

    if (!file) {
      return NextResponse.json({ ok: false, error: "Campo 'file' não encontrado" }, { status: 400 });
    }

    // Lê o conteúdo do arquivo
    const arrayBuffer = await (file as any).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Gera nome e salva em public/uploads
    const uploadsDir = await ensureUploadsDir();
    const safeName = (file as any).name ? String((file as any).name).replace(/[^a-zA-Z0-9.\-_]/g, "_") : "upload.bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${safeName}`;
    const dest = path.join(uploadsDir, fileName);
    fs.writeFileSync(dest, buffer);

    const publicUrl = `/uploads/${fileName}`;

    // Retorna metadados (dev)
    return NextResponse.json({
      ok: true,
      message: "Arquivo salvo localmente (dev fallback)",
      url: publicUrl,
      name: (file as any).name,
      size: buffer.length,
      type: (file as any).type || null,
    });
  } catch (err: any) {
    console.error("Fallback upload error:", err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
