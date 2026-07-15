import React from 'react';
import Link from 'next/link';
import styles from '../helpdesk.module.css';

type HrefChanges = { page?: number | null; view?: 'featured' | 'all' };

export function buildHelpdeskHref(pathname: string, search: string, changes: HrefChanges) {
  const params = new URLSearchParams(search);
  if (changes.view === 'featured') params.delete('view');
  if (changes.view === 'all') params.set('view', 'all');
  if (changes.page === null || changes.page === 1) params.delete('page');
  if (changes.page && changes.page > 1) params.set('page', String(changes.page));
  const value = params.toString();
  return value ? `${pathname}?${value}` : pathname;
}

export default function ArticlePagination({
  page,
  pageCount,
  pathname,
  search,
}: {
  page: number;
  pageCount: number;
  pathname: string;
  search: string;
}) {
  if (pageCount <= 1) return null;
  const first = Math.max(1, Math.min(page - 2, pageCount - 4));
  const last = Math.min(pageCount, Math.max(page + 2, 5));
  const pages = Array.from({ length: last - first + 1 }, (_, index) => first + index);

  return (
    <nav className={styles.articlePagination} aria-label="Article pages">
      {page === 1 ? (
        <span aria-disabled="true">Previous</span>
      ) : (
        <Link aria-label="Previous page" href={buildHelpdeskHref(pathname, search, { page: page - 1 })}>Previous</Link>
      )}
      <div>
        {pages.map((number) => number === page ? (
          <span aria-current="page" key={number}>{number}</span>
        ) : (
          <Link aria-label={`Page ${number}`} href={buildHelpdeskHref(pathname, search, { page: number })} key={number}>{number}</Link>
        ))}
      </div>
      {page === pageCount ? (
        <span aria-disabled="true">Next</span>
      ) : (
        <Link aria-label="Next page" href={buildHelpdeskHref(pathname, search, { page: page + 1 })}>Next</Link>
      )}
    </nav>
  );
}
