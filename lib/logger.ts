// lib/logger.ts
export const logger = {
  info: (...args: any[]) => console.info("[mundo-pets]", ...args),
  warn: (...args: any[]) => console.warn("[mundo-pets]", ...args),
  error: (...args: any[]) => console.error("[mundo-pets]", ...args),
};
