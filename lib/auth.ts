// lib/auth.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

/**
 * Configurações NextAuth (compatível App Router / Next 14)
 */
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

  // Sessions usando DB (compatível com adapter Prisma)
  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // garante id/email/name e fallback de avatar
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.name = user.name;
        session.user.image = (user as any).avatarUrl || user.image || null;
      }
      return session;
    },
  },
};

/**
 * Instancia NextAuth para App Router:
 * - NextAuth(...) retorna um "handler-like" com handlers, auth, signIn, signOut
 * - Algumas builds/versões podem ter tipagem/shape diferente — cast para any
 *   evita problemas de leitura de propriedades no build dev.
 */
const nextAuthExport = (NextAuth(authOptions) as unknown) as any;

export const handlers = nextAuthExport.handlers ?? nextAuthExport;
export const auth = nextAuthExport.auth ?? (() => Promise.resolve(null));
export const signIn = nextAuthExport.signIn ?? (() => {});
export const signOut = nextAuthExport.signOut ?? (() => {});

// Exporta GET e POST no formato que o App Router espera
export const GET = handlers.GET;
export const POST = handlers.POST;
