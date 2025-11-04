"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Heart,
  Image as ImageIcon,
  Bookmark,
  Calendar,
  Settings,
  PawPrint,
  Bell,
  BookOpen,
} from "lucide-react";

export default function SidebarLeft() {
  const [expanded, setExpanded] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const menuItems = [
    { icon: PawPrint, label: "Feed", href: "/" },
    { icon: Users, label: "Amigos", href: "/amigos" },
    { icon: Heart, label: "Favoritos", href: "/favoritos" },
    { icon: ImageIcon, label: "Fotos", href: "/fotos" },
    { icon: Bookmark, label: "Salvos", href: "/salvos" },
    { icon: BookOpen, label: "Grupos", href: "/grupos" },
    { icon: Bell, label: "Notificações", href: "/notificacoes" },
    { icon: Settings, label: "Configurações", href: "/configuracoes" },
  ];

  const grupos = [
    { nome: "Amantes de Gatos", sigla: "G" },
    { nome: "Cachorros Felizes", sigla: "C" },
    { nome: "Animais Exóticos", sigla: "E" },
  ];

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setShowEvents(false);
      }}
      aria-label="Barra lateral Mundo Pets"
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-[#0d1a27] border-r border-gray-200 dark:border-gray-800 shadow-md transition-all duration-300 z-40 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* topo com logo */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
        <PawPrint className="text-teal-600 w-6 h-6" />
        {expanded && (
          <div>
            <div className="font-bold text-teal-600 text-lg">Mundo Pets</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Compartilhe com seu pet
            </div>
          </div>
        )}
      </div>

      {/* menu principal */}
      <nav className="flex flex-col gap-1 mt-2">
        {menuItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-teal-50 dark:hover:bg-[#102030] hover:text-teal-600 ${
              expanded ? "justify-start" : "justify-center"
            }`}
          >
            <Icon className="w-5 h-5" />
            {expanded && <span>{label}</span>}
          </Link>
        ))}

        {/* botão eventos */}
        <button
          onClick={() => setShowEvents(!showEvents)}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-teal-50 dark:hover:bg-[#102030] hover:text-teal-600 ${
            expanded ? "justify-start" : "justify-center"
          }`}
        >
          <Calendar className="w-5 h-5" />
          {expanded && <span>Eventos</span>}
        </button>

        {/* seção de eventos */}
        {expanded && showEvents && (
          <div className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">
            <h4 className="font-semibold mb-2">📈 Tendências</h4>
            <ul className="space-y-1 mb-4">
              <li>#Pets2025</li>
              <li>#AdoçãoConsciente</li>
              <li>#SaúdeAnimal</li>
            </ul>
            <h4 className="font-semibold mb-2">📅 Próximos Eventos</h4>
            <ul className="space-y-1">
              <li>Feira Pet Brasil — 12/11</li>
              <li>Encontro de Gatos — 18/11</li>
              <li>Corrida Pet — 22/11</li>
            </ul>
          </div>
        )}
      </nav>

      {/* grupos sugeridos */}
      <div className="absolute bottom-0 w-full border-t border-gray-100 dark:border-gray-800 p-3">
        {expanded && <h4 className="text-xs mb-2 text-gray-500">Grupos</h4>}
        <ul className="flex flex-col gap-2">
          {grupos.map((g) => (
            <li
              key={g.nome}
              className={`flex items-center gap-3 text-sm ${
                expanded ? "justify-start" : "justify-center"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center bg-teal-600 text-white rounded-full text-xs font-semibold">
                {g.sigla}
              </div>
              {expanded && (
                <div>
                  <div className="font-medium">{g.nome}</div>
                  <div className="text-xs text-gray-500">Comunidade</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
