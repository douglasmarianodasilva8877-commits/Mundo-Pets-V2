"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useFeed } from "@/context/FeedContext";
import FriendsCarousel from "@/components/FriendsCarousel";
import PostBarPremium from "@/components/PostBarPremium";
import ComposerModal from "@/components/feed/ComposerModal";

export default function FeedPage() {
  const { posts, loading, fetchPosts, loadMore, hasMore } = useFeed();
  const [openComposer, setOpenComposer] = useState(false);

  useEffect(() => {
    fetchPosts({ reset: true });
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 py-6 pt-[var(--navbar-height)]">
      
      {/* CARROSSEL */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[820px]">
          <FriendsCarousel />
        </div>
      </div>

      {/* BARRA PREMIUM */}
      <div className="w-full max-w-[820px] mx-auto px-3">
        <PostBarPremium
          pet={{ name: "Douglas", avatar: "/placeholder-pet.png" }}
          onOpen={() => setOpenComposer(true)}
        />
      </div>

      {/* MODAL */}
      <ComposerModal
        open={openComposer}
        onOpenChange={setOpenComposer}
        onPost={async () => fetchPosts({ reset: true })}
        pet={{ name: "Douglas", avatar: "/placeholder-pet.png" }}
      />

      {/* FEED */}
      <div className="w-full max-w-[820px] mx-auto px-3">
        {loading && posts.length === 0 && (
          <p className="text-gray-400 text-center">Carregando posts...</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-gray-500 text-center">Nenhum post encontrado.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
          {posts.map((item) => {
            const { post, pet, tutor, commentsCount } = item;

            const mediaArray = Array.isArray(post.media_urls)
              ? post.media_urls
              : post.media_urls
              ? [post.media_urls]
              : [];

            const mediaList = mediaArray.map((m) =>
              m.startsWith("/") ? m : `/${m}`
            );

            const createdAt = new Date(post.createdAt).toLocaleString("pt-BR");

            return (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-4"
              >
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={
                      tutor?.avatar_url
                        ? tutor.avatar_url.startsWith("/")
                          ? tutor.avatar_url
                          : `/${tutor.avatar_url}`
                        : "/placeholder-pet.png"
                    }
                    width={50}
                    height={50}
                    alt={tutor?.name || "Tutor"}
                    className="rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold">
                      {pet?.name || tutor?.name || "Usuário"}
                    </p>
                    <p className="text-xs text-gray-500">{createdAt}</p>
                  </div>
                </div>

                {/* TEXTO */}
                {post.content && (
                  <p className="mb-3 whitespace-pre-line text-[15px] leading-snug">
                    {post.content}
                  </p>
                )}

                {/* IMAGEM ÚNICA LEGACY */}
                {post.image_url && (
                  <div className="rounded-xl overflow-hidden mb-3">
                    <img
                      src={post.image_url.startsWith("/") ? post.image_url : `/${post.image_url}`}
                      alt="Post media"
                      className="w-full max-h-[380px] object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* GALERIA */}
                {mediaList.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {mediaList.map((m, idx) => {
                      const isVideo =
                        m.includes(".mp4") ||
                        m.includes(".mov") ||
                        m.includes("video");

                      return (
                        <div
                          key={idx}
                          className="w-full rounded-xl overflow-hidden bg-gray-100 shadow-sm"
                          style={{ height: 240 }}
                        >
                          {isVideo ? (
                            <video
                              src={m}
                              controls
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <img
                              src={m}
                              alt={`Mídia ${idx + 1}`}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* FOOTER */}
                <div className="mt-3 text-sm text-gray-500">
                  ❤️ {post.likes ?? 0} curtidas • 💬 {commentsCount ?? 0} comentários
                </div>
              </article>
            );
          })}
        </div>

        {/* LOAD MORE */}
        {hasMore && (
          <div className="w-full mt-6 flex justify-center">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm"
            >
              Carregar mais
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
