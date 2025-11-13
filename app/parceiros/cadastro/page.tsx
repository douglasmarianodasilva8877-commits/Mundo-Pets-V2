"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Parceiro {
  id: string;
  nome: string;
  logo: string;
  descricao: string;
  site: string;
}

export default function ParceirosPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);

  useEffect(() => {
    const loadParceiros = async () => {
      try {
        const res = await fetch("/api/parceiros", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data)) {
          setParceiros(data);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar parceiros:", err);
      }
    };

    loadParceiros();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6 bg-gray-50 dark:bg-[#0d1b2a] min-h-screen">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🤝 Parceiros Cadastrados
        </h1>
        <Link
          href="/parceiros/novo"
          className="bg-teal-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          + Novo Parceiro
        </Link>
      </header>

      {parceiros.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          Nenhum parceiro cadastrado ainda.
        </p>
      ) : (
        <div className="grid gap-4">
          {parceiros.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition"
            >
              <img
                src={p.logo || "/placeholder-pet.png"}
                alt={p.nome}
                onError={(e) =>
                  ((e.currentTarget.src = "/placeholder-pet.png"))
                }
                className="w-16 h-16 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
              />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {p.nome}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {p.descricao}
                </p>
                <a
                  href={p.site}
                  target="_blank"
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Visitar site →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
