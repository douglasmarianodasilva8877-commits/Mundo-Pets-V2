"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * ThemeToggle: alterna entre 3 temas visuais.
 * Usa next-themes para manipular a classe no <html>.
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // ciclo simples: neon -> glass -> minimal -> neon...
  function cycle() {
    if (theme === "neon") setTheme("glass");
    else if (theme === "glass") setTheme("minimal");
    else setTheme("neon");
  }

  return (
    <button
      onClick={cycle}
      className="btn px-3 py-1 text-sm border rounded-full"
      aria-label="Alternar tema visual"
      title="Alternar tema (Neon / Glass / Minimal)"
    >
      {theme === "neon" && "✨ Neon Forte"}
      {theme === "glass" && "🪟 Glass"}
      {theme === "minimal" && "📱 Minimal"}
      {!["neon","glass","minimal"].includes(theme || "") && "✨ Tema"}
    </button>
  );
}
