'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { HelpdeskTopic } from '@/lib/helpdesk';
import styles from '../helpdesk.module.css';

export default function ProgressiveTopics({ topics, pageSize = 5 }: { topics: HelpdeskTopic[]; pageSize?: number }) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const visibleTopics = topics.slice(0, visibleCount);
  const remaining = Math.max(0, topics.length - visibleCount);
  const nextCount = Math.min(pageSize, remaining);

  return (
    <>
      <div className={styles.topicList}>
        {visibleTopics.map((topic) => (
          <Link className={styles.topicItem} data-testid="topic-link" href={`/helpdesk/topics/${topic.slug}`} key={topic.id}>
            <div className={styles.topicTitleRow}>
              <strong>{topic.title}</strong>
              <span className={styles.topicCount}>
                {topic.article_count || 0} {topic.article_count === 1 ? 'article' : 'articles'}
              </span>
            </div>
            <span className={styles.topicDescription}>{topic.description}</span>
          </Link>
        ))}
      </div>
      <span className={styles.srOnly} aria-live="polite">Showing {visibleTopics.length} of {topics.length} topics</span>
      {remaining > 0 && (
        <button
          className={styles.loadMoreButton}
          onClick={() => setVisibleCount((count) => Math.min(topics.length, count + pageSize))}
          type="button"
        >
          Load {nextCount} more topics
        </button>
      )}
    </>
  );
}
