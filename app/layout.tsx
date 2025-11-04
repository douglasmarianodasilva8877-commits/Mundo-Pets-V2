import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import SideMenu from "@/components/SideMenu";
import SidebarRight from "@/components/SidebarRight";

export const metadata: Metadata = {
  title: "Mundo Pets 🌎",
  description: "A rede social dos apaixonados por animais 🐾",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#00b8b3" />
        <link rel="icon" href="/logo-mundo-pets.png" />
      </head>

      <body className="bg-[var(--bg)] text-[var(--fg)] min-h-screen flex flex-col">
        <Providers>
          {/* 🐾 Navbar translúcida fixa */}
          <Navbar />

          <div className="app-grid container mt-[85px]">
            {/* 🧭 Sidebar esquerda fixa */}
            <aside className="sidebar-left-container">
              <SideMenu />
            </aside>

            {/* 🐶 Feed central */}
            <main className="flex flex-col gap-6">{children}</main>

            {/* 📢 Sidebar direita (anúncios/amigos) */}
            <aside className="sidebar-right sidebar-scroll">
              <SidebarRight />
            </aside>
          </div>
        </Providers>
      </body>
    </html>
  );
}
