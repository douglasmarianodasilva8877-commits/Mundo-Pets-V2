"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  // Evita problema de hidratação (Next.js)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // 🔍 Simulação de pesquisa (posteriormente integrar com Supabase)
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fakeData = ["Post do Rex", "Evento Pet Lovers", "Arquivo Luna.png"];
    const filtered = fakeData.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 sm:px-8 lg:px-10 h-[var(--navbar-height)]">
        {/* 🔹 LEFT: logo */}
        <div className="flex items-center nav-left" style={{ minWidth: 0 }}>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-mundo-pets.png"
              alt="Logo Mundo Pets"
              width={44}
              height={44}
              className="rounded-full select-none"
              priority
            />
          </Link>
        </div>

        {/* 🔹 CENTER: barra de pesquisa */}
        <div className="flex-1 flex justify-center px-4">
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-md flex items-center"
          >
            <Search className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Pesquise por pets, posts ou arquivos incríveis..."
              className="w-full bg-gradient-to-r from-gray-100/90 to-white/90 dark:from-gray-800/80 dark:to-gray-900/80 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl py-2.5 pl-11 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 text-[15px] tracking-wide"
            />
            {/* Resultados abaixo da barra */}
            {results.length > 0 && (
              <ul className="absolute top-12 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                {results.map((item) => (
                  <li
                    key={item}
                    className="px-4 py-2 text-sm hover:bg-teal-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        {/* 🔹 RIGHT: tema + avatar */}
        <div className="flex items-center nav-right" style={{ gap: 12 }}>
          {/* botão tema */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center justify-center"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {theme === "light" ? (
              <Moon size={22} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun size={24} className="text-yellow-400" />
            )}
          </button>

          {/* avatar */}
          <div className="avatar-wrap" style={{ marginLeft: 8, marginRight: 6 }}>
            <Image
              src="/thor_pet.webp"
              alt="Avatar do Pet"
              width={44}
              height={44}
              className="rounded-full border border-white/20"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
