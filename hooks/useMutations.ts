// hooks/useMutations.ts
"use client";

import { useState, useCallback } from "react";

type UseMutationResult<T = any> = {
  mutate: (payload: any) => Promise<T | null>;
  loading: boolean;
  error: string | null;
};

export function useCreatePet(onSuccess?: (res: any) => void): UseMutationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (payload: FormData | Record<string, any>) => {
      setLoading(true);
      setError(null);

      try {
        let res;
        if (payload instanceof FormData) {
          res = await fetch("/api/pets", { method: "POST", body: payload });
        } else {
          res = await fetch("/api/pets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Erro ao criar pet");
        onSuccess?.(json);
        setLoading(false);
        return json;
      } catch (err: any) {
        setError(err?.message ?? "Erro");
        setLoading(false);
        return null;
      }
    },
    [onSuccess]
  );

  return { mutate, loading, error };
}

export function useUpdatePet(onSuccess?: (res: any) => void): UseMutationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (payload: { id: string; body: any }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/pets/${payload.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload.body),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Erro ao atualizar");
        onSuccess?.(json);
        setLoading(false);
        return json;
      } catch (err: any) {
        setError(err?.message ?? "Erro");
        setLoading(false);
        return null;
      }
    },
    [onSuccess]
  );

  return { mutate, loading, error };
}

export function useDeletePet(onSuccess?: () => void): UseMutationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (payload: { id: string }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/pets/${payload.id}`, { method: "DELETE" });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Erro ao deletar");
        onSuccess?.();
        setLoading(false);
        return json;
      } catch (err: any) {
        setError(err?.message ?? "Erro");
        setLoading(false);
        return null;
      }
    },
    [onSuccess]
  );

  return { mutate, loading, error };
}

export function useUpdateTutor(onSuccess?: (res: any) => void): UseMutationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (payload: { id: string; body: any }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tutor/${payload.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload.body),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Erro ao atualizar tutor");
        onSuccess?.(json);
        setLoading(false);
        return json;
      } catch (err: any) {
        setError(err?.message ?? "Erro");
        setLoading(false);
        return null;
      }
    },
    [onSuccess]
  );

  return { mutate, loading, error };
}
