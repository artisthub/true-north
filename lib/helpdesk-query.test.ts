import { describe, expect, it } from 'vitest';
import {
  PUBLIC_ARTICLE_SELECT,
  PUBLIC_TOPIC_SELECT,
  normalizePublishedArticles,
} from './helpdesk-query';

describe('public helpdesk query', () => {
  it('loads tag relationships from articles rather than topics', () => {
    expect(PUBLIC_TOPIC_SELECT).toBe('*');
    expect(PUBLIC_ARTICLE_SELECT).toContain('kb_article_tags(kb_tags(id,name,slug))');
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
});
