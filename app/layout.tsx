import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"; // ✅ corrigido: nome e caminho
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import { FeedProvider } from "@/context/FeedContext"; // ✅ mantém o contexto de feed

export const metadata: Metadata = {
  title: "Mundo Pets",
  description: "Rede social para amantes de pets 🐾",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground transition-colors duration-300">
        {/* 🔹 Provider de sessão para autenticação e contexto global */}
        <SessionWrapper>
          {/* 🔹 Provider de tema (modo claro/escuro) */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* 🔹 Provider de feed — garante acesso global a useFeed() */}
            <FeedProvider>
              {/* 🔹 Navbar fixa e translúcida */}
              <Navbar />

              {/* 🔹 Área principal — respeita altura da navbar */}
              <main className="pt-[var(--navbar-height)] min-h-screen">
                {children}
              </main>
            </FeedProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
