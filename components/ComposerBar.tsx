// components/ComposerBar.tsx
"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

export default function ComposerBar({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <motion.div
      onClick={onOpenModal}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      className="
        w-full cursor-pointer
        bg-white dark:bg-[#071017]
        border border-gray-200 dark:border-gray-800
        rounded-2xl shadow-sm px-4 py-3
        flex items-center gap-3
        hover:shadow-md transition
        min-h-[58px]
        overflow-hidden
      "
    >
      <img
        src="/placeholder-pet.png"
        alt="Pet"
        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 object-cover flex-shrink-0"
      />

      <div className="flex-1 text-gray-500 dark:text-gray-400 truncate">
        Compartilhe um momento do seu pet...
      </div>

      <ImageIcon size={20} className="text-gray-400" />
    </motion.div>
  );
}
