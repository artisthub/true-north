import { describe, expect, it } from 'vitest';
import {
  PUBLIC_ARTICLE_DETAIL_SELECT,
  PUBLIC_ARTICLE_SUMMARY_SELECT,
  PUBLIC_TOPIC_SELECT,
  PUBLIC_TOPIC_WITH_COUNT_SELECT,
  normalizePublishedArticles,
  normalizePublishedTopics,
} from './helpdesk-query';

describe('public helpdesk query', () => {
  it('loads tag relationships from articles rather than topics', () => {
    expect(PUBLIC_TOPIC_SELECT).toBe('*');
    expect(PUBLIC_ARTICLE_SUMMARY_SELECT).toContain('kb_article_tags(kb_tags(id,name,slug))');
    expect(PUBLIC_ARTICLE_SUMMARY_SELECT).not.toContain('body_markdown');
    expect(PUBLIC_ARTICLE_DETAIL_SELECT).toContain('body_markdown');
  });

  it('normalizes article tags and attaches its topic', () => {
    const topics = [{ id: 'topic-1', title: 'Releases' }];
    const rows = [{
      id: 'article-1',
      topic_id: 'topic-1',
      kb_article_tags: [{ kb_tags: { id: 'tag-1', name: 'Stores', slug: 'stores' } }],
    }];

    expect(normalizePublishedArticles(rows, topics)).toMatchObject([{
      id: 'article-1',
      topic: { id: 'topic-1', title: 'Releases' },
      tags: [{ id: 'tag-1', name: 'Stores', slug: 'stores' }],
    }]);
  });

  it('normalizes the published article aggregate on topics', () => {
    expect(PUBLIC_TOPIC_WITH_COUNT_SELECT).toContain('kb_articles(count)');
    expect(normalizePublishedTopics([{
      id: 'topic-1',
      title: 'Releases',
      kb_articles: [{ count: 4 }],
    }])).toEqual([{
      id: 'topic-1',
      title: 'Releases',
      article_count: 4,
    }]);
  });

  it('sorts topics by article count before their configured order', () => {
    expect(normalizePublishedTopics([
      { id: 'empty', title: 'Empty', sort_order: 1, kb_articles: [{ count: 0 }] },
      { id: 'popular-b', title: 'Popular B', sort_order: 20, kb_articles: [{ count: 8 }] },
      { id: 'popular-a', title: 'Popular A', sort_order: 10, kb_articles: [{ count: 8 }] },
    ]).map((topic) => topic.id)).toEqual(['popular-a', 'popular-b', 'empty']);
  });
});
