"use client";

import React, { useEffect, useState } from "react";
import { Users, PawPrint } from "lucide-react";

export default function GruposPage() {
  const [grupos, setGrupos] = useState<any[]>([]);

  useEffect(() => {
    const mock = [
      { id: 1, nome: "Adoção Responsável 🐶", membros: 128 },
      { id: 2, nome: "Gatos Felizes 😺", membros: 94 },
    ];
    setGrupos(mock);
  }, []);

  return (
    <section className="max-w-2xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold text-teal-500 mb-6 text-center">
        👥 Grupos e Comunidades
      </h1>

      {grupos.map((g) => (
        <div
          key={g.id}
          className="bg-white/90 dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm mb-4 flex justify-between items-center"
        >
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <PawPrint className="text-teal-500 w-5 h-5" /> {g.nome}
            </h2>
            <p className="text-sm text-gray-500">{g.membros} membros</p>
          </div>
          <button className="px-3 py-1 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition">
            Entrar
          </button>
        </div>
      ))}
    </section>
  );
}
