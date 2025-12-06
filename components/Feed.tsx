import Image from "next/image";
import { useFeed } from "@/hooks/useFeed";

export function Feed() {
  const { posts, loading } = useFeed();

  if (loading) return <p>Carregando feed...</p>;

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow rounded-xl p-4 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <Image
              src={post.pet.avatar}
              alt="pet"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />

            <div className="flex flex-col">
              <span className="font-semibold">{post.pet.name}</span>
              <span className="text-xs text-gray-500">{post.createdAt}</span>
            </div>
          </div>

          <p className="text-gray-800">{post.content}</p>

          {post.media.length > 0 && (
            <img
              src={post.media[0]}
              className="w-full rounded-lg border"
              alt="post media"
            />
          )}
        </div>
      ))}
    </div>
  );
}
