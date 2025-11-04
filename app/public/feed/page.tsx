"use client";

import React, { useEffect, useState } from "react";
import Composer from "@/components/Composer";
import PostCard from "@/components/feed/PostCard";

export default function HomePageClient() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Carrega posts do servidor
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 🔹 Cria novo post
  const handleNewPost = async (content: string, image?: string) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petName: "Rex 🐾",
          petAvatar: "/dog1.jpg",
          content,
          image,
        }),
      });

      const result = await res.json();
      if (result?.data) {
        setPosts((prev) => [result.data, ...prev]);
      }
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
  };

  return (
    <>
      {/* 🔹 Cabeçalho */}
      <header className="navbar flex justify-between items-center px-6 py-3 bg-black/80 backdrop-blur-md shadow-lg border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src="/logo-mundo-pets.png"
            alt="Logo Mundo Pets"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-bold text-[#00fff2] tracking-wide">
            Mundo <span className="text-[#ff7b00]">Pets</span>
          </h1>
        </div>

        <button className="px-4 py-2 bg-[#ff7b00] text-white rounded-full hover:bg-[#ff9b33] transition-all duration-300 shadow-md">
          Perfil
        </button>
      </header>

      {/* 🔹 Feed */}
      <main className="feed p-4 max-w-2xl mx-auto space-y-5 mt-6">
        <Composer onPosted={handleNewPost} />

        {loading ? (
          <p className="text-center text-gray-400">Carregando posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400">Nenhum post ainda 🐾</p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => {
              const formattedPost = {
                ...post,
                petName: post.author || "Pet Anônimo",
                petAvatar: post.avatar || "/default-pet.png",
              };

              return <PostCard key={post.id} post={formattedPost} />;
            })}
          </div>
        )}
      </main>
    </>
  );
}
