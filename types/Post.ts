export interface Post {
  id: string;
  petName: string;
  petAvatar: string;
  content: string;
  media?: string | File | undefined;
  mediaType?: "image" | "video";
  createdAt: string;
  likes: number;
  comments: number;
}
