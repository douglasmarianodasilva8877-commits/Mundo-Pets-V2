// components/feed/CommentSection.tsx
"use client";
import React, { useState } from "react";

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<{ id: string; text: string }[]>([]);
  const [text, setText] = useState("");

  function add() {
    if (!text.trim()) return;
    setComments(prev => [{ id: crypto.randomUUID(), text }, ...prev]);
    setText("");
  }

  return (
    <div className="mt-3">
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escrever comentário..." className="flex-1 p-2 rounded-md border bg-transparent text-[color:var(--fg)]" />
        <button onClick={add} className="btn-brand">Enviar</button>
      </div>

      <div className="mt-3 space-y-2">
        {comments.map(c => (
          <div key={c.id} className="p-2 rounded-md bg-[color:var(--card)] border">
            <div className="text-sm">{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
