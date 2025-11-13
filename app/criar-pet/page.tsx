"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CriarPetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (status === "loading") return <div className="p-6 text-center">🐾 Verificando login...</div>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !species || !bio) {
      setMessage("⚠️ Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("species", species);
    formData.append("bio", bio);
    formData.append("email", session?.user?.email || "");
    if (file) formData.append("photo", file);

    const res = await fetch("/api/pets", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setMessage("✅ Pet cadastrado com sucesso!");
      setTimeout(() => router.push("/meu-pet"), 1200);
    } else {
      setMessage(`❌ ${data.message || "Erro ao cadastrar pet."}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-center mb-6">🐶 Cadastrar Novo Pet</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Foto do Pet */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-400 shadow">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                🐾
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-3 text-sm text-gray-700"
          />
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Pet</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Espécie */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Espécie</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="Ex: cachorro, gato, coelho..."
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio do Pet</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fale um pouco sobre seu pet..."
            className="w-full border border-gray-300 rounded-lg p-2 mt-1 h-24 resize-none"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          {loading ? "Cadastrando..." : "Cadastrar Pet"}
        </button>

        {/* Mensagem */}
        {message && (
          <div className="text-center mt-3 text-sm font-medium">
            {message}
          </div>
        )}

        <div className="text-center mt-4">
          <a href="/feed" className="text-blue-600 underline">
            ← Voltar ao Feed
          </a>
        </div>
      </form>
    </div>
  );
}
