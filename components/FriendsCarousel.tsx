// components/FriendsCarousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS = [
  { id: 1, type: "image", src: "/friends/pet-noiva.png", name: "Luna" },
  { id: 2, type: "video", src: "/friends/video-pets.mp4", name: "Filhote" },
  { id: 3, type: "image", src: "/friends/gato-stiloso.jpeg", name: "Nilo" },
  { id: 4, type: "video", src: "/friends/video-coelho.mp4", name: "Coelhinho" },
  { id: 5, type: "image", src: "/friends/cachorro-ela.jpg", name: "Bella" },
  { id: 6, type: "image", src: "/friends/thor-brincando.jpg", name: "Bob" },
  { id: 7, type: "image", src: "/friends/cachorro-comum.jpg", name: "Mel" },
];

export default function FriendsCarousel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showArrows, setShowArrows] = useState(false);

  const CARD_WIDTH = 96;
  const CARD_HEIGHT = 192;
  const GAP = 10;

  const scrollBy = (dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;

    const shift = Math.round((CARD_WIDTH + GAP) * 2.1);
    el.scrollBy({
      left: dir === "left" ? -shift : shift,
      behavior: "smooth",
    });
  };

  // Swipe mobile
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX = 0;
    let down = false;

    const onStart = (e: TouchEvent) => {
      down = true;
      startX = e.touches[0].clientX;
    };

    const onMove = (e: TouchEvent) => {
      if (!down) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        scrollBy(dx > 0 ? "left" : "right");
        down = false;
      }
    };

    el.addEventListener("touchstart", onStart);
    el.addEventListener("touchmove", onMove);

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      style={{ paddingBottom: 4 }}
    >
      {/* CONTAINER */}
      <div
        ref={containerRef}
        className="no-scrollbar"
        tabIndex={0}
        style={{
          display: "flex",
          gap: GAP,
          overflowX: "auto",
          overflowY: "hidden",
          padding: "8px 4px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {ITEMS.map((item) => {
          const isVideo = item.type === "video";
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{
                flex: "0 0 auto",
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                scrollSnapAlign: "center",
                borderRadius: 14,
                overflow: "hidden",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                position: "relative",
                cursor: "pointer",
              }}
            >
              {isVideo ? (
                <video
                  src={item.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  autoPlay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    padding: "3px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {item.name}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SETAS */}
      <AnimatePresence>
        {showArrows && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scrollBy("left")}
              className="hidden md:flex items-center justify-center"
              style={{
                position: "absolute",
                left: -18,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.35)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={18} />
            </motion.button>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scrollBy("right")}
              className="hidden md:flex items-center justify-center"
              style={{
                position: "absolute",
                right: -18,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.35)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
