// lib/utils.ts

/**
 * Junta classes condicionalmente — usado com Tailwind.
 * Exemplo: cn("p-4", isActive && "bg-primary")
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Garante que uma variável de ambiente exista.
 * Exemplo: assertEnv("DATABASE_URL")
 */
export function assertEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable "${name}" is missing`);
  }
  return value;
}

/**
 * Safe JSON.parse — evita crash ao parsear dados.
 */
export function safeParse<T = any>(
  value: string | null | undefined,
  fallback: T | null = null
): T | null {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Gera um ISO timestamp formatado.
 */
export function iso(date?: string | Date): string {
  const d = date ? new Date(date) : new Date();
  return d.toISOString();
}
