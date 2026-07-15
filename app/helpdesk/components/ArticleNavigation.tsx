'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import styles from '../helpdesk.module.css';

export type ArticleHeading = { id: string; text: string; level: number };

export function resolveActiveHeading(positions: Array<{ id: string; top: number }>, threshold = 148) {
  if (positions.length === 0) return '';
  return positions.reduce((active, heading) => heading.top <= threshold ? heading.id : active, positions[0].id);
}

export default function ArticleNavigation({ headings }: { headings: ArticleHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id || '');
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveId(headings[0]?.id || '');
    setOpen(false);
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length) return;

    const observer = new IntersectionObserver(() => {
      const positions = elements.map((element) => ({ id: element.id, top: element.getBoundingClientRect().top }));
      setActiveId(resolveActiveHeading(positions));
    }, { rootMargin: '-148px 0px 0px 0px', threshold: [0, 1] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    const nav = navRef.current;
    const activeLink = nav?.querySelector<HTMLElement>(`[data-heading-id="${activeId}"]`);
    if (!nav || !activeLink) return;
    const linkTop = activeLink.offsetTop;
    const linkBottom = linkTop + activeLink.offsetHeight;
    if (linkTop < nav.scrollTop) nav.scrollTop = linkTop;
    if (linkBottom > nav.scrollTop + nav.clientHeight) nav.scrollTop = linkBottom - nav.clientHeight;
  }, [activeId]);

  const selectHeading = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setActiveId(id);
    setOpen(false);
    window.history.replaceState(null, '', `#${id}`);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  };

  if (!headings.length) return null;

  return (
    <aside className={styles.articleNavigation} aria-labelledby={`${panelId}-title`}>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label="On this page"
        className={styles.tocDisclosure}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span id={`${panelId}-title`}>On this page</span>
        <small>{headings.find((heading) => heading.id === activeId)?.text}</small>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <nav className={styles.tocNav} data-open={open} id={panelId} ref={navRef}>
        {headings.map((heading) => (
          <a
            aria-current={activeId === heading.id ? 'location' : undefined}
            className={heading.level === 3 ? styles.tocChild : undefined}
            data-heading-id={heading.id}
            href={`#${heading.id}`}
            key={`${heading.level}-${heading.id}`}
            onClick={(event) => selectHeading(event, heading.id)}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
