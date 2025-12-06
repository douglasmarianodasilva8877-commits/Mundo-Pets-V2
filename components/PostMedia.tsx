// components/PostMedia.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MediaObj = {
  type?: "image" | "video";
  url?: string;
  src?: string;
  id?: string;
  blurhash?: string;
};

type Item = { id?: string; src: string; type?: "image" | "video" };

function safeUrl(url?: string | null, fallback = "/placeholder-pet.png") {
  if (!url) return fallback;
  if (url.startsWith("/mnt/") || url.includes("/mnt/data")) return fallback;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    if (["http:", "https:"].includes(parsed.protocol)) return url;
    return fallback;
  } catch {
    return fallback;
  }
}

export default function PostMedia({
  items,
}: {
  items: (string | Item | MediaObj)[];
}) {
  const list: Item[] = useMemo(
    () =>
      (items as any[]).map((it: any, i: number) =>
        typeof it === "string"
          ? {
              id: `${i}`,
              src: it,
              type:
                it.endsWith(".mp4") || it.includes("video") ? "video" : "image",
            }
          : {
              id: it.id ?? `${i}`,
              src: it.src ?? it.url ?? "",
              type:
                it.type ??
                (it.src?.includes(".mp4") || it.url?.includes(".mp4")
                  ? "video"
                  : "image"),
            }
      ),
    [items]
  );

  const sanitized = useMemo(
    () =>
      list
        .map((it) => ({
          ...it,
          src: safeUrl(it.src),
        }))
        .filter((it) => Boolean(it.src)),
    [list]
  );

  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  if (sanitized.length === 0) return null;

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el) return setIndex(i);
    const child = el.children[i] as HTMLElement;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center" });
    setIndex(i);
  };

  const goNext = () => scrollToIndex((index + 1) % sanitized.length);
  const goPrev = () =>
    scrollToIndex((index - 1 + sanitized.length) % sanitized.length);

  if (sanitized.length === 1) {
    const it = sanitized[0];
    return (
      <div className="w-full rounded-xl overflow-hidden post-card">
        {it.type === "video" ? (
          <video
            src={it.src}
            controls
            className="w-full h-auto max-h-[520px] object-cover rounded-xl"
            onError={(e) =>
              ((e.currentTarget as HTMLVideoElement).style.display = "none")
            }
          />
        ) : (
          <img
            src={it.src}
            alt=""
            className="w-full h-auto max-h-[520px] object-cover rounded-xl"
            loading="lazy"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              if (t.src !== "/placeholder-pet.png")
                t.src = "/placeholder-pet.png";
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* TRACK */}
      <div
        ref={trackRef}
        className="carousel-track flex gap-3 overflow-x-auto no-scrollbar py-2 px-2"
        role="list"
        aria-label="Mídias do post"
        style={{ scrollBehavior: "smooth", alignItems: "center" }}
      >
        {sanitized.map((it, i) => (
          <div
            key={it.id ?? i}
            role="listitem"
            onClick={() => scrollToIndex(i)}
            className="carousel-item flex-shrink-0 rounded-xl overflow-hidden shadow-sm cursor-pointer"
            style={{
              width: 220,
              height: Math.round(220 * 1.2),
              maxWidth: "40vw",
              maxHeight: 520,
              background: "#f3f4f6",
            }}
          >
            {it.type === "video" ? (
              <video
                src={it.src}
                controls
                className="w-full h-full object-cover"
                onError={(e) =>
                  ((e.currentTarget as HTMLVideoElement).style.display = "none")
                }
              />
            ) : (
              <img
                src={it.src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  if (t.src !== "/placeholder-pet.png")
                    t.src = "/placeholder-pet.png";
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* SETAS */}
      <button
        type="button"
        aria-label="Anterior"
        onClick={goPrev}
        className="carousel-arrow carousel-arrow-left"
        style={{ zIndex: 30 }}
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        aria-label="Próximo"
        onClick={goNext}
        className="carousel-arrow carousel-arrow-right"
        style={{ zIndex: 30 }}
      >
        <ChevronRight size={18} />
      </button>

      {/* INDICADORES */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {sanitized.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir para mídia ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`w-2 h-2 rounded-full transition-transform ${
              i === index
                ? "scale-110 bg-teal-600"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
