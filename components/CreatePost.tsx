"use client";

import React, { useState } from "react";

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Erro ao criar post");
      const newPost = await response.json();

      setContent("");
      onPostCreated?.(newPost);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar post 😢");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-md"
    >
      <textarea
        placeholder="O que seu pet está aprontando hoje? 🐾"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        rows={3}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
      >
        {loading ? "Postando..." : "Publicar"}
      </button>
    </form>
  );
}
