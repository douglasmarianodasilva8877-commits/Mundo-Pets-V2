// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import BottomNavigation from "@/components/BottomNavigation";
import { UserDataProvider } from "@/context/UserDataContext";

export const metadata: Metadata = {
  title: "Mundo Pets",
  description: "Rede social para amantes de pets 🐾",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground transition-colors duration-300">
        <SessionWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserDataProvider>

              <Navbar />

              <main className="min-h-screen">{children}</main>

              <BottomNavigation />

            </UserDataProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
