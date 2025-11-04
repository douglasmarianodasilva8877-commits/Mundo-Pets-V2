"use client";

import React from "react";
import { Users, ShoppingBag } from "lucide-react";

export default function SidebarRight() {
  const amigos = [
    { nome: "Clara Souza", avatar: "/avatars/avatars-cat1.png" },
    { nome: "Rafael Lima", avatar: "/avatars/avatars-dog2.png" },
    { nome: "Marina Alves", avatar: "/avatars/avatars-bird1.png" },
  ];

  const ads = [
    {
      title: "Ração Premier 🦴",
      image: "/anuncio/ração-premier.png",
      price: "R$ 89,90",
      link: "#",
    },
    {
      title: "ORGANO DOG VITAMINAS 🐾",
      image: "/anuncio/organo-dog-vitaminas.png",
      price: "R$ 79,00",
      link: "#",
    },
    {
      title: "Pet Shop Niwa 🐕",
      image: "/anuncio/niwa.png",
      price: "a partir de R$ 59,90",
      link: "#",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 shrink-0 border-l border-gray-200 dark:border-gray-800 p-5 sticky top-16 h-[calc(100vh-4rem)] bg-transparent">
      <div className="overflow-y-auto pr-2 sidebar-scroll">
        {/* 💰 Anúncios patrocinados */}
        <section className="mb-8">
          <header className="flex items-center gap-2 mb-3">
            <ShoppingBag className="text-teal-600 dark:text-teal-400 w-5 h-5" />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300 uppercase tracking-wide">
              Anúncios Patrocinados
            </h3>
          </header>

          <ul className="space-y-4">
            {ads.map((ad) => (
              <li
                key={ad.title}
                className="bg-gray-50 dark:bg-[#0b1a27] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <a href={ad.link} className="block">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-3">
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {ad.title}
                    </div>
                    <div className="text-sm text-teal-600 dark:text-teal-400 font-semibold mt-1">
                      {ad.price}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 🐾 Amigos sugeridos */}
        <section>
          <header className="flex items-center gap-2 mb-3">
            <Users className="text-teal-600 dark:text-teal-400 w-5 h-5" />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300 uppercase tracking-wide">
              Amigos Sugeridos
            </h3>
          </header>

          <ul className="space-y-2">
            {amigos.map((a) => (
              <li
                key={a.nome}
                className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-[#0b1a27] border border-gray-200 dark:border-gray-700 p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-[#0d1e2c] transition"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={a.avatar}
                    alt={a.nome}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {a.nome}
                  </span>
                </div>
                <button className="text-xs bg-teal-500 hover:bg-teal-600 text-white px-2 py-1 rounded-full">
                  Seguir
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
