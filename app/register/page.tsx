"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/login");
      } else {
        setError(data.message || "Erro ao cadastrar.");
      }
    } catch (err) {
      setError("Erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1a27] via-[#12263a] to-[#183b57] text-white">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[90%] max-w-md border border-white/20">
        <div className="text-center mb-8">
          <img src="/logo-mundo-pets.png" alt="Mundo Pets" className="mx-auto w-20 mb-3" />
          <h1 className="text-3xl font-bold text-teal-400">Criar Conta</h1>
          <p className="text-gray-300 mt-1">Junte-se ao Mundo Pets 🐾</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome completo"
            className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-5">
          Já tem conta?{" "}
          <Link href="/login" className="text-teal-400 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}
