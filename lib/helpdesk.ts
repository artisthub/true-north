import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from './supabase';
import {
  PUBLIC_ARTICLE_DETAIL_SELECT,
  PUBLIC_ARTICLE_SUMMARY_SELECT,
  PUBLIC_TOPIC_SELECT,
  PUBLIC_TOPIC_WITH_COUNT_SELECT,
  normalizePublishedArticles,
  normalizePublishedTopics,
} from './helpdesk-query';
import { getHelpdeskPageWindow, HELPDESK_PAGE_SIZE } from './helpdesk-pagination';

export type HelpdeskTopic = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  description: string;
  sort_order: number;
  published: boolean;
  article_count?: number;
};

export type HelpdeskArticleStatus = 'draft' | 'published' | 'archived';
export type HelpdeskTag = { id: string; name: string; slug: string; article_count?: number };

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

export type HelpdeskIndexOptions = {
  view: 'featured' | 'all';
  page: number;
  query?: string;
  tagSlugs?: string[];
};

export type HelpdeskIndexData = HelpdeskData & {
  total: number;
  page: number;
  pageCount: number;
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
        .select(PUBLIC_ARTICLE_SUMMARY_SELECT)
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

function createArticleSummaryQuery(options: HelpdeskIndexOptions, useSearchVector = true) {
  const tagFilter = options.tagSlugs?.length
    ? ',filter_tags:kb_article_tags!inner(kb_tags!inner(slug))'
    : '';
  let query = supabase
    .from('kb_articles')
    .select(`${PUBLIC_ARTICLE_SUMMARY_SELECT}${tagFilter}`, { count: 'exact' })
    .eq('status', 'published');

  const search = options.query?.trim();
  if (search) {
    query = useSearchVector
      ? query.textSearch('search_vector', search, { type: 'websearch', config: 'english' })
      : query.or(`title.ilike.%${search.replace(/[%_,()]/g, '')}%,excerpt.ilike.%${search.replace(/[%_,()]/g, '')}%`);
  }

  if (options.tagSlugs?.length) {
    query = query.in('filter_tags.kb_tags.slug', options.tagSlugs);
  }

  return query;
}

async function getPublicTags(): Promise<HelpdeskTag[]> {
  const aggregate = await supabase.rpc('get_public_kb_tags');
  if (!aggregate.error) {
    return (aggregate.data || []).map((tag: any) => ({ ...tag, article_count: Number(tag.article_count || 0) }));
  }

  const fallback = await supabase.from('kb_tags').select('id,name,slug').order('name');
  if (fallback.error) throw fallback.error;
  return (fallback.data || []).map((tag: any) => ({ ...tag, article_count: 0 }));
}

export async function getPublishedHelpdeskIndex(options: HelpdeskIndexOptions): Promise<HelpdeskIndexData> {
  noStore();
  const empty = { topics: [], articles: [], tags: [], total: 0, page: 1, pageCount: 1 };
  if (!supabase) return empty;

  try {
    const [topicsResult, tags] = await Promise.all([
      supabase.from('kb_topics').select(PUBLIC_TOPIC_WITH_COUNT_SELECT).eq('published', true)
        .eq('kb_articles.status', 'published')
        .order('sort_order', { ascending: true }).order('title', { ascending: true }),
      getPublicTags(),
    ]);
    if (topicsResult.error) throw topicsResult.error;
    const topics = normalizePublishedTopics(topicsResult.data || []);

    if (options.view === 'featured') {
      let result = await createArticleSummaryQuery(options).eq('featured', true)
        .order('updated_at', { ascending: false }).limit(5);
      if (result.error && options.query) {
        result = await createArticleSummaryQuery(options, false).eq('featured', true)
          .order('updated_at', { ascending: false }).limit(5);
      }
      if (result.error) throw result.error;

      if (!result.data?.length) {
        result = await createArticleSummaryQuery(options, !options.query)
          .order('updated_at', { ascending: false }).limit(8);
        if (result.error && options.query) {
          result = await createArticleSummaryQuery(options, false)
            .order('updated_at', { ascending: false }).limit(8);
        }
        if (result.error) throw result.error;
      }

      const articles = normalizePublishedArticles(result.data || [], topics).sort(articleOrder);
      return { topics, tags, articles, total: articles.length, page: 1, pageCount: 1 };
    }

    const requestedFrom = (options.page - 1) * HELPDESK_PAGE_SIZE;
    let result = await createArticleSummaryQuery(options)
      .order('featured', { ascending: false })
      .order('updated_at', { ascending: false })
      .range(requestedFrom, requestedFrom + HELPDESK_PAGE_SIZE - 1);
    if (result.error && options.query) {
      result = await createArticleSummaryQuery(options, false)
        .order('featured', { ascending: false })
        .order('updated_at', { ascending: false })
        .range(requestedFrom, requestedFrom + HELPDESK_PAGE_SIZE - 1);
    }
    if (result.error) throw result.error;

    const total = result.count || 0;
    const window = getHelpdeskPageWindow(total, options.page, HELPDESK_PAGE_SIZE);
    if (window.from !== requestedFrom) {
      result = await createArticleSummaryQuery(options, !options.query)
        .order('featured', { ascending: false })
        .order('updated_at', { ascending: false })
        .range(window.from, window.to);
      if (result.error && options.query) {
        result = await createArticleSummaryQuery(options, false)
          .order('featured', { ascending: false })
          .order('updated_at', { ascending: false })
          .range(window.from, window.to);
      }
      if (result.error) throw result.error;
    }

    return {
      topics,
      tags,
      articles: normalizePublishedArticles(result.data || [], topics),
      total,
      page: window.page,
      pageCount: window.pageCount,
    };
  } catch (error) {
    console.error('Helpdesk index fetch error:', error);
    return empty;
  }
}

export async function getPublishedTopic(slug: string) {
  noStore();
  if (!supabase) return { topic: null, articles: [] };
  const topicResult = await supabase.from('kb_topics').select(PUBLIC_TOPIC_SELECT)
    .eq('published', true).eq('slug', slug).maybeSingle();
  if (topicResult.error) throw topicResult.error;
  const topic = topicResult.data as HelpdeskTopic | null;
  if (!topic) return { topic: null, articles: [] };
  const articlesResult = await supabase.from('kb_articles').select(PUBLIC_ARTICLE_SUMMARY_SELECT)
    .eq('status', 'published').eq('topic_id', topic.id).order('updated_at', { ascending: false });
  if (articlesResult.error) throw articlesResult.error;

  return {
    topic,
    articles: normalizePublishedArticles(articlesResult.data || [], [topic]),
  };
}

export async function getPublishedArticle(slug: string) {
  noStore();
  if (!supabase) return { article: null, topics: [], relatedArticles: [] };
  const articleResult = await supabase.from('kb_articles').select(PUBLIC_ARTICLE_DETAIL_SELECT)
    .eq('status', 'published').eq('slug', slug).maybeSingle();
  if (articleResult.error) throw articleResult.error;
  if (!articleResult.data) return { article: null, topics: [], relatedArticles: [] };
  const raw = articleResult.data as any;
  const topicsResult = raw.topic_id
    ? await supabase.from('kb_topics').select(PUBLIC_TOPIC_SELECT).eq('id', raw.topic_id).eq('published', true)
    : { data: [], error: null };
  if (topicsResult.error) throw topicsResult.error;
  const topics = (topicsResult.data || []) as HelpdeskTopic[];
  const article = normalizePublishedArticles([raw], topics)[0];
  const relatedResult = article.topic_id
    ? await supabase.from('kb_articles').select(PUBLIC_ARTICLE_SUMMARY_SELECT)
      .eq('status', 'published').eq('topic_id', article.topic_id).neq('id', article.id)
      .order('updated_at', { ascending: false }).limit(3)
    : { data: [], error: null };
  if (relatedResult.error) throw relatedResult.error;

  return {
    article,
    topics,
    relatedArticles: normalizePublishedArticles(relatedResult.data || [], topics),
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
      ...(article.tags || []).map((tag) => tag.name),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  });
}
