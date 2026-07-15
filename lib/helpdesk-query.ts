import type { HelpdeskArticle, HelpdeskTopic } from './helpdesk';

export const PUBLIC_TOPIC_SELECT = '*';
export const PUBLIC_ARTICLE_SUMMARY_SELECT = 'id,created_at,updated_at,title,slug,excerpt,topic_id,status,featured,view_count,kb_article_tags(kb_tags(id,name,slug))';
export const PUBLIC_ARTICLE_DETAIL_SELECT = `${PUBLIC_ARTICLE_SUMMARY_SELECT},body_markdown`;
export const PUBLIC_ARTICLE_SELECT = PUBLIC_ARTICLE_DETAIL_SELECT;

export function normalizePublishedArticles(
  articles: any[],
  topics: Array<Pick<HelpdeskTopic, 'id'> & Partial<HelpdeskTopic>>,
): HelpdeskArticle[] {
  const topicsById = new Map(topics.map((topic) => [topic.id, topic]));

  return articles.map((article) => ({
    ...article,
    tags: (article.kb_article_tags || [])
      .map((item: any) => item.kb_tags)
      .filter(Boolean),
    topic: article.topic_id ? topicsById.get(article.topic_id) || null : null,
  })) as HelpdeskArticle[];
}
