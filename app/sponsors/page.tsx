"use client";

import React, { useState } from "react";
import { BadgeCheck } from "lucide-react";

export default function SponsorsPage() {
  const [ads] = useState([
    {
      id: "1",
      brand: "Ração Premier 🦴",
      image: "/anuncio/ração-premier.png",
      content: "Nutrição completa e sabor irresistível para o seu pet!",
      price: "R$ 89,90",
      link: "#",
    },
    {
      id: "2",
      brand: "ORGANO DOG VITAMINAS 🐾",
      image: "/anuncio/vitaminas1.png",
      content: "Suplementos naturais para energia e saúde do seu cão.",
      price: "R$ 79,00",
      link: "#",
    },
    {
      id: "3",
      brand: "Pet Shop Niwa 🐕",
      image: "/anuncio/niwa.png",
      content: "Banho e tosa com produtos premium a partir de R$ 59,90.",
      price: "A partir de R$ 59,90",
      link: "#",
    },
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 🔹 Título */}
      <h1 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <BadgeCheck className="text-teal-500" size={22} />
        Anúncios Patrocinados
      </h1>

      {/* 🔹 Cards de anúncios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white dark:bg-[#0a0f1a] rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 transition hover:shadow-md flex flex-col"
          >
            {/* Imagem */}
            <div className="relative">
              <img
                src={ad.image}
                alt={ad.brand}
                className="w-full h-24 object-cover"
              />
              <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
                Patrocinado
              </span>
            </div>

            {/* Conteúdo */}
            <div className="p-3 flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {ad.brand}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 mb-2">
                  {ad.content}
                </p>
                <p className="text-teal-600 dark:text-teal-400 font-semibold text-sm">
                  {ad.price}
                </p>
              </div>

              <a
                href={ad.link}
                target="_blank"
                className="mt-3 inline-block bg-teal-500 hover:bg-teal-600 text-white text-xs px-3 py-1.5 rounded-full font-medium transition self-start"
              >
                Saiba mais
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
