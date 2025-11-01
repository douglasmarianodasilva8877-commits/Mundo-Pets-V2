"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function TutorOnboardingPage() {
  const router = useRouter();
  const [tutor, setTutor] = useState({
    nome: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [preview, setPreview] = useState<string | null>(null);

  // Atualiza campos do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTutor((prev) => ({ ...prev, [name]: value }));
  };

  // Upload local de imagem com pré-visualização
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setTutor((prev) => ({ ...prev, avatar: objectUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tutor.nome || !tutor.email || !tutor.avatar) {
      alert("Por favor, preencha nome, e-mail e insira uma foto 🧑‍💻");
      return;
    }

    // Armazena localmente o tutor (mock — em produção será salvo no banco)
    localStorage.setItem("tutorAtivo", JSON.stringify(tutor));

    // Redireciona para cadastro do pet
    router.push("/onboarding/pet/new");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0d1a27] py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#10263b] p-8 rounded-2xl shadow-md w-full max-w-md space-y-5 mt-6"
        >
          {/* Título */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <User className="text-teal-500" size={22} />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Cadastro do Tutor
            </h1>
          </div>

          {/* Avatar */}
          <div className="space-y-2 text-center">
            {preview ? (
              <img
                src={preview}
                alt={tutor.nome}
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

          {/* Nome */}
          <input
            type="text"
            name="nome"
            value={tutor.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            className="input"
            required
          />

          {/* E-mail */}
          <input
            type="email"
            name="email"
            value={tutor.email}
            onChange={handleChange}
            placeholder="Seu e-mail"
            className="input"
            required
          />

          {/* Bio */}
          <textarea
            name="bio"
            value={tutor.bio}
            onChange={handleChange}
            placeholder="Uma breve bio sobre você"
            rows={3}
            className="input"
          />

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-lg mt-2 transition"
          >
            Continuar para o Pet 🐾
          </button>
        </form>
      </div>
    </>
  );
}
