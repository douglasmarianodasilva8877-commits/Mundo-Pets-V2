import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { pet: true },
    });
    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    console.error("❌ Erro ao buscar posts:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ success: false, message: "Não autenticado." }, { status: 401 });

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const file = formData.get("photo") as File | null;

    const pet = await prisma.pet.findFirst({
      where: { ownerEmail: session.user.email },
    });

    if (!pet)
      return NextResponse.json({ success: false, message: "Pet não encontrado." }, { status: 404 });

    let photoUrl = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      photoUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const post = await prisma.post.create({
      data: { content, photoUrl, petId: pet.id },
      include: { pet: true },
    });

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    console.error("❌ Erro ao criar post:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
