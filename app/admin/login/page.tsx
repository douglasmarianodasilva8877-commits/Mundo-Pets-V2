// app/admin/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha simulada
    if (password === "admin123") {
      localStorage.setItem("mundo_is_admin", "1");
      router.push("/admin/dashboard");
    } else {
      setError("Senha incorreta. (use admin123 para demo)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Painel do Admin — Mundo Pets</h1>
        <p className="text-sm text-gray-600 mb-4">Acesso demo: senha <strong>admin123</strong></p>

        <input
          type="password"
          placeholder="Senha do admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded border mb-3"
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button className="w-full py-2 bg-teal-600 text-white rounded">Entrar</button>
      </form>
    </div>
  );
}
