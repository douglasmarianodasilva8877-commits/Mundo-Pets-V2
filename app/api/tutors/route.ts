// app/api/tutors/route.ts
import { NextResponse } from "next/server";

let tutors: any[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  // Permite buscar tutor por e-mail
  if (email) {
    const found = tutors.find((t) => t.email === email);
    return NextResponse.json(found ? [found] : []);
  }

  // Retorna todos os tutores
  return NextResponse.json(tutors);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTutor = { id: Date.now().toString(), ...body };
  tutors.push(newTutor);
  return NextResponse.json({ success: true, data: newTutor });
}
