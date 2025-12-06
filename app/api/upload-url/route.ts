// app/api/upload-url/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { ext, type } = await req.json();

    if (!ext || !type) {
      return NextResponse.json(
        { error: "Extensão (ext) e tipo MIME (type) são obrigatórios." },
        { status: 400 }
      );
    }

    // Lista de tipos permitidos (mais seguro)
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];

    if (!allowedMimeTypes.includes(type)) {
      return NextResponse.json(
        { error: "Tipo MIME não suportado." },
        { status: 400 }
      );
    }

    // Cliente Supabase (service role necessário para signed URLs)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const bucket = "posts";

    // Nome único para o arquivo
    const fileName = `post_${crypto.randomUUID()}.${ext}`;

    // 1) Criar Signed Upload URL
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(fileName);

    if (error || !data) {
      console.error("Erro ao criar signed URL:", error);
      return NextResponse.json(
        { error: "Falha ao gerar Signed URL." },
        { status: 500 }
      );
    }

    // 2) Gerar URL pública (final)
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(fileName).data
      .publicUrl;

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      path: data.path,
      publicUrl,
    });
  } catch (err) {
    console.error("Erro interno:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
