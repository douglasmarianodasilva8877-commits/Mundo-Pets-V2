"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Plus } from "lucide-react";
import { useState } from "react";
import MPModal from "@/components/MPModal";

export default function FloatingComposer({
  onPosted,
}: {
  onPosted: (text: string, image?: File) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔥 Barra Flutuante */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          fixed bottom-6 right-6 z-50
          bg-white/90 dark:bg-[#071017]/90
          backdrop-blur-lg
          border border-gray-200 dark:border-gray-800
          shadow-xl
          rounded-2xl
          px-4 py-3
          flex items-center gap-3
        "
      >
        {/* Avatar do Pet */}
        <img
          src="/placeholder-pet.png"
          alt="Pet"
          className="w-11 h-11 rounded-full border border-gray-300 dark:border-gray-700 object-cover"
        />

        {/* Abrir Modal */}
        <button
          onClick={() => setOpen(true)}
          className="
            bg-orange-500 hover:bg-orange-600
            text-white font-semibold
            px-4 py-2 rounded-xl
            flex items-center gap-2
            transition
          "
        >
          <Plus size={20} />
          Criar
        </button>

        {/* Upload rápido futuro */}
        <button
          className="
            p-2 rounded-xl text-gray-600 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800 transition
          "
        >
          <ImageIcon size={20} />
        </button>
      </motion.div>

      {/* Modal oficial */}
      <MPModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onPosted}
      />
    </>
  );
}
