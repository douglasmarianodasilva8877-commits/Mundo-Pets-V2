"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ComposerModal from "@/components/ComposerModal";

export default function Composer({ onPost, pet }: { onPost: any; pet?: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.97 }}
        className="
          cursor-pointer bg-white dark:bg-[#071017] 
          border border-gray-200 dark:border-gray-800
          rounded-2xl shadow-sm p-4 
          hover:shadow-md transition
        "
      >
        <div className="text-gray-500 dark:text-gray-400">
          {pet?.name
            ? `O que ${pet.name} está aprontando hoje? 🐾`
            : "Compartilhe um momento do seu pet..."
          }
        </div>
      </motion.div>

      <ComposerModal
        open={open}
        onOpenChange={setOpen}
        onPost={onPost}
        pet={pet}
      />
    </>
  );
}
