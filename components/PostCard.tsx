// components/PostCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import PostMedia from "./PostMedia";

import { useComments } from "@/hooks/useComments";
import { Comments } from "@/components/comments/Comments";
import { CommentInput } from "@/components/comments/CommentInput";
import LikeButton from "@/components/LikeButton";

interface PostCardProps {
  post: {
    id: string;
    petId?: string;
    petName?: string;
    petAvatar?: string;
    createdAt?: string;
    content?: string;
    media?: { url?: string; src?: string; type?: "image" | "video" }[] | string[];
    likes?: number;
    comments?: number;
    liked?: boolean;
  };
  userId: string;
}

export default function PostCard({ post, userId }: PostCardProps) {
  const { comments, loading, addComment } = useComments(post.id, userId);

  // 🔵 Normaliza avatar sempre para /file
  const petAvatar = React.useMemo(() => {
    const avatar = post?.petAvatar || "/placeholder-pet.png";

    // Corrige casos como: "thor_pet.webp"
    if (!avatar.startsWith("/")) return `/${avatar}`;
    return avatar;
  }, [post?.petAvatar]);

  // 🔵 Normalização da mídia
  const mediaList = React.useMemo(() => {
    if (!post?.media) return [];

    return (post.media as any[]).map((m, index) => {
      const src = typeof m === "string" ? m : m.url ?? m.src ?? "";

      // Normaliza arquivos do /public
      const finalSrc = src.startsWith("/") ? src : `/${src}`;

      const type =
        m?.type ||
        (finalSrc.endsWith(".mp4") ||
        finalSrc.endsWith(".mov") ||
        finalSrc.endsWith(".webm")
          ? "video"
          : "image");

      return {
        id: `${post.id}-${index}`,
        src: finalSrc,
        type,
      };
    });
  }, [post]);

  return (
    <motion.article
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="bg-white/80 dark:bg-[#15283a]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 sm:p-5 transition-all"
    >
      {/* HEADER */}
      <Link
        href={`/pet/${post.petId ?? (post.petName?.toLowerCase().replace(/\s+/g, "-") ?? "pet")}`}
        className="flex items-center gap-3 mb-3 hover:opacity-90 transition"
      >
        <img
          src={petAvatar}
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

      {/* TEXTO */}
      {post?.content && (
        <p className="text-gray-700 dark:text-gray-300 mb-3 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* MÍDIA */}
      {mediaList.length > 0 && (
        <div className={`mt-2 mb-3 ${mediaList.length > 1 ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : ""}`}>
          <PostMedia items={mediaList} />
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
        <LikeButton postId={post.id} initialLiked={post.liked ?? false} initialCount={post.likes ?? 0} />

        <div className="flex items-center gap-1">
          <MessageCircle size={18} />
          <span>{comments.length}</span>
        </div>
      </div>

      {/* COMENTÁRIOS */}
      <div className="mt-3 pt-3 border-t border-gray-200/40 dark:border-gray-700/40">
        <Comments comments={comments} loading={loading} />

        <div className="mt-3">
          <CommentInput
            onSubmit={async (text) => addComment(text)}
            placeholder="Escreva um comentário..."
          />
        </div>
      </div>
    </motion.article>
  );
}
