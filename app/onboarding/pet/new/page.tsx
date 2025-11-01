"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { PawPrint, Upload } from "lucide-react";

export default function NewPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [pet, setPet] = useState({
    nome: "",
    especie: "",
    idade: "",
    raca: "",
    personalidade: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPet((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tutorAtivo = localStorage.getItem("tutorAtivo");
      if (!tutorAtivo) {
        alert("⚠️ Nenhum tutor cadastrado. Volte e conclua o cadastro primeiro.");
        router.push("/onboarding/tutor");
        return;
      }

      const tutor = JSON.parse(tutorAtivo);

      // 🔹 Faz o upload real da imagem para /uploads
      let avatarUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok) avatarUrl = uploadData.url;
        else throw new Error("Falha no upload da imagem");
      }

      // 🔹 Envia dados do pet para o backend
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pet,
          avatar: avatarUrl,
          tutorNome: tutor.nome,
          tutorEmail: tutor.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao cadastrar pet.");
        return;
      }

      localStorage.setItem("petAtivo", JSON.stringify(data.pet));
      router.push("/");
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
      alert("Erro ao se conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 Usa a mesma Navbar global para manter padrão visual */}
      <Navbar />

      <div className="min-h-screen bg-gray-50 dark:bg-[#0d1a27] flex flex-col items-center justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#10263b] p-8 rounded-2xl shadow-md w-full max-w-md space-y-5"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <PawPrint className="text-teal-500" size={22} />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Cadastro do Pet
            </h1>
          </div>

          {/* Upload de imagem */}
          <div className="text-center space-y-2">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-teal-500"
              />
            ) : (
              <div className="w-28 h-28 rounded-full mx-auto flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                <Upload className="text-gray-400" size={28} />
              </div>
            )}
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:text-teal-500">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              Selecionar foto do pet
            </label>
          </div>

          {/* Campos do formulário */}
          <input
            type="text"
            name="nome"
            placeholder="Nome do pet"
            value={pet.nome}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="text"
            name="especie"
            placeholder="Espécie (ex: cachorro, gato...)"
            value={pet.especie}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="text"
            name="raca"
            placeholder="Raça"
            value={pet.raca}
            onChange={handleChange}
            className="input"
          />
          <input
            type="number"
            name="idade"
            placeholder="Idade (anos)"
            value={pet.idade}
            onChange={handleChange}
            className="input"
          />
          <input
            type="text"
            name="personalidade"
            placeholder="Personalidade (ex: brincalhão, curioso...)"
            value={pet.personalidade}
            onChange={handleChange}
            className="input"
          />
          <textarea
            name="bio"
            placeholder="Bio do pet"
            rows={3}
            value={pet.bio}
            onChange={handleChange}
            className="input"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Cadastrando..." : "Concluir e Entrar no Mundo Pets 🌎"}
          </button>
        </form>
      </div>
    </>
  );
}
