// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ Libera acesso a rotas e arquivos públicos
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/avatars") ||
    pathname.startsWith("/anuncio") ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  // 🚫 Bloqueia acesso se não houver token (usuário não autenticado)
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // volta à página após login
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Usuário autenticado segue normalmente
  return NextResponse.next();
}

// ✅ Protege apenas rotas privadas, sem regex complexa
export const config = {
  matcher: [
    "/feed/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/onboarding/:path*",
    "/sobre/:path*",
  ],
};
