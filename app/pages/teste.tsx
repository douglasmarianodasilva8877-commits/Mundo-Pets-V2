"use client";

import React from "react";
import { PawPrint } from "lucide-react";

export default function Teste() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>🔍 Teste do ícone PawPrint</h1>
      <PawPrint className="w-16 h-16 text-teal-500 mx-auto my-4" />
      <p>
        Se você está vendo o ícone acima, o pacote <code>lucide-react</code> está
        funcionando ✅
      </p>
    </div>
  );
}
