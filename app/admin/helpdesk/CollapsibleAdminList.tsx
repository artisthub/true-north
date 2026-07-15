'use client';

import React, { useId, useState, type ReactNode } from 'react';
import styles from './admin-helpdesk.module.css';

export default function CollapsibleAdminList({
  children,
  itemCount,
  label,
}: {
  children: ReactNode;
  itemCount: number;
  label: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const overflowing = itemCount > 1;

  return (
    <div className={styles.collapsibleListShell} data-overflowing={overflowing}>
      <div
        className={styles.collapsibleList}
        data-expanded={expanded}
        data-overflowing={overflowing}
        data-testid="collapsible-admin-list"
        id={id}
      >
        {children}
      </div>
      {overflowing && (
        <button
          aria-controls={id}
          aria-expanded={expanded}
          className={styles.expandListButton}
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          {expanded ? `Collapse ${label}` : `Expand ${label}`}
        </button>
      )}
    </div>
  );
}
