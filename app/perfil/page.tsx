"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Composer from "@/components/Composer";
import PostCard from "@/components/PostCard";
import { useFeed } from "@/context/FeedContext";

export default function PerfilPage() {
  const { posts, addPost } = useFeed();
  const [pet, setPet] = useState<any>(null);

  useEffect(() => {
    const storedPet = {
      name: "Luna",
      avatar: "/placeholder-pet.png",
      bio: "Amante de brinquedos e sonecas ao sol ☀️",
      followers: 120,
      following: 89,
    };
    setPet(storedPet);
  }, []);

  // ✅ Criação de post compatível com FeedContext
  const handlePosted = async (content: string, image?: string | File) => {
    let imageUrl: string | undefined;

    if (image instanceof File) {
      imageUrl = URL.createObjectURL(image);
    } else if (typeof image === "string") {
      imageUrl = image;
    }

    const newPost = {
      id: Date.now().toString(),
      petName: pet?.name || "Pet Anônimo 🐾",
      petAvatar: pet?.avatar || "/placeholder-pet.png",
      content,
      media: imageUrl ?? undefined, // FeedContext espera string
      createdAt: "agora mesmo",
      likes: 0,
      comments: 0,
    };

    addPost(newPost);
  };

  if (!pet) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Carregando perfil...
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-8 bg-gray-50 dark:bg-[#0d1b2a] rounded-3xl shadow-inner">
      {/* Cabeçalho do perfil */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <img
          src={pet.avatar}
          alt={pet.name}
          className="w-24 h-24 rounded-full mx-auto border-4 border-orange-400 shadow-md"
        />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">
          {pet.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{pet.bio}</p>

        <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span>
            <strong className="text-gray-800 dark:text-gray-100">
              {pet.followers}
            </strong>{" "}
            seguidores
          </span>
          <span>
            <strong className="text-gray-800 dark:text-gray-100">
              {pet.following}
            </strong>{" "}
            seguindo
          </span>
        </div>
      </motion.div>

      {/* Criador de post */}
      <Composer onPosted={handlePosted} pet={pet} />

      {/* Lista de posts */}
      <div className="space-y-5 mt-8">
        {posts
          .filter((post) => post.petName === pet.name)
          .map((post) => (
            // ✅ Conversão segura: PostCard espera media: any[]
            <PostCard
              key={post.id}
              post={{
                ...post,
                media: post.media
                  ? Array.isArray(post.media)
                    ? post.media
                    : [post.media]
                  : [],
              }}
            />
          ))}
      </div>
    </main>
  );
}
