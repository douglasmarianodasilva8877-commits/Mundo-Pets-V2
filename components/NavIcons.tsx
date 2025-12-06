"use client";

import React from "react";
import Link from "next/link";

export default function NavIcons() {
  return (
    <div className="hidden md:flex items-center gap-6">
      <Link
        href="/mensagens"
        title="Mensagens"
        className="hover:text-teal-500 transition font-medium"
      >
        Mensagens
      </Link>

      <Link
        href="/perfil"
        title="Meu Perfil"
        className="hover:text-teal-500 transition font-medium"
      >
        Meu Perfil
      </Link>
    </div>
  );
}
