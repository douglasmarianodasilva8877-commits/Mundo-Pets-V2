// lib/db/prisma.ts
/**
 * PrismaClient singleton para evitar múltiplas instâncias no dev/HotReload.
 * Instale: npm i @prisma/client
 */

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma?: PrismaClient;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
