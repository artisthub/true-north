# Helpdesk Sidebar and Published Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin topic/article lists compact, independently expandable, and scrollable while restoring published content on the public helpdesk.

**Architecture:** Correct the public Supabase relationship at the query boundary and retain the existing normalization pipeline. Add a small reusable client component for each admin list so expansion state and accessibility are isolated from the already-large editor page.

**Tech Stack:** Next.js 14, React 18, TypeScript, CSS Modules, Supabase, Vitest, Testing Library, jsdom

## Global Constraints

- Topics and Articles remain separate panels with their existing create and selection actions.
- Compact lists reveal approximately one and a half entries and use a bottom gradient when more content exists.
- Expanded lists reveal approximately three or four entries, scroll internally, and expose a Collapse control.
- Each panel expands independently and exposes its expanded state to assistive technology.
- No database, publishing-rule, editor-form, public-style, or URL changes.

---

### Task 1: Public helpdesk query regression

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `lib/helpdesk-query.ts`
- Create: `lib/helpdesk-query.test.ts`
- Modify: `lib/helpdesk.ts`

**Interfaces:**
- Produces: `PUBLIC_TOPIC_SELECT: string`, `PUBLIC_ARTICLE_SELECT: string`, and `normalizePublishedArticles(articles, topics): HelpdeskArticle[]`.
- Consumes: existing `HelpdeskTopic`, `HelpdeskArticle`, and `HelpdeskTag` domain shapes.

- [ ] **Step 1: Install the focused test tooling**

Run: `npm install --save-dev vitest@^2.1.9`

Expected: `package.json` gains a `test` script and Vitest dependency after the following edits; `package-lock.json` records the dependency graph.

- [ ] **Step 2: Add the test configuration and script**

Add `"test": "vitest run"` under `scripts` in `package.json`, and create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node' },
});
```

- [ ] **Step 3: Write the failing public-query tests**

Create `lib/helpdesk-query.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  PUBLIC_ARTICLE_SELECT,
  PUBLIC_TOPIC_SELECT,
  normalizePublishedArticles,
} from './helpdesk-query';

describe('public helpdesk query', () => {
  it('loads tag relationships from articles rather than topics', () => {
    expect(PUBLIC_TOPIC_SELECT).toBe('*');
    expect(PUBLIC_ARTICLE_SELECT).toContain('kb_article_tags(kb_tags(id,name,slug))');
  });

  it('normalizes article tags and attaches its topic', () => {
    const topics = [{ id: 'topic-1', title: 'Releases' }];
    const rows = [{
      id: 'article-1',
      topic_id: 'topic-1',
      kb_article_tags: [{ kb_tags: { id: 'tag-1', name: 'Stores', slug: 'stores' } }],
    }];

    expect(normalizePublishedArticles(rows, topics)).toMatchObject([{
      id: 'article-1',
      topic: { id: 'topic-1', title: 'Releases' },
      tags: [{ id: 'tag-1', name: 'Stores', slug: 'stores' }],
    }]);
  });
});
```

- [ ] **Step 4: Run the tests and verify RED**

Run: `npm test -- lib/helpdesk-query.test.ts`

Expected: FAIL because `./helpdesk-query` does not exist.

- [ ] **Step 5: Implement the query boundary and normalization**

Create `lib/helpdesk-query.ts` with query constants and move the existing topic/tag normalization into the exported helper:

```ts
import type { HelpdeskArticle, HelpdeskTopic } from './helpdesk';

export const PUBLIC_TOPIC_SELECT = '*';
export const PUBLIC_ARTICLE_SELECT = '*, kb_article_tags(kb_tags(id,name,slug))';

