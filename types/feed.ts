export interface FeedItem {
  id: string;
  content: string;
  media: string[];
  image: string | null;

  pet: {
    name: string;
    avatar: string;
  };

  tutor: {
    name: string;
    avatar: string;
  };

  createdAt: string;
}
