"use client";

import React, { useState, useEffect } from "react";
import { Save, User, MapPin, Image } from "lucide-react";

export default function ConfiguracoesPage() {
  const [tutor, setTutor] = useState<any>({
    name: "",
    email: "",
    city: "",
    avatar: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tutor");
    if (saved) setTutor(JSON.parse(saved));
  }, []);

  const handleChange = (field: string, value: string) => {
    setTutor((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setTutor((prev: any) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const salvarAlteracoes = () => {
    setSalvando(true);
    localStorage.setItem("tutor", JSON.stringify(tutor));
    setTimeout(() => {
      setSalvando(false);
      alert("✅ Informações salvas com sucesso!");
    }, 800);
  };

  return (
    <section className="max-w-lg mx-auto bg-white/90 dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 mt-8">
      <h1 className="text-2xl font-bold text-teal-500 mb-6 text-center">
        ⚙️ Configurações do Perfil
      </h1>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={preview || tutor.avatar || "/placeholder-pet.png"}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-teal-500"
          />
          <label className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full cursor-pointer shadow hover:bg-teal-600 transition">
            <Image className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Nome */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 mb-1">
            <User className="w-4 h-4" /> Nome
          </label>
          <input
            type="text"
            value={tutor.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Seu nome completo"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* E-mail */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 mb-1">
            <User className="w-4 h-4" /> E-mail
          </label>
          <input
            type="email"
            value={tutor.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="exemplo@email.com"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* Cidade */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4" /> Cidade
          </label>
          <input
            type="text"
            value={tutor.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Sua cidade"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      <button
        onClick={salvarAlteracoes}
        disabled={salvando}
        className="mt-6 w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full transition flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        {salvando ? "Salvando..." : "Salvar alterações"}
      </button>
    </section>
  );
}
