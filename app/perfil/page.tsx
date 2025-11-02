"use client";

import React, { useEffect, useState } from "react";
import Composer from "@/components/Composer";
import PostCard from "@/components/PostCard";
import { Camera, Edit3 } from "lucide-react";

export default function PerfilPage() {
  const [pet, setPet] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const savedPet = localStorage.getItem("mundo-pets-pet");
    const savedPosts = localStorage.getItem("mundo-pets-posts");
    if (savedPet) setPet(JSON.parse(savedPet));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  }, []);

  const handlePosted = (content: string, image?: string) => {
    const newPost = {
      id: Date.now(),
      author: pet?.name || "Pet Anônimo 🐾",
      avatar: pet?.avatarUrl || "/placeholder-pet.png",
      content,
      image,
      createdAt: "agora mesmo",
      likes: 0,
      comments: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    localStorage.setItem(
      "mundo-pets-posts",
      JSON.stringify([newPost, ...posts])
    );
  };

  return (
    <section className="max-w-2xl mx-auto p-4 mt-8">
      {pet ? (
        <>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative">
              <img
                src={pet.avatarUrl || "/placeholder-pet.png"}
                alt={pet.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow-md"
              />
              <button
                className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full shadow-md hover:bg-teal-600 transition"
                title="Alterar foto"
              >
                <Camera size={16} />
              </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-3">
              {pet.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {pet.species || "Pet"} — {pet.age || "idade não informada"}
            </p>

            <button className="mt-3 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-sm rounded-full flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition">
              <Edit3 size={14} /> Editar Perfil
            </button>
          </div>

          <Composer onPosted={handlePosted} pet={pet} />

          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} tutor={{ name: pet.tutor }} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400">
          Nenhum pet cadastrado. Vá para <strong>“Meu Pet”</strong> para criar o
          perfil do seu bichinho 🐾
        </p>
      )}
    </section>
  );
}
