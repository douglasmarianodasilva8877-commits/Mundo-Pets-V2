import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/feed/:path*", // protege o feed
    "/perfil/:path*", // protege perfil de usuário
    "/pets/:path*", // protege área de pets
  ],
};
