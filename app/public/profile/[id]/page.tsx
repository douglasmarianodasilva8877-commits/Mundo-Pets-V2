import React from "react";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { prisma } from "@/lib/prisma"; // Supondo que você tenha um cliente prisma em lib/

async function getUserPosts(userId: string) {
  // Chame o Prisma diretamente
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    include: { author: true /* ...e outras relações */ },
    orderBy: { createdAt: "desc" },
  });
  return posts;
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const posts = await getUserPosts(id);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card">
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-3 flex items-center justify-center text-2xl">U</div>
            <h2 className="text-xl font-bold">Usuário {id}</h2>
            <p className="mt-2 text-sm text-gray-500">Bio do usuário — adicione mais campos no DB.</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">Posts</h3>
          {posts.length === 0 ? <div className="card">Nenhum post</div> : posts.map((p: any) => <PostCard key={p.id} post={p} />)}
        </div>
      </div>
    </Layout>
  );
}
