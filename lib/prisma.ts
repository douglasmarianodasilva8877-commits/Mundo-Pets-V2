// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  // Permite que o objeto global armazene o cliente Prisma sem recriação
  // em ambientes de desenvolvimento (hot reload)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Cria ou reutiliza uma instância existente
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

// Evita múltiplas instâncias durante o desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
