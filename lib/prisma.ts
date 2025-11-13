// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Permite armazenar o PrismaClient globalmente durante o desenvolvimento
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * ✅ Configuração otimizada para:
 * - Ambientes de produção (Vercel, Neon)
 * - Evitar múltiplas conexões Prisma
 * - Conexão persistente com Pooler (Neon)
 */
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["error", "warn"], // reduz o ruído de logs
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Evita múltiplas instâncias durante o HMR (modo desenvolvimento)
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
