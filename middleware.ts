// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/perfil/:path*", 
    "/configuracoes/:path*",
    "/admin/:path*"
  ], // protege apenas áreas restritas
};
