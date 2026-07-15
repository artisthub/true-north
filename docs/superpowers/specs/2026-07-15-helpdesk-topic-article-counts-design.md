# Helpdesk Topic Article Counts Design

## Goal

Show the number of published articles in every topic row on the public helpdesk sidebar without loading article content or adding a second database round trip.

## Data design

The published-topic query embeds an aggregate count of related `kb_articles` rows and filters the embedded relationship to `status = 'published'`. Topic rows are normalized into the existing `HelpdeskTopic` shape with an `article_count` number. The relationship payload is discarded before data reaches the component.

This remains one PostgREST query: topic fields plus one integer aggregate per topic. Draft and archived articles never contribute to the public count.

## Interface design

Each topic link gains a compact title row. The topic name stays left aligned and the count sits on the right in subdued text. Copy uses `1 article` for one and `<n> articles` for every other value, including zero. The description remains below and retains its current two-line clamp.

## Verification

- Component tests cover plural and singular count copy.
- Query normalization tests cover the embedded count shape.
- The full test suite, TypeScript check, production build, and local browser view must pass.

