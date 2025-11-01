import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";

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

      <body className="bg-white text-gray-900 min-h-screen">
        {/* ✅ Tudo que é client-side está dentro do Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
