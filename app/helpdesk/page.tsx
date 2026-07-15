import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedHelpdeskIndex } from '@/lib/helpdesk';
import { parseHelpdeskPage } from '@/lib/helpdesk-pagination';
import HelpdeskHome from './components/HelpdeskHome';
import styles from './helpdesk.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Helpdesk | True North',
  description:
    'Search True North support articles for release, metadata, rights, onboarding, and platform guidance.',
};

function HelpdeskHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/helpdesk" className={styles.brand}>
          <span className={styles.brandMark}>✦</span>
          <span>True North Helpdesk</span>
        </Link>
        <nav className={styles.nav} aria-label="Helpdesk navigation">
          <Link href="/">Home</Link>
          <Link href="/support">Support forms</Link>
          <Link href="/apply">Get started</Link>
        </nav>
      </div>
    </header>
  );
}

type HelpdeskSearchParams = Record<string, string | string[] | undefined>;

export default async function HelpdeskPage({ searchParams }: { searchParams: HelpdeskSearchParams }) {
  const view = searchParams.view === 'all' ? 'all' : 'featured';
  const query = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q || '').slice(0, 120);
  const rawTags = Array.isArray(searchParams.tag) ? searchParams.tag : searchParams.tag ? [searchParams.tag] : [];
  const tagSlugs = rawTags.flatMap((value) => value.split(',')).filter(Boolean);
  const requestedPage = parseHelpdeskPage(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page);
  const data = await getPublishedHelpdeskIndex({ view, page: requestedPage, query, tagSlugs });

  return (
    <main className={styles.shell}>
      <HelpdeskHeader />
      <HelpdeskHome {...data} initialQuery={query} view={view} />
    </main>
  );
}
