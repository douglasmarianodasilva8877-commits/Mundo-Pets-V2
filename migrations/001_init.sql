-- migrations/001_init.sql
-- Tutors (users)
CREATE TABLE IF NOT EXISTS tutors (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'USER',
  avatar_url TEXT,
  city TEXT,
  bio TEXT,
  cpf TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  birth_date TIMESTAMPTZ,
  privacy JSONB,
  verified BOOLEAN DEFAULT false,
  address_complement TEXT,
  postal_code TEXT,
  has_ecommerce_access BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pets
CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT,
  slug TEXT UNIQUE,
  breed TEXT,
  age INT,
  bio TEXT,
  description TEXT,
  avatar_url TEXT,
  owner_id TEXT,
  owner_email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pets_owner ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_pets_slug ON pets(slug);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  pet_id TEXT REFERENCES pets(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  media_urls JSONB,
  image_url TEXT,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sponsors / Campaigns (optional)
CREATE TABLE IF NOT EXISTS sponsors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  sponsor_id TEXT NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  budget DOUBLE PRECISION DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Accounts (NextAuth compatibility)
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_accounts_provider ON accounts(provider, provider_account_id);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT UNIQUE,
  user_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
