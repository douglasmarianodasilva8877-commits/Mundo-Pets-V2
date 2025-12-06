-- 0002_migrate_legacy_media_and_cleanup.sql
BEGIN;

-- Convert media_urls text[] → media jsonb
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='media_urls') THEN
    UPDATE posts
    SET media = (
      SELECT COALESCE(jsonb_agg(
        CASE
          WHEN elem LIKE '%.mp4' OR elem LIKE '%.mov' OR elem LIKE '%.webm' THEN jsonb_build_object('type','video','url',elem)
          ELSE jsonb_build_object('type','image','url',elem)
        END
      ), '[]'::jsonb)
      FROM unnest(media_urls::text[]) AS elem
    )
    WHERE media_urls IS NOT NULL;
    ALTER TABLE posts DROP COLUMN IF EXISTS media_urls;
  END IF;
END$$;

-- If image_url exists, move to media if media empty
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='image_url') THEN
    UPDATE posts
    SET media = CASE
      WHEN media IS NULL OR jsonb_array_length(media) = 0 THEN jsonb_build_array(jsonb_build_object('type','image','url',image_url))
      ELSE media
    END
    WHERE image_url IS NOT NULL;
    ALTER TABLE posts DROP COLUMN IF EXISTS image_url;
  END IF;
END$$;

-- Remove /mnt/data references
UPDATE posts
SET media = '[]'::jsonb
WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(media) AS el WHERE el->>'url' LIKE '/mnt/data/%');

UPDATE users SET avatar_url = '/placeholder-pet.png' WHERE avatar_url LIKE '/mnt/data/%';
UPDATE pets SET avatar_url = '/placeholder-pet.png' WHERE avatar_url LIKE '/mnt/data/%';

COMMIT;
