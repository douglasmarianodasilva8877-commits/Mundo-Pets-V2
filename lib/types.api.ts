// lib/types.api.ts

export type RegisterTutorDTO = {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  pet?: {
    name: string;
    species?: string;
    breed?: string;
    age?: number;
    avatarUrl?: string;
    bio?: string;
  };
};

export type LoginDTO = {
  email: string;
  password: string;
};
