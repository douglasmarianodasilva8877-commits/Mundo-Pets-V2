// app/register/page.tsx
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

  // imagem local / preview
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use FormData porque temos arquivo
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("password", password);
      if (avatarFile) form.append("avatar", avatarFile);

      const res = await fetch("/api/register", {
        method: "POST",
        body: form, // NÃO setar Content-Type => navegador define multipart/form-data
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // redireciona para criar pet ou login — por enquanto vamos para /login
        router.push("/login");
      } else {
        setError(data.error || data.message || "Erro ao cadastrar.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1a27] via-[#12263a] to-[#183b57] text-white">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[90%] max-w-md border border-white/20">
        <div className="text-center mb-8">
          <img
            src="/logo-mundo-pets.png"
            alt="Mundo Pets"
            className="mx-auto w-20 mb-3"
          />
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

          {/* Upload de avatar do tutor (opcional) */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-white/30 rounded-lg text-sm text-white/90 hover:bg-white/5 transition">
              Selecionar imagem do tutor
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-12 h-12 rounded-full object-cover border border-white/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xs text-gray-300 border border-white/10">
                Sem foto
              </div>
            )}
          </div>

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
