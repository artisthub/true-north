'use client';

import React, { useId, useMemo, useState } from 'react';
import type { HelpdeskArticle, HelpdeskTag } from '@/lib/helpdesk';
import styles from '../helpdesk.module.css';

type HelpdeskFiltersProps = {
  tags: HelpdeskTag[];
  articles: HelpdeskArticle[];
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
};

export function summarizeArticleTags(tags: HelpdeskTag[]) {
  return {
    visible: tags.slice(0, 3),
    remaining: Math.max(0, tags.length - 3),
  };
}

export default function HelpdeskFilters({ tags, articles, selectedSlugs, onChange }: HelpdeskFiltersProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const panelId = useId();
  const counts = useMemo(() => {
    const next = new Map<string, number>();
    articles.forEach((article) => {
      const unique = new Set(article.tags.map((tag) => tag.slug));
      unique.forEach((slug) => next.set(slug, (next.get(slug) || 0) + 1));
    });
    return next;
  }, [articles]);
  const popularTags = useMemo(() => [...tags]
    .sort((a, b) => (counts.get(b.slug) || 0) - (counts.get(a.slug) || 0) || a.name.localeCompare(b.name))
    .slice(0, 8), [counts, tags]);
  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = useMemo(() => normalizedQuery.length < 2 ? [] : tags
    .filter((tag) => tag.name.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => (counts.get(b.slug) || 0) - (counts.get(a.slug) || 0) || a.name.localeCompare(b.name))
    .slice(0, 12), [counts, normalizedQuery, tags]);
  const selectedTags = selectedSlugs
    .map((slug) => tags.find((tag) => tag.slug === slug))
    .filter((tag): tag is HelpdeskTag => Boolean(tag));

  const toggleTag = (slug: string) => {
    onChange(selectedSlugs.includes(slug)
      ? selectedSlugs.filter((selected) => selected !== slug)
      : [...selectedSlugs, slug]);
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filterHeading}>
        <span>Popular filters</span>
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className={styles.moreFiltersButton}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {open ? 'Close filters' : 'More filters'}
        </button>
      </div>

      <div className={styles.popularTags}>
        {popularTags.map((tag) => {
          const active = selectedSlugs.includes(tag.slug);
          return (
            <button
              aria-pressed={active}
              className={active ? styles.tagActive : styles.tagButton}
              data-testid="popular-tag"
              key={tag.id}
              onClick={() => toggleTag(tag.slug)}
              type="button"
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      {selectedTags.length > 0 && (
        <div className={styles.selectedFilters} aria-label="Selected filters">
          {selectedTags.map((tag) => (
            <button
              aria-label={`Remove ${tag.name} filter`}
              key={tag.id}
              onClick={() => toggleTag(tag.slug)}
              type="button"
            >
              {tag.name}<span aria-hidden="true">×</span>
            </button>
          ))}
          <button className={styles.clearFilters} onClick={() => onChange([])} type="button">Clear all</button>
        </div>
      )}

      {open && (
        <div className={styles.filterPanel} id={panelId}>
          <label htmlFor={`${panelId}-search`}>Find another filter</label>
          <input
            autoFocus
            id={`${panelId}-search`}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setOpen(false);
                setQuery('');
              }
            }}
            placeholder="Search platforms, rights, releases..."
            role="searchbox"
            type="search"
            value={query}
            aria-label="Search article tags"
          />
          {normalizedQuery.length < 2 ? (
            <p>Type at least 2 characters to search tags.</p>
          ) : searchResults.length === 0 ? (
            <p>No filters match “{query.trim()}”.</p>
          ) : (
            <div className={styles.filterResults}>
              {searchResults.map((tag) => {
                const count = counts.get(tag.slug) || 0;
                return (
                  <button
                    aria-pressed={selectedSlugs.includes(tag.slug)}
                    data-testid="tag-search-result"
                    key={tag.id}
                    onClick={() => toggleTag(tag.slug)}
                    type="button"
                  >
                    <span>{tag.name}</span><small>{count} {count === 1 ? 'article' : 'articles'}</small>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
