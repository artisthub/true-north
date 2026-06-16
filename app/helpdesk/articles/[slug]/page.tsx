import Link from 'next/link';
import { notFound } from 'next/navigation';
import { extractHeadings, renderMarkdown } from '@/lib/markdown';
import { getPublishedArticle } from '@/lib/helpdesk';
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
  const { article } = await getPublishedArticle(params.slug);

  if (!article) {
    return {
      title: 'Helpdesk article not found | True North',
    };
  }

  return {
    title: `${article.title} | True North Helpdesk`,
    description: article.excerpt,
  };
}

export default async function HelpdeskArticlePage({ params }: { params: { slug: string } }) {
  const { article, relatedArticles } = await getPublishedArticle(params.slug);

  if (!article) {
    notFound();
  }

  const headings = extractHeadings(article.body_markdown);

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
          {article.topic && (
            <>
              <span>/</span>
              <Link href={`/helpdesk/topics/${article.topic.slug}`}>{article.topic.title}</Link>
            </>
          )}
        </nav>

        <div className={styles.articleLayout}>
          <article>
            <header className={styles.articleHeader}>
              {article.topic && <span className={styles.badge}>{article.topic.title}</span>}
              <h1 className={styles.articleTitle}>{article.title}</h1>
              <div className={styles.articleMeta}>
                <span>Updated {formatDate(article.updated_at)}</span>
              </div>
              <p className={styles.articleExcerpt}>{article.excerpt}</p>
            </header>

            <div className={styles.articleBody}>{renderMarkdown(article.body_markdown)}</div>

            {relatedArticles.length > 0 && (
              <section className={styles.related}>
                <h2>Related articles</h2>
                <div className={styles.articleStack}>
                  {relatedArticles.map((related) => (
                    <Link className={styles.articleLink} href={`/helpdesk/articles/${related.slug}`} key={related.id}>
                      <h3>{related.title}</h3>
                      <p>{related.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className={styles.supportCta}>
              <h2>Still need help?</h2>
              <p>
                Open the existing support forms page to submit platform requests, claim reviews, or
                other support intake that needs team review.
              </p>
              <div className={styles.quickActions}>
                <Link href="/support" className={styles.primaryButton}>
                  Open support forms
                </Link>
                <Link href="/helpdesk" className={styles.secondaryButton}>
                  Search helpdesk
                </Link>
              </div>
            </section>
          </article>

          {headings.length > 0 && (
            <aside className={styles.toc} aria-labelledby="article-toc">
              <h2 id="article-toc">On this page</h2>
              <nav>
                {headings.map((heading) => (
                  <a
                    href={`#${heading.id}`}
                    className={heading.level === 3 ? styles.tocChild : undefined}
                    key={`${heading.level}-${heading.id}`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
