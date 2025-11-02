"use client";

import React, { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { Heart } from "lucide-react";

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("mundo-pets-favoritos");
    if (saved) setFavoritos(JSON.parse(saved));
  }, []);

  return (
    <section className="max-w-2xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold text-teal-500 mb-5 text-center flex items-center justify-center gap-2">
        <Heart className="text-teal-500" /> Favoritos
      </h1>

      {favoritos.length > 0 ? (
        <div className="space-y-5">
          {favoritos.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          Nenhum post favoritado ainda 💚
        </p>
      )}
    </section>
  );
}
