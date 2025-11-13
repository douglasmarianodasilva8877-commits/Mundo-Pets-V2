"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PawPrint, Camera } from "lucide-react";

export default function CadastrarPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Pet cadastrado com sucesso!");
        setTimeout(() => {
          router.push("/meus-pets");
        }, 1500);
      } else {
        setMessage("⚠️ " + (data.message || "Erro ao cadastrar pet."));
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
        <PawPrint className="w-6 h-6 text-green-600" /> Cadastrar Novo Pet
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-2xl p-6 border"
      >
        {/* 📸 Foto do Pet */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-green-500">
            {preview ? (
              <img
                src={preview}
                alt="Prévia do pet"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                <Camera className="w-8 h-8" />
              </div>
            )}
            <label
              htmlFor="photo"
              className="absolute bottom-1 right-1 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700"
            >
              <Camera className="w-4 h-4" />
            </label>
          </div>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 🐕 Dados do Pet */}
        <input
          name="name"
          type="text"
          placeholder="Nome do Pet"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          name="species"
          type="text"
          placeholder="Espécie (ex: Cachorro, Gato...)"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          name="breed"
          type="text"
          placeholder="Raça"
          className="w-full p-2 border rounded-md"
        />
        <input
          name="age"
          type="number"
          placeholder="Idade (em anos)"
          min="0"
          className="w-full p-2 border rounded-md"
        />
        <textarea
          name="bio"
          placeholder="Descreva o pet (personalidade, cuidados, observações...)"
          className="w-full p-2 border rounded-md min-h-[100px]"
        />

        {/* 📧 Email do tutor (ligação com usuário) */}
        <input
          name="tutorEmail"
          type="email"
          placeholder="E-mail do tutor (usado para vincular)"
          required
          className="w-full p-2 border rounded-md"
        />

        {/* Botão principal */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Cadastrando...
            </span>
          ) : (
            "Cadastrar Pet"
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
    </div>
  );
}
