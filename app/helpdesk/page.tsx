import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedHelpdeskData } from '@/lib/helpdesk';
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

export default async function HelpdeskPage() {
  const { topics, articles } = await getPublishedHelpdeskData();

  return (
    <main className={styles.shell}>
      <HelpdeskHeader />
      <HelpdeskHome topics={topics} articles={articles} />
    </main>
  );
}
