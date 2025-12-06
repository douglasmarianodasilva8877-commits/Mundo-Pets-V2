"use client";

import { useState } from "react";

export function CreatePostForm() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImages(files);

    const p = files.map((file) => URL.createObjectURL(file));
    setPreview(p);
  }

  async function submit() {
    if (loading) return;
    setLoading(true);

    const form = new FormData();
    form.append("content", content);

    images.forEach((img) => form.append("media", img));

    const res = await fetch("/api/posts", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setContent("");
      setImages([]);
      setPreview([]);
    } else {
      alert(data.message || "Erro ao postar");
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      <textarea
        className="w-full border rounded-lg p-2 resize-none"
        placeholder="O que seu pet está aprontando hoje? 🐾"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Preview */}
      {preview.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {preview.map((src, i) => (
            <img
              key={i}
              src={src}
              className="rounded-lg object-cover w-full h-32 border"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="cursor-pointer text-sm text-blue-600">
          📷 Selecionar imagens
          <input
            type="file"
            multiple
            className="hidden"
            accept="image/*"
            onChange={handleFiles}
          />
        </label>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow disabled:opacity-50"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </div>
  );
}
