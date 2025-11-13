"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { useFeed } from "@/context/FeedContext";
import PostMedia from "./PostMedia";

// ✅ Tipagem precisa e compatível com PostMedia
interface MediaItem {
  id: string;
  src: string;
  type: "image" | "video";
}

interface PostCardProps {
  post: {
    id: string;
    petId?: string;
    petName?: string;
    petAvatar?: string;
    createdAt?: string;
    content?: string;
    media?: any[];
    mediaType?: "image" | "video";
    likes?: number;
    comments?: number;
    liked?: boolean;
  };
}

/**
 * 🐾 PostCard — Componente visual e interativo para posts do feed.
 * Corrigido para compatibilidade total de tipos e máxima estabilidade.
 */
export default function PostCard({ post }: PostCardProps) {
  const { toggleLike } = useFeed();

  // ✅ Conversão precisa para o formato esperado por PostMedia
  const mediaList = React.useMemo<MediaItem[]>(() => {
    if (!post || !Array.isArray(post.media)) return [];

    return post.media.map((m: any, index: number) => {
      if (typeof m === "string") {
        return {
          id: `${post.id}-${index}`,
          src: m,
          type: post.mediaType || "image",
        };
      }
      return {
        id: `${post.id}-${index}`,
        src: m.url || "",
        type: m.type || "image",
      };
    });
  }, [post]);

  return (
    <motion.article
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="
        bg-white/80 dark:bg-[#15283a]/80 
        backdrop-blur-md border border-gray-200 dark:border-gray-700 
        rounded-2xl shadow-sm p-4 sm:p-5 transition-all
      "
    >
      {/* 🐾 Cabeçalho */}
      <Link
        href={`/pet/${
          post.petId ||
          post.petName?.toLowerCase()?.replace(/\s+/g, "-") ||
          "pet"
        }`}
        className="flex items-center gap-3 mb-3 hover:opacity-90 transition"
      >
        <img
          src={post?.petAvatar || "/placeholder-pet.png"}
          alt={post?.petName || "Pet"}
          className="w-12 h-12 rounded-full object-cover border-2 border-orange-200 dark:border-teal-700 shadow-sm"
        />
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 leading-tight">
            {post?.petName || "Pet Anônimo"}
          </h3>
          <p className="text-xs text-gray-400">{post?.createdAt}</p>
        </div>
      </Link>

      {/* 📝 Texto */}
      {post?.content && (
        <p className="text-gray-700 dark:text-gray-300 mb-3 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* 🎬 Mídia */}
      {mediaList.length > 0 && (
        <div
          className={`mt-2 mb-3 ${
            mediaList.length > 1 ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : ""
          }`}
        >
          {/* ✅ Corrigido: envia items no formato correto */}
          <PostMedia items={mediaList} />
        </div>
      )}

      {/* 💬 Rodapé */}
      <div
        className="
          flex items-center justify-between 
          text-sm text-gray-500 dark:text-gray-400 mt-2 pt-2
          border-t border-gray-200/50 dark:border-gray-700/50
        "
      >
        {/* ❤️ Curtir */}
        <button
          onClick={() => toggleLike?.(post?.id)}
          className={`flex items-center gap-1 transition ${
            post?.liked ? "text-orange-500" : "hover:text-orange-500"
          }`}
          aria-label="Curtir"
        >
          <Heart
            size={18}
            className={`stroke-[2.2px] ${post?.liked ? "fill-orange-500" : ""}`}
          />
          <span>{post?.likes ?? 0}</span>
        </button>

        {/* 💬 Comentários */}
        <div className="flex items-center gap-1">
          <MessageCircle size={18} />
          <span>{post?.comments ?? 0}</span>
        </div>
      </div>
    </motion.article>
  );
}
