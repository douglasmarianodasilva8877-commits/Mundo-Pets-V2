import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "mock", "parceiros.json");

export async function GET() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const parceiros = JSON.parse(data);
    return NextResponse.json(parceiros);
  } catch (error) {
    console.error("Erro ao carregar parceiros:", error);
    return NextResponse.json({ error: "Erro ao carregar parceiros." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const novoParceiro = await request.json();
    const data = fs.readFileSync(filePath, "utf-8");
    const parceiros = JSON.parse(data);

    novoParceiro.id = Date.now().toString();
    parceiros.push(novoParceiro);

    fs.writeFileSync(filePath, JSON.stringify(parceiros, null, 2));

    return NextResponse.json({ message: "Parceiro adicionado com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar parceiro:", error);
    return NextResponse.json({ error: "Erro ao salvar parceiro." }, { status: 500 });
  }
}
