"use client";

import Image from "next/image";
import { Video, ImageIcon, Smile } from "lucide-react";

export default function ComposerEntry({ pet, onOpen }: any) {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 flex flex-col gap-4">

      {/* LINHA SUPERIOR */}
      <div className="flex items-center gap-3">
        <Image
          src={pet.avatar}
          alt={pet.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />

        <button
          onClick={onOpen}
          className="flex-1 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-full text-left text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          No que você está pensando, {pet.name}?
        </button>
      </div>

      {/* DIVISOR */}
      <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

      {/* LINHA DE AÇÕES */}
      <div className="flex items-center justify-between">

        <button className="flex items-center gap-2 p-2 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Video className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium">Vídeo</span>
        </button>

        <button className="flex items-center gap-2 p-2 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <ImageIcon className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">Foto</span>
        </button>

        <button className="flex items-center gap-2 p-2 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Smile className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium">Humor</span>
        </button>

      </div>

    </div>
  );
}
