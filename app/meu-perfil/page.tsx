"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Camera, PawPrint } from "lucide-react";

export default function MeuPerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ " + data.message);
        setSaved(true);
      } else {
        setMessage("⚠️ " + (data.message || "Erro ao salvar dados."));
      }
    } catch (err) {
      setMessage("❌ Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600" /> Meu Perfil
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-2xl p-6 border"
      >
        {/* 📸 Avatar Preview */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500">
            {preview ? (
              <img
                src={preview}
                alt="Prévia do avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                <Camera className="w-8 h-8" />
              </div>
            )}
            <label
              htmlFor="avatar"
              className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
            >
              <Camera className="w-4 h-4" />
            </label>
          </div>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 🧾 Dados pessoais */}
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          name="name"
          type="text"
          placeholder="Nome completo"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          name="cpf"
          type="text"
          placeholder="CPF"
          className="w-full p-2 border rounded-md"
        />
        <input
          name="phone"
          type="text"
          placeholder="Telefone"
          className="w-full p-2 border rounded-md"
        />
        <input
          name="address"
          type="text"
          placeholder="Endereço completo"
          className="w-full p-2 border rounded-md"
        />
        <input
          name="birthDate"
          type="date"
          className="w-full p-2 border rounded-md"
        />

        {/* Botão principal */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
            </span>
          ) : (
            "Salvar dados"
          )}
        </button>
      </form>

      {/* Mensagem de status */}
      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes("✅")
              ? "text-green-600"
              : message.includes("⚠️")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* 🐶 Botão para cadastrar pet */}
      {saved && (
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/cadastrar-pet")}
            className="flex items-center gap-2 mx-auto bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition"
          >
            <PawPrint className="w-5 h-5" /> Cadastrar meu Pet agora
          </button>
        </div>
      )}
    </div>
  );
}
