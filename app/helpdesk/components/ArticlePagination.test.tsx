import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ArticlePagination, { buildHelpdeskHref } from './ArticlePagination';

describe('buildHelpdeskHref', () => {
  it('preserves filters while changing the page', () => {
    expect(buildHelpdeskHref('/helpdesk', 'view=all&tag=clients&q=royalties&page=1', { page: 2 }))
      .toBe('/helpdesk?view=all&tag=clients&q=royalties&page=2');
  });

  it('resets page when changing view', () => {
    expect(buildHelpdeskHref('/helpdesk', 'view=all&tag=clients&page=4', { view: 'featured', page: null }))
      .toBe('/helpdesk?tag=clients');
  });
});

describe('ArticlePagination', () => {
  it('renders nearby pages and disables the previous edge', () => {
    render(<ArticlePagination page={1} pageCount={5} pathname="/helpdesk" search="view=all&tag=clients" />);

    expect(screen.getByText('Previous')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'href',
      '/helpdesk?view=all&tag=clients&page=2',
    );
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute(
      'href',
      '/helpdesk?view=all&tag=clients&page=2',
    );
  });
});
