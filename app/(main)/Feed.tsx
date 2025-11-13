"use client";

import { useFeed } from "@/context/FeedContext";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import { useEffect } from "react";

export default function Feed() {
  const { groupedPosts, clearFeed } = useFeed();

  // 🔹 Animação de entrada suave no carregamento
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!groupedPosts.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-400 py-10">
        <p className="text-lg">🐾 Nenhum post encontrado</p>
        <p className="text-sm">Crie o primeiro post do seu pet!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full px-3 sm:px-0">
      {groupedPosts.map((group) => (
        <motion.section
          key={group.petName}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/70 dark:bg-[#142635]/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm p-5 transition-all"
        >
          {/* Cabeçalho do Pet */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={group.petAvatar}
              alt={group.petName}
              className="w-14 h-14 rounded-full object-cover border-2 border-orange-200 dark:border-teal-700"
            />
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                {group.petName}
              </h2>
              <p className="text-xs text-gray-400">
                {group.posts.length}{" "}
                {group.posts.length === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>

          {/* Posts internos do pet */}
          <div className="space-y-5">
            {group.posts.map((post) => {
              // ✅ Conversão segura de media para array
              const safePost = {
                ...post,
                media:
                  typeof post.media === "string"
                    ? (() => {
                        try {
                          const parsed = JSON.parse(post.media);
                          return Array.isArray(parsed) ? parsed : [parsed];
                        } catch {
                          return [post.media];
                        }
                      })()
                    : post.media,
              };

              return <PostCard key={post.id} post={safePost} />;
            })}
          </div>
        </motion.section>
      ))}

      {/* Botão opcional de limpar feed */}
      {/* <button
        onClick={clearFeed}
        className="text-xs text-gray-400 hover:text-red-500 underline self-center mt-6"
      >
        Limpar Feed
      </button> */}
    </div>
  );
}
