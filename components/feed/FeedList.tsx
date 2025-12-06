// components/feed/FeedList.tsx
import FeedPost from "./FeedPost";
import type { FeedPostItem } from "@/lib/types/feed";

export default function FeedList({ items }: { items: FeedPostItem[] }) {
  if (!items || items.length === 0) {
    return <p className="text-center text-gray-500">Nenhum post encontrado.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((it) => (
        <FeedPost key={it.post.id} item={it} />
      ))}
    </div>
  );
}
