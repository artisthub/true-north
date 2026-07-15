ALTER TABLE kb_articles
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_kb_articles_search_vector
  ON kb_articles USING GIN (search_vector)
  WHERE status = 'published';

CREATE OR REPLACE FUNCTION get_public_kb_tags()
RETURNS TABLE (id UUID, name TEXT, slug TEXT, article_count BIGINT)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT tag.id, tag.name, tag.slug, count(DISTINCT article.id) AS article_count
  FROM public.kb_tags tag
  JOIN public.kb_article_tags assignment ON assignment.tag_id = tag.id
  JOIN public.kb_articles article ON article.id = assignment.article_id
  WHERE article.status = 'published'
  GROUP BY tag.id, tag.name, tag.slug
  ORDER BY article_count DESC, tag.name ASC;
$$;

REVOKE ALL ON FUNCTION get_public_kb_tags() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_public_kb_tags() TO service_role;
