-- 01_core.sql
CREATE TABLE IF NOT EXISTS brand (
  brand_id SERIAL PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  aliases TEXT[] NOT NULL DEFAULT '{}'::TEXT[]
);

CREATE TABLE IF NOT EXISTS ig_account (
  ig_user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  full_name TEXT,
  followers INTEGER,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ig_post (
  media_id TEXT PRIMARY KEY,
  code TEXT,
  owner_id TEXT REFERENCES ig_account(ig_user_id),
  taken_at TIMESTAMPTZ,
  caption TEXT,
  like_count INTEGER,
  comment_count INTEGER,
  permalink TEXT,
  raw JSONB,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ig_post_taken_at_idx ON ig_post(taken_at DESC);
CREATE INDEX IF NOT EXISTS ig_post_gin_raw ON ig_post USING GIN (raw);

CREATE TABLE IF NOT EXISTS ig_comment (
  comment_id TEXT PRIMARY KEY,
  media_id TEXT REFERENCES ig_post(media_id) ON DELETE CASCADE,
  author_id TEXT REFERENCES ig_account(ig_user_id),
  text TEXT,
  created_at TIMESTAMPTZ,
  sentiment SMALLINT,
  raw JSONB,
  scraped_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ig_comment_media_idx ON ig_comment(media_id);
CREATE INDEX IF NOT EXISTS ig_comment_created_idx ON ig_comment(created_at DESC);

CREATE TYPE mention_source AS ENUM ('caption', 'comment', 'hashtag');
CREATE TABLE IF NOT EXISTS ig_mention (
  id BIGSERIAL PRIMARY KEY,
  media_id TEXT REFERENCES ig_post(media_id) ON DELETE CASCADE,
  source mention_source NOT NULL,
  matched_as TEXT NOT NULL,
  author_id TEXT,
  created_at DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS ig_mention_created_idx ON ig_mention(created_at);

CREATE TABLE IF NOT EXISTS ig_daily_metrics (
  brand_id INTEGER REFERENCES brand(brand_id),
  day DATE NOT NULL,
  mentions INTEGER NOT NULL DEFAULT 0,
  pos INTEGER NOT NULL DEFAULT 0,
  neg INTEGER NOT NULL DEFAULT 0,
  neu INTEGER NOT NULL DEFAULT 0,
  est_reach BIGINT NOT NULL DEFAULT 0,
  likes BIGINT NOT NULL DEFAULT 0,
  comments BIGINT NOT NULL DEFAULT 0,
  unique_authors INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (brand_id, day)
);
