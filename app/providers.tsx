"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import SidebarLeft from "@/components/SidebarLeft/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import MobileBottomBar from "@/components/MobileBottomBar";
import SidebarDrawer from "@/components/SidebarDrawer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />

      <main className="container app-grid pt-[80px]">
        <aside>
          <SidebarLeft />
        </aside>

        <section className="min-h-screen">{children}</section>

        <aside>
          <SidebarRight />
        </aside>
      </main>

      <SidebarDrawer />
      <MobileBottomBar />
    </SessionProvider>
  );
}
