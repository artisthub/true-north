import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from './supabase';

export type HelpdeskTopic = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  description: string;
  sort_order: number;
  published: boolean;
};

export type HelpdeskArticleStatus = 'draft' | 'published' | 'archived';

export type HelpdeskArticle = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  excerpt: string;
  body_markdown: string;
  topic_id: string | null;
  tags: string[];
  status: HelpdeskArticleStatus;
  featured: boolean;
  view_count: number;
  topic?: HelpdeskTopic | null;
};

export type HelpdeskData = {
  topics: HelpdeskTopic[];
  articles: HelpdeskArticle[];
};

const articleOrder = (a: HelpdeskArticle, b: HelpdeskArticle) => {
  if (a.featured !== b.featured) {
    return a.featured ? -1 : 1;
  }

  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
};

function attachTopics(articles: HelpdeskArticle[], topics: HelpdeskTopic[]) {
  const topicsById = new Map(topics.map((topic) => [topic.id, topic]));

  return articles.map((article) => ({
    ...article,
    tags: article.tags || [],
    topic: article.topic_id ? topicsById.get(article.topic_id) || null : null,
  }));
}

export async function getPublishedHelpdeskData(): Promise<HelpdeskData> {
  noStore();

  if (!supabase) {
    return { topics: [], articles: [] };
  }

  try {
    const [topicsResult, articlesResult] = await Promise.all([
      supabase
        .from('kb_topics')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true }),
      supabase
        .from('kb_articles')
        .select('*')
        .eq('status', 'published')
        .order('updated_at', { ascending: false }),
    ]);

    if (topicsResult.error) throw topicsResult.error;
    if (articlesResult.error) throw articlesResult.error;

    const topics = (topicsResult.data || []) as HelpdeskTopic[];
    const articles = attachTopics((articlesResult.data || []) as HelpdeskArticle[], topics).sort(articleOrder);

    return { topics, articles };
  } catch (error) {
    console.error('Helpdesk data fetch error:', error);
    return { topics: [], articles: [] };
  }
}

export async function getPublishedTopic(slug: string) {
  const { topics, articles } = await getPublishedHelpdeskData();
  const topic = topics.find((item) => item.slug === slug) || null;

  return {
    topic,
    articles: topic ? articles.filter((article) => article.topic_id === topic.id) : [],
  };
}

export async function getPublishedArticle(slug: string) {
  const { topics, articles } = await getPublishedHelpdeskData();
  const article = articles.find((item) => item.slug === slug) || null;

  return {
    article,
    topics,
    relatedArticles: article
      ? articles
          .filter((item) => item.id !== article.id && item.topic_id === article.topic_id)
          .slice(0, 3)
      : [],
  };
}

export function searchArticles(articles: HelpdeskArticle[], query: string) {
  const term = query.trim().toLowerCase();

  if (!term) {
    return articles;
  }

  return articles.filter((article) => {
    const haystack = [
      article.title,
      article.excerpt,
      article.body_markdown,
      article.topic?.title || '',
      ...(article.tags || []),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  });
}
