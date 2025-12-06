// components/SidebarLeft.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  PawPrint,
  User,
  MessageCircle,
  Settings,
  LogOut,
  Calendar,
  Info,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

/**
 * SidebarLeft — Versão Moderno Premium (Glassmorphism)
 *
 * - Glass background + subtle blur
 * - Compact, lightweight spacing
 * - Accessible hit areas
 * - Motion for entry & microinteractions
 *
 * Nota: se quiser usar o logo que você carregou na sessão, o caminho local está:
 * /mnt/data/79d9b6cc-8901-4038-aa04-289c799d7aba.png
 *
 * (Se preferir usar o logo do /public, troque a constante UPLOADED_LOGO pelo caminho relativo)
 */

const UPLOADED_LOGO = "/mnt/data/79d9b6cc-8901-4038-aa04-289c799d7aba.png";

export default function SidebarLeft() {
  const [hoveredFriend, setHoveredFriend] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>("Início");

  const menuItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: PawPrint, label: "Feed", href: "/feed" },
    { icon: User, label: "Meu Perfil", href: "/perfil" },
    { icon: MessageCircle, label: "Mensagens", href: "/mensagens" },
    { icon: Calendar, label: "Eventos", href: "/eventos" },
    { icon: Info, label: "Sobre", href: "/sobre" },
    { icon: Settings, label: "Configurações", href: "/configuracoes" },
  ];

  const suggestedFriends = [
    { name: "Rex", avatar: "/pets/spike.jpg" },
    { name: "Luna", avatar: "/pets/luna.png" },
    { name: "Max", avatar: "/pets/toby.jpg" },
    { name: "Bella", avatar: "/pets/cat1.jpg" },
  ];

  return (
    <aside
      className="flex flex-col w-full max-w-[320px] p-3 gap-4 select-none
                 bg-white/6 dark:bg-[#071620]/50 backdrop-blur-[8px] border border-white/6 dark:border-gray-800/30
                 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] box-border"
      aria-label="Sidebar principal"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="flex justify-center"
      >
        <div className="relative w-[84px] h-[84px] rounded-2xl overflow-hidden shadow-lg">
          {/* Using uploaded file path as fallback/logo (see comment above) */}
          <Image
            src={UPLOADED_LOGO}
            alt="Logo Mundo Pets"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-2xl transition-all hover:scale-[1.02] hover:brightness-105"
            priority
          />
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-1" aria-label="Navegação principal">
        {menuItems.map(({ icon: Icon, label, href }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.28 }}
          >
            <Link
              href={href}
              onClick={() => setActive(label)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200
                ${active === label ? "bg-[rgba(20,184,166,0.09)] backdrop-blur-sm" : "hover:bg-[rgba(20,184,166,0.06)] dark:hover:bg-[rgba(20,184,166,0.04)]"}`}
              aria-current={active === label ? "page" : undefined}
              role="link"
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-300
                  ${active === label ? "text-teal-400" : "text-gray-300 group-hover:text-teal-300"}`}
                aria-hidden="true"
              />
              <span
                className={`ml-1 text-[15px] tracking-wide font-medium transition-colors duration-300
                  ${active === label ? "text-teal-200" : "text-gray-200 group-hover:text-teal-100"}`}
              >
                {label}
              </span>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Suggested Friends */}
      <div className="mt-1 flex flex-col gap-2 px-1 pb-2">
        <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wide mb-1 ml-1">
          Amigos Sugeridos
        </h3>

        <div className="flex flex-col gap-2">
          {suggestedFriends.map((friend, i) => (
            <motion.button
              key={friend.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.03 }}
              onMouseEnter={() => setHoveredFriend(friend.name)}
              onMouseLeave={() => setHoveredFriend(null)}
              onClick={() => setActive(friend.name)}
              className="flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-200
                         hover:bg-[rgba(236,72,153,0.06)] dark:hover:bg-[rgba(236,72,153,0.04)]
                         focus:outline-none focus:ring-2 focus:ring-[rgba(236,72,153,0.12)]"
              aria-label={`Abrir perfil de ${friend.name}`}
            >
              <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-md border border-white/6 dark:border-gray-800/30">
                <Image
                  src={friend.avatar}
                  alt={friend.name}
                  width={44}
                  height={44}
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-[15px] font-medium transition-colors duration-200
                    ${hoveredFriend === friend.name ? "text-teal-200" : "text-gray-200"}`}
                >
                  {friend.name}
                </div>
                <div className="text-[12px] text-gray-400">Online</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Logout / Action */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-auto mb-1 flex items-center gap-3 mx-1 px-3 py-2.5 text-red-400/90 hover:text-red-300 rounded-xl
                   hover:bg-[rgba(239,68,68,0.06)] dark:hover:bg-[rgba(239,68,68,0.04)] transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-[rgba(239,68,68,0.08)]"
        aria-label="Sair"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Sair</span>
      </motion.button>
    </aside>
  );
}
