"use client";

import React from "react";
import { Heart, MessageCircle, CheckCircle, RefreshCw } from "lucide-react";

interface PostCardProps {
  post: any;
  tutor?: any; // ✅ novo campo opcional
}

export default function PostCard({ post, tutor }: PostCardProps) {
  return (
    <article className="bg-white/90 dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm relative overflow-hidden">
      {/* 🟡 Destaque visual se o post estiver offline */}
      {post.offline && (
        <div className="absolute inset-0 bg-yellow-50/40 dark:bg-yellow-500/10 pointer-events-none animate-pulse" />
      )}

      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <img
          src={post.avatar}
          alt={post.author}
          className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-700"
        />
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            {post.author}
            {post.offline && (
              <span className="flex items-center gap-1 text-xs text-yellow-500 animate-pulse">
                <RefreshCw size={12} className="animate-spin-slow" />
                Aguardando sincronização
              </span>
            )}
          </div>

          {/* Tutor (dono do pet) — aparece abaixo do autor se existir */}
          {tutor && (
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              Tutor: {tutor.name}
            </div>
          )}

          {post.verifiedBy && (
            <div className="flex items-center gap-1 text-xs text-teal-500">
              <CheckCircle size={12} />
              Verificado por {post.verifiedBy}
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {post.createdAt}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 leading-relaxed relative z-10">
        {post.content}
      </p>

      {post.image && (
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-3 relative z-10">
          <img
            src={post.image}
            alt="post"
            className="w-full object-cover max-h-[420px]"
          />
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-6 text-gray-500 dark:text-gray-400 text-sm relative z-10">
        <button className="flex items-center gap-1 hover:text-teal-500 transition">
          <Heart size={16} /> {post.likes ?? 0}
        </button>
        <button className="flex items-center gap-1 hover:text-teal-400 transition">
          <MessageCircle size={16} /> {post.comments ?? 0}
        </button>
      </div>
    </article>
  );
}
