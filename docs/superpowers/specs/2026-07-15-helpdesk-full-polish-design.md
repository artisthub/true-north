# Helpdesk Full Polish Design

## Goal

Make the True North helpdesk faster to scan, search, and read while preserving its black-and-pink theme, routes, content model, publishing behavior, and primary navigation.

## Design direction

This is a targeted structural evolution of a support knowledge base for artists and labels. The interface remains dark, calm, and recognizably True North, with pink reserved for actions, focus, selected filters, and current reading position.

Design settings are variance 5, motion 3, and density 5. Typography uses the existing sans-serif system with a tighter product-scale hierarchy. Cards, pills, and decorative treatments are reduced when spacing or dividers communicate the same structure more clearly.

## Helpdesk home

The hero becomes substantially shorter so search appears in the first viewport on common desktop and mobile sizes. The support-forms route remains visible as a quiet utility action instead of a large competing panel.

Search remains the primary entry point. Search results report a clear count and replace the featured state while a query is active.

The page shows six to eight popular tags based on the number of published articles using each tag. A More filters control opens an anchored searchable picker. The picker does not render the complete tag vocabulary at once: it begins searching after two characters and returns a bounded result set with published article counts. Selected tags stay visible outside the picker as removable chips, remain available when the picker is closed, and can be combined. On narrow screens, the picker expands inline below its trigger rather than opening a modal.

The Topics section shows five topics initially and loads five more per activation. Topic descriptions are limited visually to two lines. Filtering articles does not alter the topic-loading state.

Article results use a denser row treatment with topic, updated date, title, and excerpt. Each result shows at most three tags and a `+N` summary for remaining tags. Empty search and filter states explain how to recover and retain a direct path to support forms.

## Article page

The article introduction uses normal document flow. The global `header` rule currently makes the internal article header sticky; the polished implementation explicitly scopes or resets that behavior.

The full article title is capped at 56px on desktop and 40px on mobile. The introduction retains topic, updated date, excerpt, and tags only before the reader scrolls into the article body.

After the introduction leaves the viewport, a compact sticky reading bar appears below the site navigation. It contains only a Helpdesk back link and a one-line shortened article title. It does not repeat the topic, excerpt, date, or tags. Its transition communicates state, lasts no more than 200ms, and becomes immediate when reduced motion is requested.

Body prose remains within 65–75 characters per line, with smaller heading steps, predictable spacing, visible focus states, and corrected anchor offsets. Related articles and the support call to action use the same restrained row and button vocabulary as the helpdesk home.

## Article navigation and scrollspy

The static table of contents becomes an isolated client component driven by `IntersectionObserver`. It receives the extracted heading identifiers and labels from the server-rendered article page.

Exactly one heading is active while reading. The observer accounts for the sticky site header and compact reading bar. When several headings intersect, the active heading is the last heading that has crossed the reading threshold. Near the bottom of the document, the final section becomes active even when it is too short to cross the normal threshold.

The desktop navigation is sticky, constrained to the available viewport height, and internally scrollable. H2 and H3 hierarchy is expressed through type and indentation. The active entry uses a restrained pink edge and higher-contrast text; inactive entries remain neutral. When the active entry leaves the navigation viewport, it scrolls into view without moving the document.

Selecting an entry scrolls to its heading with the correct offset and updates the URL hash without a page jump. Smooth scrolling is disabled when reduced motion is requested. Active state resets when navigating to another article.

On narrow screens, article navigation becomes an inline disclosure labeled On this page and displays the current section in its closed state. Selecting an entry closes the disclosure and moves focus predictably back into the reading flow.

## Responsive behavior

At widths below 860px, the home content becomes one column, the topic list uses progressive loading, and tag filtering remains compact. At widths below 620px, primary actions remain on one line when possible, headings use fixed product-scale sizes, article navigation becomes a disclosure, and no sticky element obscures article content.

## Accessibility and states

All disclosures expose `aria-expanded` and `aria-controls`. Tag search has an explicit label, keyboard-operable results, selected state, an empty result message, and Escape-to-close behavior. Topic loading preserves focus and announces the increased result count. Scrollspy navigation works without JavaScript as ordinary anchor links.

Focus indicators meet contrast requirements. Text and placeholders meet WCAG AA contrast. Motion has reduced-motion fallbacks.

## Testing and verification

Component tests cover popular-tag selection, delayed tag searching, bounded tag results, selected-chip removal, independent topic loading, long-tag summaries, reading-bar visibility, scrollspy active-section selection, final-section behavior, and mobile disclosure state.

Integration verification covers search and combined tag filtering, URL hash behavior, direct article links, topic links, public empty states, TypeScript, lint, and the production build. Visual browser verification covers the helpdesk index and an article at desktop, tablet, and mobile widths, including scrolled states.

## Scope

This work does not change URLs, slugs, database schema, published-content rules, primary navigation labels, support-form flows, article copy, brand logo, or the black-and-pink theme.
