// components/LikeButton.tsx
"use client";

import React, { useState } from "react";

export default function LikeButton({ postId, initialLiked, initialCount }: { postId: string; initialLiked: boolean; initialCount: number }) {
  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [count, setCount] = useState(Number(initialCount ?? 0));
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/toggle-like", { method: "POST", body: JSON.stringify({ postId }), headers: { "Content-Type": "application/json" } });
      const json = await res.json();
      if (json.success) {
        setLiked(Boolean(json.liked));
        setCount(Number(json.likesCount ?? count));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={toggle} disabled={loading} className={`flex items-center gap-1 ${liked ? "text-orange-500" : "hover:text-orange-500"}`} aria-label="Curtir">
      <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      <span>{count}</span>
    </button>
  );
}
