"use client";
import React from "react";
import { PawPrint, Heart } from "lucide-react";

interface PetProfileCardProps {
  pet: {
    nome: string;
    avatar: string;
    especie?: string;
    raca?: string;
    idade?: string;
    personalidade?: string;
    tutorNome?: string;
  };
}

export default function PetProfileCard({ pet }: PetProfileCardProps) {
  return (
    <div className="bg-white dark:bg-[#0e1b2a] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center transition hover:shadow-md">
      {/* 🐾 Avatar do pet */}
      <img
        src={pet.avatar || "/placeholder-pet.png"}
        alt={pet.nome}
        className="w-24 h-24 rounded-full object-cover border-2 border-teal-500 shadow-sm mb-3"
      />

      {/* Nome + ícone */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        {pet.nome} <PawPrint className="text-teal-500" size={18} />
      </h2>

      {/* Espécie e idade */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {pet.raca ? `${pet.raca}` : pet.especie || "Espécie não informada"}
        {pet.idade ? ` • ${pet.idade}` : ""}
      </p>

      {/* Personalidade */}
      {pet.personalidade && (
        <div className="mt-3 px-3 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-full text-xs flex items-center gap-1">
          <Heart size={12} /> {pet.personalidade}
        </div>
      )}

      {/* Tutor verificado */}
      {pet.tutorNome && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 italic">
          🧍 Verificado por <span className="font-semibold">{pet.tutorNome}</span>
        </p>
      )}
    </div>
  );
}
