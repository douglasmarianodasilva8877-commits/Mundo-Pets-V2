"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PawPrint, User } from "lucide-react";

export default function CadastroUnificado() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeTutor, setNomeTutor] = useState("");
  const [nomePet, setNomePet] = useState("");
  const [especie, setEspecie] = useState("Cachorro");
  const [bioPet, setBioPet] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Enviando dados...");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", senha);
    formData.append("userName", nomeTutor);
    formData.append("petName", nomePet);
    formData.append("species", especie);
    formData.append("bio", bioPet);
    if (foto) formData.append("photo", foto);

    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Erro ao cadastrar.");

      setStatus("🎉 Pet cadastrado e conta criada com sucesso!");

      // 🔹 Faz login automático após o cadastro
      await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password: senha }),
      });

      setTimeout(() => router.push("/feed"), 1200);
    } catch (err: any) {
      console.error(err);
      setStatus("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-[#0d1a27] p-8 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <PawPrint className="text-teal-600 w-6 h-6" />
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Cadastro Mundo Pets
        </h1>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        Crie o perfil do <strong>pet</strong> e vincule-o ao e-mail do <strong>tutor</strong>.
        Esse e-mail será usado para login, segurança e assinatura futura.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* DADOS DO TUTOR */}
        <div className="border-b border-gray-300 dark:border-gray-700 pb-4 mb-4">
          <h2 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2">
            <User className="w-4 h-4" /> Dados do Tutor
          </h2>

          <input
            type="text"
            placeholder="Nome completo"
            value={nomeTutor}
            onChange={(e) => setNomeTutor(e.target.value)}
            required
            className="w-full mb-2 rounded-lg border px-3 py-2 bg-transparent focus:ring-2 focus:ring-teal-500"
          />

          <input
            type="email"
            placeholder="E-mail do tutor"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-2 rounded-lg border px-3 py-2 bg-transparent focus:ring-2 focus:ring-teal-500"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 bg-transparent focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* DADOS DO PET */}
        <h2 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2">
          <PawPrint className="w-4 h-4" /> Dados do Pet
        </h2>

        <input
          type="text"
          placeholder="Nome do pet"
          value={nomePet}
          onChange={(e) => setNomePet(e.target.value)}
          required
          className="w-full rounded-lg border px-3 py-2 bg-transparent focus:ring-2 focus:ring-teal-500"
        />

        <select
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
          className="rounded-lg border px-3 py-2 bg-transparent focus:ring-2 focus:ring-teal-500"
        >
          <option value="Cachorro">Cachorro 🐶</option>
          <option value="Gato">Gato 🐱</option>
          <option value="Outro">Outro 🐾</option>
        </select>

        <textarea
          placeholder="Biografia do pet..."
          value={bioPet}
          onChange={(e) => setBioPet(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 bg-transparent focus:ring-2 focus:ring-teal-500"
        />

        {/* FOTO DO PET */}
        <div>
          <label className="text-gray-700 dark:text-gray-300 block mb-1">
            Foto do Pet
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFoto(file || null);
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 rounded-lg w-48 h-48 object-cover border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Cadastrando..." : "Concluir Cadastro"}
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
          {status}
        </p>
      )}
    </div>
  );
}
