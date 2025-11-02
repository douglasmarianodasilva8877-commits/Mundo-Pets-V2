"use client";

import React, { useEffect, useState } from "react";
import { Bell, Heart, MessageCircle, PawPrint } from "lucide-react";

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<any[]>([]);

  useEffect(() => {
    const mock = [
      { id: 1, tipo: "curtida", usuario: "Maria", pet: "Luna 🐶" },
      { id: 2, tipo: "comentario", usuario: "Carlos", pet: "Thor 🐕" },
      { id: 3, tipo: "seguindo", usuario: "Ana", pet: "Mimi 🐱" },
    ];
    setNotificacoes(mock);
  }, []);

  const renderIcon = (tipo: string) => {
    switch (tipo) {
      case "curtida":
        return <Heart className="text-pink-500" />;
      case "comentario":
        return <MessageCircle className="text-blue-500" />;
      case "seguindo":
        return <PawPrint className="text-teal-500" />;
      default:
        return <Bell className="text-gray-400" />;
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold text-teal-500 mb-5 text-center flex items-center justify-center gap-2">
        <Bell className="text-teal-500" /> Notificações
      </h1>

      {notificacoes.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {notificacoes.map((n) => (
            <li
              key={n.id}
              className="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 dark:hover:bg-[#1a2b3d] rounded-lg transition"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                {renderIcon(n.tipo)}
              </div>
              <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">
                <strong>{n.usuario}</strong>{" "}
                {n.tipo === "curtida"
                  ? "curtiu"
                  : n.tipo === "comentario"
                  ? "comentou em"
                  : "começou a seguir"}{" "}
                o pet <strong>{n.pet}</strong>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          Nenhuma notificação no momento 🔕
        </p>
      )}
    </section>
  );
}
