"use client";

import React from "react";

interface AmigoCardProps {
  amigo: {
    id: number;
    nome: string;
    imagem: string;
    cidade: string;
  };
}

export default function AmigoCard({ amigo }: AmigoCardProps) {
  return (
    <div className="bg-white/90 dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-center gap-4">
      <img
        src={amigo.imagem}
        alt={amigo.nome}
        className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-700"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{amigo.nome}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{amigo.cidade}</p>
        <button className="mt-2 px-3 py-1 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-full transition">
          Adicionar
        </button>
      </div>
    </div>
  );
}
