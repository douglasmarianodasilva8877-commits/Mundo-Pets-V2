import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔓 Acesso liberado a rotas públicas
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/avatars") ||
    pathname.startsWith("/anuncio") ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🚫 Se não estiver logado → login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🔍 Verifica se o tutor já tem pet cadastrado
  const userId = token.id;
  if (!userId) return NextResponse.next();

  const pet = await prisma.pet.findFirst({
  where: { ownerId: userId },
  });

  // 🐾 Se não tem pet e tenta acessar feed → redireciona para criar pet
  if (!pet && pathname.startsWith("/feed")) {
    const redirectUrl = new URL("/pet/create", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 🏡 Se tem pet e tenta acessar login → vai pro feed
  if (pet && pathname.startsWith("/login")) {
    const redirectUrl = new URL("/feed", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon|logo|avatars|anuncio|public).*)"],
};
