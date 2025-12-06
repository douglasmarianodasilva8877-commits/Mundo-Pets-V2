// hooks/useFeed.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FeedPostItem, FeedResponse } from "@/lib/types/feed";

export function useFeed({ initialLimit = 10 } = {}) {
  const [items, setItems] = useState<FeedPostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [filters, setFilters] = useState<{
    species?: string | null;
    petId?: string | null;
    tutorId?: string | null;
    q?: string | null;
  }>({});

  const buildUrl = useCallback((cursor?: string | null, limit?: number) => {
    const params = new URLSearchParams();
    params.set("limit", String(limit ?? initialLimit));
    if (cursor) params.set("cursor", cursor);
    if (filters.species) params.set("species", filters.species);
    if (filters.petId) params.set("petId", filters.petId);
    if (filters.tutorId) params.set("tutorId", filters.tutorId);
    if (filters.q) params.set("q", filters.q);
    return `/api/feed?${params.toString()}`;
  }, [filters, initialLimit]);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildUrl(null, initialLimit), { cache: "no-store" });
      const json: FeedResponse & { success?: boolean } = await res.json();
      if (!res.ok || json.items === undefined) throw new Error(json?.message ?? "Erro ao buscar feed");
      setItems(json.items);
      setNextCursor(json.nextCursor);
    } catch (err: any) {
      setError(err?.message ?? "Erro");
    } finally {
      setLoading(false);
    }
  }, [buildUrl, initialLimit]);

  const loadMore = useCallback(async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    setError(null);
    try {
      const res = await fetch(buildUrl(nextCursor, initialLimit), { cache: "no-store" });
      const json: FeedResponse & { success?: boolean } = await res.json();
      if (!res.ok || json.items === undefined) throw new Error(json?.message ?? "Erro ao buscar feed");
      setItems((prev) => [...prev, ...json.items]);
      setNextCursor(json.nextCursor);
    } catch (err: any) {
      setError(err?.message ?? "Erro");
    } finally {
      setLoadingMore(false);
    }
  }, [buildUrl, nextCursor, initialLimit]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const applyFilters = useCallback((f: { species?: string | null; petId?: string | null; tutorId?: string | null; q?: string | null }) => {
    setFilters(f);
  }, []);

  // re-fetch when filters change
  useEffect(() => {
    loadInitial();
  }, [filters, loadInitial]);

  const hasMore = Boolean(nextCursor);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    applyFilters,
    setFilters,
    refresh: loadInitial,
  };
}
