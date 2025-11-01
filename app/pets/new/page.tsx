"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { PawPrint, Upload } from "lucide-react";

export default function PetOnboardingPage() {
  const router = useRouter();
  const [tutor, setTutor] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pet, setPet] = useState({
    nome: "",
    especie: "",
    idade: "",
    raca: "",
    personalidade: "",
    bio: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔍 Obtém o tutor ativo salvo no localStorage
  useEffect(() => {
    const tutorAtivo = localStorage.getItem("tutorAtivo");
    if (tutorAtivo) {
      setTutor(JSON.parse(tutorAtivo));
    } else {
      router.replace("/onboarding/tutor");
    }
  }, [router]);

  // 📷 Atualiza o preview e o link da imagem
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setPet((prev) => ({ ...prev, avatar: objectUrl }));
    }
  };

  // ✏️ Atualiza os campos do pet
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPet((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 Envia os dados
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pet, tutorNome: tutor?.nome }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o pet");
      }

      const data = await response.json();

      // Armazena localmente o pet
      localStorage.setItem("petAtivo", JSON.stringify(data.pet));

      // Redireciona para o feed principal
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Não foi possível cadastrar o pet 😿");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0b1a27] py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#10263b] p-8 rounded-2xl shadow-md w-full max-w-md space-y-5 mt-6"
        >
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <PawPrint className="text-teal-500" size={22} />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Cadastro do Pet
            </h1>
          </div>

          {/* Avatar */}
          <div className="space-y-2 text-center">
            {preview ? (
              <img
                src={preview}
                alt={pet.nome}
                className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-teal-500"
              />
            ) : (
              <div className="w-28 h-28 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-700">
                <Upload className="text-gray-400" size={28} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 dark:text-gray-300 mt-2"
            />
          </div>

          {/* Campos do Pet */}
          <input
            type="text"
            name="nome"
            value={pet.nome}
            onChange={handleChange}
            placeholder="Nome do pet"
            className="input"
            required
          />
          <input
            type="text"
            name="especie"
            value={pet.especie}
            onChange={handleChange}
            placeholder="Espécie (ex: cachorro, gato...)"
            className="input"
            required
          />
          <input
            type="text"
            name="raca"
            value={pet.raca}
            onChange={handleChange}
            placeholder="Raça"
            className="input"
          />
          <input
            type="number"
            name="idade"
            value={pet.idade}
            onChange={handleChange}
            placeholder="Idade"
            className="input"
          />
          <input
            type="text"
            name="personalidade"
            value={pet.personalidade}
            onChange={handleChange}
            placeholder="Personalidade (ex: brincalhão, curioso...)"
            className="input"
          />
          <textarea
            name="bio"
            value={pet.bio}
            onChange={handleChange}
            placeholder="Uma breve bio do seu pet"
            rows={3}
            className="input"
          />

          {/* Botão de envio */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-lg mt-2 transition"
          >
            {loading ? "Cadastrando..." : "Concluir e entrar no Mundo Pets 🌎"}
          </button>
        </form>
      </div>
    </>
  );
}
