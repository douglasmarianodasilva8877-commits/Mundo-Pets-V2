"use client";

import React, { useState } from "react";

export default function PartnerUploadForm() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("banner");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠️ Escolha um arquivo para enviar.");
      return;
    }

    setMessage("⏳ Enviando arquivo...");

    // 1️⃣ Envia o arquivo para o backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "partner"); // destino: uploads/

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`✅ Arquivo enviado com sucesso!`);
      setPreview(data.url);

      // 2️⃣ Aqui você pode salvar os dados do parceiro (opcional futuramente)
      console.log("URL pública:", data.url);
    } else {
      setMessage("❌ Erro ao enviar o arquivo.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700">
      <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
        Enviar novo anúncio
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome do parceiro"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-transparent text-gray-800 dark:text-gray-200"
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-transparent text-gray-800 dark:text-gray-200"
        >
          <option value="banner">Banner</option>
          <option value="produto">Produto</option>
          <option value="video">Vídeo</option>
        </select>

        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setFile(file);
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-transparent text-gray-800 dark:text-gray-200"
        />

        {preview && (
          <div className="mt-3 rounded-xl overflow-hidden">
            {file?.type.startsWith("video/") ? (
              <video src={preview} controls className="rounded-xl w-full" />
            ) : (
              <img
                src={preview}
                alt="Pré-visualização"
                className="rounded-xl w-full object-cover"
              />
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition w-full"
        >
          Enviar
        </button>
      </form>

      {message && (
        <p className="text-center text-sm mt-3 text-teal-600 dark:text-teal-400">
          {message}
        </p>
      )}
    </div>
  );
}
