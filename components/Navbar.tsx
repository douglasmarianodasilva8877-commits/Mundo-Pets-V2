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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fakeData = ["Post do Rex", "Evento Pet Lovers", "Arquivo Luna.png"];
    setResults(fakeData.filter((i) => i.toLowerCase().includes(query.toLowerCase())));
  };

  return (
    <header className="navbar w-full fixed top-0 left-0 z-[9999]">
      <div
        className="
          w-full 
          max-w-[1500px] 
          mx-auto 
          flex 
          items-center 
          justify-between 
          px-4 
          sm:px-6 
          lg:px-10 
          h-[var(--navbar-height)]
          gap-4
        "
      >
        {/* ---------- LOGO LEFT ---------- */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-mundopets.png"
              alt="Mundo Pets"
              width={42}
              height={42}
              className="rounded-full object-contain"
            />
          </Link>
        </div>

        {/* ---------- SEARCH CENTER ---------- */}
        <div className="flex flex-1 justify-center min-w-0">
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-md flex items-center"
          >
            <Search className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Pesquise por pets, posts ou arquivos..."
              className="
                w-full 
                bg-gradient-to-r from-gray-100/90 to-white/90 
                dark:from-gray-800/80 dark:to-gray-900/80 
                text-gray-800 dark:text-gray-100 
                placeholder-gray-400 
                rounded-2xl 
                py-2.5 
                pl-11 
                pr-4 
                shadow-sm 
                outline-none 
                focus:ring-2 focus:ring-teal-500 
                transition-all 
                duration-300 
                text-[15px]
              "
            />

            {results.length > 0 && (
              <ul className="absolute top-12 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                {results.map((item) => (
                  <li
                    key={item}
                    className="px-4 py-2 text-sm hover:bg-teal-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        {/* ---------- RIGHT ICONS ---------- */}
        <div className="flex items-center flex-shrink-0 gap-4">
          {/* Theme button */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="
              p-2 
              rounded-full 
              hover:bg-black/5 
              dark:hover:bg-white/10 
              transition 
              flex 
              items-center 
              justify-center
            "
          >
            {theme === "light" ? (
              <Moon size={22} className="text-gray-700" />
            ) : (
              <Sun size={22} className="text-yellow-400" />
            )}
          </button>

          {/* Avatar */}
          <div className="flex items-center">
            <Image
              src="/thor_pet.webp"
              alt="Avatar do Pet"
              width={42}
              height={42}
              className="rounded-full border border-white/20 object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
