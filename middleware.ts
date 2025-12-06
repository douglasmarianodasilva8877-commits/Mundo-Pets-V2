// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

const PROTECTED_PREFIXES = [
  "/api/pets",
  "/api/upload",
  "/api/auth/me",
];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Rota não protegida → segue
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const authorization = req.headers.get("authorization") || "";
  const token = authorization.replace("Bearer ", "");

  if (!token) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      }
    );
  }

  const payload = verifyToken(token);
  if (!payload?.sub) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Invalid token" }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/pets/:path*", "/api/upload/:path*", "/api/auth/me"],
};
