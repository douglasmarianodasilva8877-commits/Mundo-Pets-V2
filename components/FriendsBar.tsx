"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const mockFriends = [
  { id: 1, name: "Luna", avatar: "/friends/luna.png" },
  { id: 2, name: "Filhote", avatar: "/friends/video-pets.mp4" },
  { id: 3, name: "Mia", avatar: "/friends/mia.jpg" },
  { id: 4, name: "Whisky", avatar: "/friends/whisky.webp" },
  { id: 5, name: "Bella", avatar: "/friends/cachorro-ela.jpg" },
  { id: 6, name: "Bob", avatar: "/friends/thor-brincando.jpg" },
  { id: 7, name: "Mel", avatar: "/friends/cachorro-comum.jpg" },
];

export default function FriendsBar() {
  const [size, setSize] = useState(90);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) setSize(70);
      else if (w < 768) setSize(80);
      else if (w < 1024) setSize(90);
      else setSize(100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-x-auto py-3 mb-6 friendbar-track"
    >
      <div
        className="flex flex-nowrap gap-4 px-3 items-start"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 🔹 Card "Novo" */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-none flex flex-col items-center text-center"
          style={{ scrollSnapAlign: "start" }}
        >
          <div
            className="relative bg-gradient-to-tr from-orange-400 to-pink-500 rounded-2xl p-[3px] shadow-md"
            style={{
              width: size,
              height: size * 1.5, // 1x2 ratio
              aspectRatio: "1 / 2",
            }}
          >
            <div className="bg-white dark:bg-[#15283a] rounded-2xl w-full h-full flex items-center justify-center">
              <span className="text-orange-500 text-3xl font-bold">+</span>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs mt-1 text-gray-700 dark:text-gray-300">Novo</p>
        </motion.div>

        {/* 🔹 Amigos (Imagens e Vídeos alinhados) */}
        {mockFriends.map((friend) => (
          <motion.div
            key={friend.id}
            whileHover={{ scale: 1.05 }}
            className="flex-none flex flex-col items-center text-center"
            style={{ scrollSnapAlign: "start" }}
          >
            <div
              className="relative bg-gradient-to-tr from-orange-400 to-pink-500 rounded-2xl p-[3px] shadow-md overflow-hidden"
              style={{
                width: size,
                height: size * 1.5,
                aspectRatio: "1 / 2",
              }}
            >
              {friend.avatar.endsWith(".mp4") ? (
                <video
                  src={friend.avatar}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover rounded-2xl"
                  style={{
                    aspectRatio: "1 / 2",
                    objectFit: "cover",
                    borderRadius: "1rem",
                  }}
                />
              ) : (
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-full h-full object-cover rounded-2xl"
                  style={{
                    aspectRatio: "1 / 2",
                    borderRadius: "1rem",
                  }}
                />
              )}
            </div>
            <p
              className="text-[11px] sm:text-xs mt-1 text-gray-700 dark:text-gray-300 truncate text-center"
              style={{ width: size }}
            >
              {friend.name}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
