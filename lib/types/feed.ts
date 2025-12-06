// lib/types/feed.ts
export type FeedPostItem = {
  post: {
    id: string;
    authorId: string;
    petId?: string | null;
    content: string;
    imageUrl?: string | null;
    mediaUrls?: string[] | null;
    likes?: number | null;
    createdAt: string; // ISO
  };
  pet?: {
    id?: string;
    name?: string;
    avatar_url?: string | null;
  } | null;
  tutor?: {
    id?: string;
    name?: string;
    avatar_url?: string | null;
  } | null;
  commentsCount?: number | null;
};

export type FeedResponse = {
  items: FeedPostItem[];
  nextCursor: string | null;
};
