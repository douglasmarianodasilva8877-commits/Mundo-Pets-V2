interface PostImageProps {
  post: {
    image?: string | null;
  };
}

function safeUrl(url?: string | null, fallback = "/placeholder-pet.png") {
  if (!url) return fallback;

  // Bloqueia qualquer coisa local/interna
  if (url.startsWith("/mnt/") || url.includes("/mnt/data")) return fallback;

  // Data URLs (base64)
  if (url.startsWith("data:")) return url;

  // URLs internas válidas (Next/Storage/CDN)
  if (url.startsWith("/")) return url;

  // URLs http/https
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return url;
    return fallback;
  } catch {
    return fallback;
  }
}

export default function PostImage({ post }: PostImageProps) {
  const src = safeUrl(post?.image);

  if (!src) return null;

  return (
    <div className="mt-3 flex justify-center">
      <img
        src={src}
        alt="Post Image"
        className="max-h-[500px] rounded-lg object-cover"
        loading="lazy"
        onError={(e) => {
          const t = e.currentTarget as HTMLImageElement;
          if (t.src !== "/placeholder-pet.png") t.src = "/placeholder-pet.png";
        }}
      />
    </div>
  );
}
