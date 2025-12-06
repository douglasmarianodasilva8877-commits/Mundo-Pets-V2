// components/CommentsList.tsx
"use client";

import Image from "next/image";
import { CommentForm } from "@/components/CommentForm";
import { useComments } from "@/hooks/useComments";

export function CommentsList({ postId }: { postId: string }) {
  const { comments, loading, create, remove } = useComments(postId);

  return (
    <div className="space-y-3">
      <CommentForm onCreate={(c) => create(c)} />

      {loading ? (
        <p>Carregando comentários...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">Seja o primeiro a comentar.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="flex gap-3 items-start">
            <Image src="/placeholder-pet.png" alt="pet" width={40} height={40} className="rounded-full" />
            <div className="flex-1">
              <div className="text-sm text-gray-800">{c.content}</div>
              <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
            </div>

            <button onClick={() => remove(c.id)} className="text-xs text-red-500">Remover</button>
          </div>
        ))
      )}
    </div>
  );
}
