"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * FriendsCarousel (v4 refinado)
 * - layout horizontal intacto
 * - setas pequenas, suaves, transparentes mesmo no hover
 * - posicionadas discretamente nas laterais do carrossel
 * - swipe mobile preservado
 */

const ITEMS = [
  { id: 1, type: "image", src: "/friends/pet-noiva.png", name: "Luna" },
  { id: 2, type: "video", src: "/friends/video-pets.mp4", name: "Filhote" },
  { id: 3, type: "image", src: "/friends/gata-stilosa.jpg", name: "Mia" },
  { id: 4, type: "video", src: "/friends/video-coelho.mp4", name: "Coelhinho" },
  { id: 5, type: "image", src: "/friends/cachorro-ela.jpg", name: "Bella" },
  { id: 6, type: "image", src: "/friends/thor-brincando.jpg", name: "Bob" },
  { id: 7, type: "image", src: "/friends/cachorro-comum.jpg", name: "Mel" },
];

export default function FriendsCarousel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cardSize, setCardSize] = useState(100);
  const [showArrows, setShowArrows] = useState(false);

  // Responsividade do tamanho dos cards
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) setCardSize(72);
      else if (w < 768) setCardSize(84);
      else if (w < 1024) setCardSize(96);
      else setCardSize(112);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll suave
  const scrollBy = (dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = cardSize * 2.5;
    el.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Gesto de swipe no mobile
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX = 0;
    let isDown = false;

    const onTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        scrollBy(dx > 0 ? "left" : "right");
        isDown = false;
      }
    };
    const onTouchEnd = () => {
      isDown = false;
    };

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [cardSize]);

  const cardWidth = cardSize;
  const cardHeight = Math.round(cardWidth * 1.5);

  return (
    <div
      className="friends-carousel-wrapper relative w-full flex justify-center"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      onTouchStart={() => setShowArrows(true)}
    >
      {/* Container principal */}
      <div
        ref={containerRef}
        className="friends-carousel-container"
        role="region"
        aria-label="Carrossel de stories"
        style={{
          width: "100%",
          maxWidth: "720px",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          padding: "6px 8px",
          scrollBehavior: "smooth",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          {ITEMS.map((item) => (
            <motion.div
              key={item.id}
              className="friends-carousel-card"
              style={{
                flex: "0 0 auto",
                width: cardWidth,
                height: cardHeight,
                borderRadius: 16,
                boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
                background: "linear-gradient(135deg,#fb923c,#ec4899)",
                overflow: "hidden",
                position: "relative",
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "1rem",
                    }}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  width: "100%",
                  textAlign: "center",
                  fontSize: 12,
                  color: "#0f172a",
                  fontWeight: 600,
                  textShadow: "0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                {item.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Setas laterais minimalistas */}
      <AnimatePresence>
        {showArrows && (
          <>
            <motion.button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/25 text-gray-900 rounded-full shadow-sm p-1 transition-all backdrop-blur-sm"
              onClick={() => scrollBy("left")}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                width: 26,
                height: 26,
                marginLeft: 4,
              }}
            >
              <ChevronLeft size={16} />
            </motion.button>

            <motion.button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/25 text-gray-900 rounded-full shadow-sm p-1 transition-all backdrop-blur-sm"
              onClick={() => scrollBy("right")}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                width: 26,
                height: 26,
                marginRight: 4,
              }}
            >
              <ChevronRight size={16} />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
