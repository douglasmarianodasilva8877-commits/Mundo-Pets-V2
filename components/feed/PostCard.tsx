"use client";

import CommentSection from "./CommentSection";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  petName: string;
  petAvatar: string;
  content: string;
  createdAt: string;
  image?: string;
  likes?: number;
  comments?: number;
  offline?: boolean;
  tutorName?: string | null;
  tutorAvatar?: string | null;
};

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3 transition-all hover:shadow-md">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/pet/${post.petName}`)}
            className="focus:outline-none"
          >
            <img
              src={post.petAvatar || "/placeholder-pet.png"}
              alt={post.petName}
              className="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-teal-400 transition"
            />
          </button>

          <div>
            <span
              onClick={() => router.push(`/pet/${post.petName}`)}
              className="font-semibold text-sm text-gray-800 cursor-pointer hover:text-teal-600"
            >
              @{post.petName}
            </span>
            <div className="text-xs text-gray-500">{post.createdAt}</div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <p className="text-gray-700 text-sm">{post.content}</p>

      {/* Imagem */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="rounded-xl w-full object-cover max-h-80"
        />
      )}

      {/* Ações */}
      <div className="flex justify-around text-gray-500 text-sm pt-2 border-t border-gray-100">
        <button className="hover:text-teal-600 transition">Curtir ❤️</button>
        <button className="hover:text-teal-600 transition">Comentar 💬</button>
        <button className="hover:text-teal-600 transition">Compartilhar 🔄</button>
      </div>

      {/* Comentários */}
      <CommentSection postId={post.id.toString()} />
    </div>
  );
}
