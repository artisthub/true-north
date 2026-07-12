CREATE TABLE kb_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL CHECK (name = btrim(name) AND name <> ''),
  slug TEXT NOT NULL UNIQUE CHECK (slug <> '')
);

CREATE UNIQUE INDEX kb_tags_name_ci_unique ON kb_tags (lower(name));

CREATE TABLE kb_article_tags (
  article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES kb_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX kb_article_tags_tag_article_idx ON kb_article_tags(tag_id, article_id);

WITH canonical AS (
  SELECT DISTINCT ON (lower(btrim(tag))) btrim(tag) AS name
  FROM kb_articles, unnest(tags) AS tag
  WHERE btrim(tag) <> ''
  ORDER BY lower(btrim(tag)), btrim(tag)
), based AS (
  SELECT name, trim(both '-' from regexp_replace(regexp_replace(lower(name), '&', ' and ', 'g'), '[^a-z0-9]+', '-', 'g')) AS base_slug
  FROM canonical
), numbered AS (
  SELECT name, base_slug, row_number() OVER (PARTITION BY base_slug ORDER BY lower(name)) AS collision
  FROM based WHERE base_slug <> ''
)
INSERT INTO kb_tags (name, slug)
SELECT name, base_slug || CASE WHEN collision = 1 THEN '' ELSE '-' || collision END FROM numbered;

INSERT INTO kb_article_tags (article_id, tag_id)
SELECT DISTINCT article.id, canonical.id
FROM kb_articles article
CROSS JOIN unnest(article.tags) AS legacy(name)
JOIN kb_tags canonical ON lower(canonical.name) = lower(btrim(legacy.name))
ON CONFLICT DO NOTHING;

ALTER TABLE kb_articles DROP COLUMN tags;

CREATE TRIGGER update_kb_tags_updated_at
  BEFORE UPDATE ON kb_tags
  FOR EACH ROW EXECUTE FUNCTION update_kb_updated_at();

ALTER TABLE kb_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_article_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public knowledge base tags" ON kb_tags FOR SELECT TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM kb_article_tags assignment
  JOIN kb_articles article ON article.id = assignment.article_id
  WHERE assignment.tag_id = kb_tags.id AND article.status = 'published'
));

CREATE POLICY "Anyone can read public knowledge base tag assignments" ON kb_article_tags FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM kb_articles article WHERE article.id = article_id AND article.status = 'published'));

CREATE POLICY "Service role can manage knowledge base tags" ON kb_tags FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage knowledge base tag assignments" ON kb_article_tags FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT SELECT ON kb_tags, kb_article_tags TO anon, authenticated;
GRANT ALL ON kb_tags, kb_article_tags TO service_role;

CREATE OR REPLACE FUNCTION save_kb_article(
  p_id UUID, p_title TEXT, p_slug TEXT, p_excerpt TEXT, p_body_markdown TEXT,
  p_topic_id UUID, p_status TEXT, p_featured BOOLEAN, p_tag_ids UUID[]
) RETURNS kb_articles LANGUAGE plpgsql SECURITY INVOKER AS $$
DECLARE saved kb_articles;
BEGIN
  IF EXISTS (SELECT 1 FROM unnest(coalesce(p_tag_ids, '{}')) requested(id) LEFT JOIN kb_tags t ON t.id = requested.id WHERE t.id IS NULL) THEN
    RAISE EXCEPTION 'One or more tags do not exist';
  END IF;
  IF p_id IS NULL THEN
    INSERT INTO kb_articles(title, slug, excerpt, body_markdown, topic_id, status, featured)
    VALUES (p_title, p_slug, p_excerpt, p_body_markdown, p_topic_id, p_status, p_featured) RETURNING * INTO saved;
  ELSE
    UPDATE kb_articles SET title=p_title, slug=p_slug, excerpt=p_excerpt, body_markdown=p_body_markdown,
      topic_id=p_topic_id, status=p_status, featured=p_featured WHERE id=p_id RETURNING * INTO saved;
    IF saved.id IS NULL THEN RAISE EXCEPTION 'Article not found'; END IF;
  END IF;
  DELETE FROM kb_article_tags WHERE article_id=saved.id;
  INSERT INTO kb_article_tags(article_id, tag_id) SELECT saved.id, id FROM unnest(coalesce(p_tag_ids, '{}')) id ON CONFLICT DO NOTHING;
  RETURN saved;
END $$;

REVOKE ALL ON FUNCTION save_kb_article(UUID,TEXT,TEXT,TEXT,TEXT,UUID,TEXT,BOOLEAN,UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION save_kb_article(UUID,TEXT,TEXT,TEXT,TEXT,UUID,TEXT,BOOLEAN,UUID[]) TO service_role;
