// app/api/pets/route.ts
import { NextResponse } from "next/server";

let pets: any[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId");

  if (ownerId) {
    const filtered = pets.filter((p) => p.ownerId === ownerId);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(pets);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newPet = { id: Date.now().toString(), ...body };
  pets.push(newPet);
  return NextResponse.json({ success: true, data: newPet });
}
