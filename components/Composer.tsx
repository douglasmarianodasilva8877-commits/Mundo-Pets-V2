"use client";

import React, { useState, useEffect } from "react";

interface ComposerProps {
  onPosted: (content: string, image?: string) => void; // 🔹 nome padronizado
  pet?: any;
}

export default function Composer({ onPosted, pet }: ComposerProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  // 🔄 Carregar posts do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mundo-pets-posts");
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  // 💾 Salvar posts sempre que mudarem
  useEffect(() => {
    localStorage.setItem("mundo-pets-posts", JSON.stringify(posts));
  }, [posts]);

  // 📸 Upload de imagem (mock/local)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file); // simula upload local
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      alert("❌ Falha ao processar imagem.");
    } finally {
      setUploading(false);
    }
  };

  // 🐾 Publicar post (local e online)
  const publish = async () => {
    if (!text.trim()) return;

    const newPost = {
      author: pet?.name || "Pet Anônimo 🐾",
      avatar: pet?.avatarUrl || "/placeholder-pet.png",
      content: text,
      image,
    };

    try {
      // 🔹 Envia para API (modo online)
      if (navigator.onLine) {
        await onPosted(text, image || undefined);
      }

      // 🔹 Modo offline ou fallback
      const localPost = {
        id: Date.now().toString(),
        createdAt: "agora mesmo",
        likes: 0,
        comments: 0,
        offline: !navigator.onLine,
        ...newPost,
      };

      setPosts((prev) => [localPost, ...prev]);
      setText("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Erro ao publicar:", error);
      alert("⚠️ Não foi possível publicar.");
    }
  };

  return (
    <div className="composer card bg-white/90 dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-sm mb-5">
      <div className="flex items-start gap-3">
        <img
          src={pet?.avatarUrl || "/placeholder-pet.png"}
          alt={pet?.name || "Pet"}
          className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-700"
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`O que ${pet?.name || "seu pet"} está pensando?`}
          className="flex-1 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-teal-500 outline-none"
          rows={3}
        />
      </div>

      {/* Preview da imagem */}
      {preview && (
        <div className="mt-3 relative">
          <img
            src={preview}
            alt="Pré-visualização"
            className="w-full max-h-72 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={() => {
              setPreview(null);
              setImage(null);
            }}
            className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full hover:bg-black transition"
          >
            ✕ Remover
          </button>
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center gap-3 mt-3">
        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          {uploading ? "⏳ Enviando..." : "📸 Adicionar imagem"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        <button
          onClick={publish}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full transition"
          disabled={uploading || !text.trim()}
        >
          {uploading ? "Enviando..." : "Publicar"}
        </button>
      </div>
    </div>
  );
}
