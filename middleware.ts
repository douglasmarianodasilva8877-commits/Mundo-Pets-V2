// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ Libera acesso total a rotas e arquivos públicos
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/avatars") ||
    pathname.startsWith("/anuncio") ||
    pathname.startsWith("/pet") || // 🔓 Perfil público
    pathname.startsWith("/feed") || // 🔓 Feed público
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  // 🚫 Bloqueia acesso a rotas privadas se não houver token
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Usuário autenticado segue normalmente
  return NextResponse.next();
}

// ✅ Protege apenas áreas privadas
export const config = {
  matcher: [
    "/profile/:path*",
    "/messages/:path*",
    "/onboarding/:path*",
    "/sobre/:path*",
    "/configuracoes/:path*",
  ],
};
