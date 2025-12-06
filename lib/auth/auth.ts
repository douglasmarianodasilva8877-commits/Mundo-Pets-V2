// lib/auth.ts
import NextAuth from "next-auth"; // exemplo
import Providers from "next-auth/providers"; // ajuste conforme seu setup

export const auth = NextAuth({
  // sua configuração
});

// opcional: manter default export compatível
export default auth;
