import type { HelpdeskArticle, HelpdeskTopic } from './helpdesk';

export const PUBLIC_TOPIC_SELECT = '*';
export const PUBLIC_ARTICLE_SELECT = '*, kb_article_tags(kb_tags(id,name,slug))';

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
