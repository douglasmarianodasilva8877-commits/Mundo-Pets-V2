"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  MessageCircle,
  User,
  Search,
  Home,
  Info,
  PawPrint,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 dark:bg-[#0d1a27]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        
        {/* 🔹 LOGO — Imponente e com destaque */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0"
          title="Início"
        >
          <img
            src="/logo-mundo-pets.png"
            alt="Mundo Pets"
            className="w-12 h-12 object-contain transition-transform group-hover:scale-110"
          />
        </Link>

        {/* 🔹 Barra de busca central */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-[#1a2b3d] rounded-full px-4 py-2 w-[400px] shadow-sm border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-teal-500 transition-all duration-300">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar pets, tutores..."
            className="bg-transparent outline-none px-2 text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>

        {/* 🔹 Ícones de navegação e ações agrupados à direita */}
        <nav className="flex items-center gap-6 text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-teal-500 transition" title="Início">
            <Home className="w-6 h-6" />
          </Link>

          <Link href="/onboarding" className="hover:text-teal-500 transition" title="Meu Pet">
            <PawPrint className="w-6 h-6" />
          </Link>

          <Link href="/feed" className="hover:text-teal-500 transition" title="Feed">
            <MessageCircle className="w-6 h-6" />
          </Link>

          <Link href="/sobre" className="hover:text-teal-500 transition" title="Sobre">
            <Info className="w-6 h-6" />
          </Link>

          <Link href="/perfil" className="hover:text-teal-500 transition" title="Perfil">
            <User className="w-6 h-6" />
          </Link>

          <button
            className="hover:text-teal-500 transition"
            title="Notificações"
          >
            <Bell className="w-6 h-6" />
          </button>

          {/* Menu Mobile (opcional) */}
          <button
            className="md:hidden hover:text-teal-500 transition"
            title="Menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </nav>
      </div>
    </header>
  );
}
