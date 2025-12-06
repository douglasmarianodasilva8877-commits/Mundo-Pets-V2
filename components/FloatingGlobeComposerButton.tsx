// components/FloatingGlobeComposerButton.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ComposerModal from "@/components/ComposerModal";
import Image from "next/image";

export default function FloatingGlobeComposerButton({ onPosted }: { onPosted: (content: string, media?: File, meta?: any) => Promise<void> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        aria-label="Criar publicação"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.92 }}
        className="
          fixed bottom-6 right-6
          z-50
          w-[70px] h-[70px]
          rounded-full
          shadow-xl shadow-black/20
          bg-white dark:bg-gray-900
          flex items-center justify-center
          border border-gray-300 dark:border-gray-700
          hover:shadow-2xl hover:shadow-black/30
          transition-all
        "
      >
        <Image
          src="/mundopets-globe-button.png"
          alt="Criar publicação"
          width={56}
          height={56}
          className="select-none pointer-events-none"
        />
      </motion.button>

      <ComposerModal open={open} onOpenChange={setOpen} onPost={async (content, files?) => {
        // composer modal expects files[] or undefined, but our onPosted expects (content, media?: File)
        if (files && files.length) {
          // take first file for compatibility (existing API accepts single file field)
          const file = files[0];
          await onPosted(content, file);
        } else {
          await onPosted(content);
        }
      }} />
    </>
  );
}
