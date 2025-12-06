"use client";

import Image from "next/image";

export default function PostBarPremium({ pet, onOpen }) {
  return (
    <div className="
      w-full bg-white dark:bg-gray-900 
      shadow-md rounded-xl p-4 
      flex flex-col gap-4
    ">
      
      <div className="flex items-center gap-3">
        <Image
          src={pet.avatar}
          width={48}
          height={48}
          alt={pet.name}
          className="rounded-full object-cover"
        />

        <button
          onClick={onOpen}
          className="
            flex-1 text-left 
            bg-gray-100 dark:bg-gray-800 
            px-4 py-3 rounded-full 
            text-gray-600 dark:text-gray-300 
            hover:bg-gray-200 dark:hover:bg-gray-700
            transition
          "
        >
          O que você está pensando, {pet.name}?
        </button>
      </div>

      <div className="
        flex items-center justify-between 
        pt-3 border-t border-gray-200 dark:border-gray-700
      ">
        <button
          onClick={onOpen}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          📷 <span className="text-sm">Foto</span>
        </button>

        <button
          onClick={onOpen}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          🎥 <span className="text-sm">Vídeo</span>
        </button>

        <button
          onClick={onOpen}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ➕ <span className="text-sm">Mais</span>
        </button>
      </div>
    </div>
  );
}
