// lib/types.ts

export type ID = string;

export type Pet = {
  id: ID;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  avatarUrl?: string;
  bio?: string;
  tutorId: ID;
  createdAt: string;
};

export type Tutor = {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
};

export type Post = {
  id: ID;
  petId: ID;
  content: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  createdAt: string;
};

export type Comment = {
  id: ID;
  postId: ID;
  petId: ID;
  content: string;
  createdAt: string;
};
