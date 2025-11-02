"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, MessageCircle, PawPrint } from "lucide-react";

export default function AmigosPage() {
  const [amigos, setAmigos] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("mundo-pets-amigos");
    if (saved) setAmigos(JSON.parse(saved));
    else {
      // Exemplo inicial
      const mock = [
        { id: 1, name: "Luna 🐶", tutor: "Maria", cidade: "São Paulo" },
        { id: 2, name: "Thor 🐕", tutor: "Carlos", cidade: "Rio de Janeiro" },
      ];
      setAmigos(mock);
      localStorage.setItem("mundo-pets-amigos", JSON.stringify(mock));
    }
  }, []);

  return (
    <section className="max-w-2xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold text-teal-500 mb-5 text-center">
        🐾 Amigos do Mundo Pets
      </h1>

      {amigos.length === 0 ? (
        <p className="text-center text-gray-400">Nenhum amigo ainda 😿</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {amigos.map((a) => (
            <div
              key={a.id}
              className="bg-white/90 dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-teal-500" /> {a.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Tutor: {a.tutor}</p>
              <p className="text-sm text-gray-500">Cidade: {a.cidade}</p>

              <div className="flex gap-3 mt-3">
                <button className="px-3 py-1 bg-teal-500 text-white rounded-full flex items-center gap-1 hover:bg-teal-600 transition">
                  <MessageCircle size={14} /> Mensagem
                </button>
                <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                  <UserPlus size={14} /> Seguir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
