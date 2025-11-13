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

export default function SidebarLeft() {
  const [hoveredFriend, setHoveredFriend] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

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
      className="
        flex flex-col
        bg-white/60 dark:bg-[#132533]/60
        backdrop-blur-2xl
        border-r border-gray-200/40 dark:border-gray-700/40
        select-none
        p-4
        h-full
        custom-scroll
      "
    >
      {/* 🔹 Logo centralizada */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center mb-6"
      >
        <Image
          src="/logo-mundo-pets.png"
          alt="Logo Mundo Pets"
          width={110}
          height={110}
          className="rounded-2xl shadow-lg hover:brightness-110 transition-all"
          priority
        />
      </motion.div>

      {/* 🔹 Menu principal */}
      <nav className="flex flex-col gap-1 px-2">
        {menuItems.map(({ icon: Icon, label, href }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={href}
              onClick={() => setActive(label)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                active === label
                  ? "bg-teal-500/15 backdrop-blur-sm"
                  : "hover:bg-teal-100/40 dark:hover:bg-teal-900/30"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-300 ${
                  active === label
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-gray-700 dark:text-gray-300 group-hover:text-teal-500 dark:group-hover:text-teal-300"
                }`}
              />
              <span
                className={`ml-2 text-[15px] tracking-wide font-medium transition-all duration-300 ${
                  active === label
                    ? "text-teal-700 dark:text-teal-400"
                    : "text-gray-700 dark:text-gray-200 group-hover:text-teal-600 dark:group-hover:text-teal-300"
                }`}
              >
                {label}
              </span>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* 🔹 Amigos sugeridos */}
      <div className="mt-6 flex flex-col gap-2 px-3 pb-6">
        <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wide mb-2 ml-1">
          Amigos Sugeridos
        </h3>

        {suggestedFriends.map((friend, i) => (
          <motion.div
            key={friend.name}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onMouseEnter={() => setHoveredFriend(friend.name)}
            onMouseLeave={() => setHoveredFriend(null)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-teal-50/40 dark:hover:bg-teal-900/30 transition-all duration-200 cursor-pointer"
          >
            <Image
              src={friend.avatar}
              alt={friend.name}
              width={44}
              height={44}
              className="rounded-full object-cover shadow-md border border-white/40 dark:border-gray-800 hover:scale-105 hover:shadow-lg transition-all"
            />
            <span
              className={`text-[15px] font-medium transition-colors duration-200 ${
                hoveredFriend === friend.name
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {friend.name}
            </span>
          </motion.div>
        ))}
      </div>

      {/* 🔹 Botão de sair */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className="
          mt-auto mb-4 
          flex items-center gap-3 
          mx-3 px-3 py-2.5 
          text-red-500/80 hover:text-red-600 
          rounded-xl 
          hover:bg-red-100/20 dark:hover:bg-red-900/20 
          transition-all duration-200
        "
        aria-label="Sair"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Sair</span>
      </motion.button>
    </aside>
  );
}
