"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface PostActionsProps {
  initialLikes?: number;
  initialComments?: number;
  onLike?: () => void;
  onComment?: () => void;
  postId?: string;
}

export default function PostActions({
  initialLikes = 0,
  initialComments = 0,
  onLike,
  onComment,
  postId,
}: PostActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => (newLiked ? prev + 1 : prev - 1));
    if (onLike) onLike();
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(shareUrl);
      alert("🔗 Link copiado para a área de transferência!");
    } catch {
      alert("❌ Não foi possível copiar o link.");
    }
  };

  return (
    <div className="flex justify-around py-3 text-gray-600 dark:text-gray-400 select-none">
      {/* ❤️ Curtir */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={toggleLike}
        className={`flex items-center gap-2 text-sm font-medium transition ${
          liked ? "text-teal-600" : "hover:text-teal-500"
        }`}
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            liked
              ? "fill-teal-600 text-teal-600 scale-110"
              : "text-gray-500 dark:text-gray-400"
          }`}
        />
        {likes} {likes === 1 ? "curtida" : "curtidas"}
      </motion.button>

      {/* 💬 Comentários */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={onComment}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
      >
        <MessageCircle className="w-5 h-5" />
        {initialComments} comentários
      </motion.button>

      {/* 🔗 Compartilhar */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleShare}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
      >
        <Share2 className="w-5 h-5" />
        Compartilhar
      </motion.button>
    </div>
  );
}
