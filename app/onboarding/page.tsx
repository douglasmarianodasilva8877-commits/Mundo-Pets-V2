"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function OnboardingPage() {
  const router = useRouter();
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("Cachorro");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Verifica login
  useEffect(() => {
    const tutor = localStorage.getItem("tutor");
    if (!tutor) router.push("/login");
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const savedTutor = localStorage.getItem("tutor");
      if (!savedTutor) throw new Error("Tutor não encontrado.");
      const tutor = JSON.parse(savedTutor);

      let avatarUrl = "";
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${tutor.id}-${Date.now()}.${fileExt}`;
        const filePath = `pets/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("pets")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("pets")
          .getPublicUrl(filePath);

        avatarUrl = publicUrl.publicUrl;
      }

      const response = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: petName,
          species,
          bio,
          avatarUrl,
          ownerId: tutor.id,
        }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar pet.");
      const pet = await response.json();
      localStorage.setItem("pet", JSON.stringify(pet));

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">🐾 Cadastre seu Pet</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium">Nome do Pet</label>
          <input
            type="text"
            required
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-transparent p-2 rounded mt-1 focus:ring-2 focus:ring-teal-500"
            placeholder="Ex: Thor, Luna..."
          />
        </div>

        <div>
          <label className="font-medium">Espécie</label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded mt-1 focus:ring-2 focus:ring-teal-500"
          >
            <option value="Cachorro">Cachorro 🐶</option>
            <option value="Gato">Gato 🐱</option>
            <option value="Outro">Outro 🐾</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Biografia</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded mt-1 h-24 resize-none focus:ring-2 focus:ring-teal-500"
            placeholder="Conte um pouco sobre seu pet..."
          />
        </div>

        <div>
          <label className="font-medium">Foto do Pet</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded mt-1"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Pré-visualização"
              className="w-32 h-32 object-cover rounded-full mt-3 mx-auto border-2 border-teal-400"
            />
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-semibold"
        >
          {loading ? "Cadastrando..." : "Cadastrar Pet"}
        </button>
      </form>
    </div>
  );
}
