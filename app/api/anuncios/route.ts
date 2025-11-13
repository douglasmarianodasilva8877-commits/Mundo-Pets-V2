import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "mock", "anuncios.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao carregar anúncios:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os anúncios." },
      { status: 500 }
    );
  }
}
