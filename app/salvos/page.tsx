"use client";

import React, { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";

export default function SalvosPage() {
  const [salvos, setSalvos] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("mundo-pets-salvos");
    if (saved) setSalvos(JSON.parse(saved));
  }, []);

  return (
    <section className="max-w-2xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold text-teal-500 mb-5 text-center">
        💾 Publicações Salvas
      </h1>

      {salvos.length > 0 ? (
        <div className="space-y-5">
          {salvos.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          Nenhum post salvo ainda 🐾
        </p>
      )}
    </section>
  );
}
