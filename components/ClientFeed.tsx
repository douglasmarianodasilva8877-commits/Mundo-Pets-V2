"use client";

import { useState, useEffect } from "react";
import Composer from "./Composer";
import PostCard from "./PostCard";

export interface Post {
  id: string;
  petName: string;
  petAvatar: string;
  content: string;
  media: string[];
  createdAt: string;
  likes: number;
  comments: number;
}

export default function ClientFeed() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  async function load() {
    setLoading(true);

    const res = await fetch("/api/posts");
    const data = await res.json();

    const arr = Array.isArray(data) ? data : data.posts ?? [];

    const normalizedPosts: Post[] = arr.map((p: any) => ({
      ...p,
      media: Array.isArray(p.media) ? p.media : p.media ? [p.media] : [],
    }));

    setPosts(normalizedPosts);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Composer onPost={load} />

      {loading ? (
        <div>Carregando...</div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </>
  );
}
