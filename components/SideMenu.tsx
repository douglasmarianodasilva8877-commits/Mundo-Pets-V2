"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  PawPrint,
  User,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";

export default function SideMenu() {
  const menuItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: PawPrint, label: "Feed", href: "/feed" },
    { icon: User, label: "Meu Perfil", href: "/perfil" },
    { icon: MessageCircle, label: "Mensagens", href: "/mensagens" },
    { icon: Settings, label: "Configurações", href: "/configuracoes" },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-[80px] w-60 h-[calc(100vh-80px)] bg-white/70 dark:bg-[#0d1a27]/80 backdrop-blur border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <nav className="flex flex-col gap-2">
        {menuItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100/70 dark:hover:bg-teal-900/40 transition"
          >
            <Icon className="w-5 h-5 text-teal-600" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
        <button className="flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 w-full px-3 py-2 rounded-lg transition">
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
