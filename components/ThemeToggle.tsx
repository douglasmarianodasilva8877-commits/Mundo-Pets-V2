"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // ciclo: neon -> glass -> minimal -> neon
  function cycle() {
    if (theme === "neon") setTheme("glass");
    else if (theme === "glass") setTheme("minimal");
    else setTheme("neon");
  }

  return (
    <button
      onClick={cycle}
      className="px-3 py-1 border rounded-full text-xs bg-white/10 backdrop-blur hover:bg-white/20 transition"
      aria-label="Alternar tema visual"
    >
      {theme === "neon" && "✨ Neon Forte"}
      {theme === "glass" && "🪟 Glass"}
      {theme === "minimal" && "📱 Minimal"}
      {!["neon", "glass", "minimal"].includes(theme || "") && "✨ Tema"}
    </button>
  );
}
