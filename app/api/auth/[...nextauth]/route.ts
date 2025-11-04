import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

        // 🔍 Busca o usuário
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { pet: true },
        });

        // 🆕 Se não existir, cria automaticamente o usuário e o pet
        if (!user) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);

          user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: "Novo Tutor",
              role: "USER",
              pet: {
                create: {
                  name: "Meu Pet",
                  slug: `pet-${Date.now()}`,
                  species: "Desconhecido",
                },
              },
            },
            include: { pet: true },
          });

          console.log("✅ Novo usuário criado:", user.email);
        } else {
          // 🔒 Se existir, valida a senha
          if (!user.password) return null;
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;
        }

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
      if (token?.id) {
        // garante que seja string para evitar erro de tipo
        session.user.id = String(token.id);
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
