import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from './supabase';
import {
  PUBLIC_ARTICLE_SELECT,
  PUBLIC_TOPIC_SELECT,
  normalizePublishedArticles,
} from './helpdesk-query';

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
export type HelpdeskTag = { id: string; name: string; slug: string };

export type HelpdeskArticle = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  excerpt: string;
  body_markdown: string;
  topic_id: string | null;
  tags: HelpdeskTag[];
  status: HelpdeskArticleStatus;
  featured: boolean;
  view_count: number;
  topic?: HelpdeskTopic | null;
};

export type HelpdeskData = {
  topics: HelpdeskTopic[];
  articles: HelpdeskArticle[];
  tags: HelpdeskTag[];
};

const articleOrder = (a: HelpdeskArticle, b: HelpdeskArticle) => {
  if (a.featured !== b.featured) {
    return a.featured ? -1 : 1;
  }

  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
};

export async function getPublishedHelpdeskData(): Promise<HelpdeskData> {
  noStore();

  if (!supabase) {
    return { topics: [], articles: [], tags: [] };
  }

  try {
    const [topicsResult, articlesResult] = await Promise.all([
      supabase
        .from('kb_topics')
        .select(PUBLIC_TOPIC_SELECT)
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true }),
      supabase
        .from('kb_articles')
        .select(PUBLIC_ARTICLE_SELECT)
        .eq('status', 'published')
        .order('updated_at', { ascending: false }),
    ]);

    if (topicsResult.error) throw topicsResult.error;
    if (articlesResult.error) throw articlesResult.error;

    const topics = (topicsResult.data || []) as HelpdeskTopic[];
    const articles = normalizePublishedArticles(articlesResult.data || [], topics).sort(articleOrder);
    const tags = Array.from(new Map(articles.flatMap((article) => article.tags).map((tag) => [tag.id, tag])).values())
      .sort((a, b) => a.name.localeCompare(b.name));

    return { topics, articles, tags };
  } catch (error) {
    console.error('Helpdesk data fetch error:', error);
    return { topics: [], articles: [], tags: [] };
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
