// components/Footer.tsx
"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 bg-transparent mt-8">
      <div className="container mx-auto px-4 py-4 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} Mundo Pets</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-amber-400">Ajuda</a>
          <a href="#" className="hover:text-amber-400">Privacidade</a>
          <a href="#" className="hover:text-amber-400">Contato</a>
        </div>
      </div>
    </footer>
  );
}
