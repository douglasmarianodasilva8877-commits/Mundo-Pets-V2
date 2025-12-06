"use client";

import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Post.tsx
 * - Versão "detalhe" / exibição de post reutilizável.
 * - Recebe objeto post com campos clássicos.
 */

export default function Post({
  post,
  onLike,
  onComment,
}: {
  post: {
    id: string;
    petName?: string;
    petAvatar?: string;
    createdAt?: string;
    content?: string;
    media?: { src: string; type?: "image" | "video" }[];
    likes?: number;
    comments?: number;
    liked?: boolean;
  };
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
}) {
  if (!post) return null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="bg-white/80 dark:bg-[#091017]/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.petAvatar || "/placeholder-pet.png"}
          alt={post.petName || "Pet"}
          className="w-12 h-12 rounded-full object-cover border-2 border-orange-200 dark:border-teal-700"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold">{post.petName || "Pet Anônimo"}</h4>
              <p className="text-xs text-gray-400">{post.createdAt}</p>
            </div>
            {/* placeholder para menu de opções */}
            <div className="text-gray-400 text-sm">...</div>
          </div>
        </div>
      </div>

      {post.content && (
        <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* media */}
      {post.media && post.media.length > 0 && (
        <div className={`mb-3 ${post.media.length > 1 ? "grid grid-cols-2 gap-2" : ""}`}>
          {post.media.map((m, i) =>
            m.type === "video" ? (
              <video
                key={i}
                src={m.src}
                controls
                className="w-full rounded-xl max-h-[480px] object-cover"
              />
            ) : (
              <img
                key={i}
                src={m.src}
                alt={`media-${i}`}
                className="w-full rounded-xl max-h-[480px] object-cover"
              />
            )
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
        <button
          onClick={() => onLike && onLike(post.id)}
          className={`flex items-center gap-2 ${post.liked ? "text-orange-500" : "hover:text-orange-500"}`}
        >
          <Heart className="w-5 h-5" />
          <span>{post.likes ?? 0}</span>
        </button>

        <div className="flex items-center gap-4">
          <button onClick={() => onComment && onComment(post.id)} className="flex items-center gap-1">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments ?? 0}</span>
          </button>

          <button className="flex items-center gap-1">
            <Share2 className="w-5 h-5" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
