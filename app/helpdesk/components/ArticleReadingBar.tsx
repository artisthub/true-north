'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../helpdesk.module.css';

export default function ArticleReadingBar({ title, introductionId }: { title: string; introductionId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const introduction = document.getElementById(introductionId);
    if (!introduction) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: '-76px 0px 0px 0px',
      threshold: 0,
    });
    observer.observe(introduction);
    return () => observer.disconnect();
  }, [introductionId]);

  if (!visible) return null;

  return (
    <div className={styles.readingBar}>
      <div className={styles.readingBarInner}>
        <Link href="/helpdesk">Helpdesk</Link>
        <span aria-hidden="true">/</span>
        <strong>{title}</strong>
      </div>
    </div>
  );
}
