# Helpdesk Full Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the public helpdesk home and article reading experience while preserving the True North theme, routes, and content model.

**Architecture:** Split the home-page progressive disclosure and article reading navigation into focused client components. Keep data fetching and article rendering server-side, use derived client state for tag/topic filtering, and use `IntersectionObserver` for reading state without scroll listeners.

**Tech Stack:** Next.js 14, React 18, TypeScript, CSS Modules, Vitest, Testing Library, jsdom

## Global Constraints

- Work directly on the current `main` branch as explicitly requested.
- Preserve the black-and-pink theme, URLs, slugs, database schema, publishing rules, navigation labels, article copy, and support-form flows.
- Use fixed product-scale typography, restrained pink accents, 150–200ms state transitions, and reduced-motion fallbacks.
- Do not render the complete tag vocabulary on the page or inside an initially open control.
- Use native CSS and existing project dependencies; do not add a visual framework.

---

### Task 1: Compact helpdesk discovery controls

**Files:**
- Create: `app/helpdesk/components/HelpdeskFilters.tsx`
- Create: `app/helpdesk/components/ProgressiveTopics.tsx`
- Create: `app/helpdesk/components/HelpdeskDiscovery.test.tsx`
- Modify: `app/helpdesk/components/HelpdeskHome.tsx`
- Modify: `app/helpdesk/helpdesk.module.css`

**Interfaces:**
- `HelpdeskFilters({ tags, articles, selectedSlugs, onChange })` renders eight popular tags, selected removable filters, and a two-character searchable picker capped at twelve results.
- `ProgressiveTopics({ topics, pageSize = 5 })` renders five topics initially and five more per activation.
- `summarizeArticleTags(tags)` returns the first three tags plus the remaining count for article rows.

- [ ] **Step 1: Write failing discovery tests**

Cover these behaviors in `HelpdeskDiscovery.test.tsx`: eight popular tags appear, the complete vocabulary does not; More filters opens the search control; one-character searches show guidance; two-character searches return at most twelve matches with counts; selecting and removing tags calls `onChange`; Topics begins with five items and loads five more; article tag summarization returns three tags and `remaining`.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- app/helpdesk/components/HelpdeskDiscovery.test.tsx`

Expected: FAIL because the discovery components do not exist.

- [ ] **Step 3: Implement the discovery components**

Use `useMemo` for published-article tag counts and search results, `useState` for picker/query/topic count, `aria-expanded` and `aria-controls` for disclosures, Escape to close the picker, and an `aria-live="polite"` topic count. Keep selected tags outside the picker.

- [ ] **Step 4: Integrate the compact home layout**

Replace the full tag map and full topic map in `HelpdeskHome.tsx` with the new components. Export `summarizeArticleTags` from `HelpdeskFilters.tsx` and use it to show at most three tags plus `+N`. Change the support panel to a compact utility row and keep search before filters.

- [ ] **Step 5: Add preserved-theme home styles**

Use a shorter hero, compact search panel, restrained utility row, anchored filter panel, selected chips, two-line topic descriptions, divider-led article rows, and responsive one-column behavior. Use existing color values `#050505`, `#101013`, `#ffffff`, and `#ff1493`.

- [ ] **Step 6: Verify GREEN and commit**

Run: `npm test -- app/helpdesk/components/HelpdeskDiscovery.test.tsx && npx tsc --noEmit`

Expected: all discovery tests PASS and TypeScript exits 0.

Commit: `git commit -m "Polish helpdesk discovery controls"`

---

### Task 2: Article reading bar and scrollspy

**Files:**
- Create: `app/helpdesk/components/ArticleReadingBar.tsx`
- Create: `app/helpdesk/components/ArticleNavigation.tsx`
- Create: `app/helpdesk/components/ArticleNavigation.test.tsx`
- Modify: `app/helpdesk/articles/[slug]/page.tsx`
- Modify: `app/helpdesk/helpdesk.module.css`

**Interfaces:**
- `ArticleReadingBar({ title, introductionId })` observes the introduction and shows a compact bar only after it leaves the viewport.
- `ArticleNavigation({ headings })` renders ordinary anchors plus active-section state, a desktop viewport-constrained list, and a mobile disclosure.
- `resolveActiveHeading(headings, threshold)` returns the last heading at or above the reading threshold, falling back to the first heading.

- [ ] **Step 1: Write failing reading-navigation tests**

Cover: reading bar hidden while the introduction intersects and visible afterward; active heading resolution chooses the last crossed heading; the first heading is the initial fallback; the navigation exposes a closed disclosure and opens/closes accessibly; selecting an entry updates the hash and closes the disclosure.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- app/helpdesk/components/ArticleNavigation.test.tsx`

Expected: FAIL because the article reading components do not exist.

- [ ] **Step 3: Implement observer-driven reading state**

Use `IntersectionObserver` with cleanup in both components. Observe `#article-introduction` for the reading bar. Observe article heading IDs with a root margin accounting for the site header and reading bar. Update one active ID per callback and keep its navigation link visible by changing only the navigation container's `scrollTop`.

- [ ] **Step 4: Implement accessible navigation actions**

On selection, close the mobile disclosure, call `history.replaceState` with the heading hash, scroll with `smooth` unless reduced motion is requested, and focus the target heading with `preventScroll`. Retain ordinary `href="#id"` anchors as the no-JavaScript fallback.

- [ ] **Step 5: Integrate the article components**

Give the article introduction `id="article-introduction"`, render `ArticleReadingBar` after the site header, replace the static TOC with `ArticleNavigation`, and retain server-side heading extraction.

- [ ] **Step 6: Correct article hierarchy and global-header leakage**

Reset `.articleHeader` to `position: static`, remove inherited global-header background/border/backdrop/padding, cap the title at 56px desktop and 40px mobile, add the compact reading bar, constrain the TOC to the viewport, and tighten prose/related-row spacing.

- [ ] **Step 7: Verify GREEN and commit**

Run: `npm test -- app/helpdesk/components/ArticleNavigation.test.tsx && npm test && npx tsc --noEmit`

Expected: all article tests and the full suite PASS; TypeScript exits 0.

Commit: `git commit -m "Polish helpdesk article navigation"`

---

### Task 3: Production and visual verification

**Files:**
- Modify only files from Tasks 1–2 if verification reveals a defect.

**Interfaces:**
- Consumes the complete helpdesk home and article polish.
- Produces verified desktop, tablet, and mobile behavior.

- [ ] **Step 1: Run complete automated verification**

Run: `npm test && npx tsc --noEmit && npm run build`

Expected: all tests PASS, TypeScript exits 0, and Next.js completes the optimized production build.

- [ ] **Step 2: Verify the home page visually**

In the Codex browser, verify at desktop, tablet, and mobile widths: search appears in the first viewport; eight popular tags and More filters are compact; tag search waits for two characters and caps results; selected chips remain visible; topics load five at a time; article rows show no more than three tags.

- [ ] **Step 3: Verify the article page visually**

Verify the provided YouTube article at initial and scrolled positions: the full header scrolls normally; the compact reading bar contains only the back link and title; the active TOC entry tracks sections; long TOCs scroll internally; mobile disclosure closes after selection; no sticky layer obscures content.

- [ ] **Step 4: Run the design-taste pre-flight**

Confirm theme, accent, radius, typography, button contrast, focus states, reduced motion, mobile collapse, no new decorative UI, and preserved navigation/URLs.

- [ ] **Step 5: Commit verification-driven corrections**

If corrections were necessary, commit them with `git commit -m "Finish helpdesk visual polish"`. Do not create an empty commit.
