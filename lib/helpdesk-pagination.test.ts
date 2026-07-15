import { describe, expect, it } from 'vitest';
import { getHelpdeskPageWindow, parseHelpdeskPage } from './helpdesk-pagination';

describe('parseHelpdeskPage', () => {
  it('normalizes malformed pages to one', () => {
    expect(parseHelpdeskPage(undefined)).toBe(1);
    expect(parseHelpdeskPage('nope')).toBe(1);
    expect(parseHelpdeskPage('-3')).toBe(1);
  });
});

describe('getHelpdeskPageWindow', () => {
  it('maps page two to the second twelve-row database range', () => {
    expect(getHelpdeskPageWindow(30, 2, 12)).toEqual({
      from: 12,
      to: 23,
      page: 2,
      pageCount: 3,
    });
  });

  it('clamps an excessive page to the final page', () => {
    expect(getHelpdeskPageWindow(25, 99, 12)).toEqual({
      from: 24,
      to: 35,
      page: 3,
      pageCount: 3,
    });
  });
});
