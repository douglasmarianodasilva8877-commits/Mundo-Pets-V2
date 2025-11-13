"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function EditarPetPage() {
  const { data: session, status } = useSession();
  const [pet, setPet] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      if (!session?.user?.email) return;
      const res = await fetch("/api/pets/by-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const data = await res.json();
      if (data.success) {
        setPet(data.pet);
        setPreview(data.pet.avatarUrl);
      }
      setLoading(false);
    };

    if (status === "authenticated") fetchPet();
  }, [status, session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setPet((p: any) => ({ ...p, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet || !session?.user?.email) return;

    setSaving(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("email", session.user.email);
    formData.append("name", pet.name);
    formData.append("species", pet.species);
    formData.append("bio", pet.bio);
    if (pet.file) formData.append("photo", pet.file);

    const res = await fetch("/api/pets/update", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setSaving(false);

    if (data.success) {
      setMessage("✅ Pet atualizado com sucesso!");
    } else {
      setMessage(`❌ ${data.message || "Erro ao atualizar pet."}`);
    }
  };

  if (loading) return <div className="p-6 text-center">🐾 Carregando...</div>;

  if (!pet)
    return (
      <div className="p-6 text-center">
        Nenhum pet encontrado. <a href="/criar-pet" className="text-blue-600 underline">Cadastrar agora</a>.
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-center mb-6">✏️ Editar Perfil do Pet</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                🐶
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            value={pet.name}
            onChange={(e) => setPet({ ...pet, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Espécie</label>
          <input
            type="text"
            value={pet.species}
            onChange={(e) => setPet({ ...pet, species: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={pet.bio}
            onChange={(e) => setPet({ ...pet, bio: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1 h-24 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>

        {message && (
          <div className="text-center mt-3 text-sm font-medium">
            {message}
          </div>
        )}

        <div className="text-center mt-4">
          <a
            href="/meu-pet"
            className="text-blue-600 underline"
          >
            ← Voltar ao perfil do pet
          </a>
        </div>
      </form>
    </div>
  );
}
