// components/CommentForm.tsx
"use client";

import { useState } from "react";

export function CommentForm({ onCreate }: { onCreate: (content: string) => Promise<any> }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await onCreate(content.trim());
    setContent("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        className="flex-1 border rounded px-3 py-2"
        placeholder="Escreva um comentário..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button disabled={loading} className="bg-blue-600 text-white px-3 py-2 rounded">
        {loading ? "..." : "Comentar"}
      </button>
    </form>
  );
}
