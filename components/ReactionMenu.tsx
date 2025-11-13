"use client";

import { motion } from "framer-motion";

const reactions = [
  { id: "lambeu", emoji: "🐾", label: "Lambeu", color: "text-teal-500" },
  { id: "ossinho", emoji: "🦴", label: "Deu Ossinho", color: "text-amber-500" },
  { id: "abanou", emoji: "🐕‍🦺", label: "Abanou o Rabo", color: "text-pink-500" },
];

export default function ReactionMenu({
  onSelect,
}: {
  onSelect: (reaction: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 shadow-md rounded-full flex gap-3 px-4 py-2 border border-gray-200 dark:border-gray-700"
    >
      {reactions.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r.id)}
          className={`flex flex-col items-center hover:scale-110 transition ${r.color}`}
        >
          <span className="text-2xl">{r.emoji}</span>
          <span className="text-xs">{r.label}</span>
        </button>
      ))}
    </motion.div>
  );
}
