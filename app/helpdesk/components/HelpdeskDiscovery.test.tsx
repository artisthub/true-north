import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { HelpdeskTag, HelpdeskTopic } from '@/lib/helpdesk';
import HelpdeskFilters, { summarizeArticleTags } from './HelpdeskFilters';
import ProgressiveTopics from './ProgressiveTopics';

const tags: HelpdeskTag[] = Array.from({ length: 16 }, (_, index) => ({
  id: `tag-${index + 1}`,
  name: `Platform ${String(index + 1).padStart(2, '0')}`,
  slug: `platform-${index + 1}`,
  article_count: index === 1 ? 99 : index,
}));

const topics = Array.from({ length: 12 }, (_, index) => ({
  id: `topic-${index + 1}`,
  title: `Topic ${index + 1}`,
  slug: `topic-${index + 1}`,
  description: `Description ${index + 1}`,
  article_count: index === 0 ? 1 : 5,
})) as HelpdeskTopic[];

describe('HelpdeskFilters', () => {
  it('shows eight popular tags without rendering the full vocabulary', () => {
    render(<HelpdeskFilters onChange={() => undefined} selectedSlugs={[]} tags={tags} />);

    expect(screen.getAllByTestId('popular-tag')).toHaveLength(8);
    expect(screen.getAllByTestId('popular-tag')[0]).toHaveTextContent('Platform 02');
    expect(screen.queryByText('Platform 09')).not.toBeInTheDocument();
  });

  it('searches after two characters and caps results at twelve', () => {
    render(<HelpdeskFilters onChange={() => undefined} selectedSlugs={[]} tags={tags} />);
    fireEvent.click(screen.getByRole('button', { name: 'More filters' }));
    const input = screen.getByRole('searchbox', { name: 'Search article tags' });

    fireEvent.change(input, { target: { value: 'p' } });
    expect(screen.getByText('Type at least 2 characters to search tags.')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'pl' } });
    expect(screen.getAllByTestId('tag-search-result')).toHaveLength(12);
  });

  it('selects and removes a tag through the real control callbacks', () => {
    const onChange = vi.fn();
    const { rerender } = render(<HelpdeskFilters onChange={onChange} selectedSlugs={[]} tags={tags} />);

    fireEvent.click(screen.getAllByTestId('popular-tag')[0]);
    expect(onChange).toHaveBeenCalledWith(['platform-2']);

    rerender(<HelpdeskFilters onChange={onChange} selectedSlugs={['platform-2']} tags={tags} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Platform 02 filter' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});

describe('ProgressiveTopics', () => {
  it('loads topics five at a time', () => {
    render(<ProgressiveTopics topics={topics} />);

    expect(screen.getAllByTestId('topic-link')).toHaveLength(5);
    expect(screen.getByText('1 article')).toBeInTheDocument();
    expect(screen.getAllByText('5 articles')).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: 'Load 5 more topics' }));
    expect(screen.getAllByTestId('topic-link')).toHaveLength(10);
  });
});

describe('summarizeArticleTags', () => {
  it('returns three visible tags and the remaining count', () => {
    expect(summarizeArticleTags(tags.slice(0, 6))).toEqual({ visible: tags.slice(0, 3), remaining: 3 });
  });
});
