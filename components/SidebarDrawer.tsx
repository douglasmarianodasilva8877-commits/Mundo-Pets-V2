"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Settings,
  Megaphone,
  Home,
  PawPrint,
  LogOut,
  Bell,
} from "lucide-react";

export default function SidebarDrawer() {
  const [open, setOpen] = useState(false);

  // 🔄 Abre/fecha via evento global (Navbar → toggle-sidebar)
  useEffect(() => {
    const handler = () => setOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Fundo com blur */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            className="
              fixed top-0 left-0 h-full w-72 z-50 flex flex-col
              bg-white/10 dark:bg-[#0A0F1C]/30
              backdrop-blur-xl border-r border-white/10 dark:border-gray-800/30
              shadow-[0_8px_30px_rgba(0,0,0,0.2)]
            "
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-gray-800/40">
              <div className="flex items-center gap-2">
                <PawPrint className="text-teal-400" size={22} />
                <h2 className="font-semibold text-gray-100 text-lg">
                  Mundo Pets 🌎
                </h2>
              </div>

              <motion.button
                onClick={() => setOpen(false)}
                whileTap={{ scale: 0.88 }}
                className="p-1 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800/40 transition"
              >
                <X size={20} className="text-gray-300" />
              </motion.button>
            </div>

            {/* Menu */}
            <nav className="flex flex-col gap-1 p-4 text-gray-300">
              <DrawerLink href="/" icon={Home} label="Início" close={setOpen} />
              <DrawerLink
                href="/profile"
                icon={User}
                label="Meu Perfil"
                close={setOpen}
              />
              <DrawerLink
                href="/notifications"
                icon={Bell}
                label="Notificações"
                close={setOpen}
              />
              <DrawerLink
                href="/sponsors"
                icon={Megaphone}
                label="Anúncios"
                close={setOpen}
              />
              <DrawerLink
                href="/configuracoes"
                icon={Settings}
                label="Configurações"
                close={setOpen}
              />
            </nav>

            {/* Rodapé */}
            <div className="mt-auto border-t border-white/10 dark:border-gray-800/40 p-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="w-full flex items-center gap-2 text-red-400 font-medium hover:text-red-300 transition"
              >
                <LogOut size={18} />
                Sair
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------
   COMPONENTE REUTILIZÁVEL
----------------------------- */

function DrawerLink({
  href,
  icon: Icon,
  label,
  close,
}: {
  href: string;
  icon: any;
  label: string;
  close: (v: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        href={href}
        onClick={() => close(false)}
        className="
          flex items-center gap-3 py-2 px-3 rounded-xl
          hover:bg-white/10 dark:hover:bg-gray-800/40
          transition text-sm font-medium
        "
      >
        <Icon size={18} className="text-teal-300" />
        {label}
      </Link>
    </motion.div>
  );
}
