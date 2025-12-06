// app/api/pets/create/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { createPet } from "@/lib/db/queries/pets";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "missing token" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.sub) return NextResponse.json({ success: false, message: "invalid token" }, { status: 401 });

    const tutorId = payload.sub;
    const body = await req.json();
    const { name, species, breed, age, avatarUrl, bio } = body;

    if (!name || !species) return NextResponse.json({ success: false, message: "name and species required" }, { status: 400 });

    const pet = await createPet({
      id: uuidv4(),
      name,
      species,
      breed,
      age,
      avatarUrl,
      bio,
      tutorId,
    });

    return NextResponse.json({ success: true, pet }, { status: 201 });
  } catch (err: any) {
    console.error("❌ /api/pets/create:", err);
    return NextResponse.json({ success: false, message: "internal" }, { status: 500 });
  }
}
