// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { register, loading, error } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);

  async function handleSubmit(e: any) {
    e.preventDefault();
    await register({ ...form, avatar });
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Criar Conta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Nome"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="E-mail"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Senha"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>
    </div>
  );
}
