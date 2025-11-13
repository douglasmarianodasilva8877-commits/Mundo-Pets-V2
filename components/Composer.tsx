"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Image as ImageIcon, Video as VideoIcon, X } from "lucide-react";
import { useFeed } from "@/context/FeedContext";

interface ComposerProps {
  onPosted?: (content: string, media?: string | File) => Promise<void>;
  pet?: any;
}

export default function Composer({ onPosted, pet }: ComposerProps) {
  const { addPost } = useFeed();
  const [text, setText] = useState("");
  const [mediaList, setMediaList] = useState<{ url: string; type: "image" | "video" }[]>([]);
  const [uploading, setUploading] = useState(false);

  // Upload de imagem/vídeo
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploaded: { url: string; type: "image" | "video" }[] = [];
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();

        if (res.ok && data.url) {
          uploaded.push({
            url: data.url,
            type: file.type.startsWith("video") ? "video" : "image",
          });
        }
      }
      setMediaList((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error("Erro ao enviar mídia:", err);
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (i: number) => {
    setMediaList((prev) => prev.filter((_, idx) => idx !== i));
  };

  const publish = async () => {
    if (!text.trim() && mediaList.length === 0) return;

    // 🔧 Ajuste cirúrgico — convertendo mediaList[] para string
    const firstMediaUrl = mediaList.length > 0 ? mediaList[0].url : undefined;

    const newPost = {
      id: Date.now().toString(),
      petName: pet?.name || "Pet Anônimo 🐾",
      petAvatar: pet?.avatar || "/placeholder-pet.png",
      content: text,
      media: firstMediaUrl, // ✅ agora compatível com FeedContext
      createdAt: "agora mesmo",
      likes: 0,
      comments: 0,
    };

    addPost(newPost);
    if (onPosted) await onPosted(text, firstMediaUrl);
    setText("");
    setMediaList([]);
  };

  return (
    <motion.div
      className="w-full bg-white/80 dark:bg-[#15283a]/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="O que seu pet está pensando hoje? 🐾"
        className="w-full p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 resize-none"
        rows={3}
      />

      {mediaList.length > 0 && (
        <div className={`mt-3 grid gap-2 grid-cols-${Math.min(mediaList.length, 3)}`}>
          {mediaList.map((m, i) => (
            <div key={i} className="relative group">
              {m.type === "video" ? (
                <video src={m.url} controls className="w-full h-64 object-cover rounded-xl border dark:border-gray-700" />
              ) : (
                <img src={m.url} alt="" className="w-full h-64 object-cover rounded-xl border dark:border-gray-700" />
              )}
              <button
                onClick={() => removeMedia(i)}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500">
            <ImageIcon size={18} />
            <span>{uploading ? "Enviando..." : "Imagem"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleMediaUpload}
              disabled={uploading}
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500">
            <VideoIcon size={18} />
            <span>Vídeo</span>
            <input
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleMediaUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={publish}
          disabled={uploading || (!text.trim() && mediaList.length === 0)}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white shadow-md transition ${
            uploading || (!text.trim() && mediaList.length === 0)
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          <PawPrint size={16} />
          Postar
        </motion.button>
      </div>
    </motion.div>
  );
}
