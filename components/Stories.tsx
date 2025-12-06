// components/Stories.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface Story { id: string; name: string; image: string; }

const storiesData: Story[] = [
  { id: "1", name: "Luna", image: "/stories/luna.jpg" },
  { id: "2", name: "Filhote", image: "/stories/filhote.jpg" },
  { id: "3", name: "Mia", image: "/stories/mia.jpg" },
  { id: "4", name: "Coelhinho", image: "/stories/coelho.jpg" },
  { id: "5", name: "Bella", image: "/stories/bella.jpg" },
];

export default function Stories() {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-3 px-2 -mx-2">
      <div className="flex gap-4 px-2">
        {storiesData.map((story) => (
          <motion.div key={story.id} className="flex flex-col items-center w-[95px] flex-none cursor-pointer" whileTap={{ scale: 0.92 }}>
            <div className="w-full h-[120px] sm:h-[150px] rounded-2xl overflow-hidden shadow-md">
              <img src={story.image} alt={story.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <span className="text-sm mt-1 text-gray-700 dark:text-gray-300 font-medium text-center">{story.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
