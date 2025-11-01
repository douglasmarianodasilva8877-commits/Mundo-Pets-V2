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

  // 🧭 Abre/fecha via evento global (emitido pela Navbar)
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

          {/* Drawer lateral */}
          <motion.aside
            key="drawer"
            className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <PawPrint className="text-teal-500" size={22} />
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  Mundo Pets 🌎
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu principal */}
            <nav className="flex flex-col gap-1 p-4 text-gray-700 dark:text-gray-300">
              <Link href="/" onClick={() => setOpen(false)} className="drawer-link">
                <Home size={18} /> Início
              </Link>

              <Link href="/profile" onClick={() => setOpen(false)} className="drawer-link">
                <User size={18} /> Meu Perfil
              </Link>

              <Link href="/notifications" onClick={() => setOpen(false)} className="drawer-link">
                <Bell size={18} /> Notificações
              </Link>

              <Link href="/sponsors" onClick={() => setOpen(false)} className="drawer-link">
                <Megaphone size={18} /> Anúncios
              </Link>

              <Link href="/configuracoes" onClick={() => setOpen(false)} className="drawer-link">
                <Settings size={18} /> Configurações
              </Link>
            </nav>

            {/* Rodapé */}
            <div className="mt-auto border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="w-full flex items-center gap-2 text-red-500 font-medium hover:text-red-600"
              >
                <LogOut size={18} /> Sair
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* === Estilos utilitários (Tailwind) ===
   Coloque no globals.css se quiser padronizar:
   .drawer-link {
     @apply flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition;
   }
*/
