// context/FeedContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";

type MediaItem = { type: "image" | "video"; url: string; blurhash?: string };
type APIItem = {
  post: {
    id: string;
    content?: string | null;
    media?: MediaItem[] | null;
    createdAt: string;
    likes?: number | null;
  };
  pet?: { id?: string; name?: string; avatar_url?: string | null } | null;
  tutor?: { id?: string; name?: string; avatar_url?: string | null } | null;
  commentsCount?: number | null;
};

export type Post = {
  id: string;
  content?: string | null;
  media: MediaItem[];
  createdAt: string;
  likes: number;
  comments: number;
  petName?: string | null;
  petAvatar?: string | null;
  tutorName?: string | null;
  tutorAvatar?: string | null;
  liked?: boolean;
  offline?: boolean;
};

type FeedContextType = {
  posts: Post[];
  groupedPosts: any[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchPosts: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  addPost: (apiPost: any) => Promise<void>;
  toggleLike: (postId: string) => void;
  addComment: (postId: string) => void;
  clearFeed: () => void;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

const STORAGE_KEY = "mundo-pets-feed-v2";
const PAGE_LIMIT = 10;

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [groupedPosts, setGroupedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchingRef = useRef(false);
  const loadedRef = useRef(false);

  const transformApiItem = (it: APIItem): Post => {
    const p = it.post;
    const mediaArr: MediaItem[] = Array.isArray(p.media) ? p.media : [];

    return {
      id: p.id,
      content: p.content ?? null,
      createdAt: p.createdAt,
      media: mediaArr,
      likes: p.likes ?? 0,
      comments: it.commentsCount ?? 0,
      petName: it.pet?.name ?? null,
      petAvatar: it.pet?.avatar_url ?? null,
      tutorName: it.tutor?.name ?? null,
      tutorAvatar: it.tutor?.avatar_url ?? null,
      liked: false,
      offline: false,
    };
  };

  const persist = useCallback((list: Post[], nextCursor: string | null) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts: list, cursor: nextCursor }));
    } catch {}
  }, []);

  const loadFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const fetchPosts = useCallback(
    async (reset = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const currentCursor = reset ? null : cursor;
        const params = new URLSearchParams();
        params.set("limit", String(PAGE_LIMIT));
        if (currentCursor) params.set("cursor", currentCursor);

        const res = await fetch(`/api/feed?${params.toString()}`, { cache: "no-store" });
        const json = await res.json();
        const items: APIItem[] = json.items ?? [];
        const nextCursor: string | null = json.nextCursor ?? null;

        const transformed = items.map(transformApiItem);
        const finalList = reset ? transformed : [...posts, ...transformed];

        setPosts(finalList);
        setCursor(nextCursor);
        setHasMore(Boolean(nextCursor));
        persist(finalList, nextCursor);
      } catch (err) {
        setError("Erro ao carregar feed");
        const saved = loadFromStorage();
        if (saved?.posts) {
          setPosts(saved.posts);
          setCursor(saved.cursor ?? null);
          setHasMore(Boolean(saved.cursor));
        }
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    },
    [cursor, posts, persist, loadFromStorage]
  );

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const saved = loadFromStorage();
    if (saved?.posts) {
      setPosts(saved.posts);
      setCursor(saved.cursor ?? null);
      setHasMore(Boolean(saved.cursor));
    }
    fetchPosts(true);
  }, []);

  const groupPostsByPet = useCallback((list: Post[]) => {
    const map = new Map();
    for (const p of list) {
      const key = p.petName ?? p.tutorName ?? "Desconhecido";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    return Array.from(map.entries()).map(([petName, posts]) => ({
      petName,
      petAvatar: posts[0]?.petAvatar ?? null,
      posts,
    }));
  }, []);

  useEffect(() => {
    setGroupedPosts(groupPostsByPet(posts));
  }, [posts, groupPostsByPet]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    await fetchPosts();
  }, [hasMore, fetchPosts]);

  const addPost = useCallback(
    async (apiPost: any) => {
      if (!apiPost) return;
      const normalized: APIItem = {
        post: {
          id: apiPost.id,
          content: apiPost.content,
          media: apiPost.media ?? [],
          createdAt: apiPost.createdAt ?? new Date().toISOString(),
          likes: apiPost.likesCount ?? 0,
        },
        pet: apiPost.pet ?? null,
        tutor: apiPost.author ?? null,
        commentsCount: 0,
      };

      const newPost = transformApiItem(normalized);
      setPosts((prev) => {
        const updated = [newPost, ...prev];
        persist(updated, cursor);
        return updated;
      });
    },
    [cursor, persist]
  );

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) => {
      const updated = prev.map((p) =>
        p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      );
      persist(updated, cursor);
      return updated;
    });
  }, [persist, cursor]);

  const addComment = useCallback((postId: string) => {
    setPosts((prev) => {
      const updated = prev.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p));
      persist(updated, cursor);
      return updated;
    });
  }, [persist, cursor]);

  const clearFeed = () => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <FeedContext.Provider value={{ posts, groupedPosts, loading, error, hasMore, fetchPosts, loadMore, addPost, toggleLike, addComment, clearFeed }}>
      {children}
    </FeedContext.Provider>
  );
}

export const useFeed = () => {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed deve ser usado dentro de um FeedProvider");
  return ctx;
};
