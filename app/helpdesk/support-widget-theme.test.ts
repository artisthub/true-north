import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const globals = readFileSync(resolve(root, 'app/globals.css'), 'utf8');
const widget = readFileSync(resolve(root, 'app/helpdesk/SupportWidget.tsx'), 'utf8');

const expectedTheme = {
  '--support-rag-accent': '#4a1536',
  '--support-rag-accent-contrast': '#ff9bd2',
  '--support-rag-surface': '#101013',
  '--support-rag-canvas': '#070709',
  '--support-rag-text': '#ffffff',
  '--support-rag-muted-text': '#b9b9c2',
  '--support-rag-border': '#3a3a42',
  '--support-rag-danger': '#ff7a7a',
  '--support-rag-font-family':
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  '--support-rag-font-size': '14px',
  '--support-rag-radius': '14px',
  '--support-rag-message-radius': '14px',
  '--support-rag-input-radius': '999px',
  '--support-rag-panel-shadow': '0 30px 80px rgb(0 0 0 / 48%)',
  '--support-rag-header-padding': '16px 18px',
  '--support-rag-content-padding': '18px 16px 24px',
  '--support-rag-message-gap': '14px',
  '--support-rag-message-padding': '10px 12px',
  '--support-rag-composer-padding': '10px 12px 12px',
};

describe('support widget theme', () => {
  it('defines every documented True North theme property on the host root', () => {
    for (const [property, value] of Object.entries(expectedTheme)) {
      expect(globals).toContain(`${property}: ${value};`);
    }
  });

  it('does not inject an iframe stylesheet or target widget internals', () => {
    expect(widget).not.toContain('data-style-url');
    expect(widget).not.toContain('support-rag-host');
    expect(widget).not.toContain('useEffect');
    expect(existsSync(resolve(root, 'public/support-widget.css'))).toBe(false);
  });
});
