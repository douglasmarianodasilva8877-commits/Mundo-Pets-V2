"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PawPrint } from "lucide-react";

export default function CreatePetPage() {
  const router = useRouter();

  // Estados de formulário
  const [form, setForm] = useState({
    name: "",
    species: "",
    bio: "",
    email: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  // Manipula inputs genéricos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manipula imagem
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({ text: "⚠️ Selecione uma imagem válida.", type: "error" });
        return;
      }
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Validação básica
  const validateForm = () => {
    if (!form.name || !form.species || !form.email) {
      setMessage({ text: "Preencha todos os campos obrigatórios.", type: "error" });
      return false;
    }
    if (!form.email.includes("@")) {
      setMessage({ text: "Digite um e-mail válido.", type: "error" });
      return false;
    }
    return true;
  };

  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (photo) formData.append("photo", photo);

      const res = await fetch("/api/pet", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.pet) {
        setMessage({ text: "🐾 Pet cadastrado com sucesso!", type: "success" });
        setForm({ name: "", species: "", bio: "", email: "" });
        setPhoto(null);
        setPreview(null);
        setTimeout(() => router.push(`/pet/${data.pet.slug}`), 1200);
      } else {
        setMessage({ text: data.message || "Erro ao cadastrar o pet.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Erro no servidor. Tente novamente mais tarde.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1a27] via-[#12263a] to-[#183b57] text-white px-4">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-teal-400 text-center mb-2 flex items-center justify-center gap-2">
          <PawPrint className="w-8 h-8 text-teal-300" /> Cadastrar Pet
        </h1>
        <p className="text-sm text-center text-gray-300 mb-6">
          Compartilhe seu melhor amigo com o Mundo Pets 🌎
        </p>

        {message.text && (
          <p
            className={`text-center text-sm mb-4 ${
              message.type === "success" ? "text-teal-300" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Nome do Pet"
            value={form.name}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
          />

          <input
            name="species"
            type="text"
            placeholder="Espécie (Ex: cachorro, gato)"
            value={form.species}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
          />

          <textarea
            name="bio"
            placeholder="Bio do Pet (opcional)"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 resize-none focus:ring-2 focus:ring-teal-400 outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="E-mail do Tutor"
            value={form.email}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
          />

          {/* Upload da foto */}
          <div>
            <label className="block mb-2 text-sm text-gray-300 font-medium">
              Foto do Pet
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-200"
            />
            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Pré-visualização"
                  className="rounded-lg shadow-lg w-32 h-32 object-cover border border-white/20"
                />
              </div>
            )}
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar Pet"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
