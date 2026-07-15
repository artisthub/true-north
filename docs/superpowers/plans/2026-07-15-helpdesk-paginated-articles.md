# Helpdesk Paginated Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add performant server-paginated All articles browsing while keeping the curated Featured view.

**Architecture:** Next.js parses URL state on the server and asks a Supabase data function for one bounded page of summary rows. Client controls only update URL parameters; Supabase handles filtering, counting, ordering, and ranges. Detail routes use a separate select that is the only public query containing article Markdown.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Supabase/PostgREST, PostgreSQL full-text search, Vitest, Testing Library, CSS Modules.

## Global Constraints

- All view uses exactly 12 articles per page.
- Index and topic list queries must omit `body_markdown`.
- Full article bodies load only on individual article routes.
- Preserve the existing True North theme and repeated-tag URL format.
- Do not stage or modify `articles-export/`.

---

### Task 1: Pagination and query contracts

**Files:**
- Modify: `lib/helpdesk-query.test.ts`
- Modify: `lib/helpdesk-query.ts`
- Create: `lib/helpdesk-pagination.test.ts`
- Create: `lib/helpdesk-pagination.ts`

**Interfaces:**
- Produces: `PUBLIC_ARTICLE_SUMMARY_SELECT`, `PUBLIC_ARTICLE_DETAIL_SELECT`, `parseHelpdeskPage(value)`, and `getHelpdeskPageWindow(total, requestedPage, pageSize)`.

- [ ] Write tests proving the summary select omits `body_markdown`, detail includes it, malformed pages become 1, excessive pages clamp, and page 2 at size 12 maps to range 12–23.
- [ ] Run the focused tests and confirm failures are caused by missing exports.
- [ ] Implement the smallest pure helpers and split selects.
- [ ] Run focused tests and confirm they pass.
- [ ] Commit the query contracts.

### Task 2: Bounded Supabase data access

**Files:**
- Modify: `lib/helpdesk.ts`
- Modify: `supabase/migrations/<generated>_add_helpdesk_search_index.sql`

**Interfaces:**
- Produces: `getPublishedHelpdeskIndex(options)` returning `{ topics, tags, articles, total, page, pageCount }` and optimized single-topic/single-article loaders.

- [ ] Create a migration with `supabase migration new add_helpdesk_search_index`.
- [ ] Add a stored `search_vector` generated from weighted title and excerpt plus a GIN index.
- [ ] Add failing data-layer/query-shape tests for 12-row ranges and summary-only selects.
- [ ] Implement published summary queries with `select(..., { count: 'exact' })`, `range(from, to)`, full-text search, and embedded tag filtering.
- [ ] Query tag counts as nested aggregates and normalize them into `HelpdeskTag.article_count`.
- [ ] Replace full-collection topic and article lookups with bounded direct queries.
- [ ] Run focused tests and commit.

### Task 3: URL-backed All articles controls

**Files:**
- Modify: `app/helpdesk/page.tsx`
- Modify: `app/helpdesk/components/HelpdeskHome.tsx`
- Create: `app/helpdesk/components/ArticlePagination.tsx`
- Create: `app/helpdesk/components/ArticlePagination.test.tsx`
- Modify: `app/helpdesk/components/HelpdeskFilters.tsx`
- Modify: `app/helpdesk/components/HelpdeskDiscovery.test.tsx`

**Interfaces:**
- Consumes: bounded index data and canonical URL parameters.
- Produces: accessible `Featured | All articles` switch and Previous/page/Next navigation.

- [ ] Write failing component tests for the view switch, page links, disabled edge controls, and parameter preservation.
- [ ] Confirm focused tests fail for missing controls.
- [ ] Parse `view`, `page`, `q`, and `tag` in the server route and pass bounded data to the client.
- [ ] Implement URL helpers that reset page for changed search/tags/view and preserve filters during paging.
- [ ] Debounce search URL updates and render the server-provided article page without client filtering.
- [ ] Make filters use server-provided aggregate tag counts.
- [ ] Run focused tests and commit.

### Task 4: Styling and verification

**Files:**
- Modify: `app/helpdesk/helpdesk.module.css`

**Interfaces:**
- Produces: theme-consistent segmented switch and compact responsive pagination.

- [ ] Add focused CSS for the switch, result summary, and pagination at desktop/mobile widths.
- [ ] Run `npm test` and require all tests to pass.
- [ ] Run `npx tsc --noEmit` and require exit code 0.
- [ ] Run `npm run build` and require a successful production build.
- [ ] Verify Featured, All page navigation, search, tags, and mobile layout in the local in-app browser.
- [ ] Confirm the rendered index contains no more than 12 article cards in All view and commit.

