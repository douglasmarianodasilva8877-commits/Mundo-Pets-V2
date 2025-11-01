"use client";

import React from "react";
import Link from "next/link";
import { Home, Search, PlusCircle, Megaphone, Bell, User } from "lucide-react";

export default function MobileBottomBar() {
  return (
    <nav
      className="mobile-bottom md:hidden"
      aria-label="Barra de navegação inferior (mobile)"
    >
      <Link href="/" className="mobile-icon" title="Início">
        <Home size={22} />
        <span>Início</span>
      </Link>

      <Link href="/explore" className="mobile-icon" title="Buscar">
        <Search size={22} />
        <span>Buscar</span>
      </Link>

      <Link href="/postar" className="mobile-icon" title="Novo post">
        <PlusCircle size={26} className="text-[var(--brand)]" />
        <span>Novo</span>
      </Link>

      <Link href="/sponsors" className="mobile-icon" title="Anúncios">
        <Megaphone size={22} />
        <span>Anúncios</span>
      </Link>

      <Link href="/notifications" className="mobile-icon relative" title="Notificações">
        <Bell size={22} />
        <span>Notifs</span>
        {/* 🔔 Badge de notificação */}
        <span className="absolute -top-1 -right-1 bg-[var(--brand)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
          2
        </span>
      </Link>

      <Link href="/profile" className="mobile-icon" title="Perfil">
        <User size={22} />
        <span>Perfil</span>
      </Link>
    </nav>
  );
}
