import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * 🔹 GET — Retorna lista de posts (com pet, tutor e contagem de comentários)
 */
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        pet: true,
        author: true,
        _count: { select: { comments: true } }, // ✅ conta os comentários
      },
    });

    const formatted = posts.map((p) => ({
      id: p.id,
      petName: p.pet?.name || "Pet Anônimo 🐾",
      petAvatar: p.pet?.avatarUrl || "/placeholder-pet.png",
      content: p.content,
      image: p.imageUrl || null,
      createdAt: new Date(p.createdAt).toLocaleString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      }),
      likes: p.likes ?? 0,
      comments: p._count.comments ?? 0, // ✅ corrigido
      tutorName: p.author?.name || null,
      tutorAvatar: p.author?.avatarUrl || null,
    }));

    return NextResponse.json({ success: true, posts: formatted });
  } catch (err: any) {
    console.error("❌ Erro ao buscar posts:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

/**
 * 🔹 POST — Cria novo post (com suporte a imagem base64)
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Não autenticado." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user)
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado." },
        { status: 404 }
      );

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const file = formData.get("photo") as File | null;

    // 🐾 Localiza o pet do tutor logado
    const pet = await prisma.pet.findFirst({
      where: { ownerEmail: session.user.email },
    });

    if (!pet)
      return NextResponse.json(
        { success: false, message: "Pet não encontrado." },
        { status: 404 }
      );

    // 🔹 Converte imagem para base64
    let imageUrl: string | null = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    // ✅ Cria o post
    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        petId: pet.id,
        authorId: user.id,
      },
      include: {
        pet: true,
        author: true,
        _count: { select: { comments: true } },
      },
    });

    // 🔹 Retorna no formato padronizado
    const formatted = {
      id: post.id,
      petName: post.pet?.name || "Pet Anônimo 🐾",
      petAvatar: post.pet?.avatarUrl || "/placeholder-pet.png",
      content: post.content,
      image: post.imageUrl,
      createdAt: new Date(post.createdAt).toLocaleString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      }),
      likes: post.likes ?? 0,
      comments: post._count.comments ?? 0,
      tutorName: post.author?.name || null,
      tutorAvatar: post.author?.avatarUrl || null,
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (err: any) {
    console.error("❌ Erro ao criar post:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
