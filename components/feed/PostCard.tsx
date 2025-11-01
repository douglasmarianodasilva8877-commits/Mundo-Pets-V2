"use client";
import CommentSection from "./CommentSection";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  petName: string;
  petImage: string;
  tutorImage: string;
  content: string;
  createdAt: string;
  image?: string;
};

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3 transition-all hover:shadow-md">
      {/* Header: Pet + Tutor */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* 🔗 PET - clique para abrir o perfil */}
          <button
            onClick={() => router.push(`/pet/${post.petName}`)}
            className="focus:outline-none"
          >
            <img
              src={post.petImage}
              alt={post.petName}
              className="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-blue-400 transition"
            />
          </button>

          <div>
            <span
              onClick={() => router.push(`/pet/${post.petName}`)}
              className="font-semibold text-sm text-gray-800 cursor-pointer hover:text-blue-600"
            >
              @{post.petName}
            </span>

            {/* Tutor */}
            <div className="flex items-center space-x-2 mt-1">
              <button
                onClick={() => router.push(`/tutor/${post.petName}`)}
                className="focus:outline-none"
              >
                <img
                  src={post.tutorImage}
                  alt="Tutor"
                  className="w-5 h-5 rounded-full object-cover border border-gray-300 hover:ring-2 hover:ring-blue-300 transition"
                />
              </button>
              <span className="text-xs text-gray-500">Tutor verificado</span>
            </div>
          </div>
        </div>

        <span className="text-xs text-gray-400">{post.createdAt}</span>
      </div>

      {/* Conteúdo */}
      <p className="text-gray-700 text-sm">{post.content}</p>

      {/* Imagem do post */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="rounded-xl w-full object-cover max-h-80"
        />
      )}

      {/* Ações */}
      <div className="flex justify-around text-gray-500 text-sm pt-2 border-t border-gray-100">
        <button className="hover:text-blue-600 transition">Curtir ❤️</button>
        <button className="hover:text-blue-600 transition">Comentar 💬</button>
        <button className="hover:text-blue-600 transition">Compartilhar 🔄</button>
      </div>

      {/* Comentários */}
      <CommentSection postId={post.id.toString()} />
    </div>
  );
}
