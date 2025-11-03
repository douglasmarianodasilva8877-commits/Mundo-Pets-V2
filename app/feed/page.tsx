"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PawPrint, PlusCircle } from "lucide-react";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const router = useRouter();

  // 🔹 Busca os posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setPosts(data.posts || []);
      } catch (err: any) {
        console.error("Erro ao carregar posts:", err);
        setStatus("❌ Erro ao carregar feed");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 🔹 Cria nova postagem
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() && !photo) return;

    setStatus("Publicando...");
    const formData = new FormData();
    formData.append("content", newPost);
    if (photo) formData.append("photo", photo);

    try {
      const res = await fetch("/api/posts", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPosts((prev) => [data.post, ...prev]);
      setNewPost("");
      setPhoto(null);
      setPreview(null);
      setStatus("✅ Post publicado!");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ " + err.message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-teal-600" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4">
      <h1 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <PawPrint className="w-5 h-5 text-teal-600" />
        Mundo Pets Feed
      </h1>

      {/* Criar novo post */}
      <form onSubmit={handlePostSubmit} className="mb-8 bg-white dark:bg-[#0d1a27] p-4 rounded-xl shadow-md">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="O que seu pet está pensando hoje? 🐾"
          className="w-full border rounded-lg p-3 text-gray-800 dark:text-gray-100 dark:bg-[#102030] focus:ring-2 focus:ring-teal-500 mb-3"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPhoto(file || null);
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
        {preview && (
          <img src={preview} className="mt-3 rounded-lg w-full object-cover" alt="Preview" />
        )}

        <button
          type="submit"
          className="mt-3 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg w-full transition"
        >
          <PlusCircle className="w-4 h-4" />
          Publicar
        </button>

        {status && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{status}</p>
        )}
      </form>

      {/* Lista de posts */}
      <div className="flex flex-col gap-4">
        {posts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Nenhuma publicação ainda. Que tal começar agora? 🐶
          </p>
        )}

        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-[#0d1a27] p-4 rounded-xl shadow-md">
            {post.photoUrl && (
              <img
                src={post.photoUrl}
                alt={post.content.slice(0, 20)}
                className="w-full h-64 object-cover rounded-lg mb-3"
              />
            )}
            <p className="text-gray-800 dark:text-gray-100">{post.content}</p>
            <span className="text-xs text-gray-500 block mt-2">
              🐾 {post.pet?.name || "Pet"} - {new Date(post.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
