'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { HelpdeskArticle, HelpdeskTopic } from '@/lib/helpdesk';
import styles from '../helpdesk.module.css';

type HelpdeskHomeProps = {
  topics: HelpdeskTopic[];
  articles: HelpdeskArticle[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function searchArticles(articles: HelpdeskArticle[], query: string) {
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

export default function HelpdeskHome({ topics, articles }: HelpdeskHomeProps) {
  const [query, setQuery] = useState('');
  const filteredArticles = useMemo(() => searchArticles(articles, query), [articles, query]);
  const featuredArticles = filteredArticles.filter((article) => article.featured).slice(0, 5);
  const visibleArticles = featuredArticles.length ? featuredArticles : filteredArticles.slice(0, 8);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.kicker}>True North Helpdesk</div>
              <h1 className={styles.title}>Find the answer before you open a ticket.</h1>
              <p className={styles.subtitle}>
                Search release, metadata, rights, onboarding, and platform guidance written for
                artists and labels working through distribution support.
              </p>
            </div>

            <aside className={styles.quickPanel} aria-labelledby="support-next-steps">
              <h2 id="support-next-steps">Need the forms page?</h2>
              <p>
                The existing support forms remain available for claim reviews, channel requests,
                VEVO, Apple Motion Artwork, and platform-specific intake.
              </p>
              <div className={styles.quickActions}>
                <Link href="/support" className={styles.primaryButton}>
                  Open support forms
                </Link>
              </div>
            </aside>
          </div>

          <div className={styles.searchPanel}>
            <label className={styles.searchForm}>
              <span className={styles.searchIcon}>
                <SearchIcon />
              </span>
              <input
                className={styles.searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for metadata, YouTube claims, release timing..."
                aria-label="Search helpdesk articles"
              />
            </label>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.contentGrid}>
          <aside className={styles.sidebar} aria-labelledby="helpdesk-topics">
            <h2 className={styles.sectionTitle} id="helpdesk-topics">
              Topics
            </h2>
            <div className={styles.topicList}>
              {topics.map((topic) => (
                <Link className={styles.topicItem} href={`/helpdesk/topics/${topic.slug}`} key={topic.id}>
                  <strong>{topic.title}</strong>
                  <span>{topic.description}</span>
                </Link>
              ))}
            </div>
          </aside>

          <div>
            <h2 className={styles.sectionTitle}>
              {query ? `${filteredArticles.length} matching articles` : 'Featured articles'}
            </h2>

            {visibleArticles.length === 0 ? (
              <div className={styles.empty}>
                {query
                  ? 'No articles matched your search. Try a different term or open the support forms.'
                  : 'No published articles are available yet. Once the knowledge base migration is applied, published articles will appear here.'}
              </div>
            ) : (
              <div className={styles.articleStack}>
                {visibleArticles.map((article) => (
                  <Link className={styles.articleLink} href={`/helpdesk/articles/${article.slug}`} key={article.id}>
                    <div className={styles.articleMeta}>
                      {article.topic && <span className={styles.badge}>{article.topic.title}</span>}
                      <span>Updated {formatDate(article.updated_at)}</span>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
