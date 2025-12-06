"use client";

import { useState, useRef, useEffect } from "react";
import { useComments } from "@/hooks/useComments";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Comments({
  postId,
  pet,
}: {
  postId: string;
  pet: { id: string; name: string; avatar?: string } | null;
}) {
  const petId = pet?.id ?? null;

  const { comments, loading, addComment } = useComments(postId, petId);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // scroll automático ao adicionar comentário
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [comments]);

  async function handleSend() {
    if (!text.trim()) return;
    if (!petId) {
      alert("Selecione ou crie um pet para comentar.");
      return;
    }

    const msg = text.trim();
    setText("");
    setSending(true);

    try {
      await addComment(msg);
    } catch {
      // fallback simples, UI otimista já cuida do rollback
      alert("Erro ao enviar comentário.");
    }

    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Lista de comentários */}
      <div
        ref={boxRef}
        className="max-h-80 overflow-y-auto pr-2 flex flex-col gap-4"
      >
        {loading && comments.length === 0 && (
          <div className="flex items-center justify-center py-6 text-gray-500">
            <Loader2 className="animate-spin mr-2" size={18} />
            Carregando comentários...
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            Nenhum comentário ainda. Seja o primeiro! 🐾
          </div>
        )}

        {comments.map((c) => {
          const isTemp = String(c.id).startsWith("temp");
          const petInfo = c.pet || null;

          return (
            <div
              key={c.id}
              className={`flex items-start gap-3 p-2 rounded-xl ${
                isTemp
                  ? "opacity-70 bg-gray-100 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              } transition`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {petInfo?.avatar ? (
                  <Image
                    src={petInfo.avatar}
                    width={40}
                    height={40}
                    alt="avatar pet"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-sm">🐾</span>
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
                  <p className="text-sm font-semibold">
                    {petInfo?.name ?? "Pet"}
                  </p>

                  <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                </div>

                <p className="text-[11px] text-gray-500 mt-1">
                  {isTemp ? "Enviando..." : formatDate(c.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input de comentário */}
      <div className="flex items-end gap-3">
        {/* Avatar do pet que está comentando */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {pet?.avatar ? (
            <Image
              src={pet.avatar}
              alt="avatar pet"
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <span className="text-gray-600 text-sm">🐾</span>
          )}
        </div>

        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escreva um comentário..."
          className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-3 text-sm outline-none resize-none"
        />

        <button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm disabled:opacity-50"
        >
          {sending ? <Loader2 className="animate-spin" size={16} /> : "Enviar"}
        </button>
      </div>
    </div>
  );
}

function formatDate(dt: string | Date) {
  const d = new Date(dt);
  return d.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}
