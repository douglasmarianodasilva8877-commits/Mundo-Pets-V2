"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    petName: string;
    petAvatar: string;
    content: string;
    image?: string;
    createdAt: string;
    likes?: number;
    comments?: number;
    offline?: boolean;
    tutorName?: string;
    tutorAvatar?: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <article className="bg-white dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 transition hover:shadow-md">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.petAvatar || "/placeholder-pet.png"}
            alt={post.petName}
            className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              @{post.petName}
            </h3>
            <span className="text-xs text-gray-500">{post.createdAt}</span>

            {/* Tutor opcional */}
            {post.tutorName && (
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                👤 {post.tutorAvatar && (
                  <img
                    src={post.tutorAvatar}
                    alt={post.tutorName}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                Tutor: {post.tutorName}
              </div>
            )}
          </div>
        </div>

        <button className="p-2 text-gray-500 hover:text-teal-500 transition">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* Conteúdo */}
      <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full max-h-[500px] object-cover rounded-xl border border-gray-200 dark:border-gray-700 mb-3"
        />
      )}

      {/* Ações */}
      <footer className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 text-sm transition ${
            liked ? "text-teal-600" : "text-gray-500 hover:text-teal-600"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${liked ? "fill-teal-600 text-teal-600" : ""}`}
          />
          {likes} curtidas
        </button>

        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 transition">
          <MessageCircle className="w-4 h-4" />
          {post.comments || 0} comentários
        </button>
      </footer>

      {post.offline && (
        <p className="text-xs text-orange-400 mt-2 italic">
          ⚠️ Publicação pendente de sincronização
        </p>
      )}
    </article>
  );
}
