"use client";
import Image from "next/image";
import React from "react";

export default function TopBar() {
  return (
    <div className="w-full border-b border-white/6 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 rounded-md bg-white/4">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>

          <div className="flex items-center gap-3">
            <Image src="/logo-mundo-pets.png" alt="Mundo Pets" width={42} height={42} />
            <h1 className="text-xl md:text-2xl font-bold text-[color:var(--brand-cyan)] tracking-tight">Mundo <span className="text-[color:var(--brand-orange)]">Pets</span></h1>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <input
            className="w-full rounded-full px-4 py-2 bg-white/6 border border-white/4 placeholder:text-white/60 text-white text-sm"
            placeholder="Pesquisar no Mundo Pets"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-sm">Início</button>
          <button className="hidden md:inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-sm">Notificações</button>
          <div className="p-1 rounded-full bg-white/6">
            <Image src="/avatar-sample.jpg" alt="avatar" width={36} height={36} className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
