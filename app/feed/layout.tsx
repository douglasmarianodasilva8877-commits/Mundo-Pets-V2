"use client";

import Navbar from "@/components/Navbar";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import { FeedProvider } from "@/context/FeedContext";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeedProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100">
        {/* 🔹 Navbar fixa */}
        <Navbar />

        {/* 🔹 Estrutura principal (3 colunas com rolagem independente) */}
        <main className="grid-layout">
          {/* 🔹 Sidebar Esquerda com rolagem */}
          <aside className="sidebar-area custom-scroll">
            <SidebarLeft />
          </aside>

          {/* 🔹 Feed Central com rolagem independente */}
          <section
            className="feed-area custom-scroll"
            style={{
              height: "calc(100vh - var(--navbar-height))",
              overflowY: "auto",
            }}
          >
            {children}
          </section>

          {/* 🔹 Sidebar Direita com rolagem independente */}
          <aside
            className="sidebar-area-right custom-scroll"
            style={{
              height: "calc(100vh - var(--navbar-height))",
              overflowY: "auto",
            }}
          >
            <SidebarRight />
          </aside>
        </main>
      </div>
    </FeedProvider>
  );
}
