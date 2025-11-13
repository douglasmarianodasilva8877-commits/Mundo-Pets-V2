/* 🧩 Funções Utilitárias Gerais
/* -------------------------------------------------------------------------- */

/**
 * Formata valores numéricos para formato de preço BRL (ex: R$ 12,90)
 */
export const formatPrice = (value: number | string): string => {
  const num = Number(value);
  return isNaN(num)
    ? "R$ 0,00"
    : num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

/**
 * Converte string para kebab-case (ex: "MeuTexto" → "meu-texto")
 */
export const toKebabCase = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

/**
 * Converte string para camelCase (ex: "meu-texto" → "meuTexto")
 */
export const toCamelCase = (str: string): string => {
  if (!str) return "";
  return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^(.)/, (c) => c.toLowerCase());
};

/**
 * Capitaliza a primeira letra de cada palavra
 */
export const capitalizeWords = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Gera um ID aleatório curto (ex: “8f32a”)
 */
export const generateId = (length = 5): string =>
  Math.random().toString(36).substring(2, 2 + length);

/**
 * Trunca texto longo e adiciona reticências
 */
export const truncateText = (text: string, maxLength = 50): string =>
  text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

/**
 * Retorna data formatada (DD/MM/YYYY)
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
};
