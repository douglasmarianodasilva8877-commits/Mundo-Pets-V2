import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import SideMenu from "@/components/SideMenu";

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

      <body className="bg-white dark:bg-[#0d1a27] text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <Providers>
          {/* 🐾 Navbar fixa no topo */}
          <Navbar />

          <div className="flex flex-1 pt-16">
            {/* 🧭 Menu lateral fixo (somente desktop) */}
            <SideMenu />

            {/* 🧩 Conteúdo das páginas */}
            <main className="flex-1 p-4 md:ml-64">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
