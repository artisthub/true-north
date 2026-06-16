-- Create public knowledge base tables for the True North helpdesk.

CREATE TABLE IF NOT EXISTS kb_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  body_markdown TEXT NOT NULL DEFAULT '',
  topic_id UUID REFERENCES kb_topics(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_kb_topics_published_sort ON kb_topics(published, sort_order, title);
CREATE INDEX IF NOT EXISTS idx_kb_articles_status_updated ON kb_articles(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_kb_articles_topic_status ON kb_articles(topic_id, status);
CREATE INDEX IF NOT EXISTS idx_kb_articles_featured ON kb_articles(featured, status);
CREATE INDEX IF NOT EXISTS idx_kb_articles_tags ON kb_articles USING GIN(tags);

CREATE OR REPLACE FUNCTION update_kb_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_kb_topics_updated_at ON kb_topics;
CREATE TRIGGER update_kb_topics_updated_at
  BEFORE UPDATE ON kb_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_kb_updated_at();

DROP TRIGGER IF EXISTS update_kb_articles_updated_at ON kb_articles;
CREATE TRIGGER update_kb_articles_updated_at
  BEFORE UPDATE ON kb_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_kb_updated_at();

ALTER TABLE kb_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published knowledge base topics"
  ON kb_topics
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Anyone can read published knowledge base articles"
  ON kb_articles
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Service role can manage knowledge base topics"
  ON kb_topics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage knowledge base articles"
  ON kb_articles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO kb_topics (title, slug, description, sort_order, published)
VALUES
  ('Getting Started', 'getting-started', 'Set up your True North account and prepare your first release.', 10, true),
  ('Releases & Metadata', 'releases-metadata', 'Fix common release, artwork, audio, and store delivery questions.', 20, true),
  ('Rights & Platform Requests', 'rights-platform-requests', 'Handle Content ID, channel, claim, and platform support requests.', 30, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  published = EXCLUDED.published;

INSERT INTO kb_articles (title, slug, excerpt, body_markdown, topic_id, tags, status, featured)
SELECT
  'Prepare your first release',
  'prepare-your-first-release',
  'A short checklist for artwork, audio, metadata, timing, and review before delivery.',
  '## Release checklist

Before submitting a release, confirm that the core assets are ready.

- Artwork is 3000 x 3000 pixels.
- Audio is final and exported as WAV.
- Artist names, featured artists, and label details match the intended store display.
- Release date allows enough lead time for store review.

## Recommended timing

Submit releases at least four weeks before the target date when possible. This gives the team room to review details and resolve store feedback before launch.',
  id,
  ARRAY['release', 'onboarding', 'metadata'],
  'published',
  true
FROM kb_topics
WHERE slug = 'getting-started'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO kb_articles (title, slug, excerpt, body_markdown, topic_id, tags, status, featured)
SELECT
  'Fix incorrect release metadata',
  'fix-incorrect-release-metadata',
  'What to check before asking for a metadata correction on stores.',
  '## What to include

When requesting a correction, include the release title, UPC, affected stores, and the exact fields that need to change.

## Common fields

- Artist display name
- Track title
- Featured artist formatting
- Label name
- Genre
- Release date

## Before submitting

Check whether the issue appears on every store or only one platform. This helps route the request correctly.',
  id,
  ARRAY['metadata', 'stores', 'correction'],
  'published',
  true
FROM kb_topics
WHERE slug = 'releases-metadata'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO kb_articles (title, slug, excerpt, body_markdown, topic_id, tags, status, featured)
SELECT
  'Request a YouTube claim review',
  'request-a-youtube-claim-review',
  'When to submit a claim review and which details support needs from you.',
  '## When to request review

Use a claim review when a video is incorrectly claimed, a trusted channel needs safelisting, or a manual claim is required.

## Details to provide

- YouTube video URL
- Channel URL
- Release title and ISRC or UPC
- Reason the claim should be added, released, or adjusted

## Next step

Use the relevant support form from the existing support page when the request is ready.',
  id,
  ARRAY['youtube', 'claims', 'content-id'],
  'published',
  true
FROM kb_topics
WHERE slug = 'rights-platform-requests'
ON CONFLICT (slug) DO NOTHING;
