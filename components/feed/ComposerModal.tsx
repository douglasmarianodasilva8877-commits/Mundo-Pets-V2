// components/feed/ComposerModal.tsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import UploadButtonComponent from "@/components/UploadButton";
import { useFeed } from "@/context/FeedContext";
import type { MediaItem } from "@/context/FeedContext";
import { createPostClient } from "@/lib/posts";

export default function ComposerModal({
  open,
  onOpenChange,
  pet,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pet?: { id?: string; name?: string; avatar?: string } | null;
}) {
  const { addPost } = useFeed();

  const [content, setContent] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function handleFilesUploaded(files: { url: string; type: string }[]) {
    // append to mediaItems deduplicando URLs
    setMediaItems((prev) => {
      const map = new Map(prev.map((p) => [p.url, p]));
      for (const f of files) {
        if (!map.has(f.url)) {
          map.set(f.url, { url: f.url, type: f.type === "video" ? "video" : "image" });
        }
      }
      return Array.from(map.values());
    });
  }

  async function handlePublish() {
    setError(null);

    if (!content.trim() && mediaItems.length === 0) {
      setError("Escreva algo ou adicione mídia antes de publicar.");
      return;
    }

    setLoading(true);
    try {
      // prepara payload no formato esperado pelo server action
      const media = mediaItems.map((m) => ({ type: m.type, url: m.url }));

      const res = await createPostClient({
        content: content.trim(),
        media,
        petId: pet?.id ?? null,
      });

      if (!res?.success) {
        throw new Error(res?.message ?? "Erro ao criar post");
      }

      // adiciona localmente (FeedContext espera forma do endpoint)
      addPost(res.post);

      // resetar
      setContent("");
      setMediaItems([]);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Composer: publish error:", err);
      setError(err?.message ?? "Erro inesperado ao publicar");
    } finally {
      setLoading(false);
    }
  }

  function handleRemove(index: number) {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl p-5 relative mt-20">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <header className="mb-3">
          <h2 className="text-lg font-semibold">Criar publicação</h2>
          {pet?.name && (
            <p className="text-sm text-gray-500">Postando como <strong>{pet.name}</strong></p>
          )}
        </header>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder={`O que ${pet?.name ?? "você"} está pensando?`}
          className="w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-xl resize-none outline-none"
        />

        {/* UploadThing button (componente local) */}
        <div className="mt-4">
          <UploadButtonComponent onUploadComplete={handleFilesUploaded} />
        </div>

        {/* Previews */}
        {mediaItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {mediaItems.map((m, i) => {
              const isVideo = m.type === "video" || m.url.match(/\.(mp4|mov|webm)(\?|$)/i);
              return (
                <div key={m.url + i} className="relative rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleRemove(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
                    aria-label="Remover mídia"
                  >
                    X
                  </button>

                  {isVideo ? (
                    <video src={m.url} controls className="w-full h-40 object-cover rounded-xl" />
                  ) : (
                    <img src={m.url} alt="preview" className="w-full h-40 object-cover rounded-xl" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-md" disabled={loading}>
            Cancelar
          </button>

          <button
            onClick={handlePublish}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
