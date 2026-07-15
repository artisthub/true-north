import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArticleNavigation, { resolveActiveHeading } from './ArticleNavigation';
import ArticleReadingBar from './ArticleReadingBar';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

class TestIntersectionObserver {
  static instances: TestIntersectionObserver[] = [];
  callback: ObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '0px';
  thresholds = [0];
  options?: IntersectionObserverInit;

  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    TestIntersectionObserver.instances.push(this);
  }

  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries);
  }
}

const headings = [
  { id: 'overview', text: 'Overview', level: 2 as const },
  { id: 'eligibility', text: 'Eligibility', level: 2 as const },
  { id: 'appeals', text: 'Appeals', level: 3 as const },
];

beforeEach(() => {
  TestIntersectionObserver.instances = [];
  vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  Element.prototype.scrollIntoView = vi.fn();
  window.history.replaceState({}, '', '/helpdesk/articles/example');
});

describe('ArticleReadingBar', () => {
  it('appears only after the article introduction leaves the viewport', () => {
    const introduction = document.createElement('div');
    introduction.id = 'article-introduction';
    document.body.appendChild(introduction);
    render(<ArticleReadingBar introductionId="article-introduction" title="A very long article title" />);

    expect(screen.queryByText('A very long article title')).not.toBeInTheDocument();
    act(() => TestIntersectionObserver.instances[0].trigger([{ isIntersecting: false, target: introduction }]));
    expect(screen.getByText('A very long article title')).toBeInTheDocument();
  });
});

describe('resolveActiveHeading', () => {
  it('selects the last heading that crossed the reading threshold', () => {
    expect(resolveActiveHeading([{ id: 'overview', top: -20 }, { id: 'eligibility', top: 120 }, { id: 'appeals', top: 420 }], 148)).toBe('eligibility');
  });

  it('falls back to the first heading before reading begins', () => {
    expect(resolveActiveHeading([{ id: 'overview', top: 300 }, { id: 'eligibility', top: 600 }], 148)).toBe('overview');
  });
});

describe('ArticleNavigation', () => {
  it('observes the full reading viewport so fast scrolling cannot skip sections', () => {
    headings.forEach((heading) => {
      const element = document.createElement('h2');
      element.id = heading.id;
      document.body.appendChild(element);
    });
    render(<ArticleNavigation headings={headings} />);
    expect(TestIntersectionObserver.instances[0].options?.rootMargin).toBe('-148px 0px 0px 0px');
  });

  it('opens accessibly and closes after selecting a section', () => {
    headings.forEach((heading) => {
      const element = document.createElement(heading.level === 2 ? 'h2' : 'h3');
      element.id = heading.id;
      document.body.appendChild(element);
    });
    render(<ArticleNavigation headings={headings} />);

    const disclosure = screen.getByRole('button', { name: 'On this page' });
    expect(disclosure).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(disclosure);
    expect(disclosure).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('link', { name: 'Eligibility' }));
    expect(disclosure).toHaveAttribute('aria-expanded', 'false');
    expect(window.location.hash).toBe('#eligibility');
  });
});
