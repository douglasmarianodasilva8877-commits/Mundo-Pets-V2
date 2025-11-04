"use client";

import React, { useEffect, useState } from "react";
import { Loader2, PawPrint } from "lucide-react";
import Composer from "@/components/Composer";
import PostCard from "@/components/feed/PostCard";

interface Post {
  id: string;
  petName: string;
  petAvatar: string;
  content: string;
  image?: string;
  createdAt: string;
  likes?: number;
  comments?: number;
  offline?: boolean;
  tutorName?: string;   // 🧍 opcional: nome do tutor
  tutorAvatar?: string; // 🧍 opcional: avatar do tutor
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // 🐶 Pet logado (mock temporário)
  const pet = {
    name: "Rex",
    avatarUrl: "/avatars/avatars-dog2.png",
    tutorName: "Douglas",
    tutorAvatar: "/avatars/tutor-douglas.png",
  };

  // 🔹 Dados de exemplo
  const SAMPLE: Post[] = [
    {
      id: "1",
      petName: "Rex",
      petAvatar: "/avatars/avatars-dog2.png",
      content: "Aproveitando o dia ensolarado no parque! ☀️🐾",
      image: "/posts/rex-park.jpg",
      createdAt: "há 2 horas",
      likes: 5,
      comments: 1,
      tutorName: "Douglas",
      tutorAvatar: "/avatars/tutor-douglas.png",
    },
    {
      id: "2",
      petName: "Luna",
      petAvatar: "/avatars/avatars-cat1.png",
      content: "Hora da soneca depois do petisco 😸💤",
      image: "/posts/luna-nap.jpg",
      createdAt: "há 4 horas",
      likes: 8,
      comments: 3,
      tutorName: "Carla",
      tutorAvatar: "/avatars/tutor-carla.png",
    },
  ];

  // 🔹 Carrega posts da API ou cache local
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);

        if (navigator.onLine) {
          const res = await fetch("/api/posts");
          const data = await res.json();

          if (!res.ok) throw new Error(data.message);
          setPosts(data.posts?.length ? data.posts : SAMPLE);
          localStorage.setItem(
            "mundo-pets-feed",
            JSON.stringify(data.posts || SAMPLE)
          );
        } else {
          const local = localStorage.getItem("mundo-pets-feed");
          if (local) setPosts(JSON.parse(local));
          else setPosts(SAMPLE);
        }
      } catch (err: any) {
        console.error("Erro ao carregar feed:", err);
        setStatus("⚠️ Não foi possível carregar o feed.");
        setPosts(SAMPLE);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // 🐾 Novo post criado
  const handlePosted = (content: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      petName: pet.name,
      petAvatar: pet.avatarUrl,
      content,
      image,
      createdAt: "agora mesmo",
      likes: 0,
      comments: 0,
      offline: !navigator.onLine,
      tutorName: pet.tutorName,
      tutorAvatar: pet.tutorAvatar,
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("mundo-pets-feed", JSON.stringify(updatedPosts));
    setStatus("✅ Post publicado!");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-teal-600" />
      </div>
    );

  return (
    <main className="max-w-2xl mx-auto mt-24 p-4 space-y-6">
      <h1 className="text-2xl font-semibold flex items-center gap-2 mb-2">
        <PawPrint className="w-5 h-5 text-teal-600" />
        Feed do Mundo Pets
      </h1>

      {/* Criador de post */}
      <Composer onPosted={handlePosted} pet={pet} />

      {/* Feed */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          Nenhuma publicação ainda. Que tal começar agora? 🐶
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {status && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
          {status}
        </p>
      )}
    </main>
  );
}
