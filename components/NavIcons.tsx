"use client";

import React, { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { MessageSquare, User } from "lucide-react";

export default function NavIcons() {
  const [tutor, setTutor] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const storedTutor = localStorage.getItem("tutor");
    const storedMessages = localStorage.getItem("mensagens");

    if (storedTutor) setTutor(JSON.parse(storedTutor));

    // 🔔 Contador de mensagens não lidas
    if (storedMessages) {
      try {
        const msgs = JSON.parse(storedMessages);
        const unread = msgs.filter((m: any) => !m.lida).length;
        setUnreadMessages(unread);
      } catch {
        console.warn("Mensagens inválidas no localStorage");
      }
    }

    // ⌨️ Atalho oculto: Ctrl + Shift + L → logout
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") {
        doHiddenLogout();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 🚪 Logout oculto (limpa dados locais)
  const doHiddenLogout = () => {
    const ok = confirm("Deseja realmente sair da conta?");
    if (!ok) return;
    localStorage.removeItem("tutor");
    localStorage.removeItem("pet");
    localStorage.removeItem("mensagens");
    window.location.href = "/login";
  };

  // 🖱️ Detectar shift+click no avatar
  const handleAvatarClick = (e: MouseEvent<HTMLImageElement | HTMLDivElement>) => {
    if (e.shiftKey) {
      e.preventDefault();
      doHiddenLogout();
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* 💬 Mensagens */}
      <Link
        href="/messages"
        className="relative flex items-center justify-center hover:text-teal-600 transition"
        aria-label="Mensagens"
      >
        <MessageSquare size={22} className="text-gray-700 dark:text-gray-300" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
            {unreadMessages}
          </span>
        )}
      </Link>

      {/* 👤 Perfil do tutor */}
      {tutor ? (
        <Link
          href="/profile"
          className="flex items-center justify-center hover:opacity-80 transition"
          aria-label="Perfil do tutor"
        >
          {tutor.avatarUrl ? (
            <img
              src={tutor.avatarUrl}
              alt={tutor.name}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700"
              onClick={handleAvatarClick}
            />
          ) : (
            <div
              onClick={handleAvatarClick}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-200 font-bold text-sm"
            >
              {tutor.name?.[0] || "?"}
            </div>
          )}
        </Link>
      ) : (
        <Link
          href="/login"
          className="flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-teal-600 transition"
          aria-label="Entrar"
        >
          <User size={22} />
        </Link>
      )}
    </div>
  );
}
