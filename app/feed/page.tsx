"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Composer from "@/components/Composer";
import FeedList from "@/components/FeedList";
import FriendsCarousel from "@/components/FriendsCarousel";
import { useFeed } from "@/context/FeedContext";

export default function FeedPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { posts, addPost, clearFeed, toggleLike } = useFeed();
  const loadedRef = useRef(false);

  // 🔹 Carrega posts do banco remoto (Neon)
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/api/posts", { cache: "no-store" });
        const data = await res.json();

        if (data.success) {
          clearFeed();
          data.posts.forEach((p: any) => addPost(p));
        }
      } catch (err) {
        console.error("❌ Erro ao carregar posts:", err);
      }
    };

    if (!loadedRef.current) {
      loadedRef.current = true;
      loadPosts();
    }

    // Atualização automática (a cada 15s)
    const interval = setInterval(() => loadPosts(), 15000);
    return () => clearInterval(interval);
  }, [addPost, clearFeed]);

  // 🔹 Criação de novo post
  const handleCreatePost = async (content: string, image?: File | string) => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para criar um post 🐾");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image instanceof File) formData.append("photo", image);
      else if (typeof image === "string") formData.append("photo", image);

      const res = await fetch("/api/posts", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        addPost(data.data);
      } else {
        console.error("❌ Erro ao criar post:", data.message || data.error);
      }
    } catch (err) {
      console.error("❌ Erro ao criar post:", err);
    }
  };

  return (
    <main
      className="
        flex-1 
        max-w-3xl 
        h-full 
        overflow-y-auto 
        custom-scroll 
        px-6 py-8 
        bg-gray-50 dark:bg-[#0d1b2a]
        rounded-3xl
        shadow-inner
      "
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          text-2xl font-bold 
          text-gray-800 dark:text-gray-100 
          mb-8 text-center
        "
      >
        🐾 Bem-vindo ao Mundo Pets!!!
      </motion.h1>

      {/* 🔹 Stories fixos */}
      <div className="sticky top-0 z-20 bg-gray-50/80 dark:bg-[#0d1b2a]/80 backdrop-blur-md pb-3 rounded-xl">
        <FriendsCarousel />
      </div>

      {/* 🔹 Criador de Post */}
      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Composer onPosted={handleCreatePost} />
        </motion.div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 my-6">
          🔐 Faça login para compartilhar momentos do seu pet!
        </p>
      )}

      {/* 🔹 Lista de Posts */}
      <section className="space-y-8">
        <FeedList
          posts={posts.map((p: any) => ({
            ...p,
            petAvatar: p.petAvatar || "/placeholder-pet.png",
            tutorAvatar:
              "tutorAvatar" in p && p.tutorAvatar
                ? p.tutorAvatar
                : "/placeholder-avatar.png",
          }))}
          onLike={toggleLike}
        />
      </section>
    </main>
  );
}
