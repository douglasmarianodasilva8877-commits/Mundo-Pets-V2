"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

/**
 * BottomNavigation.tsx
 * - Navegação inferior para mobile
 * - flutuante, centralizada, sem interferir em layout desktop
 */

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/postar", label: "Postar", icon: PlusCircle },
  { href: "/notificacoes", label: "Notifs", icon: Bell },
  { href: "/perfil", label: "Perfil", icon: User },
];

export default function BottomNavigation() {
  const pathname = usePathname() || "/";
  return (
    <nav
      role="navigation"
      aria-label="Navegação inferior"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-white/90 dark:bg-[#071017]/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg rounded-3xl z-[60] p-2 lg:hidden"
    >
      <div className="flex items-center justify-between">
        {items.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 ${
                active ? "text-teal-600" : "text-gray-600 dark:text-gray-300"
              }`}
              aria-label={it.label}
            >
              <motion.div whileTap={{ scale: 0.92 }}>
                <Icon className="w-6 h-6" />
              </motion.div>
              <span className="text-[11px] font-medium">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
