// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let user: (User & { pets: any[] }) | null =
          await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { pets: true },
          });

        // 🆕 Criar usuário automaticamente
        if (!user) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);

          user = (await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: "Novo Tutor",
              role: "USER",
              pets: {
                create: {
                  name: "Meu Pet",
                  slug: `pet-${Date.now()}`,
                  species: "Desconhecido",
                  ownerEmail: credentials.email,
                },
              },
            },
            include: { pets: true },
          })) as User & { pets: any[] };

          console.log("✅ Novo usuário criado:", user.email);
        } else {
          // 🔒 Validação de senha
          if (!user.password) return null;

          const valid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!valid) return null;
        }

        // 🎯 Retorna apenas dados seguros
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token?.id) session.user.id = String(token.id);
      return session;
    },
  },
});

export { handler as GET, handler as POST };
