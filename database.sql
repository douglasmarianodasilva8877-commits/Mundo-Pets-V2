-- ======================================
-- ==========   TUTORS TABLE   ==========
-- ======================================
CREATE TABLE tutors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tutors_email ON tutors(email);


-- ======================================
-- ==========     PETS TABLE    =========
-- ======================================
CREATE TABLE pets (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age INT,
  avatar_url TEXT,
  bio TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pets_tutor_id ON pets(tutor_id);
CREATE INDEX idx_pets_species ON pets(species);


-- ======================================
-- ==========     POSTS TABLE   =========
-- ======================================
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_pet_id ON posts(pet_id);


-- ======================================
-- ========    COMMENTS TABLE   =========
-- ======================================
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  content TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_pet_id ON comments(pet_id);
