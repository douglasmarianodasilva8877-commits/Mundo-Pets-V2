import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import { PawPrint } from "lucide-react";
import Image from "next/image";

/**
 * 🔹 Página de perfil do Pet
 * Mostra informações do pet e suas publicações
 */
export default async function PetProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);

  // 🐾 Busca o pet no banco
  const pet = await prisma.pet.findUnique({
    where: { slug },
    include: {
      owner: true,
      posts: {
        include: {
          author: true,
          comments: true, // ✅ inclui comentários
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-gray-600 dark:text-gray-400">
        <PawPrint className="w-10 h-10 text-teal-500 mb-3" />
        <p>Pet não encontrado 🐾</p>
      </div>
    );
  }

  // 📋 Normaliza os dados dos posts
  const posts = pet.posts.map((p) => ({
    id: p.id,
    petName: pet.name,
    petAvatar: pet.avatarUrl || "/placeholder-pet.png",
    content: p.content,
    image: p.imageUrl || undefined, // ✅ nunca null
    createdAt: new Date(p.createdAt).toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    }),
    likes: p.likes ?? 0,
    comments: p.comments?.length ?? 0,
    tutorName: pet.owner?.name || undefined, // ✅ corrigido
    tutorAvatar: pet.owner?.avatarUrl || undefined, // ✅ corrigido
  }));

  return (
    <main className="max-w-3xl mx-auto mt-24 p-4 space-y-6">
      {/* 🐶 Cabeçalho do Pet */}
      <section className="flex flex-col items-center text-center bg-white/80 dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
        <Image
          src={pet.avatarUrl || "/placeholder-pet.png"}
          alt={pet.name}
          width={120}
          height={120}
          className="rounded-full border-4 border-teal-400 shadow-md object-cover"
        />

        <h1 className="text-2xl font-bold mt-3 text-gray-800 dark:text-gray-100">
          {pet.name}
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          {pet.species || "Pet"} • {pet.breed || "Raça indefinida"}
        </p>

        {pet.bio && (
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
            {pet.bio}
          </p>
        )}

        {pet.owner && (
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            👤 Tutor:{" "}
            {pet.owner.avatarUrl && (
              <Image
                src={pet.owner.avatarUrl}
                alt={pet.owner.name || "Tutor"}
                width={18}
                height={18}
                className="rounded-full object-cover"
              />
            )}
            <span className="text-gray-500">{pet.owner.name}</span>
          </div>
        )}
      </section>

      {/* 🐾 Publicações */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <PawPrint className="w-4 h-4 text-teal-500" /> Publicações
        </h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            Nenhuma publicação ainda. 💤
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
