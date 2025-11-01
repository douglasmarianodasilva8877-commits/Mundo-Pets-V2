"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) setError(res.error);
    else window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0d1a27]">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1a2b3d] p-8 rounded-2xl shadow-lg w-96 border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-2xl font-bold text-teal-500 mb-6 text-center">Mundo Pets 🐾</h1>

        {error && (
          <p className="text-red-500 bg-red-100 dark:bg-red-900/40 p-2 rounded text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-teal-500 outline-none"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-teal-500 outline-none"
        />

        <button
          type="submit"
          className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
