"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Users,
  Image,
  Bookmark,
  Heart,
  Bell,
  Settings,
  PawPrint,
} from "lucide-react";

const menuItems = [
  { href: "/perfil", label: "Perfil", icon: User },
  { href: "/amigos", label: "Amigos", icon: Users },
  { href: "/fotos", label: "Fotos", icon: Image },
  { href: "/salvos", label: "Salvos", icon: Bookmark },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/grupos", label: "Grupos", icon: PawPrint },
  { href: "/notificacoes", label: "Notificações", icon: Bell },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 p-4 bg-white/90 dark:bg-[#0d1a27] border-r border-gray-200 dark:border-gray-700 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="space-y-2">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-lg transition font-medium ${
                active
                  ? "bg-teal-500 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
