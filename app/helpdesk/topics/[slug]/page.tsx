import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedTopic } from '@/lib/helpdesk';
import styles from '../../helpdesk.module.css';

export const dynamic = 'force-dynamic';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { topic } = await getPublishedTopic(params.slug);

  if (!topic) {
    return {
      title: 'Helpdesk topic not found | True North',
    };
  }

  return {
    title: `${topic.title} | True North Helpdesk`,
    description: topic.description,
  };
}

export default async function HelpdeskTopicPage({ params }: { params: { slug: string } }) {
  const { topic, articles } = await getPublishedTopic(params.slug);

  if (!topic) {
    notFound();
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/helpdesk" className={styles.brand}>
            <span className={styles.brandMark}>✦</span>
            <span>True North Helpdesk</span>
          </Link>
          <nav className={styles.nav} aria-label="Helpdesk navigation">
            <Link href="/">Home</Link>
            <Link href="/support">Support forms</Link>
          </nav>
        </div>
      </header>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
          <Link href="/helpdesk">Helpdesk</Link>
          <span>/</span>
          <span>{topic.title}</span>
        </nav>

        <section className={styles.hero}>
          <span className={styles.badge}>Topic</span>
          <h1 className={styles.title}>{topic.title}</h1>
          <p className={styles.subtitle}>{topic.description}</p>
        </section>

        <section style={{ paddingBottom: '84px' }}>
          <h2 className={styles.sectionTitle}>{articles.length} articles</h2>
          {articles.length === 0 ? (
            <div className={styles.empty}>No published articles are available for this topic yet.</div>
          ) : (
            <div className={styles.articleStack}>
              {articles.map((article) => (
                <Link className={styles.articleLink} href={`/helpdesk/articles/${article.slug}`} key={article.id}>
                  <div className={styles.articleMeta}>
                    <span>Updated {formatDate(article.updated_at)}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