export function normalizePublishedArticles(
  articles: any[],
  topics: Array<Pick<HelpdeskTopic, 'id'> & Partial<HelpdeskTopic>>,
): HelpdeskArticle[] {
  const topicsById = new Map(topics.map((topic) => [topic.id, topic]));
  return articles.map((article) => ({
    ...article,
    tags: (article.kb_article_tags || [])
      .map((item: any) => item.kb_tags)
      .filter(Boolean),
    topic: article.topic_id ? topicsById.get(article.topic_id) || null : null,
  })) as HelpdeskArticle[];
}
```

Update `lib/helpdesk.ts` to import these three exports, remove `attachTopics`, use `PUBLIC_TOPIC_SELECT` on `kb_topics`, use `PUBLIC_ARTICLE_SELECT` on `kb_articles`, and call `normalizePublishedArticles(articlesResult.data || [], topics)`.

- [ ] **Step 6: Run focused and integration checks**

Run: `npm test -- lib/helpdesk-query.test.ts`

Expected: 2 tests PASS.

Run: `npx tsc --noEmit`

Expected: exit code 0 with no TypeScript errors.

- [ ] **Step 7: Commit the public-content fix**

```bash
git add package.json package-lock.json vitest.config.ts lib/helpdesk-query.ts lib/helpdesk-query.test.ts lib/helpdesk.ts
git commit -m "Fix published helpdesk content query"
```

---

### Task 2: Compact expandable admin lists

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vitest.config.ts`
- Create: `app/admin/helpdesk/CollapsibleAdminList.tsx`
- Create: `app/admin/helpdesk/CollapsibleAdminList.test.tsx`
- Modify: `app/admin/helpdesk/page.tsx`
- Modify: `app/admin/helpdesk/admin-helpdesk.module.css`

**Interfaces:**
- Produces: `CollapsibleAdminList({ label, children, itemCount })`, an independently stateful list wrapper.
- Consumes: topic and article button children already rendered by `app/admin/helpdesk/page.tsx`.

- [ ] **Step 1: Install DOM test support**

Run: `npm install --save-dev @testing-library/react@^16.1.0 @testing-library/jest-dom@^6.6.3 jsdom@^25.0.1`

Expected: the three packages appear in `devDependencies` and `package-lock.json` is updated.

- [ ] **Step 2: Configure jsdom for component tests**

Change `vitest.config.ts` to:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Write failing interaction tests**

Create `app/admin/helpdesk/CollapsibleAdminList.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CollapsibleAdminList from './CollapsibleAdminList';

describe('CollapsibleAdminList', () => {
  it('starts compact and expands accessibly', () => {
    render(<CollapsibleAdminList itemCount={3} label="Topics"><button>One</button><button>Two</button><button>Three</button></CollapsibleAdminList>);
    const control = screen.getByRole('button', { name: 'Expand Topics' });
    expect(control).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('collapsible-admin-list')).toHaveAttribute('data-expanded', 'false');
    fireEvent.click(control);
    expect(screen.getByRole('button', { name: 'Collapse Topics' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('collapsible-admin-list')).toHaveAttribute('data-expanded', 'true');
  });

  it('omits the fade and control when the list has one item', () => {
    render(<CollapsibleAdminList itemCount={1} label="Articles"><button>Only article</button></CollapsibleAdminList>);
    expect(screen.queryByRole('button', { name: /Articles/ })).not.toBeInTheDocument();
    expect(screen.getByTestId('collapsible-admin-list')).toHaveAttribute('data-overflowing', 'false');
  });
});
```

- [ ] **Step 4: Run the component test and verify RED**

Run: `npm test -- app/admin/helpdesk/CollapsibleAdminList.test.tsx`

Expected: FAIL because `CollapsibleAdminList` does not exist.

- [ ] **Step 5: Implement the reusable list wrapper**

Create `app/admin/helpdesk/CollapsibleAdminList.tsx`:

```tsx
'use client';

import { useId, useState, type ReactNode } from 'react';
import styles from './admin-helpdesk.module.css';

export default function CollapsibleAdminList({ children, itemCount, label }: { children: ReactNode; itemCount: number; label: string }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const overflowing = itemCount > 1;

  return <div className={styles.collapsibleListShell} data-overflowing={overflowing}>
    <div className={styles.collapsibleList} data-expanded={expanded} data-overflowing={overflowing} data-testid="collapsible-admin-list" id={id}>
      {children}
    </div>
    {overflowing && <button aria-controls={id} aria-expanded={expanded} className={styles.expandListButton} onClick={() => setExpanded((value) => !value)} type="button">
      {expanded ? `Collapse ${label}` : `Expand ${label}`}
    </button>}
  </div>;
}
```

