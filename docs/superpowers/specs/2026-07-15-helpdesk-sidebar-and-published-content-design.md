# Helpdesk Sidebar and Published Content Design

## Goal

Keep the admin helpdesk navigation compact while ensuring published topics and articles load on the public helpdesk.

## Admin sidebar

The Topics and Articles panels remain separate and keep their existing create and selection actions. Each list starts in a compact state tall enough to reveal approximately one and a half entries. A bottom gradient indicates that additional entries are available.

Each panel has its own Expand control. Expanding increases the list viewport to approximately three or four entries and enables internal vertical scrolling. The control changes to Collapse and restores the compact height when activated. The interaction is keyboard accessible and exposes its expanded state to assistive technology. On narrow screens, the panels remain full width but retain the compact and expanded list behavior.

## Public content fix

The public data loader currently requests the `kb_article_tags` relationship as part of the `kb_topics` query. That relationship belongs to `kb_articles`, so Supabase rejects the query and the shared error handler returns empty topic, article, and tag arrays.

The relationship selection will move to the `kb_articles` query. Published topic filtering and published article filtering remain unchanged. Article tag records will continue to be normalized into each article's `tags` array, and the set of public filters will continue to be derived from those normalized tags.

## Testing

Regression coverage will verify that the public loader requests tag relationships from articles rather than topics and returns published content with normalized tags. UI coverage will verify the compact default state and independent accessible expand/collapse controls where the project's available test tooling supports it. Type checking and a production build will provide integration verification.

## Scope

This change does not alter database tables, publishing rules, editor forms, public helpdesk styling, or article/topic URLs.
