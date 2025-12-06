import React from "react";
import type { FeedPostItem } from "@/lib/types/feed";

function safeUrl(url?: string | null, fallback = "/placeholder-avatar.png") {
  if (!url) return fallback;
  if (url.startsWith("/mnt/") || url.includes("/mnt/data")) return fallback;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return url;
    return fallback;
  } catch {
    return fallback;
  }
}

export default function FeedPost({ item }: { item: FeedPostItem }) {
  const { post, pet, tutor, commentsCount } = item;

  const media = Array.isArray(post.mediaUrls)
    ? post.mediaUrls
    : post.imageUrl
    ? [post.imageUrl]
    : [];

  const avatarSrc = safeUrl(
    tutor?.avatar_url ?? pet?.avatar_url ?? null,
    "/placeholder-avatar.png"
  );

  return (
    <article className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatarSrc}
          width={48}
          height={48}
          alt={tutor?.name ?? pet?.name ?? "Tutor"}
          className="rounded-full object-cover"
          onError={(e) => {
            const t = e.currentTarget as HTMLImageElement;
            if (t.src !== "/placeholder-avatar.png")
              t.src = "/placeholder-avatar.png";
          }}
        />

        <div>
          <div className="font-semibold">
            {tutor?.name ?? pet?.name ?? "Usuário"}
          </div>
          <div className="text-xs text-gray-500">
            {pet?.name ? `como ${pet.name}` : ""}
          </div>
        </div>
      </div>

      {post.content && (
        <p className="text-[15px] leading-snug whitespace-pre-line mb-3">
          {post.content}
        </p>
      )}

      {/* 1 mídia */}
      {media.length === 1 && (
        <div className="mb-3 rounded-xl overflow-hidden">
          {isVideo(media[0]) ? (
            <video
              src={safeUrl(media[0], "")}
              controls
              className="w-full h-[380px] object-cover rounded-xl"
              onError={(e) => {
                (e.currentTarget as HTMLVideoElement).style.display = "none";
              }}
            />
          ) : (
            <img
              src={safeUrl(media[0], "/placeholder-pet.png")}
              alt="media"
              className="w-full h-[380px] object-cover rounded-xl"
              loading="lazy"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                if (t.src !== "/placeholder-pet.png")
                  t.src = "/placeholder-pet.png";
              }}
            />
          )}
        </div>
      )}

      {/* várias mídias */}
      {media.length > 1 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {media.map((m) => (
            <div
              key={m}
              className="w-full h-40 rounded-lg overflow-hidden bg-gray-100"
            >
              {isVideo(m) ? (
                <video
                  src={safeUrl(m, "")}
                  controls
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLVideoElement).style.display = "none";
                  }}
                />
              ) : (
                <img
                  src={safeUrl(m, "/placeholder-pet.png")}
                  alt="media"
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
      )}

      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <div>❤️ {post.likes ?? 0}</div>
        <div>💬 {commentsCount ?? 0}</div>
      </div>
    </article>
  );
}

function isVideo(url?: string | null) {
  if (!url) return false;
  return url.includes(".mp4") || url.includes("video") || url.includes(".webm");
}
