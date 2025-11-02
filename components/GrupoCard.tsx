"use client";

import React from "react";

interface GrupoCardProps {
  grupo: {
    id: number;
    nome: string;
    imagem: string;
    membros: number;
  };
}

export default function GrupoCard({ grupo }: GrupoCardProps) {
  return (
    <div className="bg-white/90 dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
      <img
        src={grupo.imagem}
        alt={grupo.nome}
        className="w-full h-40 rounded-xl object-cover border border-gray-300 dark:border-gray-700 mb-3"
      />
      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{grupo.nome}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {grupo.membros} membros
      </p>
      <button className="px-4 py-1 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-full transition">
        Entrar
      </button>
    </div>
  );
}
