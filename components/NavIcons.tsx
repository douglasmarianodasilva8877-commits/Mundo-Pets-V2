"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, User } from "lucide-react";

export default function NavIcons() {
  return (
    <div className="hidden md:flex items-center gap-6">
      <Link href="/mensagens" title="Mensagens" className="hover:text-teal-500 transition">
        <MessageCircle className="w-6 h-6" />
      </Link>

      <Link href="/perfil" title="Meu Perfil" className="hover:text-teal-500 transition">
        <User className="w-6 h-6" />
      </Link>
    </div>
  );
}
