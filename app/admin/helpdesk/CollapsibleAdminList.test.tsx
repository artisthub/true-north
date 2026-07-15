import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CollapsibleAdminList from './CollapsibleAdminList';

describe('CollapsibleAdminList', () => {
  it('starts compact and expands accessibly', () => {
    render(
      <CollapsibleAdminList itemCount={3} label="Topics">
        <button>One</button>
        <button>Two</button>
        <button>Three</button>
      </CollapsibleAdminList>,
    );

    const control = screen.getByRole('button', { name: 'Expand Topics' });
    expect(control).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('collapsible-admin-list')).toHaveAttribute('data-expanded', 'false');

    fireEvent.click(control);

    expect(screen.getByRole('button', { name: 'Collapse Topics' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('collapsible-admin-list')).toHaveAttribute('data-expanded', 'true');
  });

  it('omits the fade and control when the list has one item', () => {
    render(
      <CollapsibleAdminList itemCount={1} label="Articles">
        <button>Only article</button>
      </CollapsibleAdminList>,
    );

    expect(screen.queryByRole('button', { name: /Articles/ })).not.toBeInTheDocument();
    expect(screen.getByTestId('collapsible-admin-list')).toHaveAttribute('data-overflowing', 'false');
  });
});
