"use client";
import React from "react";

export default function FooterBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bottom-bar z-40">
      <div className="max-w-3xl mx-auto px-4 py-2 flex justify-between">
        <button className="flex-1 text-center">🏠</button>
        <button className="flex-1 text-center">🔍</button>
        <button className="flex-1 text-center">＋</button>
        <button className="flex-1 text-center">💬</button>
        <button className="flex-1 text-center">👤</button>
      </div>
    </div>
  );
}