- [ ] **Step 6: Integrate both admin lists**

Import `CollapsibleAdminList` into `app/admin/helpdesk/page.tsx`. Replace `<div className={styles.topicList}>` and its matching closing tag with `<CollapsibleAdminList itemCount={topics.length} label="Topics">` and `</CollapsibleAdminList>`. Replace `<div className={styles.articleList}>` and its matching closing tag with `<CollapsibleAdminList itemCount={articles.length} label="Articles">` and `</CollapsibleAdminList>`. Leave every mapped button unchanged.

- [ ] **Step 7: Add compact, expanded, scrolling, and fade styles**

Add to `admin-helpdesk.module.css`:

```css
.collapsibleListShell { display: grid; gap: 10px; }
.collapsibleList { position: relative; display: grid; gap: 8px; max-height: 92px; overflow: hidden; }
.collapsibleList[data-expanded='true'] { max-height: 248px; overflow-y: auto; padding-right: 4px; }
.collapsibleListShell[data-overflowing='true']::after { content: ''; pointer-events: none; height: 34px; margin-top: -44px; background: linear-gradient(transparent, #101013); z-index: 1; }
.collapsibleListShell:has(.collapsibleList[data-expanded='true'])::after { display: none; }
.expandListButton { position: relative; z-index: 2; justify-self: start; border: 0; padding: 0; background: transparent; color: #ff9bd2; cursor: pointer; font: inherit; font-size: 13px; font-weight: 760; }
.expandListButton:focus-visible { outline: 2px solid #ff1493; outline-offset: 4px; }
```

Delete the existing `.topicList, .articleList` rule at lines 244–248 because `.collapsibleList` replaces its grid and gap declarations. Retain the existing `.topicItem` and `.articleItem` rules unchanged.

- [ ] **Step 8: Run focused tests and type checking**

Run: `npm test -- app/admin/helpdesk/CollapsibleAdminList.test.tsx`

Expected: 2 tests PASS.

Run: `npm test`

Expected: all 4 tests PASS.

Run: `npx tsc --noEmit`

Expected: exit code 0 with no TypeScript errors.

- [ ] **Step 9: Commit the admin-list change**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts app/admin/helpdesk/CollapsibleAdminList.tsx app/admin/helpdesk/CollapsibleAdminList.test.tsx app/admin/helpdesk/page.tsx app/admin/helpdesk/admin-helpdesk.module.css
git commit -m "Make helpdesk admin lists compact"
```

---

### Task 3: End-to-end verification

**Files:**
- Modify only if verification exposes a defect in a file already listed above.

**Interfaces:**
- Consumes: completed public query and admin list component.
- Produces: verified production build and browser behavior.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test && npx tsc --noEmit && npm run build`

Expected: all tests pass, TypeScript exits 0, and Next.js reports a successful production build.

- [ ] **Step 2: Verify the admin interaction in a browser**

Run the app with `npm run dev`, sign in to `/admin/helpdesk`, and verify independently for Topics and Articles:

1. Compact state shows about 1.5 rows and a bottom fade when multiple records exist.
2. Expand shows about 3–4 rows, removes the fade, and allows internal scrolling.
3. Collapse restores the compact state.
4. Selecting an entry still populates the corresponding editor.
5. Keyboard focus and Enter/Space operate both controls.

- [ ] **Step 3: Verify public content in a browser**

Open `/helpdesk` and verify published topics and articles render, tag filters contain tags assigned to published articles, and opening one topic and one article succeeds.

- [ ] **Step 4: Commit only verification-driven corrections**

If a correction was required, stage only the affected files and run:

```bash
git commit -m "Polish helpdesk compact list behavior"
```

If no correction was required, do not create an empty commit.
