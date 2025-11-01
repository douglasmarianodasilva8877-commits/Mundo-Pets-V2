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
    { icon: Home, label: "Início", href: "/" },
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
      className={`sidebar-left-container ${expanded ? "expanded" : "collapsed"}`}
    >
      {/* topo com logo */}
      <div className="sidebar-top">
        <PawPrint className="logo-icon" />
        {expanded && (
          <div className="brand">
            <div className="brand-title">Mundo Pets</div>
            <div className="brand-sub">Compartilhe com seu pet</div>
          </div>
        )}
      </div>

      {/* menu vertical */}
      <nav className="menu" role="navigation" aria-label="Menu principal">
        {menuItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className={`menu-item ${expanded ? "with-label" : "icon-only"}`}
            title={label}
          >
            <span className="menu-icon" aria-hidden>
              <Icon />
            </span>
            {expanded && <span className="menu-label">{label}</span>}
          </Link>
        ))}

        {/* Ícone Eventos que abre painel interno */}
        <button
          onClick={() => setShowEvents(!showEvents)}
          className={`menu-item ${expanded ? "with-label" : "icon-only"}`}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          <span className="menu-icon" aria-hidden>
            <Calendar />
          </span>
          {expanded && <span className="menu-label">Eventos</span>}
        </button>

        {/* Seção expandida */}
        {expanded && showEvents && (
          <div className="eventos-section">
            <div className="eventos-sub">
              <h4 className="eventos-title">📈 Tendências</h4>
              <ul className="eventos-list">
                <li>#Pets2025</li>
                <li>#AdoçãoConsciente</li>
                <li>#SaúdeAnimal</li>
              </ul>
            </div>
            <div className="eventos-sub">
              <h4 className="eventos-title">📅 Próximos Eventos</h4>
              <ul className="eventos-list">
                <li>Feira Pet Brasil — 12/11</li>
                <li>Encontro de Gatos — 18/11</li>
                <li>Corrida Pet — 22/11</li>
              </ul>
            </div>
          </div>
        )}
      </nav>

      {/* grupos sugeridos */}
      <div className="groups-section" aria-label="Grupos sugeridos">
        {expanded && <h4 className="groups-title">Grupos Sugeridos</h4>}
        <ul className="groups-list">
          {grupos.map((g) => (
            <li key={g.nome} className={`group-item ${expanded ? "with-meta" : ""}`}>
              <div className="group-avatar">{g.sigla}</div>
              {expanded && (
                <div className="group-info">
                  <div className="group-name">{g.nome}</div>
                  <div className="group-type">Comunidade</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
