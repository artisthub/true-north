# Helpdesk Paginated Articles Design

## Goal

Add an obvious way to browse every published helpdesk article without allowing the index payload or rendered list to grow with the knowledge base.

## User experience

- Place a compact `Featured | All articles` view switch above the article list.
- Keep `Featured` as the default curated view.
- Make `All articles` URL-addressable with `?view=all&page=N` and show 12 articles per page.
- Render Previous, nearby page numbers, and Next. Do not use infinite scroll.
- Preserve selected tags and the search query when changing pages.
- Reset to page 1 when the search query, selected tags, or view changes.
- Clamp malformed or out-of-range page values to the nearest valid page.
- Keep the existing black, white, and pink True North visual system.

## Performance contract

- Pagination happens in Supabase/PostgREST with `range()`, not by slicing a complete article collection in React.
- The All view fetches no more than 12 article summaries per request and requests an exact result count for pagination.
- Index and topic-list queries select card fields only. They never select `body_markdown`.
- A full article body is fetched only by its individual article route.
- Tag discovery fetches tag rows with aggregate assignment counts rather than loading articles to compute popularity.
- Search is URL-backed and evaluated by the database against title and excerpt. A stored `tsvector` with a GIN index keeps search cost bounded as content grows.
- Existing status and published-topic indexes remain the ordering/filtering foundation; add a migration for the search vector and its index.

## Data flow

The server page parses `view`, `page`, `q`, and repeated `tag` parameters. It requests topics, tag summaries, and the requested article page in parallel. The data layer builds one summary query, applies published/search/tag constraints, orders by featured state and update time, and uses a zero-based PostgREST range. It returns `{ articles, total, page, pageCount }`.

The client home component owns only interaction and URL updates. Search input changes are debounced before replacing the URL. View, page, and tag controls preserve unrelated helpdesk parameters. The server rerenders the bounded result set.

## Query boundaries

- `PUBLIC_ARTICLE_SUMMARY_SELECT` contains identifiers, dates, title, slug, excerpt, topic id, featured state, topic metadata, and tags.
- `PUBLIC_ARTICLE_DETAIL_SELECT` additionally contains `body_markdown` and is used only for a single-slug lookup.
- Tag filtering keeps OR semantics for multiple selected tags, matching the current interface.
- Search covers title and excerpt, which are the fields visible in search results.

## Error and edge handling

- Missing Supabase configuration returns empty, stable page data.
- Invalid pages normalize to page 1; pages beyond the result set normalize to the last page.
- Empty filtered results show the existing helpdesk empty state and no pagination.
- Database errors are logged server-side and produce a stable empty result rather than a broken page.

## Verification

- Unit tests cover page parsing/clamping, range calculation, URL parameter preservation, and 12-row page boundaries.
- Query-shape tests prove summary selects omit `body_markdown` and detail selects include it.
- Component tests cover the view switch and pagination controls.
- Run the complete Vitest suite, TypeScript check, production build, and desktop/mobile browser checks.

