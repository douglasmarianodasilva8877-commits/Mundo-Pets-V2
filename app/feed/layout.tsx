"use client";

import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import { FeedProvider } from "@/context/FeedContext";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeedProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100">

        <main className="grid-layout" role="main">

          <aside className="sidebar-area custom-scroll">
            <SidebarLeft />
          </aside>

          <section className="feed-area">
            {children}
          </section>

          <aside className="sidebar-area-right custom-scroll">
            <SidebarRight />
          </aside>

        </main>
      </div>
    </FeedProvider>
  );
}
