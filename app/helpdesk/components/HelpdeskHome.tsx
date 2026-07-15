'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { HelpdeskArticle, HelpdeskTag, HelpdeskTopic } from '@/lib/helpdesk';
import HelpdeskFilters, { summarizeArticleTags } from './HelpdeskFilters';
import ProgressiveTopics from './ProgressiveTopics';
import ArticlePagination, { buildHelpdeskHref } from './ArticlePagination';
import styles from '../helpdesk.module.css';

type HelpdeskHomeProps = {
  topics: HelpdeskTopic[];
  articles: HelpdeskArticle[];
  tags: HelpdeskTag[];
  total: number;
  page: number;
  pageCount: number;
  initialQuery: string;
  view: 'featured' | 'all';
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

export default function HelpdeskHome({ topics, articles, tags, total, page, pageCount, initialQuery, view }: HelpdeskHomeProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSlugs = useMemo(() => {
    const requested = searchParams.getAll('tag').flatMap((value) => value.split(',')).filter(Boolean);
    const valid = new Set(tags.map((tag) => tag.slug));
    return Array.from(new Set(requested.filter((slug) => valid.has(slug))));
  }, [searchParams, tags]);
  useEffect(() => setQuery(initialQuery), [initialQuery]);
  useEffect(() => {
    if (query === initialQuery) return;
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const value = query.trim();
      if (value) {
        params.set('q', value);
        params.set('view', 'all');
      } else {
        params.delete('q');
      }
      params.delete('page');
      router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [initialQuery, pathname, query, router, searchParams]);
  const setTags = (slugs: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    slugs.forEach((slug) => params.append('tag', slug));
    params.delete('page');
    if (slugs.length) params.set('view', 'all');
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  };
  const search = searchParams.toString();

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

            <aside className={styles.supportUtility} aria-labelledby="support-next-steps">
              <div>
                <h2 id="support-next-steps">Need a human review?</h2>
                <p>Claims, channel requests, and platform-specific intake still use support forms.</p>
              </div>
              <Link href="/support" className={styles.secondaryButton}>Open support forms</Link>
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
          {tags.length > 0 && <HelpdeskFilters onChange={setTags} selectedSlugs={selectedSlugs} tags={tags} />}
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.contentGrid}>
          <aside className={styles.sidebar} aria-labelledby="helpdesk-topics">
            <h2 className={styles.sectionTitle} id="helpdesk-topics">
              Topics
            </h2>
            <ProgressiveTopics topics={topics} />
          </aside>

          <div>
            <div className={styles.articleListHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  {query || selectedSlugs.length ? `${total} matching articles` : view === 'all' ? `${total} articles` : 'Featured articles'}
                </h2>
                {view === 'all' && total > 0 && <p>Page {page} of {pageCount}</p>}
              </div>
              <div className={styles.articleViewSwitch} aria-label="Article view">
                <Link aria-current={view === 'featured' ? 'page' : undefined} href={buildHelpdeskHref(pathname, search, { view: 'featured', page: null })}>Featured</Link>
                <Link aria-current={view === 'all' ? 'page' : undefined} href={buildHelpdeskHref(pathname, search, { view: 'all', page: null })}>All articles</Link>
              </div>
            </div>

            {articles.length === 0 ? (
              <div className={styles.empty}>
                {query
                  ? 'No articles matched your search. Try a different term or open the support forms.'
                  : 'No published articles are available yet. Once the knowledge base migration is applied, published articles will appear here.'}
              </div>
            ) : (
              <>
              <div className={styles.articleStack}>
                {articles.map((article) => {
                  const tagSummary = summarizeArticleTags(article.tags);
                  return <Link className={styles.articleLink} href={`/helpdesk/articles/${article.slug}`} key={article.id}>
                    <div className={styles.articleMeta}>
                      {article.topic && <span className={styles.badge}>{article.topic.title}</span>}
                      <span>Updated {formatDate(article.updated_at)}</span>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    {tagSummary.visible.length > 0 && <div className={styles.cardTags}>{tagSummary.visible.map((tag) => <span key={tag.id}>#{tag.name}</span>)}{tagSummary.remaining > 0 && <span>+{tagSummary.remaining}</span>}</div>}
                  </Link>;
                })}
              </div>
              {view === 'all' && <ArticlePagination page={page} pageCount={pageCount} pathname={pathname} search={search} />}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
