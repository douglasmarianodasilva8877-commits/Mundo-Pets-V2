"use client";

import { useState } from "react";
import { ImageIcon, Smile } from "lucide-react";
import Image from "next/image";

export default function PostComposer() {
  const [preview, setPreview] = useState<string | null>(null);

  function handleImage(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="card-modern p-4 w-full mb-4">
      <div className="flex items-center gap-3 mb-3">
        <Image
          src="/default-avatar.png"
          width={45}
          height={45}
          className="rounded-full"
          alt="profile"
        />
        <input
          className="flex-1 px-4 py-3 bg-gray-100 rounded-full outline-none hover-premium"
          placeholder="O que seu pet aprontou hoje? 🐾"
        />
      </div>

      {preview && (
        <div className="relative mt-3">
          <Image
            src={preview}
            width={600}
            height={400}
            alt="preview"
            className="rounded-xl"
          />
        </div>
      )}

      <div className="flex items-center justify-between mt-3 px-2">
        <label className="flex items-center gap-2 cursor-pointer float-soft">
          <ImageIcon className="w-5 h-5 text-blue-500" />
          <span className="text-sm">Foto</span>
          <input type="file" className="hidden" onChange={handleImage} />
        </label>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl float-soft">
          Publicar
        </button>
      </div>
    </div>
  );
}
