// lib/auth.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

// ======================================================
// 🔐 CONFIGURAÇÃO COMPLETA DO NEXTAUTH
// ======================================================

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    EmailProvider({
      server: process.env.EMAIL_SERVER || "",
      from: process.env.EMAIL_FROM || "",
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  // ======================================================
  // 🧭 SESSÕES
  // ======================================================
  session: {
    strategy: "database" as const, // ✅ mantém compatibilidade
  },

  pages: {
    signIn: "/login",
  },

  // ======================================================
  // 🧩 CALLBACKS — garante que ID, EMAIL e AVATAR estejam na sessão
  // ======================================================
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.name = user.name;

        // 👇 Corrigido para evitar erro TS:
        // Verifica avatarUrl se existir no objeto user (sem quebrar o tipo)
        const avatar =
          (user as any).avatarUrl || user.image || null;

        session.user.image = avatar;
      }

      return session;
    },
  },
};

// ======================================================
// 🚀 HANDLERS PADRÕES PARA O APP ROUTER (GET/POST)
// ======================================================
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
