"use client";

import PostMedia from "./PostMedia";
import { Heart, MessageCircle } from "lucide-react";

interface FeedListProps {
  posts: any[];
  onLike?: (postId: string) => void;
}

export default function FeedList({ posts, onLike }: FeedListProps) {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
        Nenhum post encontrado.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <div
          key={post.id}
          className="
            bg-white dark:bg-gray-900 
            rounded-3xl shadow-md 
            p-5 
            transition-all duration-300 
            hover:shadow-lg 
            border border-gray-100 dark:border-gray-800
          "
        >
          {/* 🐾 Cabeçalho do post */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={post.petAvatar}
              alt={post.petName}
              className="
                w-12 h-12 
                rounded-full 
                object-cover 
                ring-2 ring-teal-500/20 
                shadow-sm
              "
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {post.petName}
              </p>
              <p className="text-sm text-gray-500">{post.createdAt}</p>
            </div>
          </div>

          {/* 📝 Texto do post */}
          {post.content && (
            <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
              {post.content}
            </p>
          )}

          {/* 🎬 Imagens ou Vídeos */}
          {post.media && post.media.length > 0 && (
            <div
              className="
                mt-4 
                overflow-hidden 
                rounded-2xl 
                bg-white/30 dark:bg-gray-800/30 
                backdrop-blur-sm 
                p-2
              "
            >
              <PostMedia items={post.media} />
            </div>
          )}

          {/* 💬 Rodapé — ações */}
          <div
            className="
              flex justify-between items-center 
              mt-4 pt-3 
              border-t border-gray-100 dark:border-gray-800 
              text-gray-600 dark:text-gray-400 text-sm
            "
          >
            <button
              onClick={() => onLike?.(post.id)}
              className={`flex items-center gap-1 transition ${
                post?.liked ? "text-orange-500" : "hover:text-orange-500"
              }`}
            >
              <Heart size={18} className="stroke-[2px]" />
              <span>{post.likes ?? 0}</span>
            </button>

            <div className="flex items-center gap-1">
              <MessageCircle size={18} />
              <span>{post.comments ?? 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
