// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * 🔧 Interface User — reflete o modelo User do Prisma
   * Inclui campos opcionais adicionais usados no seu projeto (avatarUrl, role etc.)
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    avatarUrl?: string | null; // usado em lib/auth.ts
    role?: string | null;
  }

  /**
   * 🧭 Interface Session — o que chega ao front-end
   * Mantém apenas os campos realmente usados na aplicação.
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * 🔑 Interface JWT — usada quando você trabalha com callbacks JWT.
   */
  interface JWT {
    id?: string;
    avatarUrl?: string | null;
  }
}

export {};
