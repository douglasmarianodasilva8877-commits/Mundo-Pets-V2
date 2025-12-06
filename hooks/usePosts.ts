// hooks/usePosts.ts
"use client";

import { useState, useCallback } from "react";

export function useCreatePost(onSuccess?: (res: any) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: { content?: string; petId?: string; media?: File[] | string[] }, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      if (payload.content) form.append("content", payload.content);
      if (payload.petId) form.append("petId", payload.petId);

      if (payload.media && Array.isArray(payload.media)) {
        for (const m of payload.media) {
          if (typeof m === "string") {
            const blob = await fetch(m).then((r) => r.blob());
            form.append("media", blob, "upload.jpg");
          } else {
            form.append("media", m);
          }
        }
      }

      const headers: Record<string,string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/posts", { method: "POST", body: form, headers });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Erro ao criar post");
      onSuccess?.(json);
      setLoading(false);
      return json;
    } catch (err: any) {
      setError(err?.message ?? "Erro");
      setLoading(false);
      return null;
    }
  }, [onSuccess]);

  return { create, loading, error };
}

export function useUpdatePost(onSuccess?: (res: any) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, payload: { content?: string; media?: File[] | string[] }, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      if (payload.content) form.append("content", payload.content);
      if (payload.media && Array.isArray(payload.media)) {
        for (const m of payload.media) {
          if (typeof m === "string") {
            const blob = await fetch(m).then((r) => r.blob());
            form.append("media", blob, "upload.jpg");
          } else {
            form.append("media", m);
          }
        }
      }
      const headers: Record<string,string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/posts/${id}`, { method: "PATCH", body: form, headers });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Erro ao atualizar");
      onSuccess?.(json);
      setLoading(false);
      return json;
    } catch (err: any) {
      setError(err?.message ?? "Erro");
      setLoading(false);
      return null;
    }
  }, [onSuccess]);

  return { update, loading, error };
}

export function useDeletePost(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destroy = useCallback(async (id: string, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string,string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/posts/${id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Erro ao deletar");
      onSuccess?.();
      setLoading(false);
      return json;
    } catch (err: any) {
      setError(err?.message ?? "Erro");
      setLoading(false);
      return null;
    }
  }, [onSuccess]);

  return { destroy, loading, error };
}
