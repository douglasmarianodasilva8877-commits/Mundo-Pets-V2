"use client";
import React from "react";

export default function SearchBar() {
  return (
    <div className="search-bar" role="search">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6"></circle>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"></path>
      </svg>
      <input className="search-input" type="search" placeholder="Pesquisar no Mundo Pets" aria-label="Pesquisar no Mundo Pets" />
    </div>
  );
}
