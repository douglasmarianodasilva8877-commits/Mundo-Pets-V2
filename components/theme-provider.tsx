"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * 🌗 ThemeProvider
 * Responsável por gerenciar temas claros/escuros em toda a aplicação.
 * Compatível com Next.js 14+ e Tailwind Dark Mode.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
