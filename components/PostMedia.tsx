"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  id: number | string;
  type: "image" | "video";
  src: string;
}

interface PostMediaProps {
  items: MediaItem[];
}

export default function PostMedia({ items }: PostMediaProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  const isMultiple = items.length > 1;

  return (
    <div
      className="
        relative 
        rounded-3xl 
        overflow-hidden 
        shadow-md 
        bg-gray-100 dark:bg-gray-800 
        transition-all 
        duration-300 
        hover:shadow-lg
      "
      style={{
        aspectRatio: "4 / 3",
        width: "100%",
        maxHeight: 460,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={items[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          {items[current].type === "video" ? (
            <video
              src={items[current].src}
              controls
              playsInline
              className="
                w-full h-full 
                object-cover 
                rounded-3xl 
                transition-all 
                duration-500 
                hover:scale-[1.01]
              "
            />
          ) : (
            <img
              src={items[current].src}
              alt={`post-media-${current}`}
              className="
                w-full h-full 
                object-cover 
                rounded-3xl 
                transition-all 
                duration-500 
                hover:scale-[1.01]
              "
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navegação se houver várias mídias */}
      {isMultiple && (
        <>
          <button
            onClick={prev}
            className="
              absolute top-1/2 left-3 -translate-y-1/2 
              bg-black/40 hover:bg-black/60 
              text-white 
              rounded-full 
              w-8 h-8 
              flex items-center justify-center 
              transition-colors duration-300
            "
          >
            ‹
          </button>
          <button
            onClick={next}
            className="
              absolute top-1/2 right-3 -translate-y-1/2 
              bg-black/40 hover:bg-black/60 
              text-white 
              rounded-full 
              w-8 h-8 
              flex items-center justify-center 
              transition-colors duration-300
            "
          >
            ›
          </button>

          {/* Indicadores (bolinhas) */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
            {items.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
