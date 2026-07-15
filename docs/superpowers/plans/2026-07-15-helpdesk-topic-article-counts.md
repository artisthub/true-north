# Helpdesk Topic Article Counts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show each public helpdesk topic's published article count in the sidebar.

**Architecture:** Extend the existing topic select with an embedded `kb_articles(count)` aggregate filtered to published rows, then normalize the aggregate into `HelpdeskTopic.article_count`. Render the value in the existing progressive topic component.

**Tech Stack:** Next.js 14, React 18, TypeScript, Supabase/PostgREST, Vitest, Testing Library, CSS Modules.

## Global Constraints

- Use one topic database query and do not load article content for counts.
- Count only `status = 'published'` articles.
- Use `1 article` for one and `<n> articles` otherwise.
- Preserve the existing True North theme and compact sidebar layout.
- Do not modify or stage `articles-export/`.

---

### Task 1: Topic count data contract

**Files:**
- Modify: `lib/helpdesk-query.test.ts`
- Modify: `lib/helpdesk-query.ts`
- Modify: `lib/helpdesk.ts`

**Interfaces:**
- Produces: `PUBLIC_TOPIC_WITH_COUNT_SELECT` and `normalizePublishedTopics(rows): HelpdeskTopic[]`.

- [ ] Write a failing test proving `{ kb_articles: [{ count: 4 }] }` becomes `article_count: 4` and the relationship field is removed.
- [ ] Run `npx vitest run lib/helpdesk-query.test.ts`; expect failure because the exports do not exist.
- [ ] Implement the select and normalizer, add `article_count: number` to `HelpdeskTopic`, and use them in `getPublishedHelpdeskIndex` with `.eq('kb_articles.status', 'published')`.
- [ ] Run the focused test; expect it to pass.

### Task 2: Sidebar count presentation

**Files:**
- Modify: `app/helpdesk/components/HelpdeskDiscovery.test.tsx`
- Modify: `app/helpdesk/components/ProgressiveTopics.tsx`
- Modify: `app/helpdesk/helpdesk.module.css`

**Interfaces:**
- Consumes: `HelpdeskTopic.article_count`.
- Produces: a title row with topic name and localized count copy.

- [ ] Add failing assertions for `1 article` and `5 articles` in the progressive-topic component test.
- [ ] Run `npx vitest run app/helpdesk/components/HelpdeskDiscovery.test.tsx`; expect missing count text.
- [ ] Render `<span className={styles.topicCount}>{count} {count === 1 ? 'article' : 'articles'}</span>` beside the topic title and add compact subdued styling.
- [ ] Run the focused test; expect it to pass.

### Task 3: Verification

**Files:**
- No production files beyond Tasks 1–2.

**Interfaces:**
- Verifies the complete server-to-sidebar count path.

- [ ] Run `npm test`; expect all tests to pass.
- [ ] Run `npx tsc --noEmit`; expect exit code 0.
- [ ] Run `npm run build`; expect a successful production build with only pre-existing warnings.
- [ ] Open the local helpdesk and confirm visible nonzero topic counts in the in-app browser.
- [ ] Commit the implementation with message `Show article counts for helpdesk topics`.

