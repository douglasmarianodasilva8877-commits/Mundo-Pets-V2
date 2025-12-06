-- 0001_init_schema.sql
BEGIN;

-- users
CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY,
  name text,
  email text NOT NULL UNIQUE,
  password_hash text,
  role text NOT NULL DEFAULT 'USER',
  avatar_url text,
  city text,
  bio text,
  cpf text UNIQUE,
  phone text,
  address text,
  birth_date timestamptz,
  privacy jsonb,
  verified boolean NOT NULL DEFAULT false,
  address_complement text,
  postal_code text,
  has_ecommerce_access boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- pets
CREATE TABLE IF NOT EXISTS pets (
  id varchar PRIMARY KEY,
  name text NOT NULL,
  slug varchar NOT NULL UNIQUE,
  species text,
  breed text,
  age integer,
  bio text,
  description text,
  avatar_url text,
  owner_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- posts
CREATE TABLE IF NOT EXISTS posts (
  id varchar PRIMARY KEY,
  author_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id varchar REFERENCES pets(id) ON DELETE SET NULL,
  content text NOT NULL,
  media jsonb NOT NULL DEFAULT '[]'::jsonb,
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- post_likes
CREATE TABLE IF NOT EXISTS post_likes (
  id text PRIMARY KEY,
  post_id text NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

-- comments (minimal)
CREATE TABLE IF NOT EXISTS comments (
  id varchar PRIMARY KEY,
  post_id text NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- followers
CREATE TABLE IF NOT EXISTS followers (
  id text PRIMARY KEY,
  follower_pet_id text NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  following_pet_id text NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_pet_id ON posts (pet_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_postlikes_post_id ON post_likes (post_id);
CREATE INDEX IF NOT EXISTS idx_postlikes_user_id ON post_likes (user_id);

COMMIT;
