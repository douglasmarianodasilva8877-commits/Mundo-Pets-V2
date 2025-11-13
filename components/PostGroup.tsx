"use client";
import { motion } from "framer-motion";
import PostCard from "./PostCard";

export default function PostGroup({ group }) {
  return (
    <motion.section
      whileHover={{ scale: 1.005 }}
      className="bg-white/70 dark:bg-[#142635]/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-5 shadow-sm"
    >
      {/* Cabeçalho do pet */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={group.petAvatar}
          alt={group.petName}
          className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/40"
        />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {group.petName}
        </h2>
      </div>

      {/* Posts internos */}
      <div className="flex flex-col gap-3">
        {group.posts.map((post) => (
          <div
            key={post.id}
            className="bg-white/80 dark:bg-[#193447]/60 rounded-xl p-3 transition-all"
          >
            {post.content && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                {post.content}
              </p>
            )}
            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="rounded-xl w-full max-h-[260px] object-cover"
              />
            )}
            <p className="text-xs text-gray-400 mt-1">{post.createdAt}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
