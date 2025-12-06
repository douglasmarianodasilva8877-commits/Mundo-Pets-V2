// components/FeedList.tsx
"use client";

import PostMedia from "./PostMedia";
import Link from "next/link";

interface Post {
  id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  author: {
    id: string;
    name: string;
    avatar_url?: string | null;
  };
}

export default function FeedList({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        Nenhum post encontrado.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4"
        >
          {/* Header do autor */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={post.author.avatar_url || "/avatar-default.png"}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <Link
                href={`/profile/${post.author.id}`}
                className="font-semibold text-gray-800 dark:text-gray-200"
              >
                {post.author.name}
              </Link>
              <p className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <p className="text-gray-800 dark:text-gray-300 mb-3 whitespace-pre-line">
            {post.content}
          </p>

          {/* Imagem / Carrossel */}
          {post.image_url && (
            <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <PostMedia src={post.image_url} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
