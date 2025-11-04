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

        // 🔍 Verifica se o usuário já existe
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { pet: true },
        });

        // 🆕 Se não existir, cria novo tutor + pet
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
                  name: "Pet do Tutor",
                  slug: `pet-${Date.now()}`,
                  species: "Cachorro",
                  description: "Novo pet criado automaticamente",
                },
              },
            },
            include: { pet: true },
          });
        } else {
          // 🔒 Verifica senha
          if (!user.password) return null;
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          // 🐾 Se o usuário existe mas ainda não tem pet → cria agora
          if (!user.pet) {
            await prisma.pet.create({
              data: {
                name: "Pet do Tutor",
                slug: `pet-${Date.now()}`,
                species: "Cachorro",
                ownerId: user.id,
              },
            });
          }
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
      if (token?.id) session.user.id = token.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
