"use client";
import Image from "next/image";
import React from "react";

export default function LeftSidebar() {
  return (
    <aside className="hidden md:block md:col-span-3 h-[calc(100vh-64px)] sticky top-[64px] overflow-auto py-4 px-3 hide-scrollbar">
      <div className="mp-card p-3 mb-4">
        <div className="flex items-center gap-3">
          <Image src="/avatar-sample.jpg" alt="me" width={52} height={52} className="rounded-full" />
          <div>
            <div className="font-semibold">@seuusuario</div>
            <div className="text-xs text-[color:var(--muted)]">Veja seu perfil</div>
          </div>
        </div>
      </div>

      <nav className="mp-card p-3 left-nav">
        <a href="#"><span className="text-[color:var(--brand-cyan)]">🏠</span> Início</a>
        <a href="#"><span className="text-[color:var(--brand-orange)]">🐶</span> Meus Pets</a>
        <a href="#"><span>👥</span> Amigos</a>
        <a href="#"><span>🎥</span> Vídeos</a>
        <a href="#"><span>🛒</span> Marketplace</a>
        <a href="#"><span>⚙️</span> Configurações</a>
      </nav>

      <div className="mt-4 mp-card p-3">
        <h4 className="font-semibold mb-2">Atalhos</h4>
        <ul className="text-sm text-[color:var(--muted)] space-y-1">
          <li><a href="#">Criar Álbum</a></li>
          <li><a href="#">Eventos</a></li>
          <li><a href="#">Favoritos</a></li>
        </ul>
      </div>

      <div className="mt-4 text-xs text-[color:var(--muted)]">
        <div className="mb-2">© {new Date().getFullYear()} Mundo Pets</div>
        <div className="flex gap-2"><a href="#">Ajuda</a> <a href="#">Privacidade</a> <a href="#">Contato</a></div>
      </div>
    </aside>
  );
}
