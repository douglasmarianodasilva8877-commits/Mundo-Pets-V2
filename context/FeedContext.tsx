"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Post = {
  id: string;
  petName: string;
  petAvatar: string;
  content: string;
  media?: string; // imagem ou vídeo
  mediaType?: "image" | "video";
  createdAt: string;
  likes: number;
  comments: number;
  liked?: boolean;
  offline?: boolean;
};

type GroupedPost = {
  petName: string;
  petAvatar: string;
  posts: Post[];
};

type FeedContextType = {
  posts: Post[];
  groupedPosts: GroupedPost[];
  addPost: (post: Omit<Post, "id" | "createdAt">) => Promise<void>;
  toggleLike: (postId: string) => void;
  addComment: (postId: string) => void;
  clearFeed: () => void;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [groupedPosts, setGroupedPosts] = useState<GroupedPost[]>([]);

  // 🔹 Agrupa posts por pet
  const groupPostsByPet = (posts: Post[]): GroupedPost[] => {
    const grouped: Record<string, Post[]> = {};

    posts.forEach((post) => {
      const key = post.petName || "Desconhecido";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(post);
    });

    return Object.entries(grouped).map(([petName, petPosts]) => ({
      petName,
      petAvatar: petPosts[0]?.petAvatar || "",
      posts: petPosts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }));
  };

  // 🔹 Função para buscar posts
  const fetchPosts = async () => {
    try {
      if (navigator.onLine) {
        const res = await fetch("/api/posts");
        const data = await res.json();

        if (data.success && Array.isArray(data.posts)) {
          // Garante compatibilidade com vídeos e imagens
          const formatted = data.posts.map((p: any) => ({
            ...p,
            media: p.media || p.image || "",
            mediaType: p.mediaType || (p.image?.endsWith(".mp4") ? "video" : "image"),
          }));

          setPosts(formatted);
          localStorage.setItem("mundo-pets-feed", JSON.stringify(formatted));
        } else {
          console.warn("⚠️ Erro ao buscar posts:", data.message);
        }
      } else {
        console.warn("⚠️ Offline — carregando posts locais.");
        const saved = localStorage.getItem("mundo-pets-feed");
        if (saved) setPosts(JSON.parse(saved));
      }
    } catch (err) {
      console.error("❌ Erro ao carregar posts:", err);
      const saved = localStorage.getItem("mundo-pets-feed");
      if (saved) setPosts(JSON.parse(saved));
    }
  };

  // 🔹 Carrega posts apenas uma vez
  useEffect(() => {
    fetchPosts();
  }, []); // ✅ Executa apenas uma vez

  // 🔹 Atualiza cache local e grupos sempre que o feed muda
  useEffect(() => {
    localStorage.setItem("mundo-pets-feed", JSON.stringify(posts));
    setGroupedPosts(groupPostsByPet(posts));
  }, [posts]);

  // ➕ Criar post (salva no Neon ou localmente se offline)
  const addPost = async (newPost: Omit<Post, "id" | "createdAt">) => {
    try {
      if (navigator.onLine) {
        const formData = new FormData();
        formData.append("content", newPost.content);

        if (newPost.media && typeof newPost.media === "string") {
          const blob = await fetch(newPost.media).then((r) => r.blob());
          formData.append(
            newPost.mediaType === "video" ? "video" : "photo",
            blob,
            newPost.mediaType === "video" ? "upload.mp4" : "upload.jpg"
          );
        }

        const res = await fetch("/api/posts", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.data) {
          setPosts((prev) => [data.data, ...prev]);
        } else {
          console.warn("⚠️ Erro ao salvar post:", data.message);
          const offlinePost: Post = {
            ...newPost,
            id: Date.now().toString(),
            createdAt: "Offline",
            likes: 0,
            comments: 0,
            offline: true,
          };
          setPosts((prev) => [offlinePost, ...prev]);
        }
      } else {
        console.warn("📴 Offline — salvando post localmente.");
        const offlinePost: Post = {
          ...newPost,
          id: Date.now().toString(),
          createdAt: "Offline",
          likes: 0,
          comments: 0,
          offline: true,
        };
        setPosts((prev) => [offlinePost, ...prev]);
      }
    } catch (err) {
      console.error("❌ Erro ao adicionar post:", err);
      const offlinePost: Post = {
        ...newPost,
        id: Date.now().toString(),
        createdAt: "Erro local",
        likes: 0,
        comments: 0,
        offline: true,
      };
      setPosts((prev) => [offlinePost, ...prev]);
    }
  };

  // ❤️ Curtir/Descurtir post (local)
  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.likes + (p.liked ? -1 : 1), liked: !p.liked }
          : p
      )
    );
  };

  // 💬 Adicionar comentário (local)
  const addComment = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: p.comments + 1 } : p
      )
    );
  };

  // 🧹 Limpar feed
  const clearFeed = () => setPosts([]);

  return (
    <FeedContext.Provider
      value={{
        posts,
        groupedPosts,
        addPost,
        toggleLike,
        addComment,
        clearFeed,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

// Hook personalizado
export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context)
    throw new Error("useFeed deve ser usado dentro de um FeedProvider");
  return context;
};
