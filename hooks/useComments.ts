// hooks/useComments.ts
"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  postId: string;
  petId: string;
  content: string;
  createdAt: string | Date;
  pet?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export function useComments(postId: string, petId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = `comments:${postId}`;

  // ------------------------------------------------------
  // 1) Carregar cache local primeiro (fast UI)
  // ------------------------------------------------------
  useEffect(() => {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setComments(parsed);
      } catch {
        /* ignore */
      }
    }
  }, [STORAGE_KEY]);

  // ------------------------------------------------------
  // 2) Buscar comentários do servidor
  // ------------------------------------------------------
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/comments?postId=${postId}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          console.warn("Falha ao buscar comentários, usando cache local apenas");
          setLoading(false);
          return;
        }

        const json = await res.json();
        if (json?.comments) {
          setComments(json.comments);

          // salva no cache local
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(json.comments));
        }
      } catch (err) {
        console.warn("Offline — carregando somente cache local.");
      }
      setLoading(false);
    }

    load();
  }, [postId, STORAGE_KEY]);

  // ------------------------------------------------------
  // 3) addComment — Optimistic UI + sincronização
  // ------------------------------------------------------
  const addComment = useCallback(
    async (content: string) => {
      if (!petId) throw new Error("É necessário um petId para comentar.");

      const tempId = `temp-${Math.random().toString(36).slice(2)}`;

      const optimistic: Comment = {
        id: tempId,
        postId,
        petId,
        content,
        createdAt: new Date(),
      };

      // update instantâneo
      setComments((prev) => {
        const next = [...prev, optimistic];
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            content,
            petId,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json?.success) {
          throw new Error(json?.message || "Erro ao criar comentário");
        }

        const real = json.comment;

        // substitui o comentário temporário
        setComments((prev) => {
          const next = prev.map((c) => (c.id === tempId ? real : c));
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      } catch (err) {
        console.error("Erro ao enviar comentário (rollback):", err);

        // rollback
        setComments((prev) => {
          const next = prev.filter((c) => c.id !== tempId);
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });

        throw err;
      }
    },
    [postId, petId, STORAGE_KEY]
  );

  // ------------------------------------------------------
  // 4) Ordenação sempre por createdAt asc
  // ------------------------------------------------------
  const sorted = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return {
    comments: sorted,
    loading,
    addComment,
  };
}
