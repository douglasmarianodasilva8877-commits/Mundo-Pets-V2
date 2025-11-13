"use client";

import React from "react";
import Navbar from "@/components/Navbar";

const sugestoes = [
  {
    id: "1",
    nome: "Toby",
    avatar: "/pets/toby.jpg",
    descricao: "Adora correr no parque 🐶",
  },
  {
    id: "2",
    nome: "Luna",
    avatar: "/pets/luna.jpg",
    descricao: "Gatinha curiosa e carinhosa 🐱",
  },
  {
    id: "3",
    nome: "Spike",
    avatar: "/pets/spike.jpg",
    descricao: "Fã de petiscos e cochilos 😴",
  },
];

export default function SugestoesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[80px] pb-10 bg-gray-50 dark:bg-[#0b1622] min-h-screen flex justify-center">
        <div className="w-full max-w-3xl px-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            🐾 Amigos sugeridos
          </h1>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {sugestoes.map((pet) => (
              <div
                key={pet.id}
                className="bg-white dark:bg-[#132235] rounded-xl shadow-md p-4 text-center hover:shadow-lg transition"
              >
                <img
                  src={pet.avatar}
                  alt={pet.nome}
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {pet.nome}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{pet.descricao}</p>
                <button className="mt-3 px-4 py-1 rounded-full bg-teal-500 text-white text-sm hover:bg-teal-600 transition">
                  Seguir
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
