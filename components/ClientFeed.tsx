"use client";
import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import Composer from "./Composer";

export default function ClientFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/posts");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <Composer onPosted={load} />
      {loading ? <div>Carregando...</div> : posts.map(p => <PostCard key={p.id} post={p} />)}
    </>
  );
}
