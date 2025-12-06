"use client";

import React, { useState } from "react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mediaUrls: [] }),
      });

      if (!res.ok) throw new Error("Erro ao criar post");

      setContent("");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar post");
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
        className="p-2 border border-gray-300 rounded-lg focus:outline-none"
        rows={3}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-pink-500 text-white py-2 px-4 rounded-lg"
      >
        {loading ? "Postando..." : "Publicar"}
      </button>
    </form>
  );
}
