import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { HelpdeskArticle, HelpdeskTag, HelpdeskTopic } from '@/lib/helpdesk';
import HelpdeskFilters, { summarizeArticleTags } from './HelpdeskFilters';
import ProgressiveTopics from './ProgressiveTopics';

const tags: HelpdeskTag[] = Array.from({ length: 16 }, (_, index) => ({
  id: `tag-${index + 1}`,
  name: `Platform ${String(index + 1).padStart(2, '0')}`,
  slug: `platform-${index + 1}`,
}));

const articles = tags.map((tag, index) => ({
  id: `article-${index + 1}`,
  title: `Article ${index + 1}`,
  tags: index < 4 ? [tag, tags[0]] : [tag],
})) as HelpdeskArticle[];

const topics = Array.from({ length: 12 }, (_, index) => ({
  id: `topic-${index + 1}`,
  title: `Topic ${index + 1}`,
  slug: `topic-${index + 1}`,
  description: `Description ${index + 1}`,
})) as HelpdeskTopic[];

describe('HelpdeskFilters', () => {
  it('shows eight popular tags without rendering the full vocabulary', () => {
    render(<HelpdeskFilters articles={articles} onChange={() => undefined} selectedSlugs={[]} tags={tags} />);

    expect(screen.getAllByTestId('popular-tag')).toHaveLength(8);
    expect(screen.queryByText('Platform 16')).not.toBeInTheDocument();
  });

  it('searches after two characters and caps results at twelve', () => {
    render(<HelpdeskFilters articles={articles} onChange={() => undefined} selectedSlugs={[]} tags={tags} />);
    fireEvent.click(screen.getByRole('button', { name: 'More filters' }));
    const input = screen.getByRole('searchbox', { name: 'Search article tags' });

    fireEvent.change(input, { target: { value: 'p' } });
    expect(screen.getByText('Type at least 2 characters to search tags.')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'pl' } });
    expect(screen.getAllByTestId('tag-search-result')).toHaveLength(12);
  });

  it('selects and removes a tag through the real control callbacks', () => {
    const onChange = vi.fn();
    const { rerender } = render(<HelpdeskFilters articles={articles} onChange={onChange} selectedSlugs={[]} tags={tags} />);

    fireEvent.click(screen.getAllByTestId('popular-tag')[0]);
    expect(onChange).toHaveBeenCalledWith(['platform-1']);

    rerender(<HelpdeskFilters articles={articles} onChange={onChange} selectedSlugs={['platform-1']} tags={tags} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Platform 01 filter' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});

describe('ProgressiveTopics', () => {
  it('loads topics five at a time', () => {
    render(<ProgressiveTopics topics={topics} />);

    expect(screen.getAllByTestId('topic-link')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: 'Load 5 more topics' }));
    expect(screen.getAllByTestId('topic-link')).toHaveLength(10);
  });
});

describe('summarizeArticleTags', () => {
  it('returns three visible tags and the remaining count', () => {
    expect(summarizeArticleTags(tags.slice(0, 6))).toEqual({ visible: tags.slice(0, 3), remaining: 3 });
  });
});
