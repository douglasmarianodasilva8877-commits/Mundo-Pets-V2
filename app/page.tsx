"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Composer from "@/components/Composer";
import PostCard from "@/components/PostCard";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tutor, setTutor] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔒 Redireciona se não estiver logado
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // 🧍 Carrega tutor da sessão ou do localStorage
  useEffect(() => {
    if (session?.user) {
      setTutor({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image || "/placeholder-pet.png",
      });
    } else {
      const savedTutor = localStorage.getItem("tutor");
      if (savedTutor) setTutor(JSON.parse(savedTutor));
    }
  }, [session]);

  // 🐾 Carregar posts salvos localmente
  useEffect(() => {
    const saved = localStorage.getItem("mundo-pets-posts");
    if (saved) setPosts(JSON.parse(saved));
    setLoading(false);
  }, []);

  // 💾 Atualiza localStorage quando houver novos posts
  useEffect(() => {
    localStorage.setItem("mundo-pets-posts", JSON.stringify(posts));
  }, [posts]);

  // 🔄 Sincroniza posts offline quando volta a conexão
  useEffect(() => {
    const syncOfflinePosts = async () => {
      const offlinePosts = posts.filter((p) => p.offline);
      if (!offlinePosts.length) return;

      for (const post of offlinePosts) {
        try {
          const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...post, offline: false }),
          });
          if (res.ok) post.offline = false;
        } catch (err) {
          console.warn("Falha ao sincronizar post offline:", err);
        }
      }
      setPosts([...posts]);
    };

    window.addEventListener("online", syncOfflinePosts);
    return () => window.removeEventListener("online", syncOfflinePosts);
  }, [posts]);

  // ✏️ Criar novo post
  const handleCreate = async (content: string, image?: string) => {
    const newPost = {
      id: Date.now().toString(),
      author: tutor?.name || "Você 🐾",
      avatar: tutor?.avatar || "/placeholder-pet.png",
      content,
      image,
      createdAt: "agora mesmo",
      likes: 0,
      comments: 0,
      offline: !navigator.onLine,
    };

    setPosts((prev) => [newPost, ...prev]);

    if (navigator.onLine) {
      try {
        await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPost),
        });
      } catch (err) {
        console.warn("⚠️ Falha ao enviar post:", err);
      }
    }
  };

  if (status === "loading")
    return (
      <div className="text-center text-gray-400 mt-10">
        Verificando login...
      </div>
    );

  return (
    <section className="flex flex-col gap-5 max-w-[680px] mx-auto w-full">
      {/* 👋 Saudação e avatar */}
      {session?.user && (
        <div className="flex items-center justify-between px-2 sm:px-0">
          <h1 className="text-2xl font-semibold text-teal-600">
            Olá, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <img
            src={session.user.image || "/placeholder-pet.png"}
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        </div>
      )}

      {/* 🐾 Criar post */}
      <Composer onPosted={handleCreate} />

      {/* 📜 Feed de posts */}
      {loading ? (
        <div className="text-center text-gray-400">Carregando feed...</div>
      ) : posts.length > 0 ? (
        <div className="space-y-5">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-10">
          Nenhum post ainda 🐾 — seja o primeiro!
        </div>
      )}
    </section>
  );
}
